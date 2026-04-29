# Product

## Register

product

## Users

Vendeurs particuliers de logements en copropriété en France, majoritairement **first-time**. Ils arrivent stressés, peu familiers du vocabulaire notarial (pré-état daté, tantièmes, fonds de travaux, charges courantes), et anxieux à l'idée de mal faire un acte juridique. Contexte d'usage : transaction unique et chargée émotionnellement (vente d'un bien parfois familial), souvent sous pression (compromis signé, notaire qui attend). Le travail à accomplir : produire le pré-état daté Alur en quelques jours sans dépendre du syndic, qui facture en moyenne 380 € et prend plusieurs semaines.

Surfaces secondaires hors du focus principal :
- **Vendeurs expérimentés** (minorité) — ont déjà vendu, veulent un livrable rapide sans pédagogie, supportent mal les wizards trop guidés.
- **Espace Pro B2B** — agents immobiliers, mandataires, notaires gérant plusieurs dossiers en lot via un kanban et des liens d'upload partagés.

## Product Purpose

Pre-etat-date.ai génère automatiquement le **Pré-état daté Alur et le Pack Vendeur** à partir des documents de copropriété uploadés, via Gemini 2.5. Le pivot business : casser le monopole des syndics (≈380 €, plusieurs semaines) avec un **one-shot à 24,99 €** livré sous 24 h, accompagné d'une garantie satisfait-ou-remboursé si le notaire refuse le document.

Succès produit = le vendeur paie, génère son dossier, et le notaire l'accepte sans aller-retour. La marge de manœuvre est étroite : c'est un document juridique (loi ALUR), une erreur ou une omission peut bloquer une vente. L'IA doit être précise **et** le funnel doit inspirer assez de confiance pour qu'un inconnu ose payer 24,99 € à un site qu'il découvre.

## Brand Personality

**Calme, précis, complice.**

- **Calme** — le vendeur arrive stressé, le funnel doit le rassurer par sa lisibilité et son rythme, pas le bombarder de cards, banners et alertes empilés.
- **Précis** — c'est un produit juridique, pas un gadget. Chaque mot, chaque chiffre, chaque alerte compte. Pas d'approximation rassurante ; l'exactitude est la réassurance.
- **Complice** — ni froid ni corporate. Le funnel reconnaît que la vente d'un logement est un moment important, démystifie le vocabulaire, et tient la main sans condescendre.

**Voix marketing vs voix funnel.** La landing porte un ton challenger plus irrévérencieux ("Bash the syndic", prix barrés, palette Midnight + jaune chaud) parce qu'elle doit conquérir face à un monopole établi. Le funnel pivote vers du calme/professionnel dès que l'utilisateur est entré : la provocation a fait son travail, maintenant il faut livrer dans la confiance.

## Anti-references

Le funnel ne doit **pas** ressembler à :

- **Un formulaire admin à la française** (service-public.fr, impots.gouv) — denses, jargon brut, gris terne, paperasse numérisée. Le piège par défaut quand on traite du juridique. À éviter même si c'est rassurant pour certains.
- **Un SaaS générique saturé** (clones Notion, dashboards chargés) — trop de chrome UI (sidebars, banners empilés, multiples CTAs), pas assez de focus sur la tâche unique de l'étape.
- **Un SaaS surdécoré** (mesh gradients partout, glassmorphism, glow buttons, gradient text) — ces effets vivent sur la landing, ils n'ont rien à faire dans le funnel. Un funnel décoré rappelle un produit qui veut "faire moderne" plutôt qu'un outil qui sait livrer.

Note : la sobriété banque/assurance corporate n'est **pas** une anti-référence — le sérieux légal-tech qu'elle évoque est en partie souhaité, à condition de le débarrasser de sa froideur et de son jargon.

## Design Principles

### 1. Un écran, une décision

Chaque étape pose une question principale et la résout. Le funnel actuel empile plusieurs sections (Tier 1 indispensable + Tier 2 Pack Pro), plusieurs bannières (lot, ASL, bail, validation top, validation bottom), plusieurs CTAs concurrents sur la même page — coûteux cognitivement pour un vendeur stressé. Réduire les choix par écran, séquencer, accepter qu'une étape "fasse moins" si elle le fait clairement.

Inclut le sous-principe "respecter le temps du vendeur" : pas de questions redondantes entre étapes, pas de wizard pédagogique gratuit, pas d'écrans de transition cosmétiques.

### 2. Calme, pas dilué

Pas de décoration superflue (gradients, blobs, glow), mais pas froid non plus. La confiance s'établit par la clarté typographique, le rythme des espaces, la hiérarchie visuelle — pas par les ornements. Un bouton n'a pas besoin de briller pour exister ; un titre n'a pas besoin de pulser pour être vu.

L'inverse du calme n'est pas la chaleur (qui reste bienvenue), c'est la **dilution** : trop de bannières, trop de cards empilées, trop de niveaux de hiérarchie qui finissent tous par se valoir.

### 3. Toujours savoir où on en est

Le vendeur first-time stressé a besoin de repères constants. À chaque écran : où il est (étape X/6), ce qu'il a fait (✓), ce qu'il reste, l'action évidente. Jamais de cul-de-sac, jamais de "et maintenant ?".

Inclut le sous-principe "vocabulaire démystifié" : tantièmes, fonds de travaux, pré-état daté — chaque terme technique mérite d'être expliqué en contexte (tooltip, hint inline) plutôt qu'imposé sans définition.

### 4. L'IA fait, l'utilisateur valide (implicite)

Promesse fondamentale du produit : Gemini extrait, l'utilisateur n'a qu'à valider. Tout écran qui demande à l'utilisateur de saisir une donnée que l'IA pourrait extraire est une régression. Pre-fill agressif, défauts intelligents, validation ergonomique > saisie brute.

## Accessibility & Inclusion

Cible : **WCAG AA**.

Déjà en place :
- Palette landing v2 deutan-friendly (bleus + jaunes uniquement, pas de couple rouge/vert critique).
- `prefers-reduced-motion` géré sur les blobs, trust scroll et l'animation strikethrough.

À renforcer dans le funnel :
- Contraste AA sur tous les textes (la classe `secondary-400` sur fond blanc est borderline pour du body text — à vérifier systématiquement).
- États focus visibles sur tous les contrôles (Radix les fournit par défaut, à valider sur les wrappers custom).
- Labels associés à chaque input (présent via `<Label htmlFor>` mais à auditer systématiquement).
- Annonces `aria-live` sur les états transitoires (uploading, classifying, processing) pour les lecteurs d'écran.
- Tailles de cible tactile ≥ 44×44 px sur mobile (boutons "ajouter propriétaire", chips de tabs).
