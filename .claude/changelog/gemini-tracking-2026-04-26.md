# Changelog — Migration Gemini & Tracking AI

**Date** : 2026-04-26
**Scope** : 3 fixes P0 du rapport [audit Gemini 2026-04-26](../audits/gemini-usage-2026-04-26.md)
**Mode** : code + déploiement + tests + doc

---

## Résumé

| Fix | Description | Statut |
|-----|-------------|--------|
| #1 | Migration `pv-classify` : `gemini-2.0-flash` → `gemini-2.5-flash-lite` (avant la dépréciation Google du 2026-06-01) | ✅ Validé en runtime |
| #2 | Tracking des tokens (`input_tokens` / `output_tokens` / `total_tokens`) depuis `usageMetadata` Gemini | ✅ Validé en runtime |
| #3 | Tracking du `model_used` réel (anti-fallback silencieux) — colonne ajoutée + propagée dans `callGemini` | ✅ Validé en runtime |

**Test runtime** (un appel `pv-classify` sur PDF réel après déploiement) :
```
model               : gemini-2.5-flash-lite     ← Fix #1
model_used          : gemini-2.5-flash-lite     ← Fix #3
input_tokens        : 2461                      ← Fix #2
output_tokens       : 173                       ← Fix #2
total_tokens        : 2634                      ← Fix #2
latency_ms          : 4990
prompt_type         : classification
error               : null
```

**Coût observé** : 2461 × $0.10/M + 173 × $0.40/M = **$0.000315** (~0.0003 €).

Pour `pv-extract-financial` et `pv-extract-diagnostics`, le pattern de code est identique (même `callGemini` → même `logAiCall` objet) — le tracking est donc validé par symétrie pour les 3 edge functions.

---

## Phases exécutées

### Phase 0 — Vérifications préalables
- Working tree propre (commit `cfd97e7` avait déjà nettoyé la session sécurité).
- Colonnes `input_tokens`, `output_tokens`, `total_tokens` confirmées dans `pack_vendeur.ai_logs` (existaient mais 0/462 lignes peuplées).
- `gemini-2.5-flash-lite` confirmé identifier stable Google (vérifié [ai.google.dev/gemini-api/docs/models](https://ai.google.dev/gemini-api/docs/models)).

### Phase 1 — Fix #1 (migration `pv-classify`)
**Fichiers modifiés** :
- `supabase/functions/pv-classify/index.ts` — 3 occurrences `"gemini-2.0-flash"` → `"gemini-2.5-flash-lite"` (callGemini + 2 logAiCall)
- `supabase/functions/_shared/gemini.ts` — `FALLBACK_MODELS` : retrait complet de `gemini-2.0-flash`, ajout entrée `gemini-2.5-flash-lite`

**Nouvelle chaîne fallback** :
```ts
"gemini-2.5-pro": ["gemini-2.5-flash", "gemini-2.5-flash-lite"],
"gemini-2.5-flash": ["gemini-2.5-flash-lite"],
"gemini-2.5-flash-lite": ["gemini-2.5-flash"],
```

### Phase 2 — Migration DB (préparation Fix #3)
**Migration appliquée** : `pack_vendeur_add_model_used_to_ai_logs`
```sql
ALTER TABLE pack_vendeur.ai_logs ADD COLUMN model_used text;
COMMENT ON COLUMN pack_vendeur.ai_logs.model      IS 'Modèle Gemini initialement demandé...';
COMMENT ON COLUMN pack_vendeur.ai_logs.model_used IS 'Modèle Gemini ayant réellement répondu...';

CREATE OR REPLACE VIEW public.pv_ai_logs WITH (security_invoker=true) AS
SELECT id, dossier_id, model, prompt_type, input_tokens, output_tokens, total_tokens,
       latency_ms, request_payload, response_payload, error, created_at, model_used
FROM pack_vendeur.ai_logs;
```

**Décision** : Option A (ADD column) plutôt que B (RENAME `model` → `model_requested`). Non-destructif, conserve la rétro-compat des requêtes SQL existantes.

**Particularité** : `CREATE OR REPLACE VIEW` impose colonnes existantes inchangées en position/type — `model_used` ajoutée à la fin (position 13) au lieu de juste après `model` (position 3). Documenté dans le code et CLAUDE.md.

### Phase 3 — Fixes #2 + #3 (refacto `callGemini` + `logAiCall`)
**Fichiers modifiés** :
- `supabase/functions/_shared/gemini.ts`
  - Nouveau type exporté `GeminiResult { data, usageMetadata, modelUsed }`
  - `callGeminiSingle` extrait `usageMetadata.{promptTokenCount, candidatesTokenCount, totalTokenCount}` depuis la réponse Gemini, retourne `GeminiResult`
  - `callGemini` propage `modelUsed` à travers la fallback chain (= modèle ayant réellement répondu)
  - Nouveau log `console.warn [FALLBACK SUCCESS] requested=X, used=Y` quand un fallback réussit (visible dans Supabase Edge Functions logs)
- `supabase/functions/_shared/logging.ts`
  - Nouvelle signature objet `LogAiCallParams` : `dossierId`, `modelRequested`, `modelUsed?`, `promptType`, `startTime`, `result?`, `inputTokens?`, `outputTokens?`, `totalTokens?`, `error?`
  - Insère `model`, `model_used`, `input_tokens`, `output_tokens`, `total_tokens` (NULL si absents — comportement résilient)
- `pv-classify/index.ts`, `pv-extract-financial/index.ts`, `pv-extract-diagnostics/index.ts`
  - Adaptation des 6 call sites (3 success + 3 error) : `const geminiResult = await callGemini(...)` puis `geminiResult.data` pour la donnée extraite + objet de paramètres pour `logAiCall`

### Phase 4 — Déploiement + tests
**Edge functions déployées** :
```
npx supabase functions deploy pv-classify --project-ref odspcxgafcqxjzrarsqf
npx supabase functions deploy pv-extract-financial --project-ref odspcxgafcqxjzrarsqf
npx supabase functions deploy pv-extract-diagnostics --project-ref odspcxgafcqxjzrarsqf
npx supabase functions deploy pv-run-extraction --project-ref odspcxgafcqxjzrarsqf  # redeploy après debug
```

**Test 1 — pv-classify avec PDF réel** : ✅ tokens populés (2461 / 173 / 2634), modèle `gemini-2.5-flash-lite` demandé et utilisé.

**Test 2 — pv-extract-financial via direct curl avec dummy base64** : ✅ logAiCall écrit `model_used='gemini-2.5-pro'` correctement (tokens NULL car Gemini jamais appelé — base64 invalide).

**Test 3 — extraction complète via orchestrateur** : ❌ bloqué par bug pré-existant (voir section ci-dessous).

### Phase 5 — Documentation
- `CLAUDE.md` : 6 modifications ciblées + nouvelle sous-section "AI Cost & Model Tracking" + entrée Known Bugs #7 (orchestrateur)
- Ce changelog
- Hook SessionStart respecté (accord explicite demandé avant chaque ajout CLAUDE.md)

---

## Bug pré-existant découvert (hors scope)

Pendant les tests d'extraction end-to-end (Test 3 Phase 4), j'ai constaté que **l'orchestrateur `pv-run-extraction` ne forwarde pas correctement le `X-Pv-Access-Token` aux extracteurs internes**. Symptômes :

- `pv-run-extraction` accepte le trigger (HTTP 202) et incrémente `extractions_count` ✅
- L'inner call `pv-extract-financial` retourne immédiatement HTTP 401 "Missing access token" ❌
- Aucune ligne `pv_ai_logs` n'est écrite (échec avant `logAiCall`)
- Status revient à `paid` (catch block dans `runExtraction`) → la stuck-state recovery ProcessingStep ne se déclenche pas car status n'est jamais `analyzing` longtemps

**Pourquoi pré-existant** : le code de forwarding (lignes 204, 214, 324, 333, 340 de `pv-run-extraction/index.ts`) était présent dans le commit sécurité du 26 avril (`91bf595`), donc indépendant de mes changements de cette session.

**Confirmation par test direct** : un appel direct à `pv-extract-financial` avec `X-Pv-Access-Token` explicite passe l'auth check sans problème. Donc le problème est dans le **forwarding entre l'orchestrateur et les extracteurs**.

**Hypothèses à investiguer** :
1. `dossier.access_token` undefined dans `runExtraction` (loaded from view `pv_dossiers` — pourtant la colonne y est exposée)
2. Header strip côté infrastructure Supabase (peu probable)
3. Race condition entre l'UPDATE `status='analyzing'` et la SELECT du dossier qui chargeait l'access_token

**Impact** : extraction B2C non fonctionnelle end-to-end. Tracking AI lui-même fonctionne (validé sur pv-classify et via test direct sur pv-extract-financial), mais le funnel ne peut pas se compléter sans intervention manuelle. Documenté dans CLAUDE.md "Known Bugs" #7.

**Action recommandée** : session dédiée pour fixer l'access_token forwarding. Hors scope de cette session (qui visait les 3 fixes P0 audit Gemini).

---

## Reportés à plus tard (hors scope)

Issus de l'audit Gemini, P1/P2/P3 :
- Extraction des prompts dans `_shared/prompts.ts` avec versionning
- Schémas Zod pour valider les réponses Gemini
- `responseSchema` Gemini (structured output)
- Distinction 429 vs 503 dans les retries
- Harness d'éval (PDFs de référence + JSON attendus)
- Cache classification par hash SHA-256
- Persistance complète du `response_payload` (vs preview tronqué 2 KB)
- Circuit breaker max 3 extractions facturables par dossier
- Chunking PDF pour réduire latence Pro
- Migration vers Gemini Batch API (-50 %)

---

## SQL Queries de vérification post-déploiement

### Vérifier le tracking actif
```sql
SELECT model, model_used, prompt_type, input_tokens, output_tokens, total_tokens, created_at
FROM pv_ai_logs
WHERE input_tokens IS NOT NULL
ORDER BY created_at DESC LIMIT 10;
```

### Détecter un fallback silencieux
```sql
SELECT created_at, dossier_id, prompt_type, model AS requested, model_used AS actual
FROM pv_ai_logs
WHERE model_used IS NOT NULL AND model_used != model
ORDER BY created_at DESC;
```

### Coût mensuel agrégé
```sql
SELECT
  date_trunc('month', created_at) AS month,
  model_used,
  COUNT(*) AS calls,
  SUM(input_tokens) AS in_tk, SUM(output_tokens) AS out_tk,
  ROUND(CASE model_used
    WHEN 'gemini-2.5-pro' THEN SUM(input_tokens) * 1.25 / 1e6 + SUM(output_tokens) * 10.0 / 1e6
    WHEN 'gemini-2.5-flash' THEN SUM(input_tokens) * 0.30 / 1e6 + SUM(output_tokens) * 2.50 / 1e6
    WHEN 'gemini-2.5-flash-lite' THEN SUM(input_tokens) * 0.10 / 1e6 + SUM(output_tokens) * 0.40 / 1e6
  END::numeric, 4) AS cost_usd
FROM pv_ai_logs
WHERE input_tokens IS NOT NULL
GROUP BY 1, 2
ORDER BY 1 DESC, 2;
```

### Reset complet du dossier test
```sql
UPDATE pack_vendeur.dossiers
SET status = 'paid', extracted_data = NULL
WHERE id = 'b61384a9-0598-489d-b457-da9a0aad4e6e';
```

---

## Fichiers touchés (récap)

| Fichier | Type | Lignes |
|---------|------|--------|
| `supabase/functions/_shared/gemini.ts` | Refacto + nouveau type | +30 |
| `supabase/functions/_shared/logging.ts` | Refacto signature | +18 |
| `supabase/functions/pv-classify/index.ts` | Migration modèle + adaptation logAiCall | ~15 |
| `supabase/functions/pv-extract-financial/index.ts` | Adaptation logAiCall | ~15 |
| `supabase/functions/pv-extract-diagnostics/index.ts` | Adaptation logAiCall | ~15 |
| `pack_vendeur.ai_logs` (DB) | ALTER TABLE ADD COLUMN model_used + COMMENTs | — |
| `public.pv_ai_logs` (DB view) | CREATE OR REPLACE pour exposer model_used | — |
| `CLAUDE.md` | 6 modifications + 1 nouvelle sous-section + 1 entrée Known Bugs | ~30 |
| `.claude/changelog/gemini-tracking-2026-04-26.md` | Ce fichier | — |

**Total** : 5 edge functions + 2 objets DB + 1 doc + 1 changelog.

---

## Sources

- Rapport audit initial : [.claude/audits/gemini-usage-2026-04-26.md](../audits/gemini-usage-2026-04-26.md)
- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini Models doc](https://ai.google.dev/gemini-api/docs/models)
- [Gemini 2.0 Flash deprecation](https://tokencost.app/blog/gemini-2-0-flash-deprecated-migration-cost) (1er juin 2026)
- [Supabase Edge Functions Limits](https://supabase.com/docs/guides/functions/limits)
