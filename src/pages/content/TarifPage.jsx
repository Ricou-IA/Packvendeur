import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle,
  X,
  Shield,
  FileCheck,
  Scale,
  CreditCard,
  Clock,
  Brain,
  Share2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import PageMeta from '@components/seo/PageMeta';
import JsonLd, { breadcrumbSchema, faqSchema, productSchema } from '@components/seo/JsonLd';
import Breadcrumb from '@components/seo/Breadcrumb';

const INCLUSIONS = [
  'Analyse IA de tous vos documents de copropriété',
  'Classification automatique des pièces',
  'Extraction financière et juridique complète',
  'Cross-validation des tantièmes et charges',
  'Vérification DPE via API ADEME',
  'PDF conforme au modèle CSN (Conseil Supérieur du Notariat)',
  'Lien de partage sécurisé pour le notaire',
  'Documents originaux indexés en annexe',
];

const COMPARISON = [
  {
    criteria: 'Prix',
    us: '24,99 EUR',
    syndic: '150 - 600 EUR',
    online: '50 - 150 EUR',
    diy: 'Gratuit',
  },
  {
    criteria: 'Délai',
    us: '5 minutes',
    syndic: '15 - 30 jours',
    online: '24 - 72 h',
    diy: 'Plusieurs jours',
  },
  {
    criteria: 'Conformité CSN',
    us: true,
    syndic: true,
    online: 'Partielle',
    diy: false,
  },
  {
    criteria: 'Analyse IA',
    us: true,
    syndic: false,
    online: false,
    diy: false,
  },
  {
    criteria: 'Partage notaire',
    us: true,
    syndic: false,
    online: 'Parfois',
    diy: false,
  },
  {
    criteria: 'Cross-validation',
    us: true,
    syndic: false,
    online: false,
    diy: false,
  },
];

const FAQ_ITEMS = [
  {
    question: 'Y a-t-il des frais cachés ou un abonnement ?',
    answer:
      'Non. Le tarif de 24,99 EUR est un paiement unique par dossier. Pas d\'abonnement, pas de frais supplémentaires. Vous payez une seule fois et recevez votre pré-état daté complet immédiatement.',
  },
  {
    question: 'Quels moyens de paiement sont acceptés ?',
    answer:
      'Nous acceptons les cartes bancaires (Visa, Mastercard, CB), Apple Pay et Google Pay. Le paiement est sécurisé par Stripe, leader mondial du paiement en ligne. La procédure 3D Secure est supportée.',
  },
  {
    question: 'Puis-je obtenir un remboursement ?',
    answer:
      'Oui. Nous proposons une garantie satisfait ou remboursé : si votre notaire refuse le pré-état daté, nous vous remboursons intégralement sur présentation d\'un courrier du notaire motivant son refus. Pour tout défaut technique, contactez-nous à contact@pre-etat-date.ai.',
  },
];

function CellIcon({ value }) {
  if (value === true) return <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />;
  if (value === false) return <X className="h-5 w-5 text-red-400 mx-auto" />;
  return <span className="text-sm text-secondary-600">{value}</span>;
}

export default function TarifPage() {
  const [syndicPrice, setSyndicPrice] = useState(380);
  const savings = syndicPrice - 24.99;
  const savingsPercent = Math.round((savings / syndicPrice) * 100);

  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Tarif pré-état daté en ligne : 24,99 EUR — Comparatif 2026"
        description="Pré-état daté à 24,99 EUR au lieu de 380 EUR chez le syndic. Comparatif complet des tarifs, pas de frais cachés, paiement unique. Économisez jusqu'à 93 %."
        canonical="/tarif"
      />
      <JsonLd data={productSchema()} />
      <JsonLd
        data={breadcrumbSchema([
          { name: 'Pré-état daté', url: '/' },
          { name: 'Tarif' },
        ])}
      />
      <JsonLd data={faqSchema(FAQ_ITEMS)} />

      <Breadcrumb
        items={[
          { label: 'Pré-état daté', to: '/' },
          { label: 'Tarif' },
        ]}
      />

      {/* Hero */}
      <section className="text-center mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
          Votre pré-état daté pour{' '}
          <span className="text-primary-600">24,99 EUR</span>
        </h1>
        <p className="text-lg text-secondary-500 max-w-2xl mx-auto mb-6">
          Un tarif unique, sans abonnement ni frais cachés. Paiement sécurisé par carte bancaire via Stripe.
        </p>
        <div className="inline-flex items-center gap-3 bg-primary-50 border border-primary-200 rounded-xl px-6 py-4">
          <span className="text-4xl font-bold text-primary-700">24,99 EUR</span>
          <div className="text-left">
            <div className="text-sm font-medium text-primary-700">TTC — paiement unique</div>
            <div className="text-xs text-primary-500">Au lieu de 380 EUR en moyenne chez le syndic</div>
          </div>
        </div>
      </section>

      {/* Ce qui est inclus */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Ce qui est inclus
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {INCLUSIONS.map((item) => (
            <div key={item} className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span className="text-secondary-700 text-sm">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Comparatif des solutions
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b border-secondary-200">
                <th className="text-left py-3 px-3 text-secondary-500 font-medium" />
                <th className="py-3 px-3 text-center">
                  <div className="font-semibold text-primary-700">Pre-etat-date.ai</div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div className="font-semibold text-secondary-700">Syndic</div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div className="font-semibold text-secondary-700">Autres services</div>
                </th>
                <th className="py-3 px-3 text-center">
                  <div className="font-semibold text-secondary-700">Gratuit (DIY)</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON.map((row) => (
                <tr key={row.criteria} className="border-b border-secondary-100">
                  <td className="py-3 px-3 font-medium text-secondary-700">{row.criteria}</td>
                  <td className="py-3 px-3 text-center bg-primary-50/50">
                    <CellIcon value={row.us} />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <CellIcon value={row.syndic} />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <CellIcon value={row.online} />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <CellIcon value={row.diy} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Savings calculator */}
      <section className="mb-16">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold text-secondary-900 mb-2 text-center">
              Calculez vos économies
            </h2>
            <p className="text-secondary-500 text-center mb-6 text-sm">
              Déplacez le curseur pour indiquer le tarif de votre syndic
            </p>
            <div className="max-w-md mx-auto">
              <label className="flex items-center justify-between text-sm text-secondary-600 mb-2">
                <span>Tarif syndic</span>
                <span className="font-semibold text-secondary-900">{syndicPrice} EUR</span>
              </label>
              <input
                type="range"
                min={150}
                max={600}
                step={10}
                value={syndicPrice}
                onChange={(e) => setSyndicPrice(Number(e.target.value))}
                className="w-full accent-primary-600 mb-6"
              />
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">{savings.toFixed(2)} EUR</div>
                  <div className="text-xs text-green-600 mt-1">Économie réalisée</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-700">-{savingsPercent} %</div>
                  <div className="text-xs text-green-600 mt-1">Moins cher que le syndic</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Garanties */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Nos garanties
        </h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: Scale, title: 'Conforme loi ALUR', desc: 'Respecte les obligations légales de la loi ALUR pour la vente en copropriété.' },
            { icon: FileCheck, title: 'Modèle CSN', desc: 'PDF structuré selon le modèle du Conseil Supérieur du Notariat.' },
            { icon: Shield, title: 'RGPD', desc: 'Vos données sont automatiquement supprimées sous 7 jours après génération.' },
            { icon: CreditCard, title: 'Paiement Stripe', desc: 'Paiement sécurisé par Stripe avec 3D Secure, Apple Pay et Google Pay.' },
            { icon: Shield, title: 'Satisfait ou remboursé', desc: 'Si votre notaire refuse le document, nous vous remboursons intégralement sur présentation d\'un courrier motivé.' },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 mb-1">{title}</h3>
                  <p className="text-sm text-secondary-500">{desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold text-secondary-900 mb-6 text-center">
          Questions fréquentes sur le tarif
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
          Prêt à économiser sur votre pré-état daté ?
        </h2>
        <p className="text-secondary-500 mb-6">
          24,99 EUR au lieu de 380 EUR en moyenne. Résultat en 5 minutes.
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
