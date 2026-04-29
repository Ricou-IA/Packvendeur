import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import { verifyDossierAccess } from "../_shared/auth.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, x-app-name, apikey, content-type, x-pv-access-token, x-pv-pro-token",
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

      // Verify dossier ownership before creating Stripe session
      const supabaseAuth = getSupabase();
      if (!supabaseAuth) {
        return jsonResponse({ error: "Server configuration error" }, 500);
      }
      const auth = await verifyDossierAccess(req, dossier_id, supabaseAuth);
      if (!auth.ok) return jsonResponse({ error: auth.error! }, auth.status!);

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

      // Save email to dossier. We intentionally do NOT write session.id (cs_...)
      // to stripe_payment_intent_id — that column should only hold the actual
      // PaymentIntent id (pi_...), which is set by verify-checkout below.
      const supabase = getSupabase();
      if (supabase) {
        await supabase
          .from("pv_dossiers")
          .update({
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
        if (!supabase) {
          console.error("[verify-checkout] Server config error (Supabase client unavailable)", {
            dossier_id: dossierId,
            checkout_session_id,
          });
          return jsonResponse({ error: "Server configuration error" }, 500);
        }

        // Read current share_token to keep it immutable across replays.
        // verify-checkout is idempotent: a user reloading /payment/success
        // must NOT regenerate the share_token, which would invalidate any
        // link already copied / sent to a notary.
        const { data: existing, error: readErr } = await supabase
          .from("pv_dossiers")
          .select("share_token, share_url")
          .eq("id", dossierId)
          .maybeSingle();

        if (readErr) {
          console.error("[verify-checkout] Failed to read existing dossier state", {
            dossier_id: dossierId,
            checkout_session_id,
            error: readErr,
          });
          return jsonResponse({ error: "Failed to read dossier state" }, 500);
        }

        // Build the UPDATE payload. Only include share_token/share_url
        // if they don't exist yet — otherwise the existing values stand.
        const updatePayload: Record<string, unknown> = {
          status: "paid",
          // Pay-first funnel: after payment, the user lands on Step 4
          // (Processing) where extraction is triggered. Validation and
          // delivery are steps 5 and 6.
          current_step: 4,
          stripe_payment_intent_id: session.payment_intent || session.id,
          stripe_payment_status: "paid",
          amount_paid: session.amount_total ? session.amount_total / 100 : null,
          paid_at: new Date(session.created * 1000).toISOString(),
        };

        if (!existing?.share_token) {
          const shareToken = crypto.randomUUID().replace(/-/g, "");
          updatePayload.share_token = shareToken;
          updatePayload.share_url = `https://pre-etat-date.ai/share/${shareToken}`;
        }

        const { error: updateErr } = await supabase
          .from("pv_dossiers")
          .update(updatePayload)
          .eq("id", dossierId);

        if (updateErr) {
          // Money-loss path: Stripe says paid, DB says draft. Surface the
          // failure so the frontend can retry verify-checkout (now safely
          // idempotent thanks to the share_token guard above) instead of
          // advancing the user past payment.
          console.error("[verify-checkout] DB update failed after Stripe confirmation", {
            dossier_id: dossierId,
            checkout_session_id,
            error: updateErr,
          });
          return jsonResponse({ error: "Failed to confirm payment in DB" }, 500);
        }

        // Fire-and-forget post-purchase email — ONLY if the DB UPDATE succeeded.
        // Otherwise we'd send a confirmation email referencing a share link
        // that doesn't exist in the DB yet.
        const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
        const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
        if (SUPABASE_URL && SERVICE_KEY) {
          fetch(`${SUPABASE_URL}/functions/v1/pv-send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${SERVICE_KEY}`,
            },
            body: JSON.stringify({
              action: "post-purchase",
              dossier_id: dossierId,
            }),
          }).catch((e) =>
            console.error("[verify-checkout] Email trigger failed:", e)
          );
        }
      }

      return jsonResponse({
        paid,
        dossier_id: dossierId,
        app_session_id: appSessionId,
      });
    }

    // =============================================
    // ACTION: dev-mark-paid (DEV / STAGING ONLY)
    // Bypasse Stripe pour marquer un dossier payé en dev.
    // Sécurité :
    //   1. Gated by env var ALLOW_DEV_MARK_PAID === 'true'
    //   2. Auth via X-Pv-Access-Token (le user doit posséder le dossier)
    //   3. Refuse si un vrai stripe_payment_intent_id existe déjà
    //      (ne peut pas écraser un paiement réel)
    //   4. Marque payment_intent_id avec préfixe TEST_SKIP_ pour traçabilité
    //
    // Raison d'être : pv-dossier interdit l'update de stripe_payment_status
    // (FORBIDDEN_UPDATE_COLUMNS) — le test-skip côté client ne peut donc pas
    // mettre le dossier dans l'état complet attendu par pv-run-extraction
    // (status='paid' ET stripe_payment_status='paid'). Sans ça, l'orchestrateur
    // d'extraction renvoie 402 et le client boucle.
    // =============================================
    if (action === "dev-mark-paid") {
      if (Deno.env.get("ALLOW_DEV_MARK_PAID") !== "true") {
        return jsonResponse({ error: "Test endpoint disabled in this environment" }, 403);
      }

      const { dossier_id } = body;
      if (!dossier_id) {
        return jsonResponse({ error: "dossier_id is required" }, 400);
      }

      const supabase = getSupabase();
      if (!supabase) {
        return jsonResponse({ error: "Server configuration error" }, 500);
      }

      // Auth: le user doit posséder le dossier
      const auth = await verifyDossierAccess(req, dossier_id, supabase);
      if (!auth.ok) return jsonResponse({ error: auth.error! }, auth.status!);

      const dossier = auth.dossier;

      // Anti-overwrite: refuse si un vrai paiement Stripe existe déjà
      const existingPi = dossier.stripe_payment_intent_id as string | null;
      if (existingPi && !existingPi.startsWith("TEST_SKIP_")) {
        return jsonResponse({
          error: "This dossier already has a real Stripe payment — refusing to override",
        }, 409);
      }
      if (dossier.stripe_payment_status === "paid" && !existingPi?.startsWith("TEST_SKIP_")) {
        return jsonResponse({
          error: "Dossier already paid",
        }, 409);
      }

      // Build update payload (same shape as verify-checkout)
      const updatePayload: Record<string, unknown> = {
        status: "paid",
        current_step: 4,
        stripe_payment_intent_id: `TEST_SKIP_${Date.now()}`,
        stripe_payment_status: "paid",
        amount_paid: 0,
        paid_at: new Date().toISOString(),
      };

      // Generate share_token only if it doesn't exist yet (idempotent)
      if (!dossier.share_token) {
        const shareToken = crypto.randomUUID().replace(/-/g, "");
        updatePayload.share_token = shareToken;
        updatePayload.share_url = `https://pre-etat-date.ai/share/${shareToken}`;
      }

      const { error: updateErr } = await supabase
        .from("pv_dossiers")
        .update(updatePayload)
        .eq("id", dossier_id);

      if (updateErr) {
        console.error("[dev-mark-paid] DB update failed:", { dossier_id, error: updateErr });
        return jsonResponse({ error: "Failed to mark dossier as paid" }, 500);
      }

      console.log("[dev-mark-paid] Marked dossier as paid (test mode):", { dossier_id });
      return jsonResponse({ ok: true, dossier_id });
    }

    return jsonResponse({
      error: "Invalid action. Use 'create-checkout', 'validate-promo', 'verify-checkout', or 'dev-mark-paid'",
    }, 400);
  } catch (error) {
    console.error("Error:", error);
    return jsonResponse({
      error: "Internal server error",
      details: String(error),
    }, 500);
  }
});
