import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { callGemini, uploadToGeminiFileApi } from "../_shared/gemini.ts";
import { getSupabase, logAiCall } from "../_shared/logging.ts";

// ---------- Prompt ----------

const EXTRACTION_PROMPT = `Tu es un expert en diagnostics immobiliers et en réglementation technique de la copropriété en France.
Tu analyses un ensemble de documents TECHNIQUES et DIAGNOSTICS relatifs à une vente en copropriété pour compléter le pré-état daté.

INSTRUCTIONS:
- Pour chaque diagnostic présent, extrais la DATE de réalisation et le résultat principal.
- Pour le DPE, extrais le numéro ADEME, les classes énergie et GES.
- Pour le DTG, extrais la date et le résumé des conclusions.
- Pour le PPT (Plan Pluriannuel de Travaux), indique s'il a été adopté et résume les actions prévues.
- Si un bail est fourni, extrais les informations clés (type, loyer, dates, dépôt de garantie).
- Si un contrat d'assurance est fourni, extrais la compagnie et le numéro de contrat.
- diagnostics_couverts = liste des types de diagnostics dont tu as trouvé le document. Types possibles: diagnostic_amiante, diagnostic_plomb, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_termites, diagnostic_mesurage, audit_energetique, dpe.
- Si une information n'est pas trouvée, mets null ou "".

INSTRUCTIONS CRITIQUES POUR LES DDT (Dossier de Diagnostics Techniques):
- Un DDT est un document UNIQUE regroupant PLUSIEURS rapports de diagnostics.
- Tu DOIS parcourir CHAQUE PAGE du DDT pour identifier et extraire TOUS les diagnostics présents.
- Pour CHAQUE diagnostic trouvé dans le DDT, extrais sa date de réalisation spécifique et ses résultats.
- Ne te limite PAS au premier diagnostic trouvé — continue jusqu'à la dernière page.

Extrais les informations en JSON strict:
{
  "diagnostics": {
    "dpe_numero_ademe": "",
    "dpe_date": "",
    "dpe_classe_energie": "",
    "dpe_classe_ges": "",
    "amiante_dta_date": "",
    "plomb_date": "",
    "termites_date": "",
    "carrez_surface": null,
    "dtg_date": "",
    "dtg_resultat": "",
    "plan_pluriannuel_exists": null,
    "plan_pluriannuel_details": "",
    "audit_energetique_date": "",
    "ascenseur_exists": null,
    "ascenseur_rapport_date": "",
    "piscine_exists": null,
    "recharge_vehicules": null,
    "electricite_date": "",
    "gaz_date": "",
    "erp_date": "",
    "mesurage_date": "",
    "diagnostics_couverts": []
  },
  "bail": {
    "exists": false,
    "type": "",
    "date_debut": "",
    "date_fin": "",
    "loyer_mensuel": null,
    "depot_garantie": null,
    "locataire_nom": ""
  },
  "assurance": {
    "compagnie": "",
    "numero_contrat": "",
    "date_effet": "",
    "date_echeance": ""
  },
  "meta": {
    "documents_analyses": [],
    "donnees_manquantes": [],
    "alertes": [],
    "confiance_globale": 0.0
  }
}

Réponds UNIQUEMENT avec le JSON, sans commentaire ni texte autour.`;

// ---------- Types ----------

interface DocInput {
  base64: string;
  normalized_filename?: string;
  original_filename: string;
  document_type: string;
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
    const body = await req.json();
    const { documents, dossier_id, diagnostics_couverts } = body;

    if (!documents || documents.length === 0) {
      return corsResponse({ error: "documents array is required" }, 400);
    }

    console.log(`[extract-diagnostics] Processing ${documents.length} documents`);
    if (diagnostics_couverts?.length > 0) {
      console.log(`[extract-diagnostics] Known diagnostics from classification: ${diagnostics_couverts.join(", ")}`);
    }

    const startTime = Date.now();

    try {
      // Step 1: Upload documents to Gemini File API in parallel
      const allDocs = documents as DocInput[];
      const uploadStart = Date.now();
      console.log(`[extract-diagnostics] Uploading ${allDocs.length} files to Gemini File API...`);

      const fileUriMap = new Map<string, string>();
      const uploadPromises = allDocs.map(async (doc: DocInput) => {
        const key = doc.normalized_filename || doc.original_filename;
        const uri = await uploadToGeminiFileApi(geminiKey, doc.base64, key);
        fileUriMap.set(key, uri);
      });
      await Promise.all(uploadPromises);

      const uploadDuration = Date.now() - uploadStart;
      console.log(`[extract-diagnostics] Uploaded ${fileUriMap.size} files in ${uploadDuration}ms`);

      // Step 2: Build prompt — inject diagnostics_couverts context if available
      let prompt = EXTRACTION_PROMPT;

      if (diagnostics_couverts && Array.isArray(diagnostics_couverts) && diagnostics_couverts.length > 0) {
        prompt += `\n\nCONTEXTE DE CLASSIFICATION:`;
        prompt += `\nLa classification préalable a identifié les diagnostics suivants dans les documents fournis: ${diagnostics_couverts.join(", ")}.`;
        prompt += `\nAssure-toi d'extraire les dates et résultats pour CHACUN de ces diagnostics.`;
        prompt += `\nSi un diagnostic listé n'est pas trouvé dans les documents, ajoute-le dans donnees_manquantes.`;
      }

      // Step 3: Build parts with labels before PDFs
      const parts: unknown[] = [{ text: prompt }];
      for (const doc of allDocs) {
        const key = doc.normalized_filename || doc.original_filename;
        const uri = fileUriMap.get(key);
        if (uri) {
          parts.push({ text: `[Document: ${key} - Type: ${doc.document_type}]` });
          parts.push({ fileData: { fileUri: uri, mimeType: "application/pdf" } });
        }
      }

      // Step 4: Call Gemini 2.5 Flash
      const result = await callGemini(geminiKey, "gemini-2.5-flash", parts) as Record<string, unknown>;
      const duration = Date.now() - startTime;
      await logAiCall(supabase, dossier_id, "gemini-2.5-flash", "extraction-diagnostics", startTime, result);
      console.log(`[extract-diagnostics] Done in ${duration}ms (upload: ${uploadDuration}ms)`);

      return corsResponse({ success: true, data: result });
    } catch (error) {
      console.error("[extract-diagnostics] Error:", error);
      await logAiCall(supabase, dossier_id, "gemini-2.5-flash", "extraction-diagnostics", startTime, null, String(error));
      return corsResponse({ error: "Diagnostics extraction failed", details: String(error) }, 500);
    }
  } catch (error) {
    console.error("Error:", error);
    return corsResponse({ error: "Internal server error", details: String(error) }, 500);
  }
});
