import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { verifyProAccess } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, x-app-name, apikey, content-type, x-pv-access-token, x-pv-pro-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const STRIPE_BASE = "https://api.stripe.com/v1";

// Credit packs: pack_type → { price_id, credits }
// TODO: Replace with actual Stripe Price IDs after creation in Dashboard
const CREDIT_PACKS: Record<string, { price_id: string; credits: number; label: string }> = {
  "1": {
    price_id: "price_pro_1_credit",   // TODO: Replace with real Stripe Price ID
    credits: 1,
    label: "1 credit",
  },
  "10": {
    price_id: "price_pro_10_credits", // TODO: Replace with real Stripe Price ID
    credits: 10,
    label: "10 credits",
  },
  "20": {
    price_id: "price_pro_20_credits", // TODO: Replace with real Stripe Price ID
    credits: 20,
    label: "20 credits",
  },
};

function stripePostHeaders(key: string) {
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

function stripeGetHeaders(key: string) {
  return { Authorization: `Bearer ${key}` };
}

function getSupabase() {
  const url = Deno.env.get("SUPABASE_URL");
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  return url && key ? createClient(url, key) : null;
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return jsonResponse({ error: "Server configuration error (Stripe)" }, 500);
    }

    const body = await req.json();
    const { action } = body;

    // =============================================
    // ACTION: create-checkout
    // Creates a Stripe Checkout Session for credit purchase
    // =============================================
    if (action === "create-checkout") {
      const { pro_account_id, pack_type, origin } = body;

      if (!pro_account_id || !pack_type) {
        return jsonResponse({ error: "pro_account_id and pack_type required" }, 400);
      }

      const pack = CREDIT_PACKS[pack_type];
      if (!pack) {
        return jsonResponse({ error: `Invalid pack_type: ${pack_type}` }, 400);
      }

      // Verify pro account ownership before creating Stripe session
      const supabaseAuth = getSupabase();
      if (!supabaseAuth) {
        return jsonResponse({ error: "Server configuration error" }, 500);
      }
      const auth = await verifyProAccess(req, pro_account_id, supabaseAuth);
      if (!auth.ok) return jsonResponse({ error: auth.error! }, auth.status!);

      // Fetch pro account email for Stripe pre-fill
      const supabase = getSupabase();
      let customerEmail = "";
      if (supabase) {
        const { data: account } = await supabase
          .from("pv_pro_accounts")
          .select("email")
          .eq("id", pro_account_id)
          .single();
        customerEmail = account?.email || "";
      }

      const successUrl = `${origin || "https://pre-etat-date.ai"}/pro/credits/success?checkout_session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin || "https://pre-etat-date.ai"}/pro/credits`;

      // Build form-encoded body
      const params = new URLSearchParams();
      params.append("mode", "payment");
      params.append("line_items[0][price]", pack.price_id);
      params.append("line_items[0][quantity]", "1");
      params.append("success_url", successUrl);
      params.append("cancel_url", cancelUrl);
      params.append("metadata[pro_account_id]", pro_account_id);
      params.append("metadata[credits_count]", String(pack.credits));
      params.append("metadata[pack_type]", pack_type);
      if (customerEmail) {
        params.append("customer_email", customerEmail);
      }

      const sessionRes = await fetch(`${STRIPE_BASE}/checkout/sessions`, {
        method: "POST",
        headers: stripePostHeaders(stripeKey),
        body: params.toString(),
      });

      if (!sessionRes.ok) {
        const err = await sessionRes.json();
        console.error("[pv-pro-credits] Stripe session error:", err);
        return jsonResponse(
          { error: "Failed to create checkout session", details: err.error?.message },
          500,
        );
      }

      const session = await sessionRes.json();
      return jsonResponse({ url: session.url, sessionId: session.id });
    }

    // =============================================
    // ACTION: verify-checkout
    // Verifies payment and adds credits to pro account
    // =============================================
    if (action === "verify-checkout") {
      const { checkout_session_id } = body;

      if (!checkout_session_id) {
        return jsonResponse({ error: "checkout_session_id required" }, 400);
      }

      // Retrieve Stripe Checkout Session
      const sessionRes = await fetch(
        `${STRIPE_BASE}/checkout/sessions/${checkout_session_id}`,
        { headers: stripeGetHeaders(stripeKey) },
      );

      if (!sessionRes.ok) {
        return jsonResponse({ error: "Failed to retrieve checkout session" }, 500);
      }

      const session = await sessionRes.json();

      if (session.payment_status !== "paid") {
        return jsonResponse({ paid: false, message: "Payment not completed" });
      }

      const proAccountId = session.metadata?.pro_account_id;
      const creditsCount = parseInt(session.metadata?.credits_count || "0", 10);

      if (!proAccountId || creditsCount <= 0) {
        return jsonResponse({ error: "Invalid session metadata" }, 400);
      }

      const supabase = getSupabase();
      if (!supabase) {
        return jsonResponse({ error: "Server configuration error (DB)" }, 500);
      }

      // Check if already processed (idempotency via stripe_session_id)
      const { data: existingTx } = await supabase
        .from("pv_pro_credit_transactions")
        .select("id")
        .eq("stripe_session_id", checkout_session_id)
        .single();

      if (existingTx) {
        // Already processed — return current balance
        const { data: account } = await supabase
          .from("pv_pro_accounts")
          .select("credits")
          .eq("id", proAccountId)
          .single();

        return jsonResponse({
          paid: true,
          credits_added: creditsCount,
          new_balance: account?.credits || 0,
          already_processed: true,
        });
      }

      // Read current credits
      const { data: account, error: readErr } = await supabase
        .from("pv_pro_accounts")
        .select("credits")
        .eq("id", proAccountId)
        .single();

      if (readErr || !account) {
        return jsonResponse({ error: "Pro account not found" }, 404);
      }

      const newBalance = (account.credits || 0) + creditsCount;

      // Update credits
      const { error: updateErr } = await supabase
        .from("pv_pro_accounts")
        .update({ credits: newBalance, updated_at: new Date().toISOString() })
        .eq("id", proAccountId);

      if (updateErr) {
        console.error("[pv-pro-credits] Update credits error:", updateErr);
        return jsonResponse({ error: "Failed to update credits" }, 500);
      }

      // Log transaction
      const { error: txErr } = await supabase
        .from("pv_pro_credit_transactions")
        .insert({
          pro_account_id: proAccountId,
          amount: creditsCount,
          balance_after: newBalance,
          type: "purchase",
          description: `Achat ${creditsCount} credit${creditsCount > 1 ? "s" : ""}`,
          stripe_session_id: checkout_session_id,
        });

      if (txErr) {
        console.error("[pv-pro-credits] Transaction log error:", txErr);
        // Non-blocking: credits are already added
      }

      return jsonResponse({
        paid: true,
        credits_added: creditsCount,
        new_balance: newBalance,
      });
    }

    return jsonResponse({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    console.error("[pv-pro-credits] Unhandled error:", err);
    return jsonResponse({ error: "Internal server error" }, 500);
  }
});
