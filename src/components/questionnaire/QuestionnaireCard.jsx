import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Badge } from '@components/ui/badge';
import {
  ChevronDown, ChevronUp, User, Users, MapPin, Home,
  Building2, Wrench, Landmark, TrendingUp, Receipt,
  Settings, ShieldAlert, Target, FileText,
} from 'lucide-react';
import BooleanQuestion from './BooleanQuestion';
import {
  SITUATION_MATRIMONIALE_OPTIONS,
  DISPOSITIF_FISCAL_OPTIONS,
  MOTIF_VENTE_OPTIONS,
} from '@schemas/questionnaireSchema';

const ICONS = {
  User, Users, MapPin, Home, Building2, Wrench,
  Landmark, TrendingUp, Receipt, Settings, ShieldAlert, Target,
};

/**
 * Formulaire questionnaire vendeur complet, integre dans la ValidationForm.
 * Utilise les register/watch/setValue du parent useForm.
 * Prefix = "questionnaire." pour toutes les cles.
 */
export default function QuestionnaireCard({ register, watch, setValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const p = 'questionnaire.'; // prefix for all field paths

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

  // Shorthand for BooleanQuestion with prefix
  const BoolQ = (props) => (
    <BooleanQuestion
      register={register}
      watch={watch}
      setValue={setValue}
      {...props}
    />
  );

  // --- Vendeur sub-form ---
  const VendeurFields = ({ prefix, title }) => (
    <div className="space-y-4">
      <h4 className="font-medium text-sm text-secondary-700">{title}</h4>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field id={`${prefix}.regime_matrimonial`} label="Régime matrimonial" placeholder="Communauté réduite aux acquêts" />
        <Field id={`${prefix}.date_mariage`} label="Date de mariage/PACS" type="date" />
      </div>
    </div>
  );

  return (
    <Card className="border-secondary-200">
      <CardHeader
        className="cursor-pointer select-none hover:bg-secondary-50 transition-colors rounded-t-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <CardTitle className="text-base flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-600" />
            Questionnaire vendeur
            <Badge variant="outline" className="text-xs font-normal">Facultatif</Badge>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </CardTitle>
        {!isOpen && (
          <p className="text-xs text-secondary-400 mt-1">
            Informations complémentaires pour le notaire (identité, prêts, plus-values, équipements...)
          </p>
        )}
      </CardHeader>

      {isOpen && (
        <CardContent>
          <Tabs defaultValue="vendeur1" className="w-full">
            <TabsList className="w-full flex flex-wrap h-auto gap-1 bg-transparent p-0 mb-4">
              {[
                { id: 'vendeur1', label: 'Vendeur 1', Icon: User },
                { id: 'vendeur2', label: 'Vendeur 2', Icon: Users },
                { id: 'coordonnees', label: 'Contact', Icon: MapPin },
                { id: 'occupation', label: 'Occupation', Icon: Home },
                { id: 'copropriete', label: 'Copro', Icon: Building2 },
                { id: 'travaux', label: 'Travaux', Icon: Wrench },
                { id: 'prets', label: 'Prêts', Icon: Landmark },
                { id: 'plusvalues', label: 'Plus-values', Icon: TrendingUp },
                { id: 'fiscal', label: 'Fiscal', Icon: Receipt },
                { id: 'equipements', label: 'Equip.', Icon: Settings },
                { id: 'sinistres', label: 'Sinistres', Icon: ShieldAlert },
                { id: 'motivation', label: 'Vente', Icon: Target },
              ].map(({ id, label, Icon }) => (
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

            {/* --- Vendeur 1 --- */}
            <TabsContent value="vendeur1">
              <VendeurFields prefix={`${p}vendeur1`} title="Identité du vendeur 1" />
            </TabsContent>

            {/* --- Vendeur 2 --- */}
            <TabsContent value="vendeur2">
              <VendeurFields prefix={`${p}vendeur2`} title="Identité du vendeur 2 (co-vendeur)" />
              <p className="text-xs text-secondary-400 mt-3">
                À remplir uniquement si le bien est en indivision ou en copropriété entre conjoints/partenaires.
              </p>
            </TabsContent>

            {/* --- Coordonnees --- */}
            <TabsContent value="coordonnees" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Coordonnées du vendeur</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <Field id={`${p}coordonnees.adresse`} label="Adresse actuelle" placeholder="12 rue de la Paix" />
                </div>
                <Field id={`${p}coordonnees.code_postal`} label="Code postal" placeholder="75001" />
                <Field id={`${p}coordonnees.ville`} label="Ville" placeholder="Paris" />
                <Field id={`${p}coordonnees.telephone`} label="Téléphone" placeholder="06 12 34 56 78" />
                <Field id={`${p}coordonnees.email`} label="Email" placeholder="jean@example.com" />
              </div>
              <BoolQ
                id={`${p}coordonnees.resident_fiscal_france`}
                label="Résident fiscal en France ?"
              />
              {watch(`${p}coordonnees.resident_fiscal_france`) === false && (
                <Field id={`${p}coordonnees.pays_residence_fiscale`} label="Pays de résidence fiscale" />
              )}
            </TabsContent>

            {/* --- Occupation --- */}
            <TabsContent value="occupation" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Occupation du bien</h4>
              <FormSelect
                id={`${p}occupation.occupant_actuel`}
                label="Occupation actuelle"
                options={[
                  { value: 'proprietaire', label: 'Occupé par le propriétaire' },
                  { value: 'locataire', label: 'Occupé par un locataire' },
                  { value: 'vacant', label: 'Vacant' },
                ]}
              />
              <BoolQ id={`${p}occupation.bail_en_cours`} label="Bail en cours ?" />
              {watch(`${p}occupation.bail_en_cours`) === true && (
                <div className="ml-4 pl-4 border-l-2 border-primary-200 space-y-3">
                  <FormSelect
                    id={`${p}occupation.bail_type`}
                    label="Type de bail"
                    options={[
                      { value: 'vide', label: 'Location vide' },
                      { value: 'meuble', label: 'Location meublée' },
                      { value: 'commercial', label: 'Commercial' },
                      { value: 'professionnel', label: 'Professionnel' },
                    ]}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Field id={`${p}occupation.bail_date_debut`} label="Date début bail" type="date" />
                    <Field id={`${p}occupation.bail_date_fin`} label="Date fin bail" type="date" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Field id={`${p}occupation.loyer_mensuel`} label="Loyer mensuel (EUR)" placeholder="850" />
                    <Field id={`${p}occupation.depot_garantie`} label="Dépôt de garantie (EUR)" placeholder="850" />
                  </div>
                  <BoolQ id={`${p}occupation.conge_delivre`} label="Congé délivré au locataire ?" />
                  {watch(`${p}occupation.conge_delivre`) === true && (
                    <Field id={`${p}occupation.conge_date`} label="Date du congé" type="date" />
                  )}
                </div>
              )}
              <BoolQ id={`${p}occupation.libre_a_la_vente`} label="Le bien sera libre à la vente ?" />
            </TabsContent>

            {/* --- Copropriete questions --- */}
            <TabsContent value="copropriete" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Questions copropriété</h4>
              <BoolQ
                id={`${p}copropriete_questions.volume_ou_lotissement`}
                label="Le bien fait-il partie d'un volume ou lotissement ?"
              />
              <BoolQ
                id={`${p}copropriete_questions.association_syndicale`}
                label="Existence d'une ASL / AFUL ?"
                hint="Association syndicale libre ou association foncière urbaine libre"
                detailsField={`${p}copropriete_questions.association_syndicale_details`}
                detailsLabel="Précisions sur l'ASL/AFUL"
              />
              <BoolQ
                id={`${p}copropriete_questions.modifications_depuis_achat`}
                label="Modifications depuis l'achat ?"
                hint="Changement de destination, division, annexion de parties communes..."
                detailsField={`${p}copropriete_questions.modifications_details`}
              />
              <BoolQ
                id={`${p}copropriete_questions.autorisations_urbanisme`}
                label="Autorisations d'urbanisme obtenues ?"
                hint="Permis de construire, déclaration préalable..."
                detailsField={`${p}copropriete_questions.autorisations_details`}
              />
            </TabsContent>

            {/* --- Travaux --- */}
            <TabsContent value="travaux" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Travaux réalisés</h4>
              <BoolQ
                id={`${p}travaux.travaux_realises`}
                label="Travaux réalisés dans le lot ?"
                hint="Depuis votre acquisition"
                detailsField={`${p}travaux.travaux_realises_details`}
                detailsLabel="Description des travaux"
                detailsPlaceholder="Nature, date, montant approximatif..."
              />
              <BoolQ
                id={`${p}travaux.travaux_autorises_ag`}
                label="Travaux autorisés par l'AG ?"
                hint="Si travaux affectant les parties communes"
              />
              <BoolQ
                id={`${p}travaux.travaux_conformes`}
                label="Travaux conformes aux autorisations ?"
                detailsField={`${p}travaux.travaux_conformes_details`}
                detailsLabel="Précisions sur la non-conformité"
              />
            </TabsContent>

            {/* --- Prets --- */}
            <TabsContent value="prets" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Prêts et hypothèques</h4>
              <BoolQ
                id={`${p}prets.saisie_en_cours`}
                label="Saisie immobilière en cours ?"
                detailsField={`${p}prets.saisie_details`}
              />
              <BoolQ
                id={`${p}prets.pret_hypothecaire`}
                label="Prêt(s) garanti(s) par une hypothèque ?"
                detailsField={`${p}prets.pret_hypothecaire_details`}
                detailsLabel="Organisme prêteur, solde restant dû"
              />
              <BoolQ
                id={`${p}prets.credit_relais`}
                label="Crédit-relais en cours ?"
                detailsField={`${p}prets.credit_relais_details`}
              />
              <BoolQ
                id={`${p}prets.pret_a_taux_zero`}
                label="Prêt à taux zéro (PTZ) ?"
                hint="Obligation de remboursement anticipé en cas de revente"
              />
            </TabsContent>

            {/* --- Plus-values --- */}
            <TabsContent value="plusvalues" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Plus-values immobilières</h4>
              <BoolQ
                id={`${p}plus_values.residence_principale`}
                label="Ce bien est votre résidence principale ?"
                hint="Exonération de plus-value si résidence principale"
              />
              <Field
                id={`${p}plus_values.duree_detention`}
                label="Durée de détention"
                placeholder="Ex: 8 ans"
              />
              <BoolQ
                id={`${p}plus_values.travaux_deductibles`}
                label="Travaux déductibles de la plus-value ?"
                hint="Travaux facturés, non pris en compte pour l'impôt"
              />
              {watch(`${p}plus_values.travaux_deductibles`) === true && (
                <Field
                  id={`${p}plus_values.travaux_deductibles_montant`}
                  label="Montant des travaux déductibles"
                  placeholder="15 000 EUR"
                />
              )}
              <BoolQ
                id={`${p}plus_values.acquisition_donation_succession`}
                label="Acquisition par donation ou succession ?"
                detailsField={`${p}plus_values.acquisition_details`}
                detailsLabel="Date et nature (donation, succession)"
              />
              <BoolQ
                id={`${p}plus_values.premiere_cession`}
                label="Première cession d'un bien autre que la résidence principale ?"
                hint="Exonération sous conditions (remploi pour achat RP)"
              />
            </TabsContent>

            {/* --- Fiscal --- */}
            <TabsContent value="fiscal" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Situation fiscale</h4>
              <FormSelect
                id={`${p}fiscal.dispositif_fiscal`}
                label="Dispositif fiscal en cours"
                options={DISPOSITIF_FISCAL_OPTIONS}
                placeholder="Aucun dispositif"
              />
              {watch(`${p}fiscal.dispositif_fiscal`) && watch(`${p}fiscal.dispositif_fiscal`) !== 'aucun' && (
                <Field
                  id={`${p}fiscal.dispositif_details`}
                  label="Détails du dispositif"
                  placeholder="Date de début, durée d'engagement..."
                />
              )}
              <BoolQ
                id={`${p}fiscal.tva_recuperee`}
                label="TVA récupérée lors de l'acquisition ?"
                hint="Si achat en VEFA avec TVA récupérable"
              />
              <BoolQ
                id={`${p}fiscal.societe_civile`}
                label="Bien détenu via une société civile (SCI, SCPI...) ?"
                detailsField={`${p}fiscal.societe_civile_details`}
                detailsLabel="Dénomination et forme juridique"
              />
            </TabsContent>

            {/* --- Equipements --- */}
            <TabsContent value="equipements" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Équipements du bien</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <BoolQ id={`${p}equipements.climatisation`} label="Climatisation" />
                <BoolQ id={`${p}equipements.alarme`} label="Alarme / Sécurité" />
                <BoolQ id={`${p}equipements.cheminee_insert`} label="Cheminée / Insert" />
                <BoolQ id={`${p}equipements.detecteur_fumee`} label="Détecteur de fumée" />
                <BoolQ id={`${p}equipements.piscine_privative`} label="Piscine privative" />
                <BoolQ id={`${p}equipements.cave`} label="Cave" />
                <BoolQ id={`${p}equipements.balcon_terrasse`} label="Balcon / Terrasse" />
              </div>
              <BoolQ id={`${p}equipements.chaudiere_recente`} label="Chaudière récente (< 5 ans) ?" />
              {watch(`${p}equipements.chaudiere_recente`) === true && (
                <Field id={`${p}equipements.chaudiere_date`} label="Date d'installation" type="date" />
              )}
              <BoolQ id={`${p}equipements.parking`} label="Place de parking" />
              {watch(`${p}equipements.parking`) === true && (
                <Field id={`${p}equipements.parking_numero`} label="Numéro de place" placeholder="B12" />
              )}
            </TabsContent>

            {/* --- Sinistres --- */}
            <TabsContent value="sinistres" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Sinistres</h4>
              <BoolQ
                id={`${p}sinistres.sinistre_indemnise`}
                label="Sinistre indemnisé par une assurance ?"
                detailsField={`${p}sinistres.sinistre_details`}
                detailsLabel="Nature et date du sinistre"
              />
              <BoolQ
                id={`${p}sinistres.catastrophe_naturelle`}
                label="Catastrophe naturelle déclarée ?"
                detailsField={`${p}sinistres.catastrophe_details`}
                detailsLabel="Nature et date"
              />
              <BoolQ
                id={`${p}sinistres.degat_des_eaux`}
                label="Dégât des eaux ?"
                detailsField={`${p}sinistres.degat_details`}
                detailsLabel="Nature et état de la réparation"
              />
            </TabsContent>

            {/* --- Motivation --- */}
            <TabsContent value="motivation" className="space-y-4">
              <h4 className="font-medium text-sm text-secondary-700">Motivation de la vente</h4>
              <FormSelect
                id={`${p}motivation.motif_vente`}
                label="Motif principal de la vente"
                options={MOTIF_VENTE_OPTIONS}
              />
              {watch(`${p}motivation.motif_vente`) === 'autre' && (
                <Field id={`${p}motivation.motif_details`} label="Précisions" />
              )}
              <Field
                id={`${p}motivation.delai_souhaite`}
                label="Délai de vente souhaité"
                placeholder="Ex: 3 mois, dès que possible..."
              />
              <div>
                <Label className="text-sm">Observations générales</Label>
                <Textarea
                  {...register(`${p}observations`)}
                  placeholder="Toute information complémentaire que vous souhaitez transmettre au notaire..."
                  className="mt-1"
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      )}
    </Card>
  );
}
