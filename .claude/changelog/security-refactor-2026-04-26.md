# Refonte sécurité Pack Vendeur — 2026-04-26

## TL;DR

Refonte complète de la couche sécurité avant lancement public. La situation initiale (audit du même jour, voir `.claude/audits/rls-audit-2026-04-26.md`) était équivalente à des tables sans RLS : un attaquant avec uniquement la clé anon publique pouvait lire/modifier tous les dossiers, voler tous les pro_tokens et télécharger tous les fichiers du bucket.

Après cette refonte :
- Toutes les RLS anon des tables `pack_vendeur.*` sont supprimées (policies `service_role` only)
- Toutes les vues `public.pv_*` passent en `security_invoker = true`
- Bucket `pack-vendeur` privé + limite MIME + 4 policies anon supprimées
- Toutes les mutations passent par 13 edge functions (6 nouvelles + 7 existantes durcies)
- Pattern access_token introduit : UUID v4 par dossier, header `X-Pv-Access-Token`, vérification temps constant
- Quota 3 extractions par dossier via fonction Postgres atomique
- 60 dossiers existants en base sont orphelins (pas de migration prévue, ils s'auto-nettoient à 7 jours via `expires_at`)

**Aucun fichier Majordhome touché.**

---

## Récapitulatif par phase

### Phase 0 — Vérification d'isolation
- Snapshot des 25 schémas et 13 buckets du projet partagé
- Confirmation : Pack Vendeur isolé dans schéma `pack_vendeur` + 8 vues `public.pv_*` + bucket `pack-vendeur`

### Phase 1 — Stop-bleed RLS (migration `pack_vendeur_security_phase1_stop_bleed`)
- DROP de 19 policies trop permissives sur 8 tables
- DROP de 4 policies storage trop permissives (`pack_vendeur_select/insert/update/delete`)
- `FORCE ROW LEVEL SECURITY` sur les 8 tables
- 8 vues `public.pv_*` passées en `security_invoker = true`
- Bucket `pack-vendeur` : `public = false`, `file_size_limit = 52428800`, `allowed_mime_types = ['application/pdf']`
- Recréation de la policy `service_full_email_logs` (l'ancienne ciblait à tort `public`)

### Phase 1.D + 2 (migration `pack_vendeur_security_phase1d_2_access_token`)
- 3 policies `service_full_*` ajoutées (leads, pro_accounts, pro_credit_transactions) pour cohérence
- Colonne `access_token uuid UNIQUE NOT NULL DEFAULT gen_random_uuid()` ajoutée à `pack_vendeur.dossiers` (60 dossiers tokenisés rétroactivement)
- Colonne `extractions_count int NOT NULL DEFAULT 0` ajoutée
- Index `idx_dossiers_access_token`
- Vue `pv_dossiers` recréée avec les 2 nouvelles colonnes (102 colonnes au total)

### Phase 2bis (migration `pack_vendeur_security_phase5_move_increment_function`)
- Fonction `public.pv_increment_extractions(uuid)` créée (déplacée depuis `pack_vendeur` pour exposition PostgREST)
- `SECURITY DEFINER`, `GRANT EXECUTE` à `service_role` uniquement

### Phase 3 — Helper auth partagé
- **Nouveau** : `supabase/functions/_shared/auth.ts` (5 exports : `extractAccessToken`, `extractProToken`, `verifyDossierAccess`, `verifyProAccess`, `verifyShareToken`) avec comparaison de tokens en temps constant
- **Modifié** : `supabase/functions/_shared/cors.ts` (+2 headers CORS : `x-pv-access-token`, `x-pv-pro-token`)

### Phase 5 — Patch bucket MIME (migration `pack_vendeur_security_phase5_bucket_mime_types`)
- Bucket `pack-vendeur` accepte aussi `image/png`, `image/jpeg`, `image/webp` (pour les logos pro)

### Phase 5 — 6 nouvelles edge functions
| EF | Lignes | Actions |
|----|--------|---------|
| `pv-dossier` | ~190 | create, get, update, generate-share-link |
| `pv-document` | ~270 | upload, list, signed-url, update, remove, upload-generated |
| `pv-notary` | ~190 | get-data (filtré + bulk signed URLs), increment-download |
| `pv-track-event` | ~80 | (insert pv_events, no auth) |
| `pv-pro` | ~510 | create-account, get-account, update-account, upload-logo, get-logo-url, list-dossiers, create-dossier, list-transactions, consume-credit, **get-dossier**, **update-dossier**, **list-documents**, **signed-url-document** |
| `pv-client-upload` | ~280 | get-dossier, list-documents, upload, signed-url-document, remove-document, update-dossier |

### Phase 5 — 6 edge functions modifiées
| EF | Modification |
|----|--------------|
| `pv-classify` | + `verifyDossierAccess` |
| `pv-extract-financial` | + `verifyDossierAccess` (en remplacement du payment check isolé) |
| `pv-extract-diagnostics` | + `verifyDossierAccess` |
| `pv-run-extraction` | + `verifyDossierAccess` + quota atomique via `pv_increment_extractions` + `X-Pv-Access-Token` forwarded aux extracteurs internes |
| `pv-create-payment-intent` | + `verifyDossierAccess` sur `create-checkout` + CORS étendu |
| `pv-pro-credits` | + `verifyProAccess` sur `create-checkout` + CORS étendu |

### Phase 4 — Frontend
- **Nouveau** : `src/lib/supabase-functions.js` — helper `invokeFunction(name, body, options)` avec auto-injection des headers `X-Pv-Access-Token` ou `X-Pv-Pro-Token`
- **Nouveau** : `src/services/clientUpload.service.js` (B2B client via upload_token)
- **Nouveau** : `src/hooks/useClientDocuments.js` (B2B client)
- **Nouveau** : `src/hooks/useProDocuments.js` (B2B pro, read-only + stubs upload/remove)
- **Modifiés** : `src/services/dossier.service.js`, `document.service.js`, `pro.service.js`, `tracking.service.js`, `gemini.service.js`, `stripe.service.js`, `proStripe.service.js` (toutes méthodes via `invokeFunction`)
- **Modifiés** : `src/hooks/useDossier.js`, `useDocuments.js`, `useNotaryShare.js`, `useProAccount.js`, `useClientUpload.js`, `useAnalysis.js`
- **Modifiés** : `src/pages/pro/ProDossierDetailPage.jsx` (suppression du SELECT direct), `src/pages/ClientUploadPage.jsx` (basculé sur `clientUploadService` + `useClientDocuments`)
- **Modifié** : `src/App.jsx` — route `/dossier/:sessionId` supprimée
- **Suppressions** : `gemini.service.js` n'expose plus `extractFinancial` ni `extractDiagnostics` (dead code post-refacto serveur)
- **Méthode supprimée** : `dossierService.getDossierBySession` (remplacée par flow `create` idempotent + `get(dossierId)`)

### Phase 8 — CLAUDE.md
- Section "⚠️ Gotchas critiques" en haut (6 points)
- Section "Sécurité — pattern access_token (B2C)" complète : 3 clés localStorage, flow du token, pattern obligatoire pour les nouvelles EFs, table de mapping auth multi-tenant, RLS et schéma, quota d'extraction

---

## ⏳ Phase 7 — Stripe B2B price IDs (en attente de toi)

Trois produits Stripe à créer dans le dashboard, mode **Live** (ou Test pour le moment selon ton choix) :

### Étape 1 — Connexion
https://dashboard.stripe.com → mode Live (ou Test)

### Étape 2 — Pack 1 crédit
- Menu : `Produits` → `Catalogue de produits` → `Ajouter un produit`
- Nom : `Crédit Pré-état daté Pro × 1`
- Description : `1 crédit pour générer un dossier Pré-état daté professionnel`
- Tarification : `Tarification standard` / Type : `Tarification ponctuelle` (pas Récurrent)
- Devise : EUR
- Prix : à confirmer (suggestion 24,99 €)
- → Copier le **Price ID** (commence par `price_`)

### Étape 3 — Pack 10 crédits
- Idem avec : `Crédit Pré-état daté Pro × 10`, `10 crédits — 10 dossiers à générer`, prix à confirmer (suggestion 199 €)

### Étape 4 — Pack 20 crédits
- Idem avec : `Crédit Pré-état daté Pro × 20`, `20 crédits — 20 dossiers à générer`, prix à confirmer (suggestion 349 €)

### Étape 5 — Me coller les 3 Price IDs
```
price_1_credit  = price_xxx
price_10_credits = price_xxx
price_20_credits = price_xxx
```

Je remplace alors les placeholders dans `supabase/functions/pv-pro-credits/index.ts:17,22,27`.

---

## ✅ Plan de tests manuels (Phase 9 — à exécuter en local)

Lance `npm run dev` (port 5174). Toutes les commandes de test sont en PowerShell (Windows).

### Pré-requis
**Important** : déployer les edge functions sur Supabase **avant** les tests. Via le MCP Supabase :
- Les 6 nouvelles : `pv-dossier`, `pv-document`, `pv-notary`, `pv-track-event`, `pv-pro`, `pv-client-upload`
- Les 6 modifiées : `pv-classify`, `pv-extract-financial`, `pv-extract-diagnostics`, `pv-run-extraction`, `pv-create-payment-intent`, `pv-pro-credits`

⚠️ **Avant de tester** : vide localStorage navigation privée (les anciens dossiers sont orphelins) :
```js
// DevTools → Console
localStorage.clear();
```

### Test 1 — Parcours nominal B2C
1. Ouvrir http://localhost:5174/dossier en navigation privée
2. Step 1 : remplir le questionnaire vendeur, passer à Step 2
3. Step 2 : uploader 2-3 PDFs (< 5 MB chacun), attendre la classification (< 30 s)
4. Step 3 : remplir email, payer avec carte test Stripe `4242 4242 4242 4242` (toute date future, CVC quelconque)
5. Step 4 : extraction (~30-60 s)
6. Step 5 : valider les sections, cliquer "Continuer"
7. Step 6 : PDF généré + share link affiché → cliquer pour ouvrir, copier le lien

**Vérifications** :
- DevTools → Application → Local Storage → présence des 3 clés `pack-vendeur-session-id`, `pack-vendeur-dossier-id`, `pack-vendeur-access-token` (toutes des UUIDs)
- DevTools → Network → chaque appel `pv-*` a un header `X-Pv-Access-Token` (sauf `pv-track-event`, `pv-create-payment-intent` action `verify-checkout`, `pv-dossier` action `create`)

### Test 2 — Attaque "RLS contournée" via DevTools
DevTools → Console :
```js
const sb = (await import('/src/lib/supabaseClient.js')).default;
const r = await sb.from('pv_dossiers').select('*');
console.log(r);
```
**Attendu** : `data: []` ou error RLS. Si une ligne sort → ÉCHEC.

### Test 3 — Attaque "UPDATE direct paid"
```js
const sb = (await import('/src/lib/supabaseClient.js')).default;
const r = await sb.from('pv_dossiers').update({ stripe_payment_status: 'paid' }).eq('id', '00000000-0000-0000-0000-000000000000');
console.log(r);
```
**Attendu** : aucune ligne modifiée (count: 0) ou error.

### Test 4 — Attaque "dossier_id volé sans access_token"
```js
const sb = (await import('/src/lib/supabaseClient.js')).default;
const r = await sb.functions.invoke('pv-run-extraction', { body: { dossier_id: '00000000-0000-0000-0000-000000000000' } });
console.log(r);
```
**Attendu** : 401 (header missing) ou 403 (token mismatch).

### Test 5 — Attaque "vol de pro_token"
```js
const sb = (await import('/src/lib/supabaseClient.js')).default;
const r = await sb.from('pv_pro_accounts').select('pro_token, email');
console.log(r);
```
**Attendu** : `data: []` ou error. Si un pro_token sort → ÉCHEC critique.

### Test 6 — Quota 3 extractions
1. Faire passer un dossier complet (Test 1) — note le `dossier_id`.
2. Reset le statut via MCP Supabase :
   ```sql
   UPDATE pack_vendeur.dossiers SET status = 'paid', extracted_data = '{}'::jsonb WHERE id = '<id>';
   ```
3. Re-déclencher l'extraction (recharger Step 4 ou DevTools)
4. Répéter 2-3 fois.
5. À la 4ème, **attendu** : 429 avec message "Extraction quota exceeded".
6. Vérifier en DB : `SELECT extractions_count FROM pack_vendeur.dossiers WHERE id = '<id>'` → 4.

### Test 7 — Notaire ne voit pas les champs sensibles
1. Sur un dossier complet, copier le share_token (DevTools sur Step 6).
2. Ouvrir `http://localhost:5174/share/<share_token>` en navigation privée.
3. DevTools → Network → réponse de l'appel `pv-notary` → inspecter le JSON.
4. **Attendu** : `dossier` contient uniquement `id, property_address, property_postal_code, property_city, expires_at, share_token, notary_accessed_at, download_count`. Pas de `session_id`, `access_token`, `email`, `seller_email`, données financières, `extracted_data`, `validated_data`, `questionnaire_data`.
5. Documents : pas de `storage_path`, pas de `extracted_data`/`extracted_text`.
6. `pdf_signed_url` et `pack_files` doivent être présents avec des URLs commençant par `https://*.supabase.co/storage/...`.
7. Cliquer "Télécharger le pack complet" → doit zipper et télécharger.

### Test 8 — Bucket Storage non public
1. Ouvrir une URL publique directe : `https://odspcxgafcqxjzrarsqf.supabase.co/storage/v1/object/public/pack-vendeur/<n'importe_quel_chemin>` → **attendu** : 400/404/401.
2. Tentative de listing :
   ```js
   const sb = (await import('/src/lib/supabaseClient.js')).default;
   const r = await sb.storage.from('pack-vendeur').list('');
   console.log(r);
   ```
   → **attendu** : erreur ou liste vide.

### Test 9 — B2B Stripe (après Phase 7 finalisée)
1. http://localhost:5174/pro/register → créer un compte
2. http://localhost:5174/pro/credits → cliquer "1 crédit"
3. **Attendu** : Stripe Checkout s'ouvre proprement (pas de 404), montant correct
4. Carte test → return → balance = 1, transaction visible

### Test 10 — Isolation Majordhome
1. Avec un compte Majordhome existant, faire un parcours basique → **attendu** : aucune régression.
2. Via MCP Supabase :
   ```sql
   SELECT COUNT(*) FROM majordhome.organizations;
   SELECT COUNT(*) FROM core.profiles;
   ```
   → **attendu** : retourne des valeurs > 0 (Majordhome intact).

### Test 11 — Espace Pro consultation dossier
1. Login Pro → dashboard
2. Cliquer sur un dossier B2B existant → /pro/dossier/:id
3. **Attendu** : la page se charge, le dossier s'affiche.
4. Ouvrir DevTools → Network → l'appel à `pv-pro` action `get-dossier` doit retourner 200 + dossier.
5. Liste des documents (s'il y en a) — utilise `pv-pro` action `list-documents`.

### Test 12 — Client B2B upload
1. Pro génère un dossier B2B → upload_token créé.
2. Copier l'URL `/client/<upload_token>` et l'ouvrir en navigation privée.
3. **Attendu** : la page client s'affiche avec le branding du pro (logo, nom).
4. Uploader un PDF → **attendu** : succès via `pv-client-upload` action `upload`.
5. Vérifier que le doc apparaît dans la liste côté pro (`/pro/dossier/:id`).

---

## 🚧 Points d'attention / non-finis

### Stripe B2B price IDs (Phase 7)
Bloquant pour le launch B2B. À créer dans le dashboard Stripe puis remplacer dans `pv-pro-credits/index.ts:17,22,27`.

### Classification AI absente côté B2B client
`useClientDocuments` (page `/client/:uploadToken`) n'appelle pas `pv-classify` — la classification AI nécessite `X-Pv-Access-Token` qui n'est pas disponible côté client B2B.
**Impact** : les documents uploadés par le client B2B n'auront pas de `document_type`, `normalized_filename`, ni de détection DDT/DPE automatique. Le pro doit classifier manuellement.
**Solution proposée pour V2** : faire la classification côté serveur, déclenchée par un trigger DB après INSERT, ou via un appel automatique depuis `pv-client-upload` action `upload`.

### Upload PDF côté B2B pro désactivé
`useProDocuments.uploadFiles` retourne un toast "Upload depuis le compte pro non disponible". C'est intentionnel — l'upload est censé venir du client (via `/client/:uploadToken`).
**Si besoin V2** : ajouter `upload-document` à `pv-pro` (vérifier `pro_account_id` ownership).

### Suppression de doc côté pro désactivée
`useProDocuments.removeDocument` retourne un toast. Pour activer : ajouter `remove-document` à `pv-pro` (vérifier ownership).

### Génération PDF côté pro
`DeliveryPanel` utilise `documentService.uploadGeneratedFile` qui passe par `pv-document` action `upload-generated` avec `X-Pv-Access-Token`. Côté B2B, ça ne marchera pas (pas d'access_token). À câbler en V2 via `pv-pro` action `upload-generated` ou similaire.

### useDocuments dans ProDossierDetailPage / ClientUploadPage
Les imports ont été remplacés par `useProDocuments` / `useClientDocuments` mais la page utilise certains composants partagés (GuidedUpload, etc.) qui peuvent attendre la signature complète de useDocuments. À vérifier visuellement lors du test 11/12.

### Tests automatisés
Aucun. Le repo n'a pas de framework de tests. Tous les tests ci-dessus sont manuels. Pour V2 : mettre Vitest + Playwright sur le golden path.

### Avertissement RGPD
Les 60 dossiers existants à la date du refacto (2026-04-26) sont **orphelins** côté localStorage navigateur — leurs propriétaires ne pourront plus y accéder. Ils s'auto-nettoieront via `expires_at` (7 jours). Décision figée par l'utilisateur (point 3 du brief initial).

### Migrations DB appliquées
4 migrations via MCP Supabase, traçables dans `supabase_migrations.schema_migrations` :
1. `pack_vendeur_security_phase1_stop_bleed`
2. `pack_vendeur_security_phase1d_2_access_token`
3. `pack_vendeur_security_phase5_bucket_mime_types`
4. `pack_vendeur_security_phase5_move_increment_function`

Pour rollback (en cas de problème majeur) : restaurer les policies anon depuis le dump audit (`.claude/audits/rls-audit-2026-04-26.md`) — mais ce serait un retour à la situation vulnérable. Préférer un fix forward.

---

## Fichiers modifiés (récapitulatif final)

### Edge Functions (12 fichiers)
- ✅ Nouveaux : `_shared/auth.ts`, `pv-dossier/index.ts`, `pv-document/index.ts`, `pv-notary/index.ts`, `pv-track-event/index.ts`, `pv-pro/index.ts`, `pv-client-upload/index.ts`
- ✅ Modifiés : `_shared/cors.ts`, `pv-classify/index.ts`, `pv-extract-financial/index.ts`, `pv-extract-diagnostics/index.ts`, `pv-run-extraction/index.ts`, `pv-create-payment-intent/index.ts`, `pv-pro-credits/index.ts`

### Frontend (16 fichiers)
- ✅ Nouveaux : `src/lib/supabase-functions.js`, `src/services/clientUpload.service.js`, `src/hooks/useClientDocuments.js`, `src/hooks/useProDocuments.js`
- ✅ Modifiés : `src/services/dossier.service.js`, `document.service.js`, `pro.service.js`, `tracking.service.js`, `gemini.service.js`, `stripe.service.js`, `proStripe.service.js`
- ✅ Modifiés : `src/hooks/useDossier.js`, `useDocuments.js`, `useNotaryShare.js`, `useProAccount.js`, `useClientUpload.js`, `useAnalysis.js`
- ✅ Modifiés : `src/pages/pro/ProDossierDetailPage.jsx`, `src/pages/ClientUploadPage.jsx`, `src/App.jsx`

### Documentation
- ✅ Modifié : `CLAUDE.md` (sections "Gotchas critiques", "Sécurité — pattern access_token", "Convention auth multi-tenant", "Quota d'extraction")
- ✅ Nouveau : `.claude/changelog/security-refactor-2026-04-26.md` (ce fichier)

---

## Commit suggéré (à toi de jouer)

```
feat(security): complete security refactor — access_token + RLS + edge functions

BREAKING CHANGE: les 60 dossiers existants en base ne sont plus accessibles
via leur navigateur d'origine (pas d'access_token côté client). Ils
s'auto-nettoieront via expires_at à 7 jours.

- Migration RLS : drop des 19 policies anon trop permissives sur pack_vendeur.*
- Vues public.pv_* en security_invoker = true
- Bucket pack-vendeur privé + MIME limits + 4 policies anon DROP
- Pattern access_token introduit (UUID v4 par dossier, header X-Pv-Access-Token)
- Quota 3 extractions max par dossier (fonction Postgres atomique)
- 6 nouvelles edge functions, 6 modifiées
- Frontend complètement rebranché sur les EFs (plus de SELECT direct)

Reste à faire : Phase 7 (Stripe B2B price IDs) — voir
.claude/changelog/security-refactor-2026-04-26.md
```
