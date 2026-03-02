import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { corsHeaders, corsResponse } from "../_shared/cors.ts";
import { callGemini, uploadToGeminiFileApi } from "../_shared/gemini.ts";
import { getSupabase, logAiCall } from "../_shared/logging.ts";

// ---------- Prompt ----------

const EXTRACTION_PROMPT = `Tu es un expert en droit de la copropriété et en transactions immobilières en France.
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

INSTRUCTIONS POUR LES TRAVAUX VOTÉS EN ASSEMBLÉE GÉNÉRALE:
- Cherche dans TOUS les PV d'AG les résolutions ADOPTÉES concernant des travaux (ravalement, toiture, ascenseur, rénovation énergétique, mise aux normes, etc.).
- Pour chaque travaux voté, extrais:
  * description: nature des travaux
  * resolution_ag: référence précise "AG du JJ/MM/AAAA, résolution N°XX"
  * montant_total: coût total voté pour la copropriété
  * quote_part_lot: part du lot vendu (calculée via les tantièmes si non explicite)
  * date_realisation_prevue: date de début ou de fin prévue des travaux si mentionnée, format YYYY-MM-DD
  * echeancier_appels: tableau des appels de fonds prévus par la résolution. Pour chaque échéance: {date: "YYYY-MM-DD", montant_lot: montant pour le lot, appele: true/false}. Un appel est "appele: true" si sa date est ANTÉRIEURE ou ÉGALE à la DATE_REFERENCE ci-dessous.
  * montant_appele_lot: somme des appels déjà émis (appele=true) pour le lot
  * montant_restant_lot: somme des appels à venir (appele=false) pour le lot — C'EST L'INFORMATION CLÉ pour l'acquéreur
- TRÈS IMPORTANT: La résolution d'AG décrit souvent le calendrier des appels de fonds (ex: "appel en 4 échéances trimestrielles à compter du 01/07/2024", "50% à la signature du devis, 50% à la réception"). Traduis systématiquement ce texte en dates concrètes dans echeancier_appels.
- Si la résolution ne précise pas de calendrier d'appels, crée une seule entrée avec la date de la résolution d'AG comme date d'appel et la totalité de la quote_part_lot.
- travaux_votes_non_realises = true si au moins un travaux voté n'est pas encore terminé OU s'il reste des appels de fonds à venir.
- travaux_votes_details = résumé textuel de tous les travaux votés non encore terminés avec montants restants.

INSTRUCTIONS POUR LES PROCÉDURES JUDICIAIRES EN COURS:
- Cherche dans les PV d'AG les résolutions concernant des actions en justice, recouvrements, saisies, mandataires.
- Types de procédures à identifier:
  * Saisie immobilière (recouvrement de charges impayées d'un copropriétaire)
  * Action en recouvrement de charges impayées (citation, commandement de payer, injonction de payer)
  * Contentieux avec un prestataire ou une entreprise de travaux
  * Contentieux avec un copropriétaire (troubles de voisinage, travaux non autorisés)
  * Désignation d'un mandataire ad hoc (article 29-1 de la loi du 10 juillet 1965)
  * Administration provisoire (article 29-1A — copropriété en difficulté)
  * Toute autre action judiciaire mentionnée dans les PV d'AG
- Pour chaque procédure, précise dans procedures_details: qui est visé, nature de la procédure, résolution d'AG de référence, montants en jeu si mentionnés, état d'avancement si connu.
- procedures_en_cours = true si AU MOINS UNE procédure judiciaire est en cours ou a été votée et n'est pas explicitement terminée.
- IMPORTANT: Même si la procédure ne concerne PAS directement le lot vendu (ex: saisie d'un AUTRE copropriétaire), elle DOIT être mentionnée car elle impacte la vie de la copropriété et doit être portée à la connaissance de l'acquéreur.

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
    "travaux_a_venir_votes": [
      {
        "description": "",
        "resolution_ag": "",
        "montant_total": null,
        "quote_part_lot": null,
        "date_realisation_prevue": "",
        "echeancier_appels": [
          {"date": "YYYY-MM-DD", "montant_lot": null, "appele": false}
        ],
        "montant_appele_lot": null,
        "montant_restant_lot": null
      }
    ],
    "sinistres_en_cours": false,
    "sinistres_details": ""
  },
  "meta": {
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
- VÉRIFICATION CROISÉE OBLIGATOIRE: Si tu as extrait tantiemes_generaux, tantiemes_totaux ET budget_previsionnel_annuel, vérifie que charges_courantes_lot ≈ (tantiemes_generaux / tantiemes_totaux) × budget_previsionnel_annuel. Si l'écart est > 15%, relis les documents et corrige les tantièmes ou le budget. Ajoute une alerte dans meta.alertes si l'écart persiste.
- travaux_a_venir_votes = tableau d'objets détaillés pour chaque travaux voté en AG. Chaque objet DOIT contenir: description, resolution_ag, montant_total, quote_part_lot, date_realisation_prevue, echeancier_appels (tableau de {date, montant_lot, appele}), montant_appele_lot, montant_restant_lot. Si aucun travaux n'est trouvé, laisser un tableau vide []. NE PAS inclure l'objet exemple avec des valeurs vides.
- Si tu NE TROUVES PAS une valeur dans les documents, mets null et "" pour la source. NE JAMAIS INVENTER un montant.
- Si tu détectes des incohérences entre documents, ajoute une alerte dans meta.alertes.
- Réponds UNIQUEMENT avec le JSON, sans commentaire ni texte autour.`;

// ---------- Helpers ----------

interface DocInput {
  base64: string;
  normalized_filename?: string;
  original_filename: string;
  document_type: string;
}

function buildQuestionnaireContext(q: Record<string, unknown>): string {
  if (!q || typeof q !== "object") return "";

  const lines: string[] = [];
  lines.push("\nCONTEXTE DU QUESTIONNAIRE VENDEUR:");

  const occ = q.occupation as Record<string, unknown> | undefined;
  if (occ) {
    if (occ.occupant_actuel === "locataire" || occ.bail_en_cours === true) {
      lines.push("- Le bien est LOUÉ. Un bail est en cours. Cherche les informations du bail dans les documents (loyer, dépôt de garantie, dates, type de bail).");
      if (occ.bail_type) lines.push(`  Type de bail : ${occ.bail_type}`);
      if (occ.loyer_mensuel) lines.push(`  Loyer mensuel déclaré : ${occ.loyer_mensuel} €`);
    } else if (occ.occupant_actuel === "proprietaire") {
      lines.push("- Le bien est occupé par le propriétaire (résidence principale ou secondaire).");
    } else if (occ.occupant_actuel === "vacant") {
      lines.push("- Le bien est actuellement vacant.");
    }
  }

  const copro = q.copropriete_questions as Record<string, unknown> | undefined;
  if (copro) {
    if (copro.association_syndicale === true) {
      lines.push("- Une ASL (Association Syndicale Libre) ou AFUL existe. Cherche dans les documents les charges et règlements de l'ASL en complément de la copropriété.");
      if (copro.association_syndicale_details) {
        lines.push(`  Détails ASL : ${copro.association_syndicale_details}`);
      }
    }
    if (copro.volume_ou_lotissement === true) {
      lines.push("- Le bien fait partie d'un volume ou lotissement.");
    }
  }

  const trav = q.travaux as Record<string, unknown> | undefined;
  if (trav && trav.travaux_realises === true) {
    lines.push("- Le vendeur a réalisé des travaux privatifs dans le lot.");
    if (trav.travaux_realises_details) {
      lines.push(`  Description : ${trav.travaux_realises_details}`);
    }
  }

  const prets = q.prets as Record<string, unknown> | undefined;
  if (prets) {
    if (prets.pret_hypothecaire === true) {
      lines.push("- Un prêt hypothécaire existe sur le bien.");
    }
    if (prets.saisie_en_cours === true) {
      lines.push("- ATTENTION: Une saisie immobilière est en cours.");
    }
  }

  const sin = q.sinistres as Record<string, unknown> | undefined;
  if (sin) {
    if (sin.sinistre_indemnise === true) lines.push("- Un sinistre indemnisé est déclaré.");
    if (sin.catastrophe_naturelle === true) lines.push("- Une catastrophe naturelle a été déclarée.");
    if (sin.degat_des_eaux === true) lines.push("- Un dégât des eaux est déclaré.");
  }

  const fisc = q.fiscal as Record<string, unknown> | undefined;
  if (fisc && fisc.dispositif_fiscal && fisc.dispositif_fiscal !== "aucun") {
    lines.push(`- Dispositif fiscal en cours : ${fisc.dispositif_fiscal}`);
  }

  if (lines.length <= 1) return "";
  return lines.join("\n");
}

function validateExtraction(data: Record<string, unknown>): string[] {
  const alerts: string[] = [];
  const lot = data.lot as Record<string, unknown> | undefined;
  const financier = data.financier as Record<string, unknown> | undefined;
  const copro = data.copropriete as Record<string, unknown> | undefined;

  if (!lot || !financier || !copro) return alerts;

  const tantLot = lot.tantiemes_generaux as number | null;
  const tantTotal = copro.tantiemes_totaux as number | null;
  const budget = financier.budget_previsionnel_annuel as number | null;
  const charges = financier.charges_courantes_lot as number | null;

  if (tantLot != null && tantTotal != null) {
    if (tantLot >= tantTotal) {
      alerts.push(`ERREUR: tantièmes du lot (${tantLot}) >= tantièmes totaux (${tantTotal}). Vérifier les données.`);
    }
    if (tantLot <= 0) {
      alerts.push(`ERREUR: tantièmes du lot (${tantLot}) <= 0. Valeur incohérente.`);
    }
  }

  if (tantLot != null && tantTotal != null && budget != null && charges != null && tantTotal > 0) {
    const expectedCharges = (tantLot / tantTotal) * budget;
    const ecart = Math.abs(charges - expectedCharges) / expectedCharges;
    if (ecart > 0.15) {
      alerts.push(`ALERTE: écart de ${Math.round(ecart * 100)}% entre charges lot (${charges} EUR) et calcul tantièmes x budget (${Math.round(expectedCharges)} EUR). Vérifier les tantièmes ou le budget.`);
    }
  }

  if (charges != null && charges <= 0) {
    alerts.push(`ERREUR: charges courantes du lot (${charges} EUR) <= 0. Valeur incohérente.`);
  }

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

// ---------- Main handler ----------

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
    const body = await req.json();
    const { documents, dossier_id, lot_number, property_address, questionnaire_context } = body;

    if (!documents || documents.length === 0) {
      return corsResponse({ error: "documents array is required" }, 400);
    }

    console.log(`[extract-financial] Processing ${documents.length} documents`);
    if (lot_number) console.log(`[extract-financial] Lot context: ${lot_number}`);
    if (questionnaire_context) console.log(`[extract-financial] Questionnaire context provided`);

    const startTime = Date.now();

    try {
      // Step 1: Upload documents to Gemini File API in parallel
      const allDocs = documents as DocInput[];
      const uploadStart = Date.now();
      console.log(`[extract-financial] Uploading ${allDocs.length} files to Gemini File API...`);

      const fileUriMap = new Map<string, string>();
      const uploadPromises = allDocs.map(async (doc: DocInput) => {
        const key = doc.normalized_filename || doc.original_filename;
        const uri = await uploadToGeminiFileApi(geminiKey, doc.base64, key);
        fileUriMap.set(key, uri);
      });
      await Promise.all(uploadPromises);

      const uploadDuration = Date.now() - uploadStart;
      console.log(`[extract-financial] Uploaded ${fileUriMap.size} files in ${uploadDuration}ms`);

      // Step 2: Build prompt with context + inject current date for travaux scheduling
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      let prompt = EXTRACTION_PROMPT;
      prompt += `\n\nDATE_REFERENCE (date du pré-état daté): ${today}`;
      prompt += `\nUtilise cette date pour déterminer quels appels de fonds de travaux sont déjà passés (appele=true si date <= ${today}) et lesquels restent à venir (appele=false si date > ${today}).`;

      if (lot_number || property_address) {
        prompt += `\n\nCONTEXTE DU LOT VENDU:`;
        if (lot_number) prompt += `\n- Numéro(s) de lot concerné(s) par la vente: ${lot_number}`;
        if (property_address) prompt += `\n- Adresse du bien: ${property_address}`;
        prompt += `\n\nCONCENTRE TON ANALYSE EXCLUSIVEMENT SUR LE(S) LOT(S) SUIVANT(S): lot ${lot_number || "indiqué"}.`;
        prompt += `\nRÈGLE ABSOLUE: Si un document (appel de fonds, relevé de charges, etc.) contient des lignes pour d'autres lots (même du même propriétaire), tu DOIS les ignorer complètement. Extrais UNIQUEMENT les montants, tantièmes et provisions du/des lot(s) listé(s) ci-dessus.`;
        prompt += `\nNe jamais additionner les charges d'autres lots non listés ici.`;
      }

      if (questionnaire_context && typeof questionnaire_context === "object") {
        const qContext = buildQuestionnaireContext(questionnaire_context as Record<string, unknown>);
        if (qContext) {
          prompt += `\n${qContext}`;
          prompt += `\n\nUtilise ces informations du questionnaire vendeur pour orienter ton analyse des documents.`;
          prompt += `\nSi le bien est loué, cherche activement les informations du bail.`;
          prompt += `\nSi une ASL/AFUL existe, mentionne-la dans les alertes et données manquantes si aucun document ASL n'est fourni.`;
        }
      }

      // Step 3: Build parts with labels before PDFs
      const parts: unknown[] = [{ text: prompt }];
      for (const doc of allDocs) {
        const key = doc.normalized_filename || doc.original_filename;
        const uri = fileUriMap.get(key);
        if (uri) {
          parts.push({ text: `[Document: ${key} - Type: ${doc.document_type}]` });
          parts.push({ fileData: { fileUri: uri, mimeType: "application/pdf" } });
        }
      }

      // Step 4: Call Gemini 2.5 Pro
      const result = await callGemini(geminiKey, "gemini-2.5-pro", parts) as Record<string, unknown>;
      const duration = Date.now() - startTime;
      await logAiCall(supabase, dossier_id, "gemini-2.5-pro", "extraction-financial", startTime, result);
      console.log(`[extract-financial] Done in ${duration}ms (upload: ${uploadDuration}ms)`);

      // Step 5: Post-extraction validation
      const validationAlerts = validateExtraction(result);
      if (validationAlerts.length > 0) {
        console.log(`[extract-financial] Validation alerts: ${validationAlerts.join(" | ")}`);
        const meta = result.meta as Record<string, unknown> || { alertes: [] };
        const existingAlerts = (meta.alertes as string[]) || [];
        meta.alertes = [...existingAlerts, ...validationAlerts];
        result.meta = meta;
      }

      return corsResponse({ success: true, data: result });
    } catch (error) {
      console.error("[extract-financial] Error:", error);
      await logAiCall(supabase, dossier_id, "gemini-2.5-pro", "extraction-financial", startTime, null, String(error));
      return corsResponse({ error: "Financial extraction failed", details: String(error) }, 500);
    }
  } catch (error) {
    console.error("Error:", error);
    return corsResponse({ error: "Internal server error", details: String(error) }, 500);
  }
});
