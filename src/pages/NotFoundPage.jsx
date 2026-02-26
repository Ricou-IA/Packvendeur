import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-secondary-200 mb-4">404</h1>
      <h2 className="text-xl font-semibold text-secondary-900 mb-2">Page introuvable</h2>
      <p className="text-secondary-500 mb-6">Cette page n'existe pas.</p>
      <Button variant="outline" onClick={() => navigate('/')} className="gap-2">
        <Home className="h-4 w-4" />
        Retour a l'accueil
      </Button>
    </div>
  );
}
