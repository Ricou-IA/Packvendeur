import { invokeFunction } from '@lib/supabase-functions';

/**
 * document.service — toutes les opérations passent par l'EF pv-document.
 *
 * Limite payload Supabase Edge Functions : 6 MB. On limite côté front à 5 MB
 * binaire (5.3 MB en base64 + overhead JSON ~300KB). L'EF accepte aussi bien
 * que possible mais peut échouer au-dessus.
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB binaire

/** Lit un File/Blob et retourne sa version base64 (sans le préfixe data:...). */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const documentService = {
  /**
   * Upload un fichier vers le bucket via l'EF pv-document.
   * @param {string} dossierId
   * @param {File} file
   * @param {string} [hintDocumentType] Type pré-assigné (drop sur checklist)
   */
  async uploadDocument(dossierId, file, hintDocumentType) {
    if (!dossierId) return { data: null, error: new Error('dossierId est requis') };
    if (!file) return { data: null, error: new Error('file est requis') };
    if (file.size > MAX_FILE_SIZE) {
      return {
        data: null,
        error: new Error(
          `Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum : 5 MB.`,
        ),
      };
    }

    let base64;
    try {
      base64 = await fileToBase64(file);
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }

    const { data, error } = await invokeFunction('pv-document', {
      action: 'upload',
      dossier_id: dossierId,
      file_base64: base64,
      filename: file.name,
      file_type: file.type || 'application/pdf',
      hint_document_type: hintDocumentType || null,
    });
    if (error) return { data: null, error };
    return { data: data?.document || null, error: null };
  },

  async getDocuments(dossierId) {
    if (!dossierId) return { data: [], error: new Error('dossierId est requis') };
    const { data, error } = await invokeFunction('pv-document', {
      action: 'list',
      dossier_id: dossierId,
    });
    if (error) return { data: [], error };
    return { data: data?.documents || [], error: null };
  },

  async updateDocument(documentId, updates, dossierId) {
    if (!documentId) return { data: null, error: new Error('documentId est requis') };
    if (!dossierId) return { data: null, error: new Error('dossierId est requis') };
    const { data, error } = await invokeFunction('pv-document', {
      action: 'update',
      dossier_id: dossierId,
      document_id: documentId,
      updates,
    });
    if (error) return { data: null, error };
    return { data: data?.document || null, error: null };
  },

  async removeDocument(documentId, dossierId) {
    if (!documentId) return { error: new Error('documentId est requis') };
    if (!dossierId) return { error: new Error('dossierId est requis') };
    const { error } = await invokeFunction('pv-document', {
      action: 'remove',
      dossier_id: dossierId,
      document_id: documentId,
    });
    return { error };
  },

  async getSignedUrl(storagePath, dossierId, expiresIn = 600) {
    if (!storagePath) return { data: null, error: new Error('storagePath est requis') };
    if (!dossierId) return { data: null, error: new Error('dossierId est requis') };
    const { data, error } = await invokeFunction('pv-document', {
      action: 'signed-url',
      dossier_id: dossierId,
      storage_path: storagePath,
      expires_in: expiresIn,
    });
    if (error) return { data: null, error };
    return { data: data?.signed_url || null, error: null };
  },

  /**
   * Télécharge un fichier via signed URL et le retourne en base64.
   * Utilisé par useDocuments pour la classification (lit le fichier avec une
   * URL signée temporaire et envoie le base64 à pv-classify).
   */
  async getFileAsBase64(storagePath, dossierId) {
    const { data: url, error: urlError } = await this.getSignedUrl(
      storagePath,
      dossierId,
      600,
    );
    if (urlError || !url) {
      return { data: null, error: urlError || new Error('Signed URL non disponible') };
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Téléchargement échoué (${res.status})`);
      const blob = await res.blob();
      const base64 = await fileToBase64(blob);
      return { data: base64, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
  },

  /**
   * Upload un fichier généré côté client (PDF du pré-état daté).
   * @param {string} dossierId
   * @param {string} filename
   * @param {Blob} blob
   */
  async uploadGeneratedFile(dossierId, filename, blob) {
    if (!dossierId) return { data: null, error: new Error('dossierId est requis') };
    if (!blob) return { data: null, error: new Error('blob est requis') };

    let base64;
    try {
      base64 = await fileToBase64(blob);
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }

    const { data, error } = await invokeFunction('pv-document', {
      action: 'upload-generated',
      dossier_id: dossierId,
      file_base64: base64,
      filename,
      file_type: blob.type || 'application/pdf',
    });
    if (error) return { data: null, error };
    return { data: data?.storage_path || null, error: null };
  },
};
