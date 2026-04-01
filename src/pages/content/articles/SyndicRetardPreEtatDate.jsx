import { Link } from 'react-router-dom';
import { ArrowRight, Clock, AlertTriangle, ShieldAlert, Zap } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function SyndicRetardPreEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Syndic qui tarde ou refuse le pré-état daté : vos recours"
        description="Votre syndic tarde à fournir le pré-état daté ? Injoignable ? Découvrez vos recours légaux et comment débloquer la situation en 5 minutes avec Pre-etat-date.ai."
        canonical="/guide/syndic-retard-pre-etat-date-recours"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Syndic qui tarde ou refuse le pré-état daté : vos recours",
        description: "Recours légaux quand le syndic tarde ou refuse de fournir le pré-état daté. Solutions pour débloquer la situation rapidement.",
        slug: 'syndic-retard-pre-etat-date-recours',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Syndic en retard : recours' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Le syndic peut-il refuser de fournir le pré-état daté ?',
          answer: "Non. L'article L.721-2 du Code de la construction et de l'habitation oblige le vendeur à fournir le pré-état daté à l'acquéreur avant le compromis. Si le vendeur le demande au syndic, celui-ci ne peut pas refuser de transmettre les informations nécessaires à son établissement. En revanche, le syndic n'est pas légalement tenu d'établir le pré-état daté lui-même : le vendeur peut le faire seul à partir des documents de la copropriété, disponibles sur l'extranet du syndic conformément à la loi ALUR.",
        },
        {
          question: 'Puis-je faire le pré-état daté moi-même si le syndic ne répond pas ?',
          answer: "Oui, c'est parfaitement légal. Le Conseil Supérieur du Notariat a confirmé que le vendeur peut établir le pré-état daté lui-même, sans passer par le syndic. Il suffit de disposer des documents de copropriété (PV d'AG, appels de fonds, relevés de charges, diagnostics). Ces documents sont accessibles sur l'extranet du syndic. Un service comme Pre-etat-date.ai permet de générer le pré-état daté en 5 minutes à partir de ces documents, pour 24,99 EUR.",
        },
        {
          question: "Le syndic peut-il me facturer pour l'accès à l'extranet ?",
          answer: "Non. Depuis la loi ALUR de 2014, le syndic est tenu de mettre à disposition un extranet sécurisé donnant accès aux documents de la copropriété. Cet accès est inclus dans les honoraires de gestion courante et ne peut faire l'objet d'aucune facturation supplémentaire. Si votre syndic vous facture l'accès à l'extranet, il contrevient à l'article 18 de la loi du 10 juillet 1965. Vous pouvez le mettre en demeure de respecter cette obligation.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Syndic en retard : recours' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Syndic qui tarde ou refuse le pré-état daté : vos recours
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-29">Mis à jour le 29 mars 2026</time>
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
              <dt className="font-semibold min-w-[180px]">Délai moyen syndic :</dt>
              <dd>15 à 30 jours (parfois plus)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Recours possibles :</dt>
              <dd>Mise en demeure LRAR, faire le document soi-même</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Base légale :</dt>
              <dd>Art. L.721-2 du CCH + loi ALUR (extranet obligatoire)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Alternative rapide :</dt>
              <dd>Pre-etat-date.ai : 5 minutes, 24,99 EUR</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[180px]">Risque de retard :</dt>
              <dd>L'acquéreur peut se rétracter ou renégocier le prix</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Vous avez trouvé un acquéreur, le notaire attend le pré-état daté, mais votre syndic ne
          répond pas. Cette situation, malheureusement très courante, bloque des milliers de ventes
          chaque année en France. Voici les recours concrets à votre disposition selon chaque
          scénario.
        </p>

        {/* Scenario table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 4 situations et leurs solutions
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Situation</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Recours</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Délai de résolution</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Syndic lent (&gt;15 jours)</td>
                <td className="border border-secondary-200 px-4 py-3">Relance écrite avec accusé de réception</td>
                <td className="border border-secondary-200 px-4 py-3">7-15 jours supplémentaires</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Syndic injoignable</td>
                <td className="border border-secondary-200 px-4 py-3">Mise en demeure par LRAR</td>
                <td className="border border-secondary-200 px-4 py-3">8-30 jours</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Syndic qui refuse</td>
                <td className="border border-secondary-200 px-4 py-3">Rappeler l'art. L.721-2 CCH + saisine tribunal</td>
                <td className="border border-secondary-200 px-4 py-3">1-3 mois</td>
              </tr>
              <tr className="bg-primary-50">
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Compromis imminent</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">Faire le pré-état daté soi-même via Pre-etat-date.ai</td>
                <td className="border border-secondary-200 px-4 py-3 font-semibold text-primary-700">5 minutes</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scenario 1: Slow */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Scénario 1 : Le syndic est lent
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          C'est le cas le plus fréquent. Vous avez envoyé un email ou rempli un formulaire sur
          le site du syndic, et après 15 jours, toujours rien. Les grands cabinets nationaux
          traitent des centaines de demandes par semaine, et le pré-état daté n'est pas leur
          priorité.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          <strong>Solution :</strong> envoyez une relance par email avec copie à votre notaire.
          Mentionnez la date de votre demande initiale, le caractère urgent de la vente, et
          demandez un délai de traitement précis. Si cela ne suffit pas, passez à la mise en
          demeure.
        </p>

        {/* Scenario 2: Unresponsive */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Scénario 2 : Le syndic est injoignable
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Téléphone qui sonne dans le vide, emails sans réponse, accueil fermé. Certains syndics
          sont débordés ou en difficulté financière, rendant tout contact impossible.
        </p>
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <ShieldAlert className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Mise en demeure par LRAR</h3>
            <p className="text-sm text-secondary-600">
              Envoyez une lettre recommandée avec accusé de réception demandant la transmission
              des informations nécessaires à l'établissement du pré-état daté dans un délai de
              15 jours. Mentionnez l'article L.721-2 du CCH et le préjudice causé par le retard
              (risque de perte de l'acquéreur, conditions suspensives expirant).
            </p>
          </div>
        </div>

        {/* Scenario 3: Refuses */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Scénario 3 : Le syndic refuse
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le refus pur et simple est rare mais existe. Certains syndics invoquent un conflit avec
          le copropriétaire ou conditionnent la délivrance au paiement de frais excessifs.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          <strong>Rappel juridique :</strong> le syndic ne peut pas refuser l'accès aux documents
          de la copropriété. La <Link to="/guide/loi-alur-copropriete" className="text-primary-600 hover:text-primary-800 font-medium">loi ALUR</Link> impose
          la mise à disposition d'un extranet sécurisé. Si le syndic refuse malgré votre mise en
          demeure, vous pouvez saisir le tribunal judiciaire en référé pour obtenir la communication
          des documents.
        </p>

        {/* Scenario 4: Overcharges */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Scénario 4 : Le syndic facture un prix excessif
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Certains syndics facturent 300 à 600 EUR pour l'établissement du pré-état daté, parfois
          davantage avec un supplément « urgence ». Ces tarifs ne sont encadrés par aucun barème
          légal, mais sont souvent disproportionnés par rapport au travail réel. Pour une analyse
          détaillée des tarifs, consultez notre article sur
          le <Link to="/guide/cout-pre-etat-date-syndic" className="text-primary-600 hover:text-primary-800 font-medium">coût du pré-état daté chez le syndic</Link>.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          <strong>L'alternative :</strong> rien ne vous oblige à passer par le syndic. Le vendeur
          peut établir le pré-état daté lui-même à partir des documents de copropriété. L'accès
          à l'extranet est gratuit et ne peut pas être facturé.
        </p>

        {/* The fastest solution */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La solution la plus rapide : le faire soi-même
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Quelle que soit la situation avec votre syndic, vous avez le droit de faire votre
          pré-état daté vous-même. Le Conseil Supérieur du Notariat l'a confirmé. Les documents
          nécessaires sont accessibles sur l'extranet du syndic, dont l'accès est gratuit et
          obligatoire depuis la loi ALUR.
        </p>
        <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <Zap className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">Pre-etat-date.ai : 5 minutes, 24,99 EUR</h3>
            <p className="text-sm text-secondary-600">
              Téléchargez vos documents depuis l'extranet du syndic, déposez-les
              sur <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link>,
              et l'intelligence artificielle génère votre pré-état daté conforme au modèle CSN
              en quelques minutes. Disponible 24h/24, sans attendre le syndic.
            </p>
          </div>
        </div>

        {/* Extranet reminder */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          L'extranet du syndic : votre droit d'accès
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Depuis la loi ALUR (2014), tout syndic doit fournir un accès en ligne sécurisé aux
          documents de la copropriété. Cet extranet contient les PV d'assemblées générales, les
          appels de fonds, les relevés de charges, le règlement de copropriété et la fiche
          synthétique. L'accès est inclus dans les honoraires de gestion courante et ne peut
          faire l'objet d'aucune facturation supplémentaire.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si votre syndic ne vous a jamais communiqué vos identifiants d'accès, demandez-les
          par écrit. En cas de refus, c'est un motif supplémentaire pour la mise en demeure.
        </p>

        {/* FAQ section */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le syndic peut-il refuser de fournir le pré-état daté ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le syndic ne peut pas refuser de transmettre les informations nécessaires à
              l'établissement du pré-état daté. La loi ALUR impose un extranet gratuit pour
              accéder aux documents de copropriété. En cas de refus, une mise en demeure par
              LRAR puis une saisine du tribunal judiciaire en référé sont vos recours.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Puis-je faire le pré-état daté moi-même si le syndic ne répond pas ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, c'est parfaitement légal. Le CSN a confirmé que le vendeur peut établir le
              pré-état daté lui-même. Récupérez les documents sur l'extranet du syndic et
              utilisez un service comme <Link to="/" className="text-primary-600 hover:text-primary-800 font-medium">Pre-etat-date.ai</Link> pour
              générer le document en 5 minutes. Pour plus de détails, consultez
              notre guide <Link to="/guide/pre-etat-date-sans-syndic" className="text-primary-600 hover:text-primary-800 font-medium">pré-état daté sans syndic</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le syndic peut-il me facturer pour l'accès à l'extranet ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non. L'accès à l'extranet est inclus dans les honoraires de gestion courante du
              syndic depuis la loi ALUR de 2014. Toute facturation supplémentaire est abusive
              et contrevient à l'article 18 de la loi du 10 juillet 1965. Vous pouvez contester
              cette facturation auprès du conseil syndical ou en assemblée générale.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="syndic-retard-pre-etat-date-recours" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Ne laissez pas le syndic bloquer votre vente
          </h2>
          <p className="text-secondary-500 mb-6">
            Faites votre pré-état daté vous-même en 5 minutes, pour 24,99 EUR.
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
