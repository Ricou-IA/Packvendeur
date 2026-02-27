import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * Visual breadcrumb navigation.
 * @param {{ items: { label: string; to?: string }[] }} props
 */
export default function Breadcrumb({ items }) {
  return (
    <nav aria-label="Fil d'Ariane" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-secondary-400">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 flex-shrink-0" />}
              {item.to && !isLast ? (
                <Link
                  to={item.to}
                  className="hover:text-primary-600 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? 'text-secondary-700 font-medium' : ''}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
