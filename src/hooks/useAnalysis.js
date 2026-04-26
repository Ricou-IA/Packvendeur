import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { invokeFunction } from '@lib/supabase-functions';
import { dossierService } from '@services/dossier.service';
import { documentKeys } from './useDocuments';
import { dossierKeys } from './useDossier';
import { toast } from '@components/ui/sonner';

/**
 * useAnalysis — pay-first funnel : thin client trigger pour `pv-run-extraction`.
 *
 * L'orchestration tourne intégralement côté serveur via EdgeRuntime.waitUntil :
 * un page refresh, tab close, ou fetch timeout NE PERD PAS les résultats.
 * Le client poll juste `pv_dossiers.status` via React Query (cf. ProcessingStep).
 *
 * L'access_token est ajouté automatiquement par `invokeFunction` via le
 * helper `supabase-functions.js` (header X-Pv-Access-Token).
 */

// Module-level guard : survit à StrictMode unmount/remount
const triggeringDossiers = new Set();

export function useAnalysis(dossierId) {
  const queryClient = useQueryClient();
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerError, setTriggerError] = useState(null);

  const resetForRetry = useCallback(async () => {
    triggeringDossiers.delete(dossierId);
    setIsTriggering(false);
    setTriggerError(null);
    if (dossierId) {
      await dossierService.updateDossier(dossierId, {
        status: 'paid',
        extracted_data: null,
      });
      queryClient.invalidateQueries({ queryKey: dossierKeys.byId(dossierId) });
    }
  }, [dossierId, queryClient]);

  const startAnalysis = useCallback(async () => {
    if (!dossierId) return;

    if (triggeringDossiers.has(dossierId)) {
      console.warn('[useAnalysis] Trigger already in flight for', dossierId);
      return;
    }
    triggeringDossiers.add(dossierId);
    setIsTriggering(true);
    setTriggerError(null);

    try {
      const { data, error } = await invokeFunction('pv-run-extraction', {
        dossier_id: dossierId,
      });

      if (error) {
        console.error('[useAnalysis] pv-run-extraction error:', error);
        setTriggerError(error.message || String(error));
        toast.error("Impossible de lancer l'analyse — veuillez réessayer");
        return;
      }

      console.log('[useAnalysis] pv-run-extraction accepted:', data);

      queryClient.invalidateQueries({ queryKey: dossierKeys.byId(dossierId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.dossier(dossierId) });
    } catch (err) {
      console.error('[useAnalysis] Failed to trigger extraction:', err);
      setTriggerError(String(err));
      toast.error("Impossible de lancer l'analyse");
    } finally {
      triggeringDossiers.delete(dossierId);
      setIsTriggering(false);
    }
  }, [dossierId, queryClient]);

  return {
    isAnalyzing: isTriggering,
    progress: {
      phase: triggerError ? 'error' : 'idle',
      current: 0,
      total: 0,
      message: triggerError || '',
    },
    startAnalysis,
    resetForRetry,
  };
}
