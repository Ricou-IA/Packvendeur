import { uploadToGeminiFileApi } from "./gemini.ts";
import type { SupabaseClient } from "./logging.ts";

// =============================================================
// Pack Vendeur — Gemini File API URI cache
// =============================================================
// Centralizes the upload-to-Gemini logic so classify, run-extraction,
// extract-financial and extract-diagnostics all share the same cache.
//
// Lifecycle:
//   1. First call for a doc: download from Storage, upload to Gemini
//      File API, persist the URI on pv_documents.gemini_file_uri
//      with an expiration ~47h in the future.
//   2. Subsequent calls within 47h: read URI from pv_documents and
//      skip the upload entirely.
//   3. After 47h: re-upload (the URI may have been auto-deleted by
//      Google at 48h).
//
// Net effect: a single PDF is uploaded ONCE per funnel session,
// regardless of how many extractors process it afterwards.
// =============================================================

const URI_LIFETIME_HOURS = 47; // 1h margin vs Google's 48h auto-delete
const REUSE_THRESHOLD_MIN = 5; // skip URIs about to expire within 5 min

export interface DocForUpload {
  id: string;
  storage_path: string;
  original_filename: string;
  normalized_filename?: string | null;
  gemini_file_uri?: string | null;
  gemini_file_expires_at?: string | null;
}

/**
 * Read the file from Supabase Storage and return its base64 representation.
 * Uses chunked conversion to avoid stack-overflow on large PDFs.
 */
async function downloadAsBase64(
  supabase: SupabaseClient,
  storagePath: string,
): Promise<string> {
  const { data: blob, error } = await supabase
    .storage
    .from("pack-vendeur")
    .download(storagePath);
  if (error || !blob) {
    throw new Error(
      `Storage download failed for ${storagePath}: ${error?.message ?? "no data"}`,
    );
  }
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Returns a Gemini File API URI for the document.
 *
 * Reuses the cached URI if it's still valid; otherwise downloads the file
 * from Supabase Storage, uploads to Gemini, persists the URI for future
 * calls, and returns it.
 *
 * The persistence step uses .update() with a service-role supabase client.
 * If the persist fails, we still return the URI (don't fail the call) but
 * log a warning — the worst case is that the next caller re-uploads.
 */
export async function getOrUploadFileUri(
  supabase: SupabaseClient,
  geminiKey: string,
  doc: DocForUpload,
): Promise<string> {
  // 1. Reuse cached URI when still valid
  if (doc.gemini_file_uri && doc.gemini_file_expires_at) {
    const expiresAtMs = new Date(doc.gemini_file_expires_at).getTime();
    const marginMs = REUSE_THRESHOLD_MIN * 60 * 1000;
    if (Number.isFinite(expiresAtMs) && expiresAtMs - Date.now() > marginMs) {
      return doc.gemini_file_uri;
    }
  }

  // 2. Download + upload
  const base64 = await downloadAsBase64(supabase, doc.storage_path);
  const displayName = doc.normalized_filename || doc.original_filename;
  const uri = await uploadToGeminiFileApi(geminiKey, base64, displayName);

  // 3. Persist (best-effort; URI is still returned even if persist fails)
  const expiresAt = new Date(
    Date.now() + URI_LIFETIME_HOURS * 60 * 60 * 1000,
  ).toISOString();
  const { error: updateErr } = await supabase
    .from("pv_documents")
    .update({
      gemini_file_uri: uri,
      gemini_file_expires_at: expiresAt,
    })
    .eq("id", doc.id);
  if (updateErr) {
    console.warn(
      `[gemini-files] Persist URI failed for doc ${doc.id} (will not block):`,
      updateErr,
    );
  }

  return uri;
}
