import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { stripeService } from '@services/stripe.service';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const checkoutSessionId = searchParams.get('checkout_session_id');
  const [status, setStatus] = useState('verifying'); // verifying | success | error
  const verifyingRef = useRef(false);

  useEffect(() => {
    if (!checkoutSessionId || verifyingRef.current) return;
    verifyingRef.current = true;

    async function verify() {
      const { data, error } = await stripeService.verifyCheckoutSession(checkoutSessionId);

      if (error || !data?.paid) {
        console.error('[PaymentSuccess] Verification failed:', error || 'not paid');
        setStatus('error');
        return;
      }

      setStatus('success');

      // Redirect to dossier delivery step after 2s
      const appSessionId = data.app_session_id;
      if (appSessionId) {
        setTimeout(() => navigate(`/dossier/${appSessionId}`), 2000);
      }
    }

    verify();
  }, [checkoutSessionId, navigate]);

  if (status === 'error') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <AlertCircle className="h-16 w-16 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-secondary-900 mb-2">Vérification en cours</h1>
        <p className="text-secondary-500 mb-4">
          Le paiement n'a pas pu être vérifié immédiatement. Si vous avez bien payé,
          votre dossier sera mis à jour sous quelques minutes.
        </p>
        <button
          onClick={() => navigate('/dossier')}
          className="text-primary-600 hover:underline text-sm"
        >
          Retourner au dossier
        </button>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-secondary-900 mb-2">Paiement confirmé</h1>
        <p className="text-secondary-500 mb-4">
          Votre pack vendeur est en cours de génération. Redirection automatique...
        </p>
        <div className="animate-pulse-slow text-secondary-400 text-sm">Redirection en cours...</div>
      </div>
    );
  }

  // verifying
  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <Loader2 className="h-16 w-16 text-primary-500 mx-auto mb-4 animate-spin" />
      <h1 className="text-2xl font-semibold text-secondary-900 mb-2">Vérification du paiement</h1>
      <p className="text-secondary-500">Merci de patienter quelques secondes...</p>
    </div>
  );
}
