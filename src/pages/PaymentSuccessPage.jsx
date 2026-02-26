import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      const timer = setTimeout(() => {
        navigate(`/dossier/${sessionId}`);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [sessionId, navigate]);

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-semibold text-secondary-900 mb-2">Paiement confirme</h1>
      <p className="text-secondary-500 mb-4">
        Votre pack vendeur est en cours de generation. Vous allez etre redirige automatiquement...
      </p>
      <div className="animate-pulse-slow text-secondary-400 text-sm">Redirection en cours...</div>
    </div>
  );
}
