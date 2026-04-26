import { Link } from 'react-router-dom';
import {
  Download,
  Mail,
  FileText,
  ImageIcon,
  Quote,
  Building2,
  Phone,
  ExternalLink,
  Newspaper,
  Sparkles,
} from 'lucide-react';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, {
  breadcrumbSchema,
  organizationSchema,
  pressReleaseSchema,
} from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import { Button } from '@components/ui/button';

const PRESS_RELEASE = {
  headline:
    'Charges de copropriété : +50 % en 10 ans, deux fois plus vite que l\'inflation. Une start-up française casse le monopole des syndics avec l\'IA.',
  subhead:
    'Le pré-état daté, document obligatoire à toute vente en copropriété, passe de 400 € à 24,99 € grâce à l\'intelligence artificielle. Une première en France.',
  datePublished: '2026-04-26',
  pdfPath: '/presse/pre-etat-date-cp-charges-2026.pdf',
};

const KEY_FIGURES = [
  { value: '+50 %', label: 'Charges de copropriété 2015-2025' },
  { value: '+28 %', label: 'Inflation cumulée sur 10 ans' },
  { value: '24,99 €', label: 'Prix pré-état daté avec l\'IA' },
  { value: '< 5 min', label: 'Délai de génération moyen' },
];

const LOGOS = [
  {
    label: 'Logo principal — SVG vectoriel',
    href: '/presse/logo-pre-etat-date.svg',
    filename: 'logo-pre-etat-date.svg',
    description: 'Format vectoriel, idéal print et web responsive.',
  },
  {
    label: 'Logo principal — PNG haute définition',
    href: '/presse/logo-pre-etat-date.png',
    filename: 'logo-pre-etat-date.png',
    description: 'Fond transparent, 2000 px de large.',
  },
  {
    label: 'Logo monochrome — SVG',
    href: '/presse/logo-pre-etat-date-mono.svg',
    filename: 'logo-pre-etat-date-mono.svg',
    description: 'Version noir & blanc pour fond coloré.',
  },
];

const INFOGRAPHICS = [
  {
    id: 'institutionnelle',
    title: 'Infographie « Institutionnelle »',
    angle:
      'Format Capital / Le Figaro : barres comparées, cartes tarifaires, structure data-journalism.',
    preview: '/presse/infographie-institutionnelle.png',
    downloads: [
      { label: 'PNG vertical 1200 × 1500', href: '/presse/infographie-institutionnelle.png' },
      { label: 'PNG horizontal 1200 × 675', href: '/presse/infographie-institutionnelle-horizontal.png' },
      { label: 'SVG vectoriel', href: '/presse/infographie-institutionnelle.svg' },
    ],
  },
  {
    id: 'battle',
    title: 'Infographie « Battle » — Style Nanobanana',
    angle:
      'Format réseaux sociaux : confrontation visuelle Syndic vs IA, optimisée engagement Twitter / LinkedIn.',
    preview: '/presse/infographie-battle.png',
    downloads: [
      { label: 'PNG carré 1080 × 1080', href: '/presse/infographie-battle.png' },
      { label: 'PNG story 1080 × 1920', href: '/presse/infographie-battle-story.png' },
      { label: 'SVG vectoriel', href: '/presse/infographie-battle.svg' },
    ],
  },
];

const TALKING_POINTS = [
  {
    title: 'Le constat : un coût injuste sur un marché tendu',
    quote:
      'Quand on vend un appartement en copropriété en France, on paie en moyenne entre 250 et 500 euros pour un document, le pré-état daté, dont le tarif n\'est plafonné par aucune loi. C\'est un coût caché que les vendeurs découvrent au pire moment, alors qu\'ils sont déjà mobilisés financièrement par les frais de notaire, les diagnostics et les éventuelles plus-values.',
  },
  {
    title: 'Le cadre légal : loi ALUR + loi ELAN',
    quote:
      'Le pré-état daté n\'est pas une invention commerciale, c\'est une obligation légale. Il découle directement de l\'article L.721-2 du Code de la Construction et de l\'Habitation, créé par la loi ALUR de 2014 et renforcé par la loi ELAN de 2018. Ces lois imposent au vendeur de fournir une information complète à l\'acquéreur, mais elles n\'imposent à aucun moment de passer par le syndic pour produire ce document.',
  },
  {
    title: 'La position du CSN : le verrou se desserre',
    quote:
      'Le Conseil Supérieur du Notariat — l\'instance représentative officielle des notaires français — a clairement établi que le recours au syndic pour le pré-état daté n\'est pas obligatoire. Seul l\'état daté, qui intervient après le compromis, est de la compétence exclusive du syndic et plafonné à 380 euros depuis le décret du 21 février 2020. Le pré-état daté, lui, peut être produit par le vendeur ou par un service tiers.',
  },
  {
    title: 'La valeur ajoutée de l\'IA : précision sur les données critiques',
    quote:
      'Notre IA ne remplace pas un humain sur l\'analyse juridique fine : elle excelle là où les humains perdent du temps — l\'extraction de données financières dans des dizaines de pages de PV, d\'appels de fonds et de relevés. On parle de cinq minutes pour produire un document que les syndics rendent en 15 à 30 jours. C\'est un gain de temps autant qu\'un gain d\'argent.',
  },
  {
    title: 'Le projet de société : redonner du pouvoir d\'achat',
    quote:
      'Les charges de copropriété ont augmenté de 50 % en dix ans, presque deux fois plus vite que l\'inflation. Dans ce contexte, demander 400 euros à un vendeur pour un document automatisable, c\'est anachronique. Notre ambition, c\'est de rendre 90 % de cette somme aux Français, à chaque vente en copropriété. À l\'échelle nationale, ça représente potentiellement plusieurs dizaines de millions d\'euros par an.',
  },
];

export default function PressPage() {
  return (
    <>
      <PageMeta
        title="Espace presse — Communiqués, visuels et chiffres officiels"
        description="Espace presse Pre-etat-date.ai : communiqué officiel sur les charges de copropriété (+50 % en 10 ans), infographies prêtes à publier, logos, talking points et contact direct."
        canonical="/presse"
        type="article"
        publishedTime={PRESS_RELEASE.datePublished}
        image="https://pre-etat-date.ai/presse/infographie-institutionnelle.png"
      />
      <JsonLd
        data={pressReleaseSchema({
          headline: PRESS_RELEASE.headline,
          description: PRESS_RELEASE.subhead,
          datePublished: PRESS_RELEASE.datePublished,
          url: '/presse',
          image: '/presse/infographie-institutionnelle.png',
        })}
      />
      <JsonLd data={organizationSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Presse' },
        ])}
      />

      <div className="max-w-5xl mx-auto px-4 py-12">
        <Breadcrumb items={[{ name: 'Accueil', url: '/' }, { name: 'Presse' }]} />

        {/* Hero */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
            <Newspaper className="h-3.5 w-3.5" />
            Espace presse
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 leading-tight mb-3">
            Centre de ressources presse Pre-etat-date.ai
          </h1>
          <p className="text-lg text-secondary-600 leading-relaxed">
            Communiqué officiel, visuels libres de droits, talking points et contact
            direct. Tout est à votre disposition pour publier votre article sans
            délai.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Button asChild size="lg" className="gap-2">
              <a href={PRESS_RELEASE.pdfPath} download>
                <Download className="h-4 w-4" />
                Télécharger le CP (PDF)
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2">
              <a href="mailto:contact@pre-etat-date.ai?subject=Demande%20presse%20Pre-etat-date.ai">
                <Mail className="h-4 w-4" />
                contact@pre-etat-date.ai
              </a>
            </Button>
          </div>
        </header>

        {/* Key figures */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14">
          {KEY_FIGURES.map((fig) => (
            <div
              key={fig.label}
              className="bg-white border border-secondary-200 rounded-xl p-4 text-center"
            >
              <div className="text-2xl md:text-3xl font-bold text-primary-600">
                {fig.value}
              </div>
              <div className="text-xs text-secondary-500 mt-1 leading-snug">
                {fig.label}
              </div>
            </div>
          ))}
        </section>

        {/* Communiqué de presse */}
        <section id="communique" className="mb-16">
          <div className="flex items-center gap-2 mb-4">
            <FileText className="h-5 w-5 text-primary-600" />
            <h2 className="text-2xl font-semibold text-secondary-900">
              Communiqué de presse officiel
            </h2>
          </div>

          <article className="bg-white border border-secondary-200 rounded-xl p-6 md:p-8">
            <div className="text-xs text-secondary-400 uppercase tracking-wide mb-3">
              Diffusion immédiate &middot; Paris, 26 avril 2026
            </div>
            <h3 className="text-2xl font-bold text-secondary-900 leading-tight mb-3">
              {PRESS_RELEASE.headline}
            </h3>
            <p className="italic text-secondary-700 mb-6">
              {PRESS_RELEASE.subhead}
            </p>

            <div className="prose prose-secondary max-w-none text-secondary-700 leading-relaxed space-y-4">
              <p>
                <strong>Paris, 26 avril 2026.</strong> Alors que les charges de
                copropriété ont bondi de <strong>+50 % en dix ans</strong> quand
                l'inflation cumulée n'a progressé que de <strong>+28 %</strong> sur
                la même période, les vendeurs en copropriété subissent un second
                choc au moment de mettre leur bien sur le marché : l'établissement
                du <strong>pré-état daté</strong>, document légalement obligatoire,
                leur est facturé entre <strong>250 € et 500 €</strong> par les
                syndics, sans aucun plafond légal.
              </p>

              <p>
                <strong>Une start-up française remet ce monopole en cause.</strong>{' '}
                La plateforme <strong>pré-état-daté.ai</strong> génère ce document
                conforme à l'article L.721-2 du Code de la Construction et de
                l'Habitation (loi ALUR){' '}
                <strong>en moins de cinq minutes pour 24,99 €</strong> — soit{' '}
                <strong>jusqu'à 20 fois moins cher</strong> que les tarifs syndics
                constatés en 2026.
              </p>

              <p>
                <strong>Comment ?</strong> En s'appuyant sur des modèles
                d'intelligence artificielle de dernière génération qui extraient
                automatiquement les données financières, juridiques et techniques à
                partir des PV d'assemblée générale, des appels de fonds et du
                règlement de copropriété fournis par le vendeur.
              </p>

              <p>
                <strong>Un cadre juridique clair.</strong> Le{' '}
                <strong>Conseil Supérieur du Notariat (CSN)</strong> a explicitement
                confirmé que le recours au syndic pour l'établissement du pré-état
                daté <strong>n'est pas obligatoire</strong> — contrairement à
                l'état daté, qui reste de la compétence exclusive du syndic et
                plafonné à 380 € TTC depuis le décret du 21 février 2020. C'est dans
                cet espace de liberté que pré-état-daté.ai opère, en parfaite
                conformité avec la loi ALUR et la loi ELAN.
              </p>

              <p>
                <strong>L'enjeu de pouvoir d'achat est massif.</strong> Avec
                environ <strong>800 000 transactions immobilières par an</strong>{' '}
                en France et une part importante en copropriété, l'économie
                potentielle sur les frais de pré-état daté se chiffre en{' '}
                <strong>dizaines de millions d'euros</strong> restitués aux
                vendeurs.
              </p>

              <blockquote className="border-l-4 border-primary-300 bg-primary-50/40 px-5 py-4 my-6 rounded-r-lg not-italic">
                <p className="text-secondary-800 italic mb-2">
                  « Il y a un paradoxe français : on demande aux vendeurs en
                  copropriété de payer plusieurs centaines d'euros pour un document
                  que l'IA produit aujourd'hui en cinq minutes. Notre mission, c'est
                  de redonner du pouvoir d'achat aux propriétaires en automatisant
                  ces démarches que tout le monde subissait sans poser de
                  questions. »
                </p>
                <footer className="text-sm text-secondary-600 not-italic">
                  — <strong>Eric Mayer</strong>, fondateur de pré-état-daté.ai
                  (Confer SAS)
                </footer>
              </blockquote>

              <p>
                <strong>Premiers résultats.</strong> Lancée récemment, la
                plateforme a déjà généré ses premiers documents pour des vendeurs
                particuliers, des agents immobiliers et des mandataires. La
                majorité des dossiers traités l'ont été en moins de{' '}
                <strong>300 secondes</strong>.
              </p>

              <p>
                <strong>À propos.</strong> pré-état-daté.ai est édité par Confer
                SAS, société française basée en région Grand Est. La plateforme est
                conforme au RGPD et utilise des outils d'analyse respectueux de la
                vie privée.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-secondary-100">
              <Button asChild className="gap-2">
                <a href={PRESS_RELEASE.pdfPath} download>
                  <Download className="h-4 w-4" />
                  Version PDF du communiqué
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2">
                <a
                  href={`mailto:contact@pre-etat-date.ai?subject=${encodeURIComponent(
                    'Interview Pre-etat-date.ai',
                  )}`}
                >
                  <Mail className="h-4 w-4" />
                  Demander une interview
                </a>
              </Button>
            </div>
          </article>
        </section>

        {/* Médiathèque */}
        <section id="mediatheque" className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <ImageIcon className="h-5 w-5 text-primary-600" />
            <h2 className="text-2xl font-semibold text-secondary-900">
              Médiathèque — Visuels libres de droits
            </h2>
          </div>
          <p className="text-secondary-500 text-sm mb-6">
            Tous les visuels sont mis à disposition gratuitement pour la presse,
            sous mention « Source : pré-état-daté.ai ». Pas d'embargo.
          </p>

          {/* Logos */}
          <h3 className="text-lg font-semibold text-secondary-800 mt-8 mb-4">
            Logos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LOGOS.map((logo) => (
              <div
                key={logo.href}
                className="bg-white border border-secondary-200 rounded-xl p-5 flex flex-col"
              >
                <div className="aspect-video bg-secondary-50 rounded-lg flex items-center justify-center mb-3">
                  <img
                    src={logo.href}
                    alt={logo.label}
                    className="max-h-16 w-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <h4 className="text-sm font-semibold text-secondary-900 mb-1">
                  {logo.label}
                </h4>
                <p className="text-xs text-secondary-500 mb-3 flex-1">
                  {logo.description}
                </p>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="gap-1.5 w-full"
                >
                  <a href={logo.href} download={logo.filename}>
                    <Download className="h-3.5 w-3.5" />
                    Télécharger
                  </a>
                </Button>
              </div>
            ))}
          </div>

          {/* Infographies */}
          <h3 className="text-lg font-semibold text-secondary-800 mt-12 mb-4">
            Infographies prêtes à publier
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {INFOGRAPHICS.map((info) => (
              <article
                key={info.id}
                className="bg-white border border-secondary-200 rounded-xl overflow-hidden"
              >
                <div className="aspect-[4/5] bg-gradient-to-br from-primary-50 to-secondary-100 relative">
                  <img
                    src={info.preview}
                    alt={info.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <div className="p-5">
                  <h4 className="font-semibold text-secondary-900 mb-1">
                    {info.title}
                  </h4>
                  <p className="text-sm text-secondary-500 mb-4 leading-relaxed">
                    {info.angle}
                  </p>
                  <div className="space-y-2">
                    {info.downloads.map((dl) => (
                      <Button
                        key={dl.href}
                        asChild
                        variant="outline"
                        size="sm"
                        className="w-full justify-between"
                      >
                        <a href={dl.href} download>
                          <span>{dl.label}</span>
                          <Download className="h-3.5 w-3.5" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Talking points */}
        <section id="talking-points" className="mb-16">
          <div className="flex items-center gap-2 mb-2">
            <Quote className="h-5 w-5 text-primary-600" />
            <h2 className="text-2xl font-semibold text-secondary-900">
              5 verbatims d'expert prêts à citer
            </h2>
          </div>
          <p className="text-secondary-500 text-sm mb-6">
            Citations d'Eric Mayer (fondateur), calibrées 30 à 60 secondes pour
            interview radio, TV ou écrite.
          </p>

          <ol className="space-y-5">
            {TALKING_POINTS.map((point, idx) => (
              <li
                key={point.title}
                className="bg-white border border-secondary-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-600 mb-2">
                  <span className="bg-primary-100 text-primary-700 rounded-full w-6 h-6 flex items-center justify-center">
                    {idx + 1}
                  </span>
                  {point.title}
                </div>
                <blockquote className="text-secondary-800 italic leading-relaxed">
                  « {point.quote} »
                </blockquote>
              </li>
            ))}
          </ol>
        </section>

        {/* Boilerplate + Contact */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white border border-secondary-200 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-5 w-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-secondary-900">
                À propos de pré-état-daté.ai
              </h2>
            </div>
            <p className="text-sm text-secondary-700 leading-relaxed">
              pré-état-daté.ai est la première plateforme française d'automatisation
              par intelligence artificielle du pré-état daté, document obligatoire
              à toute vente en copropriété (article L.721-2 du Code de la
              Construction et de l'Habitation, loi ALUR). Conçue pour les
              particuliers vendeurs, les agents immobiliers, les mandataires et les
              notaires, la plateforme produit en moins de cinq minutes, à partir
              des documents transmis par le vendeur, un pré-état daté conforme au
              cadre fixé par le Conseil Supérieur du Notariat. Le service est
              facturé 24,99 € — soit jusqu'à 20 fois moins cher que les tarifs
              constatés chez les syndics. La plateforme est éditée par{' '}
              <strong>Confer SAS</strong>, société française, et est conforme au
              RGPD.
            </p>
            <Link
              to="/a-propos"
              className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              En savoir plus sur l'entreprise
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="bg-gradient-to-br from-primary-600 to-primary-700 text-white rounded-xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-5 w-5 text-primary-200" />
              <h2 className="text-xl font-semibold">Contact presse</h2>
            </div>
            <p className="text-sm text-primary-100 mb-5 leading-relaxed">
              Disponible pour interviews, plateaux TV, podcasts et demandes de
              chiffres exclusifs. Réponse sous 24 h ouvrées.
            </p>

            <div className="space-y-3 text-sm">
              <div>
                <div className="text-primary-200 text-xs uppercase tracking-wide mb-0.5">
                  Porte-parole
                </div>
                <div className="font-semibold">Eric Mayer</div>
                <div className="text-primary-100">Fondateur — Confer SAS</div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary-200" />
                <a
                  href="mailto:contact@pre-etat-date.ai"
                  className="font-medium hover:underline"
                >
                  contact@pre-etat-date.ai
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary-200" />
                <span className="text-primary-100">Sur demande par email</span>
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <p className="text-center text-xs text-secondary-400 mt-8">
          Pas d'embargo &middot; Diffusion libre &middot; Mention obligatoire :
          « Source : pré-état-daté.ai »
        </p>
      </div>
    </>
  );
}
