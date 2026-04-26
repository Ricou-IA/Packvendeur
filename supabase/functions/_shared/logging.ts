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
 * Parameters for `logAiCall`. Object-based to keep the call sites readable.
 *
 * - `modelRequested`: model the caller asked for (stored in `pv_ai_logs.model`).
 * - `modelUsed`: model that actually responded (stored in `pv_ai_logs.model_used`).
 *   If omitted, falls back to `modelRequested`.
 * - `inputTokens` / `outputTokens` / `totalTokens`: from Gemini `usageMetadata`.
 *   Null/undefined values insert NULL — no crash if Gemini omits the field.
 */
export interface LogAiCallParams {
  dossierId?: string;
  modelRequested: string;
  modelUsed?: string;
  promptType: string;
  startTime: number;
  result?: unknown;
  inputTokens?: number | null;
  outputTokens?: number | null;
  totalTokens?: number | null;
  error?: string;
}

/**
 * Log an AI call to the pv_ai_logs table.
 *
 * Tracks the requested model, the actually-used model (in case of fallback), token
 * usage from Gemini's `usageMetadata`, and a 2 KB preview of the response JSON.
 *
 * Never throws — DB errors are logged but swallowed so a logging failure does not
 * break the upstream extraction.
 */
export async function logAiCall(
  supabase: SupabaseClient | null,
  params: LogAiCallParams,
): Promise<void> {
  if (!params.dossierId || !supabase) return;
  const latencyMs = Date.now() - params.startTime;
  try {
    await supabase.from("pv_ai_logs").insert({
      dossier_id: params.dossierId,
      model: params.modelRequested,
      model_used: params.modelUsed ?? params.modelRequested,
      prompt_type: params.promptType,
      latency_ms: latencyMs,
      input_tokens: params.inputTokens ?? null,
      output_tokens: params.outputTokens ?? null,
      total_tokens: params.totalTokens ?? null,
      response_payload: params.result
        ? { preview: JSON.stringify(params.result).substring(0, 2000) }
        : null,
      error: params.error || null,
    });
  } catch (e) {
    console.error("Failed to log AI call:", e);
  }
}
