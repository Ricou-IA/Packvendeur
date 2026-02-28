import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function DpeVenteAppartement() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="DPE et vente d'appartement : obligations et validité 2026"
        description="DPE obligatoire pour vendre : validité, classes énergétiques, vérification ADEME et impact sur le prix de vente en copropriété."
        canonical="/guide/dpe-vente-appartement"
        type="article"
      />
      <JsonLd
        data={articleSchema({
          title: 'DPE et vente d\'appartement : obligations et validité 2026',
          description: 'DPE obligatoire pour vendre : validité, classes énergétiques, vérification ADEME et impact sur le prix de vente en copropriété.',
          slug: 'dpe-vente-appartement',
          datePublished: '2026-02-22',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Guides', url: '/guide' },
          { name: 'DPE et vente d\'appartement' },
        ])}
      />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          DPE et vente d'appartement : obligations et validité 2026
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-22">Mis à jour le 22 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            8 min de lecture
          </span>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le Diagnostic de Performance Énergétique (DPE) est devenu un élément incontournable de toute
          transaction immobilière. Depuis la réforme de 2021, il est opposable juridiquement et
          influence directement la valeur des biens. Pour le vendeur en copropriété, comprendre les
          règles de validité et les implications du DPE est essentiel pour préparer sereinement sa vente
          en 2026.
        </p>

        {/* Definition */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qu'est-ce que le DPE ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le DPE est un diagnostic immobilier qui évalue la consommation énergétique d'un logement et
          son impact en termes d'émissions de gaz à effet de serre (GES). Il attribue au bien une
          double étiquette :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Étiquette énergie</strong> (classes A à G) : mesure la consommation d'énergie primaire en kWh/m²/an.</li>
          <li><strong>Étiquette climat</strong> (classes A à G) : mesure les émissions de CO2 en kg CO2/m²/an.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La classe finale du logement est déterminée par la moins bonne des deux étiquettes. Un
          appartement classé B en énergie mais D en GES sera classé D au global. Le DPE doit être
          réalisé par un diagnostiqueur certifié, accrédité par le COFRAC.
        </p>

        {/* Reforme 2021 */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le nouveau DPE depuis le 1er juillet 2021
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La réforme du 1er juillet 2021 a profondément changé le DPE. Avant cette date, le diagnostic
          était purement informatif et calculé selon deux méthodes (factures ou 3CL). Depuis la
          réforme :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Le DPE est opposable</strong> : l'acquéreur peut engager la responsabilité du vendeur si le DPE est erroné (action en diminution du prix ou en dommages-intérêts).</li>
          <li><strong>Méthode de calcul unifiée (3CL-2021)</strong> : basée sur les caractéristiques physiques du bâtiment (isolation, chauffage, ventilation), et non plus sur les factures.</li>
          <li><strong>Nouveau barème</strong> : les seuils des classes A à G ont été recalibrés, intégrant à la fois l'énergie et le GES.</li>
          <li><strong>Nouvelles informations</strong> : estimation des coûts annuels d'énergie, recommandations de travaux avec scénarios de rénovation.</li>
        </ul>

        {/* Validite */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Règles de validité du DPE en 2026
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La durée de validité standard d'un DPE est de <strong>10 ans</strong>. Cependant, des règles
          transitoires s'appliquent aux anciens DPE :
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Date de réalisation</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Validité</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Statut en 2026</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Avant le 1er janvier 2013</td>
                <td className="border border-secondary-200 px-4 py-3">Expiré depuis le 1er janvier 2023</td>
                <td className="border border-secondary-200 px-4 py-3 text-red-600 font-medium">Non valable</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Entre le 1er janvier 2013 et le 30 juin 2021</td>
                <td className="border border-secondary-200 px-4 py-3">Expiré depuis le 31 décembre 2024</td>
                <td className="border border-secondary-200 px-4 py-3 text-red-600 font-medium">Non valable</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">À partir du 1er juillet 2021</td>
                <td className="border border-secondary-200 px-4 py-3">10 ans à compter de la date de réalisation</td>
                <td className="border border-secondary-200 px-4 py-3 text-green-600 font-medium">Valable (si &lt; 10 ans)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En 2026, seuls les DPE réalisés après le 1er juillet 2021 selon la nouvelle méthode sont
          valables pour une vente. Tout DPE antérieur est considéré comme <strong>non opposable</strong>
          et doit être refait.
        </p>

        {/* Classes energetiques */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les classes énergétiques et leur impact sur la vente
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La classe énergétique du logement a un impact direct et mesurable sur son prix de vente.
          Selon les études des notaires de France, l'écart de prix entre un logement classé A-B et
          un logement classé F-G peut atteindre 15 à 20 % dans certaines régions.
        </p>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Classe</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Consommation (kWh/m²/an)</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Qualification</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-green-700">A</td>
                <td className="border border-secondary-200 px-4 py-3">&le; 70</td>
                <td className="border border-secondary-200 px-4 py-3">Excellente performance</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-green-600">B</td>
                <td className="border border-secondary-200 px-4 py-3">71 à 110</td>
                <td className="border border-secondary-200 px-4 py-3">Très bonne performance</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-yellow-600">C</td>
                <td className="border border-secondary-200 px-4 py-3">111 à 180</td>
                <td className="border border-secondary-200 px-4 py-3">Bonne performance</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-orange-500">D</td>
                <td className="border border-secondary-200 px-4 py-3">181 à 250</td>
                <td className="border border-secondary-200 px-4 py-3">Performance moyenne</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-orange-600">E</td>
                <td className="border border-secondary-200 px-4 py-3">251 à 330</td>
                <td className="border border-secondary-200 px-4 py-3">Performance faible</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-red-500">F</td>
                <td className="border border-secondary-200 px-4 py-3">331 à 420</td>
                <td className="border border-secondary-200 px-4 py-3">Passoire énergétique</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-red-700">G</td>
                <td className="border border-secondary-200 px-4 py-3">&gt; 420</td>
                <td className="border border-secondary-200 px-4 py-3">Passoire énergétique</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Passoires energetiques */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Passoires énergétiques : les restrictions à la location
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si le DPE n'interdit pas la vente d'un bien énergivore, il impose en revanche des
          restrictions croissantes à la mise en location :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Depuis le 1er janvier 2025</strong> : les logements classés G ne peuvent plus être proposés à la location (nouveaux baux et renouvellements).</li>
          <li><strong>À partir du 1er janvier 2028</strong> : l'interdiction s'étendra aux logements classés F.</li>
          <li><strong>À partir du 1er janvier 2034</strong> : l'interdiction s'étendra aux logements classés E.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour un investisseur acquéreur, la classe DPE est donc un critère déterminant. Un bien
          classé F ou G nécessitera des travaux de rénovation énergétique avant de pouvoir être loué,
          ce qui se répercute directement sur le prix d'achat négocié.
        </p>

        {/* Verification ADEME */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Vérification du DPE via l'ADEME
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Chaque DPE réalisé depuis le 1er juillet 2021 reçoit un <strong>numéro ADEME à 13
          chiffres</strong>, enregistré dans la base nationale de l'Agence de l'Environnement et de
          la Maîtrise de l'Énergie. Ce numéro permet de vérifier l'authenticité et la validité du
          diagnostic en interrogeant la base publique de l'ADEME.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La vérification permet de confirmer :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>L'existence du DPE dans la base nationale.</li>
          <li>La date de réalisation et donc la durée de validité restante.</li>
          <li>Les classes énergie et GES attribuées.</li>
          <li>La cohérence avec le DPE présenté par le vendeur.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pack Vendeur intègre cette vérification automatiquement : dès que le numéro ADEME est
          extrait de votre DPE lors du téléversement, l'outil interroge la base ADEME et affiche
          le statut de validité (valide, expirant bientôt, expiré ou non opposable).
        </p>

        {/* DPE collectif */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          DPE collectif en copropriété
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Depuis le 1er janvier 2024, les copropriétés de plus de 200 lots doivent disposer d'un
          <strong> DPE collectif</strong>. L'obligation s'étendra aux copropriétés de 50 à 200 lots
          au 1er janvier 2025, puis à toutes les copropriétés au 1er janvier 2026.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le DPE collectif évalue la performance énergétique de l'immeuble dans son ensemble. Il ne
          remplace pas le DPE individuel du lot, qui reste obligatoire pour la vente. Cependant, si
          un DPE collectif existe, le propriétaire peut en extraire un DPE individuel sans frais
          supplémentaires, à condition que le DPE collectif soit toujours valide.
        </p>

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Vérifiez votre DPE automatiquement
          </h2>
          <p className="text-secondary-500 mb-6">
            Pack Vendeur extrait le numéro ADEME de votre DPE et vérifie sa validité en temps réel
            auprès de la base nationale.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Générer mon pré-état daté
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>

        <RelatedArticles currentSlug="dpe-vente-appartement" />
      </article>
    </div>
  );
}
