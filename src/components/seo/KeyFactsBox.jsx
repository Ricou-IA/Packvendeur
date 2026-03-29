/**
 * Reusable "key facts" box for blog articles (GEO optimization).
 *
 * Renders a styled definition list that AI search engines can
 * easily parse as structured data.
 *
 * Usage:
 *   <KeyFactsBox items={[
 *     { label: "Délai", value: "5 à 10 minutes" },
 *     { label: "Prix", value: "24,99 EUR" },
 *   ]} />
 */

export default function KeyFactsBox({ title = "L'essentiel en bref", items }) {
  return (
    <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
      <h2 className="text-lg font-semibold text-primary-800 mb-3">
        {title}
      </h2>
      <dl className="space-y-2 text-sm text-secondary-700">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <dt className="font-semibold min-w-[160px]">{item.label} :</dt>
            <dd>{item.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
