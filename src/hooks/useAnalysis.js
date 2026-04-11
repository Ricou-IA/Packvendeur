import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@lib/supabaseClient';
import { dossierService } from '@services/dossier.service';
import { documentKeys } from './useDocuments';
import { dossierKeys } from './useDossier';
import { toast } from '@components/ui/sonner';

/**
 * useAnalysis — pay-first funnel: thin client trigger for the server-side
 * orchestrator `pv-run-extraction`.
 *
 * Previously this hook ran the whole pipeline client-side via Promise.all
 * on `pv-extract-financial` + `pv-extract-diagnostics`, then merged and
 * saved to the dossier. That design was fragile: a page refresh, tab close,
 * or fetch timeout (Gemini 2.5 Pro can take 2+ minutes) would lose the
 * extraction results even though Gemini had already processed them.
 *
 * Now everything runs inside `pv-run-extraction` via EdgeRuntime.waitUntil,
 * independently of the client. The client only fires a 202 trigger and
 * polls `pv_dossiers.status` — it can disconnect at any time without
 * losing progress.
 */

// Module-level guard: survives StrictMode unmount/remount cycles
const triggeringDossiers = new Set();

export function useAnalysis(dossierId, sessionId) {
  const queryClient = useQueryClient();
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerError, setTriggerError] = useState(null);

  const resetForRetry = useCallback(async () => {
    triggeringDossiers.delete(dossierId);
    setIsTriggering(false);
    setTriggerError(null);
    // Reset status to 'paid' so the stuck-state detection in ProcessingStep
    // will re-trigger on the next mount
    if (dossierId) {
      await dossierService.updateDossier(dossierId, { status: 'paid', extracted_data: null });
      queryClient.invalidateQueries({ queryKey: dossierKeys.session(sessionId) });
    }
  }, [dossierId, sessionId, queryClient]);

  const startAnalysis = useCallback(async () => {
    if (!dossierId) return;

    // Guard: don't re-trigger if already in flight on this tab
    if (triggeringDossiers.has(dossierId)) {
      console.warn('[useAnalysis] Trigger already in flight for', dossierId);
      return;
    }
    triggeringDossiers.add(dossierId);
    setIsTriggering(true);
    setTriggerError(null);

    try {
      const { data, error } = await supabase.functions.invoke('pv-run-extraction', {
        body: { dossier_id: dossierId },
      });

      if (error) {
        console.error('[useAnalysis] pv-run-extraction error:', error);
        setTriggerError(error.message || String(error));
        toast.error("Impossible de lancer l'analyse — veuillez réessayer");
        return;
      }

      console.log('[useAnalysis] pv-run-extraction accepted:', data);

      // Invalidate dossier + documents queries so the polling picks up the
      // new status='analyzing' quickly
      queryClient.invalidateQueries({ queryKey: dossierKeys.session(sessionId) });
      queryClient.invalidateQueries({ queryKey: documentKeys.dossier(dossierId) });
    } catch (err) {
      console.error('[useAnalysis] Failed to trigger extraction:', err);
      setTriggerError(String(err));
      toast.error("Impossible de lancer l'analyse");
    } finally {
      triggeringDossiers.delete(dossierId);
      setIsTriggering(false);
    }
  }, [dossierId, sessionId, queryClient]);

  // Legacy-compatible return shape — progress.phase is now derived from the
  // dossier status inside ProcessingStep, since the orchestration happens
  // server-side and we no longer expose granular classification/extraction
  // phases on the client.
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
