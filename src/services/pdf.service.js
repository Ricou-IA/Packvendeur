import { pdf } from '@react-pdf/renderer';
import { documentService } from './document.service';

export const pdfService = {
  async generatePreEtatDate(dossierData, PreEtatDateDocument) {
    try {
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

export default pdfService;
