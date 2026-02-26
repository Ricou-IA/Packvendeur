import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Alert, AlertDescription } from '@components/ui/alert';
import {
  User, MapPin, Home, Building2, Wrench, Landmark, TrendingUp, Receipt,
  Settings, ShieldAlert, Target, Info, ArrowRight, Plus, Trash2, Building,
} from 'lucide-react';
import BooleanQuestion from './BooleanQuestion';
import {
  questionnaireSchema,
  SITUATION_MATRIMONIALE_OPTIONS,
  REGIME_MATRIMONIAL_OPTIONS,
  FORME_JURIDIQUE_OPTIONS,
  DISPOSITIF_FISCAL_OPTIONS,
  MOTIF_VENTE_OPTIONS,
} from '@schemas/questionnaireSchema';

/**
 * Étape 1 du dossier : Questionnaire vendeur.
 * Formulaire indépendant (pas imbriqué dans ValidationForm).
 * Sauvegarde dans questionnaire_data JSONB.
 * Conditionne la checklist documents à l'étape suivante.
 */
export default function QuestionnaireStep({ dossier, onSave }) {
  const existingData = dossier?.questionnaire_data || {};

  // Migrate legacy vendeur1/vendeur2 to proprietaires[]
  let initialProprietaires = existingData.proprietaires;
  if (!initialProprietaires && existingData.vendeur1) {
    initialProprietaires = [
      { type: 'personne_physique', ...existingData.vendeur1 },
      ...(existingData.vendeur2?.nom
        ? [{ type: 'personne_physique', ...existingData.vendeur2 }]
        : []),
    ];
  }
  if (!initialProprietaires) {
    initialProprietaires = [];
  }

  // Migrate legacy lot info from dossier columns to bien section
  const initialBien = existingData.bien || {
    lot_number: dossier?.property_lot_number || '',
    adresse: dossier?.property_address || '',
    ville: dossier?.property_city || '',
    code_postal: dossier?.property_postal_code || '',
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(questionnaireSchema),
    defaultValues: {
      bien: initialBien,
      proprietaires: initialProprietaires,
      coordonnees: existingData.coordonnees || {},
      copropriete_questions: existingData.copropriete_questions || {},
      travaux: existingData.travaux || {},
      prets: existingData.prets || {},
      plus_values: existingData.plus_values || {},
      occupation: existingData.occupation || {},
      fiscal: existingData.fiscal || {},
      equipements: existingData.equipements || {},
      sinistres: existingData.sinistres || {},
      motivation: existingData.motivation || {},
      observations: existingData.observations || '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'proprietaires',
  });

  // Helper to build a Select controlled by react-hook-form
  const FormSelect = ({ id, label, options, placeholder = 'Choisir...' }) => (
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

  // Reusable field input
  const Field = ({ id, label, type = 'text', placeholder, ...rest }) => (
    <div>
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register(id)} className="mt-1" {...rest} />
    </div>
  );

  // Shorthand for BooleanQuestion
  const BoolQ = (props) => (
    <BooleanQuestion
      register={register}
      watch={watch}
      setValue={setValue}
      {...props}
    />
  );

  // --- Personne physique fields ---
  const PersonnePhysiqueFields = ({ index }) => {
    const prefix = `proprietaires.${index}`;
    const sitMat = watch(`${prefix}.situation_matrimoniale`);
    const showRegime = sitMat === 'marie' || sitMat === 'pacse';

    return (
      <div className="space-y-4">
        <Field id={`${prefix}.quote_part`} label="Quote-part de propriété" placeholder="Ex: 1/2, 50%, pleine propriété..." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormSelect
            id={`${prefix}.civilite`}
            label="Civilité"
            options={[{ value: 'M', label: 'M.' }, { value: 'Mme', label: 'Mme' }]}
          />
          <Field id={`${prefix}.nom`} label="Nom" placeholder="Dupont" />
          <Field id={`${prefix}.prenoms`} label="Prénom(s)" placeholder="Jean Marie" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field id={`${prefix}.nom_naissance`} label="Nom de naissance" placeholder="Si différent" />
          <Field id={`${prefix}.date_naissance`} label="Date de naissance" type="date" />
          <Field id={`${prefix}.lieu_naissance`} label="Lieu de naissance" placeholder="Toulouse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Field id={`${prefix}.nationalite`} label="Nationalité" placeholder="Française" />
          <Field id={`${prefix}.profession`} label="Profession" placeholder="Ingénieur" />
          <FormSelect
            id={`${prefix}.situation_matrimoniale`}
            label="Situation matrimoniale"
            options={SITUATION_MATRIMONIALE_OPTIONS}
          />
        </div>
        {showRegime && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <FormSelect
              id={`${prefix}.regime_matrimonial`}
              label="Régime matrimonial"
              options={REGIME_MATRIMONIAL_OPTIONS}
            />
            <Field id={`${prefix}.date_mariage`} label="Date de mariage/PACS" type="date" />
          </div>
        )}
      </div>
    );
  };

  // --- Personne morale fields ---
  const PersonneMoraleFields = ({ index }) => {
    const prefix = `proprietaires.${index}`;
    return (
      <div className="space-y-4">
        <Field id={`${prefix}.quote_part`} label="Quote-part de propriété" placeholder="Ex: 1/2, 50%, pleine propriété..." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field id={`${prefix}.denomination`} label="Dénomination sociale" placeholder="SCI Mon Bien" />
          <FormSelect
            id={`${prefix}.forme_juridique`}
            label="Forme juridique"
            options={FORME_JURIDIQUE_OPTIONS}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field id={`${prefix}.siren`} label="SIREN" placeholder="123 456 789" />
          <Field id={`${prefix}.rcs_ville`} label="RCS Ville" placeholder="Toulouse" />
        </div>
        <div>
          <Field id={`${prefix}.siege_social`} label="Adresse du siège social" placeholder="12 rue de la Paix, 75001 Paris" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field id={`${prefix}.representant_nom`} label="Représentant légal (nom)" placeholder="M. Jean Dupont" />
          <Field id={`${prefix}.representant_qualite`} label="Qualité du représentant" placeholder="Gérant" />
        </div>
      </div>
    );
  };

  const addProprietaire = (type) => {
    append({ type });
  };

  const onSubmit = (data) => {
    if (onSave) onSave(data);
  };

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

  // Static tabs that follow proprietaires
  const staticTabs = [
    { id: 'coordonnees', label: 'Contact', Icon: MapPin },
    { id: 'occupation', label: 'Occupation', Icon: Home },
    { id: 'copropriete', label: 'Copropriété', Icon: Building2 },
    { id: 'travaux', label: 'Travaux privatifs', Icon: Wrench },
    { id: 'prets', label: 'Prêts', Icon: Landmark },
    { id: 'plusvalues', label: 'Plus-values', Icon: TrendingUp },
    { id: 'fiscal', label: 'Fiscal', Icon: Receipt },
    { id: 'equipements', label: 'Équipements', Icon: Settings },
    { id: 'sinistres', label: 'Sinistres', Icon: ShieldAlert },
    { id: 'motivation', label: 'Vente', Icon: Target },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="text-center mb-2">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-2">
          Questionnaire vendeur
        </h2>
        <p className="text-secondary-500">
          Ces informations permettent de mieux préparer votre dossier pour le notaire
          et d'adapter l'analyse de vos documents.
        </p>
      </div>

      {/* --- Bien vendu (always visible, not in tabs) --- */}
      <Card className="border-primary-200 bg-primary-50/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary-600" />
            Identification du bien
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bien.adresse" className="text-sm">Adresse du bien</Label>
            <Input
              id="bien.adresse"
              {...register('bien.adresse')}
              placeholder="Ex: 226 route de Seysses"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bien.code_postal" className="text-sm">Code postal</Label>
            <Input
              id="bien.code_postal"
              {...register('bien.code_postal')}
              placeholder="31100"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bien.ville" className="text-sm">Ville</Label>
            <Input
              id="bien.ville"
              {...register('bien.ville')}
              placeholder="Toulouse"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="bien.lot_number" className="text-sm">Numéro de lot dans la copropriété</Label>
            <Input
              id="bien.lot_number"
              {...register('bien.lot_number')}
              placeholder="Ex: 4032"
              className="mt-1"
            />
            <p className="text-xs text-secondary-400 mt-1">
              Tel qu'il figure dans le règlement de copropriété (différent du numéro d'appartement)
            </p>
          </div>
        </CardContent>
      </Card>

      <Alert className="border-primary-200 bg-primary-50/50">
        <Info className="h-4 w-4 text-primary-600" />
        <AlertDescription className="text-sm text-primary-800">
          <strong>Facultatif mais recommandé :</strong> les informations ci-dessous permettent d'orienter l'analyse IA
          et de compléter les informations transmises au notaire. Vous pouvez aussi passer directement
          à l'étape suivante.
        </AlertDescription>
      </Alert>

      {/* Proprietaire add prompt when empty */}
      {fields.length === 0 && (
        <Card className="border-dashed border-2 border-secondary-300 bg-secondary-50/50">
          <CardContent className="py-8 flex flex-col items-center gap-4">
            <p className="text-sm text-secondary-600 text-center">
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
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue={fields.length > 0 ? 'prop-0' : 'coordonnees'} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
          {/* Dynamic proprietaire tabs */}
          {proprietaireTabs.map(({ id, label, Icon, badge }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="text-xs px-2 py-1.5 gap-1 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 border border-transparent data-[state=active]:border-primary-200 rounded-md"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              <span className="text-[10px] font-mono opacity-60">{badge}</span>
            </TabsTrigger>
          ))}

          {/* Add proprietaire buttons inline with tabs */}
          {fields.length > 0 && (
            <div className="flex gap-1 ml-1">
              <button
                type="button"
                onClick={() => addProprietaire('personne_physique')}
                className="text-xs px-2 py-1.5 gap-1 flex items-center border border-dashed border-secondary-300 rounded-md text-secondary-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                title="Ajouter une personne physique"
              >
                <Plus className="h-3 w-3" />
                <User className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => addProprietaire('personne_morale')}
                className="text-xs px-2 py-1.5 gap-1 flex items-center border border-dashed border-secondary-300 rounded-md text-secondary-500 hover:border-primary-400 hover:text-primary-600 transition-colors"
                title="Ajouter une personne morale"
              >
                <Plus className="h-3 w-3" />
                <Building className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Static tabs */}
          {staticTabs.map(({ id, label, Icon }) => (
            <TabsTrigger
              key={id}
              value={id}
              className="text-xs px-2 py-1.5 gap-1 data-[state=active]:bg-primary-100 data-[state=active]:text-primary-700 border border-transparent data-[state=active]:border-primary-200 rounded-md"
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* --- Dynamic proprietaire tabs content --- */}
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
              <PersonneMoraleFields index={index} />
            ) : (
              <PersonnePhysiqueFields index={index} />
            )}
          </TabsContent>
        ))}

        {/* --- Coordonnées --- */}
        <TabsContent value="coordonnees" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Coordonnées du vendeur</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="md:col-span-2">
              <Field id="coordonnees.adresse" label="Adresse actuelle" placeholder="12 rue de la Paix" />
            </div>
            <Field id="coordonnees.code_postal" label="Code postal" placeholder="75001" />
            <Field id="coordonnees.ville" label="Ville" placeholder="Paris" />
            <Field id="coordonnees.telephone" label="Téléphone" placeholder="06 12 34 56 78" />
            <Field id="coordonnees.email" label="Email" placeholder="jean@example.com" />
          </div>
          <BoolQ
            id="coordonnees.resident_fiscal_france"
            label="Résident fiscal en France ?"
          />
          {watch('coordonnees.resident_fiscal_france') === false && (
            <Field id="coordonnees.pays_residence_fiscale" label="Pays de résidence fiscale" />
          )}
        </TabsContent>

        {/* --- Occupation --- */}
        <TabsContent value="occupation" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Occupation du bien</h4>
          <FormSelect
            id="occupation.occupant_actuel"
            label="Occupation actuelle"
            options={[
              { value: 'proprietaire', label: 'Occupé par le propriétaire' },
              { value: 'locataire', label: 'Occupé par un locataire' },
              { value: 'vacant', label: 'Vacant' },
            ]}
          />
          <BoolQ id="occupation.bail_en_cours" label="Bail en cours ?" />
          {watch('occupation.bail_en_cours') === true && (
            <div className="ml-4 pl-4 border-l-2 border-primary-200 space-y-3">
              <FormSelect
                id="occupation.bail_type"
                label="Type de bail"
                options={[
                  { value: 'vide', label: 'Location vide' },
                  { value: 'meuble', label: 'Location meublée' },
                  { value: 'commercial', label: 'Commercial' },
                  { value: 'professionnel', label: 'Professionnel' },
                ]}
              />
              <div className="grid grid-cols-2 gap-3">
                <Field id="occupation.bail_date_debut" label="Date début bail" type="date" />
                <Field id="occupation.bail_date_fin" label="Date fin bail" type="date" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field id="occupation.loyer_mensuel" label="Loyer mensuel (€)" placeholder="850" />
                <Field id="occupation.depot_garantie" label="Dépôt de garantie (€)" placeholder="850" />
              </div>
              <BoolQ id="occupation.conge_delivre" label="Congé délivré au locataire ?" />
              {watch('occupation.conge_delivre') === true && (
                <Field id="occupation.conge_date" label="Date du congé" type="date" />
              )}
            </div>
          )}
          <BoolQ id="occupation.libre_a_la_vente" label="Le bien sera libre à la vente ?" />
        </TabsContent>

        {/* --- Copropriété questions --- */}
        <TabsContent value="copropriete" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Questions copropriété</h4>
          <BoolQ id="copropriete_questions.volume_ou_lotissement" label="Le bien fait-il partie d'un volume ou lotissement ?" />
          <BoolQ id="copropriete_questions.association_syndicale" label="Existence d'une ASL / AFUL ?" hint="Association syndicale libre ou association foncière urbaine libre" detailsField="copropriete_questions.association_syndicale_details" detailsLabel="Précisions sur l'ASL/AFUL (nom, charges, règlement...)" />
          <BoolQ id="copropriete_questions.modifications_depuis_achat" label="Modifications depuis l'achat ?" hint="Changement de destination, division, annexion de parties communes..." detailsField="copropriete_questions.modifications_details" />
          <BoolQ id="copropriete_questions.autorisations_urbanisme" label="Autorisations d'urbanisme obtenues ?" hint="Permis de construire, déclaration préalable..." detailsField="copropriete_questions.autorisations_details" />
        </TabsContent>

        {/* --- Travaux privatifs --- */}
        <TabsContent value="travaux" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Travaux réalisés par le copropriétaire</h4>
          <p className="text-xs text-secondary-400 -mt-2">Travaux dans votre lot (parties privatives), pas les travaux votés en copropriété.</p>
          <BoolQ id="travaux.travaux_realises" label="Travaux réalisés dans le lot ?" hint="Depuis votre acquisition" detailsField="travaux.travaux_realises_details" detailsLabel="Description des travaux" detailsPlaceholder="Nature, date, montant approximatif..." />
          <BoolQ id="travaux.travaux_autorises_ag" label="Travaux autorisés par l'AG ?" hint="Si vos travaux privatifs affectaient les parties communes" />
          <BoolQ id="travaux.travaux_conformes" label="Travaux conformes aux autorisations ?" detailsField="travaux.travaux_conformes_details" detailsLabel="Précisions sur la non-conformité" />
        </TabsContent>

        {/* --- Prêts --- */}
        <TabsContent value="prets" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Prêts et hypothèques</h4>
          <BoolQ id="prets.saisie_en_cours" label="Saisie immobilière en cours ?" detailsField="prets.saisie_details" />
          <BoolQ id="prets.pret_hypothecaire" label="Prêt(s) garanti(s) par une hypothèque ?" detailsField="prets.pret_hypothecaire_details" detailsLabel="Organisme prêteur, solde restant dû" />
          <BoolQ id="prets.credit_relais" label="Crédit-relais en cours ?" detailsField="prets.credit_relais_details" />
          <BoolQ id="prets.pret_a_taux_zero" label="Prêt à taux zéro (PTZ) ?" hint="Obligation de remboursement anticipé en cas de revente" />
        </TabsContent>

        {/* --- Plus-values --- */}
        <TabsContent value="plusvalues" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Plus-values immobilières</h4>
          <BoolQ id="plus_values.residence_principale" label="Ce bien est votre résidence principale ?" hint="Exonération de plus-value si résidence principale" />
          <Field id="plus_values.duree_detention" label="Durée de détention" placeholder="Ex: 8 ans" />
          <BoolQ id="plus_values.travaux_deductibles" label="Travaux déductibles de la plus-value ?" hint="Travaux facturés, non pris en compte pour l'impôt" />
          {watch('plus_values.travaux_deductibles') === true && (
            <Field id="plus_values.travaux_deductibles_montant" label="Montant des travaux déductibles" placeholder="15 000 €" />
          )}
          <BoolQ id="plus_values.acquisition_donation_succession" label="Acquisition par donation ou succession ?" detailsField="plus_values.acquisition_details" detailsLabel="Date et nature (donation, succession)" />
          <BoolQ id="plus_values.premiere_cession" label="Première cession d'un bien autre que la RP ?" hint="Exonération sous conditions (remploi pour achat RP)" />
        </TabsContent>

        {/* --- Fiscal --- */}
        <TabsContent value="fiscal" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Situation fiscale</h4>
          <FormSelect id="fiscal.dispositif_fiscal" label="Dispositif fiscal en cours" options={DISPOSITIF_FISCAL_OPTIONS} placeholder="Aucun dispositif" />
          {watch('fiscal.dispositif_fiscal') && watch('fiscal.dispositif_fiscal') !== 'aucun' && (
            <Field id="fiscal.dispositif_details" label="Détails du dispositif" placeholder="Date de début, durée d'engagement..." />
          )}
          <BoolQ id="fiscal.tva_recuperee" label="TVA récupérée lors de l'acquisition ?" hint="Si achat en VEFA avec TVA récupérable" />
          <BoolQ id="fiscal.societe_civile" label="Bien détenu via une société civile (SCI, SCPI...) ?" detailsField="fiscal.societe_civile_details" detailsLabel="Dénomination et forme juridique" />
        </TabsContent>

        {/* --- Équipements --- */}
        <TabsContent value="equipements" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Équipements du bien</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <BoolQ id="equipements.climatisation" label="Climatisation" />
            <BoolQ id="equipements.alarme" label="Alarme / Sécurité" />
            <BoolQ id="equipements.cheminee_insert" label="Cheminée / Insert" />
            <BoolQ id="equipements.detecteur_fumee" label="Détecteur de fumée" />
            <BoolQ id="equipements.piscine_privative" label="Piscine privative" />
            <BoolQ id="equipements.cave" label="Cave" />
            <BoolQ id="equipements.balcon_terrasse" label="Balcon / Terrasse" />
          </div>
          <BoolQ id="equipements.chaudiere_recente" label="Chaudière récente (< 5 ans) ?" />
          {watch('equipements.chaudiere_recente') === true && (
            <Field id="equipements.chaudiere_date" label="Date d'installation" type="date" />
          )}
          <BoolQ id="equipements.parking" label="Place de parking" />
          {watch('equipements.parking') === true && (
            <Field id="equipements.parking_numero" label="Numéro de place" placeholder="B12" />
          )}
        </TabsContent>

        {/* --- Sinistres --- */}
        <TabsContent value="sinistres" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Sinistres</h4>
          <BoolQ id="sinistres.sinistre_indemnise" label="Sinistre indemnisé par une assurance ?" detailsField="sinistres.sinistre_details" detailsLabel="Nature et date du sinistre" />
          <BoolQ id="sinistres.catastrophe_naturelle" label="Catastrophe naturelle déclarée ?" detailsField="sinistres.catastrophe_details" detailsLabel="Nature et date" />
          <BoolQ id="sinistres.degat_des_eaux" label="Dégât des eaux ?" detailsField="sinistres.degat_details" detailsLabel="Nature et état de la réparation" />
        </TabsContent>

        {/* --- Motivation --- */}
        <TabsContent value="motivation" className="space-y-4">
          <h4 className="font-medium text-sm text-secondary-700">Motivation de la vente</h4>
          <FormSelect id="motivation.motif_vente" label="Motif principal de la vente" options={MOTIF_VENTE_OPTIONS} />
          {watch('motivation.motif_vente') === 'autre' && (
            <Field id="motivation.motif_details" label="Précisions" />
          )}
          <Field id="motivation.delai_souhaite" label="Délai de vente souhaité" placeholder="Ex: 3 mois, dès que possible..." />
          <div>
            <Label className="text-sm">Observations générales</Label>
            <Textarea {...register('observations')} placeholder="Toute information complémentaire que vous souhaitez transmettre au notaire..." className="mt-1" rows={4} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button type="submit" size="lg" className="gap-2">
          Enregistrer et continuer
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
}
