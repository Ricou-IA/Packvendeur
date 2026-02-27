import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Menu, X, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';

const NAV_LINKS = [
  { label: 'Comment ça marche', to: '/comment-ca-marche' },
  { label: 'FAQ', to: '/faq' },
  { label: 'Guides', to: '/guide' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-secondary-900 hover:text-primary-600 transition-colors"
        >
          <FileText className="h-6 w-6 text-primary-600" />
          <span className="font-bold text-lg tracking-tight">Dossiervente.ai</span>
        </Link>

        {/* Center: Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-secondary-500 hover:text-secondary-900 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Price badge + CTA (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
            24,99 €
          </span>
          <Button asChild size="sm" className="gap-1.5 rounded-full">
            <Link to="/dossier">
              Commencer
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Mobile: Hamburger button */}
        <button
          type="button"
          className="md:hidden p-2 text-secondary-600 hover:text-secondary-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile: Slide-down menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-secondary-100 bg-white/95 backdrop-blur-sm animate-slide-down">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-secondary-600 hover:text-secondary-900 py-2 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-secondary-200" />
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs font-semibold text-primary-700 bg-primary-50 px-3 py-1 rounded-full">
                24,99 €
              </span>
              <Button asChild size="sm" className="gap-1.5">
                <Link to="/dossier" onClick={() => setMobileOpen(false)}>
                  Commencer
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
