import { CheckCircle2, AlertTriangle, Circle } from 'lucide-react';

export default function UploadSummary({ stats, hasDpe }) {
  const allRequiredFilled = stats.requiredFilled === stats.requiredTotal;

  return (
    <div className="bg-secondary-50 rounded-lg border p-4">
      <p className="text-sm font-medium text-secondary-700 mb-3">Resume du dossier</p>

      <div className="space-y-2">
        {/* Global progress */}
        <div className="flex items-center gap-2">
          {allRequiredFilled ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          )}
          <span className="text-sm text-secondary-700">Documents obligatoires :</span>
          <span className={`text-sm font-medium ${allRequiredFilled ? 'text-green-700' : 'text-amber-700'}`}>
            {stats.requiredFilled}/{stats.requiredTotal}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {stats.filled > stats.requiredFilled ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-secondary-300" />
          )}
          <span className="text-sm text-secondary-700">Documents facultatifs :</span>
          <span className="text-sm font-medium text-secondary-600">
            {stats.filled - stats.requiredFilled}/{stats.total - stats.requiredTotal}
          </span>
        </div>

        {/* DPE line */}
        <div className="flex items-center gap-2">
          {hasDpe ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Circle className="h-4 w-4 text-secondary-300" />
          )}
          <span className="text-sm text-secondary-700">DPE :</span>
          <span className={`text-sm font-medium ${hasDpe ? 'text-green-700' : 'text-secondary-400'}`}>
            {hasDpe ? 'verifie' : 'non renseigne'}
          </span>
        </div>
      </div>

      {!allRequiredFilled && (
        <p className="text-xs text-amber-600 mt-3 pt-3 border-t border-secondary-200">
          Completez les documents obligatoires pour un dossier conforme. Vous pouvez lancer l'analyse
          des maintenant si vous le souhaitez.
        </p>
      )}

      {allRequiredFilled && (
        <p className="text-xs text-green-600 mt-3 pt-3 border-t border-secondary-200">
          Tous les documents obligatoires sont fournis. Votre dossier est pret pour l'analyse.
        </p>
      )}
    </div>
  );
}
