import { useState } from 'react';
import { Download, Mail, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Link } from 'react-router-dom';

export default function DownloadTemplateSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Veuillez entrer une adresse email valide.');
      return;
    }

    setLoading(true);
    setError('');

    const { supabase } = await import('@lib/supabaseClient');
    const { error: dbError } = await supabase
      .from('pv_leads')
      .insert({ email, source: 'modele-pdf-guide' });

    setLoading(false);

    if (dbError) {
      console.error('Lead insert error:', dbError);
      // Don't block the user on DB errors
    }

    setSubmitted(true);
  };

  return (
    <div className="my-10 space-y-6">
      {/* Free download */}
      <div className="bg-white border border-secondary-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary-50 text-primary-600">
            <Download className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
              Modèle vierge gratuit (PDF)
            </h3>
            <p className="text-sm text-secondary-500 mb-4">
              Formulaire conforme au modèle CSN avec les 3 parties obligatoires. À remplir manuellement.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" asChild>
                <a
                  href="/modele-pre-etat-date-vierge.docx"
                  download="modele-pre-etat-date-vierge.docx"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Format Word (.docx)
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href="/modele-pre-etat-date-vierge.pdf"
                  download="modele-pre-etat-date-vierge.pdf"
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Format PDF
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Email-gated enriched version */}
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-primary-100 text-primary-700">
            <Mail className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-secondary-900 mb-1">
              Version enrichie avec guide de remplissage
            </h3>
            <p className="text-sm text-secondary-500 mb-4">
              Le même formulaire avec des instructions détaillées pour chaque champ :
              où trouver l'information, comment calculer, erreurs à éviter.
            </p>

            {submitted ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-700 font-medium">
                  <CheckCircle className="h-5 w-5" />
                  <span>Votre guide est prêt !</span>
                </div>
                <Button asChild>
                  <a
                    href="/modele-pre-etat-date-guide.pdf"
                    download="modele-pre-etat-date-guide.pdf"
                    className="gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Télécharger le guide de remplissage
                  </a>
                </Button>
                <p className="text-xs text-secondary-400 mt-2">
                  Ce formulaire vous semble complexe ?{' '}
                  <Link to="/dossier" className="text-primary-600 hover:text-primary-800 font-medium">
                    L'IA le remplit pour vous en 5 minutes →
                  </Link>
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  className="flex-1"
                  required
                />
                <Button type="submit" disabled={loading} className="gap-2 whitespace-nowrap">
                  {loading ? 'Envoi...' : (
                    <>
                      Recevoir le guide
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            )}
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
