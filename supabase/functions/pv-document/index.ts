import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/logging.ts";
import { verifyDossierAccess } from "../_shared/auth.ts";

// =============================================================
// pv-document — B2C document CRUD + storage
// =============================================================
// All actions require X-Pv-Access-Token. Storage operations go through
// service_role (RLS bypass via BYPASSRLS). Files are scoped to
// <dossier_id>/uploads/* or <dossier_id>/output/*.
//
// Actions:
//   - upload            : base64 → bucket + INSERT pv_documents
//   - list              : SELECT documents par dossier_id
//   - signed-url        : signed URL for a doc (10 min TTL)
//   - update            : UPDATE document metadata (after AI classification)
//   - remove            : DELETE doc (storage + DB)
//   - upload-generated  : upload PDF généré côté client (DeliveryPanel)
// =============================================================

const BUCKET = "pack-vendeur";
const SIGNED_URL_TTL = 600; // 10 minutes

const FORBIDDEN_UPDATE_COLUMNS = [
  "id",
  "dossier_id",
  "storage_path",
  "created_at",
];

function sanitizeFilename(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_+/g, "_");
}

function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

function ensureScopedPath(path: string, dossierId: string): boolean {
  // Le path doit commencer par <dossier_id>/ pour empêcher la traversée
  // d'un dossier vers un autre (anti path-traversal).
  return path.startsWith(`${dossierId}/`);
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

  const { action, dossier_id } = body;

  // Toutes les actions exigent l'ownership du dossier
  const auth = await verifyDossierAccess(req, dossier_id, supabase);
  if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);

  try {
    // ========== upload ==========
    if (action === "upload") {
      const { file_base64, filename, file_type, hint_document_type } = body;
      if (!file_base64 || !filename) {
        return corsResponse(
          { error: "file_base64 and filename are required" },
          400,
        );
      }

      const safeName = `${Date.now()}_${sanitizeFilename(filename)}`;
      const storagePath = `${dossier_id}/uploads/${safeName}`;
      const bytes = base64ToBytes(file_base64);
      const contentType = file_type || "application/pdf";

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, bytes, {
          cacheControl: "3600",
          upsert: true,
          contentType,
        });

      if (uploadError) {
        console.error("[pv-document] upload storage error:", uploadError);
        return corsResponse({ error: "Failed to upload file" }, 500);
      }

      const row: Record<string, unknown> = {
        dossier_id,
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
        // Cleanup orphaned storage object on DB failure
        await supabase.storage.from(BUCKET).remove([storagePath]).catch(() => {});
        console.error("[pv-document] upload insert error:", insertError);
        return corsResponse({ error: "Failed to register document" }, 500);
      }

      return corsResponse({ document: doc });
    }

    // ========== list ==========
    if (action === "list") {
      const { data, error } = await supabase
        .from("pv_documents")
        .select("*")
        .eq("dossier_id", dossier_id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        console.error("[pv-document] list error:", error);
        return corsResponse({ error: "Failed to list documents" }, 500);
      }
      return corsResponse({ documents: data || [] });
    }

    // ========== signed-url ==========
    if (action === "signed-url") {
      const { storage_path, expires_in } = body;
      if (!storage_path) {
        return corsResponse({ error: "storage_path is required" }, 400);
      }
      if (!ensureScopedPath(storage_path, dossier_id)) {
        return corsResponse({ error: "Forbidden path" }, 403);
      }

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(storage_path, expires_in || SIGNED_URL_TTL);

      if (error) {
        console.error("[pv-document] signed-url error:", error);
        return corsResponse({ error: "Failed to create signed URL" }, 500);
      }
      return corsResponse({ signed_url: data.signedUrl });
    }

    // ========== update ==========
    if (action === "update") {
      const { document_id, updates } = body;
      if (!document_id) {
        return corsResponse({ error: "document_id is required" }, 400);
      }

      const { data: existing } = await supabase
        .from("pv_documents")
        .select("id, dossier_id")
        .eq("id", document_id)
        .maybeSingle();
      if (!existing || existing.dossier_id !== dossier_id) {
        return corsResponse({ error: "Document not found" }, 404);
      }

      const safe: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates || {})) {
        if (!FORBIDDEN_UPDATE_COLUMNS.includes(k)) safe[k] = v;
      }

      const { data, error } = await supabase
        .from("pv_documents")
        .update(safe)
        .eq("id", document_id)
        .select()
        .single();

      if (error) {
        console.error("[pv-document] update error:", error);
        return corsResponse({ error: "Failed to update document" }, 500);
      }
      return corsResponse({ document: data });
    }

    // ========== remove ==========
    if (action === "remove") {
      const { document_id } = body;
      if (!document_id) {
        return corsResponse({ error: "document_id is required" }, 400);
      }

      const { data: existing } = await supabase
        .from("pv_documents")
        .select("id, dossier_id, storage_path")
        .eq("id", document_id)
        .maybeSingle();
      if (!existing || existing.dossier_id !== dossier_id) {
        return corsResponse({ error: "Document not found" }, 404);
      }

      if (existing.storage_path) {
        await supabase.storage
          .from(BUCKET)
          .remove([existing.storage_path])
          .catch(() => {});
      }

      const { error } = await supabase
        .from("pv_documents")
        .delete()
        .eq("id", document_id);

      if (error) {
        console.error("[pv-document] remove error:", error);
        return corsResponse({ error: "Failed to remove document" }, 500);
      }
      return corsResponse({ ok: true });
    }

    // ========== upload-generated (PDF généré côté client) ==========
    if (action === "upload-generated") {
      const { file_base64, filename, file_type } = body;
      if (!file_base64 || !filename) {
        return corsResponse(
          { error: "file_base64 and filename are required" },
          400,
        );
      }

      const safeName = sanitizeFilename(filename);
      const storagePath = `${dossier_id}/output/${safeName}`;
      const bytes = base64ToBytes(file_base64);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, bytes, {
          cacheControl: "3600",
          upsert: true,
          contentType: file_type || "application/pdf",
        });

      if (uploadError) {
        console.error("[pv-document] upload-generated error:", uploadError);
        return corsResponse({ error: "Failed to upload generated file" }, 500);
      }

      return corsResponse({ storage_path: storagePath });
    }

    return corsResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    console.error("[pv-document] handler error:", err);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
