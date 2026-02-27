// New ADEME dataset (old dpe-v2-logements-existants was deprecated/removed)
const ADEME_BASE = 'https://data.ademe.fr/data-fair/api/v1/datasets/meg-83tjwtg8dyz4vv7h1dqe';

export const ademeService = {
  async verifyDpe(ademeNumber) {
    try {
      if (!ademeNumber || ademeNumber.length < 10) {
        return { data: null, validity: 'not_found', error: 'Numero ADEME invalide' };
      }

      const url = `${ADEME_BASE}/lines?qs=numero_dpe:${encodeURIComponent(ademeNumber)}&select=numero_dpe,date_etablissement_dpe,date_visite_diagnostiqueur,etiquette_dpe,etiquette_ges,type_batiment,surface_habitable_logement,annee_construction&size=1`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000); // 10s timeout
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (!response.ok) throw new Error(`ADEME API error: ${response.status}`);

      const json = await response.json();

      if (!json.results || json.results.length === 0) {
        return { data: null, validity: 'not_found', error: null };
      }

      const dpe = json.results[0];
      const dateEtablissement = new Date(dpe.date_etablissement_dpe);
      const dateJuillet2021 = new Date('2021-07-01');
      const now = new Date();
      const sixMonthsFromNow = new Date(now);
      sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
      const expirationDate = new Date(dateEtablissement);
      expirationDate.setFullYear(expirationDate.getFullYear() + 10);

      let validity = 'valid';
      if (dateEtablissement < dateJuillet2021) {
        validity = 'not_opposable';
      } else if (expirationDate < now) {
        validity = 'expired';
      } else if (expirationDate < sixMonthsFromNow) {
        validity = 'expiring_soon';
      }

      return {
        data: {
          numero_dpe: dpe.numero_dpe,
          date_etablissement: dpe.date_etablissement_dpe,
          classe_energie: dpe.etiquette_dpe,
          classe_ges: dpe.etiquette_ges,
          surface: dpe.surface_habitable_logement,
          type_batiment: dpe.type_batiment,
          annee_construction: dpe.annee_construction,
          expiration_date: expirationDate.toISOString(),
        },
        validity,
        error: null,
      };
    } catch (error) {
      console.error('[ademeService] verifyDpe:', error);
      return { data: null, validity: 'not_verified', error };
    }
  },
};
