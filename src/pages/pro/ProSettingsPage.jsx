import { useState, useRef } from 'react';
import { Building2, Mail, Upload, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import ProLayout from '@components/pro/ProLayout';
import { useProAccount, useProCredits } from '@hooks/useProAccount';
import { proService } from '@services/pro.service';
import { useQueryClient } from '@tanstack/react-query';
import { proKeys } from '@hooks/useProAccount';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import PageMeta from '@components/seo/PageMeta';

export default function ProSettingsPage() {
  return (
    <ProLayout>
      {({ proAccount }) => <SettingsContent proAccount={proAccount} />}
    </ProLayout>
  );
}

function SettingsContent({ proAccount }) {
  const queryClient = useQueryClient();
  const { transactions } = useProCredits(proAccount.id);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    company_name: proAccount.company_name || '',
    email: proAccount.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    const { error } = await proService.updateAccount(proAccount.id, form);
    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setMessage({ type: 'success', text: 'Parametres sauvegardes' });
      queryClient.invalidateQueries({ queryKey: proKeys.account(proAccount.pro_token) });
    }
    setSaving(false);
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    setMessage(null);

    const { error } = await proService.uploadLogo(proAccount.id, file);
    if (error) {
      setMessage({ type: 'error', text: 'Erreur lors du upload du logo' });
    } else {
      setMessage({ type: 'success', text: 'Logo mis a jour' });
      queryClient.invalidateQueries({ queryKey: proKeys.account(proAccount.pro_token) });
    }
    setUploadingLogo(false);
  };

  return (
    <>
      <PageMeta title="Parametres — Espace Pro | Pre-etat-date.ai" noindex />

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <h1 className="text-2xl font-bold text-secondary-900">Parametres</h1>

        {/* Account settings */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4">Informations de l'agence</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label htmlFor="company_name" className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-secondary-400" />
                Nom de l'agence
              </Label>
              <Input
                id="company_name"
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-secondary-400" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-1"
              />
            </div>
            <Button type="submit" disabled={saving} className="gap-1.5">
              <Save className="h-4 w-4" />
              {saving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </form>
        </div>

        {/* Logo */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4">Logo personnalise</h2>
          <p className="text-sm text-secondary-500 mb-4">
            Votre logo apparaitra sur les documents PDF generes pour vos clients.
          </p>
          <div className="flex items-center gap-4">
            {proAccount.logo_path ? (
              <div className="w-20 h-20 border border-secondary-200 rounded-lg flex items-center justify-center overflow-hidden bg-secondary-50">
                <ImageIcon className="h-8 w-8 text-secondary-300" />
              </div>
            ) : (
              <div className="w-20 h-20 border-2 border-dashed border-secondary-300 rounded-lg flex items-center justify-center">
                <ImageIcon className="h-8 w-8 text-secondary-300" />
              </div>
            )}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingLogo}
                className="gap-1.5"
              >
                <Upload className="h-4 w-4" />
                {uploadingLogo ? 'Upload...' : proAccount.logo_path ? 'Changer le logo' : 'Uploader un logo'}
              </Button>
              <p className="text-xs text-secondary-400 mt-1">PNG, JPEG ou SVG. Max 2 Mo.</p>
            </div>
          </div>
        </div>

        {message && (
          <div className={`text-sm rounded-lg p-3 ${message.type === 'error' ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-green-50 border border-green-200 text-green-700'}`}>
            {message.text}
          </div>
        )}

        {/* Credit history */}
        <div className="bg-white rounded-xl border border-secondary-200 p-6">
          <h2 className="text-lg font-semibold text-secondary-800 mb-4">Historique des credits</h2>
          {transactions.length === 0 ? (
            <p className="text-sm text-secondary-400">Aucune transaction</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-secondary-200">
                    <th className="text-left py-2 text-secondary-500 font-medium">Date</th>
                    <th className="text-left py-2 text-secondary-500 font-medium">Type</th>
                    <th className="text-left py-2 text-secondary-500 font-medium">Description</th>
                    <th className="text-right py-2 text-secondary-500 font-medium">Credits</th>
                    <th className="text-right py-2 text-secondary-500 font-medium">Solde</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-secondary-100">
                      <td className="py-2 text-secondary-600">
                        {format(new Date(tx.created_at), 'dd MMM yyyy HH:mm', { locale: fr })}
                      </td>
                      <td className="py-2">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${tx.type === 'purchase' ? 'bg-green-100 text-green-700' : tx.type === 'usage' ? 'bg-amber-100 text-amber-700' : 'bg-secondary-100 text-secondary-600'}`}>
                          {tx.type === 'purchase' ? 'Achat' : tx.type === 'usage' ? 'Utilisation' : 'Ajustement'}
                        </span>
                      </td>
                      <td className="py-2 text-secondary-600">{tx.description}</td>
                      <td className={`py-2 text-right font-medium ${tx.amount > 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount}
                      </td>
                      <td className="py-2 text-right text-secondary-500">{tx.balance_after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
