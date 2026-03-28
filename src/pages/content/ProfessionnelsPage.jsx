import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Zap,
  PiggyBank,
  ShieldCheck,
  Share2,
  Upload,
  Brain,
  FileText,
  Clock,
  Trophy,
  Users,
  Star,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema, faqSchema, serviceSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';

const BENEFITS = [
  {
    icon: Zap,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Rapidité',
    description:
      'Générez un pré-état date en 5 minutes au lieu d\'attendre 15 à 30 jours le syndic. Accélérez chaque transaction.',
  },
  {
    icon: PiggyBank,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    title: 'Coût réduit',
    description:
      '24,99 EUR par dossier contre 380 EUR en moyenne chez le syndic. Un argument de poids pour vos clients vendeurs.',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Fiabilité',
    description:
      'Analyse IA avec cross-validation des tantièmes, vérification DPE via ADEME et conformité au modèle CSN du Conseil Supérieur du Notariat.',
  },
  {
    icon: Share2,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'Partage notaire',
    description:
      'Transmettez un lien sécurisé au notaire en un clic. Fini les pieces jointes, les relances et les dossiers incomplets.',
  },
];

const STEPS = [
  {
    number: 1,
    icon: Upload,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Déposez les documents',
    description:
      'Récupérez les documents sur l\'extranet du syndic de votre client et déposez-les sur la plateforme. Classification automatique par l\'IA.',
  },
  {
    number: 2,
    icon: Brain,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'L\'IA extrait les données',
    description:
      'L\'intelligence artificielle analyse l\'ensemble des documents en parallele : données financières, juridiques, diagnostics. Cross-validation automatique.',
  },
  {
    number: 3,
    icon: FileText,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Validez et partagez',
    description:
      'Vérifiez les données pré-remplies, payez 24,99 EUR et partagez le lien sécurisé au notaire. Le dossier complet est prêt en quelques minutes.',
  },
];

const ADVANTAGES = [
  {
    icon: Clock,
    title: 'Gagnez du temps sur chaque vente',
    description:
      'Plus besoin d\'attendre le syndic. Le pre-etat date est prêt avant même la signature du compromis. Vos ventes avancent plus vite.',
  },
  {
    icon: Trophy,
    title: 'Remportez plus de mandats',
    description:
      'Proposez a vos vendeurs une solution rapide et économique. Un service différenciant qui renforce votre valeur ajoutee.',
  },
  {
    icon: Users,
    title: 'Impressionnez vos clients',
    description:
      'Un dossier complet, conforme et professionnel en 5 minutes. Vos vendeurs et les notaires apprécient la réactivité.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sophie M.',
    role: 'Agent immobilier, Lyon',
    text: 'J\'utilise Pre-etat-date.ai pour toutes mes ventes en copropriété. Le gain de temps est considerable et mes clients sont ravis de l\'économie.',
    rating: 5,
  },
  {
    name: 'Thomas R.',
    role: 'Mandataire, Paris',
    text: 'Le lien de partage notaire est un vrai plus. Fini les allers-retours de pieces jointes. Le notaire a tout en un clic.',
    rating: 5,
  },
];

const FAQ_ITEMS = [
  {
    question: 'Le pre-etat date généré est-il accepté par les notaires ?',
    answer:
      'Oui. Le document est conforme au modèle du Conseil Supérieur du Notariat (CSN) et respecte les obligations de la loi ALUR. Les notaires l\'acceptent au même titre qu\'un pre-etat date du syndic.',
  },
  {
    question: 'Proposez-vous un tarif pour les professionnels a volume ?',
    answer:
      'Le tarif est de 24,99 EUR par dossier pour tous les utilisateurs, professionnels inclus. Aucun abonnement ni engagement. Vous payez uniquement les dossiers que vous générez.',
  },
  {
    question: 'Comment transmettre le dossier au notaire ?',
    answer:
      'Apres génération, vous recevez un lien de partage sécurisé valable 7 jours. Copiez-le et envoyéz-le par email au notaire. Il peut consulter et télécharger le pre-etat date et toutes les pieces annexees sans creer de compte.',
  },
];

export default function ProfessionnelsPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Pre-etat date pour professionnels de l'immobilier"
        description="Agents immobiliers, mandataires, notaires : générez vos pre-etats dates en 5 min pour 24,99 EUR. Accélérez vos ventes en copropriété avec l'IA."
        canonical="/professionnels"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'Professionnels' },
        ])}
      />
      <JsonLd data={faqSchema(FAQ_ITEMS)} />
      <JsonLd
        data={serviceSchema({
          areaName: 'France',
          areaType: 'Country',
          url: '/professionnels',
        })}
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'Professionnels' },
        ]}
      />

      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-block bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1 rounded-full mb-4">
          Agents immobiliers, mandataires, notaires
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
          Accélérez vos ventes en copropriété
        </h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto mb-6">
          Générez le pre-etat date de vos clients en 5 minutes pour 24,99 EUR.
          Fini les semaines d'attente et les factures de syndic à 380 EUR.
        </p>
        <Button size="lg" asChild>
          <Link to="/dossier" className="gap-2">
            Générer un pre-etat date
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </section>

      {/* Benefits */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Pourquoi les professionnels choisissent Pre-etat-date.ai
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {BENEFITS.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
            <Card key={title}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900 mb-1">{title}</h3>
                    <p className="text-sm text-secondary-500 leading-relaxed">{description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Comment ca marché pour vous
        </h2>
        <div className="space-y-4">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-lg ${step.iconBg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`h-6 w-6 ${step.iconColor}`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-primary-600 mb-1">Étape {step.number}</div>
                      <h3 className="text-lg font-semibold text-secondary-900 mb-2">{step.title}</h3>
                      <p className="text-secondary-500 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Advantages */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Vos avantages
        </h2>
        <div className="grid gap-4">
          {ADVANTAGES.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4 bg-secondary-50 rounded-lg p-5">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                <Icon className="h-5 w-5 text-primary-600" />
              </div>
              <div>
                <h3 className="font-semibold text-secondary-900 mb-1">{title}</h3>
                <p className="text-sm text-secondary-500 leading-relaxed">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Ils nous font confiance
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-secondary-600 text-sm leading-relaxed mb-4 italic">
                  "{t.text}"
                </p>
                <div>
                  <div className="font-medium text-secondary-900 text-sm">{t.name}</div>
                  <div className="text-xs text-secondary-400">{t.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Questions fréquentes
        </h2>
        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <Card key={i}>
              <CardContent className="pt-4 pb-4">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <span className="font-medium text-secondary-900">{item.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 text-secondary-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-secondary-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <p className="text-secondary-600 text-sm mt-3 leading-relaxed">
                    {item.answer}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-secondary-50 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
          Prêt a accélérer vos ventes ?
        </h2>
        <p className="text-secondary-500 mb-6">
          Générez votre premier pre-etat date en 5 minutes. 24,99 EUR par dossier, sans engagement.
        </p>
        <Button size="lg" asChild>
          <Link to="/dossier" className="gap-2">
            Générer un pre-etat date
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
