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
   * Classify a single document via pv-classify.
   *
   * Note: depuis le refacto Gemini File API (2026-04-28), le client n'envoie
   * plus le PDF en base64. pv-classify lit le fichier depuis Supabase Storage
   * (service_role) et l'uploade vers Gemini File API. L'URI est mise en cache
   * sur pv_documents pour réutilisation par les extracteurs (économie de
   * 30-60s sur l'extraction). Plus de limite payload 6 MB.
   *
   * @param {string} documentId  ID du doc dans pv_documents
   * @param {string} dossierId
   * @returns {Promise<{ data: object | null, error: Error | null }>}
   */
  async classifyDocument(documentId, dossierId) {
    if (!documentId || !dossierId) {
      return {
        data: null,
        error: new Error('documentId et dossierId sont requis'),
      };
    }
    const { data, error } = await invokeFunction('pv-classify', {
      document_id: documentId,
      dossier_id: dossierId,
    });
    if (error) return { data: null, error };
    if (!data?.success) {
      return { data: null, error: new Error(data?.error || 'Classification failed') };
    }
    return { data: data.data, error: null };
  },
};
