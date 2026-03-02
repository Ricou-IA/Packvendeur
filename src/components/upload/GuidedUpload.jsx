import { useMemo } from 'react';
import { MapPin, AlertTriangle } from 'lucide-react';
import DocumentChecklist from './DocumentChecklist';
import DdtSection from './DdtSection';
import DpeSection from './DpeSection';
import UploadSummary from './UploadSummary';

/**
 * Documents requis par la loi ALUR pour le pre-etat date et le pack vendeur.
 * Chaque item = 1 document precis que le vendeur doit fournir au notaire.
 */
export const REQUIRED_DOCUMENTS = [
  // --- Copropriete ---
  {
    id: 'reglement_copropriete',
    label: 'Règlement de copropriété',
    hint: 'Avec ses modificatifs et l\'état descriptif de division',
    group: 'copropriete',
    required: true,
    multiple: false,
    aiTypes: ['reglement_copropriete', 'etat_descriptif_division'],
  },
  {
    id: 'pv_ag',
    label: 'PV des Assemblées Générales',
    hint: 'Les 3 dernières années (obligatoire loi ALUR)',
    group: 'copropriete',
    required: true,
    multiple: true,
    aiTypes: ['pv_ag'],
  },
  {
    id: 'fiche_synthetique',
    label: 'Fiche synthétique de la copropriété',
    hint: 'Délivrée par le syndic',
    group: 'copropriete',
    required: true,
    multiple: false,
    aiTypes: ['fiche_synthetique'],
  },
  {
    id: 'carnet_entretien',
    label: 'Carnet d\'entretien de l\'immeuble',
    hint: 'Délivré par le syndic',
    group: 'copropriete',
    required: false,
    multiple: false,
    aiTypes: ['carnet_entretien'],
  },
  {
    id: 'dtg',
    label: 'Diagnostic Technique Global (DTG)',
    hint: 'Si réalisé pour la copropriété',
    group: 'copropriete',
    required: false,
    multiple: false,
    aiTypes: ['dtg'],
  },
  {
    id: 'plan_pluriannuel',
    label: 'Plan pluriannuel de travaux',
    hint: 'Plan adopté en AG pour les travaux futurs',
    group: 'copropriete',
    required: false,
    multiple: false,
    aiTypes: ['plan_pluriannuel', 'plan_pluriannuel_travaux'],
  },
  {
    id: 'contrat_assurance',
    label: 'Attestation d\'assurance copropriété',
    hint: 'Assurance multirisque immeuble',
    group: 'copropriete',
    required: false,
    multiple: false,
    aiTypes: ['contrat_assurance'],
  },
  // --- Financier ---
  {
    id: 'appel_fonds',
    label: 'Appels de fonds / provisions',
    hint: 'Les 3 derniers appels de fonds (charges courantes et travaux du lot)',
    group: 'financier',
    required: true,
    multiple: true,
    aiTypes: ['appel_fonds'],
  },
  {
    id: 'releve_charges',
    label: 'Relevés de charges',
    hint: 'Les 2 derniers exercices comptables',
    group: 'financier',
    required: true,
    multiple: true,
    aiTypes: ['releve_charges'],
  },
  {
    id: 'annexes_comptables',
    label: 'Annexes comptables de la copropriété',
    hint: 'État financier après répartition, bilan de la copropriété. À ajouter si votre PV d\'AG ne reprend pas les annexes comptables directement.',
    group: 'financier',
    required: false,
    multiple: true,
    aiTypes: ['annexes_comptables'],
  },
  {
    id: 'taxe_fonciere',
    label: 'Avis de taxe foncière',
    hint: 'Dernier avis de taxe foncière du bien',
    group: 'financier',
    required: false,
    multiple: false,
    aiTypes: ['taxe_fonciere'],
  },
  {
    id: 'bail',
    label: 'Bail / contrat de location',
    hint: 'Si le bien est actuellement loué ou a été loué',
    group: 'financier',
    required: false,
    multiple: true,
    aiTypes: ['bail'],
  },
  // --- Diagnostics techniques ---
  // All diagnostic items accept multiple: true because diagnosticians often produce
  // a single DDT (Dossier de Diagnostics Techniques) PDF containing all diagnostics.
  // Users can upload the same DDT file to multiple slots, or one file per slot.
  {
    id: 'diagnostic_mesurage',
    label: 'Mesurage Carrez',
    hint: 'Obligatoire pour tout lot en copropriété',
    group: 'diagnostics',
    required: true,
    multiple: true,
    aiTypes: ['diagnostic_mesurage'],
  },
  {
    id: 'diagnostic_amiante',
    label: 'Diagnostic amiante',
    hint: 'Obligatoire si permis de construire avant juillet 1997',
    group: 'diagnostics',
    required: true,
    multiple: true,
    aiTypes: ['diagnostic_amiante'],
  },
  {
    id: 'diagnostic_plomb',
    label: 'Diagnostic plomb (CREP)',
    hint: 'Obligatoire si immeuble construit avant 1949',
    group: 'diagnostics',
    required: false,
    multiple: true,
    aiTypes: ['diagnostic_plomb'],
  },
  {
    id: 'diagnostic_electricite',
    label: 'Diagnostic électricité',
    hint: 'Obligatoire si installation de plus de 15 ans',
    group: 'diagnostics',
    required: false,
    multiple: true,
    aiTypes: ['diagnostic_electricite'],
  },
  {
    id: 'diagnostic_gaz',
    label: 'Diagnostic gaz',
    hint: 'Obligatoire si installation de plus de 15 ans',
    group: 'diagnostics',
    required: false,
    multiple: true,
    aiTypes: ['diagnostic_gaz'],
  },
  {
    id: 'diagnostic_erp',
    label: 'État des Risques et Pollutions (ERP)',
    hint: 'Obligatoire pour toute vente, valide 6 mois',
    group: 'diagnostics',
    required: true,
    multiple: true,
    aiTypes: ['diagnostic_erp'],
  },
  {
    id: 'diagnostic_termites',
    label: 'Diagnostic termites',
    hint: 'Obligatoire en zone déclarée par arrêté préfectoral',
    group: 'diagnostics',
    required: false,
    multiple: true,
    aiTypes: ['diagnostic_termites'],
  },
  {
    id: 'audit_energetique',
    label: 'Audit énergétique',
    hint: 'Obligatoire pour copropriétés > 50 lots avec chauffage collectif',
    group: 'diagnostics',
    required: false,
    multiple: true,
    aiTypes: ['audit_energetique'],
  },
];

export const DOCUMENT_GROUPS = [
  { id: 'copropriete', title: 'Documents de copropriété', step: 1 },
  { id: 'financier', title: 'Documents financiers', step: 2 },
  { id: 'diagnostics', title: 'Diagnostics immobiliers (DDT)', step: 3 },
];

/** IDs of diagnostic checklist items — used to collect diagnostic docs */
const DIAGNOSTIC_ITEM_IDS = REQUIRED_DOCUMENTS
  .filter((i) => i.group === 'diagnostics')
  .map((i) => i.id);

/** Document types that are actually diagnostics — only these can have diagnostics_couverts */
const DIAGNOSTIC_DOC_TYPES = new Set([
  'diagnostic_amiante', 'diagnostic_plomb', 'diagnostic_termites',
  'diagnostic_electricite', 'diagnostic_gaz', 'diagnostic_erp',
  'diagnostic_mesurage', 'dpe', 'audit_energetique',
]);

/**
 * Match un document uploade a un item de la checklist
 * en se basant sur le type detecte par l'IA
 */
function matchDocumentToItem(doc) {
  if (!doc.document_type) return null;
  for (const item of REQUIRED_DOCUMENTS) {
    if (item.aiTypes.includes(doc.document_type)) return item.id;
  }
  return null;
}

export default function GuidedUpload({
  dossierId,
  dossier,
  documents,
  onUpload,
  onRemove,
  isUploading,
  questionnaireData,
}) {
  // Condition checklist based on questionnaire answers
  const q = questionnaireData || {};
  const isRented = q.occupation?.bail_en_cours === true || q.occupation?.occupant_actuel === 'locataire';
  const hasASL = q.copropriete_questions?.association_syndicale === true;
  const lotNumber = dossier?.property_lot_number;
  const propertyAddress = dossier?.property_address;
  // Compute effective document list with conditional requirements
  const effectiveDocuments = useMemo(() => {
    return REQUIRED_DOCUMENTS.map((item) => {
      // Bail becomes required when property is rented
      if (item.id === 'bail' && isRented) {
        return { ...item, required: true, hint: 'Obligatoire : le bien est actuellement loué' };
      }
      return item;
    });
  }, [isRented]);

  // Map documents to checklist items (DDT covers multiple diagnostic items)
  const documentsByItem = useMemo(() => {
    const map = {};
    const unmatched = [];

    for (const doc of documents) {
      const itemId = matchDocumentToItem(doc);
      if (itemId) {
        if (!map[itemId]) map[itemId] = [];
        map[itemId].push(doc);

        // DDT: if diagnostics_couverts lists additional types, assign
        // the same doc to those checklist items too so they count as filled.
        // ONLY for actual diagnostic documents (bail/taxe_fonciere may have
        // stale diagnostics_couverts from Gemini mentioning annexed diagnostics)
        const raw = doc.ai_classification_raw;
        const covered = DIAGNOSTIC_DOC_TYPES.has(doc.document_type)
          && raw && !Array.isArray(raw) && Array.isArray(raw.diagnostics_couverts)
          ? raw.diagnostics_couverts
          : [];
        for (const diagType of covered) {
          const extraId = REQUIRED_DOCUMENTS.find((i) => i.aiTypes.includes(diagType))?.id;
          if (extraId && extraId !== itemId) {
            if (!map[extraId]) map[extraId] = [];
            // Avoid duplicate entries for same doc
            if (!map[extraId].some((d) => d.id === doc.id)) {
              map[extraId].push(doc);
            }
          }
        }
      } else {
        // Not yet classified or doesn't match any checklist item
        unmatched.push(doc);
      }
    }

    // For unmatched docs (not yet classified), try to keep them visible
    // by assigning to a temporary key
    if (unmatched.length > 0) {
      map._unmatched = unmatched;
    }

    return map;
  }, [documents]);

  // Diagnostic documents for DDT section (deduplicated — a DDT covers multiple buckets)
  const diagnosticDocs = useMemo(() => {
    const seen = new Set();
    const docs = [];
    for (const id of DIAGNOSTIC_ITEM_IDS) {
      if (documentsByItem[id]) {
        for (const doc of documentsByItem[id]) {
          if (!seen.has(doc.id)) {
            seen.add(doc.id);
            docs.push(doc);
          }
        }
      }
    }
    return docs;
  }, [documentsByItem]);

  // Unclassified documents (shown in DDT section while AI classifies them)
  const unclassifiedDocs = useMemo(
    () => documentsByItem._unmatched || [],
    [documentsByItem]
  );

  // DPE documents
  const dpeDocuments = useMemo(
    () => documents.filter((d) => d.document_type === 'dpe'),
    [documents]
  );

  const hasDpe = !!(
    (dossier?.dpe_validity_status && dossier.dpe_validity_status !== 'not_verified') ||
    dpeDocuments.length > 0
  );

  // Count stats for summary
  const stats = useMemo(() => {
    const filled = effectiveDocuments.filter((item) => {
      const docs = documentsByItem[item.id];
      return docs && docs.length > 0;
    }).length;

    return {
      total: effectiveDocuments.length,
      filled,
      requiredTotal: effectiveDocuments.filter((i) => i.required).length,
      requiredFilled: effectiveDocuments.filter((i) => i.required && documentsByItem[i.id]?.length > 0).length,
    };
  }, [documentsByItem, effectiveDocuments]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          Constituez votre dossier
        </h2>
        <p className="text-secondary-500">
          Ajoutez chaque document requis pour la vente. L'IA les analyse automatiquement.
        </p>
      </div>

      {/* Lot identification banner */}
      {lotNumber ? (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-lg p-4 text-sm text-primary-800">
          <MapPin className="h-5 w-5 text-primary-600 shrink-0" />
          <div>
            <strong>Lot {lotNumber}</strong>
            {propertyAddress && <span className="ml-1">— {propertyAddress}</span>}
            {dossier?.property_city && <span>, {dossier.property_city}</span>}
            {dossier?.property_postal_code && <span> {dossier.property_postal_code}</span>}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
          <div>
            <strong>Numéro de lot non renseigné.</strong>{' '}
            Retournez à l'étape précédente pour l'indiquer — cela améliore la précision de l'extraction.
          </div>
        </div>
      )}


      {/* ASL alert from questionnaire */}
      {hasASL && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
          <strong>ASL/AFUL détectée :</strong> vous avez indiqué l'existence d'une association syndicale libre.
          Pensez à fournir le règlement et les derniers PV de l'ASL en complément.
        </div>
      )}

      {/* Bail required alert from questionnaire */}
      {isRented && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <strong>Bien loué :</strong> le bail et ses avenants sont requis pour compléter le dossier.
          L'IA en extraira les informations nécessaires au notaire.
        </div>
      )}

      {/* Document groups — DDT uses a single-dropzone section */}
      {DOCUMENT_GROUPS.map((group) => {
        if (group.id === 'diagnostics') {
          return (
            <DdtSection
              key={group.id}
              group={group}
              diagnosticDocuments={diagnosticDocs}
              unclassifiedDocuments={unclassifiedDocs}
              onUpload={onUpload}
              onRemove={onRemove}
              isUploading={isUploading}
            />
          );
        }
        return (
          <DocumentChecklist
            key={group.id}
            group={group}
            items={effectiveDocuments.filter((i) => i.group === group.id)}
            documentsByItem={documentsByItem}
            allDocuments={documents}
            onUpload={onUpload}
            onRemove={onRemove}
            isUploading={isUploading}
          />
        );
      })}

      {/* DPE Section */}
      <DpeSection
        dossierId={dossierId}
        dossier={dossier}
        dpeDocuments={dpeDocuments}
        onUpload={onUpload}
        onRemove={onRemove}
        isUploading={isUploading}
      />

      <UploadSummary stats={stats} hasDpe={hasDpe} />
    </div>
  );
}
