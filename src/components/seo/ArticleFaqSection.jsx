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
 */

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
