// ---------------------------------------------------------------------------
// City data for SEO landing pages
//
// nbCopros: Registre National des Copropriétés (RNIC / ANAH), données 2024
//           Source: https://annuairedescoproprietes.fr/
//           Note: Copropriétés immatriculées uniquement (~66 % du parc réel).
//
// syndicAvgPrice: Tarif national constaté chez les principaux syndics pour
//                 le pré-état daté. Fourchette documentée : 150 à 600 €.
//                 Sources: étude ARC (2022), 60 Millions de Consommateurs.
// ---------------------------------------------------------------------------

export const SYNDIC_PRICE_SOURCE = {
  label: 'Étude ARC (2022), 60 Millions de Consommateurs',
  url: 'https://arc-copro.fr/documentation/communique-de-presse-le-tarif-plafonne-de-letat-date-est-devenu-celui-reglemente-avec',
  range: { min: 150, max: 600 },
};

export const COPRO_SOURCE = {
  label: 'Registre National des Copropriétés (RNIC / ANAH, 2024)',
  url: 'https://annuairedescoproprietes.fr/',
};

export const CITIES = [
  { name: 'Paris', slug: 'paris', department: 'Paris (75)', postalCode: '75000', syndicAvgPrice: 380, nbCopros: 45568, region: 'Ile-de-France' },
  { name: 'Lyon', slug: 'lyon', department: 'Rhône (69)', postalCode: '69000', syndicAvgPrice: 380, nbCopros: 10572, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Marseille', slug: 'marseille', department: 'Bouches-du-Rhône (13)', postalCode: '13000', syndicAvgPrice: 380, nbCopros: 17751, region: "Provence-Alpes-Côte d'Azur" },
  { name: 'Toulouse', slug: 'toulouse', department: 'Haute-Garonne (31)', postalCode: '31000', syndicAvgPrice: 380, nbCopros: 9636, region: 'Occitanie' },
  { name: 'Nice', slug: 'nice', department: 'Alpes-Maritimes (06)', postalCode: '06000', syndicAvgPrice: 380, nbCopros: 8715, region: "Provence-Alpes-Côte d'Azur" },
  { name: 'Nantes', slug: 'nantes', department: 'Loire-Atlantique (44)', postalCode: '44000', syndicAvgPrice: 380, nbCopros: 6245, region: 'Pays de la Loire' },
  { name: 'Montpellier', slug: 'montpellier', department: 'Hérault (34)', postalCode: '34000', syndicAvgPrice: 380, nbCopros: 5535, region: 'Occitanie' },
  { name: 'Strasbourg', slug: 'strasbourg', department: 'Bas-Rhin (67)', postalCode: '67000', syndicAvgPrice: 380, nbCopros: 5781, region: 'Grand Est' },
  { name: 'Bordeaux', slug: 'bordeaux', department: 'Gironde (33)', postalCode: '33000', syndicAvgPrice: 380, nbCopros: 8371, region: 'Nouvelle-Aquitaine' },
  { name: 'Lille', slug: 'lille', department: 'Nord (59)', postalCode: '59000', syndicAvgPrice: 380, nbCopros: 4750, region: 'Hauts-de-France' },
  { name: 'Rennes', slug: 'rennes', department: 'Ille-et-Vilaine (35)', postalCode: '35000', syndicAvgPrice: 380, nbCopros: 3970, region: 'Bretagne' },
  { name: 'Reims', slug: 'reims', department: 'Marne (51)', postalCode: '51100', syndicAvgPrice: 380, nbCopros: 3033, region: 'Grand Est' },
  { name: 'Saint-Étienne', slug: 'saint-etienne', department: 'Loire (42)', postalCode: '42000', syndicAvgPrice: 380, nbCopros: 3361, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Toulon', slug: 'toulon', department: 'Var (83)', postalCode: '83000', syndicAvgPrice: 380, nbCopros: 4242, region: "Provence-Alpes-Côte d'Azur" },
  { name: 'Le Havre', slug: 'le-havre', department: 'Seine-Maritime (76)', postalCode: '76600', syndicAvgPrice: 380, nbCopros: 2489, region: 'Normandie' },
  { name: 'Grenoble', slug: 'grenoble', department: 'Isère (38)', postalCode: '38000', syndicAvgPrice: 380, nbCopros: 3862, region: 'Auvergne-Rhône-Alpes' },
  { name: 'Dijon', slug: 'dijon', department: "Côte-d'Or (21)", postalCode: '21000', syndicAvgPrice: 380, nbCopros: 4005, region: 'Bourgogne-Franche-Comté' },
  { name: 'Angers', slug: 'angers', department: 'Maine-et-Loire (49)', postalCode: '49000', syndicAvgPrice: 380, nbCopros: 2508, region: 'Pays de la Loire' },
  { name: 'Nîmes', slug: 'nimes', department: 'Gard (30)', postalCode: '30000', syndicAvgPrice: 380, nbCopros: 2675, region: 'Occitanie' },
  { name: 'Aix-en-Provence', slug: 'aix-en-provence', department: 'Bouches-du-Rhône (13)', postalCode: '13100', syndicAvgPrice: 380, nbCopros: 3091, region: "Provence-Alpes-Côte d'Azur" },
];

export function getCityBySlug(slug) {
  return CITIES.find((c) => c.slug === slug) || null;
}
