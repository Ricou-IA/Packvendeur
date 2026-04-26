import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import JSZip from 'jszip';
import { dossierService } from '@services/dossier.service';
import { toast } from '@components/ui/sonner';

/**
 * useNotaryShare — page publique notaire (route /share/:shareToken).
 *
 * Toute l'auth + la fetch de dossier/documents/URLs signées passe par un seul
 * appel à pv-notary action 'get-data'. La réponse contient :
 *   - dossier (filtré : pas de session_id, access_token, données financières, etc.)
 *   - documents (filtrés : pas de storage_path, extracted_data, extracted_text)
 *   - pdf_signed_url (URL signée 10 min vers le PDF principal)
 *   - pack_files (toutes les signed URLs en bulk pour le ZIP)
 */
export function useNotaryShare(shareToken) {
  const [isDownloadingPack, setIsDownloadingPack] = useState(false);

  const { data: queryData, isLoading } = useQuery({
    queryKey: ['notary', shareToken],
    queryFn: () => dossierService.getNotaryData(shareToken),
    enabled: !!shareToken,
    staleTime: 60_000,
  });

  const payload = queryData?.data || null;
  const dossier = payload?.dossier || null;
  const documents = payload?.documents || [];
  const pdfSignedUrl = payload?.pdf_signed_url || null;
  const packFiles = payload?.pack_files || [];

  const isExpired = dossier
    ? new Date(dossier.expires_at) < new Date()
    : false;

  // Track first access (fire-and-forget)
  useEffect(() => {
    if (dossier?.id && !dossier.notary_accessed_at && shareToken) {
      dossierService.incrementNotaryDownload(shareToken);
    }
  }, [dossier?.id, dossier?.notary_accessed_at, shareToken]);

  const downloadPdf = async () => {
    if (!pdfSignedUrl) {
      toast.error('PDF non disponible');
      return;
    }
    window.open(pdfSignedUrl, '_blank');
    if (shareToken) {
      dossierService.incrementNotaryDownload(shareToken);
    }
  };

  const downloadPack = async () => {
    if (!packFiles.length) {
      toast.error('Aucun document à télécharger');
      return;
    }

    setIsDownloadingPack(true);
    const toastId = toast.loading('Préparation du pack...');

    try {
      const zip = new JSZip();

      // Fetch all files in parallel using their pre-signed URLs
      const results = await Promise.allSettled(
        packFiles.map(async (file) => {
          const response = await fetch(file.signed_url);
          if (!response.ok) throw new Error(`Failed to fetch ${file.name}`);
          const blob = await response.blob();
          zip.file(file.name, blob);
        }),
      );

      const failed = results.filter((r) => r.status === 'rejected');
      if (failed.length > 0) {
        console.warn('[useNotaryShare] Some files failed:', failed);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(zipBlob);
      const safeAddress = dossier?.property_address
        ? dossier.property_address.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40)
        : (dossier?.id || 'dossier').slice(0, 8);
      link.download = `Pack_Vendeur_${safeAddress}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);

      toast.dismiss(toastId);
      toast.success(`Pack téléchargé (${packFiles.length - failed.length} fichiers)`);
      if (shareToken) {
        dossierService.incrementNotaryDownload(shareToken);
      }
    } catch (error) {
      console.error('[useNotaryShare] downloadPack error:', error);
      toast.dismiss(toastId);
      toast.error('Erreur lors de la création du pack');
    } finally {
      setIsDownloadingPack(false);
    }
  };

  return {
    dossier,
    documents,
    isLoading,
    isExpired,
    isDownloadingPack,
    downloadPdf,
    downloadPack,
  };
}
