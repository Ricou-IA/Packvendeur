import { useState, useCallback, useRef, useEffect } from 'react';
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
    annexes_comptables: 7,
    carnet_entretien: 8,
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
    annexes_comptables: 'Annexes_Comptables',
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
  const label = isDdt ? 'DDT' : (typeLabels[type] || 'Document');
  const year = date ? date.substring(0, 4) : '';
  return `${prefix}_${label}${year ? `_${year}` : ''}.pdf`;
}

export function useDocuments(dossierId) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const classifyTimeoutsRef = useRef([]);

  useEffect(() => {
    return () => classifyTimeoutsRef.current.forEach(clearTimeout);
  }, []);

  const { data: queryData, isLoading, error: queryError } = useQuery({
    queryKey: documentKeys.dossier(dossierId),
    queryFn: () => documentService.getDocuments(dossierId),
    enabled: !!dossierId,
    staleTime: 5_000,
    refetchInterval: (query) => {
      const docs = query.state.data?.data || [];
      return docs.some((d) => !d.document_type) ? 4_000 : false;
    },
  });

  const documents = queryData?.data || [];

  const classifyInBackground = useCallback(
    async (doc, userHintType) => {
      if (!dossierId || !doc?.id) return;

      try {
        // Le serveur lit le fichier depuis Storage et gère la cache d'URI Gemini.
        // Le client n'envoie plus de base64 — payload < 200 bytes.
        // Plus de limite 6 MB sur les gros DDT.
        let classification = null;
        let classifyError = null;
        const MAX_RETRIES = 2;

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          const result = await geminiService.classifyDocument(doc.id, dossierId);
          classification = result.data;
          classifyError = result.error;

          if (!classifyError) break;
          const is429 =
            classifyError?.message?.includes('429') ||
            classifyError?.message?.includes('RESOURCE_EXHAUSTED');
          if (!is429 || attempt === MAX_RETRIES) break;

          const delay = (attempt + 1) * 5000 + Math.random() * 2000;
          console.warn(
            `[useDocuments] Rate-limited (429) for ${doc.original_filename}, retry ${attempt + 1}/${MAX_RETRIES} in ${Math.round(delay / 1000)}s`,
          );
          await new Promise((r) => setTimeout(r, delay));
        }

        if (classifyError) {
          console.error(
            `[useDocuments] Classification API error for ${doc.original_filename}:`,
            classifyError,
          );
          toast.error(`Classification échouée : ${doc.original_filename}`);
          return;
        }

        if (classification) {
          const finalType = userHintType || classification.document_type;
          const diagCouverts = classification.diagnostics_couverts || [];
          const isDdt = diagCouverts.length > 1;
          const sortOrder = isDdt ? 10 : getSortOrder(finalType);
          const normalized = getNormalizedFilename(
            finalType,
            classification.date,
            sortOrder,
            isDdt,
          );

          const { error: updateError } = await documentService.updateDocument(
            doc.id,
            {
              document_type: finalType,
              ai_confidence: classification.confidence,
              ai_classification_raw: classification,
              normalized_filename: normalized,
              sort_order: sortOrder,
            },
            dossierId,
          );

          if (updateError) {
            console.error(
              `[useDocuments] Failed to save classification for ${doc.original_filename}:`,
              updateError,
            );
            toast.error(`Erreur sauvegarde classification : ${doc.original_filename}`);
          }

          const dpeAdemeNumber = classification.dpe_ademe_number;
          if (
            dpeAdemeNumber &&
            typeof dpeAdemeNumber === 'string' &&
            dpeAdemeNumber.length >= 10
          ) {
            console.log(
              `[useDocuments] DPE ADEME number found: ${dpeAdemeNumber}, saving to dossier`,
            );
            await dossierService.updateDossier(dossierId, {
              dpe_ademe_number: dpeAdemeNumber,
            });
            queryClient.invalidateQueries({ queryKey: dossierKeys.all });
          }
        }
      } catch (error) {
        console.error(
          `[useDocuments] Background classify failed for ${doc.original_filename}:`,
          error,
        );
        toast.error(`Classification échouée : ${doc.original_filename}`);
      } finally {
        queryClient.invalidateQueries({ queryKey: documentKeys.dossier(dossierId) });
      }
    },
    [dossierId, queryClient],
  );

  const uploadFiles = useCallback(
    async (acceptedFiles, itemId) => {
      if (!dossierId || acceptedFiles.length === 0) return;

      setIsUploading(true);
      const hintType = itemId || null;

      // ===== OPTIMISTIC INSERT (latence perçue = 0) =====
      // On ajoute des placeholders à la liste IMMÉDIATEMENT, avant même de
      // commencer l'upload. Le user voit le fichier apparaître dès le drop.
      // Les placeholders ont un flag `_optimistic: true` pour permettre à l'UI
      // d'afficher un spinner. Ils sont remplacés par les vrais docs au fur
      // et à mesure des uploads.
      const optimisticDocs = acceptedFiles.map((file) => ({
        id: `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${file.name}`,
        _optimistic: true,
        dossier_id: dossierId,
        original_filename: file.name,
        file_size_bytes: file.size,
        mime_type: file.type || 'application/pdf',
        document_type: hintType,
        normalized_filename: null,
        sort_order: hintType ? 50 : 99,
        created_at: new Date().toISOString(),
      }));

      queryClient.setQueryData(
        documentKeys.dossier(dossierId),
        (old) => ({ ...old, data: [...(old?.data || []), ...optimisticDocs] }),
      );

      acceptedFiles.forEach((file) =>
        setUploadProgress((prev) => ({ ...prev, [file.name]: 'uploading' })),
      );

      // ===== Upload réel en arrière-plan, remplace les placeholders =====
      const results = [];
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        const optimisticId = optimisticDocs[i].id;

        const { data, error } = await documentService.uploadDocument(
          dossierId,
          file,
          hintType,
        );

        if (error) {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 'error' }));
          toast.error(`Erreur upload : ${file.name} — ${error.message}`);
          // Retire le placeholder en erreur
          queryClient.setQueryData(
            documentKeys.dossier(dossierId),
            (old) => ({
              ...old,
              data: (old?.data || []).filter((d) => d.id !== optimisticId),
            }),
          );
        } else {
          setUploadProgress((prev) => ({ ...prev, [file.name]: 'done' }));
          results.push(data);

          // Remplace le placeholder par le vrai doc (id réel + classified=false)
          queryClient.setQueryData(
            documentKeys.dossier(dossierId),
            (old) => ({
              ...old,
              data: (old?.data || []).map((d) =>
                d.id === optimisticId ? data : d,
              ),
            }),
          );

          // Stagger classifications by 2s per file to avoid Gemini rate-limits
          const delayMs = results.length > 1 ? (results.length - 1) * 2000 : 0;
          if (delayMs > 0) {
            const tid = setTimeout(() => classifyInBackground(data, hintType), delayMs);
            classifyTimeoutsRef.current.push(tid);
          } else {
            classifyInBackground(data, hintType);
          }
        }
      }

      if (results.length > 0) {
        // Sanity re-fetch en background (au cas où la cache a divergé)
        queryClient.invalidateQueries({ queryKey: documentKeys.dossier(dossierId) });
      }

      setIsUploading(false);
      setTimeout(() => setUploadProgress({}), 2000);
    },
    [dossierId, queryClient, classifyInBackground],
  );

  const removeDocument = useCallback(
    async (documentId) => {
      // Optimistic remove : on retire le doc immédiatement de la liste,
      // puis on appelle l'EF en arrière-plan. Si erreur, on re-fetch
      // pour récupérer l'état réel.
      const previous = queryClient.getQueryData(documentKeys.dossier(dossierId));
      queryClient.setQueryData(
        documentKeys.dossier(dossierId),
        (old) => ({
          ...old,
          data: (old?.data || []).filter((d) => d.id !== documentId),
        }),
      );

      const { error } = await documentService.removeDocument(documentId, dossierId);
      if (error) {
        toast.error('Erreur lors de la suppression');
        // Rollback : on restaure la cache précédente
        if (previous) queryClient.setQueryData(documentKeys.dossier(dossierId), previous);
      }
    },
    [dossierId, queryClient],
  );

  return {
    documents,
    isLoading,
    error: queryError,
    isUploading,
    uploadProgress,
    uploadFiles,
    removeDocument,
  };
}
