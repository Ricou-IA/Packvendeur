import { useState } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Copy, Check, Plus, X } from 'lucide-react';

export default function NewDossierDialog({ open, onClose, onSubmit, isLoading }) {
  const [form, setForm] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    property_address: '',
    property_city: '',
    property_postal_code: '',
    property_lot_number: '',
    pro_notes: '',
  });
  const [createdDossier, setCreatedDossier] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await onSubmit(form);
    if (result?.data) {
      setCreatedDossier(result.data);
    }
  };

  const uploadLink = createdDossier
    ? `${window.location.origin}/client/${createdDossier.upload_token}`
    : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(uploadLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setForm({ client_name: '', client_email: '', client_phone: '', property_address: '', property_city: '', property_postal_code: '', property_lot_number: '', pro_notes: '' });
    setCreatedDossier(null);
    setCopied(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-secondary-100">
          <h2 className="text-lg font-semibold text-secondary-900">
            {createdDossier ? 'Dossier cree' : 'Nouveau dossier'}
          </h2>
          <button type="button" onClick={handleClose} className="p-1 text-secondary-400 hover:text-secondary-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {createdDossier ? (
          <div className="p-6 space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm font-medium text-green-800 mb-2">
                Dossier cree avec succes
              </p>
              <p className="text-xs text-green-600">
                Envoyez ce lien a votre client pour qu'il puisse deposer ses documents et remplir le questionnaire.
              </p>
            </div>

            <div>
              <Label className="text-sm text-secondary-600">Lien d'upload client</Label>
              <div className="flex gap-2 mt-1">
                <Input value={uploadLink} readOnly className="text-xs bg-secondary-50" />
                <Button type="button" variant="outline" size="sm" onClick={handleCopy} className="shrink-0">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button onClick={handleClose} className="w-full">
              Fermer
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="client_name">Nom du client *</Label>
                <Input
                  id="client_name"
                  value={form.client_name}
                  onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                  placeholder="Jean Dupont"
                  required
                />
              </div>
              <div>
                <Label htmlFor="client_email">Email</Label>
                <Input
                  id="client_email"
                  type="email"
                  value={form.client_email}
                  onChange={(e) => setForm({ ...form, client_email: e.target.value })}
                  placeholder="jean@example.com"
                />
              </div>
              <div>
                <Label htmlFor="client_phone">Telephone</Label>
                <Input
                  id="client_phone"
                  type="tel"
                  value={form.client_phone}
                  onChange={(e) => setForm({ ...form, client_phone: e.target.value })}
                  placeholder="06 12 34 56 78"
                />
              </div>
            </div>

            <hr className="border-secondary-200" />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="property_address">Adresse du bien</Label>
                <Input
                  id="property_address"
                  value={form.property_address}
                  onChange={(e) => setForm({ ...form, property_address: e.target.value })}
                  placeholder="12 rue de la Paix"
                />
              </div>
              <div>
                <Label htmlFor="property_city">Ville</Label>
                <Input
                  id="property_city"
                  value={form.property_city}
                  onChange={(e) => setForm({ ...form, property_city: e.target.value })}
                  placeholder="Paris"
                />
              </div>
              <div>
                <Label htmlFor="property_postal_code">Code postal</Label>
                <Input
                  id="property_postal_code"
                  value={form.property_postal_code}
                  onChange={(e) => setForm({ ...form, property_postal_code: e.target.value })}
                  placeholder="75002"
                />
              </div>
              <div>
                <Label htmlFor="property_lot_number">Numero de lot</Label>
                <Input
                  id="property_lot_number"
                  value={form.property_lot_number}
                  onChange={(e) => setForm({ ...form, property_lot_number: e.target.value })}
                  placeholder="42"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pro_notes">Notes internes</Label>
              <textarea
                id="pro_notes"
                value={form.pro_notes}
                onChange={(e) => setForm({ ...form, pro_notes: e.target.value })}
                placeholder="Notes pour votre usage personnel..."
                className="w-full mt-1 px-3 py-2 text-sm border border-secondary-200 rounded-md resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" disabled={!form.client_name || isLoading} className="flex-1 gap-1.5">
                <Plus className="h-4 w-4" />
                {isLoading ? 'Creation...' : 'Creer le dossier'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
