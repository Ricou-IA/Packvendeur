import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Upload, Share2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import ProLayout from '@components/pro/ProLayout';
import PageMeta from '@components/seo/PageMeta';

export default function ProQuickStartPage() {
  return (
    <ProLayout>
      {({ proAccount }) => <QuickStartContent proAccount={proAccount} />}
    </ProLayout>
  );
}

function QuickStartContent({ proAccount }) {
  return (
    <>
      <PageMeta
        title="Bienvenue — Quick Start | Espace Pro"
        description="Découvrez en 30 secondes comment générer un pré-état daté avec l'IA Pre-etat-date.ai."
        noindex
      />

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-medium mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            Bienvenue {proAccount?.company_name || ''}
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            Votre espace pro est prêt
          </h1>
          <p className="text-secondary-500">
            En 30 secondes : voyez comment l'IA analyse un dossier de copropriété.
          </p>
        </div>

        <div className="aspect-video w-full rounded-xl overflow-hidden bg-secondary-900 border border-secondary-200 mb-8 relative">
          <video
            src="/videos/quick-start.mp4"
            poster="/videos/quick-start-poster.jpg"
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          >
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mb-3">
              <Upload className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-secondary-900 mb-1">
              1. Créez un dossier
            </h3>
            <p className="text-xs text-secondary-500">
              Renseignez le client et générez un lien d'upload personnalisé.
            </p>
          </div>

          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mb-3">
              <Sparkles className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-secondary-900 mb-1">
              2. L'IA analyse
            </h3>
            <p className="text-xs text-secondary-500">
              Gemini 2.5 Pro extrait charges, tantièmes, DPE et alertes en 5 min.
            </p>
          </div>

          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="w-9 h-9 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center mb-3">
              <Share2 className="h-4 w-4" />
            </div>
            <h3 className="text-sm font-semibold text-secondary-900 mb-1">
              3. Lien notaire
            </h3>
            <p className="text-xs text-secondary-500">
              Document conforme CSN, prêt à transmettre via lien sécurisé.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button asChild className="gap-1.5">
            <Link to="/pro">
              Aller au dashboard
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/pro/credits">Acheter mes premiers crédits</Link>
          </Button>
        </div>

        <p className="text-center text-xs text-secondary-400 mt-6">
          Astuce : partagez votre lien partenaire <code className="text-secondary-600">/vendre/{proAccount?.company_name?.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'votre-agence'}</code>
          {' '}pour attribuer automatiquement les ventes faites via vos clients.
        </p>
      </div>
    </>
  );
}
