import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { getSupabase } from "../_shared/logging.ts";
import { verifyProAccess } from "../_shared/auth.ts";

// =============================================================
// pv-pro — B2B pro account CRUD + dossier flows
// =============================================================
// All actions except `create-account` require X-Pv-Pro-Token.
//
// Actions:
//   - create-account     (no auth) : INSERT pro_accounts, génère pro_token
//   - get-account                  : récupère le compte courant
//   - update-account               : modifie email/company_name (pas pro_token ni credits)
//   - upload-logo                  : upload PNG/JPEG/WebP dans le bucket
//   - get-logo-url                 : signed URL du logo (1h)
//   - list-dossiers                : SELECT dossiers du pro
//   - create-dossier               : INSERT dossier B2B (génère upload_token)
//   - list-transactions            : 50 dernières transactions de crédit
//   - consume-credit               : -1 crédit + INSERT transaction (type=usage)
// =============================================================

const BUCKET = "pack-vendeur";

const FORBIDDEN_ACCOUNT_UPDATES = [
  "id",
  "pro_token",
  "credits",
  "created_at",
  "updated_at",
];

function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
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

  const { action } = body;

  try {
    // ========== create-account — no auth ==========
    if (action === "create-account") {
      const { email, company_name } = body;
      if (!email || typeof email !== "string" || !email.includes("@")) {
        return corsResponse({ error: "email is required and must be valid" }, 400);
      }
      if (!company_name || typeof company_name !== "string") {
        return corsResponse({ error: "company_name is required" }, 400);
      }

      // Idempotency par email : on refuse si déjà inscrit
      const { data: existing } = await supabase
        .from("pv_pro_accounts")
        .select("id")
        .eq("email", email)
        .maybeSingle();
      if (existing) {
        return corsResponse({ error: "Email already registered" }, 409);
      }

      const proToken = crypto.randomUUID();

      const { data: account, error } = await supabase
        .from("pv_pro_accounts")
        .insert({ email, company_name, pro_token: proToken })
        .select()
        .single();

      if (error) {
        console.error("[pv-pro] create-account error:", error);
        return corsResponse({ error: "Failed to create account" }, 500);
      }

      return corsResponse({ account, pro_token: proToken });
    }

    // ============== Toutes les autres actions exigent l'auth pro ==============
    const { pro_account_id } = body;
    const auth = await verifyProAccess(req, pro_account_id, supabase);
    if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);
    const account = auth.proAccount;

    // ========== get-account ==========
    if (action === "get-account") {
      return corsResponse({ account });
    }

    // ========== update-account ==========
    if (action === "update-account") {
      const { updates } = body;
      const safe: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(updates || {})) {
        if (!FORBIDDEN_ACCOUNT_UPDATES.includes(k)) safe[k] = v;
      }
      safe.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from("pv_pro_accounts")
        .update(safe)
        .eq("id", pro_account_id)
        .select()
        .single();

      if (error) {
        console.error("[pv-pro] update-account error:", error);
        return corsResponse({ error: "Failed to update account" }, 500);
      }
      return corsResponse({ account: data });
    }

    // ========== upload-logo ==========
    if (action === "upload-logo") {
      const { file_base64, file_type } = body;
      if (!file_base64) {
        return corsResponse({ error: "file_base64 is required" }, 400);
      }
      const allowed = ["image/png", "image/jpeg", "image/webp"];
      const mime = file_type || "image/png";
      if (!allowed.includes(mime)) {
        return corsResponse(
          { error: `Unsupported logo type: ${mime}` },
          400,
        );
      }

      const ext =
        mime === "image/jpeg" ? "jpg" : mime === "image/webp" ? "webp" : "png";
      const path = `pro/${pro_account_id}/logo.${ext}`;
      const bytes = base64ToBytes(file_base64);

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, bytes, {
          cacheControl: "3600",
          upsert: true,
          contentType: mime,
        });

      if (uploadError) {
        console.error("[pv-pro] upload-logo storage error:", uploadError);
        return corsResponse({ error: "Failed to upload logo" }, 500);
      }

      const { data, error } = await supabase
        .from("pv_pro_accounts")
        .update({ logo_path: path, updated_at: new Date().toISOString() })
        .eq("id", pro_account_id)
        .select()
        .single();

      if (error) {
        console.error("[pv-pro] upload-logo update error:", error);
        return corsResponse({ error: "Failed to update logo path" }, 500);
      }
      return corsResponse({ account: data });
    }

    // ========== get-logo-url ==========
    if (action === "get-logo-url") {
      if (!account.logo_path) {
        return corsResponse({ signed_url: null });
      }
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(account.logo_path, 3600);

      if (error) {
        console.error("[pv-pro] get-logo-url error:", error);
        return corsResponse({ error: "Failed to generate logo URL" }, 500);
      }
      return corsResponse({ signed_url: data.signedUrl });
    }

    // ========== list-dossiers ==========
    if (action === "list-dossiers") {
      const { data, error } = await supabase
        .from("pv_dossiers")
        .select("*, pv_documents(count)")
        .eq("pro_account_id", pro_account_id)
        .order("updated_at", { ascending: false });

      if (error) {
        console.error("[pv-pro] list-dossiers error:", error);
        return corsResponse({ error: "Failed to list dossiers" }, 500);
      }
      return corsResponse({ dossiers: data || [] });
    }

    // ========== create-dossier ==========
    if (action === "create-dossier") {
      const { client_data = {} } = body;
      const uploadToken = crypto.randomUUID().replace(/-/g, "");
      const sessionId = crypto.randomUUID();

      const { data, error } = await supabase
        .from("pv_dossiers")
        .insert({
          session_id: sessionId,
          pro_account_id,
          upload_token: uploadToken,
          created_by: "agent",
          status: "draft",
          current_step: 1,
          client_name: client_data.client_name || null,
          client_email: client_data.client_email || null,
          client_phone: client_data.client_phone || null,
          property_address: client_data.property_address || null,
          property_city: client_data.property_city || null,
          property_postal_code: client_data.property_postal_code || null,
          property_lot_number: client_data.property_lot_number || null,
          pro_notes: client_data.pro_notes || null,
        })
        .select()
        .single();

      if (error) {
        console.error("[pv-pro] create-dossier error:", error);
        return corsResponse({ error: "Failed to create dossier" }, 500);
      }
      return corsResponse({ dossier: data });
    }

    // ========== list-transactions ==========
    if (action === "list-transactions") {
      const { data, error } = await supabase
        .from("pv_pro_credit_transactions")
        .select("*")
        .eq("pro_account_id", pro_account_id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("[pv-pro] list-transactions error:", error);
        return corsResponse({ error: "Failed to list transactions" }, 500);
      }
      return corsResponse({ transactions: data || [] });
    }

    // ========== get-dossier (B2B : pro consulte un dossier qui lui appartient) ==========
    if (action === "get-dossier") {
      const { dossier_id } = body;
      if (!dossier_id) {
        return corsResponse({ error: "dossier_id is required" }, 400);
      }
      const { data: dossier, error } = await supabase
        .from("pv_dossiers")
        .select("*")
        .eq("id", dossier_id)
        .maybeSingle();
      if (error) {
        console.error("[pv-pro] get-dossier error:", error);
        return corsResponse({ error: "Failed to fetch dossier" }, 500);
      }
      if (!dossier) {
        return corsResponse({ error: "Dossier not found" }, 404);
      }
      if (dossier.pro_account_id !== pro_account_id) {
        return corsResponse({ error: "Forbidden" }, 403);
      }
      return corsResponse({ dossier });
    }

    // ========== update-dossier (B2B : pro modifie un dossier qui lui appartient) ==========
    if (action === "update-dossier") {
      const { dossier_id, updates } = body;
      if (!dossier_id) {
        return corsResponse({ error: "dossier_id is required" }, 400);
      }
      const { data: existing } = await supabase
        .from("pv_dossiers")
        .select("id, pro_account_id")
        .eq("id", dossier_id)
        .maybeSingle();
      if (!existing || existing.pro_account_id !== pro_account_id) {
        return corsResponse({ error: "Forbidden" }, 403);
      }

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
        .eq("id", dossier_id)
        .select()
        .single();
      if (error) {
        console.error("[pv-pro] update-dossier error:", error);
        return corsResponse({ error: "Failed to update dossier" }, 500);
      }
      return corsResponse({ dossier: data });
    }

    // ========== list-documents (B2B : docs d'un dossier du pro) ==========
    if (action === "list-documents") {
      const { dossier_id } = body;
      if (!dossier_id) {
        return corsResponse({ error: "dossier_id is required" }, 400);
      }
      const { data: existing } = await supabase
        .from("pv_dossiers")
        .select("id, pro_account_id")
        .eq("id", dossier_id)
        .maybeSingle();
      if (!existing || existing.pro_account_id !== pro_account_id) {
        return corsResponse({ error: "Forbidden" }, 403);
      }
      const { data, error } = await supabase
        .from("pv_documents")
        .select("*")
        .eq("dossier_id", dossier_id)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) {
        console.error("[pv-pro] list-documents error:", error);
        return corsResponse({ error: "Failed to list documents" }, 500);
      }
      return corsResponse({ documents: data || [] });
    }

    // ========== signed-url-document (B2B : URL signée d'un doc du pro) ==========
    if (action === "signed-url-document") {
      const { dossier_id, storage_path, expires_in } = body;
      if (!dossier_id || !storage_path) {
        return corsResponse({ error: "dossier_id and storage_path required" }, 400);
      }
      const { data: existing } = await supabase
        .from("pv_dossiers")
        .select("id, pro_account_id")
        .eq("id", dossier_id)
        .maybeSingle();
      if (!existing || existing.pro_account_id !== pro_account_id) {
        return corsResponse({ error: "Forbidden" }, 403);
      }
      if (!storage_path.startsWith(`${dossier_id}/`)) {
        return corsResponse({ error: "Forbidden path" }, 403);
      }
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(storage_path, expires_in || 600);
      if (error) {
        console.error("[pv-pro] signed-url-document error:", error);
        return corsResponse({ error: "Failed to create signed URL" }, 500);
      }
      return corsResponse({ signed_url: data.signedUrl });
    }

    // ========== consume-credit ==========
    if (action === "consume-credit") {
      const { dossier_id } = body;
      if ((account.credits || 0) < 1) {
        return corsResponse({ error: "Insufficient credits" }, 402);
      }
      const newBalance = (account.credits || 0) - 1;

      const { error: updateErr } = await supabase
        .from("pv_pro_accounts")
        .update({ credits: newBalance, updated_at: new Date().toISOString() })
        .eq("id", pro_account_id);

      if (updateErr) {
        console.error("[pv-pro] consume-credit update error:", updateErr);
        return corsResponse({ error: "Failed to consume credit" }, 500);
      }

      // Log transaction (non-bloquant)
      await supabase
        .from("pv_pro_credit_transactions")
        .insert({
          pro_account_id,
          amount: -1,
          balance_after: newBalance,
          type: "usage",
          description: "Generation pack vendeur",
          dossier_id: dossier_id || null,
        })
        .then(({ error }: { error: unknown }) => {
          if (error) console.error("[pv-pro] consume-credit tx log error:", error);
        });

      return corsResponse({ credits: newBalance });
    }

    return corsResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    console.error("[pv-pro] handler error:", err);
    return corsResponse({ error: "Internal server error" }, 500);
  }
});
