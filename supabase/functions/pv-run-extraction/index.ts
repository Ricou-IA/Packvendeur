import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { verifyDossierAccess } from "../_shared/auth.ts";

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
  base64?: string;
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
    const res = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${SERVICE_KEY}`,
        // Pass-through pour le verifyDossierAccess côté extracteur.
        // L'orchestrateur l'a déjà vérifié dans le handler initial.
        "X-Pv-Access-Token": accessToken,
      },
      body: JSON.stringify(body),
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

// ---------- Download a document from storage as base64 ----------

// deno-lint-ignore no-explicit-any
async function downloadAsBase64(supabase: any, storagePath: string): Promise<string | null> {
  const { data: file, error } = await supabase.storage.from("pack-vendeur").download(storagePath);
  if (error || !file) {
    console.error(`[pv-run-extraction] Failed to download ${storagePath}:`, error);
    return null;
  }
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  // Chunk the conversion to avoid stack overflow on large PDFs
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
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

    console.log(`[pv-run-extraction] ${dossierId}: downloading ${relevant.length} documents`);

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

    // Download files in parallel, dropping any that fail
    const downloadResults = await Promise.all(uniqueDocs.map(async (doc) => {
      const base64 = await downloadAsBase64(supabase, doc.storage_path);
      if (!base64) return null;
      return {
        ...doc,
        base64,
        normalized_filename: doc.normalized_filename || doc.original_filename,
        document_type: doc.document_type || "other",
      } as DocInput;
    }));
    const docsWithBase64 = downloadResults.filter((d): d is DocInput => d !== null);

    if (docsWithBase64.length === 0) {
      throw new Error("Impossible de télécharger les documents depuis le stockage.");
    }

    // Route into phase 1 (financial/legal) and phase 2 (diagnostics/technical)
    const { phase1Docs, phase2Docs } = routeDocuments(docsWithBase64);
    const diagnosticsCouverts = collectDiagnosticsCouverts(docsWithBase64);

    console.log(
      `[pv-run-extraction] ${dossierId}: routed ${phase1Docs.length} → financial, ` +
      `${phase2Docs.length} → diagnostics, diagnostics_couverts=[${diagnosticsCouverts.join(",")}]`,
    );

    // Run the 2 extractions in parallel via internal edge function calls.
    // We pass the dossier's access_token so the inner extracts can run their
    // own verifyDossierAccess check (defense in depth).
    const accessToken = dossier.access_token as string;
    const [finResult, diagResult] = await Promise.all([
      phase1Docs.length > 0
        ? callExtract("pv-extract-financial", {
            documents: phase1Docs,
            dossier_id: dossierId,
            lot_number: dossier.property_lot_number,
            property_address: dossier.property_address,
            questionnaire_context: dossier.questionnaire_data,
          }, accessToken)
        : Promise.resolve({ data: null, error: null }),
      phase2Docs.length > 0
        ? callExtract("pv-extract-diagnostics", {
            documents: phase2Docs,
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

    // ---------- HYBRID CHARGES CALCULATION ----------
    const tantiemesLot = toNum((merged.lot as any)?.tantiemes_generaux);
    const tantiemesTotaux = toNum(
      (merged.copropriete as any)?.tantiemes_totaux ?? (merged.lot as any)?.tantiemes_totaux,
    );
    const budgetAnnuel = toNum((merged.financier as any)?.budget_previsionnel_annuel);
    const geminiCharges = toNum((merged.financier as any)?.charges_courantes_lot);

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

    const finalCharges = calculatedCharges ?? geminiCharges;

    // ---------- CROSS-VALIDATION ALERTS ----------
    const chargesBudgetN1 = toNum((merged.financier as any)?.charges_budget_n1);
    if (calculatedCharges && chargesBudgetN1 && chargesBudgetN1 > 0) {
      const diffN1 = Math.abs(calculatedCharges - chargesBudgetN1) / calculatedCharges * 100;
      if (diffN1 > 20) {
        merged.meta.alertes.push(
          `Écart de ${diffN1.toFixed(0)}% entre charges calculées (${calculatedCharges}€) et charges budget N-1 (${chargesBudgetN1}€). Vérifiez les tantièmes.`,
        );
      }
    }

    const provisionsExigibles = toNum((merged.financier as any)?.provisions_exigibles);
    if (provisionsExigibles && calculatedCharges && provisionsExigibles > calculatedCharges * 1.1) {
      merged.meta.alertes.push(
        `Provisions exigibles (${provisionsExigibles}€) supérieures aux charges annuelles (${calculatedCharges}€). Vérifiez ce montant.`,
      );
    }

    // ---------- BUILD UPDATE PAYLOAD (50+ flat columns) ----------
    const fi = merged.financier as any;
    const co = merged.copropriete as any;
    const lo = merged.lot as any;
    const ju = merged.juridique as any;
    const di = merged.diagnostics as any;

    const updates: Record<string, unknown> = {
      extracted_data: merged,
      status: "pending_validation",

      // Financial columns
      fonds_travaux_balance: toNum(fi?.fonds_travaux_solde),
      charges_courantes: finalCharges,
      charges_exceptionnelles: toNum(fi?.charges_exceptionnelles_lot),
      impaye_vendeur: toNum(fi?.impayes_vendeur),
      dette_copro_fournisseurs: toNum(fi?.dette_copro_fournisseurs),
      budget_previsionnel: budgetAnnuel,
      property_surface: toNum(lo?.surface_carrez ?? di?.carrez_surface),
      tantiemes_lot: tantiemesLot != null ? Math.round(tantiemesLot) : null,
      tantiemes_totaux: tantiemesTotaux != null ? Math.round(tantiemesTotaux) : null,
      charges_calculees: calculatedCharges,
      charges_discrepancy_pct: chargesDiscrepancyPct,

      // CSN financial columns (Part I)
      charges_budget_n1: toNum(fi?.charges_budget_n1),
      charges_budget_n2: toNum(fi?.charges_budget_n2),
      charges_hors_budget_n1: toNum(fi?.charges_hors_budget_n1),
      charges_hors_budget_n2: toNum(fi?.charges_hors_budget_n2),
      provisions_exigibles: toNum(fi?.provisions_exigibles),
      avances_reserve: toNum(fi?.avances_reserve),
      provisions_speciales: toNum(fi?.provisions_speciales),
      emprunt_collectif_solde: toNum(fi?.emprunt_collectif_solde),
      emprunt_collectif_echeance: fi?.emprunt_collectif_echeance ?? null,
      cautionnement_solidaire: fi?.cautionnement_solidaire === true,
      fonds_travaux_cotisation: toNum(fi?.fonds_travaux_cotisation_annuelle),
      fonds_travaux_exists: fi?.fonds_travaux_exists ?? true,
      impaye_charges_global: toNum(fi?.impaye_charges_global),
      dette_fournisseurs_global: toNum(fi?.dette_fournisseurs_global),

      // Copropriete life columns (Part II-A)
      assurance_multirisque: co?.assurance_multirisque ?? null,
      assurance_numero_contrat: co?.assurance_numero_contrat ?? null,
      prochaine_ag_date: toDate(co?.prochaine_ag_date),
      syndic_type: co?.syndic_type ?? null,
      syndic_mandat_fin: toDate(co?.syndic_mandat_fin),
      copropriete_en_difficulte: co?.copropriete_en_difficulte === true,
      copropriete_difficulte_details: co?.copropriete_difficulte_details ?? null,
      fibre_optique: co?.fibre_optique ?? null,
      date_construction: co?.date_construction ?? null,
      nombre_lots_copropriete: toNum(co?.nombre_lots) != null
        ? Math.round(toNum(co?.nombre_lots) as number)
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
    console.error(`[pv-run-extraction] ${dossierId}: ❌ failed:`, error);
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
