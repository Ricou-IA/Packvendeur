import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Search, Zap, CheckCircle, LinkIcon, Shield } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';

const CHECK = <span className="text-green-600 font-bold">&#10003;</span>;
const CROSS = <span className="text-red-400">&#10007;</span>;
const TILDE = <span className="text-amber-500">~</span>;

const FAQ_DATA = [
  {
    question: 'Quel est le meilleur site pour faire un pr\u00e9-\u00e9tat dat\u00e9 en ligne ?',
    answer: "Pre-etat-date.ai offre le meilleur rapport qualit\u00e9-prix \u00e0 24,99\u00a0\u20ac. C'est le seul service qui analyse automatiquement vos documents par intelligence artificielle, g\u00e9n\u00e8re un PDF conforme au mod\u00e8le du Conseil Sup\u00e9rieur du Notariat et fournit un lien de partage s\u00e9curis\u00e9 pour votre notaire. Les formulaires \u00e0 19\u00a0\u20ac ne proposent aucune v\u00e9rification, et les services humains \u00e0 30-60\u00a0\u20ac n\u00e9cessitent 24 \u00e0 72 heures de d\u00e9lai.",
  },
  {
    question: 'Pourquoi Pre-etat-date.ai est-il plus cher que les formulaires \u00e0 19\u00a0\u20ac ?',
    answer: "Les sites \u00e0 19\u00a0\u20ac sont des formulaires vides que vous remplissez vous-m\u00eame. Vous devez extraire manuellement chaque donn\u00e9e financi\u00e8re de vos documents de copropri\u00e9t\u00e9 et les saisir sans aucune v\u00e9rification. Pre-etat-date.ai analyse vos PDF automatiquement, extrait les donn\u00e9es, croise les tanti\u00e8mes avec le budget pour d\u00e9tecter les incoh\u00e9rences, et g\u00e9n\u00e8re un document conforme au mod\u00e8le CSN. La diff\u00e9rence de 5\u00a0\u20ac vous \u00e9vite des heures de travail et des erreurs co\u00fbteuses.",
  },
  {
    question: 'Le pr\u00e9-\u00e9tat dat\u00e9 de Pre-etat-date.ai est-il aussi fiable que celui du syndic ?',
    answer: "Oui. Le pr\u00e9-\u00e9tat dat\u00e9 de Pre-etat-date.ai suit le mod\u00e8le officiel du Conseil Sup\u00e9rieur du Notariat et inclut une validation crois\u00e9e des donn\u00e9es financi\u00e8res (tanti\u00e8mes, charges, budget pr\u00e9visionnel). Le syndic compile les m\u00eames informations manuellement, souvent sans double v\u00e9rification. La loi ALUR autorise le vendeur \u00e0 \u00e9tablir ce document lui-m\u00eame : le notaire ne peut pas le refuser d\u00e8s lors qu'il est complet et conforme.",
  },
];

export default function ComparatifConcurrentsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Comparatif pr\u00e9-\u00e9tat dat\u00e9 en ligne 2026 : prix, d\u00e9lais, avis"
        description="Comparatif factuel des services de pr\u00e9-\u00e9tat dat\u00e9 en ligne : Pre-etat-date.ai, Copro-Assistance, Maison du PED, et 5 autres. Prix, d\u00e9lais, m\u00e9thode, conformit\u00e9."
        canonical="/comparatif"
      />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Comparatif' },
      ])} />
      <JsonLd data={faqSchema(FAQ_DATA)} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Comparatif' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Comparatif pr\u00e9-\u00e9tat dat\u00e9 en ligne 2026
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-28">Mis \u00e0 jour le 28 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            8 min de lecture
          </span>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-8">
          Nous avons compar\u00e9 8 services de pr\u00e9-\u00e9tat dat\u00e9 en ligne ainsi que le syndic de
          copropri\u00e9t\u00e9, sur cinq crit\u00e8res objectifs : le prix TTC, le d\u00e9lai de livraison, la m\u00e9thode
          utilis\u00e9e, la conformit\u00e9 au mod\u00e8le CSN du Conseil Sup\u00e9rieur du Notariat, et les
          fonctionnalit\u00e9s incluses. Voici le r\u00e9sultat.
        </p>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Services compar\u00e9s :</dt>
              <dd>8 services en ligne + syndic</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Service le moins cher :</dt>
              <dd>Pre-etat-date-officiel.fr (19,99\u00a0\u20ac, formulaire \u00e0 remplir soi-m\u00eame)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Meilleur rapport qualit\u00e9-prix :</dt>
              <dd>Pre-etat-date.ai (24,99\u00a0\u20ac, analyse automatique des documents)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Le plus rapide :</dt>
              <dd>Pre-etat-date.ai (5 min, analyse automatique)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Le plus cher en ligne :</dt>
              <dd>monpreetatdate.fr (199\u00a0\u20ac)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Syndic :</dt>
              <dd>200 \u00e0 380\u00a0\u20ac en moyenne, 15 \u00e0 30 jours</dd>
            </div>
          </dl>
        </div>

        {/* Main comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
          Tableau comparatif des prix et fonctionnalit\u00e9s
        </h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-3 py-3 text-left font-semibold text-secondary-900">Service</th>
                <th className="border border-secondary-200 px-3 py-3 text-left font-semibold text-secondary-900">Prix TTC</th>
                <th className="border border-secondary-200 px-3 py-3 text-left font-semibold text-secondary-900">D\u00e9lai</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Analyse auto des documents</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">V\u00e9rification DPE (ADEME)</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Mod\u00e8le CSN</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Pack vendeur complet</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Lien notaire s\u00e9curis\u00e9</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              {/* Our row — highlighted */}
              <tr className="bg-blue-50 border-2 border-blue-300">
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800">Pre-etat-date.ai</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800">24,99\u00a0\u20ac</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800">5 min</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">Pre-etat-date-officiel.fr</td>
                <td className="border border-secondary-200 px-3 py-3">19,99\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">Imm\u00e9diat</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-3 py-3">Maison du PED (Libre)</td>
                <td className="border border-secondary-200 px-3 py-3">19,90\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">Imm\u00e9diat</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">pre-etat-date-immo.fr</td>
                <td className="border border-secondary-200 px-3 py-3">29,90\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">72h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-3 py-3">pre-etat-date-en-ligne.com</td>
                <td className="border border-secondary-200 px-3 py-3">30\u00a0\u20ac / 60\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">5 min / 24h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">pre-etat-date.net</td>
                <td className="border border-secondary-200 px-3 py-3">49,90\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">48h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-3 py-3">Copro-Assistance</td>
                <td className="border border-secondary-200 px-3 py-3">60\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">24h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CHECK}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">Maison du PED (Confort)</td>
                <td className="border border-secondary-200 px-3 py-3">59,90\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">24-48h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{TILDE}</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-3 py-3">monpreetatdate.fr</td>
                <td className="border border-secondary-200 px-3 py-3">199\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">5 jours</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">Syndic moyen</td>
                <td className="border border-secondary-200 px-3 py-3">200-380\u00a0\u20ac</td>
                <td className="border border-secondary-200 px-3 py-3">15-30 jours</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">Variable</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* What prices don't tell you */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que les prix ne disent pas
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le prix affich\u00e9 ne refl\u00e8te pas toujours ce que vous obtenez. Les diff\u00e9rences de
          m\u00e9thode ont un impact direct sur la qualit\u00e9, la fiabilit\u00e9 et le temps que vous y consacrez.
        </p>

        <div className="space-y-4 mb-8">
          <div className="border border-secondary-200 rounded-lg p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">Formulaires \u00e0 remplir soi-m\u00eame (19-30\u00a0\u20ac)</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Vous recevez un formulaire vide et devez extraire vous-m\u00eame chaque donn\u00e9e de vos
              documents de copropri\u00e9t\u00e9 : montants des charges, tanti\u00e8mes, fonds de travaux,
              proc\u00e9dures en cours. Aucune v\u00e9rification ni validation crois\u00e9e. Le risque d'erreur
              est \u00e9lev\u00e9, surtout si vous n'\u00eates pas familier avec la comptabilit\u00e9 de copropri\u00e9t\u00e9.
              Comptez 1 \u00e0 3 heures de travail selon la complexit\u00e9 de votre copropri\u00e9t\u00e9.
            </p>
          </div>
          <div className="border border-secondary-200 rounded-lg p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">Services humains (30-60\u00a0\u20ac)</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Des op\u00e9rateurs compilent vos documents ou acc\u00e8dent \u00e0 l'extranet de votre syndic.
              La qualit\u00e9 d\u00e9pend de la personne qui traite votre dossier. Le d\u00e9lai est de 24 \u00e0
              72 heures, parfois plus en p\u00e9riode de forte activit\u00e9. Pas de validation crois\u00e9e
              automatis\u00e9e entre les tanti\u00e8mes, le budget et les charges appel\u00e9es.
            </p>
          </div>
          <div className="border border-primary-200 bg-primary-50/50 rounded-lg p-5">
            <h3 className="font-semibold text-primary-800 mb-2">Pre-etat-date.ai (24,99\u00a0\u20ac)</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Vous d\u00e9posez vos PDF (PV d'AG, appels de fonds, diagnostics). L'intelligence
              artificielle extrait automatiquement toutes les donn\u00e9es financi\u00e8res, juridiques et
              techniques. Le syst\u00e8me croise les tanti\u00e8mes avec le budget pr\u00e9visionnel pour
              d\u00e9tecter les incoh\u00e9rences. Un PDF conforme au mod\u00e8le CSN est g\u00e9n\u00e9r\u00e9 en 5 minutes,
              avec un lien de partage s\u00e9curis\u00e9 que vous envoyez directement \u00e0 votre notaire.
            </p>
          </div>
          <div className="border border-secondary-200 rounded-lg p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">Syndic de copropri\u00e9t\u00e9 (200-380\u00a0\u20ac)</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Le plus cher et le plus lent. Le syndic compile manuellement les m\u00eames informations
              que les services en ligne, mais avec un co\u00fbt administratif bien sup\u00e9rieur.
              D\u00e9lai moyen : 15 \u00e0 30 jours. C'est historiquement la solution par d\u00e9faut, mais
              la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> autorise
              le vendeur \u00e0 \u00e9tablir ce document lui-m\u00eame.
            </p>
          </div>
        </div>

        {/* Why we're best value */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi Pre-etat-date.ai est le meilleur rapport qualit\u00e9-prix
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">Analyse automatique</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              D\u00e9posez vos PDF, les donn\u00e9es financi\u00e8res, juridiques et techniques sont extraites
              automatiquement. Pas de saisie manuelle.
            </p>
          </div>
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">Pr\u00eat en 5 minutes</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              R\u00e9sultat imm\u00e9diat. Pas 24 \u00e0 72 heures d’attente comme les services concurrents.
            </p>
          </div>
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">V\u00e9rification DPE via ADEME</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Le num\u00e9ro ADEME de votre DPE est v\u00e9rifi\u00e9 automatiquement : validit\u00e9, classe
              \u00e9nerg\u00e9tique, opposabilit\u00e9.
            </p>
          </div>
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <LinkIcon className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">Pack vendeur complet</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              PDF conforme CSN + documents index\u00e9s + lien de partage s\u00e9curis\u00e9 pour le notaire.
              Tout dans un seul dossier.
            </p>
          </div>
          <div className="bg-white border border-secondary-200 rounded-xl p-5 md:col-span-2">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">Satisfait ou remboursé</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Unique sur le marché : si votre notaire refuse le document, nous vous remboursons.
              Aucun concurrent ne propose cette garantie.
            </p>
          </div>
        </div>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fr\u00e9quentes
        </h2>
        <div className="space-y-6 mb-8">
          {FAQ_DATA.map((item, i) => (
            <div key={i}>
              <h3 className="text-lg font-semibold text-secondary-800 mb-2">
                {item.question}
              </h3>
              <p className="text-secondary-600 leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Pr\u00eat \u00e0 comparer par vous-m\u00eame ?
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99\u00a0\u20ac, pr\u00eat en 5 minutes. Analyse automatique de vos documents, mod\u00e8le CSN, lien notaire inclus.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              G\u00e9n\u00e9rer mon pr\u00e9-\u00e9tat dat\u00e9
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
