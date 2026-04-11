import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { useProRegister } from '@hooks/useProAccount';
import PageMeta from '@components/seo/PageMeta';

export default function ProRegisterPage() {
  const navigate = useNavigate();
  const { register, isRegistering } = useProRegister();
  const [email, setEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const result = await register(email, companyName);
    if (result?.data) {
      navigate('/pro');
    } else {
      setError(result?.error?.message || 'Erreur lors de la création du compte');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <PageMeta
        title="Espace Professionnel — Inscription | Pre-etat-date.ai"
        description="Créez votre espace professionnel pour gérer vos dossiers de pré-état daté. Crédits prépayés, liens clients, logo personnalisé."
        canonical="/pro/register"
        noindex
      />

      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/logo.png" alt="Pre-etat-date.ai" className="h-20 mx-auto mb-4" />
          </Link>
          <h1 className="text-2xl font-bold text-secondary-900 mb-2">
            Espace Professionnel
          </h1>
          <p className="text-secondary-500">
            Créez votre compte pour gérer vos dossiers vendeurs
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-secondary-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="companyName" className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-secondary-400" />
                Nom de l'agence *
              </Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Immobilière de France"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="h-4 w-4 text-secondary-400" />
                Email professionnel *
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contact@agence.fr"
                required
                className="mt-1"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
                {error}
              </div>
            )}

            <Button type="submit" disabled={isRegistering || !email || !companyName} className="w-full gap-1.5">
              {isRegistering ? 'Création…' : 'Créer mon espace pro'}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-secondary-100">
            <h3 className="text-sm font-semibold text-secondary-700 mb-3">Inclus dans l'espace pro</h3>
            <ul className="space-y-2 text-sm text-secondary-500">
              <li className="flex items-center gap-2">
                <span className="text-primary-500">&#10003;</span>
                Gestion multi-dossiers avec kanban
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-500">&#10003;</span>
                Liens d'upload pour vos clients
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-500">&#10003;</span>
                Crédits prépayés à partir de 20 EUR HT
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary-500">&#10003;</span>
                Logo personnalisé sur les documents
              </li>
            </ul>
          </div>
        </div>

        <p className="text-center text-xs text-secondary-400 mt-4">
          <Link to="/professionnels" className="hover:text-primary-600 underline">
            En savoir plus sur l'offre professionnelle
          </Link>
        </p>
      </div>
    </div>
  );
}
