import { useCallback, useRef, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { proService } from '@services/pro.service';

const PRO_TOKEN_KEY = 'pack-vendeur-pro-token';

function getProToken() {
  return localStorage.getItem(PRO_TOKEN_KEY);
}

function setProToken(token) {
  localStorage.setItem(PRO_TOKEN_KEY, token);
}

function clearProToken() {
  localStorage.removeItem(PRO_TOKEN_KEY);
}

export const proKeys = {
  all: ['pro'],
  account: (token) => ['pro', 'account', token],
  dossiers: (proId) => ['pro', 'dossiers', proId],
  credits: (proId) => ['pro', 'credits', proId],
  transactions: (proId) => ['pro', 'transactions', proId],
};

export function useProAccount() {
  const proToken = getProToken();

  const { data: queryData, isLoading } = useQuery({
    queryKey: proKeys.account(proToken),
    queryFn: () => proService.getAccountByToken(proToken),
    enabled: !!proToken,
    staleTime: 30_000,
  });

  const proAccount = queryData?.data || null;

  return {
    proAccount,
    proToken,
    isLoading,
    isRegistered: !!proToken && !!proAccount,
  };
}

export function useProRegister() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ email, companyName }) => proService.createAccount(email, companyName),
    onSuccess: (result) => {
      if (result?.data) {
        setProToken(result.data.pro_token);
        queryClient.setQueryData(proKeys.account(result.data.pro_token), { data: result.data, error: null });
      }
    },
  });

  const register = useCallback(
    async (email, companyName) => {
      try {
        return await mutation.mutateAsync({ email, companyName });
      } catch (err) {
        return { data: null, error: err };
      }
    },
    [mutation]
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
    [createMutation]
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
      queryClient.invalidateQueries({ queryKey: proKeys.account(getProToken()) });
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
    [consumeMutation]
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
    queryClient.removeQueries({ queryKey: proKeys.all });
    window.location.href = '/pro';
  }, [queryClient]);
}
