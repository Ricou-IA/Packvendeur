import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, LayoutDashboard, CreditCard, Settings, LogOut } from 'lucide-react';
import { Button } from '@components/ui/button';
import CreditBadge from './CreditBadge';

const PRO_NAV = [
  { label: 'Dashboard', to: '/pro', icon: LayoutDashboard },
  { label: 'Crédits', to: '/pro/credits', icon: CreditCard },
  { label: 'Paramètres', to: '/pro/settings', icon: Settings },
];

export default function ProHeader({ proAccount, onLogout }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Left: Logo + Pro badge */}
        <div className="flex items-center gap-3">
          <Link
            to="/pro"
            className="flex items-center gap-2 text-secondary-900 hover:text-primary-600 transition-colors"
          >
            <img src="/logo.png" alt="Pre-etat-date.ai" className="h-[80px] w-auto object-contain" />
          </Link>
          <span className="text-xs font-bold text-white bg-primary-600 px-2 py-0.5 rounded uppercase tracking-wider">
            Pro
          </span>
        </div>

        {/* Center: Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {PRO_NAV.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-1.5 text-sm font-medium text-secondary-500 hover:text-secondary-900 transition-colors"
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Credits + company + logout */}
        <div className="hidden md:flex items-center gap-4">
          <CreditBadge credits={proAccount?.credits || 0} />
          <span className="text-sm font-medium text-secondary-700 truncate max-w-[200px]">
            {proAccount?.company_name}
          </span>
          <button
            type="button"
            onClick={onLogout}
            className="p-2 text-secondary-400 hover:text-red-500 transition-colors"
            title="Déconnexion"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-secondary-600 hover:text-secondary-900 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-secondary-100 bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2">
              <span className="text-sm font-medium text-secondary-700">
                {proAccount?.company_name}
              </span>
              <CreditBadge credits={proAccount?.credits || 0} />
            </div>
            <hr className="border-secondary-200" />
            {PRO_NAV.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-2 text-sm font-medium text-secondary-600 hover:text-secondary-900 py-2 transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
            <hr className="border-secondary-200" />
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-700 py-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
