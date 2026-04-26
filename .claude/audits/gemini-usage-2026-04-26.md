# Audit Gemini API — Pack Vendeur

**Date** : 2026-04-26
**Périmètre** : qualité, coût, fiabilité de l'intégration Gemini (pas sécurité — voir [audit-2026-04-26.md](audit-2026-04-26.md) et [rls-audit-2026-04-26.md](rls-audit-2026-04-26.md))
**Méthode** : lecture de tous les fichiers appelant Gemini, requêtes SQL sur `pv_ai_logs` (462 rows, 30 derniers jours = 132 calls), vérification du pricing Gemini sur la doc officielle.
**Mode** : lecture seule — aucune modification.

---

## 0. TL;DR

| Dimension | Verdict |
|-----------|---------|
| Inventaire | 3 call sites bien isolés (1 par modèle), pas d'éparpillement |
| Routage modèle | ✅ Pertinent — sauf migration **urgente** : Gemini 2.0 Flash est **déprécié le 1er juin 2026** (5 semaines) |
| Prompts | 🟠 Hardcodés inline dans chaque edge function, pas de versioning, pas de séparation |
| Parsing | 🟠 `JSON.parse` direct, pas de validation Zod, retours `Array vs object` gérés à la main |
| Erreurs | 🟠 Retry 3× sur 429/503 mais pas de distinction fine, fallback chaîne 2.5 Pro→Flash→2.0 Flash en place |
| Coûts | 🔴 **Tokens jamais loggés** — colonnes existent (`input_tokens`, `output_tokens`, `total_tokens`) mais 0/462 lignes les contiennent. `result.usageMetadata` ignoré dans `gemini.ts:115`. |
| Performance | ⚠️ 111s moyen, 147s max pour extraction financière. Parallélisation OK, pas de cache. |
| Résilience | ✅ `EdgeRuntime.waitUntil` + revert à `paid` sur erreur — 400s wall-clock, marge OK |
| Séparation | 🟠 Prompts + parsing + coercion mélangés à l'orchestration |
| DX / itération | 🔴 Aucun harness d'éval, aucune fixture, redéploiement complet à chaque edit prompt |

**Top action** : tracker les tokens (8 lignes de code) pour pouvoir mesurer tout le reste, puis migrer `pv-classify` avant le 1er juin 2026.

---

## 1. Inventaire des appels Gemini

### Côté serveur (edge functions)

| Fichier | Ligne | Modèle | Use case | Input typique | Output typique |
|---------|-------|--------|----------|---------------|----------------|
| [pv-classify/index.ts:224](../../supabase/functions/pv-classify/index.ts:224) | `callGemini(geminiKey, "gemini-2.0-flash", parts)` | Classification 1 PDF | 1 PDF inline base64 (5-100 pages) | JSON court (~200 tokens) |
| [pv-extract-financial/index.ts:470](../../supabase/functions/pv-extract-financial/index.ts:470) | `callGemini(geminiKey, "gemini-2.5-pro", parts)` | Extraction financière + juridique + copro | 8-12 PDFs via File API + prompt 240 lignes + contexte lot/questionnaire | JSON ~5-10 KB (70+ champs) |
| [pv-extract-diagnostics/index.ts:182](../../supabase/functions/pv-extract-diagnostics/index.ts:182) | `callGemini(geminiKey, "gemini-2.5-flash", parts)` | Extraction diagnostics + bail + assurance | 1-8 PDFs via File API + prompt 70 lignes | JSON ~2 KB (~25 champs) |

### Côté serveur (orchestrateur — pas un appel direct mais à mentionner)

- [pv-run-extraction/index.ts:317-334](../../supabase/functions/pv-run-extraction/index.ts:317) : `Promise.all([callExtract("pv-extract-financial"), callExtract("pv-extract-diagnostics")])` — appelle les deux edge functions ci-dessus en parallèle via HTTP interne.

### Côté client (wrappers et hooks)

- [src/services/gemini.service.js](../../src/services/gemini.service.js) : 3 méthodes `classifyDocument`, `extractFinancial`, `extractDiagnostics` — wrappers de `supabase.functions.invoke()`.
- [src/hooks/useDocuments.js:120](../../src/hooks/useDocuments.js:120) : appel `classifyDocument` après chaque upload, avec retry 2× sur 429 (backoff 5s/15s).
- [src/hooks/useAnalysis.js:58](../../src/hooks/useAnalysis.js:58) : trigger unique de `pv-run-extraction` (le client ne fait plus d'orchestration depuis le refactor pay-first).

### Wrapper partagé

- [supabase/functions/_shared/gemini.ts](../../supabase/functions/_shared/gemini.ts) : 167 lignes
  - `uploadToGeminiFileApi()` — upload résumable PDF → File API
  - `callGeminiSingle()` — appel `generateContent` avec retry 3× sur 429/503 (3s / 8s / 15s)
  - `callGemini()` — wrapper avec fallback chain : `2.5-pro → 2.5-flash → 2.0-flash`, `2.5-flash → 2.0-flash`, `2.0-flash → 2.5-flash`

### Données runtime (30 derniers jours, source `pv_ai_logs`)

| Modèle | Type | Calls | Latence moy | Latence min | Latence max | Erreurs |
|--------|------|-------|-------------|-------------|-------------|---------|
| `gemini-2.0-flash` | classification | 109 | 4.4 s | 2.0 s | 18.6 s | 0 (0 %) |
| `gemini-2.5-flash` | extraction-diagnostics | 12 | 29.7 s | 6.4 s | 62.0 s | 2 (16.7 %) |
| `gemini-2.5-pro` | extraction-financial | 11 | 111.0 s | 16.7 s | 147.3 s | 2 (18.2 %) |

> Erreurs observées : toutes des 503 `UNAVAILABLE` ("This model is currently experiencing high demand") → 4 erreurs concentrées dans une fenêtre de ~1 min le 2026-04-08 (tempête côté Google).

---

## 2. Routage des modèles (Pro vs Flash)

### Choix actuels

- `pv-classify` → **gemini-2.0-flash** (1 PDF, classification rapide)
- `pv-extract-diagnostics` → **gemini-2.5-flash** (extraction simple : dates, classes DPE, IDs ADEME)
- `pv-extract-financial` → **gemini-2.5-pro** (extraction complexe : 70+ champs, cross-validation tantièmes/charges, raisonnement sur appels de fonds)

### Évaluation

| Use case | Modèle actuel | Verdict | Raison |
|----------|---------------|---------|--------|
| Classification | 2.0 Flash | 🔴 **À MIGRER** | **Déprécié 1er juin 2026** (vérifié sur [Google AI docs](https://ai.google.dev/gemini-api/docs/pricing)). Migrer vers `gemini-2.5-flash-lite` (mêmes tarifs, 8× output limit). |
| Extraction diagnostics | 2.5 Flash | ✅ Adéquat | Tâche simple (lecture de dates et codes), Flash suffit largement. |
| Extraction financière | 2.5 Pro | ✅ Adéquat | Extraction complexe nécessitant raisonnement (cross-validation tantièmes × budget = charges, désambiguïsation lots multiples, parsing échéancier travaux votés). Flash perdrait probablement en précision. À tester via eval harness avant downgrade. |

### Risque caché : la chaîne de fallback dégrade silencieusement la qualité

[gemini.ts:71-75](../../supabase/functions/_shared/gemini.ts:71) :
```ts
const FALLBACK_MODELS: Record<string, string[]> = {
  "gemini-2.5-pro": ["gemini-2.5-flash", "gemini-2.0-flash"],
  "gemini-2.5-flash": ["gemini-2.0-flash"],
  "gemini-2.0-flash": ["gemini-2.5-flash"],
};
```

Si `gemini-2.5-pro` échoue (e.g. 503 prolongé), l'extraction tombe sur Flash sans alerter l'utilisateur. **Le `model_used` n'est ni propagé au client ni stocké en DB** — l'utilisateur reçoit potentiellement une extraction Flash facturée comme Pro sans le savoir, et nous n'avons aucun moyen de distinguer "Pro a réussi" vs "Flash a sauvé un Pro down" dans les logs (`model` loggé est toujours le modèle initial demandé : voir [pv-extract-financial/index.ts:472](../../supabase/functions/pv-extract-financial/index.ts:472)).

> **Recommandation** : `callGemini` retourne `{ data, model_used }`, et `logAiCall` enregistre le `model_used` réel.

---

## 3. Prompts — qualité et structure

### État des lieux

| Prompt | Localisation | Lignes | Versionning | Few-shot | Structured output |
|--------|--------------|--------|-------------|----------|-------------------|
| Classification | [pv-classify/index.ts:47-98](../../supabase/functions/pv-classify/index.ts:47) | 52 | ❌ inline | ❌ | ❌ (juste `responseMimeType: "application/json"`) |
| Extraction financière | [pv-extract-financial/index.ts:9-239](../../supabase/functions/pv-extract-financial/index.ts:9) | 231 | ❌ inline | ❌ | ❌ |
| Extraction diagnostics | [pv-extract-diagnostics/index.ts:9-77](../../supabase/functions/pv-extract-diagnostics/index.ts:9) | 69 | ❌ inline | ❌ | ❌ |

### Constats

1. **Aucune séparation prompt/code**. Les 3 prompts sont des `const` inline dans le fichier `index.ts` de leur edge function. Modifier un prompt = redéployer toute la fonction. Pas de `_shared/prompts.ts`.
2. **Aucun versionning**. Pas de `version: "v3"` dans le prompt ni dans les logs. Impossible de corréler "qualité dégradée" avec "changement de prompt".
3. **Cohérence stylistique faible** :
   - Classification mélange instructions en français et types possibles dans une longue liste à la fin.
   - Extraction financière a un schéma JSON détaillé (lignes 117-225) avec des `_source` partout — bonne pratique.
   - Extraction diagnostics a un schéma JSON beaucoup plus simple, sans `_source` ni alertes structurées.
4. **Pas de structured output (responseSchema)**. Gemini 2.5 supporte `generationConfig.responseSchema` (JSON Schema strict) mais [gemini.ts:92-95](../../supabase/functions/_shared/gemini.ts:92) n'utilise que `responseMimeType: "application/json"`. C'est plus faible : Gemini peut omettre des champs ou en ajouter, sans garantie de typage.
5. **Pas d'isolation des données utilisateur dans le prompt**. Dans [pv-extract-financial/index.ts:441](../../supabase/functions/pv-extract-financial/index.ts:441) :
   ```ts
   prompt += `\n- Numéro(s) de lot concerné(s) par la vente: ${lot_number}`;
   prompt += `\n- Adresse du bien: ${property_address}`;
   ```
   `lot_number` et `property_address` viennent du questionnaire utilisateur **sans délimiteur**. Risque de prompt injection (déjà signalé dans l'audit sécurité pour les filenames). Recommandation : encadrer les valeurs dans des balises `<lot_number>...</lot_number>` ou similaire.
6. **Few-shot examples absents**. L'extraction tantièmes/charges bénéficierait probablement d'un exemple "voici un PDF type avec ces appels de fonds → voici la sortie attendue" pour stabiliser les résultats.

### Bonnes pratiques observées

- Le prompt financier précise des règles de calcul explicites (tantièmes × budget = charges, vérif d'écart > 15 %, conversion trimestriel→annuel).
- Champs `_source` demandés à Gemini pour traçabilité — excellent pour l'audit utilisateur.
- Injection contexte questionnaire via [`buildQuestionnaireContext()`](../../supabase/functions/pv-extract-financial/index.ts:250-314) — bien isolée fonctionnellement, mais l'output est concaténé au prompt comme du texte libre.

---

## 4. Parsing de la réponse

### Code actuel ([gemini.ts:115-122](../../supabase/functions/_shared/gemini.ts:115))

```ts
const result = await response.json();
const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
if (!text) throw new Error("No text in Gemini response");
return JSON.parse(text);
```

### Constats

1. **Pas de validation de schéma**. Si Gemini omet un champ `tantiemes_totaux` requis pour le calcul hybride, on se retrouve avec `null` propagé sans alerte.
2. **JSON.parse non gardé**. Si Gemini retourne du markdown `\`\`\`json\n{...}\n\`\`\`` (cas connu malgré `responseMimeType`), `JSON.parse` throw. Le throw est rattrapé plus haut mais on perd l'extraction entière (et on a déjà payé l'appel Pro à 111 s).
3. **Pas de retry sur output malformé**. Si Gemini retourne du JSON invalide, on ne lui redemande pas — on jette le résultat et on revient à `status='paid'`, l'utilisateur clique retry → on repaye 111 s.
4. **Normalisation array→object répétée**. Le pattern `Array.isArray(x) ? x[0] : x` est codé 2 fois ([pv-classify:130](../../supabase/functions/pv-classify/index.ts:130), [pv-run-extraction:348-349](../../supabase/functions/pv-run-extraction/index.ts:348)). À factoriser.
5. **Coercion type lourde sans schéma**. [pv-run-extraction:33-59](../../supabase/functions/pv-run-extraction/index.ts:33) définit `toNum/toDate/toChar1` à la main. Une validation Zod en amont rendrait ces helpers presque inutiles (Zod accepte coercion + transform).

### Recommandation

Définir des schémas Zod pour les 3 réponses (classification, financier, diagnostics) dans `_shared/schemas.ts`, puis :
```ts
const parsed = ClassificationSchema.safeParse(JSON.parse(text));
if (!parsed.success) {
  // → retry avec un message "your previous response had X issues, fix them"
  // OU log l'erreur et fallback sur null partiel
}
```

---

## 5. Gestion d'erreurs API

### Codes traités explicitement

| Code | Comportement | Localisation |
|------|--------------|--------------|
| 429 (rate limit) | Retry 3× avec délais 3s/8s/15s | [gemini.ts:99-105](../../supabase/functions/_shared/gemini.ts:99) |
| 503 (unavailable) | Idem (même branche que 429) | idem |
| Autres (400, 500, content policy) | Throw immédiat | [gemini.ts:108-113](../../supabase/functions/_shared/gemini.ts:108) |
| Throw final | Fallback chain (Pro→Flash→2.0 Flash) | [gemini.ts:139-165](../../supabase/functions/_shared/gemini.ts:139) |

### Constats

1. **429 et 503 traités identiquement** — c'est sous-optimal :
   - 429 (rate limit) : retry court suffit (les quotas se reconstituent vite, ou on est juste throttled).
   - 503 (model overload) : peut durer plusieurs minutes côté Google. Les délais 3s/8s/15s ≈ 26s total ne suffisent pas — voir le cluster d'erreurs du 2026-04-08 où 4 calls ont échoué en ~1 minute malgré le retry.
2. **Pas de distinction transient vs permanent** au-delà de `429/503`. Un 400 (prompt mal formé) déclenche un fallback (Pro → Flash → 2.0 Flash) qui ne va pas réparer le problème — gaspillage.
3. **Frontend retry × backend retry × fallback chain** — surface combinatoire :
   - useDocuments retry 2× (frontend) sur 429 ([useDocuments.js:130](../../src/hooks/useDocuments.js:130))
   - callGemini retry 3× (backend) sur 429/503
   - Fallback 3 modèles
   - **Pire cas pour une classification : 2 × 3 × 3 = 18 appels Gemini avant abandon**. Le backoff frontend (5s+15s) cumule avec les délais backend (3s+8s+15s). Une classification "lente" peut prendre > 1 minute, durant laquelle l'utilisateur croit que rien ne se passe.
4. **Erreur silencieusement avalée par fallback chain**. Si `2.5-pro` reçoit un 400 (typiquement un PDF corrompu), on retombe sur Flash qui répond peut-être (Flash plus tolérant), et le résultat est facturé comme Pro mais produit par Flash → biais qualité non détecté.
5. **Pas de jitter** dans les délais — risque de "thundering herd" si plusieurs dossiers sont en extraction simultanée et que Gemini retourne des 503 en cascade. (Note : volume actuel faible, ce n'est pas une priorité immédiate.)

---

## 6. Coûts

### 🔴 Constat principal : aucune visibilité

La table `pack_vendeur.ai_logs` (vue `pv_ai_logs`) contient les colonnes :

```
input_tokens   integer  YES  null
output_tokens  integer  YES  null
total_tokens   integer  YES  null
```

**Mais elles ne sont jamais remplies** (vérifié SQL) :

| Total rows | Avec tokens | Avec request_payload | Avec response_payload (truncated) |
|------------|-------------|----------------------|------------------------------------|
| 462 | **0** | 0 | 432 |

[`logAiCall()`](../../supabase/functions/_shared/logging.ts:19) ne reçoit jamais ces valeurs depuis [`callGemini`](../../supabase/functions/_shared/gemini.ts:115). Pourtant **la réponse Gemini les contient** dans `result.usageMetadata` :
```json
{
  "candidates": [...],
  "usageMetadata": {
    "promptTokenCount": 412345,
    "candidatesTokenCount": 5678,
    "totalTokenCount": 418023
  }
}
```

→ ces données sont disponibles à la ligne `gemini.ts:115` et **jetées immédiatement après extraction du `text`**.

### Pricing Gemini (vérifié sur [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing), avril 2026)

| Modèle | Input $/M | Output $/M | Note |
|--------|-----------|------------|------|
| Gemini 2.5 Pro | 1.25 (200K), 2.50 (>200K) | 10.00 (200K), 20.00 (>200K) | Modèle actuel pv-extract-financial |
| Gemini 2.5 Flash | 0.30 | 2.50 | Modèle actuel pv-extract-diagnostics |
| Gemini 2.5 Flash-Lite | 0.10 | 0.40 | Recommandé pour migration pv-classify |
| Gemini 2.0 Flash | 0.10 | 0.40 | **Déprécié 1er juin 2026** |

### Estimation par dossier (à valider par tracking réel)

> Rappels : 1 page PDF ≈ 258 tokens en images (standard Gemini PDF tokenization). Dossier typique : 12 PDFs, ~50 pages cumulées.

| Étape | Modèle | Input | Output | Coût estimé |
|-------|--------|-------|--------|-------------|
| Classification (×12 docs) | 2.0 Flash | 12 × ~25K = 300K | 12 × ~150 = 1.8K | **$0.030** |
| Extraction financière | 2.5 Pro | ~600K (8 docs gros) | ~5K | **$1.05** (en zone >200K, donc $2.50/M) |
| Extraction diagnostics | 2.5 Flash | ~150K (5 docs) | ~2K | **$0.050** |
| **Total par dossier** | | | | **~$1.13 ≈ 1.05 €** |

→ AI ≈ **4 % du prix de vente** (24.99 €). Cohérent avec une marge unitaire saine, mais à monitorer.

> Tous ces chiffres sont des estimations grossières — sans tokens loggés, l'incertitude est de ±50 %.

### Pas de circuit breaker

Aucun mécanisme ne stoppe l'AI si :
- un bug cause une boucle de retry (utilisateur clique 50× sur retry → 50× extraction Pro à 1 €)
- un attaquant uploade des PDFs énormes (1000 pages × 12 docs = 3M tokens × $2.50/M = $7.50/dossier malicieux)
- un prompt buggué retourne 503 et déclenche fallback Pro→Flash en boucle

**Recommandation minimale** : limiter le nombre de retry par `dossier_id` (max 3 extractions facturables par dossier) et alerter si un dossier dépasse un seuil (e.g. > $5).

---

## 7. Performance

### Mesures réelles (30 jours)

- **Classification** : 4.4 s moyen / 18.6 s max — acceptable, parallèle background.
- **Extraction diagnostics** : 30 s moyen / 62 s max — OK.
- **Extraction financière** : **111 s moyen / 147 s max** — c'est long.

### Décomposition de l'extraction financière (~111 s)

D'après les logs `[extract-financial]` dans le code :
- Upload PDFs vers File API : parallel (`Promise.all`), typiquement 5-15 s
- `callGemini` 2.5 Pro : ~95-130 s (la majorité du temps)
- Validation post-extraction : <100 ms

→ **Le bottleneck est le temps de raisonnement Gemini 2.5 Pro sur 8-12 PDFs**. C'est intrinsèque au modèle et au volume d'input.

### Parallélisation

✅ Phase 1 (financier) et Phase 2 (diagnostics) tournent en parallèle ([pv-run-extraction:317](../../supabase/functions/pv-run-extraction/index.ts:317)).
✅ Uploads de PDFs vers Gemini File API en parallèle ([pv-extract-financial:423-428](../../supabase/functions/pv-extract-financial/index.ts:423)).

### Cache : absent

Aucun cache des résultats Gemini. Si un dossier déclenche une extraction qui réussit côté Gemini mais échoue côté DB write, **on repaye 111 s + ~$1 sur le retry**. Idem si l'utilisateur retry après une erreur 503 : Gemini retraite tout depuis zéro même si certains PDFs avaient déjà été traités avec succès.

### Potentiel d'amélioration

| Action | Gain estimé | Coût d'implémentation |
|--------|-------------|------------------------|
| `responseSchema` (structured output) | -10 à -15 % output tokens, -5 à -15 % latence | 1 j (définir les schémas) |
| Hash classification cache | -50 à -100 % sur re-uploads | 0.5 j (colonne `content_hash` + lookup) |
| Chunking PDF (n'envoyer que les pages "comptes") | -30 à -50 % input tokens | 2-3 j (analyse de PDF côté serveur) |
| Streaming response | UX améliorée, pas de gain de coût | 1 j |

---

## 8. Résilience face aux timeouts

### Limites Supabase Edge Functions (vérifié sur [supabase.com/docs/guides/functions/limits](https://supabase.com/docs/guides/functions/limits))

- **Wall-clock time** : 400 secondes (toutes plans inclus)
- **CPU time** : 200 ms (mais wall-clock domine pour les workloads I/O-bound comme Gemini)
- Marge actuelle : 147 s max observé / 400 s max → **2.7× de headroom**, OK.

### Architecture actuelle

✅ `pv-run-extraction` retourne 202 immédiatement et exécute l'extraction via `EdgeRuntime.waitUntil()` — **le client peut fermer l'onglet sans perdre l'extraction** ([pv-run-extraction:556-558](../../supabase/functions/pv-run-extraction/index.ts:556)).
✅ Idempotence : refus si `status='analyzing'` ou `extracted_data` non vide ([pv-run-extraction:545-552](../../supabase/functions/pv-run-extraction/index.ts:545)).
✅ Sur erreur, status revient à `'paid'` → ProcessingStep peut proposer un retry ([pv-run-extraction:498-505](../../supabase/functions/pv-run-extraction/index.ts:498)).
✅ Stuck-state recovery (>4 min en `analyzing`) — implémenté dans ProcessingStep selon CLAUDE.md (à valider manuellement en lecture du composant).

### Faiblesses

1. **Pas d'idempotence Gemini-side**. Si la fonction crash après l'appel Gemini (réussi) mais avant le `UPDATE pv_dossiers`, on revient à `paid`, et au retry **on repaye un appel Pro alors que les données sont récupérables** dans `pv_ai_logs.response_payload` (mais qui contient seulement un preview de 2000 caractères → insuffisant).
2. **Le response_payload tronqué à 2000 chars** ([logging.ts:36-38](../../supabase/functions/_shared/logging.ts:36)) interdit la reprise après crash post-Gemini. Un `response_payload` complet permettrait de relire la dernière extraction réussie et éviter le re-call.
3. **Pas de notification d'échec persistant**. Si un dossier reste en `paid` parce que retry après retry échoue, personne n'est alerté côté admin.
4. **Pas de DLQ (dead letter queue)** ou de réessai différé. Si Gemini est down pendant 30 min, l'utilisateur doit cliquer manuellement N fois.

---

## 9. Séparation des préoccupations

### État actuel

| Composant | Lieu actuel | Devrait être |
|-----------|-------------|--------------|
| Prompts | inline dans chaque `index.ts` (52 / 231 / 69 lignes) | `_shared/prompts/{classify,financial,diagnostics}.ts` |
| Schémas JSON attendus | dans le prompt comme texte | `_shared/schemas.ts` (Zod) |
| Coercion type (toNum/toDate/toChar1) | [pv-run-extraction:33-59](../../supabase/functions/pv-run-extraction/index.ts:33) | `_shared/coerce.ts` (utilisable aussi par pv-extract-*) |
| Validation post-extraction | [pv-extract-financial:316-360](../../supabase/functions/pv-extract-financial/index.ts:316) | `_shared/validation.ts` |
| Build prompt avec contexte | [pv-extract-financial:434-456](../../supabase/functions/pv-extract-financial/index.ts:434) | `_shared/promptBuilder.ts` |
| Appel HTTP Gemini + retry | `_shared/gemini.ts` ✅ | OK, déjà bien isolé |

### Conséquences pratiques

- **Une modif de prompt = un redéploiement edge function**. Pas de hot-reload, pas de A/B test, pas de rollback rapide.
- **Le typage TypeScript ne couvre pas les sorties Gemini** — tous les accès sont `(x as any)?.field`, ce qui masque les régressions.
- **Tests impossibles** : un prompt isolé dans un fichier `.ts` exportable peut être testé avec un faux PDF. Inline dans `Deno.serve(req)`, c'est une boîte noire.

---

## 10. Expérience développeur et itération

### État

- ❌ **Aucun harness d'éval** : pas de `eval/`, pas de fixtures, pas de "PDF de référence + JSON attendu" (vérifié par glob `**/eval*` et `**/fixtures/**` — uniquement node_modules).
- ❌ **Aucune métrique de qualité** : la confiance retournée par Gemini (`meta.confiance_globale`) n'est ni stockée en DB ni utilisée pour alerter.
- ❌ **Aucun environnement staging Gemini** : tester un nouveau prompt = `supabase functions deploy pv-extract-financial && upload des PDFs réels et regarder le résultat à l'œil`.
- ❌ **Aucun versioning de prompt** : impossible de faire `WHERE prompt_version = 'v3' GROUP BY ...` pour mesurer l'impact d'un changement.
- ❌ **Diff prompts difficile** : git montre 200 lignes de prompt FR change, sans contexte sémantique.

### Comment tester aujourd'hui un nouveau prompt ?

D'après CLAUDE.md : *"There is no test suite. Verify changes by running `npm run dev` and clicking through the affected funnel step."*

Pour un prompt d'extraction, ça signifie :
1. Modifier `EXTRACTION_PROMPT` dans `pv-extract-financial/index.ts`
2. `supabase functions deploy pv-extract-financial`
3. Upload manuel de 8-12 PDFs réels via le funnel B2C
4. Lire le JSON résultat et le comparer mentalement à ce qu'on attend
5. Recommencer pour chaque cas de test (lot loué, ASL, multi-bâtiments, etc.)

→ **boucle de feedback de ~5 min et 1 € par essai, qualitatif uniquement.**

---

## Top 5 quick wins (coût / perf)

1. **Tracker les tokens** (P0, ~30 min de code)
   - Modifier `callGemini` pour retourner `{ data, usageMetadata, model_used }`.
   - Modifier `logAiCall` pour insérer `input_tokens`, `output_tokens`, `total_tokens`, `model_used` (et renommer `model` en `model_requested`).
   - **Sans ça, aucune autre optim coût n'est mesurable**. Gain immédiat = visibilité.
2. **Migrer `pv-classify` de `gemini-2.0-flash` vers `gemini-2.5-flash-lite`** (P0, ~1 ligne)
   - Mêmes tarifs ($0.10 / $0.40 par M).
   - Évite la dépréciation du 1er juin 2026.
   - Bonus : 2.5 Flash-Lite a 8× le output limit, marge confortable.
3. **Activer `responseSchema` pour les 3 prompts** (P1, ~1 j)
   - Réduit les output tokens (pas de blanchissement JSON).
   - Élimine les parse errors et les `Array.isArray(x)` workarounds.
   - Fournit un typage TypeScript automatique des réponses.
4. **Cache classification par hash** (P2, ~0.5 j)
   - SHA-256 du PDF côté upload, lookup avant `pv-classify`.
   - Économise les re-uploads (cas réels : utilisateur change un autre PDF et le funnel retrigger la classif sur les 11 autres).
5. **Persister `usageMetadata.totalTokenCount` complet et `response_payload` non tronqué pour l'extraction** (P2, ~1 h)
   - Permet le replay sans re-call Gemini en cas de crash post-AI.
   - Storage cost négligeable (462 rows × ~10 KB = 4.5 MB sur 30 jours).

---

## Top 5 risques de fiabilité

1. 🔴 **Dépréciation Gemini 2.0 Flash le 1er juin 2026** (5 semaines à compter du 2026-04-26)
   - `pv-classify` sera cassé ou très ralenti après cette date. Aucune notification automatique côté code.
   - **Action : migrer vers `gemini-2.5-flash-lite` cette semaine.**
2. 🔴 **Aucun tracking de coût**
   - Vous ne pourrez détecter une explosion de coût qu'à la facture mensuelle Google.
   - Un attaquant uploadant des PDFs de 1000 pages peut générer plusieurs $ par dossier sans alerte.
3. 🟠 **Fallback chain silencieuse Pro→Flash**
   - Si Gemini Pro est down, l'utilisateur reçoit potentiellement une extraction Flash dégradée et facturée comme Pro, sans notification.
   - Aucun log ne permet de savoir quel modèle a vraiment répondu.
4. 🟠 **Aucune validation Zod de la réponse Gemini**
   - Une réponse partiellement bonne (champs manquants) propage `null` dans 50+ colonnes flat sans alerte.
   - Le seul garde-fou est `validateExtraction` qui ne vérifie que la cohérence tantièmes/charges.
5. 🟠 **Tempête 503 inrécupérable**
   - Le retry total (3 attempts × 3 modèles fallback) prend ~80 s max. Une indisponibilité Gemini de 5 min force l'utilisateur à cliquer retry manuellement (et l'extraction est rejouée from scratch à 1 € + 111 s).
   - Pas de DLQ ni de retry asynchrone différé.

---

## Plan d'amélioration priorisé

### P0 — cette semaine

- [ ] Tracking tokens : extraire `usageMetadata` dans `gemini.ts`, propager via `callGemini` retour, insérer en DB via `logAiCall`. Ajouter colonne `model_used` (modèle réel après fallback).
- [ ] Migration `pv-classify` : `gemini-2.0-flash` → `gemini-2.5-flash-lite`. **Hard deadline : 2026-06-01.**

### P1 — d'ici 2 semaines

- [ ] Extraire les 3 prompts dans `_shared/prompts.ts` avec une variable `PROMPT_VERSION` loggée à chaque appel.
- [ ] Définir les schémas Zod pour les 3 réponses dans `_shared/schemas.ts` ; valider après JSON.parse.
- [ ] Activer `responseSchema` Gemini sur les 3 prompts (équivalent côté serveur des Zod schemas).
- [ ] Distinguer 429 (backoff court) et 503 (backoff long, jusqu'à 60s).
- [ ] Logger le `model_used` réel et ajouter une alerte console si fallback déclenché.

### P2 — d'ici 1 mois

- [ ] Harness d'éval : 5-10 dossiers de référence (PDFs anonymisés) + JSON attendus. Script `npm run eval:gemini` qui rejoue tous les dossiers et calcule un score de précision champ par champ.
- [ ] Cache classification par hash SHA-256 du contenu PDF.
- [ ] Persister `response_payload` complet (pas juste 2000 chars) pour permettre le replay sans re-call.
- [ ] Circuit breaker basique : max 3 extractions facturables par `dossier_id`.
- [ ] Test de chunking PDF — n'envoyer à Gemini Pro que les pages "comptes" / "tantièmes" / "appels de fonds" (gain estimé 30-50 % input tokens).

### P3 — quand le volume justifie

- [ ] Streaming des réponses Gemini (UX, pas coût).
- [ ] Migration vers Gemini Batch API ($0.625 / $5 par M, soit -50 %) pour les extractions non-urgentes.
- [ ] DLQ + retry différé en cas de panne Gemini prolongée.

---

## Estimation chiffrée des gains

> Toutes les estimations supposent ~100 dossiers/mois (à valider). Hypothèse $1.13 par dossier actuellement (cf. §6).

| Action | Gain coût | Gain perf | Gain DX |
|--------|-----------|-----------|---------|
| Tracking tokens | 0 (mais débloque le reste) | 0 | énorme |
| Migration 2.0→2.5 Flash-Lite | 0 (même prix) | 0 (similaire) | évite outage |
| `responseSchema` | -10 à -15 % output tokens (~$0.05/dossier × 100 = $5/mois) | -5 à -15 % latence (~5-15 s sur 111 s) | meilleur typing |
| Cache classification | -10 à -30 % sur re-uploads (~$0.003/dossier moyen) | -4.4 s par PDF caché | aucun |
| Chunking PDF Pro | -30 à -50 % input tokens (~$0.30/dossier × 100 = **$30/mois**) | possiblement -20 à -30 s (-25 % latence) | aucun |
| Eval harness | 0 | 0 | énorme — itération 100× plus rapide |
| Circuit breaker | élimine outliers (peut sauver $50-200 / incident) | 0 | tranquillité |

**Total potentiel sur les 4 premiers mois (P0 + P1 + P2)** : -20 à -40 % du coût AI mensuel + -25 à -35 % de la latence d'extraction + boucle d'itération prompt 10-100× plus rapide.

---

## Annexes

### Méthodologie de double-check

Tous les claims chiffrés ont été vérifiés en parallèle :
- Latences et erreurs : SQL sur `pv_ai_logs` (462 rows, 30 jours).
- Tokens : SQL `COUNT(*) FILTER (WHERE input_tokens IS NOT NULL)` → 0/462.
- Pricing Gemini : croisé entre [ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing), [TLDL](https://www.tldl.io/resources/google-gemini-api-pricing) et [pricepertoken.com](https://pricepertoken.com/pricing-page/model/google-gemini-2.5-pro).
- Edge function 400 s wall-clock : [supabase.com/docs/guides/functions/limits](https://supabase.com/docs/guides/functions/limits).
- Dépréciation 2.0 Flash : [tokencost.app](https://tokencost.app/blog/gemini-2-0-flash-deprecated-migration-cost) (1er juin 2026).

### Claims marqués "à valider manuellement"

- Estimation tokens par dossier (§6) : ±50 % d'incertitude tant que `usageMetadata` n'est pas tracké. À reconfirmer sur 10-20 dossiers réels après mise en place du tracking.
- "Stuck-state recovery >4 min" : annoncé dans CLAUDE.md, code de ProcessingStep non lu dans cet audit. À vérifier en lisant `src/components/processing/ProcessingStep.jsx`.
- Gain chunking PDF (-30 à -50 %) : hypothétique, basé sur l'observation que beaucoup de pages PDF (sommaire, pages de garde, annexes administratives) n'apportent rien à l'extraction financière. À valider avec un POC.

### Sources externes

- [Gemini Developer API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Supabase Edge Functions Limits](https://supabase.com/docs/guides/functions/limits)
- [Supabase Background Tasks](https://supabase.com/docs/guides/functions/background-tasks)
- [Gemini 2.0 Flash deprecation guide](https://tokencost.app/blog/gemini-2-0-flash-deprecated-migration-cost)
- [Gemini 2.5 Pro pricing review](https://tokenmix.ai/blog/gemini-2-5-pro-review)
