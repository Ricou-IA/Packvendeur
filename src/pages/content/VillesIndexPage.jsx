import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, MapPin, Building2 } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema, SITE_URL } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import { REGIONS } from '@/data/regions';
import { CITIES, COPRO_SOURCE } from '@/data/cities';

export default function VillesIndexPage() {
  const navigate = useNavigate();
  const totalCopros = REGIONS.reduce((sum, r) => sum + r.nbCopros, 0);

  return (
    <>
      <PageMeta
        title="Pré-état daté par ville et région | Pre-etat-date.ai"
        description={`Pré-état daté en ligne dans toute la France : ${CITIES.length} villes, ${REGIONS.length} régions. 24,99 € au lieu de 150-600 € chez le syndic. Service conforme CSN, accepté par les notaires.`}
        canonical="/pre-etat-date"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Pré-état daté', url: '/' },
          { name: 'Pré-état daté par ville' },
        ])}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Pré-état daté par ville et région en France',
          description: `Service de pré-état daté en ligne disponible dans ${CITIES.length} villes et ${REGIONS.length} régions de France.`,
          url: `${SITE_URL}/pre-etat-date`,
          inLanguage: 'fr-FR',
          isPartOf: { '@type': 'WebSite', name: 'Pre-etat-date.ai', url: SITE_URL },
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-50/60 to-white py-16 md:py-20">
        <div className="max-w-6xl mx-auto px-4">
          <Breadcrumb
            items={[
              { label: 'Pré-état daté', to: '/' },
              { label: 'Pré-état daté par ville' },
            ]}
          />

          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-900 leading-tight mb-4">
              Pré-état daté partout en France
            </h1>
            <p className="text-lg md:text-xl text-secondary-500 max-w-2xl mx-auto mb-6 leading-relaxed">
              {CITIES.length} villes couvertes, {REGIONS.length} régions.
              Votre pré-état daté en ligne pour <strong className="text-primary-700">24,99 €</strong>.
            </p>

            <div className="flex items-center justify-center gap-6 text-sm text-secondary-500 mb-8">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4 text-blue-500" />
                {totalCopros.toLocaleString('fr-FR')} copropriétés couvertes
              </span>
            </div>

            <Button
              size="lg"
              onClick={() => navigate('/dossier')}
              className="gap-2 text-base px-8 rounded-full"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Regions + Cities */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary-900 text-center mb-3">
          Par région
        </h2>
        <p className="text-secondary-500 text-center max-w-xl mx-auto mb-10">
          Cliquez sur une région ou une ville pour consulter les détails locaux.
        </p>

        <div className="space-y-8">
          {REGIONS.map((region) => {
            const regionCities = CITIES.filter((c) => region.cities.includes(c.slug));
            return (
              <div key={region.slug} className="bg-white border border-secondary-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <Link
                    to={`/pre-etat-date/region/${region.slug}`}
                    className="flex items-center gap-2 group"
                  >
                    <MapPin className="h-5 w-5 text-primary-500" />
                    <h3 className="text-lg font-semibold text-secondary-900 group-hover:text-primary-700 transition-colors">
                      {region.name}
                    </h3>
                    <span className="text-sm text-secondary-400">
                      {region.nbCopros.toLocaleString('fr-FR')} copropriétés
                    </span>
                  </Link>
                  <Link
                    to={`/pre-etat-date/region/${region.slug}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium hidden sm:inline"
                  >
                    Voir la région →
                  </Link>
                </div>

                {regionCities.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {regionCities.map((city) => (
                      <Link
                        key={city.slug}
                        to={`/pre-etat-date/${city.slug}`}
                        className="bg-secondary-50 border border-secondary-200 rounded-md px-3 py-1.5 text-sm text-secondary-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50/30 transition-colors"
                      >
                        {city.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-secondary-400 text-center">
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
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center bg-secondary-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary-900 mb-3">
            Votre ville n'est pas listée ?
          </h2>
          <p className="text-secondary-500 mb-6 max-w-lg mx-auto">
            Pas de souci ! Pre-etat-date.ai fonctionne pour <strong>toutes les copropriétés de France</strong>,
            quelle que soit votre commune.
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
