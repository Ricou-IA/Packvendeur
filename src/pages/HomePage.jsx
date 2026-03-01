import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { Badge } from '@components/ui/badge';
import PageMeta from '@components/seo/PageMeta';
import * as Collapsible from '@radix-ui/react-collapsible';
import {
  ArrowRight,
  Upload,
  Brain,
  ClipboardCheck,
  Share2,
  CheckCircle,
  Scale,
  FileCheck,
  Shield,
  Star,
  ChevronDown,
  Zap,
  MapPin,
} from 'lucide-react';
import JsonLd, { organizationSchema, websiteSchema, productSchema, faqSchema, howToSchema, softwareApplicationSchema } from '@components/seo/JsonLd';
import { CITIES } from '@/data/cities';

// Prefetch DossierPage chunk on hover to reduce perceived load time
const prefetchDossier = () => { import('@pages/DossierPage'); };

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TRUST_ITEMS = [
  { icon: Scale, label: 'Conforme loi ALUR & ELAN' },
  { icon: FileCheck, label: 'Modèle CSN officiel' },
  { icon: Brain, label: 'Analyse IA automatisée' },
  { icon: Shield, label: 'RGPD compliant' },
];

const PROCESS_STEPS = [
  {
    num: 1,
    icon: Upload,
    title: 'Déposez vos documents',
    desc: 'Glissez-déposez vos PDF de copropriété',
    time: '~2 min',
    gradient: 'from-blue-500/20 to-cyan-500/10',
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-600',
    border: 'border-blue-200/50',
  },
  {
    num: 2,
    icon: Brain,
    title: "L'IA analyse tout",
    desc: 'Classification automatique et extraction des données financières',
    time: '~5 min',
    gradient: 'from-violet-500/20 to-purple-500/10',
    iconBg: 'bg-violet-500/10',
    iconColor: 'text-violet-600',
    border: 'border-violet-200/50',
  },
  {
    num: 3,
    icon: ClipboardCheck,
    title: 'Validez les données',
    desc: 'Vérifiez et complétez les informations extraites',
    time: '~3 min',
    gradient: 'from-amber-500/20 to-orange-500/10',
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-600',
    border: 'border-amber-200/50',
  },
  {
    num: 4,
    icon: Share2,
    title: 'Partagez avec le notaire',
    desc: 'Un seul dossier complet avec documents indexés — un lien et c\'est envoyé',
    time: 'Instantané',
    gradient: 'from-cyan-500/20 to-teal-500/10',
    iconBg: 'bg-cyan-500/10',
    iconColor: 'text-cyan-600',
    border: 'border-cyan-200/50',
  },
];

const INCLUSIONS = [
  'Pré-état daté conforme CSN',
  'Analyse IA de tous vos documents',
  'Vérification DPE via ADEME',
  'Lien de partage notaire sécurisé',
  'PDF téléchargeable',
  'Questionnaire vendeur complet',
];

const FAQ_ITEMS = [
  {
    q: "Qu'est-ce qu'un pré-état daté ?",
    a: "Le pré-état daté est un document qui rassemble les informations financières et juridiques de la copropriété, nécessaire lors de la vente d'un lot. Il constitue une version préparatoire de l'état daté demandé par le notaire, et peut être établi par le vendeur lui-même d'après le modèle du Conseil Supérieur du Notariat.",
  },
  {
    q: 'Le pré-état daté est-il obligatoire ?',
    a: "La loi ALUR impose la fourniture de certaines informations au moment du compromis de vente. Le pré-état daté n'est pas un document légal obligatoire en soi, mais il répond à l'obligation d'informer l'acquéreur. Il permet d'anticiper l'état daté officiel du syndic et d'accélérer considérablement le processus de vente.",
  },
  {
    q: "Quelle est la différence avec l'état daté du syndic ?",
    a: "L'état daté est un document officiel établi par le syndic de copropriété, facturé entre 150 et 600 € avec un délai de 1 à 4 semaines. Le pré-état daté contient les mêmes informations mais est établi par le vendeur à partir de ses propres documents. Il est accepté par la majorité des notaires pour préparer le compromis.",
  },
  {
    q: 'Mes données sont-elles sécurisées ?',
    a: "Oui. Toutes les données sont hébergées sur des serveurs européens. Vos documents et informations personnelles sont automatiquement supprimés sous 7 jours après la génération du dossier, conformément au RGPD. Aucune donnée n'est partagée avec des tiers.",
  },
  {
    q: 'Combien de temps ça prend ?',
    a: "L'ensemble du processus prend entre 5 et 10 minutes : le dépôt des documents (2 min), l'analyse par l'IA (5 min), et la validation des données (3 min). Le PDF et le lien de partage sont générés instantanément après le paiement.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "J'ai économisé 350 € par rapport à mon syndic. Le document a été accepté par mon notaire sans problème.",
    name: 'Marie L.',
    city: 'Paris',
    stars: 5,
  },
  {
    quote:
      "En 5 minutes c'était fait. Impressionnant la qualité de l'analyse IA.",
    name: 'Thomas D.',
    city: 'Lyon',
    stars: 5,
  },
  {
    quote:
      'Super pratique, j\'ai pu partager directement le lien avec mon notaire.',
    name: 'Sophie M.',
    city: 'Toulouse',
    stars: 5,
  },
];

// ---------------------------------------------------------------------------
// Glass Card component (reusable)
// ---------------------------------------------------------------------------
function GlassCard({ children, className = '', hover = true }) {
  return (
    <div
      className={`
        rounded-2xl
        bg-white/60 backdrop-blur-xl
        border border-white/50
        shadow-glass
        ${hover ? 'hover:shadow-glass-hover hover:bg-white/70 hover:scale-[1.02] transition-all duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HomePage() {
  const navigate = useNavigate();
  const [syndicPrice, setSyndicPrice] = useState(380);
  const [openFaq, setOpenFaq] = useState(null);

  const savings = Math.max(0, syndicPrice - 24.99);
  const savingsPercent = syndicPrice > 0 ? Math.round((savings / syndicPrice) * 100) : 0;

  return (
    <>
      <PageMeta
        title="Pré-état daté en ligne en 5 minutes"
        description="Générez votre pré-état daté et Pack Vendeur en ligne pour 24,99 €. Analyse IA des documents de copropriété, conforme loi ALUR et modèle CSN."
        canonical="/"
      />
      <JsonLd data={organizationSchema()} />
      <JsonLd data={websiteSchema()} />
      <JsonLd data={productSchema()} />
      <JsonLd
        data={faqSchema(
          FAQ_ITEMS.map((item) => ({ question: item.q, answer: item.a }))
        )}
      />
      <JsonLd data={howToSchema()} />
      <JsonLd data={softwareApplicationSchema()} />

      {/* ----------------------------------------------------------------- */}
      {/* Section 1: Hero — Mesh gradient + floating blobs                   */}
      {/* ----------------------------------------------------------------- */}
      <section className="mesh-gradient-hero relative overflow-hidden py-14 md:py-20">
        {/* Watermark illustrations — both sides */}
        <img
          src="/hero-watermark.png"
          alt=""
          aria-hidden="true"
          className="absolute z-0 opacity-[0.15] pointer-events-none hidden xl:block -left-10 top-1/2 -translate-y-1/2 w-[500px] -rotate-3"
        />
        <img
          src="/hero-watermark.png"
          alt=""
          aria-hidden="true"
          className="absolute z-0 opacity-[0.20] pointer-events-none hidden xl:block -right-24 top-1/2 -translate-y-1/2 w-[480px] rotate-3"
        />
        <img
          src="/hero-watermark.png"
          alt=""
          aria-hidden="true"
          className="absolute z-0 opacity-[0.06] pointer-events-none hidden xl:block left-1/2 -translate-x-1/2 top-1/3 -translate-y-1/2 w-[450px] rotate-1"
        />
        {/* Mobile watermark — single centered */}
        <img
          src="/hero-watermark.png"
          alt=""
          aria-hidden="true"
          className="absolute z-0 opacity-[0.10] pointer-events-none xl:hidden left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-[250px] rotate-2"
        />

        {/* Floating blobs */}
        <div className="blob blob-1 -top-20 -left-40" />
        <div className="blob blob-2 top-20 -right-32" />
        <div className="blob blob-3 -bottom-20 left-1/3" />

        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            {/* Left — Text content */}
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="secondary" className="mb-6 gap-1.5 bg-white/60 backdrop-blur-sm border-white/50 text-primary-700 shadow-sm">
                <Zap className="h-3.5 w-3.5" />
                Analyse IA en 5 minutes
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-[3.4rem] font-extrabold leading-tight mb-4 tracking-tight">
                <span className="text-secondary-900">Votre pré-état daté</span>
                <br />
                <span className="text-gradient">en quelques clics</span>
              </h1>

              <div className="text-base md:text-lg text-secondary-600 leading-relaxed space-y-2 mb-3">
                <p>
                  Générez votre <strong className="font-semibold text-secondary-800">pré-état daté</strong> et votre Pack Vendeur en autonomie en <strong className="font-semibold text-secondary-800">5 min</strong>.
                </p>
                <p>
                  Stop aux syndics et leurs frais exorbitants, économisez{' '}
                  <Link to="/guide/charges-copropriete-evolution-syndic" className="font-bold text-primary-700 underline underline-offset-2 hover:text-primary-800 transition-colors">
                    300 € en moyenne
                  </Link>{' '}!
                </p>
              </div>
              <p className="text-sm text-secondary-400 mb-8">
                Conforme au modèle du Conseil Supérieur du Notariat.
              </p>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-4 mb-8">
                <Button
                  size="lg"
                  onClick={() => navigate('/dossier')}
                  onMouseEnter={prefetchDossier}
                  className="gap-2 text-base px-8 rounded-full btn-glow hover:scale-105 transition-all duration-300"
                >
                  Reprenez le contrôle
                  <ArrowRight className="h-5 w-5" />
                </Button>
                <span className="text-sm text-secondary-500 sm:self-center">
                  <span className="font-semibold text-secondary-900">24,99 €</span> | Paiement unique
                </span>
              </div>

              <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-x-6 gap-y-2 text-sm text-secondary-500">
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Conforme loi ALUR
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Modèle CSN
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  RGPD : données supprimées sous 7 jours
                </span>
              </div>
            </div>

            {/* Right — PDF mockup */}
            <div className="flex-shrink-0 w-full max-w-sm lg:max-w-[380px] hidden md:block">
              <div className="relative">
                {/* Shadow / glow behind */}
                <div className="absolute -inset-4 bg-primary-400/20 blur-3xl rounded-full" />

                {/* Main PDF card */}
                <div className="relative bg-white rounded-2xl shadow-2xl border border-white/60 overflow-hidden transform lg:rotate-1 hover:rotate-0 transition-transform duration-500">
                  {/* PDF header bar */}
                  <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-1 py-0.5">
                    <div className="flex items-center gap-3">
                      <img src="/logo.png" alt="" className="h-20 w-auto object-contain brightness-0 invert opacity-90" />
                      <div>
                        <p className="text-white font-bold text-sm">Pré-état daté</p>
                        <p className="text-white/70 text-xs">Conforme modèle CSN</p>
                      </div>
                    </div>
                  </div>

                  {/* PDF body */}
                  <div className="px-5 py-4 space-y-3">
                    {/* Section: Identification */}
                    <div>
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-1.5">Identification du lot</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">Lot n°</span>
                          <span className="text-xs font-semibold text-secondary-700">42</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">Tantièmes</span>
                          <span className="text-xs font-semibold text-secondary-700">156 / 10 000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">Surface</span>
                          <span className="text-xs font-semibold text-secondary-700">68,5 m²</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-secondary-200" />

                    {/* Section: Financier */}
                    <div>
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-1.5">Situation financière</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">Budget prévisionnel</span>
                          <span className="text-xs font-semibold text-secondary-700">85 200 €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">Charges courantes</span>
                          <span className="text-xs font-semibold text-secondary-700">1 328 €/an</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">Fonds travaux</span>
                          <span className="text-xs font-semibold text-secondary-700">842 €</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">Impayés vendeur</span>
                          <span className="text-xs font-semibold text-green-600">0 €</span>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-dashed border-secondary-200" />

                    {/* Section: Juridique */}
                    <div>
                      <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-1.5">Vie de la copropriété</p>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">Procédures en cours</span>
                          <span className="text-xs font-semibold text-green-600">Aucune</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-secondary-400">DPE</span>
                          <span className="text-xs font-bold text-green-600 bg-green-50 px-1.5 rounded">C</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PDF footer */}
                  <div className="bg-secondary-50 px-5 py-2.5 border-t border-secondary-100">
                    <p className="text-[9px] text-secondary-400 text-center">
                      Généré par pre-etat-date.ai
                    </p>
                  </div>
                </div>

                {/* Stacked pages behind */}
                <div className="absolute -bottom-2 left-3 right-3 h-3 bg-white/60 rounded-b-xl shadow-lg border border-white/40 -z-10" />
                <div className="absolute -bottom-4 left-6 right-6 h-3 bg-white/30 rounded-b-xl shadow-md border border-white/30 -z-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 2: Trust bar — scrolling carousel                          */}
      {/* ----------------------------------------------------------------- */}
      <section className="bg-white/50 backdrop-blur-sm border-y border-white/60 py-5">
        <div className="trust-scroll-container">
          <div className="trust-scroll-track flex animate-scroll-left w-max gap-12 px-6">
            {[...TRUST_ITEMS, ...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-2.5 text-secondary-600 whitespace-nowrap">
                  <div className="w-8 h-8 rounded-lg bg-white/80 shadow-sm backdrop-blur-sm border border-white/60 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 2b: Syndic hook — Provocative banner                       */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-10 md:py-14 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <GlassCard hover={false} className="p-6 md:p-8 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border-amber-200/50">
            <p className="text-lg md:text-xl font-bold text-secondary-900 mb-2">
              Votre syndic vous facture 380 € pour un document que vous pouvez faire vous-même ?
            </p>
            <p className="text-sm md:text-base text-secondary-500 mb-5">
              Le pré-état daté n'est pas un acte réservé au syndic. La loi vous autorise à le produire vous-même.
              <br className="hidden md:block" />
              Reprenez le contrôle de votre vente — en 5 minutes, pour 24,99 €.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                size="sm"
                onClick={() => navigate('/dossier')}
                className="gap-1.5 rounded-full btn-glow"
              >
                Arrêter de surpayer
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Link
                to="/guide/charges-copropriete-evolution-syndic"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Lire notre enquête chiffrée
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 3: Process steps — Glass cards                             */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="blob blob-2 -top-40 left-1/4 opacity-30" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-secondary-900 mb-16">
            Comment ça marche ?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <GlassCard key={step.num} className={`p-6 bg-gradient-to-br ${step.gradient} ${step.border}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl ${step.iconBg} backdrop-blur-sm flex items-center justify-center`}>
                      <Icon className={`h-5 w-5 ${step.iconColor}`} />
                    </div>
                    <span className="text-xs font-medium text-secondary-400">{step.time}</span>
                  </div>
                  <div className="text-xs font-bold text-secondary-300 mb-1">Étape {step.num}</div>
                  <h3 className="font-semibold text-secondary-900 mb-1.5">{step.title}</h3>
                  <p className="text-sm text-secondary-500">{step.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 4: Pricing — Glass cards on gradient mesh                  */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 md:py-28 mesh-gradient-alt relative overflow-hidden">
        <div className="blob blob-1 -bottom-32 -right-20 opacity-25" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-secondary-900 mb-16">
            Un prix unique, transparent
          </h2>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {/* Our price */}
            <GlassCard className="p-6 border-primary-200/50 shadow-glow-blue">
              <Badge className="mb-4 bg-primary-500/10 text-primary-700 border-primary-200/50 backdrop-blur-sm">Pack Vendeur</Badge>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gradient">24,99 €</span>
                <span className="text-sm text-secondary-500 ml-2">TTC - Paiement unique</span>
              </div>
              <ul className="space-y-3">
                {INCLUSIONS.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-secondary-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button className="w-full mt-6 gap-2 rounded-full btn-glow" onClick={() => navigate('/dossier')}>
                Commencer maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
            </GlassCard>

            {/* Syndic comparison */}
            <GlassCard className="p-6 bg-white/40" hover={false}>
              <Badge variant="outline" className="mb-4 text-secondary-500">Chez le syndic</Badge>
              <div className="mb-6">
                <span className="text-4xl font-bold text-secondary-300 line-through">150 à 600 €</span>
              </div>
              <ul className="space-y-3 text-sm text-secondary-500">
                <li className="flex items-start gap-2">
                  <span className="text-secondary-300 mt-0.5 flex-shrink-0">--</span>
                  Délai : 1 à 4 semaines
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-300 mt-0.5 flex-shrink-0">--</span>
                  Tarif variable selon le syndic
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary-300 mt-0.5 flex-shrink-0">--</span>
                  Aucune visibilité sur le contenu
                </li>
              </ul>
              <Button variant="outline" className="w-full mt-6 gap-2 rounded-full" onClick={() => navigate('/dossier')}>
                Économisez maintenant
                <ArrowRight className="h-4 w-4" />
              </Button>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 5: Savings calculator                                      */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="blob blob-3 top-10 -right-32 opacity-20" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-secondary-900 mb-16">
            Calculez vos économies
          </h2>

          <GlassCard className="max-w-xl mx-auto p-6">
            <label
              htmlFor="syndic-slider"
              className="block text-sm font-medium text-secondary-700 mb-4"
            >
              Combien facture votre syndic pour le pré-état daté ?
            </label>

            <div className="flex items-center justify-between text-xs text-secondary-400 mb-2">
              <span>50 €</span>
              <span className="text-lg font-bold text-secondary-900">{syndicPrice} €</span>
              <span>800 €</span>
            </div>

            <input
              id="syndic-slider"
              type="range"
              min={50}
              max={800}
              step={10}
              value={syndicPrice}
              onChange={(e) => setSyndicPrice(Number(e.target.value))}
              className="w-full h-2 bg-secondary-200/50 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />

            <div className="mt-6 text-center p-6 bg-green-500/10 backdrop-blur-sm rounded-2xl border border-green-200/50">
              <div className="text-3xl font-bold text-green-700">
                {savings.toFixed(2)} €
              </div>
              <div className="text-sm text-green-600 mt-1">
                d'économies ({savingsPercent}% de réduction)
              </div>
            </div>
          </GlassCard>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 6: FAQ — Glass accordion                                   */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 md:py-28 mesh-gradient-alt relative overflow-hidden">
        <div className="blob blob-1 -bottom-40 left-1/4 opacity-20" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-secondary-900 mb-16">
            Questions fréquentes
          </h2>

          <div className="max-w-2xl mx-auto space-y-3">
            {FAQ_ITEMS.map((item, index) => (
              <Collapsible.Root
                key={index}
                open={openFaq === index}
                onOpenChange={(isOpen) => setOpenFaq(isOpen ? index : null)}
              >
                <GlassCard hover={false} className={openFaq === index ? 'bg-white/70' : ''}>
                  <Collapsible.Trigger asChild>
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-4 text-left text-sm font-medium text-secondary-900 hover:text-primary-700 transition-colors"
                    >
                      {item.q}
                      <ChevronDown
                        className={`h-4 w-4 text-secondary-400 flex-shrink-0 ml-4 transition-transform duration-200 ${
                          openFaq === index ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </Collapsible.Trigger>
                  <Collapsible.Content>
                    <div className="px-4 pb-4 text-sm text-secondary-500 leading-relaxed">
                      {item.a}
                    </div>
                  </Collapsible.Content>
                </GlassCard>
              </Collapsible.Root>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild className="rounded-full bg-white/50 backdrop-blur-sm border-white/60 hover:bg-white/70">
              <Link to="/faq">Voir toutes les questions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 6b: Villes — SEO national                                  */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary-600" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-center text-secondary-900">
              Disponible partout en France
            </h2>
          </div>
          <p className="text-secondary-500 text-center max-w-xl mx-auto mb-10">
            Générez votre pré-état daté en ligne, quelle que soit votre ville ou votre syndic.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
            {CITIES.slice(0, 20).map((city) => (
              <Link
                key={city.slug}
                to={`/pre-etat-date/${city.slug}`}
                className="bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl px-4 py-3 text-center text-sm font-medium text-secondary-700 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50/30 transition-all duration-200 shadow-sm"
              >
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 7: Testimonials — Glass cards                              */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="blob blob-2 top-20 -left-20 opacity-25" />
        <div className="blob blob-3 -bottom-20 right-10 opacity-20" />
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center text-secondary-900 mb-16">
            Ils nous font confiance
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <GlassCard key={t.name} className="p-6">
                <div className="flex items-center gap-0.5 mb-3 text-amber-400">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-secondary-600 leading-relaxed mb-4">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-violet-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-secondary-900">{t.name}</span>
                    <span className="text-secondary-400 ml-1">- {t.city}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- */}
      {/* Section 8: Final CTA — Glass on gradient                           */}
      {/* ----------------------------------------------------------------- */}
      <section className="py-20 md:py-28 mesh-gradient-cta relative overflow-hidden">
        <div className="blob blob-1 -top-20 -right-20 opacity-20" />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
            Prêt à générer votre pré-état daté ?
          </h2>
          <p className="text-primary-100/80 mb-10">
            Particuliers et professionnels de l'immobilier
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/dossier')}
              className="gap-2 text-base px-8 rounded-full bg-white text-primary-700 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Commencer maintenant
              <ArrowRight className="h-5 w-5" />
            </Button>
            <Button
              size="lg"
              asChild
              className="gap-2 text-base px-8 rounded-full bg-white text-primary-700 hover:bg-white/90 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Link to="/comment-ca-marche">Voir le guide complet</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
