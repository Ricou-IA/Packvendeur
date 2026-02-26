# Pack Vendeur — Backlog Améliorations

## Performance

### P1 — Code-splitting @react-pdf (Bundle 2.3 MB → ~800 KB)
Le bundle fait 2.3 MB principalement à cause de `@react-pdf/renderer` (~1 MB). Lazy-load le PDF template uniquement quand l'utilisateur atteint Step 5 (Livraison).
- **Fichiers**: `src/components/delivery/DeliveryPanel.jsx`, `vite.config.js`
- **Approche**: `React.lazy(() => import('@components/pdf/PreEtatDateTemplate'))` + `Suspense` fallback
- **Bonus**: Ajouter `build.rollupOptions.output.manualChunks` pour isoler `@react-pdf`, `@stripe`, `date-fns`

### P2 — Cache PDF après génération
Actuellement, naviguer vers Step 5 déclenche la génération une seule fois (useRef), mais un refresh force la re-génération si `pre_etat_date_pdf_path` n'est pas en DB. Vérifier le path AVANT de générer.
- **Fichier**: `src/components/delivery/DeliveryPanel.jsx`
- **Approche**: Si `dossier.pre_etat_date_pdf_path` existe, skip la génération et afficher directement le bouton téléchargement

### P3 — Optimiser la taille des uploads Gemini
Les PDF sont envoyés en base64 brut au Edge Function. Pour les gros dossiers (>10 fichiers), ça peut dépasser les limites.
- **Fichier**: `src/services/gemini.service.js`, Edge Function `pv-analyze`
- **Approche**: Compresser les PDF côté client avant base64 (ou utiliser Gemini Files API pour les gros fichiers)

### P4 — Gemini 2.5 Flash au lieu de Pro (optionnel)
Si la latence extraction (~30s) est trop longue, switcher sur `gemini-2.5-flash` (~10s, 5x moins cher, qualité suffisante pour l'extraction structurée).
- **Fichier**: Edge Function `pv-analyze` — changer `gemini-2.5-pro` en `gemini-2.5-flash` dans l'action `extract`

## UX

### U1 — Retry UI pour échecs AI
Aucun bouton "Réessayer" si l'analyse échoue. L'utilisateur doit refresh la page.
- **Fichiers**: `src/components/analysis/AnalysisProgress.jsx`, `src/hooks/useAnalysis.js`
- **Approche**: Ajouter un état `error` avec bouton "Réessayer l'analyse" qui reset le `runningRef` et relance `startAnalysis`

### U2 — Indicateur de progression pendant l'extraction
L'extraction Gemini 2.5 Pro prend 20-40s. Le spinner est basique ("Extraction des données..."). Ajouter des étapes visuelles.
- **Fichier**: `src/components/analysis/AnalysisProgress.jsx`
- **Approche**: Simuler des sous-étapes (analyse financière, analyse juridique, vérification croisée) avec des timers, ou streamer la réponse Gemini

### U3 — Permettre la re-upload / suppression de documents
Impossible de supprimer un document uploadé par erreur. L'utilisateur est bloqué.
- **Fichiers**: `src/components/upload/GuidedUpload.jsx`, `src/hooks/useDocuments.js`, `src/services/document.service.js`
- **Approche**: Bouton ✕ sur chaque fichier uploadé → supprime de Storage + table documents. Ajouter `deleteDocument(docId)` au service.

### U4 — Confirmation avant lancement de l'analyse
L'analyse se lance automatiquement en Step 2 sans confirmation. L'utilisateur ne peut pas vérifier ses documents d'abord.
- **Fichier**: `src/pages/DossierPage.jsx`, `src/components/analysis/AnalysisProgress.jsx`
- **Approche**: Afficher un récapitulatif des documents uploadés avec bouton "Lancer l'analyse" au lieu du trigger automatique

### U5 — Améliorer le formulaire de validation (Step 3)
Le formulaire est long et linéaire. Améliorer l'ergonomie.
- **Fichier**: `src/components/validation/ValidationForm.jsx`
- **Approche**: Utiliser des sections collapsibles (Accordion), highlight des champs pré-remplis par l'IA vs vides, indicateur de complétion par section

### U6 — Page de partage notaire améliorée
La page notaire (`NotarySharePage.jsx`) est fonctionnelle mais basique.
- **Fichier**: `src/pages/NotarySharePage.jsx`
- **Approche**: Ajouter un aperçu du PDF inline, grouper les documents par catégorie, ajouter un bouton "Tout télécharger (ZIP)"

### U7 — Landing page (HomePage)
La landing page est minimaliste. Ajouter des sections pour convertir.
- **Fichier**: `src/pages/HomePage.jsx`
- **Approche**: Ajouter sections: Comment ça marche (3 étapes visuelles), Tarif, FAQ, Confiance (RGPD, sécurité), Testimonials placeholder

### U8 — Feedback visuel sur la classification en temps réel
Les documents sont classifiés en arrière-plan mais l'utilisateur ne voit le résultat qu'après le badge. Ajouter une animation de classification.
- **Fichier**: `src/components/upload/GuidedUpload.jsx`
- **Approche**: Spinner sur chaque fichier pendant la classification, puis badge de type qui apparaît avec animation

## UI

### I1 — Responsive mobile
L'app est desktop-first. Tester et corriger le responsive sur mobile.
- **Fichiers**: Tous les composants, principalement `DossierPage.jsx`, `ValidationForm.jsx`, `GuidedUpload.jsx`
- **Approche**: Audit Tailwind responsive, media queries, tester sur viewport 375px

### I2 — Design system cohérent
Les couleurs custom (step-upload, step-analysis) ne sont pas dans le config Tailwind. Certains styles sont hardcodés.
- **Fichiers**: `tailwind.config.js`, `src/index.css`
- **Approche**: Centraliser tous les tokens dans la config Tailwind, créer des CSS variables pour les couleurs de steps

### I3 — Skeleton loaders
Pas de skeleton loading pendant le chargement du dossier. L'écran est vide puis apparaît d'un coup.
- **Fichier**: `src/pages/DossierPage.jsx`
- **Approche**: Ajouter des composants Skeleton (shadcn/ui) pour chaque step pendant le loading React Query

### I4 — Animations et transitions
Les transitions entre steps sont abruptes. Pas de feedback visuel sur les actions.
- **Approche**: `framer-motion` ou CSS transitions pour: changement de step, apparition des résultats AI, toast notifications

### I5 — PDF design professionnel
Le PDF est fonctionnel mais basique (Helvetica, layout simple).
- **Fichier**: `src/components/pdf/PreEtatDateTemplate.jsx`, `src/components/pdf/styles.js`
- **Approche**: Ajouter un header avec logo, couleurs de la charte, meilleur espacement, tableaux formatés, numéros de page

## Fonctionnalités

### F1 — Génération du pack ZIP
Le column `pack_zip_path` existe mais le ZIP n'est pas généré. Le notaire doit télécharger les fichiers un par un.
- **Fichiers**: `src/services/pdf.service.js` (ou nouveau `zip.service.js`), `src/components/delivery/DeliveryPanel.jsx`
- **Approche**: Utiliser `jszip` côté client pour assembler PDF + documents classifiés → upload to Storage → lien de téléchargement

### F2 — Email de confirmation
Aucun email envoyé après paiement ou génération du pack.
- **Approche**: Edge Function avec Resend ou SendGrid: email au vendeur (lien téléchargement) + email au notaire si fourni

### F3 — Multi-lots dans un même dossier
Actuellement un dossier = un lot. Certains vendeurs ont plusieurs lots (appartement + parking + cave).
- **Approche**: Ajouter un tableau `lots` dans le dossier, ou permettre de créer plusieurs dossiers liés

### F4 — Historique des dossiers
L'utilisateur perd son dossier s'il change de navigateur ou efface le localStorage.
- **Approche**: Permettre de retrouver un dossier via email + numéro de dossier (sans auth complète)

### F5 — Cron job RGPD
Les dossiers ont un `expires_at` mais aucun cron ne les supprime réellement.
- **Approche**: Supabase pg_cron pour `DELETE FROM pack_vendeur.dossiers WHERE expires_at < now()` + cleanup Storage

### F6 — Webhooks Stripe
Le statut de paiement est vérifié côté client uniquement. Pas de webhook Stripe pour confirmer côté serveur.
- **Approche**: Edge Function `pv-stripe-webhook` qui écoute `payment_intent.succeeded` et met à jour le dossier

## Robustesse

### R1 — Normaliser extracted_data une seule fois
`extracted_data` est parfois un array. La normalisation `Array.isArray()` est dupliquée dans 3+ fichiers.
- **Approche**: Normaliser dans `useAnalysis.js` AVANT le save en DB. Plus jamais d'array stocké.

### R2 — Validation croisée des tantièmes
Aucune validation que `tantiemes_lot < tantiemes_totaux` ou que les valeurs sont cohérentes.
- **Fichier**: `src/components/validation/ValidationForm.jsx`
- **Approche**: Ajouter une règle zod `.refine()` et un warning visuel

### R3 — Gestion d'erreurs détaillée
Les toasts d'erreur sont génériques ("Erreur lors de l'analyse"). Pas d'info actionable.
- **Approche**: Enrichir les messages d'erreur avec le contexte (quel document a échoué, quelle phase, code d'erreur Gemini)

### R4 — Rate limiting
Aucun rate limiting sur les appels API (analyse, partage notaire).
- **Approche**: Côté Edge Function, limiter par IP ou session_id. Côté client, debounce les appels.

## Priorités suggérées

| Priorité | Items | Impact |
|----------|-------|--------|
| 🔴 Critique | U1 (retry), U3 (delete doc), R1 (normalize) | Bloquants pour utilisation réelle |
| 🟠 Important | P1 (code-split), F1 (ZIP), U5 (validation form), I1 (mobile) | UX majeure |
| 🟡 Moyen | U2 (progress), U4 (confirm), F2 (email), I3 (skeleton) | Polish |
| 🟢 Nice-to-have | P4 (Flash), I4 (animations), I5 (PDF design), F3 (multi-lots) | Bonus |
