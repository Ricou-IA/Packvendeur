# Tests de régression sécurité — Pack Vendeur

Suite de 5 scripts Node.js qui valident en runtime les protections RLS et access_token mises en place lors de la refonte sécurité du 2026-04-26. À relancer après chaque modification du schéma `pack_vendeur`, des policies RLS, des views `public.pv_*`, ou des edge functions d'auth.

## Pré-requis

- Node.js installé (versions 18+)
- Le module `@supabase/supabase-js` est déjà dans les dépendances du projet (cf. `package.json`).
- Une fois dans le repo : `npm install` si pas déjà fait.

## Configuration

Crée un fichier `.env.local.tests` à la racine du repo (ou réutilise `.env.local` s'il contient déjà `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`).

Variables nécessaires (uniquement la clé publique anon — JAMAIS la clé service_role) :
```
VITE_SUPABASE_URL=https://odspcxgafcqxjzrarsqf.supabase.co
VITE_SUPABASE_ANON_KEY=<clé anon publique du projet>
```

La clé anon est visible dans : Dashboard Supabase → Project Settings → API → `anon` `public`. Elle est déjà publique (présente dans le bundle JS) — ce n'est pas un secret.

## Lancement (PowerShell, depuis la racine du repo)

Pour lancer un test individuel :
```powershell
$env:VITE_SUPABASE_URL = "https://odspcxgafcqxjzrarsqf.supabase.co"
$env:VITE_SUPABASE_ANON_KEY = "<colle ta clé anon ici>"
node .claude\tests\security-regression\T1-select-dossiers.mjs
```

Pour lancer les 5 tests à la suite :
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

Si tu veux automatiser sans coller la clé à chaque session, ajoute la ligne dans `.env.local` à la racine et utilise un loader d'env (ex: `dotenv-cli`) ou `Get-Content .env.local | ForEach-Object { ... }`.

## Codes de sortie

- `0` ✅ PASS — l'attaque a échoué (comportement attendu)
- `1` ❌ FAIL CRITIQUE — l'attaque a réussi (régression de sécurité, à corriger immédiatement)
- `2` ⚠️ ERREUR DE CONFIG — variables manquantes

## Tests inclus

| Test | Vecteur d'attaque | Résultat attendu |
|------|-------------------|------------------|
| T1 | `SELECT * FROM pv_dossiers` en anon | `data: []` ou erreur RLS |
| T2 | `UPDATE pv_dossiers SET stripe_payment_status='paid'` en anon | 0 ligne modifiée ou erreur RLS |
| T3 | `SELECT pro_token, email FROM pv_pro_accounts` en anon | `data: []` ou erreur RLS |
| T4 | Appel `pv-run-extraction` SANS header `X-Pv-Access-Token` | HTTP 401 |
| T5 | Appel `pv-run-extraction` avec `X-Pv-Access-Token` bidon | HTTP 403 |

## Limites

- T2 utilise un `dossier_id` fictif (`00000000-...`). Si tu veux confirmer que même un `dossier_id` réel ne peut pas être modifié en anon, remplace-le par un id réel issu de la base ; le résultat doit rester "0 ligne modifiée".
- T4/T5 dépendent du comportement réel de l'edge function déployée. Si tu modifies `_shared/auth.ts`, relance ces 2 tests.
- Aucun de ces tests n'écrit en base — sauf si la sécurité est cassée, auquel cas T2 modifierait une ligne (improbable car l'`id` est fictif).

## Quand relancer

- Après toute modification d'une migration RLS sur `pack_vendeur.*`
- Après toute modification de `_shared/auth.ts` ou des helpers `verify*`
- Après toute modification d'une vue `public.pv_*`
- Après tout changement de configuration de `storage.buckets` ou des policies storage
- Avant un déploiement en production
- Périodiquement (mensuel) pour détecter les régressions silencieuses
