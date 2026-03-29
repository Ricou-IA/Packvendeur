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
import PreEtatDateSansSyndic from './articles/PreEtatDateSansSyndic';
import PreEtatDateEnLigne from './articles/PreEtatDateEnLigne';
import PreEtatDateRapide from './articles/PreEtatDateRapide';
import PreEtatDateSimple from './articles/PreEtatDateSimple';
import PreEtatDateSeul from './articles/PreEtatDateSeul';
import ValiditePreEtatDate from './articles/ValiditePreEtatDate';
import SyndicRetardPreEtatDate from './articles/SyndicRetardPreEtatDate';
import PreEtatDateCoproHorizontale from './articles/PreEtatDateCoproHorizontale';
import PvAssembleeGenerale from './articles/PvAssembleeGenerale';
import CarnetEntretienCopropriete from './articles/CarnetEntretienCopropriete';
import DtgPptCopropriete from './articles/DtgPptCopropriete';
import EtatDateGuide from './articles/EtatDateGuide';
import ChargesVenteQuiPaie from './articles/ChargesVenteQuiPaie';
import TravauxVotesVenteQuiPaie from './articles/TravauxVotesVenteQuiPaie';
import FondsTravauxVente from './articles/FondsTravauxVente';

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
  'pre-etat-date-sans-syndic': PreEtatDateSansSyndic,
  'pre-etat-date-en-ligne': PreEtatDateEnLigne,
  'pre-etat-date-rapide': PreEtatDateRapide,
  'pre-etat-date-simple': PreEtatDateSimple,
  'pre-etat-date-seul': PreEtatDateSeul,
  'validite-pre-etat-date': ValiditePreEtatDate,
  'syndic-retard-pre-etat-date-recours': SyndicRetardPreEtatDate,
  'pre-etat-date-copropriete-horizontale': PreEtatDateCoproHorizontale,
  'pv-assemblee-generale-copropriete-vente': PvAssembleeGenerale,
  'carnet-entretien-copropriete': CarnetEntretienCopropriete,
  'dtg-ppt-copropriete-obligations': DtgPptCopropriete,
  'etat-date-definition-contenu-tarif': EtatDateGuide,
  'charges-copropriete-vente-qui-paie': ChargesVenteQuiPaie,
  'travaux-votes-vente-qui-paie': TravauxVotesVenteQuiPaie,
  'fonds-travaux-vente-copropriete': FondsTravauxVente,
};

export default function BlogArticleServer() {
  const { slug } = useParams();
  const Article = articles[slug];

  if (!Article) return <Navigate to="/404" replace />;

  return <Article />;
}
