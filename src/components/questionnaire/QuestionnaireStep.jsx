import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import {
  User, MapPin, Home, Building2, ArrowRight, Plus, Trash2, Building,
} from 'lucide-react';
import BooleanQuestion from './BooleanQuestion';
import {
  SectionCard,
  ProgressIndicator,
  BonusDivider,
} from './QuestionnaireUI';
import {
  questionnaireSchema,
  SITUATION_MATRIMONIALE_OPTIONS,
  REGIME_MATRIMONIAL_OPTIONS,
  FORME_JURIDIQUE_OPTIONS,
} from '@schemas/questionnaireSchema';

// ── Sub-components (defined outside render to preserve React identity) ──

function FormSelect({ id, label, options, placeholder = 'Choisir...', watch, setValue }) {
  return (
    <div>
      <Label className="text-sm">{label}</Label>
      <Select
        value={watch(id) || ''}
        onValueChange={(val) => setValue(id, val, { shouldDirty: true })}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function Field({ id, label, type = 'text', placeholder, register, hint, ...rest }) {
  return (
    <div>
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register(id)} className="mt-1" {...rest} />
      {hint && <p className="text-xs text-secondary-400 mt-1">{hint}</p>}
    </div>
  );
}

function BoolQ({ register, watch, setValue, ...props }) {
  return (
    <BooleanQuestion register={register} watch={watch} setValue={setValue} {...props} />
  );
}

function PersonnePhysiqueFields({ index, register, watch, setValue }) {
  const prefix = `proprietaires.${index}`;
  const sitMat = watch(`${prefix}.situation_matrimoniale`);
  const showRegime = sitMat === 'marie' || sitMat === 'pacse';

  return (
    <div className="space-y-4">
      <Field id={`${prefix}.quote_part`} label="Quote-part de propriété" placeholder="Ex: 1/2, 50%, pleine propriété..." register={register} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormSelect
          id={`${prefix}.civilite`}
          label="Civilité"
          options={[{ value: 'M', label: 'M.' }, { value: 'Mme', label: 'Mme' }]}
          watch={watch}
          setValue={setValue}
        />
        <Field id={`${prefix}.nom`} label="Nom" placeholder="Dupont" register={register} />
        <Field id={`${prefix}.prenoms`} label="Prénom(s)" placeholder="Jean Marie" register={register} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field id={`${prefix}.nom_naissance`} label="Nom de naissance" placeholder="Si différent" register={register} />
        <Field id={`${prefix}.date_naissance`} label="Date de naissance" type="date" register={register} />
        <Field id={`${prefix}.lieu_naissance`} label="Lieu de naissance" placeholder="Toulouse" register={register} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Field id={`${prefix}.nationalite`} label="Nationalité" placeholder="Française" register={register} />
        <Field id={`${prefix}.profession`} label="Profession" placeholder="Ingénieur" register={register} />
        <FormSelect
          id={`${prefix}.situation_matrimoniale`}
          label="Situation matrimoniale"
          options={SITUATION_MATRIMONIALE_OPTIONS}
          watch={watch}
          setValue={setValue}
        />
      </div>
      {showRegime && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-in fade-in-50 slide-in-from-top-2 duration-200">
          <FormSelect
            id={`${prefix}.regime_matrimonial`}
            label="Régime matrimonial"
            options={REGIME_MATRIMONIAL_OPTIONS}
            watch={watch}
            setValue={setValue}
          />
          <Field id={`${prefix}.date_mariage`} label="Date de mariage/PACS" type="date" register={register} />
        </div>
      )}
    </div>
  );
}

function PersonneMoraleFields({ index, register, watch, setValue }) {
  const prefix = `proprietaires.${index}`;
  return (
    <div className="space-y-4">
      <Field id={`${prefix}.quote_part`} label="Quote-part de propriété" placeholder="Ex: 1/2, 50%, pleine propriété..." register={register} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field id={`${prefix}.denomination`} label="Dénomination sociale" placeholder="SCI Mon Bien" register={register} />
        <FormSelect
          id={`${prefix}.forme_juridique`}
          label="Forme juridique"
          options={FORME_JURIDIQUE_OPTIONS}
          watch={watch}
          setValue={setValue}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field id={`${prefix}.siren`} label="SIREN" placeholder="123 456 789" register={register} />
        <Field id={`${prefix}.rcs_ville`} label="RCS Ville" placeholder="Toulouse" register={register} />
      </div>
      <Field id={`${prefix}.siege_social`} label="Adresse du siège social" placeholder="12 rue de la Paix, 75001 Paris" register={register} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field id={`${prefix}.representant_nom`} label="Représentant légal (nom)" placeholder="M. Jean Dupont" register={register} />
        <Field id={`${prefix}.representant_qualite`} label="Qualité du représentant" placeholder="Gérant" register={register} />
      </div>
    </div>
  );
}

// ── Main component ──

export default function QuestionnaireStep({ dossier, onSave }) {
  const existingData = dossier?.questionnaire_data || {};

  let initialProprietaires = existingData.proprietaires;
  if (!initialProprietaires && existingData.vendeur1) {
    initialProprietaires = [
      { type: 'personne_physique', ...existingData.vendeur1 },
      ...(existingData.vendeur2?.nom
        ? [{ type: 'personne_physique', ...existingData.vendeur2 }]
        : []),
    ];
  }
  if (!initialProprietaires) initialProprietaires = [];

  const initialBien = existingData.bien || {
    lot_number: dossier?.property_lot_number || '',
    adresse: dossier?.property_address || '',
    ville: dossier?.property_city || '',
    code_postal: dossier?.property_postal_code || '',
  };

  const { register, handleSubmit, watch, setValue, control } = useForm({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      bien: initialBien,
      proprietaires: initialProprietaires,
      occupation: existingData.occupation || {},
      copropriete_questions: existingData.copropriete_questions || {},
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'proprietaires' });

  const addProprietaire = (type) => append({ type });

  const onSubmit = (data) => {
    if (onSave) onSave(data);
  };

  // ── Progress tracking ──
  const watched = watch();
  const essentialFields = [
    watched.bien?.adresse,
    watched.bien?.code_postal,
    watched.bien?.ville,
    watched.bien?.lot_number,
  ];
  const essentialDone = essentialFields.filter((v) => v && String(v).trim().length > 0).length;
  const essentialTotal = 4;
  const allEssentialDone = essentialDone === essentialTotal;

  const proprietairesDone =
    (watched.proprietaires || []).length > 0 &&
    (watched.proprietaires[0]?.nom || watched.proprietaires[0]?.denomination);
  const occupationDone = !!watched.occupation?.occupant_actuel;
  const coproDone = [
    watched.copropriete_questions?.volume_ou_lotissement,
    watched.copropriete_questions?.association_syndicale,
    watched.copropriete_questions?.modifications_depuis_achat,
    watched.copropriete_questions?.autorisations_urbanisme,
  ].some((v) => v !== undefined);
  const optionalDone = [proprietairesDone, occupationDone, coproDone].filter(Boolean).length;
  const optionalTotal = 3;

  // Build dynamic tab items for proprietaires
  const proprietaireTabs = fields.map((field, index) => {
    const isPM = field.type === 'personne_morale';
    return {
      id: `prop-${index}`,
      label: `Propriétaire ${index + 1}`,
      Icon: isPM ? Building : User,
      badge: isPM ? 'PM' : 'PP',
    };
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Sticky progress bar */}
      <ProgressIndicator
        essentialDone={essentialDone}
        essentialTotal={essentialTotal}
        optionalDone={optionalDone}
        optionalTotal={optionalTotal}
      />

      {/* Header */}
      <div className="text-center pt-2 pb-1">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-1.5">
          Présentez votre bien
        </h2>
        <p className="text-secondary-500 text-sm max-w-xl mx-auto leading-relaxed">
          <strong className="text-primary-700">Quatre informations</strong> suffisent
          pour démarrer votre pré-état daté.
        </p>
      </div>

      <SectionCard
        tier="essential"
        Icon={MapPin}
        title="Identification du bien"
        subtitle="Les 4 informations qui nous permettent d'analyser vos documents avec précision"
        done={allEssentialDone}
        hint={
          <>
            <strong>Le numéro de lot</strong> est crucial : il nous permet de calculer la quote-part
            exacte de vos charges dans la copropriété (différent du numéro d'appartement).
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="bien.adresse" className="text-sm">
              Adresse du bien <span className="text-primary-600">*</span>
            </Label>
            <Input
              id="bien.adresse"
              {...register('bien.adresse')}
              placeholder="Ex: 226 route de Seysses"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bien.code_postal" className="text-sm">
              Code postal <span className="text-primary-600">*</span>
            </Label>
            <Input
              id="bien.code_postal"
              {...register('bien.code_postal')}
              placeholder="31100"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bien.ville" className="text-sm">
              Ville <span className="text-primary-600">*</span>
            </Label>
            <Input
              id="bien.ville"
              {...register('bien.ville')}
              placeholder="Toulouse"
              className="mt-1"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="bien.lot_number" className="text-sm">
              Numéro de lot dans la copropriété <span className="text-primary-600">*</span>
            </Label>
            <Input
              id="bien.lot_number"
              {...register('bien.lot_number')}
              placeholder="Ex: 4032"
              className="mt-1"
            />
            <p className="text-xs text-secondary-400 mt-1">
              Tel qu'il figure dans le règlement de copropriété
            </p>
          </div>
        </div>
      </SectionCard>

      <BonusDivider subtitle="Optionnel et offert — chaque détail enrichit votre dossier notaire, à votre rythme." />

      {/* Propriétaires */}
      <SectionCard
        tier="optional"
        Icon={User}
        title="Propriétaires"
        subtitle="Identité du ou des vendeur(s) — utile pour le compromis et l'acte authentique"
        collapsible
        defaultOpen={fields.length > 0}
        done={proprietairesDone}
        hint={
          <>
            L'IA peut <strong>cross-vérifier</strong> les noms ici avec ceux des PV d'AG pour détecter
            des incohérences (changement de propriétaire, succession, etc.).
          </>
        }
      >
        {fields.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-sm text-secondary-500 text-center">
              Ajoutez le ou les propriétaires du bien :
            </p>
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => addProprietaire('personne_physique')}
                className="gap-2"
              >
                <User className="h-4 w-4" />
                Personne physique
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => addProprietaire('personne_morale')}
                className="gap-2"
              >
                <Building className="h-4 w-4" />
                Personne morale (SCI…)
              </Button>
            </div>
          </div>
        ) : (
          <Tabs defaultValue="prop-0" className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
              {proprietaireTabs.map(({ id, label, Icon, badge }) => (
                <TabsTrigger
                  key={id}
                  value={id}
                  className="text-xs px-2 py-1.5 gap-1 data-[state=active]:bg-white data-[state=active]:text-primary-700 border border-transparent data-[state=active]:border-primary-200 rounded-md"
                >
                  <Icon className="h-3.5 w-3.5" />
                  {label}
                  <span className="text-[10px] font-mono opacity-60">{badge}</span>
                </TabsTrigger>
              ))}
              <div className="flex gap-1 ml-1">
                <button
                  type="button"
                  onClick={() => addProprietaire('personne_physique')}
                  className="text-xs px-2 py-1.5 gap-1 flex items-center border border-dashed border-secondary-300 rounded-md text-secondary-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                  title="Ajouter une personne physique"
                  aria-label="Ajouter une personne physique"
                >
                  <Plus className="h-3 w-3" />
                  <User className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={() => addProprietaire('personne_morale')}
                  className="text-xs px-2 py-1.5 gap-1 flex items-center border border-dashed border-secondary-300 rounded-md text-secondary-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                  title="Ajouter une personne morale"
                  aria-label="Ajouter une personne morale"
                >
                  <Plus className="h-3 w-3" />
                  <Building className="h-3 w-3" />
                </button>
              </div>
            </TabsList>

            {fields.map((field, index) => (
              <TabsContent key={field.id} value={`prop-${index}`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-sm text-secondary-700">
                    {field.type === 'personne_morale'
                      ? `Personne morale — Propriétaire ${index + 1}`
                      : `Personne physique — Propriétaire ${index + 1}`}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="text-destructive hover:text-destructive gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Retirer
                  </Button>
                </div>
                {field.type === 'personne_morale' ? (
                  <PersonneMoraleFields index={index} register={register} watch={watch} setValue={setValue} />
                ) : (
                  <PersonnePhysiqueFields index={index} register={register} watch={watch} setValue={setValue} />
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </SectionCard>

      {/* Occupation */}
      <SectionCard
        tier="optional"
        Icon={Home}
        title="Occupation du bien"
        subtitle="Statut d'occupation actuel et bail éventuel"
        collapsible
        defaultOpen={false}
        done={occupationDone}
        hint={
          <>
            Si le bien est <strong>loué</strong>, le bail deviendra automatiquement requis à l'étape
            suivante pour intégrer le contrat dans le pack vendeur.
          </>
        }
      >
        <FormSelect
          id="occupation.occupant_actuel"
          label="Occupation actuelle"
          options={[
            { value: 'proprietaire', label: 'Occupé par le propriétaire' },
            { value: 'locataire', label: 'Occupé par un locataire' },
            { value: 'vacant', label: 'Vacant' },
          ]}
          watch={watch}
          setValue={setValue}
        />
        <BoolQ id="occupation.bail_en_cours" label="Bail en cours ?" register={register} watch={watch} setValue={setValue} />
        {watch('occupation.bail_en_cours') === true && (
          <div className="ml-4 pl-4 border-l-2 border-primary-200 space-y-3 animate-in fade-in-50 slide-in-from-top-2 duration-200">
            <FormSelect
              id="occupation.bail_type"
              label="Type de bail"
              options={[
                { value: 'vide', label: 'Location vide' },
                { value: 'meuble', label: 'Location meublée' },
                { value: 'commercial', label: 'Commercial' },
                { value: 'professionnel', label: 'Professionnel' },
              ]}
              watch={watch}
              setValue={setValue}
            />
            <div className="grid grid-cols-2 gap-3">
              <Field id="occupation.bail_date_debut" label="Date début bail" type="date" register={register} />
              <Field id="occupation.bail_date_fin" label="Date fin bail" type="date" register={register} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field id="occupation.loyer_mensuel" label="Loyer mensuel (€)" placeholder="850" register={register} />
              <Field id="occupation.depot_garantie" label="Dépôt de garantie (€)" placeholder="850" register={register} />
            </div>
            <BoolQ id="occupation.conge_delivre" label="Congé délivré au locataire ?" register={register} watch={watch} setValue={setValue} />
            {watch('occupation.conge_delivre') === true && (
              <Field id="occupation.conge_date" label="Date du congé" type="date" register={register} />
            )}
          </div>
        )}
        <BoolQ id="occupation.libre_a_la_vente" label="Le bien sera libre à la vente ?" register={register} watch={watch} setValue={setValue} />
      </SectionCard>

      {/* Copropriété */}
      <SectionCard
        tier="optional"
        Icon={Building2}
        title="Spécificités de la copropriété"
        subtitle="ASL, lotissement, modifications depuis votre achat"
        collapsible
        defaultOpen={false}
        done={coproDone}
        hint={
          <>
            Une <strong>ASL ou AFUL</strong> ajoute des charges complémentaires au lot.
            Ces réponses nous guident pour récupérer les bons documents.
          </>
        }
      >
        <BoolQ id="copropriete_questions.volume_ou_lotissement" label="Le bien fait-il partie d'un volume ou lotissement ?" register={register} watch={watch} setValue={setValue} />
        <BoolQ id="copropriete_questions.association_syndicale" label="Existence d'une ASL / AFUL ?" hint="Association syndicale libre ou association foncière urbaine libre" detailsField="copropriete_questions.association_syndicale_details" detailsLabel="Précisions sur l'ASL/AFUL (nom, charges, règlement...)" register={register} watch={watch} setValue={setValue} />
        <BoolQ id="copropriete_questions.modifications_depuis_achat" label="Modifications depuis l'achat ?" hint="Changement de destination, division, annexion de parties communes..." detailsField="copropriete_questions.modifications_details" register={register} watch={watch} setValue={setValue} />
        <BoolQ id="copropriete_questions.autorisations_urbanisme" label="Autorisations d'urbanisme obtenues ?" hint="Permis de construire, déclaration préalable..." detailsField="copropriete_questions.autorisations_details" register={register} watch={watch} setValue={setValue} />
      </SectionCard>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4">
        <p className="text-xs text-secondary-500 text-center sm:text-left">
          {allEssentialDone
            ? '✓ Tout est bon, vos infos serviront à analyser vos documents.'
            : 'Astuce : remplissez les 4 champs ci-dessus pour une analyse optimale.'}
        </p>
        <Button type="submit" size="lg" className="gap-2 shadow-md hover:shadow-lg transition-shadow">
          Continuer vers les documents
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
