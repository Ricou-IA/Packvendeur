import { useParams, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const articles = {
  'quest-ce-pre-etat-date': lazy(() => import('./articles/QuEstCePreEtatDate')),
  'difference-pre-etat-date-etat-date': lazy(() => import('./articles/DifferencePreEtatDateEtatDate')),
  'documents-necessaires-vente': lazy(() => import('./articles/DocumentsNecessairesVente')),
  'cout-pre-etat-date-syndic': lazy(() => import('./articles/CoutPreEtatDateSyndic')),
  'loi-alur-copropriete': lazy(() => import('./articles/LoiAlurCopropriete')),
};

export default function BlogArticle() {
  const { slug } = useParams();
  const Article = articles[slug];

  if (!Article) return <Navigate to="/404" replace />;

  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto px-4 py-12 text-center text-secondary-500">
          Chargement...
        </div>
      }
    >
      <Article />
    </Suspense>
  );
}
