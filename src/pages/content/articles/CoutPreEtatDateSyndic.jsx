import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, X } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function CoutPreEtatDateSyndic() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Coût du pré-état daté : syndic vs en ligne (comparatif 2026)"
        description="Comparatif des prix du pré-état daté en 2026 : tarifs syndic (200-600 EUR), services en ligne, et Pack Vendeur à 24,99 EUR. Économisez jusqu'à 93%."
        canonical="/guide/cout-pre-etat-date-syndic"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Coût du pré-état daté : syndic vs en ligne",
        description: "Combien coûte un pré-état daté ? Tarifs syndic (150-600 €) vs solutions en ligne.",
        slug: 'cout-pre-etat-date-syndic',
        datePublished: '2026-02-07',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Coût et tarifs' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Combien coûte un pré-état daté chez le syndic en 2026 ?',
          answer: 'En 2026, les syndics facturent entre 150 et 600 EUR TTC pour le pré-état daté. Les grands syndics nationaux (Foncia, Nexity, Citya) facturent 250 à 500 EUR, les syndics indépendants 150 à 400 EUR, et les syndics en ligne 100 à 300 EUR. Contrairement à l\'état daté (plafonné à 380 EUR), le prix du pré-état daté n\'est pas réglementé par la loi.',
        },
        {
          question: 'Peut-on faire son pré-état daté sans passer par le syndic ?',
          answer: 'Oui. Le Conseil Supérieur du Notariat (CSN) a confirmé que le vendeur peut établir le pré-état daté lui-même, sans recourir au syndic. Le vendeur peut le constituer à partir des documents en sa possession ou de ceux disponibles sur l\'extranet du syndic. Des services en ligne comme Pre-etat-date.ai proposent une génération automatisée par IA pour 24,99 EUR.',
        },
        {
          question: 'Quel est le service le moins cher pour obtenir un pré-état daté ?',
          answer: 'Le service le moins cher est Pre-etat-date.ai à 24,99 EUR TTC, soit 93 % moins cher que la moyenne des syndics (300+ EUR). Le document est généré en 5 minutes grâce à l\'analyse IA des documents de copropriété, conforme au modèle du Conseil Supérieur du Notariat et accepté par les notaires.',
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Coût et tarifs' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Coût du pré-état daté : syndic vs en ligne (comparatif 2026)
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-07">Mis à jour le 7 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            5 min de lecture
          </span>
        </div>

        {/* Key facts box — structured for AI citability */}
        <dl className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="contents">
            <dt className="font-semibold text-blue-900">Prix syndic</dt>
            <dd className="text-blue-800">150 à 600 € TTC (non plafonné)</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Prix Pre-etat-date.ai</dt>
            <dd className="text-blue-800">24,99 € TTC</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Économie</dt>
            <dd className="text-blue-800">Jusqu'à 93 %</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Délai syndic</dt>
            <dd className="text-blue-800">15 à 30 jours</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Délai en ligne</dt>
            <dd className="text-blue-800">5 minutes (analyse IA)</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">État daté (comparaison)</dt>
            <dd className="text-blue-800">Plafonné 380 € — syndic obligatoire</dd>
          </div>
        </dl>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté est un document indispensable pour vendre en copropriété, mais son coût
          peut varier énormément selon la méthode choisie. Syndic, service en ligne ou DIY : nous
          comparons les prix, les délais et les avantages de chaque option en 2026.
        </p>

        {/* Coût syndic */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le prix du pré-état daté chez le syndic
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Historiquement, les vendeurs se tournaient vers leur syndic de copropriété pour obtenir le
          pré-état daté. Le problème : contrairement à l'état daté (plafonné à 380 EUR TTC par le
          décret du 21 février 2020), le <strong>prix du pré-état daté n'est pas réglementé</strong>.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En pratique, les tarifs constatés chez les principaux syndics en 2026 sont les suivants :
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Type de syndic</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Fourchette de prix</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Délai moyen</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Grands syndics nationaux (Foncia, Nexity, Citya)</td>
                <td className="border border-secondary-200 px-4 py-3">250 à 500 EUR TTC</td>
                <td className="border border-secondary-200 px-4 py-3">15 à 30 jours</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Syndics de proximité / indépendants</td>
                <td className="border border-secondary-200 px-4 py-3">150 à 400 EUR TTC</td>
                <td className="border border-secondary-200 px-4 py-3">10 à 20 jours</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Syndics en ligne (Matera, Cotoit)</td>
                <td className="border border-secondary-200 px-4 py-3">100 à 300 EUR TTC</td>
                <td className="border border-secondary-200 px-4 py-3">7 à 15 jours</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          À ces tarifs s'ajoutent parfois des frais supplémentaires : frais de mise à jour des
          informations, frais d'envoi postal, frais de recherche d'archives pour les anciennes AG.
          La facture peut ainsi dépasser les 600 EUR dans certains cas.
        </p>

        {/* Coût services en ligne */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le prix des services en ligne
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Depuis la loi ALUR, plusieurs services en ligne proposent de générer le pré-état daté à
          un tarif réduit. Le Conseil Supérieur du Notariat a confirmé que le vendeur peut établir
          ce document sans passer par le syndic, ce qui a ouvert le marché à ces solutions
          alternatives.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Solution</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Prix</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Délai</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Méthode</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Services de saisie manuelle</td>
                <td className="border border-secondary-200 px-4 py-3">30 à 100 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">30 min à 2h</td>
                <td className="border border-secondary-200 px-4 py-3">Le vendeur saisit toutes les données manuellement</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Services avec analyse manuelle</td>
                <td className="border border-secondary-200 px-4 py-3">50 à 150 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">24 à 72h</td>
                <td className="border border-secondary-200 px-4 py-3">Un opérateur analyse les documents</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pack Vendeur (IA)</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">24,99 EUR</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 minutes</td>
                <td className="border border-secondary-200 px-4 py-3 text-primary-700">IA analyse automatiquement les documents</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* DIY */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          L'option gratuite : le faire soi-même
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Légalement, rien n'empêche le vendeur de constituer lui-même son pré-état daté. C'est
          gratuit, mais cela implique de :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Maîtriser le cadre juridique (articles L.721-2 et L.721-3 du CCH).</li>
          <li>Analyser les documents comptables de la copropriété pour extraire les bonnes données.</li>
          <li>Produire un document structuré et lisible, conforme aux attentes des notaires.</li>
          <li>Vérifier la cohérence des tantièmes, des charges et du budget prévisionnel.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette option est risquée pour un non-professionnel : une erreur dans les montants ou un
          oubli d'information obligatoire peut entraîner un retard de la vente, voire un contentieux
          avec l'acquéreur.
        </p>

        {/* Pourquoi Pack Vendeur */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi Pack Vendeur à 24,99 EUR ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pack Vendeur combine le meilleur des deux mondes : la rapidité et le prix du DIY, avec
          la fiabilité d'un service professionnel.
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>93% moins cher</strong> que le syndic (24,99 EUR vs 300+ EUR en moyenne)</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>5 minutes</strong> au lieu de 15 à 30 jours</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Analyse IA</strong> de vos documents (pas de saisie manuelle)</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Conforme modèle CSN</strong> accepté par les notaires</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Recoupement automatique</strong> des tantièmes et charges</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Lien de partage notaire</strong> inclus</span>
            </div>
          </div>
        </div>

        {/* Grand comparatif */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Tableau comparatif complet
        </h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Syndic</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">DIY</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-primary-700 bg-primary-50">Pack Vendeur</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Prix</td>
                <td className="border border-secondary-200 px-4 py-3">150-600 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Gratuit</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50 font-semibold text-primary-700">24,99 EUR</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Délai</td>
                <td className="border border-secondary-200 px-4 py-3">15-30 jours</td>
                <td className="border border-secondary-200 px-4 py-3">1-3 heures</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50 font-semibold text-primary-700">5 minutes</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Effort requis</td>
                <td className="border border-secondary-200 px-4 py-3">Aucun (le syndic fait tout)</td>
                <td className="border border-secondary-200 px-4 py-3">Très important</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50 text-primary-700">Minimal (upload + validation)</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Conformité</td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Oui</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><X className="h-4 w-4 text-red-500" /> Risque d'erreur</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Modele CSN</span>
                </td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Vérification des données</td>
                <td className="border border-secondary-200 px-4 py-3">Par le syndic</td>
                <td className="border border-secondary-200 px-4 py-3">Par le vendeur</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50 text-primary-700">IA + validation vendeur</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Partage notaire</td>
                <td className="border border-secondary-200 px-4 py-3">Papier / email</td>
                <td className="border border-secondary-200 px-4 py-3">À gérer soi-même</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Lien sécurisé inclus</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <RelatedArticles currentSlug="cout-pre-etat-date-syndic" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Économisez sur votre pré-état daté
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR au lieu de 300+ EUR chez le syndic. Résultat en 5 minutes.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Générer mon pré-état daté
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
