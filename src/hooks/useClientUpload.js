import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { proService } from '@services/pro.service';

const clientKeys = {
  dossier: (token) => ['client', 'dossier', token],
  proAccount: (proId) => ['client', 'pro', proId],
};

export function useClientUpload(uploadToken) {
  const { data: queryData, isLoading, error } = useQuery({
    queryKey: clientKeys.dossier(uploadToken),
    queryFn: () => proService.getDossierByUploadToken(uploadToken),
    enabled: !!uploadToken,
    staleTime: 30_000,
  });

  const dossier = queryData?.data || null;

  // Fetch pro account info for branding
  const { data: proData } = useQuery({
    queryKey: clientKeys.proAccount(dossier?.pro_account_id),
    queryFn: () => {
      // We need to fetch by ID, but our service only has getByToken
      // Use a direct supabase query instead
      return import('@lib/supabaseClient').then(({ default: supabase }) =>
        supabase
          .from('pv_pro_accounts')
          .select('company_name, logo_path')
          .eq('id', dossier.pro_account_id)
          .single()
          .then(({ data, error }) => ({ data, error: error || null }))
      );
    },
    enabled: !!dossier?.pro_account_id,
    staleTime: 60_000,
  });

  const proAccount = proData?.data || null;

  return {
    dossier,
    proAccount,
    isLoading,
    error: queryData?.error || error,
    isNotFound: !isLoading && !dossier,
  };
}
