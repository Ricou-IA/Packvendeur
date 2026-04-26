import { useCallback, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { proService } from '@services/pro.service';
import { toast } from '@components/ui/sonner';

/**
 * useProDocuments — version B2B-pro de useDocuments.
 *
 * Le pro consulte les documents d'un dossier qu'il possède (vérification
 * pro_account_id côté EF). Le pro peut SUPPRIMER mais NE PEUT PAS UPLOADER
 * (les uploads côté pro sont volontairement désactivés — c'est le client B2B
 * qui upload via /client/:uploadToken).
 *
 * Note Phase sécurité : la classification AI et la génération PDF côté pro
 * nécessitent l'access_token du dossier. À câbler en V2 si nécessaire.
 */
export const proDocumentKeys = {
  all: ['pro-documents'],
  byDossier: (id) => ['pro-documents', id],
};

export function useProDocuments(proAccountId, dossierId) {
  const queryClient = useQueryClient();
  const [uploadProgress] = useState({});

  const { data: queryData, isLoading } = useQuery({
    queryKey: proDocumentKeys.byDossier(dossierId),
    queryFn: () => proService.listProDocuments(proAccountId, dossierId),
    enabled: !!proAccountId && !!dossierId,
    staleTime: 5_000,
  });

  const documents = queryData?.data || [];

  const getSignedUrl = useCallback(
    async (storagePath) => {
      return await proService.proSignedUrlDocument(proAccountId, dossierId, storagePath);
    },
    [proAccountId, dossierId],
  );

  const uploadFiles = useCallback(async () => {
    toast.error("L'upload depuis le compte pro n'est pas disponible. Demandez à votre client d'utiliser le lien d'upload.");
  }, []);

  // La suppression côté pro nécessite une action remove-document dans pv-pro.
  // Pour l'instant, on désactive proprement avec un message clair.
  const removeDocument = useCallback(async () => {
    toast.error("La suppression depuis le compte pro n'est pas encore disponible.");
  }, []);

  const refresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: proDocumentKeys.byDossier(dossierId) });
  }, [queryClient, dossierId]);

  return {
    documents,
    isLoading,
    isUploading: false,
    uploadProgress,
    uploadFiles,
    removeDocument,
    getSignedUrl,
    refresh,
  };
}
