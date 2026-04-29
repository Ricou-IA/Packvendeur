import { useMemo } from 'react';
import {
  MapPin, AlertTriangle, FileCheck, Sparkles, Wand2, Shield,
  ArrowRight, CheckCircle2,
} from 'lucide-react';
import { DocumentItem } from './DocumentChecklist';
import DpeSection from './DpeSection';
import MegaDropzone from './MegaDropzone';
import TierBucketCard from './TierBucketCard';
import { Button } from '@components/ui/button';
import {
  SectionCard,
  ProgressIndicator,
  BonusDivider,
} from '@components/questionnaire/QuestionnaireUI';
import { cn } from '@lib/utils';

/**
 * Documents requis par la loi ALUR pour le pre-etat date et le pack vendeur.
 * Le flag `required` reflète l'usage AI/notaire. Le tier (1/2/3) est calculé
 * dynamiquement plus bas par `tierForType`.
 */
export const REQUIRED_DOCUMENTS = [
  // --- Tier 1 — pour générer le pré-état daté ---
  {
    id: 'reglement_copropriete',
    label: 'Règlement de copropriété',
    hint: 'Le règlement complet, EDD inclus',
    required: true,
    aiTypes: ['reglement_copropriete', 'etat_descriptif_division'],
  },
  {
    id: 'pv_ag',
    label: 'PV des Assemblées Générales',
    hint: '3 dernières années',
    required: true,
    multiple: true,
    aiTypes: ['pv_ag'],
  },
  {
    id: 'appel_fonds',
    label: 'Appels de fonds',
    hint: 'Les 3 derniers — charges et travaux du lot',
    required: true,
    multiple: true,
    aiTypes: ['appel_fonds'],
  },
  {
    id: 'releve_charges',
    label: 'Relevés de charges',
    hint: '2 derniers exercices comptables',
    required: true,
    multiple: true,
    aiTypes: ['releve_charges'],
  },

  // --- Tier 2 — utiles à votre notaire / agence ---
  { id: 'fiche_synthetique', label: 'Fiche synthétique', aiTypes: ['fiche_synthetique'] },
  { id: 'carnet_entretien', label: "Carnet d'entretien", aiTypes: ['carnet_entretien'] },
  { id: 'dtg', label: 'Diagnostic Technique Global', aiTypes: ['dtg'] },
  { id: 'plan_pluriannuel', label: 'Plan pluriannuel de travaux', aiTypes: ['plan_pluriannuel', 'plan_pluriannuel_travaux'] },
  { id: 'contrat_assurance', label: 'Attestation assurance copropriété', aiTypes: ['contrat_assurance'] },
  { id: 'annexes_comptables', label: 'Annexes comptables', aiTypes: ['annexes_comptables'] },
  { id: 'bail', label: 'Bail / contrat de location', aiTypes: ['bail'], multiple: true },
  { id: 'diagnostic_mesurage', label: 'Mesurage Carrez', aiTypes: ['diagnostic_mesurage'], multiple: true },
  { id: 'diagnostic_amiante', label: 'Amiante', aiTypes: ['diagnostic_amiante'], multiple: true },
  { id: 'diagnostic_plomb', label: 'Plomb (CREP)', aiTypes: ['diagnostic_plomb'], multiple: true },
  { id: 'diagnostic_electricite', label: 'Électricité', aiTypes: ['diagnostic_electricite'], multiple: true },
  { id: 'diagnostic_gaz', label: 'Gaz', aiTypes: ['diagnostic_gaz'], multiple: true },
  { id: 'diagnostic_termites', label: 'Termites', aiTypes: ['diagnostic_termites'], multiple: true },
  { id: 'diagnostic_erp', label: 'ERP — État des Risques', aiTypes: ['diagnostic_erp'], multiple: true },
  { id: 'audit_energetique', label: 'Audit énergétique', aiTypes: ['audit_energetique'], multiple: true },

  // --- Tier 3 — pour sécuriser votre acte (le reste) ---
  { id: 'taxe_fonciere', label: 'Taxe foncière', aiTypes: ['taxe_fonciere'] },
];

/** Tier 1 — strict slots, contraint pour avancer */
const TIER1_IDS = ['reglement_copropriete', 'pv_ag', 'appel_fonds', 'releve_charges'];

/** Tier 2 — Pack notaire/agence, fusion en une seule bucket card */
const TIER2_IDS = [
  'fiche_synthetique', 'carnet_entretien', 'dtg', 'plan_pluriannuel', 'contrat_assurance',
  'annexes_comptables', 'bail',
  'diagnostic_mesurage', 'diagnostic_amiante', 'diagnostic_plomb',
  'diagnostic_electricite', 'diagnostic_gaz', 'diagnostic_termites',
  'diagnostic_erp', 'audit_energetique',
];

/** Tier 3 — invitation à sécuriser l'acte. Exemples affichés en chips. */
const TIER3_EXAMPLES = [
  'Taxe foncière',
  'Avenants au règlement',
  'Autorisations de travaux',
  'ASL / AFUL',
  'Anciens compromis',
  'Plans / cadastre',
  'Courriers du syndic',
  'Devis travaux votés',
];

/** Set of AI document types per tier — used by `tierForType` */
const TIER_TYPE_SET = (() => {
  const t1 = new Set();
  const t2 = new Set();
  const t3 = new Set();
  for (const item of REQUIRED_DOCUMENTS) {
    const target = TIER1_IDS.includes(item.id) ? t1 : TIER2_IDS.includes(item.id) ? t2 : t3;
    for (const type of item.aiTypes) target.add(type);
  }
  // DPE is a Tier 1 essential handled separately by DpeSection
  t1.add('dpe');
  return { t1, t2, t3 };
})();

const DIAGNOSTIC_DOC_TYPES = new Set([
  'diagnostic_amiante', 'diagnostic_plomb', 'diagnostic_termites',
  'diagnostic_electricite', 'diagnostic_gaz', 'diagnostic_erp',
  'diagnostic_mesurage', 'dpe', 'audit_energetique',
]);

function matchDocumentToItem(doc) {
  if (!doc.document_type) return null;
  for (const item of REQUIRED_DOCUMENTS) {
    if (item.aiTypes.includes(doc.document_type)) return item.id;
  }
  return null;
}

function tierForDoc(doc) {
  const type = doc.document_type;
  if (!type) return null;
  if (TIER_TYPE_SET.t1.has(type)) return 1;
  if (TIER_TYPE_SET.t2.has(type)) return 2;
  return 3;
}

export default function GuidedUpload({
  dossierId,
  dossier,
  documents,
  onUpload,
  onRemove,
  isUploading,
  questionnaireData,
  onContinue,
}) {
  const q = questionnaireData || {};
  const isRented = q.occupation?.bail_en_cours === true || q.occupation?.occupant_actuel === 'locataire';
  const hasASL = q.copropriete_questions?.association_syndicale === true;
  const lotNumber = dossier?.property_lot_number;
  const propertyAddress = dossier?.property_address;

  // Items effectifs, avec le bail rendu obligatoire si bien loué
  const effectiveDocuments = useMemo(() => {
    return REQUIRED_DOCUMENTS.map((item) => {
      if (item.id === 'bail' && isRented) {
        return { ...item, required: true, hint: 'Demandé car votre bien est loué' };
      }
      return item;
    });
  }, [isRented]);

  // Map documents → items via classification AI (+ propagation DDT)
  const documentsByItem = useMemo(() => {
    const map = {};
    const unmatched = [];

    for (const doc of documents) {
      const itemId = matchDocumentToItem(doc);
      if (itemId) {
        if (!map[itemId]) map[itemId] = [];
        map[itemId].push(doc);

        // DDT propagation : un PDF qui couvre plusieurs diagnostics apparaît
        // dans tous les slots/types diagnostiques détectés.
        const raw = doc.ai_classification_raw;
        const covered = DIAGNOSTIC_DOC_TYPES.has(doc.document_type)
          && raw && !Array.isArray(raw) && Array.isArray(raw.diagnostics_couverts)
          ? raw.diagnostics_couverts
          : [];
        for (const diagType of covered) {
          const extraId = REQUIRED_DOCUMENTS.find((i) => i.aiTypes.includes(diagType))?.id;
          if (extraId && extraId !== itemId) {
            if (!map[extraId]) map[extraId] = [];
            if (!map[extraId].some((d) => d.id === doc.id)) {
              map[extraId].push(doc);
            }
          }
        }
      } else {
        unmatched.push(doc);
      }
    }
    if (unmatched.length > 0) map._unmatched = unmatched;
    return map;
  }, [documents]);

  // Documents groupés par tier — bucket pour Tier 2 et Tier 3
  const tier2Docs = useMemo(() => {
    const seen = new Set();
    const docs = [];
    for (const doc of documents) {
      if (tierForDoc(doc) === 2 && !seen.has(doc.id)) {
        seen.add(doc.id);
        docs.push(doc);
      }
    }
    return docs;
  }, [documents]);

  const tier3Docs = useMemo(() => {
    const seen = new Set();
    const docs = [];
    for (const doc of documents) {
      const tier = tierForDoc(doc);
      // Tier 3 = explicit T3 type OR unclassified-yet docs (so they
      // don't disappear; once classified they reroute to their real tier).
      const isUnclassifiedAndUnknown = !doc.document_type && !documentsByItem._unmatched?.includes(doc);
      const isOther = doc.document_type === 'other';
      if ((tier === 3 || isOther || isUnclassifiedAndUnknown) && !seen.has(doc.id)) {
        seen.add(doc.id);
        docs.push(doc);
      }
    }
    // Add unclassified _unmatched as well
    for (const doc of (documentsByItem._unmatched || [])) {
      if (!seen.has(doc.id)) {
        seen.add(doc.id);
        docs.push(doc);
      }
    }
    return docs;
  }, [documents, documentsByItem]);

  const dpeDocuments = useMemo(
    () => documents.filter((d) => d.document_type === 'dpe'),
    [documents]
  );
  const hasDpe = !!(
    (dossier?.dpe_validity_status && dossier.dpe_validity_status !== 'not_verified') ||
    dpeDocuments.length > 0
  );

  // Tier 1 lookups
  const tier1Items = useMemo(
    () => TIER1_IDS.map((id) => effectiveDocuments.find((i) => i.id === id)).filter(Boolean),
    [effectiveDocuments]
  );

  // Tier 2 — récap des types attendus avec ✓ pour ceux reçus
  const tier2Recap = useMemo(() => {
    return TIER2_IDS.map((id) => {
      const item = effectiveDocuments.find((i) => i.id === id);
      if (!item) return null;
      const present = (documentsByItem[id]?.length || 0) > 0;
      return { id, label: item.label, present };
    }).filter(Boolean);
  }, [effectiveDocuments, documentsByItem]);

  // Progress
  const tier1Done = tier1Items.filter((it) => documentsByItem[it.id]?.length > 0).length + (hasDpe ? 1 : 0);
  const tier1Total = tier1Items.length + 1; // +1 for DPE
  const allTier1Done = tier1Done === tier1Total;

  const tier2Received = tier2Recap.filter((r) => r.present).length;
  const tier2Total = tier2Recap.length;

  return (
    <div className="space-y-5">
      {/* Sticky progress bar */}
      <ProgressIndicator
        essentialDone={tier1Done}
        essentialTotal={tier1Total}
        optionalDone={tier2Received + tier3Docs.length}
        optionalTotal={tier2Total + tier3Docs.length}
      />

      {/* Header — désormalisé, complice */}
      <div className="text-center pt-2 pb-1">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-1.5">
          Vos documents
        </h2>
        <p className="text-secondary-500 text-sm max-w-xl mx-auto leading-relaxed">
          Cinq pièces pour votre pré-état daté.{' '}
          <strong className="text-primary-700">On les reconnaît, on les range, on les renomme.</strong>
        </p>
      </div>

      {/* Lot identification banner — désormalisé */}
      {lotNumber ? (
        <div className="flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-lg p-3 text-sm text-primary-800">
          <MapPin className="h-4 w-4 text-primary-600 shrink-0" />
          <div>
            <strong>Lot {lotNumber}</strong>
            {propertyAddress && <span className="ml-1">— {propertyAddress}</span>}
            {dossier?.property_city && <span>, {dossier.property_city}</span>}
            {dossier?.property_postal_code && <span> {dossier.property_postal_code}</span>}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <div>
            Numéro de lot manquant. Revenez à l'étape précédente pour l'ajouter — on sera plus précis.
          </div>
        </div>
      )}

      {hasASL && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          <strong>ASL/AFUL :</strong> ajoutez aussi le règlement et les PV de l'ASL.
        </div>
      )}

      {/* Mega-dropzone — entrée principale, "tout en vrac" */}
      <MegaDropzone
        onDrop={(files) => onUpload(files)}
        isUploading={isUploading}
        pendingCount={documents.filter((d) => {
          if (d.document_type) return false;
          if (!d.created_at) return true;
          const ageSec = (Date.now() - new Date(d.created_at).getTime()) / 1000;
          return ageSec < 30;
        }).length}
      />

      {/* ───────────── Tier 1 — Indispensables (strict, droit au but) ───────────── */}
      <SectionCard
        Icon={FileCheck}
        title="Pour générer votre pré-état daté"
        subtitle="Cinq documents — la loi ALUR les exige"
        done={allTier1Done}
      >
        <div className="space-y-3">
          {tier1Items.map((item) => (
            <DocumentItem
              key={item.id}
              item={item}
              docs={documentsByItem[item.id] || []}
              onUpload={onUpload}
              onRemove={onRemove}
              isUploading={isUploading}
            />
          ))}
        </div>

        {/* DPE = 5e indispensable */}
        <div className="pt-2 mt-3 border-t border-primary-100">
          <DpeSection
            dossierId={dossierId}
            dossier={dossier}
            dpeDocuments={dpeDocuments}
            onUpload={onUpload}
            onRemove={onRemove}
            isUploading={isUploading}
          />
        </div>
      </SectionCard>

      <BonusDivider subtitle="Plus vous en mettez, plus le dossier est complet — sans surcoût." />

      {/* ───────────── Tier 2 — Pack notaire / agence ───────────── */}
      <TierBucketCard
        Icon={Wand2}
        title="Pour votre notaire ou votre agence"
        subtitle="Ils en auront besoin pour finaliser la vente"
        hint="Glissez ce que vous avez — on l'identifie, on le range, on le renomme proprement."
        receivedDocs={tier2Docs}
        onUpload={onUpload}
        onRemove={onRemove}
        done={tier2Received >= Math.ceil(tier2Total * 0.6)}
        collapsible
        defaultOpen={tier2Docs.length > 0}
        dropzoneLabel="Glissez vos PDF ici (DDT, fiche synthétique, carnet d'entretien…)"
      >
        {/* Récap : ce qu'on a reçu vs ce qu'on attendrait */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 pt-2 border-t border-primary-100/60">
          {tier2Recap.map((r) => (
            <div key={r.id} className="flex items-center gap-1.5">
              {r.present ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-green-500 flex-shrink-0" />
              ) : (
                <div className="h-3.5 w-3.5 rounded-full border border-secondary-300/70 flex-shrink-0" />
              )}
              <span className={cn(
                'text-xs',
                r.present ? 'text-secondary-700' : 'text-secondary-400',
              )}>
                {r.label}
              </span>
            </div>
          ))}
        </div>

        {isRented && (
          <p className="text-xs text-blue-700 bg-blue-50/60 border border-blue-100 rounded-lg p-2">
            Bien loué : pensez à inclure le bail et ses avenants.
          </p>
        )}
      </TierBucketCard>

      {/* ───────────── Tier 3 — Sécuriser votre acte ───────────── */}
      <TierBucketCard
        Icon={Shield}
        title="Sécuriser votre acte de vente"
        subtitle="Tout autre document utile — on l'archive avec le reste"
        hint="Plus le dossier est complet, plus la vente est sereine. On range tout, même ce qu'on ne reconnaît pas."
        receivedDocs={tier3Docs}
        onUpload={onUpload}
        onRemove={onRemove}
        collapsible
        defaultOpen={tier3Docs.length > 0}
        dropzoneLabel="Glissez vos autres documents ici"
      >
        {tier3Docs.length === 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {TIER3_EXAMPLES.map((ex) => (
              <span
                key={ex}
                className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/70 border border-secondary-200/70 text-[11px] text-secondary-500"
              >
                {ex}
              </span>
            ))}
          </div>
        )}
      </TierBucketCard>

      {/* CTA — single primary action at the end */}
      <ValidationBanner
        tier1Done={tier1Done}
        tier1Total={tier1Total}
        allTier1Done={allTier1Done}
        onContinue={onContinue}
      />
    </div>
  );
}

/**
 * CTA à la fin de Step 2 — green si Tier 1 complet, amber sinon.
 */
function ValidationBanner({ tier1Done, tier1Total, allTier1Done, onContinue }) {
  if (allTier1Done) {
    return (
      <div className="rounded-xl p-4 text-sm flex items-start gap-3 bg-green-50 border border-green-200 text-green-800">
        <Sparkles className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <strong>{tier1Done}/{tier1Total} indispensables — c'est bon</strong>
            <p className="text-xs mt-0.5 text-green-700">
              On peut générer votre pré-état daté.
            </p>
          </div>
          {onContinue && (
            <Button
              onClick={onContinue}
              size="sm"
              className="gap-2 bg-green-600 hover:bg-green-700 shrink-0 shadow-sm"
            >
              Continuer
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl p-4 text-sm flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800">
      <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
      <div className="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <strong>{tier1Done}/{tier1Total} indispensables</strong>
          <p className="text-xs mt-0.5 text-amber-700">
            Encore {tier1Total - tier1Done} pièce{tier1Total - tier1Done > 1 ? 's' : ''} pour une analyse complète.
          </p>
        </div>
        {onContinue && (
          <Button
            onClick={onContinue}
            size="sm"
            variant="outline"
            className="gap-2 shrink-0 border-amber-400 text-amber-800 hover:bg-amber-100"
          >
            Continuer quand même
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
