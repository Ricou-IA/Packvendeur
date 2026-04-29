// T5 — Appel à pv-run-extraction avec un access_token BIDON
// Résultat ATTENDU : 403 Forbidden (token mismatch)
// Résultat À PROBLÈME : 200/202 → la comparaison de token est cassée

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const FAKE_DOSSIER_ID = "00000000-0000-0000-0000-000000000000";
const BOGUS_TOKEN = "11111111-2222-3333-4444-555555555555";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("[T5] ❌ Variables manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY requises (voir README.md)");
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log(`[T5] Appel pv-run-extraction avec X-Pv-Access-Token bidon (${BOGUS_TOKEN})...`);

const { data, error } = await supabase.functions.invoke("pv-run-extraction", {
  body: { dossier_id: FAKE_DOSSIER_ID },
  headers: { "X-Pv-Access-Token": BOGUS_TOKEN },
});

if (error) {
  const status = error.context?.status ?? error.status;
  if (status === 403 || status === 401 || status === 404) {
    console.log(`[T5] ✅ PASS — HTTP ${status} retourné (verifyDossierAccess rejette le token bidon)`);
    console.log("       message:", error.message);
    process.exit(0);
  }
  console.log(`[T5] 🟡 PARTIEL — Erreur retournée (status=${status}) mais pas exactement 403`);
  console.log("       message:", error.message);
  process.exit(0);
}

if (data?.accepted === false || data?.error) {
  console.log("[T5] 🟡 PARTIEL — Réponse 200 mais accepted=false ou error dans le body");
  console.log("       data:", JSON.stringify(data, null, 2));
  process.exit(0);
}

console.error("[T5] ❌ FAIL CRITIQUE — pv-run-extraction a accepté un access_token bidon !");
console.error("       data:", JSON.stringify(data, null, 2));
process.exit(1);
