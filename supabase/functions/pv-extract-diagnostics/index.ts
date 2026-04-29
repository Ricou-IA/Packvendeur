import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { callGemini } from "../_shared/gemini.ts";
import { getSupabase, logAiCall } from "../_shared/logging.ts";
import { verifyDossierAccess } from "../_shared/auth.ts";

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
  gemini_file_uri: string;
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
    if (!supabase) {
      return corsResponse({ error: "Server configuration error" }, 500);
    }

    const body = await req.json();
    const { documents, dossier_id, diagnostics_couverts, documents_toc } = body;

    if (!documents || documents.length === 0) {
      return corsResponse({ error: "documents array is required" }, 400);
    }

    // Verify dossier ownership via X-Pv-Access-Token header.
    // Called primarily by pv-run-extraction (orchestrator), which forwards
    // the user's access_token. Defense in depth even if exposed.
    const auth = await verifyDossierAccess(req, dossier_id, supabase, body);
    if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);

    // Payment gate: extraction is expensive (Gemini 2.5 Flash) — only post-checkout.
    if (auth.dossier.stripe_payment_status !== "paid") {
      console.warn(
        `[extract-diagnostics] Refused: dossier ${dossier_id} has stripe_payment_status=${auth.dossier.stripe_payment_status ?? "null"}`,
      );
      return corsResponse({ error: "Payment required" }, 402);
    }

    console.log(`[extract-diagnostics] Processing ${documents.length} documents`);
    if (diagnostics_couverts?.length > 0) {
      console.log(`[extract-diagnostics] Known diagnostics from classification: ${diagnostics_couverts.join(", ")}`);
    }

    const startTime = Date.now();

    try {
      const allDocs = documents as DocInput[];

      // Like pv-extract-financial: the orchestrator resolves URIs upstream.
      // We just consume them. Missing URI = bug, fail loud.
      const missingUri = allDocs.find((d) => !d.gemini_file_uri);
      if (missingUri) {
        throw new Error(
          `Missing gemini_file_uri for ${missingUri.original_filename || "<unnamed>"}. ` +
            `Caller must resolve URIs before invoking pv-extract-diagnostics.`,
        );
      }
      console.log(`[extract-diagnostics] Using ${allDocs.length} pre-resolved Gemini URIs`);

      // Build prompt — inject diagnostics_couverts context if available
      let prompt = EXTRACTION_PROMPT;

      if (diagnostics_couverts && Array.isArray(diagnostics_couverts) && diagnostics_couverts.length > 0) {
        prompt += `\n\nCONTEXTE DE CLASSIFICATION:`;
        prompt += `\nLa classification préalable a identifié les diagnostics suivants dans les documents fournis: ${diagnostics_couverts.join(", ")}.`;
        prompt += `\nAssure-toi d'extraire les dates et résultats pour CHACUN de ces diagnostics.`;
        prompt += `\nSi un diagnostic listé n'est pas trouvé dans les documents, ajoute-le dans donnees_manquantes.`;
      }

      // Inject the documents table-of-contents from pv-classify pre-scan.
      if (typeof documents_toc === "string" && documents_toc.length > 0) {
        prompt += `\n\n${documents_toc}`;
      }

      // Build parts with labels before each PDF reference
      const parts: unknown[] = [{ text: prompt }];
      for (const doc of allDocs) {
        const key = doc.normalized_filename || doc.original_filename;
        parts.push({ text: `[Document: ${key} - Type: ${doc.document_type}]` });
        parts.push({ fileData: { fileUri: doc.gemini_file_uri, mimeType: "application/pdf" } });
      }

      // Call Gemini 2.5 Flash
      const geminiResult = await callGemini(geminiKey, "gemini-2.5-flash", parts);
      const result = geminiResult.data as Record<string, unknown>;
      const duration = Date.now() - startTime;
      await logAiCall(supabase, {
        dossierId: dossier_id,
        modelRequested: "gemini-2.5-flash",
        modelUsed: geminiResult.modelUsed,
        promptType: "extraction-diagnostics",
        startTime,
        result,
        inputTokens: geminiResult.usageMetadata.inputTokens,
        outputTokens: geminiResult.usageMetadata.outputTokens,
        totalTokens: geminiResult.usageMetadata.totalTokens,
      });
      console.log(`[extract-diagnostics] Done in ${duration}ms`);

      return corsResponse({ success: true, data: result });
    } catch (error) {
      console.error("[extract-diagnostics] Error:", error);
      await logAiCall(supabase, {
        dossierId: dossier_id,
        modelRequested: "gemini-2.5-flash",
        promptType: "extraction-diagnostics",
        startTime,
        error: String(error),
      });
      return corsResponse({ error: "Diagnostics extraction failed", details: String(error) }, 500);
    }
  } catch (error) {
    console.error("Error:", error);
    return corsResponse({ error: "Internal server error", details: String(error) }, 500);
  }
});
