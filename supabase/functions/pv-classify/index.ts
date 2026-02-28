import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { callGemini } from "../_shared/gemini.ts";
import { getSupabase, logAiCall } from "../_shared/logging.ts";

// ---------- Constants ----------

const DIAGNOSTIC_TYPES = new Set([
  "diagnostic_amiante", "diagnostic_plomb", "diagnostic_electricite",
  "diagnostic_gaz", "diagnostic_erp", "diagnostic_termites",
  "diagnostic_mesurage", "audit_energetique", "dpe",
]);

const DIAG_KEYWORD_MAP: Record<string, string> = {
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
};

// ---------- Prompt ----------

const CLASSIFICATION_PROMPT = `Tu es un expert en copropriété française. Analyse ce document PDF et classifie-le.

Réponds en JSON strict avec cette structure:
{
  "document_type": "<type>",
  "confidence": <0.0 à 1.0>,
  "title": "<titre du document>",
  "date": "<date pertinente du document, format YYYY-MM-DD ou null>",
  "summary": "<résumé en 1 phrase>",
  "diagnostics_couverts": [],
  "dpe_ademe_number": ""
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
- IMPORTANT: Ne PAS utiliser la date d'envoi, d'impression ou de génération du document.

INSTRUCTIONS SPÉCIALES POUR LE DPE:
- Si le document EST un DPE ou CONTIENT un DPE (dans un DDT), extrais le numéro ADEME dans "dpe_ademe_number".
- Le numéro ADEME est un identifiant de 13 caractères (lettres et chiffres, ex: 2531E1024432P) situé en haut du rapport DPE, souvent précédé de "N°" ou "Numéro".
- Si aucun DPE n'est présent, laisse dpe_ademe_number vide "".

INSTRUCTIONS CRITIQUES POUR LES DIAGNOSTICS:
- Si le document est un DDT (Dossier de Diagnostics Techniques) regroupant PLUSIEURS diagnostics, choisis le type du premier diagnostic identifié pour "document_type" et liste ABSOLUMENT TOUS les types de diagnostics présents dans "diagnostics_couverts".
- Tu DOIS parcourir CHAQUE PAGE du document pour identifier TOUS les diagnostics présents.
- Types de diagnostics possibles: diagnostic_amiante, diagnostic_plomb, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_termites, diagnostic_mesurage, audit_energetique, dpe
- OBLIGATOIRE: Si le summary mentionne plusieurs diagnostics, diagnostics_couverts DOIT TOUS les lister. Par exemple si le résumé mentionne "amiante, termites, électricité, ERP, DPE et mesurage", diagnostics_couverts doit contenir ["diagnostic_amiante", "diagnostic_termites", "diagnostic_electricite", "diagnostic_erp", "dpe", "diagnostic_mesurage"].
- Si le document ne contient qu'un seul diagnostic, diagnostics_couverts contient uniquement ce type.
- Si le document n'est PAS un diagnostic (bail, PV AG, relevé de charges, taxe foncière, etc.), diagnostics_couverts DOIT être un tableau vide [].
- IMPORTANT: Un bail qui MENTIONNE des diagnostics en annexe ne CONTIENT PAS ces diagnostics. diagnostics_couverts ne doit lister que les diagnostics dont le rapport complet est DANS le PDF.

Types possibles: pv_ag, reglement_copropriete, etat_descriptif_division, appel_fonds, releve_charges, carnet_entretien, dpe, diagnostic_amiante, diagnostic_plomb, diagnostic_termites, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_mesurage, fiche_synthetique, plan_pluriannuel, dtg, taxe_fonciere, bail, contrat_assurance, plan_pluriannuel_travaux, audit_energetique, other`;

// ---------- Helpers ----------

function extractDiagsFromText(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [keyword, diagType] of Object.entries(DIAG_KEYWORD_MAP)) {
    if (lower.includes(keyword.toLowerCase())) {
      found.add(diagType);
    }
  }
  return Array.from(found);
}

function normalizeClassification(raw: unknown): Record<string, unknown> {
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
    return {
      ...first,
      diagnostics_couverts: allTypes,
      dpe_ademe_number: dpeAdemeNumber || first.dpe_ademe_number || "",
    };
  }

  const obj = raw as Record<string, unknown>;
  const docType = obj.document_type as string;
  const covered = (obj.diagnostics_couverts as string[]) || [];
  const summary = (obj.summary as string) || "";
  const title = (obj.title as string) || "";

  if (docType && !DIAGNOSTIC_TYPES.has(docType)) {
    console.log(`[classify] Non-diagnostic type '${docType}': clearing diagnostics_couverts`);
    return { ...obj, diagnostics_couverts: [] };
  }

  const textDiags = extractDiagsFromText(summary + " " + title);
  const mergedSet = new Set<string>([...covered, ...textDiags]);
  if (docType && DIAGNOSTIC_TYPES.has(docType)) {
    mergedSet.add(docType);
  }
  const mergedArray = Array.from(mergedSet);
  if (mergedArray.length !== covered.length) {
    console.log(`[classify] Enriched diagnostics_couverts from ${covered.length} to ${mergedArray.length}: ${mergedArray.join(", ")}`);
  }
  return { ...obj, diagnostics_couverts: mergedArray };
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
    const { file_base64, filename, dossier_id } = await req.json();

    if (!file_base64 || !filename) {
      return corsResponse({ error: "file_base64 and filename are required" }, 400);
    }

    console.log(`[classify] Processing: ${filename}`);
    const startTime = Date.now();

    try {
      const parts = [
        { text: `${CLASSIFICATION_PROMPT}\n\nFichier: ${filename}` },
        { inlineData: { data: file_base64, mimeType: "application/pdf" } },
      ];

      const rawResult = await callGemini(geminiKey, "gemini-2.0-flash", parts);
      const result = normalizeClassification(rawResult);

      await logAiCall(supabase, dossier_id, "gemini-2.0-flash", "classification", startTime, result);

      const covered = (result.diagnostics_couverts as string[]) || [];
      const dpeNum = (result.dpe_ademe_number as string) || "";
      console.log(
        `[classify] Done: ${filename} -> ${result.document_type} (${result.confidence})${covered.length > 1 ? ` [DDT: ${covered.join(", ")}]` : ""}${dpeNum ? ` [DPE ADEME: ${dpeNum}]` : ""}`,
      );

      return corsResponse({ success: true, data: result });
    } catch (error) {
      console.error(`[classify] Error for ${filename}:`, error);
      await logAiCall(supabase, dossier_id, "gemini-2.0-flash", "classification", startTime, null, String(error));
      return corsResponse({ error: "Classification failed", details: String(error) }, 500);
    }
  } catch (error) {
    console.error("Error:", error);
    return corsResponse({ error: "Internal server error", details: String(error) }, 500);
  }
});
