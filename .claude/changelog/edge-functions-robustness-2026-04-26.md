# Phase 1 — Robustesse opérationnelle Edge Functions (4 fixes money-loss)

**Date** : 2026-04-26
**Auteur** : Claude Opus 4.7 (sous direction d'Eric Pudebat)
**Source** : audit `.claude/audits/edge-functions-robustness-2026-04-26.md`, Phase 1 du plan d'amélioration
**Scope** : 4 fixes critiques money-loss. Phases 2 et 3 du rapport (validation UUID, AbortSignal, sanitisation prompts, tracking coûts, alerting, webhook Stripe replay-safe…) **explicitement hors scope**.

---

## TL;DR

| Fix | Fichier(s) | Risque éliminé |
|-----|-----------|----------------|
| **#1** verify-checkout error check | `pv-create-payment-intent/index.ts` | User paie, dossier reste en `draft`, support ticket |
| **#2** share_token immutable | `pv-create-payment-intent/index.ts` | Reload `/payment/success` regénère le token → lien notaire mort |
| **#3** RPC atomique crédits pros | `pv-pro-credits/index.ts` + migration `pv_pro_add_credits` | 2 achats parallèles → dernier writer wins, 1 pack perdu |
| **#4** Claim atomique extraction | `pv-run-extraction/index.ts` + migration `pv_claim_extraction` | 2 requêtes simultanées → 2 extractions Gemini en parallèle ($1-2 perdus) |

**3 EFs à redéployer** : `pv-create-payment-intent`, `pv-pro-credits`, `pv-run-extraction`. Migrations DB déjà appliquées.

---

## Fix #1 — `verify-checkout` ne checkait pas l'erreur SQL

### Avant
```ts
await supabase.from("pv_dossiers").update({...}).eq("id", dossierId);
return jsonResponse({ paid, dossier_id, ... });
// Si UPDATE fail (RLS, réseau, contention) : { paid: true } envoyé,
// dossier reste en 'draft', user pense avoir payé, ne reçoit pas le service.
```

### Après ([pv-create-payment-intent/index.ts:230-295](supabase/functions/pv-create-payment-intent/index.ts:230))
- Capture `{ error: updateErr }` du `.update()`
- Si erreur : log structuré `[verify-checkout] DB update failed after Stripe confirmation` avec `dossier_id`, `checkout_session_id`, `error` → return `{ error: "Failed to confirm payment in DB" }` HTTP 500
- Email post-purchase fire-and-forget conditionné au succès du UPDATE (sinon Marie reçoit un mail avec un share link absent en DB)
- Inversion du `if (supabase)` en early-return 500 : un Supabase indisponible est aussi un money-loss potentiel

### Comportement frontend
`PaymentSuccessPage.jsx` détecte `error || !data?.paid` → setStatus('error') → affiche le panneau "Vérification en cours / Le paiement n'a pas pu être vérifié immédiatement…". Marie peut recharger pour retry — la fonction est désormais idempotente grâce au Fix #2.

---

## Fix #2 — `share_token` regénéré à chaque verify-checkout

### Avant
```ts
const shareToken = crypto.randomUUID().replace(/-/g, "");
await supabase.from("pv_dossiers").update({
  ..., share_token: shareToken, share_url: `https://.../share/${shareToken}`
}).eq("id", dossierId);
// Reload de la success page → nouveau token → ancien lien notaire devient mort.
```

### Après ([pv-create-payment-intent/index.ts:240-282](supabase/functions/pv-create-payment-intent/index.ts:240))
- SELECT `share_token, share_url` du dossier avant l'UPDATE (avec `maybeSingle()` + check error)
- Payload UPDATE construit dynamiquement : `share_token` et `share_url` ne sont ajoutés **que si `existing.share_token` est falsy**
- Premier paiement : `share_token` NULL → génère + UPDATE inclut le token
- Replays : `share_token` non-NULL → UPDATE n'inclut pas le token → valeur préservée

### Option choisie : A (génération conditionnelle dans verify-checkout)
L'option B (DEFAULT en base à la création) a été présentée et écartée pour cette session : nécessitait une migration sur 60 dossiers existants + refacto de `share_url` (trigger ou changement de contrat front). À reconsidérer en Phase 4 "Refactor" du plan d'audit.

### Test direct
```sql
SELECT share_token FROM pv_dossiers WHERE id = '<id>';
-- Reload /payment/success?cs=xxx 3 fois
SELECT share_token FROM pv_dossiers WHERE id = '<id>';
-- Doit être identique
```

---

## Fix #3 — Race condition sur les crédits B2B

### Avant ([pv-pro-credits/index.ts](supabase/functions/pv-pro-credits/index.ts), ancien code)
```ts
const { data: account } = await supabase.from("pv_pro_accounts").select("credits")...
const newBalance = (account.credits || 0) + creditsCount;
await supabase.from("pv_pro_accounts").update({ credits: newBalance })...
await supabase.from("pv_pro_credit_transactions").insert({...});  // non-blocking
```
Si 2 achats Stripe se finalisent en parallèle, les 2 verify-checkout lisent la même valeur de `credits=N`, calculent N+packA et N+packB, dernier writer wins → 1 pack perdu. L'idempotency Stripe (différent `stripe_session_id`) ne protège pas (deux sessions distinctes).

### Migration DB appliquée — `pv_pro_add_credits_atomic`
```sql
CREATE OR REPLACE FUNCTION public.pv_pro_add_credits(
  p_account_id uuid, p_amount int, p_stripe_session_id text, p_description text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'pack_vendeur', 'public'
AS $$
DECLARE
  v_new_balance int;
  v_existing_tx uuid;
BEGIN
  -- Idempotency replay-safe via stripe_session_id
  SELECT id INTO v_existing_tx FROM pack_vendeur.pro_credit_transactions
  WHERE stripe_session_id = p_stripe_session_id;

  IF v_existing_tx IS NOT NULL THEN
    SELECT credits INTO v_new_balance FROM pack_vendeur.pro_accounts WHERE id = p_account_id;
    RETURN jsonb_build_object('new_balance', COALESCE(v_new_balance, 0), 'already_processed', true);
  END IF;

  -- Atomic UPDATE + RETURNING (race-safe)
  UPDATE pack_vendeur.pro_accounts
  SET credits = COALESCE(credits, 0) + p_amount, updated_at = now()
  WHERE id = p_account_id
  RETURNING credits INTO v_new_balance;

  IF v_new_balance IS NULL THEN
    RAISE EXCEPTION 'Pro account not found: %', p_account_id;
  END IF;

  -- INSERT atomique dans la même transaction Postgres
  INSERT INTO pack_vendeur.pro_credit_transactions (
    pro_account_id, amount, balance_after, type, description, stripe_session_id
  ) VALUES (
    p_account_id, p_amount, v_new_balance, 'purchase',
    COALESCE(p_description, 'Achat ' || p_amount || ' credit' || CASE WHEN p_amount > 1 THEN 's' ELSE '' END),
    p_stripe_session_id
  );

  RETURN jsonb_build_object('new_balance', v_new_balance, 'already_processed', false);
END;
$$;

REVOKE ALL ON FUNCTION ... FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION ... TO service_role;
```

### Après ([pv-pro-credits/index.ts:148-220](supabase/functions/pv-pro-credits/index.ts:148))
105 → 70 lignes. Tout le bloc check-existing-tx + read-credits + update-credits + insert-tx est remplacé par un seul `supabase.rpc("pv_pro_add_credits", {...})`. Toute erreur RPC → log + 500 (pas de tentative de distinguer 404 vs 500 — KISS).

### Atomicité garantie par PostgreSQL
- Le UPDATE (balance) et l'INSERT (audit log) tournent dans la **même transaction implicite** d'un appel de fonction PL/pgSQL → l'un échoue, l'autre est rollback. Plus de risque d'orphelin.
- Le `UPDATE ... RETURNING` est atomique au niveau row-lock → race-safety.
- L'idempotency `stripe_session_id` est checkée et l'INSERT happen dans la même transaction → impossible d'avoir 2 lignes pour la même session.

---

## Fix #4 — Race condition sur `pv-run-extraction`

### Avant ([pv-run-extraction/index.ts:530-576](supabase/functions/pv-run-extraction/index.ts:530), ancien code)
```ts
// Handler
const dossier = auth.dossier;  // SELECT via verifyDossierAccess
if (dossier.status === "analyzing") return { reason: "already_analyzing" };
if (hasReal && dossier.status === "pending_validation") return { reason: "already_extracted" };
const { data: newCount } = await supabase.rpc("pv_increment_extractions", { p_dossier_id });
if (newCount > 3) return 429;
EdgeRuntime.waitUntil(runExtraction(dossierId));

// runExtraction()
await supabase.from("pv_dossiers").update({ status: "analyzing" }).eq("id", dossierId);
```
Race : 2 requêtes simultanées peuvent passer le check `status === 'analyzing'` toutes les deux **avant** que la première ait exécuté son UPDATE → 2 extractions Gemini en parallèle ($1-2 perdus).

### Migration DB appliquée — `pv_claim_extraction_atomic`
```sql
CREATE OR REPLACE FUNCTION public.pv_claim_extraction(p_dossier_id uuid)
RETURNS TABLE(new_extractions_count int, new_status pack_vendeur.dossier_status)
LANGUAGE sql SECURITY DEFINER
SET search_path TO 'pack_vendeur', 'public'
AS $$
  UPDATE pack_vendeur.dossiers
  SET status = 'analyzing',
      extractions_count = extractions_count + 1,
      updated_at = now()
  WHERE id = p_dossier_id
    AND status = 'paid'
    AND extractions_count < 3
  RETURNING extractions_count, status;
$$;

REVOKE ALL ... FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ... TO service_role;

DROP FUNCTION IF EXISTS public.pv_increment_extractions(uuid);
```

`pv_increment_extractions` est droppée — n'est appelée nulle part après ce fix, garder du code mort = dette technique.

### Après ([pv-run-extraction/index.ts:552-595](supabase/functions/pv-run-extraction/index.ts:552))
1. **Fast-path idempotency** : si `pending_validation` + `extracted_data` non vide → short-circuit 200 (évite de bumper le quota juste pour détecter que le travail est déjà fait).
2. **Atomic claim** via `pv_claim_extraction` : un seul UPDATE conditionnel qui set `status='analyzing'` + bump `extractions_count` SEULEMENT SI status='paid' AND extractions_count<3.
3. **Diagnostic des 0 rows** via le dossier déjà lu par `verifyDossierAccess` :
   - `extractions_count >= 3` → 429 quota_exceeded
   - sinon → 200 `already_analyzing` ou `already_done_or_busy`

Le `UPDATE status='analyzing'` au début de `runExtraction()` ([:251-260](supabase/functions/pv-run-extraction/index.ts:251)) est supprimé : déjà fait par la RPC. Bonus : on évite de re-toucher `updated_at` que `ProcessingStep.jsx` utilise pour calculer le timer du resume-after-refresh.

### Tests mentaux validés

| Scénario | Comportement | OK ? |
|----------|--------------|------|
| 2 requêtes simultanées (count=0) | R1 wins, R2 voit 0 rows → 200 already_done_or_busy | ✅ pas de double extraction |
| Quota count=3 | claim échoue, diagnose count≥3 → 429 | ✅ |
| Dossier inexistant | verifyDossierAccess → 404 avant la RPC | ✅ |
| Retry après échec (status='paid' revert, count=1) | claim succeeds, count=2 | ✅ |
| Quota préservé en cas d'échec d'extraction | compteur PAS rollback (par design) | ✅ |

---

## Fichiers modifiés

| Fichier | Lignes affectées | Type |
|---------|------------------|------|
| `supabase/functions/pv-create-payment-intent/index.ts` | 230–295 | Fix #1 + #2 |
| `supabase/functions/pv-pro-credits/index.ts` | 148–220 | Fix #3 |
| `supabase/functions/pv-run-extraction/index.ts` | 251–260, 552–595 | Fix #4 |
| `CLAUDE.md` | Gotcha #4, section Quota, section RPC PostgreSQL custom (nouvelle), section Patterns idempotence (nouvelle), SQL Test Dossier | Documentation |

## Migrations DB appliquées (via MCP Supabase)

1. **`pv_pro_add_credits_atomic`** — création de la fonction `public.pv_pro_add_credits(uuid, int, text, text) → jsonb`
2. **`pv_claim_extraction_atomic`** — création de `public.pv_claim_extraction(uuid) → TABLE(...)` + DROP de `public.pv_increment_extractions(uuid)`

## Déploiement

```powershell
npx supabase functions deploy pv-create-payment-intent
npx supabase functions deploy pv-pro-credits
npx supabase functions deploy pv-run-extraction
```

Les migrations DB sont déjà appliquées en production — ne pas réappliquer.

## Tests manuels post-déploiement

Voir détail de chaque test dans la conversation. Synthèse :

| Fix | Méthode | Effort |
|-----|---------|--------|
| **#1** | Throw temporaire avant UPDATE + reload paiement test → verify state error | 5 min |
| **#2** | F5 ×3 sur `/payment/success` + diff SQL `share_token` | 3 min |
| **#3** | 3 appels SQL `SELECT pv_pro_add_credits(...)` direct + check `pv_pro_credit_transactions` | 2 min |
| **#4** | Double-clic retry + check `pv_ai_logs` (1 seule extraction par run) + check `extractions_count` | 5 min |

## Hors scope (à traiter en Phase 2/3 du plan d'audit)

- Validation UUID format au début de chaque handler
- AbortSignal.timeout() sur fetch Gemini
- Whitelist origin CORS
- Sanitisation `questionnaire_context` / `lot_number` / `property_address` (prompt injection)
- Tracking tokens/coût Gemini dans `pv_ai_logs` (input_tokens, output_tokens, cost_usd)
- Webhook Slack/email pour erreurs critiques
- Webhook Stripe replay-safe (au-delà du verify-checkout)
- Cap taille `file_base64` à 25 MB dans `pv-classify`
- Retry policy sur `uploadToGeminiFileApi`
- Replace placeholder Stripe Price IDs B2B (déjà tracké en TODO)

## Références

- Audit source : `.claude/audits/edge-functions-robustness-2026-04-26.md`
- Session sécurité précédente (RLS + access_token + quota) : `.claude/changelog/security-refactor-2026-04-26.md`
- Doc patterns mis à jour : `CLAUDE.md` § "Patterns d'idempotence et race-safety" + § "RPC PostgreSQL custom"
