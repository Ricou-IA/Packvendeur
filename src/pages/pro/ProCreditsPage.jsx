import { useState } from 'react';
import { Coins, Check, Zap, Building2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import ProLayout from '@components/pro/ProLayout';
import CreditBadge from '@components/pro/CreditBadge';
import { proStripeService } from '@services/proStripe.service';
import PageMeta from '@components/seo/PageMeta';

const CREDIT_PACKS = [
  {
    id: '1',
    name: 'Solo',
    credits: 1,
    priceHT: 20,
    priceTTC: 24,
    unitPrice: '20',
    icon: Coins,
    color: 'border-secondary-200 hover:border-primary-300',
    popular: false,
  },
  {
    id: '10',
    name: 'Pro',
    credits: 10,
    priceHT: 180,
    priceTTC: 216,
    unitPrice: '18',
    icon: Zap,
    color: 'border-primary-300 ring-2 ring-primary-100',
    popular: true,
  },
  {
    id: '20',
    name: 'Agency',
    credits: 20,
    priceHT: 300,
    priceTTC: 360,
    unitPrice: '15',
    icon: Building2,
    color: 'border-secondary-200 hover:border-primary-300',
    popular: false,
  },
];

export default function ProCreditsPage() {
  return (
    <ProLayout>
      {({ proAccount }) => <CreditsContent proAccount={proAccount} />}
    </ProLayout>
  );
}

function CreditsContent({ proAccount }) {
  const [loadingPack, setLoadingPack] = useState(null);
  const [error, setError] = useState(null);

  const handlePurchase = async (packId) => {
    setLoadingPack(packId);
    setError(null);

    const result = await proStripeService.createCreditCheckout(
      proAccount.id,
      packId,
      window.location.origin
    );

    if (result.error) {
      setError(result.error.message);
      setLoadingPack(null);
    } else if (result.data?.url) {
      window.location.href = result.data.url;
    }
  };

  return (
    <>
      <PageMeta title="Acheter des crédits — Espace Pro | Pre-etat-date.ai" noindex />

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">Acheter des crédits</h1>
          <p className="text-secondary-500 mb-4">
            1 crédit = 1 génération de pré-état daté complet
          </p>
          <CreditBadge credits={proAccount.credits} />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3 mb-6 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CREDIT_PACKS.map((pack) => (
            <div
              key={pack.id}
              className={`relative bg-white rounded-xl border-2 p-6 transition-all ${pack.color}`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Populaire
                </span>
              )}

              <div className="text-center mb-6">
                <pack.icon className={`h-8 w-8 mx-auto mb-3 ${pack.popular ? 'text-primary-600' : 'text-secondary-400'}`} />
                <h3 className="text-lg font-bold text-secondary-900">{pack.name}</h3>
                <p className="text-sm text-secondary-500">{pack.credits} crédit{pack.credits > 1 ? 's' : ''}</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-secondary-900">
                  {pack.priceHT} <span className="text-base font-normal text-secondary-500">EUR HT</span>
                </div>
                <p className="text-xs text-secondary-400 mt-1">
                  {pack.priceTTC} EUR TTC &middot; {pack.unitPrice} EUR / crédit
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-secondary-600">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  Pré-état daté complet (CSN)
                </li>
                <li className="flex items-center gap-2 text-sm text-secondary-600">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  Lien notaire inclus
                </li>
                <li className="flex items-center gap-2 text-sm text-secondary-600">
                  <Check className="h-4 w-4 text-green-500 shrink-0" />
                  Logo personnalisé
                </li>
                {pack.credits >= 10 && (
                  <li className="flex items-center gap-2 text-sm text-primary-600 font-medium">
                    <Check className="h-4 w-4 text-primary-500 shrink-0" />
                    Économie de {(pack.credits * 20 - pack.priceHT)} EUR
                  </li>
                )}
              </ul>

              <Button
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingPack !== null}
                className={`w-full ${pack.popular ? '' : 'bg-secondary-800 hover:bg-secondary-700'}`}
              >
                {loadingPack === pack.id ? 'Redirection…' : `Acheter ${pack.credits} crédit${pack.credits > 1 ? 's' : ''}`}
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-secondary-400 mt-8">
          Paiement sécurisé par Stripe. Les crédits n'expirent pas.
        </p>
      </div>
    </>
  );
}
