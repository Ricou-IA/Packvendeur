import { invokeFunction } from '@lib/supabase-functions';

/**
 * clientUpload.service — flow B2B client (page /client/:uploadToken).
 * Auth via upload_token (passé dans le body, pas de header).
 */

const MAX_FILE_SIZE = 5 * 1024 * 1024;

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export const clientUploadService = {
  async getDossier(uploadToken) {
    if (!uploadToken) return { data: null, error: new Error('uploadToken requis') };
    const { data, error } = await invokeFunction(
      'pv-client-upload',
      { action: 'get-dossier', upload_token: uploadToken },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data, error: null };
  },

  async listDocuments(uploadToken) {
    if (!uploadToken) return { data: [], error: new Error('uploadToken requis') };
    const { data, error } = await invokeFunction(
      'pv-client-upload',
      { action: 'list-documents', upload_token: uploadToken },
      { auth: 'none' },
    );
    if (error) return { data: [], error };
    return { data: data?.documents || [], error: null };
  },

  async uploadDocument(uploadToken, file, hintDocumentType) {
    if (!uploadToken) return { data: null, error: new Error('uploadToken requis') };
    if (!file) return { data: null, error: new Error('file requis') };
    if (file.size > MAX_FILE_SIZE) {
      return {
        data: null,
        error: new Error(`Fichier trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum : 5 MB.`),
      };
    }
    let base64;
    try {
      base64 = await fileToBase64(file);
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error(String(err)) };
    }
    const { data, error } = await invokeFunction(
      'pv-client-upload',
      {
        action: 'upload',
        upload_token: uploadToken,
        file_base64: base64,
        filename: file.name,
        file_type: file.type || 'application/pdf',
        hint_document_type: hintDocumentType || null,
      },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data: data?.document || null, error: null };
  },

  async getSignedUrl(uploadToken, storagePath, expiresIn = 600) {
    if (!uploadToken || !storagePath) {
      return { data: null, error: new Error('uploadToken et storagePath requis') };
    }
    const { data, error } = await invokeFunction(
      'pv-client-upload',
      {
        action: 'signed-url-document',
        upload_token: uploadToken,
        storage_path: storagePath,
        expires_in: expiresIn,
      },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data: data?.signed_url || null, error: null };
  },

  async updateDossier(uploadToken, updates) {
    if (!uploadToken) return { data: null, error: new Error('uploadToken requis') };
    const { data, error } = await invokeFunction(
      'pv-client-upload',
      { action: 'update-dossier', upload_token: uploadToken, updates },
      { auth: 'none' },
    );
    if (error) return { data: null, error };
    return { data: data?.dossier || null, error: null };
  },

  async removeDocument(uploadToken, documentId) {
    if (!uploadToken || !documentId) {
      return { error: new Error('uploadToken et documentId requis') };
    }
    const { error } = await invokeFunction(
      'pv-client-upload',
      { action: 'remove-document', upload_token: uploadToken, document_id: documentId },
      { auth: 'none' },
    );
    return { error };
  },
};
