import { useState, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, BookOpen, ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';

// ---------------------------------------------------------------------------
// Glossary data – 35 terms related to French co-ownership & property sales
// ---------------------------------------------------------------------------

const GLOSSARY_TERMS = [
  {
    id: 'appel-de-fonds',
    term: 'Appel de fonds',
    definition:
      "Demande de paiement adressée par le syndic aux copropriétaires pour couvrir les dépenses courantes ou exceptionnelles de la copropriété. Les appels de fonds sont généralement trimestriels et correspondent aux provisions prévues par le budget prévisionnel. Ils peuvent aussi être ponctuels pour financer des travaux votés en assemblée générale.",
    link: null,
  },
  {
    id: 'assemblee-generale',
    term: 'Assemblée générale (AG)',
    definition:
      "Réunion annuelle obligatoire de l'ensemble des copropriétaires au cours de laquelle sont votées les décisions relatives à la gestion de l'immeuble. L'AG approuve les comptes, vote le budget prévisionnel, décide des travaux et élit les membres du conseil syndical. Les décisions sont consignées dans un procès-verbal.",
    link: null,
  },
  {
    id: 'audit-energetique',
    term: 'Audit énergétique',
    definition:
      "Étude approfondie de la performance énergétique d'un immeuble qui identifie les sources de déperditions thermiques et propose des scénarios de travaux d'amélioration. Obligatoire pour les copropriétés de plus de 50 lots équipées d'un chauffage collectif, il est plus détaillé qu'un simple DPE et constitue un outil de planification des travaux de rénovation.",
    link: null,
  },
  {
    id: 'budget-previsionnel',
    term: 'Budget prévisionnel',
    definition:
      "Estimation annuelle des dépenses courantes de la copropriété votée en assemblée générale. Il couvre l'entretien, la maintenance, les contrats de service (ascenseur, nettoyage, assurance) et les frais de gestion du syndic. Le budget prévisionnel sert de base au calcul des appels de fonds trimestriels adressés à chaque copropriétaire.",
    link: null,
  },
  {
    id: 'carnet-entretien',
    term: "Carnet d'entretien",
    definition:
      "Document obligatoire tenu par le syndic qui recense l'ensemble des travaux réalisés dans l'immeuble ainsi que les contrats d'entretien en cours. Il constitue la mémoire technique de la copropriété et doit être mis à la disposition de tout acquéreur potentiel. La loi ALUR a renforcé l'obligation de le tenir à jour.",
    link: null,
  },
  {
    id: 'charges-courantes',
    term: 'Charges courantes',
    definition:
      "Dépenses régulières liées au fonctionnement normal de la copropriété : entretien des parties communes, contrats de maintenance, assurance de l'immeuble, honoraires du syndic et frais de gestion. Elles sont financées par le budget prévisionnel et réparties entre les copropriétaires selon leurs tantièmes.",
    link: null,
  },
  {
    id: 'charges-exceptionnelles',
    term: 'Charges exceptionnelles',
    definition:
      "Dépenses non prévues par le budget prévisionnel, votées en assemblée générale pour financer des travaux importants (ravalement, réfection de toiture, mise aux normes de l'ascenseur). Elles font l'objet d'appels de fonds spécifiques et sont réparties entre les copropriétaires selon les tantièmes définis par le règlement de copropriété.",
    link: null,
  },
  {
    id: 'compromis-vente',
    term: 'Compromis de vente',
    definition:
      "Avant-contrat signé entre le vendeur et l'acquéreur d'un bien immobilier qui engage les deux parties. En copropriété, il doit être accompagné de nombreux documents obligatoires dont le pré-état daté, le règlement de copropriété et les diagnostics techniques. L'acquéreur dispose d'un délai de rétractation de 10 jours après signature.",
    link: { url: '/guide/compromis-vente-copropriete-documents', label: 'Documents du compromis de vente' },
  },
  {
    id: 'conseil-syndical',
    term: 'Conseil syndical',
    definition:
      "Organe consultatif élu par l'assemblée générale qui assiste le syndic et contrôle sa gestion. Composé de copropriétaires bénévoles, il vérifie les comptes, donne son avis sur les devis de travaux et prépare l'ordre du jour de l'AG. Son rôle est essentiel pour garantir une gestion transparente de la copropriété.",
    link: null,
  },
  {
    id: 'coproprietaire',
    term: 'Copropriétaire',
    definition:
      "Personne physique ou morale propriétaire d'un ou plusieurs lots dans un immeuble en copropriété. Chaque copropriétaire dispose de droits (usage de son lot, vote en AG) et d'obligations (paiement des charges, respect du règlement de copropriété). L'ensemble des copropriétaires forme le syndicat des copropriétaires.",
    link: null,
  },
  {
    id: 'copropriete',
    term: 'Copropriété',
    definition:
      "Organisation juridique d'un immeuble dont la propriété est répartie entre plusieurs personnes. Chaque copropriétaire possède un lot privatif (appartement, cave, parking) et une quote-part des parties communes. La copropriété est régie par la loi du 10 juillet 1965 et le décret du 17 mars 1967.",
    link: { url: '/guide/vendre-appartement-copropriete', label: 'Guide de la vente en copropriété' },
  },
  {
    id: 'ddt',
    term: 'DDT (Dossier de Diagnostic Technique)',
    definition:
      "Ensemble des diagnostics immobiliers obligatoires que le vendeur doit fournir à l'acquéreur lors de la vente d'un bien. Il comprend notamment le DPE, le diagnostic amiante, plomb, électricité, gaz, termites, l'état des risques (ERP) et le mesurage Carrez. Le DDT doit être annexé au compromis de vente.",
    link: { url: '/guide/documents-necessaires-vente', label: 'Documents nécessaires à la vente' },
  },
  {
    id: 'dpe',
    term: 'DPE (Diagnostic de Performance Énergétique)',
    definition:
      "Diagnostic obligatoire qui évalue la consommation d'énergie et les émissions de gaz à effet de serre d'un logement. Il attribue une classe énergétique de A (très performant) à G (passoire thermique) et est valable 10 ans. Depuis le 1er juillet 2021, le DPE est devenu opposable et ses résultats engagent la responsabilité du diagnostiqueur.",
    link: { url: '/guide/dpe-vente-appartement', label: 'DPE et vente en copropriété' },
  },
  {
    id: 'dtg',
    term: 'DTG (Diagnostic Technique Global)',
    definition:
      "Analyse globale de l'état technique d'un immeuble en copropriété qui évalue l'état des parties communes, la situation au regard des obligations réglementaires et les améliorations possibles. Obligatoire lors de la mise en copropriété d'un immeuble de plus de 10 ans, il peut aussi être voté en AG. Le DTG sert de base à l'élaboration du plan pluriannuel de travaux.",
    link: null,
  },
  {
    id: 'etat-date',
    term: 'État daté',
    definition:
      "Document financier établi obligatoirement par le syndic lors de la vente d'un lot de copropriété. Il détaille la situation du vendeur vis-à-vis de la copropriété (charges dues, avances versées, impayés) et permet au notaire de répartir les charges entre vendeur et acquéreur. Son coût est plafonné à 380 EUR TTC.",
    link: { url: '/guide/difference-pre-etat-date-etat-date', label: 'Différence avec le pré-état daté' },
  },
  {
    id: 'etat-descriptif-division',
    term: 'État descriptif de division',
    definition:
      "Document qui identifie et numérote chaque lot privatif de la copropriété en précisant sa nature (appartement, cave, parking), son étage et ses tantièmes. Publié au fichier immobilier, il est annexé au règlement de copropriété et constitue la base juridique de la répartition des charges entre copropriétaires.",
    link: null,
  },
  {
    id: 'erp',
    term: 'ERP (État des Risques et Pollutions)',
    definition:
      "Diagnostic obligatoire qui informe l'acquéreur des risques naturels (inondation, sismicité), miniers, technologiques et de pollution des sols auxquels le bien est exposé. Basé sur les arrêtés préfectoraux, il doit dater de moins de 6 mois au moment de la signature du compromis de vente.",
    link: null,
  },
  {
    id: 'fiche-synthetique',
    term: 'Fiche synthétique',
    definition:
      "Document récapitulatif établi par le syndic qui présente les informations financières et techniques essentielles de la copropriété sur une seule page. Rendue obligatoire par la loi ALUR, elle doit être mise à jour chaque année et transmise aux copropriétaires. Elle facilite la comparaison entre copropriétés pour les acquéreurs potentiels.",
    link: { url: '/guide/fiche-synthetique-copropriete', label: 'Tout savoir sur la fiche synthétique' },
  },
  {
    id: 'fonds-de-travaux',
    term: 'Fonds de travaux',
    definition:
      "Réserve financière obligatoire constituée par les copropriétés pour anticiper le financement des travaux futurs. Imposé par la loi ALUR, le fonds de travaux est alimenté par une cotisation annuelle minimale de 2,5 % du budget prévisionnel. Il est rattaché au lot et suit le bien en cas de vente.",
    link: { url: '/guide/loi-alur-copropriete', label: 'Loi ALUR et copropriété' },
  },
  {
    id: 'gestionnaire',
    term: 'Gestionnaire de copropriété',
    definition:
      "Professionnel salarié d'un cabinet de syndic chargé de la gestion quotidienne d'un portefeuille de copropriétés. Il est l'interlocuteur principal des copropriétaires pour les questions courantes, la gestion des sinistres, le suivi des travaux et la préparation des assemblées générales.",
    link: null,
  },
  {
    id: 'impayes',
    term: 'Impayés de charges',
    definition:
      "Charges de copropriété non réglées par un ou plusieurs copropriétaires. Les impayés fragilisent la trésorerie de la copropriété et peuvent entraîner des difficultés à financer l'entretien courant. En cas de vente, le notaire vérifie la situation du vendeur et retient les sommes dues sur le prix de vente pour apurer la dette.",
    link: null,
  },
  {
    id: 'loi-alur',
    term: 'Loi ALUR (loi du 24 mars 2014)',
    definition:
      "Loi pour l'Accès au Logement et un Urbanisme Rénové qui a profondément réformé le droit de la copropriété. Elle a notamment instauré l'obligation du fonds de travaux, de la fiche synthétique, du registre d'immatriculation et renforcé les informations à fournir lors de la vente d'un lot (pré-état daté).",
    link: { url: '/guide/loi-alur-copropriete', label: 'Impact de la loi ALUR' },
  },
  {
    id: 'loi-elan',
    term: 'Loi ELAN (loi du 23 novembre 2018)',
    definition:
      "Loi portant Évolution du Logement, de l'Aménagement et du Numérique qui a complété les réformes de la loi ALUR. Elle a introduit le plan pluriannuel de travaux obligatoire, facilité la prise de décision en assemblée générale et modernisé les règles de mise en concurrence des contrats de syndic.",
    link: null,
  },
  {
    id: 'lot-copropriete',
    term: 'Lot de copropriété',
    definition:
      "Unité de propriété composée d'une partie privative (appartement, cave, parking) et d'une quote-part de parties communes exprimée en tantièmes. Chaque lot est identifié par un numéro unique dans l'état descriptif de division. Les charges sont réparties entre les lots proportionnellement à leurs tantièmes.",
    link: null,
  },
  {
    id: 'loi-carrez',
    term: 'Loi Carrez (mesurage)',
    definition:
      "Disposition légale imposant la mention de la superficie privative d'un lot de copropriété dans tout acte de vente. Le mesurage Carrez calcule la surface de plancher des locaux clos et couverts, déduction faite des murs, cloisons, cages d'escalier et surfaces dont la hauteur est inférieure à 1,80 mètre. Une erreur de plus de 5 % peut entraîner une diminution proportionnelle du prix de vente.",
    link: null,
  },
  {
    id: 'milliemes',
    term: 'Millièmes',
    definition:
      "Unité de mesure des tantièmes dans une copropriété, exprimée en fractions de 1 000. Les millièmes déterminent la quote-part de chaque lot dans les parties communes et servent de base à la répartition des charges. Ils peuvent différer selon la nature des charges (générales ou spéciales).",
    link: { url: '/guide/tantiemes-copropriete-calcul', label: 'Comprendre les tantièmes' },
  },
  {
    id: 'notaire',
    term: 'Notaire',
    definition:
      "Officier public chargé de recevoir les actes authentiques et de leur conférer une force probante. Dans le cadre d'une vente immobilière en copropriété, le notaire vérifie la conformité du dossier, rédige l'acte authentique et assure la répartition des charges entre vendeur et acquéreur à la date de la vente.",
    link: null,
  },
  {
    id: 'parties-communes',
    term: 'Parties communes',
    definition:
      "Éléments de l'immeuble qui appartiennent à l'ensemble des copropriétaires : halls, escaliers, couloirs, toiture, façade, terrain, canalisations principales. Leur usage et leur entretien sont régis par le règlement de copropriété. Les dépenses liées aux parties communes sont réparties entre les copropriétaires selon leurs tantièmes.",
    link: null,
  },
  {
    id: 'plan-pluriannuel-travaux',
    term: 'Plan pluriannuel de travaux (PPT)',
    definition:
      "Programme de travaux sur 10 ans établi sur la base du DTG pour planifier et budgéter les interventions nécessaires à la conservation de l'immeuble. Rendu obligatoire par la loi Climat et Résilience de 2021, il doit être adopté en assemblée générale et mis à jour tous les 10 ans. Il permet d'anticiper les dépenses et d'alimenter le fonds de travaux en conséquence.",
    link: null,
  },
  {
    id: 'pre-etat-date',
    term: 'Pré-état daté',
    definition:
      "Document financier et juridique qui informe l'acquéreur de la situation d'un lot de copropriété avant la signature du compromis de vente. Prévu par l'article L.721-2 du Code de la Construction, il détaille les charges, travaux votés, procédures en cours et la santé financière de la copropriété. Contrairement à l'état daté, il peut être établi par le vendeur lui-même.",
    link: { url: '/guide/quest-ce-pre-etat-date', label: "Qu'est-ce qu'un pré-état daté ?" },
  },
  {
    id: 'proces-verbal-ag',
    term: "Procès-verbal d'AG",
    definition:
      "Document officiel rédigé à l'issue de chaque assemblée générale qui retranscrit l'ensemble des résolutions votées, les résultats des votes et les éventuelles contestations. Il est notifié aux copropriétaires absents ou opposants et constitue une pièce essentielle lors de la vente d'un lot pour informer l'acquéreur des décisions récentes.",
    link: null,
  },
  {
    id: 'provisions-charges',
    term: 'Provisions sur charges',
    definition:
      "Sommes versées par anticipation par chaque copropriétaire, généralement par trimestre, pour couvrir les dépenses courantes de la copropriété. Le montant est calculé sur la base du budget prévisionnel et des tantièmes du lot. Les provisions font l'objet d'une régularisation annuelle après l'approbation des comptes en assemblée générale.",
    link: null,
  },
  {
    id: 'reglement-copropriete',
    term: 'Règlement de copropriété',
    definition:
      "Document juridique fondateur qui définit les règles de fonctionnement de la copropriété. Il précise la destination de l'immeuble, la répartition des lots, les tantièmes, les conditions d'utilisation des parties privatives et communes, ainsi que les règles de majorité pour les votes en AG. Il est publié au fichier immobilier et s'impose à tous les copropriétaires.",
    link: null,
  },
  {
    id: 'syndic',
    term: 'Syndic de copropriété',
    definition:
      "Mandataire chargé de l'administration et de la gestion de la copropriété. Le syndic peut être un professionnel (cabinet) ou un copropriétaire bénévole. Il exécute les décisions de l'assemblée générale, gère le budget, tient la comptabilité, souscrit les assurances et représente le syndicat des copropriétaires en justice.",
    link: { url: '/guide/cout-pre-etat-date-syndic', label: 'Coût du syndic pour le pré-état daté' },
  },
  {
    id: 'syndicat-coproprietaires',
    term: 'Syndicat des copropriétaires',
    definition:
      "Personne morale constituée de l'ensemble des copropriétaires d'un immeuble. Le syndicat est automatiquement créé dès qu'un immeuble est placé sous le régime de la copropriété. Il est doté de la personnalité juridique, peut agir en justice, et prend les décisions collectives en assemblée générale. Il est représenté par le syndic.",
    link: null,
  },
  {
    id: 'tantiemes',
    term: 'Tantièmes',
    definition:
      "Quote-part attribuée à chaque lot de copropriété, exprimée en fraction du total de l'immeuble (souvent en millièmes ou dix-millièmes). Les tantièmes reflètent la valeur relative de chaque lot par rapport à l'ensemble et déterminent la répartition des charges ainsi que le nombre de voix en assemblée générale.",
    link: { url: '/guide/tantiemes-copropriete-calcul', label: 'Calcul des tantièmes' },
  },
  {
    id: 'travaux-votes',
    term: 'Travaux votés',
    definition:
      "Travaux décidés en assemblée générale qui n'ont pas encore été réalisés ou dont le paiement n'est pas achevé. Lors de la vente d'un lot, le vendeur doit informer l'acquéreur des travaux votés et préciser la quote-part restant à payer. Selon la date du vote et de l'exigibilité des appels de fonds, la charge peut incomber au vendeur ou à l'acquéreur.",
    link: null,
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function GlossairePage() {
  const [search, setSearch] = useState('');
  const sectionRefs = useRef({});

  // Filter terms by search
  const filteredTerms = useMemo(() => {
    if (!search.trim()) return GLOSSARY_TERMS;
    const q = search.toLowerCase().trim();
    return GLOSSARY_TERMS.filter(
      (t) =>
        t.term.toLowerCase().includes(q) ||
        t.definition.toLowerCase().includes(q)
    );
  }, [search]);

  // Group filtered terms by first letter
  const groupedTerms = useMemo(() => {
    const groups = {};
    filteredTerms.forEach((t) => {
      const letter = t.term.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(t);
    });
    return groups;
  }, [filteredTerms]);

  // All letters present in the full (unfiltered) glossary
  const allLetters = useMemo(() => {
    const letters = new Set(GLOSSARY_TERMS.map((t) => t.term.charAt(0).toUpperCase()));
    return Array.from(letters).sort();
  }, []);

  // Letters present in the current filtered view
  const activeLetters = useMemo(() => new Set(Object.keys(groupedTerms)), [groupedTerms]);

  const scrollToLetter = (letter) => {
    const el = sectionRefs.current[letter];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Glossaire de la copropriété — Définitions et termes clés"
        description="Retrouvez les définitions de tous les termes liés à la copropriété et à la vente immobilière en France : tantièmes, charges, pré-état daté, syndic, DPE et bien plus."
        canonical="/glossaire"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Glossaire' },
        ])}
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Glossaire' },
        ]}
      />

      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <BookOpen className="h-4 w-4" />
          {GLOSSARY_TERMS.length} termes définis
        </div>
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Glossaire de la copropriété
        </h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
          Les définitions essentielles pour comprendre la copropriété, la vente
          immobilière et le pré-état daté en France.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un terme..."
          className="w-full pl-10 pr-4 py-3 border border-secondary-200 rounded-lg text-secondary-900 placeholder:text-secondary-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* Alphabet Navigation */}
      <nav aria-label="Navigation alphabétique" className="flex flex-wrap gap-1 mb-10 justify-center">
        {allLetters.map((letter) => {
          const isActive = activeLetters.has(letter);
          return (
            <button
              key={letter}
              onClick={() => isActive && scrollToLetter(letter)}
              disabled={!isActive}
              className={`w-9 h-9 rounded-md text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700 hover:bg-primary-100 cursor-pointer'
                  : 'bg-secondary-50 text-secondary-300 cursor-not-allowed'
              }`}
            >
              {letter}
            </button>
          );
        })}
      </nav>

      {/* Terms */}
      {filteredTerms.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-secondary-500 text-lg">
            Aucun terme ne correspond à votre recherche.
          </p>
          <button
            onClick={() => setSearch('')}
            className="mt-3 text-primary-600 hover:underline text-sm"
          >
            Effacer la recherche
          </button>
        </div>
      ) : (
        Object.keys(groupedTerms)
          .sort()
          .map((letter) => (
            <section
              key={letter}
              ref={(el) => (sectionRefs.current[letter] = el)}
              className="mb-10 scroll-mt-24"
            >
              <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm py-2 border-b border-secondary-200 mb-4">
                <h2 className="text-2xl font-bold text-primary-600">{letter}</h2>
              </div>

              <div className="space-y-6">
                {groupedTerms[letter].map((item) => (
                  <article
                    key={item.id}
                    id={item.id}
                    className="group bg-white border border-secondary-100 rounded-lg p-5 hover:border-primary-200 hover:shadow-sm transition-all"
                  >
                    <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                      {item.term}
                    </h3>
                    <p className="text-secondary-600 leading-relaxed">
                      {item.definition}
                    </p>
                    {item.link && (
                      <Link
                        to={item.link.url}
                        className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                      >
                        <BookOpen className="h-3.5 w-3.5" />
                        {item.link.label}
                      </Link>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))
      )}

      {/* Bottom CTA */}
      <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
          Prêt à générer votre pré-état daté ?
        </h2>
        <p className="text-secondary-500 mb-6 max-w-lg mx-auto">
          Constituez votre dossier de vente en copropriété en quelques minutes
          grâce à l'analyse IA de vos documents.
        </p>
        <Button asChild size="lg">
          <Link to="/dossier" className="gap-2">
            Commencer mon dossier
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
