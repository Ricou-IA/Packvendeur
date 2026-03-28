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
        title="Pre-etat date urgent : obtenez-le en 5 minutes"
        description="Besoin d'un pre-etat date en urgence ? Comparez les delais : syndic (15-30 jours), services en ligne (24-72h), IA (5 minutes). Solution immediate a 24,99 EUR."
        canonical="/guide/pre-etat-date-urgent"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pre-etat date urgent : obtenez-le en 5 minutes",
        description: "Comment obtenir un pre-etat date en urgence quand le compromis est imminent. Comparatif des delais et solutions rapides.",
        slug: 'pre-etat-date-urgent',
        datePublished: '2026-03-28',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pre-etat date urgent' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Peut-on obtenir un pre-etat date en urgence le jour meme ?',
          answer: "Oui, avec un service base sur l'intelligence artificielle comme Pre-etat-date.ai, le pre-etat date est genere en 5 a 10 minutes apres le depot des documents. Le vendeur peut ainsi obtenir son document le jour meme, sans attendre le syndic. Le document est conforme au modele du Conseil Superieur du Notariat et accepte par les notaires.",
        },
        {
          question: 'Quel est le delai du syndic pour fournir le pre-etat date ?',
          answer: "Le syndic met generalement 15 a 30 jours pour fournir le pre-etat date. Ce delai s'explique par le traitement administratif, la compilation manuelle des donnees financieres et le volume de demandes. Certains syndics facturent un supplement pour un traitement en urgence (7 jours), sans garantie de resultat.",
        },
        {
          question: 'Le notaire peut-il refuser un pre-etat date fait en ligne ?',
          answer: "Non. Le Conseil Superieur du Notariat a confirme que le vendeur peut etablir le pre-etat date lui-meme, sans passer par le syndic. Un document genere en ligne est accepte par les notaires a condition qu'il soit conforme au modele CSN et contienne toutes les informations requises par l'article L.721-2 du CCH. Pre-etat-date.ai utilise ce modele officiel.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pre-etat date urgent' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pre-etat date urgent : obtenez-le en 5 minutes
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-28">Mis a jour le 28 mars 2026</time>
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
              <dt className="font-semibold min-w-[160px]">Delai syndic :</dt>
              <dd>15 a 30 jours (parfois plus en periode estivale)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Delai service en ligne :</dt>
              <dd>24 a 72 heures (traitement humain)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Delai IA :</dt>
              <dd>5 a 10 minutes sur Pre-etat-date.ai</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Prix :</dt>
              <dd>24,99 EUR TTC (vs 150-600 EUR chez le syndic)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Conformite :</dt>
              <dd>Modele CSN (Conseil Superieur du Notariat), accepte par les notaires</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Disponibilite :</dt>
              <dd>24h/24, 7j/7, y compris week-ends et jours feries</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Votre notaire vous relance, le compromis de vente doit etre signe dans quelques jours et
          vous n'avez toujours pas votre pre-etat date ? Vous n'etes pas seul : c'est l'une des
          situations les plus stressantes pour un vendeur en copropriete. Heureusement, il existe
          desormais des solutions pour obtenir ce document en quelques minutes.
        </p>

        {/* Urgency scenarios */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Quand a-t-on besoin d'un pre-etat date en urgence ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Plusieurs situations courantes creent une urgence autour du pre-etat date :
        </p>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Le compromis est imminent</h3>
              <p className="text-sm text-secondary-600">
                L'acquereur a fait une offre acceptee, le notaire fixe un rendez-vous de signature
                dans les prochains jours. Sans le pre-etat date, le compromis ne peut pas etre signe.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Le notaire relance le vendeur</h3>
              <p className="text-sm text-secondary-600">
                Le notaire a deja envoye une ou plusieurs relances pour obtenir le pre-etat date.
                Chaque jour de retard risque de compromettre la vente ou de refroidir l'acquereur.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Le syndic ne repond pas</h3>
              <p className="text-sm text-secondary-600">
                Vous avez fait la demande au syndic il y a plusieurs semaines, mais le document
                n'arrive toujours pas. Certains syndics sont debordees, notamment en periode de
                cloture comptable ou pendant l'ete.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">Condition suspensive qui expire</h3>
              <p className="text-sm text-secondary-600">
                Le compromis contient une condition suspensive liee a l'obtention des documents
                de copropriete. Si le delai expire sans le pre-etat date, l'acquereur peut se retirer.
              </p>
            </div>
          </div>
        </div>

        {/* Comparison of delays */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comparatif des delais : syndic vs en ligne vs IA
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Solution</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Delai</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Prix</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Disponibilite</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Syndic classique</td>
                <td className="border border-secondary-200 px-4 py-3">15 a 30 jours</td>
                <td className="border border-secondary-200 px-4 py-3">150 a 600 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Heures de bureau</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Syndic en urgence</td>
                <td className="border border-secondary-200 px-4 py-3">5 a 10 jours</td>
                <td className="border border-secondary-200 px-4 py-3">300 a 800 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Heures de bureau</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Service en ligne (humain)</td>
                <td className="border border-secondary-200 px-4 py-3">24 a 72 heures</td>
                <td className="border border-secondary-200 px-4 py-3">50 a 150 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Jours ouvres</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Pre-etat-date.ai (IA)</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 a 10 minutes</td>
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
          Le delai du syndic s'explique par plusieurs facteurs. D'abord, la demande est traitee
          manuellement par un gestionnaire qui doit compiler les informations financieres, juridiques
          et techniques a partir de differents logiciels internes. Ensuite, les grands syndics
          nationaux gerent des milliers de coproprietes et les demandes s'accumulent.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          A cela s'ajoutent les periodes de pointe : les clotures d'exercice comptable (souvent en
          decembre-janvier), la periode estivale (juillet-aout) et les mois de forte activite
          immobiliere (avril-juin, septembre-octobre) allongent considerablement les delais.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Certains syndics proposent un traitement en urgence moyennant un supplement de 100 a
          300 EUR, mais meme dans ce cas, comptez 5 a 10 jours ouvrables, sans garantie formelle
          de delai.
        </p>

        {/* How AI works */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment obtenir son pre-etat date en 5 minutes ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La solution la plus rapide est d'utiliser un service base sur l'intelligence artificielle.
          Sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          le processus se deroule en 4 etapes :
        </p>
        <ol className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-decimal mb-6">
          <li>
            <strong>Deposez vos documents</strong> : PV d'AG, appels de fonds, releves de charges,
            diagnostics. L'IA accepte les PDF tels quels.
          </li>
          <li>
            <strong>L'IA analyse automatiquement</strong> : notre intelligence artificielle extrait
            les donnees financieres, juridiques et techniques en parallele. Pas de saisie manuelle.
          </li>
          <li>
            <strong>Validez les informations</strong> : un formulaire pre-rempli vous permet de
            verifier et corriger les donnees extraites avant generation.
          </li>
          <li>
            <strong>Telechargez votre pre-etat date</strong> : le PDF conforme au modele CSN est
            genere instantanement, avec un lien de partage securise pour votre notaire.
          </li>
        </ol>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <Zap className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Disponible 24h/24, meme le dimanche</h3>
            <p className="text-sm text-secondary-600">
              Contrairement au syndic ou aux services avec traitement humain, l'IA fonctionne a
              toute heure. Vous pouvez generer votre pre-etat date un dimanche soir a 23h si
              le compromis est prevu le lundi matin.
            </p>
          </div>
        </div>

        {/* What you need */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Quels documents preparer pour aller vite ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour generer votre pre-etat date le plus rapidement possible, rassemblez en amont :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Les <strong>PV des 3 dernieres assemblees generales</strong> (votes de travaux, procedures).</li>
          <li>Les <strong>appels de fonds</strong> et <strong>releves de charges</strong> du dernier exercice.</li>
          <li>La <strong>fiche synthetique</strong> de la copropriete (disponible sur l'extranet du syndic).</li>
          <li>Les <strong>diagnostics immobiliers</strong> (DPE, amiante, electricite, etc.).</li>
          <li>Le <strong>reglement de copropriete</strong> et l'etat descriptif de division.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La plupart de ces documents sont disponibles sur l'extranet de votre syndic. Si vous ne
          les avez pas tous, l'IA travaillera avec les documents fournis et signalera les
          informations manquantes. Consultez notre guide complet
          sur les <Link to="/guide/documents-necessaires-vente" className="text-primary-600 hover:text-primary-800 font-medium">documents necessaires pour la vente</Link>.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions frequentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Peut-on obtenir un pre-etat date en urgence le jour meme ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, avec un service base sur l'IA comme Pre-etat-date.ai, le document est genere
              en 5 a 10 minutes apres le depot des documents. Vous pouvez donc l'obtenir le jour
              meme, a toute heure, y compris le week-end. Le document est conforme au modele du
              Conseil Superieur du Notariat et accepte par les notaires.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quel est le delai du syndic pour fournir le pre-etat date ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le syndic met generalement 15 a 30 jours pour fournir le pre-etat date, en raison
              du traitement administratif et du volume de demandes. Un traitement en urgence peut
              reduire ce delai a 5-10 jours, moyennant un supplement de 100 a 300 EUR.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le notaire peut-il refuser un pre-etat date fait en ligne ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Le CSN a confirme que le vendeur peut etablir le pre-etat date lui-meme. Un
              document genere en ligne est accepte des lors qu'il est conforme au modele CSN et
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
            Besoin de votre pre-etat date maintenant ?
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR, pret en 5 minutes. Disponible 24h/24, meme le dimanche.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Generer mon pre-etat date
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>
      </article>
    </div>
  );
}
