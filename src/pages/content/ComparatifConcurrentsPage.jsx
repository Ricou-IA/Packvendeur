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
    question: 'Quel est le meilleur site pour faire un pré-état daté en ligne ?',
    answer: "Pre-etat-date.ai offre le meilleur rapport qualité-prix à 24,99 €. C'est le seul service qui analyse automatiquement vos documents par intelligence artificielle, génère un PDF conforme au modèle du Conseil Supérieur du Notariat et fournit un lien de partage sécurisé pour votre notaire. Les formulaires à 19 € ne proposent aucune vérification, et les services humains à 30-60 € nécessitent 24 à 72 heures de délai.",
  },
  {
    question: 'Pourquoi Pre-etat-date.ai est-il plus cher que les formulaires à 19 € ?',
    answer: "Les sites à 19 € sont des formulaires vides que vous remplissez vous-même. Vous devez extraire manuellement chaque donnée financière de vos documents de copropriété et les saisir sans aucune vérification. Pre-etat-date.ai analyse vos PDF automatiquement, extrait les données, croise les tantièmes avec le budget pour détecter les incohérences, et génère un document conforme au modèle CSN. La différence de 5 € vous évite des heures de travail et des erreurs coûteuses.",
  },
  {
    question: 'Le pré-état daté de Pre-etat-date.ai est-il aussi fiable que celui du syndic ?',
    answer: "Oui. Le pré-état daté de Pre-etat-date.ai suit le modèle officiel du Conseil Supérieur du Notariat et inclut une validation croisée des données financières (tantièmes, charges, budget prévisionnel). Le syndic compile les mêmes informations manuellement, souvent sans double vérification. La loi ALUR autorise le vendeur à établir ce document lui-même : le notaire ne peut pas le refuser dès lors qu'il est complet et conforme.",
  },
];

export default function ComparatifConcurrentsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Comparatif pré-état daté en ligne 2026 : prix, délais, avis"
        description="Comparatif factuel des services de pré-état daté en ligne : Pre-etat-date.ai, Copro-Assistance, Maison du PED, et 5 autres. Prix, délais, méthode, conformité."
        canonical="/comparatif"
      />
      <JsonLd data={breadcrumbSchema([
        { name: 'Pré-état daté', url: '/' },
        { name: 'Comparatif' },
      ])} />
      <JsonLd data={faqSchema(FAQ_DATA)} />

      <Breadcrumb items={[
        { label: 'Pré-état daté', to: '/' },
        { label: 'Comparatif' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Comparatif pré-état daté en ligne 2026
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-28">Mis à jour le 28 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            8 min de lecture
          </span>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-8">
          Nous avons comparé 8 services de pré-état daté en ligne ainsi que le syndic de
          copropriété, sur cinq critères objectifs : le prix TTC, le délai de livraison, la méthode
          utilisée, la conformité au modèle CSN du Conseil Supérieur du Notariat, et les
          fonctionnalités incluses. Voici le résultat.
        </p>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-10">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Services comparés :</dt>
              <dd>8 services en ligne + syndic</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Service le moins cher :</dt>
              <dd>Pre-etat-date-officiel.fr (19,99 €, formulaire à remplir soi-même)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Meilleur rapport qualité-prix :</dt>
              <dd>Pre-etat-date.ai (24,99 €, analyse automatique des documents)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Le plus rapide :</dt>
              <dd>Pre-etat-date.ai (5 min, analyse automatique)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Le plus cher en ligne :</dt>
              <dd>monpreetatdate.fr (199 €)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[240px]">Syndic :</dt>
              <dd>200 à 380 € en moyenne, 15 à 30 jours</dd>
            </div>
          </dl>
        </div>

        {/* Main comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
          Tableau comparatif des prix et fonctionnalités
        </h2>
        <div className="overflow-x-auto mb-10">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-3 py-3 text-left font-semibold text-secondary-900">Service</th>
                <th className="border border-secondary-200 px-3 py-3 text-left font-semibold text-secondary-900">Prix TTC</th>
                <th className="border border-secondary-200 px-3 py-3 text-left font-semibold text-secondary-900">Délai</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Analyse auto des documents</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Vérification DPE (ADEME)</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Modèle CSN</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Pack vendeur complet</th>
                <th className="border border-secondary-200 px-3 py-3 text-center font-semibold text-secondary-900">Lien notaire sécurisé</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              {/* Our row — highlighted */}
              <tr className="bg-blue-50 border-2 border-blue-300">
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800">Pre-etat-date.ai</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800">24,99 €</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800">5 min</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
                <td className="border border-blue-200 px-3 py-3 font-bold text-blue-800 text-center">{CHECK}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">Pre-etat-date-officiel.fr</td>
                <td className="border border-secondary-200 px-3 py-3">19,99 €</td>
                <td className="border border-secondary-200 px-3 py-3">Immédiat</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-3 py-3">Maison du PED (Libre)</td>
                <td className="border border-secondary-200 px-3 py-3">19,90 €</td>
                <td className="border border-secondary-200 px-3 py-3">Immédiat</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">pre-etat-date-immo.fr</td>
                <td className="border border-secondary-200 px-3 py-3">29,90 €</td>
                <td className="border border-secondary-200 px-3 py-3">72h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-3 py-3">pre-etat-date-en-ligne.com</td>
                <td className="border border-secondary-200 px-3 py-3">30 € / 60 €</td>
                <td className="border border-secondary-200 px-3 py-3">5 min / 24h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">pre-etat-date.net</td>
                <td className="border border-secondary-200 px-3 py-3">49,90 €</td>
                <td className="border border-secondary-200 px-3 py-3">48h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-3 py-3">Copro-Assistance</td>
                <td className="border border-secondary-200 px-3 py-3">60 €</td>
                <td className="border border-secondary-200 px-3 py-3">24h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CHECK}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">Maison du PED (Confort)</td>
                <td className="border border-secondary-200 px-3 py-3">59,90 €</td>
                <td className="border border-secondary-200 px-3 py-3">24-48h</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{TILDE}</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-3 py-3">monpreetatdate.fr</td>
                <td className="border border-secondary-200 px-3 py-3">199 €</td>
                <td className="border border-secondary-200 px-3 py-3">5 jours</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
                <td className="border border-secondary-200 px-3 py-3 text-center">{CROSS}</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-3 py-3">Syndic moyen</td>
                <td className="border border-secondary-200 px-3 py-3">200-380 €</td>
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
          Le prix affiché ne reflète pas toujours ce que vous obtenez. Les différences de
          méthode ont un impact direct sur la qualité, la fiabilité et le temps que vous y consacrez.
        </p>

        <div className="space-y-4 mb-8">
          <div className="border border-secondary-200 rounded-lg p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">Formulaires à remplir soi-même (19-30 €)</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Vous recevez un formulaire vide et devez extraire vous-même chaque donnée de vos
              documents de copropriété : montants des charges, tantièmes, fonds de travaux,
              procédures en cours. Aucune vérification ni validation croisée. Le risque d'erreur
              est élevé, surtout si vous n'êtes pas familier avec la comptabilité de copropriété.
              Comptez 1 à 3 heures de travail selon la complexité de votre copropriété.
            </p>
          </div>
          <div className="border border-secondary-200 rounded-lg p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">Services humains (30-60 €)</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Des opérateurs compilent vos documents ou accèdent à l'extranet de votre syndic.
              La qualité dépend de la personne qui traite votre dossier. Le délai est de 24 à
              72 heures, parfois plus en période de forte activité. Pas de validation croisée
              automatisée entre les tantièmes, le budget et les charges appelées.
            </p>
          </div>
          <div className="border border-primary-200 bg-primary-50/50 rounded-lg p-5">
            <h3 className="font-semibold text-primary-800 mb-2">Pre-etat-date.ai (24,99 €)</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Vous déposez vos PDF (PV d'AG, appels de fonds, diagnostics). L'intelligence
              artificielle extrait automatiquement toutes les données financières, juridiques et
              techniques. Le système croise les tantièmes avec le budget prévisionnel pour
              détecter les incohérences. Un PDF conforme au modèle CSN est généré en 5 minutes,
              avec un lien de partage sécurisé que vous envoyez directement à votre notaire.
            </p>
          </div>
          <div className="border border-secondary-200 rounded-lg p-5">
            <h3 className="font-semibold text-secondary-800 mb-2">Syndic de copropriété (200-380 €)</h3>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Le plus cher et le plus lent. Le syndic compile manuellement les mêmes informations
              que les services en ligne, mais avec un coût administratif bien supérieur.
              Délai moyen : 15 à 30 jours. C'est historiquement la solution par défaut, mais
              la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> autorise
              le vendeur à établir ce document lui-même.
            </p>
          </div>
        </div>

        {/* Why we're best value */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi Pre-etat-date.ai est le meilleur rapport qualité-prix
        </h2>
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">Analyse automatique</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Déposez vos PDF, les données financières, juridiques et techniques sont extraites
              automatiquement. Pas de saisie manuelle.
            </p>
          </div>
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">Prêt en 5 minutes</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Résultat immédiat. Pas 24 à 72 heures d’attente comme les services concurrents.
            </p>
          </div>
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">Vérification DPE via ADEME</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              Le numéro ADEME de votre DPE est vérifié automatiquement : validité, classe
              énergétique, opposabilité.
            </p>
          </div>
          <div className="bg-white border border-secondary-200 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-2">
              <LinkIcon className="h-5 w-5 text-primary-600" />
              <h3 className="font-semibold text-secondary-800">Pack vendeur complet</h3>
            </div>
            <p className="text-sm text-secondary-600 leading-relaxed">
              PDF conforme CSN + documents indexés + lien de partage sécurisé pour le notaire.
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
          Questions fréquentes
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
            Prêt à comparer par vous-même ?
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 €, prêt en 5 minutes. Analyse automatique de vos documents, modèle CSN, lien notaire inclus.
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
