import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Gavel, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function TravauxVotesVenteQuiPaie() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Travaux votés avant la vente : qui paie, vendeur ou acheteur ?"
        description="Des travaux ont été votés en AG avant votre vente ? Qui doit payer : le vendeur ou l'acheteur ? Règle de l'exigibilité, cas pratiques et solutions."
        canonical="/guide/travaux-votes-vente-qui-paie"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Travaux votés avant la vente : qui paie, vendeur ou acheteur ?",
        description: "La question du paiement des travaux votés en AG lors d'une vente en copropriété. Règle de l'exigibilité de l'appel de fonds, cas pratiques et négociation dans le compromis.",
        slug: 'travaux-votes-vente-qui-paie',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Travaux votés et vente' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Peut-on négocier la prise en charge des travaux dans le compromis ?',
          answer: "Oui. La loi prévoit une répartition par défaut basée sur la date d'exigibilité de l'appel de fonds, mais les parties sont libres de convenir d'une répartition différente dans le compromis de vente. Par exemple, le vendeur peut accepter de prendre en charge des travaux dont l'appel n'est exigible qu'après la vente, en échange d'un prix de vente maintenu. Cette clause doit être rédigée clairement pour éviter tout litige.",
        },
        {
          question: 'Le vendeur peut-il refuser de payer des travaux votés avant la vente ?',
          answer: "Le vendeur ne peut pas refuser de payer les appels de fonds dont la date d'exigibilité est antérieure à la vente. Ces sommes sont dues au syndicat des copropriétaires et le notaire les retiendra sur le prix de vente si nécessaire. En revanche, si l'appel de fonds n'est exigible qu'après la vente, le vendeur n'a aucune obligation de payer, sauf accord contraire dans le compromis.",
        },
        {
          question: 'Le pré-état daté mentionne-t-il les travaux votés ?',
          answer: "Oui. Le pré-état daté, conforme au modèle du Conseil Supérieur du Notariat, mentionne les travaux votés en assemblée générale et non encore réalisés, ainsi que les montants des appels de fonds correspondants. Il indique également la quote-part du lot concerné. Ces informations permettent à l'acquéreur de connaître les dépenses à venir avant de signer le compromis.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Travaux votés et vente' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Travaux votés avant la vente : qui paie, vendeur ou acheteur ?
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-29">Mis à jour le 29 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            6 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Règle générale :</dt>
              <dd>C'est la date d'exigibilité de l'appel de fonds qui détermine le payeur</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Le vendeur paie si :</dt>
              <dd>L'appel de fonds est exigible avant la date de la vente</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">L'acheteur paie si :</dt>
              <dd>L'appel de fonds est exigible après la date de la vente</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Exception :</dt>
              <dd>Clause contractuelle différente dans le compromis de vente</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Pré-état daté :</dt>
              <dd>Liste les travaux votés non réalisés et les appels de fonds correspondants</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Vous vendez votre appartement en copropriété et des travaux importants ont été votés
          en assemblée générale ? La question du paiement est légitime : est-ce au vendeur ou
          à l'acheteur de régler la facture ? La réponse dépend d'un critère précis : la date
          d'exigibilité de l'appel de fonds.
        </p>

        {/* La règle légale */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La règle légale : la date d'exigibilité fait foi
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article 6-2 du décret du 17 mars 1967 pose un principe clair : le paiement des
          travaux est dû par celui qui est copropriétaire au moment où l'appel de fonds devient
          exigible. Ce n'est donc ni la date du vote en AG, ni la date de début des travaux qui
          compte, mais bien la date à laquelle le syndic appelle les fonds.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Concrètement, si des travaux de ravalement ont été votés en juin et que le premier
          appel de fonds est exigible en septembre, mais que vous vendez en août, c'est l'acheteur
          qui paiera cet appel. En revanche, si le premier appel était exigible en juillet (avant
          la vente), le vendeur en est redevable.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Tableau récapitulatif des situations
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Situation</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Qui paie</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Base légale</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Travaux votés ET appel exigible avant vente</td>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Vendeur</td>
                <td className="border border-secondary-200 px-4 py-3">Art. 6-2 décret 1967</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Travaux votés avant vente, appel exigible après</td>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Acheteur (sauf accord contraire)</td>
                <td className="border border-secondary-200 px-4 py-3">Art. 6-2 décret 1967</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Travaux votés après la vente</td>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Acheteur</td>
                <td className="border border-secondary-200 px-4 py-3">—</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Clause de répartition dans le compromis</td>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Selon l'accord entre les parties</td>
                <td className="border border-secondary-200 px-4 py-3">Liberté contractuelle</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Travaux urgents (art. 18 loi 1965)</td>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Propriétaire au moment de la décision</td>
                <td className="border border-secondary-200 px-4 py-3">Art. 18 loi 10 juillet 1965</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Exemples concrets */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Exemples concrets avec montants
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Gavel className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Ravalement de 120 000 € voté en mars, vente en juin</h3>
              <p className="text-sm text-secondary-600">
                Le syndic appelle les fonds en 3 échéances : avril, août et décembre. Le vendeur paie
                l'appel d'avril (exigible avant la vente). L'acheteur paie les appels d'août et décembre.
                Pour un lot ayant 50/1000 tantièmes, cela représente 2 000 € pour le vendeur et 4 000 €
                pour l'acheteur.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <Gavel className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Ascenseur à remplacer : 80 000 € votés en janvier, vente en février</h3>
              <p className="text-sm text-secondary-600">
                Le premier appel de fonds n'est exigible qu'en mai. Malgré le vote antérieur à la vente,
                l'acheteur paiera l'intégralité des appels. Le vendeur n'a aucune obligation de payer,
                sauf clause spécifique dans le compromis.
              </p>
            </div>
          </div>
        </div>

        {/* Négociation dans le compromis */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Négocier la répartition dans le compromis
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La règle de l'exigibilité n'est pas d'ordre public : les parties peuvent librement convenir
          d'une répartition différente dans le compromis de vente. C'est même fréquent lorsque des
          travaux importants sont en cours.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'acheteur peut négocier une baisse du prix de vente pour compenser les travaux à venir.
          Inversement, le vendeur peut accepter de prendre en charge certains appels postérieurs à
          la vente pour faciliter la transaction. Tout est question de négociation commerciale.
        </p>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Piège courant pour les vendeurs</h3>
            <p className="text-sm text-secondary-600">
              Certains vendeurs pensent pouvoir vendre avant le vote des travaux pour éviter de
              payer. Mais si les travaux sont votés entre le compromis et l'acte authentique, la
              situation se complique. Mieux vaut anticiper en préparant
              son <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté</Link> pour
              une transparence totale dès le compromis.
            </p>
          </div>
        </div>

        {/* Le pré-état daté révèle les travaux */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que le pré-état daté révèle sur les travaux
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté, conforme au modèle du Conseil Supérieur du Notariat, contient une
          section dédiée aux travaux votés non encore réalisés. On y trouve la description des
          travaux, le montant total voté, la quote-part du lot et l'échéancier des appels de
          fonds. Ces informations sont essentielles pour que l'acquéreur connaisse les dépenses
          à venir avant de s'engager.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          l'intelligence artificielle extrait automatiquement les travaux votés à partir de vos
          PV d'assemblées générales. Plus besoin de chercher manuellement dans chaque PV : l'IA
          identifie les résolutions de travaux et calcule votre quote-part en fonction de
          vos <Link to="/guide/tantiemes-copropriete-calcul" className="text-primary-600 hover:text-primary-800 font-medium">tantièmes</Link>.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Peut-on négocier la prise en charge des travaux dans le compromis ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. La répartition légale basée sur la date d'exigibilité peut être modifiée par
              accord entre les parties. Le compromis de vente peut prévoir que le vendeur prend
              en charge tout ou partie des travaux, ou inversement que l'acheteur les assume en
              échange d'un prix de vente réduit.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le vendeur peut-il refuser de payer des travaux votés avant la vente ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le vendeur ne peut pas refuser de payer les appels de fonds exigibles avant la vente.
              Le notaire retiendra ces sommes sur le prix de vente si nécessaire. En revanche,
              pour les appels exigibles après la vente, le vendeur n'a aucune obligation, même si
              les travaux ont été votés alors qu'il était encore propriétaire.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le pré-état daté mentionne-t-il les travaux votés ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. Le pré-état daté conforme au modèle CSN détaille les travaux votés en AG et non
              encore réalisés, avec les montants et la quote-part du lot. C'est une information
              essentielle pour l'acquéreur qui peut ainsi évaluer les dépenses à venir. Consultez
              notre guide sur
              les <Link to="/guide/charges-copropriete-vente-qui-paie" className="text-primary-600 hover:text-primary-800 font-medium">charges lors de la vente</Link> pour
              une vision complète.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="travaux-votes-vente-qui-paie" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Identifiez les travaux votés en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            L'IA extrait automatiquement les travaux de vos PV d'AG. 24,99 EUR.
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
