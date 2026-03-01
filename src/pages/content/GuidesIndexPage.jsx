import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Clock, Calendar, TrendingUp, Flame } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema, guidesCollectionSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';

/** Format ISO date to French locale string, e.g. "15 février 2026" */
function formatDateFr(isoDate) {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Freshness badge: green if <30 days, blue if <90, grey otherwise */
function FreshnessBadge({ isoDate }) {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000);
  if (days <= 30) {
    return (
      <span className="px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
        Nouveau
      </span>
    );
  }
  if (days <= 90) {
    return (
      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
        Récent
      </span>
    );
  }
  return null;
}

const ARTICLES = [
  {
    slug: 'quest-ce-pre-etat-date',
    title: "Qu'est-ce qu'un pré-état daté ? Guide complet 2026",
    excerpt: "Définition, cadre légal (loi ALUR, art. L.721-2 CCH), contenu obligatoire et comment l'obtenir facilement.",
    category: 'Fondamentaux',
    readTime: '8 min',
    date: '2026-02-01',
  },
  {
    slug: 'difference-pre-etat-date-etat-date',
    title: 'Pré-état daté vs état daté : les 3 différences clés',
    excerpt: "Comprendre les différences entre le pré-état daté (avant compromis) et l'état daté du syndic (après compromis).",
    category: 'Fondamentaux',
    readTime: '6 min',
    date: '2026-02-03',
  },
  {
    slug: 'documents-necessaires-vente',
    title: 'Documents nécessaires pour la vente en copropriété',
    excerpt: 'La liste complète des documents à rassembler pour préparer la vente de votre lot de copropriété.',
    category: 'Pratique',
    readTime: '7 min',
    date: '2026-02-05',
  },
  {
    slug: 'cout-pre-etat-date-syndic',
    title: 'Coût du pré-état daté : syndic vs en ligne',
    excerpt: 'Combien coûte un pré-état daté ? Tarifs syndic (150-600 €) vs solutions en ligne (24,99 €).',
    category: 'Pratique',
    readTime: '5 min',
    date: '2026-02-07',
  },
  {
    slug: 'loi-alur-copropriete',
    title: 'Loi ALUR et copropriété : ce qui change pour la vente',
    excerpt: "Les obligations d'information imposées par la loi ALUR lors de la vente d'un lot de copropriété.",
    category: 'Juridique',
    readTime: '9 min',
    date: '2026-02-10',
  },
  {
    slug: 'vendre-appartement-copropriete',
    title: 'Vendre un appartement en copropriété : le guide complet',
    excerpt: 'Toutes les étapes de la vente en copropriété, du mandat au notaire en passant par le pré-état daté.',
    category: 'Pratique',
    readTime: '10 min',
    date: '2026-02-15',
  },
  {
    slug: 'fiche-synthetique-copropriete',
    title: 'La fiche synthétique de copropriété : tout savoir',
    excerpt: 'Contenu, obligation légale et utilité de la fiche synthétique dans le cadre de la vente.',
    category: 'Fondamentaux',
    readTime: '6 min',
    date: '2026-02-18',
  },
  {
    slug: 'tantiemes-copropriete-calcul',
    title: 'Tantièmes de copropriété : calcul et répartition des charges',
    excerpt: 'Comment sont calculés les tantièmes et leur rôle dans la répartition des charges de copropriété.',
    category: 'Technique',
    readTime: '7 min',
    date: '2026-02-20',
  },
  {
    slug: 'dpe-vente-appartement',
    title: "DPE et vente d'appartement : obligations et validité 2026",
    excerpt: 'Durée de validité du DPE, classes énergétiques, vérification ADEME et impact sur le prix de vente.',
    category: 'Diagnostics',
    readTime: '8 min',
    date: '2026-02-22',
  },
  {
    slug: 'compromis-vente-copropriete-documents',
    title: 'Documents obligatoires pour le compromis de vente en copropriété',
    excerpt: 'Liste complète des annexes obligatoires au compromis : diagnostics, documents copro, financier.',
    category: 'Juridique',
    readTime: '9 min',
    date: '2026-02-25',
  },
  {
    slug: 'charges-copropriete-evolution-syndic',
    title: 'Charges de copropriété : +50 % en 10 ans, les copropriétaires vaches à lait du syndic ?',
    excerpt: 'Analyse sourcée : charges +50 % vs inflation +28 %, honoraires syndic en hausse de +37 %, 68 % d\'anomalies DGCCRF.',
    category: 'Enquête',
    readTime: '12 min',
    date: '2026-02-27',
  },
];

const CATEGORIES = [...new Set(ARTICLES.map((a) => a.category))];

export default function GuidesIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <PageMeta
        title="Guides copropriété et vente — Articles et conseils"
        description="Tous nos guides sur la vente en copropriété : pré-état daté, loi ALUR, diagnostics, tantièmes, documents obligatoires. Conseils pratiques et juridiques."
        canonical="/guide"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Guides' },
        ])}
      />
      <JsonLd data={guidesCollectionSchema(ARTICLES)} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides' },
      ]} />

      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4">
          <BookOpen className="h-6 w-6 text-primary-600" />
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900">
            Guides et articles
          </h1>
        </div>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
          Tout ce que vous devez savoir sur la vente en copropriété, le pré-état daté
          et les obligations légales.
        </p>
      </div>

      {/* Featured article teaser */}
      <Link
        to="/guide/charges-copropriete-evolution-syndic"
        className="group block mb-10 relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 border border-red-200/60 hover:border-red-300 hover:shadow-lg transition-all duration-300"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-red-100/40 to-transparent rounded-full -translate-y-32 translate-x-32" />
        <div className="relative px-6 py-5 sm:px-8 sm:py-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 text-red-600">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded-full uppercase tracking-wide">
                <Flame className="h-3 w-3" />
                Enquête
              </span>
              <span className="text-xs text-secondary-400">12 min de lecture</span>
            </div>
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-secondary-900 group-hover:text-red-700 transition-colors leading-snug">
              Charges de copropriété : +50 % en 10 ans, qui en profite vraiment
            </h2>
            <p className="text-sm text-secondary-500 mt-1 line-clamp-2">
              Honoraires syndic, frais de mutation, enquête DGCCRF — données sourcées et courbe d'évolution sur 10 ans.
            </p>
          </div>
          <div className="flex-shrink-0 hidden sm:flex items-center gap-1 text-sm font-semibold text-red-600 group-hover:text-red-700">
            Lire l'enquête
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>

      {/* Category pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
        {CATEGORIES.map((cat) => (
          <span
            key={cat}
            className="px-3 py-1 bg-secondary-100 text-secondary-600 text-xs font-medium rounded-full"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Article grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTICLES.map((article) => (
          <Link
            key={article.slug}
            to={`/guide/${article.slug}`}
            className="group bg-white border border-secondary-200 rounded-xl p-6 hover:border-primary-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className="px-2 py-0.5 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                {article.category}
              </span>
              <FreshnessBadge isoDate={article.date} />
              <span className="flex items-center gap-1 text-xs text-secondary-400">
                <Clock className="h-3 w-3" />
                {article.readTime}
              </span>
            </div>
            <h2 className="text-base font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors mb-2 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-sm text-secondary-500 leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
            <div className="flex items-center justify-between mt-4">
              <span className="flex items-center gap-1 text-xs text-secondary-400">
                <Calendar className="h-3 w-3" />
                {formatDateFr(article.date)}
              </span>
              <span className="flex items-center gap-1 text-sm font-medium text-primary-600 group-hover:text-primary-700">
                Lire
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* CTA */}
      <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
          Prêt à générer votre pré-état daté ?
        </h2>
        <p className="text-secondary-500 mb-6">
          Tous vos documents analysés par IA en 5 minutes, pour seulement 24,99 €.
        </p>
        <Button asChild>
          <Link to="/dossier" className="gap-2">
            Commencer maintenant
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
