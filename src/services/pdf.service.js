import { documentService } from './document.service';

export const pdfService = {
  async generatePreEtatDate(dossierData, PreEtatDateDocument) {
    try {
      // Dynamic import to keep @react-pdf/renderer (~1MB) out of the main chunk
      const { pdf } = await import('@react-pdf/renderer');
      const doc = PreEtatDateDocument({ data: dossierData });
      const blob = await pdf(doc).toBlob();
      return { data: blob, error: null };
    } catch (error) {
      console.error('[pdfService] generatePreEtatDate:', error);
      return { data: null, error };
    }
  },

  async generateAndUpload(dossierId, dossierData, PreEtatDateDocument) {
    try {
      const { data: blob, error: genError } = await this.generatePreEtatDate(dossierData, PreEtatDateDocument);
      if (genError) throw genError;

      const { data: storagePath, error: uploadError } = await documentService.uploadGeneratedFile(
        dossierId,
        'pre_etat_date.pdf',
        blob
      );
      if (uploadError) throw uploadError;

      return { data: storagePath, error: null };
    } catch (error) {
      console.error('[pdfService] generateAndUpload:', error);
      return { data: null, error };
    }
  },
};
