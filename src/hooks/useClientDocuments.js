import { useState, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { clientUploadService } from '@services/clientUpload.service';
import { toast } from '@components/ui/sonner';

/**
 * useClientDocuments — version B2B-client de useDocuments.
 *
 * Le client B2B (page /client/:uploadToken) n'a ni access_token ni pro_token.
 * Il utilise uniquement le upload_token (122 bits d'entropie via UUID sans
 * tirets) pour s'authentifier auprès de pv-client-upload.
 *
 * Note Phase sécurité : la classification AI (pv-classify) n'est PAS branchée
 * ici car elle exige un X-Pv-Access-Token. Câblage à finaliser dans une phase
 * complémentaire (option : passer la classification côté serveur après upload,
 * via un trigger DB ou un appel post-upload depuis pv-client-upload).
 */
export const documentKeys = {
  all: ['client-documents'],
  byToken: (token) => ['client-documents', token],
};

export function useClientDocuments(uploadToken) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});

  const { data: queryData, isLoading } = useQuery({
    queryKey: documentKeys.byToken(uploadToken),
    queryFn: () => clientUploadService.listDocuments(uploadToken),
    enabled: !!uploadToken,
    staleTime: 5_000,
  });

  const documents = queryData?.data || [];

  const uploadFiles = useCallback(
    async (acceptedFiles, itemId) => {
      if (!uploadToken || acceptedFiles.length === 0) return;
      setIsUploading(true);
      const results = [];

      for (const file of acceptedFiles) {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 'uploading' }));
        const { data, error } = await clientUploadService.uploadDocument(
          uploadToken,
          file,
          itemId || null,
        );
        if (error) {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 'error' }));
          toast.error(`Erreur upload : ${file.name} — ${error.message}`);
        } else {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 'done' }));
          results.push(data);
        }
      }

      if (results.length > 0) {
        queryClient.invalidateQueries({ queryKey: documentKeys.byToken(uploadToken) });
        toast.success(`${results.length} document(s) uploadé(s)`);
      }

      setIsUploading(false);
      setTimeout(() => setUploadProgress({}), 2000);
    },
    [uploadToken, queryClient],
  );

  const removeDocument = useCallback(
    async (documentId) => {
      const { error } = await clientUploadService.removeDocument(uploadToken, documentId);
      if (error) {
        toast.error('Erreur lors de la suppression');
      } else {
        queryClient.invalidateQueries({ queryKey: documentKeys.byToken(uploadToken) });
        toast.success('Document supprimé');
      }
    },
    [uploadToken, queryClient],
  );

  return {
    documents,
    isLoading,
    isUploading,
    uploadProgress,
    uploadFiles,
    removeDocument,
  };
}
