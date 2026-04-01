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
        title="Faire son pr\u00e9-\u00e9tat dat\u00e9 seul : c'est l\u00e9gal et simple"
        description="Le vendeur peut faire son pr\u00e9-\u00e9tat dat\u00e9 seul, sans syndic. Le CSN l'a confirm\u00e9. Avec Pre-etat-date.ai, 4 \u00e9tapes et 5 minutes suffisent. 24,99 EUR."
        canonical="/guide/pre-etat-date-seul"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Faire son pr\u00e9-\u00e9tat dat\u00e9 seul : c'est l\u00e9gal et simple",
        description: "Base l\u00e9gale, confirmation du CSN et guide pratique pour r\u00e9aliser son pr\u00e9-\u00e9tat dat\u00e9 soi-m\u00eame. Comparatif des options : papier, IA, syndic.",
        slug: 'pre-etat-date-seul',
        datePublished: '2026-03-28',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pr\u00e9-\u00e9tat dat\u00e9 seul' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'A-t-on le droit de faire le pr\u00e9-\u00e9tat dat\u00e9 soi-m\u00eame ?',
          answer: "Oui. L'article L.721-2 du Code de la construction et de l'habitation impose de fournir un pr\u00e9-\u00e9tat dat\u00e9 lors de la vente d'un lot en copropri\u00e9t\u00e9, mais ne d\u00e9signe pas le syndic comme seul auteur possible. Le Conseil Sup\u00e9rieur du Notariat (CSN) a confirm\u00e9 que le vendeur peut r\u00e9aliser ce document lui-m\u00eame, \u00e0 condition qu'il contienne toutes les informations requises par la loi.",
        },
        {
          question: 'Le syndic peut-il refuser de fournir les documents ?',
          answer: "Non. Le syndic a l'obligation l\u00e9gale de mettre \u00e0 disposition les documents de la copropri\u00e9t\u00e9 (PV d'AG, comptes, r\u00e8glement) via un extranet s\u00e9curis\u00e9 depuis la loi ALUR de 2014. Tout copropri\u00e9taire y a acc\u00e8s. Le syndic ne peut pas facturer l'acc\u00e8s \u00e0 l'extranet. Si vous rencontrez des difficult\u00e9s, rappelez au syndic ses obligations au titre de l'article 18 de la loi du 10 juillet 1965.",
        },
        {
          question: 'Le pr\u00e9-\u00e9tat dat\u00e9 fait seul est-il accept\u00e9 par le notaire ?',
          answer: "Oui, \u00e0 condition qu'il soit conforme au mod\u00e8le du Conseil Sup\u00e9rieur du Notariat et qu'il contienne toutes les informations requises par l'article L.721-2 du CCH. Un pr\u00e9-\u00e9tat dat\u00e9 g\u00e9n\u00e9r\u00e9 par Pre-etat-date.ai est accept\u00e9 par les notaires car il utilise ce mod\u00e8le officiel et inclut les donn\u00e9es financi\u00e8res, juridiques et techniques compl\u00e8tes.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pr\u00e9-\u00e9tat dat\u00e9 seul' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Faire son pr\u00e9-\u00e9tat dat\u00e9 seul : c'est l\u00e9gal et simple
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-28">Mis \u00e0 jour le 28 mars 2026</time>
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
              <dt className="font-semibold min-w-[180px]">Base l\u00e9gale :</dt>
              <dd>Article L.721-2 du Code de la construction et de l'habitation</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Confirmation CSN :</dt>
              <dd>Oui, le vendeur peut \u00e9tablir le pr\u00e9-\u00e9tat dat\u00e9 lui-m\u00eame</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Prix syndic :</dt>
              <dd>150 \u00e0 600 EUR (selon taille de la copropri\u00e9t\u00e9)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Prix Pre-etat-date.ai :</dt>
              <dd>24,99 EUR TTC</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Documents n\u00e9cessaires :</dt>
              <dd>6 \u00e0 8 PDF (disponibles sur l'extranet du syndic)</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Beaucoup de vendeurs pensent qu'ils doivent obligatoirement passer par le syndic
          pour obtenir le pr\u00e9-\u00e9tat dat\u00e9. C'est faux. La loi autorise le vendeur \u00e0 le
          r\u00e9aliser lui-m\u00eame, et le Conseil Sup\u00e9rieur du Notariat l'a confirm\u00e9. Avec les
          bons outils, c'est m\u00eame plus rapide, moins cher et tout aussi conforme.
        </p>

        {/* Legal basis */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La base l\u00e9gale : ce que dit la loi
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article L.721-2 du Code de la construction et de l'habitation (CCH), cr\u00e9\u00e9 par
          la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR de 2014</Link>,
          impose au vendeur de fournir un certain nombre d'informations \u00e0 l'acqu\u00e9reur lors
          de la vente d'un lot en copropri\u00e9t\u00e9. Ces informations constituent le pr\u00e9-\u00e9tat dat\u00e9.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Point essentiel : la loi ne d\u00e9signe <strong>pas</strong> le syndic comme seul auteur
          possible du pr\u00e9-\u00e9tat dat\u00e9. Elle d\u00e9finit les informations obligatoires, pas la
          personne qui doit les compiler. Le vendeur, en tant que copropri\u00e9taire, a acc\u00e8s
          \u00e0 tous les documents n\u00e9cessaires via l'extranet du syndic.
        </p>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Position du Conseil Sup\u00e9rieur du Notariat</h3>
            <p className="text-sm text-secondary-600">
              Le CSN a confirm\u00e9 que le vendeur peut r\u00e9aliser le pr\u00e9-\u00e9tat dat\u00e9 lui-m\u00eame,
              \u00e0 condition que le document contienne toutes les informations requises par la loi
              et soit pr\u00e9sent\u00e9 dans un format conforme. Pre-etat-date.ai utilise le mod\u00e8le
              officiel du CSN pour garantir cette conformit\u00e9.
            </p>
          </div>
        </div>

        {/* The 3 options */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 3 fa\u00e7ons de faire son pr\u00e9-\u00e9tat dat\u00e9 seul
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous d\u00e9cidez de ne pas passer par le syndic, trois options s'offrent \u00e0 vous :
        </p>

        {/* Comparison table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Crit\u00e8re</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Seul (mod\u00e8le papier)</th>
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
                <td className="border border-secondary-200 px-4 py-3">2 \u00e0 5 heures</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 minutes</td>
                <td className="border border-secondary-200 px-4 py-3">15-30 jours</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Risque d'erreur</td>
                <td className="border border-secondary-200 px-4 py-3">\u00c9lev\u00e9</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Faible (cross-validation IA)</td>
                <td className="border border-secondary-200 px-4 py-3">Faible</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Conformit\u00e9 CSN</td>
                <td className="border border-secondary-200 px-4 py-3">Non garantie</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Garantie</td>
                <td className="border border-secondary-200 px-4 py-3">Variable</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Accept\u00e9 par les notaires</td>
                <td className="border border-secondary-200 px-4 py-3">Selon qualit\u00e9</td>
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
          Le mod\u00e8le papier est gratuit mais risqu\u00e9 : avec plus de 70 champs \u00e0 remplir
          manuellement, les erreurs sont fr\u00e9quentes. Un pr\u00e9-\u00e9tat dat\u00e9 incomplet ou inexact
          peut \u00eatre refus\u00e9 par le notaire, retarder la vente, ou m\u00eame engager la
          responsabilit\u00e9 du vendeur.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le syndic est fiable mais lent et cher. Et la qualit\u00e9 varie : certains syndics
          fournissent des pr\u00e9-\u00e9tats dat\u00e9s incomplets ou avec des donn\u00e9es obsol\u00e8tes.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link> offre
          le meilleur des deux mondes : la rapidit\u00e9 et le prix de l'autonomie, avec la
          conformit\u00e9 et la fiabilit\u00e9 d'un service professionnel. L'IA extrait les donn\u00e9es de
          vos documents officiels, effectue des v\u00e9rifications crois\u00e9es automatiques, et g\u00e9n\u00e8re
          un document au format CSN.
        </p>

        {/* Documents from syndic extranet */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          O\u00f9 trouver les documents n\u00e9cessaires
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Depuis la loi ALUR, chaque syndic doit mettre \u00e0 disposition un extranet s\u00e9curis\u00e9
          o\u00f9 les copropri\u00e9taires acc\u00e8dent librement aux documents de la copropri\u00e9t\u00e9. Voici
          ce dont vous avez besoin :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>PV des assembl\u00e9es g\u00e9n\u00e9rales</strong> des 2-3 derni\u00e8res ann\u00e9es (votes de travaux, proc\u00e9dures).</li>
          <li><strong>Appels de fonds</strong> et <strong>relev\u00e9s de charges</strong> du dernier exercice.</li>
          <li><strong>Fiche synth\u00e9tique</strong> de la copropri\u00e9t\u00e9 (donn\u00e9es financi\u00e8res et techniques cl\u00e9s).</li>
          <li><strong>R\u00e8glement de copropri\u00e9t\u00e9</strong> et \u00e9tat descriptif de division (tanti\u00e8mes).</li>
          <li><strong>Carnet d'entretien</strong> de l'immeuble.</li>
          <li><strong>Diagnostics immobiliers</strong> (DPE, amiante, \u00e9lectricit\u00e9, etc.).</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour un guide complet, consultez notre article sur
          les <Link to="/guide/documents-necessaires-vente" className="text-primary-600 hover:text-primary-800 font-medium">documents n\u00e9cessaires \u00e0 la vente en copropri\u00e9t\u00e9</Link>.
          Si vous ne trouvez pas certains documents sur l'extranet, le syndic est tenu de
          vous les fournir sur demande.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fr\u00e9quentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              A-t-on le droit de faire le pr\u00e9-\u00e9tat dat\u00e9 soi-m\u00eame ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. L'article L.721-2 du CCH impose de fournir certaines informations \u00e0
              l'acqu\u00e9reur, mais ne d\u00e9signe pas le syndic comme seul auteur du document.
              Le Conseil Sup\u00e9rieur du Notariat a confirm\u00e9 que le vendeur peut \u00e9tablir le
              pr\u00e9-\u00e9tat dat\u00e9 lui-m\u00eame, \u00e0 condition de respecter le contenu requis par la loi.
              Consultez notre guide sur <Link to="/guide/qui-fait-le-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">qui peut faire le pr\u00e9-\u00e9tat dat\u00e9</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le syndic peut-il refuser de fournir les documents ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Depuis la loi ALUR, le syndic est tenu de mettre \u00e0 disposition un extranet
              s\u00e9curis\u00e9 o\u00f9 chaque copropri\u00e9taire peut acc\u00e9der aux documents de la copropri\u00e9t\u00e9 :
              PV d'assembl\u00e9e g\u00e9n\u00e9rale, comptes, r\u00e8glement. Si le syndic refuse ou tra\u00eene,
              rappelez-lui ses obligations au titre de l'article 18 de la loi du 10 juillet 1965.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le pr\u00e9-\u00e9tat dat\u00e9 fait seul est-il accept\u00e9 par le notaire ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, \u00e0 condition qu'il soit conforme au mod\u00e8le CSN et qu'il contienne toutes les
              informations requises par la loi. Un document g\u00e9n\u00e9r\u00e9 par Pre-etat-date.ai
              utilise le mod\u00e8le officiel et inclut les donn\u00e9es financi\u00e8res, juridiques et
              techniques compl\u00e8tes, avec un lien de partage s\u00e9curis\u00e9 directement utilisable par le notaire.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-seul" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Faites votre pr\u00e9-\u00e9tat dat\u00e9 vous-m\u00eame, en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR au lieu de 150-600 EUR chez le syndic. Conforme CSN, accept\u00e9 par les notaires.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              G\u00e9n\u00e9rer mon pr\u00e9-\u00e9tat dat\u00e9
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
