import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@components/ui/button';
import { proStripeService } from '@services/proStripe.service';
import CreditBadge from '@components/pro/CreditBadge';
import PageMeta from '@components/seo/PageMeta';

export default function ProPaymentSuccessPage() {
  const [searchParams] = useSearchParams();
  const checkoutSessionId = searchParams.get('checkout_session_id');
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const [result, setResult] = useState(null);
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (!checkoutSessionId || verifyingRef.current) return;
    verifyingRef.current = true;

    proStripeService.verifyCreditCheckout(checkoutSessionId).then((res) => {
      if (res.data) {
        setResult(res.data);
        setStatus('success');
      } else {
        setStatus('error');
      }
    });
  }, [checkoutSessionId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <PageMeta title="Achat confirme — Espace Pro | Pre-etat-date.ai" noindex />

      <div className="max-w-md w-full text-center">
        {status === 'verifying' && (
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-primary-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
            </div>
            <h1 className="text-xl font-bold text-secondary-900 mb-2">Verification du paiement...</h1>
            <p className="text-secondary-500">Veuillez patienter quelques secondes.</p>
          </div>
        )}

        {status === 'success' && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-secondary-900 mb-2">Credits ajoutes !</h1>
            <p className="text-secondary-500 mb-6">
              {result?.credits_added} credit{result?.credits_added > 1 ? 's' : ''} ont ete ajoutes a votre compte.
            </p>
            <div className="flex justify-center mb-6">
              <CreditBadge credits={result?.new_balance || 0} />
            </div>
            <Button asChild className="gap-1.5">
              <Link to="/pro">
                Retour au dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
            <h1 className="text-xl font-bold text-secondary-900 mb-2">Verification en cours</h1>
            <p className="text-secondary-500 mb-6">
              Le paiement n'a pas pu etre verifie immediatement. Si vous avez paye, vos credits seront ajoutes sous quelques minutes.
            </p>
            <Button asChild variant="outline">
              <Link to="/pro">Retour au dashboard</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
