import { useCallback, useEffect, useState, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Building2, CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import { useClientUpload } from '@hooks/useClientUpload';
import { useClientDocuments } from '@hooks/useClientDocuments';
import { clientUploadService } from '@services/clientUpload.service';
import { useQueryClient } from '@tanstack/react-query';
import StepIndicator from '@components/layout/StepIndicator';
import QuestionnaireStep from '@components/questionnaire/QuestionnaireStep';
import GuidedUpload from '@components/upload/GuidedUpload';
import AnalysisStep from '@components/analysis/AnalysisStep';
import ValidationForm from '@components/validation/ValidationForm';
import PageMeta from '@components/seo/PageMeta';

// Client wizard: steps 1-4 only (no payment, no delivery)
const CLIENT_STEPS = [
  { label: 'Questionnaire', step: 1 },
  { label: 'Documents', step: 2 },
  { label: 'Analyse', step: 3 },
  { label: 'Validation', step: 4 },
];

export default function ClientUploadPage() {
  const { uploadToken } = useParams();
  const { dossier, proAccount, isLoading, isNotFound } = useClientUpload(uploadToken);
  const { documents, uploadFiles, removeDocument, isUploading } = useClientDocuments(uploadToken);
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(1);
  const [completed, setCompleted] = useState(false);

  // Sync step from dossier
  useEffect(() => {
    if (dossier?.current_step && dossier.current_step <= 4) {
      setCurrentStep(dossier.current_step);
    }
    // If dossier is already validated, show completion
    if (dossier?.status === 'validated' || dossier?.status === 'paid' || dossier?.status === 'completed') {
      setCompleted(true);
    }
  }, [dossier?.current_step, dossier?.status]);

  // Scroll to top on step change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStep]);

  const updateDossier = useCallback(async (updates) => {
    if (!dossier?.id || !uploadToken) return;
    await clientUploadService.updateDossier(uploadToken, updates);
    queryClient.invalidateQueries({ queryKey: ['client', 'dossier', uploadToken] });
  }, [dossier?.id, queryClient, uploadToken]);

  const handleQuestionnaireSave = useCallback((questionnaireData) => {
    const existing = dossier?.questionnaire_data || {};
    const merged = { ...existing, ...questionnaireData };
    const bien = questionnaireData?.bien || {};
    const str = (v) => (v === '' || v == null) ? null : v;

    updateDossier({
      questionnaire_data: merged,
      current_step: 2,
      property_lot_number: str(bien.lot_number),
      property_address: str(bien.adresse),
      property_city: str(bien.ville),
      property_postal_code: str(bien.code_postal),
    });
    setCurrentStep(2);
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
    setCompleted(true);
  }, [updateDossier]);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1: return true;
      case 2: return documents.length > 0;
      case 3: return dossier?.status === 'pending_validation';
      default: return false;
    }
  }, [currentStep, documents.length, dossier?.status]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-secondary-400">Chargement...</div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-secondary-900 mb-2">Lien invalide</h1>
          <p className="text-secondary-500">Ce lien d'upload n'existe pas ou a expire.</p>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 flex items-center justify-center px-4">
        <PageMeta title="Dossier envoye | Pre-etat-date.ai" noindex />
        <div className="max-w-md w-full text-center">
          <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Merci !</h1>
          <p className="text-secondary-500 mb-6">
            Vos documents ont ete transmis avec succes.
            {proAccount?.company_name && (
              <> Votre agent <strong>{proAccount.company_name}</strong> va finaliser la generation de votre dossier.</>
            )}
          </p>
          <div className="bg-white rounded-xl border border-secondary-200 p-4 text-left text-sm text-secondary-600">
            <p className="font-medium text-secondary-800 mb-2">Prochaines etapes :</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Votre agent verifie les documents</li>
              <li>Le pre-etat date est genere</li>
              <li>Le lien de partage est envoye au notaire</li>
            </ol>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <PageMeta title="Deposer vos documents | Pre-etat-date.ai" noindex />

      {/* Minimal branded header */}
      <header className="border-b border-secondary-100 bg-white">
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {proAccount?.company_name ? (
              <span className="text-sm font-semibold text-secondary-800">
                <Building2 className="h-4 w-4 inline mr-1.5 text-secondary-400" />
                {proAccount.company_name}
              </span>
            ) : (
              <img src="/logo.png" alt="Pre-etat-date.ai" className="h-10" />
            )}
          </div>
          <span className="text-xs text-secondary-400">Powered by Pre-etat-date.ai</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Step indicator (4 steps only) */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-2">
            {CLIENT_STEPS.map((s, i) => (
              <div key={s.step} className="flex items-center">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                  currentStep === s.step
                    ? 'bg-primary-100 text-primary-700'
                    : currentStep > s.step
                    ? 'bg-green-100 text-green-700'
                    : 'bg-secondary-100 text-secondary-400'
                }`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentStep === s.step ? 'bg-primary-600 text-white' :
                    currentStep > s.step ? 'bg-green-500 text-white' :
                    'bg-secondary-300 text-white'
                  }`}>
                    {currentStep > s.step ? '\u2713' : s.step}
                  </span>
                  <span className="hidden sm:inline">{s.label}</span>
                </div>
                {i < CLIENT_STEPS.length - 1 && (
                  <div className={`w-8 h-0.5 mx-1 ${currentStep > s.step ? 'bg-green-300' : 'bg-secondary-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <QuestionnaireStep dossier={dossier} onSave={handleQuestionnaireSave} />
          )}

          {currentStep === 2 && (
            <GuidedUpload
              dossierId={dossier?.id}
              dossier={dossier}
              documents={documents}
              onUpload={uploadFiles}
              onRemove={removeDocument}
              isUploading={isUploading}
              questionnaireData={dossier?.questionnaire_data}
            />
          )}

          {currentStep === 3 && (
            <AnalysisStep
              dossierId={dossier?.id}
              dossier={dossier}
              documents={documents}
              questionnaireData={dossier?.questionnaire_data}
            />
          )}

          {currentStep === 4 && (
            <ValidationForm dossier={dossier} onValidate={handleValidate} />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>

          {currentStep < 4 && currentStep !== 1 && (
            <Button
              onClick={() => {
                if (canProceed()) {
                  const next = currentStep + 1;
                  setCurrentStep(next);
                  updateDossier({ current_step: next });
                }
              }}
              disabled={!canProceed()}
              className="gap-2"
            >
              {currentStep === 2 ? "Lancer l'analyse" : 'Continuer'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}

          {currentStep === 1 && (
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(2);
                updateDossier({ current_step: 2 });
              }}
              className="gap-2"
            >
              Passer cette etape
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
