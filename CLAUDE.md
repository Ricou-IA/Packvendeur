# Pack Vendeur - CLAUDE.md

## Project Overview

SaaS one-shot (24.99 EUR/usage) branded as **Dossiervente.ai** that generates the Alur dossier (Pré-état daté) and Seller Pack for French co-ownership property sales. AI (Gemini 2.5) analyzes uploaded co-ownership documents and extracts financial/legal data. Delivered via a notary share link.

**Status**: MVP functional — upload, AI analysis, validation, payment (Stripe), PDF generation, notary share link all working end-to-end.
**SEO**: Full national SEO infrastructure — 11 blog articles, 20 city landing pages, 10 region pages, glossary, JSON-LD structured data, sitemap, robots.txt.

## Tech Stack

- **Frontend**: Vite 6.4 + React 18 + Tailwind CSS 3.4 + shadcn/ui (Radix primitives)
- **Backend**: Supabase (shared project with Majordhome — `odspcxgafcqxjzrarsqf`)
- **AI**: Google Gemini 2.0 Flash (classification) + **Gemini 2.5 Pro** (extraction) via Supabase Edge Function `pv-analyze` (v14)
- **PDF**: `@react-pdf/renderer` (client-side generation)
- **Payment**: Stripe via Supabase Edge Functions
- **Forms**: react-hook-form + zod
- **State**: TanStack React Query v5
- **Routing**: react-router-dom v6 (with ScrollToTop on route change)
- **SEO**: react-helmet-async + custom PageMeta/JsonLd components
- **Icons**: lucide-react
- **Deployment**: Vercel
- **Date utils**: date-fns + date-fns/locale/fr

## Commands

```bash
npm run dev      # Start dev server on port 5174
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure

```
src/
  App.jsx                  # Routes & providers (QueryClient, Toaster) + ScrollToTop
  main.jsx                 # Entry point
  index.css                # Tailwind + CSS variables (shadcn tokens)
  lib/
    utils.js               # cn() helper (clsx + tailwind-merge)
    supabaseClient.js      # Supabase client (storageKey: pack-vendeur-session)
    stripeClient.js        # Lazy-loaded Stripe singleton
  services/                # All return { data, error } pattern
    dossier.service.js     # CRUD dossiers via pv_dossiers view
    document.service.js    # Upload to Storage + CRUD documents
    gemini.service.js      # 2-phase AI: classify (Flash) + extract (Pro)
    ademe.service.js       # DPE verification via ADEME open data API
    stripe.service.js      # Payment intent via Edge Function
    pdf.service.js         # Generate PDF blob + upload to Storage
  hooks/
    useDossier.js          # Session management (localStorage UUID), React Query
    useDocuments.js        # Upload with progress, background classification, DDT detection, normalized filenames
    useAnalysis.js         # 2-phase AI pipeline + hybrid charges calculation + cross-validation alerts
    useDpeVerification.js  # ADEME API call + toast feedback
    useNotaryShare.js      # Public share page data + downloads
  components/
    ui/                    # ~20 shadcn/ui components (button, card, input, dialog, etc.)
    seo/
      PageMeta.jsx         # <Helmet> wrapper: title, description, canonical, og:image, twitter
      JsonLd.jsx           # JSON-LD structured data helper (Organization, Product, Article, FAQ, Breadcrumb)
      Breadcrumb.jsx       # Breadcrumb navigation component
      RelatedArticles.jsx  # "Articles liés" component for blog cross-linking
    layout/
      Header.jsx           # Nav header (Comment ça marche, FAQ, Guides)
      Footer.jsx           # 5-column footer (Brand, Produit, Guides×11, Villes×10, Légal)
      StepIndicator.jsx    # 6-step progress bar with icons
    questionnaire/
      QuestionnaireStep.jsx # Step 1: vendor questionnaire — bien section + dynamic proprietaires (PP/PM) + 10 tabs
      QuestionnaireCard.jsx # Reusable questionnaire card component (used in ValidationForm fallback)
    upload/
      GuidedUpload.jsx     # Step 2: inline lot banner + document checklist + dropzone (lot card removed)
      DocumentChecklist.jsx # Checklist of 19 required/optional document types
      CategorySection.jsx  # Collapsible category (copropriété, financier, diagnostics)
      DpeSection.jsx       # DPE-specific upload row
      UploadSummary.jsx    # Summary badge (X/Y documents)
    dropzone/
      FileDropzone.jsx     # react-dropzone (PDF only, multi-file)
      FileList.jsx         # Uploaded files with type badges
    analysis/
      AnalysisProgress.jsx # Real-time AI analysis progress (2 phases)
    validation/
      ValidationForm.jsx   # Full form: property, seller, financial (tantièmes), legal, DPE
    payment/
      PaymentCard.jsx      # Stripe Elements payment card
    delivery/
      DeliveryPanel.jsx    # Auto-generates PDF + share link on mount
    pdf/
      styles.js            # PDF StyleSheet (Helvetica)
      PreEtatDateTemplate.jsx  # 10-page PDF (cover, financial, copro life, technical, procedures, annexe, questionnaire, disclaimer)
  data/
    cities.js              # 20 cities: real RNIC data + SYNDIC_PRICE_SOURCE + COPRO_SOURCE exports
    regions.js             # 10 regions: real RNIC data
  pages/
    HomePage.jsx           # Landing: hero, trust, process, pricing, calculator, FAQ, testimonials, CTA
    DossierPage.jsx        # Main wizard (6 steps) — orchestrator
    NotarySharePage.jsx    # Public notary access via share_token
    PaymentSuccessPage.jsx # Post-payment redirect
    PaymentCancelPage.jsx  # Payment cancelled
    NotFoundPage.jsx       # 404
    content/
      CommentCaMarche.jsx        # How it works (4 steps)
      FaqPage.jsx                # FAQ with JSON-LD FAQPage
      GuidesIndexPage.jsx        # Blog index with featured article teaser
      BlogArticle.jsx            # Lazy article router (11 articles)
      CityLandingPage.jsx        # Template for /pre-etat-date/:city (20 cities)
      RegionLandingPage.jsx      # Template for /pre-etat-date/region/:region (10 regions)
      GlossairePage.jsx          # Glossary of copropriété terms
      articles/                  # 11 blog articles (lazy-loaded)
        QuEstCePreEtatDate.jsx
        DifferencePreEtatDateEtatDate.jsx
        DocumentsNecessairesVente.jsx
        CoutPreEtatDateSyndic.jsx
        LoiAlurCopropriete.jsx
        VendreAppartementCopropriete.jsx
        FicheSynthetiqueCopropriete.jsx
        TantiemesCopropriete.jsx
        DpeVenteAppartement.jsx
        CompromisVenteDocuments.jsx
        ChargesCoproprieteSyndic.jsx  # Investigative article (CSS charts, sourced data)
    legal/
      MentionsLegalesPage.jsx
      PolitiqueRgpdPage.jsx
      CgvPage.jsx
```

## Supabase Schema

All tables are in the `pack_vendeur` schema with public views prefixed `pv_`:

- **`pack_vendeur.dossiers`** → `public.pv_dossiers` — Main table
- **`pack_vendeur.documents`** → `public.pv_documents` — Uploaded files with AI classification
- **`pack_vendeur.ai_logs`** → `public.pv_ai_logs` — AI call tracking (tokens, latency)

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
- `document_type`: pv_ag, reglement_copropriete, etat_descriptif_division, appel_fonds, releve_charges, carnet_entretien, dpe, diagnostic_amiante/plomb/termites/electricite/gaz/erp/mesurage, fiche_synthetique, plan_pluriannuel, dtg, audit_energetique, taxe_fonciere, bail, contrat_assurance, other
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

### Phase 1: Classification (Gemini 2.0 Flash)
- Per-document, returns `{ document_type, confidence, title, date, summary, diagnostics_couverts?, dpe_ademe_number? }`
- Fast (~2-3s per doc) and cheap, 2-attempt retry on 429 rate limits
- Triggered in background during upload via `useDocuments.js`
- **DDT detection**: If `diagnostics_couverts.length > 1`, document is a combined DDT → filename uses "DDT" label
- **Date extraction**: Uses exercise/realization dates per type, not print dates
- **DPE ADEME number**: Extracted during classification for auto-verification

### Phase 2: Extraction (Gemini 2.5 Pro)
- ALL documents injected as base64 context in a single call
- Returns full structured JSONB:
  ```json
  {
    "copropriete": { "nom", "adresse", "syndic_nom", "tantiemes_totaux", ... },
    "lot": { "numero", "tantiemes_generaux", "surface_carrez", ... },
    "financier": { "budget_previsionnel_annuel", "charges_courantes_lot", "exercice_en_cours", "exercice_precedent", ... },
    "juridique": { "procedures_en_cours", "travaux_a_venir_votes": [{ "description", "montant_total", "quote_part_lot" }], ... },
    "diagnostics": { "dpe_numero_ademe", "dpe_classe_energie", ... },
    "meta": { "donnees_manquantes", "alertes", "confiance_globale" }
  }
  ```
- Slower (~20-40s) but much more analytical
- Receives lot context (lot_number, property_address) when provided by user in Step 1
- No RAG — full context injection strategy

### Hybrid Charges Calculation & Cross-Validation (in `useAnalysis.js`)
After Gemini extraction, the app independently calculates charges:
```
charges_calculees = (tantiemes_lot / tantiemes_totaux) × budget_previsionnel_annuel
```
If this differs from Gemini's `charges_courantes_lot` by >5%, it flags a discrepancy alert shown in the validation form. The calculated value takes priority over the AI value when available.

**Cross-validation alerts** (injected into `normalizedData.meta.alertes`):
- `charges_budget_n1` vs calculated charges: alerts if >20% discrepancy (likely wrong tantièmes)
- `provisions_exigibles` vs annual charges: alerts if provisions > 110% of charges (implausible)

### Type Coercion Helpers (in `useAnalysis.js`)
DB columns require strict types. Gemini may return flexible formats:
- `toNum(v)` — Handles strings like "1 234.56", French decimals, falls back to null
- `toDate(v)` — Handles DD/MM/YYYY French dates → YYYY-MM-DD ISO, passes through ISO dates
- `toChar1(v)` — Extracts first letter A-G from any string, for DPE classes (char(1) column)

### Extracted Data Structure
**IMPORTANT**: Gemini 2.5 Pro returns RICHER objects than 2.0 Flash did. Notably:
- `juridique.travaux_a_venir_votes` is an array of **objects** `{ description, montant_total, quote_part_lot }`, NOT simple strings
- `financier.exercice_en_cours` and `exercice_precedent` are nested objects
- All code rendering extracted_data must handle both string and object formats

## Edge Functions (Pack Vendeur)

### `pv-analyze` (v14)
- **Classification**: `gemini-2.0-flash`, single document + prompt → JSON
  - Returns `{ document_type, confidence, title, date, summary, diagnostics_couverts?, dpe_ademe_number? }`
  - Detailed date extraction instructions per document type (exercise date, not print date)
  - DPE ADEME number extraction during classification
  - `diagnostics_couverts` array for combined DDT detection
- **Extraction**: `gemini-2.5-pro`, all documents + lot context + questionnaire context → full structured JSON
  - Strengthened tantièmes instructions (single lot only, cross-reference with charges)
  - Provisions exigibles extraction emphasis
- **Questionnaire context**: `buildQuestionnaireContext()` converts questionnaire answers into contextual instructions for Gemini (occupation/bail, ASL, travaux privatifs, prêts, sinistres, fiscal)
- Logs all calls to `pv_ai_logs` table
- CORS enabled for browser calls
- Dynamic lot context injection when `lot_number` / `property_address` provided

### `pv-create-payment-intent` (v3)
- Creates Stripe PaymentIntent for 24.99 EUR
- Returns `clientSecret` for Stripe Elements

## DPE Verification

Uses ADEME open data API (no key needed):
- `https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines`
- Rules: Before 01/07/2021 = not_opposable, >10 years = expired, <6 months remaining = expiring_soon

## Workflow (6 Steps)

### Step 1: Questionnaire (`QuestionnaireStep.jsx`)
- **Bien section** (always visible): lot_number, adresse, ville, code_postal → auto-saved to flat dossier columns via `handleQuestionnaireSave()`
- **Dynamic propriétaires**: Add/remove PP (personne physique) or PM (personne morale) tabs
- **10 tabs per propriétaire**: Contact, Occupation, Copropriété, Travaux, Prêts, Plus-values, Fiscal, Équipements, Sinistres, Vente
- Optional but recommended ("Facultatif mais recommandé") — answers condition document checklist + AI extraction
- Saved as JSONB in `questionnaire_data` column (~80 fields, Zod schema at `src/schemas/questionnaireSchema.js`)
- If property is rented → bail becomes required in Step 2
- If ASL/AFUL exists → alert shown in Step 2 + context injected into AI
- "Passer cette étape" button available

### Step 2: Upload (`GuidedUpload.jsx`)
- **Inline lot banner** (top): Green if lot_number set (from questionnaire), amber warning if missing — lot identification card removed, info comes from Step 1 bien section
- **Document checklist**: 19 required/optional document types organized in 3 groups (copropriété, financier, diagnostics)
- **DDT section**: `DdtSection` component handles combined/single diagnostic uploads
- **DPE section**: `DpeSection` component with auto-ADEME verification if number extracted
- **Conditional requirements**: bail required if property is rented (from questionnaire), ASL alert if applicable
- **Drag-drop upload**: PDF only, multi-file, uploaded to Supabase Storage
- **Background classification**: Starts immediately after upload (Gemini Flash), 2-attempt retry on 429

### Step 3: Analysis (`AnalysisProgress.jsx`)
- Auto-triggers when documents are ready
- Phase 1: Classification of remaining unclassified docs
- Phase 2: Full extraction with Gemini 2.5 Pro (~20-40s)
- **Questionnaire context**: Injected into Gemini prompt to guide extraction (occupation, ASL, works, etc.)
- Post-extraction: hybrid charges calculation + cross-validation alerts + type coercion + save to DB
- Progress tracking: `{ phase, current, total, message }`

### Step 4: Validation (`ValidationForm.jsx`)
- AI-extracted data pre-fills form fields
- **5 sections** with lock/unlock toggles: Property, Seller, Financial (with tantièmes), Legal (Juridique), DPE
- **Tantièmes fields**: tantiemes_lot and tantiemes_totaux between budget and charges
- **Discrepancy alert**: Shows when calculated charges differ >5% from AI-extracted charges
- **DPE section**: ADEME number field + auto-verify on blur, validity badge (valid/expiring_soon/expired/not_opposable/not_found)
- **Meta alerts**: Shows `donnees_manquantes` and `alertes` from Gemini's meta section (including cross-validation alerts)

### Step 5: Payment (`PaymentCard.jsx`)
- Stripe Elements card form
- 24.99 EUR fixed price
- Dev-only test skip button (`import.meta.env.DEV`)
- Email field for receipt

### Step 6: Delivery (`DeliveryPanel.jsx`)
- Auto-generates PDF + share link on mount (one-time via useRef)
- **PDF (10 pages)**: Cover, Financial (CSN Part I), Copro Life (Part II-A), Technical (Part II-B), Procedures (Part II-C), Annexe documents, Questionnaire vendeur (conditional), Disclaimer
- **Data reconstruction**: Rebuilds nested structures from flat dossier columns when `extracted_data` is empty
- **Document list**: Shows classified documents with normalized filenames (`{sortOrder}_{TypeLabel}_{Year}.pdf`)
  - Combined DDT → `10_DDT_{Year}.pdf` (detected via `diagnostics_couverts.length > 1`)
  - 22 supported document types with sort order 1-99
- Share link: `/share/{shareToken}` with copy-to-clipboard
- RGPD expiry alert with formatted date

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
```

## SEO Infrastructure

### Architecture
- **No SSR/SSG** — Pure SPA. SEO relies on Vercel pre-rendering + react-helmet-async
- **PageMeta**: Centralized `<Helmet>` wrapper (title, description, canonical, og:image, twitter:card)
- **JsonLd**: Helper component injecting `<script type="application/ld+json">` — schemas: Organization, Product, WebSite, Article, FAQPage, BreadcrumbList
- **ScrollToTop**: Component in App.jsx resets scroll on every route change
- **Sitemap**: Static `public/sitemap.xml` (~55 URLs)
- **Robots**: `public/robots.txt` — disallows `/dossier`, `/share/`, `/payment/`

### Content Pages
- **11 blog articles** at `/guide/:slug` — lazy-loaded, each with PageMeta + JSON-LD Article + Breadcrumb + RelatedArticles
- **20 city landing pages** at `/pre-etat-date/:city` — real RNIC data (copropriété counts), sourced syndic pricing
- **10 region pages** at `/pre-etat-date/region/:region` — same pattern
- **Glossary** at `/glossaire` — copropriété terminology
- **FAQ** at `/faq` — JSON-LD FAQPage schema
- **Guides index** at `/guide` — featured article teaser + article grid

### Data Sources (cities/regions)
- `src/data/cities.js` exports `CITIES` (20 cities), `SYNDIC_PRICE_SOURCE`, `COPRO_SOURCE`
- `src/data/regions.js` exports `REGIONS` (10 regions)
- Copropriété counts: **RNIC (Registre National des Copropriétés, ANAH 2024)** — real data
- Syndic pricing: **380 € national average** (ARC study 2022), range 150–600 €
- Source attribution displayed on every city/region page

### Internal Linking
- **RelatedArticles.jsx**: Shows 3 related articles at bottom of each blog post
- **Footer**: 5-column layout — Produit, Guides (11 links), Villes (top 10), Légal
- **Header nav**: Comment ça marche, FAQ, Guides (→ /guide index)
- **HomePage**: "Lire notre enquête chiffrée" link in syndic pricing CTA section

## Important Notes

- **Port**: Dev server runs on 5174 (Majordhome uses 5173)
- **Price**: 24.99 EUR (updated from 19.99 EUR)
- **Language**: All UI text is in French. Code (variables, comments) in English.
- **RGPD**: Dossiers auto-expire after 7 days (`expires_at` column). Cron job needed for cleanup.
- **Legal disclaimer**: PDF must include "Etabli sur la base des declarations du vendeur et des documents fournis"
- **Shared Supabase**: Same project as Majordhome but isolated in `pack_vendeur` schema. Migrations list contains Majordhome migrations too — Pack Vendeur ones are prefixed `pack_vendeur` or `pv_`.
- **PDF generation**: Client-side via @react-pdf/renderer, uploaded to Storage after generation. Heavy computation (~2-5s).
- **Fonts**: Helvetica (built-in @react-pdf) for PDF, Inter (Google Fonts) for web UI
- **Bundle size**: ~2.3 MB (warning from Vite, consider code-splitting @react-pdf)
- **extracted_data**: Sometimes an array (normalized via `Array.isArray()` check). Always normalize before use.

## Known Bugs & Technical Debt

1. **extracted_data sometimes array**: Gemini occasionally wraps response in an array. Normalized in `DeliveryPanel.jsx` and `useAnalysis.js` but should be normalized once at save time.
2. **No retry on AI failure**: If Gemini call fails, no automatic retry — user must refresh and restart analysis.
3. **PDF regeneration**: Going back to Step 5 doesn't regenerate PDF (uses `useRef` guard). User must clear `pre_etat_date_pdf_path` in DB to force regeneration.
4. **Bundle size**: Single 2.3 MB chunk. `@react-pdf/renderer` (~1 MB) should be lazy-loaded via `React.lazy()`.
5. **No pack ZIP**: `pack_zip_path` column exists but ZIP generation is not implemented.
6. **No email notifications**: No email sent on payment completion or pack delivery.
7. **Flat vs nested data redundancy**: Financial/legal data exists both as flat dossier columns AND nested in `extracted_data` JSONB — sync risk.

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
    property_lot_number = NULL, property_address = NULL, property_surface = NULL
WHERE id = 'de0f58a5-dc5c-4bac-a43b-ea4048546e37';
```
