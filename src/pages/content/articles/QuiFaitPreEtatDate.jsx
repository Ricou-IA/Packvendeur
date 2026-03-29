import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, X, Scale } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function QuiFaitPreEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Qui fait le pré-état daté ? Vendeur, syndic ou IA"
        description="Le vendeur peut faire le pré-état daté lui-même (confirmé par le CSN). Comparez les 3 options : syndic (150-600 EUR), DIY (gratuit), IA (24,99 EUR, 5 min)."
        canonical="/guide/qui-fait-le-pre-etat-date"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Qui fait le pré-état daté ? Vendeur, syndic ou IA",
        description: "Analyse juridique : qui doit fournir le pré-état daté ? Le vendeur peut-il le faire sans le syndic ? Position du CSN et article L.721-2 CCH.",
        slug: 'qui-fait-le-pre-etat-date',
        datePublished: '2026-03-28',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Qui fait le pré-état daté ?' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Le vendeur peut-il faire le pré-état daté lui-même ?',
          answer: "Oui. Le Conseil Supérieur du Notariat (CSN) a confirmé que le vendeur peut établir le pré-état daté lui-même, sans recourir au syndic. L'article L.721-2 du Code de la Construction et de l'Habitation impose au vendeur de fournir les informations, mais ne désigne pas le syndic comme seul habilité à les compiler. Le vendeur peut utiliser les documents en sa possession ou ceux disponibles sur l'extranet du syndic.",
        },
        {
          question: 'Le syndic est-il obligatoire pour le pré-état daté ?',
          answer: "Non. Le syndic n'est obligatoire que pour l'état daté (article 10-1 de la loi du 10 juillet 1965), qui est un document différent fourni au moment de la vente définitive. Le pré-état daté, requis dès la promesse de vente, peut être établi par le vendeur, par un professionnel de son choix ou par un service en ligne. Le syndic reste une option mais n'est pas un passage obligé.",
        },
        {
          question: 'Quelle est la différence entre pré-état daté et état daté ?',
          answer: "Le pré-état daté est fourni par le vendeur au moment de la promesse ou du compromis de vente. L'état daté est un document distinct, obligatoirement établi par le syndic, fourni au moment de la vente définitive (acte authentique). L'état daté est plafonné à 380 EUR TTC par décret, alors que le pré-état daté n'a pas de plafond tarifaire. Les deux documents couvrent des informations similaires mais à des étapes différentes de la transaction.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Qui fait le pré-état daté ?' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Qui fait le pré-état daté ? Vendeur, syndic ou IA
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-28">Mis à jour le 28 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            7 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Qui doit le fournir :</dt>
              <dd>Le vendeur (obligation légale art. L.721-2 CCH)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Syndic obligatoire :</dt>
              <dd>Non — le CSN confirme que le vendeur n'est pas obligé de passer par le syndic</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">3 options :</dt>
              <dd>Syndic (150-600 EUR), vendeur DIY (gratuit), Pre-etat-date.ai (24,99 EUR)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">À ne pas confondre :</dt>
              <dd>L'état daté (syndic obligatoire, 380 EUR max) est un document différent</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Quand le fournir :</dt>
              <dd>Avant la signature du compromis ou de la promesse de vente</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est l'une des questions les plus fréquentes lors d'une vente en copropriété : qui
          est censé fournir le pré-état daté ? Le vendeur, le syndic, le notaire ? La réponse
          est plus simple qu'il n'y paraît, et elle ouvre des possibilités que beaucoup de
          vendeurs ignorent.
        </p>

        {/* Legal framework */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que dit la loi : article L.721-2 du CCH
        </h2>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <Scale className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-secondary-700">
            <strong>Article L.721-2 du Code de la Construction et de l'Habitation :</strong> le
            vendeur doit fournir à l'acquéreur, dès la promesse de vente, un ensemble d'informations
            relatives à l'organisation de la copropriété, à la situation financière du copropriétaire
            vendeur et de la copropriété, et à l'état du bâtiment.
          </p>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR du 24 mars 2014</Link> a
          créé cette obligation d'information. Le point essentiel : c'est le <strong>vendeur</strong> qui
          est débiteur de cette obligation, pas le syndic. La loi ne désigne pas le syndic comme
          seul habilité à constituer ce document.
        </p>

        {/* CSN position */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La position du Conseil Supérieur du Notariat (CSN)
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le CSN a clarifié cette question en publiant un modèle de référence pour le pre-etat
          date. Cette publication confirme implicitement que le vendeur peut constituer ce
          document lui-même, à condition de rassembler les informations requises à partir des
          documents de copropriété en sa possession.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Concrètement, le vendeur dispose généralement de la plupart des documents nécessaires :
          PV d'assemblée générale, appels de fonds, relevés de charges, fiche synthétique
          (disponible sur l'extranet du syndic), diagnostics immobiliers. Il peut donc compiler
          ces informations sans solliciter le syndic.
        </p>

        {/* 3 options compared */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 3 options pour obtenir son pré-état daté
        </h2>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-3">
          Option 1 : Demander au syndic
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Le syndic a accès à toutes les données comptables</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Aucun effort de la part du vendeur</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Coût élevé : 150 à 600 EUR (non plafonné)</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Délai long : 15 à 30 jours en moyenne</span>
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est l'option historique et la plus connue, mais aussi la plus coûteuse. Contrairement
          à l'état daté (plafonné à 380 EUR), le prix du pré-état daté n'est pas réglementé.
          Les syndics profitent souvent de cette absence de plafond pour facturer des tarifs
          élevés. Consultez notre article sur
          le <Link to="/guide/cout-pre-etat-date-syndic" className="text-primary-600 hover:text-primary-800 font-medium">coût du pré-état daté chez le syndic</Link> pour
          les tarifs détaillés.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-3">
          Option 2 : Le remplir manuellement (modèle gratuit)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Totalement gratuit</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Le vendeur garde le contrôle</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Complexe : 60+ données financières à extraire</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Risque d'erreur et de rejet par le notaire</span>
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Légalement possible, mais concrètement difficile pour un non-professionnel. Le vendeur
          doit analyser les documents comptables, identifier les bons montants, vérifier la
          cohérence des tantièmes et produire un document conforme. Pour en savoir plus sur les
          risques, consultez notre guide sur
          le <Link to="/guide/pre-etat-date-gratuit" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté gratuit</Link>.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-3">
          Option 3 : Utiliser un Pre-etat-date.ai (Pre-etat-date.ai)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Rapide : 5 minutes au lieu de 15-30 jours</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Économique : 24,99 EUR au lieu de 150-600 EUR</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Conforme au modèle CSN</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Recoupement automatique des données</span>
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'intelligence artificielle analyse automatiquement les documents de copropriété pour
          extraire les données financières, juridiques et techniques. Le vendeur dépose ses
          PDF, valide les informations extraites et obtient un document conforme en quelques
          minutes. C'est le meilleur équilibre entre coût, rapidité et fiabilité.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Tableau récapitulatif
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Syndic</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Vendeur DIY</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-primary-700 bg-primary-50">Pre-etat-date.ai</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Qui réalise ?</td>
                <td className="border border-secondary-200 px-4 py-3">Le gestionnaire du syndic</td>
                <td className="border border-secondary-200 px-4 py-3">Le vendeur seul</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 text-primary-700">Pre-etat-date.ai + validation vendeur</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Prix</td>
                <td className="border border-secondary-200 px-4 py-3">150-600 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Gratuit</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 font-semibold text-primary-700">24,99 EUR</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Délai</td>
                <td className="border border-secondary-200 px-4 py-3">15-30 jours</td>
                <td className="border border-secondary-200 px-4 py-3">2-5 heures</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 font-semibold text-primary-700">5 minutes</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Fiabilité</td>
                <td className="border border-secondary-200 px-4 py-3">Élevée</td>
                <td className="border border-secondary-200 px-4 py-3">Variable (risque d'erreur)</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 text-primary-700">Élevée (recoupement IA)</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Base légale</td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Oui</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Oui (CSN)</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Oui (CSN)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pré-état daté vs état daté */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Attention : ne confondez pas pré-état daté et état daté
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est une confusion fréquente. Le <strong>pré-état daté</strong> et
          l'<strong>état daté</strong> sont deux documents distincts :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            Le <strong>pré-état daté</strong> est fourni par le vendeur au moment du compromis.
            Un service en ligne comme Pre-etat-date.ai automatise sa création à partir des PDF du vendeur.
          </li>
          <li>
            L'<strong>état daté</strong> est établi obligatoirement par le syndic au moment de la
            vente définitive (acte authentique). Son prix est plafonné à 380 EUR TTC.
          </li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour une comparaison détaillée, consultez notre article sur
          la <Link to="/guide/difference-pre-etat-date-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">différence entre pré-état daté et état daté</Link>.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le vendeur peut-il faire le pré-état daté lui-même ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. Le CSN a confirmé que le vendeur peut établir le pré-état daté sans recourir
              au syndic. L'article L.721-2 du CCH impose au vendeur de fournir les informations,
              mais ne désigne pas le syndic comme seul prestataire. Le vendeur peut utiliser ses
              propres documents ou un service en ligne comme Pre-etat-date.ai.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le syndic est-il obligatoire pour le pré-état daté ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Le syndic est obligatoire uniquement pour l'état daté (art. 10-1 loi du
              10 juillet 1965). Pour le pré-état daté, le vendeur choisit librement comment
              le constituer. Le recours au syndic reste une option parmi d'autres.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quelle est la différence entre pré-état daté et état daté ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le pré-état daté est fourni au compromis et peut être généré automatiquement via un service en ligne.
              L'état daté est fourni à l'acte authentique et doit être établi par le syndic
              (plafonné à 380 EUR). Les deux couvrent des informations similaires mais à des
              moments différents de la vente. Consultez notre <Link to="/faq" className="text-primary-600 hover:text-primary-800 font-medium">FAQ</Link> pour
              plus de précisions.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="qui-fait-le-pre-etat-date" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Votre pré-état daté prêt en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR, conforme CSN, prêt en 5 minutes. Pas besoin d'attendre le syndic.
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
