import { Link } from 'react-router-dom';
import { ArrowRight, Clock, PiggyBank, Info } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function FondsTravauxVente() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Fonds de travaux copropriété : que devient-il lors de la vente ?"
        description="Le fonds de travaux est rattaché au lot et non remboursable lors de la vente. Cotisation obligatoire (2,5 % du budget), fonctionnement et impact sur la vente."
        canonical="/guide/fonds-travaux-vente-copropriete"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Fonds de travaux copropriété : que devient-il lors de la vente ?",
        description: "Le fonds de travaux créé par la loi ALUR est obligatoire depuis 2017. Rattaché au lot et non remboursable, il est transféré automatiquement lors de la vente.",
        slug: 'fonds-travaux-vente-copropriete',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Fonds de travaux et vente' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Peut-on récupérer le fonds de travaux en vendant ?',
          answer: "Non. L'article 14-2 de la loi du 10 juillet 1965 (modifié par la loi ALUR de 2014) prévoit explicitement que les cotisations au fonds de travaux sont définitivement acquises au syndicat des copropriétaires. Le fonds est rattaché au lot, pas à la personne du copropriétaire. Lors de la vente, le solde du fonds est automatiquement transféré à l'acquéreur. Le vendeur ne peut ni demander le remboursement, ni déduire ces sommes du prix de vente à moins d'un accord amiable avec l'acheteur.",
        },
        {
          question: 'Le fonds de travaux fait-il baisser le prix de vente ?',
          answer: "Pas nécessairement. Un fonds de travaux bien garni est un atout pour l'acheteur, car il signifie que la copropriété dispose d'une réserve financière pour les travaux futurs. Cela réduit le risque d'appels de fonds exceptionnels après l'achat. En revanche, un fonds de travaux faible ou inexistant peut être un signal d'alerte pour l'acquéreur, qui devra provisionner davantage pour les travaux à venir. Le solde du fonds apparaît dans le pré-état daté.",
        },
        {
          question: 'Que se passe-t-il si la copropriété n\'a pas de fonds de travaux ?',
          answer: "Depuis le 1er janvier 2017, le fonds de travaux est obligatoire pour les copropriétés de plus de 10 lots à usage de logements, bureaux ou commerces. Les copropriétés de 10 lots ou moins peuvent voter en AG de ne pas constituer de fonds de travaux. Si une copropriété soumise à l'obligation n'a pas de fonds, elle est en infraction avec la loi. L'absence de fonds de travaux doit être signalée dans le pré-état daté, car elle constitue une information importante pour l'acquéreur.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Fonds de travaux et vente' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Fonds de travaux copropriété : que devient-il lors de la vente ?
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
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
              <dt className="font-semibold min-w-[160px]">Obligation :</dt>
              <dd>Loi ALUR, toutes copropriétés de plus de 10 lots depuis 2017</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Cotisation minimale :</dt>
              <dd>2,5 % du budget prévisionnel annuel</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Remboursement au vendeur :</dt>
              <dd>Non, le fonds est définitivement acquis au syndicat</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Transfert :</dt>
              <dd>Automatique au nouveau propriétaire avec le lot</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Pré-état daté :</dt>
              <dd>Oui, le solde du fonds est une information obligatoire</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le fonds de travaux est une réserve financière obligatoire créée par
          la <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> de
          2014 pour anticiper les dépenses de travaux en copropriété. Lors d'une vente, sa
          gestion soulève une question récurrente : le vendeur peut-il récupérer les sommes
          versées ?
        </p>

        {/* Historique et fonctionnement */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Historique et fonctionnement du fonds de travaux
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La loi ALUR du 24 mars 2014 a créé le fonds de travaux pour remédier à un problème
          récurrent : de nombreuses copropriétés se retrouvaient incapables de financer des
          travaux urgents, faute de trésorerie. Les copropriétaires devaient alors faire face à
          des appels de fonds exceptionnels importants et imprévus.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Depuis le 1er janvier 2017, toutes les copropriétés de plus de 10 lots à usage de
          logements, bureaux ou commerces doivent constituer un fonds de travaux. La cotisation
          annuelle minimale est fixée à 2,5 % du budget prévisionnel. L'assemblée générale peut
          voter un taux supérieur.
        </p>

        {/* Pourquoi non remboursable */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le fonds n'est-il pas remboursable ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'article 14-2 de la loi du 10 juillet 1965, modifié par la loi ALUR, est sans
          ambiguïté : les cotisations au fonds de travaux sont rattachées au lot, pas au
          copropriétaire. Elles sont définitivement acquises au syndicat des copropriétaires.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le législateur a fait ce choix pour garantir la pérennité du fonds. Si chaque vendeur
          pouvait récupérer ses cotisations, le fonds se viderait à chaque mutation et ne remplirait
          plus son rôle de réserve financière. C'est la même logique que pour les parties communes :
          elles appartiennent à la copropriété, pas aux copropriétaires individuellement.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le fonds de travaux en questions
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Question</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Réponse</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Le fonds de travaux est-il obligatoire ?</td>
                <td className="border border-secondary-200 px-4 py-3">Oui, depuis 2017 (loi ALUR) pour les copropriétés de plus de 10 lots</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Combien cotiser au minimum ?</td>
                <td className="border border-secondary-200 px-4 py-3">2,5 % du budget prévisionnel annuel</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Le vendeur peut-il récupérer sa cotisation ?</td>
                <td className="border border-secondary-200 px-4 py-3">Non, le fonds est rattaché au lot (art. 14-2 loi 1965)</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Que devient le fonds lors de la vente ?</td>
                <td className="border border-secondary-200 px-4 py-3">Il est transféré automatiquement à l'acheteur</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Le solde apparaît-il dans le pré-état daté ?</td>
                <td className="border border-secondary-200 px-4 py-3">Oui, c'est une information obligatoire</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Peut-on utiliser le fonds pour n'importe quels travaux ?</td>
                <td className="border border-secondary-200 px-4 py-3">Non, uniquement pour les travaux votés en AG</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Impact sur le prix de vente */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Impact du fonds de travaux sur la vente
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Un fonds de travaux bien garni est un argument de vente. Pour l'acheteur, cela signifie
          que la copropriété dispose d'une réserve pour les travaux futurs, réduisant le risque
          d'appels de fonds exceptionnels imprévus. Un fonds important rassure sur la bonne
          gestion de la copropriété.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          À l'inverse, un fonds vide ou inexistant est un signal d'alerte. L'acheteur sait qu'il
          devra cotiser davantage et qu'en cas de travaux urgents, les appels de fonds seront
          conséquents. Cela peut peser dans la négociation du prix.
        </p>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Conseil aux vendeurs</h3>
            <p className="text-sm text-secondary-600">
              Mettez en avant le solde du fonds de travaux dans votre annonce si celui-ci est
              conséquent. C'est un élément rassurant pour les acquéreurs. Le pré-état daté
              sur Pre-etat-date.ai fait apparaître clairement ce solde dans la section financière.
            </p>
          </div>
        </div>

        {/* Ce que montre le pré-état daté */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que le pré-état daté indique sur le fonds de travaux
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté, conforme au modèle du Conseil Supérieur du Notariat, contient
          obligatoirement le solde du fonds de travaux rattaché au lot vendu. Cette information
          figure dans la partie financière du document, aux côtés du budget prévisionnel, des
          charges courantes et des éventuels impayés.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
          l'intelligence artificielle extrait automatiquement le solde du fonds de travaux à
          partir de vos relevés de charges et appels de fonds. Le montant est croisé avec
          les <Link to="/guide/tantiemes-copropriete-calcul" className="text-primary-600 hover:text-primary-800 font-medium">tantièmes</Link> de
          votre lot pour vérifier la cohérence des données. Pour comprendre la répartition
          globale des charges, consultez notre guide sur
          les <Link to="/guide/charges-copropriete-vente-qui-paie" className="text-primary-600 hover:text-primary-800 font-medium">charges lors de la vente</Link>.
        </p>

        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <PiggyBank className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Le fonds de travaux, un investissement collectif</h3>
            <p className="text-sm text-secondary-600">
              Même si le vendeur ne récupère pas ses cotisations, il a bénéficié du fonds pendant
              toute sa période de propriété : des travaux ont pu être financés sans appel de fonds
              exceptionnel, ce qui a préservé la valeur de son bien.
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
              Peut-on récupérer le fonds de travaux en vendant ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. Les cotisations au fonds de travaux sont définitivement acquises au syndicat
              des copropriétaires et rattachées au lot (article 14-2 de la loi du 10 juillet 1965).
              Le vendeur ne peut pas demander de remboursement. Le solde est transféré automatiquement
              à l'acheteur avec le lot.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le fonds de travaux fait-il baisser le prix de vente ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Pas nécessairement. Un fonds de travaux bien garni rassure l'acheteur sur la
              capacité de la copropriété à financer les travaux futurs. C'est un argument de
              vente qui peut au contraire soutenir le prix. En revanche, un fonds vide peut
              inquiéter et peser dans la négociation.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Que se passe-t-il si la copropriété n'a pas de fonds de travaux ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Les copropriétés de plus de 10 lots sont dans l'obligation d'en constituer un depuis
              2017. Les copropriétés de 10 lots ou moins peuvent voter de ne pas en créer. L'absence
              de fonds dans une copropriété soumise à l'obligation doit être signalée dans le
              pré-état daté. C'est un élément important pour l'acquéreur.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="fonds-travaux-vente-copropriete" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Connaître le solde de votre fonds de travaux
          </h2>
          <p className="text-secondary-500 mb-6">
            Le pré-état daté détaille le fonds de travaux de votre lot. 24,99 EUR, prêt en 5 minutes.
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
