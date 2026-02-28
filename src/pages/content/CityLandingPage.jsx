import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Building2, Euro, Clock, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@components/ui/button';
import * as Collapsible from '@radix-ui/react-collapsible';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { faqSchema, breadcrumbSchema, SITE_URL, SITE_NAME } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import { getCityBySlug, CITIES, SYNDIC_PRICE_SOURCE, COPRO_SOURCE } from '@/data/cities';

// ---------------------------------------------------------------------------
// FAQ builder (plain text answers for structured data + display)
// ---------------------------------------------------------------------------

function buildFaqItems(city) {
  return [
    {
      question: `Combien coûte un pré-état daté à ${city.name} ?`,
      answer: `Les syndics facturent en moyenne 380 € pour le pré-état daté (source : étude ARC, 2022). Ce tarif, non réglementé, peut varier de 150 à 600 € selon les syndics. Avec Pre-etat-date.ai, vous le générez vous-même en ligne pour seulement 24,99 €, soit une économie pouvant atteindre ${Math.round(city.syndicAvgPrice - 24.99)} €. Le document est conforme au modèle du Conseil Supérieur du Notariat et accepté par les notaires.`,
    },
    {
      question: `Puis-je faire mon pré-état daté sans passer par le syndic à ${city.name} ?`,
      answer: `Oui. La loi ALUR impose la transmission de certaines informations financières au moment du compromis, mais elle n'oblige pas à passer par le syndic. Le Conseil Supérieur du Notariat a confirmé que le vendeur peut établir le pré-état daté lui-même. Pre-etat-date.ai vous permet de le faire en quelques minutes depuis ${city.name}.`,
    },
    {
      question: `Quels documents fournir pour vendre en copropriété à ${city.name} ?`,
      answer: `Pour générer votre pré-état daté à ${city.name}, vous aurez besoin des 3 derniers PV d'assemblée générale, du règlement de copropriété, des appels de fonds récents, des relevés de charges des 2 derniers exercices, de la fiche synthétique et des diagnostics techniques (DPE, amiante, plomb, etc.). Ces documents sont disponibles sur l'extranet de votre syndic.`,
    },
    {
      question: `Combien y a-t-il de copropriétés à ${city.name} ?`,
      answer: `D'après le Registre National des Copropriétés (RNIC) géré par l'ANAH, ${city.name} compte ${city.nbCopros.toLocaleString('fr-FR')} copropriétés immatriculées en ${city.department}. Ce chiffre ne couvre que les copropriétés enregistrées — le parc réel est estimé supérieur d'environ 30 à 40 %.`,
    },
  ];
}

// ---------------------------------------------------------------------------
// Comparison data
// ---------------------------------------------------------------------------

const COMPARISON_ROWS = [
  { label: 'Prix', syndic: (city) => `${city.syndicAvgPrice} € en moyenne*`, us: '24,99 €' },
  { label: 'Délai', syndic: () => '2 à 4 semaines', us: '5 minutes' },
  { label: 'Disponibilité', syndic: () => 'Horaires bureau', us: '24h/24, 7j/7' },
  { label: 'Conformité CSN', syndic: () => 'Variable', us: 'Garanti conforme' },
  { label: 'Partage notaire', syndic: () => 'Courrier / email', us: 'Lien sécurisé instantané' },
];

// ---------------------------------------------------------------------------
// Process steps
// ---------------------------------------------------------------------------

const STEPS = [
  {
    num: 1,
    title: 'Déposez vos documents',
    desc: 'Glissez-déposez vos PDF de copropriété (PV AG, règlement, appels de fonds, diagnostics).',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderColor: 'border-blue-100',
  },
  {
    num: 2,
    title: "L'IA analyse tout",
    desc: 'Notre intelligence artificielle classifie et extrait les données financières, juridiques et techniques.',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderColor: 'border-violet-100',
  },
  {
    num: 3,
    title: 'Validez les données',
    desc: 'Vérifiez et complétez les informations extraites dans un formulaire pré-rempli.',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    borderColor: 'border-amber-100',
  },
  {
    num: 4,
    title: 'Partagez avec le notaire',
    desc: 'Recevez votre PDF conforme et un lien de partage sécurisé à transmettre à votre notaire.',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    borderColor: 'border-emerald-100',
  },
];

// ---------------------------------------------------------------------------
// FAQ Item component
// ---------------------------------------------------------------------------

function FaqItem({ question, answer, isOpen, onToggle }) {
  return (
    <Collapsible.Root open={isOpen} onOpenChange={onToggle}>
      <Collapsible.Trigger className="flex items-center justify-between w-full text-left py-4 px-5 rounded-lg hover:bg-secondary-50 transition-colors group">
        <span className="font-medium text-secondary-900 pr-4">{question}</span>
        <ChevronDown
          className={`h-5 w-5 text-secondary-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </Collapsible.Trigger>
      <Collapsible.Content className="px-5 pb-4">
        <p className="text-secondary-600 leading-relaxed">{answer}</p>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CityLandingPage() {
  const { citySlug } = useParams();
  const navigate = useNavigate();
  const city = getCityBySlug(citySlug);
  const [openFaq, setOpenFaq] = useState(null);

  if (!city) {
    return <Navigate to="/404" replace />;
  }

  const faqItems = buildFaqItems(city);
  const otherCities = CITIES.filter((c) => c.slug !== city.slug).slice(0, 10);

  return (
    <>
      <PageMeta
        title={`Pré-état daté à ${city.name} en ligne | 24,99 €`}
        description={`Générez votre pré-état daté à ${city.name} (${city.department}) en ligne en 5 minutes pour 24,99 €. Analyse IA, conforme CSN, accepté par les notaires.`}
        canonical={`/pre-etat-date/${city.slug}`}
      />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Pré-état daté', url: null },
          { name: city.name },
        ])}
      />

      {/* ----------------------------------------------------------------- */}
      {/* Hero                                                               */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-gradient-to-b from-primary-50/60 to-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Accueil', to: '/' },
              { label: 'Pré-état daté' },
              { label: city.name },
            ]}
          />

          <div className="text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-900 leading-tight mb-4">
            Pré-état daté à {city.name}
          </h1>
          <p className="text-lg md:text-xl text-secondary-500 max-w-2xl mx-auto mb-3 leading-relaxed">
            Générez votre pré-état daté en ligne en 5 minutes, sans passer par le syndic.
          </p>
          <p className="text-base text-secondary-600 font-medium mb-8">
            <span className="text-primary-700 font-bold">24,99 €</span> au lieu de{' '}
            <span className="line-through text-secondary-400">{city.syndicAvgPrice} €</span>{' '}
            chez le syndic à {city.name}.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button
              size="lg"
              onClick={() => navigate('/dossier')}
              className="gap-2 text-base px-8 rounded-full"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-secondary-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Conforme loi ALUR &amp; ELAN
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Modèle CSN
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Accepté par les notaires
            </span>
          </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Context local                                                      */}
      {/* ----------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-8">
          La copropriété à {city.name}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-secondary-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-secondary-900 mb-1">
              {city.nbCopros.toLocaleString('fr-FR')}
            </p>
            <p className="text-sm text-secondary-500">copropriétés immatriculées</p>
            <p className="text-xs text-secondary-400 mt-1">{city.department}</p>
          </div>

          <div className="bg-white border border-secondary-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Euro className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-secondary-900 mb-1">{city.syndicAvgPrice} €</p>
            <p className="text-sm text-secondary-500">tarif syndic constaté*</p>
            <p className="text-xs text-secondary-400 mt-1">pour le pré-état daté</p>
          </div>

          <div className="bg-white border border-secondary-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Euro className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-primary-600 mb-1">24,99 €</p>
            <p className="text-sm text-secondary-500">avec Pre-etat-date.ai</p>
            <p className="text-xs text-green-600 font-medium mt-1">
              Économisez {Math.round(city.syndicAvgPrice - 24.99)} €
            </p>
          </div>
        </div>

        {/* Sources */}
        <div className="mt-6 text-xs text-secondary-400 space-y-1">
          <p>
            * Tarif constaté de 150 à 600 € selon les syndics.{' '}
            <a
              href={SYNDIC_PRICE_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-secondary-600"
            >
              {SYNDIC_PRICE_SOURCE.label}
            </a>
          </p>
          <p>
            Données copropriétés :{' '}
            <a
              href={COPRO_SOURCE.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-secondary-600"
            >
              {COPRO_SOURCE.label}
            </a>
          </p>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Comparison: Syndic vs Pre-etat-date.ai                              */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-secondary-50/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-8">
            Syndic vs Pre-etat-date.ai
          </h2>

          <div className="bg-white border border-secondary-200 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-secondary-50 border-b border-secondary-200">
              <div className="p-4 text-sm font-medium text-secondary-500" />
              <div className="p-4 text-sm font-semibold text-secondary-700 text-center">
                Syndic à {city.name}
              </div>
              <div className="p-4 text-sm font-semibold text-primary-700 text-center bg-primary-50/50">
                Pre-etat-date.ai
              </div>
            </div>

            {/* Rows */}
            {COMPARISON_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-3 ${
                  i < COMPARISON_ROWS.length - 1 ? 'border-b border-secondary-100' : ''
                }`}
              >
                <div className="p-4 text-sm font-medium text-secondary-700">{row.label}</div>
                <div className="p-4 text-sm text-secondary-500 text-center">
                  {row.syndic(city)}
                </div>
                <div className="p-4 text-sm text-primary-700 font-medium text-center bg-primary-50/30">
                  {row.us}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Process steps                                                      */}
      {/* ----------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-3">
          Comment ça marche ?
        </h2>
        <p className="text-secondary-500 text-center max-w-xl mx-auto mb-10">
          Obtenez votre pré-état daté à {city.name} en 4 étapes simples.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step) => (
            <div
              key={step.num}
              className={`bg-white border ${step.borderColor} rounded-lg p-6 relative`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${step.iconBg} flex items-center justify-center mb-4`}
              >
                <span className={`text-lg font-bold ${step.iconColor}`}>{step.num}</span>
              </div>
              <h3 className="text-base font-semibold text-secondary-900 mb-2">{step.title}</h3>
              <p className="text-sm text-secondary-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* FAQ locale                                                         */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-secondary-50/50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-8">
            Questions fréquentes
          </h2>

          <div className="bg-white border border-secondary-200 rounded-lg divide-y divide-secondary-200">
            {faqItems.map((item, i) => (
              <FaqItem
                key={i}
                question={item.question}
                answer={item.answer}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Other cities                                                       */}
      {/* ----------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-3">
          Disponible partout en France
        </h2>
        <p className="text-secondary-500 text-center max-w-xl mx-auto mb-8">
          Pre-etat-date.ai est disponible pour toutes les copropriétés de France.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {otherCities.map((c) => (
            <Link
              key={c.slug}
              to={`/pre-etat-date/${c.slug}`}
              className="bg-white border border-secondary-200 rounded-lg px-4 py-3 text-center text-sm font-medium text-secondary-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50/30 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* CTA final                                                          */}
      {/* ----------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center bg-secondary-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary-900 mb-3">
            Prêt à générer votre pré-état daté ?
          </h2>
          <p className="text-secondary-500 mb-6 max-w-lg mx-auto">
            Votre pré-état daté à {city.name} en 5 minutes, pour seulement 24,99 €. Conforme
            au modèle CSN, accepté par les notaires.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/dossier')}
            className="gap-2 text-base px-8 rounded-full"
          >
            Commencer maintenant
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>
    </>
  );
}
