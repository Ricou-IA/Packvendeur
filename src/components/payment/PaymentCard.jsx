import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { CreditCard, Lock, CheckCircle, Shield, FlaskConical, Loader2, Tag, X } from 'lucide-react';
import { stripeService } from '@services/stripe.service';
import { dossierService } from '@services/dossier.service';
import { toast } from '@components/ui/sonner';

const IS_DEV = import.meta.env.DEV;
const BASE_PRICE = 24.99;

export default function PaymentCard({ dossier, onSuccess }) {
  const [email, setEmail] = useState(dossier?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null); // { code, percent_off, amount_off, name }
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const handleTestSkip = async () => {
    setIsProcessing(true);
    try {
      const { error } = await dossierService.updateDossier(dossier.id, {
        status: 'paid',
        stripe_payment_intent_id: 'TEST_SKIP_' + Date.now(),
      });
      if (error) throw error;
      toast.success('Paiement simulé (mode test)');
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Erreur lors du skip test');
      console.error('[PaymentCard] handleTestSkip:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    if (!code) return;

    setIsValidatingPromo(true);
    setPromoError('');

    try {
      const { data, error } = await stripeService.validatePromoCode(code);
      if (error) throw error;

      if (data?.valid) {
        setPromoApplied({
          code,
          id: data.promotion_code_id,
          percent_off: data.percent_off,
          amount_off: data.amount_off,
          name: data.name,
        });
        setPromoError('');
        toast.success('Code promo appliqué !');
      } else {
        setPromoError(data?.message || 'Code promo invalide');
        setPromoApplied(null);
      }
    } catch (error) {
      console.error('[PaymentCard] handleApplyPromo:', error);
      setPromoError('Code promo invalide ou expiré');
      setPromoApplied(null);
    } finally {
      setIsValidatingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoApplied(null);
    setPromoCode('');
    setPromoError('');
  };

  // Calculate displayed price
  const discountedPrice = promoApplied
    ? promoApplied.percent_off
      ? BASE_PRICE * (1 - promoApplied.percent_off / 100)
      : promoApplied.amount_off
        ? Math.max(0, BASE_PRICE - promoApplied.amount_off / 100) // amount_off is in cents
        : BASE_PRICE
    : BASE_PRICE;
  const displayPrice = discountedPrice.toFixed(2).replace('.', ',');

  const handleCheckout = async () => {
    if (!email) {
      toast.error('Email requis pour le reçu');
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await stripeService.createCheckoutSession(
        dossier.id,
        dossier.session_id,
        email,
        promoApplied?.id || null
      );

      if (error) throw error;
      if (!data?.url) throw new Error('URL de paiement non reçue');

      // Save email to dossier before redirect
      await dossierService.updateDossier(dossier.id, { email });

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast.error('Erreur lors de la création du paiement');
      console.error('[PaymentCard] handleCheckout:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          Finalisez votre commande
        </h2>
        <p className="text-secondary-500">
          Paiement sécurisé pour accéder à votre pack vendeur complet.
        </p>
      </div>

      {/* Ce qui est inclus */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Votre pack comprend</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-secondary-700">Pré-état daté PDF (synthèse financière et juridique)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-secondary-700">Pack vendeur structuré (documents renommés et classés)</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-secondary-700">Certificat de conformité DPE</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
            <span className="text-sm text-secondary-700">Lien de partage notaire (valide 7 jours)</span>
          </div>
        </CardContent>
      </Card>

      {/* Paiement */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Paiement
            </CardTitle>
            <div className="text-right">
              {promoApplied ? (
                <>
                  <p className="text-sm text-secondary-400 line-through">24,99 €</p>
                  <p className="text-2xl font-bold text-green-600">{displayPrice} €</p>
                </>
              ) : (
                <p className="text-2xl font-bold text-secondary-900">24,99 €</p>
              )}
              <p className="text-xs text-secondary-500">TTC</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email">Email (pour le reçu)</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
            />
          </div>

          {/* Code promo */}
          <div>
            <Label htmlFor="promo" className="flex items-center gap-1.5">
              <Tag className="h-3.5 w-3.5" />
              Code promo
            </Label>
            {promoApplied ? (
              <div className="flex items-center gap-2 mt-1.5 bg-green-50 border border-green-200 rounded-md px-3 py-2">
                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span className="text-sm text-green-700 font-medium flex-1">
                  {promoApplied.code}
                  {promoApplied.percent_off && ` (-${promoApplied.percent_off}%)`}
                  {promoApplied.amount_off && ` (-${(promoApplied.amount_off / 100).toFixed(2).replace('.', ',')} €)`}
                </span>
                <button
                  onClick={handleRemovePromo}
                  className="text-green-600 hover:text-red-500 transition-colors"
                  title="Retirer le code promo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-1.5">
                <Input
                  id="promo"
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleApplyPromo()}
                  placeholder="Entrez votre code"
                  className={promoError ? 'border-red-300' : ''}
                  disabled={isValidatingPromo}
                />
                <Button
                  variant="outline"
                  onClick={handleApplyPromo}
                  disabled={!promoCode.trim() || isValidatingPromo}
                  className="flex-shrink-0"
                >
                  {isValidatingPromo ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Appliquer'
                  )}
                </Button>
              </div>
            )}
            {promoError && (
              <p className="text-xs text-red-500 mt-1">{promoError}</p>
            )}
          </div>

          <Button
            onClick={handleCheckout}
            disabled={isProcessing || !email}
            className="w-full gap-2"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Redirection vers Stripe...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                Payer {displayPrice} €
              </>
            )}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-secondary-400">
            <Shield className="h-3 w-3" />
            Paiement sécurisé par Stripe — CB, Apple Pay, Google Pay
          </div>
        </CardContent>
      </Card>

      {/* Dev-only test skip */}
      {IS_DEV && (
        <Card className="border-dashed border-amber-300 bg-amber-50/50">
          <CardContent className="pt-4 pb-4">
            <Button
              variant="outline"
              onClick={handleTestSkip}
              disabled={isProcessing}
              className="w-full gap-2 border-amber-300 text-amber-700 hover:bg-amber-100"
            >
              <FlaskConical className="h-4 w-4" />
              Mode test — Passer le paiement
            </Button>
            <p className="text-xs text-amber-500 text-center mt-2">
              Visible uniquement en développement
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
