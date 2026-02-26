import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Progress } from '@components/ui/progress';
import { Badge } from '@components/ui/badge';
import { useAnalysis } from '@hooks/useAnalysis';
import { useDossier } from '@hooks/useDossier';
import { Brain, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AnalysisProgress({ dossierId, documents, questionnaireData, onComplete }) {
  const { dossier, sessionId } = useDossier();
  const { isAnalyzing, progress, startAnalysis } = useAnalysis(dossierId, sessionId);

  useEffect(() => {
    // Guard is handled by module-level Set in useAnalysis — safe against StrictMode
    if (documents.length > 0 && !isAnalyzing && progress.phase === 'idle') {
      startAnalysis(documents, {
        lotNumber: dossier?.property_lot_number,
        propertyAddress: dossier?.property_address,
        questionnaireData: questionnaireData || dossier?.questionnaire_data,
      });
    }
  }, [documents, isAnalyzing, progress.phase, startAnalysis]);

  useEffect(() => {
    if (progress.phase === 'done' && onComplete) {
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [progress.phase, onComplete]);

  const percentComplete = progress.total > 0
    ? Math.round((progress.current / progress.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          Analyse en cours
        </h2>
        <p className="text-secondary-500">
          L'IA analyse vos documents pour extraire les données financières et juridiques.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            {progress.phase === 'done' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : progress.phase === 'error' ? (
              <AlertCircle className="h-5 w-5 text-destructive" />
            ) : (
              <Loader2 className="h-5 w-5 text-step-analysis animate-spin" />
            )}
            {progress.phase === 'classification' && 'Classification des documents'}
            {progress.phase === 'extraction' && 'Extraction des données'}
            {progress.phase === 'done' && 'Analyse terminée'}
            {progress.phase === 'error' && 'Erreur d\'analyse'}
            {progress.phase === 'idle' && 'Préparation...'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {progress.phase !== 'error' && progress.phase !== 'idle' && (
            <Progress value={progress.phase === 'done' ? 100 : percentComplete} />
          )}

          <p className="text-sm text-secondary-600">{progress.message}</p>

          {progress.phase === 'classification' && (
            <p className="text-xs text-secondary-400">
              {progress.current}/{progress.total} documents traités
            </p>
          )}

          {progress.phase === 'extraction' && (
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-step-analysis" />
              <p className="text-xs text-secondary-400">
                Analyse globale de tous les documents en cours...
              </p>
            </div>
          )}

          {progress.phase === 'done' && (
            <Badge variant="success">Prêt pour validation</Badge>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
