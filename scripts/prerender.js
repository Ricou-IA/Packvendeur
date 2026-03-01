/**
 * Post-build prerendering script.
 *
 * Runs after both client and SSR builds:
 *   1. vite build                    → dist/ (client assets)
 *   2. vite build --ssr ...          → dist/server/entry-server.js
 *   3. node scripts/prerender.js     → injects rendered HTML into dist/
 *
 * For each SEO route, renders the React tree to HTML and writes
 * a complete HTML file that crawlers can read without JavaScript.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, '..', 'dist');
const SERVER_ENTRY = pathToFileURL(path.resolve(DIST, 'server', 'entry-server.js')).href;

// ---------- Route list ----------

const STATIC_ROUTES = [
  '/',
  '/comment-ca-marche',
  '/faq',
  '/guide',
  '/glossaire',
  '/mentions-legales',
  '/politique-rgpd',
  '/cgv',
];

const ARTICLE_SLUGS = [
  'quest-ce-pre-etat-date',
  'difference-pre-etat-date-etat-date',
  'documents-necessaires-vente',
  'cout-pre-etat-date-syndic',
  'loi-alur-copropriete',
  'vendre-appartement-copropriete',
  'fiche-synthetique-copropriete',
  'tantiemes-copropriete-calcul',
  'dpe-vente-appartement',
  'compromis-vente-copropriete-documents',
  'charges-copropriete-evolution-syndic',
];

const CITY_SLUGS = [
  'paris', 'lyon', 'marseille', 'toulouse', 'nice',
  'nantes', 'montpellier', 'strasbourg', 'bordeaux', 'lille',
  'rennes', 'reims', 'saint-etienne', 'toulon', 'le-havre',
  'grenoble', 'dijon', 'angers', 'nimes', 'aix-en-provence',
];

const REGION_SLUGS = [
  'ile-de-france', 'provence-alpes-cote-d-azur', 'auvergne-rhone-alpes',
  'occitanie', 'nouvelle-aquitaine', 'hauts-de-france',
  'grand-est', 'bretagne', 'pays-de-la-loire', 'normandie',
];

const ALL_ROUTES = [
  ...STATIC_ROUTES,
  ...ARTICLE_SLUGS.map(s => `/guide/${s}`),
  ...CITY_SLUGS.map(s => `/pre-etat-date/${s}`),
  ...REGION_SLUGS.map(s => `/pre-etat-date/region/${s}`),
];

// ---------- Prerender ----------

async function prerender() {
  console.log(`\n🔄 Pre-rendering ${ALL_ROUTES.length} SEO routes...\n`);
  const start = Date.now();

  // Import the server bundle
  const { render } = await import(SERVER_ENTRY);

  // Read the client-built index.html as template
  const templatePath = path.join(DIST, 'index.html');
  const template = fs.readFileSync(templatePath, 'utf-8');

  // Save original as SPA fallback for dynamic routes
  const spaFallbackPath = path.join(DIST, '_spa.html');
  fs.copyFileSync(templatePath, spaFallbackPath);
  console.log('  ✅ Saved _spa.html (SPA fallback for dynamic routes)');

  let successCount = 0;
  let errorCount = 0;

  for (const route of ALL_ROUTES) {
    try {
      const { html, helmet } = render(route);

      // Start with template
      let page = template;

      // Inject rendered HTML into root div
      page = page.replace(
        '<div id="root"></div>',
        `<div id="root">${html}</div>`
      );

      // Inject Helmet tags into <head>
      if (helmet) {
        // Replace default <title> with route-specific title
        const titleStr = helmet.title.toString();
        if (titleStr) {
          page = page.replace(/<title>.*?<\/title>/, titleStr);
        }

        // Replace default meta description
        const metaStr = helmet.meta.toString();
        if (metaStr) {
          // Remove the default description meta tag (will be replaced by helmet's)
          page = page.replace(
            /<meta name="description" content="[^"]*" \/>/,
            ''
          );
          // Insert helmet meta tags before </head>
          page = page.replace('</head>', `    ${metaStr}\n  </head>`);
        }

        // Insert link tags (canonical, etc.)
        const linkStr = helmet.link.toString();
        if (linkStr) {
          page = page.replace('</head>', `    ${linkStr}\n  </head>`);
        }

        // Insert script tags (JSON-LD, etc.)
        const scriptStr = helmet.script.toString();
        if (scriptStr) {
          page = page.replace('</head>', `    ${scriptStr}\n  </head>`);
        }
      }

      // Write the file
      const filePath = route === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, ...route.split('/').filter(Boolean), 'index.html');

      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      fs.writeFileSync(filePath, page);

      successCount++;
    } catch (err) {
      console.error(`  ❌ Error rendering ${route}:`, err.message);
      errorCount++;
    }
  }

  // Cleanup server bundle
  const serverDir = path.join(DIST, 'server');
  if (fs.existsSync(serverDir)) {
    fs.rmSync(serverDir, { recursive: true, force: true });
    console.log('  🧹 Cleaned up dist/server/');
  }

  const elapsed = Date.now() - start;
  console.log(`\n✅ Pre-rendered ${successCount}/${ALL_ROUTES.length} routes in ${elapsed}ms`);
  if (errorCount > 0) {
    console.log(`⚠️  ${errorCount} routes failed`);
    process.exit(1);
  }
}

prerender().catch((err) => {
  console.error('❌ Prerender failed:', err);
  process.exit(1);
});
