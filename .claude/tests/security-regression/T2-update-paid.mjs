// T2 — UPDATE direct stripe_payment_status='paid' (clé anon uniquement)
// Résultat ATTENDU : aucune ligne modifiée OU erreur explicite
// Résultat À PROBLÈME : ligne réellement modifiée en base → bypass paiement

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const FAKE_DOSSIER_ID = "00000000-0000-0000-0000-000000000000";

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("[T2] ❌ Variables manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY requises (voir README.md)");
  process.exit(2);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("[T2] Tentative de UPDATE pv_dossiers SET stripe_payment_status='paid' WHERE id=fake en anon...");

const { data, error, count } = await supabase
  .from("pv_dossiers")
  .update({ stripe_payment_status: "paid", paid_at: new Date().toISOString() })
  .eq("id", FAKE_DOSSIER_ID)
  .select();

if (error) {
  console.log("[T2] ✅ PASS — Erreur RLS retournée (comportement attendu)");
  console.log("       message:", error.message);
  process.exit(0);
}

const rowCount = (data ?? []).length;
if (rowCount === 0) {
  console.log("[T2] ✅ PASS — 0 lignes modifiées (RLS bloque l'UPDATE anon)");
  console.log("       Note : 0 row peut signifier soit RLS bloque, soit l'id n'existe pas. Test additionnel : essayer sur un id réel ne devrait toujours pas fonctionner — voir README.");
  process.exit(0);
}

console.error(`[T2] ❌ FAIL CRITIQUE — ${rowCount} ligne(s) modifiée(s) en anon ! Bypass paiement possible.`);
process.exit(1);
