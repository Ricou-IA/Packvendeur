import supabase from '@lib/supabaseClient';

export const geminiService = {
  async classifyDocument(fileBase64, filename, dossierId) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-analyze', {
        body: {
          action: 'classify',
          file_base64: fileBase64,
          filename,
          dossier_id: dossierId,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Classification failed');

      return { data: data.data, error: null };
    } catch (error) {
      console.error('[geminiService] classifyDocument:', error);
      return { data: null, error };
    }
  },

  async extractDossierData(documentsWithBase64, dossierId, { lotNumber, propertyAddress, questionnaireData } = {}) {
    try {
      const docs = documentsWithBase64.map((doc) => ({
        base64: doc.base64,
        normalized_filename: doc.normalized_filename || doc.original_filename,
        original_filename: doc.original_filename,
        document_type: doc.document_type,
      }));

      const { data, error } = await supabase.functions.invoke('pv-analyze', {
        body: {
          action: 'extract',
          documents: docs,
          dossier_id: dossierId,
          lot_number: lotNumber || null,
          property_address: propertyAddress || null,
          questionnaire_context: questionnaireData || null,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Extraction failed');

      return { data: data.data, error: null };
    } catch (error) {
      console.error('[geminiService] extractDossierData:', error);
      return { data: null, error };
    }
  },
};
