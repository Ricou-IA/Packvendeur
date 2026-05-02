import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { verifyDossierAccess } from "../_shared/auth.ts";
import { getOrUploadFileUri } from "../_shared/gemini-files.ts";

/**
 * pv-run-extraction — server-side orchestrator for the Pack Vendeur
 * extraction pipeline. Replaces the old client-side orchestration in
 * useAnalysis.js so that refreshing the page, closing the tab, or a
 * browser fetch timeout NEVER loses the extraction results.
 *
 * Flow:
 *  1. Client POSTs { dossier_id } after payment succeeds.
 *  2. Handler verifies stripe_payment_status === 'paid'.
 *  3. Handler enforces idempotency (no re-trigger if already analyzing/done).
 *  4. Handler fires runExtraction() via EdgeRuntime.waitUntil() and returns
 *     202 immediately — the client is free to disconnect.
 *  5. runExtraction() downloads docs from storage, calls pv-extract-financial
 *     and pv-extract-diagnostics in parallel, merges, calculates hybrid
 *     charges, runs cross-validation, type-coerces everything, and saves to
 *     pv_dossiers (50+ flat columns + extracted_data JSONB).
 *  6. On success, status → 'pending_validation'. On failure, status reverts
 *     to 'paid' so the client can retry.
 *
 * The client just polls pv_dossiers.status via React Query; when it flips
 * to 'pending_validation', ProcessingStep auto-advances to the Validation step.
 */

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// ANON_KEY is needed for inter-edge-function calls: Supabase's gateway rejects
// the SERVICE_ROLE_KEY as `UNAUTHORIZED_INVALID_JWT_FORMAT` since the new key
// format (sb_secret_*) isn't a parseable JWT. We use ANON_KEY in the Bearer
// header to pass the gateway, then prove access via body.access_token.
//
// Hardcoded fallback because Deno.env.get("SUPABASE_ANON_KEY") returns
// undefined in the current Edge Functions runtime (env var renamed or unset).
// The anon JWT is public — it's already exposed to the browser via VITE_SUPABASE_ANON_KEY.
const ANON_KEY_LEGACY_FALLBACK = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9kc3BjeGdhZmNxeGp6cmFyc3FmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1ODcwNzUsImV4cCI6MjA3OTE2MzA3NX0.DKCg_EwasSi_SNto8D3rC5H7FaShuUra8cGQ6g9Q58g";
// Force the legacy JWT (env var may return a sb_publishable_* opaque key,
// which the gateway rejects as "Invalid JWT" in the inter-EF auth path).
const ANON_KEY = ANON_KEY_LEGACY_FALLBACK;
const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")!;

// ---------- Type coercion helpers (ported from useAnalysis.js) ----------

function toNum(val: unknown): number | null {
  if (val === null || val === undefined || val === "") return null;
  if (typeof val === "number") return Number.isFinite(val) ? val : null;
  const cleaned = String(val).replace(/\s/g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function toDate(val: unknown): string | null {
  if (!val || typeof val !== "string") return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const frMatch = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (frMatch) return `${frMatch[3]}-${frMatch[2]}-${frMatch[1]}`;
  const d = new Date(val);
  if (!isNaN(d.getTime())) return d.toISOString().split("T")[0];
  return null;
}

function toChar1(val: unknown): string | null {
  if (!val || typeof val !== "string") return null;
  const upper = val.trim().toUpperCase();
  if (/^[A-G]$/.test(upper)) return upper;
  const match = val.match(/\b([A-Ga-g])\b/);
  if (match) return match[1].toUpperCase();
  const anyMatch = val.match(/[A-Ga-g]/);
  return anyMatch ? anyMatch[0].toUpperCase() : null;
}

// ---------- Document routing ----------

const PHASE1_TYPES = new Set([
  "pv_ag", "reglement_copropriete", "etat_descriptif_division",
  "appel_fonds", "releve_charges", "annexes_comptables",
  "fiche_synthetique", "carnet_entretien", "taxe_fonciere",
]);

const PHASE2_TYPES = new Set([
  "dpe", "diagnostic_amiante", "diagnostic_plomb", "diagnostic_termites",
  "diagnostic_electricite", "diagnostic_gaz", "diagnostic_erp",
  "diagnostic_mesurage", "audit_energetique", "dtg",
  "plan_pluriannuel", "plan_pluriannuel_travaux",
  "bail", "contrat_assurance",
]);

const SHARED_TYPES = new Set(["fiche_synthetique"]);
const ALL_EXTRACTION_TYPES = new Set([...PHASE1_TYPES, ...PHASE2_TYPES]);

interface DocInput {
  id: string;
  original_filename: string;
  normalized_filename?: string | null;
  document_type: string;
  storage_path: string;
  ai_classification_raw?: unknown;
  gemini_file_uri?: string | null;
  gemini_file_expires_at?: string | null;
}

function routeDocuments(docs: DocInput[]) {
  const phase1Docs: DocInput[] = [];
  const phase2Docs: DocInput[] = [];

  for (const doc of docs) {
    const t = doc.document_type;
    const inP1 = PHASE1_TYPES.has(t);
    const inP2 = PHASE2_TYPES.has(t);
    const isShared = SHARED_TYPES.has(t);

    if (inP1) phase1Docs.push(doc);
    if (inP2) phase2Docs.push(doc);
    if (isShared && !inP1) phase1Docs.push(doc);
    if (isShared && !inP2) phase2Docs.push(doc);
    if (!inP1 && !inP2 && !isShared) {
      console.log(`[pv-run-extraction] Unknown doc type '${t}' for ${doc.original_filename} → phase 1`);
      phase1Docs.push(doc);
    }
  }

  return { phase1Docs, phase2Docs };
}

// ---------- Merge extraction results ----------

interface MetaBlock {
  documents_analyses: unknown[];
  donnees_manquantes: unknown[];
  alertes: string[];
  confiance_globale: number;
}

function emptyMeta(): MetaBlock {
  return { documents_analyses: [], donnees_manquantes: [], alertes: [], confiance_globale: 0 };
}

interface MergedExtraction {
  copropriete: Record<string, unknown>;
  lot: Record<string, unknown>;
  financier: Record<string, unknown>;
  juridique: Record<string, unknown>;
  diagnostics: Record<string, unknown>;
  bail: Record<string, unknown>;
  meta: MetaBlock;
}

function mergeResults(phase1: any, phase2: any): MergedExtraction {
  const meta1 = phase1?.meta || emptyMeta();
  const meta2 = phase2?.meta || emptyMeta();

  // Backfill assurance from phase 2 into copropriete if phase 1 didn't get it
  const copro = phase1?.copropriete || {};
  const assurance = phase2?.assurance || {};
  if (!copro.assurance_multirisque && assurance.compagnie) {
    copro.assurance_multirisque = assurance.compagnie;
  }
  if (!copro.assurance_numero_contrat && assurance.numero_contrat) {
    copro.assurance_numero_contrat = assurance.numero_contrat;
  }

  return {
    copropriete: copro,
    lot: phase1?.lot || {},
    financier: phase1?.financier || {},
    juridique: phase1?.juridique || {},
    diagnostics: phase2?.diagnostics || {},
    bail: phase2?.bail || {},
    meta: {
      documents_analyses: [
        ...(meta1.documents_analyses || []),
        ...(meta2.documents_analyses || []),
      ],
      donnees_manquantes: [
        ...(meta1.donnees_manquantes || []),
        ...(meta2.donnees_manquantes || []),
      ],
      alertes: [
        ...(meta1.alertes || []),
        ...(meta2.alertes || []),
      ],
      confiance_globale: Math.min(
        meta1.confiance_globale || 0,
        meta2.confiance_globale || 0,
      ),
    },
  };
}

/**
 * Build a "table of contents" string from each doc's ai_classification_raw.
 * This is injected into the extractor's prompt so Gemini Pro/Flash knows
 * where to look for each piece of data without having to re-scan all PDFs
 * from scratch. Comes from pv-classify (Flash-Lite, cheap pre-scan).
 *
 * Output looks like:
 *   [1] 03_Compte_Gestion_2024.pdf (type: annexes_comptables)
 *       Résumé : Compte de gestion approuvé en AG du 25/06/2025...
 *       Date : 2024-12-31
 *       Contenus identifiés :
 *         • etat_financier_apres_repartition (page 1) — Annexe 1, créances/dettes
 *         • fonds_travaux_alur_par_lot (page 12) — Annexe 8, ventilation par lot
 *         • soldes_par_coproprietaire (page 14) — Annexe 7, débiteurs
 */
function buildDocumentsToc(docs: DocInput[]): string {
  const lines: string[] = [
    "═══════════════════════════════════════════════════════════════════",
    "TABLE DES MATIÈRES DU DOSSIER (issue du pré-scan classification)",
    "═══════════════════════════════════════════════════════════════════",
    "",
  ];
  let idx = 1;
  for (const doc of docs) {
    const filename = doc.normalized_filename || doc.original_filename;
    lines.push(`[${idx}] ${filename}  —  type: ${doc.document_type}`);

    const raw = doc.ai_classification_raw as any;
    if (raw && typeof raw === "object" && !Array.isArray(raw)) {
      if (raw.title) lines.push(`    Titre : ${raw.title}`);
      if (raw.date) lines.push(`    Date  : ${raw.date}`);
      if (raw.summary) lines.push(`    Résumé: ${raw.summary}`);
      const contents = Array.isArray(raw.contents) ? raw.contents : [];
      if (contents.length > 0) {
        lines.push(`    Contenus identifiés :`);
        for (const c of contents) {
          if (c && typeof c === "object" && c.type) {
            const page = c.page_start ? ` (page ${c.page_start})` : "";
            const desc = c.description ? ` — ${c.description}` : "";
            lines.push(`      • ${c.type}${page}${desc}`);
          }
        }
      }
    }
    lines.push("");
    idx++;
  }

  lines.push("═══════════════════════════════════════════════════════════════════");
  lines.push("UTILISATION DE LA TABLE DES MATIÈRES :");
  lines.push("═══════════════════════════════════════════════════════════════════");
  lines.push("");
  lines.push("Pour chaque champ JSON à remplir :");
  lines.push("  1. Cherche dans la TOC ci-dessus quel(s) content_type(s) est");
  lines.push("     pertinent. Cf. mapping :");
  lines.push("       • fonds_travaux.solde_quote_part_lot ← fonds_travaux_alur_par_lot");
  lines.push("       • syndicat.impayes_charges_global   ← etat_financier_apres_repartition");
  lines.push("                                              OU fiche_synthetique_copropriete");
  lines.push("       • sommes_dues_cedant.*              ← releve_compte_coproprietaire");
  lines.push("                                              OU soldes_par_coproprietaire");
  lines.push("       • historique_charges                ← compte_gestion_general");
  lines.push("                                              OU releve_charges_lot");
  lines.push("       • budget_previsionnel_annuel        ← budget_previsionnel_vote");
  lines.push("       • travaux_a_venir_votes             ← resolution_travaux_avec_calendrier");
  lines.push("                                              + tableau_travaux_142_non_clotures");
  lines.push("");
  lines.push("  2. Si UN content_type matche → va lire la page indiquée du PDF correspondant.");
  lines.push("  3. Si AUCUN content_type ne matche → la donnée n'est PAS dans le dossier :");
  lines.push("     → mets le champ à null,");
  lines.push("     → ajoute une entrée descriptive dans meta.donnees_manquantes,");
  lines.push("     → NE PAS calculer par approximation (tantièmes × budget par exemple)");
  lines.push("       sauf si explicitement autorisé par le prompt.");
  lines.push("");

  return lines.join("\n");
}

function collectDiagnosticsCouverts(docs: DocInput[]): string[] {
  const VALID = new Set([
    "dpe", "diagnostic_amiante", "diagnostic_plomb", "diagnostic_termites",
    "diagnostic_electricite", "diagnostic_gaz", "diagnostic_erp",
    "diagnostic_mesurage", "audit_energetique", "dtg", "plan_pluriannuel",
  ]);

  const all = new Set<string>();
  for (const doc of docs) {
    const raw = doc.ai_classification_raw as any;
    const couverts = (raw && typeof raw === "object" && !Array.isArray(raw))
      ? (raw.diagnostics_couverts || [])
      : [];
    for (const d of couverts) {
      if (VALID.has(d)) all.add(d);
    }
  }
  return Array.from(all);
}

// ---------- Internal calls to the 2 extract edge functions ----------

async function callExtract(
  functionName: "pv-extract-financial" | "pv-extract-diagnostics",
  body: Record<string, unknown>,
  accessToken: string,
): Promise<{ data: any; error: string | null }> {
  try {
    // Bearer = ANON_KEY (the gateway rejects SERVICE_ROLE_KEY in the new
    // sb_secret_* format as "Invalid JWT"). The actual access proof rides in
    // body.access_token, picked up by verifyDossierAccess via extractAccessToken.
    // Header X-Pv-Access-Token is also set as a belt-and-suspenders.
    const bodyWithToken = { ...body, access_token: accessToken };
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ANON_KEY}`,
        "X-Pv-Access-Token": accessToken,
      },
      body: JSON.stringify(bodyWithToken),
    });
    if (!res.ok) {
      const text = await res.text();
      return { data: null, error: `${functionName} returned ${res.status}: ${text.slice(0, 300)}` };
    }
    const json = await res.json();
    return { data: json.data ?? json, error: null };
  } catch (e) {
    return { data: null, error: String(e) };
  }
}

// ---------- The heavy lifting — runs in background ----------

async function runExtraction(dossierId: string): Promise<void> {
  // deno-lint-ignore no-explicit-any
  const supabase: any = createClient(SUPABASE_URL, SERVICE_KEY);

  try {
    // NOTE: status='analyzing' was set atomically by pv_claim_extraction in
    // the handler before this background task started. Setting it again here
    // would just be a redundant UPDATE — and worse, it would touch updated_at
    // which ProcessingStep.jsx uses to compute elapsed time for the resume-
    // after-refresh checklist. The claim already set updated_at correctly.

    // Fetch dossier metadata (lot, address, questionnaire) + all documents
    const { data: dossier, error: dossierErr } = await supabase
      .from("pv_dossiers")
      .select("*")
      .eq("id", dossierId)
      .single();
    if (dossierErr || !dossier) throw new Error(`Dossier ${dossierId} not found`);

    const { data: allDocs, error: docsErr } = await supabase
      .from("pv_documents")
      .select("*")
      .eq("dossier_id", dossierId);
    if (docsErr) throw docsErr;
    if (!allDocs || allDocs.length === 0) throw new Error("No documents found");

    // Keep only classified + extraction-relevant documents
    const relevant = allDocs.filter((d: DocInput) =>
      d.document_type && ALL_EXTRACTION_TYPES.has(d.document_type)
    );
    if (relevant.length === 0) {
      throw new Error("Aucun document financier ou juridique détecté.");
    }

    // Deduplicate by original_filename (same file uploaded to multiple slots)
    const seenFilenames = new Set<string>();
    const uniqueDocs: DocInput[] = [];
    for (const doc of relevant) {
      const key = doc.original_filename;
      if (!seenFilenames.has(key)) {
        seenFilenames.add(key);
        uniqueDocs.push(doc);
      }
    }

    // Resolve Gemini File API URIs for every doc.
    // Most docs already have a fresh URI cached from pv-classify (uploaded
    // during Step 2 of the funnel, ~minutes ago). For those, getOrUploadFileUri
    // reads the cached URI and skips re-upload entirely. Stale or missing URIs
    // trigger a single download-from-storage + upload-to-Gemini round-trip.
    console.log(`[pv-run-extraction] ${dossierId}: resolving Gemini URIs for ${uniqueDocs.length} documents`);
    const uploadStart = Date.now();
    const uriResults = await Promise.all(
      uniqueDocs.map(async (doc) => {
        try {
          const uri = await getOrUploadFileUri(supabase, GEMINI_KEY, {
            id: doc.id,
            storage_path: doc.storage_path,
            original_filename: doc.original_filename,
            normalized_filename: doc.normalized_filename ?? null,
            gemini_file_uri: doc.gemini_file_uri ?? null,
            gemini_file_expires_at: doc.gemini_file_expires_at ?? null,
          });
          return {
            id: doc.id,
            original_filename: doc.original_filename,
            normalized_filename: doc.normalized_filename || doc.original_filename,
            document_type: doc.document_type || "other",
            storage_path: doc.storage_path,
            ai_classification_raw: doc.ai_classification_raw,
            gemini_file_uri: uri,
          } as DocInput;
        } catch (err) {
          console.error(`[pv-run-extraction] ${dossierId}: Failed URI for ${doc.original_filename}:`, err);
          return null;
        }
      }),
    );
    const docsWithFileUri = uriResults.filter((d): d is DocInput => d !== null);

    if (docsWithFileUri.length === 0) {
      throw new Error("Impossible de préparer les documents pour Gemini.");
    }

    console.log(`[pv-run-extraction] ${dossierId}: ${docsWithFileUri.length} URIs ready in ${Date.now() - uploadStart}ms`);

    // Route into phase 1 (financial/legal) and phase 2 (diagnostics/technical)
    const { phase1Docs, phase2Docs } = routeDocuments(docsWithFileUri);
    const diagnosticsCouverts = collectDiagnosticsCouverts(docsWithFileUri);

    console.log(
      `[pv-run-extraction] ${dossierId}: routed ${phase1Docs.length} → financial, ` +
      `${phase2Docs.length} → diagnostics, diagnostics_couverts=[${diagnosticsCouverts.join(",")}]`,
    );

    // Run the 2 extractions in parallel via internal edge function calls.
    // We pass the dossier's access_token so the inner extracts can run their
    // own verifyDossierAccess check (defense in depth).
    const accessToken = dossier.access_token as string;
    const phase1Toc = phase1Docs.length > 0 ? buildDocumentsToc(phase1Docs) : "";
    const phase2Toc = phase2Docs.length > 0 ? buildDocumentsToc(phase2Docs) : "";
    const [finResult, diagResult] = await Promise.all([
      phase1Docs.length > 0
        ? callExtract("pv-extract-financial", {
            documents: phase1Docs,
            documents_toc: phase1Toc,
            dossier_id: dossierId,
            lot_number: dossier.property_lot_number,
            property_address: dossier.property_address,
            property_surface: dossier.property_surface,
            questionnaire_context: dossier.questionnaire_data,
          }, accessToken)
        : Promise.resolve({ data: null, error: null }),
      phase2Docs.length > 0
        ? callExtract("pv-extract-diagnostics", {
            documents: phase2Docs,
            documents_toc: phase2Toc,
            dossier_id: dossierId,
            diagnostics_couverts: diagnosticsCouverts,
          }, accessToken)
        : Promise.resolve({ data: null, error: null }),
    ]);

    // Graceful degradation: if both failed, abort
    if (finResult.error && diagResult.error) {
      throw new Error(`Both extractions failed: ${finResult.error} | ${diagResult.error}`);
    }
    if (finResult.error) {
      console.error(`[pv-run-extraction] ${dossierId}: financial failed, continuing with diagnostics:`, finResult.error);
    }
    if (diagResult.error) {
      console.error(`[pv-run-extraction] ${dossierId}: diagnostics failed, continuing with financial:`, diagResult.error);
    }

    // Normalize (Gemini sometimes wraps the object in an array)
    const fin = Array.isArray(finResult.data) ? finResult.data[0] : finResult.data;
    const diag = Array.isArray(diagResult.data) ? diagResult.data[0] : diagResult.data;

    const merged = mergeResults(fin, diag);

    // Add degradation alerts to meta
    if (finResult.error) {
      merged.meta.alertes.push(`Extraction financière échouée: ${finResult.error}. Données financières incomplètes.`);
    }
    if (diagResult.error) {
      merged.meta.alertes.push(`Extraction diagnostics échouée: ${diagResult.error}. Données diagnostics incomplètes.`);
    }

    // ---------- Helpers to read CSN v3 JSON shape ----------
    // Fallback chain: try the canonical CSN v3 path, then _legacy_compat,
    // then the old top-level key (in case Gemini returned the old shape).
    const fi = merged.financier as any;
    const co = merged.copropriete as any;
    const lo = merged.lot as any;
    const ju = merged.juridique as any;
    const di = merged.diagnostics as any;
    const lc = (fi?._legacy_compat ?? {}) as any;
    const sd = (fi?.sommes_dues_cedant ?? {}) as any;
    const sy = (fi?.syndicat ?? {}) as any;
    const ft = (fi?.fonds_travaux ?? {}) as any;
    const histo = (fi?.historique_charges ?? []) as any[];
    const histoN1 = histo.find((e: any) => e?.exercice_label === "N-1");
    const histoN2 = histo.find((e: any) => e?.exercice_label === "N-2");
    const cd = (co?.copropriete_difficulte ?? {}) as any;
    const ass = (co?.assurance ?? {}) as any;

    // Tri-état → flat number : on prend le montant uniquement si certitude="certain".
    // Si certitude="inconnu" et montant=null, on rend null (pas de fausse certitude DB).
    // Si montant=0 et certitude="certain", on rend 0 (à jour explicitement).
    const pickTri = (field: any): number | null => {
      if (!field || typeof field !== "object") return null;
      if (field.certitude !== "certain") return null;
      return toNum(field.montant);
    };

    // ---------- HYBRID CHARGES CALCULATION ----------
    const tantiemesLot = toNum(lo?.tantiemes_generaux);
    const tantiemesTotaux = toNum(co?.tantiemes_totaux ?? lo?.tantiemes_totaux);
    const budgetAnnuel = toNum(fi?.budget_previsionnel_annuel);
    // CSN v3 utilise charges_courantes_lot_annuel (canonique). _legacy_compat
    // expose charges_courantes_lot pour les vieux JSON.
    const geminiCharges = toNum(fi?.charges_courantes_lot_annuel ?? lc?.charges_courantes_lot);

    let calculatedCharges: number | null = null;
    let chargesDiscrepancyPct: number | null = null;

    if (tantiemesLot && tantiemesTotaux && tantiemesTotaux > 0 && budgetAnnuel) {
      calculatedCharges = Math.round(((tantiemesLot / tantiemesTotaux) * budgetAnnuel) * 100) / 100;
      if (geminiCharges && geminiCharges > 0) {
        const diffPct = Math.round(
          (Math.abs(calculatedCharges - geminiCharges) / calculatedCharges) * 10000,
        ) / 100;
        if (diffPct > 5) chargesDiscrepancyPct = diffPct;
      }
    }

    // Préfère la valeur lue par Gemini si disponible (lecture directe des appels)
    // sinon le calcul théorique tantièmes×budget.
    const finalCharges = geminiCharges ?? calculatedCharges;

    // ---------- CROSS-VALIDATION ALERTS ----------
    const chargesBudgetN1 = toNum(
      histoN1?.budget_reelle ?? histoN1?.budget_appelee ?? lc?.charges_budget_n1,
    );
    if (calculatedCharges && chargesBudgetN1 && chargesBudgetN1 > 0) {
      const diffN1 = Math.abs(calculatedCharges - chargesBudgetN1) / calculatedCharges * 100;
      if (diffN1 > 20) {
        merged.meta.alertes.push(
          `Écart de ${diffN1.toFixed(0)}% entre charges calculées (${calculatedCharges}€) et charges budget N-1 (${chargesBudgetN1}€). Vérifiez les tantièmes.`,
        );
      }
    }

    // CSN v3 : provisions_exigibles devient sommes_dues_cedant.provisions_exigibles_budget+hors_budget
    // Pour la cross-validation, on additionne les 2 (uniquement si certitude=certain).
    const provExBudget = pickTri(sd?.provisions_exigibles_budget) ?? 0;
    const provExHors = pickTri(sd?.provisions_exigibles_hors_budget) ?? 0;
    const provisionsExigibles =
      pickTri(sd?.provisions_exigibles_budget) !== null ||
      pickTri(sd?.provisions_exigibles_hors_budget) !== null
        ? provExBudget + provExHors
        : toNum(lc?.provisions_exigibles);
    if (provisionsExigibles && calculatedCharges && provisionsExigibles > calculatedCharges * 1.1) {
      merged.meta.alertes.push(
        `Provisions exigibles (${provisionsExigibles}€) supérieures aux charges annuelles (${calculatedCharges}€). Vérifiez ce montant.`,
      );
    }

    // ---------- BUILD UPDATE PAYLOAD (CSN v3 mapping) ----------

    const updates: Record<string, unknown> = {
      extracted_data: merged,
      status: "pending_validation",

      // Financial — CSN v3 paths first, _legacy_compat fallback
      // ⚠️ SÉMANTIQUE : fonds_travaux_balance = QUOTE-PART du lot vendu (transmissible
      // à l'acquéreur), PAS le solde total de la copro. Le PED CSN exige la part
      // affectée au lot. Le solde total reste lisible via extracted_data.financier
      // .fonds_travaux.solde_total_copro pour info.
      fonds_travaux_balance: toNum(ft?.solde_quote_part_lot),
      charges_courantes: finalCharges,
      charges_exceptionnelles: toNum(fi?.charges_exceptionnelles_lot),
      impaye_vendeur: pickTri(sd?.charges_impayees_anterieurs) ?? toNum(lc?.impayes_vendeur),
      dette_copro_fournisseurs: toNum(sy?.dette_fournisseurs_global_montant ?? lc?.dette_copro_fournisseurs),
      budget_previsionnel: budgetAnnuel,
      property_surface: toNum(lo?.surface_carrez ?? di?.carrez_surface),
      tantiemes_lot: tantiemesLot != null ? Math.round(tantiemesLot) : null,
      tantiemes_totaux: tantiemesTotaux != null ? Math.round(tantiemesTotaux) : null,
      charges_calculees: calculatedCharges,
      charges_discrepancy_pct: chargesDiscrepancyPct,

      // CSN financial columns (Part I — historique charges)
      charges_budget_n1: toNum(histoN1?.budget_reelle ?? histoN1?.budget_appelee ?? lc?.charges_budget_n1),
      charges_budget_n2: toNum(histoN2?.budget_reelle ?? histoN2?.budget_appelee ?? lc?.charges_budget_n2),
      charges_hors_budget_n1: toNum(histoN1?.hors_budget_reelle ?? histoN1?.hors_budget_appelee ?? lc?.charges_hors_budget_n1),
      charges_hors_budget_n2: toNum(histoN2?.hors_budget_reelle ?? histoN2?.hors_budget_appelee ?? lc?.charges_hors_budget_n2),

      // CSN financial columns (Part I — sommes dues cédant)
      provisions_exigibles: provisionsExigibles,
      avances_reserve: pickTri(sd?.avances_reserve_due) ?? toNum(lc?.avances_reserve),
      provisions_speciales: pickTri(sd?.avances_provisions_speciales_due) ?? toNum(lc?.provisions_speciales),
      emprunt_collectif_solde: pickTri(sd?.emprunt_collectif_capital_du) ?? toNum(lc?.emprunt_collectif_solde),
      emprunt_collectif_echeance: lc?.emprunt_collectif_echeance ?? null,
      cautionnement_solidaire: (sd?.cautionnement_solidaire_existe ?? lc?.cautionnement_solidaire) === true,

      // Fonds travaux
      fonds_travaux_cotisation: toNum(ft?.cotisation_annuelle_lot ?? lc?.fonds_travaux_cotisation_annuelle),
      fonds_travaux_exists: (ft?.existence ?? lc?.fonds_travaux_exists) ?? true,

      // Syndicat — état global (art. L.721-2 2°c)
      impaye_charges_global: toNum(sy?.impayes_charges_global_montant ?? lc?.impaye_charges_global),
      dette_fournisseurs_global: toNum(sy?.dette_fournisseurs_global_montant ?? lc?.dette_fournisseurs_global),

      // Copropriete life columns (Part II-A)
      // CSN v3 : co.assurance.compagnie_nom + co.assurance.police_numero
      assurance_multirisque: ass?.compagnie_nom ?? ass?.courtier_nom ?? co?.assurance_multirisque ?? null,
      assurance_numero_contrat: ass?.police_numero ?? co?.assurance_numero_contrat ?? null,
      prochaine_ag_date: toDate(co?.prochaine_ag_date),
      syndic_type: co?.syndic_type ?? null,
      syndic_mandat_fin: toDate(co?.syndic_mandat_fin),
      // CSN v3 : copropriete_difficulte est un sous-bloc — true si l'un des 4 critères
      copropriete_en_difficulte:
        cd?.mandataire_ad_hoc === true ||
        cd?.administration_provisoire === true ||
        cd?.etat_carence === true ||
        cd?.ratio_impayes_excede === true ||
        co?.copropriete_en_difficulte === true,
      copropriete_difficulte_details:
        cd?.ratio_impayes_montant != null
          ? `Ratio impayés/budget excède le seuil légal (${cd.ratio_impayes_montant}€)`
          : (co?.copropriete_difficulte_details ?? null),
      fibre_optique: co?.fibre_optique ?? null,
      date_construction: co?.date_construction ?? null,
      // CSN v3 : co.nombre_lots_copropriete (canonique). Ancien : co.nombre_lots.
      nombre_lots_copropriete: toNum(co?.nombre_lots_copropriete ?? co?.nombre_lots) != null
        ? Math.round(toNum(co?.nombre_lots_copropriete ?? co?.nombre_lots) as number)
        : null,

      // Technical dossier columns (Part II-B)
      dtg_date: toDate(di?.dtg_date),
      dtg_resultat: di?.dtg_resultat ?? null,
      plan_pluriannuel_exists: di?.plan_pluriannuel_exists ?? null,
      plan_pluriannuel_details: di?.plan_pluriannuel_details ?? null,
      amiante_dta_date: toDate(di?.amiante_dta_date),
      plomb_date: toDate(di?.plomb_date),
      termites_date: toDate(di?.termites_date),
      audit_energetique_date: toDate(di?.audit_energetique_date),
      ascenseur_exists: di?.ascenseur_exists === true,
      ascenseur_rapport_date: toDate(di?.ascenseur_rapport_date),
      piscine_exists: di?.piscine_exists === true,
      recharge_vehicules: di?.recharge_vehicules === true,

      // Legal / identification
      procedures_en_cours: ju?.procedures_en_cours === true,
      procedures_details: ju?.procedures_details ?? null,
      travaux_votes_non_realises: ju?.travaux_votes_non_realises === true,
      travaux_details: ju?.travaux_votes_details ?? null,
      copropriete_name: co?.nom ?? null,
      syndic_name: co?.syndic_nom ?? null,
      dpe_ademe_number: di?.dpe_numero_ademe ?? null,
      dpe_date: toDate(di?.dpe_date),
      dpe_classe_energie: toChar1(di?.dpe_classe_energie),
      dpe_classe_ges: toChar1(di?.dpe_classe_ges),
    };

    // Only overwrite lot/address from AI if user hasn't set them manually in Step 1
    if (!dossier.property_lot_number) {
      updates.property_lot_number = lo?.numero != null ? String(lo.numero) : null;
    }
    if (!dossier.property_address) {
      updates.property_address = co?.adresse ?? null;
    }

    console.log(`[pv-run-extraction] ${dossierId}: saving extracted data`);

    const { error: saveError } = await supabase.from("pv_dossiers").update(updates).eq("id", dossierId);
    if (saveError) throw saveError;

    console.log(`[pv-run-extraction] ${dossierId}: ✅ extraction complete`);
  } catch (error) {
    const errStr = error instanceof Error
      ? `${error.name}: ${error.message}\n${error.stack ?? ""}`
      : String(error);
    console.error(`[pv-run-extraction] ${dossierId}: ❌ failed:`, errStr);
    // Persist the error in pv_ai_logs so we can debug from the DB even when
    // EdgeRuntime function logs aren't accessible. prompt_type="orchestrator-error"
    // makes these rows easy to filter.
    try {
      await supabase.from("pv_ai_logs").insert({
        dossier_id: dossierId,
        model: "orchestrator",
        model_used: "orchestrator",
        prompt_type: "orchestrator-error",
        latency_ms: 0,
        error: errStr.slice(0, 4000),
      });
    } catch (logErr) {
      console.error(`[pv-run-extraction] ${dossierId}: failed to persist error log:`, logErr);
    }
    // Revert status to 'paid' so ProcessingStep can offer a retry button
    try {
      await supabase.from("pv_dossiers").update({ status: "paid" }).eq("id", dossierId);
    } catch (revertErr) {
      console.error(`[pv-run-extraction] ${dossierId}: failed to revert status:`, revertErr);
    }
  }
}

// ---------- Main handler — fire and forget ----------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return corsResponse({ error: "Method not allowed" }, 405);
  }

  try {
    const body = await req.json();
    const dossierId = body?.dossier_id;
    if (!dossierId) {
      return corsResponse({ error: "dossier_id is required" }, 400);
    }

    // deno-lint-ignore no-explicit-any
    const supabase: any = createClient(SUPABASE_URL, SERVICE_KEY);

    // 1. Verify dossier ownership FIRST (before any sensitive check).
    //    Returns 401/403/404/410 as appropriate. The dossier full row is
    //    available via auth.dossier so we don't refetch.
    const auth = await verifyDossierAccess(req, dossierId, supabase);
    if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);
    const dossier = auth.dossier;

    // 2. Verify payment
    if (dossier.stripe_payment_status !== "paid") {
      return corsResponse({ error: "Payment required" }, 402);
    }

    // 3. Fast-path idempotency: if already extracted, short-circuit BEFORE
    //    bumping the quota. Avoids burning a quota slot just to detect that
    //    the work is already done.
    const ed = dossier.extracted_data;
    const hasReal = ed && typeof ed === "object" && !Array.isArray(ed) && Object.keys(ed).length > 0;
    if (hasReal && dossier.status === "pending_validation") {
      return corsResponse({ accepted: false, reason: "already_extracted" }, 200);
    }

    // 4. ATOMIC CLAIM — single UPDATE that wins the race AND bumps the quota.
    //    public.pv_claim_extraction is SECURITY DEFINER and runs:
    //      UPDATE pack_vendeur.dossiers
    //      SET status='analyzing', extractions_count=extractions_count+1, updated_at=now()
    //      WHERE id=$1 AND status='paid' AND extractions_count<3
    //      RETURNING extractions_count, status;
    //    Rationale: closes the race window between an idempotency SELECT and a
    //    separate UPDATE — two concurrent requests can no longer both pass the
    //    check before either has marked the dossier as analyzing, so we never
    //    fire two parallel Gemini extractions for the same dossier (~$1-2 each).
    //    The quota counter is NOT rolled back on extraction failure — by design,
    //    to prevent a dossier from looping infinitely on errors.
    const { data: claimRows, error: claimErr } = await supabase
      .rpc("pv_claim_extraction", { p_dossier_id: dossierId });
    if (claimErr) {
      console.error("[pv-run-extraction] Claim error:", { dossierId, error: claimErr });
      return corsResponse({ error: "Failed to claim extraction" }, 500);
    }
    const claim = Array.isArray(claimRows) && claimRows.length > 0 ? claimRows[0] : null;
    if (!claim) {
      // No row updated => either status is no longer 'paid' (already analyzing,
      // already done) or quota is exhausted. Diagnose using the dossier we
      // just read via verifyDossierAccess (a few ms ago).
      if ((dossier.extractions_count ?? 0) >= 3) {
        return corsResponse({
          error: "Extraction quota exceeded",
          detail: "Maximum 3 extractions per dossier. Contact support for a new dossier promo code.",
          extractions_count: dossier.extractions_count,
        }, 429);
      }
      return corsResponse({
        accepted: false,
        reason: dossier.status === "analyzing" ? "already_analyzing" : "already_done_or_busy",
      }, 200);
    }

    // 5. Fire and forget — EdgeRuntime keeps the function alive until waitUntil resolves
    // @ts-expect-error EdgeRuntime is provided by Supabase Edge Functions runtime
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      // @ts-expect-error EdgeRuntime is provided by Supabase Edge Functions runtime
      EdgeRuntime.waitUntil(runExtraction(dossierId));
    } else {
      // Fallback: run synchronously (will block the handler, but safer than losing it)
      runExtraction(dossierId).catch((e) => console.error("[pv-run-extraction] background failed:", e));
    }

    return corsResponse({ accepted: true, dossier_id: dossierId }, 202);
  } catch (error) {
    console.error("[pv-run-extraction] Handler error:", error);
    return corsResponse({ error: "Internal server error", details: String(error) }, 500);
  }
});
