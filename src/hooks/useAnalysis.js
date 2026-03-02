import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { geminiService } from '@services/gemini.service';
import { documentService } from '@services/document.service';
import { dossierService } from '@services/dossier.service';
import { documentKeys } from './useDocuments';
import { dossierKeys } from './useDossier';
import { toast } from '@components/ui/sonner';

// ---------- Type coercion helpers ----------

// Safely coerce a value to a number or null
// Handles French formatting: spaces as thousands separators, comma as decimal
function toNum(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'number') return Number.isFinite(val) ? val : null;
  const cleaned = String(val).replace(/\s/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

// Safely coerce a date to ISO format (YYYY-MM-DD) or null
function toDate(val) {
  if (!val || typeof val !== 'string') return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
  const frMatch = val.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (frMatch) return `${frMatch[3]}-${frMatch[2]}-${frMatch[1]}`;
  const d = new Date(val);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return null;
}

// Extract DPE class letter (A-G) from a value
function toChar1(val) {
  if (!val || typeof val !== 'string') return null;
  const upper = val.trim().toUpperCase();
  if (/^[A-G]$/.test(upper)) return upper;
  const match = val.match(/\b([A-Ga-g])\b/);
  if (match) return match[1].toUpperCase();
  const anyMatch = val.match(/[A-Ga-g]/);
  return anyMatch ? anyMatch[0].toUpperCase() : null;
}

// ---------- Document routing ----------

const PHASE1_TYPES = new Set([
  'pv_ag', 'reglement_copropriete', 'etat_descriptif_division',
  'appel_fonds', 'releve_charges', 'fiche_synthetique',
  'carnet_entretien', 'taxe_fonciere',
]);

const PHASE2_TYPES = new Set([
  'dpe', 'diagnostic_amiante', 'diagnostic_plomb', 'diagnostic_termites',
  'diagnostic_electricite', 'diagnostic_gaz', 'diagnostic_erp',
  'diagnostic_mesurage', 'audit_energetique', 'dtg',
  'plan_pluriannuel', 'plan_pluriannuel_travaux',
  'bail', 'contrat_assurance',
]);

// Documents sent to BOTH phases
const SHARED_TYPES = new Set(['fiche_synthetique']);

// All types that should be sent to extraction (union of both phases)
const ALL_EXTRACTION_TYPES = new Set([...PHASE1_TYPES, ...PHASE2_TYPES]);

function routeDocuments(docs) {
  const phase1Docs = [];
  const phase2Docs = [];

  for (const doc of docs) {
    const t = doc.document_type;
    const inP1 = PHASE1_TYPES.has(t);
    const inP2 = PHASE2_TYPES.has(t);
    const isShared = SHARED_TYPES.has(t);

    if (inP1) phase1Docs.push(doc);
    if (inP2) phase2Docs.push(doc);
    // Shared docs go to both — ensure no duplicates
    if (isShared && !inP1) phase1Docs.push(doc);
    if (isShared && !inP2) phase2Docs.push(doc);
    // Unknown types go to phase 1
    if (!inP1 && !inP2 && !isShared) {
      console.log(`[useAnalysis] Unknown doc type '${t}' for ${doc.original_filename} -> phase 1`);
      phase1Docs.push(doc);
    }
  }

  return { phase1Docs, phase2Docs };
}

// ---------- Merge results from parallel extraction ----------

function mergeResults(phase1, phase2) {
  const meta1 = phase1?.meta || { documents_analyses: [], donnees_manquantes: [], alertes: [], confiance_globale: 0 };
  const meta2 = phase2?.meta || { documents_analyses: [], donnees_manquantes: [], alertes: [], confiance_globale: 0 };

  // Backfill assurance from phase 2 into copropriete if phase 1 didn't get it
  const copro = phase1?.copropriete || {};
  const assurance = phase2?.assurance || {};
  if (!copro.assurance_multirisque && assurance.compagnie) {
    copro.assurance_multirisque = assurance.compagnie;
  }
  if (!copro.assurance_numero_contrat && assurance.numero_contrat) {
    copro.assurance_numero_contrat = assurance.numero_contrat;
  }

  return {
    copropriete: copro,
    lot: phase1?.lot || {},
    financier: phase1?.financier || {},
    juridique: phase1?.juridique || {},
    diagnostics: phase2?.diagnostics || {},
    bail: phase2?.bail || {},
    meta: {
      documents_analyses: [
        ...(meta1.documents_analyses || []),
        ...(meta2.documents_analyses || []),
      ],
      donnees_manquantes: [
        ...(meta1.donnees_manquantes || []),
        ...(meta2.donnees_manquantes || []),
      ],
      alertes: [
        ...(meta1.alertes || []),
        ...(meta2.alertes || []),
      ],
      confiance_globale: Math.min(
        meta1.confiance_globale || 0,
        meta2.confiance_globale || 0,
      ),
    },
  };
}

// ---------- Collect diagnostics_couverts from classifications ----------

function collectDiagnosticsCouverts(classifiedDocs) {
  // Only keep actual diagnostic types — filter out non-diagnostic types
  // that Gemini may erroneously include in diagnostics_couverts
  const VALID_DIAGNOSTIC_TYPES = new Set([
    'dpe', 'diagnostic_amiante', 'diagnostic_plomb', 'diagnostic_termites',
    'diagnostic_electricite', 'diagnostic_gaz', 'diagnostic_erp',
    'diagnostic_mesurage', 'audit_energetique', 'dtg', 'plan_pluriannuel',
  ]);

  const all = new Set();
  for (const doc of classifiedDocs) {
    const raw = doc.ai_classification_raw || doc;
    const couverts = raw.diagnostics_couverts || [];
    for (const d of couverts) {
      if (VALID_DIAGNOSTIC_TYPES.has(d)) {
        all.add(d);
      }
    }
  }
  return Array.from(all);
}

// Module-level guard: survives StrictMode unmount/remount cycles
const analyzingDossiers = new Set();

export function useAnalysis(dossierId, sessionId) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ phase: 'idle', current: 0, total: 0, message: '' });

  const startAnalysis = useCallback(
    async (documents, { lotNumber, propertyAddress, questionnaireData } = {}) => {
      if (!dossierId || documents.length === 0) return;

      // Guard: module-level Set prevents StrictMode double-trigger
      if (analyzingDossiers.has(dossierId)) {
        console.warn('[useAnalysis] Already running for dossier', dossierId, '— skipping duplicate');
        return;
      }
      analyzingDossiers.add(dossierId);

      setIsAnalyzing(true);
      const { error: statusErr } = await dossierService.updateDossier(dossierId, { status: 'analyzing' });
      if (statusErr) console.warn('[useAnalysis] Failed to set analyzing status:', statusErr);

      try {
        // ========== PHASE 1: Classify unclassified documents ==========
        const unclassified = documents.filter((d) => !d.document_type);
        const alreadyClassified = documents.filter((d) => d.document_type);

        if (unclassified.length > 0) {
          setProgress({
            phase: 'classification',
            current: 0,
            total: unclassified.length,
            message: `Classification de ${unclassified.length} document(s) restant(s)...`,
          });

          for (let i = 0; i < unclassified.length; i++) {
            const doc = unclassified[i];
            setProgress({
              phase: 'classification',
              current: i + 1,
              total: unclassified.length,
              message: `Classification: ${doc.original_filename}`,
            });

            const { data: base64 } = await documentService.getFileAsBase64(doc.storage_path);
            if (!base64) continue;

            const { data: classification } = await geminiService.classifyDocument(
              base64,
              doc.original_filename,
              dossierId
            );

            if (classification) {
              await documentService.updateDocument(doc.id, {
                document_type: classification.document_type,
                ai_confidence: classification.confidence,
                ai_classification_raw: classification,
              });

              alreadyClassified.push({ ...doc, ...classification, base64 });
            }
          }
        } else {
          setProgress({
            phase: 'classification',
            current: documents.length,
            total: documents.length,
            message: 'Tous les documents sont deja classifies',
          });
        }

        // ========== PHASE 2: Route + parallel extraction ==========

        // Merge classification results back into document list
        const mergedDocuments = documents.map((doc) => {
          if (doc.document_type) return doc;
          const classified = alreadyClassified.find((c) => c.id === doc.id);
          return classified ? { ...doc, document_type: classified.document_type } : doc;
        });

        // Deduplicate by original_filename
        const seenFilenames = new Set();
        const uniqueDocuments = [];
        for (const doc of mergedDocuments) {
          const key = doc.original_filename;
          if (!seenFilenames.has(key)) {
            seenFilenames.add(key);
            uniqueDocuments.push(doc);
          }
        }

        // Filter to extraction-relevant types only
        const relevantDocs = uniqueDocuments.filter(
          (doc) => doc.document_type && ALL_EXTRACTION_TYPES.has(doc.document_type)
        );

        console.log(
          `[useAnalysis] Extraction filter: ${uniqueDocuments.length} unique → ${relevantDocs.length} relevant (types: ${[...new Set(relevantDocs.map(d => d.document_type))].join(', ')})`
        );

        if (relevantDocs.length === 0) {
          console.warn('[useAnalysis] No relevant documents for extraction — skipping');
          throw new Error('Aucun document financier ou juridique détecté. Ajoutez au moins un PV d\'AG ou un relevé de charges.');
        }

        setProgress({
          phase: 'extraction',
          current: 0,
          total: 2,
          message: `Extraction parallèle: financier + diagnostics (${relevantDocs.length} documents)...`,
        });

        // Fetch base64 for all relevant documents
        const docsWithBase64 = [];
        for (const doc of relevantDocs) {
          const existing = alreadyClassified.find((d) => d.id === doc.id && d.base64);
          if (existing) {
            docsWithBase64.push(existing);
          } else {
            const { data: base64 } = await documentService.getFileAsBase64(doc.storage_path);
            if (base64) {
              docsWithBase64.push({
                ...doc,
                base64,
                normalized_filename: doc.normalized_filename || doc.original_filename,
                document_type: doc.document_type || 'other',
              });
            }
          }
        }

        // Route documents to phases
        const { phase1Docs, phase2Docs } = routeDocuments(docsWithBase64);
        const diagnosticsCouverts = collectDiagnosticsCouverts(alreadyClassified);

        console.log(`[useAnalysis] Routed: ${phase1Docs.length} docs → financial, ${phase2Docs.length} docs → diagnostics`);
        if (diagnosticsCouverts.length > 0) {
          console.log(`[useAnalysis] diagnostics_couverts from classification: ${diagnosticsCouverts.join(', ')}`);
        }

        // ========== PARALLEL EXTRACTION ==========
        const extractionPromises = [];

        // Financial extraction (Phase 1)
        if (phase1Docs.length > 0) {
          extractionPromises.push(
            geminiService.extractFinancial(phase1Docs, dossierId, {
              lotNumber,
              propertyAddress,
              questionnaireData,
            })
          );
        } else {
          extractionPromises.push(Promise.resolve({ data: null, error: null }));
        }

        // Diagnostics extraction (Phase 2)
        if (phase2Docs.length > 0) {
          extractionPromises.push(
            geminiService.extractDiagnostics(phase2Docs, dossierId, {
              diagnosticsCouverts,
            })
          );
        } else {
          extractionPromises.push(Promise.resolve({ data: null, error: null }));
        }

        const [financialResult, diagnosticsResult] = await Promise.all(extractionPromises);

        // Handle errors — graceful degradation
        if (financialResult.error && diagnosticsResult.error) {
          throw financialResult.error; // Both failed
        }
        if (financialResult.error) {
          console.error('[useAnalysis] Financial extraction failed, continuing with diagnostics only:', financialResult.error);
        }
        if (diagnosticsResult.error) {
          console.error('[useAnalysis] Diagnostics extraction failed, continuing with financial only:', diagnosticsResult.error);
        }

        setProgress({
          phase: 'extraction',
          current: 2,
          total: 2,
          message: 'Fusion des résultats...',
        });

        // ========== MERGE RESULTS ==========
        const normalizedFinancial = Array.isArray(financialResult.data) ? financialResult.data[0] : financialResult.data;
        const normalizedDiagnostics = Array.isArray(diagnosticsResult.data) ? diagnosticsResult.data[0] : diagnosticsResult.data;

        const normalizedData = mergeResults(normalizedFinancial, normalizedDiagnostics);

        // Add degradation alert if one phase failed
        if (financialResult.error) {
          normalizedData.meta.alertes.push(`Extraction financière a échoué: ${financialResult.error.message || String(financialResult.error)}. Données financières incomplètes.`);
        }
        if (diagnosticsResult.error) {
          normalizedData.meta.alertes.push(`Extraction diagnostics a échoué: ${diagnosticsResult.error.message || String(diagnosticsResult.error)}. Données diagnostics incomplètes.`);
        }

        // Safety check
        if (!normalizedData || typeof normalizedData !== 'object' || Object.keys(normalizedData).length === 0) {
          console.error('[useAnalysis] Extraction returned empty data:', normalizedData);
          throw new Error('L\'extraction n\'a retourne aucune donnee. Veuillez reessayer.');
        }

        console.log('[useAnalysis] Merged data keys:', Object.keys(normalizedData));

        // ========== HYBRID CHARGES CALCULATION ==========
        const tantiemesLot = toNum(normalizedData?.lot?.tantiemes_generaux);
        const tantiemesTotaux = toNum(
          normalizedData?.copropriete?.tantiemes_totaux ?? normalizedData?.lot?.tantiemes_totaux
        );
        const budgetAnnuel = toNum(normalizedData?.financier?.budget_previsionnel_annuel);
        const geminiCharges = toNum(normalizedData?.financier?.charges_courantes_lot);

        let calculatedCharges = null;
        let chargesDiscrepancyPct = null;

        if (tantiemesLot && tantiemesTotaux && tantiemesTotaux > 0 && budgetAnnuel) {
          calculatedCharges = Math.round(((tantiemesLot / tantiemesTotaux) * budgetAnnuel) * 100) / 100;

          if (geminiCharges && geminiCharges > 0) {
            const diffPct = Math.round(
              (Math.abs(calculatedCharges - geminiCharges) / calculatedCharges) * 10000
            ) / 100;
            if (diffPct > 5) {
              chargesDiscrepancyPct = diffPct;
              console.warn(
                `[useAnalysis] Charges discrepancy: calculated=${calculatedCharges}, gemini=${geminiCharges}, diff=${diffPct}%`
              );
            }
          }
        }

        const finalCharges = calculatedCharges ?? geminiCharges;

        console.log('[useAnalysis] Hybrid charges:', {
          tantiemesLot, tantiemesTotaux, budgetAnnuel,
          geminiCharges, calculatedCharges, finalCharges, chargesDiscrepancyPct,
        });

        // ========== CROSS-VALIDATION ALERTS ==========
        const metaAlertes = normalizedData?.meta?.alertes || [];

        const chargesBudgetN1 = toNum(normalizedData?.financier?.charges_budget_n1);
        if (calculatedCharges && chargesBudgetN1 && chargesBudgetN1 > 0) {
          const diffN1 = Math.abs(calculatedCharges - chargesBudgetN1) / calculatedCharges * 100;
          if (diffN1 > 20) {
            const msg = `Écart de ${diffN1.toFixed(0)}% entre charges calculées (${calculatedCharges}€) et charges budget N-1 (${chargesBudgetN1}€). Vérifiez les tantièmes.`;
            console.warn(`[useAnalysis] ${msg}`);
            metaAlertes.push(msg);
          }
        }

        const provisionsExigibles = toNum(normalizedData?.financier?.provisions_exigibles);
        if (provisionsExigibles && calculatedCharges && provisionsExigibles > calculatedCharges * 1.1) {
          const msg = `Provisions exigibles (${provisionsExigibles}€) supérieures aux charges annuelles (${calculatedCharges}€). Vérifiez ce montant.`;
          console.warn(`[useAnalysis] ${msg}`);
          metaAlertes.push(msg);
        }

        if (normalizedData.meta) {
          normalizedData.meta.alertes = metaAlertes;
        }

        // ========== SAVE TO DB ==========
        const updates = {
          extracted_data: normalizedData,
          status: 'pending_validation',

          // Financial columns
          fonds_travaux_balance: toNum(normalizedData?.financier?.fonds_travaux_solde),
          charges_courantes: finalCharges,
          charges_exceptionnelles: toNum(normalizedData?.financier?.charges_exceptionnelles_lot),
          impaye_vendeur: toNum(normalizedData?.financier?.impayes_vendeur),
          dette_copro_fournisseurs: toNum(normalizedData?.financier?.dette_copro_fournisseurs),
          budget_previsionnel: budgetAnnuel,
          property_surface: toNum(normalizedData?.lot?.surface_carrez ?? normalizedData?.diagnostics?.carrez_surface),
          tantiemes_lot: tantiemesLot != null ? Math.round(tantiemesLot) : null,
          tantiemes_totaux: tantiemesTotaux != null ? Math.round(tantiemesTotaux) : null,
          charges_calculees: calculatedCharges,
          charges_discrepancy_pct: chargesDiscrepancyPct,

          // CSN financial columns (Part I)
          charges_budget_n1: toNum(normalizedData?.financier?.charges_budget_n1),
          charges_budget_n2: toNum(normalizedData?.financier?.charges_budget_n2),
          charges_hors_budget_n1: toNum(normalizedData?.financier?.charges_hors_budget_n1),
          charges_hors_budget_n2: toNum(normalizedData?.financier?.charges_hors_budget_n2),
          provisions_exigibles: toNum(normalizedData?.financier?.provisions_exigibles),
          avances_reserve: toNum(normalizedData?.financier?.avances_reserve),
          provisions_speciales: toNum(normalizedData?.financier?.provisions_speciales),
          emprunt_collectif_solde: toNum(normalizedData?.financier?.emprunt_collectif_solde),
          emprunt_collectif_echeance: normalizedData?.financier?.emprunt_collectif_echeance ?? null,
          cautionnement_solidaire: normalizedData?.financier?.cautionnement_solidaire === true,
          fonds_travaux_cotisation: toNum(normalizedData?.financier?.fonds_travaux_cotisation_annuelle),
          fonds_travaux_exists: normalizedData?.financier?.fonds_travaux_exists ?? true,
          impaye_charges_global: toNum(normalizedData?.financier?.impaye_charges_global),
          dette_fournisseurs_global: toNum(normalizedData?.financier?.dette_fournisseurs_global),

          // Copropriete life columns (Part II-A)
          assurance_multirisque: normalizedData?.copropriete?.assurance_multirisque ?? null,
          assurance_numero_contrat: normalizedData?.copropriete?.assurance_numero_contrat ?? null,
          prochaine_ag_date: toDate(normalizedData?.copropriete?.prochaine_ag_date),
          syndic_type: normalizedData?.copropriete?.syndic_type ?? null,
          syndic_mandat_fin: toDate(normalizedData?.copropriete?.syndic_mandat_fin),
          copropriete_en_difficulte: normalizedData?.copropriete?.copropriete_en_difficulte === true,
          copropriete_difficulte_details: normalizedData?.copropriete?.copropriete_difficulte_details ?? null,
          fibre_optique: normalizedData?.copropriete?.fibre_optique ?? null,
          date_construction: normalizedData?.copropriete?.date_construction ?? null,
          nombre_lots_copropriete: toNum(normalizedData?.copropriete?.nombre_lots) != null
            ? Math.round(toNum(normalizedData.copropriete.nombre_lots))
            : null,

          // Technical dossier columns (Part II-B)
          dtg_date: toDate(normalizedData?.diagnostics?.dtg_date),
          dtg_resultat: normalizedData?.diagnostics?.dtg_resultat ?? null,
          plan_pluriannuel_exists: normalizedData?.diagnostics?.plan_pluriannuel_exists ?? null,
          plan_pluriannuel_details: normalizedData?.diagnostics?.plan_pluriannuel_details ?? null,
          amiante_dta_date: toDate(normalizedData?.diagnostics?.amiante_dta_date),
          plomb_date: toDate(normalizedData?.diagnostics?.plomb_date),
          termites_date: toDate(normalizedData?.diagnostics?.termites_date),
          audit_energetique_date: toDate(normalizedData?.diagnostics?.audit_energetique_date),
          ascenseur_exists: normalizedData?.diagnostics?.ascenseur_exists === true,
          ascenseur_rapport_date: toDate(normalizedData?.diagnostics?.ascenseur_rapport_date),
          piscine_exists: normalizedData?.diagnostics?.piscine_exists === true,
          recharge_vehicules: normalizedData?.diagnostics?.recharge_vehicules === true,

          // Legal/identification
          procedures_en_cours: normalizedData?.juridique?.procedures_en_cours === true,
          procedures_details: normalizedData?.juridique?.procedures_details ?? null,
          travaux_votes_non_realises: normalizedData?.juridique?.travaux_votes_non_realises === true,
          travaux_details: normalizedData?.juridique?.travaux_votes_details ?? null,
          copropriete_name: normalizedData?.copropriete?.nom ?? null,
          syndic_name: normalizedData?.copropriete?.syndic_nom ?? null,
          dpe_ademe_number: normalizedData?.diagnostics?.dpe_numero_ademe ?? null,
          dpe_date: toDate(normalizedData?.diagnostics?.dpe_date),
          dpe_classe_energie: toChar1(normalizedData?.diagnostics?.dpe_classe_energie),
          dpe_classe_ges: toChar1(normalizedData?.diagnostics?.dpe_classe_ges),
        };

        // Only overwrite lot/address from AI if user hasn't set them manually in Step 1
        if (!lotNumber) {
          updates.property_lot_number = normalizedData?.lot?.numero != null ? String(normalizedData.lot.numero) : null;
        }
        if (!propertyAddress) {
          updates.property_address = normalizedData?.copropriete?.adresse ?? null;
        }

        console.log('[useAnalysis] Saving to dossier:', {
          extracted_data_keys: Object.keys(normalizedData),
          charges_courantes: updates.charges_courantes,
          charges_calculees: updates.charges_calculees,
          tantiemes_lot: updates.tantiemes_lot,
          tantiemes_totaux: updates.tantiemes_totaux,
          copropriete_name: updates.copropriete_name,
          budget_previsionnel: updates.budget_previsionnel,
        });

        const { error: saveError } = await dossierService.updateDossier(dossierId, updates);
        if (saveError) {
          console.error('[useAnalysis] Failed to save extracted data:', saveError);
          throw new Error(`Erreur sauvegarde: ${saveError.message || JSON.stringify(saveError)}`);
        }

        setProgress({ phase: 'done', current: 1, total: 1, message: 'Analyse terminee' });
        queryClient.invalidateQueries({ queryKey: documentKeys.dossier(dossierId) });
        queryClient.invalidateQueries({ queryKey: dossierKeys.session(sessionId) });
        toast.success('Analyse terminee avec succes');
      } catch (error) {
        console.error('[useAnalysis] startAnalysis:', error);
        setProgress({ phase: 'error', current: 0, total: 0, message: `Erreur: ${error.message}` });
        await dossierService.updateDossier(dossierId, { status: 'error' });
        toast.error('Erreur lors de l\'analyse');
      } finally {
        analyzingDossiers.delete(dossierId);
        setIsAnalyzing(false);
      }
    },
    [dossierId, sessionId, queryClient]
  );

  return { isAnalyzing, progress, startAnalysis };
}
