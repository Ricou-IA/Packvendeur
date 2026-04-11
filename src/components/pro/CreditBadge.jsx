import { Coins } from 'lucide-react';

export default function CreditBadge({ crédits = 0 }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full">
      <Coins className="h-3.5 w-3.5" />
      {crédits} crédit{crédits !== 1 ? 's' : ''}
    </span>
  );
}
