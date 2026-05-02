import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { callGemini } from "../_shared/gemini.ts";
import { getSupabase, logAiCall } from "../_shared/logging.ts";
import { verifyDossierAccess } from "../_shared/auth.ts";

// ╔═══════════════════════════════════════════════════════════════════╗
// ║  PRE-ETAT-DATE.AI — Extraction CSN v3 (checklist par champ)       ║
// ║  Conforme à la trame CSN officielle (Loi ALUR, art. L.721-2 CCH)  ║
// ╠═══════════════════════════════════════════════════════════════════╣
// ║  Approche : pour chaque champ du PED CSN, l'IA cherche dans       ║
// ║  l'ensemble des documents fournis et déduit si nécessaire.        ║
// ║  Pas d'orientation par "annexe X" ou "source canonique" — juste   ║
// ║  les champs à remplir avec leur définition, et la liberté         ║
// ║  d'analyse pour les valeurs non explicites.                       ║
// ╚═══════════════════════════════════════════════════════════════════╝

// ─── Prompt sections ──────────────────────────────────────────────

const PROMPT_ROLE = `Tu remplis un PRÉ-ÉTAT DATÉ conforme au modèle CSN officiel
(Conseil Supérieur du Notariat) prévu par la loi ALUR (article L.721-2 CCH).

Le pré-état daté est destiné au notaire chargé de la vente d'un lot de copropriété.
Sa rigueur conditionne la validité de l'avant-contrat : tout chiffre erroné ou
inventé peut entraîner la nullité de l'acte.

═══════════════════════════════════════════════════════════════════════
PRINCIPE DE TRAVAIL
═══════════════════════════════════════════════════════════════════════

Pour CHAQUE champ ci-dessous :

1. CHERCHE dans l'INTÉGRALITÉ des documents fournis. La même valeur peut
   apparaître dans plusieurs documents — préfère la plus récente, la plus
   précise, ou celle issue d'un document approuvé en AG.

2. Si la valeur n'est pas écrite explicitement mais peut être DÉDUITE des
   éléments disponibles (somme, calcul, recoupement, cumul historique),
   CALCULE-la et indique ton mode de calcul dans le champ _source associé.
   Exemples de déductions valides :
   - somme des appels de fonds trimestriels du lot pour l'exercice
   - cumul des cotisations fonds travaux versées par le lot depuis l'origine
   - estimation par tantièmes × budget si aucune ventilation n'est fournie
   - ratio impayés/budget pour le critère copropriété en difficulté
   Indique TOUJOURS dans _source quel calcul a été fait.

3. Si la valeur est INTROUVABLE et INDÉDUCTIBLE avec les documents fournis,
   mets null et ajoute le champ dans meta.donnees_manquantes.

═══════════════════════════════════════════════════════════════════════
SAC DE DOCUMENTS REÇUS (variable selon le dossier)
═══════════════════════════════════════════════════════════════════════

Le vendeur dépose les documents qu'il a — typiquement :
- PV des assemblées générales (jusqu'à 3 derniers exercices)
- Relevés de charges / appels de fonds (jusqu'à 3 derniers)
- Comptes annuels / annexes comptables (jusqu'à 2 derniers exercices)
- DPE individuel
- Souvent aussi : règlement de copropriété, état descriptif de division,
  fiche synthétique, carnet d'entretien, diagnostics individuels, bail,
  contrat d'assurance.

Tu n'as JAMAIS la garantie qu'un document précis sera présent. Adapte-toi
à ce qui est fourni. Si une info "naturelle" manque, cherche-la ailleurs.
Si elle nécessite un calcul, fais-le.

═══════════════════════════════════════════════════════════════════════
RÈGLES DE QUALITÉ
═══════════════════════════════════════════════════════════════════════

• MULTI-LOTS — Si la vente porte sur plusieurs lots (ex: 49/55/59 :
  appartement + cave + parking), additionne les tantièmes ET additionne
  les charges pour obtenir les valeurs du "lot vendu" au sens CSN.
  Le périmètre du PED = l'ensemble des lots cédés.

• TANTIÈMES — Une copro a souvent plusieurs clés de répartition
  (générales, ascenseur, chauffage, bâtiment X). Pour les tantièmes
  généraux, prends la clé "parties communes générales" ou "charges
  générales", PAS les clés spéciales.

• DETTES vs FACTURATION — Une dette du cédant se prouve par : solde
  débiteur, mise en demeure, rappel, présence dans une liste de
  débiteurs, ou solde explicite > 0 dans un relevé de compte récent.
  Un appel de fonds (ce qui est facturé pour la prochaine échéance)
  n'est PAS une dette s'il est payé dans les délais — il devient une
  dette uniquement s'il est constaté impayé.

• N-1 vs N-2 — N-1 = dernier exercice CLOS ET APPROUVÉ en AG à la
  date du PED (DATE_REFERENCE injectée plus bas). Si l'AG d'approbation
  des comptes N-1 attendus n'a pas eu lieu, l'exercice N-1 est en
  réalité N-2 (et N-2 devient N-3). Indique le décalage dans
  meta.alertes.

• PRÉSOMPTION NÉGATIVE — Pour les booléens "rares" (mesures
  administratives, copropriété en difficulté, risques sanitaires,
  procédures en cours) : réponds false par défaut. Réponds true
  UNIQUEMENT sur preuve textuelle explicite dans les documents.

• NIVEAUX D'AGRÉGATION — distingue strictement :
  - lot       = données du/des lot(s) vendu(s) (quote-part, tantièmes)
  - copro     = données de l'ensemble de la copropriété (budget total)
  - syndicat  = agrégats au sens art. L.721-2 2°c (impayés tous coproprio)

• _SOURCE — Pour CHAQUE valeur que tu écris, remplis le champ _source
  associé au format :
  "<NomDocument>, p<page>: <citation brève>"
  ou pour un calcul :
  "<NomDocument> + <description du calcul>"
`;

const PROMPT_CHAMPS_COPRO = `
═══════════════════════════════════════════════════════════════════════
CHAMPS À REMPLIR — IDENTITÉ ET ORGANISATION DE LA COPROPRIÉTÉ
═══════════════════════════════════════════════════════════════════════

[copropriete.nom]
  Nom officiel de la copropriété (libellé exact, ex: "LES CAPITOULS").

[copropriete.adresse]
  Adresse postale complète de l'immeuble.

[copropriete.immatriculation_rnc]
  Numéro d'immatriculation au Registre National des Copropriétés.
  Format typique : AC1-XXX-XXX.

[copropriete.nombre_lots_copropriete]
  Nombre TOTAL de lots de la copropriété (principaux + accessoires).

[copropriete.nombre_coproprietaires]
  Nombre de copropriétaires distincts.

[copropriete.nombre_batiments]
  Nombre de bâtiments de la copropriété.

[copropriete.date_construction]
  Date ou année de construction de l'immeuble. Format YYYY ou YYYY-MM-DD.

[copropriete.date_reglement]
  Date du règlement de copropriété d'origine (acte notarié initial).

[copropriete.tantiemes_totaux]
  Total des tantièmes de parties communes générales (typique : 1000,
  10000 ou 100000). Pas les tantièmes spéciaux.

═══════════════════════════════════════════════════════════════════════
CHAMPS — SYNDIC (sous-bloc copropriete)
═══════════════════════════════════════════════════════════════════════

[copropriete.syndic_nom]
  Nom du syndic en exercice (ex: "L3D IMMO", "FONCIA TOULOUSE").

[copropriete.syndic_adresse]
  Adresse postale du cabinet syndic.

[copropriete.syndic_type]
  "professionnel" ou "benevole".

[copropriete.syndic_date_designation]
  Date de la dernière désignation/élection du syndic en AG (YYYY-MM-DD).

[copropriete.syndic_mandat_fin]
  Date de fin du mandat en cours (YYYY-MM-DD).

[copropriete.syndicat_unique]
  La copropriété constitue-t-elle un syndicat unique ? (true/false)

[copropriete.syndicat_principal_coordonnees]
  Si syndicat_unique=false, coordonnées du syndicat principal/secondaire
  dont dépend le lot vendu (texte libre).

[copropriete.prochaine_ag_date]
  Date ou période de la prochaine AG (YYYY-MM-DD).

[copropriete.modificatif_rc_non_publie]
  Le syndic a-t-il connaissance d'un modificatif du règlement de
  copropriété voté en AG mais non encore publié ? (true/false)

═══════════════════════════════════════════════════════════════════════
CHAMPS — ASSURANCE (sous-bloc copropriete.assurance)
═══════════════════════════════════════════════════════════════════════

[copropriete.assurance.multirisque_existe]
  Une police multirisques immeuble existe-t-elle ?

[copropriete.assurance.couverture_rc]
[copropriete.assurance.couverture_incendie]
[copropriete.assurance.couverture_degats_eaux]
  Garanties incluses (true/false).

[copropriete.assurance.garantie_reconstruction_type]
  "valeur_neuf" | "capital_limite" | null.

[copropriete.assurance.garantie_reconstruction_capital_limite]
  Si garantie_reconstruction_type="capital_limite", le montant en EUR.

[copropriete.assurance.autres_risques]
  Autres risques garantis (texte libre).

[copropriete.assurance.police_numero]
  N° de police d'assurance.

[copropriete.assurance.police_date]
  Date de prise d'effet de la police (YYYY-MM-DD).

[copropriete.assurance.compagnie_nom]
[copropriete.assurance.compagnie_adresse]
  Nom et adresse de la compagnie d'assurance.

[copropriete.assurance.courtier_nom]
[copropriete.assurance.courtier_adresse]
  Nom et adresse du courtier ou de l'agent.

[copropriete.assurance.do_origine]
  Une assurance Dommages-Ouvrages au titre de la construction d'origine
  est-elle en cours ? (true/false)

[copropriete.assurance.do_syndicat_travaux]
  Le syndicat a-t-il souscrit une DO au titre de travaux ? (true/false)

═══════════════════════════════════════════════════════════════════════
CHAMPS — STRUCTURES JURIDIQUES ANNEXES
═══════════════════════════════════════════════════════════════════════

[copropriete.association_syndicale.existe]
  L'immeuble est-il dans le périmètre d'une ASL/AFUL/Union de Syndicats ?

[copropriete.association_syndicale.nom]
[copropriete.association_syndicale.siege]
[copropriete.association_syndicale.representant]
  Si existe=true, identité de l'organisme.

[copropriete.patrimoine_syndicat.existe]
  Le syndicat possède-t-il un patrimoine immobilier (lot de copropriété,
  local commun) ?

[copropriete.patrimoine_syndicat.description]
  Si existe=true, en quoi consiste-t-il ?

[copropriete.contrats_revenus.existe]
  Le syndicat est-il lié par des contrats générateurs de revenus
  (affichage, antennes relais, location de parties communes) ?

[copropriete.contrats_revenus.description]
  Si existe=true, en quoi consistent-ils ?

[copropriete.emprunt_syndicat.existe]
  Existe-t-il un emprunt du syndicat (pour son compte ou pour des
  copropriétaires) ?

[copropriete.emprunt_syndicat.objet]
[copropriete.emprunt_syndicat.organisme]
[copropriete.emprunt_syndicat.reference]
[copropriete.emprunt_syndicat.capital_restant_du_lots]
[copropriete.emprunt_syndicat.organisme_caution]
[copropriete.emprunt_syndicat.mutation_declenche_exigibilite]
  Si existe=true, détails de l'emprunt. capital_restant_du_lots = part
  restant due imputable au(x) lot(s) vendu(s) ; mutation_declenche_exigibilite
  = la mutation rend-elle la somme exigible (true/false).

═══════════════════════════════════════════════════════════════════════
CHAMPS — COPROPRIÉTÉ EN DIFFICULTÉ (présomption négative)
═══════════════════════════════════════════════════════════════════════

[copropriete.copropriete_difficulte.mandataire_ad_hoc]
  Un mandataire ad hoc a-t-il été désigné en application des art. 29-1A
  et 29-1B de la loi de 1965 ?

[copropriete.copropriete_difficulte.administration_provisoire]
  Le syndicat est-il sous administration provisoire (art. 29-1+) ?

[copropriete.copropriete_difficulte.etat_carence]
  Existe-t-il un état de carence (art. L.615-6 CCH) ?

[copropriete.copropriete_difficulte.ratio_impayes_excede]
  Le ratio impayés/budget excède-t-il :
  - 15% si la copro a > 200 lots
  - 25% si la copro a < 200 lots
  Calcule-le toi-même à partir de financier.syndicat.impayes_charges_global_montant
  et de financier.budget_previsionnel_annuel.

[copropriete.copropriete_difficulte.ratio_impayes_montant]
  Si ratio_impayes_excede=true, montant exact des impayés.

═══════════════════════════════════════════════════════════════════════
CHAMPS — STATIONNEMENT, FIBRE
═══════════════════════════════════════════════════════════════════════

[copropriete.droit_priorite_stationnement.vote_en_ag]
  Un droit de priorité (art. 8-1 loi 1965) sur les lots de stationnement
  a-t-il été voté en AG ?

[copropriete.droit_priorite_stationnement.clause_au_reglement]
  Le règlement de copropriété contient-il une clause spécifique ?

[copropriete.fibre_optique]
  La fibre optique est-elle implantée dans les parties communes ?
  (true/false/null si non mentionné)
`;

const PROMPT_CHAMPS_LOT = `
═══════════════════════════════════════════════════════════════════════
CHAMPS À REMPLIR — LOT(S) VENDU(S)
═══════════════════════════════════════════════════════════════════════

⚠️ Si la vente porte sur PLUSIEURS lots (ex: appartement + cave + parking),
considère le périmètre comme étant l'ENSEMBLE des lots :
- type = description groupée (ex: "appartement + cave + parking")
- tantiemes_generaux = SOMME des tantièmes généraux de tous les lots
- surface_carrez = SOMME des surfaces (en pratique seul l'appart compte)

[lot.numero]
  Numéro(s) du/des lot(s). Si plusieurs : "49/55/59" ou liste équivalente.

[lot.type]
  Nature du/des lot(s) : "appartement", "appartement + cave + parking",
  "studio", "local commercial", etc.

[lot.etage]
  Étage du lot principal (ex: "RDC", "1er", "2ème", "5ème + dernier").

[lot.surface_carrez]
  Surface Carrez en m² (somme si plusieurs lots habitables).

[lot.tantiemes_generaux]
  Tantièmes de PARTIES COMMUNES GÉNÉRALES — somme sur tous les lots cédés.

[lot.tantiemes_speciaux]
  Tantièmes spéciaux (ascenseur, bâtiment X) si applicables — texte libre
  ou somme.
`;

const PROMPT_CHAMPS_HISTORIQUE = `
═══════════════════════════════════════════════════════════════════════
CHAMPS — HISTORIQUE DES CHARGES (Section I - tableau quote-part)
═══════════════════════════════════════════════════════════════════════

Tableau CSN : 4 colonnes × 2 exercices (N-1, N-2). Périmètre = SOMME des
charges du/des lot(s) vendu(s).

Pour CHAQUE exercice (N-1 puis N-2) tu remplis :

[financier.historique_charges[i].exercice_label]
  "N-1" ou "N-2".

[financier.historique_charges[i].exercice_periode]
  Période de l'exercice (ex: "01/01/2024 - 31/12/2024").

[financier.historique_charges[i].budget_appelee]
  Quote-part du/des lot(s) APPELÉE au titre du BUDGET PRÉVISIONNEL
  pour cet exercice. Somme des appels de fonds budget du lot.

[financier.historique_charges[i].budget_reelle]
  Quote-part du/des lot(s) RÉELLEMENT répartie après approbation des
  comptes (régularisation). Visible dans les comptes annuels approuvés.

[financier.historique_charges[i].hors_budget_appelee]
  Quote-part du/des lot(s) APPELÉE au titre des dépenses HORS BUDGET
  (travaux, charges exceptionnelles).

[financier.historique_charges[i].hors_budget_reelle]
  Quote-part du/des lot(s) RÉELLEMENT répartie au titre du hors budget
  après approbation.

[financier.historique_charges[i].source]
  Source (document + page + calcul).

⚠️ Si N-1 attendu n'a pas été approuvé en AG : alerte explicite dans
meta.alertes "Comptes N-1 (année YYYY) non approuvés ou non fournis —
historique décalé sur N-2/N-3."
`;

const PROMPT_CHAMPS_FINANCIER_BASE = `
═══════════════════════════════════════════════════════════════════════
CHAMPS — DONNÉES FINANCIÈRES DE BASE
═══════════════════════════════════════════════════════════════════════

[financier.budget_previsionnel_annuel]
  Budget prévisionnel annuel TOTAL de la copropriété (niveau COPRO)
  voté pour l'exercice EN COURS à la date du PED.

[financier.budget_previsionnel_annuel_source]
  Source.

[financier.budget_previsionnel_exercice]
  Période de l'exercice du budget (ex: "2026" ou "01/01/2026 - 31/12/2026").

[financier.charges_courantes_lot_annuel]
  Charges courantes ANNUELLES du/des lot(s) vendu(s) (niveau LOT, somme
  multi-lots). Lecture directe préférée : somme des appels de fonds
  budget pour l'exercice en cours. Si non disponible, calcul théorique
  (tantieme_lot/tantiemes_totaux × budget) en mentionnant l'estimation.

[financier.charges_courantes_lot_annuel_source]
  Source ou mode de calcul.

[financier.charges_exceptionnelles_lot]
  Charges hors budget (travaux, charges exceptionnelles) restantes pour
  le/les lot(s) vendu(s).

[financier.charges_exceptionnelles_lot_source]
  Source.

[financier.exercice_en_cours.debut]
[financier.exercice_en_cours.fin]
  Dates de début / fin de l'exercice en cours (YYYY-MM-DD).

[financier.exercice_en_cours.provisions_appelees]
[financier.exercice_en_cours.provisions_versees]
  Provisions appelées et provisions effectivement versées par le/les
  lot(s) sur l'exercice en cours, à la date du PED.

[financier.exercice_precedent.debut]
[financier.exercice_precedent.fin]
[financier.exercice_precedent.charges_reelles]
[financier.exercice_precedent.quote_part_lot]
  Données de l'exercice clos précédent (= N-1).
`;

const PROMPT_CHAMPS_DETTES_CEDANT = `
═══════════════════════════════════════════════════════════════════════
CHAMPS — SOMMES DUES PAR LE CÉDANT (Section I - art. L.721-2, 2°, b)
═══════════════════════════════════════════════════════════════════════

Pour CHACUNE des 14 lignes ci-dessous, retourne un objet TRI-ÉTAT :

  {
    "montant": <number | null>,
    "certitude": "certain" | "inconnu",
    "source": "<doc, page : valeur brute>",
    "note": "<explication courte>"
  }

Une dette se prouve par : solde débiteur explicite, mise en demeure,
rappel, ligne "débiteur" dans une liste de copropriétaires, ou solde > 0
dans un relevé de compte récent (≤ 60 jours de DATE_REFERENCE).

Si AUCUNE source autoritaire n'est fournie :
- montant = null, certitude = "inconnu"
- note = "Aucun relevé de compte ni liste débiteur récent — à confirmer
   par le vendeur"

Si le solde est manifestement à 0 (relevé récent à 0, copropriétaire
absent de la liste des débiteurs) :
- montant = 0, certitude = "certain"

LIGNES À EXTRAIRE (toutes au niveau LOT — somme multi-lots) :

[financier.sommes_dues_cedant.provisions_exigibles_budget]
  I.A.1 — Provisions exigibles dans le budget prévisionnel (la dernière
  provision facturée mais NON ENCORE PAYÉE par le cédant).

[financier.sommes_dues_cedant.provisions_exigibles_hors_budget]
  I.A.1 — Provisions exigibles hors budget (idem, dépenses exceptionnelles).

[financier.sommes_dues_cedant.charges_impayees_anterieurs]
  I.A.2 — Charges impayées sur les exercices ANTÉRIEURS au courant
  (régularisations dues, pénalités, etc.).

[financier.sommes_dues_cedant.sommes_exigibles_du_fait_vente]
  I.A.3 — Sommes devenues exigibles du fait de la future vente
  (ex: solde devenu exigible suite à clause du règlement).

[financier.sommes_dues_cedant.avances_reserve_due]
  I.A.4.1 — Avance constituant la réserve (art. 35 D. 17-3-67).
  Dans 95% des cas : 0 (avance déjà versée à l'achat initial).

[financier.sommes_dues_cedant.avances_provisions_speciales_due]
  I.A.4.2 — Avances nommées "provisions spéciales" (art. 18-6).

[financier.sommes_dues_cedant.avances_emprunt_due]
  I.A.4.3 — Avances représentant un emprunt.

[financier.sommes_dues_cedant.cotisation_fonds_travaux_due]
  I.A.5 — Cotisations annuelles fonds travaux (L.14-2) IMPAYÉES.
  ⚠️ La cotisation théorique annuelle va dans fonds_travaux.cotisation_annuelle_lot
  (pas ici). Ici on ne met QUE la cotisation impayée.

[financier.sommes_dues_cedant.pret_quote_part_exigible]
  I.A.6 — Quote-part de prêt vendeur devenue exigible du fait de la vente.

[financier.sommes_dues_cedant.autres_causes_condamnations]
  I.A.6 — Autres exigibilités (condamnations, jugements).

[financier.sommes_dues_cedant.emprunt_collectif_capital_du]
  I.A.7 — Capital restant dû par le cédant au titre de l'emprunt
  collectif (D. art 5.1° f).

[financier.sommes_dues_cedant.cautionnement_emprunt_montant]
  I.A.8 — Montant versé par l'établissement de cautionnement en cas de
  défaillance du cédant sur l'emprunt collectif (D. art 5.1° g).

[financier.sommes_dues_cedant.cautionnement_solidaire_existe]
  Boolean isolé : existe-t-il un cautionnement solidaire ?

[financier.sommes_dues_cedant.emprunts_tiers_geres_syndic]
  I.B — Emprunts à des tiers dont la gestion est assurée par le syndic.
`;

const PROMPT_CHAMPS_ACQUEREUR = `
═══════════════════════════════════════════════════════════════════════
CHAMPS — SOMMES INCOMBANT À L'ACQUÉREUR (Section II - art. L.721-2, 2°, b)
═══════════════════════════════════════════════════════════════════════

[financier.sommes_acquereur.reconstitution_avances]
  Montant que l'ACQUÉREUR devra verser pour reconstituer les avances de
  trésorerie (réserve art. 35 D. 17-3-67).
  Calcul : règlement de copro indique souvent un % du budget (souvent 1/6).
  Reconstitution = % × budget × tantièmes_lot.
  Si aucune information dans le règlement → null.

[financier.sommes_acquereur.reconstitution_avances_source]
  Mode de calcul ou citation du règlement.

[financier.sommes_acquereur.provisions_non_exigibles_budget]
  Tableau d'objets {date, montant} pour les prochains appels de fonds du
  BUDGET PRÉVISIONNEL postérieurs à DATE_REFERENCE.
  Source : appels de fonds émis ou calendrier de l'exercice en cours.

[financier.sommes_acquereur.provisions_non_exigibles_hors_budget]
  Idem pour les charges hors budget.
`;

const PROMPT_CHAMPS_SYNDICAT = `
═══════════════════════════════════════════════════════════════════════
CHAMPS — ÉTAT GLOBAL DU SYNDICAT (art. L.721-2, 2°, c)
═══════════════════════════════════════════════════════════════════════

⚠️ Niveau SYNDICAT (tous copropriétaires confondus), PAS niveau lot.

[financier.syndicat.impayes_charges_global_montant]
  Total des charges non payées par TOUS les copropriétaires.
  Source possible : annexes comptables (compte 4501 colonne débiteur),
  fiche synthétique ligne "Sommes restant dues par les copropriétaires",
  ou cumul des soldes débiteurs dans une liste détaillée.
  Si 0 : mettre 0 (pas null).

[financier.syndicat.impayes_charges_global_source]
  Source.

[financier.syndicat.impayes_charges_global_exercice_reference]
  Exercice de référence des sommes (ex: "2024").
  CSN : "Sommes arrêtées à la date du dernier exercice approuvé".

[financier.syndicat.dette_fournisseurs_global_montant]
  Total dû par le syndicat à ses prestataires (factures parvenues +
  factures non parvenues + organismes sociaux, EXCLURE le compte 4501
  côté DETTES = trop-perçus copropriétaires).
  Source possible : annexes comptables, fiche synthétique "Dettes
  fournisseurs". Si 0 : mettre 0.

[financier.syndicat.dette_fournisseurs_global_source]
  Source.
`;

const PROMPT_CHAMPS_FONDS_TRAVAUX = `
═══════════════════════════════════════════════════════════════════════
CHAMPS — FONDS DE TRAVAUX (art. L.14-2 — art. L.721-2, 2°, d)
═══════════════════════════════════════════════════════════════════════

[financier.fonds_travaux.existence]
  Le fonds de travaux ALUR existe-t-il ? (true/false)
  Toute copro de plus de 5 ans (sauf exception) a un fonds.

[financier.fonds_travaux.solde_quote_part_lot] ⭐ CHAMP CSN CRITIQUE
  Quote-part du fonds de travaux rattachée au(x) lot(s) cédé(s).
  Cherche cette info dans cet ordre :
  1. Si une ventilation par lot est fournie (parfois en annexe des
     comptes annuels) → lis directement la ligne du/des lot(s).
  2. Sinon, somme les cotisations versées par le/les lot(s) au titre
     du fonds travaux dans les relevés de compte (ligne "Fonds Travaux
     ALUR" en débit).
  3. Sinon, calcule par cumul théorique : cotisation_annuelle_lot ×
     nombre d'années depuis création du fonds (à mentionner comme
     estimation dans _source).
  4. En dernier recours : (tantiemes_lot/tantiemes_totaux) × solde_total
     (mentionner explicitement "estimation par tantièmes" dans _source).
  Mets null UNIQUEMENT si aucun de ces calculs n'est possible.

[financier.fonds_travaux.solde_quote_part_lot_source]
  Source ou mode de calcul utilisé.

[financier.fonds_travaux.solde_total_copro]
  Solde TOTAL du fonds de travaux ALUR de la copropriété.
  Source : fiche synthétique, comptes annuels.

[financier.fonds_travaux.solde_total_copro_source]
  Source.

[financier.fonds_travaux.derniere_cotisation_versee]
  Montant de la DERNIÈRE cotisation EFFECTIVEMENT VERSÉE par le cédant
  au titre de son/ses lot(s) (ligne "Fonds Travaux ALUR" en crédit dans
  les relevés de compte récents).

[financier.fonds_travaux.derniere_cotisation_versee_source]
  Source.

[financier.fonds_travaux.cotisation_annuelle_lot]
  Cotisation ALUR ANNUELLE THÉORIQUE pour le/les lot(s) vendu(s).
  Calcul : budget × taux × tantièmes_lot / tantiemes_totaux.

[financier.fonds_travaux.cotisation_annuelle_lot_source]
  Mode de calcul.

[financier.fonds_travaux.taux_pourcentage]
  Taux de cotisation au fonds (% du budget). Minimum légal 2.5%, jusqu'à
  5% si Plan Pluriannuel voté. Cherche dans les PV d'AG la résolution
  de vote du fonds.
`;

const PROMPT_CHAMPS_TECHNIQUE = `
═══════════════════════════════════════════════════════════════════════
CHAMPS — DOSSIER TECHNIQUE ET ENVIRONNEMENTAL (Section III B)
═══════════════════════════════════════════════════════════════════════

⚠️ Cette section est partagée avec pv-extract-diagnostics qui s'occupe
des diagnostics individuels (DPE, amiante DTA, plomb, termites du lot).
Ici, tu extrais uniquement les infos COPRO/IMMEUBLE.

[technique_copro.dtg_existe]
[technique_copro.dtg_date]
[technique_copro.dtg_conclusions]
  B0 — Diagnostic Technique Global (art. L.731-1 CCH). Existe ? Date ?
  Conclusions principales (résumé court).

[technique_copro.fiche_synthetique_existe]
  B0-1 — La fiche synthétique technique (art. 8-2 loi 65) existe-t-elle ?

[technique_copro.plan_pluriannuel_existe]
[technique_copro.plan_pluriannuel_details]
  B0-2 — Plan Pluriannuel de Travaux. Existe ? Description.

[technique_copro.carnet_entretien_existe]
[technique_copro.type_immeuble]
  B1 — Carnet d'entretien existe ? Type immeuble : "IGH" | "autre" | null.

CHAMPS — AMIANTE (immeuble, pas le DTA individuel) :
[technique_copro.amiante_immeuble.soumis_reglementation]
  L'immeuble est-il soumis à la réglementation amiante (permis de
  construire avant 1/7/1997) ?
[technique_copro.amiante_immeuble.absence_confirmee]
  Les recherches ont-elles conclu à l'absence d'amiante ?
[technique_copro.amiante_immeuble.dta_mis_a_jour_2012]
  L'immeuble a-t-il fait l'objet d'un repérage complémentaire et le DTA
  a-t-il été mis à jour depuis le 1/2/2012 ?

CHAMPS — PLOMB (immeuble) :
[technique_copro.plomb_immeuble.edifie_avant_1949]
  Immeuble édifié avant le 1/1/1949 ?
[technique_copro.plomb_immeuble.mesures_urgence_ddass]
  Mesures d'urgence (DDASS, Préfecture) en cours ?

CHAMPS — TERMITES PARTIES COMMUNES :
[technique_copro.termites_pc.recherche_effectuee]
[technique_copro.termites_pc.date_recherche]
  Une recherche termites a-t-elle été effectuée sur les parties communes ?

CHAMPS — RISQUES SANITAIRES (présomption négative) :
[technique_copro.risques_sanitaires.legionellose]
[technique_copro.risques_sanitaires.radon]
[technique_copro.risques_sanitaires.merules]
[technique_copro.risques_sanitaires.traitement_effectue]
  Risques connus sur l'immeuble ? Traitement effectué si l'un des 3 = true.

CHAMPS — DPE COLLECTIF :
[technique_copro.dpe_collectif.chauffage_collectif]
[technique_copro.dpe_collectif.climatisation_collective]
  L'immeuble a-t-il chauffage / climatisation collective ?
[technique_copro.dpe_collectif.dispositif_mesurage]
  Si chauffage/clim collectif, dispositif de mesurage ?
[technique_copro.dpe_collectif.plan_economie_energie_adopte]
  Le syndicat a-t-il adopté un plan de travaux d'économie d'énergie ?
[technique_copro.dpe_collectif.contrat_performance_energetique]
  Contrat de performance énergétique en cours ?

CHAMPS — AUDIT ÉNERGÉTIQUE :
[technique_copro.audit_energetique.obligatoire]
  Calcul : true si copro > 50 lots ET chauffage collectif.
[technique_copro.audit_energetique.realise]
  Un audit a-t-il été réalisé ?
[technique_copro.audit_energetique.date_realisation]
  Date de l'audit (YYYY-MM-DD).
[technique_copro.audit_energetique.mesurage_existe]
  Si chauffage collectif, dispositif de mesurage ?
[technique_copro.audit_energetique.individualisation_chauffage]
  Individualisation des frais de chauffage ?
[technique_copro.audit_energetique.decisions_ag]
  Décisions en AG suite à l'audit ?

CHAMPS — ASCENSEUR :
[technique_copro.ascenseur.existe]
  Y a-t-il des ascenseurs dans la copropriété ?
[technique_copro.ascenseur.anterieur_2000]
  Ascenseur installé avant le 27/8/2000 ?
[technique_copro.ascenseur.controle_quinquennal_realise]
[technique_copro.ascenseur.controle_quinquennal_date]
  Contrôle technique quinquennal ? Date.
[technique_copro.ascenseur.mises_aux_normes_2010]
[technique_copro.ascenseur.mises_aux_normes_2014]
[technique_copro.ascenseur.mises_aux_normes_2018]
  Mises aux normes effectuées avant 31/12/2010 / 3/7/2014 / 3/7/2018 ?

CHAMPS — ASSAINISSEMENT :
[technique_copro.assainissement.collectif]
  Assainissement collectif ?
[technique_copro.assainissement.spanc_rapport_existe]
  Si non collectif, rapport SPANC existe ?

CHAMPS — PISCINE :
[technique_copro.piscine.existe]
[technique_copro.piscine.dispositif_securite_homologue]
  Piscine dans la copropriété ? Dispositif de sécurité homologué ?

CHAMPS — MESURES ADMINISTRATIVES (présomption négative, tous false par défaut) :
[technique_copro.mesures_administratives.arrete_peril]
[technique_copro.mesures_administratives.declaration_insalubrite]
[technique_copro.mesures_administratives.injonction_travaux]
[technique_copro.mesures_administratives.interdiction_habiter]
[technique_copro.mesures_administratives.monument_historique]
[technique_copro.mesures_administratives.injonction_ravalement]
[technique_copro.mesures_administratives.plan_sauvegarde_opah]

[technique_copro.icpe]
  Installation Classée pour la Protection de l'Environnement.
  "oui" | "non" | "ne_sait_pas".

[technique_copro.irve_et_velos.recharge_vehicules_electriques]
  Bornes de recharge pour véhicules électriques en partie commune ?
[technique_copro.irve_et_velos.stationnement_velos_securise]
  Stationnement vélos sécurisé en partie commune ?
`;

const PROMPT_CHAMPS_JURIDIQUE = `
═══════════════════════════════════════════════════════════════════════
CHAMPS — TRAVAUX VOTÉS ET PROCÉDURES (Sections III A6 et III C)
═══════════════════════════════════════════════════════════════════════

[juridique.travaux_a_venir_votes]
  Tableau de TOUS les travaux votés en AG (ravalement, toiture, ascenseur,
  rénovation énergétique, mise aux normes, etc.) avec leur état d'avancement.
  Pour chaque entrée :
  {
    "description": "<nature des travaux>",
    "resolution_ag": "AG du JJ/MM/AAAA, résolution N°XX",
    "montant_total": <coût total voté pour la copro>,
    "quote_part_lot": <part du/des lot(s), calculée via tantièmes si non explicite>,
    "date_realisation_prevue": "YYYY-MM-DD" ou null,
    "echeancier_appels": [{"date": "YYYY-MM-DD", "montant_lot": <number>, "appele": <bool>}],
    "montant_appele_lot": <somme des appels avec appele=true>,
    "montant_restant_lot": <somme des appels avec appele=false>,
    "etat_avancement_technique": "C" | "NC",
    "etat_avancement_financier": "<description courte>",
    "commentaires": "<libre>"
  }
  Un appel a appele=true si sa date <= DATE_REFERENCE, false sinon.
  Si aucun calendrier d'appels n'est précisé : crée une entrée unique
  {date: date résolution, montant_lot: quote_part_lot, appele: false}.

[juridique.travaux_votes_non_realises]
  true si AU MOINS UN travaux a montant_restant_lot > 0 ou
  etat_avancement_technique = "NC".

[juridique.travaux_votes_details]
  Résumé textuel court de tous les travaux non terminés.

[juridique.procedures_en_cours]
  true si au moins une procédure judiciaire en cours mentionnée dans
  les PV, le carnet d'entretien ou la fiche synthétique.
  Inclut : saisies immobilières, actions en recouvrement, contentieux
  prestataires/copropriétaires, mandataire ad hoc, administration
  provisoire.

[juridique.procedures_details]
  Description détaillée : qui est visé, nature, résolution AG de
  référence, montants en jeu, état d'avancement.

[juridique.sinistres_en_cours]
  true si un sinistre non clôturé est mentionné en AG ou carnet d'entretien.

[juridique.sinistres_details]
  Description courte.
`;

const PROMPT_OUTPUT_SCHEMA = `
═══════════════════════════════════════════════════════════════════════
RÈGLES FINALES & FORMAT DE RÉPONSE
═══════════════════════════════════════════════════════════════════════

▸ Réponds UNIQUEMENT avec le JSON, sans commentaire ni texte autour.
▸ Pour CHAQUE valeur écrite, remplis _source associé (doc + page +
  calcul si déduit).
▸ Si une valeur est introuvable ET indéductible : null + champ ajouté
  dans meta.donnees_manquantes.
▸ Si une incohérence est détectée entre documents : ajoute dans
  meta.alertes.
▸ Si tu hésites sur N-1/N-2 (datation) : ajoute une alerte explicite.
▸ confiance_globale : score 0.0-1.0 reflétant ta confiance dans
  l'extraction globale.

═══════════════════════════════════════════════════════════════════════
SCHÉMA JSON ATTENDU
═══════════════════════════════════════════════════════════════════════

{
  "copropriete": {
    "nom": "",
    "adresse": "",
    "immatriculation_rnc": "",
    "nombre_lots_copropriete": null,
    "nombre_coproprietaires": null,
    "nombre_batiments": null,
    "date_construction": "",
    "date_reglement": "",
    "tantiemes_totaux": null,
    "tantiemes_totaux_source": "",

    "syndic_nom": "",
    "syndic_adresse": "",
    "syndic_type": "",
    "syndic_date_designation": "",
    "syndic_mandat_fin": "",
    "syndicat_unique": null,
    "syndicat_principal_coordonnees": "",
    "prochaine_ag_date": "",
    "modificatif_rc_non_publie": null,

    "assurance": {
      "multirisque_existe": null,
      "couverture_rc": null,
      "couverture_incendie": null,
      "couverture_degats_eaux": null,
      "garantie_reconstruction_type": "",
      "garantie_reconstruction_capital_limite": null,
      "autres_risques": "",
      "police_numero": "",
      "police_date": "",
      "compagnie_nom": "",
      "compagnie_adresse": "",
      "courtier_nom": "",
      "courtier_adresse": "",
      "do_origine": null,
      "do_syndicat_travaux": null
    },

    "association_syndicale": {
      "existe": null,
      "nom": "",
      "siege": "",
      "representant": ""
    },

    "patrimoine_syndicat": {
      "existe": null,
      "description": ""
    },

    "contrats_revenus": {
      "existe": null,
      "description": ""
    },

    "emprunt_syndicat": {
      "existe": null,
      "objet": "",
      "organisme": "",
      "reference": "",
      "capital_restant_du_lots": null,
      "organisme_caution": "",
      "mutation_declenche_exigibilite": null
    },

    "copropriete_difficulte": {
      "mandataire_ad_hoc": false,
      "administration_provisoire": false,
      "etat_carence": false,
      "ratio_impayes_excede": false,
      "ratio_impayes_montant": null
    },

    "droit_priorite_stationnement": {
      "vote_en_ag": false,
      "clause_au_reglement": false
    },

    "fibre_optique": null
  },

  "lot": {
    "numero": "",
    "type": "",
    "etage": "",
    "surface_carrez": null,
    "tantiemes_generaux": null,
    "tantiemes_generaux_source": "",
    "tantiemes_speciaux": null
  },

  "financier": {
    "budget_previsionnel_annuel": null,
    "budget_previsionnel_annuel_source": "",
    "budget_previsionnel_exercice": "",

    "historique_charges": [
      {
        "exercice_label": "N-1",
        "exercice_periode": "",
        "budget_appelee": null,
        "budget_reelle": null,
        "hors_budget_appelee": null,
        "hors_budget_reelle": null,
        "source": ""
      },
      {
        "exercice_label": "N-2",
        "exercice_periode": "",
        "budget_appelee": null,
        "budget_reelle": null,
        "hors_budget_appelee": null,
        "hors_budget_reelle": null,
        "source": ""
      }
    ],

    "charges_courantes_lot_annuel": null,
    "charges_courantes_lot_annuel_source": "",
    "charges_exceptionnelles_lot": null,
    "charges_exceptionnelles_lot_source": "",

    "sommes_dues_cedant": {
      "provisions_exigibles_budget":       { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "provisions_exigibles_hors_budget":  { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "charges_impayees_anterieurs":       { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "sommes_exigibles_du_fait_vente":    { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "avances_reserve_due":               { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "avances_provisions_speciales_due":  { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "avances_emprunt_due":               { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "cotisation_fonds_travaux_due":      { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "pret_quote_part_exigible":          { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "autres_causes_condamnations":       { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "emprunt_collectif_capital_du":      { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "cautionnement_emprunt_montant":     { "montant": null, "certitude": "inconnu", "source": "", "note": "" },
      "cautionnement_solidaire_existe":    false,
      "emprunts_tiers_geres_syndic":       { "montant": null, "certitude": "inconnu", "source": "", "note": "" }
    },

    "sommes_acquereur": {
      "reconstitution_avances": null,
      "reconstitution_avances_source": "",
      "provisions_non_exigibles_budget": [],
      "provisions_non_exigibles_hors_budget": []
    },

    "syndicat": {
      "impayes_charges_global_montant": null,
      "impayes_charges_global_source": "",
      "impayes_charges_global_exercice_reference": "",
      "dette_fournisseurs_global_montant": null,
      "dette_fournisseurs_global_source": ""
    },

    "fonds_travaux": {
      "existence": null,
      "solde_quote_part_lot": null,
      "solde_quote_part_lot_source": "",
      "solde_total_copro": null,
      "solde_total_copro_source": "",
      "derniere_cotisation_versee": null,
      "derniere_cotisation_versee_source": "",
      "cotisation_annuelle_lot": null,
      "cotisation_annuelle_lot_source": "",
      "taux_pourcentage": null
    },

    "exercice_en_cours": {
      "debut": "",
      "fin": "",
      "provisions_appelees": null,
      "provisions_appelees_source": "",
      "provisions_versees": null,
      "provisions_versees_source": ""
    },
    "exercice_precedent": {
      "debut": "",
      "fin": "",
      "charges_reelles": null,
      "quote_part_lot": null
    },

    "_legacy_compat": {
      "budget_previsionnel_annuel": null,
      "charges_courantes_lot": null,
      "charges_exceptionnelles_lot": null,
      "fonds_travaux_solde": null,
      "fonds_travaux_cotisation_annuelle": null,
      "fonds_travaux_exists": null,
      "provisions_exigibles": null,
      "impayes_vendeur": null,
      "impaye_charges_global": null,
      "dette_fournisseurs_global": null,
      "dette_copro_fournisseurs": null,
      "avances_reserve": null,
      "provisions_speciales": null,
      "emprunt_collectif_solde": null,
      "emprunt_collectif_objet": "",
      "emprunt_collectif_echeance": "",
      "cautionnement_solidaire": false,
      "charges_budget_n1": null,
      "charges_budget_n1_source": "",
      "charges_budget_n2": null,
      "charges_budget_n2_source": "",
      "charges_hors_budget_n1": null,
      "charges_hors_budget_n2": null
    }
  },

  "technique_copro": {
    "dtg_existe": null,
    "dtg_date": "",
    "dtg_conclusions": "",
    "fiche_synthetique_existe": null,
    "plan_pluriannuel_existe": null,
    "plan_pluriannuel_details": "",
    "carnet_entretien_existe": null,
    "type_immeuble": "",
    "amiante_immeuble": {
      "soumis_reglementation": null,
      "absence_confirmee": null,
      "dta_mis_a_jour_2012": null
    },
    "plomb_immeuble": {
      "edifie_avant_1949": null,
      "mesures_urgence_ddass": false
    },
    "termites_pc": {
      "recherche_effectuee": null,
      "date_recherche": ""
    },
    "risques_sanitaires": {
      "legionellose": false,
      "radon": false,
      "merules": false,
      "traitement_effectue": null
    },
    "dpe_collectif": {
      "chauffage_collectif": null,
      "climatisation_collective": null,
      "dispositif_mesurage": null,
      "plan_economie_energie_adopte": null,
      "contrat_performance_energetique": null
    },
    "audit_energetique": {
      "obligatoire": null,
      "realise": null,
      "date_realisation": "",
      "mesurage_existe": null,
      "individualisation_chauffage": null,
      "decisions_ag": null
    },
    "ascenseur": {
      "existe": null,
      "anterieur_2000": null,
      "controle_quinquennal_realise": null,
      "controle_quinquennal_date": "",
      "mises_aux_normes_2010": null,
      "mises_aux_normes_2014": null,
      "mises_aux_normes_2018": null
    },
    "assainissement": {
      "collectif": null,
      "spanc_rapport_existe": null
    },
    "piscine": {
      "existe": null,
      "dispositif_securite_homologue": null
    },
    "mesures_administratives": {
      "arrete_peril": false,
      "declaration_insalubrite": false,
      "injonction_travaux": false,
      "interdiction_habiter": false,
      "monument_historique": false,
      "injonction_ravalement": false,
      "plan_sauvegarde_opah": false
    },
    "icpe": "non",
    "irve_et_velos": {
      "recharge_vehicules_electriques": false,
      "stationnement_velos_securise": false
    }
  },

  "juridique": {
    "procedures_en_cours": false,
    "procedures_details": "",
    "travaux_votes_non_realises": false,
    "travaux_votes_details": "",
    "travaux_a_venir_votes": [],
    "sinistres_en_cours": false,
    "sinistres_details": ""
  },

  "meta": {
    "documents_analyses": [],
    "donnees_manquantes": [],
    "alertes": [],
    "confiance_globale": 0.0
  }
}`;

const EXTRACTION_PROMPT =
  PROMPT_ROLE +
  PROMPT_CHAMPS_COPRO +
  PROMPT_CHAMPS_LOT +
  PROMPT_CHAMPS_HISTORIQUE +
  PROMPT_CHAMPS_FINANCIER_BASE +
  PROMPT_CHAMPS_DETTES_CEDANT +
  PROMPT_CHAMPS_ACQUEREUR +
  PROMPT_CHAMPS_SYNDICAT +
  PROMPT_CHAMPS_FONDS_TRAVAUX +
  PROMPT_CHAMPS_TECHNIQUE +
  PROMPT_CHAMPS_JURIDIQUE +
  PROMPT_OUTPUT_SCHEMA;

// ─── Types & helpers ──────────────────────────────────────────────

interface DocInput {
  gemini_file_uri: string;
  normalized_filename?: string;
  original_filename: string;
  document_type: string;
}

interface TriEtatField {
  montant: number | null;
  certitude: "certain" | "inconnu";
  source: string;
  note: string;
}

function buildQuestionnaireContext(q: Record<string, unknown>): string {
  if (!q || typeof q !== "object") return "";

  const lines: string[] = [];
  lines.push("\nCONTEXTE DU QUESTIONNAIRE VENDEUR:");

  const occ = q.occupation as Record<string, unknown> | undefined;
  if (occ) {
    if (occ.occupant_actuel === "locataire" || occ.bail_en_cours === true) {
      lines.push("- Le bien est LOUÉ. Cherche dans les documents les informations du bail (loyer, dépôt de garantie, dates, type).");
      if (occ.bail_type) lines.push(`  Type de bail : ${occ.bail_type}`);
      if (occ.loyer_mensuel) lines.push(`  Loyer mensuel déclaré : ${occ.loyer_mensuel} €`);
    } else if (occ.occupant_actuel === "proprietaire") {
      lines.push("- Le bien est occupé par le propriétaire.");
    } else if (occ.occupant_actuel === "vacant") {
      lines.push("- Le bien est actuellement vacant.");
    }
  }

  const copro = q.copropriete_questions as Record<string, unknown> | undefined;
  if (copro) {
    if (copro.association_syndicale === true) {
      lines.push("- Une ASL/AFUL existe (déclaration vendeur). Cherche les documents complémentaires.");
      if (copro.association_syndicale_details) lines.push(`  Détails : ${copro.association_syndicale_details}`);
    }
    if (copro.volume_ou_lotissement === true) {
      lines.push("- Le bien fait partie d'un volume ou lotissement.");
    }
  }

  const trav = q.travaux as Record<string, unknown> | undefined;
  if (trav && trav.travaux_realises === true) {
    lines.push("- Le vendeur déclare avoir réalisé des travaux privatifs.");
    if (trav.travaux_realises_details) lines.push(`  Description : ${trav.travaux_realises_details}`);
  }

  const prets = q.prets as Record<string, unknown> | undefined;
  if (prets) {
    if (prets.pret_hypothecaire === true) lines.push("- Prêt hypothécaire en cours sur le bien.");
    if (prets.saisie_en_cours === true) lines.push("- ATTENTION : saisie immobilière en cours.");
  }

  const sin = q.sinistres as Record<string, unknown> | undefined;
  if (sin) {
    if (sin.sinistre_indemnise === true) lines.push("- Sinistre indemnisé déclaré.");
    if (sin.catastrophe_naturelle === true) lines.push("- Catastrophe naturelle déclarée.");
    if (sin.degat_des_eaux === true) lines.push("- Dégât des eaux déclaré.");
  }

  const fisc = q.fiscal as Record<string, unknown> | undefined;
  if (fisc && fisc.dispositif_fiscal && fisc.dispositif_fiscal !== "aucun") {
    lines.push(`- Dispositif fiscal en cours : ${fisc.dispositif_fiscal}`);
  }

  if (lines.length <= 1) return "";
  return lines.join("\n");
}

// ─── Post-extraction backfill into _legacy_compat ────────────────
// Keeps pv-run-extraction working while we migrate downstream consumers.

function backfillLegacyCompat(data: Record<string, unknown>): void {
  const fin = data.financier as Record<string, unknown> | undefined;
  if (!fin) return;

  const legacy = (fin._legacy_compat ??= {}) as Record<string, unknown>;
  const dues = (fin.sommes_dues_cedant ?? {}) as Record<string, TriEtatField>;
  const synd = (fin.syndicat ?? {}) as Record<string, unknown>;
  const fonds = (fin.fonds_travaux ?? {}) as Record<string, unknown>;
  const histo = (fin.historique_charges ?? []) as Array<Record<string, unknown>>;

  legacy.budget_previsionnel_annuel = fin.budget_previsionnel_annuel ?? null;
  legacy.charges_courantes_lot = fin.charges_courantes_lot_annuel ?? null;
  legacy.charges_exceptionnelles_lot = fin.charges_exceptionnelles_lot ?? null;
  legacy.fonds_travaux_solde = fonds.solde_total_copro ?? null;
  legacy.fonds_travaux_cotisation_annuelle = fonds.cotisation_annuelle_lot ?? null;
  legacy.fonds_travaux_exists = fonds.existence ?? null;

  // Tri-état → flat number for legacy consumers (taking the montant)
  const provBudget = dues.provisions_exigibles_budget?.montant ?? 0;
  const provHors = dues.provisions_exigibles_hors_budget?.montant ?? 0;
  legacy.provisions_exigibles =
    dues.provisions_exigibles_budget?.certitude === "certain" ||
    dues.provisions_exigibles_hors_budget?.certitude === "certain"
      ? (provBudget ?? 0) + (provHors ?? 0)
      : null;

  legacy.impayes_vendeur =
    dues.charges_impayees_anterieurs?.certitude === "certain"
      ? dues.charges_impayees_anterieurs.montant
      : null;

  legacy.impaye_charges_global = synd.impayes_charges_global_montant ?? null;
  legacy.dette_fournisseurs_global = synd.dette_fournisseurs_global_montant ?? null;
  legacy.dette_copro_fournisseurs = synd.dette_fournisseurs_global_montant ?? null;

  legacy.avances_reserve = dues.avances_reserve_due?.montant ?? null;
  legacy.provisions_speciales = dues.avances_provisions_speciales_due?.montant ?? null;
  legacy.emprunt_collectif_solde = dues.emprunt_collectif_capital_du?.montant ?? null;
  legacy.cautionnement_solidaire = (dues as unknown as Record<string, unknown>).cautionnement_solidaire_existe ?? false;

  // Historique → legacy n-1 / n-2
  const n1 = histo.find((e) => e.exercice_label === "N-1");
  const n2 = histo.find((e) => e.exercice_label === "N-2");
  legacy.charges_budget_n1 = (n1?.budget_reelle ?? n1?.budget_appelee) ?? null;
  legacy.charges_budget_n2 = (n2?.budget_reelle ?? n2?.budget_appelee) ?? null;
  legacy.charges_hors_budget_n1 = (n1?.hors_budget_reelle ?? n1?.hors_budget_appelee) ?? null;
  legacy.charges_hors_budget_n2 = (n2?.hors_budget_reelle ?? n2?.hors_budget_appelee) ?? null;
  legacy.charges_budget_n1_source = (n1?.source as string) ?? "";
  legacy.charges_budget_n2_source = (n2?.source as string) ?? "";
}

// ─── Post-extraction validation ──────────────────────────────────

function validateExtraction(data: Record<string, unknown>): string[] {
  const alerts: string[] = [];
  const lot = data.lot as Record<string, unknown> | undefined;
  const financier = data.financier as Record<string, unknown> | undefined;
  const copro = data.copropriete as Record<string, unknown> | undefined;

  if (!lot || !financier || !copro) return alerts;

  const tantLot = lot.tantiemes_generaux as number | null;
  const tantTotal = copro.tantiemes_totaux as number | null;
  const budget = financier.budget_previsionnel_annuel as number | null;
  const charges = financier.charges_courantes_lot_annuel as number | null;
  const fonds = (financier.fonds_travaux ?? {}) as Record<string, unknown>;
  const synd = (financier.syndicat ?? {}) as Record<string, unknown>;

  if (tantLot != null && tantTotal != null) {
    if (tantLot >= tantTotal) {
      alerts.push(`ERREUR : tantièmes lot (${tantLot}) >= tantièmes totaux (${tantTotal}). Vérifier l'extraction.`);
    }
    if (tantLot <= 0) {
      alerts.push(`ERREUR : tantièmes lot (${tantLot}) <= 0. Valeur incohérente.`);
    }
  }

  if (tantLot != null && tantTotal != null && budget != null && charges != null && tantTotal > 0) {
    const expected = (tantLot / tantTotal) * budget;
    const ecart = Math.abs(charges - expected) / expected;
    if (ecart > 0.15) {
      alerts.push(
        `ALERTE : écart ${Math.round(ecart * 100)}% entre charges lot (${charges} EUR) ` +
          `et calcul tantièmes×budget (${Math.round(expected)} EUR). Vérifier les tantièmes ou le budget.`,
      );
    }
  }

  if (charges != null && charges <= 0) {
    alerts.push(`ERREUR : charges courantes lot (${charges} EUR) <= 0.`);
  }

  // Fonds travaux : QP lot vs total
  const qpLot = fonds.solde_quote_part_lot as number | null;
  const totalCopro = fonds.solde_total_copro as number | null;
  if (qpLot != null && totalCopro != null && tantLot != null && tantTotal != null && tantTotal > 0) {
    const expectedQp = (tantLot / tantTotal) * totalCopro;
    const ecart = Math.abs(qpLot - expectedQp) / Math.max(expectedQp, 1);
    if (ecart > 0.5) {
      alerts.push(
        `INFO : QP fonds travaux du lot (${qpLot} EUR) éloignée du calcul tantièmes×total ` +
          `(${Math.round(expectedQp)} EUR). Cohérent si la QP réelle vient de cumul cotisations.`,
      );
    }
  }

  // Ratio impayés copro en difficulté
  const nbLots = copro.nombre_lots_copropriete as number | null;
  const impayes = synd.impayes_charges_global_montant as number | null;
  if (impayes != null && budget != null && budget > 0 && nbLots != null) {
    const ratio = impayes / budget;
    const seuil = nbLots > 200 ? 0.15 : 0.25;
    if (ratio > seuil) {
      alerts.push(
        `INFO : ratio impayés/budget = ${Math.round(ratio * 100)}% > seuil ${seuil * 100}% ` +
          `(copro ${nbLots > 200 ? ">" : "<"}200 lots). Critère copropriété en difficulté à vérifier.`,
      );
    }
  }

  // Exercice en cours sanity
  const exEnCours = financier.exercice_en_cours as Record<string, unknown> | undefined;
  if (exEnCours) {
    const debut = exEnCours.debut as string;
    const fin = exEnCours.fin as string;
    if (debut && fin && debut >= fin) {
      alerts.push(`ERREUR : exercice en cours - debut (${debut}) >= fin (${fin}).`);
    }
  }

  return alerts;
}

// ─── Main handler ─────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return corsResponse({ error: "Method not allowed" }, 405);
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      console.error("GEMINI_API_KEY not configured");
      return corsResponse({ error: "Server configuration error (Gemini)" }, 500);
    }

    const supabase = getSupabase();
    if (!supabase) {
      return corsResponse({ error: "Server configuration error" }, 500);
    }

    const body = await req.json();
    const { documents, dossier_id, lot_number, property_address, property_surface, questionnaire_context, documents_toc } = body;

    if (!documents || documents.length === 0) {
      return corsResponse({ error: "documents array is required" }, 400);
    }

    const auth = await verifyDossierAccess(req, dossier_id, supabase, body);
    if (!auth.ok) return corsResponse({ error: auth.error! }, auth.status!);

    if (auth.dossier.stripe_payment_status !== "paid") {
      console.warn(
        `[extract-financial] Refused: dossier ${dossier_id} has stripe_payment_status=${auth.dossier.stripe_payment_status ?? "null"}`,
      );
      return corsResponse({ error: "Payment required" }, 402);
    }

    console.log(`[extract-financial] Processing ${documents.length} documents`);
    if (lot_number) console.log(`[extract-financial] Lot context: ${lot_number}`);
    if (questionnaire_context) console.log(`[extract-financial] Questionnaire context provided`);

    const startTime = Date.now();

    try {
      const allDocs = documents as DocInput[];

      // The orchestrator (pv-run-extraction) is responsible for resolving every
      // doc's Gemini File API URI via getOrUploadFileUri() before invoking us.
      // This function no longer uploads — it just consumes URIs. Missing URI =
      // upstream bug, fail loud rather than silently dropping the doc.
      const missingUri = allDocs.find((d) => !d.gemini_file_uri);
      if (missingUri) {
        throw new Error(
          `Missing gemini_file_uri for ${missingUri.original_filename || "<unnamed>"}. ` +
            `Caller must resolve URIs before invoking pv-extract-financial.`,
        );
      }
      console.log(`[extract-financial] Using ${allDocs.length} pre-resolved Gemini URIs`);

      // Build prompt with date reference + lot + questionnaire context
      const today = new Date().toISOString().split("T")[0];
      let prompt = EXTRACTION_PROMPT;
      prompt += `\n\nDATE_REFERENCE (date d'établissement du pré-état daté): ${today}`;
      prompt += `\nUtilise cette date pour :`;
      prompt += `\n  - déterminer N-1 et N-2 (exercices clos ET approuvés en AG avant cette date)`;
      prompt += `\n  - identifier le budget de l'exercice EN COURS à cette date`;
      prompt += `\n  - marquer appele=true sur les appels de fonds avec date <= ${today}, false sinon`;
      prompt += `\n  - filtrer les relevés de compte récents (≤ 60 jours de cette date) pour les dettes du cédant`;

      if (lot_number || property_address || property_surface != null) {
        prompt += `\n\nCONTEXTE DU LOT VENDU (déclaré par le vendeur en amont) :`;
        if (lot_number) prompt += `\n- Numéro(s) de lot concerné(s) par la vente : ${lot_number}`;
        if (property_address) prompt += `\n- Adresse du bien : ${property_address}`;
        if (property_surface != null) prompt += `\n- Surface Carrez du lot : ${property_surface} m²`;
        prompt += `\n\nSi plusieurs lots, additionne leurs valeurs (tantièmes, charges) — le périmètre du PED est l'ensemble des lots cédés.`;
        prompt += `\n\nIMPORTANT : ces valeurs te sont fournies en entrée. Ne les liste PAS dans \`meta.donnees_manquantes\` même si tu ne les retrouves pas dans les documents — elles sont déjà connues côté dossier.`;
      }

      // Anti-bruit sur donnees_manquantes : on n'affiche au vendeur QUE ce qui
      // est utile pour la signature, pas un inventaire de champs facultatifs.
      prompt += `\n\nRÈGLE DE PERTINENCE pour meta.donnees_manquantes :`;
      prompt += `\nN'ajoute dans meta.donnees_manquantes QUE les champs vraiment requis pour ce PED.`;
      prompt += `\n- Champs accessoires (taux_pourcentage du fonds travaux, dates de provisions, etc.) : ne PAS lister, ce sont des bonus.`;
      prompt += `\n- Champs avec valeur par défaut légale (taux fonds travaux = 5% par défaut, garantie reconstruction = valeur_neuf si non précisée) : ne PAS lister.`;
      prompt += `\n- Champs conditionnels non remplis car la condition n'est pas remplie (sous-blocs association_syndicale.*, emprunt_syndicat.*, copropriete_difficulte.* lorsqu'aucune trace dans les docs) : ne PAS lister.`;
      prompt += `\nLe but est d'éviter d'angoisser le vendeur avec une liste de 20 manquants dont 15 sont du bonus.`;

      if (questionnaire_context && typeof questionnaire_context === "object") {
        const qContext = buildQuestionnaireContext(questionnaire_context as Record<string, unknown>);
        if (qContext) {
          prompt += `\n${qContext}`;
          prompt += `\n\nUtilise ces déclarations vendeur pour orienter ton analyse.`;
          prompt += `\nSi le bien est loué, cherche le bail. Si ASL/AFUL déclarée, mentionne dans alertes si aucun document ASL fourni.`;
        }
      }

      // Optional: documents table-of-contents (built by pv-run-extraction
      // from each doc's ai_classification_raw.contents). It's a navigation
      // aid — Gemini stays free to look anywhere it needs.
      if (typeof documents_toc === "string" && documents_toc.length > 0) {
        prompt += `\n\nINDICATIONS DE NAVIGATION (table des matières des documents) :\n`;
        prompt += documents_toc;
        prompt += `\nCette TOC est un raccourci. Si l'info que tu cherches n'est pas dans la page indiquée, regarde ailleurs dans les documents — ne te bloque pas dessus.`;
      }

      // Build Gemini parts (label + file ref, par doc)
      const parts: unknown[] = [{ text: prompt }];
      for (const doc of allDocs) {
        const key = doc.normalized_filename || doc.original_filename;
        parts.push({ text: `[Document: ${key} - Type: ${doc.document_type}]` });
        parts.push({ fileData: { fileUri: doc.gemini_file_uri, mimeType: "application/pdf" } });
      }

      const geminiResult = await callGemini(geminiKey, "gemini-2.5-pro", parts);
      const result = geminiResult.data as Record<string, unknown>;
      const duration = Date.now() - startTime;

      await logAiCall(supabase, {
        dossierId: dossier_id,
        modelRequested: "gemini-2.5-pro",
        modelUsed: geminiResult.modelUsed,
        promptType: "extraction-financial-csn-v3",
        startTime,
        result,
        inputTokens: geminiResult.usageMetadata.inputTokens,
        outputTokens: geminiResult.usageMetadata.outputTokens,
        totalTokens: geminiResult.usageMetadata.totalTokens,
      });
      console.log(`[extract-financial] Done in ${duration}ms`);

      // Backfill legacy compat (so pv-run-extraction keeps working)
      backfillLegacyCompat(result);

      // Post-extraction validation
      const validationAlerts = validateExtraction(result);
      if (validationAlerts.length > 0) {
        console.log(`[extract-financial] Validation alerts: ${validationAlerts.join(" | ")}`);
        const meta = (result.meta as Record<string, unknown>) || { alertes: [] };
        const existing = (meta.alertes as string[]) || [];
        meta.alertes = [...existing, ...validationAlerts];
        result.meta = meta;
      }

      return corsResponse({ success: true, data: result });
    } catch (error) {
      console.error("[extract-financial] Error:", error);
      await logAiCall(supabase, {
        dossierId: dossier_id,
        modelRequested: "gemini-2.5-pro",
        promptType: "extraction-financial-csn-v3",
        startTime,
        error: String(error),
      });
      return corsResponse({ error: "Financial extraction failed", details: String(error) }, 500);
    }
  } catch (error) {
    console.error("Error:", error);
    return corsResponse({ error: "Internal server error", details: String(error) }, 500);
  }
});
