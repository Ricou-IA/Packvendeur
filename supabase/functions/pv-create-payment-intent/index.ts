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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Server configuration error (Stripe)" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json();
    const { action } = body;

    // =============================================
    // ACTION: create-checkout
    // Creates a Stripe Checkout Session, returns URL
    // =============================================
    if (action === "create-checkout") {
      const { dossier_id, session_id, email, origin } = body;

      if (!dossier_id || !origin) {
        return new Response(
          JSON.stringify({ error: "dossier_id and origin are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
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

      const stripeRes = await fetch(`${STRIPE_BASE}/checkout/sessions`, {
        method: "POST",
        headers: stripeHeaders(stripeKey),
        body: params,
      });

      if (!stripeRes.ok) {
        const err = await stripeRes.text();
        console.error("[create-checkout] Stripe error:", err);
        return new Response(
          JSON.stringify({ error: "Checkout session creation failed" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
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

      return new Response(
        JSON.stringify({ url: session.url, sessionId: session.id }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // =============================================
    // ACTION: verify-checkout
    // Verifies payment status, updates dossier
    // =============================================
    if (action === "verify-checkout") {
      const { checkout_session_id } = body;

      if (!checkout_session_id) {
        return new Response(
          JSON.stringify({ error: "checkout_session_id is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
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
        return new Response(
          JSON.stringify({ error: "Failed to verify checkout session" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
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

      return new Response(
        JSON.stringify({
          paid,
          dossier_id: dossierId,
          app_session_id: appSessionId,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        error: "Invalid action. Use 'create-checkout' or 'verify-checkout'",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: String(error),
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
