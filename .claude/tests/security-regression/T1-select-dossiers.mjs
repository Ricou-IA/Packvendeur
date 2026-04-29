// T1 — SELECT massif sur pv_dossiers (clé anon uniquement)
// Résultat ATTENDU : data: [] (RLS service_role only) ou erreur explicite
// Résultat À PROBLÈME : ne serait-ce qu'une seule ligne retournée → fuite RGPD

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("[T1] ❌ Variables manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY requises (voir README.md)");
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("[T1] Tentative de SELECT * FROM pv_dossiers avec clé anon publique...");

const { data, error } = await supabase
  .from("pv_dossiers")
  .select("id, email, seller_email, property_address, share_token, extracted_data, validated_data, questionnaire_data");

if (error) {
  console.log("[T1] ✅ PASS — Erreur RLS retournée (comportement attendu)");
  console.log("       message:", error.message);
  console.log("       code:", error.code);
  process.exit(0);
}

const rowCount = (data ?? []).length;
if (rowCount === 0) {
  console.log("[T1] ✅ PASS — 0 lignes retournées (RLS bloque l'accès anon)");
  process.exit(0);
}

console.error(`[T1] ❌ FAIL CRITIQUE — ${rowCount} ligne(s) retournée(s) en anon ! Fuite RGPD.`);
console.error("       Premier exemple :", JSON.stringify(data[0], null, 2).slice(0, 500));
process.exit(1);
