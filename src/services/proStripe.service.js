import supabase from '@lib/supabaseClient';

export const proStripeService = {
  async createCreditCheckout(proAccountId, packType, origin) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-pro-credits', {
        body: {
          action: 'create-checkout',
          pro_account_id: proAccountId,
          pack_type: packType,
          origin,
        },
      });

      if (error) {
        let detail = error.message;
        try {
          const ctx = await error.context?.json?.();
          console.error('[proStripeService] createCreditCheckout error:', error.message, 'context:', ctx);
          detail = ctx?.details || ctx?.error || ctx?.message || error.message;
        } catch (_) {
          console.error('[proStripeService] createCreditCheckout error (no context):', error.message);
        }
        return { data: null, error: new Error(detail) };
      }
      return { data, error: null };
    } catch (error) {
      console.error('[proStripeService] createCreditCheckout:', error);
      return { data: null, error };
    }
  },

  async verifyCreditCheckout(checkoutSessionId) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-pro-credits', {
        body: {
          action: 'verify-checkout',
          checkout_session_id: checkoutSessionId,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proStripeService] verifyCreditCheckout:', error);
      return { data: null, error };
    }
  },
};
