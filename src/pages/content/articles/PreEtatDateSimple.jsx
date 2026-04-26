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
        title="Pré-état daté simple : comment le faire facilement"
        description="Le pré-état daté n'a pas besoin d'être compliqué. 4 étapes simples sur Pre-etat-date.ai : déposez vos PDF, l'IA fait le reste. 24,99 EUR, conforme CSN."
        canonical="/guide/pre-etat-date-simple"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pré-état daté simple : comment le faire facilement",
        description: "Guide pour réaliser son pré-état daté facilement, sans compétences comptables. Comparatif des méthodes par niveau de complexité.",
        slug: 'pre-etat-date-simple',
        datePublished: '2026-03-28',
        dateModified: '2026-04-26',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Pré-état daté', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pré-état daté simple' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Faut-il des compétences en comptabilité pour faire un pré-état daté ?',
          answer: "Non. Avec Pre-etat-date.ai, aucune compétence comptable n'est nécessaire. L'intelligence artificielle extrait automatiquement les données financières (charges, tantièmes, budget prévisionnel, fonds de travaux) à partir de vos documents PDF. Vous n'avez qu'à vérifier les informations pré-remplies avant de générer le document final.",
        },
        {
          question: 'Que se passe-t-il si je n\'ai pas tous les documents ?',
          answer: "L'IA travaille avec les documents que vous fournissez. Les informations manquantes sont signalées clairement dans le formulaire de validation, et vous pouvez les compléter manuellement. Les documents essentiels sont les PV d'assemblée générale, les appels de fonds et les diagnostics immobiliers. La plupart sont disponibles sur l'extranet de votre syndic.",
        },
        {
          question: 'Comment savoir si les données extraites sont correctes ?',
          answer: "Pre-etat-date.ai intègre un système de cross-validation automatique. L'IA vérifie la cohérence des tantièmes, compare les charges calculées aux charges déclarées, et signale tout écart supérieur à 5 %. Chaque donnée est traçée jusqu'au document source (numéro de page et ligne). Vous validez tout avant la génération du PDF.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Pré-état daté', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pré-état daté simple' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pré-état daté simple : comment le faire facilement
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
              <dt className="font-semibold min-w-[180px]">Nombre d'étapes :</dt>
              <dd>4 (dépôt, analyse, validation, téléchargement)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Temps total :</dt>
              <dd>5 à 10 minutes</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Compétences requises :</dt>
              <dd>Aucune (pas de comptabilité ni de juridique)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Format accepté :</dt>
              <dd>PDF (documents de copropriété et diagnostics)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Prix :</dt>
              <dd>24,99 EUR TTC sur Pre-etat-date.ai</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le <Link to="/" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">pré-état daté</Link> fait peur à beaucoup de vendeurs. Ce document obligatoire pour la
          vente en copropriété contient des informations financières, juridiques et techniques
          qui semblent complexes au premier abord. Pourtant, avec les bons outils, le processus
          est bien plus simple qu'on ne le pense.
        </p>

        {/* Why it seems complex */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le pré-état daté paraît compliqué
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La réputation de complexité du pré-état daté vient de son contenu : budget prévisionnel,
          tantièmes de copropriété, charges courantes et exceptionnelles, fonds de travaux,
          procédures en cours, diagnostics techniques. Pour un particulier qui vend un appartement,
          ces termes peuvent sembler décourageants.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La méthode traditionnelle — remplir un modèle vierge champ par champ — demande
          effectivement de comprendre chaque rubrique et de savoir où trouver l'information
          dans les documents de la copropriété. C'est cette étape de saisie manuelle que
          l'intelligence artificielle élimine complètement.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comparatif des méthodes par complexité
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Méthode</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Complexité</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Ce que vous devez faire</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Compétences requises</th>
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
                <td className="border border-secondary-200 px-4 py-3">DIY (modèle gratuit)</td>
                <td className="border border-secondary-200 px-4 py-3">Complexe</td>
                <td className="border border-secondary-200 px-4 py-3">Remplir 70+ champs manuellement</td>
                <td className="border border-secondary-200 px-4 py-3">Comptabilité copropriété</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Service en ligne (humain)</td>
                <td className="border border-secondary-200 px-4 py-3">Moyen</td>
                <td className="border border-secondary-200 px-4 py-3">Envoyer les documents + formulaire</td>
                <td className="border border-secondary-200 px-4 py-3">Aucune</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pre-etat-date.ai</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Très simple</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Déposer vos PDF, valider les données</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Aucune</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Step by step */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 4 étapes, expliquées simplement
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Voici comment fonctionne <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          étape par étape :
        </p>

        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-600 text-white text-sm font-bold flex-shrink-0">1</span>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Déposez vos documents PDF</h3>
              <p className="text-sm text-secondary-600">
                Glissez vos fichiers dans la zone de dépôt. L'IA identifie automatiquement
                chaque document (PV d'AG, appels de fonds, DPE, etc.). Pas besoin de trier
                ou de renommer vos fichiers au préalable.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-600 text-white text-sm font-bold flex-shrink-0">2</span>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">L'IA analyse tout automatiquement</h3>
              <p className="text-sm text-secondary-600">
                Deux moteurs d'intelligence artificielle extraient en parallèle les données
                financières (charges, budget, tantièmes) et les informations techniques
                (diagnostics, dates de validité). Zéro saisie manuelle de votre part.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-600 text-white text-sm font-bold flex-shrink-0">3</span>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Vérifiez les données pré-remplies</h3>
              <p className="text-sm text-secondary-600">
                Un formulaire clair affiche toutes les informations extraites. Les alertes
                de cohérence (tantièmes, écarts de charges) vous aident à repérer les erreurs
                éventuelles. Modifiez si nécessaire, puis validez.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <span className="flex items-center justify-center h-7 w-7 rounded-full bg-primary-600 text-white text-sm font-bold flex-shrink-0">4</span>
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Téléchargez votre pré-état daté</h3>
              <p className="text-sm text-secondary-600">
                Le PDF conforme au modèle CSN est généré instantanément. Vous recevez aussi
                un lien de partage sécurisé à envoyer directement à votre notaire.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Aucune compétence technique nécessaire</h3>
            <p className="text-sm text-secondary-600">
              Vous n'avez pas besoin de connaître la différence entre charges générales et
              charges spéciales, ni de calculer les quotes-parts de tantièmes. L'IA fait
              ce travail à votre place et vous présente un résultat clair et vérifiable.
            </p>
          </div>
        </div>

        {/* Common fears addressed */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les craintes fréquentes (et pourquoi elles sont infondées)
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Beaucoup de vendeurs hésitent à faire le pré-état daté eux-mêmes. Voici les
          inquiétudes les plus courantes et la réalité :
        </p>
        <ul className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>&laquo; Je ne comprends rien à la comptabilité de copropriété &raquo;</strong> :
            c'est précisément le problème que l'IA résout. Elle identifie et extrait les
            données financières automatiquement. Vous n'avez qu'à vérifier, pas à calculer.
          </li>
          <li>
            <strong>&laquo; Le notaire va refuser mon document &raquo;</strong> : le pré-état daté généré
            par Pre-etat-date.ai utilise le modèle officiel du Conseil Supérieur du Notariat.
            Le <Link to="/guide/qui-fait-le-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">CSN a confirmé que le vendeur peut réaliser ce document</Link>.
          </li>
          <li>
            <strong>&laquo; Et si l'IA se trompe ? &raquo;</strong> : le système de cross-validation
            compare automatiquement les tantièmes, les charges et le budget prévisionnel.
            Tout écart significatif est signalé par une alerte visible.
          </li>
        </ul>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Faut-il des compétences en comptabilité ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. L'intelligence artificielle extrait automatiquement les données financières
              (charges, tantièmes, budget prévisionnel, fonds de travaux) à partir de vos
              documents PDF. Vous n'avez qu'à vérifier les informations pré-remplies. Aucune
              connaissance en comptabilité de copropriété n'est nécessaire.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Que se passe-t-il si je n'ai pas tous les documents ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              L'IA travaille avec les documents que vous fournissez et signale clairement
              les informations manquantes. Vous pouvez les compléter manuellement dans le
              formulaire de validation. La plupart des documents essentiels (PV d'AG, appels
              de fonds, diagnostics) sont disponibles sur l'extranet de votre syndic.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Comment savoir si les données extraites sont correctes ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Pre-etat-date.ai intègre un système de cross-validation automatique. L'IA vérifie
              la cohérence entre les tantièmes, les charges et le budget prévisionnel, et
              signale tout écart supérieur à 5 %. Chaque donnée est traçée jusqu'au document
              source avec le numéro de page correspondant.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-simple" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Prêt à faire votre pré-état daté en toute simplicité ?
          </h2>
          <p className="text-secondary-500 mb-6">
            4 étapes, 5 minutes, 24,99 EUR. Aucune compétence requise.
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
