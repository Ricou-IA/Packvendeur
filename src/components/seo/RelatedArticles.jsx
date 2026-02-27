import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const ALL_ARTICLES = [
  { slug: 'quest-ce-pre-etat-date', title: "Qu'est-ce qu'un pré-état daté ?" },
  { slug: 'difference-pre-etat-date-etat-date', title: 'Pré-état daté vs état daté' },
  { slug: 'documents-necessaires-vente', title: 'Documents nécessaires pour la vente' },
  { slug: 'cout-pre-etat-date-syndic', title: 'Coût du pré-état daté chez le syndic' },
  { slug: 'loi-alur-copropriete', title: 'Loi ALUR et copropriété' },
  { slug: 'vendre-appartement-copropriete', title: 'Vendre un appartement en copropriété' },
  { slug: 'fiche-synthetique-copropriete', title: 'La fiche synthétique de copropriété' },
  { slug: 'tantiemes-copropriete-calcul', title: 'Tantièmes : calcul et répartition' },
  { slug: 'dpe-vente-appartement', title: "DPE et vente d'appartement" },
  { slug: 'compromis-vente-copropriete-documents', title: 'Documents pour le compromis de vente' },
];

export default function RelatedArticles({ currentSlug, max = 3 }) {
  const related = ALL_ARTICLES.filter((a) => a.slug !== currentSlug).slice(0, max);

  return (
    <nav className="mt-12 pt-8 border-t border-secondary-200">
      <h3 className="text-lg font-semibold text-secondary-900 mb-4">Articles liés</h3>
      <ul className="space-y-3">
        {related.map((article) => (
          <li key={article.slug}>
            <Link
              to={`/guide/${article.slug}`}
              className="flex items-center gap-2 text-primary-600 hover:text-primary-800 text-sm font-medium transition-colors"
            >
              <ArrowRight className="h-4 w-4 flex-shrink-0" />
              {article.title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
