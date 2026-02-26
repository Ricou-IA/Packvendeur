import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@components/ui/alert';
import { Badge } from '@components/ui/badge';
import { useDpeVerification } from '@hooks/useDpeVerification';
import { CheckCircle, AlertTriangle, Lock, LockOpen, Loader2 } from 'lucide-react';

const validationSchema = z.object({
  property_address: z.string().min(1, 'Adresse requise'),
  property_city: z.string().optional(),
  property_postal_code: z.string().optional(),
  property_lot_number: z.string().optional(),
  property_surface: z.coerce.number().positive().optional().or(z.literal('')),
  copropriete_name: z.string().optional(),
  syndic_name: z.string().optional(),
  seller_name: z.string().min(1, 'Nom du vendeur requis'),
  budget_previsionnel: z.coerce.number().optional().or(z.literal('')),
  tantiemes_lot: z.coerce.number().int().optional().or(z.literal('')),
  tantiemes_totaux: z.coerce.number().int().optional().or(z.literal('')),
  fonds_travaux_balance: z.coerce.number().optional().or(z.literal('')),
  charges_courantes: z.coerce.number().optional().or(z.literal('')),
  charges_exceptionnelles: z.coerce.number().optional().or(z.literal('')),
  impaye_vendeur: z.coerce.number().optional().or(z.literal('')),
  dette_copro_fournisseurs: z.coerce.number().optional().or(z.literal('')),
  procedures_details: z.string().optional(),
  travaux_details: z.string().optional(),
  dpe_ademe_number: z.string().optional(),
});

export default function ValidationForm({ dossier, onValidate }) {
  // Normalize extracted_data (Gemini sometimes returns an array)
  const rawExtracted = dossier?.extracted_data;
  const extracted = Array.isArray(rawExtracted) ? rawExtracted[0] : (rawExtracted || {});
  const { dpeResult, isVerifying, verify } = useDpeVerification();

  // Section lock state — all sections locked by default
  const [unlockedSections, setUnlockedSections] = useState(new Set());
  const toggleLock = (section) => {
    setUnlockedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };
  const isLocked = (section) => !unlockedSections.has(section);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      property_address: dossier?.property_address ?? extracted?.copropriete?.adresse ?? '',
      property_city: dossier?.property_city ?? '',
      property_postal_code: dossier?.property_postal_code ?? '',
      property_lot_number: dossier?.property_lot_number ?? extracted?.lot?.numero ?? '',
      property_surface: dossier?.property_surface ?? extracted?.lot?.surface_carrez ?? '',
      copropriete_name: dossier?.copropriete_name ?? extracted?.copropriete?.nom ?? '',
      syndic_name: dossier?.syndic_name ?? extracted?.copropriete?.syndic_nom ?? '',
      seller_name: dossier?.seller_name ?? '',
      budget_previsionnel: dossier?.budget_previsionnel ?? extracted?.financier?.budget_previsionnel_annuel ?? '',
      tantiemes_lot: dossier?.tantiemes_lot ?? extracted?.lot?.tantiemes_generaux ?? '',
      tantiemes_totaux: dossier?.tantiemes_totaux ?? extracted?.copropriete?.tantiemes_totaux ?? '',
      fonds_travaux_balance: dossier?.fonds_travaux_balance ?? extracted?.financier?.fonds_travaux_solde ?? '',
      charges_courantes: dossier?.charges_courantes ?? extracted?.financier?.charges_courantes_lot ?? '',
      charges_exceptionnelles: dossier?.charges_exceptionnelles ?? extracted?.financier?.charges_exceptionnelles_lot ?? '',
      impaye_vendeur: dossier?.impaye_vendeur ?? extracted?.financier?.impayes_vendeur ?? '',
      dette_copro_fournisseurs: dossier?.dette_copro_fournisseurs ?? extracted?.financier?.dette_copro_fournisseurs ?? '',
      procedures_details: dossier?.procedures_details ?? extracted?.juridique?.procedures_details ?? '',
      travaux_details: dossier?.travaux_details ?? extracted?.juridique?.travaux_votes_details ?? '',
      dpe_ademe_number: dossier?.dpe_ademe_number ?? extracted?.diagnostics?.dpe_numero_ademe ?? '',
    },
  });

  // Auto-verify DPE on mount if ADEME number exists
  useEffect(() => {
    const ademeNum = dossier?.dpe_ademe_number || extracted?.diagnostics?.dpe_numero_ademe;
    if (ademeNum) verify(ademeNum);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Deduce booleans from text fields at submit time
  const onSubmit = (data) => {
    const finalData = {
      ...data,
      procedures_en_cours: !!data.procedures_details?.trim(),
      travaux_votes_non_realises: !!data.travaux_details?.trim(),
    };
    if (onValidate) onValidate(finalData);
  };

  const missingData = extracted?.meta?.donnees_manquantes || [];
  const alerts = extracted?.meta?.alertes || [];

  // Helper for locked input styling
  const lockedClass = (section) =>
    isLocked(section) ? 'bg-secondary-50 cursor-default' : '';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          Validez les informations
        </h2>
        <p className="text-secondary-500">
          Vérifiez les données extraites par l'IA. Cliquez sur le cadenas pour modifier une section.
        </p>
      </div>

      {/* Alertes */}
      {(missingData.length > 0 || alerts.length > 0) && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Points d'attention</AlertTitle>
          <AlertDescription>
            {missingData.length > 0 && (
              <div className="mt-2">
                <span className="font-medium">Données manquantes :</span>
                <ul className="list-disc list-inside mt-1">
                  {missingData.map((item, i) => (
                    <li key={i} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {alerts.length > 0 && (
              <div className="mt-2">
                <span className="font-medium">Alertes :</span>
                <ul className="list-disc list-inside mt-1">
                  {alerts.map((item, i) => (
                    <li key={i} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Propriete */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Propriété</CardTitle>
          <button
            type="button"
            onClick={() => toggleLock('property')}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            title={isLocked('property') ? 'Modifier' : 'Verrouiller'}
          >
            {isLocked('property') ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="property_address">Adresse *</Label>
            <Input id="property_address" {...register('property_address')} readOnly={isLocked('property')} className={lockedClass('property')} />
            {errors.property_address && <p className="text-xs text-destructive mt-1">{errors.property_address.message}</p>}
          </div>
          <div>
            <Label htmlFor="property_city">Ville</Label>
            <Input id="property_city" {...register('property_city')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
          <div>
            <Label htmlFor="property_postal_code">Code postal</Label>
            <Input id="property_postal_code" {...register('property_postal_code')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
          <div>
            <Label htmlFor="property_lot_number">Numéro de lot</Label>
            <Input id="property_lot_number" {...register('property_lot_number')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
          <div>
            <Label htmlFor="property_surface">Surface Carrez (m²)</Label>
            <Input id="property_surface" type="number" step="0.01" {...register('property_surface')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
          <div>
            <Label htmlFor="copropriete_name">Copropriété</Label>
            <Input id="copropriete_name" {...register('copropriete_name')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
          <div>
            <Label htmlFor="syndic_name">Syndic</Label>
            <Input id="syndic_name" {...register('syndic_name')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
        </CardContent>
      </Card>

      {/* Vendeur */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Vendeur</CardTitle>
          <button
            type="button"
            onClick={() => toggleLock('seller')}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            title={isLocked('seller') ? 'Modifier' : 'Verrouiller'}
          >
            {isLocked('seller') ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </button>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="seller_name">Nom complet du vendeur *</Label>
            <Input id="seller_name" {...register('seller_name')} readOnly={isLocked('seller')} className={lockedClass('seller')} />
            {errors.seller_name && <p className="text-xs text-destructive mt-1">{errors.seller_name.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Financier */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Données financières</CardTitle>
          <button
            type="button"
            onClick={() => toggleLock('financial')}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            title={isLocked('financial') ? 'Modifier' : 'Verrouiller'}
          >
            {isLocked('financial') ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </button>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="budget_previsionnel">Budget prévisionnel annuel de la copropriété</Label>
            <Input id="budget_previsionnel" type="number" step="0.01" {...register('budget_previsionnel')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
          </div>
          <div>
            <Label htmlFor="tantiemes_lot">Tantièmes du lot (parties communes générales)</Label>
            <Input id="tantiemes_lot" type="number" step="1" {...register('tantiemes_lot')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
          </div>
          <div>
            <Label htmlFor="tantiemes_totaux">Tantièmes totaux de la copropriété</Label>
            <Input id="tantiemes_totaux" type="number" step="1" {...register('tantiemes_totaux')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
          </div>
          <div>
            <Label htmlFor="charges_courantes">Charges courantes du lot (annuelles)</Label>
            <Input id="charges_courantes" type="number" step="0.01" {...register('charges_courantes')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
          </div>
          {/* Discrepancy alert */}
          {dossier?.charges_discrepancy_pct > 0 && (
            <div className="md:col-span-2">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Écart sur les charges courantes</AlertTitle>
                <AlertDescription className="text-sm space-y-1">
                  <p>
                    Calcul (tantièmes x budget) :{' '}
                    <span className="font-medium">
                      {dossier.charges_calculees?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </p>
                  <p>
                    Extrait des documents :{' '}
                    <span className="font-medium">
                      {extracted?.financier?.charges_courantes_lot?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </p>
                  <p className="text-xs text-secondary-500">
                    Écart de {dossier.charges_discrepancy_pct}% — vérifiez la valeur et ajustez si nécessaire.
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          )}
          <div>
            <Label htmlFor="fonds_travaux_balance">Solde fonds de travaux</Label>
            <Input id="fonds_travaux_balance" type="number" step="0.01" {...register('fonds_travaux_balance')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
          </div>
          <div>
            <Label htmlFor="charges_exceptionnelles">Charges exceptionnelles</Label>
            <Input id="charges_exceptionnelles" type="number" step="0.01" {...register('charges_exceptionnelles')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
          </div>
          <div>
            <Label htmlFor="impaye_vendeur">Impayés du vendeur</Label>
            <Input id="impaye_vendeur" type="number" step="0.01" {...register('impaye_vendeur')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
          </div>
          <div>
            <Label htmlFor="dette_copro_fournisseurs">Dettes copro fournisseurs</Label>
            <Input id="dette_copro_fournisseurs" type="number" step="0.01" {...register('dette_copro_fournisseurs')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
          </div>
        </CardContent>
      </Card>

      {/* Juridique */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Situation juridique</CardTitle>
          <button
            type="button"
            onClick={() => toggleLock('legal')}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            title={isLocked('legal') ? 'Modifier' : 'Verrouiller'}
          >
            {isLocked('legal') ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="procedures_details">Procédures judiciaires en cours</Label>
            <Textarea
              id="procedures_details"
              {...register('procedures_details')}
              readOnly={isLocked('legal')}
              className={isLocked('legal') ? 'bg-secondary-50 cursor-default' : ''}
              placeholder={isLocked('legal') ? '' : 'Décrivez les procédures en cours, le cas échéant...'}
            />
          </div>
          <div>
            <Label htmlFor="travaux_details">Travaux votés non encore réalisés</Label>
            <Textarea
              id="travaux_details"
              {...register('travaux_details')}
              readOnly={isLocked('legal')}
              className={isLocked('legal') ? 'bg-secondary-50 cursor-default' : ''}
              placeholder={isLocked('legal') ? '' : 'Décrivez les travaux votés en AG non encore réalisés...'}
            />
          </div>
        </CardContent>
      </Card>

      {/* DPE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            Vérification DPE
            {isVerifying && <Loader2 className="h-4 w-4 animate-spin text-secondary-400" />}
            {dpeResult && !isVerifying && (
              <Badge
                variant={
                  dpeResult.validity === 'valid' ? 'success' :
                  dpeResult.validity === 'expired' ? 'destructive' :
                  'warning'
                }
              >
                {dpeResult.validity === 'valid' && 'Valide'}
                {dpeResult.validity === 'expiring_soon' && 'Expire bientôt'}
                {dpeResult.validity === 'expired' && 'Expiré'}
                {dpeResult.validity === 'not_opposable' && 'Non opposable'}
                {dpeResult.validity === 'not_found' && 'Non trouvé'}
              </Badge>
            )}
          </CardTitle>
          <button
            type="button"
            onClick={() => toggleLock('dpe')}
            className="text-secondary-400 hover:text-secondary-600 transition-colors"
            title={isLocked('dpe') ? 'Modifier' : 'Verrouiller'}
          >
            {isLocked('dpe') ? <Lock className="h-4 w-4" /> : <LockOpen className="h-4 w-4" />}
          </button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dpe_ademe_number">Numéro ADEME du DPE</Label>
            <Input
              id="dpe_ademe_number"
              {...register('dpe_ademe_number')}
              readOnly={isLocked('dpe')}
              className={lockedClass('dpe')}
              onBlur={(e) => {
                const val = e.target.value?.trim();
                if (val && val.length > 5 && !isLocked('dpe')) verify(val);
              }}
            />
          </div>

          {dpeResult?.data && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-secondary-50 rounded-lg">
              <div>
                <p className="text-xs text-secondary-500">Classe énergie</p>
                <p className="text-lg font-bold">{dpeResult.data.classe_energie}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Classe GES</p>
                <p className="text-lg font-bold">{dpeResult.data.classe_ges}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Date</p>
                <p className="text-sm">{dpeResult.data.date_etablissement}</p>
              </div>
              <div>
                <p className="text-xs text-secondary-500">Surface</p>
                <p className="text-sm">{dpeResult.data.surface} m²</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="gap-2">
          <CheckCircle className="h-5 w-5" />
          Valider et continuer
        </Button>
      </div>
    </form>
  );
}
