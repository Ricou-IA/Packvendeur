import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/logging.ts";

// =============================================================
// pv-client-upload — public client upload page (B2B)
// =============================================================
// Le client d'un pro accède à /client/:upload_token. Le upload_token
// (UUID 122 bits sans tirets) fait office de credential.
// Retourne le dossier filtré + infos minimales du pro pour le branding.
//
// Pas d'auth header. La sécurité repose sur l'entropie du upload_token.
// =============================================================

const BUCKET = "pack-vendeur";

// Champs dossier exposés au client B2B (qui upload pour son notaire/syndic).
// Volontairement minimaliste : ni access_token, ni session_id, ni share_token,
// ni données financières, ni extracted_data.
const CLIENT_DOSSIER_FIELDS = [
  "id",
  "client_name",
  "client_email",
  "client_phone",
  "property_address",
  "property_postal_code",
  "property_city",
  "property_lot_number",
  "status",
  "current_step",
  "expires_at",
  "upload_token",
  "pro_account_id",
] as const;

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

  const { action, upload_token } = body;

  if (!upload_token || typeof upload_token !== "string") {
    return corsResponse({ error: "upload_token is required" }, 400);
  }

  try {
    // Helper interne : valide upload_token et retourne le dossier complet (ou erreur)
    async function loadDossierByUploadToken() {
      const { data: dossierFull, error: dossierError } = await supabase
        .from("pv_dossiers")
        .select("*")
        .eq("upload_token", upload_token)
        .maybeSingle();
      if (dossierError) return { dossier: null, status: 500, error: "Failed to fetch dossier" };
      if (!dossierFull) return { dossier: null, status: 404, error: "Upload link not found" };
      if (dossierFull.expires_at && new Date(dossierFull.expires_at) < new Date()) {
        return { dossier: null, status: 410, error: "Upload link expired" };
      }
      return { dossier: dossierFull, status: 200, error: null };
    }

    if (action === "get-dossier") {
      const result = await loadDossierByUploadToken();
      if (!result.dossier) {
        return corsResponse({ error: result.error! }, result.status!);
      }
      const dossierFull = result.dossier;

      const dossier: Record<string, unknown> = {};
      for (const field of CLIENT_DOSSIER_FIELDS) {
        dossier[field] = dossierFull[field];
      }

      let pro_account = null;
      if (dossierFull.pro_account_id) {
        const { data: pro } = await supabase
          .from("pv_pro_accounts")
          .select("id, company_name, logo_path")
          .eq("id", dossierFull.pro_account_id)
          .maybeSingle();
        if (pro) {
          let logo_signed_url: string | null = null;
          if (pro.logo_path) {
            const { data: urlData } = await supabase.storage
              .from(BUCKET)
              .createSignedUrl(pro.logo_path, 3600);
            logo_signed_url = urlData?.signedUrl || null;
          }
          pro_account = {
            id: pro.id,
            company_name: pro.company_name,
            logo_signed_url,
          };
        }
      }

      return corsResponse({ dossier, pro_account });
    }

    if (action === "list-documents") {
      const result = await loadDossierByUploadToken();
      if (!result.dossier) return corsResponse({ error: result.error! }, result.status!);
      const { data, error } = await supabase
        .from("pv_documents")
        .select("*")
        .eq("dossier_id", result.dossier.id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) {
        console.error("[pv-client-upload] list-documents error:", error);
        return corsResponse({ error: "Failed to list documents" }, 500);
      }
      return corsResponse({ documents: data || [] });
    }

    if (action === "upload") {
      const result = await loadDossierByUploadToken();
      if (!result.dossier) return corsResponse({ error: result.error! }, result.status!);
      const dossierId = result.dossier.id;

      const { file_base64, filename, file_type, hint_document_type } = body;
      if (!file_base64 || !filename) {
        return corsResponse({ error: "file_base64 and filename are required" }, 400);
      }

      const safeName = `${Date.now()}_${String(filename).normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-zA-Z0-9._-]/g, "_").replace(/_+/g, "_")}`;
      const storagePath = `${dossierId}/uploads/${safeName}`;
      const binaryString = atob(file_base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
      const contentType = file_type || "application/pdf";

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, bytes, { cacheControl: "3600", upsert: true, contentType });
      if (uploadError) {
        console.error("[pv-client-upload] upload storage error:", uploadError);
        return corsResponse({ error: "Failed to upload file" }, 500);
      }

      const row: Record<string, unknown> = {
        dossier_id: dossierId,
        original_filename: filename,
        storage_path: storagePath,
        file_size_bytes: bytes.length,
        mime_type: contentType,
      };
      if (hint_document_type) row.document_type = hint_document_type;

      const { data: doc, error: insertError } = await supabase
        .from("pv_documents")
        .insert(row)
        .select()
        .single();
      if (insertError) {
        await supabase.storage.from(BUCKET).remove([storagePath]).catch(() => {});
        console.error("[pv-client-upload] upload insert error:", insertError);
        return corsResponse({ error: "Failed to register document" }, 500);
      }
      return corsResponse({ document: doc });
    }

    if (action === "signed-url-document") {
      const result = await loadDossierByUploadToken();
      if (!result.dossier) return corsResponse({ error: result.error! }, result.status!);
      const { storage_path, expires_in } = body;
      if (!storage_path) {
        return corsResponse({ error: "storage_path is required" }, 400);
      }
      if (!storage_path.startsWith(`${result.dossier.id}/`)) {
        return corsResponse({ error: "Forbidden path" }, 403);
      }
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(storage_path, expires_in || 600);
      if (error) {
        console.error("[pv-client-upload] signed-url-document error:", error);
        return corsResponse({ error: "Failed to create signed URL" }, 500);
      }
      return corsResponse({ signed_url: data.signedUrl });
    }

    if (action === "update-dossier") {
      const result = await loadDossierByUploadToken();
      if (!result.dossier) return corsResponse({ error: result.error! }, result.status!);
      const dossierId = result.dossier.id;

      const { updates } = body;
      const FORBIDDEN = [
        "id", "session_id", "access_token", "share_token", "share_url",
        "stripe_payment_intent_id", "stripe_payment_status", "paid_at",
        "amount_paid", "extractions_count", "expires_at", "created_at",
        "updated_at", "deleted_at", "pro_account_id", "upload_token",
        "created_by", "pre_etat_date_pdf_path", "pack_zip_path",
      ];
      const safe: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates || {})) {
        if (!FORBIDDEN.includes(k)) safe[k] = v;
      }
      safe.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("pv_dossiers")
        .update(safe)
        .eq("id", dossierId)
        .select()
        .single();
      if (error) {
        console.error("[pv-client-upload] update-dossier error:", error);
        return corsResponse({ error: "Failed to update dossier" }, 500);
      }
      // Filtrer les colonnes sensibles avant retour au client
      const filtered: Record<string, unknown> = {};
      for (const field of CLIENT_DOSSIER_FIELDS) {
        filtered[field] = data[field];
      }
      // Ajout des autres colonnes utiles au client (questionnaire_data, etc.)
      filtered.questionnaire_data = data.questionnaire_data;
      filtered.status = data.status;
      filtered.current_step = data.current_step;
      return corsResponse({ dossier: filtered });
    }

    if (action === "remove-document") {
      const result = await loadDossierByUploadToken();
      if (!result.dossier) return corsResponse({ error: result.error! }, result.status!);
      const { document_id } = body;
      if (!document_id) {
        return corsResponse({ error: "document_id is required" }, 400);
      }
      const { data: existing } = await supabase
        .from("pv_documents")
        .select("id, dossier_id, storage_path")
        .eq("id", document_id)
        .maybeSingle();
      if (!existing || existing.dossier_id !== result.dossier.id) {
        return corsResponse({ error: "Document not found" }, 404);
      }
      if (existing.storage_path) {
        await supabase.storage.from(BUCKET).remove([existing.storage_path]).catch(() => {});
      }
      const { error } = await supabase.from("pv_documents").delete().eq("id", document_id);
      if (error) {
        console.error("[pv-client-upload] remove-document error:", error);
        return corsResponse({ error: "Failed to remove document" }, 500);
      }
      return corsResponse({ ok: true });
    }

    return corsResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    console.error("[pv-client-upload] handler error:", err);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
