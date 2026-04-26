import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, faqSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';
import DownloadTemplateSection from '@components/content/DownloadTemplateSection';

export default function ModelePreEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Modèle de pré-état daté vierge gratuit (Word, PDF) — 2026"
        description="Téléchargez notre modèle de pré-état daté vierge gratuit au format Word et PDF. Formulaire CSN officiel, guide de remplissage, modèle syndic bénévole. Alternative IA à 24,99 €."
        canonical="/guide/modele-pre-etat-date"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Modèle de pré-état daté vierge gratuit (Word, PDF) — 2026",
        description: "Téléchargez notre modèle de pré-état daté vierge gratuit au format Word et PDF. Formulaire CSN officiel, guide de remplissage, modèle syndic bénévole.",
        slug: 'modele-pre-etat-date',
        datePublished: '2026-04-12',
        dateModified: '2026-04-26',
      })} />
      <JsonLd data={faqSchema([
        {
          question: "Existe-t-il un modèle officiel de pré-état daté ?",
          answer: "Oui, le Conseil Supérieur du Notariat (CSN) a publié un modèle de référence. Ce formulaire standardisé comprend trois parties : informations financières, vie de la copropriété et données techniques. Pre-etat-date.ai génère automatiquement un document conforme à ce modèle CSN.",
        },
        {
          question: "Comment remplir un modèle de pré-état daté vierge ?",
          answer: "Vous devez rassembler les documents de copropriété (PV d'AG, relevés de charges, appels de fonds, DPE) puis reporter les informations dans chaque section du formulaire : charges courantes, tantièmes, fonds de travaux, procédures en cours, diagnostics. L'alternative est d'utiliser Pre-etat-date.ai qui extrait ces données automatiquement par IA.",
        },
        {
          question: "Peut-on utiliser un modèle de pré-état daté en syndic bénévole ?",
          answer: "Oui, en syndic bénévole (non professionnel), le copropriétaire-syndic peut établir le pré-état daté lui-même à partir des documents de la copropriété. Un modèle simplifié ou l'utilisation d'un service IA comme Pre-etat-date.ai est particulièrement adapté dans ce cas.",
        },
      ])} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Pré-état daté', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Modèle de pré-état daté' },
      ])} />

      <Breadcrumb items={[
        { label: 'Pré-état daté', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Modèle de pré-état daté' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Modèle de pré-état daté vierge gratuit (Word, PDF) — 2026
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-04-12">Mis à jour le 12 avril 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            8 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Modèle officiel :</dt>
              <dd>Formulaire CSN (Conseil Supérieur du Notariat), 3 parties obligatoires</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Formats courants :</dt>
              <dd>PDF, Word (.docx), Excel — à remplir manuellement</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Syndic bénévole :</dt>
              <dd>Le copropriétaire-syndic peut le remplir lui-même</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Alternative IA :</dt>
              <dd>Pre-etat-date.ai génère le document conforme CSN automatiquement (24,99 €, 5 min)</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Vous cherchez un modèle de <Link to="/" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">pré-état daté</Link> à télécharger ? Formulaire vierge en PDF ou Word,
          exemple rempli, modèle simplifié pour syndic bénévole — cet article fait le tour des
          options disponibles et vous explique comment remplir chaque section correctement.
        </p>

        {/* Le modèle CSN officiel */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le modèle CSN : la référence officielle
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le <strong>Conseil Supérieur du Notariat (CSN)</strong> a publié un modèle de référence
          pour le pré-état daté. Ce formulaire standardisé est celui que les notaires attendent
          de recevoir lors d'une vente en copropriété. Il est structuré en trois grandes parties :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Partie I — Informations financières</strong> : budget prévisionnel, charges courantes du lot, charges exceptionnelles votées, impayés du vendeur, dettes de la copropriété, fonds de travaux.</li>
          <li><strong>Partie II-A — Vie de la copropriété</strong> : nom du syndic, procédures judiciaires, travaux votés non réalisés, plan pluriannuel de travaux.</li>
          <li><strong>Partie II-B — Données techniques</strong> : DPE, diagnostics obligatoires (amiante, plomb, électricité, gaz, ERP, mesurage Carrez), DTG.</li>
        </ul>

        {/* Formats disponibles */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Formulaire vierge : PDF, Word ou Excel ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          On trouve en ligne plusieurs formats de modèle de pré-état daté vierge :
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse border border-secondary-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-secondary-50">
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Format</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Avantages</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Inconvénients</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">PDF vierge</td>
                <td className="p-3 border border-secondary-200">Mise en page fixe, aspect professionnel</td>
                <td className="p-3 border border-secondary-200">Difficile à modifier, champs non interactifs</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Word (.docx)</td>
                <td className="p-3 border border-secondary-200">Facile à modifier, ajout de sections possible</td>
                <td className="p-3 border border-secondary-200">Mise en page instable selon le logiciel</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Excel (.xlsx)</td>
                <td className="p-3 border border-secondary-200">Calculs automatiques (tantièmes, prorata)</td>
                <td className="p-3 border border-secondary-200">Peu adapté pour un document final à transmettre</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium bg-primary-50/50">IA (Pre-etat-date.ai)</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">Remplissage automatique, conforme CSN, 5 min</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50">Payant (24,99 €)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Download section */}
        <DownloadTemplateSection />

        {/* Contenu obligatoire */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que doit contenir le formulaire ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Quel que soit le format choisi, votre pré-état daté doit obligatoirement inclure
          les informations prévues par l'<strong>article L.721-2 du Code de la Construction
          et de l'Habitation</strong> :
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Section financière (la plus complexe)
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le montant des charges courantes du budget prévisionnel et leur répartition (tantièmes).</li>
          <li>Les charges exceptionnelles votées mais pas encore appelées.</li>
          <li>L'état des impayés du copropriétaire vendeur.</li>
          <li>La dette de la copropriété envers ses fournisseurs.</li>
          <li>Le solde du fonds de travaux et la cotisation annuelle.</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Section copropriété et juridique
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Les coordonnées du syndic en exercice.</li>
          <li>Les procédures judiciaires en cours.</li>
          <li>Les travaux votés en assemblée générale, non encore réalisés.</li>
          <li>Le plan pluriannuel de travaux (PPT) s'il existe.</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Section technique et diagnostics
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le DPE (classes énergie et GES, date de réalisation).</li>
          <li>Les diagnostics obligatoires : amiante, plomb, électricité, gaz, ERP, mesurage Carrez.</li>
          <li>Le DTG et l'audit énergétique s'ils existent.</li>
        </ul>

        {/* Cas du syndic bénévole */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Modèle pour syndic bénévole : comment faire ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En copropriété gérée par un <strong>syndic bénévole</strong> (copropriétaire non
          professionnel), il n'y a pas de prestataire externe pour préparer le pré-état daté.
          Le syndic bénévole doit le constituer lui-même à partir des documents qu'il détient.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est souvent dans ce cas qu'un modèle simplifié ou un service automatisé comme
          Pre-etat-date.ai prend tout son sens : vous déposez vos documents (PV d'AG, relevés
          de charges, DPE) et l'IA extrait les informations pour générer un document conforme.
        </p>

        {/* Risques du modèle vierge */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les risques du modèle vierge rempli à la main
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Remplir un formulaire vierge soi-même est légalement possible, mais comporte des
          risques non négligeables :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Erreurs de calcul</strong> : la répartition des charges via les tantièmes demande une bonne maîtrise comptable.</li>
          <li><strong>Oublis d'information</strong> : une procédure judiciaire non mentionnée peut entraîner la nullité de la vente.</li>
          <li><strong>Rejet par le notaire</strong> : un document incomplet ou mal structuré sera refusé.</li>
          <li><strong>Temps passé</strong> : plusieurs heures pour éplucher les PV d'AG, les appels de fonds et les annexes comptables.</li>
        </ul>

        {/* Alternative IA */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          L'alternative : génération automatique par IA
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Plutôt que de remplir manuellement un modèle vierge, <strong>Pre-etat-date.ai</strong> analyse
          automatiquement vos documents de copropriété grâce à l'intelligence artificielle et génère
          un pré-état daté conforme au modèle CSN en quelques minutes.
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Déposez vos PDF (PV d'AG, relevés de charges, DPE, etc.).</li>
          <li>L'IA extrait automatiquement les données financières, juridiques et techniques.</li>
          <li>Vous validez les informations, puis recevez un PDF conforme au modèle CSN.</li>
          <li>Partagez directement avec votre notaire via un lien sécurisé.</li>
        </ul>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse border border-secondary-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-secondary-50">
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Critère</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Modèle vierge</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-primary-700 bg-primary-50">Pre-etat-date.ai</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Prix</td>
                <td className="p-3 border border-secondary-200">Gratuit</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">24,99 €</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Temps</td>
                <td className="p-3 border border-secondary-200">2 à 5 heures</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">5 à 10 minutes</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Risque d'erreur</td>
                <td className="p-3 border border-secondary-200">Élevé (calculs manuels)</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">Faible (IA + validation)</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Conformité CSN</td>
                <td className="p-3 border border-secondary-200">Selon vos compétences</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">Oui (modèle officiel)</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Garantie</td>
                <td className="p-3 border border-secondary-200">Aucune</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">Satisfait ou remboursé</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pré-état daté vs état daté */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pré-état daté ou état daté : ne confondez pas les deux modèles
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous cherchez un « modèle d'état daté », sachez que le <strong>pré-état daté</strong> et
          l'<strong>état daté</strong> sont deux documents distincts, même s'ils portent sur la même
          copropriété :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Le pré-état daté</strong> est fourni <em>avant</em> le compromis de vente. Il est établi par le vendeur (ou son syndic). C'est le document que cette page vous aide à constituer.</li>
          <li><strong>L'état daté</strong> est demandé par le notaire <em>après</em> la signature du compromis. Il est obligatoirement établi par le syndic professionnel (coût : 380 € en moyenne).</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le modèle vierge téléchargeable ci-dessus correspond au <strong>pré-état daté</strong> (article
          L.721-2 du CCH). Pour l'état daté, vous devrez passer par votre syndic — aucun formulaire vierge
          ne peut s'y substituer puisque seul le syndic détient les informations comptables officielles.
        </p>

        <RelatedArticles currentSlug="modele-pre-etat-date" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Plus besoin de remplir un formulaire vierge
          </h2>
          <p className="text-secondary-500 mb-6">
            L'IA analyse vos documents et génère votre pré-état daté conforme CSN en 5 minutes.
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
