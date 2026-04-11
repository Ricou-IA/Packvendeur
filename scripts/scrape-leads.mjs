#!/usr/bin/env node
/**
 * Lead scraper: Google Maps → Email extraction → Supabase
 *
 * Usage:
 *   node scripts/scrape-leads.mjs --query "notaire" --cities "Paris,Lyon,Marseille" --category notaire
 *   node scripts/scrape-leads.mjs --query "agence immobilière" --department 31 --category agence_immo
 *   node scripts/scrape-leads.mjs --query "mandataire immobilier" --cities "Toulouse" --category mandataire --max 50
 *
 * Env vars (or .env):
 *   APIFY_TOKEN        — Apify API token
 *   SUPABASE_URL       — Supabase project URL
 *   SUPABASE_ANON_KEY  — Supabase anon key
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

// Minimal .env loader (no dependency needed)
const __dirname = dirname(fileURLToPath(import.meta.url));
for (const envName of ['.env.local', '.env']) {
  try {
    const envFile = readFileSync(resolve(__dirname, '..', envName), 'utf-8');
    for (const line of envFile.split('\n')) {
      const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
      if (match && !process.env[match[1]]) {
        process.env[match[1]] = match[2].trim();
      }
    }
  } catch {}
}

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const APIFY_TOKEN = process.env.APIFY_TOKEN || process.env.APIFY_API_TOKEN;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

const GMAPS_ACTOR = 'compass~crawler-google-places';
const EMAIL_ACTOR = 'vdrmota~contact-info-scraper';

const EMAIL_BLACKLIST = [
  'cil@', 'contact@notaires.fr', 'utilisateur@domaine', 'info@immonot',
  'dpo.not@', 'recrutement@', 'noreply@', 'no-reply@', 'webmaster@',
  'admin@google', 'sentry@', 'rh.',
];

// Department → main cities mapping for convenience
const DEPT_CITIES = {
  '31': ['Toulouse', 'Blagnac', 'Colomiers', 'Tournefeuille', 'Muret', 'Balma', 'Ramonville', 'Saint-Gaudens', 'Castanet-Tolosan', 'Cugnaux'],
  '81': ['Albi', 'Castres', 'Gaillac', 'Mazamet', 'Lavaur', 'Carmaux', 'Graulhet', 'Rabastens'],
  '75': ['Paris'],
  '69': ['Lyon', 'Villeurbanne'],
  '13': ['Marseille', 'Aix-en-Provence'],
  '33': ['Bordeaux'],
  '59': ['Lille'],
  '06': ['Nice'],
  '44': ['Nantes'],
  '34': ['Montpellier'],
  '67': ['Strasbourg'],
  '35': ['Rennes'],
  '38': ['Grenoble'],
  '83': ['Toulon'],
  '76': ['Rouen', 'Le Havre'],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function apiFetch(url, options = {}) {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json();
}

function log(msg) {
  console.log(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
}

// ---------------------------------------------------------------------------
// Step 1: Google Maps scraping
// ---------------------------------------------------------------------------

async function scrapeGoogleMaps(query, cities, maxPerCity = 20) {
  const searchStrings = cities.map((c) => `${query} ${c}`);
  log(`Starting Google Maps scrape: ${searchStrings.length} searches, max ${maxPerCity}/search`);

  const run = await apiFetch(
    `https://api.apify.com/v2/acts/${GMAPS_ACTOR}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        searchStringsArray: searchStrings,
        maxCrawledPlacesPerSearch: maxPerCity,
        language: 'fr',
        countryCode: 'fr',
      }),
    },
  );

  const runId = run.data.id;
  const datasetId = run.data.defaultDatasetId;
  log(`Run started: ${runId} (dataset: ${datasetId})`);

  // Poll until done
  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise((r) => setTimeout(r, 15_000));
    const check = await apiFetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`,
    );
    status = check.data.status;
    log(`  Maps status: ${status}`);
  }

  if (status !== 'SUCCEEDED') throw new Error(`Google Maps run failed: ${status}`);

  // Fetch results
  const items = await apiFetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`,
  );

  log(`Google Maps: ${items.length} results`);
  return items;
}

// ---------------------------------------------------------------------------
// Step 2: Email extraction
// ---------------------------------------------------------------------------

async function scrapeEmails(websites) {
  const urls = [...new Set(websites.filter(Boolean))];
  if (urls.length === 0) return [];

  log(`Starting email scrape on ${urls.length} websites`);

  const run = await apiFetch(
    `https://api.apify.com/v2/acts/${EMAIL_ACTOR}/runs?token=${APIFY_TOKEN}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startUrls: urls.map((u) => ({ url: u })),
        maxRequestsPerStartUrl: 3,
        maxDepth: 1,
        sameDomain: true,
      }),
    },
  );

  const runId = run.data.id;
  const datasetId = run.data.defaultDatasetId;
  log(`Email run started: ${runId}`);

  let status = 'RUNNING';
  while (status === 'RUNNING' || status === 'READY') {
    await new Promise((r) => setTimeout(r, 20_000));
    const check = await apiFetch(
      `https://api.apify.com/v2/actor-runs/${runId}?token=${APIFY_TOKEN}`,
    );
    status = check.data.status;
    log(`  Email status: ${status}`);
  }

  if (status !== 'SUCCEEDED') {
    log(`Warning: email scrape failed (${status}), continuing without emails`);
    return [];
  }

  const items = await apiFetch(
    `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_TOKEN}&format=json`,
  );

  log(`Email scrape: ${items.length} sites processed`);
  return items;
}

// ---------------------------------------------------------------------------
// Step 3: Match emails to leads
// ---------------------------------------------------------------------------

function buildEmailMap(emailResults) {
  const map = {};
  for (const d of emailResults) {
    const startUrl = d.originalStartUrl || '';
    const emails = (d.emails || []).filter(
      (e) => !EMAIL_BLACKLIST.some((b) => e.toLowerCase().includes(b)),
    );
    if (emails.length > 0 && startUrl) {
      try {
        const domain = new URL(startUrl).hostname.replace('www.', '');
        map[domain] = emails[0];
      } catch {}
    }
  }
  return map;
}

// ---------------------------------------------------------------------------
// Step 4: Insert into Supabase
// ---------------------------------------------------------------------------

async function insertLeads(gmapsResults, emailMap, category) {
  const leads = gmapsResults.map((d) => {
    const ws = d.website || '';
    let email = null;
    if (ws) {
      try {
        const domain = new URL(ws).hostname.replace('www.', '');
        email = emailMap[domain] || null;
      } catch {}
    }

    return {
      business_name: (d.title || '').slice(0, 200),
      phone: d.phone || null,
      website: ws || null,
      email,
      address: (d.address || '').slice(0, 300),
      city: d.city || null,
      postal_code: d.postalCode || null,
      category,
      google_rating: d.totalScore || null,
      google_reviews_count: d.reviewsCount || 0,
      source: 'apify-gmaps',
      status: 'new',
    };
  });

  let inserted = 0;
  const batchSize = 25;

  for (let i = 0; i < leads.length; i += batchSize) {
    const batch = leads.slice(i, i + batchSize);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pv_leads`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(batch),
    });

    if (res.ok) {
      inserted += batch.length;
    } else {
      const err = await res.text();
      log(`Insert error batch ${i / batchSize + 1}: ${err.slice(0, 200)}`);
    }
  }

  const withEmail = leads.filter((l) => l.email).length;
  log(`Inserted ${inserted}/${leads.length} leads (${withEmail} with email)`);
  return { total: inserted, withEmail };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const getArg = (name) => {
    const idx = args.indexOf(`--${name}`);
    return idx >= 0 ? args[idx + 1] : null;
  };

  const query = getArg('query') || 'notaire';
  const category = getArg('category') || 'other';
  const maxPerCity = parseInt(getArg('max') || '20', 10);
  const department = getArg('department');
  const citiesArg = getArg('cities');

  let cities;
  if (citiesArg) {
    cities = citiesArg.split(',').map((c) => c.trim());
  } else if (department) {
    cities = DEPT_CITIES[department];
    if (!cities) {
      console.error(`Unknown department: ${department}. Known: ${Object.keys(DEPT_CITIES).join(', ')}`);
      process.exit(1);
    }
  } else {
    console.error('Provide --cities "Paris,Lyon" or --department 31');
    process.exit(1);
  }

  // Validate env
  if (!APIFY_TOKEN) { console.error('Missing APIFY_TOKEN in env'); process.exit(1); }
  if (!SUPABASE_URL) { console.error('Missing SUPABASE_URL in env'); process.exit(1); }
  if (!SUPABASE_KEY) { console.error('Missing SUPABASE_ANON_KEY in env'); process.exit(1); }

  log(`=== Lead Scraper ===`);
  log(`Query: "${query}" | Category: ${category} | Cities: ${cities.join(', ')} | Max/city: ${maxPerCity}`);

  // Step 1: Google Maps
  const gmapsResults = await scrapeGoogleMaps(query, cities, maxPerCity);

  // Step 2: Email extraction
  const websites = gmapsResults.map((d) => d.website).filter(Boolean);
  const emailResults = await scrapeEmails(websites);
  const emailMap = buildEmailMap(emailResults);

  log(`Email map: ${Object.keys(emailMap).length} domains with emails`);

  // Step 3: Insert into Supabase
  const result = await insertLeads(gmapsResults, emailMap, category);

  log(`=== Done ===`);
  log(`Total: ${result.total} leads | With email: ${result.withEmail} | With phone: ${gmapsResults.filter((d) => d.phone).length}`);
}

main().catch((err) => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
