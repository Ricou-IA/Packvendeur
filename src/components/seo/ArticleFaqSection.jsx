/**
 * Reusable FAQ section for blog articles.
 *
 * Renders a "Questions fréquentes" heading followed by Q&A pairs.
 * Each item must have { question: string, answer: string | ReactNode }.
 *
 * Usage:
 *   <ArticleFaqSection items={[
 *     { question: "...", answer: "..." },
 *     { question: "...", answer: <>JSX with <Link /></> },
 *   ]} />
 *
 * Pour les articles ciblant des prescripteurs (notaires/agences), on peut
 * concaténer `PRO_FAQ_ITEMS` afin d'apporter la réassurance B2B (CSN, RGPD, TVA).
 */

/**
 * Items de FAQ B2B réutilisables — réponses aux freins notaires/agences.
 * Conçu pour être ajouté en fin d'ArticleFaqSection sur les articles juridiques
 * à forte valeur prescripteur.
 */
export const PRO_FAQ_ITEMS = [
  {
    question: 'Le pré-état daté généré est-il conforme au modèle CSN ?',
    answer:
      "Oui. Le PDF reprend la structure officielle du modèle CSN (Conseil Supérieur du Notariat) : Partie I financière (charges courantes, exceptionnelles, fonds de travaux, tantièmes, impayés), Partie II-A vie de la copropriété (procédures, travaux votés, plan pluriannuel), Partie II-B technique (DPE, diagnostics, ERP), avec annexe disclaimer et questionnaire vendeur.",
  },
  {
    question: 'Comment les données des dossiers sont-elles conservées (RGPD) ?',
    answer:
      "Les dossiers et documents sont automatiquement purgés après 7 jours via cron, sans intervention humaine. Le bucket de stockage est privé (RLS forcée), accès uniquement par URL signée à expiration de 1 heure. Les documents ne sont jamais réutilisés d'un dossier à l'autre, jamais partagés à des tiers, jamais utilisés pour entraîner les modèles d'IA. La sous-traitance Google (Gemini) est encadrée par un DPA conforme RGPD.",
  },
  {
    question: 'Les factures professionnelles sont-elles à TVA récupérable ?',
    answer:
      "Oui. Chaque achat de crédits B2B déclenche l'émission automatique d'une facture Stripe au nom de votre structure, avec TVA française à 20 % détaillée et numéro de TVA intracommunautaire. La facture est téléchargeable en PDF depuis votre espace pro. La TVA est intégralement récupérable pour les structures assujetties.",
  },
];

export default function ArticleFaqSection({ items }) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
        Questions fréquentes
      </h2>
      <div className="space-y-6 mb-8">
        {items.map((item, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              {item.question}
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
