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
  { slug: 'charges-copropriete-evolution-syndic', title: 'Charges de copropriété : +50 % en 10 ans' },
  { slug: 'pre-etat-date-urgent', title: 'Pré-état daté urgent : obtenez-le en 5 minutes' },
  { slug: 'pre-etat-date-pas-cher', title: 'Pré-état daté pas cher : comparatif des tarifs' },
  { slug: 'pre-etat-date-gratuit', title: 'Pré-état daté gratuit : modèle et alternatives' },
  { slug: 'qui-fait-le-pre-etat-date', title: 'Qui fait le pré-état daté ?' },
  { slug: 'comparatif-pre-etat-date-en-ligne', title: 'Comparatif pré-état daté en ligne' },
  { slug: 'pre-etat-date-sans-syndic', title: 'Pré-état daté sans syndic : comment éviter les frais' },
  { slug: 'pre-etat-date-en-ligne', title: 'Pré-état daté en ligne : le guide complet 2026' },
  { slug: 'pre-etat-date-rapide', title: 'Pré-état daté rapide : prêt en 5 minutes par IA' },
  { slug: 'pre-etat-date-simple', title: 'Pré-état daté simple : comment le faire facilement' },
  { slug: 'pre-etat-date-seul', title: "Faire son pré-état daté seul : c'est légal et simple" },
  { slug: 'validite-pre-etat-date', title: 'Validité du pré-état daté : combien de temps ?' },
  { slug: 'syndic-retard-pre-etat-date-recours', title: 'Syndic en retard : vos recours' },
  { slug: 'pre-etat-date-copropriete-horizontale', title: 'Pré-état daté en copropriété horizontale' },
  { slug: 'pv-assemblee-generale-copropriete-vente', title: "PV d'assemblée générale : pourquoi les 3 derniers sont essentiels" },
  { slug: 'carnet-entretien-copropriete', title: "Carnet d'entretien de copropriété : contenu et obligations" },
  { slug: 'dtg-ppt-copropriete-obligations', title: 'DTG et Plan Pluriannuel de Travaux (PPT) : obligations 2026' },
  { slug: 'etat-date-definition-contenu-tarif', title: 'État daté : définition, contenu et tarif plafonné à 380 €' },
  { slug: 'charges-copropriete-vente-qui-paie', title: 'Charges de copropriété lors d\'une vente : qui paie quoi ?' },
  { slug: 'travaux-votes-vente-qui-paie', title: 'Travaux votés avant la vente : qui paie ?' },
  { slug: 'fonds-travaux-vente-copropriete', title: 'Fonds de travaux : que devient-il lors de la vente ?' },
  { slug: 'modele-pre-etat-date', title: 'Modèle de pré-état daté : formulaire vierge et exemple' },
  { slug: 'pre-etat-date-obligatoire', title: 'Le pré-état daté est-il obligatoire ?' },
  { slug: 'comment-remplir-pre-etat-date', title: 'Comment remplir un pré-état daté soi-même' },
  { slug: 'remboursement-pre-etat-date', title: 'Remboursement du pré-état daté : vos droits' },
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
