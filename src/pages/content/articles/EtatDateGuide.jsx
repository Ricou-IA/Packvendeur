import { Link } from 'react-router-dom';
import { ArrowRight, Clock, FileText, Scale } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function EtatDateGuide() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="État daté : définition, contenu et tarif plafonné à 380 €"
        description="L'état daté est un document obligatoire établi par le syndic lors de la vente. Tarif plafonné à 380 € TTC. Contenu, différence avec le pré-état daté, délais."
        canonical="/guide/etat-date-definition-contenu-tarif"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "État daté : définition, contenu et tarif plafonné à 380 €",
        description: "L'état daté est un document obligatoire établi par le syndic lors de la vente en copropriété. Tarif plafonné à 380 € TTC, contenu réglementaire, délais et différence avec le pré-état daté.",
        slug: 'etat-date-definition-contenu-tarif',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'État daté : définition et tarif' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Qui doit payer l\'état daté, le vendeur ou l\'acheteur ?',
          answer: "C'est le vendeur qui paie l'état daté. Le syndic facture ce document au copropriétaire vendeur, car c'est lui qui a l'obligation de fournir les informations financières au moment de la vente. Le tarif est plafonné à 380 € TTC depuis le décret du 21 février 2020. Le vendeur ne peut pas demander à l'acheteur de prendre en charge ce coût, sauf accord amiable intégré dans le compromis de vente.",
        },
        {
          question: 'Le syndic peut-il facturer plus de 380 € pour l\'état daté ?',
          answer: "Non. Depuis le décret n° 2020-153 du 21 février 2020, le tarif de l'état daté est plafonné à 380 € TTC. Ce plafond inclut la totalité des frais liés à l'établissement du document. Si votre syndic facture un montant supérieur, vous pouvez contester la facture en vous appuyant sur ce texte réglementaire. Avant ce plafonnement, certains syndics facturaient jusqu'à 600 € voire davantage.",
        },
        {
          question: 'Peut-on se passer de l\'état daté ?',
          answer: "Non. L'état daté est obligatoire pour toute vente d'un lot de copropriété. Il est prévu par l'article 5 du décret du 17 mars 1967. Le notaire ne peut pas procéder à la signature de l'acte authentique sans ce document. Seul le syndic peut l'établir, contrairement au pré-état daté que le vendeur peut réaliser lui-même. L'état daté et le pré-état daté sont deux documents distincts intervenant à des moments différents de la vente.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'État daté : définition et tarif' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          État daté : définition, contenu et tarif plafonné à 380 €
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
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
              <dt className="font-semibold min-w-[160px]">Qui le rédige :</dt>
              <dd>Le syndic de copropriété uniquement</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Quand :</dt>
              <dd>Après le compromis, avant l'acte authentique de vente</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Tarif :</dt>
              <dd>Plafonné à 380 € TTC (décret du 21 février 2020)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Contenu :</dt>
              <dd>3 parties réglementaires (sommes dues par le vendeur, par le syndicat, par le futur acquéreur)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Base légale :</dt>
              <dd>Article 5 du décret du 17 mars 1967</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Délai moyen :</dt>
              <dd>15 à 30 jours après la demande au syndic</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          L'état daté est un document incontournable de la vente en copropriété. Établi exclusivement
          par le syndic, il dresse le bilan financier du lot vendu au moment de la mutation. À ne pas
          confondre avec le <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté</Link>,
          qui intervient plus tôt dans le processus de vente.
        </p>

        {/* Les 3 parties obligatoires */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 3 parties obligatoires de l'état daté
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le contenu de l'état daté est strictement encadré par l'article 5 du décret du 17 mars 1967.
          Il se décompose en trois parties distinctes :
        </p>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Partie 1 : les sommes dues par le vendeur au syndicat</h3>
              <p className="text-sm text-secondary-600">
                Cette partie recense les provisions exigibles du budget prévisionnel, les provisions
                des dépenses non comprises dans le budget, les charges impayées et les avances
                non encore restituées. C'est la photographie de la dette du vendeur envers la copropriété.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Partie 2 : les sommes dues par le syndicat au vendeur</h3>
              <p className="text-sm text-secondary-600">
                Il s'agit des avances versées par le vendeur (fonds de roulement, avance de trésorerie)
                et des provisions trop-perçues en attente de régularisation. Ces sommes seront
                remboursées au vendeur ou transférées à l'acquéreur.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Partie 3 : les sommes qui seront dues par l'acquéreur</h3>
              <p className="text-sm text-secondary-600">
                Cette dernière partie indique les provisions du budget prévisionnel que le nouveau
                copropriétaire devra verser après la vente, ainsi que les avances et fonds de
                roulement à reconstituer.
              </p>
            </div>
          </div>
        </div>

        {/* Pourquoi le tarif a été plafonné */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le tarif a été plafonné à 380 € ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Avant le décret du 21 février 2020, les syndics fixaient librement le prix de l'état daté.
          Certains facturaient 500 à 600 EUR pour un document dont l'établissement prend quelques
          heures. Les associations de copropriétaires comme l'ARC et l'UFC-Que Choisir ont dénoncé
          ces tarifs excessifs pendant des années.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le législateur a finalement imposé un plafond de 380 € TTC. Ce montant couvre l'intégralité
          des frais liés à l'établissement de l'état daté, y compris les frais de gestion administrative.
          Le syndic ne peut facturer aucun supplément, même pour un traitement en urgence.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pré-état daté vs état daté : les différences
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Pré-état daté</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">État daté</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Quand</td>
                <td className="border border-secondary-200 px-4 py-3">Avant le compromis</td>
                <td className="border border-secondary-200 px-4 py-3">Après le compromis, avant l'acte</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Qui le rédige</td>
                <td className="border border-secondary-200 px-4 py-3">Le vendeur ou un service en ligne</td>
                <td className="border border-secondary-200 px-4 py-3">Le syndic uniquement</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Prix</td>
                <td className="border border-secondary-200 px-4 py-3">24,99 € (Pre-etat-date.ai)</td>
                <td className="border border-secondary-200 px-4 py-3">Plafonné à 380 € TTC</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Délai</td>
                <td className="border border-secondary-200 px-4 py-3">5 minutes</td>
                <td className="border border-secondary-200 px-4 py-3">15 à 30 jours</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Obligatoire</td>
                <td className="border border-secondary-200 px-4 py-3">Informations obligatoires (loi ALUR)</td>
                <td className="border border-secondary-200 px-4 py-3">Oui (décret 1967)</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Contenu</td>
                <td className="border border-secondary-200 px-4 py-3">Financier + juridique + technique</td>
                <td className="border border-secondary-200 px-4 py-3">3 parties réglementaires</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Why pré-état daté before */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi faire le pré-état daté AVANT accélère la vente
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté et l'état daté sont complémentaires. Le premier intervient avant le
          compromis pour informer l'acquéreur, le second après pour finaliser la mutation. En
          préparant le <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté</Link> en
          amont, vous rassemblez déjà toutes les données financières et juridiques de votre lot.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Résultat : lorsque le syndic établira l'état daté après la signature du compromis, les
          informations seront cohérentes et le processus sera plus fluide. Moins de navettes entre
          le notaire et le syndic, moins de risques de blocage.
        </p>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <Scale className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Un investissement qui se rentabilise</h3>
            <p className="text-sm text-secondary-600">
              À 24,99 EUR, le pré-état daté généré sur Pre-etat-date.ai représente moins de 7 % du
              coût de l'état daté chez le syndic (380 €). En sécurisant la vente dès le compromis,
              vous gagnez du temps et évitez les mauvaises surprises financières.
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
              Qui doit payer l'état daté, le vendeur ou l'acheteur ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              C'est le vendeur qui paie l'état daté. Le syndic facture ce document au copropriétaire
              vendeur, car c'est lui qui doit fournir les informations financières lors de la vente.
              Le tarif est plafonné à 380 € TTC. Un accord amiable dans le compromis peut prévoir
              un partage des frais, mais cela reste rare.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le syndic peut-il facturer plus de 380 € pour l'état daté ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Le décret n° 2020-153 du 21 février 2020 plafonne le tarif à 380 € TTC. Ce montant
              couvre l'intégralité des frais, y compris les frais administratifs. Si votre syndic
              dépasse ce plafond, vous pouvez contester la facture en invoquant ce texte. Avant ce
              plafonnement, des tarifs de 500 à 600 EUR étaient courants.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Peut-on se passer de l'état daté ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. L'état daté est obligatoire pour toute vente d'un lot de copropriété (article 5
              du décret du 17 mars 1967). Le notaire ne signera pas l'acte authentique sans ce
              document. En revanche, le <Link to="/guide/difference-pre-etat-date-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté</Link> peut
              être réalisé par le vendeur lui-même, sans passer par le syndic.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="etat-date-definition-contenu-tarif" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Préparez votre vente avec le pré-état daté
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR, prêt en 5 minutes. Anticipez l'état daté du syndic.
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
