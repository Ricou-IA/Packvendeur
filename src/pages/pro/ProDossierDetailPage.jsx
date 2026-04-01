import { useState, useCallback, lazy, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Copy, Check, ExternalLink, FileText, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@components/ui/button';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import ProLayout from '@components/pro/ProLayout';
import CreditBadge from '@components/pro/CreditBadge';
import { dossierService } from '@services/dossier.service';
import { proService } from '@services/pro.service';
import { useDocuments } from '@hooks/useDocuments';
import { useProCredits, proKeys } from '@hooks/useProAccount';
import QuestionnaireStep from '@components/questionnaire/QuestionnaireStep';
import GuidedUpload from '@components/upload/GuidedUpload';
import AnalysisStep from '@components/analysis/AnalysisStep';
import ValidationForm from '@components/validation/ValidationForm';
import PageMeta from '@components/seo/PageMeta';

const DeliveryPanel = lazy(() => import('@components/delivery/DeliveryPanel'));

const STATUS_LABELS = {
  draft: 'Brouillon',
  analyzing: 'Analyse en cours',
  pending_validation: 'A valider',
  validated: 'Valide',
  paid: 'Genere',
  generating: 'Generation...',
  completed: 'Termine',
  error: 'Erreur',
};

export default function ProDossierDetailPage() {
  return (
    <ProLayout>
      {({ proAccount }) => <DetailContent proAccount={proAccount} />}
    </ProLayout>
  );
}

function DetailContent({ proAccount }) {
  const { dossierId } = useParams();
  const queryClient = useQueryClient();
  const { consumeCredit, isConsuming } = useProCredits(proAccount.id);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeView, setActiveView] = useState('overview'); // overview | questionnaire | upload | analysis | validation | delivery

  const { data: queryData, isLoading } = useQuery({
    queryKey: ['pro', 'dossier-detail', dossierId],
    queryFn: async () => {
      const { data, error } = await dossierService.getDossierBySession(null);
      // Fetch by ID instead
      const res = await import('@lib/supabaseClient').then(({ default: supabase }) =>
        supabase.from('pv_dossiers').select('*').eq('id', dossierId).single()
      );
      return { data: res.data, error: res.error };
    },
    enabled: !!dossierId,
    staleTime: 10_000,
  });

  const dossier = queryData?.data || null;
  const { documents, uploadFiles, removeDocument, isUploading } = useDocuments(dossier?.id);

  const uploadLink = dossier?.upload_token
    ? `${window.location.origin}/client/${dossier.upload_token}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(uploadLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const updateDossier = useCallback(async (updates) => {
    if (!dossier?.id) return;
    await dossierService.updateDossier(dossier.id, updates);
    queryClient.invalidateQueries({ queryKey: ['pro', 'dossier-detail', dossierId] });
    queryClient.invalidateQueries({ queryKey: proKeys.dossiers(proAccount.id) });
  }, [dossier?.id, dossierId, queryClient, proAccount.id]);

  const handleGenerate = async () => {
    if (!dossier || proAccount.credits < 1) return;
    setGenerating(true);

    // Consume credit
    const creditResult = await consumeCredit(dossier.id);
    if (creditResult.error) {
      setGenerating(false);
      return;
    }

    // Mark as paid (triggers delivery flow)
    await updateDossier({ status: 'paid', current_step: 6 });
    setActiveView('delivery');
    setGenerating(false);
  };

  const handleQuestionnaireSave = useCallback((questionnaireData) => {
    const existing = dossier?.questionnaire_data || {};
    const merged = { ...existing, ...questionnaireData };
    const bien = questionnaireData?.bien || {};
    const str = (v) => (v === '' || v == null) ? null : v;

    updateDossier({
      questionnaire_data: merged,
      property_lot_number: str(bien.lot_number),
      property_address: str(bien.adresse),
      property_city: str(bien.ville),
      property_postal_code: str(bien.code_postal),
    });
    setActiveView('overview');
  }, [updateDossier, dossier?.questionnaire_data]);

  const handleValidate = useCallback((validatedData) => {
    const str = (v) => (v === '' || v == null) ? null : v;
    const num = (v) => (v === '' || v == null) ? null : Number(v);

    updateDossier({
      validated_data: validatedData,
      status: 'validated',
      pre_etat_date_pdf_path: null,
      property_address: str(validatedData.property_address),
      property_city: str(validatedData.property_city),
      property_postal_code: str(validatedData.property_postal_code),
      property_lot_number: str(validatedData.property_lot_number),
      property_surface: num(validatedData.property_surface),
      copropriete_name: str(validatedData.copropriete_name),
      syndic_name: str(validatedData.syndic_name),
      seller_name: str(validatedData.seller_name),
      budget_previsionnel: num(validatedData.budget_previsionnel),
      tantiemes_lot: num(validatedData.tantiemes_lot),
      tantiemes_totaux: num(validatedData.tantiemes_totaux),
      fonds_travaux_balance: num(validatedData.fonds_travaux_balance),
      charges_courantes: num(validatedData.charges_courantes),
      charges_exceptionnelles: num(validatedData.charges_exceptionnelles),
      impaye_vendeur: num(validatedData.impaye_vendeur),
      dette_copro_fournisseurs: num(validatedData.dette_copro_fournisseurs),
      procedures_en_cours: !!validatedData.procedures_en_cours,
      procedures_details: str(validatedData.procedures_details),
      travaux_votes_non_realises: !!validatedData.travaux_votes_non_realises,
      travaux_details: str(validatedData.travaux_details),
      dpe_ademe_number: str(validatedData.dpe_ademe_number),
    });
  }, [updateDossier]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse text-secondary-400">Chargement du dossier...</div>
      </div>
    );
  }

  if (!dossier) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <p className="text-secondary-500 mb-4">Dossier introuvable</p>
        <Button asChild variant="outline">
          <Link to="/pro">Retour au dashboard</Link>
        </Button>
      </div>
    );
  }

  // Overview mode
  if (activeView === 'overview') {
    return (
      <>
        <PageMeta title={`Dossier ${dossier.client_name || dossier.id.slice(0, 8)} — Espace Pro`} noindex />
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <Button asChild variant="ghost" size="sm" className="gap-1.5">
              <Link to="/pro"><ArrowLeft className="h-4 w-4" /> Dashboard</Link>
            </Button>
          </div>

          {/* Header */}
          <div className="bg-white rounded-xl border border-secondary-200 p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-xl font-bold text-secondary-900">
                  {dossier.client_name || 'Dossier sans nom'}
                </h1>
                {dossier.property_address && (
                  <p className="text-sm text-secondary-500 mt-1">
                    {[dossier.property_address, dossier.property_postal_code, dossier.property_city].filter(Boolean).join(', ')}
                  </p>
                )}
              </div>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                dossier.status === 'completed' ? 'bg-green-100 text-green-700' :
                dossier.status === 'validated' ? 'bg-emerald-100 text-emerald-700' :
                dossier.status === 'pending_validation' ? 'bg-amber-100 text-amber-700' :
                'bg-secondary-100 text-secondary-600'
              }`}>
                {STATUS_LABELS[dossier.status] || dossier.status}
              </span>
            </div>

            {/* Client info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {dossier.client_email && (
                <div>
                  <span className="text-secondary-400">Email</span>
                  <p className="text-secondary-700">{dossier.client_email}</p>
                </div>
              )}
              {dossier.client_phone && (
                <div>
                  <span className="text-secondary-400">Telephone</span>
                  <p className="text-secondary-700">{dossier.client_phone}</p>
                </div>
              )}
              {dossier.property_lot_number && (
                <div>
                  <span className="text-secondary-400">Lot</span>
                  <p className="text-secondary-700">{dossier.property_lot_number}</p>
                </div>
              )}
              <div>
                <span className="text-secondary-400">Documents</span>
                <p className="text-secondary-700">{documents.length} fichier{documents.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Upload link */}
          {uploadLink && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-blue-800 mb-2">Lien d'upload client</p>
              <div className="flex gap-2">
                <input value={uploadLink} readOnly className="flex-1 text-xs bg-white border border-blue-200 rounded px-3 py-2" />
                <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          )}

          {/* Share link (after generation) */}
          {dossier.share_url && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <p className="text-sm font-medium text-green-800 mb-2">Lien notaire</p>
              <div className="flex gap-2">
                <input value={`${window.location.origin}${dossier.share_url}`} readOnly className="flex-1 text-xs bg-white border border-green-200 rounded px-3 py-2" />
                <Button type="button" variant="outline" size="sm" onClick={() => { navigator.clipboard.writeText(`${window.location.origin}${dossier.share_url}`); }}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            <Button variant="outline" size="sm" onClick={() => setActiveView('questionnaire')}>
              Questionnaire
            </Button>
            <Button variant="outline" size="sm" onClick={() => setActiveView('upload')}>
              Documents
            </Button>
            {documents.length > 0 && dossier.status === 'draft' && (
              <Button variant="outline" size="sm" onClick={() => setActiveView('analysis')}>
                Lancer l'analyse
              </Button>
            )}
            {(dossier.status === 'pending_validation' || dossier.status === 'validated') && (
              <Button variant="outline" size="sm" onClick={() => setActiveView('validation')}>
                Validation
              </Button>
            )}
          </div>

          {/* Generate button */}
          {dossier.status === 'validated' && (
            <div className="bg-white rounded-xl border-2 border-primary-200 p-6 text-center">
              <Sparkles className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">Pret a generer</h3>
              <p className="text-sm text-secondary-500 mb-4">
                Ce dossier est valide et pret pour la generation du pre-etat date.
              </p>
              <div className="flex items-center justify-center gap-3">
                <CreditBadge credits={proAccount.credits} />
                <Button
                  onClick={handleGenerate}
                  disabled={generating || isConsuming || proAccount.credits < 1}
                  className="gap-1.5"
                >
                  {generating || isConsuming ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Generation...
                    </>
                  ) : proAccount.credits < 1 ? (
                    'Credits insuffisants'
                  ) : (
                    <>
                      <FileText className="h-4 w-4" />
                      Generer (1 credit)
                    </>
                  )}
                </Button>
              </div>
              {proAccount.credits < 1 && (
                <Button asChild variant="link" className="mt-2">
                  <Link to="/pro/credits">Acheter des credits</Link>
                </Button>
              )}
            </div>
          )}

          {/* Completed: show delivery */}
          {(dossier.status === 'paid' || dossier.status === 'completed') && (
            <Button onClick={() => setActiveView('delivery')} className="w-full gap-1.5">
              <FileText className="h-4 w-4" />
              Voir le pack genere
            </Button>
          )}

          {/* Notes */}
          {dossier.pro_notes && (
            <div className="mt-6 bg-secondary-50 rounded-lg p-4">
              <p className="text-xs text-secondary-400 mb-1">Notes internes</p>
              <p className="text-sm text-secondary-600">{dossier.pro_notes}</p>
            </div>
          )}
        </div>
      </>
    );
  }

  // Sub-views reuse existing wizard components
  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <Button variant="ghost" size="sm" onClick={() => setActiveView('overview')} className="gap-1.5 mb-6">
        <ArrowLeft className="h-4 w-4" /> Retour au dossier
      </Button>

      {activeView === 'questionnaire' && (
        <QuestionnaireStep dossier={dossier} onSave={handleQuestionnaireSave} />
      )}

      {activeView === 'upload' && (
        <GuidedUpload
          dossierId={dossier.id}
          dossier={dossier}
          documents={documents}
          onUpload={uploadFiles}
          onRemove={removeDocument}
          isUploading={isUploading}
          questionnaireData={dossier?.questionnaire_data}
        />
      )}

      {activeView === 'analysis' && (
        <AnalysisStep
          dossierId={dossier.id}
          dossier={dossier}
          documents={documents}
          questionnaireData={dossier?.questionnaire_data}
        />
      )}

      {activeView === 'validation' && (
        <ValidationForm dossier={dossier} onValidate={handleValidate} />
      )}

      {activeView === 'delivery' && (
        <Suspense fallback={
          <div className="text-center py-12">
            <Loader2 className="h-10 w-10 text-primary-500 mx-auto mb-3 animate-spin" />
            <p className="text-secondary-500">Chargement du module de livraison...</p>
          </div>
        }>
          <DeliveryPanel dossier={dossier} documents={documents} onResetSession={() => setActiveView('overview')} />
        </Suspense>
      )}
    </div>
  );
}
