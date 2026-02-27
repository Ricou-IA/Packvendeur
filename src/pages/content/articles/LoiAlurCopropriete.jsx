import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function LoiAlurCopropriete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Loi ALUR et copropriété : ce que le vendeur doit savoir"
        description="Tout sur la loi ALUR et ses impacts pour le vendeur en copropriété : obligations d'information, documents à fournir, position du CSN sur le syndic."
        canonical="/guide/loi-alur-copropriete"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Loi ALUR et copropriété : ce qui change pour la vente",
        description: "Les obligations d'information imposées par la loi ALUR lors de la vente.",
        slug: 'loi-alur-copropriete',
        datePublished: '2026-02-10',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Loi ALUR' },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Loi ALUR' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Loi ALUR et copropriété : ce que le vendeur doit savoir
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-10">Mis à jour le 10 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            9 min de lecture
          </span>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          La loi ALUR (Accès au Logement et un Urbanisme Rénové) du 24 mars 2014 a profondément
          modifié les règles de la vente en copropriété. Douze ans après, ses implications sont
          toujours d'actualité pour les vendeurs. Voici ce que vous devez savoir en 2026.
        </p>

        {/* Ce que la loi ALUR a change */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que la loi ALUR a changé pour les vendeurs
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Avant la loi ALUR, le vendeur d'un lot de copropriété avait des obligations d'information
          relativement limitées. La loi du 24 mars 2014 a considérablement renforcé la transparence
          en imposant la transmission d'un grand nombre de documents et d'informations à l'acquéreur.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'objectif du législateur était double : mieux protéger les acquéreurs en leur donnant une
          vision complète de la copropriété avant l'achat, et lutter contre la dégradation des
          copropriétés en encourageant la transparence financière.
        </p>

        {/* Article L.721-2 */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          L'article L.721-2 du CCH : le coeur des obligations
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La loi ALUR a créé l'<strong>article L.721-2 du Code de la Construction et de l'Habitation
          (CCH)</strong>, qui liste précisément les informations à fournir à l'acquéreur dès la
          promesse de vente. Ces informations se répartissent en trois catégories :
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Informations relatives à l'organisation de la copropriété
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>La fiche synthétique de la copropriété (article 8-2 de la loi du 10 juillet 1965).</li>
          <li>Le règlement de copropriété et l'état descriptif de division, ainsi que les actes les modifiant.</li>
          <li>Les PV des assemblées générales des 3 dernières années.</li>
          <li>Le carnet d'entretien de l'immeuble.</li>
          <li>La notice d'information relative aux droits et obligations des copropriétaires.</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Informations financières
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le montant des charges courantes du budget prévisionnel et des charges hors budget correspondant aux 2 exercices comptables précédents.</li>
          <li>Les sommes susceptibles d'être dues au syndic par l'acquéreur (provisions non encore exigibles, avances, fonds de travaux).</li>
          <li>L'état global des impayés de charges au sein de la copropriété et de la dette vis-à-vis des fournisseurs.</li>
          <li>Le montant de la part du fonds de travaux rattachée au lot vendu (loi ALUR).</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Informations relatives à l'état de l'immeuble
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le diagnostic technique global (DTG) s'il existe.</li>
          <li>Le plan pluriannuel de travaux s'il a été adopté.</li>
          <li>Les diagnostics techniques du lot (DPE, amiante, plomb, etc.).</li>
        </ul>

        {/* Consequences pour le vendeur */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les conséquences concrètes pour le vendeur
        </h2>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800 leading-relaxed">
              <strong>Point important :</strong> Si les documents obligatoires ne sont pas annexés au
              compromis, l'acquéreur dispose d'un délai de rétractation prolongé. Le délai de 10 jours
              ne commence à courir qu'à la réception du dernier document manquant.
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En pratique, cela signifie que le vendeur a tout intérêt à <strong>rassembler tous les
          documents avant la signature du compromis</strong>. Un dossier incomplet peut :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Retarder la vente</strong> : le notaire refusera de faire signer un compromis sans les documents obligatoires.</li>
          <li><strong>Prolonger le délai de rétractation</strong> : l'acquéreur pourra se rétracter tant que tous les documents ne lui ont pas été remis.</li>
          <li><strong>Fragiliser juridiquement la vente</strong> : l'acquéreur pourrait invoquer un défaut d'information pour demander l'annulation de la vente ou une réduction du prix.</li>
        </ul>

        {/* Position du CSN */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La position du CSN : le syndic n'est pas obligatoire
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Un point essentiel souvent méconnu : le <strong>Conseil Supérieur du Notariat (CSN)</strong> a
          pris position sur la question de savoir qui peut établir le pré-état daté. Sa réponse est
          claire : le vendeur n'est pas contraint de passer par le syndic.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le CSN a précisé que les informations requises par l'article L.721-2 du CCH peuvent être
          réunies par le vendeur lui-même, à condition qu'il dispose des documents nécessaires
          (PV d'AG, relevés de charges, fiche synthétique, etc.). Le vendeur peut donc constituer
          son pré-état daté à partir des documents en sa possession ou de ceux obtenus via
          l'extranet du syndic.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette position a ouvert la voie aux services en ligne comme Pack Vendeur, qui permettent
          au vendeur de générer son pré-état daté de manière autonome, sans attendre le syndic et
          à un coût bien inférieur.
        </p>

        {/* Le fonds de travaux */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le fonds de travaux : une innovation de la loi ALUR
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La loi ALUR a rendu obligatoire la constitution d'un <strong>fonds de travaux</strong> dans
          toutes les copropriétés (article 14-2 de la loi du 10 juillet 1965). Ce fonds, alimenté
          par une cotisation annuelle d'au moins 2,5% du budget prévisionnel, a pour but de financer
          les travaux de conservation et d'entretien de l'immeuble.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Lors de la vente d'un lot, les cotisations versées au fonds de travaux restent acquises à
          la copropriété. Le vendeur ne peut pas demander le remboursement de sa part. En revanche,
          le montant du fonds rattaché au lot vendu doit être communiqué à l'acquéreur dans le
          pré-état daté.
        </p>

        {/* Implications pour les acquereurs */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que cela change pour les acquéreurs
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La loi ALUR a donné aux acquéreurs en copropriété un niveau d'information sans précédent.
          Avant d'acheter, l'acquéreur sait désormais :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le montant exact des charges qu'il devra payer.</li>
          <li>Les travaux votés mais pas encore réalisés (et sa quote-part).</li>
          <li>L'état financier de la copropriété (impayés, dettes).</li>
          <li>Les procédures judiciaires en cours.</li>
          <li>L'état technique de l'immeuble (DPE, amiante, DTG).</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette transparence est bénéfique pour le marché immobilier : elle réduit les litiges
          post-vente et permet aux acquéreurs de s'engager en toute connaissance de cause.
        </p>

        {/* En resume */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          En résumé : les obligations du vendeur en 2026
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous vendez un lot en copropriété en 2026, vous devez :
        </p>
        <ol className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-decimal mb-4">
          <li>Rassembler tous les documents prévus par l'article L.721-2 du CCH.</li>
          <li>Établir un pré-état daté (vous-même, via un service en ligne ou via le syndic).</li>
          <li>Annexer le pré-état daté et les documents au compromis de vente.</li>
          <li>Fournir les diagnostics techniques obligatoires.</li>
          <li>Demander l'état daté au syndic après la signature du compromis (obligatoire, max 380 EUR).</li>
        </ol>

        <RelatedArticles currentSlug="loi-alur-copropriete" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Conformez-vous à la loi ALUR facilement
          </h2>
          <p className="text-secondary-500 mb-6">
            Pack Vendeur génère votre pré-état daté conforme à l'article L.721-2 du CCH en 5 minutes.
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
