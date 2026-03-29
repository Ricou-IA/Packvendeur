import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Building2, Calendar } from 'lucide-react';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { articleSchema, breadcrumbSchema, faqSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';
import RelatedArticles from '@components/seo/RelatedArticles';

export default function DtgPptCopropriete() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="DTG et Plan Pluriannuel de Travaux (PPT) : obligations 2026"
        description="Le DTG et le PPT sont des documents techniques obligatoires en copropriété. Calendrier d'obligation, contenu, coût et impact sur la vente."
        canonical="/guide/dtg-ppt-copropriete-obligations"
        type="article"
      />
      <JsonLd data={articleSchema({
        title: "DTG et Plan Pluriannuel de Travaux (PPT) : obligations 2026",
        description: "Le DTG et le PPT sont des documents techniques obligatoires en copropriété. Calendrier d'obligation, contenu, coût et impact sur la vente.",
        slug: 'dtg-ppt-copropriete-obligations',
        datePublished: '2026-03-29',
      })} />
      <JsonLd data={breadcrumbSchema([
        { name: 'Accueil', url: '/' },
        { name: 'Guides', url: '/guide' },
        { name: 'DTG et PPT en copropriété' },
      ])} />

      <JsonLd data={faqSchema([
        {
          question: 'Le DTG est-il obligatoire dans toutes les copropriétés ?',
          answer: "Le DTG (Diagnostic Technique Global) n'est pas obligatoire dans toutes les copropriétés. Il est imposé lors de la mise en copropriété d'un immeuble de plus de 10 ans, ou lorsque l'administration le demande dans le cadre d'une procédure d'insalubrité. En dehors de ces cas, le DTG est facultatif mais peut être voté en assemblée générale à la majorité simple (article 24). En revanche, le PPT (Plan Pluriannuel de Travaux) est obligatoire depuis 2025 pour toutes les copropriétés de plus de 15 ans.",
        },
        {
          question: 'Qui paie le DTG et le PPT ?',
          answer: "Le coût du DTG et du PPT est réparti entre tous les copropriétaires selon leurs tantièmes de charges générales. Le DTG coûte entre 5 000 et 15 000 EUR selon la taille de l'immeuble, et le PPT entre 3 000 et 8 000 EUR s'il est réalisé indépendamment. Souvent, le PPT est inclus dans la prestation du DTG. Le vote des travaux préconisés par le PPT fait ensuite l'objet d'appels de fonds spécifiques.",
        },
        {
          question: 'Le PPT figure-t-il dans le pré-état daté ?',
          answer: "Oui, le pré-état daté doit mentionner l'existence d'un Plan Pluriannuel de Travaux adopté par la copropriété. Les travaux programmés et leur échéancier y sont indiqués, permettant à l'acquéreur d'anticiper les futures dépenses. Si le PPT n'a pas encore été réalisé alors qu'il est obligatoire, cette information doit également figurer dans le pré-état daté. Pre-etat-date.ai intègre automatiquement ces données lorsque le document est fourni.",
        },
      ])} />

      <Breadcrumb items={[
        { label: 'Accueil', to: '/' },
        { label: 'Guides', to: '/guide' },
        { label: 'DTG et PPT en copropriété' },
      ]} />

      <article>
        <h1 className="text-3xl font-bold text-secondary-900 mb-6">
          DTG et Plan Pluriannuel de Travaux (PPT) : obligations 2026
        </h1>

        <div className="flex items-center gap-4 text-sm text-secondary-500 mb-6 mt-2">
          <time dateTime="2026-03-29">Mis à jour le 29 mars 2026</time>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            8 min de lecture
          </span>
        </div>

        {/* Key facts box */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-primary-800 mb-3">
            L'essentiel en bref
          </h2>
          <dl className="space-y-2 text-sm text-secondary-700">
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">DTG :</dt>
              <dd>Diagnostic Technique Global, analyse l'état de l'immeuble</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">PPT :</dt>
              <dd>Plan Pluriannuel de Travaux sur 10 ans</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Obligation PPT :</dt>
              <dd>Progressive : +200 lots (2023), +50 lots (2024), toutes copropriétés +15 ans (2025)</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Coût DTG :</dt>
              <dd>5 000 à 15 000 EUR selon la taille de l'immeuble</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-semibold min-w-[160px]">Impact vente :</dt>
              <dd>Mentionné dans le pré-état daté (travaux programmés, échéancier)</dd>
            </div>
          </dl>
        </div>

        <p className="text-secondary-600 leading-relaxed mb-4">
          Le DTG (Diagnostic Technique Global) et le PPT (Plan Pluriannuel de Travaux) sont deux
          outils complémentaires qui permettent d'évaluer l'état d'un immeuble en copropriété et de
          planifier les travaux nécessaires sur 10 ans. Depuis la loi Climat et Résilience de 2021,
          le PPT est devenu progressivement obligatoire pour toutes les copropriétés. Ces documents
          ont un impact direct sur la vente, car ils informent l'acquéreur des travaux à venir.
        </p>

        {/* What is DTG */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qu'est-ce que le DTG (Diagnostic Technique Global) ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le DTG est un audit technique complet de l'immeuble, réalisé par un bureau d'études
          spécialisé. Il analyse l'état des parties communes, les performances énergétiques, la
          conformité aux normes en vigueur et identifie les travaux nécessaires.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Concrètement, le DTG comprend :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>Un état des lieux des parties communes et des équipements collectifs (toiture, facades, canalisations, ascenseurs).</li>
          <li>Un diagnostic de performance énergétique collectif (DPE immeuble).</li>
          <li>Une analyse des améliorations possibles en matière de transition énergétique.</li>
          <li>Une estimation du coût des travaux nécessaires sur 10 ans.</li>
          <li>Une liste des travaux à entreprendre par ordre de priorité.</li>
        </ul>

        {/* What is PPT */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Qu'est-ce que le PPT (Plan Pluriannuel de Travaux) ?
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le PPT est un programme de travaux sur 10 ans, élaboré à partir du DTG ou d'une analyse
          technique équivalente. Il détaille les interventions prévues, leur coût estimé et leur
          échéancier. Le PPT est voté en assemblée générale et sert de base pour constituer le
          fonds de travaux de la copropriété.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Contrairement au DTG qui est un diagnostic, le PPT est un document de planification
          opérationnel : il engage la copropriété sur un programme d'investissements concret.
        </p>

        {/* Comparison table */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          DTG vs PPT : comparatif détaillé
        </h2>
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Critère</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">DTG</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">PPT</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Objectif</td>
                <td className="border border-secondary-200 px-4 py-3">Évaluer l'état technique de l'immeuble</td>
                <td className="border border-secondary-200 px-4 py-3">Planifier les travaux sur 10 ans</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Obligatoire</td>
                <td className="border border-secondary-200 px-4 py-3">Mise en copropriété +10 ans / vote AG</td>
                <td className="border border-secondary-200 px-4 py-3">Toutes copropriétés +15 ans (depuis 2025)</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Réalisé par</td>
                <td className="border border-secondary-200 px-4 py-3">Bureau d'études technique</td>
                <td className="border border-secondary-200 px-4 py-3">Syndic sur base du DTG</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Contenu</td>
                <td className="border border-secondary-200 px-4 py-3">État des parties communes, performances énergétiques</td>
                <td className="border border-secondary-200 px-4 py-3">Programme travaux + estimation coûts + échéancier</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Coût</td>
                <td className="border border-secondary-200 px-4 py-3">5 000 à 15 000 EUR</td>
                <td className="border border-secondary-200 px-4 py-3">Inclus dans le DTG ou 3 000 à 8 000 EUR</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3 font-medium">Durée de validité</td>
                <td className="border border-secondary-200 px-4 py-3">10 ans</td>
                <td className="border border-secondary-200 px-4 py-3">10 ans</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3 font-medium">Impact sur la vente</td>
                <td className="border border-secondary-200 px-4 py-3">Mentionné dans le pré-état daté</td>
                <td className="border border-secondary-200 px-4 py-3">Anticipe les charges futures pour l'acheteur</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Progressive obligation */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Calendrier d'obligation progressive du PPT
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La loi Climat et Résilience du 22 août 2021 a instauré l'obligation du PPT de manière
          progressive, selon la taille de la copropriété :
        </p>
        <div className="space-y-4 mb-6">
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <Calendar className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">1er janvier 2023</h3>
              <p className="text-sm text-secondary-600">
                Copropriétés de plus de 200 lots (y compris lots annexes : caves, parkings).
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-secondary-50 border border-secondary-200 rounded-lg p-4">
            <Calendar className="h-5 w-5 text-secondary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-secondary-800 mb-1">1er janvier 2024</h3>
              <p className="text-sm text-secondary-600">
                Copropriétés de 51 à 200 lots.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 bg-primary-50 border border-primary-200 rounded-lg p-4">
            <Calendar className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-primary-800 mb-1">1er janvier 2025</h3>
              <p className="text-sm text-secondary-600">
                Toutes les copropriétés de plus de 15 ans, quelle que soit leur taille. C'est
                l'étape finale : en 2026, toutes les copropriétés concernées doivent avoir adopté un PPT.
              </p>
            </div>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les copropriétés de moins de 15 ans ne sont pas concernées par cette obligation. De même,
          si le DTG conclut à l'absence de travaux nécessaires sur les 10 prochaines années, le PPT
          n'est pas requis.
        </p>

        {/* Impact on sale */}
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">
          Impact du DTG et du PPT sur la vente
        </h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Lors de la vente d'un lot en copropriété, le DTG et le PPT jouent un rôle important
          dans l'information de l'acquéreur. Le pré-état daté doit mentionner :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc mb-4">
          <li>L'existence ou non d'un DTG et d'un PPT adoptés par la copropriété.</li>
          <li>Les travaux programmés dans le PPT et leur échéancier prévisionnel.</li>
          <li>Les montants estimés et la quote-part du lot vendu.</li>
          <li>Le montant du fonds de travaux et les cotisations annuelles votées.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pour l'acheteur, ces informations sont déterminantes : elles lui permettent d'anticiper
          les appels de fonds à venir et d'intégrer ces coûts dans son budget d'acquisition.
          Un PPT prévoyant un ravalement de facade à 50 000 EUR dans 2 ans peut représenter
          plusieurs milliers d'euros de charges supplémentaires selon
          les <Link to="/guide/tantiemes-copropriete-calcul" className="text-primary-600 hover:text-primary-800 font-medium">tantièmes du lot</Link>.
        </p>

        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-secondary-800 mb-1">DTG et PPT intégrés dans votre pré-état daté</h3>
            <p className="text-sm text-secondary-600">
              Pre-etat-date.ai analyse automatiquement le DTG et le PPT si vous les fournissez.
              Les travaux programmés, les montants estimés et l'échéancier sont extraits et intégrés
              dans votre pré-état daté, conforme au modèle du Conseil Supérieur du Notariat.
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
              Le DTG est-il obligatoire dans toutes les copropriétés ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Non, le DTG n'est obligatoire que lors de la mise en copropriété d'un immeuble de plus
              de 10 ans ou sur demande de l'administration (procédure d'insalubrité). En dehors de ces
              cas, il peut être voté en AG à la majorité simple. En revanche, le PPT est désormais
              obligatoire pour toutes les copropriétés de plus de 15 ans depuis le 1er janvier 2025.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Qui paie le DTG et le PPT ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Le coût est réparti entre tous les copropriétaires selon
              leurs <Link to="/guide/tantiemes-copropriete-calcul" className="text-primary-600 hover:text-primary-800 font-medium">tantièmes</Link> de
              charges générales. Le DTG coûte entre 5 000 et 15 000 EUR et le PPT entre 3 000 et
              8 000 EUR s'il est réalisé séparément. Pour en savoir plus sur les
              charges, consultez notre <Link to="/guide/charges-copropriete-evolution-syndic" className="text-primary-600 hover:text-primary-800 font-medium">enquête sur les charges de copropriété</Link>.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              Le PPT figure-t-il dans le pré-état daté ?
            </h3>
            <p className="text-secondary-600 leading-relaxed">
              Oui, le pré-état daté doit mentionner l'existence d'un PPT et les travaux programmés.
              Si le PPT n'a pas encore été réalisé alors qu'il est obligatoire, cette information
              doit également y figurer. Pre-etat-date.ai intègre automatiquement ces données
              pour générer un document conforme. Consultez
              notre guide <Link to="/guide/quest-ce-pre-etat-date" className="text-primary-600 hover:text-primary-800 font-medium">qu'est-ce qu'un pré-état daté</Link> pour
              en savoir plus.
            </p>
          </div>
        </div>

        <RelatedArticles currentSlug="dtg-ppt-copropriete-obligations" />

        {/* CTA */}
        <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
            Intégrez votre DTG et PPT dans le pré-état daté
          </h2>
          <p className="text-secondary-500 mb-6">
            24,99 EUR, prêt en 5 minutes. L'IA analyse vos documents techniques automatiquement.
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
