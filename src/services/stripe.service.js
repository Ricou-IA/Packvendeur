import supabase from '@lib/supabaseClient';

export const stripeService = {
  async createCheckoutSession(dossierId, sessionId, email) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-create-payment-intent', {
        body: {
          action: 'create-checkout',
          dossier_id: dossierId,
          session_id: sessionId,
          email,
          origin: window.location.origin,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[stripeService] createCheckoutSession:', error);
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
