/**
 * Mappe les paths techniques de meta.donnees_manquantes (renvoyés par
 * Gemini sous forme `fonds_travaux.solde_quote_part_lot`, `dtg`, etc.)
 * vers des phrases françaises lisibles pour le vendeur.
 *
 * 3 niveaux de résolution :
 *   1. Match exact dans le dictionnaire ci-dessous
 *   2. Préfixe connu (ex: `fonds_travaux.X`, `sommes_dues_cedant.X`) +
 *      humanisation du suffixe
 *   3. Fallback : `snake_case.path` → "Snake case path" (jamais de raw
 *      affiché, même pour un nouveau champ ajouté côté backend)
 */

// ──────────────────────────────────────────────────────────────────────
// 1. Dictionnaire de matchs exacts (path → phrase utilisateur)
// ──────────────────────────────────────────────────────────────────────

const EXACT_MAP = {
  // ---- Types de documents (donnees_manquantes peut juste lister un type) ----
  pv_ag: "Procès-verbaux des assemblées générales",
  reglement_copropriete: "Règlement de copropriété",
  etat_descriptif_division: "État descriptif de division",
  appel_fonds: "Appels de fonds",
  releve_charges: "Relevés de charges",
  annexes_comptables: "Annexes comptables de la copropriété",
  carnet_entretien: "Carnet d'entretien de l'immeuble",
  fiche_synthetique: "Fiche synthétique de la copropriété",
  plan_pluriannuel: "Plan pluriannuel de travaux",
  plan_pluriannuel_travaux: "Plan pluriannuel de travaux",
  taxe_fonciere: "Avis de taxe foncière",
  bail: "Bail ou contrat de location",
  contrat_assurance: "Attestation d'assurance copropriété",

  // ---- Diagnostics ----
  dpe: "Diagnostic de performance énergétique (DPE)",
  diagnostic_amiante: "Diagnostic amiante",
  diagnostic_plomb: "Diagnostic plomb (CREP)",
  diagnostic_termites: "Diagnostic termites",
  diagnostic_electricite: "Diagnostic électricité",
  diagnostic_gaz: "Diagnostic gaz",
  diagnostic_erp: "État des Risques et Pollutions (ERP)",
  diagnostic_mesurage: "Mesurage loi Carrez",
  audit_energetique: "Audit énergétique",
  dtg: "Diagnostic Technique Global (DTG)",

  // Variantes courtes (Gemini renvoie parfois juste "gaz", "plomb", etc.)
  amiante: "Diagnostic amiante",
  plomb: "Diagnostic plomb (CREP)",
  termites: "Diagnostic termites",
  electricite: "Diagnostic électricité",
  gaz: "Diagnostic gaz",
  erp: "État des Risques et Pollutions (ERP)",
  mesurage: "Mesurage loi Carrez",
  carrez: "Mesurage loi Carrez",

  // ---- Tantièmes ----
  tantiemes_generaux_lot: "Tantièmes du lot (parties communes générales)",
  tantiemes_totaux_copro: "Tantièmes totaux de la copropriété",
  tantiemes_speciaux: "Tantièmes spéciaux du lot",

  // ---- Budget & charges ----
  budget_previsionnel_annuel: "Budget prévisionnel annuel de la copropriété",
  charges_courantes_lot_annuel: "Charges courantes annuelles du lot",
  charges_exceptionnelles_lot: "Charges exceptionnelles du lot",
  charges_budget_n1: "Charges du budget — exercice N-1",
  charges_budget_n2: "Charges du budget — exercice N-2",
  charges_hors_budget_n1: "Charges hors budget — exercice N-1",
  charges_hors_budget_n2: "Charges hors budget — exercice N-2",

  // ---- Fonds de travaux (paths complets) ----
  "fonds_travaux.existence": "Existence d'un fonds de travaux",
  "fonds_travaux.solde_quote_part_lot": "Quote-part du fonds de travaux rattachée au lot",
  "fonds_travaux.solde_total_copro": "Solde total du fonds de travaux (copropriété)",
  "fonds_travaux.derniere_cotisation_versee": "Dernière cotisation versée au fonds de travaux",
  "fonds_travaux.cotisation_annuelle_lot": "Cotisation annuelle au fonds de travaux pour le lot",
  "fonds_travaux.taux_pourcentage": "Taux de cotisation au fonds de travaux",

  // ---- Sommes dues par le cédant (paths complets) ----
  "sommes_dues_cedant.provisions_exigibles_budget": "Provisions exigibles du budget prévisionnel",
  "sommes_dues_cedant.provisions_exigibles_hors_budget": "Provisions exigibles hors budget",
  "sommes_dues_cedant.charges_impayees_anterieurs": "Charges impayées des exercices antérieurs",
  "sommes_dues_cedant.sommes_exigibles_du_fait_vente": "Sommes devenues exigibles du fait de la vente",
  "sommes_dues_cedant.avances_reserve_due": "Avance sur réserve due",
  "sommes_dues_cedant.avances_provisions_speciales_due": "Provisions spéciales dues",
  "sommes_dues_cedant.avances_emprunt_due": "Avance sur emprunt due",
  "sommes_dues_cedant.cotisation_fonds_travaux_due": "Cotisation du fonds de travaux impayée",
  "sommes_dues_cedant.pret_quote_part_exigible": "Quote-part de prêt exigible du fait de la vente",
  "sommes_dues_cedant.autres_causes_condamnations": "Autres condamnations ou sommes exigibles",
  "sommes_dues_cedant.emprunt_collectif_capital_du": "Capital restant dû sur emprunt collectif",
  "sommes_dues_cedant.cautionnement_emprunt_montant": "Montant du cautionnement de l'emprunt",
  "sommes_dues_cedant.cautionnement_solidaire_existe": "Existence d'un cautionnement solidaire",

  // ---- Syndicat / impayés globaux ----
  "syndicat.impayes_charges_global_montant": "Impayés globaux de charges (copropriété entière)",
  "syndicat.dette_fournisseurs_global_montant": "Dettes fournisseurs du syndicat",

  // ---- Identification copropriété ----
  "copropriete.nom": "Nom de la copropriété",
  "copropriete.adresse": "Adresse de la copropriété",
  "copropriete.immatriculation_rnc": "Numéro d'immatriculation RNC",
  "copropriete.nombre_lots_copropriete": "Nombre de lots de la copropriété",
  "copropriete.syndic_nom": "Nom du syndic",
  "copropriete.syndic_type": "Type de syndic (professionnel / bénévole)",
  "copropriete.syndic_mandat_fin": "Date de fin du mandat du syndic",
  "copropriete.prochaine_ag_date": "Date de la prochaine assemblée générale",
  "copropriete.date_construction": "Date de construction de l'immeuble",
  "copropriete.fibre_optique": "Présence de la fibre optique",

  // ---- Lot ----
  "lot.numero": "Numéro du lot",
  "lot.type": "Type du lot",
  "lot.etage": "Étage du lot",
  "lot.surface_carrez": "Surface Carrez du lot",

  // ---- Assurance ----
  "assurance.compagnie": "Compagnie d'assurance",
  "assurance.numero_contrat": "Numéro de contrat d'assurance",
  "assurance.date_effet": "Date d'effet du contrat d'assurance",
  "copropriete.assurance.garantie_reconstruction_type":
    "Type de garantie reconstruction de l'assurance immeuble",
  "copropriete.nombre_coproprietaires": "Nombre de copropriétaires",

  // ---- Technique copro ----
  "technique_copro.dtg_existe": "Existence d'un Diagnostic Technique Global",
  "technique_copro.ppt_existe": "Existence d'un Plan Pluriannuel de Travaux",
  "technique_copro.audit_energetique_existe": "Existence d'un audit énergétique",

  // ---- Financier nested ----
  "financier.fonds_travaux.taux_pourcentage": "Taux de cotisation au fonds de travaux",
  "financier.exercice_en_cours.provisions_versees":
    "Provisions versées sur l'exercice en cours",
  "financier.exercice_precedent.provisions_versees":
    "Provisions versées sur l'exercice précédent",

  // ---- Diagnostics dates (paths flat renvoyés par pv-extract-diagnostics) ----
  plomb_date: "Date du diagnostic plomb (CREP)",
  amiante_date: "Date du diagnostic amiante",
  termites_date: "Date du diagnostic termites",
  electricite_date: "Date du diagnostic électricité",
  gaz_date: "Date du diagnostic gaz",
  erp_date: "Date de l'État des Risques et Pollutions",
  dtg_date: "Date du Diagnostic Technique Global",
  dtg_resultat: "Résultat du Diagnostic Technique Global",
  audit_energetique_date: "Date de l'audit énergétique",
  ascenseur_rapport_date: "Date du dernier rapport ascenseur",
  recharge_vehicules: "Équipement de recharge pour véhicules électriques",

  // ---- DPE / extraction technique ----
  dpe_numero_ademe: "Numéro ADEME du DPE",
  dpe_classe_energie: "Classe énergie du DPE",
  dpe_classe_ges: "Classe GES du DPE",
  dpe_date: "Date d'établissement du DPE",
};

// ──────────────────────────────────────────────────────────────────────
// 2. Préfixes connus pour décomposer les paths dotted non listés
// ──────────────────────────────────────────────────────────────────────

const PREFIX_LABELS = {
  fonds_travaux: "Fonds de travaux",
  sommes_dues_cedant: "Sommes dues par le vendeur",
  sommes_acquereur: "Sommes incombant à l'acquéreur",
  syndicat: "Syndicat des copropriétaires",
  copropriete: "Copropriété",
  lot: "Lot vendu",
  assurance: "Assurance copropriété",
  emprunt_syndicat: "Emprunt collectif du syndicat",
  copropriete_difficulte: "Copropriété en difficulté",
  exercice_en_cours: "Exercice en cours",
  exercice_precedent: "Exercice précédent",
  bail: "Bail",
  diagnostics: "Diagnostics",
  financier: "Données financières",
  juridique: "Données juridiques",
  technique_copro: "Données techniques de la copropriété",
  meta: "Métadonnées d'extraction",
};

// ──────────────────────────────────────────────────────────────────────
// 3. Fallback générique : snake_case.path → "Snake case path"
// ──────────────────────────────────────────────────────────────────────

function snakeToHuman(s) {
  if (!s || typeof s !== "string") return "";
  const cleaned = s.replace(/_/g, " ").trim();
  if (!cleaned) return "";
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

// ──────────────────────────────────────────────────────────────────────
// API publique
// ──────────────────────────────────────────────────────────────────────

/**
 * Transforme un identifiant de champ technique en phrase française lisible.
 *
 * @param {string} fieldPath  Path technique (ex: "fonds_travaux.solde_quote_part_lot")
 * @returns {string}          Phrase humaine (ex: "Quote-part du fonds de travaux rattachée au lot")
 */
export function humanizeFieldName(fieldPath) {
  if (!fieldPath || typeof fieldPath !== "string") return "Information manquante";

  const trimmed = fieldPath.trim();

  // (1) Match exact (path complet, peut couvrir 2+ niveaux comme
  //     "copropriete.assurance.garantie_reconstruction_type")
  if (EXACT_MAP[trimmed]) return EXACT_MAP[trimmed];

  // (2) Path dotted : on essaie le match exact en remontant niveau par niveau
  //     pour favoriser un libellé spécifique sur le préfixe générique.
  if (trimmed.includes(".")) {
    const segments = trimmed.split(".");
    // Tente "a.b.c" → "a.b" → "a" pour tomber sur un EXACT_MAP plus précis
    for (let i = segments.length - 1; i > 0; i--) {
      const partialPath = segments.slice(0, i + 1).join(".");
      if (EXACT_MAP[partialPath]) return EXACT_MAP[partialPath];
    }

    // Sinon : préfixe connu + suffixe humanisé segment par segment
    //   "copropriete.assurance.garantie_reconstruction_type"
    //   → "Copropriété — Assurance — Garantie reconstruction type"
    const [prefix, ...rest] = segments;
    const suffixHumanized = rest.map(snakeToHuman).filter(Boolean).join(" — ");
    if (PREFIX_LABELS[prefix]) {
      return `${PREFIX_LABELS[prefix]} — ${suffixHumanized}`;
    }
    // Préfixe inconnu : on humanise tout
    return `${snakeToHuman(prefix)} — ${suffixHumanized}`;
  }

  // (3) Fallback générique
  return snakeToHuman(trimmed);
}

// ──────────────────────────────────────────────────────────────────────
// Filtrage contextuel : enlever les paths qui ne sont pas pertinents
// pour ce dossier précis (déjà saisis, conditionnels non applicables).
// ──────────────────────────────────────────────────────────────────────

/**
 * Champs qu'on considère "facultatifs / bonus" — l'absence ne bloque pas
 * la signature, le notaire ou le vendeur peuvent compléter sans drame.
 * Le panel les présente dans une section repliable.
 */
const OPTIONAL_PATHS = new Set([
  // Fonds de travaux : taux légal par défaut = 5% si PPT voté, 2.5% sinon
  "financier.fonds_travaux.taux_pourcentage",
  // Provisions versées : info comptable, le notaire la récupère du syndic
  "financier.exercice_en_cours.provisions_versees",
  "financier.exercice_precedent.provisions_versees",
  // Assurance : la nature exacte de la garantie reconstruction est rarement
  // dans les docs courants, le notaire la confirme via attestation
  "copropriete.assurance.garantie_reconstruction_type",
  "copropriete.assurance.garantie_reconstruction_capital_limite",
  // Technique copro : informatif, pas bloquant
  "technique_copro.dtg_existe",
  "technique_copro.dtg_date",
  "technique_copro.dtg_resultat",
  "technique_copro.audit_energetique_existe",
  "technique_copro.ppt_existe",
  // Diagnostics individuels : ces dates ne sont nécessaires QUE si le diag
  // est requis (ex: plomb pour avant 1949, gaz pour install > 15 ans).
  // Si on ne sait pas → on présente comme optionnel, pas comme manquant.
  "plomb_date",
  "gaz_date",
  "amiante_date",
  "amiante_dta_date",
  "termites_date",
  "electricite_date",
  "erp_date",
  "dtg_date",
  "dtg_resultat",
  "audit_energetique_date",
  "ascenseur_rapport_date",
  "recharge_vehicules",
  // Sous-blocs syndicat / fonds rares
  "copropriete.copropriete_difficulte.ratio_impayes_montant",
  "copropriete.emprunt_syndicat.capital_restant_du_lots",
]);

/**
 * Filtre les paths déjà connus côté dossier (saisis en step 1, ou
 * extraits dans une autre colonne flat). Le vendeur n'a pas à se voir
 * dire "Surface Carrez manquante" alors qu'il l'a saisie 5 minutes avant.
 *
 * Filtre aussi les champs conditionnels devenus non pertinents (bail.*
 * si le bien n'est pas loué selon le questionnaire).
 *
 * @param {string[]} paths        Liste des paths techniques renvoyés par Gemini
 * @param {object}   dossier      Le dossier complet (flat columns + questionnaire_data)
 * @returns {string[]}            Liste filtrée
 */
export function filterMissingByContext(paths, dossier) {
  if (!Array.isArray(paths) || paths.length === 0) return [];
  if (!dossier) return paths;

  const q = dossier.questionnaire_data || {};
  const occ = q.occupation || {};
  const isRented = occ.occupant_actuel === "locataire" || occ.bail_en_cours === true;

  // Mapping path technique → propriété flat sur le dossier qui, si présente,
  // rend le path "non manquant"
  const REDUNDANT_WHEN_FLAT_PRESENT = {
    "lot.surface_carrez": "property_surface",
    "lot.numero": "property_lot_number",
    "copropriete.adresse": "property_address",
    "copropriete.nom": "copropriete_name",
    "copropriete.syndic_nom": "syndic_name",
  };

  return paths.filter((path) => {
    if (typeof path !== "string") return false;

    // 1. Enlever si déjà saisi en flat
    const flatKey = REDUNDANT_WHEN_FLAT_PRESENT[path];
    if (flatKey && dossier[flatKey] != null && dossier[flatKey] !== "") return false;

    // 2. Enlever bail.* si non loué
    if (path.startsWith("bail.") && !isRented) return false;

    return true;
  });
}

/**
 * Sépare un tableau de paths en 2 buckets : "important" (à collecter pour
 * le notaire) et "optional" (bonus, repliable dans l'UI).
 *
 * @param {string[]} paths  Liste filtrée par filterMissingByContext
 * @returns {{ important: string[], optional: string[] }}
 */
export function splitMissingByImportance(paths) {
  const important = [];
  const optional = [];
  for (const path of paths || []) {
    if (typeof path !== "string") continue;
    if (OPTIONAL_PATHS.has(path)) optional.push(path);
    else important.push(path);
  }
  return { important, optional };
}

/**
 * Variante qui regroupe un tableau de paths par catégorie pour un rendu
 * plus lisible. Retourne un Map<string, string[]> où la clé est la
 * catégorie ("Fonds de travaux", "Diagnostics", etc.) et la valeur la
 * liste de phrases dans cette catégorie.
 */
export function groupMissingFields(fieldPaths) {
  const groups = new Map();

  for (const path of fieldPaths || []) {
    if (typeof path !== "string") continue;

    const phrase = humanizeFieldName(path);
    let category = "Autres données";

    if (path.includes(".")) {
      const prefix = path.split(".")[0];
      if (PREFIX_LABELS[prefix]) {
        category = PREFIX_LABELS[prefix];
      }
    } else if (
      [
        "diagnostic_amiante", "diagnostic_plomb", "diagnostic_termites",
        "diagnostic_electricite", "diagnostic_gaz", "diagnostic_erp",
        "diagnostic_mesurage", "audit_energetique", "dpe", "dtg",
        "amiante", "plomb", "termites", "electricite", "gaz", "erp",
        "mesurage", "carrez",
      ].includes(path)
    ) {
      category = "Diagnostics";
    } else if (
      [
        "pv_ag", "reglement_copropriete", "etat_descriptif_division",
        "appel_fonds", "releve_charges", "annexes_comptables",
        "carnet_entretien", "fiche_synthetique", "plan_pluriannuel",
        "plan_pluriannuel_travaux", "taxe_fonciere", "bail",
        "contrat_assurance",
      ].includes(path)
    ) {
      category = "Documents";
    }

    if (!groups.has(category)) groups.set(category, []);
    groups.get(category).push(phrase);
  }

  return groups;
}
