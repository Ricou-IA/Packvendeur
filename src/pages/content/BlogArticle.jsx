import { useParams, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

const articles = {
  'quest-ce-pre-etat-date': lazy(() => import('./articles/QuEstCePreEtatDate')),
  'difference-pre-etat-date-etat-date': lazy(() => import('./articles/DifferencePreEtatDateEtatDate')),
  'documents-necessaires-vente': lazy(() => import('./articles/DocumentsNecessairesVente')),
  'cout-pre-etat-date-syndic': lazy(() => import('./articles/CoutPreEtatDateSyndic')),
  'loi-alur-copropriete': lazy(() => import('./articles/LoiAlurCopropriete')),
  'vendre-appartement-copropriete': lazy(() => import('./articles/VendreAppartementCopropriete')),
  'fiche-synthetique-copropriete': lazy(() => import('./articles/FicheSynthetiqueCopropriete')),
  'tantiemes-copropriete-calcul': lazy(() => import('./articles/TantiemesCopropriete')),
  'dpe-vente-appartement': lazy(() => import('./articles/DpeVenteAppartement')),
  'compromis-vente-copropriete-documents': lazy(() => import('./articles/CompromisVenteDocuments')),
  'charges-copropriete-evolution-syndic': lazy(() => import('./articles/ChargesCoproprieteSyndic')),
  'pre-etat-date-urgent': lazy(() => import('./articles/PreEtatDateUrgent')),
  'pre-etat-date-pas-cher': lazy(() => import('./articles/PreEtatDatePasCher')),
  'pre-etat-date-gratuit': lazy(() => import('./articles/PreEtatDateGratuit')),
  'qui-fait-le-pre-etat-date': lazy(() => import('./articles/QuiFaitPreEtatDate')),
  'comparatif-pre-etat-date-en-ligne': lazy(() => import('./articles/ComparatifPreEtatDate')),
  'pre-etat-date-sans-syndic': lazy(() => import('./articles/PreEtatDateSansSyndic')),
  'pre-etat-date-en-ligne': lazy(() => import('./articles/PreEtatDateEnLigne')),
  'pre-etat-date-rapide': lazy(() => import('./articles/PreEtatDateRapide')),
  'pre-etat-date-simple': lazy(() => import('./articles/PreEtatDateSimple')),
  'pre-etat-date-seul': lazy(() => import('./articles/PreEtatDateSeul')),
  'validite-pre-etat-date': lazy(() => import('./articles/ValiditePreEtatDate')),
  'syndic-retard-pre-etat-date-recours': lazy(() => import('./articles/SyndicRetardPreEtatDate')),
  'pre-etat-date-copropriete-horizontale': lazy(() => import('./articles/PreEtatDateCoproHorizontale')),
  'pv-assemblee-generale-copropriete-vente': lazy(() => import('./articles/PvAssembleeGenerale')),
  'carnet-entretien-copropriete': lazy(() => import('./articles/CarnetEntretienCopropriete')),
  'dtg-ppt-copropriete-obligations': lazy(() => import('./articles/DtgPptCopropriete')),
  'etat-date-definition-contenu-tarif': lazy(() => import('./articles/EtatDateGuide')),
  'charges-copropriete-vente-qui-paie': lazy(() => import('./articles/ChargesVenteQuiPaie')),
  'travaux-votes-vente-qui-paie': lazy(() => import('./articles/TravauxVotesVenteQuiPaie')),
  'fonds-travaux-vente-copropriete': lazy(() => import('./articles/FondsTravauxVente')),
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
