import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Clock, X, AlertTriangle } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function PreEtatDateGratuit() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pre-etat date gratuit : modele, limites et alternatives"
        description="Le pre-etat date gratuit est-il fiable ? Modeles, risques d'erreur, rejet par le notaire. Decouvrez l'alternative professionnelle a 24,99 EUR avec analyse IA."
        canonical="/guide/pre-etat-date-gratuit"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pre-etat date gratuit : modele, limites et alternatives",
        description: "Analyse des modeles gratuits de pre-etat date : avantages, limites et risques. Pourquoi 24,99 EUR est le meilleur compromis.",
        slug: 'pre-etat-date-gratuit',
        datePublished: '2026-03-28',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pre-etat date gratuit' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Existe-t-il un modele de pre-etat date gratuit ?',
          answer: "Oui, des modeles gratuits de pre-etat date existent en ligne sous forme de formulaires PDF ou Word a remplir manuellement. Cependant, ces modeles ne garantissent pas la conformite au modele du Conseil Superieur du Notariat, ne verifient pas la coherence des donnees financieres (tantiemes, charges, budget) et n'offrent aucun recoupement automatique. Le vendeur porte l'entiere responsabilite des informations saisies.",
        },
        {
          question: 'Quels sont les risques d\'un pre-etat date fait soi-meme ?',
          answer: "Les principaux risques sont : erreurs dans les montants financiers (charges, impayees, fonds de travaux), oubli d'informations obligatoires requises par l'article L.721-2 du CCH, incoherences entre tantiemes et charges non detectees, rejet par le notaire pour non-conformite au modele CSN, et retard de la vente pouvant faire fuir l'acquereur. En cas d'erreur, la responsabilite du vendeur peut etre engagee.",
        },
        {
          question: 'Le pre-etat date a 24,99 EUR est-il plus fiable qu\'un modele gratuit ?',
          answer: "Oui, significativement. Pre-etat-date.ai utilise l'intelligence artificielle pour analyser automatiquement les documents de copropriete et extraire les donnees financieres, juridiques et techniques. Le service effectue un recoupement automatique des tantiemes et des charges (alerte si ecart superieur a 5 %), genere un PDF conforme au modele CSN et signale les donnees manquantes. Un modele gratuit ne fournit aucune de ces verifications.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pre-etat date gratuit' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pre-etat date gratuit : modele, limites et alternatives
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
              <dt className="font-semibold min-w-[180px]">Modeles gratuits :</dt>
              <dd>Existent mais sans verification ni recoupement des donnees</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Risque principal :</dt>
              <dd>Erreurs financieres, rejet par le notaire, retard de la vente</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Le faire soi-meme :</dt>
              <dd>Legal (confirme par le CSN) mais complexe et risque</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Alternative la moins chere :</dt>
              <dd>24,99 EUR sur Pre-etat-date.ai (analyse IA + modele CSN)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Conformite requise :</dt>
              <dd>Article L.721-2 du CCH (loi ALUR) — environ 70 donnees financieres et juridiques</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          La tentation du gratuit est comprehensible : pourquoi payer 300 EUR au syndic pour un
          document que l'on pourrait theoriquement constituer soi-meme ? Des modeles gratuits
          de pre-etat date circulent en ligne, mais ils comportent des limites serieuses. Voici
          un tour d'horizon objectif pour vous aider a faire le bon choix.
        </p>

        {/* Free templates exist */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les modeles gratuits existent-ils vraiment ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Oui. On trouve sur Internet des modeles de pre-etat date sous forme de formulaires PDF
          ou Word vierges. Certains sites proposent des templates a telecharger, parfois
          accompagnes d'une notice explicative. Le vendeur doit alors remplir manuellement
          toutes les informations requises.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le Conseil Superieur du Notariat (CSN) a d'ailleurs publie un modele de reference que
          certains sites reprennent. Ce modele liste les informations a fournir conformement
          a l'article L.721-2 du CCH. En theorie, tout vendeur peut le remplir avec les
          documents de copropriete en sa possession.
        </p>

        {/* Risks */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 5 risques du pre-etat date gratuit
        </h2>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">1. Erreurs dans les montants financiers</h3>
              <p className="text-sm text-secondary-600">
                Le pre-etat date contient une soixantaine de donnees financieres : charges courantes,
                charges exceptionnelles, budget previsionnel, fonds de travaux, impayees du vendeur,
                dettes de la copropriete. Une erreur de lecture ou de calcul peut entrainer un
                litige avec l'acquereur apres la vente.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">2. Oubli d'informations obligatoires</h3>
              <p className="text-sm text-secondary-600">
                L'article L.721-2 du CCH exige des informations precises sur les procedures en
                cours, les travaux votes, le plan pluriannuel et le diagnostic technique global.
                Un oubli peut rendre le document incomplet et retarder la signature du compromis.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">3. Pas de recoupement automatique</h3>
              <p className="text-sm text-secondary-600">
                Un modele gratuit ne verifie pas la coherence entre les tantiemes, le budget et les
                charges du lot. Par exemple, si les tantiemes representent 50/1000 du total mais que
                les charges declarees sont 3 fois superieures a la quote-part theorique, un modele
                gratuit ne detectera pas cette incoherence. L'IA de Pre-etat-date.ai effectue ce
                recoupement automatiquement et alerte en cas d'ecart superieur a 5 %.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">4. Rejet par le notaire</h3>
              <p className="text-sm text-secondary-600">
                Les notaires connaissent le modele CSN et verifient la completude du document.
                Un pre-etat date rempli de maniere approximative, avec des champs manquants ou
                des montants incertains, sera renvoye au vendeur pour correction, retardant la vente.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">5. Responsabilite du vendeur engagee</h3>
              <p className="text-sm text-secondary-600">
                En remplissant le pre-etat date lui-meme, le vendeur porte l'entiere responsabilite
                des informations fournies. En cas d'erreur decouverte apres la vente, l'acquereur
                peut invoquer un vice du consentement et demander des dommages-interets ou la
                reduction du prix.
              </p>
            </div>
          </div>
        </div>

        {/* What a valid pre-etat-date must contain */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Checklist : ce que doit contenir un pre-etat date valide
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Avant de vous lancer avec un modele gratuit, assurez-vous de pouvoir remplir
          l'integralite des informations requises par
          la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> :
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Partie financiere</h3>
            <ul className="space-y-2 text-secondary-600 text-sm ml-4 list-disc">
              <li>Budget previsionnel annuel de la copropriete</li>
              <li>Charges courantes du lot (exercice en cours + precedent)</li>
              <li>Charges exceptionnelles votees non appelees</li>
              <li>Montant du fonds de travaux et quote-part vendeur</li>
              <li>Impayees du vendeur envers la copropriete</li>
              <li>Dettes de la copropriete envers les fournisseurs</li>
              <li>Tantiemes du lot et total de la copropriete</li>
              <li>Provisions exigibles et provisions versees</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Partie juridique et technique</h3>
            <ul className="space-y-2 text-secondary-600 text-sm ml-4 list-disc">
              <li>Nom et coordonnees du syndic</li>
              <li>Procedures judiciaires en cours</li>
              <li>Travaux votes non encore realises</li>
              <li>Plan pluriannuel de travaux (PPT)</li>
              <li>Diagnostic technique global (DTG)</li>
              <li>DPE avec classes energie et GES</li>
              <li>Diagnostics obligatoires (amiante, plomb, etc.)</li>
              <li>Fiche synthetique de la copropriete</li>
            </ul>
          </div>
        </div>

        {/* Comparison: free vs 24.99 */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Modele gratuit vs Pre-etat-date.ai a 24,99 EUR
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critere</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Modele gratuit</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-primary-700 bg-primary-50">Pre-etat-date.ai</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Prix</td>
                <td className="border border-secondary-200 px-4 py-3">Gratuit</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 font-semibold text-primary-700">24,99 EUR</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Saisie des donnees</td>
                <td className="border border-secondary-200 px-4 py-3">100 % manuelle</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 text-primary-700">Automatique par IA</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Recoupement tantiemes/charges</td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><X className="h-4 w-4 text-red-500" /> Non</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Automatique</span>
                </td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Conformite CSN</td>
                <td className="border border-secondary-200 px-4 py-3">Selon le modele utilise</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Garanti</span>
                </td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Detection donnees manquantes</td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><X className="h-4 w-4 text-red-500" /> Non</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Alertes automatiques</span>
                </td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Partage notaire</td>
                <td className="border border-secondary-200 px-4 py-3">A gerer soi-meme</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Lien securise inclus</span>
                </td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Temps necessaire</td>
                <td className="border border-secondary-200 px-4 py-3">2 a 5 heures</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 font-semibold text-primary-700">5 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-secondary-600">
            <strong>Notre avis :</strong> pour 24,99 EUR, soit le prix de 2 cafes au restaurant,
            vous securisez une transaction immobiliere de plusieurs dizaines de milliers d'euros.
            Le risque d'erreur avec un modele gratuit n'en vaut pas l'economie de 25 EUR.
          </p>
        </div>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions frequentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Existe-t-il un modele de pre-etat date gratuit ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, des modeles gratuits existent sous forme de formulaires PDF ou Word. Cependant,
              ils ne verifient pas la coherence des donnees, ne detectent pas les informations
              manquantes et ne garantissent pas la conformite au modele CSN. Le vendeur porte
              l'entiere responsabilite des informations saisies.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quels sont les risques d'un pre-etat date fait soi-meme ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Les risques incluent : erreurs dans les montants financiers, oubli d'informations
              obligatoires, absence de recoupement des donnees, rejet par le notaire et
              responsabilite du vendeur engagee. Pour aller plus loin, decouvrez
              notre article sur <Link to="/guide/qui-fait-le-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">qui fait le pre-etat date</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le pre-etat date a 24,99 EUR est-il plus fiable qu'un modele gratuit ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. L'IA analyse automatiquement vos documents, effectue un recoupement des
              tantiemes et des charges, signale les donnees manquantes et genere un PDF conforme
              au modele CSN. Aucun modele gratuit ne fournit ces verifications.
              Consultez aussi notre <Link to="/faq" className="text-primary-600 hover:text-primary-800 font-medium">FAQ</Link> pour
              d'autres questions.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-gratuit" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Mieux qu'un modele gratuit, pour seulement 24,99 EUR
          </h2>
          <p className="text-secondary-500 mb-6">
            Analyse IA, recoupement automatique, conformite CSN. Le tout en 5 minutes.
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
