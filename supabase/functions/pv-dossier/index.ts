import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/logging.ts";
import { verifyDossierAccess } from "../_shared/auth.ts";

// =============================================================
// pv-dossier — B2C dossier CRUD
// =============================================================
// Actions:
//   - create                : INSERT dossier (no auth, generates access_token)
//   - get                   : SELECT by id (auth required)
//   - update                : UPDATE by id (auth required)
//   - generate-share-link   : create share_token + share_url (auth required)
// =============================================================

const FORBIDDEN_UPDATE_COLUMNS = [
  "id",
  "session_id",
  "access_token",
  "share_token",
  "share_url",
  "stripe_payment_intent_id",
  "stripe_payment_status",
  "paid_at",
  "amount_paid",
  "extractions_count",
  "expires_at",
  "created_at",
  "updated_at",
  "deleted_at",
  "pro_account_id",
  "upload_token",
  "created_by",
  "pre_etat_date_pdf_path",
  "pack_zip_path",
];

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

  const { action } = body;

  try {
    // ========== create — no auth (creation initiale) ==========
    if (action === "create") {
      const { session_id, utm_data } = body;
      if (!session_id || typeof session_id !== "string") {
        return corsResponse({ error: "session_id is required" }, 400);
      }

      // Idempotency: si un dossier existe déjà pour cette session_id, on le renvoie
      // (cas du reload navigateur sans localStorage encore peuplé)
      const { data: existing } = await supabase
        .from("pv_dossiers")
        .select("*")
        .eq("session_id", session_id)
        .maybeSingle();

      if (existing) {
        return corsResponse({
          dossier: existing,
          access_token: existing.access_token,
        });
      }

      const insertData: Record<string, unknown> = {
        session_id,
        status: "draft",
        current_step: 1,
      };

      if (utm_data && typeof utm_data === "object") {
        const allowed = [
          "utm_source",
          "utm_medium",
          "utm_campaign",
          "utm_term",
          "referrer",
          "acquisition_channel",
          "landing_page",
        ];
        for (const key of allowed) {
          if (utm_data[key]) insertData[key] = utm_data[key];
        }
      }

      const { data: dossier, error } = await supabase
        .from("pv_dossiers")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("[pv-dossier] create insert error:", error);
        return corsResponse({ error: "Failed to create dossier" }, 500);
      }

      return corsResponse({
        dossier,
        access_token: dossier.access_token,
      });
    }

    // ========== get — auth required ==========
    if (action === "get") {
      const { dossier_id } = body;
      const auth = await verifyDossierAccess(req, dossier_id, supabase);
      if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);
      return corsResponse({ dossier: auth.dossier });
    }

    // ========== update — auth required ==========
    if (action === "update") {
      const { dossier_id, updates } = body;
      const auth = await verifyDossierAccess(req, dossier_id, supabase);
      if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);

      if (!updates || typeof updates !== "object") {
        return corsResponse({ error: "updates is required" }, 400);
      }

      const safe: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates)) {
        if (!FORBIDDEN_UPDATE_COLUMNS.includes(k)) safe[k] = v;
      }
      safe.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("pv_dossiers")
        .update(safe)
        .eq("id", dossier_id)
        .select()
        .single();

      if (error) {
        console.error("[pv-dossier] update error:", error);
        return corsResponse({ error: "Failed to update dossier" }, 500);
      }

      return corsResponse({ dossier: data });
    }

    // ========== generate-share-link — auth required ==========
    if (action === "generate-share-link") {
      const { dossier_id, origin } = body;
      const auth = await verifyDossierAccess(req, dossier_id, supabase);
      if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);

      const shareToken = crypto.randomUUID().replace(/-/g, "");
      const baseUrl = origin || "https://pre-etat-date.ai";
      const shareUrl = `${baseUrl}/share/${shareToken}`;

      const { data, error } = await supabase
        .from("pv_dossiers")
        .update({
          share_token: shareToken,
          share_url: shareUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", dossier_id)
        .select("share_token, share_url")
        .single();

      if (error) {
        console.error("[pv-dossier] generate-share-link error:", error);
        return corsResponse({ error: "Failed to generate share link" }, 500);
      }

      return corsResponse({
        share_token: data.share_token,
        share_url: data.share_url,
      });
    }

    return corsResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    console.error("[pv-dossier] handler error:", err);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
