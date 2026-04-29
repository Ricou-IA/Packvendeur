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

  // (1) Match exact
  if (EXACT_MAP[trimmed]) return EXACT_MAP[trimmed];

  // (2) Path dotted avec préfixe connu
  if (trimmed.includes(".")) {
    const [prefix, ...rest] = trimmed.split(".");
    const suffix = rest.join(".");
    if (PREFIX_LABELS[prefix]) {
      return `${PREFIX_LABELS[prefix]} — ${snakeToHuman(suffix)}`;
    }
    // Préfixe inconnu : on humanise tout
    return `${snakeToHuman(prefix)} — ${snakeToHuman(suffix)}`;
  }

  // (3) Fallback générique
  return snakeToHuman(trimmed);
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
