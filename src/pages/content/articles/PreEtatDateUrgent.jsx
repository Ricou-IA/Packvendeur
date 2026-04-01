import { Link } from 'react-router-dom';
import { ArrowRight, Clock, AlertTriangle, Zap } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDateUrgent() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pré-état daté urgent : obtenez-le en 5 minutes"
        description="Besoin d'un pré-état daté en urgence ? Comparez les délais : syndic (15-30 jours), services en ligne (24-72h), IA (5 minutes). Solution immédiate à 24,99 EUR."
        canonical="/guide/pre-etat-date-urgent"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pré-état daté urgent : obtenez-le en 5 minutes",
        description: "Comment obtenir un pré-état daté en urgence quand le compromis est imminent. Comparatif des délais et solutions rapides.",
        slug: 'pre-etat-date-urgent',
        datePublished: '2026-03-28',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pré-état daté urgent' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Peut-on obtenir un pré-état daté en urgence le jour même ?',
          answer: "Oui, avec un service basé sur l'intelligence artificielle comme Pre-etat-date.ai, le pré-état daté est généré en 5 à 10 minutes après le dépôt des documents. Le vendeur peut ainsi obtenir son document le jour même, sans attendre le syndic. Le document est conforme au modèle du Conseil Supérieur du Notariat et accepté par les notaires.",
        },
        {
          question: 'Quel est le délai du syndic pour fournir le pré-état daté ?',
          answer: "Le syndic met généralement 15 à 30 jours pour fournir le pré-état daté. Ce délai s'explique par le traitement administratif, la compilation manuelle des données financières et le volume de demandes. Certains syndics facturent un supplément pour un traitement en urgence (7 jours), sans garantie de résultat.",
        },
        {
          question: 'Le notaire peut-il refuser un pré-état daté fait en ligne ?',
          answer: "Non. Le Conseil Supérieur du Notariat a confirmé que le vendeur peut établir le pré-état daté lui-même, sans passer par le syndic. Un document généré en ligne est accepté par les notaires à condition qu'il soit conforme au modèle CSN et contienne toutes les informations requises par l'article L.721-2 du CCH. Pre-etat-date.ai utilise ce modèle officiel.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pré-état daté urgent' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pré-état daté urgent : obtenez-le en 5 minutes
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-28">Mis à jour le 28 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            6 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Délai syndic :</dt>
              <dd>15 à 30 jours (parfois plus en période estivale)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Délai service en ligne :</dt>
              <dd>24 à 72 heures (traitement humain)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Délai IA :</dt>
              <dd>5 à 10 minutes sur Pre-etat-date.ai</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Prix :</dt>
              <dd>24,99 EUR TTC (vs 150-600 EUR chez le syndic)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Conformité :</dt>
              <dd>Modèle CSN (Conseil Supérieur du Notariat), accepté par les notaires</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Disponibilité :</dt>
              <dd>24h/24, 7j/7, y compris week-ends et jours fériés</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Votre notaire vous relance, le compromis de vente doit être signé dans quelques jours et
          vous n'avez toujours pas votre pré-état daté ? Vous n'êtes pas seul : c'est l'une des
          situations les plus stressantes pour un vendeur en copropriété. Heureusement, il existe
          désormais des solutions pour obtenir ce document en quelques minutes.
        </p>

        {/* Urgency scenarios */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Quand a-t-on besoin d'un pré-état daté en urgence ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Plusieurs situations courantes créent une urgence autour du pré-état daté :
        </p>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Le compromis est imminent</h3>
              <p className="text-sm text-secondary-600">
                L'acquéreur a fait une offre acceptée, le notaire fixe un rendez-vous de signature
                dans les prochains jours. Sans le pré-état daté, le compromis ne peut pas être signé.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Le notaire relance le vendeur</h3>
              <p className="text-sm text-secondary-600">
                Le notaire a déjà envoyé une ou plusieurs relances pour obtenir le pré-état daté.
                Chaque jour de retard risque de compromettre la vente ou de refroidir l'acquéreur.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Le syndic ne répond pas</h3>
              <p className="text-sm text-secondary-600">
                Vous avez fait la demande au syndic il y a plusieurs semaines, mais le document
                n'arrive toujours pas. Certains syndics sont débordés, notamment en période de
                clôture comptable ou pendant l'été.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Condition suspensive qui expire</h3>
              <p className="text-sm text-secondary-600">
                Le compromis contient une condition suspensive liée à l'obtention des documents
                de copropriété. Si le délai expire sans le pré-état daté, l'acquéreur peut se retirer.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison of delays */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comparatif des délais : syndic vs en ligne vs IA
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Solution</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Délai</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Prix</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Disponibilité</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Syndic classique</td>
                <td className="border border-secondary-200 px-4 py-3">15 à 30 jours</td>
                <td className="border border-secondary-200 px-4 py-3">150 à 600 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Heures de bureau</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Syndic en urgence</td>
                <td className="border border-secondary-200 px-4 py-3">5 à 10 jours</td>
                <td className="border border-secondary-200 px-4 py-3">300 à 800 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Heures de bureau</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Service en ligne (humain)</td>
                <td className="border border-secondary-200 px-4 py-3">24 à 72 heures</td>
                <td className="border border-secondary-200 px-4 py-3">50 à 150 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Jours ouvrés</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pre-etat-date.ai (IA)</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 à 10 minutes</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">24,99 EUR</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">24h/24, 7j/7</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Why so slow at syndic */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le syndic met-il si longtemps ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le délai du syndic s'explique par plusieurs facteurs. D'abord, la demande est traitée
          manuellement par un gestionnaire qui doit compiler les informations financières, juridiques
          et techniques à partir de différents logiciels internes. Ensuite, les grands syndics
          nationaux gèrent des milliers de copropriétés et les demandes s'accumulent.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          À cela s'ajoutent les périodes de pointe : les clôtures d'exercice comptable (souvent en
          décembre-janvier), la période estivale (juillet-août) et les mois de forte activité
          immobilière (avril-juin, septembre-octobre) allongent considérablement les délais.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Certains syndics proposent un traitement en urgence moyennant un supplément de 100 à
          300 EUR, mais même dans ce cas, comptez 5 à 10 jours ouvrables, sans garantie formelle
          de délai.
        </p>

        {/* How AI works */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment obtenir son pré-état daté en 5 minutes ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La solution la plus rapide est d'utiliser un service basé sur l'intelligence artificielle.
          Sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          le processus se déroule en 4 étapes :
        </p>
        <ol className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-decimal mb-6">
          <li>
            <strong>Déposez vos documents</strong> : PV d'AG, appels de fonds, relevés de charges,
            diagnostics. L'IA accepte les PDF tels quels.
          </li>
          <li>
            <strong>L'IA analyse automatiquement</strong> : notre intelligence artificielle extrait
            les données financières, juridiques et techniques en parallèle. Pas de saisie manuelle.
          </li>
          <li>
            <strong>Validez les informations</strong> : un formulaire pré-rempli vous permet de
            vérifier et corriger les données extraites avant génération.
          </li>
          <li>
            <strong>Téléchargez votre pré-état daté</strong> : le PDF conforme au modèle CSN est
            généré instantanément, avec un lien de partage sécurisé pour votre notaire.
          </li>
        </ol>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <Zap className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Disponible 24h/24, même le dimanche</h3>
            <p className="text-sm text-secondary-600">
              Contrairement au syndic ou aux services avec traitement humain, l'IA fonctionne à
              toute heure. Vous pouvez générer votre pré-état daté un dimanche soir à 23h si
              le compromis est prévu le lundi matin.
            </p>
          </div>
        </div>

        {/* What you need */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Quels documents préparer pour aller vite ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour générer votre pré-état daté le plus rapidement possible, rassemblez en amont :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Les <strong>PV des 3 dernières assemblées générales</strong> (votes de travaux, procédures).</li>
          <li>Les <strong>appels de fonds</strong> et <strong>relevés de charges</strong> du dernier exercice.</li>
          <li>La <strong>fiche synthétique</strong> de la copropriété (disponible sur l'extranet du syndic).</li>
          <li>Les <strong>diagnostics immobiliers</strong> (DPE, amiante, électricité, etc.).</li>
          <li>Le <strong>règlement de copropriété</strong> et l'état descriptif de division.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La plupart de ces documents sont disponibles sur l'extranet de votre syndic. Si vous ne
          les avez pas tous, l'IA travaillera avec les documents fournis et signalera les
          informations manquantes. Consultez notre guide complet
          sur les <Link to="/guide/documents-necessaires-vente" className="text-primary-600 hover:text-primary-800 font-medium">documents nécessaires pour la vente</Link>.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Peut-on obtenir un pré-état daté en urgence le jour même ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, avec un service basé sur l'IA comme Pre-etat-date.ai, le document est généré
              en 5 à 10 minutes après le dépôt des documents. Vous pouvez donc l'obtenir le jour
              même, à toute heure, y compris le week-end. Le document est conforme au modèle du
              Conseil Supérieur du Notariat et accepté par les notaires.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quel est le délai du syndic pour fournir le pré-état daté ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le syndic met généralement 15 à 30 jours pour fournir le pré-état daté, en raison
              du traitement administratif et du volume de demandes. Un traitement en urgence peut
              réduire ce délai à 5-10 jours, moyennant un supplément de 100 à 300 EUR.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le notaire peut-il refuser un pré-état daté fait en ligne ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Le CSN a confirmé que le vendeur peut établir le pré-état daté lui-même. Un
              document généré en ligne est accepté dès lors qu'il est conforme au modèle CSN et
              contient toutes les informations requises par
              la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> (article
              L.721-2 du CCH). Pour en savoir plus, consultez notre <Link to="/faq" className="text-primary-600 hover:text-primary-800 font-medium">FAQ</Link>.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-urgent" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Besoin de votre pré-état daté maintenant ?
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR, prêt en 5 minutes. Disponible 24h/24, même le dimanche.
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
