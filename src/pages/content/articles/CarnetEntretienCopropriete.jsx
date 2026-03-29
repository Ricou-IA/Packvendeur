import { Link } from 'react-router-dom';
import { ArrowRight, Clock, BookOpen, CheckCircle } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function CarnetEntretienCopropriete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Carnet d'entretien de copropriété : contenu et obligations"
        description="Le carnet d'entretien est un document obligatoire de la copropriété. Contenu, mise à jour par le syndic, rôle dans la vente et le pré-état daté."
        canonical="/guide/carnet-entretien-copropriete"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Carnet d'entretien de copropriété : contenu et obligations",
        description: "Le carnet d'entretien est un document obligatoire de la copropriété. Contenu, mise à jour par le syndic, rôle dans la vente et le pré-état daté.",
        slug: 'carnet-entretien-copropriete',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: "Carnet d'entretien de copropriété" },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: "Le carnet d'entretien est-il obligatoire en copropriété ?",
          answer: "Oui, le carnet d'entretien est obligatoire dans toutes les copropriétés depuis la loi SRU du 13 décembre 2000 (article 18 de la loi du 10 juillet 1965). Cette obligation a été renforcée par la loi ALUR de 2014 qui a élargi son contenu. C'est le syndic qui est chargé de le tenir et de le mettre à jour après chaque intervention significative sur l'immeuble.",
        },
        {
          question: "Le vendeur doit-il fournir le carnet d'entretien à l'acheteur ?",
          answer: "Le carnet d'entretien fait partie des documents que le vendeur doit mettre à disposition de l'acquéreur dans le cadre du pré-état daté (article L.721-2 du CCH). Il peut être annexé au compromis de vente ou transmis via le syndic. Son contenu est essentiel pour que l'acheteur évalue l'état de l'immeuble et anticipe les dépenses d'entretien futures.",
        },
        {
          question: "Que faire si le syndic ne tient pas le carnet d'entretien à jour ?",
          answer: "Le syndic a l'obligation légale de tenir le carnet d'entretien à jour. En cas de manquement, le conseil syndical peut le mettre en demeure par lettre recommandée. Si le syndic persiste, cette défaillance peut justifier sa révocation lors de l'assemblée générale. Un copropriétaire peut également demander au tribunal d'ordonner la mise à jour du carnet.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: "Carnet d'entretien de copropriété" },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Carnet d'entretien de copropriété : contenu et obligations
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
              <dt className="font-semibold min-w-[160px]">Obligation :</dt>
              <dd>Loi SRU du 13 décembre 2000, renforcée par la loi ALUR 2014</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Tenu par :</dt>
              <dd>Le syndic de copropriété</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Contenu :</dt>
              <dd>Travaux réalisés, contrats d'entretien, sinistres, équipements communs</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Mise à jour :</dt>
              <dd>Après chaque intervention significative sur l'immeuble</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Rôle dans la vente :</dt>
              <dd>Annexé ou mentionné dans le pré-état daté</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Où le consulter :</dt>
              <dd>Extranet du syndic de copropriété</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le carnet d'entretien est la mémoire technique de votre copropriété. Ce document obligatoire
          recense l'ensemble des interventions réalisées sur l'immeuble, les contrats en cours et les
          équipements communs. Lors d'une vente, il constitue une source d'information précieuse pour
          l'acquéreur, qui peut ainsi évaluer l'état de l'immeuble et anticiper les futures dépenses.
        </p>

        {/* History */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Un document obligatoire depuis la loi SRU
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le carnet d'entretien a été rendu obligatoire par la loi SRU (Solidarité et Renouvellement
          Urbains) du 13 décembre 2000, qui a modifié l'article 18 de la loi du 10 juillet 1965.
          L'objectif était de professionnaliser la gestion des copropriétés en imposant une traçabilité
          des travaux et de l'entretien.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR de 2014</Link> a
          renforcé cette obligation en élargissant le contenu du carnet et en imposant sa mise à
          disposition sur l'extranet du syndic. Depuis, chaque copropriétaire peut y accéder librement
          et à tout moment.
        </p>

        {/* Table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que contient le carnet d'entretien ?
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Élément du carnet</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Détails</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Adresse et identification</td>
                <td className="border border-secondary-200 px-4 py-3">Numéro d'immatriculation RNIC, adresse, nombre de lots</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Contrats d'entretien en cours</td>
                <td className="border border-secondary-200 px-4 py-3">Ascenseur, chauffage, nettoyage, espaces verts</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Travaux réalisés</td>
                <td className="border border-secondary-200 px-4 py-3">Nature, date, entreprise, coût, garanties</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Sinistres importants</td>
                <td className="border border-secondary-200 px-4 py-3">Dégâts des eaux, incendies, déclarations</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Équipements communs</td>
                <td className="border border-secondary-200 px-4 py-3">Ascenseur, chaufferie, digicode, parking</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Année de construction</td>
                <td className="border border-secondary-200 px-4 py-3">Permet de déterminer les diagnostics obligatoires</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Why it matters for the buyer */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le carnet d'entretien est important pour l'acheteur
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour un acquéreur, le carnet d'entretien est un outil d'évaluation essentiel. Il permet de :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Vérifier l'état de l'immeuble</strong> : un historique de travaux réguliers
            (ravalement, étanchéité, toiture) est un signe de bonne gestion.
          </li>
          <li>
            <strong>Anticiper les dépenses futures</strong> : si la toiture a été refaite il y a
            2 ans, pas de gros travaux à prévoir. Si elle date de 30 ans, des travaux sont probables.
          </li>
          <li>
            <strong>Évaluer la qualité de la gestion</strong> : des contrats d'entretien à jour et
            un suivi régulier témoignent d'un syndic impliqué.
          </li>
          <li>
            <strong>Connaître les sinistres passés</strong> : des dégâts des eaux récurrents peuvent
            révéler un problème structurel non résolu.
          </li>
        </ul>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Le carnet d'entretien dans le pré-état daté</h3>
            <p className="text-sm text-secondary-600">
              Les informations du carnet d'entretien sont intégrées dans le pré-état daté généré
              par Pre-etat-date.ai. Notre IA extrait automatiquement les données pertinentes : travaux
              réalisés, équipements, contrats en cours, pour les restituer dans un format clair.
            </p>
          </div>
        </div>

        {/* Syndic obligation */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le rôle du syndic dans la tenue du carnet
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est le syndic de copropriété qui est légalement responsable de la tenue et de la mise
          à jour du carnet d'entretien. Il doit y consigner chaque intervention significative :
          travaux, remplacement d'équipements, sinistres, renouvellement de contrats.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En pratique, la qualité de tenue du carnet varie considérablement d'un syndic à l'autre.
          Les grands syndics nationaux disposent souvent d'outils numériques dédiés, tandis que
          certains syndics bénévoles peuvent être moins rigoureux dans le suivi. Le conseil syndical
          a un rôle de contrôle et peut demander la mise à jour du carnet lors de l'assemblée générale.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour aller plus loin sur les charges et la gestion,
          consultez notre <Link to="/guide/charges-copropriete-evolution-syndic" className="text-primary-600 hover:text-primary-800 font-medium">enquête sur les charges de copropriété</Link>.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le carnet d'entretien est-il obligatoire en copropriété ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, le carnet d'entretien est obligatoire dans toutes les copropriétés depuis la loi
              SRU du 13 décembre 2000. Cette obligation a été renforcée par la loi ALUR de 2014
              qui a élargi son contenu et imposé sa mise à disposition sur l'extranet du syndic.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le vendeur doit-il fournir le carnet d'entretien à l'acheteur ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le carnet d'entretien fait partie des documents mentionnés dans le pré-état daté,
              obligatoire lors de la vente en copropriété (article L.721-2 du CCH). Il peut être
              annexé au compromis ou consultable via le syndic. Son contenu aide l'acheteur à évaluer
              l'état de l'immeuble.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Que faire si le syndic ne tient pas le carnet d'entretien à jour ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le conseil syndical peut mettre en demeure le syndic par courrier recommandé. Si le
              syndic persiste dans son manquement, cette défaillance peut justifier sa révocation
              en <Link to="/guide/pv-assemblee-generale-copropriete-vente" className="text-primary-600 hover:text-primary-800 font-medium">assemblée générale</Link>.
              Un copropriétaire peut également saisir le tribunal pour ordonner la mise à jour.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="carnet-entretien-copropriete" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Générez votre pré-état daté en quelques minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            Carnet d'entretien, PV d'AG, appels de fonds : l'IA analyse tous vos documents de copropriété.
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
