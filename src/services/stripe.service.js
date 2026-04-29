import { invokeFunction } from '@lib/supabase-functions';

/**
 * stripe.service — flow B2C (one-shot 24,99 €).
 * L'EF pv-create-payment-intent vérifie l'access_token du dossier via
 * X-Pv-Access-Token automatique sur l'action create-checkout.
 * verify-checkout reste sans header auth (récupère le dossier_id via
 * Stripe metadata, autoritaire).
 */
export const stripeService = {
  async createCheckoutSession(dossierId, sessionId, email, promotionCodeId = null, couponId = null) {
    const { data, error } = await invokeFunction('pv-create-payment-intent', {
      action: 'create-checkout',
      dossier_id: dossierId,
      session_id: sessionId,
      email,
      origin: typeof window !== 'undefined' ? window.location.origin : null,
      promotion_code_id: promotionCodeId,
      coupon_id: couponId,
    });
    if (error) return { data: null, error };
    return { data, error: null };
  },

  async validatePromoCode(code) {
    const { data, error } = await invokeFunction(
      'pv-create-payment-intent',
      { action: 'validate-promo', promo_code: code },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data, error: null };
  },

  async verifyCheckoutSession(checkoutSessionId) {
    // verify-checkout n'a pas d'auth header (autorité Stripe metadata)
    const { data, error } = await invokeFunction(
      'pv-create-payment-intent',
      { action: 'verify-checkout', checkout_session_id: checkoutSessionId },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data, error: null };
  },

  /**
   * DEV-only: marque un dossier comme payé sans passer par Stripe.
   * Côté serveur, l'action est gated par ALLOW_DEV_MARK_PAID === 'true'
   * (sinon 403). Le payment_intent_id est préfixé TEST_SKIP_ pour traçabilité.
   * Auth via X-Pv-Access-Token automatique.
   */
  async devMarkPaid(dossierId) {
    const { data, error } = await invokeFunction('pv-create-payment-intent', {
      action: 'dev-mark-paid',
      dossier_id: dossierId,
    });
    if (error) return { data: null, error };
    return { data, error: null };
  },
};
