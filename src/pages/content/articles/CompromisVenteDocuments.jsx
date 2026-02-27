import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema } from '@components/seo/JsonLd';

export default function CompromisVenteDocuments() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Documents obligatoires pour le compromis de vente en copropriété"
        description="Liste complète des documents obligatoires à annexer au compromis de vente en copropriété : loi ALUR, diagnostics, pré-état daté."
        canonical="/guide/compromis-vente-copropriete-documents"
        type="article"
      />
      <JsonLd
        data={articleSchema({
          title: 'Documents obligatoires pour le compromis de vente en copropriété',
          description: 'Liste complète des documents obligatoires à annexer au compromis de vente en copropriété : loi ALUR, diagnostics, pré-état daté.',
          slug: 'compromis-vente-copropriete-documents',
          datePublished: '2026-02-25',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Guides', url: '/guide' },
          { name: 'Documents compromis de vente' },
        ])}
      />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Documents obligatoires pour le compromis de vente en copropriété
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-25">Mis à jour le 25 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            9 min de lecture
          </span>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Lors de la vente d'un lot en copropriété, la signature du compromis (ou promesse de vente)
          impose l'annexion d'un nombre important de documents. La loi ALUR du 24 mars 2014,
          codifiée à l'article L.721-2 du Code de la Construction et de l'Habitation (CCH), a
          considérablement renforcé ces obligations. Un dossier incomplet peut retarder la vente de
          plusieurs semaines. Voici la liste exhaustive des documents à préparer.
        </p>

        {/* Pre-etat date */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le pré-état daté : le document central
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté est le document qui synthétise l'ensemble des informations financières et
          juridiques relatives au lot et à la copropriété. Bien qu'il ne soit pas nommé explicitement
          dans la loi, il est le moyen le plus courant de satisfaire aux obligations de l'article
          L.721-2 du CCH. Il regroupe notamment :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Le montant des charges courantes du budget prévisionnel et des charges hors budget sur les 2 derniers exercices.</li>
          <li>Les sommes susceptibles d'être dues au syndic par l'acquéreur (provisions non encore exigibles, avances, fonds de travaux).</li>
          <li>L'état global des impayés de charges au sein de la copropriété et de la dette vis-à-vis des fournisseurs.</li>
          <li>Le montant de la part du fonds de travaux rattachée au lot vendu.</li>
          <li>Les éventuelles procédures judiciaires en cours concernant la copropriété.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté peut être établi par le syndic (moyennant 200 à 600 EUR en moyenne), par
          le vendeur lui-même, ou via un service en ligne comme Pack Vendeur. Le Conseil Supérieur du
          Notariat a confirmé que le recours au syndic n'est pas obligatoire pour ce document.
        </p>

        {/* Documents de copropriete */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Documents relatifs à l'organisation de la copropriété
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article L.721-2 I du CCH impose l'annexion des documents suivants au compromis :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>La fiche synthétique de la copropriété</strong> (article 8-2 de la loi du 10 juillet 1965) : résumé annuel des données essentielles de la copropriété (nombre de lots, syndic, budget, assurance).</li>
          <li><strong>Le règlement de copropriété</strong> et l'état descriptif de division, ainsi que les actes les ayant modifiés, s'ils ont été publiés.</li>
          <li><strong>Les procès-verbaux des assemblées générales des 3 dernières années</strong>, ou les PV disponibles depuis l'entrée en jouissance du vendeur si celle-ci remonte à moins de 3 ans.</li>
          <li><strong>Le carnet d'entretien de l'immeuble</strong> : recense les travaux réalisés, les contrats d'entretien et d'assurance de l'immeuble.</li>
          <li><strong>La notice d'information</strong> relative aux droits et obligations des copropriétaires, ainsi qu'au fonctionnement des instances de la copropriété.</li>
        </ul>

        {/* Documents financiers */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Documents financiers
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les informations financières prévues par l'article L.721-2 II du CCH doivent être
          communiquées à l'acquéreur. Elles sont généralement contenues dans le pré-état daté et
          complétées par les documents suivants :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Le budget prévisionnel</strong> de l'exercice en cours, voté en assemblée générale.</li>
          <li><strong>Les relevés de charges</strong> des 2 derniers exercices comptables clos, détaillant les charges courantes et exceptionnelles du lot.</li>
          <li><strong>Les appels de fonds récents</strong> montrant les provisions trimestrielles ou mensuelles appelées par le syndic.</li>
          <li><strong>L'état des impayés</strong> de la copropriété et la dette vis-à-vis des fournisseurs.</li>
          <li><strong>Le montant du fonds de travaux</strong> rattaché au lot, rendu obligatoire par la loi ALUR (cotisation annuelle minimale de 2,5 % du budget prévisionnel).</li>
        </ul>

        {/* Documents techniques */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Documents techniques et plans
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article L.721-2 III du CCH prévoit l'annexion des documents techniques relatifs à
          l'immeuble lorsqu'ils existent :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Le Diagnostic Technique Global (DTG)</strong>, s'il a été réalisé. Il évalue l'état général de l'immeuble, ses équipements communs et les travaux nécessaires sur 10 ans.</li>
          <li><strong>Le plan pluriannuel de travaux (PPT)</strong>, obligatoire depuis le 1er janvier 2025 pour les copropriétés de plus de 15 ans. Il projette les travaux à réaliser sur 10 ans avec une estimation budgétaire.</li>
          <li><strong>L'audit énergétique</strong>, lorsqu'il a été réalisé (obligatoire pour certaines copropriétés dans le cadre de la loi Climat et Résilience).</li>
        </ul>

        {/* DDT - Diagnostics techniques */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le Dossier de Diagnostics Techniques (DDT)
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le DDT regroupe l'ensemble des diagnostics immobiliers obligatoires du lot vendu. Il doit
          être annexé au compromis de vente. Les diagnostics sont à la charge du vendeur et doivent
          être réalisés par un diagnostiqueur certifié :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>DPE (Diagnostic de Performance Énergétique)</strong> : obligatoire, opposable depuis 2021, valable 10 ans.</li>
          <li><strong>Diagnostic amiante</strong> : obligatoire pour les immeubles dont le permis de construire date d'avant le 1er juillet 1997.</li>
          <li><strong>Diagnostic plomb (CREP)</strong> : obligatoire pour les immeubles construits avant le 1er janvier 1949, valable 1 an si positif.</li>
          <li><strong>Diagnostic électricité</strong> : obligatoire si l'installation a plus de 15 ans, valable 3 ans.</li>
          <li><strong>Diagnostic gaz</strong> : obligatoire si l'installation a plus de 15 ans, valable 3 ans.</li>
          <li><strong>État des Risques et Pollutions (ERP)</strong> : obligatoire dans toutes les communes, valable 6 mois.</li>
          <li><strong>Diagnostic termites</strong> : obligatoire dans les zones délimitées par arrêté préfectoral, valable 6 mois.</li>
          <li><strong>Mesurage Carrez</strong> : obligatoire pour tout lot en copropriété de plus de 8 m², valable sans limite sauf travaux.</li>
        </ul>

        {/* Consequences documents manquants */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que se passe-t-il si des documents manquent ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'absence de documents obligatoires au moment de la signature du compromis a des conséquences
          juridiques importantes pour le vendeur :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Le délai de rétractation ne court pas</strong> : l'acquéreur dispose d'un délai de 10 jours pour se rétracter après la signature du compromis. Ce délai ne commence à courir qu'à compter de la notification du dernier document manquant. Un dossier incomplet peut donc prolonger le délai de rétractation de plusieurs semaines.</li>
          <li><strong>Le notaire peut refuser de faire signer</strong> : en pratique, la plupart des notaires exigent un dossier complet avant la signature du compromis pour sécuriser la transaction.</li>
          <li><strong>Risque de nullité ou de réduction de prix</strong> : l'absence de certains diagnostics (notamment le DPE ou le mesurage Carrez) peut donner lieu à une action en nullité ou en réduction du prix par l'acquéreur.</li>
          <li><strong>Responsabilité du vendeur</strong> : le vendeur peut être tenu responsable des vices cachés liés à l'absence de diagnostics (par exemple, présence d'amiante non signalée).</li>
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 mb-4">
          <div className="text-sm text-amber-800 leading-relaxed">
            <strong>Conseil pratique :</strong> Préparez l'intégralité de votre dossier avant même de
            mettre votre bien en vente. Commandez les diagnostics techniques dès la décision de vendre
            et rassemblez les documents de copropriété via l'extranet de votre syndic. Un dossier
            complet le jour de la signature du compromis est le meilleur gage d'une vente rapide et
            sécurisée.
          </div>
        </div>

        {/* Recapitulatif */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Récapitulatif : la checklist du compromis
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Voici la liste complète des documents à préparer pour la signature du compromis de vente
          d'un lot en copropriété :
        </p>
        <ol className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-decimal mb-4">
          <li>Pré-état daté (informations financières et juridiques).</li>
          <li>Fiche synthétique de la copropriété.</li>
          <li>Règlement de copropriété et état descriptif de division.</li>
          <li>PV des 3 dernières assemblées générales.</li>
          <li>Carnet d'entretien de l'immeuble.</li>
          <li>Notice d'information copropriétaire.</li>
          <li>Budget prévisionnel en cours.</li>
          <li>Relevés de charges des 2 derniers exercices.</li>
          <li>Plan pluriannuel de travaux (si existant).</li>
          <li>DTG et audit énergétique (si existants).</li>
          <li>DDT complet : DPE, amiante, plomb, électricité, gaz, ERP, termites, mesurage Carrez.</li>
        </ol>

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Constituez votre dossier de vente en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            Uploadez vos documents, notre IA les analyse et génère votre pré-état daté conforme
            au modèle CSN, prêt à annexer au compromis.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Générer mon pré-état daté
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>

        {/* Liens connexes */}
        <div className="mt-8 pt-6 border-t border-secondary-200">
          <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-3">
            Articles connexes
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/guide/documents-necessaires-vente" className="text-primary-600 hover:text-primary-700 hover:underline">
                Documents nécessaires pour vendre en copropriété
              </Link>
            </li>
            <li>
              <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:text-primary-700 hover:underline">
                Qu'est-ce que le pré-état daté ?
              </Link>
            </li>
            <li>
              <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-700 hover:underline">
                Loi ALUR et copropriété : ce que le vendeur doit savoir
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
}
