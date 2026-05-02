import { useState, useEffect, useRef } from 'react';
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
import {
  groupMissingFields,
  filterMissingByContext,
  splitMissingByImportance,
} from '@lib/humanizeFieldNames';
import { CheckCircle, AlertTriangle, Lock, LockOpen, Loader2, ArrowDown } from 'lucide-react';

/**
 * Bouton de verrouillage/déverrouillage d'une section. Avant : icône seule
 * (cadenas) avec tooltip — peu compréhensible pour un vendeur first-time qui
 * ne devine pas la mécanique. Maintenant : icône + label "Modifier" /
 * "Verrouiller" pour rendre l'affordance évidente sans formation.
 */
function SectionLockButton({ isLocked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md transition-colors text-secondary-500 hover:text-primary-700 hover:bg-primary-50"
      title={isLocked ? "Cliquez pour modifier cette section" : "Cliquez pour la verrouiller à nouveau"}
    >
      {isLocked ? (
        <>
          <Lock className="h-3.5 w-3.5" />
          <span>Modifier</span>
        </>
      ) : (
        <>
          <LockOpen className="h-3.5 w-3.5" />
          <span>Verrouiller</span>
        </>
      )}
    </button>
  );
}

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

  // Section lock state — all sections locked by default, except seller if name is empty
  const [unlockedSections, setUnlockedSections] = useState(() => {
    const initial = new Set();
    if (!dossier?.seller_name) initial.add('seller');
    return initial;
  });
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

  // Pipeline de tri des manquants :
  //   1. liste brute renvoyée par Gemini
  //   2. filterMissingByContext : enlève les paths déjà saisis (lot.surface_carrez
  //      si property_surface présent) et les paths conditionnels non applicables
  //      (bail.* si bien non loué)
  //   3. splitMissingByImportance : sépare en bucket "à collecter" (visible) vs
  //      "bonus" (collapsible) pour ne pas noyer le vendeur
  const rawMissing = extracted?.meta?.donnees_manquantes || [];
  const filteredMissing = filterMissingByContext(rawMissing, dossier);
  const { important: missingImportant, optional: missingOptional } = splitMissingByImportance(filteredMissing);
  const alerts = extracted?.meta?.alertes || [];

  // Check if impayés/dettes data is missing (critical for CSN L.721-2, 2°, c)
  const impayeGlobalMissing = dossier?.impaye_charges_global == null
    && extracted?.financier?.impaye_charges_global == null;
  const detteGlobalMissing = dossier?.dette_fournisseurs_global == null
    && extracted?.financier?.dette_fournisseurs_global == null;
  const impayesDetteMissing = impayeGlobalMissing || detteGlobalMissing;

  // Helper for locked input styling
  const lockedClass = (section) =>
    isLocked(section) ? 'bg-secondary-50 cursor-default' : '';

  // Ref + handler used by the impayés alert to scroll the user to the
  // financial section and unlock it in one click.
  const financialSectionRef = useRef(null);
  const focusFinancialSection = () => {
    if (isLocked('financial')) toggleLock('financial');
    financialSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          Vérifiez ce que nous avons extrait
        </h2>
        <p className="text-secondary-500 max-w-xl mx-auto">
          Tout est pré-rempli depuis vos documents. Pour corriger une section,
          cliquez sur son bouton <strong className="text-secondary-700">Modifier</strong>.
        </p>
      </div>

      {/* Récap — données non extraites + alertes IA */}
      {(missingImportant.length > 0 || missingOptional.length > 0 || alerts.length > 0) && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Pensez à collecter ces éléments pour votre notaire</AlertTitle>
          <AlertDescription>
            {missingImportant.length > 0 && (
              <div className="mt-2 space-y-2">
                {Array.from(groupMissingFields(missingImportant).entries()).map(
                  ([category, items]) => (
                    <div key={category} className="ml-1">
                      <p className="text-sm font-medium text-secondary-700">
                        {category}
                      </p>
                      <ul className="list-disc list-inside mt-0.5 ml-1 space-y-0.5">
                        {items.map((phrase, i) => (
                          <li key={i} className="text-sm">{phrase}</li>
                        ))}
                      </ul>
                    </div>
                  )
                )}
              </div>
            )}

            {missingOptional.length > 0 && (
              <details className="mt-3 group">
                <summary className="text-sm font-medium text-secondary-700 cursor-pointer hover:text-primary-700 select-none">
                  <span className="group-open:hidden">
                    Voir {missingOptional.length} information{missingOptional.length > 1 ? 's' : ''} optionnelle{missingOptional.length > 1 ? 's' : ''} (bonus si vous l'avez)
                  </span>
                  <span className="hidden group-open:inline">
                    Masquer les informations optionnelles
                  </span>
                </summary>
                <div className="mt-2 space-y-2 pl-2 border-l-2 border-secondary-200">
                  {Array.from(groupMissingFields(missingOptional).entries()).map(
                    ([category, items]) => (
                      <div key={category} className="ml-2">
                        <p className="text-sm font-medium text-secondary-600">
                          {category}
                        </p>
                        <ul className="list-disc list-inside mt-0.5 ml-1 space-y-0.5">
                          {items.map((phrase, i) => (
                            <li key={i} className="text-sm text-secondary-600">{phrase}</li>
                          ))}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              </details>
            )}

            {(missingImportant.length > 0 || missingOptional.length > 0) && (
              <p className="text-xs text-secondary-600 mt-3">
                Saisissez ci-dessous ce que vous avez sous la main. Pour le reste, demandez
                à votre syndic ou apportez les documents lors du rendez-vous chez votre notaire.
              </p>
            )}

            {alerts.length > 0 && (
              <div className="mt-3">
                <p className="font-medium">Points d'attention détectés :</p>
                <ul className="list-disc list-inside mt-1 space-y-0.5">
                  {alerts.map((item, i) => (
                    <li key={i} className="text-sm">{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Alerte impayés/dettes manquants — ton apaisé + actions claires */}
      {impayesDetteMissing && (
        <Alert variant="warning">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Une donnée importante à compléter</AlertTitle>
          <AlertDescription className="text-sm space-y-3">
            <p>
              Nous n'avons pas trouvé l'état global des impayés et des dettes
              fournisseurs de votre copropriété dans vos documents. Cette
              information figure normalement dans les annexes comptables que
              votre syndic vous fournit chaque année.
            </p>
            <div>
              <p className="font-medium mb-1">Vous avez trois choix :</p>
              <ul className="list-disc list-inside space-y-1 ml-1">
                <li>
                  <strong>Saisir vous-même</strong> les montants ci-dessous
                  (rapide si vous les avez sous la main).
                </li>
                <li>
                  <strong>Laisser vides</strong> ces champs : ils apparaîtront en
                  "non communiqué" sur le pré-état daté. Votre notaire les
                  redemandera ou les complétera lors de la signature.
                </li>
                <li>
                  <strong>Retourner à l'étape précédente</strong> pour ajouter les
                  annexes comptables si vous les avez et qu'elles n'ont pas été
                  uploadées.
                </li>
              </ul>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={focusFinancialSection}
              className="gap-2 mt-1"
            >
              <ArrowDown className="h-3.5 w-3.5" />
              Saisir manuellement
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Propriete */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Le bien</CardTitle>
          <SectionLockButton
            isLocked={isLocked('property')}
            onToggle={() => toggleLock('property')}
          />
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
            <p className="text-xs text-secondary-500 mt-1">
              Tel qu'il figure dans votre règlement de copropriété (différent du numéro d'appartement).
            </p>
          </div>
          <div>
            <Label htmlFor="property_surface">Surface habitable (loi Carrez, m²)</Label>
            <Input id="property_surface" type="number" step="0.01" {...register('property_surface')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
          <div>
            <Label htmlFor="copropriete_name">Nom de la copropriété</Label>
            <Input id="copropriete_name" {...register('copropriete_name')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
          <div>
            <Label htmlFor="syndic_name">Cabinet de syndic</Label>
            <Input id="syndic_name" {...register('syndic_name')} readOnly={isLocked('property')} className={lockedClass('property')} />
          </div>
        </CardContent>
      </Card>

      {/* Vendeur */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Vous, le vendeur</CardTitle>
          <SectionLockButton
            isLocked={isLocked('seller')}
            onToggle={() => toggleLock('seller')}
          />
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
      <Card ref={financialSectionRef} className="scroll-mt-4">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Données financières du lot et de la copropriété</CardTitle>
          <SectionLockButton
            isLocked={isLocked('financial')}
            onToggle={() => toggleLock('financial')}
          />
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="budget_previsionnel">Budget prévisionnel annuel de la copropriété</Label>
            <Input id="budget_previsionnel" type="number" step="0.01" {...register('budget_previsionnel')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
            <p className="text-xs text-secondary-500 mt-1">
              Voté en assemblée générale, il sert de base au calcul de vos charges courantes.
            </p>
          </div>
          <div>
            <Label htmlFor="tantiemes_lot">Tantièmes de votre lot</Label>
            <Input id="tantiemes_lot" type="number" step="1" {...register('tantiemes_lot')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
            <p className="text-xs text-secondary-500 mt-1">
              Votre quote-part dans les parties communes (ex: 4632).
            </p>
          </div>
          <div>
            <Label htmlFor="tantiemes_totaux">Tantièmes totaux de la copropriété</Label>
            <Input id="tantiemes_totaux" type="number" step="1" {...register('tantiemes_totaux')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
            <p className="text-xs text-secondary-500 mt-1">
              Le dénominateur. Souvent 1 000, 10 000 ou 100 000.
            </p>
          </div>
          <div>
            <Label htmlFor="charges_courantes">Charges courantes annuelles du lot</Label>
            <Input id="charges_courantes" type="number" step="0.01" {...register('charges_courantes')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
            <p className="text-xs text-secondary-500 mt-1">
              Ce que vous payez chaque année au syndic, hors travaux exceptionnels.
            </p>
          </div>
          {/* Discrepancy alert */}
          {dossier?.charges_discrepancy_pct > 0 && (
            <div className="md:col-span-2">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Deux valeurs différentes pour vos charges</AlertTitle>
                <AlertDescription className="text-sm space-y-1">
                  <p>
                    Selon vos tantièmes et le budget de la copro :{' '}
                    <span className="font-medium">
                      {dossier.charges_calculees?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </p>
                  <p>
                    Selon vos appels de fonds :{' '}
                    <span className="font-medium">
                      {extracted?.financier?.charges_courantes_lot?.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </span>
                  </p>
                  <p className="text-xs text-secondary-500">
                    Différence de {dossier.charges_discrepancy_pct}%. Vérifiez quelle valeur saisir avant de continuer (en général, les appels de fonds sont la source la plus fiable).
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          )}
          <div>
            <Label htmlFor="fonds_travaux_balance">Quote-part du fonds de travaux pour votre lot</Label>
            <Input id="fonds_travaux_balance" type="number" step="0.01" {...register('fonds_travaux_balance')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
            <p className="text-xs text-secondary-500 mt-1">
              Votre part de l'épargne légale de la copropriété (loi ALUR). Cette somme part avec
              la vente. La valeur exacte figure normalement dans vos relevés de compte
              (ligne « Fonds Travaux ALUR »). À défaut : ≈ tantièmes du lot ÷ tantièmes totaux × solde global.
            </p>
          </div>
          <div>
            <Label htmlFor="charges_exceptionnelles">Charges exceptionnelles du lot</Label>
            <Input id="charges_exceptionnelles" type="number" step="0.01" {...register('charges_exceptionnelles')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
            <p className="text-xs text-secondary-500 mt-1">
              Travaux ou dépenses appelés hors du budget annuel courant.
            </p>
          </div>
          <div>
            <Label htmlFor="impaye_vendeur">Vos impayés à la copropriété</Label>
            <Input id="impaye_vendeur" type="number" step="0.01" {...register('impaye_vendeur')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
            <p className="text-xs text-secondary-500 mt-1">
              0 si vous êtes à jour avec votre syndic.
            </p>
          </div>
          <div>
            <Label htmlFor="dette_copro_fournisseurs">Dettes globales de la copropriété envers ses fournisseurs</Label>
            <Input id="dette_copro_fournisseurs" type="number" step="0.01" {...register('dette_copro_fournisseurs')} readOnly={isLocked('financial')} className={lockedClass('financial')} />
            <p className="text-xs text-secondary-500 mt-1">
              Total dû par le syndicat à ses prestataires (donc partagé entre tous les copropriétaires).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Juridique */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Procédures et travaux votés</CardTitle>
          <SectionLockButton
            isLocked={isLocked('legal')}
            onToggle={() => toggleLock('legal')}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="procedures_details">Procédures judiciaires en cours</Label>
            <Textarea
              id="procedures_details"
              {...register('procedures_details')}
              readOnly={isLocked('legal')}
              className={isLocked('legal') ? 'bg-secondary-50 cursor-default' : ''}
              placeholder={isLocked('legal') ? '' : 'Saisies, contentieux avec le syndic ou un copropriétaire, mandataire ad hoc... Laissez vide s\'il n\'y en a pas.'}
            />
            <p className="text-xs text-secondary-500 mt-1">
              Concerne la copropriété entière, pas seulement votre lot.
            </p>
          </div>
          <div>
            <Label htmlFor="travaux_details">Travaux votés en AG non encore réalisés</Label>
            <Textarea
              id="travaux_details"
              {...register('travaux_details')}
              readOnly={isLocked('legal')}
              className={isLocked('legal') ? 'bg-secondary-50 cursor-default' : ''}
              placeholder={isLocked('legal') ? '' : 'Ravalement, toiture, ascenseur, rénovation énergétique... Laissez vide si aucun travail n\'est en attente.'}
            />
          </div>

          {/* Détail structuré des travaux votés (issu de l'extraction AI) */}
          {(() => {
            const travauxVotes = extracted?.juridique?.travaux_a_venir_votes || [];
            if (travauxVotes.length === 0) return null;
            const totalRestant = travauxVotes.reduce((sum, t) => sum + (t.montant_restant_lot || 0), 0);
            return (
              <div className="mt-3 space-y-3">
                <p className="text-sm font-medium text-secondary-700">
                  Travaux votés en AG, détectés dans vos PV :
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border border-secondary-200 rounded">
                    <thead className="bg-secondary-50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium text-secondary-600">Travaux</th>
                        <th className="text-right px-3 py-2 font-medium text-secondary-600">Votre part totale</th>
                        <th className="text-right px-3 py-2 font-medium text-secondary-600">Déjà payé</th>
                        <th className="text-right px-3 py-2 font-medium text-secondary-600">Reste à payer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {travauxVotes.map((t, i) => {
                        if (typeof t === 'string') {
                          return (
                            <tr key={i} className={i % 2 === 1 ? 'bg-secondary-50/50' : ''}>
                              <td className="px-3 py-2">{t}</td>
                              <td className="text-right px-3 py-2">-</td>
                              <td className="text-right px-3 py-2">-</td>
                              <td className="text-right px-3 py-2">-</td>
                            </tr>
                          );
                        }
                        const desc = t.description || 'Travaux';
                        const ref = t.resolution_ag || '';
                        const datePrevue = t.date_realisation_prevue || '';
                        return (
                          <tr key={i} className={i % 2 === 1 ? 'bg-secondary-50/50' : ''}>
                            <td className="px-3 py-2">
                              <span className="font-medium">{desc}</span>
                              {ref && <span className="block text-xs text-secondary-400">{ref}</span>}
                              {datePrevue && <span className="block text-xs text-secondary-400">Réalisation prévue : {datePrevue}</span>}
                            </td>
                            <td className="text-right px-3 py-2 tabular-nums">
                              {t.quote_part_lot != null ? `${Number(t.quote_part_lot).toLocaleString('fr-FR')} €` : '-'}
                            </td>
                            <td className="text-right px-3 py-2 tabular-nums">
                              {t.montant_appele_lot != null ? `${Number(t.montant_appele_lot).toLocaleString('fr-FR')} €` : '-'}
                            </td>
                            <td className={`text-right px-3 py-2 tabular-nums font-semibold ${t.montant_restant_lot > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              {t.montant_restant_lot != null ? `${Number(t.montant_restant_lot).toLocaleString('fr-FR')} €` : '-'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                {totalRestant > 0 && (
                  <Alert variant="warning" className="mt-2">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      <strong>
                        Reste à payer pour ces travaux : {totalRestant.toLocaleString('fr-FR')} €
                      </strong>
                      <br />
                      Ce montant sera réparti entre vous et l'acquéreur en fonction de
                      la date de signature. Votre notaire fera le calcul exact.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* DPE */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base flex items-center gap-2">
            Diagnostic de performance énergétique (DPE)
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
          <SectionLockButton
            isLocked={isLocked('dpe')}
            onToggle={() => toggleLock('dpe')}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="dpe_ademe_number">Numéro ADEME</Label>
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
            <p className="text-xs text-secondary-500 mt-1">
              13 caractères en haut de votre rapport DPE (ex : 2531E1024432P).
              Nous vérifions la validité auprès de l'ADEME.
            </p>
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-secondary-500 max-w-md">
          En validant, vous confirmez avoir relu les informations. Votre notaire
          pourra encore les ajuster si nécessaire avant la signature.
        </p>
        <Button type="submit" size="lg" className="gap-2 shrink-0">
          <CheckCircle className="h-5 w-5" />
          Tout est correct, continuer
        </Button>
      </div>
    </form>
  );
}
