import supabase from '@lib/supabaseClient';

export const stripeService = {
  async createCheckoutSession(dossierId, sessionId, email, promotionCodeId = null, couponId = null) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-create-payment-intent', {
        body: {
          action: 'create-checkout',
          dossier_id: dossierId,
          session_id: sessionId,
          email,
          origin: window.location.origin,
          promotion_code_id: promotionCodeId,
          coupon_id: couponId,
        },
      });

      if (error) {
        let detail = error.message;
        try {
          const ctx = await error.context?.json?.();
          console.error('[stripeService] createCheckoutSession error:', error.message, 'context:', ctx);
          detail = ctx?.details || ctx?.error || ctx?.message || error.message;
        } catch (_) {
          console.error('[stripeService] createCheckoutSession error (no context):', error.message);
        }
        return { data: null, error: new Error(detail) };
      }
      return { data, error: null };
    } catch (error) {
      console.error('[stripeService] createCheckoutSession:', error);
      return { data: null, error };
    }
  },

  async validatePromoCode(code) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-create-payment-intent', {
        body: {
          action: 'validate-promo',
          promo_code: code,
        },
      });

      if (error) {
        // FunctionsHttpError.context is a Response object — parse it
        let detail = error.message;
        try {
          const ctx = await error.context?.json?.();
          console.error('[stripeService] validatePromoCode error:', error.message, 'context:', ctx);
          detail = ctx?.details || ctx?.error || ctx?.message || error.message;
        } catch (_) {
          console.error('[stripeService] validatePromoCode error (no context):', error.message);
        }
        return { data: null, error: new Error(detail) };
      }
      return { data, error: null };
    } catch (error) {
      console.error('[stripeService] validatePromoCode:', error);
      return { data: null, error };
    }
  },

  async verifyCheckoutSession(checkoutSessionId) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-create-payment-intent', {
        body: {
          action: 'verify-checkout',
          checkout_session_id: checkoutSessionId,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[stripeService] verifyCheckoutSession:', error);
      return { data: null, error };
    }
  },
};
