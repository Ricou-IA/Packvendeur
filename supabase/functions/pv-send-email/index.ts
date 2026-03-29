import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabase } from "../_shared/logging.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { sendEmail } from "../_shared/resend.ts";
import {
  postPurchaseEmail,
  reviewRequestEmail,
  cartAbandonmentEmail,
  expirationReminderEmail,
} from "../_shared/email-templates.ts";

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

/**
 * Format a date string to French format (ex: "5 avril 2026").
 */
function formatDateFr(dateStr: string | null): string {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, 405);
    }

    const { action, dossier_id } = await req.json();

    if (!action || !dossier_id) {
      return jsonResponse({ error: "action and dossier_id are required" }, 400);
    }

    const validActions = ["post-purchase", "review-request", "cart-abandonment", "expiration-reminder"];
    if (!validActions.includes(action)) {
      return jsonResponse({ error: `Invalid action. Use: ${validActions.join(", ")}` }, 400);
    }

    const supabase = getSupabase();
    if (!supabase) {
      return jsonResponse({ error: "Server configuration error (Supabase)" }, 500);
    }

    // Fetch dossier
    const { data: dossier, error: dossierError } = await supabase
      .from("pv_dossiers")
      .select("id, email, share_url, share_token, property_address, session_id, expires_at, status")
      .eq("id", dossier_id)
      .single();

    if (dossierError || !dossier) {
      return jsonResponse({ error: "Dossier not found" }, 404);
    }

    if (!dossier.email) {
      return jsonResponse({ success: false, error: "no_email", message: "Dossier has no email" });
    }

    // Map action to email_type for dedup
    const emailTypeMap: Record<string, string> = {
      "post-purchase": "post_purchase",
      "review-request": "review_request",
      "cart-abandonment": "cart_abandonment",
      "expiration-reminder": "expiration_reminder",
    };
    const emailType = emailTypeMap[action];

    // Check deduplication
    const { data: existing } = await supabase
      .from("pv_email_logs")
      .select("id")
      .eq("dossier_id", dossier_id)
      .eq("email_type", emailType)
      .eq("status", "sent")
      .maybeSingle();

    if (existing) {
      return jsonResponse({ success: true, skipped: true, reason: "already_sent" });
    }

    // Build email based on action
    let emailContent: { subject: string; html: string };
    const shareUrl = dossier.share_url || (dossier.share_token ? `https://pre-etat-date.ai/share/${dossier.share_token}` : "");

    switch (action) {
      case "post-purchase":
        emailContent = postPurchaseEmail({
          shareUrl,
          propertyAddress: dossier.property_address,
          expiresAt: formatDateFr(dossier.expires_at),
        });
        break;
      case "review-request":
        emailContent = reviewRequestEmail({
          propertyAddress: dossier.property_address,
        });
        break;
      case "cart-abandonment":
        emailContent = cartAbandonmentEmail({
          propertyAddress: dossier.property_address,
          resumeUrl: `https://pre-etat-date.ai/dossier/${dossier.session_id}`,
        });
        break;
      case "expiration-reminder":
        emailContent = expirationReminderEmail({
          shareUrl,
          propertyAddress: dossier.property_address,
          expiresAt: formatDateFr(dossier.expires_at),
        });
        break;
      default:
        return jsonResponse({ error: "Unknown action" }, 400);
    }

    // Send email
    const { data: resendResult, error: sendError } = await sendEmail({
      to: dossier.email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // Log to email_logs (handle dedup race condition gracefully)
    try {
      await supabase.from("pv_email_logs").insert({
        dossier_id,
        email_type: emailType,
        recipient_email: dossier.email,
        resend_id: resendResult?.id || null,
        status: sendError ? "failed" : "sent",
        error_message: sendError || null,
      });
    } catch (logError) {
      // Unique constraint violation = dedup race condition — safe to ignore
      console.warn("[pv-send-email] Log insert failed (likely dedup):", logError);
    }

    if (sendError) {
      console.error(`[pv-send-email] Failed to send ${action} for dossier ${dossier_id}:`, sendError);
      return jsonResponse({ success: false, error: sendError });
    }

    console.log(`[pv-send-email] Sent ${action} to ${dossier.email} for dossier ${dossier_id} (resend_id: ${resendResult?.id})`);
    return jsonResponse({ success: true, resend_id: resendResult?.id });

  } catch (error) {
    console.error("[pv-send-email] Error:", error);
    return jsonResponse({ error: "Internal server error", details: String(error) }, 500);
  }
});
