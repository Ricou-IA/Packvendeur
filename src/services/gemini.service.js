import supabase from '@lib/supabaseClient';

export const geminiService = {
  /**
   * Classify a single document (PDF) using Gemini Flash.
   * Returns: { document_type, confidence, title, date, summary, diagnostics_couverts, dpe_ademe_number }
   */
  async classifyDocument(fileBase64, filename, dossierId) {
    try {
      const { data, error } = await supabase.functions.invoke('pv-classify', {
        body: {
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

  /**
   * Extract financial, legal & copro data using Gemini 2.5 Pro.
   * Returns: { copropriete, lot, financier, juridique, meta }
   */
  async extractFinancial(documentsWithBase64, dossierId, { lotNumber, propertyAddress, questionnaireData } = {}) {
    try {
      const docs = documentsWithBase64.map((doc) => ({
        base64: doc.base64,
        normalized_filename: doc.normalized_filename || doc.original_filename,
        original_filename: doc.original_filename,
        document_type: doc.document_type,
      }));

      const { data, error } = await supabase.functions.invoke('pv-extract-financial', {
        body: {
          documents: docs,
          dossier_id: dossierId,
          lot_number: lotNumber || null,
          property_address: propertyAddress || null,
          questionnaire_context: questionnaireData || null,
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Financial extraction failed');

      return { data: data.data, error: null };
    } catch (error) {
      console.error('[geminiService] extractFinancial:', error);
      return { data: null, error };
    }
  },

  /**
   * Extract diagnostics, bail & assurance data using Gemini 2.5 Flash.
   * Returns: { diagnostics, bail, assurance, meta }
   */
  async extractDiagnostics(documentsWithBase64, dossierId, { diagnosticsCouverts } = {}) {
    try {
      const docs = documentsWithBase64.map((doc) => ({
        base64: doc.base64,
        normalized_filename: doc.normalized_filename || doc.original_filename,
        original_filename: doc.original_filename,
        document_type: doc.document_type,
      }));

      const { data, error } = await supabase.functions.invoke('pv-extract-diagnostics', {
        body: {
          documents: docs,
          dossier_id: dossierId,
          diagnostics_couverts: diagnosticsCouverts || [],
        },
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Diagnostics extraction failed');

      return { data: data.data, error: null };
    } catch (error) {
      console.error('[geminiService] extractDiagnostics:', error);
      return { data: null, error };
    }
  },
};
