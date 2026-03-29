/**
 * HTML email templates for Pack Vendeur transactional emails.
 * All text in French. Inline CSS only (email-safe).
 */

const SITE_URL = "https://pre-etat-date.ai";
const BRAND_COLOR = "#1e40af"; // blue-800
const CTA_COLOR = "#2563eb"; // blue-600

function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;width:100%;">
  <!-- Header -->
  <tr><td style="background-color:#ffffff;padding:20px 32px;text-align:center;border-bottom:3px solid ${BRAND_COLOR};">
    <a href="${SITE_URL}" style="text-decoration:none;">
      <img src="${SITE_URL}/logo.png" alt="Pre-etat-date.ai" width="120" style="display:inline-block;max-width:120px;height:auto;" />
    </a>
  </td></tr>
  <!-- Content -->
  <tr><td style="padding:32px;">
    ${content}
  </td></tr>
  <!-- Footer -->
  <tr><td style="padding:20px 32px;background-color:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
    <p style="margin:0;font-size:12px;color:#6b7280;line-height:1.5;">
      Pre-etat-date.ai — Votre pre-etat date en ligne<br>
      <a href="${SITE_URL}" style="color:${CTA_COLOR};text-decoration:none;">pre-etat-date.ai</a> |
      <a href="mailto:contact@pre-etat-date.ai" style="color:${CTA_COLOR};text-decoration:none;">contact@pre-etat-date.ai</a>
    </p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function ctaButton(text: string, url: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px auto;">
<tr><td style="background-color:${CTA_COLOR};border-radius:6px;text-align:center;">
  <a href="${url}" style="display:inline-block;padding:14px 28px;color:#ffffff;font-size:16px;font-weight:bold;text-decoration:none;">${text}</a>
</td></tr>
</table>`;
}

// ============================================================
// Template 1: Post-purchase email
// ============================================================
export function postPurchaseEmail(params: {
  shareUrl: string;
  propertyAddress?: string;
  expiresAt?: string;
}): { subject: string; html: string } {
  const address = params.propertyAddress || "votre bien";
  const expiryText = params.expiresAt
    ? `<p style="margin:16px 0;font-size:14px;color:#dc2626;"><strong>Important :</strong> Vos documents seront automatiquement supprimes le ${params.expiresAt} conformement au RGPD. Pensez a les telecharger avant cette date.</p>`
    : "";

  const html = baseTemplate(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Votre pre-etat date est pret !</h1>
    <p style="margin:0 0 8px;font-size:16px;color:#374151;line-height:1.6;">
      Bonjour,
    </p>
    <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
      Votre dossier pour <strong>${address}</strong> a ete genere avec succes. Vous pouvez le consulter et le telecharger via le lien ci-dessous.
    </p>
    ${ctaButton("Acceder a mon dossier", params.shareUrl)}
    <p style="margin:16px 0;font-size:14px;color:#6b7280;line-height:1.5;">
      <strong>Partagez ce lien avec votre notaire</strong> — il pourra consulter et telecharger tous les documents directement.
    </p>
    ${expiryText}
    <p style="margin:16px 0 0;font-size:14px;color:#6b7280;">
      Si vous avez des questions, repondez directement a cet email.
    </p>
  `);

  return {
    subject: `Votre pre-etat date est pret — ${address}`,
    html,
  };
}

// ============================================================
// Template 2: Review request (J+3)
// ============================================================
export function reviewRequestEmail(params: {
  propertyAddress?: string;
}): { subject: string; html: string } {
  const address = params.propertyAddress || "votre bien";

  const trustpilotUrl = "https://fr.trustpilot.com/evaluate/pre-etat-date.ai";

  const html = baseTemplate(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Votre avis compte</h1>
    <p style="margin:0 0 8px;font-size:16px;color:#374151;line-height:1.6;">
      Bonjour,
    </p>
    <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
      Vous avez recemment utilise Pre-etat-date.ai pour generer le dossier de vente de <strong>${address}</strong>.
      Nous esperons que le service vous a donne satisfaction.
    </p>
    <p style="margin:0 0 24px;font-size:16px;color:#374151;line-height:1.6;">
      Pourriez-vous prendre 30 secondes pour nous laisser un avis ? Cela nous aide enormement.
    </p>
    ${ctaButton("Laisser un avis sur Trustpilot", trustpilotUrl)}
    <p style="margin:24px 0 0;font-size:14px;color:#6b7280;">
      Merci pour votre confiance !
    </p>
  `);

  return {
    subject: "Votre avis compte — Pre-etat-date.ai",
    html,
  };
}

// ============================================================
// Template 3: Cart abandonment (J+1)
// ============================================================
export function cartAbandonmentEmail(params: {
  propertyAddress?: string;
  resumeUrl: string;
}): { subject: string; html: string } {
  const address = params.propertyAddress || "votre bien";

  const html = baseTemplate(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#111827;">Votre dossier vous attend</h1>
    <p style="margin:0 0 8px;font-size:16px;color:#374151;line-height:1.6;">
      Bonjour,
    </p>
    <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
      Vous avez commence a preparer le dossier de vente pour <strong>${address}</strong> sur Pre-etat-date.ai mais ne l'avez pas encore finalise.
    </p>
    <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
      Pour seulement <strong>24,99 €</strong>, obtenez votre pre-etat date complet en quelques minutes — au lieu de 380 € en moyenne chez un syndic.
    </p>
    ${ctaButton("Reprendre mon dossier", params.resumeUrl)}
    <p style="margin:16px 0 0;font-size:14px;color:#6b7280;">
      Si vous avez des questions, repondez directement a cet email.
    </p>
  `);

  return {
    subject: `Votre dossier de vente vous attend — ${address}`,
    html,
  };
}

// ============================================================
// Template 4: Expiration reminder (J+5)
// ============================================================
export function expirationReminderEmail(params: {
  shareUrl: string;
  propertyAddress?: string;
  expiresAt: string;
}): { subject: string; html: string } {
  const address = params.propertyAddress || "votre bien";

  const html = baseTemplate(`
    <h1 style="margin:0 0 16px;font-size:24px;color:#dc2626;">Vos documents expirent bientot</h1>
    <p style="margin:0 0 8px;font-size:16px;color:#374151;line-height:1.6;">
      Bonjour,
    </p>
    <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
      Le dossier de vente pour <strong>${address}</strong> sera automatiquement supprime le <strong>${params.expiresAt}</strong> conformement au RGPD.
    </p>
    <p style="margin:0 0 16px;font-size:16px;color:#374151;line-height:1.6;">
      Pensez a telecharger vos documents et a transmettre le lien a votre notaire avant cette date.
    </p>
    ${ctaButton("Telecharger mes documents", params.shareUrl)}
    <p style="margin:16px 0 0;font-size:14px;color:#6b7280;">
      Si vous avez des questions, repondez directement a cet email.
    </p>
  `);

  return {
    subject: `Vos documents expirent le ${params.expiresAt} — Pre-etat-date.ai`,
    html,
  };
}
