import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import JSZip from 'jszip';
import { dossierService } from '@services/dossier.service';
import { documentService } from '@services/document.service';
import { toast } from '@components/ui/sonner';

export function useNotaryShare(shareToken) {
  const [isDownloadingPack, setIsDownloadingPack] = useState(false);

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
    if (!dossier?.id) return;

    // Collect all files to include in the ZIP
    const filesToZip = [];

    // 1. Add the PDF if it exists
    if (dossier.pre_etat_date_pdf_path) {
      filesToZip.push({
        name: 'Pre-etat-date.pdf',
        storagePath: dossier.pre_etat_date_pdf_path,
      });
    }

    // 2. Add all classified documents
    for (const doc of documents) {
      if (!doc.storage_path) continue;
      const filename = doc.normalized_filename || doc.original_filename || `document_${doc.id}.pdf`;
      filesToZip.push({ name: filename, storagePath: doc.storage_path });
    }

    if (filesToZip.length === 0) {
      toast.error('Aucun document à télécharger');
      return;
    }

    setIsDownloadingPack(true);
    const toastId = toast.loading('Préparation du pack...');

    try {
      const zip = new JSZip();

      // Fetch all files in parallel and add to ZIP
      const results = await Promise.allSettled(
        filesToZip.map(async (file) => {
          const { data: url } = await documentService.getSignedUrl(file.storagePath);
          if (!url) throw new Error(`URL not found for ${file.name}`);
          const response = await fetch(url);
          if (!response.ok) throw new Error(`Failed to fetch ${file.name}`);
          const blob = await response.blob();
          zip.file(file.name, blob);
        })
      );

      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        console.warn('[downloadPack] Some files failed:', failed);
      }

      // Generate ZIP and trigger download
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      link.download = `Pack_Vendeur_${dossier.property_address ? dossier.property_address.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40) : dossier.id.slice(0, 8)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.dismiss(toastId);
      toast.success(`Pack téléchargé (${filesToZip.length - failed.length} fichiers)`);
      dossierService.incrementDownloadCount(dossier.id);
    } catch (error) {
      console.error('[downloadPack] Error:', error);
      toast.dismiss(toastId);
      toast.error('Erreur lors de la création du pack');
    } finally {
      setIsDownloadingPack(false);
    }
  };

  return {
    dossier,
    documents,
    isLoading: isDossierLoading || isDocsLoading,
    isExpired,
    isDownloadingPack,
    downloadPdf,
    downloadPack,
  };
}
