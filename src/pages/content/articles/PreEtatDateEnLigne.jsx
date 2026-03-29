import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Globe, Shield, Smartphone } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDateEnLigne() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pré-état daté en ligne : le guide complet 2026"
        description="Votre pré-état daté en ligne prêt en 5 minutes pour 24,99 EUR. Comparatif des solutions en ligne, fonctionnement et avantages du pré-état daté dématérialisé."
        canonical="/guide/pre-etat-date-en-ligne"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pré-état daté en ligne : le guide complet 2026",
        description: "Guide complet pour faire son pré-état daté en ligne. Comparatif des solutions, fonctionnement par IA et avantages du format dématérialisé.",
        slug: 'pre-etat-date-en-ligne',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pré-état daté en ligne' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Le pré-état daté en ligne est-il accepté par les notaires ?',
          answer: "Oui. Le Conseil Supérieur du Notariat (CSN) a confirmé que le vendeur peut établir le pré-état daté lui-même. Un document généré en ligne est accepté par les notaires à condition qu'il soit conforme au modèle CSN et contienne toutes les informations requises par l'article L.721-2 du Code de la construction et de l'habitation. Pre-etat-date.ai utilise le modèle officiel du CSN, garantissant l'acceptation par tous les notaires.",
        },
        {
          question: 'Mes données sont-elles en sécurité ?',
          answer: "Oui. Pre-etat-date.ai applique des mesures strictes de protection des données conformes au RGPD. Toutes les données sont chiffrées en transit et au repos. Les documents uploadés et les dossiers générés sont automatiquement supprimés après 7 jours. Le paiement est sécurisé par Stripe (certifié PCI-DSS), qui traite les informations bancaires sans que Pre-etat-date.ai n'y ait accès.",
        },
        {
          question: 'Puis-je faire mon pré-état daté en ligne depuis mon téléphone ?',
          answer: "Oui. Pre-etat-date.ai est entièrement responsive et fonctionne sur smartphone, tablette et ordinateur. Vous pouvez photographier vos documents papier et les convertir en PDF, ou télécharger directement les PDF depuis l'extranet de votre syndic sur votre téléphone. L'ensemble du processus — dépôt des documents, analyse IA, validation et génération du PDF — se fait depuis votre navigateur mobile.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pré-état daté en ligne' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pré-état daté en ligne : le guide complet 2026
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
              <dt className="font-semibold min-w-[180px]">Prix en ligne :</dt>
              <dd>24,99 EUR TTC sur Pre-etat-date.ai</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Délai :</dt>
              <dd>5 minutes (analyse IA automatique)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Format :</dt>
              <dd>PDF conforme au modèle CSN</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Partage notaire :</dt>
              <dd>Lien sécurisé instantané</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Sécurité :</dt>
              <dd>RGPD, données supprimées après 7 jours</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Paiement :</dt>
              <dd>CB, Apple Pay, Google Pay (Stripe PCI-DSS)</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté, document obligatoire pour vendre un bien en copropriété, se fait
          désormais en ligne, en quelques minutes. Fini l'attente de plusieurs semaines chez le
          syndic : les solutions dématérialisées permettent de générer ce document rapidement, à
          moindre coût et sans quitter son domicile. Ce guide vous explique comment choisir la
          bonne solution et comment fonctionne le processus en ligne.
        </p>

        {/* Pourquoi en ligne */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi faire son pré-état daté en ligne ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Jusqu'à récemment, la seule option pour obtenir un pré-état daté était de passer par le
          syndic, avec un prix moyen de 380 EUR et un délai de 15 à 30 jours. Les solutions en ligne
          changent la donne sur trois aspects :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Gain de temps considérable</strong> : de quelques minutes (IA) à quelques heures
            (saisie manuelle), contre plusieurs semaines chez le syndic.
          </li>
          <li>
            <strong>Économies substantielles</strong> : de 0 EUR (modèle gratuit) à 80 EUR maximum,
            contre 150 à 600 EUR chez le syndic. Pour un comparatif détaillé des tarifs, consultez notre
            guide sur le <Link to="/guide/cout-pre-etat-date-syndic" className="text-primary-600 hover:text-primary-800 font-medium">coût du pré-état daté chez le syndic</Link>.
          </li>
          <li>
            <strong>Accessibilité 24h/24</strong> : pas besoin d'attendre les heures de bureau. Idéal
            quand le compromis est <Link to="/guide/pre-etat-date-urgent" className="text-primary-600 hover:text-primary-800 font-medium">urgent</Link>.
          </li>
        </ul>

        {/* Les différentes solutions */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les différentes solutions en ligne
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Toutes les solutions en ligne ne se valent pas. On distingue quatre catégories, avec des
          différences majeures en termes de prix, de délai et de fiabilité :
        </p>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Solution en ligne</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Prix</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Délai</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Méthode</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pre-etat-date.ai</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">24,99 EUR</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 minutes</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Analyse automatique par IA</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Services à saisie manuelle</td>
                <td className="border border-secondary-200 px-4 py-3">19 à 30 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">30 min à 2h</td>
                <td className="border border-secondary-200 px-4 py-3">Formulaire à remplir soi-même</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Services avec traitement humain</td>
                <td className="border border-secondary-200 px-4 py-3">50 à 80 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">24 à 72h</td>
                <td className="border border-secondary-200 px-4 py-3">Documents envoyés, humain traite</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Modèle gratuit (Word/PDF)</td>
                <td className="border border-secondary-200 px-4 py-3">0 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Variable</td>
                <td className="border border-secondary-200 px-4 py-3">Template à remplir manuellement</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les services à saisie manuelle demandent au vendeur de recopier lui-même toutes les données
          financières dans un formulaire en ligne. Le risque d'erreur est élevé, surtout pour les
          montants de charges, les tantièmes ou les dates d'exercice. Les services avec traitement
          humain sont plus fiables mais plus lents et plus chers. Les modèles gratuits ne garantissent
          pas la conformité au modèle CSN et laissent le vendeur seul face à la complexité des données.
        </p>

        {/* Comment ça marche */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment ça marche sur Pre-etat-date.ai
        </h2>
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <Globe className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">100 % en ligne, rien à installer</h3>
            <p className="text-sm text-secondary-600">
              Tout se fait dans votre navigateur web. Pas d'application à télécharger, pas de
              logiciel à installer. Compatible ordinateur, tablette et smartphone.
            </p>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          le processus est entièrement automatisé grâce à l'intelligence artificielle :
        </p>
        <ol className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-decimal mb-6">
          <li>
            <strong>Déposez vos documents PDF</strong> : PV d'assemblées générales, appels de fonds,
            relevés de charges, diagnostics immobiliers. Glissez-déposez vos fichiers, l'IA accepte
            les PDF tels quels.
          </li>
          <li>
            <strong>L'IA classe et analyse automatiquement</strong> : chaque document est identifié
            (type, date, contenu) puis analysé en profondeur. Les données financières, juridiques et
            techniques sont extraites en parallèle, sans aucune saisie manuelle de votre part.
          </li>
          <li>
            <strong>Validez les données extraites</strong> : un formulaire pré-rempli vous présente
            toutes les informations. L'IA signale les incohérences (écart de charges, tantièmes
            suspects, provisions anormales) pour que vous puissiez vérifier avant validation.
          </li>
          <li>
            <strong>Recevez votre pré-état daté en PDF</strong> : le document conforme au modèle
            du Conseil Supérieur du Notariat est généré instantanément. Un lien de partage sécurisé
            vous permet de le transmettre directement à votre notaire.
          </li>
        </ol>

        {/* Avantages du dématérialisé */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Avantages du pré-état daté dématérialisé
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Au-delà du gain de temps et d'argent, le format dématérialisé apporte plusieurs avantages
          concrets pour la vente :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Partage notaire instantané</strong> : un lien sécurisé permet au notaire d'accéder
            au pré-état daté et aux documents annexés en un clic, sans pièce jointe volumineuse.
          </li>
          <li>
            <strong>Zéro papier</strong> : plus besoin d'imprimer, de scanner ou d'envoyer par
            courrier. Tout est numérique et accessible en ligne.
          </li>
          <li>
            <strong>Conformité RGPD</strong> : sur Pre-etat-date.ai, les données sont automatiquement
            supprimées après 7 jours, conformément au règlement européen sur la protection des données.
          </li>
          <li>
            <strong>Cross-validation automatique</strong> : l'IA vérifie la cohérence entre les
            tantièmes, le budget prévisionnel et les charges du lot, et signale toute anomalie.
          </li>
          <li>
            <strong>Vérification DPE</strong> : le numéro ADEME du DPE est automatiquement vérifié
            auprès de la base nationale pour confirmer sa validité. En savoir plus sur
            le <Link to="/guide/dpe-vente-appartement" className="text-primary-600 hover:text-primary-800 font-medium">DPE et la vente d'appartement</Link>.
          </li>
        </ul>

        {/* Sécurité */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Sécurité et confidentialité
        </h2>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Vos données sont protégées</h3>
            <p className="text-sm text-secondary-600">
              Pre-etat-date.ai est conforme au RGPD. Toutes les données sont chiffrées et
              automatiquement supprimées après 7 jours.
            </p>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La sécurité est un enjeu majeur lorsqu'on transmet des documents financiers en ligne.
          Sur Pre-etat-date.ai, plusieurs mesures garantissent la confidentialité de vos données :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Chiffrement des données</strong> : toutes les communications sont chiffrées
            via HTTPS. Les documents sont stockés de manière sécurisée avec des URL signées à durée limitée.
          </li>
          <li>
            <strong>Suppression automatique</strong> : conformément au RGPD, l'ensemble des données
            (documents uploadés, dossier généré, PDF) est supprimé après 7 jours.
          </li>
          <li>
            <strong>Paiement sécurisé</strong> : le paiement est géré par Stripe, leader mondial
            du paiement en ligne, certifié PCI-DSS. Pre-etat-date.ai n'a jamais accès à vos
            données bancaires.
          </li>
          <li>
            <strong>Lien de partage sécurisé</strong> : le lien envoyé au notaire utilise un
            identifiant unique non devinable. Il expire automatiquement avec le dossier.
          </li>
        </ul>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le pré-état daté en ligne est-il accepté par les notaires ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. Le CSN a confirmé que le vendeur peut établir le pré-état daté lui-même. Un
              document généré en ligne est accepté par les notaires dès lors qu'il est conforme
              au modèle CSN et contient toutes les informations requises par
              l'article L.721-2 du CCH. Pre-etat-date.ai utilise le modèle officiel du CSN.
              Pour en savoir plus, consultez notre guide
              sur <Link to="/guide/qui-fait-le-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">qui fait le pré-état daté</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Mes données sont-elles en sécurité ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. Pre-etat-date.ai est conforme au RGPD. Toutes les données sont chiffrées en
              transit et au repos. Les documents uploadés et les dossiers générés sont automatiquement
              supprimés après 7 jours. Le paiement est sécurisé par Stripe (certifié PCI-DSS) :
              vos données bancaires ne transitent jamais par nos serveurs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Puis-je faire mon pré-état daté en ligne depuis mon téléphone ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. Pre-etat-date.ai est entièrement responsive et fonctionne sur smartphone, tablette
              et ordinateur. Vous pouvez télécharger vos documents depuis l'extranet de votre syndic
              directement sur votre téléphone, puis les déposer sur Pre-etat-date.ai. L'ensemble du
              processus se fait depuis votre navigateur mobile, sans application à installer.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <Smartphone className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Astuce mobile</h3>
            <p className="text-sm text-secondary-600">
              Si vos documents sont au format papier, vous pouvez les photographier avec votre
              smartphone et les convertir en PDF avec des applications gratuites comme Adobe Scan
              ou l'application Fichiers d'Apple, avant de les déposer sur Pre-etat-date.ai.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-en-ligne" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Votre pré-état daté en ligne en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR, prêt en 5 minutes. 100 % en ligne, conforme CSN, accepté par les notaires.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
