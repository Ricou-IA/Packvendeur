import { invokeFunction } from '@lib/supabase-functions';

const SESSION_KEY = 'pack-vendeur-session-id';
const UTM_STORAGE_KEY = 'pv-utm-data';
const PARTNER_KEY = 'pv-partner-data';
const PARTNER_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function slugifyPartner(input) {
  if (!input) return null;
  return String(input)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || null;
}

function partnerSlugToName(slug) {
  if (!slug) return null;
  return slug
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const STEP_LABELS = {
  1: 'questionnaire',
  2: 'documents_uploades',
  3: 'paiement_initie',
  4: 'extraction',
  5: 'validation',
  6: 'livraison',
};

function deriveChannel({ utm_source, utm_medium, referrer }) {
  if (utm_medium === 'cpc' || utm_medium === 'ppc') return 'paid_search';
  if (utm_medium === 'paid_social') return 'paid_social';
  if (utm_medium === 'email') return 'email';
  if (utm_source === 'newsletter') return 'email';
  if (utm_source) return 'campaign';
  if (!referrer) return 'direct';

  try {
    const ref = new URL(referrer).hostname;
    if (/google|bing|yahoo|duckduckgo|qwant|ecosia/i.test(ref)) return 'organic_search';
    if (/facebook|instagram|twitter|linkedin|tiktok|pinterest/i.test(ref)) return 'organic_social';
    return 'referral';
  } catch {
    return 'direct';
  }
}

export const trackingService = {
  captureUTMs() {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(UTM_STORAGE_KEY)) return;

    try {
      const params = new URLSearchParams(window.location.search);
      const data = {
        utm_source: params.get('utm_source') || null,
        utm_medium: params.get('utm_medium') || null,
        utm_campaign: params.get('utm_campaign') || null,
        utm_term: params.get('utm_term') || null,
        referrer: document.referrer || null,
        landing_page: window.location.pathname,
      };
      data.acquisition_channel = deriveChannel(data);

      if (data.utm_source || data.referrer) {
        sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
      }
    } catch {
      // Silent fail — tracking ne doit jamais casser l'app
    }
  },

  getAcquisitionData() {
    try {
      return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  },

  /**
   * Stocke un partnerId (slug agence) en localStorage avec TTL 30j.
   * Appelée par PartnerCapture quand l'URL matche /vendre/:slug.
   */
  setPartner(slug) {
    if (typeof window === 'undefined') return null;
    const partnerId = slugifyPartner(slug);
    if (!partnerId) return null;

    const payload = {
      partner_id: partnerId,
      partner_name: partnerSlugToName(partnerId),
      captured_at: Date.now(),
    };
    try {
      localStorage.setItem(PARTNER_KEY, JSON.stringify(payload));
    } catch {
      // Silent
    }
    return payload;
  },

  getPartner() {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(PARTNER_KEY);
      if (!raw) return null;
      const payload = JSON.parse(raw);
      if (!payload?.partner_id) return null;
      if (
        payload.captured_at &&
        Date.now() - payload.captured_at > PARTNER_TTL_MS
      ) {
        localStorage.removeItem(PARTNER_KEY);
        return null;
      }
      return payload;
    } catch {
      return null;
    }
  },

  clearPartner() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(PARTNER_KEY);
    } catch {
      // Silent
    }
  },

  /**
   * Fire-and-forget : Plausible + Edge Function pv-track-event.
   * Aucune erreur jamais remontée à l'UI.
   */
  trackEvent(eventName, category = null, properties = {}, dossierId = null) {
    try {
      const partnerData = this.getPartner();
      const partnerProps = partnerData
        ? { partner_id: partnerData.partner_id, partner_name: partnerData.partner_name }
        : {};

      // Layer 1 — Plausible (client-side, pas de backend)
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(eventName, { props: { category, ...partnerProps, ...properties } });
      }

      // Layer 2 — Edge Function pv-track-event (no auth)
      const sessionId =
        typeof window !== 'undefined' ? localStorage.getItem(SESSION_KEY) : null;
      if (!sessionId) return;

      const utmData = this.getAcquisitionData();

      // Fire-and-forget : on n'attend pas, on n'expose pas l'erreur
      invokeFunction(
        'pv-track-event',
        {
          session_id: sessionId,
          dossier_id: dossierId || null,
          event_name: eventName,
          event_category: category,
          properties: { ...partnerProps, ...properties },
          page_url: typeof window !== 'undefined' ? window.location.pathname : null,
          referrer: utmData.referrer || null,
          utm_source: utmData.utm_source || null,
          utm_medium: utmData.utm_medium || null,
          utm_campaign: utmData.utm_campaign || null,
          user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        },
        { auth: 'none' },
      ).catch(() => {
        // Silent — tracking ne doit jamais bloquer
      });
    } catch {
      // Silent
    }
  },

  trackStep(step, dossierId = null) {
    const label = STEP_LABELS[step] || `step_${step}`;
    this.trackEvent('funnel_step', 'funnel', { step, label }, dossierId);
  },
};
