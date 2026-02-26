import PageMeta from '@components/seo/PageMeta';

export default function PolitiqueRgpdPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Politique de confidentialité"
        description="Politique de confidentialité et protection des données personnelles de Pack Vendeur. RGPD, droits des utilisateurs, sous-traitants."
        canonical="/politique-rgpd"
      />

      <h1 className="text-3xl font-bold text-secondary-900 mb-8">
        Politique de confidentialité et protection des données
      </h1>

      {/* Responsable du traitement */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Responsable du traitement</h2>
        <div className="text-secondary-600 leading-relaxed space-y-2">
          <p><strong>Pack Vendeur</strong></p>
          <p>
            Email : <a href="mailto:contact@pack-vendeur.fr" className="text-primary-600 hover:underline">contact@pack-vendeur.fr</a>
          </p>
          <p>
            Le responsable du traitement est en charge de la collecte et du traitement des données
            personnelles dans le cadre de l'utilisation du service Pack Vendeur.
          </p>
        </div>
      </section>

      {/* Donnees collectees */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Données collectées</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Dans le cadre de l'utilisation du service, les données suivantes sont collectées :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc">
          <li><strong>Documents de copropriété</strong> (fichiers PDF) : PV d'assemblée générale, règlement de copropriété, appels de fonds, relevés de charges, diagnostics techniques, etc.</li>
          <li><strong>Email</strong> : utilisé uniquement pour l'envoi du reçu de paiement via Stripe.</li>
          <li><strong>Adresse du bien</strong> : adresse du lot en copropriété faisant l'objet de la vente.</li>
          <li><strong>Informations du lot</strong> : numéro de lot, tantièmes, surface Carrez.</li>
          <li><strong>Identité du vendeur</strong> : nom du vendeur, inclus dans le pré-état daté généré.</li>
        </ul>
      </section>

      {/* Finalite du traitement */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Finalité du traitement</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les données personnelles collectées sont utilisées exclusivement pour la génération du pré-état
          daté et du Pack Vendeur. Aucune donnée n'est utilisée à des fins de prospection commerciale,
          de profilage ou de revente à des tiers.
        </p>
      </section>

      {/* Base legale */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Base légale</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le traitement des données est fondé sur l'<strong>exécution du contrat</strong> (article 6.1.b
          du Règlement Général sur la Protection des Données - RGPD). L'utilisateur fournit ses données
          dans le cadre de la commande d'un service de génération de document.
        </p>
      </section>

      {/* Duree de conservation */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Durée de conservation</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les données sont conservées pendant une durée maximale de <strong>7 jours</strong> après la
          création du dossier. À l'issue de ce délai, l'ensemble des données (documents uploadés,
          données extraites, PDF généré) est automatiquement supprimé.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Cette suppression est gérée via la colonne <code className="bg-secondary-100 px-1 py-0.5 rounded text-sm">expires_at</code> de
          notre base de données, qui définit la date d'expiration de chaque dossier.
        </p>
      </section>

      {/* Sous-traitants */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Sous-traitants</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les sous-traitants suivants interviennent dans le traitement des données :
        </p>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-secondary-200 text-sm">
            <thead>
              <tr className="bg-secondary-50">
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Sous-traitant</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Service</th>
                <th className="border border-secondary-200 px-4 py-3 text-left font-semibold text-secondary-900">Localisation</th>
              </tr>
            </thead>
            <tbody className="text-secondary-600">
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Supabase Inc.</td>
                <td className="border border-secondary-200 px-4 py-3">Hébergement base de données et stockage de fichiers</td>
                <td className="border border-secondary-200 px-4 py-3">Allemagne / États-Unis</td>
              </tr>
              <tr className="bg-secondary-50/50">
                <td className="border border-secondary-200 px-4 py-3">Google (Gemini)</td>
                <td className="border border-secondary-200 px-4 py-3">Analyse IA des documents (classification et extraction)</td>
                <td className="border border-secondary-200 px-4 py-3">États-Unis</td>
              </tr>
              <tr>
                <td className="border border-secondary-200 px-4 py-3">Stripe Inc.</td>
                <td className="border border-secondary-200 px-4 py-3">Traitement des paiements</td>
                <td className="border border-secondary-200 px-4 py-3">États-Unis / Irlande</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Transferts hors UE */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Transferts hors UE</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Certains de nos sous-traitants sont situés aux États-Unis. Google et Stripe sont certifiés
          sous le <strong>EU-US Data Privacy Framework</strong>, qui garantit un niveau de protection
          adéquat des données personnelles conformément à la décision d'adéquation de la Commission
          européenne du 10 juillet 2023.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Supabase utilise des serveurs en Allemagne pour le stockage primaire des données.
        </p>
      </section>

      {/* Vos droits */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Vos droits</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc">
          <li><strong>Droit d'accès</strong> : obtenir la confirmation que vos données sont traitées et en obtenir une copie.</li>
          <li><strong>Droit de rectification</strong> : demander la correction de données inexactes ou incomplètes.</li>
          <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données (note : les données sont automatiquement supprimées après 7 jours).</li>
          <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et lisible par machine.</li>
          <li><strong>Droit d'opposition</strong> : vous opposer au traitement de vos données dans certains cas.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mt-4">
          Pour exercer ces droits, contactez-nous à l'adresse : <a href="mailto:contact@pack-vendeur.fr" className="text-primary-600 hover:underline">contact@pack-vendeur.fr</a>.
          Nous nous engageons à répondre dans un délai d'un mois.
        </p>
        <p className="text-secondary-600 leading-relaxed mt-2">
          Vous avez également le droit d'introduire une réclamation auprès de la CNIL
          (<a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">www.cnil.fr</a>).
        </p>
      </section>

      {/* Cookies */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Cookies</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pack Vendeur n'utilise <strong>aucun cookie de tracking</strong>, publicitaire ou analytique.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Votre session est gérée via un identifiant unique stocké localement dans votre navigateur
          (localStorage). Cet identifiant n'est pas transmis à des tiers et sert uniquement à
          retrouver votre dossier en cours.
        </p>
      </section>

      {/* Modification */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Modification de cette politique</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pack Vendeur se réserve le droit de modifier la présente politique de confidentialité à tout
          moment. La version en vigueur est celle accessible sur le site.
        </p>
        <p className="text-secondary-600 leading-relaxed font-medium">
          Dernière mise à jour : février 2026.
        </p>
      </section>
    </div>
  );
}
