import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Mail, ArrowRight } from 'lucide-react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@components/ui/collapsible';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';

const FAQ_CATEGORIES = [
  {
    title: 'Général',
    questions: [
      {
        id: 'q1',
        question: "Qu'est-ce qu'un pré-état daté ?",
        answer: (
          <>
            <p className="text-secondary-600 leading-relaxed mb-3">
              Le pré-état daté est un document financier et juridique qui recense la situation d'un lot
              de copropriété avant sa vente. Il informe l'acquéreur des charges, travaux votés, procédures
              en cours et de la situation financière de la copropriété.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              Il est prévu par l'article L.721-2 du Code de la Construction et de l'Habitation, issu de
              la loi ALUR du 24 mars 2014. Ce document doit être annexé à la promesse de vente ou au
              compromis de vente.
            </p>
          </>
        ),
      },
      {
        id: 'q2',
        question: 'Le pré-état daté est-il obligatoire ?',
        answer: (
          <>
            <p className="text-secondary-600 leading-relaxed mb-3">
              La loi ALUR impose la transmission de certaines informations financières et techniques au
              moment de la promesse de vente. Le pré-état daté est le document qui rassemble ces
              informations. Bien qu'il ne soit pas nommé explicitement dans la loi, il est pratiquement
              indispensable pour la signature du compromis de vente.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              Le Conseil Supérieur du Notariat (CSN) a confirmé que le vendeur n'est pas obligé de passer
              par son syndic pour l'établir. Le vendeur peut le constituer lui-même ou faire appel à un
              service en ligne comme Pack Vendeur.
            </p>
          </>
        ),
      },
      {
        id: 'q3',
        question: "Quelle est la différence entre le pré-état daté et l'état daté ?",
        answer: (
          <>
            <p className="text-secondary-600 leading-relaxed mb-3">
              Le <strong>pré-état daté</strong> est fourni <strong>avant</strong> la signature du
              compromis de vente et informe l'acquéreur sur la situation financière et juridique du lot
              et de la copropriété.
            </p>
            <p className="text-secondary-600 leading-relaxed mb-3">
              L'<strong>état daté</strong> est établi par le syndic <strong>après</strong> la signature
              du compromis et avant l'acte authentique chez le notaire. L'état daté est légalement
              obligatoire (article 5 du décret n°67-223 du 17 mars 1967) et son coût est plafonné à
              380 EUR TTC.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              Le pré-état daté peut être établi par le vendeur lui-même ou via un service en ligne,
              tandis que l'état daté doit obligatoirement être fourni par le syndic.
            </p>
          </>
        ),
      },
      {
        id: 'q4',
        question: 'Le document généré par Pack Vendeur est-il accepté par les notaires ?',
        answer: (
          <p className="text-secondary-600 leading-relaxed">
            Oui. Le pré-état daté généré par Pack Vendeur est conforme au modèle du Conseil Supérieur
            du Notariat (CSN). Il contient toutes les informations requises par l'article L.721-2 du
            Code de la Construction et de l'Habitation. Les notaires acceptent ce document car il
            respecte le cadre légal en vigueur et fournit l'ensemble des données financières, juridiques
            et techniques nécessaires à l'information de l'acquéreur.
          </p>
        ),
      },
      {
        id: 'q5',
        question: 'Combien de temps le pré-état daté est-il valable ?',
        answer: (
          <p className="text-secondary-600 leading-relaxed">
            Le pré-état daté n'a pas de durée de validité légale fixe. Cependant, il est recommandé
            qu'il soit établi le plus près possible de la date de signature du compromis. En pratique,
            un document de moins de 3 mois est généralement accepté sans difficulté. Au-delà, le notaire
            peut demander une mise à jour des informations financières, notamment les appels de fonds et
            les relevés de charges.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Processus',
    questions: [
      {
        id: 'q6',
        question: 'Quels documents dois-je fournir ?',
        answer: (
          <>
            <p className="text-secondary-600 leading-relaxed mb-3">
              Les documents essentiels pour générer un pré-état daté complet sont :
            </p>
            <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-3">
              <li>Les 3 derniers PV d'assemblée générale</li>
              <li>Le règlement de copropriété</li>
              <li>Les appels de fonds récents</li>
              <li>Les relevés de charges des 2 derniers exercices</li>
              <li>La fiche synthétique de la copropriété</li>
              <li>Les diagnostics techniques (DPE, amiante, plomb, etc.)</li>
            </ul>
            <p className="text-secondary-600 leading-relaxed">
              Vous trouverez la plupart de ces documents sur l'extranet de votre syndic ou en les
              demandant par email à votre gestionnaire.
            </p>
          </>
        ),
      },
      {
        id: 'q7',
        question: "Comment fonctionne l'analyse par IA ?",
        answer: (
          <>
            <p className="text-secondary-600 leading-relaxed mb-3">
              Notre intelligence artificielle (Google Gemini) analyse chaque document PDF en deux
              phases :
            </p>
            <ol className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-decimal mb-3">
              <li><strong>Classification automatique</strong> : l'IA identifie le type de chaque document (PV d'AG, règlement, DPE, etc.).</li>
              <li><strong>Extraction complète</strong> : l'IA extrait les données financières, juridiques et techniques de l'ensemble des documents.</li>
            </ol>
            <p className="text-secondary-600 leading-relaxed">
              Vous validez ensuite les données extraites dans un formulaire avant la génération du
              document final. L'IA effectue également un recoupement automatique des tantièmes et des
              charges pour détecter d'éventuelles incohérences.
            </p>
          </>
        ),
      },
      {
        id: 'q8',
        question: "Puis-je modifier les données extraites par l'IA ?",
        answer: (
          <p className="text-secondary-600 leading-relaxed">
            Oui, absolument. Après l'analyse IA, vous accédez à un formulaire de validation où
            toutes les données extraites sont pré-remplies. Vous pouvez modifier, corriger ou compléter
            chaque champ avant de procéder au paiement. C'est une étape obligatoire pour garantir
            l'exactitude du document final. L'IA est un outil d'aide, mais la validation humaine
            reste indispensable.
          </p>
        ),
      },
      {
        id: 'q9',
        question: 'Combien de temps faut-il pour obtenir mon pré-état daté ?',
        answer: (
          <>
            <p className="text-secondary-600 leading-relaxed mb-3">
              En moyenne <strong>5 à 10 minutes</strong> :
            </p>
            <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc">
              <li><strong>2 minutes</strong> pour uploader vos documents</li>
              <li><strong>5 minutes</strong> pour l'analyse IA</li>
              <li><strong>3 minutes</strong> pour la validation des données</li>
            </ul>
            <p className="text-secondary-600 leading-relaxed mt-3">
              Le PDF est généré instantanément après le paiement. Comparez avec les 15 à 30 jours
              d'attente habituels du syndic.
            </p>
          </>
        ),
      },
    ],
  },
  {
    title: 'Paiement et livraison',
    questions: [
      {
        id: 'q10',
        question: 'Quel est le prix ?',
        answer: (
          <p className="text-secondary-600 leading-relaxed">
            <strong>19,99 EUR TTC</strong> par dossier. C'est un paiement unique, il n'y a pas
            d'abonnement ni de frais cachés. Comparez avec les 150 à 600 EUR généralement facturés par
            les syndics pour le même service, et vous comprendrez pourquoi de plus en plus de vendeurs
            choisissent Pack Vendeur.
          </p>
        ),
      },
      {
        id: 'q11',
        question: 'Puis-je obtenir un remboursement ?',
        answer: (
          <>
            <p className="text-secondary-600 leading-relaxed mb-3">
              Le service fournit un contenu numérique délivré immédiatement après paiement.
              Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne
              s'applique pas aux contenus numériques fournis immédiatement.
            </p>
            <p className="text-secondary-600 leading-relaxed">
              Cependant, si le document présente un défaut technique (PDF corrompu, erreur de génération),
              contactez-nous a <a href="mailto:contact@pack-vendeur.fr" className="text-primary-600 hover:underline">contact@pack-vendeur.fr</a> et
              nous trouverons une solution.
            </p>
          </>
        ),
      },
      {
        id: 'q12',
        question: 'Comment recevoir mon document ?',
        answer: (
          <>
            <p className="text-secondary-600 leading-relaxed mb-3">
              Après paiement, votre pré-état daté PDF est généré automatiquement. Vous disposez de
              deux moyens pour y accéder :
            </p>
            <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc">
              <li><strong>Téléchargement direct</strong> : cliquez sur le bouton de téléchargement dans l'écran de livraison.</li>
              <li><strong>Lien de partage sécurisé</strong> : copiez le lien et transmettez-le à votre notaire par email.</li>
            </ul>
          </>
        ),
      },
      {
        id: 'q13',
        question: 'Combien de temps le lien de partage est-il valide ?',
        answer: (
          <p className="text-secondary-600 leading-relaxed">
            Le lien de partage notaire est valide <strong>7 jours</strong>. Passé ce délai, les données
            sont automatiquement supprimées conformément au RGPD. Nous vous recommandons de télécharger
            le PDF pour vos archives dès réception. Si votre notaire a besoin d'un délai supplémentaire,
            vous devrez générer un nouveau dossier.
          </p>
        ),
      },
    ],
  },
  {
    title: 'Sécurité et données',
    questions: [
      {
        id: 'q14',
        question: 'Mes données sont-elles sécurisées ?',
        answer: (
          <p className="text-secondary-600 leading-relaxed">
            Oui. Vos documents sont chiffrés en transit (HTTPS/TLS) et au repos. Ils sont stockés
            sur des serveurs Supabase sécurisés et <strong>automatiquement supprimés après 7
            jours</strong>. Nous ne conservons aucune donnée au-delà de cette période. Le paiement est
            traité par Stripe, leader mondial du paiement en ligne, qui est certifié PCI-DSS niveau 1.
          </p>
        ),
      },
      {
        id: 'q15',
        question: 'Qui a accès à mes documents ?',
        answer: (
          <p className="text-secondary-600 leading-relaxed">
            Seul vous (via votre session navigateur) et votre notaire (via le lien de partage que vous
            lui transmettez) avez accès à vos documents. Notre IA analyse les documents de façon
            automatisée sans intervention humaine. Aucun collaborateur de Pack Vendeur n'a accès à
            vos documents dans le cadre normal du service.
          </p>
        ),
      },
      {
        id: 'q16',
        question: 'Pack Vendeur utilise-t-il des cookies ?',
        answer: (
          <p className="text-secondary-600 leading-relaxed">
            Non. Nous n'utilisons aucun cookie de tracking ou publicitaire. Votre session est gérée
            via un identifiant unique stocké localement dans votre navigateur (localStorage). Cet
            identifiant n'est jamais transmis à des tiers et sert uniquement à retrouver votre dossier
            en cours.
          </p>
        ),
      },
    ],
  },
];

function FaqItem({ id, question, answer, isOpen, onToggle }) {
  return (
    <Collapsible open={isOpen} onOpenChange={() => onToggle(id)}>
      <CollapsibleTrigger className="flex items-center justify-between w-full text-left py-4 px-5 rounded-lg hover:bg-secondary-50 transition-colors group">
        <span className="font-medium text-secondary-900 pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-secondary-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-5 pb-4">
        {answer}
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function FaqPage() {
  const [openItems, setOpenItems] = useState(new Set());

  const handleToggle = (id) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="FAQ - Questions fréquentes"
        description="Tout savoir sur le pré-état daté et le service Pack Vendeur : définition, prix, documents nécessaires, sécurité des données."
        canonical="/faq"
      />

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Questions fréquentes</h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
          Tout ce que vous devez savoir sur le pré-état daté et Pack Vendeur
        </p>
      </div>

      {FAQ_CATEGORIES.map((category) => (
        <section key={category.title} className="mb-10">
          <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">{category.title}</h2>
          <div className="border rounded-lg divide-y divide-secondary-200">
            {category.questions.map((q) => (
              <FaqItem
                key={q.id}
                id={q.id}
                question={q.question}
                answer={q.answer}
                isOpen={openItems.has(q.id)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Bottom CTA */}
      <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
          Vous avez d'autres questions ?
        </h2>
        <p className="text-secondary-500 mb-6">
          Notre équipe est disponible pour vous aider.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" asChild>
            <a href="mailto:contact@pack-vendeur.fr" className="gap-2">
              <Mail className="h-4 w-4" />
              Contactez-nous
            </a>
          </Button>
          <Button asChild>
            <Link to="/dossier" className="gap-2">
              Commencer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
