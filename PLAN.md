# Plan : Renommage documents, alerte doc invalide, extraction DDT

## 3 objectifs utilisateur

### 1. Renommage explicite des documents
**Actuel** : `01_PV_AG_2024.pdf`
**Souhaité** : `{vendeur}.{typedoc}.{date_du_doc}.pdf`
Exemple : `DUPONT.PV_AG.2024-03-15.pdf`

**Problème** : Au moment de la classification (Step 2), le `seller_name` n'est pas encore renseigné (il vient du Step 1 questionnaire ou Step 4 validation). Mais le `property_lot_number` et éventuellement le nom du vendeur depuis le questionnaire sont disponibles.

**Solution** :
- **À la classification** : Renommer avec le format `{TypeDoc}_{Date}.pdf` (sans vendeur, pas encore connu)
- **À la livraison (Step 6)** : Renommage final dans le ZIP avec le nom du vendeur → `{Vendeur}.{TypeDoc}.{Date}.pdf`
- Le `normalized_filename` en DB reste le format intermédiaire pour l'affichage pendant le workflow
- Le ZIP de livraison + la page notaire utilisent le format final avec le nom du vendeur

**Fichiers modifiés** :
- `src/hooks/useDocuments.js` : Modifier `getNormalizedFilename()` → format `{TypeDoc}_{YYYY-MM-DD}.pdf` (date complète au lieu de juste l'année)
- `src/hooks/useNotaryShare.js` : Renommage final dans le ZIP avec préfixe vendeur
- `src/components/delivery/DeliveryPanel.jsx` : Affichage du nom final avec vendeur
- `src/pages/NotarySharePage.jsx` : Affichage du nom final avec vendeur

### 2. Alerte si document manifestement non pertinent
**Actuel** : La classification retourne un `confidence` score mais rien n'est fait avec quand le score est bas. Un document hors-sujet est classé `other` silencieusement.

**Solution** :
- **Modifier le prompt de classification** (edge function) : Ajouter un champ `alerte` dans la réponse JSON. Si le document ne correspond manifestement à aucun document attendu pour une vente en copropriété (ex: une facture EDF, un CV, une photo), Gemini retourne une alerte explicite.
- **Côté frontend** : Si `confidence < 0.5` OU `document_type === 'other'` OU `alerte` non-null → afficher un toast warning orange avec le message d'alerte.

**Champ ajouté au retour de classification** :
```json
{
  "document_type": "other",
  "confidence": 0.2,
  "alerte": "Ce document semble être une facture d'électricité personnelle, pas un document de copropriété.",
  ...
}
```

**Fichiers modifiés** :
- Edge function `pv-analyze` : Ajouter instruction `alerte` dans le prompt de classification
- `src/hooks/useDocuments.js` : Après classification, afficher toast warning si alerte ou confidence faible

### 3. Analyse DDT améliorée (extraction des diagnostics multiples)
**Actuel** :
- La classification détecte `diagnostics_couverts` (liste des diagnostics dans un DDT combiné) → OK
- MAIS `EXTRACTION_TYPES` dans `useAnalysis.js` ne contient aucun type `diagnostic_*` → les DDT ne sont JAMAIS envoyés à l'extraction Phase 2
- Phase 2 ne reçoit pas `diagnostics_couverts` dans le prompt → Gemini ne sait pas quels diagnostics chercher dans le DDT

**Solution** :
- **Fix `EXTRACTION_TYPES`** : Ajouter tous les types `diagnostic_*` + `bail` + `contrat_assurance`
- **Transmettre `diagnostics_couverts`** au service d'extraction → l'edge function les injecte dans le prompt Phase 2
- **Améliorer le prompt Phase 2** : Pour chaque diagnostic couvert, demander explicitement date de réalisation, date de validité, résultat (positif/négatif/conforme), et statut (valide/périmé)

**Fichiers modifiés** :
- `src/hooks/useAnalysis.js` : Fix EXTRACTION_TYPES + transmettre diagnostics_couverts
- `src/services/gemini.service.js` : Passer diagnostics_couverts dans le payload extraction
- Edge function `pv-analyze` :
  - Enrichir le label des documents DDT avec diagnostics_couverts dans le prompt Phase 2
  - Améliorer le prompt Phase 2 pour extraire dates + résultats + statut de validité par diagnostic

---

## Ordre d'implémentation

### Étape 1 — Frontend : Fix EXTRACTION_TYPES + transmission diagnostics_couverts
1. `useAnalysis.js` : Ajouter les 7 types `diagnostic_*` + `bail` + `contrat_assurance` dans `EXTRACTION_TYPES`
2. `useAnalysis.js` : Enrichir les docs envoyés à l'extraction avec `diagnostics_couverts` depuis `ai_classification_raw`
3. `gemini.service.js` : Transmettre `diagnostics_couverts` dans le payload envoyé à l'edge function

### Étape 2 — Edge function : Classification améliorée + alerte
1. Ajouter champ `alerte` au prompt de classification
2. Demander explicitement si le document semble hors-sujet pour une vente en copropriété

### Étape 3 — Edge function : Phase 2 améliorée pour DDT
1. Injecter `diagnostics_couverts` dans le label de chaque document DDT envoyé à Phase 2
2. Enrichir le prompt Phase 2 : pour chaque diagnostic, extraire date_realisation, date_validite, resultat, statut_validite
3. Injecter le contexte questionnaire (bail) dans Phase 2

### Étape 4 — Renommage documents
1. `useDocuments.js` : Modifier `getNormalizedFilename()` → date complète YYYY-MM-DD
2. `useNotaryShare.js` : Renommage final ZIP avec préfixe vendeur `{VENDEUR}.{TypeDoc}.{Date}.pdf`
3. `DeliveryPanel.jsx` : Affichage nom final avec vendeur
4. `NotarySharePage.jsx` : Affichage nom final avec vendeur

### Étape 5 — Frontend : Alerte doc invalide
1. `useDocuments.js` : Après classification, toast warning si `alerte` ou `confidence < 0.5` ou `type === 'other'`

### Étape 6 — Fix merge bugs existants
1. `useAnalysis.js` mergeResults : Propager `assurance.date_effet` + `date_echeance`
2. `useAnalysis.js` : Fix `confiance_globale` (ne pas écraser à 0)
