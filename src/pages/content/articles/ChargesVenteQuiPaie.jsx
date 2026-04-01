import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Calculator, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function ChargesVenteQuiPaie() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Charges de copropriété lors d'une vente : qui paie quoi ?"
        description="Lors d'une vente en copropriété, qui paie les charges : le vendeur ou l'acheteur ? Prorata, provisions, régularisation, travaux votés. Guide complet."
        canonical="/guide/charges-copropriete-vente-qui-paie"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Charges de copropriété lors d'une vente : qui paie quoi ?",
        description: "Lors d'une vente en copropriété, la répartition des charges entre vendeur et acheteur obéit à des règles précises. Prorata temporis, régularisation, travaux votés, fonds de travaux.",
        slug: 'charges-copropriete-vente-qui-paie',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Charges de copropriété et vente' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Comment sont réparties les charges entre vendeur et acheteur ?',
          answer: "Les charges courantes de copropriété sont réparties au prorata temporis, c'est-à-dire en fonction du nombre de jours de propriété de chacun. Le vendeur paie les provisions correspondant à sa période de propriété, l'acheteur prend le relais à compter de la date de la vente. Le notaire effectue ce calcul lors de la signature de l'acte authentique. Les provisions déjà appelées sont ajustées entre les parties.",
        },
        {
          question: 'Le vendeur doit-il payer des travaux votés après la vente ?',
          answer: "Non. Le vendeur n'a pas à payer les travaux votés en assemblée générale après la date de la vente. La règle est celle de la date d'exigibilité de l'appel de fonds : si l'appel est exigible avant la vente, c'est le vendeur qui paie ; si l'appel est exigible après, c'est l'acheteur. Toutefois, une clause du compromis de vente peut prévoir une répartition différente entre les parties.",
        },
        {
          question: 'Les provisions versées au fonds de travaux sont-elles remboursées au vendeur ?',
          answer: "Non. L'article 14-2 de la loi du 10 juillet 1965 prévoit que les cotisations au fonds de travaux sont définitivement acquises au syndicat des copropriétaires. Elles sont rattachées au lot, pas à la personne. Lors de la vente, le solde du fonds de travaux est automatiquement transféré à l'acquéreur avec le lot. Le vendeur ne peut donc pas demander le remboursement des sommes versées.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Charges de copropriété et vente' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Charges de copropriété lors d'une vente : qui paie quoi ?
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-29">Mis à jour le 29 mars 2026</time>
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
              <dt className="font-semibold min-w-[160px]">Principe :</dt>
              <dd>Prorata temporis à la date de la vente</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Charges courantes :</dt>
              <dd>Réparties au jour le jour entre vendeur et acheteur</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Charges exceptionnelles :</dt>
              <dd>Celui qui est propriétaire au moment de l'appel de fonds</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Fonds de travaux :</dt>
              <dd>Non remboursable au vendeur, transféré automatiquement</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Impayés :</dt>
              <dd>Retenus sur le prix de vente par le notaire</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          La répartition des charges de copropriété lors d'une vente est une source fréquente
          d'incompréhension entre vendeur et acheteur. Qui paie les provisions trimestrielles ?
          Qui règle les travaux votés avant la vente mais appelés après ? Comment le notaire
          effectue-t-il le calcul ? Ce guide détaille les règles applicables.
        </p>

        {/* Le principe du prorata */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le principe du prorata temporis
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les charges courantes de copropriété (entretien des parties communes, ménage, assurance,
          eau, ascenseur) sont réparties entre le vendeur et l'acheteur au prorata du nombre de
          jours de propriété. Si la vente est signée le 15 mars, le vendeur paie les charges du
          1er janvier au 14 mars, et l'acheteur du 15 mars au 31 décembre.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le notaire effectue ce calcul lors de la signature de l'acte authentique. Les provisions
          trimestrielles déjà appelées sont ajustées : si le vendeur a payé le trimestre entier, il
          récupère la part correspondant à la période postérieure à la vente.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Tableau récapitulatif : qui paie quoi ?
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Type de charge</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Qui paie</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Moment de la répartition</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Charges courantes (provisions)</td>
                <td className="border border-secondary-200 px-4 py-3">Prorata vendeur/acheteur</td>
                <td className="border border-secondary-200 px-4 py-3">Date de la vente</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Régularisation annuelle</td>
                <td className="border border-secondary-200 px-4 py-3">Celui qui est propriétaire au vote des comptes</td>
                <td className="border border-secondary-200 px-4 py-3">AG d'approbation</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Travaux votés avant la vente</td>
                <td className="border border-secondary-200 px-4 py-3">Vendeur (si appel exigible avant vente)</td>
                <td className="border border-secondary-200 px-4 py-3">Date d'exigibilité de l'appel</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Travaux votés après la vente</td>
                <td className="border border-secondary-200 px-4 py-3">Acheteur</td>
                <td className="border border-secondary-200 px-4 py-3">Date du vote en AG</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Fonds de travaux</td>
                <td className="border border-secondary-200 px-4 py-3">Rattaché au lot (non remboursable)</td>
                <td className="border border-secondary-200 px-4 py-3">Transfert automatique</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Impayés du vendeur</td>
                <td className="border border-secondary-200 px-4 py-3">Retenus sur le prix de vente</td>
                <td className="border border-secondary-200 px-4 py-3">Jour de la vente</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Cas pratiques */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Cas pratiques courants
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Travaux votés mais pas encore appelés</h3>
              <p className="text-sm text-secondary-600">
                Des travaux de ravalement ont été votés en AG avant la vente, mais l'appel de fonds
                n'est exigible qu'après la date de vente. C'est l'acheteur qui paiera, sauf clause
                contraire dans le compromis. Pour en savoir plus, consultez notre guide sur
                les <Link to="/guide/travaux-votes-vente-qui-paie" className="text-primary-600 hover:text-primary-800 font-medium">travaux votés et la vente</Link>.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Régularisation qui tombe après la vente</h3>
              <p className="text-sm text-secondary-600">
                L'AG approuve les comptes en juin, mais la vente a eu lieu en mars. La régularisation
                (trop-perçu ou complément) concerne celui qui était propriétaire pendant l'exercice.
                Le notaire prévoit généralement une clause de répartition dans l'acte.
              </p>
            </div>
          </div>
        </div>

        {/* Rôle du pré-état daté */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le rôle du pré-état daté pour anticiper la répartition
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté</Link> est
          le meilleur outil pour anticiper la répartition des charges. Il détaille le budget
          prévisionnel, les charges courantes du lot, les impayés éventuels, le solde du fonds de
          travaux et les <Link to="/guide/travaux-votes-vente-qui-paie" className="text-primary-600 hover:text-primary-800 font-medium">travaux votés non encore réalisés</Link>.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En disposant de ces informations avant le compromis, le vendeur et l'acheteur peuvent
          négocier en toute transparence. Le notaire utilise ensuite ces données pour calculer le
          prorata exact dans l'acte authentique. Plus les chiffres sont fiables, moins il y a de
          risques de litige après la vente.
        </p>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <Calculator className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Calcul automatique des charges</h3>
            <p className="text-sm text-secondary-600">
              Pre-etat-date.ai calcule automatiquement les charges de votre lot à partir des
              <Link to="/guide/tantiemes-copropriete-calcul" className="text-primary-600 hover:text-primary-800 font-medium ml-1">tantièmes</Link> et
              du budget prévisionnel. Le résultat est croisé avec les données extraites de vos
              documents pour détecter toute incohérence.
            </p>
          </div>
        </div>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Comment sont réparties les charges entre vendeur et acheteur ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Les charges courantes sont réparties au prorata temporis. Le vendeur paie pour sa
              période de propriété, l'acheteur pour la sienne. Le notaire ajuste les provisions
              déjà versées lors de la signature de l'acte authentique. Les charges exceptionnelles
              suivent la règle de la date d'exigibilité de l'appel de fonds.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le vendeur doit-il payer des travaux votés après la vente ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Le vendeur ne paie que les appels de fonds dont la date d'exigibilité est
              antérieure à la date de vente. Les travaux votés en AG après la vente sont intégralement
              à la charge de l'acheteur. Consultez notre guide détaillé sur
              les <Link to="/guide/travaux-votes-vente-qui-paie" className="text-primary-600 hover:text-primary-800 font-medium">travaux votés lors de la vente</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Les provisions versées au fonds de travaux sont-elles remboursées au vendeur ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Le <Link to="/guide/fonds-travaux-vente-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">fonds de travaux</Link> est
              rattaché au lot, pas au copropriétaire. Les cotisations sont définitivement acquises
              au syndicat (article 14-2 de la loi du 10 juillet 1965). Le solde est transféré
              automatiquement à l'acheteur avec le lot.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="charges-copropriete-vente-qui-paie" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Anticipez la répartition des charges
          </h2>
          <p className="text-secondary-500 mb-6">
            Le pré-état daté détaille toutes les charges de votre lot. 24,99 EUR, prêt en 5 minutes.
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
