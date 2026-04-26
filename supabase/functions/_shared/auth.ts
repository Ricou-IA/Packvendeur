import type { SupabaseClient } from "./logging.ts";

// =============================================================
// Pack Vendeur — auth helper for edge functions
// =============================================================
// Three patterns:
//   1) B2C dossier ownership : X-Pv-Access-Token: <uuid>
//   2) B2B pro account auth   : X-Pv-Pro-Token: <uuid>
//   3) Notary share access    : share_token in body (no header)
//
// Every edge function that reads/mutates a dossier or pro account
// MUST call verifyDossierAccess / verifyProAccess BEFORE any DB op.
// =============================================================

export interface AuthCheckResult {
  ok: boolean;
  // deno-lint-ignore no-explicit-any
  dossier?: any;
  // deno-lint-ignore no-explicit-any
  proAccount?: any;
  status?: number;
  error?: string;
}

const ACCESS_TOKEN_HEADER = "X-Pv-Access-Token";
const PRO_TOKEN_HEADER = "X-Pv-Pro-Token";

/**
 * Constant-time string comparison to mitigate timing attacks.
 * Returns false immediately if lengths differ (length is not a secret).
 */
function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

function readHeader(req: Request, name: string): string | null {
  return req.headers.get(name) || req.headers.get(name.toLowerCase());
}

export function extractAccessToken(req: Request): string | null {
  const value = readHeader(req, ACCESS_TOKEN_HEADER);
  return value ? value.trim() : null;
}

export function extractProToken(req: Request): string | null {
  const value = readHeader(req, PRO_TOKEN_HEADER);
  return value ? value.trim() : null;
}

/**
 * Verify B2C dossier ownership via X-Pv-Access-Token.
 *
 * Returns:
 *   - { ok: true, dossier }      access granted (full row included)
 *   - { ok: false, status: 400 } dossier_id missing
 *   - { ok: false, status: 401 } token header missing
 *   - { ok: false, status: 403 } token mismatch
 *   - { ok: false, status: 404 } dossier not found
 *   - { ok: false, status: 410 } dossier expired
 *   - { ok: false, status: 500 } DB error
 *
 * supabase MUST be a service-role client (RLS bypass via BYPASSRLS).
 */
export async function verifyDossierAccess(
  req: Request,
  dossierId: string,
  supabase: SupabaseClient,
): Promise<AuthCheckResult> {
  if (!dossierId) {
    return { ok: false, status: 400, error: "dossier_id is required" };
  }

  const token = extractAccessToken(req);
  if (!token) {
    return { ok: false, status: 401, error: "Missing access token" };
  }

  const { data: dossier, error } = await supabase
    .from("pv_dossiers")
    .select("*")
    .eq("id", dossierId)
    .maybeSingle();

  if (error) {
    console.error("[auth] verifyDossierAccess fetch error:", error);
    return { ok: false, status: 500, error: "Failed to verify dossier access" };
  }

  if (!dossier) {
    return { ok: false, status: 404, error: "Dossier not found" };
  }

  if (dossier.expires_at && new Date(dossier.expires_at) < new Date()) {
    return { ok: false, status: 410, error: "Dossier expired" };
  }

  if (
    !dossier.access_token ||
    !constantTimeEqual(String(dossier.access_token), token)
  ) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, dossier };
}

/**
 * Verify B2B pro account ownership via X-Pv-Pro-Token.
 *
 * Same return contract as verifyDossierAccess (no expiry check — pro accounts
 * don't auto-expire).
 */
export async function verifyProAccess(
  req: Request,
  proAccountId: string,
  supabase: SupabaseClient,
): Promise<AuthCheckResult> {
  if (!proAccountId) {
    return { ok: false, status: 400, error: "pro_account_id is required" };
  }

  const token = extractProToken(req);
  if (!token) {
    return { ok: false, status: 401, error: "Missing pro token" };
  }

  const { data: account, error } = await supabase
    .from("pv_pro_accounts")
    .select("*")
    .eq("id", proAccountId)
    .maybeSingle();

  if (error) {
    console.error("[auth] verifyProAccess fetch error:", error);
    return { ok: false, status: 500, error: "Failed to verify pro access" };
  }

  if (!account) {
    return { ok: false, status: 404, error: "Pro account not found" };
  }

  if (
    !account.pro_token ||
    !constantTimeEqual(String(account.pro_token), token)
  ) {
    return { ok: false, status: 403, error: "Forbidden" };
  }

  return { ok: true, proAccount: account };
}

/**
 * Verify notary share access via share_token (passed in body, not header).
 * Used by pv-get-notary-data and any future notary-facing function.
 *
 * Returns:
 *   - { ok: true, dossier }      share valid (full row — caller filters columns)
 *   - { ok: false, status: 400 } share_token missing
 *   - { ok: false, status: 404 } share token not found
 *   - { ok: false, status: 410 } dossier expired
 *   - { ok: false, status: 500 } DB error
 */
export async function verifyShareToken(
  shareToken: string,
  supabase: SupabaseClient,
): Promise<AuthCheckResult> {
  if (!shareToken) {
    return { ok: false, status: 400, error: "share_token is required" };
  }

  const { data: dossier, error } = await supabase
    .from("pv_dossiers")
    .select("*")
    .eq("share_token", shareToken)
    .maybeSingle();

  if (error) {
    console.error("[auth] verifyShareToken fetch error:", error);
    return { ok: false, status: 500, error: "Failed to verify share token" };
  }

  if (!dossier) {
    return { ok: false, status: 404, error: "Share link not found" };
  }

  if (dossier.expires_at && new Date(dossier.expires_at) < new Date()) {
    return { ok: false, status: 410, error: "Share link expired" };
  }

  return { ok: true, dossier };
}
