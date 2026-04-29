import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CalendarClock, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function ValiditePreEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Durée de validité du pré-état daté : combien de temps ?"
        description="Durée de validité du pré-état daté (validite pre etat date) : pas de durée légale fixe. Moins de 3 mois accepté en pratique. Au-delà, le notaire peut demander une mise à jour. Guide complet."
        canonical="/guide/validite-pre-etat-date"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Durée de validité du pré-état daté : combien de temps ?",
        description: "Le pré-état daté n'a pas de durée de validité légale fixe. En pratique, moins de 3 mois est accepté. Au-delà, le notaire peut demander une mise à jour.",
        slug: 'validite-pre-etat-date',
        datePublished: '2026-03-29',
        dateModified: '2026-04-26',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Pré-état daté', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Validité du pré-état daté' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Quelle est la durée de validité légale du pré-état daté ?',
          answer: "Il n'existe aucune durée de validité légale fixée par la loi pour le pré-état daté. L'article L.721-2 du Code de la construction et de l'habitation impose sa remise avant la signature du compromis, mais ne précise pas de date limite de validité. En pratique, les notaires acceptent un pré-état daté de moins de 3 mois sans difficulté. Au-delà, une mise à jour peut être demandée pour s'assurer que les données financières sont toujours exactes.",
        },
        {
          question: 'Faut-il refaire le pré-état daté si la vente prend du retard ?',
          answer: "Oui, si la vente prend du retard et que le pré-état daté a plus de 3 mois, il est fortement recommandé de le mettre à jour. Les données financières (charges, budget prévisionnel, impayés) peuvent avoir évolué entre-temps, notamment si un nouvel exercice comptable a débuté ou si une assemblée générale a voté de nouveaux travaux. Sur Pre-etat-date.ai, la mise à jour coûte 24,99 EUR et prend 5 minutes.",
        },
        {
          question: 'Le notaire peut-il refuser un pré-état daté de plus de 3 mois ?',
          answer: "Le notaire ne peut pas légalement refuser un pré-état daté au seul motif de son ancienneté, puisqu'aucune durée de validité n'est fixée par la loi. Cependant, il peut légitimement demander une mise à jour si les informations ne reflètent plus la situation actuelle de la copropriété, par exemple après une assemblée générale ou un changement d'exercice comptable. Cette demande relève de son devoir de conseil et de vérification.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Pré-état daté', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Validité du pré-état daté' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Durée de validité du pré-état daté : combien de temps ?
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-29">Mis à jour le 29 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            5 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Durée légale :</dt>
              <dd>Aucune (pas de validité fixée par la loi)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Durée recommandée :</dt>
              <dd>Moins de 3 mois avant la signature du compromis</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Risque au-delà :</dt>
              <dd>Le notaire peut demander une mise à jour des données</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Coût mise à jour :</dt>
              <dd>24,99 EUR sur Pre-etat-date.ai (5 minutes)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Validité DPE :</dt>
              <dd>10 ans (sauf DPE avant juillet 2021 : non opposable)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Validité ERP :</dt>
              <dd>6 mois</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          La question de la durée de validité du <Link to="/" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">pré-état daté</Link> revient constamment chez les vendeurs
          en copropriété. Contrairement aux diagnostics immobiliers, dont la validité est clairement
          fixée par la loi, le pré-état daté se trouve dans un vide juridique. Voici ce que dit la
          loi, ce qu'attendent les notaires, et quand il faut le refaire.
        </p>

        {/* No legal duration */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi il n'y a pas de durée de validité légale
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article L.721-2 du Code de la construction et de l'habitation (CCH) impose la remise du
          pré-état daté avant la signature du compromis de vente, mais ne fixe aucune date de
          péremption. Le législateur a voulu que le vendeur transmette une photographie financière et
          juridique de la copropriété au moment de la vente, sans imposer de délai rigide.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En pratique, cela signifie qu'un pré-état daté établi la veille du compromis et un
          pré-état daté établi six mois plus tôt ont la même valeur juridique. La différence réside
          dans la fiabilité des informations : plus le document est ancien, plus les données
          financières risquent d'être obsolètes.
        </p>

        {/* The 3-month rule */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La règle pratique des 3 mois
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les notaires considèrent généralement qu'un pré-état daté de moins de 3 mois est fiable.
          Au-delà, ils peuvent demander une actualisation, notamment pour vérifier qu'aucun
          événement majeur n'est survenu dans la copropriété : nouvelle assemblée générale, appel
          de fonds exceptionnel, changement d'exercice comptable, ou procédure judiciaire.
        </p>
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Attention au changement d'exercice</h3>
            <p className="text-sm text-secondary-600">
              Si un nouvel exercice comptable a débuté depuis l'établissement du pré-état daté,
              les montants de charges, budget prévisionnel et impayés peuvent avoir changé. Le
              notaire demandera presque systématiquement une mise à jour dans ce cas.
            </p>
          </div>
        </div>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Validité des documents de vente en copropriété
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Document</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Durée de validité</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Conséquence si périmé</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pré-état daté</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pas de durée légale (&lt;3 mois recommandé)</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Notaire peut demander mise à jour</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">État daté</td>
                <td className="border border-secondary-200 px-4 py-3">Pas de durée légale</td>
                <td className="border border-secondary-200 px-4 py-3">Demandé juste avant l'acte authentique</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">DPE</td>
                <td className="border border-secondary-200 px-4 py-3">10 ans</td>
                <td className="border border-secondary-200 px-4 py-3">Vente impossible sans DPE valide</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Diagnostic amiante</td>
                <td className="border border-secondary-200 px-4 py-3">Illimité (si absence constatée)</td>
                <td className="border border-secondary-200 px-4 py-3">Nouveau diagnostic requis</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">ERP (état des risques)</td>
                <td className="border border-secondary-200 px-4 py-3">6 mois</td>
                <td className="border border-secondary-200 px-4 py-3">Nouveau diagnostic requis</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Diagnostic électricité / gaz</td>
                <td className="border border-secondary-200 px-4 py-3">3 ans</td>
                <td className="border border-secondary-200 px-4 py-3">Nouveau diagnostic requis</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Mesurage Carrez</td>
                <td className="border border-secondary-200 px-4 py-3">Illimité (sauf travaux)</td>
                <td className="border border-secondary-200 px-4 py-3">Action en diminution du prix</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* When to regenerate */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Quand faut-il refaire le pré-état daté ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Plusieurs situations doivent vous amener à mettre à jour votre pré-état daté :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le document a <strong>plus de 3 mois</strong> et le compromis n'est toujours pas signé.</li>
          <li>Un <strong>nouvel exercice comptable</strong> a débuté depuis son établissement.</li>
          <li>Une <strong>assemblée générale</strong> a eu lieu et a voté des travaux ou modifié le budget.</li>
          <li>Le notaire vous <strong>demande expressément</strong> une mise à jour.</li>
          <li>Des <strong>impayés ou procédures</strong> sont apparus depuis la dernière version.</li>
        </ul>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <CalendarClock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Mise à jour rapide sur Pre-etat-date.ai</h3>
            <p className="text-sm text-secondary-600">
              Si votre pré-état daté n'est plus à jour, vous pouvez en générer un nouveau en
              5 minutes sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link> pour
              24,99 EUR. Il suffit de déposer vos documents les plus récents et l'IA produit
              un document conforme au modèle CSN.
            </p>
          </div>
        </div>

        {/* What happens if compromis takes long */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que se passe-t-il si le compromis prend du retard ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Il arrive fréquemment que la signature du compromis soit repoussée de plusieurs semaines,
          voire plusieurs mois. Dans ce cas, le pré-état daté initialement fourni peut ne plus
          refléter la réalité financière de la copropriété. Le notaire, dans le cadre de son
          devoir de conseil, peut alors demander une actualisation.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette demande est légitime : l'acquéreur a le droit de connaître la situation financière
          exacte de la copropriété au moment où il s'engage. Un pré-état daté obsolète pourrait
          même constituer un motif de contestation après la vente si des informations importantes
          ont évolué entre-temps. Pour en savoir plus sur les documents nécessaires, consultez
          notre guide sur les <Link to="/guide/documents-necessaires-vente" className="text-primary-600 hover:text-primary-800 font-medium">documents nécessaires pour la vente</Link>.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quelle est la durée de validité légale du pré-état daté ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Il n'existe aucune durée de validité légale. L'article L.721-2 du CCH impose la
              remise du pré-état daté avant le compromis mais ne fixe pas de date limite. En
              pratique, les notaires considèrent qu'un document de moins de 3 mois est fiable.
              Au-delà, une mise à jour peut être demandée.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Faut-il refaire le pré-état daté si la vente prend du retard ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, si le retard dépasse 3 mois ou si un événement majeur est survenu (nouvel
              exercice comptable, assemblée générale, travaux votés). La mise à jour garantit
              que l'acquéreur dispose d'informations exactes. Sur Pre-etat-date.ai, cela prend
              5 minutes pour 24,99 EUR.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le notaire peut-il refuser un pré-état daté de plus de 3 mois ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le notaire ne peut pas le refuser au seul motif de son ancienneté, car aucune
              durée de validité n'est fixée par la loi. Il peut en revanche demander une mise à
              jour si les données ne correspondent plus à la situation actuelle de la copropriété.
              Cette demande relève de son devoir de conseil. Consultez
              notre <Link to="/faq" className="text-primary-600 hover:text-primary-800 font-medium">FAQ</Link> pour
              d'autres questions.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="validite-pre-etat-date" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Votre pré-état daté n'est plus à jour ?
          </h2>
          <p className="text-secondary-500 mb-6">
            Régénérez-le en 5 minutes pour 24,99 EUR. Conforme au modèle CSN.
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
