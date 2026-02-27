import { useCallback } from 'react';
import { useParams } from 'react-router-dom';
import StepIndicator from '@components/layout/StepIndicator';
import QuestionnaireStep from '@components/questionnaire/QuestionnaireStep';
import GuidedUpload from '@components/upload/GuidedUpload';
import AnalysisStep from '@components/analysis/AnalysisStep';
import ValidationForm from '@components/validation/ValidationForm';
import PaymentCard from '@components/payment/PaymentCard';
import DeliveryPanel from '@components/delivery/DeliveryPanel';
import { Button } from '@components/ui/button';
import { useDossier } from '@hooks/useDossier';
import { useDocuments } from '@hooks/useDocuments';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function DossierPage() {
  const { sessionId: urlSessionId } = useParams();
  const { dossier, isLoading, currentStep, setCurrentStep, updateDossier } = useDossier(urlSessionId);
  const { documents, uploadFiles, removeDocument, isUploading } = useDocuments(dossier?.id);

  const canProceed = useCallback(() => {
    switch (currentStep) {
      case 1: // Questionnaire — always can skip or continue
        return true;
      case 2: // Upload
        return documents.length > 0;
      case 3: // Analysis
        return dossier?.status === 'pending_validation';
      case 4: // Validation
        return dossier?.status === 'validated';
      case 5: // Payment
        return dossier?.status === 'paid' || dossier?.status === 'completed';
      default:
        return false;
    }
  }, [currentStep, documents.length, dossier?.status]);

  const handleNext = useCallback(() => {
    if (currentStep < 6 && canProceed()) {
      // DEV ONLY: skip payment step — go straight from validation to delivery
      if (import.meta.env.DEV && currentStep === 4 && dossier?.status === 'validated') {
        updateDossier({ status: 'paid' });
        setCurrentStep(6);
        return;
      }
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, canProceed, setCurrentStep, dossier?.status, updateDossier]);

  const handleBack = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep, setCurrentStep]);

  // Save essential questionnaire data + bien fields as flat dossier columns, then advance
  // Merges with existing questionnaire_data to preserve complementary fields from Step 3
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <StepIndicator currentStep={currentStep} />
      </div>

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
          />
        )}

        {/* Step 3: Analysis + Complementary questionnaire */}
        {currentStep === 3 && (
          <AnalysisStep
            dossierId={dossier?.id}
            dossier={dossier}
            documents={documents}
            questionnaireData={dossier?.questionnaire_data}
          />
        )}

        {/* Step 4: Validation */}
        {currentStep === 4 && (
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

        {/* Step 5: Payment */}
        {currentStep === 5 && (
          <PaymentCard
            dossier={dossier}
            onSuccess={() => setCurrentStep(6)}
          />
        )}

        {/* Step 6: Delivery */}
        {currentStep === 6 && (
          <DeliveryPanel dossier={dossier} documents={documents} />
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {currentStep < 6 && currentStep !== 1 && (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            {currentStep === 2 ? "Lancer l'analyse" : 'Continuer'}
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
    </div>
  );
}
