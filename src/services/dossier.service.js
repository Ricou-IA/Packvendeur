import { invokeFunction, setAccessToken, getAccessToken } from '@lib/supabase-functions';

/**
 * dossier.service — toutes les opérations sur les dossiers passent désormais
 * par les Edge Functions Pack Vendeur (RLS verrouillée côté DB).
 *
 * Toutes les méthodes retournent { data, error } pour rester compatibles
 * avec l'ancien pattern et les hooks existants.
 */
export const dossierService = {
  /**
   * Crée un dossier B2C. L'action est idempotente côté EF :
   * si un dossier existe déjà pour le session_id, il est retourné tel quel.
   * Stocke automatiquement l'access_token reçu en localStorage.
   *
   * @param {string} sessionId UUID navigateur
   * @param {object} [acquisitionData] UTM + referrer + acquisition_channel + landing_page
   * @returns {Promise<{ data: { dossier, access_token } | null, error: Error | null }>}
   */
  async createDossier(sessionId, acquisitionData = {}) {
    if (!sessionId) {
      return { data: null, error: new Error('sessionId est requis') };
    }
    const { data, error } = await invokeFunction(
      'pv-dossier',
      { action: 'create', session_id: sessionId, utm_data: acquisitionData },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    if (data?.access_token) setAccessToken(data.access_token);
    return { data, error: null };
  },

  /**
   * Récupère un dossier par son id (auth via X-Pv-Access-Token automatique).
   */
  async getDossier(dossierId) {
    if (!dossierId) {
      return { data: null, error: new Error('dossierId est requis') };
    }
    if (!getAccessToken()) {
      return { data: null, error: new Error('Aucun access_token en session') };
    }
    const { data, error } = await invokeFunction('pv-dossier', {
      action: 'get',
      dossier_id: dossierId,
    });
    if (error) return { data: null, error };
    return { data: data?.dossier || null, error: null };
  },

  /**
   * Met à jour un dossier. L'EF rejette les colonnes sensibles
   * (access_token, share_token, stripe_*, extractions_count, etc.).
   */
  async updateDossier(dossierId, updates) {
    if (!dossierId) {
      return { data: null, error: new Error('dossierId est requis') };
    }
    const { data, error } = await invokeFunction('pv-dossier', {
      action: 'update',
      dossier_id: dossierId,
      updates,
    });
    if (error) return { data: null, error };
    return { data: data?.dossier || null, error: null };
  },

  /**
   * Génère un share_token pour le dossier. Réservé aux dossiers complétés
   * (le frontend doit gérer le fait de ne le proposer qu'à l'étape Livraison).
   */
  async generateShareLink(dossierId) {
    if (!dossierId) {
      return { data: null, error: new Error('dossierId est requis') };
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : null;
    const { data, error } = await invokeFunction('pv-dossier', {
      action: 'generate-share-link',
      dossier_id: dossierId,
      origin,
    });
    if (error) return { data: null, error };
    return { data, error: null };
  },

  /**
   * Récupère le dossier + documents + URLs signées pour la page notaire.
   * Auth via share_token dans le body (pas de header).
   */
  async getNotaryData(shareToken) {
    if (!shareToken) {
      return { data: null, error: new Error('shareToken est requis') };
    }
    const { data, error } = await invokeFunction(
      'pv-notary',
      { action: 'get-data', share_token: shareToken },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data, error: null };
  },

  /**
   * Incrémente le compteur de téléchargements pour la page notaire.
   * Fire-and-forget — on n'expose pas l'erreur à l'UI.
   */
  async incrementNotaryDownload(shareToken) {
    if (!shareToken) return { data: null, error: null };
    return await invokeFunction(
      'pv-notary',
      { action: 'increment-download', share_token: shareToken },
      { auth: 'none' },
    );
  },
};
