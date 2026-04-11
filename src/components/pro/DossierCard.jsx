import { Link } from 'react-router-dom';
import { FileText, User, MapPin, Clock, ClipboardList, FileUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUS_CONFIG = {
  draft: { label: 'Brouillon', color: 'bg-secondary-100 text-secondary-600' },
  analyzing: { label: 'Analyse en cours', color: 'bg-blue-100 text-blue-700' },
  pending_validation: { label: 'À valider', color: 'bg-amber-100 text-amber-700' },
  validated: { label: 'Validé', color: 'bg-green-100 text-green-700' },
  paid: { label: 'Payé', color: 'bg-emerald-100 text-emerald-700' },
  generating: { label: 'Génération...', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Terminé', color: 'bg-emerald-100 text-emerald-800' },
  error: { label: 'Erreur', color: 'bg-red-100 text-red-700' },
  expired: { label: 'Expiré', color: 'bg-secondary-100 text-secondary-500' },
};

/** Count non-empty fields in questionnaire_data to estimate completion */
function getQuestionnaireProgress(questionnaire) {
  if (!questionnaire || typeof questionnaire !== 'object') return 0;

  const { bien, proprietaires, ...rest } = questionnaire;
  let filled = 0;
  let total = 0;

  // bien section (4 fields)
  if (bien && typeof bien === 'object') {
    ['lot_number', 'adresse', 'ville', 'code_postal'].forEach((k) => {
      total++;
      if (bien[k]) filled++;
    });
  } else {
    total += 4;
  }

  // proprietaires (at least 1 with nom filled)
  total++;
  if (Array.isArray(proprietaires) && proprietaires.length > 0) {
    const hasName = proprietaires.some((p) => p.nom || p.denomination);
    if (hasName) filled++;
  }

  // Check key tabs across rest of questionnaire
  const keyFields = ['occupation', 'type_copropriete', 'travaux_votes', 'plus_values_applicable'];
  keyFields.forEach((k) => {
    total++;
    // Check in proprietaires[0] or top-level
    if (rest[k] !== undefined && rest[k] !== '' && rest[k] !== null) {
      filled++;
    } else if (Array.isArray(proprietaires) && proprietaires[0]?.[k] !== undefined && proprietaires[0][k] !== '' && proprietaires[0][k] !== null) {
      filled++;
    }
  });

  return total > 0 ? Math.round((filled / total) * 100) : 0;
}

export default function DossierCard({ dossier }) {
  const status = STATUS_CONFIG[dossier.status] || STATUS_CONFIG.draft;
  const timeAgo = dossier.updated_at
    ? formatDistanceToNow(new Date(dossier.updated_at), { addSuffix: true, locale: fr })
    : '';

  // Document count from joined pv_documents(count)
  const docCount = dossier.pv_documents?.[0]?.count ?? 0;

  // Questionnaire progress
  const questionnairePercent = getQuestionnaireProgress(dossier.questionnaire_data);

  // Show progress for dossiers in "En saisie" (draft + step >= 2)
  const showProgress = dossier.status === 'draft' && dossier.current_step >= 2;

  return (
    <Link
      to={`/pro/dossier/${dossier.id}`}
      className="block bg-white rounded-lg border border-secondary-200 p-4 hover:shadow-md hover:border-primary-200 transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.color}`}>
          {status.label}
        </span>
        {timeAgo && (
          <span className="text-xs text-secondary-400 flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {timeAgo}
          </span>
        )}
      </div>

      {dossier.client_name && (
        <div className="flex items-center gap-1.5 text-sm font-medium text-secondary-800 mb-1">
          <User className="h-3.5 w-3.5 text-secondary-400" />
          {dossier.client_name}
        </div>
      )}

      {(dossier.property_address || dossier.property_city) && (
        <div className="flex items-center gap-1.5 text-xs text-secondary-500">
          <MapPin className="h-3 w-3 text-secondary-400" />
          {[dossier.property_address, dossier.property_postal_code, dossier.property_city]
            .filter(Boolean)
            .join(', ')}
        </div>
      )}

      {dossier.property_lot_number && (
        <div className="flex items-center gap-1.5 text-xs text-secondary-400 mt-1">
          <FileText className="h-3 w-3" />
          Lot {dossier.property_lot_number}
        </div>
      )}

      {/* Progress indicators for "En saisie" dossiers */}
      {showProgress && (
        <div className="mt-3 pt-2 border-t border-secondary-100 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-secondary-500">
              <ClipboardList className="h-3 w-3" />
              Questionnaire
            </span>
            <span className={`font-medium ${questionnairePercent >= 80 ? 'text-green-600' : questionnairePercent > 0 ? 'text-amber-600' : 'text-secondary-400'}`}>
              {questionnairePercent}%
            </span>
          </div>
          <div className="w-full bg-secondary-100 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all ${questionnairePercent >= 80 ? 'bg-green-500' : questionnairePercent > 0 ? 'bg-amber-400' : 'bg-secondary-200'}`}
              style={{ width: `${questionnairePercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1 text-secondary-500">
              <FileUp className="h-3 w-3" />
              Documents
            </span>
            <span className={`font-medium ${docCount >= 5 ? 'text-green-600' : docCount > 0 ? 'text-amber-600' : 'text-secondary-400'}`}>
              {docCount}/19
            </span>
          </div>
          <div className="w-full bg-secondary-100 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all ${docCount >= 5 ? 'bg-green-500' : docCount > 0 ? 'bg-amber-400' : 'bg-secondary-200'}`}
              style={{ width: `${Math.min((docCount / 19) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
