import { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dossierService } from '@services/dossier.service';

const SESSION_KEY = 'pack-vendeur-session-id';

function getOrCreateSessionId(urlSessionId) {
  if (urlSessionId) {
    localStorage.setItem(SESSION_KEY, urlSessionId);
    return urlSessionId;
  }
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export const dossierKeys = {
  all: ['dossier'],
  session: (sessionId) => [...dossierKeys.all, 'session', sessionId],
};

export function useDossier(urlSessionId) {
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const sessionId = getOrCreateSessionId(urlSessionId);
  const isCreatingRef = useRef(false);

  const { data: queryData, isLoading, error, refetch } = useQuery({
    queryKey: dossierKeys.session(sessionId),
    queryFn: () => dossierService.getDossierBySession(sessionId),
    enabled: !!sessionId,
    staleTime: 30_000,
  });

  const dossier = queryData?.data || null;

  // Auto-create dossier if none exists
  useEffect(() => {
    if (!isLoading && !dossier && sessionId && !isCreatingRef.current) {
      isCreatingRef.current = true;
      dossierService.createDossier(sessionId).then((result) => {
        if (result.data) {
          queryClient.setQueryData(dossierKeys.session(sessionId), { data: result.data, error: null });
        }
        isCreatingRef.current = false;
      });
    }
  }, [isLoading, dossier, sessionId, queryClient]);

  // Sync step from dossier
  useEffect(() => {
    if (dossier?.current_step) {
      setCurrentStep(dossier.current_step);
    }
  }, [dossier?.current_step]);

  const updateMutation = useMutation({
    mutationFn: (updates) => dossierService.updateDossier(dossier?.id, updates),
    onSuccess: (result) => {
      if (result?.data) {
        queryClient.setQueryData(dossierKeys.session(sessionId), (old) => ({
          ...old,
          data: { ...(old?.data || {}), ...result.data },
        }));
      }
    },
  });

  const updateDossier = useCallback(
    async (updates) => {
      if (!dossier?.id) return { data: null, error: new Error('Dossier non cree') };
      try {
        return await updateMutation.mutateAsync(updates);
      } catch (err) {
        return { data: null, error: err };
      }
    },
    [dossier?.id, updateMutation]
  );

  const handleSetCurrentStep = useCallback(
    (step) => {
      setCurrentStep(step);
      if (dossier?.id) {
        dossierService.updateDossier(dossier.id, { current_step: step });
      }
    },
    [dossier?.id]
  );

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
  };
}
