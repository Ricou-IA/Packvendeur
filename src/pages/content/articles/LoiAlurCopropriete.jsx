import { Link } from 'react-router-dom';
import { ArrowRight, AlertTriangle, Clock, Scale, FileText, Info } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function LoiAlurCopropriete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Loi ALUR et copropriété : ce que le vendeur doit savoir"
        description="Loi ALUR et vente en copropriété : liste exhaustive des documents exigés par l'article L.721-2 du CCH, précisions juridiques sur le pré-état daté et position du CSN."
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

      <JsonLd data={faqSchema([
        {
          question: 'Le pré-état daté est-il un document officiel créé par la loi ALUR ?',
          answer: 'Non. Une réponse ministérielle du 16 septembre 2014 précise que l\'article 54 de la loi ALUR n\'avait pas pour objet de créer un nouveau document comptable, mais de rendre obligatoire l\'annexion à la promesse de vente d\'informations destinées à éclairer l\'acquéreur. Le terme « pré-état daté » est un terme de pratique professionnelle : l\'article L.721-2 du CCH ne l\'emploie pas. C\'est le contenu qui est réglementé, pas la forme du document.',
        },
        {
          question: 'Quelles sont les obligations du vendeur en copropriété selon la loi ALUR ?',
          answer: 'L\'article L.721-2 du CCH (modifié par la loi Climat et Résilience 2021) impose au vendeur de fournir à l\'acquéreur 6 catégories d\'informations avant le compromis : (1°) documents sur l\'organisation de l\'immeuble (fiche synthétique, règlement de copropriété, PV des 3 dernières AG), (2°) informations financières (charges courantes et hors budget des 2 derniers exercices, sommes dues par l\'acquéreur, impayés, fonds de travaux), (3°) le carnet d\'entretien, (4°) une notice d\'information sur les droits des copropriétaires, (5°) les conclusions du DTG le cas échéant, (6°) le plan pluriannuel de travaux adopté ou son projet.',
        },
        {
          question: 'Le syndic est-il obligatoire pour établir le pré-état daté ?',
          answer: 'Non. Le Conseil Supérieur du Notariat (CSN) a confirmé que le vendeur n\'est pas contraint de passer par le syndic pour le pré-état daté. Le vendeur peut le constituer lui-même à partir des documents en sa possession ou de ceux disponibles sur l\'extranet du syndic. Des services comme Pre-etat-date.ai (24,99 EUR) permettent de le générer automatiquement via l\'IA.',
        },
        {
          question: 'Que se passe-t-il si les documents ALUR manquent au compromis ?',
          answer: 'Si le pré-état daté n\'est pas remis avant ou lors de la signature du compromis, le délai de rétractation de 10 jours de l\'acquéreur ne commence pas à courir. Il ne démarre qu\'à la réception du dernier document manquant. Un dossier incomplet peut retarder la vente, prolonger le délai de rétractation, et fragiliser juridiquement la transaction.',
        },
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
          <time dateTime="2026-03-02">Mis à jour le 2 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            12 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <dl className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 grid sm:grid-cols-2 gap-x-8 gap-y-2 text-sm">
          <div className="contents">
            <dt className="font-semibold text-blue-900">Loi</dt>
            <dd className="text-blue-800">ALUR du 24 mars 2014</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Article clé</dt>
            <dd className="text-blue-800">L.721-2 du CCH (modifié loi Climat 2021)</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Infos obligatoires</dt>
            <dd className="text-blue-800">6 rubriques (art. L.721-2 1° à 6°)</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Nature juridique</dt>
            <dd className="text-blue-800">Pas un document officiel (rép. min. 16/09/2014)</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Position CSN</dt>
            <dd className="text-blue-800">Syndic non obligatoire pour le pré-état daté</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Fonds de travaux</dt>
            <dd className="text-blue-800">2,5 % min du budget (art. 14-2)</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Sanction si docs manquants</dt>
            <dd className="text-blue-800">Délai de rétractation suspendu</dd>
          </div>
          <div className="contents">
            <dt className="font-semibold text-blue-900">Dernière modification</dt>
            <dd className="text-blue-800">Loi Climat et Résilience (22 août 2021)</dd>
          </div>
        </dl>

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

        {/* Nature juridique du pre-etat date */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          <span className="flex items-center gap-2">
            <Scale className="h-6 w-6 text-primary-600" />
            Le « pré-état daté » : un terme de pratique, pas un document officiel
          </span>
        </h2>
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 mb-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-indigo-800 leading-relaxed">
              <strong>Précision juridique :</strong> La loi ALUR n'a pas créé de « document type » à
              proprement parler. Une réponse ministérielle du 16 septembre 2014 précise que les
              dispositions de l'article 54 de la loi ALUR n'avaient pas pour objet de créer un nouveau
              document comptable, mais de rendre obligatoire l'annexion à la promesse de vente d'un
              certain nombre d'informations destinées à éclairer l'acquéreur.
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le terme « pré-état daté » est un <strong>terme de pratique professionnelle</strong> utilisé
          par les notaires et les syndics. L'article L.721-2 du Code de la Construction et de
          l'Habitation (CCH) ne l'emploie pas. C'est le <strong>contenu</strong> qui est réglementé
          par la loi, pas la forme du document.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En pratique, c'est pour cette raison que les syndics et notaires ont créé des « questionnaires
          avant-contrat » standardisés qui compilent toutes ces informations dans un seul document. Mais
          il n'existe pas de formulaire officiel imposé par la loi — seul le contenu est obligatoire.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est justement cette approche que <Link to="/dossier" className="text-primary-600 hover:underline font-medium">Pre-etat-date.ai</Link> adopte :
          structurer et automatiser la collecte des informations exigées par l'article L.721-2,
          sans passer par le syndic ni son formulaire propriétaire.
        </p>

        {/* Article L.721-2 : liste exhaustive */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          <span className="flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary-600" />
            Article L.721-2 du CCH : la liste exhaustive des documents obligatoires
          </span>
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article L.721-2 du CCH, créé par la loi ALUR et <strong>modifié par la loi Climat et
          Résilience du 22 août 2021</strong>, liste précisément les informations à fournir à
          l'acquéreur dès la promesse de vente. Voici la liste exhaustive, telle qu'elle est en
          vigueur en 2026 :
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          1° Documents relatifs à l'organisation de l'immeuble
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>a)</strong> La <strong>fiche synthétique</strong> de la copropriété prévue à l'article 8-2 de la loi du 10 juillet 1965.</li>
          <li><strong>b)</strong> Le <strong>règlement de copropriété</strong> et l'<strong>état descriptif de division</strong> ainsi que les actes les modifiant, s'ils ont été publiés.</li>
          <li><strong>c)</strong> Les <strong>procès-verbaux des assemblées générales</strong> des trois dernières années, sauf lorsque le copropriétaire vendeur n'a pas été en mesure de les obtenir auprès du syndic.</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          2° Informations relatives à la situation financière
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>a)</strong> Le montant des <strong>charges courantes</strong> du budget prévisionnel et des <strong>charges hors budget</strong> payées par le vendeur au titre des deux derniers exercices comptables.</li>
          <li><strong>b)</strong> Les <strong>sommes susceptibles d'être dues</strong> au syndicat par l'acquéreur (provisions non encore exigibles, avances, fonds de travaux).</li>
          <li><strong>c)</strong> L'<strong>état global des impayés</strong> de charges au sein du syndicat et de la <strong>dette vis-à-vis des fournisseurs</strong>.</li>
          <li><strong>d)</strong> Lorsque le syndicat dispose d'un fonds de travaux, le <strong>montant de la part du fonds de travaux</strong> rattachée au lot principal vendu et le montant de la dernière cotisation versée par le vendeur.</li>
        </ul>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-sm text-blue-800">
          <strong>Condition de fraîcheur :</strong> Les informations financières des points a), c) et d)
          doivent être à jour des informations soumises à l'assemblée générale annuelle chargée
          d'approuver les comptes précédant la signature de la promesse de vente.
        </div>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          3° Le carnet d'entretien de l'immeuble
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Document retraçant les travaux réalisés sur les parties communes, les contrats d'entretien
          et de maintenance, et l'identité du syndic en exercice.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          4° Notice d'information
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Une <strong>notice d'information</strong> relative aux droits et obligations des copropriétaires
          et au fonctionnement des instances du syndicat. Un modèle type est fixé par arrêté.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          5° Diagnostic technique global (DTG)
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le cas échéant, les <strong>conclusions du DTG</strong> prévu à l'article L.731-1 du CCH.
          Le DTG n'est pas obligatoire pour toutes les copropriétés, mais s'il existe, ses conclusions
          doivent être communiquées.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          6° Plan pluriannuel de travaux (PPT)
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le <strong>plan pluriannuel de travaux (PPT)</strong> adopté par l'assemblée générale, ou à
          défaut le projet de PPT s'il a été élaboré. Cette obligation, ajoutée par la <strong>loi Climat
          et Résilience de 2021</strong>, renforce la transparence sur les travaux à venir dans la
          copropriété.
        </p>

        {/* Consequences pour le vendeur */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les conséquences concrètes pour le vendeur
        </h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-red-800 leading-relaxed">
              <strong>Sanction légale :</strong> Si le pré-état daté n'est pas remis avant ou lors de la
              signature du compromis, le <strong>délai de rétractation de 10 jours</strong> de l'acquéreur
              <strong> ne commence pas à courir</strong>. Concrètement, l'acquéreur conserve le droit de
              se rétracter sans motif tant que tous les documents n'ont pas été fournis.
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En pratique, cela signifie que le vendeur a tout intérêt à <strong>rassembler tous les
          documents avant la signature du compromis</strong>. Un dossier incomplet peut :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Retarder la vente</strong> : le notaire refusera de faire signer un compromis sans les documents obligatoires.</li>
          <li><strong>Suspendre le délai de rétractation</strong> : le compteur de 10 jours ne démarre qu'à la remise du dernier document manquant.</li>
          <li><strong>Fragiliser juridiquement la vente</strong> : l'acquéreur pourrait invoquer un défaut d'information pour demander l'annulation de la vente ou une réduction du prix.</li>
          <li><strong>Engager la responsabilité du vendeur</strong> : en cas de préjudice subi par l'acquéreur du fait d'informations manquantes ou erronées.</li>
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
          <li>Rassembler les 6 catégories d'informations prévues par l'article L.721-2 du CCH (version loi Climat 2021).</li>
          <li>Établir un pré-état daté — vous-même, via un service en ligne ou via le syndic. Rappel : la loi réglemente le contenu, pas la forme ni le prestataire.</li>
          <li>Annexer le pré-état daté et les documents au compromis de vente <strong>avant la signature</strong>, sous peine de suspension du délai de rétractation.</li>
          <li>Fournir les diagnostics techniques obligatoires (DPE, amiante, plomb, etc.).</li>
          <li>Demander l'état daté au syndic après la signature du compromis (obligatoire, plafonné à 380 EUR TTC).</li>
        </ol>

        <div className="bg-green-50 border border-green-200 rounded-lg p-5 mb-4">
          <p className="text-sm text-green-800 leading-relaxed">
            <strong>Bon à savoir :</strong> Il n'existe pas de formulaire officiel type imposé par la loi
            pour le pré-état daté. Ce qui compte, c'est que toutes les informations exigées par l'article
            L.721-2 soient effectivement communiquées à l'acquéreur. C'est exactement ce
            que <Link to="/dossier" className="text-green-700 font-medium hover:underline">Pre-etat-date.ai</Link> structure
            automatiquement à partir de vos documents.
          </p>
        </div>

        <RelatedArticles currentSlug="loi-alur-copropriete" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Conformez-vous à la loi ALUR facilement
          </h2>
          <p className="text-secondary-500 mb-6">
            Pre-etat-date.ai structure automatiquement toutes les informations exigées par l'article L.721-2 du CCH — sans syndic, en 5 minutes, pour 24,99 EUR.
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
