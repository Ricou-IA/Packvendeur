import { useQuery } from '@tanstack/react-query';
import { proService } from '@services/pro.service';

const clientKeys = {
  dossier: (token) => ['client', 'dossier', token],
};

/**
 * useClientUpload — page publique B2B /client/:uploadToken
 *
 * Le upload_token est passé en body à l'EF pv-client-upload qui retourne
 * en un seul appel : dossier (filtré) + pro_account (info branding minimale
 * avec logo signed_url).
 */
export function useClientUpload(uploadToken) {
  const { data: queryData, isLoading, error } = useQuery({
    queryKey: clientKeys.dossier(uploadToken),
    queryFn: () => proService.getDossierByUploadToken(uploadToken),
    enabled: !!uploadToken,
    staleTime: 30_000,
  });

  const payload = queryData?.data || null;
  const dossier = payload?.dossier || null;
  const proAccount = payload?.pro_account || null;

  return {
    dossier,
    proAccount,
    isLoading,
    error: queryData?.error || error,
    isNotFound: !isLoading && !dossier,
  };
}
