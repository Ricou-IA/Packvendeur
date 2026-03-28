/**
 * Server-side version of BlogArticle with eager imports (no React.lazy).
 * Used only by entry-server.jsx for pre-rendering.
 * The client-side BlogArticle.jsx remains unchanged.
 */
import { useParams, Navigate } from 'react-router-dom';

// Eager imports for SSR (renderToString doesn't support React.lazy)
import QuEstCePreEtatDate from './articles/QuEstCePreEtatDate';
import DifferencePreEtatDateEtatDate from './articles/DifferencePreEtatDateEtatDate';
import DocumentsNecessairesVente from './articles/DocumentsNecessairesVente';
import CoutPreEtatDateSyndic from './articles/CoutPreEtatDateSyndic';
import LoiAlurCopropriete from './articles/LoiAlurCopropriete';
import VendreAppartementCopropriete from './articles/VendreAppartementCopropriete';
import FicheSynthetiqueCopropriete from './articles/FicheSynthetiqueCopropriete';
import TantiemesCopropriete from './articles/TantiemesCopropriete';
import DpeVenteAppartement from './articles/DpeVenteAppartement';
import CompromisVenteDocuments from './articles/CompromisVenteDocuments';
import ChargesCoproprieteSyndic from './articles/ChargesCoproprieteSyndic';
import PreEtatDateUrgent from './articles/PreEtatDateUrgent';
import PreEtatDatePasCher from './articles/PreEtatDatePasCher';
import PreEtatDateGratuit from './articles/PreEtatDateGratuit';
import QuiFaitPreEtatDate from './articles/QuiFaitPreEtatDate';
import ComparatifPreEtatDate from './articles/ComparatifPreEtatDate';

const articles = {
  'quest-ce-pre-etat-date': QuEstCePreEtatDate,
  'difference-pre-etat-date-etat-date': DifferencePreEtatDateEtatDate,
  'documents-necessaires-vente': DocumentsNecessairesVente,
  'cout-pre-etat-date-syndic': CoutPreEtatDateSyndic,
  'loi-alur-copropriete': LoiAlurCopropriete,
  'vendre-appartement-copropriete': VendreAppartementCopropriete,
  'fiche-synthetique-copropriete': FicheSynthetiqueCopropriete,
  'tantiemes-copropriete-calcul': TantiemesCopropriete,
  'dpe-vente-appartement': DpeVenteAppartement,
  'compromis-vente-copropriete-documents': CompromisVenteDocuments,
  'charges-copropriete-evolution-syndic': ChargesCoproprieteSyndic,
  'pre-etat-date-urgent': PreEtatDateUrgent,
  'pre-etat-date-pas-cher': PreEtatDatePasCher,
  'pre-etat-date-gratuit': PreEtatDateGratuit,
  'qui-fait-le-pre-etat-date': QuiFaitPreEtatDate,
  'comparatif-pre-etat-date-en-ligne': ComparatifPreEtatDate,
};

export default function BlogArticleServer() {
  const { slug } = useParams();
  const Article = articles[slug];

  if (!Article) return <Navigate to="/404" replace />;

  return <Article />;
}
