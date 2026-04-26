import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/logging.ts";

// =============================================================
// pv-track-event — analytics fire-and-forget
// =============================================================
// No auth required (anonymous analytics).
// Validates only that session_id and event_name are non-empty strings.
// Best-effort insert — errors logged but never block.
// =============================================================

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

  const {
    session_id,
    dossier_id = null,
    event_name,
    event_category = null,
    properties = {},
    page_url = null,
    referrer = null,
    utm_source = null,
    utm_medium = null,
    utm_campaign = null,
    user_agent = null,
  } = body;

  if (!session_id || typeof session_id !== "string" || session_id.length > 100) {
    return corsResponse({ error: "session_id is required (max 100 chars)" }, 400);
  }
  if (!event_name || typeof event_name !== "string" || event_name.length > 100) {
    return corsResponse({ error: "event_name is required (max 100 chars)" }, 400);
  }

  try {
    await supabase.from("pv_events").insert({
      session_id,
      dossier_id,
      event_name,
      event_category,
      properties: properties && typeof properties === "object" ? properties : {},
      page_url,
      referrer,
      utm_source,
      utm_medium,
      utm_campaign,
      user_agent,
    });
    return corsResponse({ ok: true });
  } catch (err) {
    // Tracking ne doit jamais throw — on retourne ok=false sans erreur HTTP
    console.error("[pv-track-event] insert error:", err);
    return corsResponse({ ok: false }, 200);
  }
});
