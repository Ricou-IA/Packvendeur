import { invokeFunction } from '@lib/supabase-functions';

/**
 * gemini.service — invocations AI client-side restantes.
 *
 * Note historique : `extractFinancial` et `extractDiagnostics` ont été
 * supprimées du client. Depuis le refacto serveur de `pv-run-extraction`,
 * l'orchestration tourne entièrement côté serveur — le client ne doit plus
 * appeler ces deux endpoints directement (et n'en a pas le droit, l'EF
 * exige X-Pv-Access-Token + payment_status === 'paid').
 *
 * Seul `classifyDocument` reste un appel client (utilisé pendant l'upload
 * pour classifier chaque PDF via Gemini Flash en background).
 */
export const geminiService = {
  /**
   * Classify a single document (PDF) using Gemini Flash via pv-classify.
   * @param {string} fileBase64
   * @param {string} filename
   * @param {string} dossierId
   * @returns {Promise<{ data: object | null, error: Error | null }>}
   */
  async classifyDocument(fileBase64, filename, dossierId) {
    if (!fileBase64 || !filename || !dossierId) {
      return {
        data: null,
        error: new Error('fileBase64, filename et dossierId sont requis'),
      };
    }
    const { data, error } = await invokeFunction('pv-classify', {
      file_base64: fileBase64,
      filename,
      dossier_id: dossierId,
    });
    if (error) return { data: null, error };
    if (!data?.success) {
      return { data: null, error: new Error(data?.error || 'Classification failed') };
    }
    return { data: data.data, error: null };
  },
};
