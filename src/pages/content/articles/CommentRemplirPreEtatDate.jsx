import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, faqSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function CommentRemplirPreEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Comment remplir un pré-état daté soi-même ? Guide pas à pas 2026"
        description="Guide complet pour remplir un pré-état daté : documents nécessaires, 6 étapes détaillées, pièges à éviter. Alternative IA en 5 minutes."
        canonical="/guide/comment-remplir-pre-etat-date"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Comment remplir un pré-état daté soi-même ? Guide pas à pas 2026",
        description: "Guide complet pour remplir un pré-état daté : documents nécessaires, 6 étapes détaillées, pièges à éviter.",
        slug: 'comment-remplir-pre-etat-date',
        datePublished: '2026-03-30',
        dateModified: '2026-04-26',
      })} />
      <JsonLd data={faqSchema([
        {
          question: "Peut-on remplir soi-même son pré-état daté ?",
          answer: "Oui, le vendeur peut légalement constituer son pré-état daté lui-même, sans passer par le syndic. Le Conseil Supérieur du Notariat (CSN) a confirmé cette possibilité. Il faut cependant disposer des documents de copropriété nécessaires et maîtriser les calculs financiers (tantièmes, prorata de charges).",
        },
        {
          question: "Quels documents faut-il pour remplir un pré-état daté ?",
          answer: "Les documents indispensables sont : les 3 derniers PV d'assemblée générale, les appels de fonds ou relevés de charges, le règlement de copropriété, la fiche synthétique, le carnet d'entretien, le DPE et les diagnostics obligatoires. Ces documents permettent de renseigner les sections financière, juridique et technique.",
        },
        {
          question: "Combien de temps faut-il pour remplir un pré-état daté ?",
          answer: "Remplir manuellement un pré-état daté prend généralement 2 à 5 heures pour un non-spécialiste : rassembler les documents, extraire les données financières, vérifier les calculs et mettre en forme le document. Avec Pre-etat-date.ai, le processus prend 5 à 10 minutes grâce à l'extraction automatique par IA.",
        },
      ])} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Pré-état daté', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Comment remplir un pré-état daté' },
      ])} />

      <Breadcrumb items={[
        { label: 'Pré-état daté', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Comment remplir un pré-état daté' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Comment remplir un pré-état daté soi-même ? Guide pas à pas
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-30">Mis à jour le 30 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            9 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Peut-on le faire seul :</dt>
              <dd>Oui, c'est légal (confirmé par le CSN)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Documents requis :</dt>
              <dd>PV d'AG (3 derniers), relevés de charges, règlement, DPE, diagnostics</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Temps estimé :</dt>
              <dd>2 à 5 heures (manuel) vs 5 minutes (IA)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Difficulté principale :</dt>
              <dd>Calculs financiers (tantièmes, prorata, fonds de travaux)</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Vous souhaitez remplir votre <Link to="/" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">pré-état daté</Link> vous-même pour éviter les frais du syndic
          (150 à 600 €) ? C'est tout à fait possible et légal. Ce guide détaille les 6 étapes
          à suivre, les documents nécessaires et les erreurs à éviter.
        </p>

        {/* Prérequis */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Étape 1 : Rassembler les documents nécessaires
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Avant de commencer, vérifiez que vous disposez des documents suivants :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Les 3 derniers PV d'assemblée générale</strong> : ils contiennent les travaux votés, les procédures en cours et les comptes approuvés.</li>
          <li><strong>Les appels de fonds</strong> ou relevés de charges de l'exercice en cours et de l'exercice précédent.</li>
          <li><strong>Le règlement de copropriété</strong> et l'état descriptif de division (pour les tantièmes).</li>
          <li><strong>La fiche synthétique</strong> de la copropriété (obligatoire depuis la loi ALUR).</li>
          <li><strong>Le carnet d'entretien</strong> de l'immeuble.</li>
          <li><strong>Le DPE</strong> et les diagnostics techniques obligatoires.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous n'avez pas certains documents, vous pouvez les demander au syndic (qui est
          tenu de les fournir) ou les retrouver sur l'extranet de votre copropriété.
        </p>

        {/* Section financière */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Étape 2 : Remplir la section financière
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est la partie la plus complexe. Vous devez renseigner :
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Le budget prévisionnel
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Reportez le montant total du budget prévisionnel voté en assemblée générale pour
          l'exercice en cours. Ce montant figure dans le PV de la dernière AG.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Les charges courantes du lot
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Calculez la quote-part de votre lot : <strong>tantièmes du lot ÷ tantièmes totaux ×
          budget prévisionnel</strong>. Les tantièmes figurent dans le règlement de copropriété
          ou l'état descriptif de division. Vérifiez que ce calcul correspond aux appels de
          fonds que vous recevez.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Les charges exceptionnelles
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Indiquez les travaux votés en AG dont les appels de fonds n'ont pas encore été
          intégralement appelés. Précisez le montant total et votre quote-part.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Impayés et fonds de travaux
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Indiquez vos éventuels impayés de charges, les dettes de la copropriété envers ses
          fournisseurs, et le solde du fonds de travaux (cotisation obligatoire depuis la loi ALUR).
        </p>

        {/* Section juridique */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Étape 3 : Remplir la section copropriété et juridique
        </h2>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Indiquez le <strong>nom et les coordonnées du syndic</strong> en exercice.</li>
          <li>Listez les <strong>procédures judiciaires en cours</strong> impliquant la copropriété (consultez les PV d'AG).</li>
          <li>Mentionnez les <strong>travaux votés mais non encore réalisés</strong> et leur montant.</li>
          <li>Joignez le <strong>plan pluriannuel de travaux</strong> (PPT) s'il existe.</li>
        </ul>

        {/* Section technique */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Étape 4 : Remplir la section technique et diagnostics
        </h2>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Reportez les résultats du <strong>DPE</strong> : classes énergie et GES, date de réalisation, numéro ADEME.</li>
          <li>Listez les <strong>diagnostics obligatoires</strong> avec leurs dates et résultats : amiante, plomb, électricité, gaz, ERP, mesurage Carrez.</li>
          <li>Mentionnez le <strong>DTG</strong> et l'audit énergétique de l'immeuble s'ils existent.</li>
        </ul>

        {/* Vérification */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Étape 5 : Vérifier la cohérence des données
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Avant de transmettre votre pré-état daté, vérifiez les points suivants :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le calcul des charges via les tantièmes correspond aux appels de fonds réels (tolérance de 5 %).</li>
          <li>Les dates des diagnostics sont cohérentes (un DPE de plus de 10 ans n'est plus valide).</li>
          <li>Les procédures et travaux mentionnés correspondent bien aux derniers PV d'AG.</li>
          <li>Aucune information obligatoire n'est manquante.</li>
        </ul>

        {/* Transmission */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Étape 6 : Transmettre au notaire
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Une fois le document complété, transmettez-le à votre notaire avec les pièces
          justificatives (PV d'AG, relevés de charges, DPE, etc.). Le notaire l'annexera
          à la promesse de vente.
        </p>

        {/* Pièges à éviter */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 5 erreurs les plus fréquentes
        </h2>
        <ol className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-decimal mb-4">
          <li><strong>Confondre tantièmes généraux et spéciaux</strong> : utilisez les tantièmes de charges générales (PCG), pas ceux d'un escalier ou d'un bâtiment spécifique.</li>
          <li><strong>Oublier les charges exceptionnelles</strong> : les travaux votés mais non encore appelés doivent figurer dans le document.</li>
          <li><strong>Ne pas mentionner les procédures en cours</strong> : même une procédure mineure doit être déclarée.</li>
          <li><strong>Utiliser un DPE périmé</strong> : les DPE réalisés avant le 1er juillet 2021 ne sont plus opposables.</li>
          <li><strong>Oublier le fonds de travaux</strong> : la cotisation et le solde doivent être mentionnés depuis la loi ALUR.</li>
        </ol>

        {/* Alternative */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          L'alternative : laisser l'IA le faire pour vous
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si remplir un pré-état daté vous semble trop complexe ou chronophage,
          <strong> Pre-etat-date.ai</strong> automatise l'ensemble du processus :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Déposez vos PDF (PV d'AG, relevés de charges, DPE, etc.).</li>
          <li>L'IA extrait automatiquement toutes les données financières, juridiques et techniques.</li>
          <li>Vous validez les informations extraites avant génération du document.</li>
          <li>Recevez un PDF conforme au modèle CSN en 5 minutes, avec lien de partage pour votre notaire.</li>
        </ul>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse border border-secondary-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-secondary-50">
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Critère</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Remplir soi-même</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-primary-700 bg-primary-50">Pre-etat-date.ai</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Temps</td>
                <td className="p-3 border border-secondary-200">2 à 5 heures</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">5 à 10 minutes</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Coût</td>
                <td className="p-3 border border-secondary-200">Gratuit</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">24,99 €</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Compétences requises</td>
                <td className="p-3 border border-secondary-200">Comptabilité copropriété</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">Aucune</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Conformité garantie</td>
                <td className="p-3 border border-secondary-200">Non</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">Oui (satisfait ou remboursé)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <RelatedArticles currentSlug="comment-remplir-pre-etat-date" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Pas envie de remplir à la main ?
          </h2>
          <p className="text-secondary-500 mb-6">
            Déposez vos documents, l'IA les analyse et génère votre pré-état daté conforme en 5 minutes.
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
