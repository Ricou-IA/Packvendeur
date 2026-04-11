import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { useAnalysis } from '@hooks/useAnalysis';
import { useDossier } from '@hooks/useDossier';
import {
  Brain,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  FileSearch,
  ShieldCheck,
} from 'lucide-react';

// Rotating motivational messages shown while extraction is running
const ROTATING_MESSAGES = [
  { icon: FileSearch, text: 'Analyse des diagnostics en cours…' },
  { icon: Brain, text: 'Extraction des données financières…' },
  { icon: ShieldCheck, text: 'Vérifications croisées des montants…' },
  { icon: FileSearch, text: 'Détection des travaux votés…' },
  { icon: Brain, text: 'Calcul des tantièmes et charges…' },
];

/**
 * Step 4 (Pay-first funnel): post-payment processing page.
 *
 * Auto-triggers the full AI extraction (financial + diagnostics via
 * useAnalysis) on mount. Polls the dossier until status flips to
 * 'pending_validation', then calls onComplete() so DossierPage advances
 * to Step 5 (Validation).
 *
 * Idempotent: if the user closes the tab and comes back, the hook
 * detects the existing paid-but-unextracted state and resumes automatically.
 */
export default function ProcessingStep({ dossierId, dossier, documents, onComplete }) {
  const { sessionId } = useDossier();
  const { isAnalyzing, progress, startAnalysis, resetForRetry } = useAnalysis(dossierId, sessionId);
  const [rotatingIdx, setRotatingIdx] = useState(0);

  // Auto-trigger extraction on mount if the dossier is paid and not yet extracted.
  // The hook's module-level guard prevents StrictMode double-trigger.
  // Skipping when status === 'analyzing' covers the cross-tab / page-refresh edge case.
  useEffect(() => {
    if (
      documents.length > 0 &&
      !isAnalyzing &&
      progress.phase === 'idle' &&
      dossier?.stripe_payment_status === 'paid' &&
      dossier?.status !== 'analyzing' &&
      dossier?.status !== 'pending_validation' &&
      !dossier?.extracted_data
    ) {
      startAnalysis(documents, {
        lotNumber: dossier?.property_lot_number,
        propertyAddress: dossier?.property_address,
        questionnaireData: dossier?.questionnaire_data,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, isAnalyzing, progress.phase, startAnalysis, dossier?.stripe_payment_status, dossier?.status]);

  // Rotate the reassurance message every 4s while extraction is running
  useEffect(() => {
    if (progress.phase !== 'extraction' && progress.phase !== 'classification') return;
    const timer = setInterval(() => {
      setRotatingIdx((i) => (i + 1) % ROTATING_MESSAGES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [progress.phase]);

  // When extraction finishes (via hook OR via dossier status from polling),
  // advance the wizard to Step 5 (Validation).
  useEffect(() => {
    const done = progress.phase === 'done' || dossier?.status === 'pending_validation';
    if (done && onComplete) {
      const timer = setTimeout(onComplete, 1200);
      return () => clearTimeout(timer);
    }
  }, [progress.phase, dossier?.status, onComplete]);

  const handleRetry = () => {
    resetForRetry();
    // startAnalysis will be re-triggered by the useEffect above once phase returns to 'idle'
  };

  const percentComplete = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  const isError = progress.phase === 'error';
  const isDone = progress.phase === 'done' || dossier?.status === 'pending_validation';
  const rotating = ROTATING_MESSAGES[rotatingIdx];
  const RotatingIcon = rotating.icon;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          {isError
            ? 'Un instant…'
            : isDone
              ? 'Analyse terminée'
              : 'Vos documents sont en cours d\'analyse'}
        </h2>
        <p className="text-secondary-500">
          {isError
            ? 'Un petit souci technique, rien de grave !'
            : isDone
              ? 'Redirection vers la validation…'
              : 'Nous analysons vos documents et extrayons les données pour votre pré-état daté. Cela prend généralement 30 à 60 secondes.'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {isDone ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : isError ? (
              <AlertCircle className="h-5 w-5 text-amber-500" />
            ) : (
              <Loader2 className="h-5 w-5 text-step-analysis animate-spin" />
            )}
            {progress.phase === 'classification' && 'Classification des documents'}
            {progress.phase === 'extraction' && 'Extraction des données'}
            {isDone && 'Analyse terminée'}
            {progress.phase === 'error' && 'Analyse interrompue'}
            {progress.phase === 'idle' && 'Démarrage de l\'analyse…'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isError && !isDone && progress.phase !== 'idle' && (
            <Progress value={percentComplete} />
          )}

          {isError ? (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  Notre service d'analyse est momentanément indisponible.
                  Cela arrive parfois lors de pics d'utilisation et se résout généralement en quelques instants.
                  Votre paiement est bien enregistré — aucun risque de double facturation.
                </p>
              </div>
              <Button onClick={handleRetry} className="w-full" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Relancer l'analyse
              </Button>
            </div>
          ) : isDone ? (
            <div className="flex items-center gap-2">
              <Badge variant="success">Prêt pour validation</Badge>
              <p className="text-xs text-secondary-500">Redirection automatique…</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-secondary-600">{progress.message || 'Préparation…'}</p>
              <div className="flex items-center gap-2 bg-primary-50/40 border border-primary-100 rounded-md px-3 py-2">
                <RotatingIcon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                <p className="text-xs text-primary-700">{rotating.text}</p>
              </div>
            </div>
          )}

          {progress.phase === 'classification' && (
            <p className="text-xs text-secondary-400">
              {progress.current}/{progress.total} documents traités
            </p>
          )}
        </CardContent>
      </Card>

      {/* Reassurance note — visible while running */}
      {!isError && !isDone && (
        <div className="text-center text-xs text-secondary-400">
          <p>Votre paiement est enregistré. L'analyse continue même si vous actualisez la page.</p>
        </div>
      )}
    </div>
  );
}
