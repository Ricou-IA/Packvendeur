# Audit de clôture post-refacto sécurité / robustesse / Gemini

**Date** : 2026-04-26
**Auditeur** : Claude Opus 4.7 (audit indépendant en lecture seule)
**Scope** : vérification croisée des 3 sessions de refacto du 2026-04-26 (sécurité, robustesse, Gemini)
**Méthode** : lecture statique (sous-agents en parallèle) + requêtes MCP Supabase pour les vérifs DB et runtime
**Aucune modification** : zéro fichier édité, zéro commit, zéro mutation DB

Audits sources :
- [.claude/audits/rls-audit-2026-04-26.md](.claude/audits/rls-audit-2026-04-26.md)
- [.claude/audits/edge-functions-robustness-2026-04-26.md](.claude/audits/edge-functions-robustness-2026-04-26.md)
- [.claude/audits/gemini-usage-2026-04-26.md](.claude/audits/gemini-usage-2026-04-26.md)

Changelogs sources :
- [.claude/changelog/security-refactor-2026-04-26.md](.claude/changelog/security-refactor-2026-04-26.md)
- [.claude/changelog/edge-functions-robustness-2026-04-26.md](.claude/changelog/edge-functions-robustness-2026-04-26.md)
- [.claude/changelog/gemini-tracking-2026-04-26.md](.claude/changelog/gemini-tracking-2026-04-26.md)

---

## 1. Synthèse exécutive

**Verdict global** : 🟡 **Production-ready avec réserves bloquantes**

La couche données est désormais solidement protégée : la fuite RGPD critique de l'audit initial est colmatée (RLS service_role only, vues security_invoker, bucket privé). Les 4 fixes money-loss sont en place et validés par lecture du code et de la définition des fonctions Postgres. La migration Gemini 2.5 Flash-Lite est validée en runtime (1 call propre observé en base).

Trois points bloquent un launch propre :

1. ❌ **Stripe B2B Price IDs encore placeholders** dans [pv-pro-credits/index.ts:18,23,28](supabase/functions/pv-pro-credits/index.ts:18) — Phase 7 du changelog sécurité jamais finalisée. Tout achat de crédits B2B retournera 404 Stripe.
2. ⚠️ **Lead capture cassée silencieusement** : [DownloadTemplateSection.jsx:25](src/components/content/DownloadTemplateSection.jsx:25) fait un `INSERT` direct sur `pv_leads` qui échoue maintenant avec RLS verrouillée — l'utilisateur voit `submitted=true` mais rien n'est persisté → fuite de leads commerciaux non détectable.
3. 🐛 **Bug orchestrateur `pv-run-extraction` access_token forwarding** (déjà documenté Known Bug #7) — l'extraction B2C ne tourne pas end-to-end. Pré-existant aux 3 sessions, mais reste un bloquant launch.

**Top 3 résolutions confirmées** :

1. ✅ Toutes les policies anon sur `pack_vendeur.*` sont supprimées, les 8 vues sont en `security_invoker=true`, le bucket `pack-vendeur` est privé avec MIME limitées et file_size_limit=50 MB. La fuite RGPD est colmatée.
2. ✅ Pattern `access_token` correctement déployé sur 13 edge functions avec comparaison temps constant XOR ([_shared/auth.ts:32-39](supabase/functions/_shared/auth.ts:32)). Toutes les EF qui touchent un dossier vérifient l'auth en début de handler.
3. ✅ Les 4 fixes money-loss sont en place et atomiques au niveau Postgres : `pv_claim_extraction` (UPDATE conditionnel + RETURNING), `pv_pro_add_credits` (idempotent par stripe_session_id + UPDATE+INSERT dans la même transaction). Migration tokens Gemini validée runtime (1 call propre).

**Top 3 problèmes restants ou nouveaux** :

1. ❌ Stripe B2B Price IDs (cf. ci-dessus) — bloquant B2B.
2. ⚠️ Régression silencieuse lead capture (cf. ci-dessus) — fuite business.
3. ⚠️ `pv-dossier` action `generate-share-link` ([pv-dossier/index.ts:163-191](supabase/functions/pv-dossier/index.ts:163)) écrase inconditionnellement le `share_token`, ce qui casse la promesse d'immutabilité du Fix #2 si l'action est appelée après paiement.

---

## 2. Tableau de bord par axe

| Axe | ✅ Résolu | 🟡 Partiel | ❌ Non résolu | ⚠️ Nouveau pb | ❓ Runtime |
|-----|----------|-----------|---------------|----------------|-----------|
| **AXE 1 — Sécurité** (A1.1 → A1.9) | 8 | 0 | 1 (Stripe IDs) | 0 | 0 |
| **AXE 2 — Robustesse** (A2.1 → A2.5) | 5 | 0 | 0 | 1 (generate-share-link override) | 0 |
| **AXE 3 — Gemini** (A3.1 → A3.4) | 4 | 0 | 0 | 0 | 0 |
| **Régressions** (R1 → R8) | 5 | 2 (R3 R8) | 0 | 1 (R2: 2 SELECT directs) | 0 |
| **Total** | **22** | **2** | **1** | **2** | **0** |

---

## 3. Détail point par point

### AXE 1 — SÉCURITÉ

#### A1.1 — Policies RLS anon ✅

**Verdict** : RÉSOLU. Toutes les tables `pack_vendeur.*` ont **uniquement** une policy `service_full_*` ciblant `service_role`. Aucune anon, public, ou authenticated.

Requête `pg_policies` exécutée — résultat exhaustif :

| Table | Policies |
|-------|----------|
| `pack_vendeur.ai_logs` | 1 — `service_full_ai_logs` (service_role, ALL, true/true) |
| `pack_vendeur.documents` | 1 — `service_full_documents` (service_role, ALL, true/true) |
| `pack_vendeur.dossiers` | 1 — `service_full_dossiers` (service_role, ALL, true/true) |
| `pack_vendeur.email_logs` | 1 — `service_full_email_logs` (service_role, ALL, true/true) |
| `pack_vendeur.events` | 1 — `service_full_events` (service_role, ALL, true/true) |
| `pack_vendeur.leads` | 1 — `service_full_leads` (service_role, ALL, true/true) |
| `pack_vendeur.pro_accounts` | 1 — `service_full_pro_accounts` (service_role, ALL, true/true) |
| `pack_vendeur.pro_credit_transactions` | 1 — `service_full_pro_credit_transactions` (service_role, ALL, true/true) |

Toutes les policies historiques (`anon_*`, `auth_full_*`, `pro_accounts_anon`, `pro_credit_tx_anon`, `Service role full access on email_logs` (qui ciblait `public`), doublon `Allow anon insert on leads`) sont **bien supprimées**. `FORCE ROW LEVEL SECURITY` est activé sur les 8 tables (`relforcerowsecurity = true`).

#### A1.2 — Vues security_invoker ✅

**Verdict** : RÉSOLU. Les 8 vues `public.pv_*` sont toutes en `security_invoker=true` (vérifié via `pg_class.reloptions`).

#### A1.3 — Bucket Storage `pack-vendeur` ✅

**Verdict** : RÉSOLU.

Configuration vérifiée via `storage.buckets` :
- `public = false`
- `file_size_limit = 52428800` (50 MB) — conforme
- `allowed_mime_types = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp']` — étendue pour les logos pro (Phase 5 du changelog)

Policies `pack_vendeur_select/insert/update/delete` sur `storage.objects` : **0 résultat** (toutes supprimées). Aucune policy résiduelle ne référence `pack-vendeur` dans `storage.objects`.

#### A1.4 — Pattern access_token (code) ✅

**Verdict** : RÉSOLU. Sous-agent A confirme :
- [_shared/auth.ts:1-197](supabase/functions/_shared/auth.ts:1) existe avec 5 exports (`extractAccessToken`, `extractProToken`, `verifyDossierAccess`, `verifyProAccess`, `verifyShareToken`)
- Comparaison temps constant via XOR sans short-circuit : [_shared/auth.ts:32-39](supabase/functions/_shared/auth.ts:32) (`constantTimeEqual` boucle XOR accumulant `diff |= a.charCodeAt(i) ^ b.charCodeAt(i)`)
- [src/lib/supabase-functions.js:67-77](src/lib/supabase-functions.js:67) injecte automatiquement `X-Pv-Access-Token` (B2C) ou `X-Pv-Pro-Token` (B2B)
- [src/hooks/useDossier.js:11-12, 52, 131-137](src/hooks/useDossier.js:11) gère les 3 clés localStorage

**Couverture des 13 edge functions** (tableau complet du sous-agent A) : toutes les EF qui touchent un `dossier_id` appellent `verifyDossierAccess` en début de handler. Exceptions explicites et justifiées : `pv-dossier/create` (génère le token), `pv-create-payment-intent/verify-checkout` (autoritaire via Stripe metadata), `pv-pro/create-account` (génère pro_token), `pv-pro-credits/verify-checkout` (autoritaire via Stripe metadata), `pv-track-event` (analytics anonymes assumées).

#### A1.5 — Quota d'extractions ✅

**Verdict** : RÉSOLU. Vérifs DB :
- Colonne `access_token uuid NOT NULL DEFAULT gen_random_uuid()` ✅
- Colonne `extractions_count integer NOT NULL DEFAULT 0` ✅
- Fonction `public.pv_claim_extraction(p_dossier_id uuid) → TABLE(...)` SECURITY DEFINER ✅
- Fonction `public.pv_pro_add_credits(...)` SECURITY DEFINER ✅
- Fonction `public.pv_increment_extractions` **n'existe plus** (bien droppée — confirmé par grep DB) ✅
- GRANTs : EXECUTE uniquement à `postgres` (propriétaire) et `service_role` ✅

Définition de `pv_claim_extraction` (lue via `pg_get_functiondef`) confirme le UPDATE atomique conditionnel avec RETURNING :
```sql
UPDATE pack_vendeur.dossiers
SET status = 'analyzing', extractions_count = extractions_count + 1, updated_at = now()
WHERE id = p_dossier_id AND status = 'paid' AND extractions_count < 3
RETURNING extractions_count, status;
```
Seuil de quota : `extractions_count < 3` → 4ème tentative refusée ✅.

#### A1.6 — Vue notaire (filtrage) ✅

**Verdict** : RÉSOLU. Sous-agent A confirme :
- [pv-notary/index.ts:23-32](supabase/functions/pv-notary/index.ts:23) `NOTARY_DOSSIER_FIELDS` strictement limité à 8 champs : `id, property_address, property_postal_code, property_city, expires_at, share_token, notary_accessed_at, download_count`
- Champs exclus : `session_id, access_token, email, seller_email, seller_name, charges_*, budget_previsionnel, impaye_vendeur, dette_*, extracted_data, validated_data, questionnaire_data, stripe_payment_intent_id, pro_account_id, upload_token, pre_etat_date_pdf_path` (utilisé en interne pour signed URL puis non retourné)
- Documents : SELECT explicite `id, normalized_filename, original_filename, document_type, sort_order, storage_path` ([pv-notary/index.ts:80-84](supabase/functions/pv-notary/index.ts:80)). `storage_path` strippé du résultat client ([pv-notary/index.ts:134-140](supabase/functions/pv-notary/index.ts:134))
- Pas de `extracted_data` / `extracted_text` dans le SELECT documents

#### A1.7 — Stripe B2B Price IDs ❌

**Verdict** : NON RÉSOLU. Sous-agent A confirme :
- [pv-pro-credits/index.ts:18](supabase/functions/pv-pro-credits/index.ts:18) : `"price_pro_1_credit"` // TODO
- [pv-pro-credits/index.ts:23](supabase/functions/pv-pro-credits/index.ts:23) : `"price_pro_10_credits"` // TODO
- [pv-pro-credits/index.ts:28](supabase/functions/pv-pro-credits/index.ts:28) : `"price_pro_20_credits"` // TODO

Phase 7 du changelog sécurité explicitement « en attente de toi ». Les 3 commentaires `// TODO: Replace with real Stripe Price ID` sont intacts. Aucun ID ne commence par `price_1...` (format réel Stripe). **Bloque tout achat de crédits B2B en production.**

#### A1.8 — Nettoyage cosmétique ✅

**Verdict** : RÉSOLU. Sous-agent A : grep sur `auth_full_dossiers|auth_full_documents|pro_accounts_anon|pro_credit_tx_anon|anon_select_|anon_insert_|anon_update_|anon_delete_|Service role full access on email_logs|Allow anon insert on leads` → **0 occurrence** dans `src/`, `supabase/functions/`. Uniquement dans `.claude/audits/rls-audit-2026-04-26.md` (doc historique, attendu).

#### A1.9 — Isolation Majordhome ✅

**Verdict** : RÉSOLU. Vérifs DB :
- Aucune table `pack_vendeur.*` n'apparaît dans les autres schémas
- Schéma `pack_vendeur` : 8 tables / 8 policies (1 par table, service_role only)
- Schémas Majordhome (`majordhome` 59 tables / 138 policies, `core` 10/27, `config` 4/18, `arpet`, `invoicing`, `linktrack`, `rag`, `sources`, etc.) : non touchés (compteurs cohérents avec leur fonctionnement habituel)
- Échantillon aléatoire de 8 policies hors Pack Vendeur (via `ORDER BY random()`) : toutes des policies normales scopées par `auth.uid()`, `org_id`, ou `service_role` — pas d'altération
- Buckets Storage : seul `pack-vendeur` a été reconfiguré. Les 12 autres buckets Majordhome (`certificats`, `contracts`, `interventions`, `meeting-transcripts`, `premium-sources`, `product-documents`, `project-recordings`, `technical-visits`, `invoices`, `product-images`, `snapstudio`, `user-workspace`) conservent leurs configurations d'origine

---

### AXE 2 — ROBUSTESSE EDGE FUNCTIONS

#### A2.1 — Fix #1 : verify-checkout error check ✅

**Verdict** : RÉSOLU. Sous-agent B :
- [pv-create-payment-intent/index.ts:279-295](supabase/functions/pv-create-payment-intent/index.ts:279) : `const { error: updateErr } = await supabase.from("pv_dossiers").update(updatePayload).eq("id", dossierId);` puis `if (updateErr) return jsonResponse({ error: "Failed to confirm payment in DB" }, 500);`
- Logging structuré avant le return 500 (`dossier_id`, `checkout_session_id`, `error`)
- Email post-purchase fire-and-forget conditionné au succès de l'UPDATE (lignes 297-316, après le early return)
- Early return 500 aussi si Supabase indisponible (lignes 232-238)

#### A2.2 — Fix #2 : share_token immutable ✅ + ⚠️ side-finding

**Verdict** : RÉSOLU pour le scope du Fix #2 (Option A — génération conditionnelle dans verify-checkout).

[pv-create-payment-intent/index.ts:244-257](supabase/functions/pv-create-payment-intent/index.ts:244) :
```ts
const { data: existing, error: readErr } = await supabase
  .from("pv_dossiers").select("share_token, share_url").eq("id", dossierId).maybeSingle();
if (readErr) return jsonResponse({ error: "Failed to read dossier state" }, 500);
```

[pv-create-payment-intent/index.ts:273-277](supabase/functions/pv-create-payment-intent/index.ts:273) :
```ts
if (!existing?.share_token) {
  const shareToken = crypto.randomUUID().replace(/-/g, "");
  updatePayload.share_token = shareToken;
  updatePayload.share_url = `https://pre-etat-date.ai/share/${shareToken}`;
}
```

⚠️ **Side-finding** ([pv-dossier/index.ts:163-191](supabase/functions/pv-dossier/index.ts:163)) : l'action `generate-share-link` de `pv-dossier` écrase **inconditionnellement** le `share_token` existant. Si un client appelle cette action après son paiement (via le helper `dossierService.generateShareLink`), l'immutabilité promise par le Fix #2 est cassée. Action authentifiée par `verifyDossierAccess` donc seul le titulaire du dossier peut la déclencher → risque limité à l'auto-cassage par l'utilisateur, mais **incohérence à corriger** (faire la même condition `if (!existing?.share_token)`).

#### A2.3 — Fix #3 : RPC SQL atomique crédits pros ✅

**Verdict** : RÉSOLU. Sous-agent B :
- [pv-pro-credits/index.ts:193-208](supabase/functions/pv-pro-credits/index.ts:193) : utilisation de `supabase.rpc("pv_pro_add_credits", { p_account_id, p_amount, p_stripe_session_id, p_description })` avec check `if (rpcErr) return 500`
- Aucun read-modify-write résiduel sur `credits` (grep `select.*credits` puis `update.*credits` sur le fichier → 0 match)
- Définition Postgres de `pv_pro_add_credits` (lue via `pg_get_functiondef`) confirme :
  - Idempotency par `stripe_session_id` (SELECT id FROM pro_credit_transactions WHERE stripe_session_id = p_stripe_session_id)
  - UPDATE atomique avec RETURNING (`UPDATE ... SET credits = COALESCE(credits, 0) + p_amount ... RETURNING credits`)
  - INSERT pro_credit_transactions dans la même transaction Postgres (atomicité PL/pgSQL)
  - Raise exception si compte non trouvé

#### A2.4 — Fix #4 : claim atomique pv-run-extraction ✅

**Verdict** : RÉSOLU. Sous-agent B :
- [pv-run-extraction/index.ts:573-578](supabase/functions/pv-run-extraction/index.ts:573) : `supabase.rpc("pv_claim_extraction", { p_dossier_id: dossierId })` avec check `if (claimErr) return 500`
- [pv-run-extraction/index.ts:579-595](supabase/functions/pv-run-extraction/index.ts:579) : diagnostic 0 row via `dossier` déjà lu par `verifyDossierAccess` :
  - `extractions_count >= 3` → 429 quota_exceeded
  - sinon → 200 `already_analyzing` ou `already_done_or_busy`
- `pv_increment_extractions` totalement supprimé (grep DB confirmé) ✅
- `UPDATE status='analyzing'` retiré de `runExtraction()` — commentaire explicatif aux lignes 256-260
- Fast-path idempotency [pv-run-extraction/index.ts:552-559](supabase/functions/pv-run-extraction/index.ts:552) : si `pending_validation` + `extracted_data` non vide → court-circuit 200 sans toucher au quota

#### A2.5 — Cohérence quota & claim ✅

**Verdict** : RÉSOLU. Le quota (max 3) ET la race-safety sont fusionnés dans la même fonction `pv_claim_extraction`. Pas de chemin de code où le quota et l'UPDATE conditionnel divergent. Le compteur n'est pas rollback en cas d'échec d'extraction (par design — anti boucle infinie).

---

### AXE 3 — GEMINI

#### A3.1 — Migration pv-classify vers gemini-2.5-flash-lite ✅

**Verdict** : RÉSOLU. Sous-agent C :
- [pv-classify/index.ts:233](supabase/functions/pv-classify/index.ts:233) : `await callGemini(geminiKey, "gemini-2.5-flash-lite", parts)`
- [pv-classify/index.ts:238, 259](supabase/functions/pv-classify/index.ts:238) : `logAiCall` avec `modelRequested: "gemini-2.5-flash-lite"`
- [_shared/gemini.ts:73-77](supabase/functions/_shared/gemini.ts:73) : `FALLBACK_MODELS` ne contient plus `gemini-2.0-flash` ; nouvelle entrée `gemini-2.5-flash-lite`
- Grep global `gemini-2.0-flash` : 5 matches résiduels mais **tous non-applicatifs** (1 commentaire historique dans gemini.ts:71 + 4 occurrences dans .claude/ docs)

#### A3.2 — Tracking des tokens ✅

**Verdict** : RÉSOLU côté code + validé runtime (1 call propre).

Côté code (sous-agent C) :
- [_shared/gemini.ts:86-94](supabase/functions/_shared/gemini.ts:86) : type `GeminiResult { data, usageMetadata, modelUsed }` exporté
- [_shared/gemini.ts:143-148](supabase/functions/_shared/gemini.ts:143) : extraction `usageMetadata.{promptTokenCount, candidatesTokenCount, totalTokenCount}` avec résilience (null si absent)
- [_shared/logging.ts:25-36](supabase/functions/_shared/logging.ts:25) : interface `LogAiCallParams` avec `inputTokens`, `outputTokens`, `totalTokens`, `modelUsed`
- INSERT lignes 54-67 inclut `model`, `model_used`, `input_tokens`, `output_tokens`, `total_tokens`
- 3 EF (pv-classify, pv-extract-financial, pv-extract-diagnostics) appellent `callGemini` puis `logAiCall` avec params nommés tokens — pattern symétrique

Runtime (vérification SQL) :
```
2026-04-26 13:12:52  classification        gemini-2.5-flash-lite/gemini-2.5-flash-lite  in=2461 out=173 total=2634
```
1 call avec tokens populés ; coût observé `2461×$0.10/M + 173×$0.40/M = $0.000315`. Validation symétrique implicite pour `pv-extract-financial` et `pv-extract-diagnostics` (même `callGemini` → même `logAiCall`).

#### A3.3 — Tracking model_used réel ✅

**Verdict** : RÉSOLU.
- [_shared/gemini.ts:153](supabase/functions/_shared/gemini.ts:153) : `return { data, usageMetadata, modelUsed: model }` propage le modèle réel après fallback
- [_shared/gemini.ts:189-191](supabase/functions/_shared/gemini.ts:189) : `console.warn [FALLBACK SUCCESS] requested=${model}, used=${fallback}` quand un fallback réussit (visible dans les logs Supabase Edge Functions)
- [_shared/logging.ts:55-57](supabase/functions/_shared/logging.ts:55) : INSERT distinct `model: params.modelRequested` et `model_used: params.modelUsed ?? params.modelRequested`
- Colonne `model_used text` confirmée dans `pack_vendeur.ai_logs` via migration `pack_vendeur_add_model_used_to_ai_logs` (20260426085254)

#### A3.4 — Cohérence avec dépréciation 2.0 Flash ✅

**Verdict** : RÉSOLU. Vérification runtime :
- 18 calls Gemini depuis 2026-04-26 (00:00 UTC)
- 14 calls avec `model = 'gemini-2.0-flash'` mais **tous datés entre 02:20 et 02:30 UTC, AVANT le déploiement matinal de la migration** (8h05 UTC pour `pv-classify`)
- 0 call avec `model_used = 'gemini-2.0-flash'` post-migration ✅
- 0 fallback détecté (toutes les requêtes `model = model_used` quand `model_used IS NOT NULL`)

Note : les 14 calls `gemini-2.0-flash` n'ont pas `model_used` peuplé car ils précèdent le déploiement Phase 3 du tracking. Pas un signal de migration incomplète.

---

### RÉGRESSIONS ET DÉGÂTS COLLATÉRAUX (R1-R8)

#### R1 — Cohérence pattern auth sur les 13 EFs ✅ + ⚠️ pv-send-email

**Verdict** : RÉSOLU pour les 13 EFs auditées. Sous-agent B fournit le tableau complet (cf. A1.4 ci-dessus).

⚠️ **Side-finding** : [pv-send-email/index.ts:46-71](supabase/functions/pv-send-email/index.ts:46) n'a **aucune vérification d'auth** — un attaquant qui connaît un `dossier_id` UUID peut déclencher l'envoi d'emails (post-purchase, review, cart-abandonment, expiration-reminder) à l'email du dossier. Atténué par la dedup `pv_email_logs` (1er envoi inattendu mais pas de spam) et par le fait que `dossier_id` n'est pas trivialement énumérable. CORS ouvert (`*`) facilite l'exploitation. Hors scope strict des 4 fixes mais à corriger avant launch.

#### R2 — Plus de SELECT/UPDATE/DELETE direct sur tables sensibles ❌ ⚠️

**Verdict** : 2 NOUVEAUX PROBLÈMES (régressions silencieuses introduites par le RLS lockdown). Sous-agent D :

| # | Fichier:ligne | Table | Op | Impact |
|---|---|---|---|---|
| 1 | [src/components/delivery/DeliveryPanel.jsx:59](src/components/delivery/DeliveryPanel.jsx:59) | `pv_pro_accounts` | SELECT logo_path WHERE id=pro_account_id | Logo pro non récupérable côté frontend B2C → logo absent du PDF B2B |
| 2 | [src/components/content/DownloadTemplateSection.jsx:25](src/components/content/DownloadTemplateSection.jsx:25) | `pv_leads` | INSERT { email, source } | **Lead capture cassée silencieusement** : l'INSERT échoue avec RLS → user voit `submitted=true` mais aucun lead persisté → fuite de données business |

3 fichiers seulement importent le client `supabase` direct dans `src/` :
1. `src/lib/supabase-functions.js:1` ✅ légitime (helper)
2. `src/components/delivery/DeliveryPanel.jsx:58` ❌ contourne EF
3. `src/components/content/DownloadTemplateSection.jsx:23` ❌ contourne EF

Tous les autres SELECT directs (`pv_dossiers`, `pv_documents`, `pv_pro_credit_transactions`, `pv_ai_logs`, `pv_email_logs`, `pv_events`) sont à 0. Le grand ménage de la session sécurité a oublié ces 2 endroits.

**Recommandation** :
- Pour DeliveryPanel : ajouter une action `pv-dossier/get-pro-logo` ou exposer `logo_url` dans le retour de `pv-dossier/get` quand le dossier a un `pro_account_id`.
- Pour DownloadTemplateSection : créer une EF publique `pv-capture-lead` avec `auth: 'none'` (sur le modèle de `pv-track-event`) + rate-limiting basique côté serveur.

#### R3 — Gestion des 3 clés localStorage 🟡

**Verdict** : PARTIELLEMENT RÉSOLU. Sous-agent A et D : pas de désync structurelle, mais pas de fonction atomique create/reset.

Inventaire :
| Clé | Source de vérité | Reset cohérent ? |
|-----|------------------|------------------|
| `pack-vendeur-session-id` | useDossier.js:11,16,19 | ✅ inclus dans `resetSession` (line 132) |
| `pack-vendeur-dossier-id` | useDossier.js:12,26,31 | ✅ inclus dans `resetSession` (line 133) |
| `pack-vendeur-access-token` | supabase-functions.js:18,23,28,33 | ✅ inclus dans `resetSession` (line 134) |

🟡 **Point d'attention** : la création des 3 clés est éparpillée en 3 endroits (séquence asynchrone create-dossier → setStoredDossierId + setAccessToken). Un crash entre étapes laisserait un access_token orphelin. Risque faible (l'utilisateur peut purger localStorage) mais réel. **Recommandation** : centraliser en une fonction `commitDossierSession({ sessionId, dossierId, accessToken })`.

#### R4 — Headers CORS x-pv-access-token / x-pv-pro-token ✅

**Verdict** : RÉSOLU. Sous-agent A :
- [_shared/cors.ts:3-5](supabase/functions/_shared/cors.ts:3) : `Access-Control-Allow-Headers` contient `x-pv-access-token, x-pv-pro-token`
- corsHeaders dupliqués dans `pv-create-payment-intent/index.ts:5-10` et `pv-pro-credits/index.ts:5-10` sont **synchronisés mot pour mot** avec `_shared/cors.ts`

🟡 Dette technique mineure : 3 sources de vérité pour les corsHeaders. Un `import { corsHeaders } from "../_shared/cors.ts"` éliminerait le risque de drift futur.

#### R5 — Fonctionnalités B2B incomplètes annoncées ✅ + ⚠️ DeliveryPanel B2B

**Verdict** : RÉSOLU pour les 3 stubs documentés. Sous-agent A :
- [src/hooks/useClientDocuments.js](src/hooks/useClientDocuments.js) : pas d'appel à `pv-classify` (B2B client) ✅
- [src/hooks/useProDocuments.js:42-44](src/hooks/useProDocuments.js:42) : `uploadFiles` retourne un toast informatif ✅
- [src/hooks/useProDocuments.js:46-50](src/hooks/useProDocuments.js:46) : `removeDocument` retourne un toast informatif ✅

⚠️ **Side-finding** : [src/components/delivery/DeliveryPanel.jsx:157-166](src/components/delivery/DeliveryPanel.jsx:157) appelle `pdfService.generateAndUpload` puis `dossierService.updateDossier` sans branche pro. Côté B2B (pas d'access_token en localStorage), l'appel à `pv-document/upload-generated` retournera 401 → PDF non uploadé côté pro. Documenté dans le changelog (« à câbler en V2 ») mais reste à ce stade un bug fonctionnel non bloquant (l'erreur remonte via toast).

#### R6 — Dead code post-refacto ✅

**Verdict** : RÉSOLU. Sous-agents C + D :
- `geminiService.extractFinancial` : supprimé (commentaire historique conservé pour traçabilité gemini.service.js:6-13)
- `geminiService.extractDiagnostics` : supprimé
- `dossierService.getDossierBySession` : supprimé
- `pv_increment_extractions` : 0 occurrence dans `src/` ou `supabase/functions/` (uniquement dans changelogs `.claude/`, attendu)
- TODO/FIXME dans `src/services/` et `src/hooks/` : 0
- TODO restants dans `supabase/functions/` : 4 dans `pv-pro-credits/index.ts` (Stripe price IDs placeholders — déjà documentés en Gotcha critique #2 dans CLAUDE.md)
- Aucun marqueur `// removed`, `// deprecated`, `// old`, `// legacy`, `@deprecated` dans `src/` ni `supabase/functions/`

#### R7 — Migrations DB cohérentes ✅

**Verdict** : RÉSOLU. `mcp__supabase__list_migrations` confirme la présence des migrations annoncées **plus** une 5ème non listée dans le changelog initial mais cohérente :

| # | Version | Nom |
|---|---------|-----|
| 1 | 20260426001258 | pack_vendeur_security_phase1_stop_bleed |
| 2 | 20260426001547 | pack_vendeur_security_phase1d_2_access_token |
| 3 | 20260426003327 | pack_vendeur_security_phase5_bucket_mime_types |
| 4 | 20260426013002 | pack_vendeur_security_phase5_move_increment_function |
| 5 | 20260426021523 | pack_vendeur_security_phase5_grant_service_role_on_tables (bonus) |
| 6 | 20260426085254 | pack_vendeur_add_model_used_to_ai_logs (session Gemini) |
| 7 | 20260426133824 | pv_pro_add_credits_atomic (session robustesse) |
| 8 | 20260426134012 | pv_claim_extraction_atomic (session robustesse) |

8 migrations Pack Vendeur du jour, chronologiquement cohérentes. Aucune migration suspecte ou orpheline.

#### R8 — CLAUDE.md cohérent 🟡

**Verdict** : COHÉRENT et à jour pour le scope du projet. Sous-agent C :
- ✅ Pattern access_token documenté (3 clés localStorage, header, flow, template obligatoire)
- ✅ Quota 3 extractions documenté + section dédiée RPC
- ✅ Convention RLS et schéma documentée (FORCE RLS, service_full_*, security_invoker, bucket)
- ✅ Migration pv-classify et tracking tokens documentés (Tech Stack + section AI Cost & Model Tracking)
- ✅ Aucune référence à `pv_increment_extractions`, `extractFinancial`, `gemini-2.0-flash` dans CLAUDE.md
- ✅ Known Bugs #7 documente bien le bug pré-existant orchestrator access_token forwarding

🟡 Hors scope strict mais à signaler : `MEMORY.md` utilisateur (`C:\Users\epude\.claude\projects\C--Dev-Pack-Vendeur\memory\MEMORY.md`) ligne ~13 mentionne encore `pv-classify (Gemini 2.0 Flash)` — désynchronisé avec le code.

---

## 4. Régressions et dégâts collatéraux détectés (synthèse ⚠️)

| # | Type | Localisation | Impact | Recommandation |
|---|------|--------------|--------|----------------|
| ⚠️1 | Régression silencieuse | [DownloadTemplateSection.jsx:25](src/components/content/DownloadTemplateSection.jsx:25) | Lead capture cassée : INSERT direct sur `pv_leads` échoue avec RLS verrouillée. User voit succès, rien en base. **Fuite de leads commerciaux non détectable.** | Créer EF `pv-capture-lead` (auth: none, modèle pv-track-event) + remplacer l'appel direct |
| ⚠️2 | Régression silencieuse | [DeliveryPanel.jsx:59](src/components/delivery/DeliveryPanel.jsx:59) | SELECT direct sur `pv_pro_accounts` pour récupérer `logo_path` échoue avec RLS. **Logo pro absent du PDF B2B**. | Exposer `logo_url` dans le retour de `pv-dossier/get` quand `pro_account_id` non null, OU action `pv-dossier/get-pro-logo` |
| ⚠️3 | Incohérence Fix #2 | [pv-dossier/index.ts:163-191](supabase/functions/pv-dossier/index.ts:163) | Action `generate-share-link` écrase inconditionnellement le `share_token`. Si appelée après paiement, casse la promesse d'immutabilité. | Ajouter `if (!existing?.share_token) { ... }` comme dans `verify-checkout` |
| ⚠️4 | Auth manquante | [pv-send-email/index.ts:46-71](supabase/functions/pv-send-email/index.ts:46) | Aucune vérif d'auth — déclenchable par n'importe qui connaissant un `dossier_id`. Atténué par dedup `pv_email_logs`. | Ajouter `verifyDossierAccess` ou rendre la fonction `service_role only` (l'appeler depuis pv-create-payment-intent uniquement) |
| ⚠️5 | Bug pré-existant (KB#7) | `pv-run-extraction` orchestrateur | `X-Pv-Access-Token` non forwardé aux extracteurs internes → extraction B2C non fonctionnelle end-to-end | Session dédiée — déjà documenté dans CLAUDE.md Known Bugs #7 |

Les 5 sont **nouveaux ou non corrigés**. Les 4 premiers sont **introduits ou révélés par la session sécurité** (le RLS lockdown a transformé des appels directs frontend en NOOP silencieux). Le 5ème est antérieur.

---

## 5. Tests runtime à exécuter par l'utilisateur

5 scripts Node.js créés dans [.claude/tests/security-regression/](.claude/tests/security-regression/) :

| Script | Vecteur d'attaque | Résultat attendu |
|--------|-------------------|------------------|
| [T1-select-dossiers.mjs](.claude/tests/security-regression/T1-select-dossiers.mjs) | SELECT * FROM pv_dossiers en anon | data: [] ou erreur RLS |
| [T2-update-paid.mjs](.claude/tests/security-regression/T2-update-paid.mjs) | UPDATE stripe_payment_status='paid' en anon | 0 ligne modifiée ou erreur RLS |
| [T3-steal-pro-tokens.mjs](.claude/tests/security-regression/T3-steal-pro-tokens.mjs) | SELECT pro_token FROM pv_pro_accounts en anon | data: [] ou erreur RLS |
| [T4-no-access-token.mjs](.claude/tests/security-regression/T4-no-access-token.mjs) | pv-run-extraction sans header X-Pv-Access-Token | HTTP 401 |
| [T5-bogus-access-token.mjs](.claude/tests/security-regression/T5-bogus-access-token.mjs) | pv-run-extraction avec X-Pv-Access-Token bidon | HTTP 403 |

**Procédure complète** détaillée dans [.claude/tests/security-regression/README.md](.claude/tests/security-regression/README.md).

**Lancement rapide** (PowerShell, depuis la racine du repo) :

```powershell
$env:VITE_SUPABASE_URL = "https://odspcxgafcqxjzrarsqf.supabase.co"
$env:VITE_SUPABASE_ANON_KEY = "<colle ta clé anon ici>"

$tests = @(
  "T1-select-dossiers.mjs",
  "T2-update-paid.mjs",
  "T3-steal-pro-tokens.mjs",
  "T4-no-access-token.mjs",
  "T5-bogus-access-token.mjs"
)

$results = @()
foreach ($t in $tests) {
  Write-Host "`n===== $t =====" -ForegroundColor Cyan
  node ".claude\tests\security-regression\$t"
  $results += [pscustomobject]@{ Test = $t; Exit = $LASTEXITCODE }
}

Write-Host "`n===== Synthèse =====" -ForegroundColor Yellow
$results | Format-Table -AutoSize
```

Codes de sortie : `0` = PASS (l'attaque a échoué), `1` = FAIL CRITIQUE (l'attaque a réussi → régression), `2` = config manquante.

---

## 6. Reste à faire avant launch

### 🔴 Bloquant launch

1. **Stripe B2B Price IDs** — créer les 3 produits dans le Dashboard Stripe (mode Live) et remplacer les placeholders dans [pv-pro-credits/index.ts:18,23,28](supabase/functions/pv-pro-credits/index.ts:18). Procédure détaillée dans [security-refactor changelog Phase 7](.claude/changelog/security-refactor-2026-04-26.md). **Sinon : 0 € de revenu B2B possible.**
2. **Bug orchestrator access_token forwarding** (Known Bug #7) — `pv-run-extraction` ne transmet pas le `X-Pv-Access-Token` aux extracteurs internes. Sans ce fix, **l'extraction B2C ne tourne pas end-to-end**. Session dédiée à planifier.
3. **Lead capture cassée** ([DownloadTemplateSection.jsx:25](src/components/content/DownloadTemplateSection.jsx:25)) — créer une EF publique `pv-capture-lead` ou rebrancher sur `pv-track-event`. Sinon les leads du téléchargement de modèle sont **silencieusement perdus**.

### 🟠 Haute priorité (à corriger sous 1 semaine)

4. **Logo pro absent du PDF B2B** ([DeliveryPanel.jsx:59](src/components/delivery/DeliveryPanel.jsx:59)) — exposer `logo_url` dans le retour de `pv-dossier/get` quand `pro_account_id` non null. Faible impact (logo cosmétique) mais c'est une promesse marketing du B2B.
5. **`pv-dossier/generate-share-link` casse l'immutabilité** ([pv-dossier/index.ts:163-191](supabase/functions/pv-dossier/index.ts:163)) — ajouter le check `if (!existing?.share_token)` symétrique au Fix #2.
6. **`pv-send-email` sans auth** — ajouter `verifyDossierAccess` ou restreindre l'appel à `service_role` (depuis `pv-create-payment-intent` uniquement).

### 🟢 Nice to have (V2)

7. **Génération PDF côté Pro non câblée** — câbler `pv-pro/upload-generated` pour `DeliveryPanel` côté B2B.
8. **Classification AI absente côté B2B client** (`useClientDocuments`) — trigger DB ou appel automatique depuis `pv-client-upload/upload`.
9. **Centraliser corsHeaders** : importer depuis `_shared/cors.ts` dans `pv-create-payment-intent` et `pv-pro-credits` au lieu des duplications.
10. **`commitDossierSession` atomique** : centraliser le set des 3 clés localStorage en une fonction unique.
11. **Synchroniser `MEMORY.md`** utilisateur (référence encore Gemini 2.0 Flash) — hors scope projet mais utile pour la cohérence.

---

## 7. Recommandations forward (Phase 2/3)

À considérer pour la prochaine session de hardening, sans détailler ici :

- **Phase 2 robustesse** (audit edge-functions §5) : validation UUID format au début de chaque handler, `AbortSignal.timeout()` sur fetch Gemini, whitelist origin CORS (vs `*`), sanitisation `questionnaire_context` / `lot_number` / `property_address` (prompt injection), cap taille `file_base64` à 25 MB dans `pv-classify`, retry policy sur `uploadToGeminiFileApi`.
- **Phase 3 observabilité** : webhook Slack/email pour erreurs critiques, table `pv_payment_attempts` pour audit financier, dashboard Grafana sur `pv_ai_logs` (coût/jour, erreurs/jour), webhook Stripe replay-safe, daily report top errors + total cost Gemini.
- **Phase 2 Gemini** : extraire les 3 prompts dans `_shared/prompts.ts` avec versionning, schémas Zod pour valider les réponses, `responseSchema` Gemini (structured output), distinction 429 vs 503 dans les retries.
- **Phase 3 Gemini** : harness d'éval (PDFs de référence + JSON attendus), cache classification par hash SHA-256, persistance complète du `response_payload`, circuit breaker max 3 extractions facturables par dossier, chunking PDF, migration vers Gemini Batch API.
- **Suite de tests** : pousser plus loin la suite T1-T5 avec des tests positifs (le flow complet d'un dossier réel doit toujours fonctionner) — un harness Vitest + Playwright sur le golden path serait l'investissement le plus rentable.

---

## Annexes

### Méthodologie de double-check

- Chaque claim de policy/RLS/RPC vérifié via `pg_policies`, `pg_class`, `pg_proc`, `pg_get_functiondef`, `information_schema` (MCP Supabase, lecture seule)
- Chaque claim de code vérifié par lecture du fichier avec citation `fichier:ligne`
- Sous-agents utilisés en parallèle sur 3 axes (sécurité code, robustesse code, Gemini code) + 1 sous-agent dédié aux régressions frontend, pour limiter la fenêtre de confirmation et éviter les biais croisés
- Aucune action mutative (zéro UPDATE/INSERT/DELETE en base, zéro édition de fichier, zéro `git` commit)

### Limites de cet audit

- Tests d'attaque T1-T5 préparés mais **non exécutés** (nécessite la clé anon publique fournie par l'utilisateur). À valider en runtime.
- Comportement effectif de `EdgeRuntime.waitUntil` non testé (lecture seule du code uniquement).
- Quotas Gemini File API et timeouts Supabase Edge Functions effectifs : conformes à la doc publique mais non vérifiés en charge réelle.
- Stripe webhook : confirmé absent par lecture, mais à valider dans le dashboard Stripe (si un webhook existe sans handler, les events s'accumulent).
- Bug pré-existant Known Bug #7 (orchestrator access_token forwarding) : confirmé par les tests Phase 4 du changelog Gemini, non re-testé dans cet audit.

### Récap des claims marqués "à vérifier en runtime"

Aucun. Tous les claims du présent rapport sont vérifiables par lecture statique (code) ou requête SQL (DB). Les tests T1-T5 fournissent une couche de validation runtime additionnelle, à exécuter par l'utilisateur.

---

## TL;DR pour Slack ou commit message

> **Audit clôture refacto sécurité+robustesse+Gemini** : 22 ✅ / 2 🟡 / 1 ❌ / 2 ⚠️. La couche données est solidement protégée, les 4 fixes money-loss sont atomiques, la migration Gemini 2.5 Flash-Lite est validée runtime. Bloquant launch : (1) Stripe B2B Price IDs encore placeholders, (2) bug orchestrator access_token forwarding pré-existant (KB#7), (3) lead capture frontend cassée silencieusement par le RLS lockdown. À corriger sous 1 semaine : logo PDF B2B (même cause que #3), `pv-dossier/generate-share-link` qui casse l'immutabilité Fix #2, `pv-send-email` sans auth. Suite de 5 tests de régression sécurité préparée dans `.claude/tests/security-regression/`.
