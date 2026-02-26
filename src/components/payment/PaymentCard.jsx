import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Badge } from '@components/ui/badge';
import { CreditCard, Lock, CheckCircle, FileText, Shield, FlaskConical } from 'lucide-react';
import { stripeService } from '@services/stripe.service';
import { dossierService } from '@services/dossier.service';
import { toast } from '@components/ui/sonner';

const IS_DEV = import.meta.env.DEV;

export default function PaymentCard({ dossier, onSuccess }) {
  const [email, setEmail] = useState(dossier?.email || '');
  const [isProcessing, setIsProcessing] = useState(false);

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

  const handlePayment = async () => {
    if (!email) {
      toast.error('Email requis pour le reçu');
      return;
    }

    setIsProcessing(true);
    try {
      const { data, error } = await stripeService.createPaymentIntent(
        dossier.id,
        dossier.session_id,
        email
      );

      if (error) throw error;

      // Redirect to Stripe Checkout or handle with Elements
      // For now, simulate success for dev
      toast.success('Paiement en cours de traitement...');

      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (error) {
      toast.error('Erreur de paiement');
      console.error('[PaymentCard] handlePayment:', error);
    } finally {
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
              <p className="text-2xl font-bold text-secondary-900">19,99 €</p>
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

          <Button
            onClick={handlePayment}
            disabled={isProcessing || !email}
            className="w-full gap-2"
            size="lg"
          >
            <Lock className="h-4 w-4" />
            {isProcessing ? 'Traitement...' : 'Payer 19,99 €'}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-secondary-400">
            <Shield className="h-3 w-3" />
            Paiement sécurisé par Stripe
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
