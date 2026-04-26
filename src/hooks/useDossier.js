import { useEffect, useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossierService } from '@services/dossier.service';
import { trackingService } from '@services/tracking.service';
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from '@lib/supabase-functions';

const SESSION_KEY = 'pack-vendeur-session-id';
const DOSSIER_ID_KEY = 'pack-vendeur-dossier-id';

function getOrCreateSessionId() {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

function getStoredDossierId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(DOSSIER_ID_KEY);
}

function setStoredDossierId(id) {
  if (typeof window === 'undefined') return;
  if (id) localStorage.setItem(DOSSIER_ID_KEY, id);
  else localStorage.removeItem(DOSSIER_ID_KEY);
}

export const dossierKeys = {
  all: ['dossier'],
  byId: (id) => [...dossierKeys.all, 'id', id],
};

export function useDossier() {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const sessionId = getOrCreateSessionId();
  const [dossierId, setDossierId] = useState(getStoredDossierId());
  const isCreatingRef = useRef(false);
  const createFailedRef = useRef(false);

  // Lecture du dossier courant via EF pv-dossier action 'get'
  const { data: queryData, isLoading, error, refetch } = useQuery({
    queryKey: dossierKeys.byId(dossierId),
    queryFn: () => dossierService.getDossier(dossierId),
    enabled: !!dossierId && !!getAccessToken(),
    staleTime: 30_000,
  });

  const dossier = queryData?.data || null;

  // Création initiale du dossier si absent
  useEffect(() => {
    if (!dossierId && !isCreatingRef.current && !createFailedRef.current && sessionId) {
      isCreatingRef.current = true;
      const utmData = trackingService.getAcquisitionData();
      const partnerData = trackingService.getPartner();
      const acquisitionPayload = partnerData
        ? {
            ...utmData,
            partner_id: partnerData.partner_id,
            partner_name: partnerData.partner_name,
          }
        : utmData;
      dossierService.createDossier(sessionId, acquisitionPayload).then((result) => {
        if (result.data?.dossier) {
          const newId = result.data.dossier.id;
          setStoredDossierId(newId);
          setDossierId(newId);
          // access_token déjà stocké dans dossier.service.createDossier
          queryClient.setQueryData(dossierKeys.byId(newId), { data: result.data.dossier, error: null });
        } else {
          console.error('[useDossier] Failed to create dossier:', result.error);
          createFailedRef.current = true;
        }
        isCreatingRef.current = false;
      });
    }
  }, [dossierId, sessionId, queryClient]);

  // Sync step depuis le dossier
  useEffect(() => {
    if (dossier?.current_step) {
      setCurrentStep(dossier.current_step);
    }
  }, [dossier?.current_step]);

  const updateMutation = useMutation({
    mutationFn: (updates) => dossierService.updateDossier(dossier?.id, updates),
    onSuccess: (result) => {
      if (result?.data) {
        queryClient.setQueryData(dossierKeys.byId(dossier.id), (old) => ({
          ...old,
          data: { ...(old?.data || {}), ...result.data },
        }));
      }
    },
  });

  const updateDossier = useCallback(
    async (updates) => {
      if (!dossier?.id) {
        return { data: null, error: new Error('Dossier non créé') };
      }
      try {
        return await updateMutation.mutateAsync(updates);
      } catch (err) {
        return { data: null, error: err };
      }
    },
    [dossier?.id, updateMutation],
  );

  const handleSetCurrentStep = useCallback(
    (step) => {
      setCurrentStep(step);
      if (dossier?.id) {
        dossierService.updateDossier(dossier.id, { current_step: step });
        trackingService.trackStep(step, dossier.id);
      }
    },
    [dossier?.id],
  );

  const resetSession = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setStoredDossierId(null);
    clearAccessToken();
    queryClient.removeQueries({ queryKey: dossierKeys.all });
    window.location.href = '/dossier';
  }, [queryClient]);

  return {
    dossier,
    sessionId,
    isLoading,
    error: queryData?.error || error,
    currentStep,
    setCurrentStep: handleSetCurrentStep,
    updateDossier,
    isUpdating: updateMutation.isPending,
    refresh: refetch,
    resetSession,
  };
}
