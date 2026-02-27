import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema } from '@components/seo/JsonLd';

export default function TantiemesCopropriete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Tantièmes de copropriété : calcul et répartition des charges"
        description="Comprendre les tantièmes de copropriété : définition, calcul, répartition des charges générales et spéciales, et impact sur la vente."
        canonical="/guide/tantiemes-copropriete-calcul"
        type="article"
      />
      <JsonLd
        data={articleSchema({
          title: 'Tantièmes de copropriété : calcul et répartition des charges',
          description: 'Comprendre les tantièmes de copropriété : définition, calcul, répartition des charges générales et spéciales, et impact sur la vente.',
          slug: 'tantiemes-copropriete-calcul',
          datePublished: '2026-02-20',
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Guides', url: '/guide' },
          { name: 'Tantièmes de copropriété' },
        ])}
      />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          Tantièmes de copropriété : calcul et répartition des charges
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-02-20">Mis à jour le 20 février 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            7 min de lecture
          </span>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Les tantièmes de copropriété sont au coeur du fonctionnement de toute copropriété en France.
          Ils déterminent la quote-part de chaque copropriétaire dans les parties communes et servent
          de base au calcul des charges. Pour le vendeur, bien comprendre les tantièmes est essentiel
          car ils figurent en bonne place dans le pré-état daté et conditionnent les montants financiers
          communiqués à l'acquéreur.
        </p>

        {/* Definition */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qu'est-ce qu'un tantième de copropriété ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Un tantième est une fraction qui représente la part de propriété d'un lot dans l'ensemble de
          la copropriété. L'article 5 de la loi du 10 juillet 1965 dispose que la quote-part des parties
          communes afférente à chaque lot est proportionnelle à la valeur relative de chaque partie
          privative par rapport à l'ensemble des valeurs de ces parties.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Concrètement, si une copropriété compte 10 000 tantièmes au total et que votre appartement
          dispose de 250 tantièmes, vous détenez 2,5 % des parties communes. On parle aussi de
          millièmes lorsque le total est de 1 000, mais le terme générique reste « tantièmes ».
        </p>

        {/* Calcul */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Comment sont calculés les tantièmes ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le calcul des tantièmes est effectué par un géomètre-expert lors de la mise en copropriété
          de l'immeuble. Plusieurs critères entrent en jeu :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>La superficie</strong> du lot (surface habitable ou surface Carrez).</li>
          <li><strong>L'étage</strong> : un appartement en étage élevé avec vue dégagée aura généralement plus de tantièmes qu'un rez-de-chaussée.</li>
          <li><strong>L'exposition et la luminosité</strong> : un lot orienté sud vaudra plus de tantièmes qu'un lot orienté nord.</li>
          <li><strong>La nature du lot</strong> : un appartement principal génère plus de tantièmes qu'une cave ou un parking.</li>
          <li><strong>Le confort et l'agencement</strong> : qualité des matériaux, nombre de pièces, accès à un balcon ou une terrasse.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le résultat est consigné dans l'<strong>état descriptif de division (EDD)</strong>, document
          annexé au règlement de copropriété. Chaque lot y est décrit avec son numéro, sa nature, son
          étage et sa quote-part en tantièmes. Il ne peut être modifié que par un vote en assemblée
          générale à la majorité de l'article 26.
        </p>

        {/* Charges generales vs speciales */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Tantièmes et répartition des charges : générales vs spéciales
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La loi distingue deux types de charges en copropriété, chacune répartie selon des clés
          différentes :
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Les charges générales (article 10 alinéa 2)
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Elles couvrent la conservation, l'entretien et l'administration des parties communes :
          assurance de l'immeuble, honoraires du syndic, travaux de ravalement, entretien des espaces
          verts, etc. Ces charges sont réparties en fonction des <strong>tantièmes généraux</strong>
          de chaque lot, tels que définis dans l'état descriptif de division.
        </p>

        <h3 className="text-lg font-semibold text-secondary-800 mt-6 mb-2">
          Les charges spéciales (article 10 alinéa 3)
        </h3>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Elles concernent les services collectifs et les équipements communs : ascenseur, chauffage
          collectif, eau chaude, gardiennage. Ces charges sont réparties en fonction de l'utilité
          objective que l'équipement présente pour chaque lot. Un copropriétaire au rez-de-chaussée
          participera moins aux charges d'ascenseur qu'un copropriétaire au 6e étage. Des
          <strong> clés de répartition spéciales</strong> sont alors définies dans le règlement de
          copropriété.
        </p>

        {/* Ou trouver */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Où trouver les tantièmes de votre lot ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les tantièmes de votre lot figurent dans plusieurs documents :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li><strong>L'état descriptif de division</strong> : c'est la source officielle. Ce document est publié au service de la publicité foncière.</li>
          <li><strong>Votre acte de vente (titre de propriété)</strong> : il reprend la désignation du lot avec ses tantièmes.</li>
          <li><strong>Les appels de fonds du syndic</strong> : ils mentionnent généralement les tantièmes du lot et le total de la copropriété.</li>
          <li><strong>La fiche synthétique de la copropriété</strong> : elle indique le nombre total de tantièmes.</li>
          <li><strong>L'extranet du syndic</strong> : la plupart des syndics affichent les tantièmes dans l'espace copropriétaire en ligne.</li>
        </ul>

        {/* Role dans le pre-etat date */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Le rôle des tantièmes dans le pré-état daté
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté, prévu par l'article L.721-2 du Code de la Construction et de l'Habitation,
          doit obligatoirement mentionner les informations financières relatives au lot vendu. Les
          tantièmes y jouent un rôle central car ils permettent de calculer la quote-part du lot dans
          les différentes charges de la copropriété.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le calcul est simple : <strong>charges du lot = (tantièmes du lot / tantièmes totaux) x
          budget prévisionnel annuel</strong>. Par exemple, pour un lot de 250 tantièmes sur 10 000
          avec un budget de 80 000 EUR, les charges annuelles sont de (250 / 10 000) x 80 000 =
          2 000 EUR.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Ce recoupement entre tantièmes, budget prévisionnel et charges est essentiel. Un écart
          important entre les charges calculées via les tantièmes et les charges réellement appelées
          par le syndic peut révéler une erreur dans les tantièmes, une clé de répartition spéciale,
          ou des charges exceptionnelles non identifiées. C'est précisément ce type de vérification
          que Pack Vendeur effectue automatiquement grâce à son analyse IA.
        </p>

        {/* Modification des tantiemes */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Peut-on modifier les tantièmes ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La modification des tantièmes est possible mais encadrée. Elle nécessite un vote en assemblée
          générale à la majorité de l'article 26 (double majorité : majorité des copropriétaires
          représentant au moins les deux tiers des voix). En pratique, les tantièmes sont modifiés
          dans les situations suivantes :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Division ou réunion de lots.</li>
          <li>Changement de destination d'un lot (local commercial transformé en habitation).</li>
          <li>Vente de parties communes à un copropriétaire (droit de surélévation, annexion d'un couloir).</li>
          <li>Erreur manifeste dans la répartition initiale (recours judiciaire possible sous 5 ans).</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Toute modification doit être actée par un géomètre-expert et publiée au service de la
          publicité foncière. Les nouveaux tantièmes s'appliquent alors pour le calcul des charges
          à compter de l'exercice suivant.
        </p>

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Vérifiez automatiquement vos tantièmes et charges
          </h2>
          <p className="text-secondary-500 mb-6">
            Pack Vendeur recalcule vos charges à partir des tantièmes et du budget prévisionnel
            pour détecter toute incohérence avant la vente.
          </p>
          <Button size="lg" asChild>
            <Link to="/dossier" className="gap-2">
              Générer mon pré-état daté
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </section>

        {/* Liens connexes */}
        <div className="mt-8 pt-6 border-t border-secondary-200">
          <h3 className="text-sm font-semibold text-secondary-500 uppercase tracking-wider mb-3">
            Articles connexes
          </h3>
          <ul className="space-y-2">
            <li>
              <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:text-primary-700 hover:underline">
                Qu'est-ce que le pré-état daté ?
              </Link>
            </li>
            <li>
              <Link to="/guide/cout-pre-etat-date-syndic" className="text-primary-600 hover:text-primary-700 hover:underline">
                Coût du pré-état daté : syndic vs en ligne
              </Link>
            </li>
          </ul>
        </div>
      </article>
    </div>
  );
}
