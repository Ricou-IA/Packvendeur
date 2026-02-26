import { useForm } from 'react-hook-form';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import {
  MapPin, Wrench, Landmark, TrendingUp, Receipt,
  Settings, ShieldAlert, Target, Save,
} from 'lucide-react';
import BooleanQuestion from './BooleanQuestion';
import { DISPOSITIF_FISCAL_OPTIONS, MOTIF_VENTE_OPTIONS } from '@schemas/questionnaireSchema';
import { dossierService } from '@services/dossier.service';
import { toast } from '@components/ui/sonner';

/**
 * Questionnaire complémentaire — affiché en Step 3 pendant l'analyse.
 * Tabs: Coordonnées, Travaux, Prêts, Plus-values, Fiscal, Équipements, Sinistres, Vente.
 * Sauvegarde dans questionnaire_data JSONB (merge avec données existantes).
 */
export default function QuestionnaireComplementary({ dossier }) {
  const existingData = dossier?.questionnaire_data || {};

  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      coordonnees: existingData.coordonnees || {},
      travaux: existingData.travaux || {},
      prets: existingData.prets || {},
      plus_values: existingData.plus_values || {},
      fiscal: existingData.fiscal || {},
      equipements: existingData.equipements || {},
      sinistres: existingData.sinistres || {},
      motivation: existingData.motivation || {},
      observations: existingData.observations || '',
    },
  });

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

  const Field = ({ id, label, type = 'text', placeholder, ...rest }) => (
    <div>
      <Label htmlFor={id} className="text-sm">{label}</Label>
      <Input id={id} type={type} placeholder={placeholder} {...register(id)} className="mt-1" {...rest} />
    </div>
  );

  const BoolQ = (props) => (
    <BooleanQuestion register={register} watch={watch} setValue={setValue} {...props} />
  );

  const onSubmit = async (data) => {
    if (!dossier?.id) return;
    const existing = dossier?.questionnaire_data || {};
    const merged = { ...existing, ...data };
    const { error } = await dossierService.updateDossier(dossier.id, {
      questionnaire_data: merged,
    });
    if (error) {
      toast.error('Erreur lors de la sauvegarde');
    } else {
      toast.success('Questionnaire enregistré');
    }
  };

  const tabs = [
    { id: 'coordonnees', label: 'Contact', Icon: MapPin },
    { id: 'travaux', label: 'Travaux', Icon: Wrench },
    { id: 'prets', label: 'Prêts', Icon: Landmark },
    { id: 'plusvalues', label: 'Plus-values', Icon: TrendingUp },
    { id: 'fiscal', label: 'Fiscal', Icon: Receipt },
    { id: 'equipements', label: 'Équipements', Icon: Settings },
    { id: 'sinistres', label: 'Sinistres', Icon: ShieldAlert },
    { id: 'motivation', label: 'Vente', Icon: Target },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Tabs defaultValue="coordonnees" className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
          {tabs.map(({ id, label, Icon }) => (
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
          <BoolQ id="coordonnees.resident_fiscal_france" label="Résident fiscal en France ?" />
          {watch('coordonnees.resident_fiscal_france') === false && (
            <Field id="coordonnees.pays_residence_fiscale" label="Pays de résidence fiscale" />
          )}
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
        <Button type="submit" variant="outline" size="sm" className="gap-2">
          <Save className="h-4 w-4" />
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
