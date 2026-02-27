import supabase from '@lib/supabaseClient';

const BUCKET = 'pack-vendeur';

function sanitizeFilename(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-zA-Z0-9._-]/g, '_') // replace special chars with _
    .replace(/_+/g, '_'); // collapse multiple underscores
}

export const documentService = {
  async uploadDocument(dossierId, file, hintDocumentType) {
    try {
      if (!dossierId) throw new Error('[documentService] dossierId est requis');
      if (!file) throw new Error('[documentService] file est requis');

      const safeName = `${Date.now()}_${sanitizeFilename(file.name)}`;
      const storagePath = `${dossierId}/uploads/${safeName}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const row = {
        dossier_id: dossierId,
        original_filename: file.name,
        storage_path: storagePath,
        file_size_bytes: file.size,
        mime_type: file.type || 'application/pdf',
      };

      // Pre-assign type so doc appears in the right checklist slot immediately
      if (hintDocumentType) {
        row.document_type = hintDocumentType;
      }

      const { data, error } = await supabase
        .from('pv_documents')
        .insert(row)
        .select()
        .single();

      // Cleanup orphaned storage file if DB insert fails
      if (error) {
        await supabase.storage.from(BUCKET).remove([storagePath]).catch(() => {});
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('[documentService] uploadDocument:', error);
      return { data: null, error };
    }
  },

  async getDocuments(dossierId) {
    try {
      if (!dossierId) throw new Error('[documentService] dossierId est requis');

      const { data, error } = await supabase
        .from('pv_documents')
        .select('*')
        .eq('dossier_id', dossierId)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('[documentService] getDocuments:', error);
      return { data: [], error };
    }
  },

  async updateDocument(documentId, updates) {
    try {
      const { data, error } = await supabase
        .from('pv_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('[documentService] updateDocument:', error);
      return { data: null, error };
    }
  },

  async removeDocument(documentId, storagePath) {
    try {
      if (storagePath) {
        await supabase.storage.from(BUCKET).remove([storagePath]);
      }

      const { error } = await supabase
        .from('pv_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('[documentService] removeDocument:', error);
      return { error };
    }
  },

  async getSignedUrl(storagePath, expiresIn = 3600) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .createSignedUrl(storagePath, expiresIn);

      if (error) throw error;
      return { data: data.signedUrl, error: null };
    } catch (error) {
      console.error('[documentService] getSignedUrl:', error);
      return { data: null, error };
    }
  },

  async getFileAsBase64(storagePath) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET)
        .download(storagePath);

      if (error) throw error;

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1];
          resolve({ data: base64, error: null });
        };
        reader.onerror = () => reject({ data: null, error: reader.error });
        reader.readAsDataURL(data);
      });
    } catch (error) {
      console.error('[documentService] getFileAsBase64:', error);
      return { data: null, error };
    }
  },

  async uploadGeneratedFile(dossierId, filename, blob) {
    try {
      const storagePath = `${dossierId}/output/${filename}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, blob, {
          cacheControl: '3600',
          upsert: true,
          contentType: blob.type,
        });

      if (uploadError) throw uploadError;
      return { data: storagePath, error: null };
    } catch (error) {
      console.error('[documentService] uploadGeneratedFile:', error);
      return { data: null, error };
    }
  },
};
