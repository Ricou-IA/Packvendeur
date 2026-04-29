# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ Gotchas critiques

- **Ne jamais accéder en direct aux tables `pv_*` ni au bucket `pack-vendeur`** depuis le client — RLS verrouillée. Toutes les mutations passent par les Edge Functions Pack Vendeur (service_role). Voir section "Sécurité — pattern access_token".
- **Stripe B2B price IDs** dans `pv-pro-credits/index.ts:17,22,27` — placeholders à remplacer avant prod. Sans ça, l'achat de crédits B2B retourne 404.
- **Limite par fichier = 50 MB** (cap bucket Supabase + Gemini File API). Depuis le refacto Gemini File API (2026-04-28), les PDFs sont uploadés en streaming via le protocole resumable, plus de cap 6 MB Edge Function payload. La couche front limite à ~50 MB pour rester sous le cap bucket.
- **Bug #7 (orchestrateur access_token forwarding) résolu 2026-04-29** : la nouvelle SERVICE_KEY Supabase est au format `sb_secret_*` (opaque, pas un JWT) → rejetée par le gateway en `UNAUTHORIZED_INVALID_JWT_FORMAT` lors d'appels inter-EF. Workaround : `pv-run-extraction.callExtract` utilise un **legacy ANON JWT hardcodé** (`ANON_KEY_LEGACY_FALLBACK`) en `Authorization: Bearer`, et passe la preuve d'accès via `body.access_token` (`extractAccessToken` lit le body en fallback). Voir `pv-run-extraction/index.ts:30-40` et section "Edge Functions". À nettoyer si Supabase revient à un format JWT pour les service keys.
- **Quota d'extraction = 3 par dossier** (claim atomique status='paid'→'analyzing' + count++ via `public.pv_claim_extraction`). Pas de reset technique. Code promo Stripe à 100% pour les exceptions (RGPD : pas de réutilisation de données entre dossiers).
- **Pas de migration des dossiers existants** lors du refacto sécurité du 2026-04-26 — les 60 dossiers en base à cette date sont orphelins (pas d'access_token côté navigateur). Délai d'expiration RGPD à 7 jours, ils s'auto-nettoient.
- **`useDocuments` est B2C only** (utilise X-Pv-Access-Token). Pour B2B, utiliser `useProDocuments` (read-only côté pro) ou `useClientDocuments` (upload côté client B2B via upload_token). Voir section "Convention auth multi-tenant".

## Project Overview

SaaS one-shot (24.99 EUR/usage) branded as **Pre-etat-date.ai** (domain: `pre-etat-date.ai`, formerly `dossiervente.ai`) that generates the Alur dossier (Pré-état daté) and Seller Pack for French co-ownership property sales. AI (Gemini 2.5) analyzes uploaded co-ownership documents and extracts financial/legal data. Delivered via a notary share link.

**Two distinct funnels share the same backend**:
1. **B2C** (`/dossier`) — pay-first 6-step wizard: questionnaire → upload → **payment** → processing → validation → delivery
2. **B2B "Espace Pro"** (`/pro/*`) — pro accounts buy credit packs, manage clients via kanban, generate share links for client-side uploads (`/client/:uploadToken`)

**Status**: MVP functional end-to-end. Server-side extraction orchestrator (`pv-run-extraction`) survives page refresh / tab close.
**SEO/GEO**: 35 blog articles, 35 city landing pages, 10 region pages, glossary, FAQ + 4 landing pages (tarif, comparatif, professionnels, à-propos). Pre-rendered ~86 SEO routes at build time. JSON-LD (11 schemas), llms.txt/llms-full.txt for AI crawlers.
**Guarantee**: "Satisfait ou remboursé" if notaire refuses the document (on presentation of a motivating letter from the notaire).

## Tech Stack

- **Frontend**: Vite 6.4 + React 18 + Tailwind CSS 3.4 + shadcn/ui (Radix primitives)
- **Backend**: Supabase (shared project with Majordhome — `odspcxgafcqxjzrarsqf`)
- **AI**: Google Gemini 2.5 Flash-Lite (classification, migré 2026-04-26 avant la dépréciation 2.0 Flash du 2026-06-01) + **Gemini 2.5 Pro** (financial extraction) + **Gemini 2.5 Flash** (diagnostics extraction). Frontend triggers a single server-side orchestrator (`pv-run-extraction`) which fans out to `pv-extract-financial` + `pv-extract-diagnostics` in parallel.
- **PDF**: `@react-pdf/renderer` (client-side generation, ~1MB chunk)
- **Payment**: Stripe Checkout (redirect) — `pv-create-payment-intent` (B2C, one-shot 24.99€) and `pv-pro-credits` (B2B credit packs)
- **Email**: Transactional via `pv-send-email` + cron via `pv-email-cron`
- **Forms**: react-hook-form + zod
- **State**: TanStack React Query v5
- **Routing**: react-router-dom v6 (with ScrollToTop on route change)
- **SEO**: react-helmet-async + custom PageMeta/JsonLd components
- **Icons**: lucide-react
- **Deployment**: Vercel
- **Date utils**: date-fns + date-fns/locale/fr

## Commands

```bash
npm run dev          # Dev server on port 5174 (Majordhome uses 5173)
npm run build        # 3-step build: vite build → vite build --ssr → node scripts/prerender.js (~86 routes)
npm run build:client # Client-only build (skip SSR + prerender)
npm run lint         # ESLint
npm run preview      # Preview production build
```

There is no test suite. Verify changes by running `npm run dev` and clicking through the affected funnel step.

## Project Structure

```
scripts/
  prerender.js                 # Post-build: renders ~86 SEO routes to static HTML via entry-server.jsx
  generate-blank-template.js   # Generates blank PDF template
  generate-docx-template.cjs   # Generates .docx download template
  scrape-leads.mjs             # Lead scraper utility
public/
  llms.txt / llms-full.txt     # AI crawler files (llmstxt.org protocol)
  sitemap.xml / robots.txt     # Sitemap (~93 URLs); robots disallows /dossier, /share, /payment, /pro, /client
  modele-pre-etat-date-vierge.{pdf,docx}   # Downloadable blank templates
src/
  App.jsx                      # Routes (B2C, B2B Pro, content/SEO, legal) + providers + ScrollToTop
  main.jsx                     # Entry point (conditional hydrate vs createRoot)
  entry-server.jsx             # SSR entry: StaticRouter + renderToString (eager imports, no lazy)
  lib/
    supabaseClient.js          # Supabase client (storageKey: pack-vendeur-session)
    stripeClient.js            # Lazy-loaded Stripe singleton
    utils.js                   # cn() helper
  services/                    # All return { data, error } — never throw
    dossier.service.js         # CRUD pv_dossiers
    document.service.js        # Upload to Storage + CRUD pv_documents
    gemini.service.js          # invokeRunExtraction() + classifyDocument() (pv-classify)
    ademe.service.js           # DPE verification via ADEME open data API
    stripe.service.js          # B2C Stripe Checkout
    proStripe.service.js       # B2B credit-pack Stripe Checkout (pv-pro-credits)
    pro.service.js             # Pro accounts, dossiers, credits, client uploads
    pdf.service.js             # Generate + upload PDF
    tracking.service.js        # Analytics events
  hooks/
    useDossier.js              # Session management (localStorage UUID), React Query
    useDocuments.js            # Upload + background classification + DDT detection + normalized filenames
    useAnalysis.js             # Thin trigger for pv-run-extraction (pay-first orchestration)
    useDpeVerification.js      # ADEME API call
    useNotaryShare.js          # Public share-page data + downloads
    useProAccount.js           # Pro account auth via localStorage pro-token + dossier list
    useClientUpload.js         # Client-side upload page driven by share token
  schemas/
    questionnaireSchema.js     # Zod schema for questionnaire (~80 fields)
  components/
    ui/                        # shadcn/ui primitives
    seo/                       # PageMeta, JsonLd (11 schemas), Breadcrumb, RelatedArticles
    layout/                    # Header, Footer, StepIndicator (6 steps), MainLayout
    questionnaire/             # QuestionnaireStep (10 tabs per propriétaire)
    upload/                    # GuidedUpload, DocumentChecklist, DpeSection, DdtSection
    dropzone/                  # FileDropzone, FileList
    processing/                # ProcessingStep — animated checklist while pv-run-extraction runs server-side
    validation/                # ValidationForm (5 sections, lock/unlock)
    payment/                   # PaymentCard (Stripe Checkout redirect)
    delivery/                  # DeliveryPanel (auto-generates PDF + share link)
    pdf/                       # PreEtatDateTemplate (10 pages, @react-pdf), styles.js
    pro/                       # ProLayout, ProHeader, KanbanBoard, DossierCard, NewDossierDialog, CreditBadge
  data/
    cities.js                  # 35 cities (RNIC data) + SYNDIC_PRICE_SOURCE + COPRO_SOURCE
    regions.js                 # 10 regions (RNIC data)
    articles.js                # ARTICLE_SLUGS — single source of truth for blog slugs
  pages/
    HomePage.jsx
    DossierPage.jsx            # B2C 6-step wizard (orchestrator)
    NotarySharePage.jsx        # /share/:token — public notary access
    PaymentSuccessPage.jsx / PaymentCancelPage.jsx
    NotFoundPage.jsx
    ClientUploadPage.jsx       # /client/:uploadToken — client of a Pro uploads docs
    pro/                       # ProDashboardPage, ProRegisterPage, ProSettingsPage,
    │                          # ProDossierDetailPage, ProCreditsPage, ProPaymentSuccessPage
    content/                   # HomePage SEO + content surface
      AProposPage / TarifPage / ProfessionnelsPage / ComparatifConcurrentsPage
      CommentCaMarche / FaqPage / GlossairePage
      GuidesIndexPage / BlogArticle (lazy) / BlogArticleServer (eager, SSR)
      VillesIndexPage / CityLandingPage / RegionLandingPage
      articles/                # 35 blog articles (.jsx — lazy in client, eager in SSR)
    legal/                     # MentionsLegalesPage, PolitiqueRgpdPage, CgvPage
supabase/functions/
  _shared/                     # cors.ts, gemini.ts (callGemini + File API upload), logging.ts
  pv-classify/                 # Gemini 2.5 Flash-Lite — per-doc classification
  pv-extract-financial/        # Gemini 2.5 Pro — financial/legal/copro extraction
  pv-extract-diagnostics/      # Gemini 2.5 Flash — diagnostics/technical extraction
  pv-run-extraction/           # SERVER-SIDE ORCHESTRATOR — fans out to extract-financial + extract-diagnostics
  pv-create-payment-intent/    # B2C Stripe Checkout (one-shot 24.99€)
  pv-pro-credits/              # B2B Stripe Checkout for credit packs + consumption
  pv-send-email/               # Transactional email
  pv-email-cron/               # Scheduled email tasks
```

## Supabase Schema

All tables are in the `pack_vendeur` schema with public views prefixed `pv_`:

**B2C (consumer funnel)**
- **`pack_vendeur.dossiers`** → `public.pv_dossiers` — Main table (B2C + B2B)
- **`pack_vendeur.documents`** → `public.pv_documents` — Uploaded files + AI classification
- **`pack_vendeur.ai_logs`** → `public.pv_ai_logs` — AI call tracking (tokens, latency)

**B2B "Espace Pro"**
- **`pack_vendeur.pro_accounts`** → `public.pv_pro_accounts` — Pro accounts (email, company, logo, credit balance, pro_token in localStorage)
- Pro dossiers are stored in the same `dossiers` table, linked by `pro_account_id` FK and accessed via a `client_upload_token` (different from `share_token`)
- Credit transactions logged for each consumed dossier (Stripe price IDs configured in `pv-pro-credits`)

### Dossier Columns (key fields)

| Column | Type | Notes |
|--------|------|-------|
| `id` | uuid PK | auto-generated |
| `session_id` | text NOT NULL | Browser UUID from localStorage |
| `email` | text | For Stripe receipt |
| `property_address` | text | Entered in Step 1 or extracted by AI |
| `property_lot_number` | text | Entered in Step 1 or extracted by AI |
| `property_surface` | numeric(10,2) | Surface Carrez |
| `copropriete_name` | text | Extracted by AI |
| `syndic_name` | text | Extracted by AI |
| `seller_name` | text | Entered in Step 3 |
| `extracted_data` | jsonb | Full Gemini extraction (nested: copropriete, lot, financier, juridique, diagnostics, meta) |
| `validated_data` | jsonb | User-validated flat data from Step 3 |
| `budget_previsionnel` | numeric(12,2) | Flat financial field |
| `charges_courantes` | numeric(12,2) | Annual charges for the lot |
| `charges_exceptionnelles` | numeric(12,2) | Exceptional charges |
| `fonds_travaux_balance` | numeric(12,2) | Fonds de travaux balance |
| `impaye_vendeur` | numeric(12,2) | Seller unpaid charges |
| `dette_copro_fournisseurs` | numeric(12,2) | Copro debt to suppliers |
| `tantiemes_lot` | integer | Tantièmes of the lot (added recently) |
| `tantiemes_totaux` | integer | Total tantièmes of the copropriété (added recently) |
| `charges_calculees` | numeric(12,2) | App-calculated charges: (tantièmes_lot/tantièmes_totaux) × budget |
| `charges_discrepancy_pct` | numeric(5,2) | Discrepancy % between calculated and AI charges (flagged if >5%) |
| `procedures_en_cours` | boolean | Legal procedures ongoing |
| `travaux_votes_non_realises` | boolean | Voted works not yet completed |
| `dpe_date` | date | DPE date (YYYY-MM-DD only) |
| `dpe_classe_energie` | char(1) | Energy class A-G |
| `dpe_classe_ges` | char(1) | GES class A-G |
| `dpe_validity_status` | enum | valid, expiring_soon, expired, not_opposable, not_found, not_verified |
| `status` | enum | draft → analyzing → pending_validation → validated → paid → generating → completed |
| `stripe_payment_intent_id` | text | Stripe PI ID |
| `share_token` | text | Random UUID for notary share link |
| `share_url` | text | Full share URL |
| `pre_etat_date_pdf_path` | text | Storage path of generated PDF |
| `pack_zip_path` | text | Storage path of ZIP (NOT YET IMPLEMENTED) |
| `expires_at` | timestamptz | now() + 7 days, RGPD auto-cleanup |

### ENUMs
- `dossier_status`: draft, analyzing, pending_validation, validated, paid, generating, completed, expired, error
- `document_type`: pv_ag, reglement_copropriete, etat_descriptif_division, appel_fonds, releve_charges, annexes_comptables, carnet_entretien, dpe, diagnostic_amiante/plomb/termites/electricite/gaz/erp/mesurage, fiche_synthetique, plan_pluriannuel, dtg, audit_energetique, taxe_fonciere, bail, contrat_assurance, other
- `dpe_validity_status`: valid, expiring_soon, expired, not_opposable, not_found, not_verified

### Storage
- Bucket: `pack-vendeur` (private, signed URLs, 1h expiry)
- Structure: `{dossier_id}/uploads/`, `{dossier_id}/classified/`, `{dossier_id}/output/`

### Migrations (Pack Vendeur specific)
- `20260223213524_create_pack_vendeur_schema` — Initial schema
- `20260223222717_pack_vendeur_storage_policies` — Storage RLS
- `20260223223353_pv_documents_instead_of_triggers` — Document triggers
- `20260223234534_add_budget_previsionnel_column` — Budget field
- `20260224004059_add_tantiemes_and_charges_calculees` — Tantièmes + hybrid calculation columns

## Sécurité — pattern access_token (B2C)

### Vue d'ensemble
Le projet est anonyme côté B2C (pas de Supabase Auth). Chaque dossier reçoit à sa création un `access_token` UUID v4 unique stocké en base (`pack_vendeur.dossiers.access_token`, `UNIQUE NOT NULL DEFAULT gen_random_uuid()`). Ce token est retourné au navigateur et stocké en localStorage. Il est ensuite ajouté en header `X-Pv-Access-Token` à chaque appel d'edge function. Côté serveur, `verifyDossierAccess` (`_shared/auth.ts`) compare en temps constant.

### Trois clés localStorage
- `pack-vendeur-session-id` — UUID navigateur historique (analytics, idempotency)
- `pack-vendeur-dossier-id` — UUID PK du dossier en cours
- `pack-vendeur-access-token` — UUID secret transmis en header

### Flow du token
```
[Step 1] Frontend → invoke('pv-dossier', {action:'create', session_id})
                     ↓
                     pv-dossier (no auth) → INSERT dossier → renvoie {dossier, access_token}
                     ↓
[Step 1] Frontend stocke access_token + dossier_id en localStorage
[Step 2+] Frontend → invoke('pv-XXX', body) avec header X-Pv-Access-Token automatique
                     ↓
                     pv-XXX → verifyDossierAccess(req, dossier_id, supabase) → opération
```

### Pattern obligatoire pour toute nouvelle edge function

```ts
import { verifyDossierAccess } from "../_shared/auth.ts";
import { getSupabase } from "../_shared/logging.ts";

Deno.serve(async (req: Request) => {
  // ... CORS, body parse ...
  const supabase = getSupabase();
  if (!supabase) return corsResponse({ error: "Server config" }, 500);

  const { dossier_id } = body;
  const auth = await verifyDossierAccess(req, dossier_id, supabase);
  if (!auth.ok) return corsResponse({ error: auth.error }, auth.status);

  // ... toute opération de mutation ICI, avec auth.dossier disponible ...
});
```

### Convention auth multi-tenant

| Auth | Header | Helper | EFs concernées |
|------|--------|--------|----------------|
| **B2C dossier** | `X-Pv-Access-Token` | `verifyDossierAccess(req, dossier_id, supabase)` | `pv-dossier`, `pv-document`, `pv-classify`, `pv-extract-*`, `pv-run-extraction`, `pv-create-payment-intent` (create-checkout) |
| **B2B pro** | `X-Pv-Pro-Token` | `verifyProAccess(req, pro_account_id, supabase)` | `pv-pro` (toutes actions sauf `create-account`), `pv-pro-credits` (create-checkout) |
| **Notaire** | `share_token` (body) | `verifyShareToken(share_token, supabase)` | `pv-notary` |
| **Client B2B** | `upload_token` (body) | helper interne `loadDossierByUploadToken()` | `pv-client-upload` |
| **Aucun** | — | — | `pv-track-event` (analytics anonymes), `pv-pro action create-account`, `pv-dossier action create`, `pv-create-payment-intent` (verify-checkout — autoritaire via Stripe metadata), `pv-pro-credits` (verify-checkout) |

### RLS et schéma
- Toutes les tables `pack_vendeur.*` ont `FORCE ROW LEVEL SECURITY = true` et **uniquement** une policy `service_full_*` ciblant `service_role`. Aucun rôle anon/authenticated/public n'a de policy.
- Toutes les vues `public.pv_*` sont en `WITH (security_invoker = true)` — les RLS de la table sous-jacente s'appliquent au caller (sans security_invoker, les vues bypass les RLS, comportement par défaut Postgres).
- Le bucket `pack-vendeur` est `public = false`, MIME `['application/pdf', 'image/png', 'image/jpeg', 'image/webp']`, `file_size_limit = 50 MB` côté bucket (mais limite effective côté front = 5 MB pour rester sous la limite payload Supabase Edge Functions).

### Quota d'extraction & claim atomique — fonction Postgres
```sql
public.pv_claim_extraction(p_dossier_id uuid)
  RETURNS TABLE(new_extractions_count int, new_status pack_vendeur.dossier_status)
```
- `SECURITY DEFINER`, exécutable uniquement par `service_role`
- Fait en une seule requête atomique : `UPDATE ... SET status='analyzing', extractions_count=extractions_count+1 WHERE id=$1 AND status='paid' AND extractions_count<3 RETURNING ...`
- **Ferme la race window** entre l'idempotency SELECT et l'UPDATE : 2 requêtes concurrentes ne peuvent plus passer le check status='paid' simultanément, donc plus jamais 2 extractions Gemini parallèles pour le même dossier.
- Si 0 row retournée → soit déjà claimé (status passé à 'analyzing') soit quota atteint. `pv-run-extraction` diagnose via le dossier déjà lu en amont (`extractions_count >= 3` → 429, sinon → 200 `already_done_or_busy`).
- Le compteur **n'est PAS rollback** sur échec d'extraction — par design (empêche les boucles infinies sur erreurs).
- Limite : 3 extractions max par dossier. Au-delà, `pv-run-extraction` retourne 429.

### RPC PostgreSQL custom (toutes `SECURITY DEFINER`, EXECUTE pour `service_role` uniquement)
| Fonction | Rôle | Race-safety |
|----------|------|-------------|
| `public.pv_claim_extraction(uuid)` | Claim atomique du dossier pour extraction (status='paid'→'analyzing' + count++ atomique, max 3) | UPDATE conditionnel + RETURNING |
| `public.pv_pro_add_credits(uuid, int, text, text)` | Ajout atomique de crédits B2B + log transaction (idempotent via `stripe_session_id`) | UPDATE atomique + INSERT dans la même transaction Postgres |

Toute nouvelle opération « lire → calculer → écrire » sur un solde, un compteur, ou un état partagé doit passer par une RPC du même type plutôt que par un read-modify-write côté EF.

## Patterns d'idempotence et race-safety

Quatre règles inviolables pour toute edge function qui mute de l'état après un événement externe (paiement Stripe, callback, retry…). Mises en place suite à l'audit robustesse 2026-04-26 (cf. `.claude/audits/edge-functions-robustness-2026-04-26.md`).

### 1. Toujours capturer `error` après un UPDATE post-événement externe
Toute mutation qui acte un événement externe (Stripe `paid`, webhook reçu, etc.) doit checker `{ error }` du `.update()` et retourner 500 explicite si KO. Sinon le client reçoit `{ ok: true }` alors que la DB est restée dans l'ancien état → money loss silencieux. Voir `pv-create-payment-intent` action `verify-checkout`.

### 2. Tokens publics partagés = générer une seule fois
Un identifiant transmis externement (`share_token` envoyé au notaire, lien d'invitation, magic link…) doit être généré **uniquement si NULL**. Toute action idempotente — replay d'un webhook, reload d'une success page — doit lire l'existant et le préserver. Voir `pv-create-payment-intent` ligne ~244 (SELECT share_token avant UPDATE conditionnel).

### 3. Read-modify-write sur compteur ou solde → RPC PL/pgSQL atomique
Le pattern « SELECT credits, calculer N+amount, UPDATE credits=N+amount » est race-unsafe : 2 requêtes parallèles peuvent lire la même valeur de N et le dernier writer wins → perte d'un increment. Toute mutation incrémentale doit passer par une fonction PL/pgSQL `SECURITY DEFINER` qui fait l'UPDATE atomique avec RETURNING. Voir `pv_pro_add_credits` et `pv_claim_extraction`.

### 4. Distribution de travail unique → UPDATE conditionnel + claim pattern
Pour qu'une seule requête parmi N concurrentes prenne en charge un travail (extraction Gemini, génération PDF, envoi email…), utiliser `UPDATE table SET status='claimed' WHERE id=$1 AND status='ready' RETURNING id`. Si 0 row : quelqu'un d'autre a déjà claimé. Jamais (SELECT puis UPDATE) en deux requêtes — la fenêtre entre les deux est suffisante pour qu'un autre process passe le check. Voir `pv-run-extraction` handler + `pv_claim_extraction`.

### Idempotency keys recommandées
- **Stripe** : `stripe_session_id` (tracé dans `pv_pro_credit_transactions.stripe_session_id`, dedup en amont de la RPC)
- **Email** : `(dossier_id, email_type)` (tracé dans `pv_email_logs`, dedup côté `pv-send-email`)
- **Extraction** : `(dossier_id, status='paid')` matché par `pv_claim_extraction` (un seul claim possible par cycle paid→pending_validation)

## Architecture Patterns

### Service Pattern
All services are object literals with methods returning `{ data, error }`:
```js
export const myService = {
  async getData(id) {
    const { data, error } = await supabase.from('pv_dossiers').select('*').eq('id', id).single();
    if (error) return { data: null, error };
    return { data, error: null };
  }
};
```
**CRITICAL**: Callers MUST check `error` — services never throw. If you don't check, updates fail silently.

### Hook Pattern
Hooks use TanStack React Query with cache key factories:
```js
const myKeys = { all: ['my-entity'], byId: (id) => ['my-entity', id] };
export function useMyEntity(id) {
  return useQuery({ queryKey: myKeys.byId(id), queryFn: () => myService.getData(id) });
}
```

### No Auth (MVP)
- No authentication. Session tracked via browser-generated UUID in localStorage (`pack-vendeur-session-id`)
- Supabase RLS allows anon access for MVP
- Share links use a random UUID token stored in `share_token` column

### StrictMode Guard
Long-running operations (analysis, PDF generation) use `useRef` to prevent React StrictMode double-execution:
```js
const runningRef = useRef(false);
// In effect or callback:
if (runningRef.current) return;
runningRef.current = true;
```

## AI Pipeline

### Classification (Gemini 2.5 Flash-Lite, `pv-classify`)
- Per-document, fired in background by `useDocuments.js` immediately after upload
- Returns `{ document_type, confidence, title, date, summary, diagnostics_couverts?, dpe_ademe_number? }`
- Date extraction uses exercise/realization dates per type (not print dates), DPE ADEME number extracted here for auto-verification, DDT detected when `diagnostics_couverts.length > 1`
- 2-attempt retry on 429 rate limits

### Extraction (server-side orchestrator `pv-run-extraction`)
**Triggered by `useAnalysis.js`** — a thin client trigger. The server does everything else:

1. Verifies `stripe_payment_status === 'paid'` and idempotency (no re-trigger if already analyzing/done)
2. Returns 202 immediately, runs `runExtraction()` via `EdgeRuntime.waitUntil()` — client can disconnect
3. Downloads docs from Storage, routes by type (financial/legal/copro vs diagnostics/technical, with `fiche_synthetique` going to both)
4. Calls `pv-extract-financial` (Gemini 2.5 Pro) and `pv-extract-diagnostics` (Gemini 2.5 Flash) in parallel via `Promise.all`
5. Merges results, runs hybrid charges calc + cross-validation + type coercion (helpers ported from old `useAnalysis.js`: `toNum`, `toDate`, `toChar1`)
6. Writes 50+ flat columns + `extracted_data` JSONB
7. Status: `paid → analyzing → pending_validation` (or reverts to `paid` on error so client can retry)

This replaces the old client-side orchestration. A page refresh, tab close, or fetch timeout (Gemini 2.5 Pro can take 2+ minutes) NO LONGER loses results — the client just polls `pv_dossiers.status`.

### Approche prompt CSN v3 (depuis 2026-04-29)
Le prompt de `pv-extract-financial` n'est plus une suite d'interdictions ("ne JAMAIS extrapoler", "INTERDICTION ABSOLUE de calculer") mais une **checklist de recherche par champ** : pour chacun des ~80 champs du PED CSN, on donne (a) la définition juridique normée, (b) la liberté à Gemini de chercher dans n'importe quel document fourni, (c) l'autorisation explicite de DÉDUIRE par calcul (somme appels, cumul cotisations, etc.) si la valeur n'est pas écrite, en indiquant le mode de calcul dans `_source`. Résultat constaté sur Massenet (28/04/2026) : confiance globale 0.95, QP fonds travaux lue directement dans un relevé de compte (1386.93€), reconstitution avances calculée (95.28€), charges courantes lues directement (1228.96€). Source de vérité : doc CSN officiel `.claude/csn_ped_template.txt`.

### Per-extractor details
**`pv-extract-financial` (Gemini 2.5 Pro)** — Processes pv_ag, reglement_copropriete, etat_descriptif_division, appel_fonds, releve_charges, fiche_synthetique, carnet_entretien, taxe_fonciere. Returns `{ copropriete, lot, financier, juridique, technique_copro, meta }` au format CSN v3 (12 lignes tri-état pour `sommes_dues_cedant`, sous-blocs nommés pour assurance, fonds_travaux, syndicat). 80+ champs avec `_source` tracing. Injects lot context (`lot_number` — multi-lot supporté, ex `49/55/59` → somme tantièmes), `property_address`, questionnaire context (`buildQuestionnaireContext()`). Post-extraction : `backfillLegacyCompat()` remplit `_legacy_compat` pour rétrocompatibilité, `validateExtraction()` checke tantièmes coherence + charges cross-validation. `pv-run-extraction` lit le nouveau JSON CSN v3 puis fallback `_legacy_compat` (pour transition douce).

**`pv-extract-diagnostics` (Gemini 2.5 Flash)** — Processes dpe, diagnostic_*, dtg, plan_pluriannuel, bail, contrat_assurance. Returns `{ diagnostics, bail, assurance, meta }`. Accepts `diagnostics_couverts` from classification — injected into prompt so Gemini knows exactly which diagnostics to find in combined DDTs. Graceful failure mode: if this fails, financial results still save with empty diagnostics + alert.

### AI Cost & Model Tracking (depuis 2026-04-26)
Chaque appel Gemini est tracé dans `pv_ai_logs` avec : `model` (modèle demandé), `model_used` (modèle ayant répondu après fallback chain), `input_tokens`, `output_tokens`, `total_tokens`, `latency_ms`. Les lignes pré-2026-04-26 ont `model_used IS NULL`.

Détecter un fallback silencieux (Pro→Flash sans alerte) :
```sql
SELECT * FROM pv_ai_logs WHERE model_used IS NOT NULL AND model_used != model;
```

Calculer le coût des 7 derniers jours (pricing 2026-04-26) :
```sql
SELECT model_used, COUNT(*) AS calls,
  SUM(input_tokens) AS in_tk, SUM(output_tokens) AS out_tk,
  ROUND(CASE model_used
    WHEN 'gemini-2.5-pro' THEN SUM(input_tokens) * 1.25 / 1e6 + SUM(output_tokens) * 10.0 / 1e6
    WHEN 'gemini-2.5-flash' THEN SUM(input_tokens) * 0.30 / 1e6 + SUM(output_tokens) * 2.50 / 1e6
    WHEN 'gemini-2.5-flash-lite' THEN SUM(input_tokens) * 0.10 / 1e6 + SUM(output_tokens) * 0.40 / 1e6
  END::numeric, 4) AS cost_usd
FROM pv_ai_logs
WHERE created_at > now() - interval '7 days' AND input_tokens IS NOT NULL
GROUP BY model_used;
```

### Hybrid Charges Calculation & Cross-Validation (now in `pv-run-extraction`)
```
charges_calculees = (tantiemes_lot / tantiemes_totaux) × budget_previsionnel_annuel
```
If this differs from Gemini's `charges_courantes_lot` by >5%, the discrepancy is stored in `charges_discrepancy_pct` and a meta alert is added. Calculated value takes priority over AI value when both available.

Cross-validation alerts (injected into `meta.alertes`):
- `charges_budget_n1` vs calculated charges: alert if >20% drift (likely wrong tantièmes)
- `provisions_exigibles` vs annual charges: alert if provisions > 110% of charges

### Extracted Data Structure
- `juridique.travaux_a_venir_votes` is an array of **objects** `{ description, montant_total, quote_part_lot }`, NOT strings
- `financier.exercice_en_cours` / `exercice_precedent` are nested objects
- `extracted_data` is sometimes an array — always normalize: `Array.isArray(x) ? x[0] : x`

## Edge Functions

### `_shared/`
- **`cors.ts`**: `corsHeaders` + `corsResponse(body, status)` helper
- **`gemini.ts`**: `uploadToGeminiFileApi()` (resumable upload protocol — File API needed because inline base64 hit 150s timeout with 15+ PDFs) + `callGemini()` retourne `{ data, usageMetadata, modelUsed }` (depuis 2026-04-26) ; tokens et `model_used` (modèle réellement utilisé après fallback chain) sont propagés à `logAiCall`. Retry 3× sur 429/503, fallback chain Pro→Flash→Flash-Lite, temperature 0.1, JSON response.
- **`logging.ts`**: `getSupabase()` (service role) + `logAiCall()` to `pv_ai_logs`

### AI functions
- **`pv-classify`** — Gemini 2.5 Flash-Lite, inline base64. Input: `{ file_base64, filename, dossier_id }`. Output: classification JSON.
- **`pv-extract-financial`** — Gemini 2.5 Pro, File API uploads. Input: `{ documents[], dossier_id, lot_number?, property_address?, questionnaire_context? }`.
- **`pv-extract-diagnostics`** — Gemini 2.5 Flash, File API uploads. Input: `{ documents[], dossier_id, diagnostics_couverts? }`.
- **`pv-run-extraction`** — Orchestrator. Input: `{ dossier_id }`. Returns 202 immediately, runs pipeline in background via `EdgeRuntime.waitUntil()`. Idempotent (checks paid status + current state). All flat columns + `extracted_data` written here.

#### Pattern d'appel inter-EF (depuis fix Bug #7, 2026-04-29)
Pour appeler `pv-extract-financial` / `pv-extract-diagnostics` depuis `pv-run-extraction`, utiliser :
```ts
fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${ANON_KEY_LEGACY_FALLBACK}`,  // legacy JWT, hardcoded
    "X-Pv-Access-Token": accessToken,  // belt
  },
  body: JSON.stringify({ ...payload, access_token: accessToken }),  // suspenders (gateway peut strip header)
});
```
**Ne JAMAIS** utiliser `Bearer ${SERVICE_KEY}` pour les inter-EF — la nouvelle SERVICE_KEY est `sb_secret_*` (opaque, pas un JWT) et le gateway la rejette en `UNAUTHORIZED_INVALID_JWT_FORMAT`. Si Supabase revient un jour à un service key au format JWT, on pourra retirer le hardcode et lire `Deno.env.get("SUPABASE_ANON_KEY")` (mais à valider qu'il retourne bien un JWT et pas un `sb_publishable_*`).

Toute erreur dans `runExtraction()` est désormais persistée dans `pv_ai_logs` avec `prompt_type='orchestrator-error'` (debug DB-friendly) — utile car les logs runtime des EFs en `EdgeRuntime.waitUntil` ne sont pas accessibles via `mcp__supabase__get_logs`.

### Payment functions
- **`pv-create-payment-intent`** (B2C) — `create-checkout` creates Stripe Checkout Session for the 24.99€ one-shot (price_id `price_1T5EwgQLEPjlJTgr4KMrsBpa`, product `prod_U3Ld2qJXsJp3a8`). `verify-checkout` confirms `payment_status === 'paid'` and updates dossier to `paid`. Success URL: `/payment/success?checkout_session_id={CHECKOUT_SESSION_ID}`.
- **`pv-pro-credits`** (B2B) — Buys credit packs via Stripe Checkout for pro_accounts and consumes credits per dossier creation. Stripe price IDs are placeholders — replace before production.

### Email functions
- **`pv-send-email`** — Transactional sender (delivery, payment receipt, etc.).
- **`pv-email-cron`** — Scheduled email tasks.

## DPE Verification

Uses ADEME open data API (no key needed):
- `https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines`
- Rules: Before 01/07/2021 = not_opposable, >10 years = expired, <6 months remaining = expiring_soon

## B2C Workflow (6 Steps — Pay-First Funnel)

**CRITICAL**: As of the pay-first refactor, the order is `Questionnaire → Upload → Payment → Processing → Validation → Delivery`. Earlier versions had Validation before Payment; many older code comments still reference the old order. The `StepIndicator` and `DossierPage.jsx` are authoritative.

### Step 1: Questionnaire (`QuestionnaireStep.jsx`)
- Bien section (lot_number, adresse, ville, code_postal) → flat dossier columns via `handleQuestionnaireSave()`
- Dynamic propriétaires (PP / PM) with 10 tabs each: Contact, Occupation, Copropriété, Travaux, Prêts, Plus-values, Fiscal, Équipements, Sinistres, Vente
- Saved as JSONB in `questionnaire_data` column (Zod schema at `src/schemas/questionnaireSchema.js`)
- Conditional flags propagate forward: rented → bail required in Step 2, ASL → alert + AI context

### Step 2: Upload (`GuidedUpload.jsx`)
- 19-item document checklist (copropriété, financier, diagnostics) + DDT section + DPE section
- Inline lot banner (green/amber based on lot_number from questionnaire)
- Background classification fires per upload (`pv-classify`, Gemini 2.5 Flash-Lite, 2-attempt retry on 429)
- DDT detection via `diagnostics_couverts.length > 1`, DPE ADEME number extracted during classification

### Step 3: Payment (`PaymentCard.jsx`)
- **Moved before extraction** so we never run AI for non-paying users
- Stripe Checkout redirect via `pv-create-payment-intent` — price_id `price_1T5EwgQLEPjlJTgr4KMrsBpa` (24.99 €)
- Email captured here, saved on dossier before redirect, used for Stripe receipt
- On return, `PaymentSuccessPage` calls `verify-checkout`, updates dossier to `paid`, then routes to Step 4
- Dev-only test-skip button when `import.meta.env.DEV`

### Step 4: Processing (`ProcessingStep.jsx`)
- Auto-fires `pv-run-extraction` once `status === 'paid'` (idempotent — server checks Stripe status + current state before running)
- `pv-run-extraction` returns 202 immediately and runs the pipeline via `EdgeRuntime.waitUntil()` so the **client can refresh, close the tab, or fetch-timeout without losing results**
- Server fans out to `pv-extract-financial` (Gemini 2.5 Pro) + `pv-extract-diagnostics` (Gemini 2.5 Flash) in parallel, merges, runs hybrid charges calc + cross-validation + type coercion, writes to flat columns + `extracted_data` JSONB
- UI is a vertical animated checklist of 6 sub-steps (`SUB_STEPS` in `ProcessingStep.jsx`) — purely visual, durations approximate. Sub-step timer syncs to `dossier.updated_at` so a refresh resumes from the right point
- **Stuck-state recovery**: if dossier sits in `analyzing` for >4 min, UI offers a retry that reverts status to `paid` and re-fires the trigger
- On success, server flips status to `pending_validation` → client poll detects → auto-advance to Step 5

### Step 5: Validation (`ValidationForm.jsx`)
- AI-extracted data pre-fills 5 sections with lock/unlock toggles: Property, Seller, Financial (with tantièmes), Legal (Juridique), DPE
- Discrepancy alert when hybrid-calculated charges differ >5% from AI-extracted charges
- DPE: ADEME number field + auto-verify on blur (`useDpeVerification`)
- Meta alerts shown at top: `donnees_manquantes` + `alertes` from Gemini meta + cross-validation alerts injected by `pv-run-extraction`

### Step 6: Delivery (`DeliveryPanel.jsx`)
- Auto-generates 10-page PDF (cover, financial CSN Part I, copro life II-A, technical II-B, procedures II-C, annexe, questionnaire, disclaimer) and share link on mount (one-time via `useRef`)
- Data priority: flat dossier columns > `validated_data` > `extracted_data` (rebuilds nested structures when `extracted_data` is empty)
- Document list with normalized filenames `{sortOrder}_{TypeLabel}_{Year}.pdf` (22 supported types, DDT → `10_DDT_{Year}.pdf`)
- Share link `/share/{shareToken}` with copy-to-clipboard + RGPD expiry alert

## B2B Workflow (Espace Pro)

Separate funnel under `/pro/*`, no `MainLayout` wrapper, uses `ProLayout` with `ProHeader`. Auth is a token in localStorage (`pro-token`), no password — registered via email-only form on `/pro/register`.

- **`/pro` (`ProDashboardPage`)** — Kanban board (`KanbanBoard.jsx`) of pro dossiers grouped by status. CTA to create a new dossier (`NewDossierDialog`) which generates an `upload_token`.
- **`/pro/credits` (`ProCreditsPage`)** — Buy credit packs via `pv-pro-credits` (Stripe Checkout). Each generated dossier consumes 1 credit. **Pricing IDs are placeholders in `pv-pro-credits` and need to be replaced before production.**
- **`/pro/credits/success`** — Verifies Stripe checkout, refunds the pro_account credit balance.
- **`/pro/dossier/:dossierId`** — Pro view of a single dossier (status, documents, share link).
- **`/pro/settings`** — Update company info, upload logo (`logo` column on `pv_pro_accounts`, watermarks the PDF cover).
- **`/client/:uploadToken` (`ClientUploadPage`)** — Public page where the pro's client uploads documents. Same upload + classification flow as B2C Step 2, but no funnel UI. Pro then validates + delivers from `/pro/dossier/:id`.

## Environment Variables

```
VITE_SUPABASE_URL=https://odspcxgafcqxjzrarsqf.supabase.co
VITE_SUPABASE_ANON_KEY=     # Supabase anon key (safe to expose, RLS protects data)
VITE_STRIPE_PUBLISHABLE_KEY= # Stripe publishable key (safe to expose)
```

**Server-side secrets** (configured in Supabase Edge Functions > Secrets):
- `GEMINI_API_KEY` — Google Gemini API key (never exposed to frontend)
- `STRIPE_SECRET_KEY` — Stripe secret key (never exposed to frontend)

## Vite Aliases

```
@ → src/
@components → src/components/
@pages → src/pages/
@lib → src/lib/
@services → src/services/
@hooks → src/hooks/
@schemas → src/schemas/
```

## SEO & GEO Infrastructure

### Pre-rendering (Build-time SSR)
~86 SEO routes are pre-rendered to static HTML at build time via a 3-step pipeline:
1. `vite build` → client bundle
2. `vite build --ssr src/entry-server.jsx --outDir dist/server` → compiles app for Node.js
3. `node scripts/prerender.js` → renders all routes from `ALL_ROUTES` into `dist/`, copies `dist/index.html` → `dist/_spa.html` (SPA fallback)

- **`entry-server.jsx`**: `StaticRouter` + `renderToString` + `HelmetProvider`. Eager imports (no `lazy()`). Excludes client-only providers (Analytics, Toaster, ScrollToTop).
- **`BlogArticleServer.jsx`**: SSR variant of `BlogArticle.jsx` with eager imports for all 35 articles. Source of truth for slugs is `src/data/articles.js` (`ARTICLE_SLUGS`).
- **`main.jsx`**: Conditional hydration — `hydrateRoot()` if `root.children.length > 0`, else `createRoot().render()`.
- **`vercel.json`**: SPA fallback rewrite to `/_spa.html` (not `index.html`).
- **Pre-rendered routes**: ~10 static pages (incl. /tarif, /professionnels, /comparatif, /a-propos, /pre-etat-date) + 35 articles + 35 cities + 10 regions.
- **NOT pre-rendered** (use SPA fallback): `/dossier`, `/payment/*`, `/share/:token`, `/pro/*`, `/client/:token`, `*` (404).

### Architecture
- **PageMeta**: Centralized `<Helmet>` wrapper (title, description, canonical, og:image, twitter:card)
- **JsonLd**: Helper component injecting `<script type="application/ld+json">` — 11 schema functions
- **ScrollToTop**: Component in App.jsx resets scroll on every route change
- **Sitemap**: Static `public/sitemap.xml` (~55 URLs)
- **Robots**: `public/robots.txt` — disallows `/dossier`, `/share/`, `/payment/` + AI crawler directives (Allow llms.txt, llms-full.txt)

### JsonLd Schema Functions (`src/components/seo/JsonLd.jsx`)
| Function | Schema.org Type | Used On |
|----------|----------------|---------|
| `organizationSchema()` | Organization | All pages (via Header/Footer) |
| `productSchema()` | Product + AggregateRating | HomePage |
| `websiteSchema()` | WebSite + SearchAction | HomePage |
| `articleSchema()` | Article | 11 blog articles |
| `faqSchema()` | FAQPage | FaqPage + 6 articles + city/region pages |
| `breadcrumbSchema()` | BreadcrumbList | All content pages |
| `serviceSchema()` | Service + areaServed + Offer | 20 city + 10 region pages |
| `howToSchema()` | HowTo (4 steps) | HomePage |
| `softwareApplicationSchema()` | SoftwareApplication + AggregateRating | HomePage |
| `definedTermSetSchema()` | DefinedTermSet (35 terms) | GlossairePage |
| `guidesCollectionSchema()` | CollectionPage + ItemList | GuidesIndexPage |

**Breadcrumb fix**: `breadcrumbSchema()` filters out intermediate items without URLs to avoid Google's "Champ 'item' manquant" error: `items.filter((entry, i) => entry.url || i === items.length - 1)`.

### GEO (Generative Engine Optimization)
Optimizations for AI search engines (ChatGPT, Perplexity, Claude, Bing Copilot):
- **`public/llms.txt`**: Summary file per llmstxt.org protocol (~80 lines). Links to `llms-full.txt` for full content.
- **`public/llms-full.txt`**: Comprehensive AI-readable content (~240 lines, 10 sections): definition, comparison table, how it works, cost comparison, loi ALUR, documents list, charges evolution, glossary, service info, all page URLs.
- **`vercel.json` headers**: Both files served as `text/plain; charset=utf-8` with 24h cache.
- **`robots.txt`**: Explicit `Allow: /llms.txt` and `Allow: /llms-full.txt` directives.
- **Key facts `<dl>` boxes**: Semantic HTML definition lists on 4 articles (QuEstCePreEtatDate, DifferencePreEtatDateEtatDate, CoutPreEtatDateSyndic, LoiAlurCopropriete) — structured data that AI systems can extract.
- **FAQ plainText enrichment**: FaqPage answers include `plainText` property with detailed text versions for AI extraction (beyond the JSX `acceptedAnswerText`).
- **Service + areaServed schema**: On all 30 city/region pages, enabling AI citation for local queries ("pré-état daté à Lyon").

### Content Pages
- **35 blog articles** at `/guide/:slug` — lazy in client (`BlogArticle.jsx`), eager in SSR (`BlogArticleServer.jsx`). Each with PageMeta + JSON-LD Article + Breadcrumb + RelatedArticles.
- **35 city landing pages** at `/pre-etat-date/:city` — real RNIC data, sourced syndic pricing, Service + FAQPage JSON-LD.
- **10 region pages** at `/pre-etat-date/region/:region` — same pattern with AdministrativeArea.
- **Cities index** at `/pre-etat-date` — `VillesIndexPage.jsx`.
- **Glossary** at `/glossaire` — DefinedTermSet JSON-LD.
- **FAQ** at `/faq` — FAQPage JSON-LD (plainText-enriched answers).
- **Guides index** at `/guide` — featured article + CollectionPage/ItemList JSON-LD.
- **4 landing pages**: `/tarif`, `/professionnels`, `/comparatif`, `/a-propos`.

### Data Sources (cities/regions)
- `src/data/cities.js` exports `CITIES` (35 cities), `SYNDIC_PRICE_SOURCE`, `COPRO_SOURCE`
- `src/data/regions.js` exports `REGIONS` (10 regions)
- `src/data/articles.js` exports `ARTICLE_SLUGS` — single source of truth used by `prerender.js`, `BlogArticle.jsx`, `BlogArticleServer.jsx`
- Copropriété counts: **RNIC (Registre National des Copropriétés, ANAH 2024)**
- Syndic pricing: **380 € national average** (ARC study 2022), range 150–600 €

## Important Notes

- **Port**: Dev server runs on 5174 (Majordhome uses 5173)
- **Language**: All UI text is in French. Code (variables, comments) in English.
- **RGPD**: Dossiers auto-expire after 7 days (`expires_at` column). Cron job needed for cleanup.
- **Legal disclaimer**: PDF must include "Etabli sur la base des declarations du vendeur et des documents fournis"
- **Shared Supabase**: Same project as Majordhome but isolated in `pack_vendeur` schema. Migrations list contains Majordhome migrations too — Pack Vendeur ones prefixed `pack_vendeur` or `pv_`.
- **PDF generation**: Client-side via `@react-pdf/renderer` (~1 MB chunk), Step 6 lazy-loads it. Heavy computation (~2-5s) followed by Storage upload.
- **Fonts**: Helvetica (built-in @react-pdf) for PDF, Inter (Google Fonts) for web UI
- **`extracted_data` shape**: sometimes wrapped in an array — always normalize: `Array.isArray(x) ? x[0] : x` before use
- **Two Stripe flows**: B2C uses `pv-create-payment-intent` (one-shot), B2B uses `pv-pro-credits` (credit packs). Don't mix them.
- **Pro auth**: `pro-token` in localStorage — no password. Treat token as a bearer secret; pro RLS policies check it.

## Known Bugs & Technical Debt

1. **PDF regeneration**: Returning to Step 6 doesn't regenerate PDF (`useRef` guard). To force, clear `pre_etat_date_pdf_path` in DB.
2. **No pack ZIP**: `pack_zip_path` column exists but ZIP generation is not implemented.
3. **Limited retry on AI failure**: `pv-run-extraction` reverts status to `paid` on failure so client can retry; classification has only 2 attempts on 429.
4. **Flat vs nested data redundancy**: Financial/legal data lives both in flat dossier columns AND in `extracted_data` JSONB — keep them in sync via `pv-run-extraction`.
5. **Pro credit Stripe price IDs are placeholders** in `pv-pro-credits` — replace with real IDs before production.
6. **No webhook**: Payment confirmation goes through `verify-checkout` on the success page only. If user closes the tab on the Stripe page, dossier stays in pre-paid state.
7. ~~**Orchestrator access_token forwarding cassé**~~ **RÉSOLU 2026-04-29** : la cause profonde était que la nouvelle SERVICE_KEY Supabase (`sb_secret_*`) n'est pas un JWT et est rejetée par le gateway en `UNAUTHORIZED_INVALID_JWT_FORMAT`. Workaround appliqué dans `pv-run-extraction/index.ts:30-40` : un legacy ANON JWT est hardcodé en `ANON_KEY_LEGACY_FALLBACK` (publique, déjà exposée au front via `VITE_SUPABASE_ANON_KEY`) et utilisé comme `Authorization: Bearer` pour les calls inter-EF. La preuve d'accès passe via `body.access_token`, lue par `extractAccessToken` en fallback du header. Le bypass `isInternalServiceRoleCall` dans `verifyDossierAccess` est aussi en place (ceinture+bretelles, mais non utilisé en pratique car SERVICE_KEY ne passe plus le gateway).

## Test Dossier

For testing, the dossier `de0f58a5-dc5c-4bac-a43b-ea4048546e37` has been used throughout development. To reset it:
```sql
UPDATE pack_vendeur.dossiers
SET status = 'draft', extracted_data = NULL, validated_data = NULL,
    pre_etat_date_pdf_path = NULL, tantiemes_lot = NULL, tantiemes_totaux = NULL,
    charges_calculees = NULL, charges_discrepancy_pct = NULL,
    charges_courantes = NULL, charges_exceptionnelles = NULL,
    budget_previsionnel = NULL, fonds_travaux_balance = NULL,
    impaye_vendeur = NULL, dette_copro_fournisseurs = NULL,
    procedures_en_cours = false, procedures_details = NULL,
    travaux_votes_non_realises = NULL, travaux_details = NULL,
    dpe_ademe_number = NULL, dpe_date = NULL, dpe_classe_energie = NULL,
    dpe_classe_ges = NULL, copropriete_name = NULL, syndic_name = NULL,
    property_lot_number = NULL, property_address = NULL, property_surface = NULL,
    extractions_count = 0
WHERE id = 'de0f58a5-dc5c-4bac-a43b-ea4048546e37';
```
