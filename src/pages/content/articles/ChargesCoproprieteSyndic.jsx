import { Link } from 'react-router-dom';
import { ArrowRight, Clock, TrendingUp, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

// ---------------------------------------------------------------------------
// Data tables (all sourced — see inline citations)
// ---------------------------------------------------------------------------

const CHARGES_EVOLUTION = [
  { year: '2014', amount: 44.7, source: 'ARC/OSCAR' },
  { year: '2015', amount: 45.0, source: 'ARC/OSCAR' },
  { year: '2017', amount: 47.1, source: 'ARC/OSCAR' },
  { year: '2019', amount: 50.0, source: 'ARC/OSCAR' },
  { year: '2020', amount: 50.9, source: 'ARC' },
  { year: '2021', amount: 53.0, source: 'ARC' },
  { year: '2023', amount: 58.1, source: 'Matera' },
  { year: '2024', amount: 61.0, source: 'Manda' },
];

const INFLATION_COMPARISON = [
  { period: '2014–2017', charges: '+12 %', inflation: '+0,9 %', ratio: '×13' },
  { period: '2017–2019', charges: '+6 %', inflation: '+3,4 %', ratio: '×1,8' },
  { period: '2019–2021', charges: '+6 %', inflation: '+2,6 %', ratio: '×2,3' },
  { period: '2021–2024', charges: '+19,8 %', inflation: '+14 %', ratio: '×1,4' },
  { period: '2014–2024 (total)', charges: '+50 %', inflation: '+28 %', ratio: '×1,8' },
];

const FORFAIT_INCREASES = [
  { syndic: 'Loiselet & Daigremont', increase: '+37,7 %', period: '2014–2017' },
  { syndic: 'Citya', increase: '+32,8 %', period: '2014–2017' },
  { syndic: 'Nexity Lamy', increase: '+26,2 %', period: '2014–2017' },
  { syndic: 'Foncia (forfait base)', increase: '+1,7 %', period: '2014–2017' },
  { syndic: 'Foncia (taux horaire hors forfait)', increase: '+129 %', period: '2014–2017' },
];

const DGCCRF_STATS = [
  { label: 'Syndics contrôlés', value: '457', period: '2021–2022' },
  { label: 'Syndics en anomalie', value: '313 (68 %)', period: '2021–2022' },
  { label: 'Contrats irréguliers (CLCV)', value: '71 %', period: '2023' },
  { label: 'Amendes prononcées', value: '2', period: '2021–2022' },
];

// ---------------------------------------------------------------------------
// Visual bar chart component (CSS-based, no dependencies)
// ---------------------------------------------------------------------------

function BarChart({ data, maxValue, unit, color = 'bg-primary-500' }) {
  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.year} className="flex items-center gap-3">
          <span className="text-xs text-secondary-500 w-10 text-right font-mono">{item.year}</span>
          <div className="flex-1 bg-secondary-100 rounded-full h-6 relative overflow-hidden">
            <div
              className={`${color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
              style={{ width: `${(item.amount / maxValue) * 100}%` }}
            >
              <span className="text-xs font-semibold text-white whitespace-nowrap">
                {item.amount} {unit}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Source link component
// ---------------------------------------------------------------------------

function SourceLink({ href, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-800 underline text-sm"
    >
      {children}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function ChargesCoproprieteSyndic() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Charges de copropriété : +50 % en 10 ans (étude chiffrée 2026)"
        description="Analyse sourcée de l'évolution des charges de copropriété et honoraires de syndic en France : +50 % en 10 ans vs +28 % d'inflation. Chiffres DGCCRF, ARC, UFC-Que Choisir."
        canonical="/guide/charges-copropriete-evolution-syndic"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Charges de copropriété : +50 % en 10 ans, les copropriétaires vaches à lait du syndic ?",
        description: "Analyse chiffrée de l'évolution des charges et honoraires de syndic. Sources : ARC, DGCCRF, UFC-Que Choisir, INSEE.",
        slug: 'charges-copropriete-evolution-syndic',
        datePublished: '2026-02-27',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Charges de copropriété : évolution' },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Charges et honoraires syndic' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">
          Charges de copropriété : +50 % en 10 ans, les copropriétaires vaches à lait du syndic ?
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-27">Mis à jour le 27 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            12 min de lecture
          </span>
        </div>

        {/* Chapeau */}
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded-r-lg">
          <p className="text-secondary-700 leading-relaxed">
            <strong>En résumé :</strong> Entre 2014 et 2024, les charges de copropriété ont augmenté
            de <strong>+50 %</strong> en France, soit <strong>1,8 fois plus vite que l'inflation</strong> (+28 %).
            Les honoraires des grands syndics nationaux ont explosé jusqu'à +37 % sur 3 ans,
            et la DGCCRF a constaté des anomalies chez <strong>68 % des syndics contrôlés</strong>.
            Analyse chiffrée et sourcée.
          </p>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 1. Courbe des charges */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-red-500" />
          +50 % en 10 ans : la courbe qui fait mal
        </h2>

        <p className="text-secondary-600 leading-relaxed mb-4">
          L'observatoire des charges de copropriété de l'ARC (Association des Responsables de
          Copropriété), le baromètre OSCAR, suit l'évolution des charges au m² depuis plus de 15 ans.
          Le constat est sans appel.
        </p>

        <div className="bg-white border border-secondary-200 rounded-lg p-6 mb-4">
          <h3 className="text-sm font-semibold text-secondary-700 mb-4">
            Charges de copropriété en € / m² / an (sources : ARC/OSCAR, Matera, Manda)
          </h3>
          <BarChart
            data={CHARGES_EVOLUTION}
            maxValue={70}
            unit="€/m²"
            color="bg-red-500"
          />
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour un appartement de 60 m², cela représente un passage
          de <strong>2 682 €/an en 2014</strong> à <strong>3 660 €/an en 2024</strong>, soit
          près de <strong>1 000 € de plus par an</strong>. Et ce, avant même de prendre en compte
          les frais exceptionnels (ravalement, ascenseur, etc.).
        </p>

        <div className="text-xs text-secondary-400 mb-6">
          Sources :{' '}
          <SourceLink href="https://arc-copro.fr/documentation/communique-de-presse-larc-constate-une-evolution-relativement-faible-des-charges-de">
            ARC/OSCAR
          </SourceLink>
          {', '}
          <SourceLink href="https://matera.eu/fr/blog/moyenne-charges-copropriete">
            Matera (2023)
          </SourceLink>
          {', '}
          <SourceLink href="https://www.manda.fr/ressources/articles/barometre-des-charges-de-copropriete-manda-les-charges-explosent-mais-des-leviers-existent">
            Manda (2024)
          </SourceLink>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 2. Charges vs Inflation vs Loyers */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Charges vs inflation vs loyers : le grand décalage
        </h2>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Les loyers sont encadrés par l'IRL (Indice de Référence des Loyers), lui-même indexé
          sur l'inflation hors tabac et loyers (INSEE). Les charges de copropriété, elles, ne sont
          soumises à aucun plafond ni indice. Résultat :
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Période</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-red-700">Charges copro</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Inflation (IPC)</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Ratio</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              {INFLATION_COMPARISON.map((row, i) => (
                <tr key={row.period} className={i % 2 === 0 ? '' : 'bg-secondary-50/50'}>
                  <td className="border border-secondary-200 px-4 py-3 font-medium">{row.period}</td>
                  <td className="border border-secondary-200 px-4 py-3 text-red-700 font-semibold">{row.charges}</td>
                  <td className="border border-secondary-200 px-4 py-3">{row.inflation}</td>
                  <td className="border border-secondary-200 px-4 py-3 font-semibold">{row.ratio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Sur 10 ans, les charges ont augmenté <strong>1,8 fois plus vite que l'inflation</strong>.
          Sur certaines périodes (2014-2017), l'écart atteint un facteur 13. En d'autres termes :
          pendant que le coût de la vie augmentait de 0,9 %, les charges de copropriété grimpaient
          de 12 %.
        </p>

        <div className="text-xs text-secondary-400 mb-6">
          Sources : inflation IPC —{' '}
          <SourceLink href="https://www.insee.fr/fr/statistiques/4268033">
            INSEE
          </SourceLink>
          {' ; '}IRL —{' '}
          <SourceLink href="https://www.anil.org/outils/indices-et-plafonds/tableau-de-lirl/">
            ANIL
          </SourceLink>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 3. Les moteurs de la hausse */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 4 moteurs de la hausse
        </h2>

        <p className="text-secondary-600 leading-relaxed mb-4">
          La hausse des charges n'est pas uniquement imputable aux syndics. Quatre facteurs
          principaux l'expliquent :
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {[
            {
              title: 'Énergie (+30 % sur le gaz en 2023)',
              desc: 'Le chauffage collectif représente 30 % des charges. Les copropriétés au gaz ont subi +30 % entre 2022 et 2023.',
              color: 'border-red-200 bg-red-50',
            },
            {
              title: 'Assurance (+14 % en 2023)',
              desc: 'Les primes d\'assurance multirisque immeuble ont flambé, portées par les sinistres climatiques et la hausse du coût des matériaux.',
              color: 'border-amber-200 bg-amber-50',
            },
            {
              title: 'Travaux de maintenance (+19 %)',
              desc: 'Le coût des travaux d\'entretien a bondi de 19 % entre 2022 et 2023, sous l\'effet de l\'inflation des matériaux et de la main-d\'œuvre.',
              color: 'border-orange-200 bg-orange-50',
            },
            {
              title: 'Honoraires de syndic (+10 à +37 %)',
              desc: 'Les forfaits de base et surtout les prestations "hors forfait" ont connu des hausses bien supérieures à l\'inflation (voir ci-dessous).',
              color: 'border-violet-200 bg-violet-50',
            },
          ].map((item) => (
            <div key={item.title} className={`border rounded-lg p-4 ${item.color}`}>
              <h3 className="font-semibold text-secondary-900 text-sm mb-1">{item.title}</h3>
              <p className="text-secondary-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-xs text-secondary-400 mb-6">
          Sources :{' '}
          <SourceLink href="https://www.mysweetimmo.com/2024/02/19/copropriete-les-charges-liees-au-chauffage-font-un-bond-entre-2022-et-2023/">
            MySweetImmo (chauffage)
          </SourceLink>
          {', '}
          <SourceLink href="https://www.gererseul.com/actualite-immobiliere/charges-coproprietes-gaz-collectif-augmentation/">
            GererSeul (gaz +30 %)
          </SourceLink>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 4. Focus honoraires syndic */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-amber-500" />
          Focus : les honoraires de syndic, la face cachée
        </h2>

        <p className="text-secondary-600 leading-relaxed mb-4">
          En 2017, l'UFC-Que Choisir et l'ARC ont publié une étude conjointe accablante sur les
          pratiques tarifaires des 5 plus grands syndics de France. Le mécanisme est simple :
          le <strong>forfait de base</strong> (honoraires annuels de gestion) reste modéré,
          mais les <strong>prestations particulières</strong> (hors forfait) explosent.
        </p>

        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Syndic</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Hausse forfait base</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Période</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              {FORFAIT_INCREASES.map((row, i) => (
                <tr key={row.syndic} className={i % 2 === 0 ? '' : 'bg-secondary-50/50'}>
                  <td className="border border-secondary-200 px-4 py-3 font-medium">{row.syndic}</td>
                  <td className="border border-secondary-200 px-4 py-3 text-red-700 font-semibold">{row.increase}</td>
                  <td className="border border-secondary-200 px-4 py-3">{row.period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le cas Foncia est révélateur : le forfait de base n'augmente que de +1,7 %, mais
          le <strong>taux horaire des prestations hors forfait bondit de +129 %</strong>. Le résultat
          est le même pour le copropriétaire : la facture totale explose, mais de manière moins visible.
        </p>

        <p className="text-secondary-600 leading-relaxed mb-4">
          L'étude UFC/ARC a également relevé en moyenne <strong>17 clauses problématiques par
          contrat</strong> chez les grands syndics, avec un record de 25 clauses pour la formule
          « 1 par 1 » de Foncia.
        </p>

        <div className="text-xs text-secondary-400 mb-6">
          Sources :{' '}
          <SourceLink href="https://www.quechoisir.org/action-ufc-que-choisir-syndics-les-coproprietaires-toujours-aussi-mal-lotis-n43476/">
            UFC-Que Choisir (2017)
          </SourceLink>
          {', '}
          <SourceLink href="https://edito.seloger.com/actualites/france/les-syndics-de-copropriete-epingles-par-l-ufc-et-l-arc-pour-leurs-tarifs-excessifs-article-18475.html">
            SeLoger
          </SourceLink>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 5. Frais de mutation */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Vendre en copropriété : la double (ou triple) peine
        </h2>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Quand un copropriétaire vend son lot, le syndic en profite pour facturer
          jusqu'à <strong>3 documents distincts</strong> :
        </p>

        <div className="bg-white border border-secondary-200 rounded-lg divide-y divide-secondary-200 mb-4">
          {[
            {
              doc: 'État daté (obligatoire)',
              price: '380 € TTC (plafonné)',
              note: '99 % des syndics facturent au plafond légal',
              source: 'Décret n°2020-153',
            },
            {
              doc: 'Pré-état daté (compromis)',
              price: '150 à 600 € TTC',
              note: 'Aucun plafond légal — tarif libre',
              source: 'ARC (2022)',
            },
            {
              doc: 'Certificat article 20-II',
              price: '~132 € TTC',
              note: 'Opposition éventuelle du syndic',
              source: 'ARC',
            },
          ].map((item) => (
            <div key={item.doc} className="p-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="flex-1">
                <p className="font-semibold text-secondary-900 text-sm">{item.doc}</p>
                <p className="text-xs text-secondary-500">{item.note}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-red-700">{item.price}</p>
                <p className="text-xs text-secondary-400">{item.source}</p>
              </div>
            </div>
          ))}
          <div className="p-4 bg-red-50">
            <div className="flex items-center justify-between">
              <p className="font-bold text-secondary-900">Total potentiel</p>
              <p className="font-bold text-red-700 text-lg">jusqu'à 1 112 €</p>
            </div>
          </div>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          L'ARC dénonce une « double peine » : le plafonnement de l'état daté à 380 € a simplement
          poussé les syndics à <strong>augmenter le prix du pré-état daté</strong> (non réglementé)
          pour compenser. La facture totale du vendeur n'a pas diminué.
        </p>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-4">
          <p className="text-secondary-700 leading-relaxed text-sm">
            <strong>💡 À savoir :</strong> Le pré-état daté n'est pas obligatoirement
            établi par le syndic. Le Conseil Supérieur du Notariat confirme que le vendeur peut
            le produire lui-même.{' '}
            <Link to="/dossier" className="text-primary-600 hover:text-primary-800 font-semibold underline">
              Avec Pre-etat-date.ai, générez-le pour 24,99 €
            </Link>{' '}
            au lieu de 150 à 600 € chez le syndic.
          </p>
        </div>

        <div className="text-xs text-secondary-400 mb-6">
          Sources :{' '}
          <SourceLink href="https://arc-copro.fr/documentation/communique-de-presse-le-tarif-plafonne-de-letat-date-est-devenu-celui-reglemente-avec">
            ARC — État daté et pré-état daté
          </SourceLink>
          {', '}
          <SourceLink href="https://www.mysweetimmo.com/2022/02/24/vente-immobiliere-99-des-syndics-facturent-letat-date-au-plafond-legal-de-380e/">
            MySweetImmo — 99 % au plafond
          </SourceLink>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 6. DGCCRF */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          68 % d'anomalies : ce que dit la DGCCRF
        </h2>

        <p className="text-secondary-600 leading-relaxed mb-4">
          La Direction Générale de la Concurrence (DGCCRF) a mené des contrôles massifs en 2021 et
          2022 auprès de 457 syndics de copropriété. Le bilan est édifiant :
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {DGCCRF_STATS.map((stat) => (
            <div key={stat.label} className="bg-white border border-secondary-200 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-700 mb-1">{stat.value}</p>
              <p className="text-xs text-secondary-500">{stat.label}</p>
              <p className="text-xs text-secondary-400 mt-1">{stat.period}</p>
            </div>
          ))}
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Parmi les anomalies les plus fréquentes : des prestations incluses dans le forfait
          facturées en supplément, des tarifs hors forfait dépassant le montant contractuel,
          des charges indûment imputées à la copropriété, et la conservation d'intérêts bancaires
          qui auraient dû revenir au syndicat des copropriétaires.
        </p>

        <p className="text-secondary-600 leading-relaxed mb-4">
          En parallèle, la CLCV (Consommation Logement Cadre de Vie) a analysé 195 mandats de
          syndic en 2023 : <strong>71 % contenaient au moins une irrégularité</strong>, et 35 %
          présentaient des violations graves.
        </p>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Les sanctions ? Dérisoires. Sur 457 contrôles : 134 avertissements, 150 injonctions…
          et seulement <strong>2 amendes</strong>. Le plafond légal des sanctions (3 000 € pour
          un particulier, 15 000 € pour une société) n'est pas dissuasif face à des entreprises
          gérant des dizaines de milliers de lots.
        </p>

        <div className="text-xs text-secondary-400 mb-6">
          Sources :{' '}
          <SourceLink href="https://www.economie.gouv.fr/dgccrf/laction-de-la-dgccrf/les-enquetes/syndics-de-coproprietes-le-contrat-type-pas-toujours">
            DGCCRF (2021-2022)
          </SourceLink>
          {', '}
          <SourceLink href="https://www.clcv.org/articles/contrats-de-syndic-de-copropriete-un-respect-insuffisant">
            CLCV (2023)
          </SourceLink>
          {', '}
          <SourceLink href="https://bourseinside.fr/immobilier/contrats-de-syndic-68-danomalies-relevees-par-la-clcv-et-la-dgccrf-des-sanctions-rares-et-des-coproprietaires-qui-paient-sans-le-savoir/">
            BourseInside
          </SourceLink>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 7. Concentration du marché */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Un marché ultra-concentré
        </h2>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le marché français du syndic de copropriété est dominé par quelques acteurs :
        </p>

        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Foncia (groupe Emeria)</strong> : n°1 en France, ~2 millions de
            copropriétaires clients, 70 000 immeubles gérés. Racheté par le fonds suisse
            Partners Group en 2016 pour 1,83 milliard d'euros.
          </li>
          <li>
            <strong>Citya (groupe Arche)</strong> : n°2, présent dans toutes les régions, a
            absorbé Century 21 et Guy Hoquet (activités syndic).
          </li>
          <li>
            <strong>Nexity</strong> : a revendu sa branche « services aux particuliers »
            (syndic + gestion locative) au fonds Bridgepoint pour 440 millions d'euros en 2023.
          </li>
        </ul>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Les 5 premiers syndics représentent environ <strong>70 % du marché géré</strong> (étude
          UFC/ARC, 2017). Cette concentration réduit la concurrence et limite le pouvoir de
          négociation des copropriétaires.
        </p>

        <div className="text-xs text-secondary-400 mb-6">
          Sources :{' '}
          <SourceLink href="https://fr.foncia.com/notre-ambition/nos-chiffres-cles">
            Foncia — Chiffres clés
          </SourceLink>
          {', '}
          <SourceLink href="https://arc-copro.fr/documentation/un-nouveau-rachat-inquietant-de-la-societe-foncia-par-des-investisseurs-etrangers">
            ARC — Rachat Foncia
          </SourceLink>
          {', '}
          <SourceLink href="https://monimmeuble.com/actualite/copropriete-les-exces-tarifaires-et-contractuels-des-cinq-principaux-syndics">
            MonImmeuble — Excès tarifaires
          </SourceLink>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* 8. Que faire ? */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Que faire face à ces dérives ?
        </h2>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous êtes copropriétaire, plusieurs leviers existent pour réduire la facture :
        </p>

        <div className="space-y-3 mb-6">
          {[
            {
              num: '1',
              title: 'Comparez et mettez en concurrence votre syndic',
              desc: 'Demandez plusieurs devis à chaque renouvellement de mandat. Comparez non seulement le forfait, mais surtout les tarifs hors forfait.',
            },
            {
              num: '2',
              title: 'Scrutez les prestations « hors forfait »',
              desc: 'Vérifiez que les prestations incluses dans le contrat type réglementaire ne sont pas facturées en supplément (c\'est illégal).',
            },
            {
              num: '3',
              title: 'Envisagez le syndic coopératif ou bénévole',
              desc: 'Pour les petites copropriétés (< 20 lots), un syndic bénévole ou une plateforme comme Matera peut réduire les honoraires de 30 à 50 %.',
            },
            {
              num: '4',
              title: 'Pour la vente : ne payez pas le pré-état daté au syndic',
              desc: 'Le pré-état daté peut être établi par le vendeur. Utilisez un service en ligne pour économiser 150 à 600 € par rapport au syndic.',
            },
          ].map((step) => (
            <div key={step.num} className="flex gap-4 bg-white border border-secondary-200 rounded-lg p-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-primary-700">{step.num}</span>
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 text-sm mb-1">{step.title}</h3>
                <p className="text-secondary-600 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ------------------------------------------------------------ */}
        {/* Sources complètes */}
        {/* ------------------------------------------------------------ */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Sources et méthodologie
        </h2>

        <div className="bg-secondary-50 rounded-lg p-6 mb-6">
          <p className="text-secondary-600 text-sm leading-relaxed mb-3">
            Cet article s'appuie exclusivement sur des données publiques et des études d'organismes
            reconnus. Aucune donnée n'a été estimée ou extrapolée.
          </p>
          <ul className="space-y-1.5 text-sm text-secondary-600">
            <li>• <strong>ARC / OSCAR</strong> — Observatoire des charges de copropriété (annuel)</li>
            <li>• <strong>UFC-Que Choisir & ARC</strong> — Étude sur les excès tarifaires des syndics (2017)</li>
            <li>• <strong>DGCCRF</strong> — Enquêtes sur les syndics (2021-2022)</li>
            <li>• <strong>CLCV</strong> — Analyse des mandats de syndic (2023)</li>
            <li>• <strong>INSEE</strong> — Indices des prix à la consommation (IPC)</li>
            <li>• <strong>ANIL</strong> — Indice de Référence des Loyers (IRL)</li>
            <li>• <strong>Matera</strong> — Baromètre des charges de copropriété (2023)</li>
            <li>• <strong>Manda</strong> — Baromètre des charges de copropriété (2024)</li>
            <li>• <strong>Décret n°2020-153</strong> — Plafonnement de l'état daté à 380 € TTC</li>
          </ul>
        </div>

        <RelatedArticles currentSlug="charges-copropriete-evolution-syndic" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Vous vendez en copropriété ?
          </h2>
          <p className="text-secondary-500 mb-6 max-w-lg mx-auto">
            Générez votre pré-état daté pour 24,99 € au lieu de 150 à 600 € chez le syndic.
            Conforme au modèle CSN, résultat en 5 minutes.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Générer mon pré-état daté
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
