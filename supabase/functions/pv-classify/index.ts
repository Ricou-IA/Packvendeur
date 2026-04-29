import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { callGemini } from "../_shared/gemini.ts";
import { getOrUploadFileUri } from "../_shared/gemini-files.ts";
import { getSupabase, logAiCall } from "../_shared/logging.ts";
import { verifyDossierAccess } from "../_shared/auth.ts";

// ---------- Constants ----------

const DIAGNOSTIC_TYPES = new Set([
  "diagnostic_amiante", "diagnostic_plomb", "diagnostic_electricite",
  "diagnostic_gaz", "diagnostic_erp", "diagnostic_termites",
  "diagnostic_mesurage", "audit_energetique", "dpe",
]);

// Valid values of pack_vendeur.document_type. Any document_type returned by
// Gemini that is NOT in this set will be sanitized in normalizeClassification
// (otherwise the UPDATE will fail with "invalid input value for enum").
// Common Gemini hallucination: returning "ddt" (Dossier Diagnostics Techniques,
// which is a *bundle* of diagnostics, not an enum value) for a multi-diagnostic
// PDF. We map those to the first valid diagnostic in diagnostics_couverts.
const VALID_DOC_TYPES = new Set([
  "pv_ag", "reglement_copropriete", "etat_descriptif_division",
  "appel_fonds", "releve_charges", "annexes_comptables",
  "carnet_entretien", "dpe",
  "diagnostic_amiante", "diagnostic_plomb", "diagnostic_termites",
  "diagnostic_electricite", "diagnostic_gaz", "diagnostic_erp",
  "diagnostic_mesurage",
  "fiche_synthetique", "plan_pluriannuel", "plan_pluriannuel_travaux",
  "dtg", "audit_energetique",
  "taxe_fonciere", "bail", "contrat_assurance", "other",
]);

const DIAG_KEYWORD_MAP: Record<string, string> = {
  // French keywords
  "amiante": "diagnostic_amiante",
  "plomb": "diagnostic_plomb",
  "crep": "diagnostic_plomb",
  "termites": "diagnostic_termites",
  "electricite": "diagnostic_electricite",
  "électricité": "diagnostic_electricite",
  "electrique": "diagnostic_electricite",
  "électrique": "diagnostic_electricite",
  "gaz": "diagnostic_gaz",
  "erp": "diagnostic_erp",
  "mesurage": "diagnostic_mesurage",
  "carrez": "diagnostic_mesurage",
  "dpe": "dpe",
  "performance énergétique": "dpe",
  "performance energetique": "dpe",
  "audit énergétique": "audit_energetique",
  "audit energetique": "audit_energetique",
  // English keywords (Gemini sometimes responds in English)
  "asbestos": "diagnostic_amiante",
  "lead": "diagnostic_plomb",
  "electricity": "diagnostic_electricite",
  "electrical": "diagnostic_electricite",
  "energy performance": "dpe",
  "energy audit": "audit_energetique",
  "measurement": "diagnostic_mesurage",
  "floor area": "diagnostic_mesurage",
};

// ---------- Prompt ----------

const CLASSIFICATION_PROMPT = `Tu es un expert en copropriété française. Analyse ce document PDF, classifie-le, ET produis une "table des matières sémantique" qui aidera un autre LLM à extraire les bonnes données pour un pré-état daté.

IMPORTANT: Réponds UNIQUEMENT en français. Le summary DOIT être en français.

Réponds en JSON strict avec cette structure:
{
  "document_type": "<type>",
  "confidence": <0.0 à 1.0>,
  "title": "<titre du document>",
  "date": "<date pertinente du document, format YYYY-MM-DD ou null>",
  "summary": "<résumé en 1 phrase EN FRANÇAIS>",
  "diagnostics_couverts": [],
  "dpe_ademe_number": "",
  "contents": [
    { "type": "<content_type>", "page_start": <int>, "description": "<courte description>" }
  ]
}

INSTRUCTIONS POUR LA DATE:
- La "date" doit être la date la plus PERTINENTE pour identifier le document, PAS la date d'impression ou de génération.
- Pour un PV d'AG : date de l'assemblée générale.
- Pour un relevé de charges ou approbation des comptes : date de DÉBUT de l'exercice comptable concerné (ex: si exercice 01/07/2022 au 30/06/2023, mettre 2022-07-01).
- Pour un appel de fonds/provisions : date de début de la période appelée (ex: si appel pour le 1er trimestre 2023, mettre 2023-01-01).
- Pour un diagnostic technique : date de réalisation du diagnostic.
- Pour un bail : date de début du bail.
- Pour un règlement de copropriété / EDD : date de l'acte notarié ou du dernier modificatif.
- Pour une fiche synthétique : date d'établissement.
- Pour une taxe foncière : année d'imposition (ex: 2023-01-01 pour taxe 2023).
- Pour un contrat d'assurance : date d'effet du contrat.
- Pour des annexes comptables : date de clôture de l'exercice (ex: si "état financier au 30/06/2024", mettre 2024-06-30).
- IMPORTANT: Ne PAS utiliser la date d'envoi, d'impression ou de génération du document.

INSTRUCTIONS SPÉCIALES POUR LE DPE:
- Si le document EST un DPE ou CONTIENT un DPE (dans un DDT), extrais le numéro ADEME dans "dpe_ademe_number".
- Le numéro ADEME est un identifiant de 13 caractères (lettres et chiffres, ex: 2531E1024432P) situé en haut du rapport DPE, souvent précédé de "N°" ou "Numéro".
- Si aucun DPE n'est présent, laisse dpe_ademe_number vide "".

INSTRUCTIONS CRITIQUES POUR LES DIAGNOSTICS:
- Si le document est un DDT (Dossier de Diagnostics Techniques) regroupant PLUSIEURS diagnostics, choisis le type du premier diagnostic identifié pour "document_type" et liste ABSOLUMENT TOUS les types de diagnostics présents dans "diagnostics_couverts".
- TRÈS IMPORTANT: Un DDT contient typiquement 4 à 8 diagnostics différents. Si tu n'en trouves qu'un seul dans un DDT, tu as probablement manqué les autres. Parcours CHAQUE PAGE du PDF.
- Tu DOIS parcourir CHAQUE PAGE du document pour identifier TOUS les diagnostics présents.
- Types de diagnostics possibles: diagnostic_amiante, diagnostic_plomb, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_termites, diagnostic_mesurage, audit_energetique, dpe
- OBLIGATOIRE: Si le document est un DDT, diagnostics_couverts DOIT contenir TOUS les diagnostics trouvés. Par exemple un DDT typique contient: ["diagnostic_amiante", "diagnostic_termites", "diagnostic_electricite", "diagnostic_erp", "dpe", "diagnostic_mesurage", "diagnostic_plomb", "diagnostic_gaz"].
- Le summary DOIT mentionner explicitement chaque diagnostic trouvé. Exemple: "DDT contenant les diagnostics amiante, termites, électricité, ERP, DPE et mesurage Carrez".
- Si le document ne contient qu'un seul diagnostic, diagnostics_couverts contient uniquement ce type.
- Si le document n'est PAS un diagnostic (bail, PV AG, relevé de charges, taxe foncière, etc.), diagnostics_couverts DOIT être un tableau vide [].
- IMPORTANT: Un bail qui MENTIONNE des diagnostics en annexe ne CONTIENT PAS ces diagnostics. diagnostics_couverts ne doit lister que les diagnostics dont le rapport complet est DANS le PDF.

INSTRUCTIONS POUR LES ANNEXES COMPTABLES:
- Si le document contient des "Annexe N°1", "Annexe N°2", etc. avec un "État financier après répartition", un "Compte de gestion général", des listes de copropriétaires débiteurs/créditeurs, ou un "Fonds Travaux Loi ALUR" → c'est un document de type "annexes_comptables".
- Ces annexes suivent le plan comptable des copropriétés (décret du 14 mars 2005) et contiennent des comptes numérotés (4501, 4010, 5120, etc.).
- NE PAS confondre avec un simple relevé de charges (qui est spécifique au lot du vendeur). Les annexes comptables montrent les données GLOBALES de la copropriété.
- Si les annexes comptables sont intégrées dans un PV d'AG (annexes jointes au PV), classifier comme "pv_ag" et non "annexes_comptables".

Types possibles: pv_ag, reglement_copropriete, etat_descriptif_division, appel_fonds, releve_charges, annexes_comptables, carnet_entretien, dpe, diagnostic_amiante, diagnostic_plomb, diagnostic_termites, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_mesurage, fiche_synthetique, plan_pluriannuel, dtg, taxe_fonciere, bail, contrat_assurance, plan_pluriannuel_travaux, audit_energetique, other

═══════════════════════════════════════════════════════════════════════
INSTRUCTIONS CRITIQUES POUR "contents" — TABLE DES MATIÈRES SÉMANTIQUE
═══════════════════════════════════════════════════════════════════════

Le champ "contents" sert à un autre LLM (qui produit le pré-état daté) pour
trouver précisément quel passage du PDF contient quel type de donnée.

PRINCIPE — identifie chaque BLOC SÉMANTIQUE du document par son CONTENU,
pas par son titre/étiquette/numéro d'annexe. Un même type de contenu peut
porter des étiquettes différentes selon le syndic ("Annexe N°8", "État du
fonds ALUR", "Tableau de ventilation", "Quote-part par lot"…).

Pour CHAQUE bloc identifié dans le PDF, ajoute un objet à "contents" avec :
- type           : un des content_type canoniques ci-dessous
- page_start     : numéro de la première page (1-indexed)
- description    : courte phrase factuelle décrivant ce qu'il y a (sans
                   interpréter)

CONTENT_TYPES CANONIQUES (utilise EXACTEMENT ces valeurs, jamais d'autres) :

DOCUMENTS COMPTABLES & FINANCIERS :
- etat_financier_apres_repartition  : tableau créances/dettes par compte
                                      (4501, 4010, 4080, etc.) en fin d'exercice
- compte_gestion_general            : exécution budget vs réel (charges/produits)
- soldes_par_coproprietaire         : tableau ligne-par-lot avec colonnes
                                      débiteur/créditeur (= ex-Annexe N°7)
- fonds_travaux_alur_par_lot        : tableau ventilation du fonds ALUR
                                      (art. L.14-2) PAR LOT individuel,
                                      colonnes cotisations versées + solde
                                      (= ex-Annexe N°8)
- tableau_travaux_142_non_clotures  : liste des travaux votés en cours
                                      (montant voté, appelé, restant)
                                      (= ex-Annexe N°5)
- fonds_travaux_solde_global        : montant TOTAL du fonds ALUR (sans
                                      ventilation par lot)
- budget_previsionnel_vote          : budget annuel approuvé en AG (montant
                                      total + période)
- releve_charges_lot                : ventilation des charges pour UN lot
                                      spécifique (du vendeur)
- appel_fonds_provision             : appel trimestriel/mensuel d'un lot
                                      (provision exigible à une date)
- releve_compte_coproprietaire      : solde du compte du copro à une date
                                      donnée (lignes de débit/crédit)

DOCUMENTS JURIDIQUES & SUR LA COPRO :
- proces_verbal_assemblee_generale  : décisions votées en AG
- resolution_travaux_avec_calendrier: résolution AG votant des travaux + calendrier d'appels
- resolution_emprunt_collectif      : résolution AG d'un emprunt syndical
- resolution_procedure_judiciaire   : résolution AG mentionnant une procédure
- reglement_copropriete             : règles + tantièmes
- etat_descriptif_division          : ventilation des lots
- fiche_synthetique_copropriete     : synthèse art. 8-2 loi 65 (RNC, syndic,
                                      nombre lots, fonds travaux, impayés)
- carnet_entretien                  : historique copro
- contrat_assurance_immeuble        : police MRI

DOCUMENTS TECHNIQUES :
- dpe_individuel                    : DPE du lot
- dta_amiante_immeuble              : DTA copro
- crep_plomb_immeuble               : CREP copro
- etat_termites_parties_communes
- etat_des_risques_pollutions
- mesurage_carrez
- audit_energetique_copro
- dtg_copropriete
- plan_pluriannuel_travaux
- bail_locataire
- ascenseur_controle_quinquennal

AUTRES :
- autre                             : si vraiment rien ne match

EXEMPLES :

Document "Compte de gestion 2024.pdf" qui regroupe les annexes 1, 5, 7, 8 :
  "contents": [
    { "type": "etat_financier_apres_repartition", "page_start": 1,
      "description": "Annexe 1 — créances/dettes au 31/12/2024" },
    { "type": "tableau_travaux_142_non_clotures", "page_start": 8,
      "description": "Annexe 5 — 3 travaux votés en cours, totaux et soldes" },
    { "type": "soldes_par_coproprietaire", "page_start": 11,
      "description": "Annexe 7 — solde des 84 copropriétaires" },
    { "type": "fonds_travaux_alur_par_lot", "page_start": 14,
      "description": "Annexe 8 — fonds ALUR ventilé par lot, colonne solde" }
  ]

Document "PV AG du 25/06/2025.pdf" :
  "contents": [
    { "type": "proces_verbal_assemblee_generale", "page_start": 1,
      "description": "PV AG du 25/06/2025" },
    { "type": "budget_previsionnel_vote", "page_start": 4,
      "description": "Approbation budget 2026 = 123 255 EUR (point 7)" },
    { "type": "resolution_travaux_avec_calendrier", "page_start": 7,
      "description": "Travaux remplacement tampons voirie 6053 EUR (résolution 57)" }
  ]

Document "Appel fonds T1 2026.pdf" :
  "contents": [
    { "type": "appel_fonds_provision", "page_start": 1,
      "description": "Appel T1 2026 lots 49/55/59, provision 322,60 EUR" },
    { "type": "releve_compte_coproprietaire", "page_start": 2,
      "description": "Relevé de compte au 01/01/2026, solde reporté" }
  ]

RÈGLES :
- Si un PDF contient PLUSIEURS contents (ex: compte de gestion fusionné),
  liste-les TOUS séparément avec leur page_start.
- Si un PDF est un document unique (ex: 1 seul DPE), "contents" a 1 seule
  entrée pointant vers la page 1.
- N'utilise QUE les content_type listés ci-dessus. Si rien ne match → "autre".
- Si tu hésites entre 2 types, privilégie le plus spécifique.`;

// ---------- Helpers ----------

function extractDiagsFromText(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found: string[] = [];
  for (const keyword of Object.keys(DIAG_KEYWORD_MAP)) {
    if (lower.includes(keyword.toLowerCase())) {
      const diagType = DIAG_KEYWORD_MAP[keyword];
      if (!found.includes(diagType)) {
        found.push(diagType);
      }
    }
  }
  return found;
}

/** Deduplicate an array of strings without using Set spread (Deno edge compat) */
function uniqueStrings(arr: string[]): string[] {
  const result: string[] = [];
  for (const item of arr) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
}

function normalizeClassification(raw: unknown): Record<string, unknown> {
  // Handle legacy array format (old Gemini responses)
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0] as Record<string, unknown>;
    const allTypes = raw
      .map((item: Record<string, unknown>) => item.document_type as string)
      .filter(Boolean);
    let dpeAdemeNumber = "";
    for (const item of raw) {
      const r = item as Record<string, unknown>;
      if (r.dpe_ademe_number && typeof r.dpe_ademe_number === "string" && r.dpe_ademe_number.length > 0) {
        dpeAdemeNumber = r.dpe_ademe_number as string;
        break;
      }
    }
    console.log(`[classify] Normalized array of ${raw.length} diagnostics: ${allTypes.join(", ")}`);
    const normalized = Object.assign({}, first, {
      diagnostics_couverts: uniqueStrings(allTypes),
      dpe_ademe_number: dpeAdemeNumber || (first.dpe_ademe_number as string) || "",
    });
    return normalized;
  }

  const obj = raw as Record<string, unknown>;
  const docType = (obj.document_type as string) || "";
  const covered = Array.isArray(obj.diagnostics_couverts)
    ? (obj.diagnostics_couverts as string[]).slice()
    : [];
  const summary = (obj.summary as string) || "";
  const title = (obj.title as string) || "";

  console.log(`[classify][normalize] docType=${docType}, covered=${JSON.stringify(covered)}, summary="${summary.substring(0, 100)}"`);

  // Three cases for diagnostics_couverts handling:
  //   A) docType is a VALID, NON-diagnostic enum value (pv_ag, reglement, etc.)
  //      → diagnostics_couverts MUST be empty (PV d'AG never carries diagnostics).
  //   B) docType is a VALID diagnostic enum (dpe, diagnostic_amiante, etc.)
  //      → enrich diagnostics_couverts from summary keywords + add docType itself.
  //   C) docType is INVALID (Gemini hallucination like "ddt", free text, garbage)
  //      → enrich diagnostics_couverts from keywords. Don't clear it — the bundle
  //      DOES contain diagnostics, we just need to recover them from text.
  //      sanitizeDocumentType() will then pick the first valid diagnostic as
  //      document_type and our DDT survives the round-trip.
  if (docType && VALID_DOC_TYPES.has(docType) && !DIAGNOSTIC_TYPES.has(docType)) {
    console.log(`[classify][normalize] Valid non-diagnostic type '${docType}': forcing diagnostics_couverts=[]`);
    return Object.assign({}, obj, { diagnostics_couverts: [] as string[] });
  }

  // Cases B and C: enrich from keywords. The summary often spells out every
  // diagnostic in the DDT even when Gemini's structured array is empty.
  const textDiags = extractDiagsFromText(summary + " " + title);
  console.log(`[classify][normalize] textDiags from keywords: ${JSON.stringify(textDiags)}`);

  // Build merged list: start with Gemini's list, add keyword matches, add docType
  const merged = covered.slice();
  for (const d of textDiags) {
    if (!merged.includes(d)) merged.push(d);
  }
  if (docType && DIAGNOSTIC_TYPES.has(docType) && !merged.includes(docType)) {
    merged.push(docType);
  }

  if (merged.length !== covered.length) {
    console.log(`[classify][normalize] Enriched diagnostics_couverts from ${covered.length} to ${merged.length}: ${merged.join(", ")}`);
  }

  const result = Object.assign({}, obj, { diagnostics_couverts: merged });
  console.log(`[classify][normalize] Final diagnostics_couverts: ${JSON.stringify(result.diagnostics_couverts)}`);
  return result;
}

/**
 * Replace document_type with a valid enum value if Gemini returned garbage.
 * Common hallucinations: "ddt", "ddt_amiante", uppercase variants, free text.
 *
 * Resolution order:
 *   1. document_type already valid → keep as-is
 *   2. document_type is "ddt"/derived/invalid AND we have a diagnostics_couverts
 *      list → take the first valid diagnostic from that list
 *   3. Fallback to "other" so the UPDATE never crashes on enum cast
 */
function sanitizeDocumentType(result: Record<string, unknown>): void {
  const original = (result.document_type as string) || "";

  if (VALID_DOC_TYPES.has(original)) {
    return;
  }

  const covered = Array.isArray(result.diagnostics_couverts)
    ? (result.diagnostics_couverts as string[])
    : [];
  const firstValid = covered.find((d) => VALID_DOC_TYPES.has(d));

  const fallback = firstValid || "other";
  console.warn(
    `[classify][sanitize] Gemini returned invalid document_type="${original}". ` +
      `Replacing with "${fallback}" (covered=${JSON.stringify(covered)})`,
  );
  result.document_type = fallback;
}

// ---------- Main handler ----------

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return corsResponse({ error: "Method not allowed" }, 405);
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      console.error("GEMINI_API_KEY not configured");
      return corsResponse({ error: "Server configuration error (Gemini)" }, 500);
    }

    const supabase = getSupabase();
    if (!supabase) {
      return corsResponse({ error: "Server configuration error" }, 500);
    }

    const body = await req.json();
    const { document_id, dossier_id } = body;

    if (!document_id || !dossier_id) {
      return corsResponse({ error: "document_id and dossier_id are required" }, 400);
    }

    // Verify dossier ownership via X-Pv-Access-Token header
    const auth = await verifyDossierAccess(req, dossier_id, supabase, body);
    if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);

    // Fetch document metadata (also gives us cached gemini_file_uri if any)
    const { data: doc, error: docErr } = await supabase
      .from("pv_documents")
      .select("id, dossier_id, storage_path, original_filename, normalized_filename, gemini_file_uri, gemini_file_expires_at")
      .eq("id", document_id)
      .eq("dossier_id", dossier_id)
      .maybeSingle();
    if (docErr) {
      console.error("[classify] Failed to fetch document:", docErr);
      return corsResponse({ error: "Failed to fetch document" }, 500);
    }
    if (!doc) {
      return corsResponse({ error: "Document not found" }, 404);
    }

    console.log(`[classify] Processing: ${doc.original_filename} (doc_id=${document_id})`);
    const startTime = Date.now();

    try {
      // Reuse cached URI if available, otherwise download + upload + persist
      const fileUri = await getOrUploadFileUri(supabase, geminiKey, doc);
      const reused = doc.gemini_file_uri === fileUri;
      console.log(`[classify] Gemini file URI ${reused ? "reused" : "uploaded"}: ${fileUri}`);

      // Build Gemini parts using fileData reference (no inline base64)
      const parts = [
        { text: `${CLASSIFICATION_PROMPT}\n\nFichier: ${doc.original_filename}` },
        { fileData: { fileUri, mimeType: "application/pdf" } },
      ];

      const geminiResult = await callGemini(geminiKey, "gemini-2.5-flash-lite", parts);
      const result = normalizeClassification(geminiResult.data);
      sanitizeDocumentType(result);

      // Persist the classification on pv_documents directly. The client still
      // does its own UPDATE in useDocuments (with normalized_filename + sort
      // order), but writing here makes the function self-contained and lets us
      // re-classify a doc out-of-band (test scripts, manual re-trigger) without
      // having to glue an extra SQL UPDATE every time.
      try {
        await supabase
          .from("pv_documents")
          .update({
            ai_classification_raw: result,
            ai_confidence: result.confidence ?? null,
          })
          .eq("id", document_id);
      } catch (e) {
        console.warn("[classify] Failed to persist ai_classification_raw:", e);
      }

      await logAiCall(supabase, {
        dossierId: dossier_id,
        modelRequested: "gemini-2.5-flash-lite",
        modelUsed: geminiResult.modelUsed,
        promptType: "classification",
        startTime,
        result,
        inputTokens: geminiResult.usageMetadata.inputTokens,
        outputTokens: geminiResult.usageMetadata.outputTokens,
        totalTokens: geminiResult.usageMetadata.totalTokens,
      });

      const covered = (result.diagnostics_couverts as string[]) || [];
      const dpeNum = (result.dpe_ademe_number as string) || "";
      console.log(
        `[classify] Done: ${doc.original_filename} -> ${result.document_type} (${result.confidence})${covered.length > 1 ? ` [DDT: ${covered.join(", ")}]` : ""}${dpeNum ? ` [DPE ADEME: ${dpeNum}]` : ""}`,
      );

      return corsResponse({ success: true, data: result });
    } catch (error) {
      console.error(`[classify] Error for ${doc.original_filename}:`, error);
      await logAiCall(supabase, {
        dossierId: dossier_id,
        modelRequested: "gemini-2.5-flash-lite",
        promptType: "classification",
        startTime,
        error: String(error),
      });
      return corsResponse({ error: "Classification failed", details: String(error) }, 500);
    }
  } catch (error) {
    console.error("Error:", error);
    return corsResponse({ error: "Internal server error", details: String(error) }, 500);
  }
});
