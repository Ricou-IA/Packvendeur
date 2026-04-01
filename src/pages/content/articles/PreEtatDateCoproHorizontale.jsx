import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Home, Info } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDateCoproHorizontale() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pré-état daté en copropriété horizontale et lotissement"
        description="Le pré-état daté est aussi obligatoire en copropriété horizontale (maisons, lotissements). Spécificités, documents nécessaires et comment le générer facilement."
        canonical="/guide/pre-etat-date-copropriete-horizontale"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pré-état daté en copropriété horizontale et lotissement",
        description: "Le pré-état daté est obligatoire en copropriété horizontale. Spécificités des maisons en copropriété, ASL, AFUL et documents nécessaires.",
        slug: 'pre-etat-date-copropriete-horizontale',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Copropriété horizontale' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Le pré-état daté est-il obligatoire pour une maison en copropriété ?',
          answer: "Oui, le pré-état daté est obligatoire pour toute vente d'un lot de copropriété, qu'il s'agisse d'un appartement en immeuble ou d'une maison en copropriété horizontale. L'article L.721-2 du Code de la construction et de l'habitation ne fait aucune distinction entre copropriété verticale et horizontale. Dès lors que le bien est soumis au statut de la copropriété (loi du 10 juillet 1965), le vendeur doit fournir le pré-état daté avant la signature du compromis de vente.",
        },
        {
          question: 'Quelle différence entre ASL et copropriété horizontale ?',
          answer: "Une ASL (Association Syndicale Libre) est une structure juridique distincte de la copropriété. En copropriété horizontale, les parties communes sont gérées par un syndic selon la loi du 10 juillet 1965, et le pré-état daté est obligatoire. En ASL, la gestion repose sur les statuts de l'association, et le régime de la copropriété ne s'applique pas : le pré-état daté n'est alors pas requis au sens strict. Cependant, l'acquéreur a tout intérêt à obtenir des informations équivalentes sur les charges et travaux de l'ASL.",
        },
        {
          question: 'Comment faire le pré-état daté sans syndic en copropriété horizontale ?',
          answer: "En copropriété horizontale sans syndic professionnel (syndic bénévole ou coopératif), le vendeur doit rassembler lui-même les documents nécessaires : règlement de copropriété, état descriptif de division, PV d'assemblées générales, relevés de charges et diagnostics. Il peut ensuite utiliser un service comme Pre-etat-date.ai pour générer le pré-état daté conforme au modèle CSN en 5 minutes pour 24,99 EUR, sans dépendre d'un syndic professionnel.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Copropriété horizontale' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pré-état daté en copropriété horizontale et lotissement
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-29">Mis à jour le 29 mars 2026</time>
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
              <dt className="font-semibold min-w-[200px]">Copropriété horizontale :</dt>
              <dd>Maisons, terrains, parkings en copropriété</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Pré-état daté obligatoire :</dt>
              <dd>Oui, même base légale que les immeubles (art. L.721-2 CCH)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Spécificités :</dt>
              <dd>Charges d'espaces communs, voirie, portail, espaces verts</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Documents requis :</dt>
              <dd>Règlement, EDD, PV d'AG, appels de fonds, diagnostics</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[200px]">Solution :</dt>
              <dd>Pre-etat-date.ai : 5 minutes, 24,99 EUR</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          On associe souvent la copropriété aux immeubles, mais de nombreuses maisons individuelles
          sont également soumises au statut de la copropriété. Lotissements, résidences fermées,
          ensembles pavillonnaires avec espaces communs : dans tous ces cas, la vente d'un lot
          implique la remise d'un pré-état daté. Voici les spécificités à connaître.
        </p>

        {/* What is copro horizontale */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qu'est-ce qu'une copropriété horizontale ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Une copropriété horizontale désigne un ensemble de biens bâtis (maisons, pavillons) ou
          non bâtis (terrains, parkings) qui partagent des parties communes et sont régis par la
          loi du 10 juillet 1965 relative au statut de la copropriété. Contrairement à la copropriété
          verticale (un immeuble divisé en étages), la copropriété horizontale s'étend au sol.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les parties communes typiques d'une copropriété horizontale incluent les voiries internes,
          les espaces verts, les aires de stationnement, les portails et clôtures, les réseaux
          d'assainissement et parfois des équipements collectifs (piscine, salle commune).
        </p>

        {/* Why pré-état daté is mandatory */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le pré-état daté est obligatoire
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article L.721-2 du CCH ne fait aucune distinction entre copropriété verticale et
          horizontale. Dès lors que votre bien est un lot de copropriété au sens de la loi de 1965,
          le pré-état daté est requis avant la signature du compromis de vente. La nature du bien
          (appartement ou maison) n'a aucune incidence sur cette obligation.
        </p>
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Exception : les ASL et AFUL</h3>
            <p className="text-sm text-secondary-600">
              Si votre lotissement est géré par une ASL (Association Syndicale Libre) ou une AFUL
              (Association Foncière Urbaine Libre) et non par un syndic de copropriété, le statut
              de la copropriété ne s'applique pas. Le pré-état daté n'est alors pas obligatoire
              au sens strict. Cependant, il est recommandé de fournir des informations équivalentes
              à l'acquéreur.
            </p>
          </div>
        </div>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Copropriété verticale vs horizontale : les différences
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Copropriété verticale (immeuble)</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Copropriété horizontale (maisons)</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Pré-état daté obligatoire</td>
                <td className="border border-secondary-200 px-4 py-3">Oui</td>
                <td className="border border-secondary-200 px-4 py-3">Oui</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Règlement de copropriété</td>
                <td className="border border-secondary-200 px-4 py-3">Oui</td>
                <td className="border border-secondary-200 px-4 py-3">Oui</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Tantièmes</td>
                <td className="border border-secondary-200 px-4 py-3">Oui (par lot)</td>
                <td className="border border-secondary-200 px-4 py-3">Oui (par lot / terrain)</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Charges courantes</td>
                <td className="border border-secondary-200 px-4 py-3">Ascenseur, parties communes</td>
                <td className="border border-secondary-200 px-4 py-3">Espaces verts, voirie, portail</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold">Syndic</td>
                <td className="border border-secondary-200 px-4 py-3">Toujours</td>
                <td className="border border-secondary-200 px-4 py-3">Parfois ASL/AFUL à la place</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold">DPE obligatoire</td>
                <td className="border border-secondary-200 px-4 py-3">Oui</td>
                <td className="border border-secondary-200 px-4 py-3">Oui</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Specific charges */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les charges spécifiques en copropriété horizontale
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les charges en copropriété horizontale diffèrent sensiblement de celles d'un immeuble
          classique. On ne trouve ni ascenseur ni cage d'escalier à entretenir, mais d'autres
          postes peuvent être significatifs :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Espaces verts :</strong> tonte, taille des haies, arrosage, remplacement des plantations.</li>
          <li><strong>Voirie :</strong> entretien des routes internes, éclairage, signalisation, déneigement.</li>
          <li><strong>Portail et clôtures :</strong> motorisation, interphone, vidéosurveillance, entretien.</li>
          <li><strong>Réseaux :</strong> assainissement collectif, eaux pluviales, canalisations communes.</li>
          <li><strong>Équipements collectifs :</strong> piscine, salle commune, aire de jeux (si existants).</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Toutes ces charges doivent figurer dans le pré-état daté. L'acquéreur doit connaître le
          montant exact de sa quote-part avant de s'engager. Pour comprendre la répartition des
          charges, consultez notre guide sur
          les <Link to="/guide/tantiemes-copropriete-calcul" className="text-primary-600 hover:text-primary-800 font-medium">tantièmes en copropriété</Link>.
        </p>

        {/* ASL vs Syndic */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          ASL/AFUL ou syndic : comment savoir ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La distinction est essentielle car elle détermine si le pré-état daté est obligatoire.
          Pour savoir si votre lotissement est en copropriété ou en ASL, vérifiez votre titre de
          propriété ou le règlement du lotissement. Si votre bien est décrit comme un « lot de
          copropriété » avec des tantièmes, vous êtes en copropriété. Si vous êtes membre d'une
          « association syndicale », vous êtes en ASL.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En cas de doute, votre notaire pourra vous confirmer le régime juridique applicable à
          votre bien.
        </p>

        {/* How Pre-etat-date.ai handles it */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Générer le pré-état daté pour une copropriété horizontale
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          le processus est identique que votre bien soit un appartement ou une maison en copropriété.
          L'intelligence artificielle analyse vos documents et extrait automatiquement les données
          financières, juridiques et techniques, y compris les charges spécifiques aux copropriétés
          horizontales (voirie, espaces verts, portail).
        </p>
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <Home className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Adapté aux copropriétés horizontales</h3>
            <p className="text-sm text-secondary-600">
              Notre IA reconnaît les spécificités des copropriétés horizontales : charges de
              voirie, d'espaces verts, gestion de portail. Le PDF généré est conforme au modèle
              CSN et contient toutes les informations requises par l'article L.721-2 du CCH,
              quel que soit le type de copropriété.
            </p>
          </div>
        </div>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le pré-état daté est-il obligatoire pour une maison en copropriété ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, dès lors que la maison constitue un lot de copropriété au sens de la loi
              du 10 juillet 1965. L'article L.721-2 du CCH s'applique sans distinction entre
              copropriété verticale et horizontale. Le vendeur doit fournir le pré-état daté
              avant le compromis de vente.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quelle différence entre ASL et copropriété horizontale ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              En copropriété horizontale, la gestion suit la loi de 1965 avec un syndic et le
              pré-état daté est obligatoire. En ASL, la gestion repose sur les statuts de
              l'association et le pré-état daté n'est pas requis au sens strict. Vérifiez votre
              titre de propriété pour savoir quel régime s'applique à votre bien.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Comment faire le pré-état daté sans syndic en copropriété horizontale ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              En copropriété horizontale avec syndic bénévole ou coopératif, rassemblez les
              documents vous-même (règlement, EDD, PV d'AG, charges, diagnostics) et
              utilisez <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link> pour
              générer le document en 5 minutes. Consultez aussi
              notre guide <Link to="/guide/pre-etat-date-sans-syndic" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté sans syndic</Link>.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-copropriete-horizontale" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Vendez votre maison en copropriété sereinement
          </h2>
          <p className="text-secondary-500 mb-6">
            Pré-état daté conforme au modèle CSN, prêt en 5 minutes, 24,99 EUR.
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
