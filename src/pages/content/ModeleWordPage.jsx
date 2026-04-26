import { Link } from 'react-router-dom';
import { Clock, AlertTriangle, FileWarning, Calculator, FileX } from 'lucide-react';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, faqSchema, breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';
import KeyFactsBox from '@components/seo/KeyFactsBox';
import ArticleCta from '@components/seo/ArticleCta';
import AuthorByline from '@components/seo/AuthorByline';

const SLUG = 'modele-pre-etat-date-word-gratuit';
const DATE_PUBLISHED = '2026-04-26';
const DATE_MODIFIED = '2026-04-26';

const FAQ_ITEMS = [
  {
    question: "Existe-t-il un modèle Word officiel de pré-état daté ?",
    answer:
      "Non, il n'existe pas de modèle Word officiel publié par le gouvernement ou le Conseil Supérieur du Notariat. Le CSN diffuse un modèle de référence en PDF auprès des notaires, mais pas de version Word téléchargeable librement. Les modèles Word que l'on trouve en ligne sont produits par des tiers et leur conformité est variable.",
  },
  {
    question: "Un modèle Word gratuit suffit-il pour mon notaire ?",
    answer:
      "Cela dépend de votre maîtrise des règles ALUR et de votre rigueur sur les calculs (tantièmes, prorata de charges). Un notaire peut accepter un document rempli sur Word à condition qu'il respecte le contenu de l'article L.721-2 du CCH. Mais un oubli ou une erreur de calcul peut entraîner un refus, voire un contentieux post-vente. C'est ce que Pre-etat-date.ai sécurise via l'IA.",
  },
  {
    question: "Combien de temps faut-il pour remplir un modèle Word vierge ?",
    answer:
      "Comptez en moyenne 2 à 5 heures si vous avez tous vos documents à portée de main (PV d'AG, appels de fonds, relevés de charges, DPE). Le calcul des tantièmes et des charges courantes est la partie la plus longue. Pre-etat-date.ai automatise cette étape en 5 minutes via l'analyse IA.",
  },
  {
    question: "Pourquoi payer 24,99 € si un modèle Word est gratuit ?",
    answer:
      "Le modèle Word est gratuit, mais pas votre temps ni la marge d'erreur. Comparé aux 150 à 600 € facturés par un syndic (source : ARC 2022), 24,99 € pour une génération conforme CSN en 5 minutes — avec garantie satisfait ou remboursé — reste 6 à 24 fois moins cher tout en étant 24 à 60 fois plus rapide qu'un remplissage manuel.",
  },
];

export default function ModeleWordPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Modèle de pré-état daté Word gratuit : ce qu'il faut savoir avant de télécharger"
        description="Modèle Word de pré-état daté gratuit : pourquoi c'est risqué, ce que vous risquez en cas d'erreur, et l'alternative IA à 24,99 € qui sécurise votre vente. Comparatif complet."
        canonical={`/guide/${SLUG}`}
        type="article"
        publishedTime={DATE_PUBLISHED}
        modifiedTime={DATE_MODIFIED}
      />
      <JsonLd
        data={articleSchema({
          title: "Modèle de pré-état daté Word gratuit : ce qu'il faut savoir avant de télécharger",
          description:
            "Modèle Word de pré-état daté gratuit : risques juridiques, erreurs de calcul, et alternative IA conforme modèle CSN à 24,99 €.",
          slug: SLUG,
          datePublished: DATE_PUBLISHED,
          dateModified: DATE_MODIFIED,
        })}
      />
      <JsonLd data={faqSchema(FAQ_ITEMS)} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Pré-état daté', url: '/' },
          { name: 'Guides', url: '/guide' },
          { name: 'Modèle Word gratuit' },
        ])}
      />

      <Breadcrumb
        items={[
          { label: 'Pré-état daté', to: '/' },
          { label: 'Guides', to: '/guide' },
          { label: 'Modèle Word gratuit' },
        ]}
      />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">
          Modèle de pré-état daté Word gratuit : pourquoi c'est risqué (et la meilleure alternative)
        </h1>

        <AuthorByline date={DATE_MODIFIED} readTime="6 min de lecture" />

        <KeyFactsBox
          items={[
            { label: 'Modèle Word officiel', value: "N'existe pas (le CSN diffuse un PDF aux notaires)" },
            { label: 'Temps de remplissage', value: '2 à 5 heures avec tous les documents en main' },
            { label: 'Risque principal', value: 'Erreurs de calcul (tantièmes, charges, prorata)' },
            { label: 'Alternative sécurisée', value: 'Pré-état daté IA en 5 min — 24,99 € (Pre-etat-date.ai)' },
          ]}
        />

        <p className="text-secondary-700 leading-relaxed mb-4">
          Vous cherchez un <Link to="/" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">pré-état daté</Link> à
          télécharger gratuitement au format Word ? L'idée est séduisante : pas de syndic, pas de facture, vous remplissez vous-même. Sauf que dans
          la pratique, un modèle Word vierge ouvre la porte à des erreurs de calcul, des oublis d'information obligatoire et — au pire — un blocage
          du compromis de vente. Cet article fait le point sur les risques et présente l'alternative IA à 24,99 €.
        </p>

        {/* Section 1 — Le mythe du modèle Word officiel */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le mythe du « modèle Word officiel »
        </h2>
        <p className="text-secondary-700 leading-relaxed mb-4">
          Première chose à savoir : <strong>il n'existe pas de modèle Word officiel</strong> du pré-état daté. Le Conseil Supérieur du Notariat (CSN)
          diffuse bien un modèle de référence, mais en PDF, à destination des notaires et des syndics professionnels. Aucune version Word n'est
          publiée par le gouvernement, l'ANIL ou le CSN.
        </p>
        <p className="text-secondary-700 leading-relaxed mb-4">
          Les fichiers <code className="bg-secondary-100 px-1.5 py-0.5 rounded text-xs">.docx</code> que l'on trouve en téléchargement libre sont
          tous produits par des tiers (blogs juridiques, forums de copropriété, sites de petites annonces). Leur conformité au modèle CSN n'est ni
          contrôlée ni garantie. Certains datent d'avant la loi ELAN (2018) et omettent des sections devenues obligatoires depuis.
        </p>

        {/* Section 2 — Les 4 risques */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Les 4 vrais risques d'un modèle Word rempli à la main
        </h2>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-secondary-900 m-0">Erreurs de calcul</h3>
            </div>
            <p className="text-sm text-secondary-700 m-0">
              La répartition des charges via les tantièmes (ex : 156/10 000) demande de la rigueur. Un mauvais prorata fausse l'état des charges
              courantes du lot, et donc l'information transmise à l'acquéreur.
            </p>
          </div>
          <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileX className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-secondary-900 m-0">Oublis d'information</h3>
            </div>
            <p className="text-sm text-secondary-700 m-0">
              Une procédure judiciaire en cours, des travaux votés non réalisés, un fonds de travaux mal renseigné — autant d'oublis qui peuvent
              entraîner une réfaction de prix, voire l'annulation de la vente.
            </p>
          </div>
          <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <FileWarning className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-secondary-900 m-0">Modèle obsolète</h3>
            </div>
            <p className="text-sm text-secondary-700 m-0">
              Un Word téléchargé en 2019 ne couvre ni le DPE opposable (depuis 2021), ni le Plan Pluriannuel de Travaux (PPT), ni l'audit
              énergétique pour les copropriétés concernées.
            </p>
          </div>
          <div className="border border-amber-200 bg-amber-50/40 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="font-semibold text-secondary-900 m-0">Refus du notaire</h3>
            </div>
            <p className="text-sm text-secondary-700 m-0">
              Si le document est jugé incomplet ou non conforme, le notaire peut refuser de l'intégrer au compromis. Vous repartez à zéro — soit
              avec le syndic (15 à 30 jours), soit avec un autre outil.
            </p>
          </div>
        </div>

        {/* Section 3 — Comparatif chiffré */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Modèle Word vs Pré-état daté IA : combien ça coûte vraiment ?
        </h2>
        <p className="text-secondary-700 leading-relaxed mb-4">
          « Gratuit » ne veut pas dire « sans coût ». Quand on additionne le temps passé, le risque d'erreur et la perte potentielle sur une vente
          retardée, le bilan change. Comparons les trois options concrètes (sources : ARC 2022 sur les tarifs syndic, observation marché 2026).
        </p>

        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm border-collapse border border-secondary-200 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-secondary-50">
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-900">Critère</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-900">Modèle Word gratuit</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-secondary-900">Syndic</th>
                <th className="text-left p-3 border border-secondary-200 font-semibold text-primary-700 bg-primary-50">Pre-etat-date.ai</th>
              </tr>
            </thead>
            <tbody className="text-secondary-700">
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Prix affiché</td>
                <td className="p-3 border border-secondary-200">0 €</td>
                <td className="p-3 border border-secondary-200">150 à 600 €</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold text-primary-700">24,99 €</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="p-3 border border-secondary-200 font-medium">Temps réel</td>
                <td className="p-3 border border-secondary-200">2 à 5 heures</td>
                <td className="p-3 border border-secondary-200">15 à 30 jours</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold text-primary-700">5 minutes</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Conformité CSN</td>
                <td className="p-3 border border-secondary-200">Variable selon le modèle trouvé</td>
                <td className="p-3 border border-secondary-200">Oui</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold text-primary-700">Oui (modèle CSN)</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="p-3 border border-secondary-200 font-medium">Risque d'erreur</td>
                <td className="p-3 border border-secondary-200">Élevé (calculs manuels)</td>
                <td className="p-3 border border-secondary-200">Faible</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold text-primary-700">Faible (IA + cross-validation)</td>
              </tr>
              <tr>
                <td className="p-3 border border-secondary-200 font-medium">Garantie</td>
                <td className="p-3 border border-secondary-200">Aucune</td>
                <td className="p-3 border border-secondary-200">Selon mandat</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold text-primary-700">Satisfait ou remboursé</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="p-3 border border-secondary-200 font-medium">Lien notaire intégré</td>
                <td className="p-3 border border-secondary-200">Non (à gérer par email)</td>
                <td className="p-3 border border-secondary-200">Non</td>
                <td className="p-3 border border-secondary-200 bg-primary-50/50 font-semibold text-primary-700">Oui</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-secondary-700 leading-relaxed mb-4">
          Sur la base d'un tarif moyen syndic constaté à <strong>380 € (source ARC 2022)</strong>, l'économie réelle d'un pré-état daté IA est
          de <strong>355 € soit 93 % moins cher</strong>. Et comparé à 3 heures passées sur un Word, vous économisez aussi votre soirée.
          Pour le détail des tarifs syndic, voir notre comparatif :{' '}
          <Link to="/guide/cout-pre-etat-date-syndic" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">
            Coût du pré-état daté chez le syndic
          </Link>.
        </p>

        {/* Section 4 — Ce que vous gagnez avec l'IA */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Ce que l'IA fait, et qu'un Word ne fait pas
        </h2>
        <p className="text-secondary-700 leading-relaxed mb-4">
          Pre-etat-date.ai n'est pas un simple PDF rempli à la main. C'est un pipeline qui sécurise chaque ligne du document :
        </p>
        <ul className="space-y-3 text-secondary-700 leading-relaxed ml-6 list-disc mb-4">
          <li>
            <strong>Classification automatique des PDF</strong> déposés (PV d'AG, règlement, appels de fonds, DPE) — vous ne triez plus rien.
          </li>
          <li>
            <strong>Extraction par Gemini 2.5 Pro</strong> des 50+ champs financiers, juridiques et techniques attendus par le modèle CSN.
          </li>
          <li>
            <strong>Cross-validation des tantièmes</strong> : l'IA recalcule les charges courantes à partir du budget prévisionnel et des tantièmes,
            et alerte si l'écart avec ce qui est inscrit dépasse 5 %.
          </li>
          <li>
            <strong>Vérification DPE en temps réel</strong> via l'API ouverte de l'ADEME (validité, date, classes énergie/GES).
          </li>
          <li>
            <strong>Lien de partage notaire sécurisé</strong> : un seul URL, tous les documents indexés, RGPD, expiration 7 jours.
          </li>
          <li>
            <strong>Garantie satisfait ou remboursé</strong> sous 7 jours sur présentation d'une lettre motivante du notaire.
          </li>
        </ul>

        {/* Section 5 — Quand un modèle Word peut suffire */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Quand un modèle Word peut quand même suffire
        </h2>
        <p className="text-secondary-700 leading-relaxed mb-4">
          Soyons honnêtes : il y a des cas où un Word vierge fait le job. Si vous êtes <strong>syndic bénévole</strong> de votre petite copropriété
          (moins de 10 lots), que vous tenez vous-même la comptabilité et que vous connaissez parfaitement vos charges, le remplissage manuel reste
          envisageable. Voir notre guide dédié :{' '}
          <Link to="/guide/pre-etat-date-sans-syndic" className="text-primary-600 hover:text-primary-700 underline underline-offset-2">
            Pré-état daté sans syndic
          </Link>.
        </p>
        <p className="text-secondary-700 leading-relaxed mb-4">
          Mais dès qu'il y a un syndic professionnel, des PV d'AG sur 3 ans, plusieurs lots concernés ou des travaux votés en cours, l'analyse
          manuelle devient un terrain glissant. C'est exactement pour ce cas que l'IA a été conçue.
        </p>

        {/* Section 6 — FAQ visible */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Questions fréquentes
        </h2>
        <div className="space-y-4 mb-6">
          {FAQ_ITEMS.map((item, i) => (
            <details key={i} className="border border-secondary-200 rounded-lg p-4 group">
              <summary className="font-semibold text-secondary-900 cursor-pointer flex items-center justify-between gap-2 list-none">
                <span>{item.question}</span>
                <span className="text-secondary-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-secondary-700 leading-relaxed mt-3 mb-0">{item.answer}</p>
            </details>
          ))}
        </div>

        {/* Reading time / proof */}
        <div className="flex items-center gap-2 text-sm text-secondary-500 mb-6">
          <Clock className="h-4 w-4" />
          <span>
            Lu en 6 minutes · Mise à jour le 26 avril 2026 · Sources : Conseil Supérieur du Notariat, ARC 2022, ADEME
          </span>
        </div>

        <ArticleCta
          title="Plus rapide qu'un Word, plus sûr qu'un modèle gratuit"
          description="Déposez vos PDF de copropriété, l'IA génère votre pré-état daté conforme CSN en 5 minutes. 24,99 €, satisfait ou remboursé."
          buttonText="Générer mon pré-état daté"
        />

        <RelatedArticles currentSlug={SLUG} />
      </article>
    </div>
  );
}
