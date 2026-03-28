import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDatePasCher() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pre-etat date pas cher : comparatif des tarifs 2026"
        description="Comparez les tarifs du pre-etat date en 2026 : syndic (150-600 EUR), services en ligne (30-150 EUR), IA (24,99 EUR). Économisez jusqu'a 96 % sur votre dossier."
        canonical="/guide/pre-etat-date-pas-cher"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pre-etat date pas cher : comparatif des tarifs 2026",
        description: "Comparatif complet des prix du pre-etat date. Comment payer moins cher que le syndic tout en obtenant un document conforme.",
        slug: 'pre-etat-date-pas-cher',
        datePublished: '2026-03-28',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pre-etat date pas cher' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Quel est le prix le plus bas pour un pre-etat date en 2026 ?',
          answer: "Le prix le plus bas pour un pre-etat date professionnel en 2026 est de 24,99 EUR TTC sur Pre-etat-date.ai. Ce tarif inclut l'analyse IA des documents de copropriété, la génération du PDF conforme au modèle CSN et un lien de partage sécurisé pour le notaire. C'est 93 % moins cher que la moyenne des syndics (380 EUR selon l'étude ARC 2022).",
        },
        {
          question: 'Pourquoi le syndic facture-t-il si cher le pre-etat date ?',
          answer: "Contrairement à l'état daté (plafonné à 380 EUR TTC par décret), le prix du pre-etat date n'est pas réglementé. Les syndics appliquent des tarifs libres qui couvrent le traitement administratif manuel, la compilation des données comptables, la vérification juridique et leur marge. L'absence de plafond légal leur permet de facturer de 150 à plus de 600 EUR selon la complexité et le syndic.",
        },
        {
          question: 'Comment économiser sur le pre-etat date sans sacrifier la qualité ?',
          answer: "La meilleure façon d'économiser est d'utiliser un service en ligne basé sur l'IA. Pre-etat-date.ai génère un pre-etat date conforme au modèle CSN pour 24,99 EUR en 5 minutes, au lieu de 150 à 600 EUR chez le syndic en 15 à 30 jours. Le document est identique en contenu et en conformité, seul le mode de production diffère : l'IA analyse automatiquement les documents au lieu d'un traitement manuel.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pre-etat date pas cher' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pre-etat date pas cher : comparatif des tarifs 2026
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-28">Mis à jour le 28 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            7 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <dl className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="contents">
            <dt className="font-semibold text-blue-900">Prix syndic</dt>
            <dd className="text-blue-800">150 à 600 EUR TTC (non plafonné)</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Moyenne nationale syndic</dt>
            <dd className="text-blue-800">380 EUR (étude ARC 2022)</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Services en ligne (humain)</dt>
            <dd className="text-blue-800">30 à 150 EUR</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Pre-etat-date.ai</dt>
            <dd className="text-blue-800">24,99 EUR TTC</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Économie maximale</dt>
            <dd className="text-blue-800">Jusqu'à 96 % vs syndic le plus cher</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">État daté (comparaison)</dt>
            <dd className="text-blue-800">Plafonné 380 EUR, syndic obligatoire</dd>
          </div>
        </dl>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pre-etat date est un document obligatoire pour toute vente en copropriété, mais son
          coût peut varier de 0 a plus de 600 EUR selon la méthode choisie. Dans ce guide, nous
          comparons toutes les options pour vous aider à trouver la solution la moins chère
          sans compromettre la qualité ni la conformité du document.
        </p>

        {/* Full price comparison */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comparatif complet des prix en 2026
        </h2>
        <div className="overflow-x-auto mb-6">
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
                <td className="border border-secondary-200 px-4 py-3">Grand syndic national</td>
                <td className="border border-secondary-200 px-4 py-3">250 à 500 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">15-30 jours</td>
                <td className="border border-secondary-200 px-4 py-3">Traitement administratif</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Syndic indépendant</td>
                <td className="border border-secondary-200 px-4 py-3">150 à 400 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">10-20 jours</td>
                <td className="border border-secondary-200 px-4 py-3">Traitement administratif</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Syndic en ligne</td>
                <td className="border border-secondary-200 px-4 py-3">100 à 300 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">7-15 jours</td>
                <td className="border border-secondary-200 px-4 py-3">Traitement administratif</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Service en ligne (saisie manuelle)</td>
                <td className="border border-secondary-200 px-4 py-3">30 à 60 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">30 min à 2h</td>
                <td className="border border-secondary-200 px-4 py-3">Le vendeur saisit les données</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Service en ligne (humain)</td>
                <td className="border border-secondary-200 px-4 py-3">50 à 150 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">24-72h</td>
                <td className="border border-secondary-200 px-4 py-3">Un opérateur analyse les documents</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pre-etat-date.ai</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">24,99 EUR</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 minutes</td>
                <td className="border border-secondary-200 px-4 py-3 text-primary-700">Analyse automatique des documents</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Le faire soi-même</td>
                <td className="border border-secondary-200 px-4 py-3">Gratuit</td>
                <td className="border border-secondary-200 px-4 py-3">Plusieurs heures</td>
                <td className="border border-secondary-200 px-4 py-3">Compétences requises</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Why syndics charge so much */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le syndic facture-t-il si cher ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Contrairement à l'état daté (plafonné à 380 EUR TTC par le décret du 21 février 2020),
          le <strong>prix du pre-etat date n'est soumis a aucun plafond légal</strong>. Les syndics
          fixent librement leurs tarifs, ce qui explique les écarts considerables d'un syndic a
          l'autre.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Selon l'étude de l'Association des Responsables de Copropriete (ARC) de 2022, le
          coût moyen du pre-etat date chez le syndic est de <strong>380 EUR</strong>, avec des
          extrêmes allant de 150 EUR a plus de 600 EUR. A ces tarifs s'ajoutent parfois des frais
          supplémentaires : mise a jour des informations, frais d'envoi, recherche d'archives.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette tarification élevée s'explique par le traitement manuel : un gestionnaire doit
          compiler les données financières, juridiques et techniques à partir de différents
          systemes informatiques. Un processus qui prend du temps et mobilise du personnel qualifie.
          Pour un comparatif détaillé, consultez notre article
          sur le <Link to="/guide/cout-pre-etat-date-syndic" className="text-primary-600 hover:text-primary-800 font-medium">coût du pre-etat date chez le syndic</Link>.
        </p>

        {/* Savings */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Combien pouvez-vous économiser ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Voici le calcul de l'économie réalisée en choisissant Pre-etat-date.ai à 24,99 EUR
          par rapport aux différentes alternatives :
        </p>
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-green-700 mb-1">355 EUR</p>
            <p className="text-sm text-green-800 font-medium">d'économie vs syndic moyen</p>
            <p className="text-xs text-green-600 mt-1">380 EUR - 24,99 EUR = 355 EUR</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-green-700 mb-1">575 EUR</p>
            <p className="text-sm text-green-800 font-medium">d'économie vs syndic le plus cher</p>
            <p className="text-xs text-green-600 mt-1">600 EUR - 24,99 EUR = 575 EUR</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-3xl font-bold text-green-700 mb-1">93 %</p>
            <p className="text-sm text-green-800 font-medium">d'économie vs moyenne nationale</p>
            <p className="text-xs text-green-600 mt-1">Source : étude ARC 2022</p>
          </div>
        </div>

        {/* What you get for 24.99 */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que comprend le pre-etat date à 24,99 EUR ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour 24,99 EUR, vous obtenez exactement le même contenu que le document facturé 300 a
          600 EUR par le syndic :
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>PDF conforme au modèle CSN</strong> (Conseil Supérieur du Notariat)</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Donnees financières completes</strong> : charges, budget, tantièmes, impayées</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Informations juridiques</strong> : procedures, travaux votes, syndic</span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Diagnostics techniques</strong> : DPE, amiante, electricite, etc.</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Recoupement automatique</strong> des tantièmes et des charges</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span><strong>Lien de partage sécurisé</strong> pour transmettre au notaire</span>
            </div>
          </div>
        </div>

        {/* Free option warning */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          L'option gratuite : le faire soi-même
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Certes, il est possible de constituer son pre-etat date gratuitement en le faisant
          soi-même. Mais attention : cette option comporte des risques réels. Le vendeur doit
          maîtriser les articles L.721-2 et L.721-3 du CCH, analyser les documents comptables
          et produire un document conforme. Une erreur peut retarder la vente ou engager la
          responsabilité du vendeur. Pour en savoir plus, consultez notre guide
          sur le <Link to="/guide/pre-etat-date-gratuit" className="text-primary-600 hover:text-primary-800 font-medium">pre-etat date gratuit</Link>.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          A 24,99 EUR, Pre-etat-date.ai représente un compromis ideal entre le gratuit
          (risque) et le syndic (cher). C'est le prix d'un livre de poche pour un document
          qui sécurisé une transaction immobilière de plusieurs centaines de milliers d'euros.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quel est le prix le plus bas pour un pre-etat date en 2026 ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le prix le plus bas pour un pre-etat date professionnel est de 24,99 EUR TTC sur
              Pre-etat-date.ai. Ce tarif comprend l'analyse IA des documents, la génération du
              PDF conforme au modèle CSN et le lien de partage notaire. Seule l'option de le faire
              soi-même est gratuite, mais elle comporte des risques d'erreur significatifs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Pourquoi le syndic facture-t-il si cher le pre-etat date ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le prix du pre-etat date n'est pas réglementé (contrairement a l'état daté, plafonné
              à 380 EUR). Les syndics fixent librement leurs tarifs pour couvrir le traitement
              manuel, la compilation des données et leur marge. L'étude ARC 2022 révèle une
              moyenne nationale de 380 EUR, avec des extrêmes de 150 à 600 EUR.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Comment économiser sur le pre-etat date sans sacrifier la qualité ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Utilisez un service en ligne basé sur l'IA. Pre-etat-date.ai génère un document
              identique en contenu et en conformité a celui du syndic, pour 24,99 EUR au lieu de
              300+ EUR. L'IA analyse automatiquement vos documents de copropriété, ce qui
              élimine le traitement humain coûteux tout en maintenant la qualité.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-pas-cher" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Le pre-etat date le moins cher du marché
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR au lieu de 380 EUR en moyenne chez le syndic. Même contenu, même conformité.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Générer mon pre-etat date
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
