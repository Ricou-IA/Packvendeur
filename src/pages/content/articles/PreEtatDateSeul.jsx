import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Zap, Shield } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDateSeul() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Faire son pré-état daté seul : c'est légal et simple"
        description="Le vendeur peut faire son pré-état daté seul, sans syndic. Le CSN l'a confirmé. Avec Pre-etat-date.ai, 4 étapes et 5 minutes suffisent. 24,99 EUR."
        canonical="/guide/pre-etat-date-seul"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Faire son pré-état daté seul : c'est légal et simple",
        description: "Base légale, confirmation du CSN et guide pratique pour réaliser son pré-état daté soi-même. Comparatif des options : papier, IA, syndic.",
        slug: 'pre-etat-date-seul',
        datePublished: '2026-03-28',
        dateModified: '2026-04-26',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Pré-état daté', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pré-état daté seul' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'A-t-on le droit de faire le pré-état daté soi-même ?',
          answer: "Oui. L'article L.721-2 du Code de la construction et de l'habitation impose de fournir un pré-état daté lors de la vente d'un lot en copropriété, mais ne désigne pas le syndic comme seul auteur possible. Le Conseil Supérieur du Notariat (CSN) a confirmé que le vendeur peut réaliser ce document lui-même, à condition qu'il contienne toutes les informations requises par la loi.",
        },
        {
          question: 'Le syndic peut-il refuser de fournir les documents ?',
          answer: "Non. Le syndic a l'obligation légale de mettre à disposition les documents de la copropriété (PV d'AG, comptes, règlement) via un extranet sécurisé depuis la loi ALUR de 2014. Tout copropriétaire y a accès. Le syndic ne peut pas facturer l'accès à l'extranet. Si vous rencontrez des difficultés, rappelez au syndic ses obligations au titre de l'article 18 de la loi du 10 juillet 1965.",
        },
        {
          question: 'Le pré-état daté fait seul est-il accepté par le notaire ?',
          answer: "Oui, à condition qu'il soit conforme au modèle du Conseil Supérieur du Notariat et qu'il contienne toutes les informations requises par l'article L.721-2 du CCH. Un pré-état daté généré par Pre-etat-date.ai est accepté par les notaires car il utilise ce modèle officiel et inclut les données financières, juridiques et techniques complètes.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Pré-état daté', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pré-état daté seul' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Faire son pré-état daté seul : c'est légal et simple
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-28">Mis à jour le 28 mars 2026</time>
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
              <dt className="font-semibold min-w-[180px]">Base légale :</dt>
              <dd>Article L.721-2 du Code de la construction et de l'habitation</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Confirmation CSN :</dt>
              <dd>Oui, le vendeur peut établir le pré-état daté lui-même</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Prix syndic :</dt>
              <dd>150 à 600 EUR (selon taille de la copropriété)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Prix Pre-etat-date.ai :</dt>
              <dd>24,99 EUR TTC</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Documents nécessaires :</dt>
              <dd>6 à 8 PDF (disponibles sur l'extranet du syndic)</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Beaucoup de vendeurs pensent qu'ils doivent obligatoirement passer par le syndic
          pour obtenir le <Link to="/" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">pré-état daté</Link>. C'est faux. La loi autorise le vendeur à le
          réaliser lui-même, et le Conseil Supérieur du Notariat l'a confirmé. Avec les
          bons outils, c'est même plus rapide, moins cher et tout aussi conforme.
        </p>

        {/* Legal basis */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La base légale : ce que dit la loi
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article L.721-2 du Code de la construction et de l'habitation (CCH), créé par
          la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR de 2014</Link>,
          impose au vendeur de fournir un certain nombre d'informations à l'acquéreur lors
          de la vente d'un lot en copropriété. Ces informations constituent le pré-état daté.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Point essentiel : la loi ne désigne <strong>pas</strong> le syndic comme seul auteur
          possible du pré-état daté. Elle définit les informations obligatoires, pas la
          personne qui doit les compiler. Le vendeur, en tant que copropriétaire, a accès
          à tous les documents nécessaires via l'extranet du syndic.
        </p>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Position du Conseil Supérieur du Notariat</h3>
            <p className="text-sm text-secondary-600">
              Le CSN a confirmé que le vendeur peut réaliser le pré-état daté lui-même,
              à condition que le document contienne toutes les informations requises par la loi
              et soit présenté dans un format conforme. Pre-etat-date.ai utilise le modèle
              officiel du CSN pour garantir cette conformité.
            </p>
          </div>
        </div>

        {/* The 3 options */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 3 façons de faire son pré-état daté seul
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous décidez de ne pas passer par le syndic, trois options s'offrent à vous :
        </p>

        {/* Comparison table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Seul (modèle papier)</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Seul (Pre-etat-date.ai)</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Via le syndic</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Prix</td>
                <td className="border border-secondary-200 px-4 py-3">0 EUR</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">24,99 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">150-600 EUR</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Temps</td>
                <td className="border border-secondary-200 px-4 py-3">2 à 5 heures</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 minutes</td>
                <td className="border border-secondary-200 px-4 py-3">15-30 jours</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Risque d'erreur</td>
                <td className="border border-secondary-200 px-4 py-3">Élevé</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Faible (cross-validation IA)</td>
                <td className="border border-secondary-200 px-4 py-3">Faible</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Conformité CSN</td>
                <td className="border border-secondary-200 px-4 py-3">Non garantie</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Garantie</td>
                <td className="border border-secondary-200 px-4 py-3">Variable</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Accepté par les notaires</td>
                <td className="border border-secondary-200 px-4 py-3">Selon qualité</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Oui</td>
                <td className="border border-secondary-200 px-4 py-3">Oui</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Why AI is the best middle ground */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi l'IA est le meilleur compromis
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le modèle papier est gratuit mais risqué : avec plus de 70 champs à remplir
          manuellement, les erreurs sont fréquentes. Un pré-état daté incomplet ou inexact
          peut être refusé par le notaire, retarder la vente, ou même engager la
          responsabilité du vendeur.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le syndic est fiable mais lent et cher. Et la qualité varie : certains syndics
          fournissent des pré-états datés incomplets ou avec des données obsolètes.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link> offre
          le meilleur des deux mondes : la rapidité et le prix de l'autonomie, avec la
          conformité et la fiabilité d'un service professionnel. L'IA extrait les données de
          vos documents officiels, effectue des vérifications croisées automatiques, et génère
          un document au format CSN.
        </p>

        {/* Documents from syndic extranet */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Où trouver les documents nécessaires
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Depuis la loi ALUR, chaque syndic doit mettre à disposition un extranet sécurisé
          où les copropriétaires accèdent librement aux documents de la copropriété. Voici
          ce dont vous avez besoin :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>PV des assemblées générales</strong> des 2-3 dernières années (votes de travaux, procédures).</li>
          <li><strong>Appels de fonds</strong> et <strong>relevés de charges</strong> du dernier exercice.</li>
          <li><strong>Fiche synthétique</strong> de la copropriété (données financières et techniques clés).</li>
          <li><strong>Règlement de copropriété</strong> et état descriptif de division (tantièmes).</li>
          <li><strong>Carnet d'entretien</strong> de l'immeuble.</li>
          <li><strong>Diagnostics immobiliers</strong> (DPE, amiante, électricité, etc.).</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour un guide complet, consultez notre article sur
          les <Link to="/guide/documents-necessaires-vente" className="text-primary-600 hover:text-primary-800 font-medium">documents nécessaires à la vente en copropriété</Link>.
          Si vous ne trouvez pas certains documents sur l'extranet, le syndic est tenu de
          vous les fournir sur demande.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              A-t-on le droit de faire le pré-état daté soi-même ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. L'article L.721-2 du CCH impose de fournir certaines informations à
              l'acquéreur, mais ne désigne pas le syndic comme seul auteur du document.
              Le Conseil Supérieur du Notariat a confirmé que le vendeur peut établir le
              pré-état daté lui-même, à condition de respecter le contenu requis par la loi.
              Consultez notre guide sur <Link to="/guide/qui-fait-le-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">qui peut faire le pré-état daté</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le syndic peut-il refuser de fournir les documents ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Depuis la loi ALUR, le syndic est tenu de mettre à disposition un extranet
              sécurisé où chaque copropriétaire peut accéder aux documents de la copropriété :
              PV d'assemblée générale, comptes, règlement. Si le syndic refuse ou traîne,
              rappelez-lui ses obligations au titre de l'article 18 de la loi du 10 juillet 1965.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le pré-état daté fait seul est-il accepté par le notaire ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, à condition qu'il soit conforme au modèle CSN et qu'il contienne toutes les
              informations requises par la loi. Un document généré par Pre-etat-date.ai
              utilise le modèle officiel et inclut les données financières, juridiques et
              techniques complètes, avec un lien de partage sécurisé directement utilisable par le notaire.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-seul" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Faites votre pré-état daté vous-même, en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR au lieu de 150-600 EUR chez le syndic. Conforme CSN, accepté par les notaires.
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
