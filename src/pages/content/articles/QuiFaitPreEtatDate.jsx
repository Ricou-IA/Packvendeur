import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, X, Scale } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function QuiFaitPreEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Qui fait le pre-etat date ? Vendeur, syndic ou IA"
        description="Le vendeur peut faire le pre-etat date lui-meme (confirme par le CSN). Comparez les 3 options : syndic (150-600 EUR), DIY (gratuit), IA (24,99 EUR, 5 min)."
        canonical="/guide/qui-fait-le-pre-etat-date"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Qui fait le pre-etat date ? Vendeur, syndic ou IA",
        description: "Analyse juridique : qui doit fournir le pre-etat date ? Le vendeur peut-il le faire sans le syndic ? Position du CSN et article L.721-2 CCH.",
        slug: 'qui-fait-le-pre-etat-date',
        datePublished: '2026-03-28',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Qui fait le pre-etat date ?' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Le vendeur peut-il faire le pre-etat date lui-meme ?',
          answer: "Oui. Le Conseil Superieur du Notariat (CSN) a confirme que le vendeur peut etablir le pre-etat date lui-meme, sans recourir au syndic. L'article L.721-2 du Code de la Construction et de l'Habitation impose au vendeur de fournir les informations, mais ne designe pas le syndic comme seul habilite a les compiler. Le vendeur peut utiliser les documents en sa possession ou ceux disponibles sur l'extranet du syndic.",
        },
        {
          question: 'Le syndic est-il obligatoire pour le pre-etat date ?',
          answer: "Non. Le syndic n'est obligatoire que pour l'etat date (article 10-1 de la loi du 10 juillet 1965), qui est un document different fourni au moment de la vente definitive. Le pre-etat date, requis des la promesse de vente, peut etre etabli par le vendeur, par un professionnel de son choix ou par un service en ligne. Le syndic reste une option mais n'est pas un passage oblige.",
        },
        {
          question: 'Quelle est la difference entre pre-etat date et etat date ?',
          answer: "Le pre-etat date est fourni par le vendeur au moment de la promesse ou du compromis de vente. L'etat date est un document distinct, obligatoirement etabli par le syndic, fourni au moment de la vente definitive (acte authentique). L'etat date est plafonne a 380 EUR TTC par decret, alors que le pre-etat date n'a pas de plafond tarifaire. Les deux documents couvrent des informations similaires mais a des etapes differentes de la transaction.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Qui fait le pre-etat date ?' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Qui fait le pre-etat date ? Vendeur, syndic ou IA
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-28">Mis a jour le 28 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            7 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Qui doit le fournir :</dt>
              <dd>Le vendeur (obligation legale art. L.721-2 CCH)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Syndic obligatoire :</dt>
              <dd>Non — le CSN confirme que le vendeur peut le faire lui-meme</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">3 options :</dt>
              <dd>Syndic (150-600 EUR), vendeur DIY (gratuit), service IA (24,99 EUR)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">A ne pas confondre :</dt>
              <dd>L'etat date (syndic obligatoire, 380 EUR max) est un document different</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Quand le fournir :</dt>
              <dd>Avant la signature du compromis ou de la promesse de vente</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est l'une des questions les plus frequentes lors d'une vente en copropriete : qui
          est cense fournir le pre-etat date ? Le vendeur, le syndic, le notaire ? La reponse
          est plus simple qu'il n'y parait, et elle ouvre des possibilites que beaucoup de
          vendeurs ignorent.
        </p>

        {/* Legal framework */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que dit la loi : article L.721-2 du CCH
        </h2>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <Scale className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-secondary-700">
            <strong>Article L.721-2 du Code de la Construction et de l'Habitation :</strong> le
            vendeur doit fournir a l'acquereur, des la promesse de vente, un ensemble d'informations
            relatives a l'organisation de la copropriete, a la situation financiere du coproprietaire
            vendeur et de la copropriete, et a l'etat du batiment.
          </p>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR du 24 mars 2014</Link> a
          cree cette obligation d'information. Le point essentiel : c'est le <strong>vendeur</strong> qui
          est debiteur de cette obligation, pas le syndic. La loi ne designe pas le syndic comme
          seul habilite a constituer ce document.
        </p>

        {/* CSN position */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La position du Conseil Superieur du Notariat (CSN)
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le CSN a clarifie cette question en publiant un modele de reference pour le pre-etat
          date. Cette publication confirme implicitement que le vendeur peut constituer ce
          document lui-meme, a condition de rassembler les informations requises a partir des
          documents de copropriete en sa possession.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Concretement, le vendeur dispose generalement de la plupart des documents necessaires :
          PV d'assemblee generale, appels de fonds, releves de charges, fiche synthetique
          (disponible sur l'extranet du syndic), diagnostics immobiliers. Il peut donc compiler
          ces informations sans solliciter le syndic.
        </p>

        {/* 3 options compared */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 3 options pour obtenir son pre-etat date
        </h2>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-3">
          Option 1 : Demander au syndic
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Le syndic a acces a toutes les donnees comptables</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Aucun effort de la part du vendeur</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Cout eleve : 150 a 600 EUR (non plafonne)</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Delai long : 15 a 30 jours en moyenne</span>
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est l'option historique et la plus connue, mais aussi la plus couteuse. Contrairement
          a l'etat date (plafonne a 380 EUR), le prix du pre-etat date n'est pas reglemente.
          Les syndics profitent souvent de cette absence de plafond pour facturer des tarifs
          eleves. Consultez notre article sur
          le <Link to="/guide/cout-pre-etat-date-syndic" className="text-primary-600 hover:text-primary-800 font-medium">cout du pre-etat date chez le syndic</Link> pour
          les tarifs detailles.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-3">
          Option 2 : Le faire soi-meme (DIY)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Totalement gratuit</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Le vendeur garde le controle</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Complexe : 60+ donnees financieres a extraire</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <X className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>Risque d'erreur et de rejet par le notaire</span>
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Legalement possible, mais concretement difficile pour un non-professionnel. Le vendeur
          doit analyser les documents comptables, identifier les bons montants, verifier la
          coherence des tantiemes et produire un document conforme. Pour en savoir plus sur les
          risques, consultez notre guide sur
          le <Link to="/guide/pre-etat-date-gratuit" className="text-primary-600 hover:text-primary-800 font-medium">pre-etat date gratuit</Link>.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-3">
          Option 3 : Utiliser un service IA (Pre-etat-date.ai)
        </h3>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Rapide : 5 minutes au lieu de 15-30 jours</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Economique : 24,99 EUR au lieu de 150-600 EUR</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Conforme au modele CSN</span>
            </div>
            <div className="flex items-start gap-2 text-secondary-600 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <span>Recoupement automatique des donnees</span>
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'intelligence artificielle analyse automatiquement les documents de copropriete pour
          extraire les donnees financieres, juridiques et techniques. Le vendeur depose ses
          PDF, valide les informations extraites et obtient un document conforme en quelques
          minutes. C'est le meilleur equilibre entre cout, rapidite et fiabilite.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Tableau recapitulatif
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critere</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Syndic</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Vendeur DIY</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-primary-700 bg-primary-50">IA (Pre-etat-date.ai)</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Qui realise ?</td>
                <td className="border border-secondary-200 px-4 py-3">Le gestionnaire du syndic</td>
                <td className="border border-secondary-200 px-4 py-3">Le vendeur seul</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 text-primary-700">L'IA + validation vendeur</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Prix</td>
                <td className="border border-secondary-200 px-4 py-3">150-600 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Gratuit</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 font-semibold text-primary-700">24,99 EUR</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Delai</td>
                <td className="border border-secondary-200 px-4 py-3">15-30 jours</td>
                <td className="border border-secondary-200 px-4 py-3">2-5 heures</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 font-semibold text-primary-700">5 minutes</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Fiabilite</td>
                <td className="border border-secondary-200 px-4 py-3">Elevee</td>
                <td className="border border-secondary-200 px-4 py-3">Variable (risque d'erreur)</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 text-primary-700">Elevee (recoupement IA)</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Base legale</td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Oui</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Oui (CSN)</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Oui (CSN)</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pre-etat date vs etat date */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Attention : ne confondez pas pre-etat date et etat date
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est une confusion frequente. Le <strong>pre-etat date</strong> et
          l'<strong>etat date</strong> sont deux documents distincts :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>
            Le <strong>pre-etat date</strong> est fourni par le vendeur au moment du compromis.
            Le vendeur peut le faire lui-meme ou passer par un service en ligne.
          </li>
          <li>
            L'<strong>etat date</strong> est etabli obligatoirement par le syndic au moment de la
            vente definitive (acte authentique). Son prix est plafonne a 380 EUR TTC.
          </li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour une comparaison detaillee, consultez notre article sur
          la <Link to="/guide/difference-pre-etat-date-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">difference entre pre-etat date et etat date</Link>.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions frequentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le vendeur peut-il faire le pre-etat date lui-meme ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. Le CSN a confirme que le vendeur peut etablir le pre-etat date sans recourir
              au syndic. L'article L.721-2 du CCH impose au vendeur de fournir les informations,
              mais ne designe pas le syndic comme seul prestataire. Le vendeur peut utiliser ses
              propres documents ou un service en ligne comme Pre-etat-date.ai.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le syndic est-il obligatoire pour le pre-etat date ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Le syndic est obligatoire uniquement pour l'etat date (art. 10-1 loi du
              10 juillet 1965). Pour le pre-etat date, le vendeur choisit librement comment
              le constituer. Le recours au syndic reste une option parmi d'autres.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quelle est la difference entre pre-etat date et etat date ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le pre-etat date est fourni au compromis, le vendeur peut le faire lui-meme.
              L'etat date est fourni a l'acte authentique et doit etre etabli par le syndic
              (plafonne a 380 EUR). Les deux couvrent des informations similaires mais a des
              moments differents de la vente. Consultez notre <Link to="/faq" className="text-primary-600 hover:text-primary-800 font-medium">FAQ</Link> pour
              plus de precisions.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="qui-fait-le-pre-etat-date" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Faites votre pre-etat date vous-meme, avec l'aide de l'IA
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR, conforme CSN, pret en 5 minutes. Pas besoin d'attendre le syndic.
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
