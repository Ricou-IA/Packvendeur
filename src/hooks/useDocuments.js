import { useState, useCallback, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { documentService } from '@services/document.service';
import { dossierService } from '@services/dossier.service';
import { geminiService } from '@services/gemini.service';
import { toast } from '@components/ui/sonner';
import { dossierKeys } from '@hooks/useDossier';

export const documentKeys = {
  all: ['documents'],
  dossier: (dossierId) => [...documentKeys.all, dossierId],
};

function getSortOrder(type) {
  const order = {
    reglement_copropriete: 1,
    etat_descriptif_division: 2,
    fiche_synthetique: 3,
    pv_ag: 4,
    appel_fonds: 5,
    releve_charges: 6,
    carnet_entretien: 7,
    plan_pluriannuel: 8,
    dtg: 9,
    dpe: 10,
    diagnostic_amiante: 11,
    diagnostic_plomb: 12,
    diagnostic_electricite: 13,
    diagnostic_gaz: 14,
    diagnostic_termites: 15,
    diagnostic_erp: 16,
    diagnostic_mesurage: 17,
    audit_energetique: 18,
    taxe_fonciere: 20,
    bail: 21,
    contrat_assurance: 22,
    other: 99,
  };
  return order[type] || 50;
}

function getNormalizedFilename(type, date, sortOrder, isDdt) {
  const prefix = String(sortOrder).padStart(2, '0');
  const typeLabels = {
    pv_ag: 'PV_AG',
    reglement_copropriete: 'Reglement_Copropriete',
    etat_descriptif_division: 'Etat_Descriptif_Division',
    appel_fonds: 'Appel_Fonds',
    releve_charges: 'Releve_Charges',
    carnet_entretien: 'Carnet_Entretien',
    dpe: 'DPE',
    diagnostic_amiante: 'Diagnostic_Amiante',
    diagnostic_plomb: 'Diagnostic_Plomb',
    diagnostic_termites: 'Diagnostic_Termites',
    diagnostic_electricite: 'Diagnostic_Electricite',
    diagnostic_gaz: 'Diagnostic_Gaz',
    diagnostic_erp: 'ERP',
    diagnostic_mesurage: 'Mesurage_Carrez',
    fiche_synthetique: 'Fiche_Synthetique',
    plan_pluriannuel: 'Plan_Pluriannuel',
    dtg: 'DTG',
    audit_energetique: 'Audit_Energetique',
    taxe_fonciere: 'Taxe_Fonciere',
    bail: 'Bail',
    contrat_assurance: 'Contrat_Assurance',
    other: 'Autre',
  };
  // If the document is a combined DDT (multiple diagnostics), use "DDT" label
  const label = isDdt ? 'DDT' : (typeLabels[type] || 'Document');
  const year = date ? date.substring(0, 4) : '';
  return `${prefix}_${label}${year ? `_${year}` : ''}.pdf`;
}

export function useDocuments(dossierId) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const classifyingCount = useRef(0);

  const { data: queryData, isLoading } = useQuery({
    queryKey: documentKeys.dossier(dossierId),
    queryFn: () => documentService.getDocuments(dossierId),
    enabled: !!dossierId,
    staleTime: 5_000,
    // Poll every 4s while any document lacks a type (being classified) — safety net
    refetchInterval: (query) => {
      const docs = query.state.data?.data || [];
      return docs.some((d) => !d.document_type) ? 4_000 : false;
    },
  });

  const documents = queryData?.data || [];

  // Background classification after upload with retry on rate-limit (429)
  // userHintType: if the user dropped on a specific checklist item, keep that type
  const classifyInBackground = useCallback(
    async (doc, userHintType) => {
      if (!dossierId) return;
      classifyingCount.current++;

      try {
        const { data: base64 } = await documentService.getFileAsBase64(doc.storage_path);
        if (!base64) {
          console.warn(`[useDocuments] No base64 for ${doc.original_filename}, skipping classification`);
          return;
        }

        // Retry up to 2 times on rate-limit (429) errors with exponential backoff
        let classification = null;
        let classifyError = null;
        const MAX_RETRIES = 2;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          const result = await geminiService.classifyDocument(
            base64,
            doc.original_filename,
            dossierId
          );
          classification = result.data;
          classifyError = result.error;

          // If success or non-retryable error, stop
          if (!classifyError) break;
          const is429 = classifyError?.message?.includes('429') || classifyError?.message?.includes('RESOURCE_EXHAUSTED');
          if (!is429 || attempt === MAX_RETRIES) break;

          // Backoff: 5s, 15s
          const delay = (attempt + 1) * 5000 + Math.random() * 2000;
          console.warn(`[useDocuments] Rate-limited (429) for ${doc.original_filename}, retry ${attempt + 1}/${MAX_RETRIES} in ${Math.round(delay / 1000)}s`);
          await new Promise((r) => setTimeout(r, delay));
        }

        if (classifyError) {
          console.error(`[useDocuments] Classification API error for ${doc.original_filename}:`, classifyError);
          toast.error(`Classification échouée : ${doc.original_filename}`);
          return;
        }

        if (classification) {
          // If user explicitly dropped on a checklist item, keep their choice
          // Only use AI type if no user hint was provided
          const finalType = userHintType || classification.document_type;

          // Detect combined DDT (multiple diagnostics in one PDF)
          const diagCouverts = classification.diagnostics_couverts || [];
          const isDdt = diagCouverts.length > 1;

          // For a DDT, use sort_order 10 (between dtg and individual diagnostics)
          const sortOrder = isDdt ? 10 : getSortOrder(finalType);
          const normalized = getNormalizedFilename(
            finalType,
            classification.date,
            sortOrder,
            isDdt
          );

          const { error: updateError } = await documentService.updateDocument(doc.id, {
            document_type: finalType,
            ai_confidence: classification.confidence,
            ai_classification_raw: classification,
            normalized_filename: normalized,
            sort_order: sortOrder,
          });

          if (updateError) {
            console.error(`[useDocuments] Failed to save classification for ${doc.original_filename}:`, updateError);
            toast.error(`Erreur sauvegarde classification : ${doc.original_filename}`);
          }

          // If classification found a DPE ADEME number, save it to the dossier
          // so DpeSection can auto-verify it
          const dpeAdemeNumber = classification.dpe_ademe_number;
          if (dpeAdemeNumber && typeof dpeAdemeNumber === 'string' && dpeAdemeNumber.length >= 10) {
            console.log(`[useDocuments] DPE ADEME number found: ${dpeAdemeNumber}, saving to dossier`);
            await dossierService.updateDossier(dossierId, { dpe_ademe_number: dpeAdemeNumber });
            // Invalidate dossier query so DpeSection picks up the new value
            queryClient.invalidateQueries({ queryKey: dossierKeys.all });
          }
        }
      } catch (error) {
        console.error(`[useDocuments] Background classify failed for ${doc.original_filename}:`, error);
        toast.error(`Classification échouée : ${doc.original_filename}`);
      } finally {
        classifyingCount.current--;
        // ALWAYS invalidate queries so the UI refreshes — even on failure,
        // this prevents the spinner from being stuck forever
        queryClient.invalidateQueries({ queryKey: documentKeys.dossier(dossierId) });
      }
    },
    [dossierId, queryClient]
  );

  const uploadFiles = useCallback(
    async (acceptedFiles, itemId) => {
      if (!dossierId || acceptedFiles.length === 0) return;

      setIsUploading(true);
      const results = [];

      for (const file of acceptedFiles) {
        setUploadProgress((prev) => ({ ...prev, [file.name]: 'uploading' }));

        // Pre-assign document_type based on which checklist item the user dropped onto
        const hintType = itemId || null;
        const { data, error } = await documentService.uploadDocument(dossierId, file, hintType);

        if (error) {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 'error' }));
          toast.error(`Erreur upload: ${file.name}`);
        } else {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 'done' }));
          results.push(data);

          // Start background classification (non-blocking)
          // Pass hintType so user's explicit choice is preserved
          // Stagger classifications by 2s per file to avoid Gemini rate-limits
          const delayMs = results.length > 1 ? (results.length - 1) * 2000 : 0;
          if (delayMs > 0) {
            setTimeout(() => classifyInBackground(data, hintType), delayMs);
          } else {
            classifyInBackground(data, hintType);
          }
        }
      }

      if (results.length > 0) {
        queryClient.invalidateQueries({ queryKey: documentKeys.dossier(dossierId) });
        toast.success(`${results.length} document(s) uploadé(s)`);
      }

      setIsUploading(false);
      setTimeout(() => setUploadProgress({}), 2000);
    },
    [dossierId, queryClient, classifyInBackground]
  );

  const removeDocument = useCallback(
    async (documentId, storagePath) => {
      const { error } = await documentService.removeDocument(documentId, storagePath);
      if (error) {
        toast.error('Erreur lors de la suppression');
      } else {
        queryClient.invalidateQueries({ queryKey: documentKeys.dossier(dossierId) });
        toast.success('Document supprimé');
      }
    },
    [dossierId, queryClient]
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
