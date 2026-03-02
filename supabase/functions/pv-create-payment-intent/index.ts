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

// POST requests need Content-Type for form-encoded body
function stripePostHeaders(key: string) {
  return {
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/x-www-form-urlencoded",
  };
}

// GET requests — no Content-Type needed
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
    // ACTION: validate-promo
    // Validates a promo code against Stripe
    // Supports: Promotion Codes AND Coupons (by name or ID)
    // =============================================
    if (action === "validate-promo") {
      const { promo_code } = body;
      if (!promo_code) {
        return jsonResponse({ valid: false, message: "Code promo requis" });
      }

      const code = promo_code.trim().toUpperCase();

      // List active Promotion Codes and match by code (case-insensitive)
      const promoRes = await fetch(
        `${STRIPE_BASE}/promotion_codes?active=true&limit=100`,
        { headers: stripeGetHeaders(stripeKey) },
      );

      const promos = promoRes.ok ? (await promoRes.json()).data || [] : [];
      const promo = promos.find((p: any) => p.code?.toUpperCase() === code);

      if (!promo) {
        return jsonResponse({ valid: false, message: "Code promo invalide" });
      }

      // Resolve coupon details for discount display
      let couponId = typeof promo.coupon === "string"
        ? promo.coupon
        : promo.coupon?.id;

      // List endpoint may omit coupon — fetch individual promo code
      if (!couponId) {
        const detailRes = await fetch(
          `${STRIPE_BASE}/promotion_codes/${promo.id}`,
          { headers: stripeGetHeaders(stripeKey) },
        );
        if (detailRes.ok) {
          const detail = await detailRes.json();
          couponId = typeof detail.coupon === "string"
            ? detail.coupon
            : detail.coupon?.id;
        }
      }

      if (couponId) {
        const cRes = await fetch(
          `${STRIPE_BASE}/coupons/${couponId}`,
          { headers: stripeGetHeaders(stripeKey) },
        );
        if (cRes.ok) {
          const c = await cRes.json();
          return jsonResponse({
            valid: true,
            promotion_code_id: promo.id,
            percent_off: c.percent_off ?? null,
            amount_off: c.amount_off ?? null,
            name: c.name || promo_code,
          });
        }
      }

      // Promo code matched but couldn't resolve coupon details — still valid
      return jsonResponse({
        valid: true,
        promotion_code_id: promo.id,
        percent_off: 100,
        amount_off: null,
        name: promo_code,
      });
    }

    // =============================================
    // ACTION: create-checkout
    // Creates a Stripe Checkout Session, returns URL
    // =============================================
    if (action === "create-checkout") {
      const { dossier_id, session_id, email, origin, promotion_code_id, coupon_id } = body;

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

      // Apply discount if provided, otherwise allow manual entry on Stripe page
      if (promotion_code_id) {
        params.set("discounts[0][promotion_code]", promotion_code_id);
      } else if (coupon_id) {
        params.set("discounts[0][coupon]", coupon_id);
      } else {
        params.set("allow_promotion_codes", "true");
      }

      const stripeRes = await fetch(`${STRIPE_BASE}/checkout/sessions`, {
        method: "POST",
        headers: stripePostHeaders(stripeKey),
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
        { headers: stripeGetHeaders(stripeKey) },
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

      if (paid && dossierId) {
        const supabase = getSupabase();
        if (supabase) {
          await supabase
            .from("pv_dossiers")
            .update({ status: "paid", current_step: 6 })
            .eq("id", dossierId);
        }
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
