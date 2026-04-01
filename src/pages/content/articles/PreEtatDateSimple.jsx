import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Zap, CheckCircle } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDateSimple() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pr\u00e9-\u00e9tat dat\u00e9 simple : comment le faire facilement"
        description="Le pr\u00e9-\u00e9tat dat\u00e9 n'a pas besoin d'\u00eatre compliqu\u00e9. 4 \u00e9tapes simples sur Pre-etat-date.ai : d\u00e9posez vos PDF, l'IA fait le reste. 24,99 EUR, conforme CSN."
        canonical="/guide/pre-etat-date-simple"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pr\u00e9-\u00e9tat dat\u00e9 simple : comment le faire facilement",
        description: "Guide pour r\u00e9aliser son pr\u00e9-\u00e9tat dat\u00e9 facilement, sans comp\u00e9tences comptables. Comparatif des m\u00e9thodes par niveau de complexit\u00e9.",
        slug: 'pre-etat-date-simple',
        datePublished: '2026-03-28',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pr\u00e9-\u00e9tat dat\u00e9 simple' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Faut-il des comp\u00e9tences en comptabilit\u00e9 pour faire un pr\u00e9-\u00e9tat dat\u00e9 ?',
          answer: "Non. Avec Pre-etat-date.ai, aucune comp\u00e9tence comptable n'est n\u00e9cessaire. L'intelligence artificielle extrait automatiquement les donn\u00e9es financi\u00e8res (charges, tanti\u00e8mes, budget pr\u00e9visionnel, fonds de travaux) \u00e0 partir de vos documents PDF. Vous n'avez qu'\u00e0 v\u00e9rifier les informations pr\u00e9-remplies avant de g\u00e9n\u00e9rer le document final.",
        },
        {
          question: 'Que se passe-t-il si je n\'ai pas tous les documents ?',
          answer: "L'IA travaille avec les documents que vous fournissez. Les informations manquantes sont signal\u00e9es clairement dans le formulaire de validation, et vous pouvez les compl\u00e9ter manuellement. Les documents essentiels sont les PV d'assembl\u00e9e g\u00e9n\u00e9rale, les appels de fonds et les diagnostics immobiliers. La plupart sont disponibles sur l'extranet de votre syndic.",
        },
        {
          question: 'Comment savoir si les donn\u00e9es extraites sont correctes ?',
          answer: "Pre-etat-date.ai int\u00e8gre un syst\u00e8me de cross-validation automatique. L'IA v\u00e9rifie la coh\u00e9rence des tanti\u00e8mes, compare les charges calcul\u00e9es aux charges d\u00e9clar\u00e9es, et signale tout \u00e9cart sup\u00e9rieur \u00e0 5 %. Chaque donn\u00e9e est tra\u00e7\u00e9e jusqu'au document source (num\u00e9ro de page et ligne). Vous validez tout avant la g\u00e9n\u00e9ration du PDF.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pr\u00e9-\u00e9tat dat\u00e9 simple' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pr\u00e9-\u00e9tat dat\u00e9 simple : comment le faire facilement
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
              <dt className="font-semibold min-w-[180px]">Nombre d'\u00e9tapes :</dt>
              <dd>4 (d\u00e9p\u00f4t, analyse, validation, t\u00e9l\u00e9chargement)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Temps total :</dt>
              <dd>5 \u00e0 10 minutes</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Comp\u00e9tences requises :</dt>
              <dd>Aucune (pas de comptabilit\u00e9 ni de juridique)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Format accept\u00e9 :</dt>
              <dd>PDF (documents de copropri\u00e9t\u00e9 et diagnostics)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Prix :</dt>
              <dd>24,99 EUR TTC sur Pre-etat-date.ai</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pr\u00e9-\u00e9tat dat\u00e9 fait peur \u00e0 beaucoup de vendeurs. Ce document obligatoire pour la
          vente en copropri\u00e9t\u00e9 contient des informations financi\u00e8res, juridiques et techniques
          qui semblent complexes au premier abord. Pourtant, avec les bons outils, le processus
          est bien plus simple qu'on ne le pense.
        </p>

        {/* Why it seems complex */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le pr\u00e9-\u00e9tat dat\u00e9 para\u00eet compliqu\u00e9
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La r\u00e9putation de complexit\u00e9 du pr\u00e9-\u00e9tat dat\u00e9 vient de son contenu : budget pr\u00e9visionnel,
          tanti\u00e8mes de copropri\u00e9t\u00e9, charges courantes et exceptionnelles, fonds de travaux,
          proc\u00e9dures en cours, diagnostics techniques. Pour un particulier qui vend un appartement,
          ces termes peuvent sembler d\u00e9courageants.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La m\u00e9thode traditionnelle \u2014 remplir un mod\u00e8le vierge champ par champ \u2014 demande
          effectivement de comprendre chaque rubrique et de savoir o\u00f9 trouver l'information
          dans les documents de la copropri\u00e9t\u00e9. C'est cette \u00e9tape de saisie manuelle que
          l'intelligence artificielle \u00e9limine compl\u00e8tement.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comparatif des m\u00e9thodes par complexit\u00e9
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">M\u00e9thode</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Complexit\u00e9</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Ce que vous devez faire</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Comp\u00e9tences requises</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Via le syndic</td>
                <td className="border border-secondary-200 px-4 py-3">Simple (mais lent)</td>
                <td className="border border-secondary-200 px-4 py-3">Envoyer un email de demande</td>
                <td className="border border-secondary-200 px-4 py-3">Aucune</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">DIY (mod\u00e8le gratuit)</td>
                <td className="border border-secondary-200 px-4 py-3">Complexe</td>
                <td className="border border-secondary-200 px-4 py-3">Remplir 70+ champs manuellement</td>
                <td className="border border-secondary-200 px-4 py-3">Comptabilit\u00e9 copropri\u00e9t\u00e9</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Service en ligne (humain)</td>
                <td className="border border-secondary-200 px-4 py-3">Moyen</td>
                <td className="border border-secondary-200 px-4 py-3">Envoyer les documents + formulaire</td>
                <td className="border border-secondary-200 px-4 py-3">Aucune</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pre-etat-date.ai</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Tr\u00e8s simple</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">D\u00e9poser vos PDF, valider les donn\u00e9es</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Aucune</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Step by step */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 4 \u00e9tapes, expliqu\u00e9es simplement
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Voici comment fonctionne <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          \u00e9tape par \u00e9tape :
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-600 text-white text-sm font-bold flex-shrink-0">1</span>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">D\u00e9posez vos documents PDF</h3>
              <p className="text-sm text-secondary-600">
                Glissez vos fichiers dans la zone de d\u00e9p\u00f4t. L'IA identifie automatiquement
                chaque document (PV d'AG, appels de fonds, DPE, etc.). Pas besoin de trier
                ou de renommer vos fichiers au pr\u00e9alable.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-600 text-white text-sm font-bold flex-shrink-0">2</span>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">L'IA analyse tout automatiquement</h3>
              <p className="text-sm text-secondary-600">
                Deux moteurs d'intelligence artificielle extraient en parall\u00e8le les donn\u00e9es
                financi\u00e8res (charges, budget, tanti\u00e8mes) et les informations techniques
                (diagnostics, dates de validit\u00e9). Z\u00e9ro saisie manuelle de votre part.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-600 text-white text-sm font-bold flex-shrink-0">3</span>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">V\u00e9rifiez les donn\u00e9es pr\u00e9-remplies</h3>
              <p className="text-sm text-secondary-600">
                Un formulaire clair affiche toutes les informations extraites. Les alertes
                de coh\u00e9rence (tanti\u00e8mes, \u00e9carts de charges) vous aident \u00e0 rep\u00e9rer les erreurs
                \u00e9ventuelles. Modifiez si n\u00e9cessaire, puis validez.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-600 text-white text-sm font-bold flex-shrink-0">4</span>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">T\u00e9l\u00e9chargez votre pr\u00e9-\u00e9tat dat\u00e9</h3>
              <p className="text-sm text-secondary-600">
                Le PDF conforme au mod\u00e8le CSN est g\u00e9n\u00e9r\u00e9 instantan\u00e9ment. Vous recevez aussi
                un lien de partage s\u00e9curis\u00e9 \u00e0 envoyer directement \u00e0 votre notaire.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Aucune comp\u00e9tence technique n\u00e9cessaire</h3>
            <p className="text-sm text-secondary-600">
              Vous n'avez pas besoin de conna\u00eetre la diff\u00e9rence entre charges g\u00e9n\u00e9rales et
              charges sp\u00e9ciales, ni de calculer les quotes-parts de tanti\u00e8mes. L'IA fait
              ce travail \u00e0 votre place et vous pr\u00e9sente un r\u00e9sultat clair et v\u00e9rifiable.
            </p>
          </div>
        </div>

        {/* Common fears addressed */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les craintes fr\u00e9quentes (et pourquoi elles sont infond\u00e9es)
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Beaucoup de vendeurs h\u00e9sitent \u00e0 faire le pr\u00e9-\u00e9tat dat\u00e9 eux-m\u00eames. Voici les
          inqui\u00e9tudes les plus courantes et la r\u00e9alit\u00e9 :
        </p>
        <ul className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>&laquo; Je ne comprends rien \u00e0 la comptabilit\u00e9 de copropri\u00e9t\u00e9 &raquo;</strong> :
            c'est pr\u00e9cis\u00e9ment le probl\u00e8me que l'IA r\u00e9sout. Elle identifie et extrait les
            donn\u00e9es financi\u00e8res automatiquement. Vous n'avez qu'\u00e0 v\u00e9rifier, pas \u00e0 calculer.
          </li>
          <li>
            <strong>&laquo; Le notaire va refuser mon document &raquo;</strong> : le pr\u00e9-\u00e9tat dat\u00e9 g\u00e9n\u00e9r\u00e9
            par Pre-etat-date.ai utilise le mod\u00e8le officiel du Conseil Sup\u00e9rieur du Notariat.
            Le <Link to="/guide/qui-fait-le-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">CSN a confirm\u00e9 que le vendeur peut r\u00e9aliser ce document</Link>.
          </li>
          <li>
            <strong>&laquo; Et si l'IA se trompe ? &raquo;</strong> : le syst\u00e8me de cross-validation
            compare automatiquement les tanti\u00e8mes, les charges et le budget pr\u00e9visionnel.
            Tout \u00e9cart significatif est signal\u00e9 par une alerte visible.
          </li>
        </ul>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fr\u00e9quentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Faut-il des comp\u00e9tences en comptabilit\u00e9 ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. L'intelligence artificielle extrait automatiquement les donn\u00e9es financi\u00e8res
              (charges, tanti\u00e8mes, budget pr\u00e9visionnel, fonds de travaux) \u00e0 partir de vos
              documents PDF. Vous n'avez qu'\u00e0 v\u00e9rifier les informations pr\u00e9-remplies. Aucune
              connaissance en comptabilit\u00e9 de copropri\u00e9t\u00e9 n'est n\u00e9cessaire.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Que se passe-t-il si je n'ai pas tous les documents ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              L'IA travaille avec les documents que vous fournissez et signale clairement
              les informations manquantes. Vous pouvez les compl\u00e9ter manuellement dans le
              formulaire de validation. La plupart des documents essentiels (PV d'AG, appels
              de fonds, diagnostics) sont disponibles sur l'extranet de votre syndic.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Comment savoir si les donn\u00e9es extraites sont correctes ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Pre-etat-date.ai int\u00e8gre un syst\u00e8me de cross-validation automatique. L'IA v\u00e9rifie
              la coh\u00e9rence entre les tanti\u00e8mes, les charges et le budget pr\u00e9visionnel, et
              signale tout \u00e9cart sup\u00e9rieur \u00e0 5 %. Chaque donn\u00e9e est tra\u00e7\u00e9e jusqu'au document
              source avec le num\u00e9ro de page correspondant.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-simple" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Pr\u00eat \u00e0 faire votre pr\u00e9-\u00e9tat dat\u00e9 en toute simplicit\u00e9 ?
          </h2>
          <p className="text-secondary-500 mb-6">
            4 \u00e9tapes, 5 minutes, 24,99 EUR. Aucune comp\u00e9tence requise.
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
