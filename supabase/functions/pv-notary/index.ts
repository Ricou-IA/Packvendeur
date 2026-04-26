import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/logging.ts";
import { verifyShareToken } from "../_shared/auth.ts";

// =============================================================
// pv-notary — public notary share access via share_token
// =============================================================
// Pas de header auth — share_token in body acts as the credential.
// Returns dossier with sensitive fields stripped + signed URLs prefetched.
//
// Actions:
//   - get-data            : dossier filtré + documents filtrés + URLs signées
//   - increment-download  : download_count++ + notary_accessed_at
// =============================================================

const BUCKET = "pack-vendeur";
const SIGNED_URL_TTL = 600; // 10 min

// Colonnes EXPOSÉES au notaire (toutes les autres sont stripped).
// Notamment : pas de session_id, access_token, email, données financières,
// pro_account_id, upload_token, etc.
const NOTARY_DOSSIER_FIELDS = [
  "id",
  "property_address",
  "property_postal_code",
  "property_city",
  "expires_at",
  "share_token",
  "notary_accessed_at",
  "download_count",
] as const;

// deno-lint-ignore no-explicit-any
function pickDossierFields(dossier: any): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const field of NOTARY_DOSSIER_FIELDS) {
    result[field] = dossier[field];
  }
  return result;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return corsResponse({ error: "Method not allowed" }, 405);
  }

  const supabase = getSupabase();
  if (!supabase) {
    return corsResponse({ error: "Server configuration error" }, 500);
  }

  // deno-lint-ignore no-explicit-any
  let body: any;
  try {
    body = await req.json();
  } catch {
    return corsResponse({ error: "Invalid JSON body" }, 400);
  }

  const { action, share_token } = body;
  const auth = await verifyShareToken(share_token, supabase);
  if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);

  const dossierFull = auth.dossier;

  try {
    // ========== get-data ==========
    if (action === "get-data") {
      const dossier = pickDossierFields(dossierFull);

      // Documents : on récupère storage_path uniquement pour générer les URLs signées,
      // puis on strip ce champ avant retour au notaire.
      const { data: docs, error: docsError } = await supabase
        .from("pv_documents")
        .select(
          "id, normalized_filename, original_filename, document_type, sort_order, storage_path",
        )
        .eq("dossier_id", dossierFull.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (docsError) {
        console.error("[pv-notary] docs fetch error:", docsError);
        return corsResponse({ error: "Failed to fetch documents" }, 500);
      }

      // Bulk signed URLs : 1 URL pour le PDF principal + 1 par document classé
      const filesToSign: { name: string; path: string }[] = [];
      if (dossierFull.pre_etat_date_pdf_path) {
        filesToSign.push({
          name: "Pre-etat-date.pdf",
          path: dossierFull.pre_etat_date_pdf_path,
        });
      }
      for (const doc of docs || []) {
        if (doc.storage_path) {
          filesToSign.push({
            name:
              doc.normalized_filename ||
              doc.original_filename ||
              `document_${doc.id}.pdf`,
            path: doc.storage_path,
          });
        }
      }

      const packFiles: { name: string; signed_url: string }[] = [];
      for (const file of filesToSign) {
        const { data: urlData, error: urlError } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(file.path, SIGNED_URL_TTL);
        if (!urlError && urlData?.signedUrl) {
          packFiles.push({ name: file.name, signed_url: urlData.signedUrl });
        } else if (urlError) {
          console.warn("[pv-notary] signed url failed for", file.path, urlError);
        }
      }

      // PDF signed URL séparée (pour le bouton "Télécharger le PDF")
      let pdf_signed_url: string | null = null;
      if (dossierFull.pre_etat_date_pdf_path) {
        const { data: pdfUrlData } = await supabase.storage
          .from(BUCKET)
          .createSignedUrl(dossierFull.pre_etat_date_pdf_path, SIGNED_URL_TTL);
        pdf_signed_url = pdfUrlData?.signedUrl || null;
      }

      // Documents filtrés : on cache storage_path
      // deno-lint-ignore no-explicit-any
      const documentsFiltered = (docs || []).map((d: any) => ({
        id: d.id,
        normalized_filename: d.normalized_filename,
        original_filename: d.original_filename,
        document_type: d.document_type,
        sort_order: d.sort_order,
      }));

      return corsResponse({
        dossier,
        documents: documentsFiltered,
        pdf_signed_url,
        pack_files: packFiles,
      });
    }

    // ========== increment-download ==========
    if (action === "increment-download") {
      const updates: Record<string, unknown> = {
        download_count: (dossierFull.download_count || 0) + 1,
      };
      if (!dossierFull.notary_accessed_at) {
        updates.notary_accessed_at = new Date().toISOString();
      }

      await supabase
        .from("pv_dossiers")
        .update(updates)
        .eq("id", dossierFull.id);

      return corsResponse({ ok: true });
    }

    return corsResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    console.error("[pv-notary] handler error:", err);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
