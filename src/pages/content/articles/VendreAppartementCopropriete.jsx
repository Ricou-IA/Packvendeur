import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema } from '@components/seo/JsonLd';

export default function VendreAppartementCopropriete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Vendre un appartement en copropriété : le guide complet 2026"
        description="Toutes les étapes pour vendre un appartement en copropriété : documents obligatoires, diagnostics, pré-état daté, état daté, compromis de vente."
        canonical="/guide/vendre-appartement-copropriete"
        type="article"
      />

      <JsonLd
        data={articleSchema({
          title: 'Vendre un appartement en copropriété : le guide complet 2026',
          description:
            'Toutes les étapes pour vendre un appartement en copropriété : documents obligatoires, diagnostics, pré-état daté, état daté, compromis de vente.',
          slug: 'vendre-appartement-copropriete',
          datePublished: '2026-02-15',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Guides', url: '/guide' },
          { name: 'Vendre un appartement en copropriété' },
        ])}
      />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Vendre un appartement en copropriété : le guide complet 2026
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-15">Mis à jour le 15 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            10 min de lecture
          </span>
        </div>

        {/* Introduction */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Introduction
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Vendre un appartement en copropriété est une opération plus complexe qu'une vente
          immobilière classique. En plus des démarches habituelles (estimation, mandat, diagnostics),
          le vendeur doit fournir un ensemble de documents spécifiques à la copropriété, imposés
          par la <strong>loi ALUR de 2014</strong>. Pré-état daté, état daté, fiche synthétique,
          PV d'assemblées générales : la liste est longue et les délais peuvent être serrés.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Ce guide vous accompagne étape par étape dans le processus de vente, de l'estimation
          de votre bien jusqu'à la signature de l'acte authentique chez le notaire. Vous
          découvrirez quels documents préparer, comment constituer votre dossier de vente et
          comment gagner du temps grâce aux outils numériques.
        </p>

        {/* Les étapes clés */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les étapes clés de la vente
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La vente d'un appartement en copropriété suit un parcours bien défini. Voici les
          grandes étapes à respecter dans l'ordre chronologique :
        </p>
        <ol className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-decimal mb-4">
          <li>
            <strong>Estimation du bien</strong> : faites estimer votre appartement par un ou
            plusieurs agents immobiliers, ou utilisez les données de prix au m² de votre quartier.
            Tenez compte de l'état de la copropriété et des travaux votés.
          </li>
          <li>
            <strong>Mandat de vente</strong> : choisissez entre un mandat exclusif ou simple avec
            une agence, ou optez pour la vente entre particuliers. Chaque option a ses avantages
            en termes de visibilité et de coût.
          </li>
          <li>
            <strong>Réalisation des diagnostics techniques</strong> : faites appel à un
            diagnostiqueur certifié pour le DPE, l'amiante, le plomb, l'électricité, le gaz,
            l'ERP et le mesurage Carrez. Comptez 200 à 500 EUR pour un pack complet.
          </li>
          <li>
            <strong>Constitution du pré-état daté</strong> : rassemblez les informations financières,
            juridiques et techniques de la copropriété. Ce document est annexé au compromis de vente.
          </li>
          <li>
            <strong>Signature du compromis de vente</strong> : l'acquéreur dispose ensuite d'un
            délai de rétractation de 10 jours. Le compromis doit être accompagné de tous les
            documents obligatoires, sous peine de prolongation du délai.
          </li>
          <li>
            <strong>Obtention de l'état daté</strong> : ce document est demandé au syndic par le
            notaire après la signature du compromis. Son prix est plafonné à 380 EUR TTC.
          </li>
          <li>
            <strong>Signature de l'acte authentique</strong> : le transfert de propriété a lieu
            chez le notaire, généralement 2 à 3 mois après le compromis.
          </li>
        </ol>

        {/* Documents obligatoires */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les documents obligatoires
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La loi ALUR a considérablement renforcé les obligations d'information de l'acquéreur
          en copropriété. Voici les principaux documents que le vendeur doit fournir :
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Documents de copropriété (loi ALUR)
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le <strong>règlement de copropriété</strong> et ses modificatifs éventuels.</li>
          <li>L'<strong>état descriptif de division</strong> identifiant chaque lot et ses tantièmes.</li>
          <li>Les <strong>PV des 3 dernières assemblées générales</strong>.</li>
          <li>La <strong>fiche synthétique de la copropriété</strong> (données essentielles : nombre de lots, budget, syndic).</li>
          <li>Le <strong>carnet d'entretien de l'immeuble</strong>.</li>
          <li>Le <strong>plan pluriannuel de travaux (PPT)</strong> s'il existe (obligatoire pour les copropriétés de plus de 15 ans depuis 2025).</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Diagnostics techniques (DDT)
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>DPE</strong> (Diagnostic de Performance Énergétique) : obligatoire et opposable, valable 10 ans.</li>
          <li><strong>Amiante</strong> : pour les immeubles dont le permis de construire est antérieur au 1er juillet 1997.</li>
          <li><strong>Plomb (CREP)</strong> : pour les immeubles construits avant le 1er janvier 1949.</li>
          <li><strong>Électricité et gaz</strong> : si les installations ont plus de 15 ans.</li>
          <li><strong>ERP</strong> (État des Risques et Pollutions) : obligatoire dans toutes les communes, valable 6 mois.</li>
          <li><strong>Mesurage Carrez</strong> : obligatoire pour tout lot en copropriété de plus de 8 m².</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Documents financiers
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Les <strong>relevés de charges</strong> des 2 derniers exercices.</li>
          <li>Les <strong>appels de fonds</strong> récents (provisions trimestrielles ou mensuelles).</li>
          <li>Le <strong>budget prévisionnel</strong> voté en assemblée générale.</li>
        </ul>

        {/* Le pré-état daté */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le pré-état daté : une étape essentielle
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté est le document qui synthétise la situation financière, juridique et
          technique de votre lot de copropriété. Il est annexé au compromis de vente et permet à
          l'acquéreur de prendre sa décision en toute connaissance de cause.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Contrairement à une idée reçue, le vendeur n'est <strong>pas obligé de passer par
          le syndic</strong> pour obtenir ce document. Le Conseil Supérieur du Notariat (CSN) a
          confirmé que le vendeur peut le constituer lui-même, à condition de rassembler les
          informations requises par l'article L.721-2 du Code de la Construction et de l'Habitation.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté comprend trois volets : les <strong>informations financières</strong> (budget,
          charges, impayés, fonds de travaux), les <strong>informations juridiques</strong> (procédures
          en cours, travaux votés) et les <strong>informations techniques</strong> (diagnostics, DPE).
          Pour en savoir plus, consultez notre{' '}
          <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:underline font-medium">
            guide complet sur le pré-état daté
          </Link>.
        </p>

        {/* Combien coûte la vente */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Combien coûte la vente ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Vendre un appartement en copropriété entraîne plusieurs frais à la charge du vendeur.
          Voici un récapitulatif des principaux postes de dépense :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Honoraires d'agence</strong> : 3 à 7 % du prix de vente selon le mandat
            et l'agence. Négociables, surtout pour les biens de valeur élevée.
          </li>
          <li>
            <strong>Diagnostics techniques</strong> : 200 à 500 EUR pour un pack complet
            (DPE, amiante, plomb, électricité, gaz, ERP, Carrez).
          </li>
          <li>
            <strong>Pré-état daté</strong> : de 0 EUR (DIY) à 600 EUR (syndic), ou 24,99 EUR
            avec Dossiervente.ai.
          </li>
          <li>
            <strong>État daté (syndic)</strong> : plafonné à 380 EUR TTC depuis le décret du
            21 février 2020. Demandé par le notaire après le compromis.
          </li>
          <li>
            <strong>Plus-value immobilière</strong> : imposée à 19 % (+ prélèvements sociaux
            de 17,2 %) sauf si le bien est votre résidence principale.
          </li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Au total, les frais de vente représentent généralement entre 5 et 10 % du prix de vente,
          hors plus-value. Réduire le coût du pré-état daté permet de réaliser une économie
          substantielle sur le budget global.
        </p>

        {/* Accélérer le processus */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment accélérer le processus ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le délai moyen entre la mise en vente et la signature de l'acte authentique est de 3 à
          4 mois. Voici quelques conseils pour gagner du temps :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Anticipez les diagnostics</strong> : commandez-les dès la mise en vente pour
            ne pas retarder le compromis.
          </li>
          <li>
            <strong>Rassemblez vos documents de copropriété en amont</strong> : connectez-vous à
            l'extranet de votre syndic pour télécharger les PV d'AG, appels de fonds et relevés
            de charges.
          </li>
          <li>
            <strong>Préparez le pré-état daté avant la première visite</strong> : un dossier
            complet rassure les acquéreurs et accélère la prise de décision.
          </li>
          <li>
            <strong>Utilisez un service en ligne comme Dossiervente.ai</strong> : en 5 minutes,
            l'intelligence artificielle analyse vos documents de copropriété et génère un
            pré-état daté conforme au modèle du Conseil Supérieur du Notariat. Plus besoin
            d'attendre 15 à 30 jours auprès du syndic.
          </li>
          <li>
            <strong>Transmettez le dossier complet au notaire dès le compromis</strong> : utilisez
            le lien de partage sécurisé pour envoyer tous les documents en un clic.
          </li>
        </ul>

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Préparez votre dossier de vente en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            Pré-état daté conforme loi ALUR et modèle CSN. 24,99 EUR au lieu de 300+ EUR chez le syndic.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Générer mon pré-état daté
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>

        {/* Articles liés */}
        <section className="mt-12 border-t border-secondary-200 pt-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-4">
            Articles connexes
          </h2>
          <ul className="space-y-3">
            <li>
              <Link
                to="/guide/documents-necessaires-vente"
                className="text-primary-600 hover:underline font-medium flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Documents nécessaires pour vendre en copropriété : la liste complète
              </Link>
            </li>
            <li>
              <Link
                to="/guide/difference-pre-etat-date-etat-date"
                className="text-primary-600 hover:underline font-medium flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Différence entre pré-état daté et état daté
              </Link>
            </li>
            <li>
              <Link
                to="/guide/cout-pre-etat-date-syndic"
                className="text-primary-600 hover:underline font-medium flex items-center gap-2"
              >
                <ArrowRight className="h-4 w-4" />
                Coût du pré-état daté : syndic vs en ligne (comparatif 2026)
              </Link>
            </li>
          </ul>
        </section>
      </article>
    </div>
  );
}
