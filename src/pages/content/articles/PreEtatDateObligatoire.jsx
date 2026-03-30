import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, faqSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDateObligatoire() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Le pré-état daté est-il obligatoire ? Ce que dit la loi (2026)"
        description="Le pré-état daté est obligatoire pour toute vente en copropriété depuis la loi ALUR de 2014. Base légale, sanctions, exceptions et comment l'obtenir."
        canonical="/guide/pre-etat-date-obligatoire"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Le pré-état daté est-il obligatoire ? Ce que dit la loi (2026)",
        description: "Le pré-état daté est obligatoire pour toute vente en copropriété depuis la loi ALUR de 2014. Base légale, sanctions, exceptions.",
        slug: 'pre-etat-date-obligatoire',
        datePublished: '2026-03-30',
      })} />
      <JsonLd data={faqSchema([
        {
          question: "Le pré-état daté est-il obligatoire pour vendre en copropriété ?",
          answer: "Oui, depuis la loi ALUR du 24 mars 2014, le vendeur doit fournir les informations prévues à l'article L.721-2 du Code de la Construction et de l'Habitation dès la promesse de vente. Ces informations constituent le pré-état daté. Sans ce document, la vente peut être annulée.",
        },
        {
          question: "Que risque-t-on si le pré-état daté n'est pas fourni ?",
          answer: "L'absence du pré-état daté peut entraîner la nullité de la promesse de vente. L'acquéreur dispose d'un délai d'un mois après la notification pour se rétracter sans avoir à justifier sa décision. Le notaire refusera généralement de signer l'acte sans ce document.",
        },
        {
          question: "Le pré-état daté est-il obligatoire en 2026 ?",
          answer: "Oui, l'obligation du pré-état daté est toujours en vigueur en 2026. Elle n'a pas été modifiée depuis la loi ALUR de 2014. Toute vente d'un lot de copropriété (appartement, local commercial, parking) doit être accompagnée de ce document.",
        },
      ])} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pré-état daté obligatoire' },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pré-état daté obligatoire' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Le pré-état daté est-il obligatoire ? Ce que dit la loi
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-30">Mis à jour le 30 mars 2026</time>
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
              <dt className="font-semibold min-w-[140px]">Obligatoire :</dt>
              <dd>Oui, pour toute vente d'un lot de copropriété depuis le 24 mars 2014</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Base légale :</dt>
              <dd>Article L.721-2 du Code de la Construction et de l'Habitation (loi ALUR)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Quand :</dt>
              <dd>Dès la promesse de vente (avant le compromis)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Sanction :</dt>
              <dd>Nullité de la promesse de vente, droit de rétractation étendu pour l'acquéreur</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Qui le fournit :</dt>
              <dd>Le vendeur (lui-même, via le syndic ou via un service en ligne)</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Vous vendez un appartement en copropriété et vous vous demandez si le pré-état daté
          est vraiment obligatoire ? La réponse est <strong>oui</strong>. Depuis la loi ALUR
          du 24 mars 2014, le vendeur a l'obligation de fournir un ensemble d'informations
          financières, juridiques et techniques à l'acquéreur dès la signature de la promesse
          de vente.
        </p>

        {/* Base légale */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que dit la loi : l'article L.721-2 du CCH
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'<strong>article L.721-2 du Code de la Construction et de l'Habitation</strong>,
          créé par la loi ALUR (loi n° 2014-366 du 24 mars 2014), impose au vendeur d'un lot
          de copropriété de fournir à l'acquéreur, dès la promesse de vente, les informations
          suivantes :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>La <strong>fiche synthétique</strong> de la copropriété.</li>
          <li>Le <strong>règlement de copropriété</strong> et l'état descriptif de division.</li>
          <li>Les <strong>procès-verbaux des assemblées générales</strong> des trois dernières années.</li>
          <li>Les <strong>données financières</strong> : budget prévisionnel, charges du lot, impayés, fonds de travaux.</li>
          <li>Le <strong>carnet d'entretien</strong> de l'immeuble.</li>
          <li>Le <strong>diagnostic technique global</strong> (DTG) et le plan pluriannuel de travaux (PPT) s'ils existent.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'ensemble de ces informations, regroupées dans un document structuré, constitue ce que
          la pratique notariale appelle le <strong>pré-état daté</strong>.
        </p>

        {/* Depuis quand */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Obligatoire depuis 2014, toujours en vigueur en 2026
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'obligation existe depuis le <strong>24 mars 2014</strong>, date d'entrée en vigueur
          de la loi ALUR. Elle a été précisée par le <strong>décret n° 2015-342 du 26 mars
          2015</strong> qui détaille les informations à fournir.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En 2026, cette obligation est toujours pleinement en vigueur. Elle s'applique à toute
          vente d'un lot de copropriété, qu'il s'agisse d'un appartement, d'un local commercial,
          d'un parking ou d'une cave.
        </p>

        {/* Sanctions */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que risque-t-on sans pré-état daté ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Ne pas fournir le pré-état daté expose le vendeur à plusieurs risques :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Nullité de la vente</strong> : l'acquéreur peut demander l'annulation de la promesse de vente pour défaut d'information.</li>
          <li><strong>Rétractation étendue</strong> : le délai de rétractation de 10 jours ne commence à courir qu'à réception de tous les documents obligatoires, y compris le pré-état daté.</li>
          <li><strong>Blocage notarial</strong> : le notaire refusera de rédiger l'acte authentique sans les informations prévues par l'article L.721-2.</li>
          <li><strong>Action en garantie des vices cachés</strong> : si un problème financier ou juridique de la copropriété n'a pas été signalé, l'acquéreur peut agir en justice.</li>
        </ul>

        {/* Obligatoire ou pas */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Obligatoire ou pas : les cas particuliers
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté est obligatoire dans la grande majorité des cas, mais certaines
          situations méritent d'être précisées :
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse border border-secondary-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-secondary-50">
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Situation</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Obligatoire ?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-secondary-200">Vente d'un appartement en copropriété</td>
                <td className="p-3 border border-secondary-200 font-semibold text-green-700">Oui</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200">Vente d'un parking ou cave en copropriété</td>
                <td className="p-3 border border-secondary-200 font-semibold text-green-700">Oui</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200">Vente d'un local commercial en copropriété</td>
                <td className="p-3 border border-secondary-200 font-semibold text-green-700">Oui</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200">Maison en copropriété horizontale</td>
                <td className="p-3 border border-secondary-200 font-semibold text-green-700">Oui</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200">Maison individuelle (hors copropriété)</td>
                <td className="p-3 border border-secondary-200 font-semibold text-red-600">Non</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200">Bien en ASL ou AFUL (sans copropriété)</td>
                <td className="p-3 border border-secondary-200 font-semibold text-amber-600">Cas par cas</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Qui le fournit */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qui doit fournir le pré-état daté ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est le <strong>vendeur</strong> qui est responsable de fournir ces informations.
          Contrairement à l'état daté (qui est obligatoirement établi par le syndic après le
          compromis), le pré-état daté peut être constitué par le vendeur lui-même.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le vendeur dispose de trois options :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Le demander au syndic</strong> : coût de 150 à 600 €, délai de 15 à 30 jours.</li>
          <li><strong>Le faire soi-même</strong> : gratuit mais complexe et risqué (voir notre guide <Link to="/guide/modele-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">modèle de pré-état daté</Link>).</li>
          <li><strong>Utiliser un service en ligne</strong> : Pre-etat-date.ai génère automatiquement le document conforme CSN en 5 minutes pour 24,99 €.</li>
        </ul>

        {/* Différence état daté */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ne pas confondre avec l'état daté
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté et l'<Link to="/guide/etat-date-definition-contenu-tarif" className="text-primary-600 hover:text-primary-800 font-medium">état daté</Link> sont
          deux documents distincts :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le <strong>pré-état daté</strong> est fourni <em>avant</em> le compromis, par le vendeur.</li>
          <li>L'<strong>état daté</strong> est établi par le syndic <em>après</em> le compromis, pour l'acte authentique. Son tarif est plafonné à 380 € (décret de 2020).</li>
        </ul>

        <RelatedArticles currentSlug="pre-etat-date-obligatoire" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Remplissez votre obligation légale en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            Pré-état daté conforme loi ALUR, généré par IA pour 24,99 €.
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
