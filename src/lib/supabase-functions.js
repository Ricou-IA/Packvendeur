import supabase from '@lib/supabaseClient';

/**
 * Helper centralisé pour appeler les Supabase Edge Functions Pack Vendeur.
 *
 * Ajoute automatiquement les headers d'auth Pack Vendeur (X-Pv-Access-Token
 * pour B2C, X-Pv-Pro-Token pour B2B) lus depuis localStorage. Permet de
 * surcharger ce comportement via les options.
 *
 * Convention de tokens :
 *  - localStorage["pack-vendeur-access-token"] : access_token du dossier B2C en cours
 *  - localStorage["pack-vendeur-pro-token"]    : pro_token du compte pro connecté
 *
 * Aucun de ces tokens n'est passé via le header `Authorization`. Ce dernier
 * est géré automatiquement par le SDK Supabase (anon key).
 */

const ACCESS_TOKEN_KEY = 'pack-vendeur-access-token';
const PRO_TOKEN_KEY = 'pack-vendeur-pro-token';

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

export function getProToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PRO_TOKEN_KEY);
}

export function setProToken(token) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PRO_TOKEN_KEY, token);
}

export function clearProToken() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PRO_TOKEN_KEY);
}

/**
 * Invoque une edge function Pack Vendeur avec les bons headers d'auth.
 *
 * @param {string} name              Nom de l'edge function (ex: "pv-dossier")
 * @param {object} body              Corps JSON
 * @param {object} [options]
 * @param {"b2c"|"b2b"|"none"} [options.auth="b2c"]   Type d'auth à attacher
 * @param {string} [options.accessToken]              Override access_token (sinon localStorage)
 * @param {string} [options.proToken]                 Override pro_token (sinon localStorage)
 * @returns {Promise<{data: any, error: any}>}
 */
export async function invokeFunction(name, body = {}, options = {}) {
  const { auth = 'b2c', accessToken, proToken } = options;

  const headers = {};

  if (auth === 'b2c') {
    const token = accessToken !== undefined ? accessToken : getAccessToken();
    if (token) headers['X-Pv-Access-Token'] = token;
  } else if (auth === 'b2b') {
    const token = proToken !== undefined ? proToken : getProToken();
    if (token) headers['X-Pv-Pro-Token'] = token;
  }
  // auth === 'none' : aucun header custom (pour les EFs publiques : pv-track-event,
  // pv-notary, pv-client-upload, pv-create-dossier, pv-create-pro-account)

  const { data, error } = await supabase.functions.invoke(name, { body, headers });

  if (error) {
    // Tente de récupérer le détail dans error.context (Response) pour message + lisible
    let detail = error.message;
    try {
      const ctx = await error.context?.json?.();
      detail = ctx?.error || ctx?.details || ctx?.message || error.message;
    } catch {
      // Silently ignore — keep generic message
    }
    return { data: null, error: new Error(detail), errorRaw: error };
  }

  return { data, error: null };
}
