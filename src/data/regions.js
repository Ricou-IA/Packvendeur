// ---------------------------------------------------------------------------
// Region data for SEO landing pages
//
// nbCopros: Registre National des Copropriétés (RNIC / ANAH), données 2024
//           Source: https://www.vicinorum.com/coproprietes/France/
//           Note: Copropriétés immatriculées uniquement (~66 % du parc réel).
//
// syndicAvgPrice: Tarif national constaté chez les principaux syndics pour
//                 le pré-état daté. Fourchette documentée : 150 à 600 €.
//                 Sources: étude ARC (2022), 60 Millions de Consommateurs.
// ---------------------------------------------------------------------------

export const REGIONS = [
  {
    name: 'Île-de-France',
    slug: 'ile-de-france',
    description: "L'Île-de-France concentre la plus forte densité de copropriétés en France, avec Paris et ses départements limitrophes. Les tarifs syndic y sont parmi les plus élevés du pays.",
    departments: ['Paris (75)', 'Hauts-de-Seine (92)', 'Seine-Saint-Denis (93)', 'Val-de-Marne (94)', 'Essonne (91)', 'Yvelines (78)', "Val-d'Oise (95)", 'Seine-et-Marne (77)'],
    nbCopros: 133791,
    syndicAvgPrice: 380,
    cities: ['paris'],
  },
  {
    name: "Provence-Alpes-Côte d'Azur",
    slug: 'provence-alpes-cote-d-azur',
    description: "La région PACA est la deuxième région française en nombre de copropriétés, portée par les grandes agglomérations de Marseille, Nice et Aix-en-Provence.",
    departments: ['Bouches-du-Rhône (13)', 'Alpes-Maritimes (06)', 'Var (83)', 'Vaucluse (84)', 'Alpes-de-Haute-Provence (04)', 'Hautes-Alpes (05)'],
    nbCopros: 96285,
    syndicAvgPrice: 380,
    cities: ['marseille', 'nice', 'toulon', 'aix-en-provence'],
  },
  {
    name: 'Auvergne-Rhône-Alpes',
    slug: 'auvergne-rhone-alpes',
    description: "Deuxième région économique de France, Auvergne-Rhône-Alpes dispose d'un parc de copropriétés important, notamment à Lyon, Grenoble et Saint-Étienne.",
    departments: ['Rhône (69)', 'Isère (38)', 'Loire (42)', 'Puy-de-Dôme (63)', 'Haute-Savoie (74)', 'Savoie (73)', 'Ain (01)', 'Drôme (26)'],
    nbCopros: 90746,
    syndicAvgPrice: 380,
    cities: ['lyon', 'grenoble', 'saint-etienne'],
  },
  {
    name: 'Occitanie',
    slug: 'occitanie',
    description: "L'Occitanie bénéficie d'une forte croissance démographique, avec des villes dynamiques comme Toulouse et Montpellier qui stimulent le marché de la copropriété.",
    departments: ['Haute-Garonne (31)', 'Hérault (34)', 'Gard (30)', 'Aude (11)', 'Pyrénées-Orientales (66)', 'Tarn (81)', 'Aveyron (12)', 'Lot (46)'],
    nbCopros: 60697,
    syndicAvgPrice: 380,
    cities: ['toulouse', 'montpellier', 'nimes'],
  },
  {
    name: 'Nouvelle-Aquitaine',
    slug: 'nouvelle-aquitaine',
    description: "Nouvelle-Aquitaine est la plus grande région de France par sa superficie. Bordeaux concentre l'essentiel des copropriétés de la région.",
    departments: ['Gironde (33)', 'Pyrénées-Atlantiques (64)', 'Charente-Maritime (17)', 'Haute-Vienne (87)', 'Dordogne (24)', 'Lot-et-Garonne (47)'],
    nbCopros: 44532,
    syndicAvgPrice: 380,
    cities: ['bordeaux'],
  },
  {
    name: 'Hauts-de-France',
    slug: 'hauts-de-france',
    description: "Les Hauts-de-France disposent d'un parc immobilier dense, avec Lille comme pôle principal de copropriétés dans la région.",
    departments: ['Nord (59)', 'Pas-de-Calais (62)', 'Somme (80)', 'Oise (60)', 'Aisne (02)'],
    nbCopros: 22340,
    syndicAvgPrice: 380,
    cities: ['lille'],
  },
  {
    name: 'Grand Est',
    slug: 'grand-est',
    description: "Le Grand Est possède un patrimoine immobilier varié, avec Strasbourg comme métropole principale et un marché de copropriété actif.",
    departments: ['Bas-Rhin (67)', 'Haut-Rhin (68)', 'Meurthe-et-Moselle (54)', 'Moselle (57)', 'Marne (51)', 'Aube (10)'],
    nbCopros: 53390,
    syndicAvgPrice: 380,
    cities: ['strasbourg', 'reims'],
  },
  {
    name: 'Bretagne',
    slug: 'bretagne',
    description: "La Bretagne connaît un marché immobilier dynamique, porté par Rennes, et un nombre croissant de copropriétés dans les villes littorales.",
    departments: ['Ille-et-Vilaine (35)', 'Finistère (29)', 'Côtes-d\'Armor (22)', 'Morbihan (56)'],
    nbCopros: 25488,
    syndicAvgPrice: 380,
    cities: ['rennes'],
  },
  {
    name: 'Pays de la Loire',
    slug: 'pays-de-la-loire',
    description: "Les Pays de la Loire bénéficient d'un marché immobilier en croissance, avec Nantes et Angers comme pôles principaux.",
    departments: ['Loire-Atlantique (44)', 'Maine-et-Loire (49)', 'Sarthe (72)', 'Vendée (85)', 'Mayenne (53)'],
    nbCopros: 23147,
    syndicAvgPrice: 380,
    cities: ['nantes', 'angers'],
  },
  {
    name: 'Normandie',
    slug: 'normandie',
    description: "La Normandie possède un parc de copropriétés varié, des stations balnéaires de la côte aux centres-villes de Rouen et Le Havre.",
    departments: ['Seine-Maritime (76)', 'Calvados (14)', 'Eure (27)', 'Manche (50)', 'Orne (61)'],
    nbCopros: 19625,
    syndicAvgPrice: 380,
    cities: ['le-havre'],
  },
];

export function getRegionBySlug(slug) {
  return REGIONS.find((r) => r.slug === slug) || null;
}
