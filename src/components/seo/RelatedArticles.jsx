import { Link } from 'react-router-dom';
import { ArrowRight, Briefcase, Clock, Shield } from 'lucide-react';

// Articles à forte valeur ajoutée juridique : on y affiche le bloc "Professionnels"
// pour capter notaires/agents en mode prescripteur.
const PRESCRIBER_TARGET_SLUGS = new Set([
  'loi-alur-copropriete',
  'documents-necessaires-vente',
  'compromis-vente-copropriete-documents',
  'qui-fait-le-pre-etat-date',
  'pre-etat-date-obligatoire',
  'comment-remplir-pre-etat-date',
  'syndic-retard-pre-etat-date-recours',
  'etat-date-definition-contenu-tarif',
  'travaux-votes-vente-qui-paie',
  'charges-copropriete-vente-qui-paie',
  'fonds-travaux-vente-copropriete',
  'pv-assemblee-generale-copropriete-vente',
  'fiche-synthetique-copropriete',
  'tantiemes-copropriete-calcul',
  'dtg-ppt-copropriete-obligations',
  'validite-pre-etat-date',
]);

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
  { slug: 'modele-pre-etat-date', title: 'Modèle de pré-état daté vierge gratuit (Word, PDF)' },
  { slug: 'pre-etat-date-obligatoire', title: 'Le pré-état daté est-il obligatoire ?' },
  { slug: 'comment-remplir-pre-etat-date', title: 'Comment remplir un pré-état daté soi-même' },
  { slug: 'remboursement-pre-etat-date', title: 'Remboursement du pré-état daté : vos droits' },
];

const TOP_CITIES = [
  { slug: 'paris', name: 'Paris' },
  { slug: 'lyon', name: 'Lyon' },
  { slug: 'marseille', name: 'Marseille' },
  { slug: 'toulouse', name: 'Toulouse' },
  { slug: 'nice', name: 'Nice' },
  { slug: 'bordeaux', name: 'Bordeaux' },
  { slug: 'nantes', name: 'Nantes' },
  { slug: 'lille', name: 'Lille' },
  { slug: 'montpellier', name: 'Montpellier' },
  { slug: 'strasbourg', name: 'Strasbourg' },
];

export default function RelatedArticles({ currentSlug, max = 3 }) {
  const related = ALL_ARTICLES.filter((a) => a.slug !== currentSlug).slice(0, max);
  const showPrescriberBlock = PRESCRIBER_TARGET_SLUGS.has(currentSlug);

  return (
    <nav className="mt-12 pt-8 border-t border-secondary-200">
      {showPrescriberBlock && (
        <aside className="mb-10 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 via-white to-primary-50 p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center flex-shrink-0">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-700">
                Pour les professionnels
              </p>
              <h3 className="text-lg font-semibold text-secondary-900 mt-0.5">
                Gagnez 3h par dossier
              </h3>
            </div>
          </div>
          <p className="text-sm text-secondary-600 leading-relaxed mb-4">
            Proposez Pre-etat-date.ai à vos clients vendeurs et suivez l'avancement
            en temps réel. Pré-état daté conforme au modèle CSN, lien notaire
            généré, facture TVA récupérable.
          </p>
          <ul className="space-y-1.5 mb-5 text-sm text-secondary-700">
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-indigo-600 flex-shrink-0" />
              5 minutes par dossier au lieu de 3 heures
            </li>
            <li className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-600 flex-shrink-0" />
              Conformité CSN + RGPD garantie
            </li>
            <li className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-600 flex-shrink-0" />
              Lien partenaire dédié à votre agence
            </li>
          </ul>
          <Link
            to="/pro/register"
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            Créer un compte Pro
            <ArrowRight className="h-4 w-4" />
          </Link>
        </aside>
      )}

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

      {/* City cross-links for SEO maillage */}
      <div className="mt-8 pt-6 border-t border-secondary-100">
        <h3 className="text-sm font-semibold text-secondary-700 mb-3">Pré-état daté par ville</h3>
        <div className="flex flex-wrap gap-2">
          {TOP_CITIES.map((city) => (
            <Link
              key={city.slug}
              to={`/pre-etat-date/${city.slug}`}
              className="text-xs bg-secondary-50 text-secondary-600 hover:bg-primary-50 hover:text-primary-700 px-3 py-1.5 rounded-full transition-colors"
            >
              {city.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Pro cross-link */}
      <div className="mt-6 pt-5 border-t border-secondary-100">
        <Link
          to="/professionnels"
          className="flex items-center gap-3 p-4 bg-indigo-50/50 border border-indigo-100 rounded-lg hover:bg-indigo-50 transition-colors group"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <ArrowRight className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <span className="text-sm font-semibold text-indigo-900 group-hover:text-indigo-700">Professionnels de l'immobilier ?</span>
            <p className="text-xs text-indigo-600/70">Espace Pro avec crédits dégressifs, kanban et liens d'upload client.</p>
          </div>
        </Link>
      </div>
    </nav>
  );
}
