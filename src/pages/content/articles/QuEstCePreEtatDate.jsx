import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';

export default function QuEstCePreEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Qu'est-ce qu'un pré-état daté ? Guide complet 2026"
        description="Définition complète du pré-état daté : cadre légal (loi ALUR, art. L.721-2 CCH), contenu obligatoire, qui doit le fournir, et comment l'obtenir facilement."
        canonical="/guide/quest-ce-pre-etat-date"
        type="article"
      />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Qu'est-ce qu'un pré-état daté ? Guide complet 2026
        </h1>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Vous vendez un bien en copropriété et votre notaire vous demande un pré-état daté ? Ce
          document est devenu incontournable dans toute transaction immobilière en copropriété. Voici
          tout ce que vous devez savoir : sa définition, son cadre légal, son contenu et comment
          l'obtenir.
        </p>

        {/* Definition */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Définition du pré-état daté
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté est un document qui recense la situation financière, juridique et technique
          d'un lot de copropriété au moment de sa mise en vente. Il permet à l'acquéreur potentiel
          de connaître les charges, les travaux votés, les procédures en cours et la santé financière
          de la copropriété avant de s'engager.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Concrètement, le pré-état daté est annexé à la promesse de vente (ou au compromis de vente)
          et constitue une pièce essentielle du dossier de vente en copropriété.
        </p>

        {/* Cadre legal */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le cadre légal : la loi ALUR de 2014
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté trouve son fondement dans la <strong>loi ALUR du 24 mars 2014</strong> (loi
          pour l'Accès au Logement et un Urbanisme Rénové). Cette loi a renforcé les obligations
          d'information de l'acquéreur en copropriété en créant l'<strong>article L.721-2 du Code de
          la Construction et de l'Habitation (CCH)</strong>.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cet article impose au vendeur de fournir à l'acquéreur, dès la promesse de vente, un
          ensemble d'informations relatives à l'organisation de la copropriété, à la situation
          financière du copropriétaire vendeur et à l'état de l'immeuble. Le pré-état daté est le
          document qui rassemble toutes ces informations.
        </p>

        {/* Contenu */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que contient le pré-état daté ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté se compose de trois grandes parties :
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          1. La partie financière
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le budget prévisionnel de la copropriété et les charges courantes du lot.</li>
          <li>Les charges exceptionnelles votées non encore appelées.</li>
          <li>L'état des impayés du vendeur et de la copropriété (dettes envers les fournisseurs).</li>
          <li>Le montant du fonds de travaux (loi ALUR) et la part du vendeur.</li>
          <li>Les tantièmes du lot par rapport au total de la copropriété.</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          2. La partie copropriété et juridique
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le nom et les coordonnées du syndic de copropriété.</li>
          <li>Les procédures judiciaires en cours impliquant la copropriété.</li>
          <li>Les travaux votés en assemblée générale mais non encore réalisés.</li>
          <li>Le plan pluriannuel de travaux (PPT) s'il existe.</li>
        </ul>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          3. La partie technique
        </h3>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le Diagnostic de Performance Énergétique (DPE) avec les classes énergie et GES.</li>
          <li>Les diagnostics obligatoires : amiante, plomb, électricité, gaz, ERP, mesurage Carrez.</li>
          <li>Le Diagnostic Technique Global (DTG) de l'immeuble s'il existe.</li>
        </ul>

        {/* Qui doit le fournir */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qui doit fournir le pré-état daté ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est le <strong>vendeur</strong> qui est responsable de fournir les informations contenues
          dans le pré-état daté. Contrairement à une idée reçue, le vendeur n'est pas obligé de passer
          par son syndic pour l'obtenir.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le Conseil Supérieur du Notariat (CSN) a confirmé cette position : le vendeur peut constituer
          ce document lui-même, à condition de rassembler les informations nécessaires à partir des
          documents de la copropriété en sa possession.
        </p>

        {/* Comment l'obtenir */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment obtenir son pré-état daté ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Trois options s'offrent au vendeur :
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Option 1 : Le demander au syndic (150 à 600 EUR)
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La solution traditionnelle, mais souvent coûteuse et lente (15 à 30 jours de délai). Le
          coût varie selon les syndics et n'est pas plafonné, contrairement à l'état daté (380 EUR
          max).
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Option 2 : Le constituer soi-meme (gratuit mais complexe)
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Légalement possible, mais cela demande de maîtriser le cadre juridique, d'éplucher les
          documents comptables et de produire un document conforme aux attentes des notaires.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Option 3 : Utiliser un service en ligne comme Pack Vendeur (19,99 EUR)
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La solution la plus rapide et économique. Pack Vendeur utilise l'intelligence artificielle
          pour analyser vos documents de copropriété et générer automatiquement un pré-état daté
          conforme au modèle CSN, en quelques minutes seulement.
        </p>

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Générez votre pré-état daté en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            19,99 EUR au lieu de 150 à 600 EUR chez le syndic. Conforme loi ALUR.
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
