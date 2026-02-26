import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';

export default function DifferencePreEtatDateEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pré-état daté vs état daté : les 3 différences clés"
        description="Comprendre les différences entre pré-état daté et état daté : moment de production, obligation légale, qui l'établit, et comparatif des coûts."
        canonical="/guide/difference-pre-etat-date-etat-date"
        type="article"
      />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Pré-état daté vs état daté : les 3 différences clés
        </h1>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Dans le cadre d'une vente en copropriété, deux documents portent des noms proches mais ont
          des rôles bien distincts : le pré-état daté et l'état daté. Confondre les deux peut coûter
          cher et retarder votre vente. Voici les trois différences fondamentales à connaître.
        </p>

        {/* Difference 1 : Timing */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Différence n°1 : Le moment de production
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est la différence la plus importante. Les deux documents interviennent à des moments
          différents de la transaction immobilière :
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Pré-état daté</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Produit <strong>avant</strong> la signature du compromis de vente (ou de la promesse
              de vente). Il est annexé au compromis pour informer l'acquéreur de la situation du lot
              et de la copropriété.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">État daté</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              Produit <strong>après</strong> la signature du compromis et <strong>avant</strong> l'acte
              authentique chez le notaire. Il sert à répartir les charges entre vendeur et acquéreur
              au moment du transfert de propriété.
            </p>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En pratique, le pré-état daté est le premier document à préparer lorsque vous mettez votre
          bien en vente. L'état daté, lui, est demandé par le notaire une fois que le compromis est
          signé et que la vente est en bonne voie.
        </p>

        {/* Difference 2 : Obligation legale */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Différence n°2 : L'obligation légale
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le statut juridique de ces deux documents est différent :
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Pré-état daté</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Issu de la <strong>loi ALUR du 24 mars 2014</strong> (article L.721-2 du CCH). Les
              informations qu'il contient sont obligatoires, mais le document lui-même n'est pas
              nommé dans la loi. Il est néanmoins pratiquement indispensable pour la signature du
              compromis.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">État daté</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              Expressément prévu par l'<strong>article 5 du décret n°67-223 du 17 mars 1967</strong>.
              C'est un document légalement obligatoire. Sans lui, la vente ne peut pas être finalisée
              chez le notaire.
            </p>
          </div>
        </div>

        {/* Difference 3 : Qui le prepare */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Différence n°3 : Qui l'établit et à quel prix
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette différence a des conséquences directes sur votre porte-monnaie :
        </p>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Pré-état daté</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Peut être établi par le <strong>vendeur lui-même</strong>, un agent immobilier, un
              service en ligne ou le syndic. Le Conseil Supérieur du Notariat a confirmé que le
              recours au syndic n'est pas obligatoire. Le prix n'est pas plafonné.
            </p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-amber-900 mb-2">État daté</h3>
            <p className="text-amber-800 text-sm leading-relaxed">
              Doit obligatoirement être établi par le <strong>syndic de copropriété</strong>. Son
              coût est plafonné par la loi à <strong>380 EUR TTC</strong> (décret du 21 février 2020).
              Le syndic ne peut pas refuser de le fournir.
            </p>
          </div>
        </div>

        {/* Tableau comparatif */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Tableau comparatif
        </h2>
        <div className="overflow-x-auto mb-4">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-blue-900">Pré-état daté</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-amber-900">État daté</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Moment</td>
                <td className="border border-secondary-200 px-4 py-3">Avant le compromis</td>
                <td className="border border-secondary-200 px-4 py-3">Après le compromis</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Base légale</td>
                <td className="border border-secondary-200 px-4 py-3">Art. L.721-2 CCH (loi ALUR)</td>
                <td className="border border-secondary-200 px-4 py-3">Art. 5, décret du 17/03/1967</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Qui l'établit</td>
                <td className="border border-secondary-200 px-4 py-3">Vendeur, agent, service en ligne</td>
                <td className="border border-secondary-200 px-4 py-3">Syndic uniquement</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Coût syndic</td>
                <td className="border border-secondary-200 px-4 py-3">150 à 600 EUR (non plafonné)</td>
                <td className="border border-secondary-200 px-4 py-3">Max 380 EUR TTC (plafonné)</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Coût Pack Vendeur</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-600">19,99 EUR</td>
                <td className="border border-secondary-200 px-4 py-3 text-secondary-400">Non applicable</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Délai</td>
                <td className="border border-secondary-200 px-4 py-3">5 min (en ligne) à 30 jours (syndic)</td>
                <td className="border border-secondary-200 px-4 py-3">15 à 30 jours</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pourquoi les deux */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Faut-il les deux documents ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Oui. Le pré-état daté et l'état daté sont complémentaires et tous les deux nécessaires
          dans le processus de vente :
        </p>
        <ol className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-decimal mb-4">
          <li>Le <strong>pré-état daté</strong> est fourni au moment de la mise en vente pour informer l'acquéreur et permettre la signature du compromis.</li>
          <li>L'<strong>état daté</strong> est demandé au syndic après le compromis pour finaliser la vente chez le notaire.</li>
        </ol>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La bonne stratégie est de préparer rapidement votre pré-état daté (avec Pack Vendeur par
          exemple) pour ne pas retarder la signature du compromis, puis de demander l'état daté au
          syndic une fois le compromis signé.
        </p>

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Obtenez votre pré-état daté en 5 minutes
          </h2>
          <p className="text-secondary-500 mb-6">
            Ne retardez pas votre compromis. Générez votre pré-état daté maintenant pour 19,99 EUR.
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
