import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { CreditCard, Lock, CheckCircle, Shield, FlaskConical, Loader2, Tag, X, FileText, MapPin } from 'lucide-react';
import { stripeService } from '@services/stripe.service';
import { dossierService } from '@services/dossier.service';
import { trackingService } from '@services/tracking.service';
import { toast } from '@components/ui/sonner';

const IS_DEV = import.meta.env.DEV;
const BASE_PRICE = 24.99;

export default function PaymentCard({ dossier, documents = [], onSuccess }) {
  const [email, setEmail] = useState(dossier?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(null); // { code, percent_off, amount_off, name }
  const [promoError, setPromoError] = useState('');
  const [isValidatingPromo, setIsValidatingPromo] = useState(false);

  const handleTestSkip = async () => {
    setIsProcessing(true);
    try {
      // Pay-first funnel: mark dossier as paid and let ProcessingStep (step 4)
      // kick off extraction. We set stripe_payment_status='paid' so the
      // server-side guards in pv-extract-* will accept the call.
      const { error } = await dossierService.updateDossier(dossier.id, {
        status: 'paid',
        stripe_payment_status: 'paid',
        stripe_payment_intent_id: 'TEST_SKIP_' + Date.now(),
        amount_paid: 0,
        paid_at: new Date().toISOString(),
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
          promotion_code_id: data.promotion_code_id || null,
          coupon_id: data.coupon_id || null,
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
      setPromoError(error?.message || 'Code promo invalide ou expiré');
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
        promoApplied?.promotion_code_id || null,
        promoApplied?.coupon_id || null
      );

      if (error) throw error;
      if (!data?.url) throw new Error('URL de paiement non reçue');

      // Save email to dossier before redirect
      await dossierService.updateDossier(dossier.id, { email });

      trackingService.trackEvent('payment_initiated', 'funnel', { amount: discountedPrice, promo: !!promoApplied }, dossier.id);

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast.error('Erreur lors de la création du paiement');
      console.error('[PaymentCard] handleCheckout:', error);
      setIsProcessing(false);
    }
  };

  // Recap: classified documents (count + types)
  const classifiedDocs = documents.filter((d) => d.document_type);
  const hasAddress = !!(dossier?.property_address || dossier?.property_city);
  const addressLine = [
    dossier?.property_address,
    dossier?.property_lot_number ? `Lot ${dossier.property_lot_number}` : null,
  ].filter(Boolean).join(' — ');
  const cityLine = [dossier?.property_postal_code, dossier?.property_city].filter(Boolean).join(' ');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          Récapitulatif de votre commande
        </h2>
        <p className="text-secondary-500">
          Vérifiez les informations ci-dessous, puis finalisez votre paiement pour lancer l'analyse.
        </p>
      </div>

      {/* Recap: bien + documents */}
      <Card className="border-primary-100 bg-primary-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Votre dossier</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-secondary-900">
                {hasAddress ? (addressLine || 'Adresse renseignée') : 'Adresse non renseignée'}
              </p>
              {cityLine && <p className="text-xs text-secondary-500">{cityLine}</p>}
            </div>
          </div>
          <div className="flex items-start gap-3">
            <FileText className="h-4 w-4 text-primary-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-secondary-900">
                {classifiedDocs.length} document{classifiedDocs.length > 1 ? 's' : ''} reconnu{classifiedDocs.length > 1 ? 's' : ''}
                {documents.length > classifiedDocs.length && ` sur ${documents.length} uploadés`}
              </p>
              <p className="text-xs text-secondary-500">
                Les documents seront analysés par notre IA juste après le paiement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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
