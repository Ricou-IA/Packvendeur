import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { getSupabase } from "../_shared/logging.ts";
import { sendEmail } from "../_shared/resend.ts";
import {
  reviewRequestEmail,
  cartAbandonmentEmail,
  expirationReminderEmail,
} from "../_shared/email-templates.ts";

const MAX_EMAILS_PER_TYPE = 10;

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

// deno-lint-ignore no-explicit-any
async function logEmail(supabase: any, dossierId: string, emailType: string, email: string, resendId: string | null, error: string | null) {
  try {
    await supabase.from("pv_email_logs").insert({
      dossier_id: dossierId,
      email_type: emailType,
      recipient_email: email,
      resend_id: resendId,
      status: error ? "failed" : "sent",
      error_message: error,
    });
  } catch (e) {
    console.warn(`[pv-email-cron] Log insert failed for ${emailType}/${dossierId}:`, e);
  }
}

Deno.serve(async (req: Request) => {
  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify cron secret
    const cronSecret = req.headers.get("x-cron-secret");
    const expectedSecret = Deno.env.get("CRON_SECRET");
    if (expectedSecret && cronSecret !== expectedSecret) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return new Response(JSON.stringify({ error: "Server config error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const results = { review_sent: 0, cart_sent: 0, expiration_sent: 0, errors: [] as string[] };
    const now = new Date();

    // ============================================================
    // 1. Review requests: J+3 after payment
    // Dossiers paid 3-10 days ago, with email, not already sent
    // ============================================================
    try {
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const tenDaysAgo = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString();

      const { data: reviewDossiers } = await supabase
        .from("pv_dossiers")
        .select("id, email, property_address")
        .in("status", ["paid", "completed"])
        .not("email", "is", null)
        .gte("paid_at", tenDaysAgo)
        .lte("paid_at", threeDaysAgo)
        .limit(MAX_EMAILS_PER_TYPE * 2); // fetch extra, filter after dedup

      if (reviewDossiers?.length) {
        // Get already-sent review emails
        const dossierIds = reviewDossiers.map((d: { id: string }) => d.id);
        const { data: sentLogs } = await supabase
          .from("pv_email_logs")
          .select("dossier_id")
          .in("dossier_id", dossierIds)
          .eq("email_type", "review_request")
          .eq("status", "sent");

        const sentSet = new Set((sentLogs || []).map((l: { dossier_id: string }) => l.dossier_id));
        const toSend = reviewDossiers.filter((d: { id: string }) => !sentSet.has(d.id)).slice(0, MAX_EMAILS_PER_TYPE);

        for (const dossier of toSend) {
          const { subject, html } = reviewRequestEmail({
            propertyAddress: dossier.property_address,
          });
          const { data: result, error } = await sendEmail({ to: dossier.email, subject, html });
          await logEmail(supabase, dossier.id, "review_request", dossier.email, result?.id || null, error);
          if (!error) results.review_sent++;
          else results.errors.push(`review/${dossier.id}: ${error}`);
        }
      }
    } catch (e) {
      results.errors.push(`review_batch: ${String(e)}`);
    }

    // ============================================================
    // 2. Cart abandonment: J+1 after creation, unpaid
    // Dossiers created 1-5 days ago, not paid, with email
    // ============================================================
    try {
      const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString();
      const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString();

      const { data: cartDossiers } = await supabase
        .from("pv_dossiers")
        .select("id, email, property_address, session_id")
        .in("status", ["draft", "analyzing", "pending_validation", "validated"])
        .not("email", "is", null)
        .gte("created_at", fiveDaysAgo)
        .lte("created_at", oneDayAgo)
        .limit(MAX_EMAILS_PER_TYPE * 2);

      if (cartDossiers?.length) {
        const dossierIds = cartDossiers.map((d: { id: string }) => d.id);
        const { data: sentLogs } = await supabase
          .from("pv_email_logs")
          .select("dossier_id")
          .in("dossier_id", dossierIds)
          .eq("email_type", "cart_abandonment")
          .eq("status", "sent");

        const sentSet = new Set((sentLogs || []).map((l: { dossier_id: string }) => l.dossier_id));
        const toSend = cartDossiers.filter((d: { id: string }) => !sentSet.has(d.id)).slice(0, MAX_EMAILS_PER_TYPE);

        for (const dossier of toSend) {
          const { subject, html } = cartAbandonmentEmail({
            propertyAddress: dossier.property_address,
            resumeUrl: `https://pre-etat-date.ai/dossier/${dossier.session_id}`,
          });
          const { data: result, error } = await sendEmail({ to: dossier.email, subject, html });
          await logEmail(supabase, dossier.id, "cart_abandonment", dossier.email, result?.id || null, error);
          if (!error) results.cart_sent++;
          else results.errors.push(`cart/${dossier.id}: ${error}`);
        }
      }
    } catch (e) {
      results.errors.push(`cart_batch: ${String(e)}`);
    }

    // ============================================================
    // 3. Expiration reminders: J+5 (2 days before expires_at)
    // Completed dossiers expiring within 2 days, with email + share
    // ============================================================
    try {
      const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString();

      const { data: expiringDossiers } = await supabase
        .from("pv_dossiers")
        .select("id, email, property_address, share_url, share_token, expires_at")
        .in("status", ["paid", "completed"])
        .not("email", "is", null)
        .not("share_token", "is", null)
        .gte("expires_at", now.toISOString())
        .lte("expires_at", twoDaysFromNow)
        .limit(MAX_EMAILS_PER_TYPE * 2);

      if (expiringDossiers?.length) {
        const dossierIds = expiringDossiers.map((d: { id: string }) => d.id);
        const { data: sentLogs } = await supabase
          .from("pv_email_logs")
          .select("dossier_id")
          .in("dossier_id", dossierIds)
          .eq("email_type", "expiration_reminder")
          .eq("status", "sent");

        const sentSet = new Set((sentLogs || []).map((l: { dossier_id: string }) => l.dossier_id));
        const toSend = expiringDossiers.filter((d: { id: string }) => !sentSet.has(d.id)).slice(0, MAX_EMAILS_PER_TYPE);

        for (const dossier of toSend) {
          const shareUrl = dossier.share_url || `https://pre-etat-date.ai/share/${dossier.share_token}`;
          const { subject, html } = expirationReminderEmail({
            shareUrl,
            propertyAddress: dossier.property_address,
            expiresAt: formatDateFr(dossier.expires_at),
          });
          const { data: result, error } = await sendEmail({ to: dossier.email, subject, html });
          await logEmail(supabase, dossier.id, "expiration_reminder", dossier.email, result?.id || null, error);
          if (!error) results.expiration_sent++;
          else results.errors.push(`expiration/${dossier.id}: ${error}`);
        }
      }
    } catch (e) {
      results.errors.push(`expiration_batch: ${String(e)}`);
    }

    const total = results.review_sent + results.cart_sent + results.expiration_sent;
    console.log(`[pv-email-cron] Sent ${total} emails (review: ${results.review_sent}, cart: ${results.cart_sent}, expiration: ${results.expiration_sent})`);
    if (results.errors.length) {
      console.error(`[pv-email-cron] Errors:`, results.errors);
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("[pv-email-cron] Fatal error:", error);
    return new Response(JSON.stringify({ error: "Internal server error", details: String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
