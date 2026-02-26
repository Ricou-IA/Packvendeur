import { Link } from 'react-router-dom';
import { FileText, Facebook, Instagram, Linkedin, Heart } from 'lucide-react';

const PRODUCT_LINKS = [
  { label: 'Comment ça marche', to: '/comment-ca-marche' },
  { label: 'Tarif (24,99 €)', to: '/dossier' },
  { label: 'FAQ', to: '/faq' },
];

const GUIDE_LINKS = [
  { label: "Qu'est-ce qu'un pré-état daté ?", to: '/guide/quest-ce-pre-etat-date' },
  { label: 'Documents nécessaires', to: '/guide/documents-necessaires-vente' },
  { label: 'Coût et tarifs', to: '/guide/cout-pre-etat-date-syndic' },
  { label: 'Loi ALUR', to: '/guide/loi-alur-copropriete' },
  { label: 'État daté vs pré-état daté', to: '/guide/difference-pre-etat-date-etat-date' },
];

const LEGAL_LINKS = [
  { label: 'Mentions légales', to: '/mentions-legales' },
  { label: 'RGPD', to: '/politique-rgpd' },
  { label: 'CGV', to: '/cgv' },
];

export default function Footer() {
  return (
    <footer className="border-t border-secondary-100 bg-secondary-50 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1: Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-secondary-900 mb-3">
              <FileText className="h-5 w-5 text-primary-600" />
              <span className="font-bold text-base tracking-tight">Dossiervente.ai</span>
            </Link>
            <p className="text-sm text-secondary-500 leading-relaxed">
              Pré-état daté en ligne, conforme au modèle CSN.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary-400 hover:text-primary-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Produit */}
          <div>
            <h4 className="font-semibold text-secondary-900 text-sm mb-4">Produit</h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-secondary-500 hover:text-secondary-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Guides */}
          <div>
            <h4 className="font-semibold text-secondary-900 text-sm mb-4">Guides</h4>
            <ul className="space-y-2.5">
              {GUIDE_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-secondary-500 hover:text-secondary-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div>
            <h4 className="font-semibold text-secondary-900 text-sm mb-4">Légal</h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-secondary-500 hover:text-secondary-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="mailto:contact@dossiervente.ai"
                  className="text-sm text-secondary-500 hover:text-secondary-900 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-secondary-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary-400">
          <p>&copy; {new Date().getFullYear()} Dossiervente.ai. Tous droits réservés.</p>
          <p className="flex items-center gap-1">
            Fait avec <Heart className="h-3 w-3 text-red-400 fill-current" /> en France
          </p>
        </div>
      </div>
    </footer>
  );
}
