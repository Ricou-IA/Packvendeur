import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, Lightbulb } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function DocumentsNecessairesVente() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Documents nécessaires pour vendre en copropriété : la liste complète"
        description="Liste complète des documents obligatoires pour vendre un lot en copropriété : documents de copropriété, financiers, diagnostics techniques, et où les trouver."
        canonical="/guide/documents-necessaires-vente"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Documents nécessaires pour la vente en copropriété",
        description: "La liste complète des documents à rassembler pour préparer la vente de votre lot.",
        slug: 'documents-necessaires-vente',
        datePublished: '2026-02-05',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Documents nécessaires' },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Documents nécessaires' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Documents nécessaires pour vendre en copropriété : la liste complète
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-05">Mis à jour le 5 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            7 min de lecture
          </span>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Vendre un bien en copropriété nécessite de rassembler un nombre important de documents.
          La loi ALUR de 2014 a considérablement allongé la liste des pièces à fournir à l'acquéreur.
          Voici la liste complète, organisée par catégorie, avec nos conseils pour les obtenir
          rapidement.
        </p>

        {/* Categorie 1 : Copropriete */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          1. Documents de copropriété
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Ces documents décrivent l'organisation, le fonctionnement et les décisions de la copropriété.
        </p>
        <ul className="space-y-3 mb-4">
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Règlement de copropriété</strong> et ses modificatifs éventuels. Document
              fondateur de la copropriété qui définit les parties privatives et communes, la
              répartition des charges et les règles de vie.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>État descriptif de division</strong>. Document qui identifie chaque lot
              (numéro, nature, étage, quote-part des parties communes en tantièmes).
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>PV des 3 dernières assemblées générales</strong>. Indispensables pour
              connaître les travaux votés, les procédures en cours et les décisions prises par
              la copropriété.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Fiche synthétique de la copropriété</strong>. Résumé annuel obligatoire
              contenant les données essentielles : nombre de lots, budget, syndic, assurance, etc.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Carnet d'entretien de l'immeuble</strong>. Recense les travaux réalisés et
              les contrats d'entretien en cours (ascenseur, chaudiere, etc.).
            </div>
          </li>
        </ul>

        {/* Categorie 2 : Financier */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          2. Documents financiers
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Ces documents permettent à l'acquéreur de connaître les charges et la situation financière
          du lot et de la copropriété.
        </p>
        <ul className="space-y-3 mb-4">
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Relevés de charges des 2 derniers exercices</strong>. Montants détaillés des
              charges courantes et exceptionnelles du lot sur les deux derniers exercices comptables.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Appels de fonds récents</strong>. Les derniers appels de fonds (trimestriels
              ou mensuels) montrant les provisions pour charges courantes et exceptionnelles.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Budget prévisionnel</strong>. Le budget voté en assemblée générale pour
              l'exercice en cours.
            </div>
          </li>
        </ul>

        {/* Categorie 3 : Diagnostics */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          3. Diagnostics techniques
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les diagnostics immobiliers sont obligatoires et doivent être réalisés par un diagnostiqueur
          certifié. Ils sont à la charge du vendeur.
        </p>
        <ul className="space-y-3 mb-4">
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Diagnostic de Performance Énergétique (DPE)</strong>. Obligatoire et
              opposable depuis le 1er juillet 2021. Valable 10 ans. Classe le bien de A (économe)
              à G (énergivore).
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Diagnostic amiante</strong>. Obligatoire pour les immeubles dont le permis
              de construire est antérieur au 1er juillet 1997.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Diagnostic plomb (CREP)</strong>. Obligatoire pour les immeubles construits
              avant le 1er janvier 1949.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Diagnostics électricité et gaz</strong>. Obligatoires si les installations
              ont plus de 15 ans. Valables 3 ans.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>État des Risques et Pollutions (ERP)</strong>. Obligatoire dans toutes les
              communes. Valable 6 mois. Informe sur les risques naturels, miniers, technologiques
              et la pollution des sols.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Mesurage Carrez</strong>. Obligatoire pour tout lot en copropriété d'une
              surface supérieure à 8 m². Valable sans limite de durée sauf en cas de travaux
              modifiant la surface.
            </div>
          </li>
        </ul>

        {/* Categorie 4 : Complementaires */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          4. Documents complémentaires
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Ces documents ne sont pas toujours obligatoires mais renforcent la qualité du dossier :
        </p>
        <ul className="space-y-3 mb-4">
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Plan pluriannuel de travaux (PPT)</strong>. Obligatoire pour les copropriétés
              de plus de 15 ans depuis le 1er janvier 2025. Projette les travaux à réaliser sur 10
              ans.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Diagnostic Technique Global (DTG)</strong>. Analyse l'état global de
              l'immeuble. Non obligatoire sauf si l'AG le décide ou en cas de mise en copropriété
              d'un immeuble de plus de 10 ans.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Taxe foncière</strong>. Le dernier avis de taxe foncière pour informer
              l'acquéreur du montant annuel.
            </div>
          </li>
          <li className="flex items-start gap-3 text-secondary-600 leading-relaxed">
            <CheckCircle className="h-5 w-5 text-secondary-400 flex-shrink-0 mt-0.5" />
            <div>
              <strong>Bail en cours</strong>. Si le bien est loué, le bail et ses avenants doivent
              être fournis.
            </div>
          </li>
        </ul>

        {/* Ou trouver */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Où trouver ces documents ?
        </h2>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 mb-4">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800 leading-relaxed space-y-2">
              <p>
                <strong>L'extranet de votre syndic</strong> est la meilleure source. La plupart des
                syndics (Foncia, Nexity, Citya, etc.) proposent un espace en ligne où vous retrouverez
                les PV d'AG, appels de fonds, relevés de charges et la fiche synthétique.
              </p>
              <p>
                Si votre syndic n'a pas d'extranet, envoyez-lui un email pour demander les documents.
                Il est tenu de vous les fournir en tant que copropriétaire.
              </p>
              <p>
                Les diagnostics techniques sont commandés auprès d'un <strong>diagnostiqueur
                immobilier certifié</strong>. Comptez 200 à 500 EUR pour un pack complet de
                diagnostics.
              </p>
            </div>
          </div>
        </div>

        <RelatedArticles currentSlug="documents-necessaires-vente" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Vos documents sont prêts ?
          </h2>
          <p className="text-secondary-500 mb-6">
            Uploadez-les sur Pack Vendeur et obtenez votre pré-état daté en 5 minutes.
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
