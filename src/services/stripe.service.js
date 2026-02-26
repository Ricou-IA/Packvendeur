import supabase from '@lib/supabaseClient';

export const stripeService = {
  async createPaymentIntent(dossierId, sessionId, email) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-create-payment-intent', {
        body: { dossier_id: dossierId, session_id: sessionId, email },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[stripeService] createPaymentIntent:', error);
      return { data: null, error };
    }
  },
};

export default stripeService;
