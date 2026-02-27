import { useEffect } from 'react';
import { Card, CardContent } from '@components/ui/card';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { useAnalysis } from '@hooks/useAnalysis';
import { useDossier } from '@hooks/useDossier';
import { Brain, CheckCircle, AlertCircle, Loader2, FileText } from 'lucide-react';
import QuestionnaireComplementary from '@components/questionnaire/QuestionnaireComplementary';

/**
 * Step 3: Analysis + Complementary questionnaire in parallel.
 * The AI analysis runs in the background while the user fills in the
 * remaining questionnaire tabs (travaux, prêts, fiscal, etc.).
 */
export default function AnalysisStep({ dossierId, dossier, documents, questionnaireData }) {
  const { sessionId } = useDossier();
  const { isAnalyzing, progress, startAnalysis } = useAnalysis(dossierId, sessionId);

  useEffect(() => {
    if (documents.length > 0 && !isAnalyzing && progress.phase === 'idle') {
      startAnalysis(documents, {
        lotNumber: dossier?.property_lot_number,
        propertyAddress: dossier?.property_address,
        questionnaireData: questionnaireData || dossier?.questionnaire_data,
      });
    }
    // dossier and questionnaireData are read at call time, not reactive deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documents, isAnalyzing, progress.phase, startAnalysis]);

  const percentComplete = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  const isDone = progress.phase === 'done';
  const isError = progress.phase === 'error';

  return (
    <div className="space-y-6">
      {/* Compact analysis progress banner */}
      <Card className={`${isDone ? 'border-green-200 bg-green-50/50' : isError ? 'border-destructive/30 bg-destructive/5' : 'border-primary-200 bg-primary-50/30'}`}>
        <CardContent className="py-4">
          <div className="flex items-center gap-3 mb-2">
            {isDone ? (
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            ) : isError ? (
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            ) : (
              <Loader2 className="h-5 w-5 text-primary-600 animate-spin flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-secondary-900">
                  {progress.phase === 'classification' && 'Classification des documents'}
                  {progress.phase === 'extraction' && 'Extraction des données'}
                  {isDone && 'Analyse terminée'}
                  {isError && "Erreur d'analyse"}
                  {progress.phase === 'idle' && 'Préparation de l\'analyse...'}
                </span>
                {isDone && <Badge variant="success" className="text-xs">Prêt</Badge>}
              </div>
              <p className="text-xs text-secondary-500 truncate">{progress.message}</p>
            </div>
            {progress.phase === 'extraction' && (
              <Brain className="h-4 w-4 text-primary-500 flex-shrink-0" />
            )}
          </div>
          {!isDone && !isError && progress.phase !== 'idle' && (
            <Progress value={percentComplete} className="h-1.5" />
          )}
        </CardContent>
      </Card>

      {/* Complementary questionnaire */}
      <div>
        <div className="text-center mb-4">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
            Complétez votre dossier
          </h2>
          <p className="text-secondary-500 text-sm">
            {isDone
              ? 'Analyse terminée. Complétez les informations ci-dessous puis continuez.'
              : 'Pendant que l\'IA analyse vos documents, complétez les informations complémentaires pour le notaire.'
            }
          </p>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-4 w-4 text-primary-600" />
          <span className="text-sm font-medium text-secondary-700">Questionnaire complémentaire</span>
          <span className="text-xs text-secondary-400">(facultatif)</span>
        </div>

        <QuestionnaireComplementary dossier={dossier} />
      </div>
    </div>
  );
}
