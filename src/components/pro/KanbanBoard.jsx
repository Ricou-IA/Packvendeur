import { useMemo } from 'react';
import DossierCard from './DossierCard';
import { FolderPlus, FileUp, Brain, ClipboardCheck, CheckCircle2 } from 'lucide-react';

const KANBAN_COLUMNS = [
  {
    id: 'nouveau',
    label: 'Nouveau',
    icon: FolderPlus,
    color: 'border-secondary-300',
    filter: (d) => d.status === 'draft' && !d.current_step || d.current_step <= 1,
  },
  {
    id: 'en_saisie',
    label: 'En saisie',
    icon: FileUp,
    color: 'border-blue-300',
    filter: (d) => d.status === 'draft' && d.current_step >= 2,
  },
  {
    id: 'analyse',
    label: 'En analyse',
    icon: Brain,
    color: 'border-purple-300',
    filter: (d) => d.status === 'analyzing',
  },
  {
    id: 'a_valider',
    label: 'À valider',
    icon: ClipboardCheck,
    color: 'border-amber-300',
    filter: (d) => d.status === 'pending_validation' || d.status === 'validated',
  },
  {
    id: 'termine',
    label: 'Terminé',
    icon: CheckCircle2,
    color: 'border-emerald-300',
    filter: (d) => ['paid', 'generating', 'completed'].includes(d.status),
  },
];

export default function KanbanBoard({ dossiers = [] }) {
  const columns = useMemo(() => {
    return KANBAN_COLUMNS.map((col) => ({
      ...col,
      items: dossiers.filter(col.filter),
    }));
  }, [dossiers]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {columns.map((col) => (
        <div key={col.id} className={`border-t-2 ${col.color} bg-white/50 rounded-lg p-3`}>
          <div className="flex items-center gap-2 mb-3">
            <col.icon className="h-4 w-4 text-secondary-500" />
            <h3 className="text-sm font-semibold text-secondary-700">{col.label}</h3>
            <span className="ml-auto text-xs font-medium text-secondary-400 bg-secondary-100 px-1.5 py-0.5 rounded">
              {col.items.length}
            </span>
          </div>
          <div className="space-y-2">
            {col.items.length === 0 ? (
              <p className="text-xs text-secondary-400 text-center py-4">Aucun dossier</p>
            ) : (
              col.items.map((dossier) => (
                <DossierCard key={dossier.id} dossier={dossier} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
