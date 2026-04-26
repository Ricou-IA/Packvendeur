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
        title="Pré-état daté gratuit : modèle, limites et alternatives"
        description="Le pré-état daté gratuit est-il fiable ? Modèles, risques d'erreur, rejet par le notaire. Découvrez l'alternative professionnelle à 24,99 EUR avec analyse IA."
        canonical="/guide/pre-etat-date-gratuit"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Pré-état daté gratuit : modèle, limites et alternatives",
        description: "Analyse des modèles gratuits de pré-état daté : avantages, limites et risques. Pourquoi 24,99 EUR est le meilleur compromis.",
        slug: 'pre-etat-date-gratuit',
        datePublished: '2026-03-28',
        dateModified: '2026-04-26',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Pré-état daté', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Pré-état daté gratuit' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Existe-t-il un modèle de pré-état daté gratuit ?',
          answer: "Oui, des modèles gratuits de pré-état daté existent en ligne sous forme de formulaires PDF ou Word à remplir manuellement. Cependant, ces modèles ne garantissent pas la conformité au modèle du Conseil Supérieur du Notariat, ne vérifient pas la cohérence des données financières (tantièmes, charges, budget) et n'offrent aucun recoupement automatique. Le vendeur porte l'entière responsabilité des informations saisies.",
        },
        {
          question: 'Quels sont les risques d\'un pré-état daté fait soi-même ?',
          answer: "Les principaux risques sont : erreurs dans les montants financiers (charges, impayés, fonds de travaux), oubli d'informations obligatoires requises par l'article L.721-2 du CCH, incohérences entre tantièmes et charges non détectées, rejet par le notaire pour non-conformité au modèle CSN, et retard de la vente pouvant faire fuir l'acquéreur. En cas d'erreur, la responsabilité du vendeur peut être engagée.",
        },
        {
          question: 'Le pré-état daté à 24,99 EUR est-il plus fiable qu\'un modèle gratuit ?',
          answer: "Oui, significativement. Pre-etat-date.ai utilise l'intelligence artificielle pour analyser automatiquement les documents de copropriété et extraire les données financières, juridiques et techniques. Le service effectue un recoupement automatique des tantièmes et des charges (alerte si écart supérieur à 5 %), génère un PDF conforme au modèle CSN et signale les données manquantes. Un modèle gratuit ne fournit aucune de ces vérifications.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Pré-état daté', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Pré-état daté gratuit' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pré-état daté gratuit : modèle, limites et alternatives
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-28">Mis à jour le 28 mars 2026</time>
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
              <dt className="font-semibold min-w-[180px]">Modèles gratuits :</dt>
              <dd>Existent mais sans vérification ni recoupement des données</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Risque principal :</dt>
              <dd>Erreurs financières, rejet par le notaire, retard de la vente</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Le faire soi-même :</dt>
              <dd>Légal (confirmé par le CSN) mais complexe et risqué</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Alternative la moins chère :</dt>
              <dd>24,99 EUR sur Pre-etat-date.ai (analyse IA + modèle CSN)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Conformité requise :</dt>
              <dd>Article L.721-2 du CCH (loi ALUR) — environ 70 données financières et juridiques</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          La tentation du gratuit est compréhensible : pourquoi payer 300 EUR au syndic pour un
          document que l'on pourrait théoriquement constituer soi-même ? Des modèles gratuits
          de <Link to="/" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">pré-état daté</Link> circulent en ligne, mais ils comportent des limites sérieuses. Voici
          un tour d'horizon objectif pour vous aider à faire le bon choix.
        </p>

        {/* Free templates exist */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les modèles gratuits existent-ils vraiment ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Oui. On trouve sur Internet des modèles de pré-état daté sous forme de formulaires PDF
          ou Word vierges. Certains sites proposent des templates à télécharger, parfois
          accompagnés d'une notice explicative. Le vendeur doit alors remplir manuellement
          toutes les informations requises.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le Conseil Supérieur du Notariat (CSN) a d'ailleurs publié un modèle de référence que
          certains sites reprennent. Ce modèle liste les informations à fournir conformément
          à l'article L.721-2 du CCH. En théorie, tout vendeur peut le remplir avec les
          documents de copropriété en sa possession.
        </p>

        {/* Risks */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 5 risques du pré-état daté gratuit
        </h2>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">1. Erreurs dans les montants financiers</h3>
              <p className="text-sm text-secondary-600">
                Le pré-état daté contient une soixantaine de données financières : charges courantes,
                charges exceptionnelles, budget prévisionnel, fonds de travaux, impayés du vendeur,
                dettes de la copropriété. Une erreur de lecture ou de calcul peut entraîner un
                litige avec l'acquéreur après la vente.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">2. Oubli d'informations obligatoires</h3>
              <p className="text-sm text-secondary-600">
                L'article L.721-2 du CCH exige des informations précises sur les procédures en
                cours, les travaux votés, le plan pluriannuel et le diagnostic technique global.
                Un oubli peut rendre le document incomplet et retarder la signature du compromis.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">3. Pas de recoupement automatique</h3>
              <p className="text-sm text-secondary-600">
                Un modèle gratuit ne vérifie pas la cohérence entre les tantièmes, le budget et les
                charges du lot. Par exemple, si les tantièmes représentent 50/1000 du total mais que
                les charges déclarées sont 3 fois supérieures à la quote-part théorique, un modèle
                gratuit ne détectera pas cette incohérence. L'IA de Pre-etat-date.ai effectue ce
                recoupement automatiquement et alerte en cas d'écart supérieur à 5 %.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">4. Rejet par le notaire</h3>
              <p className="text-sm text-secondary-600">
                Les notaires connaissent le modèle CSN et vérifient la complétude du document.
                Un pré-état daté rempli de manière approximative, avec des champs manquants ou
                des montants incertains, sera renvoyé au vendeur pour correction, retardant la vente.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
            <X className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">5. Responsabilité du vendeur engagée</h3>
              <p className="text-sm text-secondary-600">
                En remplissant le pré-état daté lui-même, le vendeur porte l'entière responsabilité
                des informations fournies. En cas d'erreur découverte après la vente, l'acquéreur
                peut invoquer un vice du consentement et demander des dommages-intérêts ou la
                réduction du prix.
              </p>
            </div>
          </div>
        </div>

        {/* What a valid pre-etat-date must contain */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Checklist : ce que doit contenir un pré-état daté valide
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Avant de vous lancer avec un modèle gratuit, assurez-vous de pouvoir remplir
          l'intégralité des informations requises par
          la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> :
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Partie financière</h3>
            <ul className="space-y-2 text-secondary-600 text-sm ml-4 list-disc">
              <li>Budget prévisionnel annuel de la copropriété</li>
              <li>Charges courantes du lot (exercice en cours + précédent)</li>
              <li>Charges exceptionnelles votées non appelées</li>
              <li>Montant du fonds de travaux et quote-part vendeur</li>
              <li>Impayés du vendeur envers la copropriété</li>
              <li>Dettes de la copropriété envers les fournisseurs</li>
              <li>Tantièmes du lot et total de la copropriété</li>
              <li>Provisions exigibles et provisions versées</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-3">Partie juridique et technique</h3>
            <ul className="space-y-2 text-secondary-600 text-sm ml-4 list-disc">
              <li>Nom et coordonnées du syndic</li>
              <li>Procédures judiciaires en cours</li>
              <li>Travaux votés non encore réalisés</li>
              <li>Plan pluriannuel de travaux (PPT)</li>
              <li>Diagnostic technique global (DTG)</li>
              <li>DPE avec classes énergie et GES</li>
              <li>Diagnostics obligatoires (amiante, plomb, etc.)</li>
              <li>Fiche synthétique de la copropriété</li>
            </ul>
          </div>
        </div>

        {/* Comparison: free vs 24.99 */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Modèle gratuit vs Pre-etat-date.ai à 24,99 EUR
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Modèle gratuit</th>
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
                <td className="border border-secondary-200 px-4 py-3 font-medium">Saisie des données</td>
                <td className="border border-secondary-200 px-4 py-3">100 % manuelle</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 text-primary-700">Automatique par IA</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Recoupement tantièmes/charges</td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><X className="h-4 w-4 text-red-500" /> Non</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Automatique</span>
                </td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Conformité CSN</td>
                <td className="border border-secondary-200 px-4 py-3">Selon le modèle utilise</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Garanti</span>
                </td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Détection données manquantes</td>
                <td className="border border-secondary-200 px-4 py-3">
                  <span className="flex items-center gap-1"><X className="h-4 w-4 text-red-500" /> Non</span>
                </td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Alertes automatiques</span>
                </td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Partage notaire</td>
                <td className="border border-secondary-200 px-4 py-3">À gérer soi-même</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50">
                  <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Lien sécurisé inclus</span>
                </td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Temps nécessaire</td>
                <td className="border border-secondary-200 px-4 py-3">2 à 5 heures</td>
                <td className="border border-secondary-200 px-4 py-3 bg-primary-50/50 font-semibold text-primary-700">5 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-secondary-600">
            <strong>Notre avis :</strong> pour 24,99 EUR, soit le prix de 2 cafés au restaurant,
            vous sécurisez une transaction immobilière de plusieurs dizaines de milliers d'euros.
            Le risque d'erreur avec un modèle gratuit n'en vaut pas l'économie de 25 EUR.
          </p>
        </div>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Existe-t-il un modèle de pré-état daté gratuit ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, des modèles gratuits existent sous forme de formulaires PDF ou Word. Cependant,
              ils ne vérifient pas la cohérence des données, ne détectent pas les informations
              manquantes et ne garantissent pas la conformité au modèle CSN. Le vendeur porte
              l'entière responsabilité des informations saisies.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Quels sont les risques d'un pré-état daté fait soi-même ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Les risques incluent : erreurs dans les montants financiers, oubli d'informations
              obligatoires, absence de recoupement des données, rejet par le notaire et
              responsabilité du vendeur engagée. Pour aller plus loin, découvrez
              notre article sur <Link to="/guide/qui-fait-le-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">qui fait le pré-état daté</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le pré-état daté à 24,99 EUR est-il plus fiable qu'un modèle gratuit ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui. L'IA analyse automatiquement vos documents, effectue un recoupement des
              tantièmes et des charges, signale les données manquantes et génère un PDF conforme
              au modèle CSN. Aucun modèle gratuit ne fournit ces vérifications.
              Consultez aussi notre <Link to="/faq" className="text-primary-600 hover:text-primary-800 font-medium">FAQ</Link> pour
              d'autres questions.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="pre-etat-date-gratuit" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Mieux qu'un modèle gratuit, pour seulement 24,99 EUR
          </h2>
          <p className="text-secondary-500 mb-6">
            Analyse IA, recoupement automatique, conformité CSN. Le tout en 5 minutes.
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
