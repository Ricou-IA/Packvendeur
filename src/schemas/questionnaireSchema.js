import { z } from 'zod';

/**
 * Schema Zod du questionnaire vendeur (basé sur le questionnaire notaire CSN).
 * Stocké dans la colonne JSONB `questionnaire_data` du dossier.
 * Tous les champs sont optionnels — le vendeur remplit ce qu'il peut.
 */

const optionalString = z.string().optional().or(z.literal(''));
const optionalBool = z.boolean().optional();
const optionalDate = z.string().optional().or(z.literal(''));

// --- Section: Bien vendu ---
const bienSchema = z.object({
  lot_number: optionalString,
  adresse: optionalString,
  ville: optionalString,
  code_postal: optionalString,
});

// --- Section: Propriétaire personne physique ---
const personnePhysiqueSchema = z.object({
  type: z.literal('personne_physique').default('personne_physique'),
  quote_part: optionalString,
  civilite: z.enum(['M', 'Mme', '']).optional(),
  nom: optionalString,
  nom_naissance: optionalString,
  prenoms: optionalString,
  date_naissance: optionalDate,
  lieu_naissance: optionalString,
  nationalite: optionalString,
  profession: optionalString,
  situation_matrimoniale: z.enum([
    'celibataire', 'marie', 'pacse', 'divorce', 'veuf', 'separe', ''
  ]).optional(),
  regime_matrimonial: z.enum([
    'communaute_reduite_acquets', 'communaute_universelle', 'separation_biens',
    'participation_acquets', 'communaute_meubles_acquets', 'regime_etranger', ''
  ]).optional(),
  date_mariage: optionalDate,
});

// --- Section: Propriétaire personne morale ---
const personneMoraleSchema = z.object({
  type: z.literal('personne_morale'),
  quote_part: optionalString,
  denomination: optionalString,
  forme_juridique: z.enum(['SCI', 'SAS', 'SARL', 'SA', 'EURL', 'autre', '']).optional(),
  siren: optionalString,
  rcs_ville: optionalString,
  siege_social: optionalString,
  representant_nom: optionalString,
  representant_qualite: optionalString,
});

// Discriminated union: each propriétaire is either PP or PM
const proprietaireSchema = z.discriminatedUnion('type', [
  personnePhysiqueSchema,
  personneMoraleSchema,
]);

// --- Section: Coordonnées ---
const coordonneesSchema = z.object({
  adresse: optionalString,
  code_postal: optionalString,
  ville: optionalString,
  telephone: optionalString,
  email: optionalString,
  resident_fiscal_france: optionalBool,
  pays_residence_fiscale: optionalString,
});

// --- Section: Copropriété questions ---
const coproprieteQuestionsSchema = z.object({
  volume_ou_lotissement: optionalBool,
  association_syndicale: optionalBool,
  association_syndicale_details: optionalString,
  modifications_depuis_achat: optionalBool,
  modifications_details: optionalString,
  autorisations_urbanisme: optionalBool,
  autorisations_details: optionalString,
});

// --- Section: Travaux ---
const travauxQuestionsSchema = z.object({
  travaux_realises: optionalBool,
  travaux_realises_details: optionalString,
  travaux_autorises_ag: optionalBool,
  travaux_conformes: optionalBool,
  travaux_conformes_details: optionalString,
});

// --- Section: Prêts / hypothèques ---
const pretsSchema = z.object({
  saisie_en_cours: optionalBool,
  saisie_details: optionalString,
  pret_hypothecaire: optionalBool,
  pret_hypothecaire_details: optionalString,
  credit_relais: optionalBool,
  credit_relais_details: optionalString,
  pret_a_taux_zero: optionalBool,
});

// --- Section: Plus-values ---
const plusValuesSchema = z.object({
  residence_principale: optionalBool,
  duree_detention: optionalString,
  travaux_deductibles: optionalBool,
  travaux_deductibles_montant: optionalString,
  acquisition_donation_succession: optionalBool,
  acquisition_details: optionalString,
  premiere_cession: optionalBool,
});

// --- Section: Occupation ---
const occupationSchema = z.object({
  occupant_actuel: z.enum(['proprietaire', 'locataire', 'vacant', '']).optional(),
  bail_en_cours: optionalBool,
  bail_type: z.enum(['vide', 'meuble', 'commercial', 'professionnel', '']).optional(),
  bail_date_debut: optionalDate,
  bail_date_fin: optionalDate,
  loyer_mensuel: optionalString,
  depot_garantie: optionalString,
  conge_delivre: optionalBool,
  conge_date: optionalDate,
  libre_a_la_vente: optionalBool,
});

// --- Section: Avantages fiscaux ---
const fiscalSchema = z.object({
  dispositif_fiscal: z.enum([
    'aucun', 'pinel', 'denormandie', 'malraux', 'monuments_historiques',
    'deficit_foncier', 'lmp', 'lmnp', 'censi_bouvard', 'autre', ''
  ]).optional(),
  dispositif_details: optionalString,
  tva_recuperee: optionalBool,
  societe_civile: optionalBool,
  societe_civile_details: optionalString,
});

// --- Section: Équipements ---
const equipementsSchema = z.object({
  climatisation: optionalBool,
  alarme: optionalBool,
  chaudiere_recente: optionalBool,
  chaudiere_date: optionalDate,
  cheminee_insert: optionalBool,
  piscine_privative: optionalBool,
  detecteur_fumee: optionalBool,
  cave: optionalBool,
  parking: optionalBool,
  parking_numero: optionalString,
  balcon_terrasse: optionalBool,
});

// --- Section: Sinistres ---
const sinistresSchema = z.object({
  sinistre_indemnise: optionalBool,
  sinistre_details: optionalString,
  catastrophe_naturelle: optionalBool,
  catastrophe_details: optionalString,
  degat_des_eaux: optionalBool,
  degat_details: optionalString,
});

// --- Section: Motivation ---
const motivationSchema = z.object({
  motif_vente: z.enum([
    'demenagement', 'investissement', 'separation', 'succession',
    'financier', 'taille', 'autre', ''
  ]).optional(),
  motif_details: optionalString,
  delai_souhaite: optionalString,
});

// --- Schema complet ---
export const questionnaireSchema = z.object({
  bien: bienSchema.optional().default({}),
  proprietaires: z.array(proprietaireSchema).optional().default([{ type: 'personne_physique' }]),
  coordonnees: coordonneesSchema.optional().default({}),
  copropriete_questions: coproprieteQuestionsSchema.optional().default({}),
  travaux: travauxQuestionsSchema.optional().default({}),
  prets: pretsSchema.optional().default({}),
  plus_values: plusValuesSchema.optional().default({}),
  occupation: occupationSchema.optional().default({}),
  fiscal: fiscalSchema.optional().default({}),
  equipements: equipementsSchema.optional().default({}),
  sinistres: sinistresSchema.optional().default({}),
  motivation: motivationSchema.optional().default({}),
  observations: optionalString,
});

export const SITUATION_MATRIMONIALE_OPTIONS = [
  { value: 'celibataire', label: 'Célibataire' },
  { value: 'marie', label: 'Marié(e)' },
  { value: 'pacse', label: 'Pacsé(e)' },
  { value: 'divorce', label: 'Divorcé(e)' },
  { value: 'veuf', label: 'Veuf/Veuve' },
  { value: 'separe', label: 'Séparé(e)' },
];

export const REGIME_MATRIMONIAL_OPTIONS = [
  { value: 'communaute_reduite_acquets', label: 'Communauté réduite aux acquêts' },
  { value: 'communaute_universelle', label: 'Communauté universelle' },
  { value: 'separation_biens', label: 'Séparation de biens' },
  { value: 'participation_acquets', label: 'Participation aux acquêts' },
  { value: 'communaute_meubles_acquets', label: 'Communauté de meubles et acquêts' },
  { value: 'regime_etranger', label: 'Régime étranger' },
];

export const FORME_JURIDIQUE_OPTIONS = [
  { value: 'SCI', label: 'SCI (Société civile immobilière)' },
  { value: 'SAS', label: 'SAS' },
  { value: 'SARL', label: 'SARL' },
  { value: 'SA', label: 'SA' },
  { value: 'EURL', label: 'EURL' },
  { value: 'autre', label: 'Autre' },
];

export const DISPOSITIF_FISCAL_OPTIONS = [
  { value: 'aucun', label: 'Aucun' },
  { value: 'pinel', label: 'Pinel' },
  { value: 'denormandie', label: 'Denormandie' },
  { value: 'malraux', label: 'Malraux' },
  { value: 'monuments_historiques', label: 'Monuments historiques' },
  { value: 'deficit_foncier', label: 'Déficit foncier' },
  { value: 'lmp', label: 'LMP (Loueur meublé professionnel)' },
  { value: 'lmnp', label: 'LMNP (Loueur meublé non professionnel)' },
  { value: 'censi_bouvard', label: 'Censi-Bouvard' },
  { value: 'autre', label: 'Autre' },
];

export const MOTIF_VENTE_OPTIONS = [
  { value: 'demenagement', label: 'Déménagement' },
  { value: 'investissement', label: 'Revente investissement' },
  { value: 'separation', label: 'Séparation / Divorce' },
  { value: 'succession', label: 'Succession' },
  { value: 'financier', label: 'Raisons financières' },
  { value: 'taille', label: 'Changement de taille' },
  { value: 'autre', label: 'Autre' },
];
