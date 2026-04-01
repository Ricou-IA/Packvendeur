import supabase from '@lib/supabaseClient';

const BUCKET = 'pack-vendeur';

export const proService = {
  async createAccount(email, companyName) {
    try {
      if (!email || !companyName) throw new Error('[proService] email et companyName requis');

      const proToken = crypto.randomUUID();

      const { data, error } = await supabase
        .from('pv_pro_accounts')
        .insert({
          pro_token: proToken,
          email,
          company_name: companyName,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proService] createAccount:', error);
      return { data: null, error };
    }
  },

  async getAccountByToken(proToken) {
    try {
      if (!proToken) throw new Error('[proService] proToken requis');

      const { data, error } = await supabase
        .from('pv_pro_accounts')
        .select('*')
        .eq('pro_token', proToken)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proService] getAccountByToken:', error);
      return { data: null, error };
    }
  },

  async updateAccount(proAccountId, updates) {
    try {
      if (!proAccountId) throw new Error('[proService] proAccountId requis');

      const { data, error } = await supabase
        .from('pv_pro_accounts')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', proAccountId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proService] updateAccount:', error);
      return { data: null, error };
    }
  },

  async uploadLogo(proAccountId, file) {
    try {
      if (!proAccountId || !file) throw new Error('[proService] proAccountId et file requis');

      const path = `pro/${proAccountId}/logo.png`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) throw uploadError;

      const { data, error } = await supabase
        .from('pv_pro_accounts')
        .update({ logo_path: path, updated_at: new Date().toISOString() })
        .eq('id', proAccountId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proService] uploadLogo:', error);
      return { data: null, error };
    }
  },

  async getLogoUrl(logoPath) {
    try {
      if (!logoPath) return { data: null, error: null };

      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(logoPath, 3600);

      if (error) throw error;
      return { data: data.signedUrl, error: null };
    } catch (error) {
      console.error('[proService] getLogoUrl:', error);
      return { data: null, error };
    }
  },

  async getDossiersByPro(proAccountId) {
    try {
      if (!proAccountId) throw new Error('[proService] proAccountId requis');

      const { data, error } = await supabase
        .from('pv_dossiers')
        .select('*')
        .eq('pro_account_id', proAccountId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proService] getDossiersByPro:', error);
      return { data: null, error };
    }
  },

  async createProDossier(proAccountId, clientData = {}) {
    try {
      if (!proAccountId) throw new Error('[proService] proAccountId requis');

      const uploadToken = crypto.randomUUID().replace(/-/g, '');
      const sessionId = crypto.randomUUID();

      const { data, error } = await supabase
        .from('pv_dossiers')
        .insert({
          session_id: sessionId,
          pro_account_id: proAccountId,
          upload_token: uploadToken,
          created_by: 'agent',
          status: 'draft',
          current_step: 1,
          client_name: clientData.client_name || null,
          client_email: clientData.client_email || null,
          client_phone: clientData.client_phone || null,
          property_address: clientData.property_address || null,
          property_city: clientData.property_city || null,
          property_postal_code: clientData.property_postal_code || null,
          property_lot_number: clientData.property_lot_number || null,
          pro_notes: clientData.pro_notes || null,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proService] createProDossier:', error);
      return { data: null, error };
    }
  },

  async getDossierByUploadToken(uploadToken) {
    try {
      if (!uploadToken) throw new Error('[proService] uploadToken requis');

      const { data, error } = await supabase
        .from('pv_dossiers')
        .select('*')
        .eq('upload_token', uploadToken)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proService] getDossierByUploadToken:', error);
      return { data: null, error };
    }
  },

  async consumeCredit(proAccountId, dossierId) {
    try {
      if (!proAccountId) throw new Error('[proService] proAccountId requis');

      // Read current balance
      const { data: account, error: readError } = await supabase
        .from('pv_pro_accounts')
        .select('credits')
        .eq('id', proAccountId)
        .single();

      if (readError) throw readError;
      if (!account || account.credits < 1) {
        return { data: null, error: new Error('Credits insuffisants') };
      }

      const newBalance = account.credits - 1;

      // Decrement credits
      const { error: updateError } = await supabase
        .from('pv_pro_accounts')
        .update({ credits: newBalance, updated_at: new Date().toISOString() })
        .eq('id', proAccountId);

      if (updateError) throw updateError;

      // Log transaction
      const { error: txError } = await supabase
        .from('pv_pro_credit_transactions')
        .insert({
          pro_account_id: proAccountId,
          amount: -1,
          balance_after: newBalance,
          type: 'usage',
          description: 'Generation pack vendeur',
          dossier_id: dossierId || null,
        });

      if (txError) console.error('[proService] consumeCredit tx log failed:', txError);

      return { data: { credits: newBalance }, error: null };
    } catch (error) {
      console.error('[proService] consumeCredit:', error);
      return { data: null, error };
    }
  },

  async getCreditTransactions(proAccountId) {
    try {
      if (!proAccountId) throw new Error('[proService] proAccountId requis');

      const { data, error } = await supabase
        .from('pv_pro_credit_transactions')
        .select('*')
        .eq('pro_account_id', proAccountId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[proService] getCreditTransactions:', error);
      return { data: null, error };
    }
  },
};
