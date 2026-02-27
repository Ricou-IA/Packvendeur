import { useParams, Navigate, Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowRight, CheckCircle, Building2, Euro, MapPin, ChevronDown } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import { getRegionBySlug } from '@/data/regions';
import { CITIES, SYNDIC_PRICE_SOURCE, COPRO_SOURCE } from '@/data/cities';

// ---------------------------------------------------------------------------
// FAQ builder
// ---------------------------------------------------------------------------

function buildFaqItems(region) {
  return [
    {
      question: `Combien coûte un pré-état daté en ${region.name} ?`,
      answer: `Les syndics facturent en moyenne 380 € pour le pré-état daté en France (source : étude ARC, 2022). Ce tarif varie de 150 à 600 € selon les syndics. Avec Dossiervente.ai, vous le générez vous-même en ligne pour seulement 24,99 €, soit une économie pouvant atteindre ${Math.round(region.syndicAvgPrice - 24.99)} €. Le document est conforme au modèle du Conseil Supérieur du Notariat et accepté par tous les notaires de la région.`,
    },
    {
      question: `Dossiervente.ai couvre-t-il toute la région ${region.name} ?`,
      answer: `Oui, Dossiervente.ai est disponible pour toutes les copropriétés de la région ${region.name}, dans l'ensemble des ${region.departments.length} départements : ${region.departments.join(', ')}. Notre service 100 % en ligne fonctionne quel que soit votre syndic ou votre commune.`,
    },
    {
      question: `Combien y a-t-il de copropriétés en ${region.name} ?`,
      answer: `D'après le Registre National des Copropriétés (RNIC) géré par l'ANAH, la région ${region.name} compte ${region.nbCopros.toLocaleString('fr-FR')} copropriétés immatriculées. Ce chiffre ne couvre que les copropriétés enregistrées — le parc réel est estimé supérieur d'environ 30 à 40 %.`,
    },
    {
      question: `Quels documents fournir pour vendre en copropriété en ${region.name} ?`,
      answer: `Pour générer votre pré-état daté en ${region.name}, vous aurez besoin des 3 derniers PV d'assemblée générale, du règlement de copropriété, des appels de fonds récents, des relevés de charges des 2 derniers exercices, de la fiche synthétique et des diagnostics techniques (DPE, amiante, plomb, etc.). Ces documents sont disponibles sur l'extranet de votre syndic.`,
    },
  ];
}

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

export default function RegionLandingPage() {
  const { regionSlug } = useParams();
  const navigate = useNavigate();
  const region = getRegionBySlug(regionSlug);
  const [openFaq, setOpenFaq] = useState(null);

  if (!region) {
    return <Navigate to="/404" replace />;
  }

  const regionCities = CITIES.filter((c) => region.cities.includes(c.slug));
  const faqItems = buildFaqItems(region);

  return (
    <>
      <PageMeta
        title={`Pré-état daté en ${region.name} | 24,99 €`}
        description={`Générez votre pré-état daté en ${region.name} en ligne en 5 minutes pour 24,99 €. ${region.nbCopros.toLocaleString('fr-FR')} copropriétés couvertes. Analyse IA, conforme CSN, accepté par les notaires.`}
        canonical={`/pre-etat-date/region/${region.slug}`}
      />
      <JsonLd data={faqSchema(faqItems)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Pré-état daté', url: null },
          { name: region.name },
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
              { label: region.name },
            ]}
          />

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-900 leading-tight mb-4">
              Pré-état daté en {region.name}
            </h1>
            <p className="text-lg md:text-xl text-secondary-500 max-w-2xl mx-auto mb-3 leading-relaxed">
              Générez votre pré-état daté en ligne en 5 minutes, sans passer par le syndic.
              Service disponible dans toute la région {region.name}.
            </p>
            <p className="text-base text-secondary-600 font-medium mb-8">
              <span className="text-primary-700 font-bold">24,99 €</span> au lieu de{' '}
              <span className="line-through text-secondary-400">{region.syndicAvgPrice} €</span>{' '}
              en moyenne chez le syndic.
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
      {/* Region context                                                     */}
      {/* ----------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-4">
          La copropriété en {region.name}
        </h2>
        <p className="text-secondary-500 text-center max-w-3xl mx-auto mb-8 leading-relaxed">
          {region.description}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-secondary-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center mx-auto mb-4">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-secondary-900 mb-1">
              {region.nbCopros.toLocaleString('fr-FR')}
            </p>
            <p className="text-sm text-secondary-500">copropriétés immatriculées</p>
            <p className="text-xs text-secondary-400 mt-1">en {region.name}</p>
          </div>

          <div className="bg-white border border-secondary-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center mx-auto mb-4">
              <Euro className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-3xl font-bold text-secondary-900 mb-1">{region.syndicAvgPrice} €</p>
            <p className="text-sm text-secondary-500">tarif syndic constaté*</p>
            <p className="text-xs text-secondary-400 mt-1">pour le pré-état daté</p>
          </div>

          <div className="bg-white border border-secondary-200 rounded-lg p-6 text-center">
            <div className="w-12 h-12 rounded-lg bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <Euro className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-3xl font-bold text-primary-600 mb-1">24,99 €</p>
            <p className="text-sm text-secondary-500">avec Dossiervente.ai</p>
            <p className="text-xs text-green-600 font-medium mt-1">
              Économisez {Math.round(region.syndicAvgPrice - 24.99)} €
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
      {/* Departments                                                        */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-secondary-50/50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-8">
            Départements couverts
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {region.departments.map((dept) => (
              <div
                key={dept}
                className="bg-white border border-secondary-200 rounded-lg px-4 py-3 text-center text-sm font-medium text-secondary-700 flex items-center justify-center gap-2"
              >
                <MapPin className="h-4 w-4 text-secondary-400 flex-shrink-0" />
                {dept}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* City links                                                         */}
      {/* ----------------------------------------------------------------- */}
      {regionCities.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-3">
            Pré-état daté par ville en {region.name}
          </h2>
          <p className="text-secondary-500 text-center max-w-xl mx-auto mb-8">
            Retrouvez nos pages dédiées pour les principales villes de la région.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {regionCities.map((city) => (
              <Link
                key={city.slug}
                to={`/pre-etat-date/${city.slug}`}
                className="bg-white border border-secondary-200 rounded-lg px-4 py-3 text-center text-sm font-medium text-secondary-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50/30 transition-colors"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* FAQ                                                                */}
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
      {/* CTA final                                                          */}
      {/* ----------------------------------------------------------------- */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center bg-secondary-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary-900 mb-3">
            Prêt à générer votre pré-état daté ?
          </h2>
          <p className="text-secondary-500 mb-6 max-w-lg mx-auto">
            Votre pré-état daté en {region.name} en 5 minutes, pour seulement 24,99 €. Conforme
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
