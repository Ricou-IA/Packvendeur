import supabase from '@lib/supabaseClient';

export const dossierService = {
  async createDossier(sessionId) {
    try {
      if (!sessionId) throw new Error('[dossierService] sessionId est requis');

      const { data, error } = await supabase
        .from('pv_dossiers')
        .insert({ session_id: sessionId, status: 'draft', current_step: 1 })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[dossierService] createDossier:', error);
      return { data: null, error };
    }
  },

  async getDossierBySession(sessionId) {
    try {
      if (!sessionId) throw new Error('[dossierService] sessionId est requis');

      const { data, error } = await supabase
        .from('pv_dossiers')
        .select('*')
        .eq('session_id', sessionId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[dossierService] getDossierBySession:', error);
      return { data: null, error };
    }
  },

  async getDossierByShareToken(shareToken) {
    try {
      if (!shareToken) throw new Error('[dossierService] shareToken est requis');

      const { data, error } = await supabase
        .from('pv_dossiers')
        .select('*')
        .eq('share_token', shareToken)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[dossierService] getDossierByShareToken:', error);
      return { data: null, error };
    }
  },

  async updateDossier(dossierId, updates) {
    try {
      if (!dossierId) throw new Error('[dossierService] dossierId est requis');

      const { data, error } = await supabase
        .from('pv_dossiers')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', dossierId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[dossierService] updateDossier:', error);
      return { data: null, error };
    }
  },

  async generateShareLink(dossierId) {
    try {
      const shareToken = crypto.randomUUID().replace(/-/g, '');
      const shareUrl = `${window.location.origin}/share/${shareToken}`;

      const { data, error } = await supabase
        .from('pv_dossiers')
        .update({ share_token: shareToken, share_url: shareUrl })
        .eq('id', dossierId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[dossierService] generateShareLink:', error);
      return { data: null, error };
    }
  },

  async incrementDownloadCount(dossierId) {
    try {
      const { data: current, error: readError } = await supabase
        .from('pv_dossiers')
        .select('download_count, notary_accessed_at')
        .eq('id', dossierId)
        .single();

      if (readError) throw readError;

      const updates = {
        download_count: (current?.download_count || 0) + 1,
      };

      if (!current?.notary_accessed_at) {
        updates.notary_accessed_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('pv_dossiers')
        .update(updates)
        .eq('id', dossierId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[dossierService] incrementDownloadCount:', error);
      return { data: null, error };
    }
  },
};
