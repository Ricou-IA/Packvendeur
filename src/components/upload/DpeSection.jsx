import { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@lib/utils';
import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@components/ui/collapsible';
import { ademeService } from '@services/ademe.service';
import { dossierService } from '@services/dossier.service';
import { toast } from '@components/ui/sonner';
import {
  Upload,
  FileText,
  Trash2,
  ChevronDown,
  Search,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
} from 'lucide-react';

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

const VALIDITY_CONFIG = {
  valid: { label: 'Valide', variant: 'success', icon: CheckCircle2 },
  expiring_soon: { label: 'Expire bientôt', variant: 'warning', icon: AlertTriangle },
  expired: { label: 'Expiré', variant: 'destructive', icon: XCircle },
  not_opposable: { label: 'Non opposable', variant: 'warning', icon: AlertTriangle },
  not_found: { label: 'Non trouvé', variant: 'destructive', icon: XCircle },
};

export default function DpeSection({
  dossierId,
  dossier,
  dpeDocuments,
  onUpload,
  onRemove,
  isUploading,
  onDpeVerified,
}) {
  const [isOpen, setIsOpen] = useState(true);
  const [ademeNumber, setAdemeNumber] = useState(dossier?.dpe_ademe_number || '');
  const [isVerifying, setIsVerifying] = useState(false);
  const [dpeResult, setDpeResult] = useState(
    dossier?.dpe_validity_status && dossier?.dpe_validity_status !== 'not_verified'
      ? { validity: dossier.dpe_validity_status, data: dossier.dpe_ademe_raw }
      : null
  );

  // Track whether we've already auto-verified to avoid infinite loops
  const autoVerifiedRef = useRef(null);

  // Sync ademeNumber state when dossier.dpe_ademe_number changes externally
  // (e.g. after DDT classification finds a DPE ADEME number)
  useEffect(() => {
    const externalNumber = dossier?.dpe_ademe_number;
    if (
      externalNumber &&
      externalNumber.length >= 10 &&
      externalNumber !== ademeNumber &&
      externalNumber !== autoVerifiedRef.current
    ) {
      console.log(`[DpeSection] ADEME number set externally: ${externalNumber}, auto-verifying...`);
      setAdemeNumber(externalNumber);
      autoVerifiedRef.current = externalNumber;
      // Trigger auto-verify in next tick (after state update)
      setTimeout(() => autoVerify(externalNumber), 100);
    }
  }, [dossier?.dpe_ademe_number]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-verify a given ADEME number (called from effect, not from user click)
  const autoVerify = useCallback(async (number) => {
    if (!number || number.length < 10 || isVerifying) return;

    setIsVerifying(true);
    try {
      const result = await ademeService.verifyDpe(number);
      setDpeResult(result);

      if (result.validity === 'valid' || result.validity === 'expiring_soon' || result.validity === 'not_opposable') {
        await dossierService.updateDossier(dossierId, {
          dpe_ademe_number: number,
          dpe_date: result.data?.date_etablissement || null,
          dpe_classe_energie: result.data?.classe_energie || null,
          dpe_classe_ges: result.data?.classe_ges || null,
          dpe_validity_status: result.validity,
          dpe_ademe_raw: result.data,
        });
        if (onDpeVerified) onDpeVerified(result);
        if (result.validity === 'valid') {
          toast.success('DPE détecté dans le DDT et vérifié automatiquement');
        } else if (result.validity === 'not_opposable') {
          toast.warning('DPE détecté — antérieur au 01/07/2021 (non opposable)');
        } else {
          toast.warning('DPE détecté — expire bientôt');
        }
      } else if (result.validity === 'expired') {
        await dossierService.updateDossier(dossierId, {
          dpe_ademe_number: number,
          dpe_validity_status: 'expired',
        });
        toast.error('DPE détecté mais expiré — un nouveau DPE est nécessaire');
      } else {
        toast.warning('Numéro ADEME détecté mais non trouvé dans la base ADEME');
      }
    } catch {
      toast.error('Erreur lors de la vérification automatique du DPE');
    } finally {
      setIsVerifying(false);
    }
  }, [dossierId, isVerifying, onDpeVerified]);

  const handleVerify = useCallback(async () => {
    if (!ademeNumber || ademeNumber.length < 10) {
      toast.error('Numéro ADEME invalide (minimum 10 caractères)');
      return;
    }

    setIsVerifying(true);
    try {
      const result = await ademeService.verifyDpe(ademeNumber);
      setDpeResult(result);

      if (result.validity === 'valid' || result.validity === 'expiring_soon' || result.validity === 'not_opposable') {
        // Save DPE data to dossier
        await dossierService.updateDossier(dossierId, {
          dpe_ademe_number: ademeNumber,
          dpe_date: result.data?.date_etablissement || null,
          dpe_classe_energie: result.data?.classe_energie || null,
          dpe_classe_ges: result.data?.classe_ges || null,
          dpe_validity_status: result.validity,
          dpe_ademe_raw: result.data,
        });

        if (onDpeVerified) onDpeVerified(result);

        if (result.validity === 'valid') {
          toast.success('DPE valide et opposable');
        } else if (result.validity === 'not_opposable') {
          toast.warning('DPE antérieur au 01/07/2021 — Non opposable');
        } else {
          toast.warning('DPE expire bientot');
        }
      } else if (result.validity === 'expired') {
        await dossierService.updateDossier(dossierId, {
          dpe_ademe_number: ademeNumber,
          dpe_validity_status: 'expired',
        });
        toast.error('DPE expiré — Un nouveau DPE est nécessaire');
      } else {
        toast.error('Numero ADEME non trouve dans la base ADEME');
      }
    } catch {
      toast.error('Erreur lors de la vérification');
    } finally {
      setIsVerifying(false);
    }
  }, [ademeNumber, dossierId, onDpeVerified]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      if (onUpload) onUpload(acceptedFiles, 'dpe');
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: isUploading,
  });

  const hasDpeData = dpeResult?.validity && dpeResult.validity !== 'not_found';
  const validityConfig = dpeResult ? VALIDITY_CONFIG[dpeResult.validity] : null;
  const ValidityIcon = validityConfig?.icon;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-white rounded-lg border overflow-hidden">
        <CollapsibleTrigger asChild>
          <button className="w-full flex items-center justify-between px-4 py-3 hover:bg-secondary-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className={cn(
                'flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold',
                hasDpeData
                  ? 'bg-green-100 text-green-700'
                  : 'bg-secondary-100 text-secondary-500'
              )}>
                {hasDpeData ? <CheckCircle2 className="h-4 w-4" /> : 4}
              </div>
              <Zap className="h-5 w-5 text-secondary-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-secondary-900">
                  DPE <span className="text-secondary-400 font-normal">(facultatif)</span>
                </p>
                <p className="text-xs text-secondary-500">
                  Entrez le numéro ADEME pour récupérer les informations automatiquement
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {validityConfig && (
                <Badge variant={validityConfig.variant} className="text-xs">
                  {validityConfig.label}
                </Badge>
              )}
              <ChevronDown className={cn(
                'h-4 w-4 text-secondary-400 transition-transform',
                isOpen && 'rotate-180'
              )} />
            </div>
          </button>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="px-4 pb-4 space-y-4">
            {/* ADEME number input */}
            <div className="space-y-2">
              <Label htmlFor="ademe-number" className="text-sm font-medium">
                Numéro ADEME du DPE
              </Label>
              <div className="flex gap-2">
                <Input
                  id="ademe-number"
                  placeholder="Ex: 2231E0123456N"
                  value={ademeNumber}
                  onChange={(e) => setAdemeNumber(e.target.value)}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerify}
                  disabled={!ademeNumber || ademeNumber.length < 10 || isVerifying}
                  className="gap-2"
                >
                  {isVerifying ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  {isVerifying ? 'Recherche...' : 'Vérifier'}
                </Button>
              </div>
              <p className="text-xs text-secondary-400">
                Le numéro ADEME se trouve en haut de votre DPE (13 caractères)
              </p>
            </div>

            {/* DPE Results */}
            {dpeResult?.data && (
              <div className={cn(
                'rounded-lg border p-4',
                dpeResult.validity === 'valid' ? 'bg-green-50 border-green-200' :
                dpeResult.validity === 'expired' ? 'bg-red-50 border-red-200' :
                'bg-amber-50 border-amber-200'
              )}>
                <div className="flex items-center gap-2 mb-3">
                  {ValidityIcon && <ValidityIcon className={cn(
                    'h-4 w-4',
                    dpeResult.validity === 'valid' ? 'text-green-600' :
                    dpeResult.validity === 'expired' ? 'text-red-600' :
                    'text-amber-600'
                  )} />}
                  <span className="text-sm font-medium">
                    DPE {validityConfig?.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs text-secondary-500">Classe énergie</p>
                    <p className="text-lg font-bold">{dpeResult.data.classe_energie || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Classe GES</p>
                    <p className="text-lg font-bold">{dpeResult.data.classe_ges || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Date</p>
                    <p className="text-sm">{dpeResult.data.date_etablissement || '-'}</p>
                  </div>
                  <div>
                    <p className="text-xs text-secondary-500">Surface</p>
                    <p className="text-sm">{dpeResult.data.surface ? `${dpeResult.data.surface} m2` : '-'}</p>
                  </div>
                </div>

                {dpeResult.validity === 'not_opposable' && (
                  <p className="text-xs text-amber-700 mt-3">
                    Ce DPE est antérieur au 01/07/2021. Il est fourni à titre informatif mais n'est pas opposable.
                  </p>
                )}
                {dpeResult.validity === 'expired' && (
                  <p className="text-xs text-red-700 mt-3">
                    Ce DPE est expiré. Un nouveau DPE doit être réalisé avant la vente.
                  </p>
                )}
              </div>
            )}

            {dpeResult?.validity === 'not_found' && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-700">
                  Numéro ADEME non trouvé. Vérifiez le numéro ou déposez votre DPE en PDF ci-dessous.
                </p>
              </div>
            )}

            {/* Optional PDF upload */}
            <div className="space-y-2">
              <p className="text-xs text-secondary-500 font-medium">
                Ou déposez votre DPE en PDF :
              </p>
              <div
                {...getRootProps()}
                className={cn(
                  'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all',
                  isDragActive
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-secondary-200 bg-secondary-50/50 hover:border-primary-400',
                  isUploading && 'opacity-50 cursor-not-allowed'
                )}
              >
                <input {...getInputProps()} />
                <div className="flex items-center justify-center gap-2">
                  <Upload className="h-5 w-5 text-secondary-400" />
                  <p className="text-sm text-secondary-600">
                    {isDragActive ? 'Déposez ici...' : 'Glissez votre DPE ou cliquez'}
                  </p>
                </div>
              </div>
            </div>

            {/* DPE file list */}
            {dpeDocuments.length > 0 && (
              <div className="rounded-lg border divide-y">
                {dpeDocuments.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileText className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                      <p className="text-sm text-secondary-800 truncate">
                        {doc.original_filename}
                      </p>
                      <span className="text-xs text-secondary-400 flex-shrink-0">
                        {formatFileSize(doc.file_size_bytes)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {doc.document_type ? (
                        <Badge variant="outline" className="text-xs gap-1">
                          <CheckCircle2 className="h-3 w-3 text-green-500" />
                          DPE
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs gap-1 text-secondary-400">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          analyse...
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-secondary-400 hover:text-destructive"
                        onClick={() => onRemove(doc.id, doc.storage_path)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
