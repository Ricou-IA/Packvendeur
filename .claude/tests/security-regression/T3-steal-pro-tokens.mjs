// T3 — Vol de pro_token via SELECT sur pv_pro_accounts (clé anon uniquement)
// Résultat ATTENDU : data: [] ou erreur — aucun pro_token exfiltrable
// Résultat À PROBLÈME : ne serait-ce qu'un seul token retourné → vol session B2B critique

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("[T3] ❌ Variables manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY requises (voir README.md)");
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("[T3] Tentative de SELECT pro_token, email FROM pv_pro_accounts en anon...");

const { data, error } = await supabase
  .from("pv_pro_accounts")
  .select("id, pro_token, email, company_name, credits");

if (error) {
  console.log("[T3] ✅ PASS — Erreur RLS retournée (comportement attendu)");
  console.log("       message:", error.message);
  console.log("       code:", error.code);
  process.exit(0);
}

const rowCount = (data ?? []).length;
if (rowCount === 0) {
  console.log("[T3] ✅ PASS — 0 lignes retournées (RLS bloque l'accès anon aux pro_accounts)");
  process.exit(0);
}

console.error(`[T3] ❌ FAIL CRITIQUE — ${rowCount} pro_account(s) lisible(s) en anon ! Vol de session B2B.`);
console.error("       Tokens exposés :", data.map(r => `${r.email}: ${r.pro_token?.slice(0, 12)}...`).join(", "));
process.exit(1);
