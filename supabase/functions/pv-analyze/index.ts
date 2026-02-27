import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, x-app-name, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_FILES_BASE = "https://generativelanguage.googleapis.com/upload/v1beta/files";

// ---------- Document type sets for routing ----------
const DIAGNOSTIC_TYPES = new Set([
  "diagnostic_amiante", "diagnostic_plomb", "diagnostic_electricite",
  "diagnostic_gaz", "diagnostic_erp", "diagnostic_termites",
  "diagnostic_mesurage", "audit_energetique", "dpe",
]);

// Phase 1: financial, legal, copro identification
const PHASE1_DOC_TYPES = new Set([
  "pv_ag", "reglement_copropriete", "etat_descriptif_division",
  "appel_fonds", "releve_charges", "fiche_synthetique",
  "carnet_entretien", "taxe_fonciere",
]);

// Phase 2: diagnostics, technical, complementary
const PHASE2_DOC_TYPES = new Set([
  "dpe", "diagnostic_amiante", "diagnostic_plomb", "diagnostic_termites",
  "diagnostic_electricite", "diagnostic_gaz", "diagnostic_erp",
  "diagnostic_mesurage", "audit_energetique", "dtg",
  "plan_pluriannuel", "plan_pluriannuel_travaux",
  "bail", "contrat_assurance",
]);

// Documents useful to both phases
const SHARED_DOC_TYPES = new Set([
  "fiche_synthetique",
]);

// Map keywords found in summary/title to diagnostic types
const DIAG_KEYWORD_MAP: Record<string, string> = {
  "amiante": "diagnostic_amiante",
  "plomb": "diagnostic_plomb",
  "crep": "diagnostic_plomb",
  "termites": "diagnostic_termites",
  "electricite": "diagnostic_electricite",
  "électricité": "diagnostic_electricite",
  "electrique": "diagnostic_electricite",
  "électrique": "diagnostic_electricite",
  "gaz": "diagnostic_gaz",
  "erp": "diagnostic_erp",
  "mesurage": "diagnostic_mesurage",
  "carrez": "diagnostic_mesurage",
  "dpe": "dpe",
  "performance énergétique": "dpe",
  "performance energetique": "dpe",
  "audit énergétique": "audit_energetique",
  "audit energetique": "audit_energetique",
};

// ---------- Prompts ----------
const CLASSIFICATION_PROMPT = `Tu es un expert en copropriété française. Analyse ce document PDF et classifie-le.

Réponds en JSON strict avec cette structure:
{
  "document_type": "<type>",
  "confidence": <0.0 à 1.0>,
  "title": "<titre du document>",
  "date": "<date pertinente du document, format YYYY-MM-DD ou null>",
  "summary": "<résumé en 1 phrase>",
  "diagnostics_couverts": [],
  "dpe_ademe_number": ""
}

INSTRUCTIONS POUR LA DATE:
- La "date" doit être la date la plus PERTINENTE pour identifier le document, PAS la date d'impression ou de génération.
- Pour un PV d'AG : date de l'assemblée générale.
- Pour un relevé de charges ou approbation des comptes : date de DÉBUT de l'exercice comptable concerné (ex: si exercice 01/07/2022 au 30/06/2023, mettre 2022-07-01).
- Pour un appel de fonds/provisions : date de début de la période appelée (ex: si appel pour le 1er trimestre 2023, mettre 2023-01-01).
- Pour un diagnostic technique : date de réalisation du diagnostic.
- Pour un bail : date de début du bail.
- Pour un règlement de copropriété / EDD : date de l'acte notarié ou du dernier modificatif.
- Pour une fiche synthétique : date d'établissement.
- Pour une taxe foncière : année d'imposition (ex: 2023-01-01 pour taxe 2023).
- Pour un contrat d'assurance : date d'effet du contrat.
- IMPORTANT: Ne PAS utiliser la date d'envoi, d'impression ou de génération du document.

INSTRUCTIONS SPÉCIALES POUR LE DPE:
- Si le document EST un DPE ou CONTIENT un DPE (dans un DDT), extrais le numéro ADEME dans "dpe_ademe_number".
- Le numéro ADEME est un identifiant de 13 caractères (lettres et chiffres, ex: 2531E1024432P) situé en haut du rapport DPE, souvent précédé de "N°" ou "Numéro".
- Si aucun DPE n'est présent, laisse dpe_ademe_number vide "".

INSTRUCTIONS CRITIQUES POUR LES DIAGNOSTICS:
- Si le document est un DDT (Dossier de Diagnostics Techniques) regroupant PLUSIEURS diagnostics, choisis le type du premier diagnostic identifié pour "document_type" et liste ABSOLUMENT TOUS les types de diagnostics présents dans "diagnostics_couverts".
- Tu DOIS parcourir CHAQUE PAGE du document pour identifier TOUS les diagnostics présents.
- Types de diagnostics possibles: diagnostic_amiante, diagnostic_plomb, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_termites, diagnostic_mesurage, audit_energetique, dpe
- OBLIGATOIRE: Si le summary mentionne plusieurs diagnostics, diagnostics_couverts DOIT TOUS les lister. Par exemple si le résumé mentionne "amiante, termites, électricité, ERP, DPE et mesurage", diagnostics_couverts doit contenir ["diagnostic_amiante", "diagnostic_termites", "diagnostic_electricite", "diagnostic_erp", "dpe", "diagnostic_mesurage"].
- Si le document ne contient qu'un seul diagnostic, diagnostics_couverts contient uniquement ce type.
- Si le document n'est PAS un diagnostic (bail, PV AG, relevé de charges, taxe foncière, etc.), diagnostics_couverts DOIT être un tableau vide [].
- IMPORTANT: Un bail qui MENTIONNE des diagnostics en annexe ne CONTIENT PAS ces diagnostics. diagnostics_couverts ne doit lister que les diagnostics dont le rapport complet est DANS le PDF.

Types possibles: pv_ag, reglement_copropriete, etat_descriptif_division, appel_fonds, releve_charges, carnet_entretien, dpe, diagnostic_amiante, diagnostic_plomb, diagnostic_termites, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_mesurage, fiche_synthetique, plan_pluriannuel, dtg, taxe_fonciere, bail, contrat_assurance, plan_pluriannuel_travaux, audit_energetique, other`;

// ---------- PHASE 1: Financial, Legal, Copro (Gemini 2.5 Pro) ----------
const EXTRACTION_PHASE1_PROMPT = `Tu es un expert en droit de la copropriété et en transactions immobilières en France.
Tu analyses un ensemble de documents FINANCIERS et JURIDIQUES relatifs à une vente en copropriété pour générer la partie financière et juridique du pré-état daté conforme au modèle CSN (Conseil Supérieur du Notariat).

INSTRUCTIONS IMPORTANTES:
1. Le LOT CONCERNÉ par la vente est indiqué dans le CONTEXTE DU LOT VENDU ci-dessous. Si aucun contexte n'est fourni, identifie le lot à partir des appels de fonds, relevés de charges ou du règlement de copropriété.
2. Les APPELS DE FONDS et RELEVÉS DE CHARGES contiennent les montants financiers SPÉCIFIQUES AU LOT vendu (charges courantes, charges exceptionnelles, cotisation fonds de travaux, provisions). Extrais ces montants pour le lot identifié.
3. Si un document contient des données pour PLUSIEURS lots, extrais UNIQUEMENT les montants correspondant au(x) lot(s) indiqué(s) dans le CONTEXTE DU LOT VENDU. Ignore totalement les lignes financières des autres lots, même s'ils appartiennent au même propriétaire. N'additionne les charges de plusieurs lots QUE si plusieurs numéros de lots sont explicitement listés dans le contexte de la vente.
4. Pour les montants financiers, utilise les montants ANNUELS.
5. Si un appel de fonds montre un montant trimestriel, multiplie par 4 pour obtenir le montant annuel. Si mensuel, multiplie par 12.

INSTRUCTIONS CRITIQUES POUR LES TANTIÈMES:
- Extrais les tantièmes de PARTIES COMMUNES GÉNÉRALES (PCG) du lot vendu. C'est la clé de répartition principale.
- ATTENTION: Une copropriété peut avoir PLUSIEURS clés de répartition (parties communes générales, ascenseur, chauffage, espaces verts, bâtiment, etc.). Tu dois extraire la clé "parties communes générales" ou "charges générales", PAS une clé spéciale ou secondaire.
- Cherche dans le règlement de copropriété, l'état descriptif de division ET les appels de fonds. Recoupé les valeurs entre ces documents.
- Le total des tantièmes de la copropriété est généralement 1000, 10000 ou 100000 — trouve cette valeur dans les mêmes documents.
- Extrais tantiemes_generaux dans "lot" ET tantiemes_totaux dans "copropriete".
- Si tu ne trouves pas les tantièmes exacts, cherche des indices dans les quotes-parts ou les pourcentages de répartition.
- VÉRIFICATION OBLIGATOIRE: Après extraction, vérifie que (tantiemes_generaux / tantiemes_totaux) × budget_previsionnel_annuel ≈ charges_courantes_lot (tolérance ±15%). Si l'écart est supérieur, tu as probablement extrait les mauvais tantièmes — cherche à nouveau dans tous les documents.

INSTRUCTIONS POUR LE CALCUL DES CHARGES ET PROVISIONS:
- charges_courantes_lot = montant ANNUEL des charges courantes pour le lot vendu. Vérifie avec la formule : (tantiemes_generaux / tantiemes_totaux) × budget_previsionnel_annuel.
- charges_budget_n1 et charges_budget_n2 = charges ANNUELLES du lot pour les deux derniers exercices CLOS (n-1 et n-2). Extrais ces valeurs des relevés de charges ou approbations de comptes en AG.
- provisions_exigibles = total des provisions du budget prévisionnel exigibles pour l'exercice EN COURS à la date actuelle. Calcule à partir de l'appel de fonds : provisions appelées pour l'exercice en cours. Si tu trouves un appel trimestriel, multiplie par le nombre de trimestres écoulés ou appelés.
- exercice_en_cours.provisions_appelees = montant total des provisions appelées pour l'exercice comptable en cours.
- exercice_en_cours.provisions_versees = montant total des provisions versées par le vendeur pour l'exercice en cours.
- IMPORTANT: Ne confonds pas les montants par période (trimestriel/mensuel) avec les montants annuels.

INSTRUCTIONS POUR LES SOURCES:
- Pour chaque champ financier critique, remplis le champ "_source" correspondant avec la référence exacte du document et de la ligne où tu as trouvé la valeur.
- Format: "NomDocument, section/ligne/page: valeur brute lue". Exemple: "Appel de fonds T1 2025, lot 4032, ligne provisions générales: 462.50 EUR/trimestre × 4"
- Si tu ne trouves pas la valeur dans un document, mets la source à "" et la valeur à null. NE JAMAIS INVENTER une valeur sans source.

INSTRUCTIONS SPÉCIFIQUES CSN:
- immatriculation_rnc: numéro d'immatriculation au Registre National des Copropriétés (RNC), attribué par l'ANAH. Souvent sur la fiche synthétique.
- nombre_copropriétaires: nombre de copropriétaires dans la copropriété (différent du nombre de lots).
- syndic_type: "professionnel" ou "bénévole".
- syndic_mandat_fin: date de fin du mandat du syndic en cours.
- assurance_multirisque: nom de la compagnie d'assurance multirisque de l'immeuble.
- assurance_numero_contrat: numéro du contrat d'assurance multirisque.
- prochaine_ag_date: date de la prochaine assemblée générale si connue.
- copropriete_en_difficulte: true si la copropriété fait l'objet d'une procédure au titre de l'article 29-1A, false sinon.
- copropriete_difficulte_details: détails de la procédure si applicable.
- fibre_optique: true si l'immeuble est raccordé à la fibre optique, false sinon, null si non mentionné.
- date_construction: année ou date de construction de l'immeuble.
- nombre_lots_copropriete: nombre total de lots dans la copropriété (tous types confondus).
- fonds_travaux_taux: taux de cotisation au fonds de travaux en pourcentage du budget prévisionnel (minimum légal 2.5%, potentiellement 5% après PPT).
- emprunt_collectif_solde: solde restant dû d'un emprunt collectif souscrit par le syndicat.
- emprunt_collectif_objet: objet de l'emprunt collectif (travaux de ravalement, rénovation énergétique, etc.).
- emprunt_collectif_echeance: date d'échéance de l'emprunt collectif.
- cautionnement_solidaire: true si le lot est soumis à un cautionnement solidaire, false sinon.

Extrais les informations en JSON strict:
{
  "copropriete": {
    "nom": "",
    "adresse": "",
    "immatriculation_rnc": "",
    "syndic_nom": "",
    "syndic_adresse": "",
    "syndic_type": "",
    "syndic_mandat_fin": "",
    "assurance_multirisque": "",
    "assurance_numero_contrat": "",
    "nombre_lots_copropriete": null,
    "nombre_copropriétaires": null,
    "nombre_batiments": null,
    "date_reglement": "",
    "tantiemes_totaux": null,
    "tantiemes_totaux_source": "",
    "prochaine_ag_date": "",
    "copropriete_en_difficulte": false,
    "copropriete_difficulte_details": "",
    "fibre_optique": null,
    "date_construction": ""
  },
  "lot": {
    "numero": "",
    "type": "appartement|parking|cave|local_commercial",
    "etage": "",
    "surface_carrez": null,
    "tantiemes_generaux": null,
    "tantiemes_generaux_source": "",
    "tantiemes_speciaux": null
  },
  "financier": {
    "budget_previsionnel_annuel": null,
    "budget_previsionnel_annuel_source": "",
    "charges_courantes_lot": null,
    "charges_courantes_lot_source": "",
    "charges_exceptionnelles_lot": null,
    "charges_exceptionnelles_lot_source": "",
    "charges_budget_n1": null,
    "charges_budget_n1_source": "",
    "charges_budget_n2": null,
    "charges_budget_n2_source": "",
    "charges_hors_budget_n1": null,
    "charges_hors_budget_n2": null,
    "fonds_travaux_exists": null,
    "fonds_travaux_solde": null,
    "fonds_travaux_solde_source": "",
    "fonds_travaux_cotisation_annuelle": null,
    "fonds_travaux_cotisation_annuelle_source": "",
    "fonds_travaux_taux": null,
    "provisions_exigibles": null,
    "provisions_exigibles_source": "",
    "avances_reserve": null,
    "provisions_speciales": null,
    "impayes_vendeur": null,
    "impayes_vendeur_source": "",
    "impaye_charges_global": null,
    "dette_copro_fournisseurs": null,
    "dette_fournisseurs_global": null,
    "avances_remboursables": null,
    "emprunt_collectif_solde": null,
    "emprunt_collectif_objet": "",
    "emprunt_collectif_echeance": "",
    "cautionnement_solidaire": false,
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
  "meta_phase1": {
    "documents_analyses": [],
    "donnees_manquantes": [],
    "alertes": [],
    "confiance_globale": 0.0
  }
}

RÈGLES:
- charges_courantes_lot = total annuel des charges courantes pour le lot vendu.
- fonds_travaux_cotisation_annuelle = cotisation annuelle au fonds de travaux ALUR pour le lot.
- fonds_travaux_solde = solde du fonds de travaux de la copropriété.
- fonds_travaux_taux = pourcentage de la cotisation par rapport au budget prévisionnel. Calcule: (fonds_travaux_cotisation_annuelle_totale_copro / budget_previsionnel_annuel) × 100.
- tantiemes_totaux = nombre total de tantièmes de la copropriété (clé parties communes générales).
- tantiemes_generaux = tantièmes de PARTIES COMMUNES GÉNÉRALES du lot vendu. ATTENTION: ne PAS utiliser des tantièmes spéciaux (ascenseur, chauffage, espaces verts, bâtiment spécifique). Utilise UNIQUEMENT la clé de répartition principale "parties communes générales" ou "charges générales".
- VÉRIFICATION CROISÉE OBLIGATOIRE: Si tu as extrait tantiemes_generaux, tantiemes_totaux ET budget_previsionnel_annuel, vérifie que charges_courantes_lot ≈ (tantiemes_generaux / tantiemes_totaux) × budget_previsionnel_annuel. Si l'écart est > 15%, relis les documents et corrige les tantièmes ou le budget. Ajoute une alerte dans meta_phase1.alertes si l'écart persiste.
- travaux_a_venir_votes = tableau d'objets {description, montant_total, quote_part_lot} pour chaque travaux voté en AG. IMPORTANT: inclure systématiquement la quote_part_lot (part du lot) pour chaque travaux voté.
- Si tu NE TROUVES PAS une valeur dans les documents, mets null et "" pour la source. NE JAMAIS INVENTER un montant.
- Si tu détectes des incohérences entre documents, ajoute une alerte dans meta_phase1.alertes.
- Réponds UNIQUEMENT avec le JSON, sans commentaire ni texte autour.`;

// ---------- PHASE 2: Diagnostics & Technical (Gemini 2.5 Flash) ----------
const EXTRACTION_PHASE2_PROMPT = `Tu es un expert en diagnostics immobiliers et en réglementation technique de la copropriété en France.
Tu analyses un ensemble de documents TECHNIQUES et DIAGNOSTICS relatifs à une vente en copropriété pour compléter le pré-état daté.

INSTRUCTIONS:
- Pour chaque diagnostic présent, extrais la DATE de réalisation et le résultat principal.
- Pour le DPE, extrais le numéro ADEME, les classes énergie et GES.
- Pour le DTG, extrais la date et le résumé des conclusions.
- Pour le PPT (Plan Pluriannuel de Travaux), indique s'il a été adopté et résume les actions prévues.
- Si un bail est fourni, extrais les informations clés (type, loyer, dates, dépôt de garantie).
- Si un contrat d'assurance est fourni, extrais la compagnie et le numéro de contrat.
- diagnostics_couverts = liste des types de diagnostics dont tu as trouvé le document. Types possibles: diagnostic_amiante, diagnostic_plomb, diagnostic_electricite, diagnostic_gaz, diagnostic_erp, diagnostic_termites, diagnostic_mesurage, audit_energetique, dpe.
- Si une information n'est pas trouvée, mets null ou "".

Extrais les informations en JSON strict:
{
  "diagnostics": {
    "dpe_numero_ademe": "",
    "dpe_date": "",
    "dpe_classe_energie": "",
    "dpe_classe_ges": "",
    "amiante_dta_date": "",
    "plomb_date": "",
    "termites_date": "",
    "carrez_surface": null,
    "dtg_date": "",
    "dtg_resultat": "",
    "plan_pluriannuel_exists": null,
    "plan_pluriannuel_details": "",
    "audit_energetique_date": "",
    "ascenseur_exists": null,
    "ascenseur_rapport_date": "",
    "piscine_exists": null,
    "recharge_vehicules": null,
    "electricite_date": "",
    "gaz_date": "",
    "erp_date": "",
    "mesurage_date": "",
    "diagnostics_couverts": []
  },
  "bail": {
    "exists": false,
    "type": "",
    "date_debut": "",
    "date_fin": "",
    "loyer_mensuel": null,
    "depot_garantie": null,
    "locataire_nom": ""
  },
  "assurance": {
    "compagnie": "",
    "numero_contrat": "",
    "date_effet": "",
    "date_echeance": ""
  },
  "meta_phase2": {
    "documents_analyses": [],
    "donnees_manquantes": [],
    "alertes": [],
    "confiance_globale": 0.0
  }
}

Réponds UNIQUEMENT avec le JSON, sans commentaire ni texte autour.`;

// ---------- Helpers ----------

// Upload a file to Gemini File API using resumable upload protocol (2-step)
async function uploadToGeminiFileApi(
  apiKey: string,
  base64: string,
  displayName: string,
): Promise<string> {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Step 1: Initiate resumable upload
  const startRes = await fetch(`${GEMINI_FILES_BASE}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": String(bytes.length),
      "X-Goog-Upload-Header-Content-Type": "application/pdf",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file: { displayName } }),
  });

  if (!startRes.ok) {
    const errorText = await startRes.text();
    throw new Error(`Gemini File API start failed (${startRes.status}): ${errorText}`);
  }

  const uploadUrl = startRes.headers.get("X-Goog-Upload-URL");
  if (!uploadUrl) {
    throw new Error("No upload URL returned by Gemini File API");
  }

  // Step 2: Upload the raw bytes
  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Content-Length": String(bytes.length),
      "X-Goog-Upload-Offset": "0",
      "X-Goog-Upload-Command": "upload, finalize",
    },
    body: bytes,
  });

  if (!uploadRes.ok) {
    const errorText = await uploadRes.text();
    throw new Error(`Gemini File API upload failed (${uploadRes.status}): ${errorText}`);
  }

  const result = await uploadRes.json();
  const uri = result.file?.uri;
  if (!uri) throw new Error("No file URI in upload response");
  return uri;
}

// Call Gemini with retry on 429 rate limits (Fix 1b)
async function callGemini(
  apiKey: string,
  model: string,
  parts: unknown[],
): Promise<unknown> {
  const url = `${GEMINI_BASE}/${model}:generateContent?key=${apiKey}`;
  const MAX_RETRIES = 2;
  const RETRY_DELAYS = [2000, 5000]; // 2s, 5s

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
        },
      }),
    });

    if (response.status === 429 && attempt < MAX_RETRIES) {
      const delay = RETRY_DELAYS[attempt];
      console.warn(`[callGemini] 429 rate limit on ${model}, retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`);
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error("No text in Gemini response");
    }

    return JSON.parse(text);
  }

  throw new Error(`Gemini API: max retries (${MAX_RETRIES}) exceeded for ${model}`);
}

function extractDiagsFromText(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const [keyword, diagType] of Object.entries(DIAG_KEYWORD_MAP)) {
    if (lower.includes(keyword.toLowerCase())) {
      found.add(diagType);
    }
  }
  return Array.from(found);
}

function normalizeClassification(raw: unknown): Record<string, unknown> {
  if (Array.isArray(raw) && raw.length > 0) {
    const first = raw[0] as Record<string, unknown>;
    const allTypes = raw
      .map((item: Record<string, unknown>) => item.document_type as string)
      .filter(Boolean);
    let dpeAdemeNumber = "";
    for (const item of raw) {
      const r = item as Record<string, unknown>;
      if (r.dpe_ademe_number && typeof r.dpe_ademe_number === 'string' && r.dpe_ademe_number.length > 0) {
        dpeAdemeNumber = r.dpe_ademe_number as string;
        break;
      }
    }
    console.log(`[classify] Normalized array of ${raw.length} diagnostics: ${allTypes.join(', ')}`);
    return {
      ...first,
      diagnostics_couverts: allTypes,
      dpe_ademe_number: dpeAdemeNumber || first.dpe_ademe_number || "",
    };
  }

  const obj = raw as Record<string, unknown>;
  const docType = obj.document_type as string;
  const covered = (obj.diagnostics_couverts as string[]) || [];
  const summary = (obj.summary as string) || "";
  const title = (obj.title as string) || "";

  if (docType && !DIAGNOSTIC_TYPES.has(docType)) {
    console.log(`[classify] Non-diagnostic type '${docType}': clearing diagnostics_couverts`);
    return { ...obj, diagnostics_couverts: [] };
  }

  const textDiags = extractDiagsFromText(summary + " " + title);
  const mergedSet = new Set<string>([...covered, ...textDiags]);
  if (docType && DIAGNOSTIC_TYPES.has(docType)) {
    mergedSet.add(docType);
  }
  const mergedArray = Array.from(mergedSet);
  if (mergedArray.length !== covered.length) {
    console.log(`[classify] Enriched diagnostics_couverts from ${covered.length} to ${mergedArray.length}: ${mergedArray.join(', ')}`);
  }
  return { ...obj, diagnostics_couverts: mergedArray };
}

// deno-lint-ignore no-explicit-any
async function logAiCall(
  supabase: any,
  dossierId: string | undefined,
  model: string,
  promptType: string,
  startTime: number,
  result: unknown,
  error?: string,
) {
  if (!dossierId || !supabase) return;
  const latencyMs = Date.now() - startTime;
  try {
    await supabase.from("pv_ai_logs").insert({
      dossier_id: dossierId,
      model,
      prompt_type: promptType,
      latency_ms: latencyMs,
      response_payload: result
        ? { preview: JSON.stringify(result).substring(0, 2000) }
        : null,
      error: error || null,
    });
  } catch (e) {
    console.error("Failed to log AI call:", e);
  }
}

function buildQuestionnaireContext(q: Record<string, unknown>): string {
  if (!q || typeof q !== 'object') return '';

  const lines: string[] = [];
  lines.push('\nCONTEXTE DU QUESTIONNAIRE VENDEUR:');

  const occ = q.occupation as Record<string, unknown> | undefined;
  if (occ) {
    if (occ.occupant_actuel === 'locataire' || occ.bail_en_cours === true) {
      lines.push('- Le bien est LOUÉ. Un bail est en cours. Cherche les informations du bail dans les documents (loyer, dépôt de garantie, dates, type de bail).');
      if (occ.bail_type) lines.push(`  Type de bail : ${occ.bail_type}`);
      if (occ.loyer_mensuel) lines.push(`  Loyer mensuel déclaré : ${occ.loyer_mensuel} €`);
    } else if (occ.occupant_actuel === 'proprietaire') {
      lines.push('- Le bien est occupé par le propriétaire (résidence principale ou secondaire).');
    } else if (occ.occupant_actuel === 'vacant') {
      lines.push('- Le bien est actuellement vacant.');
    }
  }

  const copro = q.copropriete_questions as Record<string, unknown> | undefined;
  if (copro) {
    if (copro.association_syndicale === true) {
      lines.push('- Une ASL (Association Syndicale Libre) ou AFUL existe. Cherche dans les documents les charges et règlements de l\'ASL en complément de la copropriété.');
      if (copro.association_syndicale_details) {
        lines.push(`  Détails ASL : ${copro.association_syndicale_details}`);
      }
    }
    if (copro.volume_ou_lotissement === true) {
      lines.push('- Le bien fait partie d\'un volume ou lotissement.');
    }
  }

  const trav = q.travaux as Record<string, unknown> | undefined;
  if (trav && trav.travaux_realises === true) {
    lines.push('- Le vendeur a réalisé des travaux privatifs dans le lot.');
    if (trav.travaux_realises_details) {
      lines.push(`  Description : ${trav.travaux_realises_details}`);
    }
  }

  const prets = q.prets as Record<string, unknown> | undefined;
  if (prets) {
    if (prets.pret_hypothecaire === true) {
      lines.push('- Un prêt hypothécaire existe sur le bien.');
    }
    if (prets.saisie_en_cours === true) {
      lines.push('- ATTENTION: Une saisie immobilière est en cours.');
    }
  }

  const sin = q.sinistres as Record<string, unknown> | undefined;
  if (sin) {
    if (sin.sinistre_indemnise === true) lines.push('- Un sinistre indemnisé est déclaré.');
    if (sin.catastrophe_naturelle === true) lines.push('- Une catastrophe naturelle a été déclarée.');
    if (sin.degat_des_eaux === true) lines.push('- Un dégât des eaux est déclaré.');
  }

  const fisc = q.fiscal as Record<string, unknown> | undefined;
  if (fisc && fisc.dispositif_fiscal && fisc.dispositif_fiscal !== 'aucun') {
    lines.push(`- Dispositif fiscal en cours : ${fisc.dispositif_fiscal}`);
  }

  if (lines.length <= 1) return '';
  return lines.join('\n');
}

// ---------- Document routing ----------
interface DocInput {
  base64: string;
  normalized_filename?: string;
  original_filename: string;
  document_type: string;
}

// Fix 1a: Shared docs correctly go to both phases
function routeDocuments(documents: DocInput[]): { phase1Docs: DocInput[]; phase2Docs: DocInput[] } {
  const phase1Docs: DocInput[] = [];
  const phase2Docs: DocInput[] = [];

  for (const doc of documents) {
    const docType = doc.document_type;
    const inPhase1 = PHASE1_DOC_TYPES.has(docType);
    const inPhase2 = PHASE2_DOC_TYPES.has(docType);
    const isShared = SHARED_DOC_TYPES.has(docType);

    if (inPhase1) {
      phase1Docs.push(doc);
    }
    if (inPhase2) {
      phase2Docs.push(doc);
    }

    // Shared docs: ensure they go to BOTH phases
    if (isShared) {
      if (!inPhase1) phase1Docs.push(doc);
      if (!inPhase2) phase2Docs.push(doc);
    }

    // Unknown types go to phase 1 by default
    if (!inPhase1 && !inPhase2 && !isShared) {
      console.log(`[route] Unknown doc type '${docType}' for ${doc.original_filename} -> phase 1`);
      phase1Docs.push(doc);
    }
  }

  return { phase1Docs, phase2Docs };
}

// ---------- Post-extraction basic validation ----------
function validatePhase1(data: Record<string, unknown>): string[] {
  const alerts: string[] = [];
  const lot = data.lot as Record<string, unknown> | undefined;
  const financier = data.financier as Record<string, unknown> | undefined;
  const copro = data.copropriete as Record<string, unknown> | undefined;

  if (!lot || !financier || !copro) return alerts;

  const tantLot = lot.tantiemes_generaux as number | null;
  const tantTotal = copro.tantiemes_totaux as number | null;
  const budget = financier.budget_previsionnel_annuel as number | null;
  const charges = financier.charges_courantes_lot as number | null;

  // Check tantiemes coherence
  if (tantLot != null && tantTotal != null) {
    if (tantLot >= tantTotal) {
      alerts.push(`ERREUR: tantièmes du lot (${tantLot}) >= tantièmes totaux (${tantTotal}). Vérifier les données.`);
    }
    if (tantLot <= 0) {
      alerts.push(`ERREUR: tantièmes du lot (${tantLot}) <= 0. Valeur incohérente.`);
    }
  }

  // Cross-check charges vs tantiemes x budget
  if (tantLot != null && tantTotal != null && budget != null && charges != null && tantTotal > 0) {
    const expectedCharges = (tantLot / tantTotal) * budget;
    const ecart = Math.abs(charges - expectedCharges) / expectedCharges;
    if (ecart > 0.15) {
      alerts.push(`ALERTE: écart de ${Math.round(ecart * 100)}% entre charges lot (${charges} EUR) et calcul tantièmes x budget (${Math.round(expectedCharges)} EUR). Vérifier les tantièmes ou le budget.`);
    }
  }

  // Check charges > 0
  if (charges != null && charges <= 0) {
    alerts.push(`ERREUR: charges courantes du lot (${charges} EUR) <= 0. Valeur incohérente.`);
  }

  // Check exercice dates
  const exEnCours = financier.exercice_en_cours as Record<string, unknown> | undefined;
  if (exEnCours) {
    const debut = exEnCours.debut as string;
    const fin = exEnCours.fin as string;
    if (debut && fin && debut >= fin) {
      alerts.push(`ERREUR: date début exercice en cours (${debut}) >= date fin (${fin}).`);
    }
  }

  return alerts;
}

// ---------- Merge phase 1 + phase 2 results ----------
function mergeResults(
  phase1: Record<string, unknown>,
  phase2: Record<string, unknown>,
): Record<string, unknown> {
  const meta1 = phase1.meta_phase1 as Record<string, unknown> || { documents_analyses: [], donnees_manquantes: [], alertes: [], confiance_globale: 0 };
  const meta2 = phase2.meta_phase2 as Record<string, unknown> || { documents_analyses: [], donnees_manquantes: [], alertes: [], confiance_globale: 0 };

  // Merge assurance data from phase 2 into copropriete if phase 1 didn't get it
  const copro = phase1.copropriete as Record<string, unknown> || {};
  const assurance = phase2.assurance as Record<string, unknown> || {};
  if (!copro.assurance_multirisque && assurance.compagnie) {
    copro.assurance_multirisque = assurance.compagnie;
  }
  if (!copro.assurance_numero_contrat && assurance.numero_contrat) {
    copro.assurance_numero_contrat = assurance.numero_contrat;
  }

  // Merge meta
  const mergedMeta = {
    documents_analyses: [
      ...((meta1.documents_analyses as string[]) || []),
      ...((meta2.documents_analyses as string[]) || []),
    ],
    donnees_manquantes: [
      ...((meta1.donnees_manquantes as string[]) || []),
      ...((meta2.donnees_manquantes as string[]) || []),
    ],
    alertes: [
      ...((meta1.alertes as string[]) || []),
      ...((meta2.alertes as string[]) || []),
    ],
    confiance_globale: Math.min(
      (meta1.confiance_globale as number) || 0,
      (meta2.confiance_globale as number) || 0,
    ),
  };

  return {
    copropriete: copro,
    lot: phase1.lot,
    financier: phase1.financier,
    juridique: phase1.juridique,
    diagnostics: phase2.diagnostics,
    bail: phase2.bail,
    meta: mergedMeta,
  };
}

// ---------- Main handler ----------
Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const geminiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiKey) {
      console.error("GEMINI_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "Server configuration error (Gemini)" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabase =
      supabaseUrl && supabaseServiceKey
        ? createClient(supabaseUrl, supabaseServiceKey)
        : null;

    const body = await req.json();

    // ==================== CLASSIFY ====================
    if (body.action === "classify") {
      const { file_base64, filename, dossier_id } = body;

      if (!file_base64 || !filename) {
        return new Response(
          JSON.stringify({ error: "file_base64 and filename are required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      console.log(`[classify] Processing: ${filename}`);
      const startTime = Date.now();

      try {
        const parts = [
          { text: `${CLASSIFICATION_PROMPT}\n\nFichier: ${filename}` },
          { inlineData: { data: file_base64, mimeType: "application/pdf" } },
        ];

        const rawResult = await callGemini(geminiKey, "gemini-2.0-flash", parts);
        const result = normalizeClassification(rawResult);

        await logAiCall(supabase, dossier_id, "gemini-2.0-flash", "classification", startTime, result);

        const covered = result.diagnostics_couverts as string[] || [];
        const dpeNum = result.dpe_ademe_number as string || '';
        console.log(
          `[classify] Done: ${filename} -> ${result.document_type} (${result.confidence})${covered.length > 1 ? ` [DDT: ${covered.join(', ')}]` : ''}${dpeNum ? ` [DPE ADEME: ${dpeNum}]` : ''}`,
        );

        return new Response(
          JSON.stringify({ success: true, data: result }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        console.error(`[classify] Error for ${filename}:`, error);
        await logAiCall(supabase, dossier_id, "gemini-2.0-flash", "classification", startTime, null, String(error));
        return new Response(
          JSON.stringify({ error: "Classification failed", details: String(error) }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // ==================== EXTRACT (2-pass) ====================
    if (body.action === "extract") {
      const { documents, dossier_id, lot_number, property_address, questionnaire_context } = body;

      if (!documents || documents.length === 0) {
        return new Response(
          JSON.stringify({ error: "documents array is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      console.log(`[extract] Processing ${documents.length} documents (2-pass mode)`);
      if (lot_number) console.log(`[extract] Lot context: ${lot_number}`);
      if (questionnaire_context) console.log(`[extract] Questionnaire context provided`);

      const startTime = Date.now();

      try {
        // Step 1: Route documents to phases
        const { phase1Docs, phase2Docs } = routeDocuments(documents as DocInput[]);
        console.log(`[extract] Routed: ${phase1Docs.length} docs to phase 1, ${phase2Docs.length} docs to phase 2`);

        // Step 2: Upload ALL unique documents to Gemini File API in parallel
        const allDocs = documents as DocInput[];
        const uploadStart = Date.now();
        console.log(`[extract] Uploading ${allDocs.length} files to Gemini File API...`);

        const fileUriMap = new Map<string, string>();
        const uploadPromises = allDocs.map(async (doc: DocInput) => {
          const key = doc.normalized_filename || doc.original_filename;
          const uri = await uploadToGeminiFileApi(geminiKey, doc.base64, key);
          fileUriMap.set(key, uri);
        });
        await Promise.all(uploadPromises);

        const uploadDuration = Date.now() - uploadStart;
        console.log(`[extract] Uploaded ${fileUriMap.size} files in ${uploadDuration}ms`);

        // ---------- PHASE 1: Financial/Legal (Gemini 2.5 Pro) ----------
        console.log(`[extract] === PHASE 1: Financial/Legal (${phase1Docs.length} docs) ===`);
        const phase1Start = Date.now();

        let phase1Prompt = EXTRACTION_PHASE1_PROMPT;

        if (lot_number || property_address) {
          phase1Prompt += `\n\nCONTEXTE DU LOT VENDU:`;
          if (lot_number) phase1Prompt += `\n- Numéro(s) de lot concerné(s) par la vente: ${lot_number}`;
          if (property_address) phase1Prompt += `\n- Adresse du bien: ${property_address}`;
          phase1Prompt += `\n\nCONCENTRE TON ANALYSE EXCLUSIVEMENT SUR LE(S) LOT(S) SUIVANT(S): lot ${lot_number || 'indiqué'}.`;
          phase1Prompt += `\nRÈGLE ABSOLUE: Si un document (appel de fonds, relevé de charges, etc.) contient des lignes pour d'autres lots (même du même propriétaire), tu DOIS les ignorer complètement. Extrais UNIQUEMENT les montants, tantièmes et provisions du/des lot(s) listé(s) ci-dessus.`;
          phase1Prompt += `\nNe jamais additionner les charges d'autres lots non listés ici.`;
        }

        if (questionnaire_context && typeof questionnaire_context === 'object') {
          const qContext = buildQuestionnaireContext(questionnaire_context as Record<string, unknown>);
          if (qContext) {
            phase1Prompt += `\n${qContext}`;
            phase1Prompt += `\n\nUtilise ces informations du questionnaire vendeur pour orienter ton analyse des documents.`;
            phase1Prompt += `\nSi le bien est loué, cherche activement les informations du bail.`;
            phase1Prompt += `\nSi une ASL/AFUL existe, mentionne-la dans les alertes et données manquantes si aucun document ASL n'est fourni.`;
          }
        }

        // Fix 1c: Label BEFORE PDF for better Gemini comprehension
        const phase1Parts: unknown[] = [{ text: phase1Prompt }];
        for (const doc of phase1Docs) {
          const key = doc.normalized_filename || doc.original_filename;
          const uri = fileUriMap.get(key);
          if (uri) {
            phase1Parts.push({ text: `[Document: ${key} - Type: ${doc.document_type}]` });
            phase1Parts.push({ fileData: { fileUri: uri, mimeType: "application/pdf" } });
          }
        }

        const phase1Result = await callGemini(geminiKey, "gemini-2.5-pro", phase1Parts) as Record<string, unknown>;
        const phase1Duration = Date.now() - phase1Start;
        await logAiCall(supabase, dossier_id, "gemini-2.5-pro", "extraction-phase1", startTime, phase1Result);
        console.log(`[extract] Phase 1 done in ${phase1Duration}ms`);

        // Post-extraction validation
        const validationAlerts = validatePhase1(phase1Result);
        if (validationAlerts.length > 0) {
          console.log(`[extract] Validation alerts: ${validationAlerts.join(' | ')}`);
          const meta1 = phase1Result.meta_phase1 as Record<string, unknown> || { alertes: [] };
          const existingAlerts = (meta1.alertes as string[]) || [];
          meta1.alertes = [...existingAlerts, ...validationAlerts];
          phase1Result.meta_phase1 = meta1;
        }

        // ---------- PHASE 2: Diagnostics/Technical (Gemini 2.5 Flash) ----------
        // Fix 1d: Default empty Phase 2 result for graceful fallback
        let phase2Result: Record<string, unknown> = {
          diagnostics: {
            dpe_numero_ademe: "", dpe_date: "", dpe_classe_energie: "", dpe_classe_ges: "",
            amiante_dta_date: "", plomb_date: "", termites_date: "", carrez_surface: null,
            dtg_date: "", dtg_resultat: "", plan_pluriannuel_exists: null, plan_pluriannuel_details: "",
            audit_energetique_date: "", ascenseur_exists: null, ascenseur_rapport_date: "",
            piscine_exists: null, recharge_vehicules: null, electricite_date: "", gaz_date: "",
            erp_date: "", mesurage_date: "", diagnostics_couverts: [],
          },
          bail: { exists: false, type: "", date_debut: "", date_fin: "", loyer_mensuel: null, depot_garantie: null, locataire_nom: "" },
          assurance: { compagnie: "", numero_contrat: "", date_effet: "", date_echeance: "" },
          meta_phase2: { documents_analyses: [], donnees_manquantes: [], alertes: [], confiance_globale: 0 },
        };

        if (phase2Docs.length > 0) {
          console.log(`[extract] === PHASE 2: Diagnostics/Technical (${phase2Docs.length} docs) ===`);
          const phase2Start = Date.now();

          // Fix 1c: Label BEFORE PDF for better Gemini comprehension
          const phase2Parts: unknown[] = [{ text: EXTRACTION_PHASE2_PROMPT }];
          for (const doc of phase2Docs) {
            const key = doc.normalized_filename || doc.original_filename;
            const uri = fileUriMap.get(key);
            if (uri) {
              phase2Parts.push({ text: `[Document: ${key} - Type: ${doc.document_type}]` });
              phase2Parts.push({ fileData: { fileUri: uri, mimeType: "application/pdf" } });
            }
          }

          try {
            phase2Result = await callGemini(geminiKey, "gemini-2.5-flash", phase2Parts) as Record<string, unknown>;
            const phase2Duration = Date.now() - phase2Start;
            await logAiCall(supabase, dossier_id, "gemini-2.5-flash", "extraction-phase2", startTime, phase2Result);
            console.log(`[extract] Phase 2 done in ${phase2Duration}ms`);
          } catch (phase2Error) {
            // Fix 1d: Graceful Phase 2 failure — return Phase 1 with empty diagnostics
            console.error(`[extract] Phase 2 failed, continuing with empty diagnostics:`, phase2Error);
            await logAiCall(supabase, dossier_id, "gemini-2.5-flash", "extraction-phase2", startTime, null, String(phase2Error));
            const meta2 = phase2Result.meta_phase2 as Record<string, unknown>;
            (meta2.alertes as string[]).push(`Phase 2 (diagnostics) a échoué: ${String(phase2Error)}. Les données diagnostics sont incomplètes.`);
          }
        } else {
          console.log(`[extract] No phase 2 documents — skipping diagnostics extraction`);
        }

        // ---------- MERGE ----------
        const merged = mergeResults(phase1Result, phase2Result);
        const totalDuration = Date.now() - startTime;
        console.log(`[extract] Total extraction done in ${totalDuration}ms (upload: ${uploadDuration}ms)`);

        return new Response(
          JSON.stringify({ success: true, data: merged }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } catch (error) {
        console.error("[extract] Error:", error);
        await logAiCall(supabase, dossier_id, "gemini-2.5-pro", "extraction", startTime, null, String(error));
        return new Response(
          JSON.stringify({ error: "Extraction failed", details: String(error) }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Invalid action. Use 'classify' or 'extract'" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: String(error) }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
