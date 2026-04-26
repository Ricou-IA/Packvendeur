import { invokeFunction } from '@lib/supabase-functions';

/**
 * proStripe.service — flow B2B (achat de crédits).
 * Auth via X-Pv-Pro-Token (ajouté automatiquement par invokeFunction).
 */
export const proStripeService = {
  async createCreditCheckout(proAccountId, packType, origin) {
    const { data, error } = await invokeFunction('pv-pro-credits', {
      action: 'create-checkout',
      pro_account_id: proAccountId,
      pack_type: packType,
      origin,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data, error: null };
  },

  async verifyCreditCheckout(checkoutSessionId) {
    // verify-checkout reste sans auth (autorité Stripe metadata)
    const { data, error } = await invokeFunction(
      'pv-pro-credits',
      { action: 'verify-checkout', checkout_session_id: checkoutSessionId },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data, error: null };
  },
};
