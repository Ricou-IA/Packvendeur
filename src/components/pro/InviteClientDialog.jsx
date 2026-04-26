import { useMemo, useState } from 'react';
import { Mail, Copy, Check, Send, X } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';

const SITE_ORIGIN = 'https://pre-etat-date.ai';

function slugifyCompany(name) {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80);
}

export default function InviteClientDialog({ open, onClose, proAccount }) {
  const [clientEmail, setClientEmail] = useState('');
  const [clientName, setClientName] = useState('');
  const [copied, setCopied] = useState(false);

  const partnerSlug = useMemo(
    () => slugifyCompany(proAccount?.company_name || ''),
    [proAccount?.company_name],
  );

  const partnerLink = useMemo(() => {
    if (!partnerSlug) return `${SITE_ORIGIN}/`;
    return `${SITE_ORIGIN}/vendre/${partnerSlug}`;
  }, [partnerSlug]);

  const subject = `Votre pré-état daté avec ${proAccount?.company_name || 'notre agence'}`;
  const body = useMemo(() => {
    const greeting = clientName ? `Bonjour ${clientName},` : 'Bonjour,';
    const company = proAccount?.company_name || 'notre agence';
    return [
      greeting,
      '',
      `Pour fluidifier la signature du compromis, ${company} vous propose de générer votre pré-état daté en ligne en 5 minutes via notre partenaire Pre-etat-date.ai.`,
      '',
      `Lien dédié : ${partnerLink}`,
      '',
      "Vous déposez vos PDF de copropriété (PV d'AG, charges, DPE) — l'IA extrait les données et nous transmettons le document conforme CSN à votre notaire.",
      '',
      'À très vite,',
      proAccount?.company_name || '',
    ].join('\n');
  }, [clientName, partnerLink, proAccount?.company_name]);

  const mailtoHref = useMemo(() => {
    const params = new URLSearchParams({ subject, body });
    return `mailto:${clientEmail || ''}?${params.toString()}`;
  }, [clientEmail, subject, body]);

  if (!open) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(partnerLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleClose = () => {
    setClientEmail('');
    setClientName('');
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary-600" />
            Inviter un client par email
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-secondary-400 hover:text-secondary-600"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-secondary-500">
            Envoyez un mail pré-rempli avec votre lien partenaire. Tous les dossiers
            créés via ce lien sont attribués à {proAccount?.company_name || 'votre agence'}.
          </p>

          <div>
            <Label htmlFor="client-name">Nom du client (optionnel)</Label>
            <Input
              id="client-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Mme Dupont"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="client-email">Email du client</Label>
            <Input
              id="client-email"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="client@exemple.fr"
              className="mt-1"
            />
          </div>

          <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-3">
            <Label className="text-xs uppercase tracking-wide text-secondary-500">
              Lien partenaire
            </Label>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-sm text-secondary-800 break-all flex-1">
                {partnerLink}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 shrink-0"
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copié' : 'Copier'}
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="email-preview">Aperçu du message</Label>
            <textarea
              id="email-preview"
              value={body}
              readOnly
              rows={8}
              className="w-full mt-1 px-3 py-2 text-sm border border-secondary-200 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-secondary-700 font-mono bg-secondary-50"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>
              Fermer
            </Button>
            <Button asChild className="gap-1.5">
              <a href={mailtoHref}>
                <Send className="h-4 w-4" />
                Ouvrir ma messagerie
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
