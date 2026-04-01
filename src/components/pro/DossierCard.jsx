import { Link } from 'react-router-dom';
import { FileText, User, MapPin, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUS_CONFIG = {
  draft: { label: 'Brouillon', color: 'bg-secondary-100 text-secondary-600' },
  analyzing: { label: 'Analyse en cours', color: 'bg-blue-100 text-blue-700' },
  pending_validation: { label: 'A valider', color: 'bg-amber-100 text-amber-700' },
  validated: { label: 'Valide', color: 'bg-green-100 text-green-700' },
  paid: { label: 'Paye', color: 'bg-emerald-100 text-emerald-700' },
  generating: { label: 'Generation...', color: 'bg-purple-100 text-purple-700' },
  completed: { label: 'Termine', color: 'bg-emerald-100 text-emerald-800' },
  error: { label: 'Erreur', color: 'bg-red-100 text-red-700' },
  expired: { label: 'Expire', color: 'bg-secondary-100 text-secondary-500' },
};

export default function DossierCard({ dossier }) {
  const status = STATUS_CONFIG[dossier.status] || STATUS_CONFIG.draft;
  const timeAgo = dossier.updated_at
    ? formatDistanceToNow(new Date(dossier.updated_at), { addSuffix: true, locale: fr })
    : '';

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
    </Link>
  );
}
