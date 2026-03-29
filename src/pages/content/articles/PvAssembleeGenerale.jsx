import { Link } from 'react-router-dom';
import { ArrowRight, Clock, FileText, Search } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PvAssembleeGenerale() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="PV d'assemblée générale : pourquoi les 3 derniers sont essentiels"
        description="Les 3 derniers PV d'assemblée générale sont obligatoires lors de la vente en copropriété. Que contiennent-ils ? Où les trouver ? Comment les lire ?"
        canonical="/guide/pv-assemblee-generale-copropriete-vente"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "PV d'assemblée générale : pourquoi les 3 derniers sont essentiels",
        description: "Les 3 derniers PV d'assemblée générale sont obligatoires lors de la vente en copropriété. Que contiennent-ils ? Où les trouver ? Comment les lire ?",
        slug: 'pv-assemblee-generale-copropriete-vente',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: "PV d'assemblée générale" },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: "Où trouver les PV d'assemblée générale de sa copropriété ?",
          answer: "Les PV d'assemblée générale sont disponibles sur l'extranet du syndic de copropriété, accessible avec vos identifiants copropriétaire. Le syndic est tenu de les mettre à disposition dans le mois suivant l'AG. Si vous n'avez pas accès à l'extranet, vous pouvez en faire la demande écrite auprès du syndic. En cas de changement de syndic, l'ancien syndic doit transmettre l'ensemble des archives au nouveau dans un délai d'un mois.",
        },
        {
          question: "Que faire si le syndic ne transmet pas les PV d'AG ?",
          answer: "Si le syndic ne transmet pas les PV d'assemblée générale, envoyez d'abord une mise en demeure par lettre recommandée avec accusé de réception. Sans réponse sous 8 jours, vous pouvez saisir le tribunal judiciaire. Le vendeur peut également établir le pré-état daté lui-même avec les documents en sa possession grâce à un service comme Pre-etat-date.ai, sans attendre le syndic.",
        },
        {
          question: "L'acheteur peut-il assister à l'AG avant la vente ?",
          answer: "Non, l'acheteur ne peut pas assister à l'assemblée générale avant la signature de l'acte authentique de vente. Seuls les copropriétaires (ou leurs mandataires) ont le droit de participer et de voter. Cependant, l'acheteur a accès aux 3 derniers PV d'AG via le pré-état daté annexé au compromis de vente, ce qui lui permet de connaître les décisions prises.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: "PV d'assemblée générale" },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          PV d'assemblée générale : pourquoi les 3 derniers sont essentiels
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
              <dd>3 derniers PV d'AG, imposés par la loi ALUR (art. L.721-2 du CCH)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Contenu clé :</dt>
              <dd>Votes de travaux, budget, procédures judiciaires, élections du syndic</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Où les trouver :</dt>
              <dd>Extranet du syndic de copropriété</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Qui les fournit :</dt>
              <dd>Le syndic ou le vendeur lui-même</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Délai d'envoi :</dt>
              <dd>1 mois après la tenue de l'assemblée générale</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Lors de la vente d'un lot en copropriété, les procès-verbaux des trois dernières assemblées
          générales font partie des documents obligatoires à fournir à l'acquéreur. Ces PV sont une
          mine d'informations sur la vie de la copropriété, les décisions votées et les éventuels
          contentieux. Comprendre leur contenu est essentiel pour sécuriser la transaction.
        </p>

        {/* Why mandatory */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi les 3 derniers PV d'AG sont-ils obligatoires ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> (article
          L.721-2 du Code de la construction et de l'habitation) impose au vendeur de fournir les
          procès-verbaux des trois dernières assemblées générales. Cette obligation vise à garantir
          la transparence envers l'acquéreur, qui doit pouvoir évaluer la situation financière et
          juridique de la copropriété avant de s'engager.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En l'absence de ces documents, le notaire ne peut pas finaliser le compromis de vente.
          L'acquéreur dispose par ailleurs d'un délai de rétractation de 10 jours à compter de la
          notification de l'ensemble des documents, PV d'AG inclus.
        </p>

        {/* What to look for */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que regarder dans un PV d'assemblée générale ?
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Information dans le PV</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Pourquoi c'est important pour l'acheteur</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Travaux votés et montants</td>
                <td className="border border-secondary-200 px-4 py-3">Anticiper les appels de fonds futurs</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Budget prévisionnel voté</td>
                <td className="border border-secondary-200 px-4 py-3">Connaître les charges annuelles</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Procédures judiciaires</td>
                <td className="border border-secondary-200 px-4 py-3">Évaluer les risques financiers</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Impayés de la copropriété</td>
                <td className="border border-secondary-200 px-4 py-3">Risque de charges supplémentaires</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Résultats des votes (majorité)</td>
                <td className="border border-secondary-200 px-4 py-3">Comprendre la gouvernance</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Nomination du syndic</td>
                <td className="border border-secondary-200 px-4 py-3">Stabilité de la gestion</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* How to read them */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment lire efficacement un PV d'AG ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Un PV d'assemblée générale peut faire des dizaines de pages. Voici les points clés
          à vérifier en priorité :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Les résolutions relatives aux travaux</strong> : montants votés, répartition
            par lot, échéancier des appels de fonds. Un ravalement de façade ou une réfection de
            toiture peut représenter plusieurs milliers d'euros par copropriétaire.
          </li>
          <li>
            <strong>L'approbation des comptes</strong> : vérifiez si les comptes de l'exercice
            précédent ont été approuvés et si des réserves ont été émises.
          </li>
          <li>
            <strong>Les procédures en cours</strong> : actions judiciaires contre des copropriétaires
            débiteurs, litiges avec des prestataires ou des voisins.
          </li>
          <li>
            <strong>Le renouvellement du syndic</strong> : un changement fréquent de syndic peut
            être le signe d'une copropriété difficile à gérer.
          </li>
          <li>
            <strong>Le fonds de travaux</strong> (obligatoire depuis la loi ALUR) : vérifiez le
            montant de la cotisation annuelle et le solde du fonds.
          </li>
        </ul>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Search className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Pre-etat-date.ai analyse vos PV automatiquement</h3>
            <p className="text-sm text-secondary-600">
              Notre intelligence artificielle extrait automatiquement les informations clés des PV
              d'AG : travaux votés, montants, procédures en cours, budget. Plus besoin de lire
              des dizaines de pages, l'essentiel est synthétisé dans votre pré-état daté.
            </p>
          </div>
        </div>

        {/* Where to find them */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Où trouver les PV d'assemblée générale ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Depuis la loi ALUR, le syndic est tenu de mettre à disposition des copropriétaires un
          extranet sécurisé contenant les documents essentiels de la copropriété, dont les PV d'AG.
          Connectez-vous avec vos identifiants pour les télécharger directement en PDF.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous n'avez pas accès à l'extranet, adressez une demande écrite à votre syndic. Celui-ci
          est tenu de transmettre les PV dans un délai raisonnable. En cas de refus ou de retard
          excessif, une mise en demeure par courrier recommandé peut être nécessaire.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour en savoir plus sur l'ensemble des documents à réunir, consultez notre guide
          sur les <Link to="/guide/documents-necessaires-vente" className="text-primary-600 hover:text-primary-800 font-medium">documents nécessaires pour la vente en copropriété</Link>.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Où trouver les PV d'assemblée générale de sa copropriété ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Les PV d'AG sont disponibles sur l'extranet du syndic, accessible avec vos identifiants
              copropriétaire. Le syndic est tenu de les publier dans le mois suivant l'AG. En cas de
              difficulté d'accès, faites une demande écrite au syndic.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Que faire si le syndic ne transmet pas les PV d'AG ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Envoyez une mise en demeure par lettre recommandée avec accusé de réception. Sans
              réponse sous 8 jours, vous pouvez saisir le tribunal judiciaire. En attendant, vous
              pouvez générer votre pré-état daté avec les documents en votre possession
              sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              L'acheteur peut-il assister à l'AG avant la vente ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non, seuls les copropriétaires ou leurs mandataires peuvent participer à l'assemblée
              générale. Cependant, l'acheteur a accès aux 3 derniers PV via le pré-état daté annexé
              au <Link to="/guide/compromis-vente-copropriete-documents" className="text-primary-600 hover:text-primary-800 font-medium">compromis de vente</Link>,
              ce qui lui permet de connaître toutes les décisions prises.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pv-assemblee-generale-copropriete-vente" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Vos PV d'AG analysés en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            Déposez vos PV d'assemblée générale, l'IA extrait les données essentielles pour votre pré-état daté.
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
