import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { dossierService } from '@services/dossier.service';
import { documentService } from '@services/document.service';
import { toast } from '@components/ui/sonner';

export function useNotaryShare(shareToken) {
  const { data: dossierResult, isLoading: isDossierLoading } = useQuery({
    queryKey: ['share', shareToken],
    queryFn: () => dossierService.getDossierByShareToken(shareToken),
    enabled: !!shareToken,
    staleTime: 60_000,
  });

  const dossier = dossierResult?.data || null;
  const isExpired = dossier ? new Date(dossier.expires_at) < new Date() : false;

  const { data: docsResult, isLoading: isDocsLoading } = useQuery({
    queryKey: ['share-docs', dossier?.id],
    queryFn: () => documentService.getDocuments(dossier.id),
    enabled: !!dossier?.id && !isExpired,
    staleTime: 60_000,
  });

  const documents = docsResult?.data || [];

  // Track first access
  useEffect(() => {
    if (dossier?.id && !dossier.notary_accessed_at) {
      dossierService.incrementDownloadCount(dossier.id);
    }
  }, [dossier?.id, dossier?.notary_accessed_at]);

  const downloadPdf = async () => {
    if (!dossier?.pre_etat_date_pdf_path) {
      toast.error('PDF non disponible');
      return;
    }
    const { data: url } = await documentService.getSignedUrl(dossier.pre_etat_date_pdf_path);
    if (url) {
      window.open(url, '_blank');
      dossierService.incrementDownloadCount(dossier.id);
    }
  };

  const downloadPack = async () => {
    if (!dossier?.pack_zip_path) {
      toast.error('Pack non disponible');
      return;
    }
    const { data: url } = await documentService.getSignedUrl(dossier.pack_zip_path);
    if (url) {
      window.open(url, '_blank');
      dossierService.incrementDownloadCount(dossier.id);
    }
  };

  return {
    dossier,
    documents,
    isLoading: isDossierLoading || isDocsLoading,
    isExpired,
    downloadPdf,
    downloadPack,
  };
}
