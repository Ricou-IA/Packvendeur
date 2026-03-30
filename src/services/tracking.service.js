import supabase from '@lib/supabaseClient';

const SESSION_KEY = 'pack-vendeur-session-id';
const UTM_STORAGE_KEY = 'pv-utm-data';

const STEP_LABELS = {
  1: 'questionnaire',
  2: 'documents_uploades',
  3: 'extraction_terminee',
  4: 'validation',
  5: 'paiement_initie',
  6: 'paiement_confirme',
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
  /**
   * Capture UTM params + referrer from current URL. Call once on app mount.
   * Stores in sessionStorage so data persists across SPA navigations but not across sessions.
   */
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
      // Silent fail — tracking must never break the app
    }
  },

  /**
   * Returns stored acquisition data, or empty object if none.
   */
  getAcquisitionData() {
    try {
      return JSON.parse(sessionStorage.getItem(UTM_STORAGE_KEY) || '{}');
    } catch {
      return {};
    }
  },

  /**
   * Fire-and-forget event tracking (Plausible + Supabase).
   * Never awaited, never blocks UI, never shows errors.
   */
  trackEvent(eventName, category = null, properties = {}, dossierId = null) {
    try {
      // Layer 1 — Plausible
      if (typeof window !== 'undefined' && window.plausible) {
        window.plausible(eventName, { props: { category, ...properties } });
      }

      // Layer 2 — Supabase pv_events
      const sessionId = typeof window !== 'undefined'
        ? localStorage.getItem(SESSION_KEY)
        : null;

      if (!sessionId) return;

      const utmData = this.getAcquisitionData();

      supabase.from('pv_events').insert({
        session_id: sessionId,
        dossier_id: dossierId || null,
        event_name: eventName,
        event_category: category,
        properties,
        page_url: typeof window !== 'undefined' ? window.location.pathname : null,
        referrer: utmData.referrer || null,
        utm_source: utmData.utm_source || null,
        utm_medium: utmData.utm_medium || null,
        utm_campaign: utmData.utm_campaign || null,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      }).then(() => {
        // Success — silent
      }).catch(() => {
        // Fail — silent
      });
    } catch {
      // Silent fail
    }
  },

  /**
   * Track funnel step progression.
   */
  trackStep(step, dossierId = null) {
    const label = STEP_LABELS[step] || `step_${step}`;
    this.trackEvent('funnel_step', 'funnel', { step, label }, dossierId);
  },
};
