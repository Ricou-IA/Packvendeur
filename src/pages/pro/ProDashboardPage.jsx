import { useState } from 'react';
import { Plus, Mail } from 'lucide-react';
import { Button } from '@components/ui/button';
import ProLayout from '@components/pro/ProLayout';
import KanbanBoard from '@components/pro/KanbanBoard';
import NewDossierDialog from '@components/pro/NewDossierDialog';
import InviteClientDialog from '@components/pro/InviteClientDialog';
import { useProDossiers } from '@hooks/useProAccount';
import PageMeta from '@components/seo/PageMeta';

export default function ProDashboardPage() {
  return (
    <ProLayout>
      {({ proAccount }) => <DashboardContent proAccount={proAccount} />}
    </ProLayout>
  );
}

function DashboardContent({ proAccount }) {
  const { dossiers, isLoading, createDossier, isCreating } = useProDossiers(proAccount.id);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showInviteDialog, setShowInviteDialog] = useState(false);

  const handleCreate = async (clientData) => {
    const result = await createDossier(clientData);
    return result;
  };

  return (
    <>
      <PageMeta
        title="Dashboard — Espace Pro | Pre-etat-date.ai"
        description="Gerez vos dossiers de pre-etat date depuis votre espace professionnel."
        noindex
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900">Mes dossiers</h1>
            <p className="text-sm text-secondary-500 mt-1">
              {dossiers.length} dossier{dossiers.length !== 1 ? 's' : ''} au total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowInviteDialog(true)}
              className="gap-1.5"
            >
              <Mail className="h-4 w-4" />
              Inviter un client
            </Button>
            <Button onClick={() => setShowNewDialog(true)} className="gap-1.5">
              <Plus className="h-4 w-4" />
              Nouveau dossier
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-pulse text-secondary-400">Chargement des dossiers...</div>
          </div>
        ) : dossiers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-secondary-300">
            <p className="text-secondary-500 mb-4">Aucun dossier pour le moment</p>
            <Button onClick={() => setShowNewDialog(true)} variant="outline" className="gap-1.5">
              <Plus className="h-4 w-4" />
              Creer votre premier dossier
            </Button>
          </div>
        ) : (
          <KanbanBoard dossiers={dossiers} />
        )}
      </div>

      <NewDossierDialog
        open={showNewDialog}
        onClose={() => setShowNewDialog(false)}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      <InviteClientDialog
        open={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        proAccount={proAccount}
      />
    </>
  );
}
