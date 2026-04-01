import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, faqSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function RemboursementPreEtatDate() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Remboursement du pré-état daté : vos droits et recours (2026)"
        description="Le syndic peut-il facturer le pré-état daté ? Peut-on se faire rembourser ? Tarifs abusifs, jurisprudence, plafonnement et alternatives moins chères."
        canonical="/guide/remboursement-pre-etat-date"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "Remboursement du pré-état daté : vos droits et recours (2026)",
        description: "Le syndic peut-il facturer le pré-état daté ? Peut-on se faire rembourser ? Tarifs abusifs, jurisprudence et alternatives.",
        slug: 'remboursement-pre-etat-date',
        datePublished: '2026-03-30',
      })} />
      <JsonLd data={faqSchema([
        {
          question: "Peut-on se faire rembourser le pré-état daté facturé par le syndic ?",
          answer: "Si le pré-état daté n'est pas prévu dans le contrat de syndic comme une prestation particulière, sa facturation peut être contestée. Vous pouvez demander le remboursement par courrier recommandé au syndic, en invoquant que cette prestation n'est pas prévue au contrat ou que son tarif est abusif. En cas de refus, le médiateur de la consommation ou le tribunal peuvent être saisis.",
        },
        {
          question: "Le prix du pré-état daté est-il plafonné ?",
          answer: "Non, contrairement à l'état daté (plafonné à 380 € depuis le décret du 21 février 2020), le pré-état daté n'a pas de tarif plafonné par la loi. Les syndics fixent librement leur prix, qui varie de 150 à 600 € selon les cabinets. C'est pourquoi le vendeur peut choisir de le constituer lui-même ou d'utiliser un service en ligne moins cher.",
        },
        {
          question: "La facturation du pré-état daté par le syndic est-elle légale ?",
          answer: "La facturation est légale si elle est prévue au contrat de syndic comme prestation particulière. Depuis la loi ALUR, le contrat type de syndic distingue les prestations courantes (incluses dans les honoraires) et les prestations particulières (facturées en sus). Si le pré-état daté n'y figure pas, la facturation est contestable.",
        },
      ])} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'Remboursement du pré-état daté' },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'Remboursement du pré-état daté' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Remboursement du pré-état daté : vos droits et recours
        </h1>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-secondary-500 mb-6 mt-2">
          <span>Par <a href="/a-propos" className="text-secondary-700 font-medium hover:text-primary-600">L'équipe Pre-etat-date.ai</a></span>
          <span className="hidden sm:inline text-secondary-300">|</span>
          <time dateTime="2026-03-30">Mis à jour le 30 mars 2026</time>
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
              <dt className="font-semibold min-w-[140px]">Tarif plafonné :</dt>
              <dd>Non (contrairement à l'état daté plafonné à 380 €)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Tarif syndic :</dt>
              <dd>150 à 600 € selon les syndics (moyenne 380 €)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Remboursement :</dt>
              <dd>Possible si non prévu au contrat ou tarif abusif</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[140px]">Alternative :</dt>
              <dd>Le faire soi-même (gratuit) ou via Pre-etat-date.ai (24,99 €)</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Votre syndic vous a facturé 300, 400 voire 600 € pour un pré-état daté ? Vous n'êtes
          pas seul. La facturation du pré-état daté par les syndics est l'un des sujets les plus
          contestés en copropriété. Voici vos droits, les recours possibles et les alternatives
          pour ne plus payer ce prix.
        </p>

        {/* La facturation est-elle légale ? */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La facturation par le syndic est-elle légale ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La réponse dépend du <strong>contrat de syndic</strong>. Depuis la loi ALUR (2014), le
          contrat type de syndic (défini par le décret du 26 mars 2015) distingue deux catégories :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>Prestations courantes</strong> : incluses dans les honoraires annuels du syndic.</li>
          <li><strong>Prestations particulières</strong> : facturées en supplément, à condition d'être explicitement listées au contrat avec leur tarif.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si le pré-état daté figure dans les prestations particulières du contrat de syndic
          avec un tarif affiché, la facturation est <strong>légale</strong>. Si ce n'est pas le
          cas, elle est <strong>contestable</strong>.
        </p>

        {/* Pas de plafonnement */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Pourquoi le prix n'est pas plafonné (contrairement à l'état daté)
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Il est important de ne pas confondre le pré-état daté et l'<Link to="/guide/etat-date-definition-contenu-tarif" className="text-primary-600 hover:text-primary-800 font-medium">état daté</Link> :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>L'<strong>état daté</strong> est plafonné à <strong>380 € TTC</strong> depuis le décret n° 2020-153 du 21 février 2020.</li>
          <li>Le <strong>pré-état daté</strong> n'a <strong>aucun plafond légal</strong>. Les syndics fixent librement leur prix.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette absence de plafonnement explique les écarts de prix considérables entre les
          syndics (de 150 à plus de 600 €) et la frustration légitime des copropriétaires vendeurs.
        </p>

        {/* Comment se faire rembourser */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment demander le remboursement
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Si vous estimez que la facturation est abusive ou injustifiée, voici les étapes à suivre :
        </p>
        <ol className="space-y-3 text-secondary-600 leading-relaxed ml-6 list-decimal mb-4">
          <li><strong>Vérifiez le contrat de syndic</strong> : consultez la liste des prestations particulières. Si le pré-état daté n'y figure pas, vous avez un argument solide.</li>
          <li><strong>Envoyez un courrier recommandé</strong> au syndic demandant le remboursement, en citant l'absence de base contractuelle ou le caractère disproportionné du tarif.</li>
          <li><strong>Saisissez le médiateur de la consommation</strong> : les syndics professionnels doivent adhérer à un dispositif de médiation. Ses coordonnées figurent sur le contrat.</li>
          <li><strong>En dernier recours</strong> : le tribunal judiciaire peut être saisi pour obtenir le remboursement (les montants en jeu permettent la procédure simplifiée).</li>
        </ol>

        {/* Réponse ministérielle */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          La réponse ministérielle sur le pré-état daté
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Plusieurs réponses ministérielles ont précisé que les informations composant le
          pré-état daté sont à la charge du vendeur, et que celui-ci n'est pas contraint de
          passer par le syndic pour les obtenir. Le vendeur peut constituer ce document
          lui-même à partir des pièces de la copropriété en sa possession.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Cette position a été confirmée par le Conseil Supérieur du Notariat (CSN) : le
          vendeur a le choix de son mode d'obtention du pré-état daté.
        </p>

        {/* Les alternatives */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les alternatives au syndic pour éviter la surfacturation
        </h2>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border-collapse border border-secondary-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-secondary-50">
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Option</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Prix</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Délai</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-800">Difficulté</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Syndic professionnel</td>
                <td className="p-3 border border-secondary-200">150 à 600 €</td>
                <td className="p-3 border border-secondary-200">15 à 30 jours</td>
                <td className="p-3 border border-secondary-200">Facile (il fait tout)</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Le faire soi-même</td>
                <td className="p-3 border border-secondary-200">Gratuit</td>
                <td className="p-3 border border-secondary-200">2 à 5 heures</td>
                <td className="p-3 border border-secondary-200">Difficile (calculs financiers)</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium bg-primary-50/50">Pre-etat-date.ai</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">24,99 €</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">5 à 10 min</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold">Très facile (IA)</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Garantie Pre-etat-date.ai */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Notre garantie satisfait ou remboursé
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pre-etat-date.ai propose une <strong>garantie satisfait ou remboursé</strong> : si
          votre notaire refuse le document que nous avons généré (sur présentation d'un courrier
          motivé du notaire), nous vous remboursons intégralement.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          À 24,99 € avec garantie, c'est une fraction du prix facturé par la plupart des syndics —
          sans risque pour vous.
        </p>

        <RelatedArticles currentSlug="remboursement-pre-etat-date" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Ne payez plus 300 à 600 € au syndic
          </h2>
          <p className="text-secondary-500 mb-6">
            Pré-état daté conforme CSN, 24,99 €, satisfait ou remboursé.
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
