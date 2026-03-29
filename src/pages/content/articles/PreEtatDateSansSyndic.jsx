import { Link } from 'react-router-dom';
import { ArrowRight, Clock, ShieldCheck, Scale, FileText } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDateSansSyndic() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pré-état daté sans syndic : comment éviter les frais"
        description="Pré-état daté sans syndic : c'est légal (CSN). Pre-etat-date.ai génère votre document automatiquement pour 24,99 EUR au lieu de 150 à 600 EUR chez le syndic."
        canonical="/guide/pre-etat-date-sans-syndic"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pré-état daté sans syndic : comment éviter les frais",
        description: "Le vendeur peut établir le pré-état daté sans passer par le syndic. Base légale, position du CSN et solution en ligne à 24,99 EUR.",
        slug: 'pre-etat-date-sans-syndic',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pré-état daté sans syndic' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Le syndic peut-il m\'empêcher de faire le pré-état daté moi-même ?',
          answer: "Non. Le pré-état daté n'est pas un acte réservé au syndic. L'article L.721-2 du Code de la construction et de l'habitation (CCH) impose au vendeur de fournir ce document, mais ne désigne aucun professionnel pour l'établir. Le Conseil Supérieur du Notariat a confirmé que le vendeur peut le rédiger lui-même à partir des documents de la copropriété. Le syndic ne peut donc ni vous interdire de le faire, ni refuser de vous transmettre les documents nécessaires.",
        },
        {
          question: 'Le pré-état daté fait sans syndic est-il valable juridiquement ?',
          answer: "Oui. La validité juridique du pré-état daté ne dépend pas de son auteur, mais de son contenu. Dès lors que le document contient toutes les informations requises par l'article L.721-2 du CCH et qu'il est conforme au modèle du Conseil Supérieur du Notariat (CSN), il est pleinement valable. Pre-etat-date.ai utilise exactement ce modèle CSN, garantissant la conformité du document généré.",
        },
        {
          question: 'Comment récupérer mes documents de copropriété sur l\'extranet ?',
          answer: "Depuis la loi ALUR de 2014, chaque copropriétaire doit avoir accès à un extranet sécurisé mis en place par le syndic. Vous y trouverez les PV d'assemblées générales, les appels de fonds, les relevés de charges, la fiche synthétique, le règlement de copropriété et le carnet d'entretien. Connectez-vous avec vos identifiants (fournis par le syndic) et téléchargez les documents au format PDF. Si votre syndic n'a pas encore mis en place cet extranet, il est en infraction avec la loi.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pré-état daté sans syndic' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pré-état daté sans syndic : comment éviter les frais
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
              <dt className="font-semibold min-w-[200px]">Obligation de passer par le syndic :</dt>
              <dd>Non, aucune obligation légale</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Base légale :</dt>
              <dd>Article L.721-2 du Code de la construction et de l'habitation</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Confirmation :</dt>
              <dd>Conseil Supérieur du Notariat (CSN)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Prix via le syndic :</dt>
              <dd>150 à 600 EUR (moyenne 380 EUR)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Prix sur Pre-etat-date.ai :</dt>
              <dd>24,99 EUR TTC</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Économie moyenne :</dt>
              <dd>355 EUR par rapport au syndic</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Contrairement à une idée reçue largement entretenue par les syndics eux-mêmes, votre syndic
          n'a pas le monopole du pré-état daté. Le vendeur peut parfaitement établir ce document
          lui-même, à partir des documents de la copropriété. C'est légal, c'est confirmé par le
          Conseil Supérieur du Notariat, et cela permet d'économiser plusieurs centaines d'euros.
        </p>

        {/* Ce que dit la loi */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que dit la loi
        </h2>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <Scale className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Article L.721-2 du CCH</h3>
            <p className="text-sm text-secondary-600">
              La <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> impose
              au vendeur de fournir un ensemble d'informations financières et juridiques sur la
              copropriété avant la signature du compromis. C'est le pré-état daté.
            </p>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article L.721-2 du Code de la construction et de l'habitation définit les informations
          que le vendeur doit transmettre à l'acquéreur. Mais il ne précise à aucun moment que
          ce document doit être établi par le syndic. Le texte dit simplement que le vendeur doit
          fournir ces informations, sans désigner de professionnel particulier.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté n'est pas un acte authentique (comme l'état daté, qui lui est établi par
          le syndic après la signature du compromis). C'est un document informatif que le vendeur
          peut rédiger à partir des pièces comptables et juridiques de la copropriété. Pour comprendre
          la différence, consultez notre guide sur
          le <Link to="/guide/difference-pre-etat-date-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté vs état daté</Link>.
        </p>

        {/* La position du CSN */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La position du Conseil Supérieur du Notariat
        </h2>
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Le CSN le confirme</h3>
            <p className="text-sm text-secondary-600">
              Le Conseil Supérieur du Notariat a explicitement indiqué que le vendeur peut
              établir le pré-état daté lui-même, à condition de respecter le contenu requis.
            </p>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le CSN a publié un modèle officiel de pré-état daté que le vendeur peut remplir. Ce modèle
          structure les informations en deux parties : les données financières (budget, charges, fonds
          de travaux, impayés) et les données juridiques (procédures en cours, travaux votés,
          diagnostics). En utilisant ce modèle, le vendeur produit un document conforme et accepté
          par tous les notaires.
        </p>

        {/* Pourquoi les syndics facturent si cher */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi les syndics facturent-ils si cher ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté est devenu une source de revenus importante pour les syndics. D'après une
          étude de l'ARC (Association des Responsables de Copropriété), le prix moyen facturé par les
          syndics pour ce document est de 380 EUR, avec des extrêmes allant de 150 EUR à plus de 600 EUR.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette facturation élevée s'explique par plusieurs facteurs : l'opacité des honoraires de
          mutation, le monopole de fait exercé par les syndics qui laissent croire aux copropriétaires
          qu'ils sont les seuls habilités, et les charges cachées (frais de photocopie, frais d'envoi,
          supplément urgence). Notre enquête détaillée sur
          les <Link to="/guide/charges-copropriete-evolution-syndic" className="text-primary-600 hover:text-primary-800 font-medium">charges de copropriété</Link> révèle
          l'ampleur de cette situation.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le rapport de la DGCCRF (Direction générale de la concurrence) a régulièrement pointé du
          doigt ces pratiques, qualifiant certains tarifs de pré-état daté de disproportionnés par
          rapport au travail réellement effectué par le syndic.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comparatif : via le syndic vs sans syndic
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Via le syndic</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Sans syndic (Pre-etat-date.ai)</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Prix</td>
                <td className="border border-secondary-200 px-4 py-3">150 à 600 EUR (moy. 380 EUR)</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">24,99 EUR</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Délai</td>
                <td className="border border-secondary-200 px-4 py-3">15 à 30 jours</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 minutes</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Conformité CSN</td>
                <td className="border border-secondary-200 px-4 py-3">Variable selon le syndic</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Garantie</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Disponibilité</td>
                <td className="border border-secondary-200 px-4 py-3">Heures de bureau</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">24h/24, 7j/7</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Partage notaire</td>
                <td className="border border-secondary-200 px-4 py-3">Email / courrier</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Lien sécurisé instantané</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Cross-validation</td>
                <td className="border border-secondary-200 px-4 py-3">Non</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Automatique (tantièmes, charges)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Comment le faire sans syndic */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment le faire sans syndic avec Pre-etat-date.ai
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          le service génère votre pré-état daté automatiquement, sans aucune intervention du syndic. Le processus
          se déroule en 4 étapes simples :
        </p>
        <ol className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-decimal mb-6">
          <li>
            <strong>Téléchargez vos documents</strong> : déposez les PDF récupérés sur l'extranet de
            votre syndic (PV d'AG, appels de fonds, relevés de charges, diagnostics).
          </li>
          <li>
            <strong>L'IA analyse automatiquement</strong> : notre intelligence artificielle extrait
            les données financières, juridiques et techniques en quelques minutes, sans saisie manuelle.
          </li>
          <li>
            <strong>Validez les informations</strong> : un formulaire pré-rempli vous permet de
            vérifier chaque donnée. L'IA signale les incohérences (tantièmes, charges, provisions).
          </li>
          <li>
            <strong>Recevez votre pré-état daté</strong> : le PDF conforme au modèle CSN est généré
            instantanément, avec un lien sécurisé à transmettre à votre notaire.
          </li>
        </ol>

        {/* Documents à récupérer */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les documents à récupérer sur l'extranet
        </h2>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <FileText className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Ce sont VOS documents</h3>
            <p className="text-sm text-secondary-600">
              En tant que copropriétaire, vous avez un droit d'accès à tous les documents de la
              copropriété. Le syndic est tenu de les mettre à disposition sur l'extranet depuis
              la loi ALUR (2014).
            </p>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Connectez-vous à l'extranet de votre syndic et téléchargez les documents suivants :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Les <strong>PV des 3 dernières assemblées générales</strong> (résolutions votées, travaux, procédures).</li>
          <li>Les <strong>appels de fonds</strong> et <strong>relevés de charges</strong> du dernier exercice comptable.</li>
          <li>La <strong>fiche synthétique</strong> de la copropriété (obligatoire depuis 2017).</li>
          <li>Le <strong>règlement de copropriété</strong> et l'état descriptif de division.</li>
          <li>Le <strong>carnet d'entretien</strong> de l'immeuble.</li>
          <li>Les <strong>diagnostics immobiliers</strong> en votre possession (DPE, amiante, électricité, etc.).</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour la liste complète, consultez notre guide sur
          les <Link to="/guide/documents-necessaires-vente" className="text-primary-600 hover:text-primary-800 font-medium">documents nécessaires pour la vente en copropriété</Link>.
          Si certains documents manquent, l'IA de Pre-etat-date.ai travaillera avec ce que vous
          fournissez et signalera précisément les informations manquantes.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le syndic peut-il m'empêcher de faire le pré-état daté moi-même ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Le pré-état daté n'est pas un acte réservé au syndic. L'article L.721-2 du CCH
              impose au vendeur de fournir ce document, mais ne désigne aucun professionnel pour
              l'établir. Le CSN a confirmé que le vendeur peut le rédiger lui-même. Le syndic ne
              peut ni vous interdire de le faire, ni refuser de vous transmettre les documents
              nécessaires via l'extranet.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le pré-état daté fait sans syndic est-il valable juridiquement ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. La validité juridique du pré-état daté ne dépend pas de son auteur, mais de son
              contenu. Dès lors qu'il contient toutes les informations requises par l'article L.721-2
              du CCH et qu'il respecte le modèle CSN, il est pleinement valable.
              Sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
              le modèle CSN officiel est utilisé pour garantir cette conformité. Pour en savoir plus,
              consultez notre guide <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">qu'est-ce qu'un pré-état daté</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Comment récupérer mes documents de copropriété sur l'extranet ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Depuis la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> de
              2014, chaque copropriétaire doit avoir accès à un extranet sécurisé mis en place par le
              syndic. Connectez-vous avec vos identifiants (fournis par le syndic) et téléchargez les
              PV d'AG, appels de fonds, relevés de charges, fiche synthétique et règlement de
              copropriété au format PDF. Si votre syndic n'a pas mis en place cet extranet, il est
              en infraction avec la loi et vous pouvez le mettre en demeure.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-sans-syndic" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Faites votre pré-état daté sans syndic
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR au lieu de 380 EUR en moyenne chez le syndic. Prêt en 5 minutes.
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
