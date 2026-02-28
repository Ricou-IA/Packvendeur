import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

// deno-lint-ignore no-explicit-any
export type SupabaseClient = any;

/**
 * Create a Supabase client using service role key (bypasses RLS).
 * Returns null if env vars are missing.
 */
export function getSupabase(): SupabaseClient | null {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return url && key ? createClient(url, key) : null;
}

/**
 * Log an AI call to the pv_ai_logs table.
 */
export async function logAiCall(
  supabase: SupabaseClient | null,
  dossierId: string | undefined,
  model: string,
  promptType: string,
  startTime: number,
  result: unknown,
  error?: string,
): Promise<void> {
  if (!dossierId || !supabase) return;
  const latencyMs = Date.now() - startTime;
  try {
    await supabase.from("pv_ai_logs").insert({
      dossier_id: dossierId,
      model,
      prompt_type: promptType,
      latency_ms: latencyMs,
      response_payload: result
        ? { preview: JSON.stringify(result).substring(0, 2000) }
        : null,
      error: error || null,
    });
  } catch (e) {
    console.error("Failed to log AI call:", e);
  }
}
