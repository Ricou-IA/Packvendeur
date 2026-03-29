/**
 * Resend API wrapper for sending transactional emails.
 * Follows the { data, error } pattern used throughout the codebase.
 */

const FROM_EMAIL = "Pre-etat-date.ai <noreply@pre-etat-date.ai>";
const REPLY_TO = "contact@pre-etat-date.ai";
const RESEND_API_URL = "https://api.resend.com/emails";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export interface SendEmailResult {
  data: { id: string } | null;
  error: string | null;
}

/**
 * Send a single email via Resend API.
 * Never throws — returns { data, error }.
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = Deno.env.get("RESEND_API_KEY");
  if (!apiKey) {
    return { data: null, error: "RESEND_API_KEY not configured" };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
        reply_to: params.replyTo || REPLY_TO,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("[resend] API error:", response.status, errorBody);
      return { data: null, error: `Resend API ${response.status}: ${errorBody}` };
    }

    const result = await response.json();
    return { data: { id: result.id }, error: null };
  } catch (e) {
    console.error("[resend] Network error:", e);
    return { data: null, error: `Network error: ${String(e)}` };
  }
}
