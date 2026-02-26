import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <XCircle className="h-16 w-16 text-secondary-400 mx-auto mb-4" />
      <h1 className="text-2xl font-semibold text-secondary-900 mb-2">Paiement annule</h1>
      <p className="text-secondary-500 mb-6">
        Votre paiement a ete annule. Vos documents sont toujours en attente.
      </p>
      <Button variant="outline" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Retour au dossier
      </Button>
    </div>
  );
}
