import { Link } from 'react-router-dom';
import {
  Shield,
  Brain,
  Scale,
  Clock,
  Award,
  FileCheck,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';

const VALUES = [
  {
    icon: Scale,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Conformité juridique',
    description:
      'Chaque pré-état daté est conforme au modèle officiel du Conseil Supérieur du Notariat (CSN) et respecte les obligations de la loi ALUR (article L.721-2 du CCH).',
  },
  {
    icon: Brain,
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    title: 'Intelligence artificielle de pointe',
    description:
      'Notre pipeline IA (Gemini 2.5 Pro pour l\'extraction financière, Gemini 2.5 Flash pour les diagnostics) analyse vos documents en parallèle avec cross-validation automatique des tantièmes et des charges.',
  },
  {
    icon: Shield,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Sécurité et RGPD',
    description:
      'Vos documents sont chiffrés (TLS), stockés temporairement et supprimés automatiquement sous 7 jours. Paiement sécurisé via Stripe (PCI-DSS). Aucun compte utilisateur requis.',
  },
  {
    icon: Clock,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Rapidité',
    description:
      '5 minutes au lieu de 15 à 30 jours chez le syndic. L\'analyse parallèle de vos documents (financier + diagnostics simultanément) réduit le temps de traitement au minimum.',
  },
  {
    icon: Award,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    title: 'Garantie satisfait ou remboursé',
    description:
      'Si votre notaire refuse le document, nous vous remboursons intégralement sur présentation d\'un courrier motivé du notaire. Nous nous engageons sur la qualité.',
  },
  {
    icon: FileCheck,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    title: 'Vérification croisée',
    description:
      'L\'IA recalcule indépendamment les charges à partir des tantièmes et du budget, et vérifie le DPE via la base officielle ADEME. Toute incohérence est signalée avant validation.',
  },
];

export default function AProposPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="À propos de Pre-etat-date.ai — Notre mission"
        description="Pre-etat-date.ai automatise la création du pré-état daté pour les vendeurs de copropriété en France. Expertise juridique (loi ALUR), IA de pointe, conformité CSN."
        canonical="/a-propos"
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Accueil', url: '/' },
          { name: 'À propos' },
        ])}
      />

      <Breadcrumb
        items={[
          { label: 'Accueil', to: '/' },
          { label: 'À propos' },
        ]}
      />

      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
          Rendre le pré-état daté accessible à tous
        </h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto leading-relaxed">
          Pre-etat-date.ai est né d'un constat simple : les vendeurs de copropriété payent
          en moyenne 380 € et attendent 15 à 30 jours pour un document que l'IA peut générer
          en 5 minutes pour 24,99 €.
        </p>
      </section>

      {/* Notre mission */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
          Notre mission
        </h2>
        <div className="space-y-4 text-secondary-600 leading-relaxed">
          <p>
            Le pré-état daté est un document obligatoire lors de la vente d'un lot de copropriété
            en France (article L.721-2 du Code de la Construction et de l'Habitation, loi ALUR du 24 mars 2014).
            Il informe l'acquéreur sur la situation financière, juridique et technique de la copropriété.
          </p>
          <p>
            Traditionnellement, les vendeurs font appel à leur syndic pour l'établir, ce qui
            implique des délais de 2 à 4 semaines et des tarifs de 150 à 600 € (moyenne nationale
            de 380 €, source : étude ARC 2022). Pourtant, le Conseil Supérieur du Notariat (CSN)
            a confirmé que <strong>le vendeur n'est pas obligé de passer par le syndic</strong>.
          </p>
          <p>
            Pre-etat-date.ai automatise entièrement le processus : le vendeur dépose ses documents
            PDF de copropriété, notre intelligence artificielle extrait les données financières,
            juridiques et techniques, et génère un document conforme au modèle officiel du CSN
            en 10 pages.
          </p>
        </div>
      </section>

      {/* Expertise */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
          Notre expertise
        </h2>
        <div className="space-y-4 text-secondary-600 leading-relaxed">
          <p>
            Notre équipe combine une expertise en <strong>droit de la copropriété</strong> (loi ALUR,
            loi ELAN, décret du 17 mars 1967) et en <strong>intelligence artificielle appliquée
            à l'analyse documentaire</strong>. Cette double compétence nous permet de développer
            un service à la fois juridiquement rigoureux et techniquement performant.
          </p>
          <p>
            Le contenu de nos <Link to="/guide" className="text-primary-600 hover:text-primary-800 font-medium">guides pratiques</Link> est
            rédigé par notre équipe éditoriale, spécialisée en droit immobilier et copropriété.
            Chaque article est sourcé (lois, études ARC/UFC-Que Choisir, données RNIC/ANAH)
            et mis à jour régulièrement.
          </p>
        </div>
      </section>

      {/* Nos engagements */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-8 text-center">
          Nos engagements
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map(({ icon: Icon, iconBg, iconColor, title, description }) => (
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

      {/* Sources et transparence */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
          Sources et transparence
        </h2>
        <div className="space-y-4 text-secondary-600 leading-relaxed">
          <p>
            Nous croyons à la transparence des données. Nos articles et pages citent systématiquement
            leurs sources :
          </p>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Données copropriétés</strong> : Registre National des Copropriétés (RNIC), géré par l'ANAH (données 2024).</li>
            <li><strong>Tarifs syndic</strong> : étude ARC (Association des Responsables de Copropriété), 2022. Moyenne nationale de 380 €, fourchette 150-600 €.</li>
            <li><strong>Cadre juridique</strong> : loi ALUR du 24 mars 2014, loi ELAN du 23 novembre 2018, article L.721-2 du CCH, décret n°67-223 du 17 mars 1967.</li>
            <li><strong>Vérification DPE</strong> : base officielle ADEME (Agence de l'Environnement et de la Maîtrise de l'Énergie).</li>
          </ul>
        </div>
      </section>

      {/* Contact */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6">
          Contact
        </h2>
        <div className="text-secondary-600 leading-relaxed space-y-2">
          <p>
            <strong>Email</strong> :{' '}
            <a href="mailto:contact@pre-etat-date.ai" className="text-primary-600 hover:underline">
              contact@pre-etat-date.ai
            </a>
          </p>
          <p>
            <strong>Site</strong> :{' '}
            <a href="https://pre-etat-date.ai" className="text-primary-600 hover:underline">
              pre-etat-date.ai
            </a>
          </p>
          <p className="text-sm text-secondary-400 mt-4">
            Pour les informations légales complètes, consultez nos{' '}
            <Link to="/mentions-legales" className="text-primary-600 hover:underline">mentions légales</Link>,{' '}
            <Link to="/cgv" className="text-primary-600 hover:underline">CGV</Link> et{' '}
            <Link to="/politique-rgpd" className="text-primary-600 hover:underline">politique RGPD</Link>.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center bg-secondary-50 rounded-2xl p-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-3">
          Essayez Pre-etat-date.ai
        </h2>
        <p className="text-secondary-500 mb-6">
          Votre pré-état daté conforme CSN en 5 minutes, pour 24,99 €. Garantie satisfait ou remboursé.
        </p>
        <Button size="lg" asChild>
          <Link to="/dossier" className="gap-2">
            Commencer maintenant
            <ArrowRight className="h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
