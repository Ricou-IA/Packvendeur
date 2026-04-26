import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { trackingService } from '@services/tracking.service';

const DISMISS_KEY = 'pv-partner-banner-dismissed';

export default function PartnerBanner() {
  const [partner, setPartner] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setPartner(trackingService.getPartner());
    if (typeof window !== 'undefined') {
      try {
        setDismissed(sessionStorage.getItem(DISMISS_KEY) === '1');
      } catch {
        // ignore
      }
    }
  }, []);

  if (!partner || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  };

  return (
    <div className="bg-indigo-50 border-b border-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-indigo-900">
          <Sparkles className="h-4 w-4 text-indigo-600 flex-shrink-0" />
          <span>
            Service proposé en partenariat avec{' '}
            <strong className="font-semibold">{partner.partner_name}</strong> :
            bénéficiez de l'analyse IA prioritaire.
          </span>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Masquer la bannière partenaire"
          className="text-indigo-500 hover:text-indigo-800 transition-colors flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
