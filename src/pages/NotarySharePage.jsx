import { useParams } from 'react-router-dom';
import { useNotaryShare } from '@hooks/useNotaryShare';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import { Alert, AlertDescription } from '@components/ui/alert';
import { FileText, Download, Clock, AlertTriangle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function NotarySharePage() {
  const { shareToken } = useParams();
  const { dossier, documents, isLoading, isExpired, isDownloadingPack, downloadPdf, downloadPack } = useNotaryShare(shareToken);

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <div className="animate-pulse-slow text-secondary-400">Chargement du dossier...</div>
      </div>
    );
  }

  if (!dossier || isExpired) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-secondary-900 mb-2">Lien expiré</h1>
        <p className="text-secondary-500">
          Ce lien de partage n'est plus valide. Les documents sont automatiquement supprimés
          après 7 jours conformément au RGPD.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold text-secondary-900 mb-2">
          Pack Vendeur - Pré-état daté
        </h1>
        <p className="text-secondary-500">
          {dossier.property_address}, {dossier.property_postal_code} {dossier.property_city}
        </p>
      </div>

      <Alert variant="warning" className="mb-6">
        <Clock className="h-4 w-4" />
        <AlertDescription>
          Ce lien expire le{' '}
          {dossier.expires_at && format(new Date(dossier.expires_at), 'dd MMMM yyyy', { locale: fr })}.
          Téléchargez les documents avant cette date.
        </AlertDescription>
      </Alert>

      {/* Pré-état daté PDF */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            Pré-état daté
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-500 mb-4">
            Synthèse financière et juridique établie sur la base des déclarations du vendeur.
          </p>
          <Button onClick={downloadPdf} className="gap-2">
            <Download className="h-4 w-4" />
            Télécharger le PDF
          </Button>
        </CardContent>
      </Card>

      {/* Documents classés */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Documents du pack</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-secondary-400" />
                  <span className="text-sm text-secondary-900">{doc.normalized_filename || doc.original_filename}</span>
                  <Badge variant="secondary" className="text-xs">
                    {doc.document_type?.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={downloadPack} disabled={isDownloadingPack} className="gap-2 mt-4">
            {isDownloadingPack ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {isDownloadingPack ? 'Préparation...' : 'Télécharger le pack complet'}
          </Button>
        </CardContent>
      </Card>

      <p className="text-xs text-secondary-400 text-center">
        Document établi sur la base des déclarations du vendeur et des documents fournis.
        Il ne se substitue pas à l'état daté délivré par le syndic de copropriété.
      </p>
    </div>
  );
}
