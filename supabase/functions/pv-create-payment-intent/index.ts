import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, x-app-name, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const STRIPE_BASE = "https://api.stripe.com/v1";
const PRICE_ID = "price_1T5EwgQLEPjlJTgr4KMrsBpa";

function stripeHeaders(key: string) {
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
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
    // ACTION: validate-promo
    // Validates a promotion code against Stripe
    // =============================================
    if (action === "validate-promo") {
      const { promo_code } = body;

      if (!promo_code) {
        return jsonResponse({ valid: false, message: "Code promo requis" });
      }

      // Look up the promotion code in Stripe
      const params = new URLSearchParams({
        code: promo_code,
        active: "true",
        limit: "1",
      });

      const stripeRes = await fetch(
        `${STRIPE_BASE}/promotion_codes?${params.toString()}`,
        {
          method: "GET",
          headers: stripeHeaders(stripeKey),
        },
      );

      if (!stripeRes.ok) {
        console.error("[validate-promo] Stripe error:", await stripeRes.text());
        return jsonResponse({ valid: false, message: "Erreur de validation" });
      }

      const result = await stripeRes.json();
      const promoData = result.data?.[0];

      if (!promoData) {
        return jsonResponse({ valid: false, message: "Code promo invalide ou expiré" });
      }

      if (!promoData.active) {
        return jsonResponse({ valid: false, message: "Code promo expiré" });
      }

      // Check expiration
      if (promoData.expires_at && promoData.expires_at < Math.floor(Date.now() / 1000)) {
        return jsonResponse({ valid: false, message: "Code promo expiré" });
      }

      // Check max redemptions
      if (promoData.max_redemptions && promoData.times_redeemed >= promoData.max_redemptions) {
        return jsonResponse({ valid: false, message: "Code promo épuisé" });
      }

      const coupon = promoData.coupon;
      console.log(
        `[validate-promo] Valid: ${promo_code} → ${coupon.percent_off ? coupon.percent_off + "%" : (coupon.amount_off / 100) + "€"} off`,
      );

      return jsonResponse({
        valid: true,
        promotion_code_id: promoData.id,
        percent_off: coupon.percent_off || null,
        amount_off: coupon.amount_off || null,
        name: coupon.name || promo_code,
      });
    }

    // =============================================
    // ACTION: create-checkout
    // Creates a Stripe Checkout Session, returns URL
    // =============================================
    if (action === "create-checkout") {
      const { dossier_id, session_id, email, origin, promotion_code_id } = body;

      if (!dossier_id || !origin) {
        return jsonResponse({ error: "dossier_id and origin are required" }, 400);
      }

      const params = new URLSearchParams({
        mode: "payment",
        "line_items[0][price]": PRICE_ID,
        "line_items[0][quantity]": "1",
        success_url: `${origin}/payment/success?checkout_session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/payment/cancel`,
        "metadata[dossier_id]": dossier_id,
        "metadata[app_session_id]": session_id || "",
      });

      if (email) {
        params.set("customer_email", email);
      }

      // Apply promotion code if provided, otherwise allow entry on Stripe page
      if (promotion_code_id) {
        params.set("discounts[0][promotion_code]", promotion_code_id);
        console.log(`[create-checkout] Applying promo: ${promotion_code_id}`);
      } else {
        params.set("allow_promotion_codes", "true");
      }

      const stripeRes = await fetch(`${STRIPE_BASE}/checkout/sessions`, {
        method: "POST",
        headers: stripeHeaders(stripeKey),
        body: params,
      });

      if (!stripeRes.ok) {
        const err = await stripeRes.text();
        console.error("[create-checkout] Stripe error:", err);
        return jsonResponse({ error: "Checkout session creation failed" }, 500);
      }

      const session = await stripeRes.json();

      // Save Stripe session ID to dossier
      const supabase = getSupabase();
      if (supabase) {
        await supabase
          .from("pv_dossiers")
          .update({
            stripe_payment_intent_id: session.id,
            email: email || null,
          })
          .eq("id", dossier_id);
      }

      console.log(`[create-checkout] Session ${session.id} for dossier ${dossier_id}`);

      return jsonResponse({ url: session.url, sessionId: session.id });
    }

    // =============================================
    // ACTION: verify-checkout
    // Verifies payment status, updates dossier
    // =============================================
    if (action === "verify-checkout") {
      const { checkout_session_id } = body;

      if (!checkout_session_id) {
        return jsonResponse({ error: "checkout_session_id is required" }, 400);
      }

      const stripeRes = await fetch(
        `${STRIPE_BASE}/checkout/sessions/${checkout_session_id}`,
        {
          method: "GET",
          headers: stripeHeaders(stripeKey),
        },
      );

      if (!stripeRes.ok) {
        const err = await stripeRes.text();
        console.error("[verify-checkout] Stripe error:", err);
        return jsonResponse({ error: "Failed to verify checkout session" }, 500);
      }

      const session = await stripeRes.json();
      const paid = session.payment_status === "paid";
      const dossierId = session.metadata?.dossier_id;
      const appSessionId = session.metadata?.app_session_id;

      // Update dossier status if paid
      if (paid && dossierId) {
        const supabase = getSupabase();
        if (supabase) {
          await supabase
            .from("pv_dossiers")
            .update({ status: "paid", current_step: 6 })
            .eq("id", dossierId);
        }
        console.log(`[verify-checkout] Dossier ${dossierId} marked as paid`);
      }

      return jsonResponse({
        paid,
        dossier_id: dossierId,
        app_session_id: appSessionId,
      });
    }

    return jsonResponse({
      error: "Invalid action. Use 'create-checkout', 'validate-promo', or 'verify-checkout'",
    }, 400);
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse({
      error: "Internal server error",
      details: String(error),
    }, 500);
  }
});
