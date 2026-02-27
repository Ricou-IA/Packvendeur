import { Link } from 'react-router-dom';
import { Upload, Brain, ClipboardCheck, FileText, ArrowRight, Lightbulb, CheckCircle, Clock } from 'lucide-react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';

const STEPS = [
  {
    number: 1,
    icon: Upload,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Rassemblez vos documents',
    description: (
      <>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La première étape consiste à rassembler les documents de votre copropriété. Voici les
          documents essentiels à fournir :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed mb-4">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>PV d'assemblée générale</strong> : les 3 derniers PV pour identifier les travaux votés, les procédures et les décisions de la copropriété.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Règlement de copropriété</strong> : document fondateur de la copropriété avec la répartition des charges et les tantièmes.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Appels de fonds</strong> : les appels de fonds récents pour connaître les charges courantes et exceptionnelles.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Relevés de charges</strong> : les 2 derniers exercices comptables pour les montants exacts des charges du lot.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Fiche synthétique</strong> : résumé de la copropriété (nombre de lots, syndic, budget).</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Diagnostics techniques</strong> : DPE, amiante, plomb, électricité, gaz, ERP, mesurage Carrez.</span>
          </li>
        </ul>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-amber-800">
            <strong>Astuce :</strong> Connectez-vous à l'extranet de votre syndic pour retrouver
            la plupart de ces documents. Vous pouvez aussi ajouter la taxe foncière et le bail si
            le bien est loué.
          </div>
        </div>
      </>
    ),
  },
  {
    number: 2,
    icon: Brain,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: "L'IA analyse vos documents",
    description: (
      <>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Une fois vos documents uploadés, notre intelligence artificielle (Google Gemini) les analyse
          automatiquement en deux phases :
        </p>
        <div className="space-y-4 mb-4">
          <div className="bg-secondary-50 rounded-lg p-4">
            <h4 className="font-semibold text-secondary-900 mb-2">Phase 1 : Classification</h4>
            <p className="text-secondary-600 text-sm leading-relaxed">
              L'IA identifie automatiquement le type de chaque document (PV d'AG, règlement de
              copropriété, DPE, appel de fonds, etc.). Cette étape est quasi instantanée.
            </p>
          </div>
          <div className="bg-secondary-50 rounded-lg p-4">
            <h4 className="font-semibold text-secondary-900 mb-2">Phase 2 : Extraction des données</h4>
            <p className="text-secondary-600 text-sm leading-relaxed">
              L'IA analyse l'ensemble de vos documents simultanément pour extraire toutes les données
              financières (budget, charges, fonds de travaux), juridiques (procédures, travaux votés)
              et techniques (diagnostics, DPE). Cette étape prend environ 5 minutes.
            </p>
          </div>
        </div>
        <p className="text-secondary-600 leading-relaxed">
          L'IA effectue également un <strong>recoupement automatique des tantièmes</strong> : elle
          calcule indépendamment vos charges à partir du budget prévisionnel et de vos tantièmes, puis
          compare le résultat avec les montants extraits des documents. Si un écart supérieur à 5% est
          détecté, une alerte vous est signalée.
        </p>
      </>
    ),
  },
  {
    number: 3,
    icon: ClipboardCheck,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Validez et complétez',
    description: (
      <>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Après l'analyse, vous accédez à un formulaire de validation complet. Toutes les données
          extraites par l'IA sont pré-remplies et organisées en sections :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed mb-4">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Informations du bien</strong> : adresse, lot, surface, copropriété, syndic.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Identité du vendeur</strong> : nom du ou des vendeurs.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Données financières</strong> : budget prévisionnel, tantièmes, charges courantes et exceptionnelles, fonds de travaux, impayés.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Situation juridique</strong> : procédures en cours, travaux votés non réalisés.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Diagnostics</strong> : DPE avec vérification automatique via l'API ADEME, et autres diagnostics.</span>
          </li>
        </ul>
        <p className="text-secondary-600 leading-relaxed">
          Vous pouvez modifier, corriger ou compléter chaque champ. La vérification DPE via l'ADEME
          vous permet de confirmer la validité et l'opposabilité de votre diagnostic énergétique en
          un clic.
        </p>
      </>
    ),
  },
  {
    number: 4,
    icon: FileText,
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-600',
    title: 'Recevez votre pack',
    description: (
      <>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Après validation et paiement (24,99 EUR par carte bancaire via Stripe), votre dossier
          complet est généré instantanément. <strong>Un seul document à transmettre au notaire</strong>,
          tout est dedans :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed mb-4">
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Pré-état daté complet conforme CSN</strong> : situation financière, vie de la copropriété, données techniques, procédures en cours, questionnaire vendeur et mentions légales.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Documents indexés en annexe</strong> : tous vos documents originaux (PV AG, règlement, diagnostics…) classés et nommés automatiquement. Le notaire retrouve tout en un clic.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
            <span><strong>Lien de partage sécurisé</strong> : transmettez un simple lien à votre notaire par email. Il consulte et télécharge le dossier directement — pas de pièces jointes, pas de va-et-vient.</span>
          </li>
        </ul>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3 mb-4">
          <Clock className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-green-800">
            <strong>Résultat :</strong> votre notaire reçoit un dossier complet et conforme en quelques minutes,
            au lieu de plusieurs semaines d'attente (et 380 € en moyenne) avec le syndic.
            Moins d'allers-retours = une vente plus rapide.
          </div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
          <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <strong>Important :</strong> Le lien de partage est valide 7 jours. Passé ce délai, vos
            données sont automatiquement supprimées conformément au RGPD. Pensez à télécharger le PDF
            pour vos archives.
          </div>
        </div>
      </>
    ),
  },
];

export default function CommentCaMarche() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Comment ça marche"
        description="Générez votre pré-état daté en 4 étapes simples : upload de documents, analyse IA, validation, livraison du PDF et lien de partage notaire."
        canonical="/comment-ca-marche"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: 'Comment générer un pré-état daté en ligne',
          description: 'Guide étape par étape pour générer votre pré-état daté en ligne avec Dossiervente.ai.',
          totalTime: 'PT10M',
          estimatedCost: { '@type': 'MonetaryAmount', currency: 'EUR', value: '24.99' },
          step: [
            { '@type': 'HowToStep', name: 'Rassemblez vos documents', text: 'Réunissez les PV AG, règlement de copropriété, appels de fonds, diagnostics techniques.' },
            { '@type': 'HowToStep', name: 'Déposez vos PDF', text: 'Glissez-déposez vos documents PDF sur la plateforme.' },
            { '@type': 'HowToStep', name: 'Analyse IA automatique', text: "L'intelligence artificielle classifie et extrait les données financières et juridiques." },
            { '@type': 'HowToStep', name: 'Validez les données', text: 'Vérifiez et complétez les informations extraites dans le formulaire.' },
            { '@type': 'HowToStep', name: 'Partagez avec le notaire', text: 'Recevez votre PDF conforme et transmettez le lien de partage sécurisé.' },
          ],
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Comment ça marche' },
        ])}
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Comment ça marche' },
        ]}
      />

      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-secondary-900 mb-4">Comment ça marche ?</h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto">
          Générez votre pré-état daté en 4 étapes simples
        </p>
      </div>

      <div className="space-y-8">
        {STEPS.map((step) => {
          const Icon = step.icon;
          return (
            <Card key={step.number}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${step.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-6 w-6 ${step.iconColor}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-primary-600 mb-1">Étape {step.number}</div>
                    <h2 className="text-xl font-semibold text-secondary-900">{step.title}</h2>
                  </div>
                </div>
                {step.description}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <section className="text-center bg-secondary-50 rounded-2xl p-8 mt-12">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
          Prêt à commencer ?
        </h2>
        <p className="text-secondary-500 mb-6">
          Votre pré-état daté en 5 minutes, pour seulement 24,99 EUR.
        </p>
        <Button size="lg" asChild>
          <Link to="/dossier" className="gap-2">
            Générer mon pré-état daté
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
