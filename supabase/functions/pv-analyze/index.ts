import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, x-app-name, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

const CLASSIFICATION_PROMPT = `Tu es un expert en copropriete francaise. Analyse ce document PDF et classifie-le.

Reponds en JSON strict avec cette structure:
{
  "document_type": "<type>",
  "confidence": <0.0 a 1.0>,
  "title": "<titre du document>",
  "date": "<date du document, format YYYY-MM-DD ou null>",
  "summary": "<resume en 1 phrase>",
  "dpe_ademe_number": "<numero ADEME a 13 chiffres si le document contient un DPE, sinon null>",
  "diagnostics_couverts": ["<liste des document_type de chaque diagnostic present dans le document>"]
}

Types possibles: pv_ag, reglement_copropriete, etat_descriptif_division, appel_fonds, releve_charges, carnet_entretien, dpe, diagnostic_amiante, diagnostic_plomb, diagnostic_termites, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_mesurage, fiche_synthetique, plan_pluriannuel, dtg, other

INSTRUCTIONS IMPORTANTES:
- Pour la date: utilise la date d'exercice ou de realisation du diagnostic (pas la date d'impression).
- Pour dpe_ademe_number: cherche le numero ADEME a 13 chiffres (format: XXXXXXXXXXXX) present sur les DPE. Retourne null si absent.
- Pour diagnostics_couverts: si le document est un DDT (Dossier de Diagnostics Techniques) contenant PLUSIEURS diagnostics, liste TOUS les types de diagnostics trouves (ex: ["diagnostic_amiante", "diagnostic_plomb", "diagnostic_electricite", "diagnostic_mesurage", "diagnostic_erp", "dpe"]). Si c'est un diagnostic unique, mets un tableau avec un seul element. Si ce n'est pas un diagnostic, mets un tableau vide [].
- Pour un DDT combine, le document_type doit etre le type du diagnostic principal (generalement diagnostic_amiante ou dpe).`;

const EXTRACTION_PROMPT = `Tu es un expert en droit de la copropriete et en transactions immobilieres en France.
Tu analyses un ensemble de documents relatifs a une vente en copropriete pour generer un pre-etat date.

A partir de TOUS les documents fournis, extrais les informations suivantes en JSON strict:

{
  "copropriete": {
    "nom": "",
    "adresse": "",
    "syndic_nom": "",
    "syndic_adresse": "",
    "nombre_lots": null,
    "nombre_batiments": null,
    "date_reglement": ""
  },
  "lot": {
    "numero": "",
    "type": "appartement|parking|cave|local_commercial",
    "etage": "",
    "surface_carrez": null,
    "tantiemes_generaux": null,
    "tantiemes_speciaux": null
  },
  "financier": {
    "budget_previsionnel_annuel": null,
    "charges_courantes_lot": null,
    "charges_exceptionnelles_lot": null,
    "fonds_travaux_solde": null,
    "fonds_travaux_cotisation_annuelle": null,
    "impayes_vendeur": null,
    "dette_copro_fournisseurs": null,
    "avances_remboursables": null,
    "exercice_en_cours": {
      "debut": "",
      "fin": "",
      "provisions_appelees": null,
      "provisions_versees": null
    },
    "exercice_precedent": {
      "debut": "",
      "fin": "",
      "charges_reelles": null,
      "quote_part_lot": null
    }
  },
  "juridique": {
    "procedures_en_cours": false,
    "procedures_details": "",
    "travaux_votes_non_realises": false,
    "travaux_votes_details": "",
    "travaux_a_venir_votes": [],
    "sinistres_en_cours": false,
    "sinistres_details": ""
  },
  "diagnostics": {
    "dpe_numero_ademe": "",
    "dpe_date": "",
    "dpe_classe_energie": "",
    "dpe_classe_ges": "",
    "amiante_date": "",
    "plomb_date": "",
    "carrez_surface": null
  },
  "meta": {
    "documents_analyses": [],
    "donnees_manquantes": [],
    "alertes": [],
    "confiance_globale": 0.0
  }
}

Si une information n'est pas trouvee dans les documents, mets null et ajoute-la dans donnees_manquantes.
Si tu detectes des incoherences entre documents, ajoute une alerte dans le tableau alertes.
Reponds UNIQUEMENT avec le JSON, sans commentaire.`;

async function callGemini(
  apiKey: string,
  model: string,
  parts: unknown[],
): Promise<unknown> {
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts }],
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.1,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("No text in Gemini response");
  }

  return JSON.parse(text);
}

// deno-lint-ignore no-explicit-any
async function logAiCall(
  supabase: any,
  dossierId: string | undefined,
  model: string,
  promptType: string,
  startTime: number,
  result: unknown,
  error?: string,
) {
  if (!dossierId || !supabase) return;

  const latencyMs = Date.now() - startTime;

  try {
    await supabase.from("pv_ai_logs").insert({
      dossier_id: dossierId,
      model,
      prompt_type: promptType,
      latency_ms: latencyMs,
      response_payload: result
        ? { preview: JSON.stringify(result).substring(0, 500) }
        : null,
      error: error || null,
    });
  } catch (e) {
    console.error("Failed to log AI call:", e);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error (Gemini)" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Init Supabase for logging
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase =
      supabaseUrl && supabaseServiceKey
        ? createClient(supabaseUrl, supabaseServiceKey)
        : null;

    const body = await req.json();

    // =============================================
    // ACTION: classify (single document, Flash)
    // =============================================
    if (body.action === "classify") {
      const { file_base64, filename, dossier_id } = body;

      if (!file_base64 || !filename) {
        return new Response(
          JSON.stringify({ error: "file_base64 and filename are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      console.log(`[classify] Processing: ${filename}`);
      const startTime = Date.now();

      try {
        const parts = [
          { text: `${CLASSIFICATION_PROMPT}\n\nFichier: ${filename}` },
          {
            inlineData: { data: file_base64, mimeType: "application/pdf" },
          },
        ];

        const result = await callGemini(geminiKey, "gemini-2.0-flash", parts);

        await logAiCall(
          supabase,
          dossier_id,
          "gemini-2.0-flash",
          "classification",
          startTime,
          result,
        );

        console.log(
          `[classify] Done: ${filename} -> ${(result as Record<string, unknown>).document_type} (${(result as Record<string, unknown>).confidence})`,
        );

        return new Response(
          JSON.stringify({ success: true, data: result }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        console.error(`[classify] Error for ${filename}:`, error);
        await logAiCall(
          supabase,
          dossier_id,
          "gemini-2.0-flash",
          "classification",
          startTime,
          null,
          String(error),
        );
        return new Response(
          JSON.stringify({
            error: "Classification failed",
            details: String(error),
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // =============================================
    // ACTION: extract (all documents, Pro)
    // =============================================
    if (body.action === "extract") {
      const { documents, dossier_id } = body;

      if (!documents || documents.length === 0) {
        return new Response(
          JSON.stringify({ error: "documents array is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      console.log(`[extract] Processing ${documents.length} documents`);
      const startTime = Date.now();

      try {
        const parts: unknown[] = [{ text: EXTRACTION_PROMPT }];

        for (const doc of documents) {
          parts.push({
            inlineData: { data: doc.base64, mimeType: "application/pdf" },
          });
          parts.push({
            text: `[Document: ${doc.normalized_filename || doc.original_filename} - Type: ${doc.document_type}]`,
          });
        }

        const result = await callGemini(geminiKey, "gemini-2.5-pro", parts);

        await logAiCall(
          supabase,
          dossier_id,
          "gemini-2.5-pro",
          "extraction",
          startTime,
          result,
        );

        console.log(`[extract] Done in ${Date.now() - startTime}ms`);

        return new Response(
          JSON.stringify({ success: true, data: result }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        console.error("[extract] Error:", error);
        await logAiCall(
          supabase,
          dossier_id,
          "gemini-2.5-pro",
          "extraction",
          startTime,
          null,
          String(error),
        );
        return new Response(
          JSON.stringify({
            error: "Extraction failed",
            details: String(error),
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    return new Response(
      JSON.stringify({
        error: "Invalid action. Use 'classify' or 'extract'",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
