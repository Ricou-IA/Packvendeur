import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema } from '@components/seo/JsonLd';

export default function FicheSynthetiqueCopropriete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Fiche synthétique de copropriété : contenu et obligations"
        description="Tout savoir sur la fiche synthétique de copropriété : contenu obligatoire, qui doit la fournir, où la trouver et son rôle dans la vente."
        canonical="/guide/fiche-synthetique-copropriete"
        type="article"
      />
      <JsonLd
        data={articleSchema({
          title: 'Fiche synthétique de copropriété : contenu et obligations',
          description:
            'Tout savoir sur la fiche synthétique de copropriété : contenu obligatoire, qui doit la fournir, où la trouver et son rôle dans la vente.',
          slug: 'fiche-synthetique-copropriete',
          datePublished: '2026-02-18',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Guides', url: '/guide' },
          { name: 'Fiche synthétique de copropriété' },
        ])}
      />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Fiche synthétique de copropriété : contenu et obligations
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-18">Mis à jour le 18 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            6 min de lecture
          </span>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          La fiche synthétique de copropriété est un document essentiel pour tout copropriétaire, et
          encore plus pour le vendeur d'un lot en copropriété. Instituée par la loi ALUR de 2014, elle
          offre une photographie annuelle de la copropriété : ses caractéristiques, sa situation
          financière et son organisation. Voici tout ce que vous devez savoir sur ce document
          obligatoire.
        </p>

        {/* Section 1 : Definition */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qu'est-ce que la fiche synthétique ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La fiche synthétique de copropriété est un document récapitulatif qui rassemble les
          données financières et techniques essentielles d'une copropriété. Elle a été introduite
          par la <strong>loi ALUR du 24 mars 2014</strong> (article 8-2 de la loi du 10 juillet
          1965) dans un objectif de transparence envers les copropriétaires et les futurs
          acquéreurs.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Concrètement, il s'agit d'un résumé standardisé, mis à jour chaque année par le syndic
          de copropriété, qui permet de comprendre en un coup d'oeil la situation d'un immeuble.
          Ce document est comparable à une "carte d'identité" de la copropriété : il condense en
          quelques pages les informations clés qui seraient autrement dispersées dans de multiples
          documents comptables et juridiques.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Depuis le 1er janvier 2017, toutes les copropriétés sont concernées par cette obligation,
          quelle que soit leur taille. Le syndic doit mettre cette fiche à disposition de chaque
          copropriétaire et la tenir à jour annuellement.
        </p>

        {/* Section 2 : Contenu obligatoire */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Contenu obligatoire
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le contenu de la fiche synthétique est encadré par le décret du 28 juin 2016. Elle doit
          contenir les informations suivantes :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Identification de la copropriété</strong> : nom, adresse, date de création du
            syndicat des copropriétaires et numéro d'immatriculation au registre national des
            copropriétés.
          </li>
          <li>
            <strong>Nombre total de lots</strong> dans la copropriété (lots principaux et lots
            annexes tels que caves, parkings, etc.).
          </li>
          <li>
            <strong>Nom et coordonnées du syndic</strong> en exercice, ainsi que la date d'échéance
            de son mandat.
          </li>
          <li>
            <strong>Budget prévisionnel</strong> voté en assemblée générale pour l'exercice en cours,
            ainsi que les charges courantes par quote-part.
          </li>
          <li>
            <strong>Dettes fournisseurs de la copropriété</strong> : montant total des sommes dues
            par le syndicat des copropriétaires à ses prestataires et fournisseurs.
          </li>
          <li>
            <strong>Impayés des copropriétaires</strong> : montant global des impayés de charges au
            sein de la copropriété, un indicateur de la santé financière collective.
          </li>
          <li>
            <strong>Fonds de travaux</strong> : solde du fonds de travaux obligatoire (loi ALUR),
            alimenté annuellement par les cotisations des copropriétaires.
          </li>
          <li>
            <strong>Contrat d'assurance</strong> de l'immeuble : référence du contrat et nom de
            l'assureur.
          </li>
          <li>
            <strong>Diagnostics techniques</strong> existants au niveau de l'immeuble : Diagnostic
            Technique Global (DTG), plan pluriannuel de travaux (PPT) s'ils ont été réalisés.
          </li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Ces informations doivent être présentées de manière claire et lisible. Le format n'est pas
          imposé par la loi, mais la plupart des syndics utilisent un modèle standardisé qui facilite
          la lecture et la comparaison d'une année sur l'autre.
        </p>

        {/* Section 3 : Qui doit la fournir */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qui doit la fournir ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est le <strong>syndic de copropriété</strong> qui a l'obligation légale d'établir et de
          mettre à jour la fiche synthétique chaque année, conformément à l'article 8-2 de la loi
          du 10 juillet 1965. Cette mission fait partie de ses fonctions de base et ne peut pas
          donner lieu à une facturation supplémentaire au-delà de son forfait de gestion courante.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le syndic doit la mettre à disposition de chaque copropriétaire qui en fait la demande. En
          cas de vente, il doit la transmettre au vendeur pour qu'elle soit annexée au dossier de
          vente. La fiche doit être actualisée après chaque assemblée générale annuelle, pour
          refléter les dernières décisions votées et les comptes approuvés.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          <strong>Que se passe-t-il si le syndic ne la fournit pas ?</strong> Le syndic qui ne met
          pas la fiche synthétique à disposition des copropriétaires s'expose à des sanctions. Tout
          copropriétaire peut le mettre en demeure par lettre recommandée avec accusé de réception. Si
          le syndic ne s'exécute pas dans un délai d'un mois, le conseil syndical ou tout
          copropriétaire peut saisir le tribunal judiciaire pour obtenir une injonction de faire,
          éventuellement assortie d'une astreinte financière.
        </p>

        {/* Section 4 : Ou la trouver */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Où la trouver ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Plusieurs canaux permettent d'obtenir la fiche synthétique de votre copropriété :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>L'extranet du syndic</strong> : depuis la loi ALUR, tout syndic professionnel
            doit proposer un espace en ligne sécurisé à ses copropriétaires. La fiche synthétique
            y est généralement disponible dans la rubrique "Documents de la copropriété" ou
            "Documents généraux". C'est le moyen le plus rapide et le plus simple d'y accéder.
          </li>
          <li>
            <strong>Demande par email ou courrier</strong> : vous pouvez écrire directement à votre
            syndic pour lui demander la fiche synthétique. Mentionnez l'article 8-2 de la loi du
            10 juillet 1965 pour rappeler son obligation légale. Le syndic doit y répondre dans un
            délai raisonnable.
          </li>
          <li>
            <strong>Lors de l'assemblée générale</strong> : la fiche synthétique est souvent
            jointe à la convocation de l'assemblée générale annuelle ou remise lors de la réunion.
            Vérifiez vos courriers et emails de convocation.
          </li>
          <li>
            <strong>Registre national des copropriétés</strong> : certaines informations figurant
            dans la fiche synthétique sont également disponibles sur le registre national des
            copropriétés (registre-coproprietes.gouv.fr), bien que ce registre ne contienne pas
            l'intégralité du document.
          </li>
        </ul>

        {/* Section 5 : Role dans la vente */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Son rôle dans la vente en copropriété
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La fiche synthétique joue un rôle central dans le processus de vente d'un lot en
          copropriété. L'article L.721-2 du Code de la construction et de l'habitation impose au
          vendeur d'annexer ce document à la promesse de vente ou au compromis de vente. Son absence
          peut permettre à l'acquéreur d'invoquer un défaut d'information pour retarder, voire
          annuler la transaction.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Ce document fait partie intégrante du <strong>pré-état daté</strong>, le dossier
          d'information que le vendeur doit constituer avant la signature du compromis. La fiche
          synthétique y apporte les données essentielles sur la copropriété : budget, dettes, nombre
          de lots et identité du syndic. Ces informations permettent à l'acquéreur de se faire une
          idée précise de la santé financière et de l'organisation de la copropriété dans laquelle
          il s'apprête à investir.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour le notaire, la fiche synthétique est un document de référence qu'il vérifie
          systématiquement lors de l'instruction du dossier de vente. Son contenu est recoupé avec
          les autres pièces du dossier (appels de fonds, PV d'AG, relevés de charges) pour s'assurer
          de la cohérence des informations.
        </p>

        {/* Section 6 : Que faire si absent */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que faire si vous ne l'avez pas ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous ne trouvez pas la fiche synthétique de votre copropriété, plusieurs solutions
          s'offrent à vous :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Contactez votre syndic en priorité</strong>. Envoyez un email ou un courrier
            rappelant son obligation légale (article 8-2 de la loi du 10 juillet 1965). Le syndic
            est tenu de vous fournir ce document dans le cadre de sa mission de gestion courante,
            sans frais supplémentaires.
          </li>
          <li>
            <strong>Vérifiez l'extranet de votre syndic</strong>. Le document y est peut-être déjà
            disponible sans que vous le sachiez. Connectez-vous à votre espace copropriétaire et
            explorez les rubriques "Documents" ou "Informations générales".
          </li>
          <li>
            <strong>Sollicitez le conseil syndical</strong>. Le président du conseil syndical
            dispose généralement d'une copie des documents importants de la copropriété. Il peut
            vous orienter ou relayer votre demande auprès du syndic.
          </li>
          <li>
            <strong>Reconstituez les informations</strong>. En dernier recours, les données contenues
            dans la fiche synthétique se retrouvent dans d'autres documents : les PV d'assemblée
            générale pour le budget et les travaux, les appels de fonds pour les charges, et le
            règlement de copropriété pour l'identification des lots. Un outil comme Dossiervente.ai
            peut extraire automatiquement ces informations de vos documents existants.
          </li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Dans tous les cas, ne retardez pas votre vente à cause de ce document. Les informations
          qu'il contient sont certes obligatoires, mais elles existent dans d'autres pièces de
          votre dossier de copropriété. L'essentiel est de pouvoir fournir les données requises à
          l'acquéreur, quelle que soit leur source.
        </p>

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Constituez votre dossier de vente en quelques minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            Dossiervente.ai analyse vos documents de copropriété par IA et génère automatiquement
            votre pré-état daté conforme au modèle CSN.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Générer mon pré-état daté
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>

        {/* Related links */}
        <nav className="mt-10 border-t border-secondary-200 pt-8">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Articles connexes
          </h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/guide/quest-ce-pre-etat-date"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Qu'est-ce qu'un pré-état daté ? Guide complet 2026
              </Link>
            </li>
            <li>
              <Link
                to="/guide/documents-necessaires-vente"
                className="text-primary-600 hover:text-primary-700 hover:underline"
              >
                Documents nécessaires pour vendre en copropriété : la liste complète
              </Link>
            </li>
          </ul>
        </nav>
      </article>
    </div>
  );
}
