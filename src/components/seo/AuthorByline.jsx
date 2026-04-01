import { Link } from 'react-router-dom';

/**
 * Author byline for E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).
 * Displays author info with link to about page for Google credibility signals.
 */
export default function AuthorByline({ date, readTime }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
      <span>
        Par{' '}
        <Link to="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">
          L'équipe Pre-etat-date.ai
        </Link>
      </span>
      <span className="hidden sm:inline text-secondary-300">|</span>
      {date && <time dateTime={date}>{formatDate(date)}</time>}
      {readTime && (
        <>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <span>{readTime}</span>
        </>
      )}
    </div>
  );
}

function formatDate(isoDate) {
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  ];
  const [year, month, day] = isoDate.split('-').map(Number);
  return `Mis à jour le ${day} ${months[month - 1]} ${year}`;
}
