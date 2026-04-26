import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, {
  organizationSchema,
  websiteSchema,
  productSchema,
  faqSchema,
  howToSchema,
  softwareApplicationSchema,
} from '@components/seo/JsonLd';
import { CITIES } from '@/data/cities';
import {
  ArrowRight,
  Upload,
  Sparkles,
  ShieldCheck,
  Share2,
  Check,
  CheckCircle,
  Shield,
  Clock,
  Lock,
  Star,
  Plus,
  MapPin,
  X,
} from 'lucide-react';

// Prefetch DossierPage chunk on hover to reduce perceived load time
const prefetchDossier = () => {
  import('@pages/DossierPage');
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const TRUST_ITEMS = [
  { icon: Shield, label: 'Conforme loi ALUR & ELAN' },
  { icon: CheckCircle, label: 'Modèle CSN officiel' },
  { icon: Clock, label: 'PDF généré en 5 min' },
  { icon: Lock, label: 'RGPD · purge 7 j.' },
  { icon: Check, label: 'Satisfait ou remboursé' },
];

const PROCESS_STEPS = [
  {
    num: 1,
    icon: Upload,
    title: 'Déposez vos documents',
    desc: "Glissez-déposez vos PDF de copropriété : PV d'AG, règlement, appels de fonds.",
    time: '~ 2 min',
  },
  {
    num: 2,
    icon: Sparkles,
    title: "L'IA analyse tout",
    desc: 'Classification automatique, extraction des données financières, cross-check des tantièmes.',
    time: '~ 5 min',
  },
  {
    num: 3,
    icon: ShieldCheck,
    title: 'Validez les données',
    desc: 'Vous vérifiez, vous complétez. Vous restez le responsable juridique du document — comme il se doit.',
    time: '~ 3 min',
  },
  {
    num: 4,
    icon: Share2,
    title: 'Partagez au notaire',
    desc: 'Un lien sécurisé, un seul dossier, tous les documents indexés. Votre notaire ouvre, signe, avance.',
    time: 'Instantané',
  },
];

const COMPARE_SYNDIC = [
  'Délai : <b>1 à 4 semaines</b>',
  "Tarif opaque, variable selon l'humeur",
  'Aucune visibilité sur le contenu',
  'Vous appelez, on vous dit « je rappelle »',
  'Une correction = tout recommence',
];

const COMPARE_US = [
  'Délai : <b>5 minutes</b> chrono',
  'Prix fixe, transparent, sans surprise',
  'Toutes les données validées par vous',
  'Partage notaire en 1 clic sécurisé',
  'Satisfait ou remboursé sous 7 jours',
];

const TESTIMONIALS = [
  {
    quote:
      "Mon syndic me demandait 420 € et 3 semaines de délai. J'ai généré mon pré-état daté ici en 10 minutes, et mon notaire l'a accepté sans commentaire.",
    name: 'Marie Lefèvre',
    initial: 'M',
    context: 'Paris 15ᵉ · Vente T3, mars 2026',
  },
  {
    quote:
      "J'étais sceptique sur l'IA, mais le résultat est bluffant. Toutes les données financières étaient correctes, et la cross-validation des tantièmes m'a rassuré.",
    name: 'Thomas Durand',
    initial: 'T',
    context: 'Lyon 6ᵉ · Vente T2, février 2026',
  },
  {
    quote:
      "Le lien de partage notaire est un vrai gain de temps. Fini les emails avec 15 pièces jointes. Mon notaire a tout consulté en un clic.",
    name: 'Sophie Martin',
    initial: 'S',
    context: 'Toulouse · Vente T4, février 2026',
  },
];

const PRICING_FEATURES = [
  'Pré-état daté conforme modèle CSN',
  'Analyse IA de tous vos documents',
  'Vérification DPE via ADEME',
  'Lien de partage notaire sécurisé',
  'Questionnaire vendeur complet',
  'Garantie satisfait ou remboursé',
];

const FAQ_ITEMS = [
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
  {
    q: 'Et si mon notaire le refuse ?',
    a: "Satisfait ou remboursé intégralement sous 7 jours sur présentation d'une lettre motivante du notaire. En pratique, le document respecte strictement le modèle du Conseil Supérieur du Notariat (CSN) — tous les notaires avec qui nous avons travaillé l'ont accepté.",
  },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function HomePage() {
  const navigate = useNavigate();
  const [syndicPrice, setSyndicPrice] = useState(380);
  const [openFaq, setOpenFaq] = useState(0);

  const savings = Math.max(0, syndicPrice - 24.99);
  const savingsFmt = savings.toFixed(2).replace('.', ',');
  const savingsRounded = Math.round(savings);
  const savingsPct = syndicPrice > 0 ? Math.round((savings / syndicPrice) * 100) : 0;

  const goDossier = () => navigate('/dossier');

  return (
    <>
      <PageMeta
        title="Pré-état daté en 5 minutes · 24,99 €"
        description="Votre syndic facture 380 € pour un pré-état daté. Nous le générons en 5 minutes pour 24,99 €. Conforme modèle CSN, loi ALUR & ELAN. Satisfait ou remboursé."
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

      {/* ============= HERO ============= */}
      <section className="relative overflow-hidden mesh-gradient-hero-v2 pt-10 pb-20 md:pt-20 md:pb-28">
        <div className="blob-v2-1 -top-32 -left-24" aria-hidden="true" />
        <div className="blob-v2-2 top-10 -right-28" aria-hidden="true" />
        <div className="blob-v2-3 -bottom-12 left-1/3" aria-hidden="true" />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1.08fr_1fr] gap-12 lg:gap-16 items-center">
            {/* Left — text */}
            <div>
              <span className="inline-flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full bg-white border border-brand-blue-100 text-sm font-medium text-brand-ink-700 mb-4 md:mb-5 shadow-[0_2px_10px_rgba(11,37,69,0.08)]">
                <span className="bg-brand-yellow-warm text-brand-ink-900 font-mono text-[11px] font-semibold px-2 py-0.5 rounded-full tracking-wider">
                  Scandale
                </span>
                Votre syndic facture <b className="ml-1">380&nbsp;€</b> pour un PDF.
              </span>

              <h1 className="font-sans font-extrabold leading-[1.02] tracking-[-0.03em] text-[clamp(2.5rem,5.6vw,4.25rem)] text-balance mb-4 md:mb-5 text-brand-ink-900">
                <span className="animate-strikethrough text-brand-ink-500">380&nbsp;€</span>{' '}
                <em className="font-serif font-normal text-brand-blue-deep">24,99&nbsp;€.</em>
                <br />
                Votre pré-état daté,
                <br className="hidden sm:block" />{' '}
                sans passer par
                <br className="hidden sm:block" />{' '}
                le syndic.
              </h1>

              <p className="text-[16.5px] md:text-[19px] leading-[1.5] md:leading-[1.55] text-brand-ink-700 max-w-[540px] text-pretty mb-5 md:mb-7">
                Le pré-état daté n'est pas un acte réservé au syndic.{' '}
                <b className="text-brand-ink-900 font-semibold">
                  Déposez vos PDF, notre IA génère le document conforme modèle CSN en 5 minutes.
                </b>
              </p>

              <div className="flex flex-wrap items-center gap-3 mb-3">
                <button
                  type="button"
                  onClick={goDossier}
                  onMouseEnter={prefetchDossier}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-full bg-brand-blue-deep text-white border border-brand-blue-deep shadow-[0_4px_14px_rgba(11,37,69,0.28)] hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(11,37,69,0.36),0_0_0_4px_rgba(245,197,66,0.18)] transition-all duration-150"
                >
                  Arrêter de surpayer
                  <ArrowRight className="w-4 h-4" />
                </button>
                <span className="text-[13.5px] text-brand-ink-500 ml-1">
                  <b className="text-brand-ink-900 font-semibold">24,99 € TTC</b> · Paiement unique · Sans compte
                </span>
              </div>

              <div className="flex items-center gap-1.5 text-[13px] font-medium text-brand-blue-deep mb-7">
                <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Accepté par 100&nbsp;% des notaires · Conforme modèle CSN</span>
              </div>

              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] text-brand-ink-700 list-none p-0 m-0">
                {[
                  'Conforme loi ALUR & ELAN',
                  'Modèle CSN officiel',
                  'RGPD · données purgées sous 7 j.',
                  'Satisfait ou remboursé',
                ].map((label) => (
                  <li key={label} className="inline-flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-brand-blue-deep flex-shrink-0" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right — PDF mockup */}
            <div className="relative hidden md:block" aria-hidden="true">
              {/* Glow behind */}
              <div className="absolute -inset-5 bg-[radial-gradient(circle,rgba(43,95,168,0.25)_0%,transparent_60%)] blur-3xl -z-10" />

              {/* Top-right yellow badge */}
              <div className="absolute -top-3.5 -right-3 rotate-[5deg] bg-brand-yellow-warm text-brand-ink-900 px-3 py-2 rounded-[10px] font-semibold text-xs leading-tight shadow-[0_10px_30px_-8px_rgba(245,197,66,0.7)] z-20">
                <span className="font-serif text-[24px] leading-none block mb-0.5">-93&nbsp;%</span>
                vs. syndic
              </div>

              {/* PDF card */}
              <div className="relative bg-white rounded-[20px] shadow-[0_30px_60px_-20px_rgba(11,37,69,0.35),0_10px_30px_-10px_rgba(0,0,0,0.1)] rotate-[1.5deg] hover:rotate-0 transition-transform duration-500 overflow-hidden border border-white/80">
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-blue-deep to-brand-blue-mid px-5 py-3.5 flex items-center gap-3 text-white">
                  <div className="w-[34px] h-[34px] rounded-lg bg-white/20 grid place-items-center font-mono font-bold text-sm">
                    P
                  </div>
                  <div>
                    <div className="font-semibold text-sm leading-tight">Pré-état daté</div>
                    <div className="text-[11px] opacity-80">Conforme modèle CSN</div>
                  </div>
                  <span className="ml-auto bg-brand-yellow-warm text-brand-ink-900 font-mono text-[9.5px] font-bold px-2 py-1 rounded tracking-wider">
                    GÉNÉRÉ
                  </span>
                </div>
                {/* Body */}
                <div className="px-5 py-4 flex flex-col gap-3.5">
                  <div>
                    <div className="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-brand-blue-deep uppercase mb-2">
                      Identification du lot
                    </div>
                    {[
                      ['Lot n°', '42'],
                      ['Tantièmes', '156 / 10 000'],
                      ['Surface', '68,5 m²'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center text-[12.5px] py-0.5">
                        <span className="text-brand-ink-500">{k}</span>
                        <span className="text-brand-ink-900 font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-brand-ink-100" />
                  <div>
                    <div className="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-brand-blue-deep uppercase mb-2">
                      Situation financière
                    </div>
                    {[
                      ['Budget prévisionnel', '85 200 €'],
                      ['Charges courantes', '1 328 €/an'],
                      ['Fonds travaux', '842 €'],
                      ['Impayés vendeur', '0 €'],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center text-[12.5px] py-0.5">
                        <span className="text-brand-ink-500">{k}</span>
                        <span className="text-brand-ink-900 font-semibold">{v}</span>
                      </div>
                    ))}
                  </div>
                  <div className="h-px bg-brand-ink-100" />
                  <div>
                    <div className="font-mono text-[9.5px] font-semibold tracking-[0.12em] text-brand-blue-deep uppercase mb-2">
                      Vie de la copropriété
                    </div>
                    <div className="flex justify-between items-center text-[12.5px] py-0.5">
                      <span className="text-brand-ink-500">Procédures en cours</span>
                      <span className="text-brand-ink-900 font-semibold">Aucune</span>
                    </div>
                    <div className="flex justify-between items-center text-[12.5px] py-0.5">
                      <span className="text-brand-ink-500">DPE</span>
                      <span className="bg-brand-yellow-bg text-brand-ink-900 px-1.5 py-0.5 rounded text-[11px] border border-brand-yellow-warm font-semibold">
                        C
                      </span>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="bg-brand-paper-warm px-5 py-2 text-center font-mono text-[10px] text-brand-ink-500 border-t border-brand-ink-100">
                  Généré par pre-etat-date.ai · 5 min
                </div>
              </div>

              {/* Stacks */}
              <div className="absolute left-3.5 right-3.5 -bottom-1.5 h-3 bg-white/60 rounded-b-[16px] -z-10" />
              <div className="absolute left-7 right-7 -bottom-3 h-3 bg-white/35 rounded-b-[14px] -z-20" />

              {/* Bottom-left badge */}
              <div className="absolute -bottom-2 -left-6 -rotate-[4deg] bg-white text-brand-blue-deep border border-brand-blue-100 px-3 py-2 rounded-[10px] font-semibold text-xs shadow-[0_10px_30px_-10px_rgba(11,37,69,0.25)] z-20">
                ⏱ 5 min chrono
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= TRUST STRIP ============= */}
      <section className="border-y border-brand-ink-100 bg-white py-5 overflow-hidden" aria-label="Garanties et conformité">
        <div className="trust-scroll-container">
          <div className="flex w-max gap-12 px-6 animate-trust-scroll font-mono text-xs tracking-wider uppercase text-brand-ink-500">
            {[...TRUST_ITEMS, ...TRUST_ITEMS].map((item, i) => {
              const Icon = item.icon;
              return (
                <span key={i} className="inline-flex items-center gap-2.5 whitespace-nowrap">
                  <Icon className="w-3.5 h-3.5 text-brand-blue-mid" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============= CALCULATEUR ============= */}
      <section className="py-24 bg-brand-ink-900 text-white relative overflow-hidden" id="calculateur">
        <div
          className="absolute -top-52 -right-24 w-[500px] h-[500px] rounded-full opacity-35 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(19,49,92,1) 0%, transparent 65%)' }}
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-36 -left-12 w-[400px] h-[400px] rounded-full opacity-15 pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(245,197,66,1) 0%, transparent 65%)' }}
          aria-hidden="true"
        />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 relative z-10">
          <div className="max-w-[720px] mb-14">
            <span className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-brand-yellow-soft inline-flex items-center gap-2.5 mb-3.5 before:content-[''] before:w-6 before:h-px before:bg-brand-yellow-soft">
              01 · Le scandale du syndic
            </span>
            <h2 className="text-[clamp(2.125rem,4vw,3rem)] leading-[1.05] tracking-[-0.028em] font-bold text-balance text-white mb-3.5">
              Combien votre syndic <em className="font-serif font-normal text-brand-blue-light">vous arnaque</em>&nbsp;?
            </h2>
            <p className="text-[17px] text-white/70 leading-[1.55] max-w-xl text-pretty m-0">
              Bougez le curseur. Le tarif moyen constaté est de 380 €. Certains cabinets montent à 600 €. Pour un PDF produit en moins d'une heure par un assistant administratif.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
            {/* Calc box */}
            <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-9 backdrop-blur">
              <div className="font-mono text-[11.5px] tracking-[0.12em] uppercase text-brand-yellow-soft mb-3">
                Prix demandé par votre syndic
              </div>
              <label htmlFor="syndic-slider" className="block text-[18px] font-medium mb-7 text-white">
                Combien vous facture-t-il pour le pré-état daté&nbsp;?
              </label>

              <div className="flex justify-between items-baseline mb-2.5 font-mono text-[11px] text-white/50">
                <span>50 €</span>
                <span className="font-serif text-[42px] text-brand-yellow-soft leading-none not-italic">
                  {syndicPrice} €
                </span>
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
                className="slider-v2"
                aria-label="Prix facturé par votre syndic"
              />

              <div className="mt-7 pt-7 border-t border-dashed border-white/15 grid grid-cols-[1fr_auto] gap-5 items-end">
                <div>
                  <div className="font-serif text-[60px] md:text-[72px] leading-none tracking-[-0.02em] text-brand-yellow-warm not-italic">
                    {savingsFmt}
                    <span className="text-[32px] md:text-[38px] ml-1.5">€</span>
                  </div>
                  <div className="text-sm text-white/65 mt-1.5">d'économies en passant par pre-etat-date.ai</div>
                </div>
                <div className="font-mono text-sm px-3.5 py-2 rounded-full bg-brand-yellow-warm text-brand-ink-900 font-semibold self-start whitespace-nowrap">
                  −{savingsPct}&nbsp;%
                </div>
              </div>
            </div>

            {/* Calc copy */}
            <div>
              <span className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-brand-yellow-soft inline-flex items-center gap-2.5 mb-4 before:content-[''] before:w-6 before:h-px before:bg-brand-yellow-soft">
                Le déclic
              </span>
              <p className="text-[36px] md:text-[44px] leading-[1.05] font-extrabold tracking-[-0.025em] text-white mb-4 text-balance m-0">
                Le syndic n'est <em className="font-serif font-normal text-brand-yellow-soft">pas</em> propriétaire du PED.
              </p>
              <p className="text-white/70 text-[16.5px] leading-[1.55] max-w-md mb-6">
                C'est vous, le vendeur, qui produisez le document à partir de vos propres PV d'AG, appels de fonds et règlement. On automatise simplement l'extraction. Conforme, accepté par les notaires.
              </p>
              <button
                type="button"
                onClick={goDossier}
                onMouseEnter={prefetchDossier}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-full bg-brand-yellow-warm text-brand-ink-900 border border-brand-yellow-warm shadow-[0_4px_14px_rgba(245,197,66,0.45)] hover:-translate-y-0.5 hover:bg-brand-yellow-soft hover:shadow-[0_10px_28px_rgba(245,197,66,0.55)] transition-all duration-150"
              >
                Récupérer mes <span className="font-bold">{savingsRounded} €</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="mt-3">
                <Link
                  to="/guide/charges-copropriete-evolution-syndic"
                  className="inline-flex items-center gap-1.5 text-sm text-brand-yellow-soft/90 hover:text-brand-yellow-soft transition-colors"
                >
                  Lire notre enquête chiffrée sur les charges syndic
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= COMPARE ============= */}
      <section className="bg-brand-paper py-24" id="compare">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-[720px] mx-auto text-center mb-14">
            <span className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-brand-blue-mid inline-flex items-center gap-2.5 mb-3.5 before:content-[''] before:w-6 before:h-px before:bg-brand-blue-mid">
              02 · La comparaison
            </span>
            <h2 className="text-[clamp(2.125rem,4vw,3rem)] leading-[1.05] tracking-[-0.028em] font-bold text-balance text-brand-ink-900 mb-3.5">
              Tout ce que le syndic fait,
              <br className="hidden md:block" /> on le fait{' '}
              <em className="font-serif font-normal text-brand-blue-deep">15&nbsp;× moins cher</em>.
            </h2>
            <p className="text-[17px] text-brand-ink-700 leading-[1.55] max-w-lg mx-auto text-pretty m-0">
              Même document, même format, mêmes rubriques CSN. Seule la méthode change — et la note.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Syndic card */}
            <article className="border border-brand-ink-200 rounded-3xl p-8 bg-white relative overflow-hidden opacity-95">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase text-brand-ink-500 m-0 font-medium">
                  Chez votre syndic
                </h3>
                <span className="font-mono text-[10px] tracking-wider text-brand-ink-300 uppercase">Hier</span>
              </div>
              <div className="font-serif text-[52px] leading-tight tracking-[-0.02em] text-brand-ink-500 mb-1.5 font-normal not-italic">
                <span className="line-through decoration-brand-yellow-warm decoration-[3px]">380&nbsp;€</span>
              </div>
              <div className="text-sm text-brand-ink-500 mb-6">150 à 600 € selon le cabinet · TVA en plus</div>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {COMPARE_SYNDIC.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start text-[15px] text-brand-ink-700 leading-snug">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-ink-100 text-brand-ink-500 grid place-items-center mt-0.5">
                      <X className="w-3 h-3" strokeWidth={2.5} />
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </article>

            {/* Us card */}
            <article className="border border-brand-blue-100 rounded-3xl p-8 bg-gradient-to-b from-brand-blue-50 to-white relative overflow-hidden shadow-[0_20px_50px_-20px_rgba(11,37,69,0.25)]">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue-deep via-brand-blue-mid to-brand-yellow-warm" />
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-mono text-[11px] tracking-[0.15em] uppercase text-brand-blue-deep m-0 font-medium">
                  Avec pre-etat-date.ai
                </h3>
                <span className="font-mono text-[10px] tracking-wider uppercase text-brand-blue-deep">Maintenant</span>
              </div>
              <div className="font-serif text-[52px] leading-tight tracking-[-0.02em] text-brand-blue-deep mb-1.5 font-normal not-italic">
                24,<span className="text-[28px]">99</span>
                <span className="text-[28px] text-brand-ink-700 ml-1">€</span>
              </div>
              <div className="text-sm text-brand-ink-500 mb-6">TTC · Paiement unique · Pas d'abonnement</div>
              <ul className="list-none p-0 m-0 flex flex-col gap-3">
                {COMPARE_US.map((item, i) => (
                  <li key={i} className="flex gap-3 items-start text-[15px] text-brand-ink-700 leading-snug">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-brand-blue-deep text-white grid place-items-center mt-0.5">
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      {/* ============= PROCESS ============= */}
      <section className="bg-white border-y border-brand-ink-100 py-24" id="process">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-[720px] mb-14">
            <span className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-brand-blue-mid inline-flex items-center gap-2.5 mb-3.5 before:content-[''] before:w-6 before:h-px before:bg-brand-blue-mid">
              03 · Comment ça marche
            </span>
            <h2 className="text-[clamp(2.125rem,4vw,3rem)] leading-[1.05] tracking-[-0.028em] font-bold text-balance text-brand-ink-900 mb-3.5">
              Quatre étapes. <em className="font-serif font-normal text-brand-blue-deep">Zéro</em> appel au syndic.
            </h2>
            <p className="text-[17px] text-brand-ink-700 leading-[1.55] max-w-xl text-pretty m-0">
              Le pipeline est bordé du début à la fin : IA pour l'extraction, vous pour la validation, notaire pour la signature.
            </p>
          </div>

          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 list-none p-0 m-0">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <li
                  key={step.num}
                  className="group relative p-7 rounded-2xl border border-brand-ink-100 bg-brand-paper transition-all duration-200 hover:bg-brand-blue-50 hover:border-brand-blue-100 hover:-translate-y-0.5"
                >
                  <div className="flex justify-between items-center mb-5">
                    <div className="w-11 h-11 rounded-xl bg-brand-blue-50 text-brand-blue-deep grid place-items-center transition-colors group-hover:bg-brand-blue-deep group-hover:text-white">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[11px] tracking-wider uppercase text-brand-ink-500 px-2 py-0.5 bg-white border border-brand-ink-100 rounded-full">
                      {step.time}
                    </span>
                  </div>
                  <div className="font-mono text-[10.5px] tracking-[0.15em] uppercase text-brand-ink-500 mb-1">
                    Étape 0{step.num}
                  </div>
                  <h3 className="text-[17px] font-semibold tracking-[-0.01em] mb-1.5 text-brand-ink-900">{step.title}</h3>
                  <p className="text-sm text-brand-ink-700 leading-snug m-0">{step.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ============= TESTIMONIALS ============= */}
      <section className="bg-brand-paper-warm py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-[720px] mx-auto text-center mb-14">
            <span className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-brand-blue-mid inline-flex items-center gap-2.5 mb-3.5 before:content-[''] before:w-6 before:h-px before:bg-brand-blue-mid">
              04 · Ils ont repris le contrôle
            </span>
            <h2 className="text-[clamp(2.125rem,4vw,3rem)] leading-[1.05] tracking-[-0.028em] font-bold text-balance text-brand-ink-900 mb-3.5">
              Trois vendeurs. Trois syndics contournés.{' '}
              <em className="font-serif font-normal text-brand-blue-deep">Zéro regret.</em>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <article key={t.name} className="bg-white border border-brand-ink-100 rounded-2xl p-7 flex flex-col">
                <div className="flex gap-0.5 mb-3.5 text-brand-yellow-warm" aria-label="Note 5 sur 5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-[15.5px] leading-[1.55] text-brand-ink-900 mb-5 flex-1 text-pretty">
                  <span className="font-serif text-[48px] leading-none text-brand-blue-100 align-[-20px] mr-0.5">
                    “
                  </span>
                  {t.quote}
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-dashed border-brand-ink-200">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue-deep to-brand-blue-light text-white grid place-items-center font-semibold text-sm flex-shrink-0">
                    {t.initial}
                  </div>
                  <div>
                    <div className="font-semibold text-[14.5px] text-brand-ink-900">{t.name}</div>
                    <div className="text-[12.5px] text-brand-ink-500">{t.context}</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="text-center mt-8 text-xs text-brand-ink-500 italic">
            Témoignages illustratifs basés sur des retours d'utilisateurs.
          </p>
        </div>
      </section>

      {/* ============= PRICING ============= */}
      <section className="bg-white border-t border-brand-ink-100 py-24" id="pricing">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="max-w-[720px] mx-auto text-center mb-14">
            <span className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-brand-blue-mid inline-flex items-center justify-center gap-2.5 mb-3.5 before:content-[''] before:w-6 before:h-px before:bg-brand-blue-mid">
              05 · Tarif
            </span>
            <h2 className="text-[clamp(2.125rem,4vw,3rem)] leading-[1.05] tracking-[-0.028em] font-bold text-balance text-brand-ink-900 mb-3.5">
              Un prix. <em className="font-serif font-normal text-brand-blue-deep">Une fois.</em>
            </h2>
            <p className="text-[17px] text-brand-ink-700 leading-[1.55] max-w-lg mx-auto text-pretty m-0">
              Pas d'abonnement, pas de mauvaise surprise. Satisfait ou remboursé sous 7 jours si le document n'est pas exploitable.
            </p>
          </div>

          <div className="max-w-[560px] mx-auto bg-brand-paper border border-brand-ink-100 rounded-3xl p-10 md:p-11 shadow-[0_30px_60px_-25px_rgba(11,37,69,0.25)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue-deep via-brand-blue-mid to-brand-yellow-warm" />
            <div className="absolute top-5 -right-9 rotate-[35deg] bg-brand-yellow-warm text-brand-ink-900 font-mono text-[11px] tracking-wider uppercase px-11 py-1 font-bold shadow-sm">
              Offre de lancement
            </div>
            <h3 className="text-[20px] font-semibold m-0 mb-1 text-brand-ink-900">
              Pack Vendeur · Pré-état daté
            </h3>
            <p className="text-sm text-brand-ink-500 m-0 mb-6">Pour un lot de copropriété en France métropolitaine.</p>
            <div className="flex items-end gap-1 mb-1 flex-wrap">
              <span className="font-serif text-[78px] leading-none tracking-[-0.03em] text-brand-ink-900 font-normal not-italic">
                24
              </span>
              <span className="font-serif text-[34px] text-brand-ink-900 mb-2 not-italic">,99</span>
              <span className="font-serif text-[32px] text-brand-ink-700 mb-2 ml-0.5 not-italic">€</span>
              <span className="font-mono text-xs text-brand-ink-500 mb-4 ml-1">TTC · unique</span>
            </div>
            <div className="text-[13.5px] text-brand-ink-500 mb-7">
              Paiement CB sécurisé par Stripe. Facture envoyée automatiquement.
            </div>

            <ul className="list-none p-0 m-0 mb-7 flex flex-col gap-2.5">
              {PRICING_FEATURES.map((feat) => (
                <li key={feat} className="flex gap-3 text-[15px] text-brand-ink-700 leading-snug items-start">
                  <span className="flex-shrink-0 w-[22px] h-[22px] bg-brand-blue-deep rounded-full text-white grid place-items-center mt-0.5">
                    <Check className="w-3 h-3" strokeWidth={3} />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={goDossier}
              onMouseEnter={prefetchDossier}
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-full bg-brand-blue-deep text-white border border-brand-blue-deep shadow-[0_4px_14px_rgba(11,37,69,0.28)] hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(11,37,69,0.36),0_0_0_4px_rgba(245,197,66,0.18)] transition-all duration-150"
            >
              Commencer maintenant
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ============= FAQ ============= */}
      <section className="bg-brand-paper py-24" id="faq">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16">
            <div>
              <span className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-brand-blue-mid inline-flex items-center gap-2.5 mb-3.5 before:content-[''] before:w-6 before:h-px before:bg-brand-blue-mid">
                06 · Questions fréquentes
              </span>
              <h2 className="text-[34px] leading-[1.1] tracking-[-0.025em] font-bold mb-3.5 text-brand-ink-900">
                Ce que vous vous demandez{' '}
                <em className="font-serif font-normal text-brand-blue-deep">sans doute.</em>
              </h2>
              <p className="text-brand-ink-700 text-base">
                Une question qui n'est pas là ?{' '}
                <a
                  href="mailto:contact@pre-etat-date.ai"
                  className="text-brand-blue-deep underline underline-offset-2 hover:text-brand-blue-mid"
                >
                  contact@pre-etat-date.ai
                </a>
              </p>
              <Link
                to="/faq"
                className="inline-flex items-center gap-1.5 mt-5 text-sm font-medium text-brand-blue-deep hover:text-brand-blue-mid transition-colors"
              >
                Voir toutes les questions
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="border-t border-brand-ink-100">
              {FAQ_ITEMS.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <div key={i} className="border-b border-brand-ink-100">
                    <h3 className="m-0">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? -1 : i)}
                        className="w-full text-left bg-transparent border-none py-5 font-sans text-[16.5px] font-medium text-brand-ink-900 cursor-pointer flex justify-between items-center gap-5 hover:text-brand-blue-deep transition-colors"
                        aria-expanded={isOpen}
                        aria-controls={`faq-a-${i}`}
                      >
                        {item.q}
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full border grid place-items-center transition-all ${
                            isOpen
                              ? 'bg-brand-blue-deep text-white border-brand-blue-deep rotate-45'
                              : 'border-brand-ink-200 text-brand-ink-700'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`faq-a-${i}`}
                      role="region"
                      className={`overflow-hidden text-brand-ink-700 text-[15px] leading-relaxed transition-all duration-300 ${
                        isOpen ? 'max-h-[400px] pb-5 pr-10' : 'max-h-0'
                      }`}
                    >
                      {item.a}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ============= VILLES (SEO) ============= */}
      <section className="bg-white border-t border-brand-ink-100 py-20" aria-label="Villes desservies">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-brand-blue-deep" />
              <h2 className="text-[clamp(1.5rem,3vw,2rem)] leading-tight font-bold text-brand-ink-900 m-0">
                Disponible partout en France
              </h2>
            </div>
            <p className="text-brand-ink-500 max-w-xl mx-auto m-0">
              Votre pré-état daté prêt en 5 minutes, quelle que soit votre ville ou votre syndic.
            </p>
          </div>

          <ul className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 list-none p-0 m-0">
            {CITIES.slice(0, 20).map((city) => (
              <li key={city.slug}>
                <Link
                  to={`/pre-etat-date/${city.slug}`}
                  className="block bg-brand-paper border border-brand-ink-100 rounded-xl px-4 py-3 text-center text-sm font-medium text-brand-ink-700 hover:border-brand-blue-100 hover:bg-brand-blue-50 hover:text-brand-blue-deep transition-all duration-200"
                >
                  {city.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="text-center mt-8">
            <Link
              to="/pre-etat-date"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue-deep hover:text-brand-blue-mid transition-colors"
            >
              Voir toutes les villes et régions
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============= FINAL CTA ============= */}
      <section className="mesh-gradient-final-cta py-20" id="start">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-12 items-center text-white">
            <div>
              <span className="font-mono text-xs font-medium tracking-[0.12em] uppercase text-brand-yellow-soft inline-flex items-center gap-2.5 mb-3.5 before:content-[''] before:w-6 before:h-px before:bg-brand-yellow-soft">
                Commencer maintenant
              </span>
              <h2 className="text-[clamp(2.125rem,4vw,2.875rem)] leading-[1.08] tracking-[-0.02em] mb-3.5 text-white text-balance font-bold">
                Votre PED avant votre <em className="font-serif font-normal text-brand-yellow-soft">prochain café.</em>
              </h2>
              <p className="text-white/70 text-base leading-[1.55] mb-6 max-w-md">
                Aucune création de compte. Vous payez 24,99 €, vous uploadez, vous signez. Le syndic n'a rien à dire.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={goDossier}
                  onMouseEnter={prefetchDossier}
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-full bg-brand-yellow-warm text-brand-ink-900 border border-brand-yellow-warm shadow-[0_4px_14px_rgba(245,197,66,0.45)] hover:-translate-y-0.5 hover:bg-brand-yellow-soft hover:shadow-[0_10px_28px_rgba(245,197,66,0.55)] transition-all duration-150"
                >
                  Commencer mon dossier
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/comment-ca-marche"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 text-base font-semibold rounded-full bg-white/10 text-white border border-white/20 hover:bg-white/15 hover:-translate-y-0.5 transition-all duration-150"
                >
                  Voir le guide complet
                </Link>
              </div>
            </div>

            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-7 backdrop-blur">
              <div className="font-mono text-xs tracking-[0.15em] uppercase text-white/60 mb-4">Économies moyennes</div>
              <div className="font-serif text-[72px] md:text-[84px] leading-none tracking-[-0.03em] text-brand-yellow-soft mb-2 not-italic">
                355&nbsp;€
              </div>
              <div className="text-sm text-white/70 leading-normal">
                calculé sur la base d'un devis moyen de 380 € constaté chez les syndics français, tous cabinets confondus.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
