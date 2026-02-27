import { Link } from 'react-router-dom';
import { Home, HelpCircle, BookOpen, FileText, ArrowRight, MessageCircle } from 'lucide-react';
import PageMeta from '@components/seo/PageMeta';

const LINKS = [
  { to: '/', icon: Home, label: 'Accueil' },
  { to: '/comment-ca-marche', icon: HelpCircle, label: 'Comment ca marche' },
  { to: '/faq', icon: MessageCircle, label: 'FAQ' },
  { to: '/guide', icon: BookOpen, label: 'Guides' },
  { to: '/glossaire', icon: FileText, label: 'Glossaire' },
  { to: '/dossier', icon: ArrowRight, label: 'Commencer' },
];

export default function NotFoundPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <PageMeta
        title="Page introuvable"
        noindex={true}
      />

      <div className="text-center mb-12">
        <p className="text-7xl font-bold text-secondary-200 mb-4">404</p>
        <h1 className="text-2xl font-bold text-secondary-900 mb-3">Page introuvable</h1>
        <p className="text-secondary-500 max-w-lg mx-auto">
          La page que vous recherchez n'existe pas ou a ete deplacee.
          Voici quelques pages qui pourraient vous aider :
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {LINKS.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col items-center gap-3 p-6 rounded-lg border border-secondary-200 bg-white hover:border-primary-300 hover:shadow-md transition-all text-center group"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
              <Icon className="h-5 w-5 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-secondary-700 group-hover:text-primary-600 transition-colors">
              {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
