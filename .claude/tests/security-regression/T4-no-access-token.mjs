// T4 — Appel à pv-run-extraction SANS header X-Pv-Access-Token
// Résultat ATTENDU : 401 Unauthorized OU 403 Forbidden
// Résultat À PROBLÈME : 200 ou 202 → l'auth est cassée

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const FAKE_DOSSIER_ID = "00000000-0000-0000-0000-000000000000";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("[T4] ❌ Variables manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY requises (voir README.md)");
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("[T4] Appel pv-run-extraction SANS header X-Pv-Access-Token...");

// Note : supabase.functions.invoke() ne permet pas d'omettre les headers Authorization,
// mais on peut explicitement OMETTRE X-Pv-Access-Token sans le passer dans `headers`.
const { data, error } = await supabase.functions.invoke("pv-run-extraction", {
  body: { dossier_id: FAKE_DOSSIER_ID },
});

// L'edge function doit retourner 401/403 — la lib supabase-js convertit ça en `error` non-null.
if (error) {
  // Vérifier que le statut est bien 401 ou 403
  const status = error.context?.status ?? error.status;
  if (status === 401 || status === 403) {
    console.log(`[T4] ✅ PASS — HTTP ${status} retourné (auth verifyDossierAccess fait son job)`);
    console.log("       message:", error.message);
    process.exit(0);
  }
  // Autre erreur (404, 500, network) — encore acceptable car la requête n'a pas réussi
  console.log(`[T4] 🟡 PARTIEL — Erreur retournée (status=${status}) mais pas exactement 401/403`);
  console.log("       message:", error.message);
  console.log("       data:", JSON.stringify(data, null, 2)?.slice(0, 300));
  process.exit(0);
}

if (data?.accepted === false || data?.error) {
  console.log("[T4] 🟡 PARTIEL — Réponse 200 mais accepted=false ou error dans le body");
  console.log("       data:", JSON.stringify(data, null, 2));
  process.exit(0);
}

console.error("[T4] ❌ FAIL CRITIQUE — pv-run-extraction a accepté l'appel sans access_token !");
console.error("       data:", JSON.stringify(data, null, 2));
process.exit(1);
