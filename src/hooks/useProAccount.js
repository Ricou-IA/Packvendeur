import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proService } from '@services/pro.service';
import {
  getProToken,
  setProToken,
  clearProToken,
} from '@lib/supabase-functions';

const PRO_ACCOUNT_ID_KEY = 'pack-vendeur-pro-account-id';

function getStoredProAccountId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PRO_ACCOUNT_ID_KEY);
}

function setStoredProAccountId(id) {
  if (typeof window === 'undefined') return;
  if (id) localStorage.setItem(PRO_ACCOUNT_ID_KEY, id);
  else localStorage.removeItem(PRO_ACCOUNT_ID_KEY);
}

export const proKeys = {
  all: ['pro'],
  account: (id) => ['pro', 'account', id],
  dossiers: (id) => ['pro', 'dossiers', id],
  credits: (id) => ['pro', 'credits', id],
  transactions: (id) => ['pro', 'transactions', id],
};

export function useProAccount() {
  const proToken = getProToken();
  const proAccountId = getStoredProAccountId();

  const { data: queryData, isLoading } = useQuery({
    queryKey: proKeys.account(proAccountId),
    queryFn: () => proService.getAccount(proAccountId),
    enabled: !!proToken && !!proAccountId,
    staleTime: 30_000,
  });

  const proAccount = queryData?.data || null;

  return {
    proAccount,
    proToken,
    proAccountId,
    isLoading,
    isRegistered: !!proToken && !!proAccountId && !!proAccount,
  };
}

export function useProRegister() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ email, companyName, password }) =>
      proService.createAccount(email, companyName, password),
    onSuccess: (result) => {
      if (result?.data) {
        // pro_token déjà stocké par pro.service.createAccount
        setStoredProAccountId(result.data.id);
        queryClient.setQueryData(proKeys.account(result.data.id), {
          data: result.data,
          error: null,
        });
      }
    },
  });

  const register = useCallback(
    async (email, companyName, password = null) => {
      try {
        return await mutation.mutateAsync({ email, companyName, password });
      } catch (err) {
        return { data: null, error: err };
      }
    },
    [mutation],
  );

  return {
    register,
    isRegistering: mutation.isPending,
    error: mutation.error,
  };
}

export function useProDossiers(proAccountId) {
  const queryClient = useQueryClient();

  const { data: queryData, isLoading, refetch } = useQuery({
    queryKey: proKeys.dossiers(proAccountId),
    queryFn: () => proService.getDossiersByPro(proAccountId),
    enabled: !!proAccountId,
    staleTime: 10_000,
    refetchInterval: 30_000,
  });

  const dossiers = queryData?.data || [];

  const createMutation = useMutation({
    mutationFn: (clientData) => proService.createProDossier(proAccountId, clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proKeys.dossiers(proAccountId) });
    },
  });

  const createDossier = useCallback(
    async (clientData) => {
      try {
        return await createMutation.mutateAsync(clientData);
      } catch (err) {
        return { data: null, error: err };
      }
    },
    [createMutation],
  );

  return {
    dossiers,
    isLoading,
    createDossier,
    isCreating: createMutation.isPending,
    refresh: refetch,
  };
}

export function useProCredits(proAccountId) {
  const queryClient = useQueryClient();

  const { data: txData, isLoading } = useQuery({
    queryKey: proKeys.transactions(proAccountId),
    queryFn: () => proService.getCreditTransactions(proAccountId),
    enabled: !!proAccountId,
    staleTime: 30_000,
  });

  const transactions = txData?.data || [];

  const consumeMutation = useMutation({
    mutationFn: ({ dossierId }) => proService.consumeCredit(proAccountId, dossierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proKeys.account(proAccountId) });
      queryClient.invalidateQueries({ queryKey: proKeys.transactions(proAccountId) });
      queryClient.invalidateQueries({ queryKey: proKeys.dossiers(proAccountId) });
    },
  });

  const consumeCredit = useCallback(
    async (dossierId) => {
      try {
        return await consumeMutation.mutateAsync({ dossierId });
      } catch (err) {
        return { data: null, error: err };
      }
    },
    [consumeMutation],
  );

  return {
    transactions,
    isLoading,
    consumeCredit,
    isConsuming: consumeMutation.isPending,
  };
}

export function useProLogout() {
  const queryClient = useQueryClient();

  return useCallback(() => {
    clearProToken();
    setStoredProAccountId(null);
    queryClient.removeQueries({ queryKey: proKeys.all });
    window.location.href = '/pro';
  }, [queryClient]);
}
