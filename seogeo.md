# SEO & GEO — Playbook Réutilisable

> Bonnes pratiques issues du projet Pre-etat-date.ai (Pack Vendeur).
> Applicable à tout site React SPA / Vite / Next.js / Vercel.

---

## Table des matières

1. [Pre-rendering (SSR statique)](#1-pre-rendering-ssr-statique)
2. [Meta Tags & Open Graph](#2-meta-tags--open-graph)
3. [JSON-LD Structured Data](#3-json-ld-structured-data)
4. [Breadcrumbs](#4-breadcrumbs)
5. [GEO — Generative Engine Optimization](#5-geo--generative-engine-optimization)
6. [Sitemap & Robots.txt](#6-sitemap--robotstxt)
7. [Pages Locales (Villes / Régions)](#7-pages-locales-villes--régions)
8. [Blog & Content Strategy](#8-blog--content-strategy)
9. [Internal Linking](#9-internal-linking)
10. [Performance & Technical SEO](#10-performance--technical-seo)
11. [Checklist Récap](#11-checklist-récap)

---

## 1. Pre-rendering (SSR statique)

### Pourquoi
Les SPA (React, Vue) rendent du HTML vide côté serveur. Google crawle le JS mais les autres moteurs (Bing, Yandex) et les AI crawlers (GPTBot, ClaudeBot) ne le font pas toujours. Le pre-rendering génère du HTML statique au build time.

### Pattern Vite + React (sans framework SSR)

```
npm run build  →  3 étapes :
1. vite build                          # Bundle client classique
2. vite build --ssr src/entry-server.jsx  # Compile l'app pour Node.js
3. node scripts/prerender.js           # Rend chaque route en HTML statique
```

**Fichier `entry-server.jsx`** :
```jsx
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  );
  return { html, helmet: helmetContext.helmet };
}
```

**Points clés** :
- `entry-server.jsx` utilise des **imports eager** (pas de `React.lazy()`) — le lazy loading ne fonctionne pas en SSR synchrone
- Exclure les composants client-only (Analytics, Toaster, ScrollToTop) via `typeof window !== 'undefined'`
- `main.jsx` : hydratation conditionnelle — `hydrateRoot()` si le DOM contient déjà du contenu, sinon `createRoot().render()`
- Créer une variante serveur des composants utilisant `lazy()` (ex: `BlogArticleServer.jsx` avec imports eager)

**Script `prerender.js`** :
```js
import { render } from '../dist/server/entry-server.js';
import fs from 'fs';

const template = fs.readFileSync('dist/index.html', 'utf-8');

// Copier index.html → _spa.html (fallback SPA pour routes dynamiques)
fs.copyFileSync('dist/index.html', 'dist/_spa.html');

const routes = ['/', '/faq', '/guide', '/guide/mon-article', ...];

for (const route of routes) {
  const { html, helmet } = render(route);
  const finalHtml = template
    .replace('<!--ssr-outlet-->', html)
    .replace('<title></title>', helmet.title.toString() + helmet.meta.toString() + helmet.link.toString() + helmet.script.toString());

  const filePath = route === '/' ? 'dist/index.html' : `dist${route}/index.html`;
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, finalHtml);
}
```

**Configuration Vercel** (`vercel.json`) :
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/_spa.html" }]
}
```
→ Les routes pre-rendered sont servies directement (fichiers statiques). Toutes les autres tombent sur `_spa.html` (SPA classique).

### Quelles routes pre-render ?
- **Oui** : Pages SEO (accueil, blog, FAQ, landing pages, glossaire, légal)
- **Non** : Pages dynamiques (dashboard, paiement, pages privées, 404)

---

## 2. Meta Tags & Open Graph

### Pattern `PageMeta` (composant réutilisable)

```jsx
import { Helmet } from 'react-helmet-async';

export default function PageMeta({ title, description, canonical, ogImage }) {
  const fullTitle = `${title} | MonSite`;
  const url = `https://monsite.com${canonical}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={ogImage || 'https://monsite.com/og-default.png'} />
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
```

### Règles
- **Title** : 50-60 caractères, mot-clé principal en premier
- **Description** : 150-160 caractères, inclure un CTA
- **Canonical** : toujours présent, éviter les doublons
- **og:image** : 1200×630px minimum, format PNG/JPG
- Chaque page doit avoir un `<PageMeta>` unique

---

## 3. JSON-LD Structured Data

### Pattern `JsonLd` (composant générique)

```jsx
import { Helmet } from 'react-helmet-async';

export default function JsonLd({ data }) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  );
}
```

### Schemas à implémenter par type de page

#### a) Organization (toutes les pages)
```js
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'MonSite',
    url: 'https://monsite.com',
    logo: 'https://monsite.com/logo.png',
    sameAs: ['https://twitter.com/monsite', 'https://linkedin.com/company/monsite'],
    contactPoint: { '@type': 'ContactPoint', email: 'contact@monsite.com', contactType: 'customer service' },
  };
}
```

#### b) WebSite + SearchAction (homepage)
```js
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'MonSite',
    url: 'https://monsite.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://monsite.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
```
→ Active le **sitelinks search box** dans Google.

#### c) Product + AggregateRating (page pricing/produit)
```js
export function productSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Mon Produit',
    description: 'Description courte...',
    brand: { '@type': 'Organization', name: 'MonSite' },
    offers: {
      '@type': 'Offer',
      price: '24.99',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '150',
      bestRating: '5',
    },
  };
}
```

#### d) Article (blog)
```js
export function articleSchema({ title, description, slug, datePublished, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: `https://monsite.com/blog/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: 'MonSite', url: 'https://monsite.com' },
    publisher: { '@type': 'Organization', name: 'MonSite', logo: { '@type': 'ImageObject', url: 'https://monsite.com/logo.png' } },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://monsite.com/blog/${slug}` },
  };
}
```

#### e) FAQPage (FAQ, articles, landing pages)
```js
export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: { '@type': 'Answer', text: answer },
    })),
  };
}
```
**Astuce GEO** : Ajouter un champ `plainText` enrichi dans les réponses FAQ pour les AI crawlers (le texte JSX est souvent tronqué). Utiliser `answer: item.plainText || item.acceptedAnswerText`.

#### f) BreadcrumbList (toutes les pages de contenu)
```js
export function breadcrumbSchema(items) {
  // IMPORTANT : filtrer les éléments intermédiaires sans URL
  // Google exige le champ 'item' (URL) pour tous les éléments sauf le dernier
  const validItems = items.filter(
    (entry, i) => entry.url || i === items.length - 1
  );
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: validItems.map((entry, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: entry.name,
      ...(entry.url ? { item: `https://monsite.com${entry.url}` } : {}),
    })),
  };
}
```
**Bug courant** : Google Search Console signale "Champ 'item' manquant" quand un breadcrumb intermédiaire a `url: null`. Le filtre ci-dessus résout ce problème.

#### g) Service + areaServed (pages locales / villes)
```js
export function serviceSchema({ areaName, areaType = 'City', url }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Mon Service - ${areaName}`,
    description: `Description du service à ${areaName}...`,
    provider: { '@type': 'Organization', name: 'MonSite', url: 'https://monsite.com' },
    areaServed: { '@type': areaType, name: areaName },
    serviceType: 'Mon Type de Service',
    offers: { '@type': 'Offer', price: '24.99', priceCurrency: 'EUR', availability: 'https://schema.org/InStock' },
    url: `https://monsite.com${url}`,
  };
}
```
→ `areaType: 'City'` pour les villes, `'AdministrativeArea'` pour les régions/départements.

#### h) HowTo (page "Comment ça marche")
```js
export function howToSchema(steps) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment utiliser MonSite',
    description: 'Guide étape par étape...',
    step: steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}
```

#### i) SoftwareApplication (SaaS / app)
```js
export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'MonSite',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '24.99', priceCurrency: 'EUR' },
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '150', bestRating: '5' },
  };
}
```

#### j) DefinedTermSet (glossaire)
```js
export function definedTermSetSchema(terms) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glossaire MonSite',
    description: 'Définitions des termes clés...',
    hasDefinedTerm: terms.map(t => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
    })),
  };
}
```

#### k) CollectionPage + ItemList (index de blog/guides)
```js
export function collectionSchema(articles) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Nos Guides',
    description: 'Tous nos articles et guides...',
    url: 'https://monsite.com/guides',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `https://monsite.com/guides/${a.slug}`,
        name: a.title,
      })),
    },
  };
}
```

### Récap : quel schema sur quelle page ?

| Page | Schemas |
|------|---------|
| Homepage | Organization, WebSite+SearchAction, Product, HowTo, SoftwareApplication |
| Blog article | Article, BreadcrumbList, FAQPage (si FAQ dans l'article) |
| FAQ | FAQPage, BreadcrumbList |
| Landing ville | Service+areaServed(City), FAQPage, BreadcrumbList |
| Landing région | Service+areaServed(AdministrativeArea), FAQPage, BreadcrumbList |
| Glossaire | DefinedTermSet, BreadcrumbList |
| Index guides | CollectionPage+ItemList, BreadcrumbList |

---

## 4. Breadcrumbs

### Règles Google
- Chaque élément **sauf le dernier** doit avoir un champ `item` (URL)
- Le dernier élément (page actuelle) n'a pas besoin d'URL
- Si un élément intermédiaire n'a pas de page dédiée (ex: "Catégorie" sans URL), **le supprimer** du breadcrumb structuré

### Erreur courante
```
Accueil (/) > Catégorie (null) > Ma Page
```
→ Google signale "Champ 'item' manquant" pour "Catégorie".

**Solution** : Filtrer les éléments sans URL (sauf le dernier) :
```js
const validItems = items.filter((entry, i) => entry.url || i === items.length - 1);
```

---

## 5. GEO — Generative Engine Optimization

Le GEO optimise le contenu pour être **cité par les moteurs IA** (ChatGPT/GPT Search, Perplexity, Claude, Bing Copilot, Google AI Overviews).

### a) Fichiers llms.txt (protocole llmstxt.org)

**`public/llms.txt`** — Résumé (~80 lignes) :
```
# MonSite

> MonSite est un service en ligne qui [description courte].
> Version complete avec tout le contenu : https://monsite.com/llms-full.txt

## A propos
[2-3 phrases de description]

## Fonctionnalites principales
- Feature 1 : [description]
- Feature 2 : [description]

## Tarif
[Prix et modèle]

## Pages principales
- [Page 1](https://monsite.com/page1) : description
- [Page 2](https://monsite.com/page2) : description

## Contact
- Site : https://monsite.com
- Email : contact@monsite.com
```

**`public/llms-full.txt`** — Version complète (~200-300 lignes) :
```
# MonSite — Contenu Complet

## 1. Definition
[Explication détaillée du service]

## 2. Comment ca marche
Etape 1 : ...
Etape 2 : ...

## 3. Tarifs et comparaison
| Solution | Prix | Delai |
|----------|------|-------|
| Concurrent A | 150 EUR | 15 jours |
| MonSite | 25 EUR | 24h |

## 4. FAQ
Q: Question 1 ?
R: Reponse 1.

## 5. Glossaire
- Terme 1 : Definition
- Terme 2 : Definition

## 6. Toutes les pages
- https://monsite.com/ — Accueil
- https://monsite.com/guide — Guides
[... toutes les URLs]
```

**Configuration** (`vercel.json`) :
```json
{
  "headers": [
    { "source": "/llms.txt", "headers": [
      { "key": "Content-Type", "value": "text/plain; charset=utf-8" },
      { "key": "Cache-Control", "value": "public, max-age=86400" }
    ]},
    { "source": "/llms-full.txt", "headers": [
      { "key": "Content-Type", "value": "text/plain; charset=utf-8" },
      { "key": "Cache-Control", "value": "public, max-age=86400" }
    ]}
  ]
}
```

**robots.txt** :
```
Allow: /llms.txt
Allow: /llms-full.txt
```

### b) Key Facts Boxes (encadrés "Chiffres clés")

Les AI crawlers extraient très bien les données structurées en `<dl>` (definition list) :

```jsx
<aside className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg my-8">
  <h3 className="text-lg font-bold text-blue-900 mb-4">Chiffres clés</h3>
  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
    <div>
      <dt className="text-sm text-blue-700 font-medium">Métrique 1</dt>
      <dd className="text-lg font-bold text-blue-900">Valeur 1</dd>
    </div>
    <div>
      <dt className="text-sm text-blue-700 font-medium">Métrique 2</dt>
      <dd className="text-lg font-bold text-blue-900">Valeur 2</dd>
    </div>
  </dl>
</aside>
```

**Pourquoi `<dl>` ?** HTML sémantique. Les AI systems reconnaissent `<dt>` (terme) et `<dd>` (définition) comme des paires clé/valeur structurées, beaucoup mieux que du texte libre ou des tableaux complexes.

**Où les placer** : En haut des articles importants, après l'introduction. 4-8 métriques maximum.

### c) FAQ enrichie avec plainText

Pour la page FAQ, enrichir les réponses avec un champ `plainText` plus détaillé que le JSX affiché :

```js
const faqItems = [
  {
    question: "Combien coûte le service ?",
    // JSX affiché à l'utilisateur (peut contenir des liens, du formatage)
    answer: <p>Le service coûte <strong>24,99 €</strong>. <Link to="/pricing">Voir les détails</Link></p>,
    // Texte brut enrichi pour les AI crawlers (plus de contexte)
    plainText: "Le service coûte 24,99 EUR par utilisation, sans abonnement. C'est un paiement unique. En comparaison, les concurrents facturent entre 150 et 600 EUR pour le même service.",
    acceptedAnswerText: "Le service coûte 24,99 € par utilisation.",
  }
];

// Dans le JSON-LD FAQPage, utiliser plainText en priorité :
faqSchema(faqItems.map(item => ({
  question: item.question,
  answer: item.plainText || item.acceptedAnswerText,
})));
```

### d) Tableaux comparatifs

Les AI adorent les tableaux de comparaison. Inclure dans les articles et dans `llms-full.txt` :

```
| Critère | Solution A | MonSite |
|---------|-----------|---------|
| Prix | 150-600 € | 24,99 € |
| Délai | 8-15 jours | 24h |
| Format | Papier | PDF en ligne |
```

### e) Bonnes pratiques GEO générales

1. **Sourcer les données** : Citer les sources (études, organismes officiels). Les AI valorisent les contenus sourcés.
2. **Comparaisons explicites** : "X coûte Y, contre Z chez le concurrent" — les AI extraient facilement ces comparaisons.
3. **Chiffres concrets** : Pas "très rapide" mais "en 24h". Pas "moins cher" mais "24,99 € au lieu de 380 €".
4. **Structure hiérarchique** : H1 > H2 > H3 avec un seul H1 par page.
5. **Dates à jour** : Les AI favorisent le contenu récent. Mettre à jour `dateModified` dans les articles.
6. **Réponses directes** : Commencer les sections FAQ par la réponse, puis développer. Pattern "inverted pyramid".

---

## 6. Sitemap & Robots.txt

### Sitemap (`public/sitemap.xml`)
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://monsite.com/</loc>
    <lastmod>2026-03-01</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://monsite.com/guide/mon-article</loc>
    <lastmod>2026-02-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... toutes les URLs publiques -->
</urlset>
```

**Règles** :
- Inclure **uniquement** les pages publiques indexables
- Exclure : pages privées, paiement, dashboard, 404
- `priority` : 1.0 (homepage), 0.8 (articles/landing), 0.6 (légal)
- Mettre à jour `lastmod` quand le contenu change

### Robots.txt (`public/robots.txt`)
```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /payment/
Disallow: /private/

# AI Crawlers
User-agent: GPTBot
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /

User-agent: ClaudeBot
Allow: /llms.txt
Allow: /llms-full.txt
Allow: /

User-agent: PerplexityBot
Allow: /

Sitemap: https://monsite.com/sitemap.xml
```

---

## 7. Pages Locales (Villes / Régions)

### Stratégie
Créer des landing pages pour chaque ville/région ciblée : `/service-a-[ville]` ou `/service/[ville]`.

### Template
```jsx
function CityLandingPage({ city }) {
  return (
    <>
      <PageMeta
        title={`Service à ${city.name} — MonSite`}
        description={`Utilisez MonSite à ${city.name}. ${city.stats} copropriétés. Service en ligne à 24,99 € au lieu de ${city.avgPrice} € chez un prestataire local.`}
        canonical={`/service/${city.slug}`}
      />
      <JsonLd data={serviceSchema({ areaName: city.name, areaType: 'City', url: `/service/${city.slug}` })} />
      <JsonLd data={faqSchema(cityFaqItems)} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: city.name },  // dernier = pas d'URL nécessaire
      ])} />
      {/* Contenu avec données réelles */}
    </>
  );
}
```

### Données réelles obligatoires
- Utiliser des **données officielles** (INSEE, registres publics) — pas de chiffres inventés
- Sourcer chaque statistique : "Source : [organisme], [année]"
- Varier le contenu entre les pages (pas de simple remplacement de nom de ville)
- Inclure une FAQ locale (3 questions minimum)

### Volume recommandé
- **10-20 villes** principales pour commencer
- **5-10 régions** ou départements
- Ajouter progressivement selon les données de Search Console

---

## 8. Blog & Content Strategy

### Structure d'un article SEO
```
PageMeta (title, description, canonical)
JsonLd Article
JsonLd BreadcrumbList
JsonLd FAQPage (si FAQ dans l'article)

<article>
  <h1>Titre Principal (1 seul H1)</h1>

  [Key Facts Box — chiffres clés en <dl>]    ← GEO

  <p>Introduction avec réponse directe...</p>  ← GEO (inverted pyramid)

  <h2>Section 1</h2>
  <p>Contenu sourcé...</p>

  <h2>Section 2</h2>
  [Tableau comparatif]                         ← GEO

  <h2>FAQ</h2>
  [3 questions/réponses]                       ← SEO + GEO

  <RelatedArticles />                          ← Internal linking
</article>
```

### Types d'articles à forte valeur SEO/GEO
1. **Définition** : "Qu'est-ce que [terme] ?" — Featured snippets + AI citations
2. **Comparaison** : "[A] vs [B] : quelle différence ?" — Tableaux comparatifs
3. **Coût/Prix** : "Combien coûte [service] ?" — Chiffres concrets + sources
4. **Guide pratique** : "Comment [faire X] ?" — Étapes numérotées + HowTo schema
5. **Enquête chiffrée** : "Les vrais chiffres de [sujet]" — Données sourcées, graphiques CSS
6. **Glossaire** : Définitions de tous les termes du domaine — DefinedTermSet schema

### Articles enrichis GEO
Pour les 3-5 articles les plus importants, ajouter :
- **FAQPage schema** (3 Q&A par article, en plus de la FAQ globale)
- **Key facts `<dl>` box** (4-8 métriques sourcées)
- **Tableaux comparatifs** en HTML sémantique
- **Sources citées** avec liens

---

## 9. Internal Linking

### Composant `RelatedArticles`
Afficher 3 articles liés en bas de chaque article :
```jsx
function RelatedArticles({ currentSlug, articles }) {
  const related = articles.filter(a => a.slug !== currentSlug).slice(0, 3);
  return (
    <section className="mt-12 border-t pt-8">
      <h2 className="text-xl font-bold mb-4">Articles liés</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map(a => (
          <Link key={a.slug} to={`/guide/${a.slug}`} className="...">
            <h3>{a.title}</h3>
            <p>{a.excerpt}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

### Footer riche
5 colonnes minimum :
1. **Marque** (logo, description, liens sociaux)
2. **Produit** (fonctionnalités, tarif, comment ça marche)
3. **Guides** (liens vers les 10+ articles)
4. **Villes** (liens vers les 10 principales landing pages)
5. **Légal** (CGV, RGPD, mentions légales)

### Autres liens internes
- **Homepage** : lien vers l'article phare dans la section pricing/CTA
- **Header nav** : liens vers FAQ, guides, comment ça marche
- **Cross-linking** : chaque article cite 2-3 autres articles dans le corps du texte

---

## 10. Performance & Technical SEO

### Canonical URLs
- Toujours une URL canonique par page
- Sans trailing slash (cohérence)
- Sans paramètres de tracking

### ScrollToTop
```jsx
// Dans App.jsx — reset scroll sur chaque changement de route
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
```

### Images
- `alt` descriptif sur chaque image
- Lazy loading natif : `loading="lazy"`
- Format WebP/AVIF si possible
- og:image : 1200×630px, PNG/JPG

### Core Web Vitals
- Pre-render les pages critiques (LCP)
- Lazy-load les composants lourds (`React.lazy()` côté client)
- Minimiser le CLS (pas de layout shifts)

### Vérifications Google Search Console
- **Données structurées** : Vérifier régulièrement les erreurs (breadcrumb, FAQ, etc.)
- **Indexation** : Demander l'indexation des nouvelles pages
- **Performance** : Surveiller les requêtes et positions

---

## 11. Checklist Récap

### SEO de base
- [ ] `PageMeta` sur chaque page (title, description, canonical, og:image)
- [ ] `sitemap.xml` avec toutes les pages publiques
- [ ] `robots.txt` configuré (disallow pages privées)
- [ ] Pre-rendering des pages SEO (ou SSR/SSG)
- [ ] Hydratation conditionnelle (`hydrateRoot` vs `createRoot`)
- [ ] `ScrollToTop` sur changement de route
- [ ] Un seul `<h1>` par page
- [ ] Images avec `alt` et `loading="lazy"`

### JSON-LD Structured Data
- [ ] `Organization` (global)
- [ ] `WebSite` + `SearchAction` (homepage)
- [ ] `Product` ou `SoftwareApplication` (homepage/pricing)
- [ ] `HowTo` (page "comment ça marche")
- [ ] `Article` (chaque article de blog)
- [ ] `FAQPage` (page FAQ + articles clés + landing pages)
- [ ] `BreadcrumbList` (toutes pages de contenu, avec filtre items sans URL)
- [ ] `Service` + `areaServed` (landing pages locales)
- [ ] `DefinedTermSet` (glossaire)
- [ ] `CollectionPage` + `ItemList` (index de blog)

### GEO (Generative Engine Optimization)
- [ ] `public/llms.txt` — résumé (protocole llmstxt.org)
- [ ] `public/llms-full.txt` — contenu complet
- [ ] Headers `text/plain; charset=utf-8` + cache 24h sur les fichiers llms
- [ ] `robots.txt` : Allow llms.txt + llms-full.txt
- [ ] Key facts `<dl>` boxes sur les articles clés (4-8 métriques)
- [ ] FAQ `plainText` enrichi (texte brut détaillé pour AI crawlers)
- [ ] Tableaux comparatifs (prix, délais, features)
- [ ] Sources citées (études, données officielles)
- [ ] Chiffres concrets (pas de vague "moins cher", mais "24,99 € vs 380 €")

### Content & Linking
- [ ] 10+ articles de blog (définition, comparaison, coût, guide, glossaire)
- [ ] 10-20 landing pages locales (villes) avec données réelles
- [ ] `RelatedArticles` en bas de chaque article (3 liens)
- [ ] Footer riche (5 colonnes, 30+ liens internes)
- [ ] Cross-linking entre articles dans le corps du texte

---

## Outils de validation

- **Google Search Console** : Indexation, erreurs structured data, performances
- **Google Rich Results Test** : https://search.google.com/test/rich-results — tester les schemas
- **Schema.org Validator** : https://validator.schema.org/ — valider le JSON-LD
- **Bing Webmaster Tools** : Indexation Bing + insights
- **llmstxt.org** : Spécification du protocole llms.txt
- **PageSpeed Insights** : Core Web Vitals
- **Ahrefs / Semrush** : Suivi des positions, backlinks, analyse concurrence
