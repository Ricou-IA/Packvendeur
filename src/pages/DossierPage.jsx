import { useCallback, useEffect, lazy, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import StepIndicator from '@components/layout/StepIndicator';
import QuestionnaireStep from '@components/questionnaire/QuestionnaireStep';
import GuidedUpload from '@components/upload/GuidedUpload';
import PaymentCard from '@components/payment/PaymentCard';
import ProcessingStep from '@components/processing/ProcessingStep';
import ValidationForm from '@components/validation/ValidationForm';
import { Button } from '@components/ui/button';
import { useDossier } from '@hooks/useDossier';
import { useDocuments } from '@hooks/useDocuments';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';

// Lazy-load DeliveryPanel (pulls @react-pdf/renderer ~1.5MB via PreEtatDateTemplate)
const DeliveryPanel = lazy(() => import('@components/delivery/DeliveryPanel'));

export default function DossierPage() {
  const { sessionId: urlSessionId } = useParams();
  const { dossier, isLoading, currentStep, setCurrentStep, updateDossier, resetSession } = useDossier(urlSessionId);
  const { documents, uploadFiles, removeDocument, isUploading } = useDocuments(dossier?.id);

  // Scroll to top whenever the step changes (pathname stays /dossier so ScrollToTop doesn't fire)
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [currentStep]);

  // Pay-first funnel step mapping:
  //   1. Questionnaire           (status: draft)
  //   2. Upload + classification (status: draft)
  //   3. Payment                 (status: draft → paid)
  //   4. Processing (extraction) (status: paid → analyzing → pending_validation)
  //   5. Validation              (status: pending_validation → validated)
  //   6. Delivery (PDF + share)  (status: validated → completed)
  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1: // Questionnaire — always can skip or continue
        return true;
      case 2: // Upload
        return documents.length > 0;
      case 3: // Payment — advances once Stripe webhook / verify-checkout has flipped status
        return dossier?.status === 'paid'
          || dossier?.status === 'analyzing'
          || dossier?.status === 'pending_validation'
          || dossier?.status === 'validated'
          || dossier?.status === 'completed';
      case 4: // Processing — advances automatically once extraction is done
        return dossier?.status === 'pending_validation'
          || dossier?.status === 'validated'
          || dossier?.status === 'completed';
      case 5: // Validation — advances once user validates
        return dossier?.status === 'validated' || dossier?.status === 'completed';
      default:
        return false;
    }
  }, [currentStep, documents.length, dossier?.status]);

  const handleNext = useCallback(() => {
    if (currentStep < 6 && canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, canProceed, setCurrentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  // Auto-advance Step 4 → Step 5 when extraction finishes
  useEffect(() => {
    if (currentStep === 4 && dossier?.status === 'pending_validation') {
      setCurrentStep(5);
    }
  }, [currentStep, dossier?.status, setCurrentStep]);

  // Save essential questionnaire data + bien fields as flat dossier columns, then advance
  // Merges with existing questionnaire_data to preserve complementary fields from the vendor questionnaire
  const handleQuestionnaireSave = useCallback((questionnaireData) => {
    const existing = dossier?.questionnaire_data || {};
    const merged = { ...existing, ...questionnaireData };
    const bien = questionnaireData?.bien || {};
    const str = (v) => (v === '' || v == null) ? null : v;

    updateDossier({
      questionnaire_data: merged,
      // Save bien fields to flat dossier columns so they're available in Step 2 banner + AI extraction
      property_lot_number: str(bien.lot_number),
      property_address: str(bien.adresse),
      property_city: str(bien.ville),
      property_postal_code: str(bien.code_postal),
    });
    setCurrentStep(2);
  }, [updateDossier, setCurrentStep, dossier?.questionnaire_data]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse-slow text-secondary-400">Chargement...</div>
      </div>
    );
  }

  // Single source of truth for the navigation — used twice (top + bottom)
  // so the user can navigate without scrolling on long steps.
  const renderStepNavigation = (location) => {
    if (currentStep === 4) return null; // hidden during Processing
    return (
      <div
        className={
          location === 'top'
            ? 'flex items-center justify-between mb-6'
            : 'flex items-center justify-between mt-8 pt-6 border-t'
        }
      >
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* Hide the "Continuer" button during:
            - Step 1 (Questionnaire submits via its own form button)
            - Step 2 (Upload — CTA is now in the sticky ValidationBanner at the bottom)
            - Step 3 (Payment submits via its own button) */}
        {currentStep !== 1 && currentStep !== 2 && currentStep !== 3 && currentStep < 6 && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            Continuer
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}

        {/* Step 1: Skip button (questionnaire has its own submit) */}
        {currentStep === 1 && (
          <Button
            variant="outline"
            onClick={() => setCurrentStep(2)}
            className="gap-2"
          >
            Passer cette étape
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <StepIndicator currentStep={currentStep} />
      </div>

      {/* Top navigation — duplicates the bottom nav so the user doesn't
          have to scroll to skip / go back on long steps. */}
      {renderStepNavigation('top')}

      <div className="min-h-[400px]">
        {/* Step 1: Questionnaire vendeur */}
        {currentStep === 1 && (
          <QuestionnaireStep
            dossier={dossier}
            onSave={handleQuestionnaireSave}
          />
        )}

        {/* Step 2: Upload */}
        {currentStep === 2 && (
          <GuidedUpload
            dossierId={dossier?.id}
            dossier={dossier}
            documents={documents}
            onUpload={uploadFiles}
            onRemove={removeDocument}
            isUploading={isUploading}
            questionnaireData={dossier?.questionnaire_data}
            onContinue={canProceed() ? handleNext : null}
          />
        )}

        {/* Step 3: Payment (moved forward in the pay-first funnel) */}
        {currentStep === 3 && (
          <PaymentCard
            dossier={dossier}
            documents={documents}
            onSuccess={() => setCurrentStep(4)}
          />
        )}

        {/* Step 4: Processing — triggers extraction + auto-advances when done */}
        {currentStep === 4 && (
          <ProcessingStep
            dossierId={dossier?.id}
            dossier={dossier}
            documents={documents}
            onComplete={() => setCurrentStep(5)}
          />
        )}

        {/* Step 5: Validation (moved after payment/processing) */}
        {currentStep === 5 && (
          <ValidationForm
            dossier={dossier}
            onValidate={(validatedData) => {
              // Helper: preserve 0 for numbers, convert "" to null for strings
              const str = (v) => (v === '' || v == null) ? null : v;
              const num = (v) => (v === '' || v == null) ? null : Number(v);

              updateDossier({
                validated_data: validatedData,
                status: 'validated',
                // Reset PDF path so Step 6 regenerates with fresh data
                pre_etat_date_pdf_path: null,
                // Save flat fields to individual dossier columns for PDF/queries
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
            }}
          />
        )}

        {/* Step 6: Delivery (lazy — loads @react-pdf chunk only when needed) */}
        {currentStep === 6 && (
          <Suspense fallback={
            <div className="text-center py-12">
              <Loader2 className="h-10 w-10 text-primary-500 mx-auto mb-3 animate-spin" />
              <p className="text-secondary-500">Chargement du module de livraison...</p>
            </div>
          }>
            <DeliveryPanel dossier={dossier} documents={documents} onResetSession={resetSession} />
          </Suspense>
        )}
      </div>

      {/* Bottom navigation — same component, mirrors the top nav. */}
      {renderStepNavigation('bottom')}
    </div>
  );
}
