import { invokeFunction, setProToken } from '@lib/supabase-functions';

/**
 * pro.service — toutes les opérations B2B passent par l'EF pv-pro.
 * Auth : X-Pv-Pro-Token automatique (sauf create-account).
 */
export const proService = {
  async createAccount(email, companyName, password = null) {
    if (!email || !companyName) {
      return { data: null, error: new Error('email et companyName requis') };
    }
    const payload = { action: 'create-account', email, company_name: companyName };
    // Mot de passe : envoyé au backend pour future authentification multi-device.
    // L'EF actuelle peut ignorer le champ — pas de régression côté MVP.
    if (password) payload.password = password;
    const { data, error } = await invokeFunction(
      'pv-pro',
      payload,
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    if (data?.pro_token) setProToken(data.pro_token);
    return { data: data?.account || null, error: null };
  },

  /**
   * Récupère le compte pro associé au pro_token courant (en localStorage).
   * Si proAccountId est passé, on l'utilise ; sinon on doit décoder via getAccountByToken
   * — mais avec le nouveau modèle, on doit d'abord identifier l'id. Approche :
   * le client appelle d'abord get-account avec le pro_account_id du localStorage
   * (qu'il aura stocké à la création).
   */
  async getAccount(proAccountId) {
    if (!proAccountId) {
      return { data: null, error: new Error('proAccountId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'get-account',
      pro_account_id: proAccountId,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.account || null, error: null };
  },

  async updateAccount(proAccountId, updates) {
    if (!proAccountId) {
      return { data: null, error: new Error('proAccountId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'update-account',
      pro_account_id: proAccountId,
      updates,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.account || null, error: null };
  },

  async uploadLogo(proAccountId, file) {
    if (!proAccountId || !file) {
      return { data: null, error: new Error('proAccountId et file requis') };
    }
    if (file.size > 5 * 1024 * 1024) {
      return { data: null, error: new Error('Logo trop volumineux (max 5 MB)') };
    }

    let base64;
    try {
      const reader = new FileReader();
      base64 = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
      });
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }

    const { data, error } = await invokeFunction('pv-pro', {
      action: 'upload-logo',
      pro_account_id: proAccountId,
      file_base64: base64,
      file_type: file.type || 'image/png',
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.account || null, error: null };
  },

  async getLogoUrl(proAccountId) {
    if (!proAccountId) return { data: null, error: null };
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'get-logo-url',
      pro_account_id: proAccountId,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.signed_url || null, error: null };
  },

  async getDossiersByPro(proAccountId) {
    if (!proAccountId) {
      return { data: null, error: new Error('proAccountId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'list-dossiers',
      pro_account_id: proAccountId,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.dossiers || [], error: null };
  },

  async createProDossier(proAccountId, clientData = {}) {
    if (!proAccountId) {
      return { data: null, error: new Error('proAccountId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'create-dossier',
      pro_account_id: proAccountId,
      client_data: clientData,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.dossier || null, error: null };
  },

  /**
   * Côté B2B client (page /client/:uploadToken) — auth via upload_token directement.
   */
  async getDossierByUploadToken(uploadToken) {
    if (!uploadToken) {
      return { data: null, error: new Error('uploadToken requis') };
    }
    const { data, error } = await invokeFunction(
      'pv-client-upload',
      { action: 'get-dossier', upload_token: uploadToken },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data, error: null };
  },

  async consumeCredit(proAccountId, dossierId) {
    if (!proAccountId) {
      return { data: null, error: new Error('proAccountId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'consume-credit',
      pro_account_id: proAccountId,
      dossier_id: dossierId || null,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: { credits: data?.credits }, error: null };
  },

  async getCreditTransactions(proAccountId) {
    if (!proAccountId) {
      return { data: null, error: new Error('proAccountId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'list-transactions',
      pro_account_id: proAccountId,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.transactions || [], error: null };
  },

  /**
   * B2B : pro consulte un dossier qui lui appartient.
   * Auth via X-Pv-Pro-Token, vérification ownership côté EF.
   */
  async getProDossier(proAccountId, dossierId) {
    if (!proAccountId || !dossierId) {
      return { data: null, error: new Error('proAccountId et dossierId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'get-dossier',
      pro_account_id: proAccountId,
      dossier_id: dossierId,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.dossier || null, error: null };
  },

  async updateProDossier(proAccountId, dossierId, updates) {
    if (!proAccountId || !dossierId) {
      return { data: null, error: new Error('proAccountId et dossierId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'update-dossier',
      pro_account_id: proAccountId,
      dossier_id: dossierId,
      updates,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.dossier || null, error: null };
  },

  async listProDocuments(proAccountId, dossierId) {
    if (!proAccountId || !dossierId) {
      return { data: [], error: new Error('proAccountId et dossierId requis') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'list-documents',
      pro_account_id: proAccountId,
      dossier_id: dossierId,
    }, { auth: 'b2b' });
    if (error) return { data: [], error };
    return { data: data?.documents || [], error: null };
  },

  async proSignedUrlDocument(proAccountId, dossierId, storagePath, expiresIn = 600) {
    if (!proAccountId || !dossierId || !storagePath) {
      return { data: null, error: new Error('paramètres requis manquants') };
    }
    const { data, error } = await invokeFunction('pv-pro', {
      action: 'signed-url-document',
      pro_account_id: proAccountId,
      dossier_id: dossierId,
      storage_path: storagePath,
      expires_in: expiresIn,
    }, { auth: 'b2b' });
    if (error) return { data: null, error };
    return { data: data?.signed_url || null, error: null };
  },
};

