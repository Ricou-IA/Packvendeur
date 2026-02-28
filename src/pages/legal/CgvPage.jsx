import { Link } from 'react-router-dom';
import PageMeta from '@components/seo/PageMeta';

export default function CgvPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Conditions Générales de Vente"
        description="Conditions Générales de Vente du service Pack Vendeur. Prix, livraison, droit de rétractation, responsabilité."
        canonical="/cgv"
      />

      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Conditions Générales de Vente</h1>

      {/* Article 1 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 1 - Objet</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les présentes Conditions Générales de Vente (CGV) régissent l'utilisation du service
          Pack Vendeur, accessible à l'adresse <strong>pre-etat-date.ai</strong>.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le service Pack Vendeur permet la génération automatisée d'un pré-état daté conforme aux
          exigences de l'article L.721-2 du Code de la Construction et de l'Habitation (loi ALUR du
          24 mars 2014). Le document est généré à partir des documents de copropriété fournis par
          l'utilisateur et analysés par intelligence artificielle.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Toute utilisation du service implique l'acceptation sans réserve des présentes CGV.
        </p>
      </section>

      {/* Article 2 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 2 - Prix</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le prix du service est de <strong>24,99 EUR TTC</strong> par dossier.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Il s'agit d'un paiement unique. Le service ne propose aucun abonnement ni facturation
          récurrente. Le prix est ferme et définitif au moment de la commande.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Pack Vendeur se réserve le droit de modifier ses tarifs à tout moment. Les modifications
          de prix ne s'appliquent pas aux commandes déjà validées.
        </p>
      </section>

      {/* Article 3 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 3 - Commande et paiement</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le paiement est effectué en ligne par carte bancaire via la plateforme sécurisée Stripe.
          Pack Vendeur ne stocke aucune donnée bancaire.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le processus de commande se déroule comme suit :
        </p>
        <ol className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-decimal">
          <li>L'utilisateur uploade ses documents de copropriété.</li>
          <li>L'intelligence artificielle analyse les documents et extrait les données.</li>
          <li>L'utilisateur valide ou corrige les données extraites.</li>
          <li>L'utilisateur procède au paiement de 24,99 EUR.</li>
          <li>Le pré-état daté PDF est généré et mis à disposition immédiatement.</li>
        </ol>
        <p className="text-secondary-600 leading-relaxed mt-4">
          La commande est considérée comme définitive après confirmation du paiement par Stripe.
        </p>
      </section>

      {/* Article 4 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 4 - Livraison</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          La livraison du document est <strong>immédiate</strong> après confirmation du paiement.
          L'utilisateur reçoit :
        </p>
        <ul className="space-y-2 text-secondary-600 leading-relaxed ml-6 list-disc">
          <li>Un <strong>pré-état daté au format PDF</strong>, téléchargeable directement depuis le site.</li>
          <li>Un <strong>lien de partage sécurisé</strong> à transmettre au notaire, valable 7 jours.</li>
        </ul>
        <p className="text-secondary-600 leading-relaxed mt-4">
          L'utilisateur est invité à télécharger son document dès réception. Passé le délai de 7 jours,
          les données sont automatiquement supprimées conformément à notre politique RGPD.
        </p>
      </section>

      {/* Article 5 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 5 - Droit de rétractation</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Conformément à l'article L.221-28 du Code de la consommation, le droit de rétractation ne
          s'applique pas aux contrats de fourniture de <strong>contenu numérique non fourni sur un
          support matériel</strong> dont l'exécution a commencé avec l'accord préalable exprès du
          consommateur.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          En procédant au paiement, l'utilisateur reconnaît et accepte que le document numérique
          (pré-état daté PDF) lui est fourni immédiatement et <strong>renonce expressément à son
          droit de rétractation</strong>.
        </p>
      </section>

      {/* Article 6 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 6 - Nature du document</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté généré par Pack Vendeur est un document informatif destiné à être annexé
          à la promesse de vente ou au compromis de vente d'un lot de copropriété.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          <strong>Le pré-état daté ne se substitue pas à l'état daté du syndic</strong> prévu par
          l'article 5 du décret n°67-223 du 17 mars 1967. L'état daté reste obligatoire et doit être
          établi par le syndic de copropriété avant la signature de l'acte authentique de vente.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Le document est établi sur la base des documents fournis par le vendeur et des déclarations
          de ce dernier. Il ne constitue en aucun cas un avis juridique ou comptable.
        </p>
      </section>

      {/* Article 7 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 7 - Responsabilité</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pack Vendeur ne saurait être tenu responsable des erreurs, omissions ou inexactitudes
          résultant de <strong>documents incomplets, erronés ou obsolètes</strong> fournis par
          l'utilisateur.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'intelligence artificielle effectue une extraction automatisée des données. Cette
          extraction est soumise à la <strong>validation obligatoire de l'utilisateur</strong> avant
          la génération du document final. L'utilisateur est responsable de la vérification de
          l'exactitude des données avant paiement.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          En aucun cas, Pack Vendeur ne pourra être tenu responsable de tout dommage indirect,
          notamment la perte de chance, le préjudice commercial ou financier, résultant de l'utilisation
          ou de l'impossibilité d'utiliser le service.
        </p>
      </section>

      {/* Article 8 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 8 - Données personnelles</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le traitement des données personnelles dans le cadre de l'utilisation du service est régi
          par notre <Link to="/politique-rgpd" className="text-primary-600 hover:underline">Politique de
          confidentialité et protection des données</Link>.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Les données sont conservées pendant une durée maximale de 7 jours, conformément au principe
          de minimisation des données du RGPD.
        </p>
      </section>

      {/* Article 9 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 9 - Propriété intellectuelle</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le format, la structure et la mise en forme du pré-état daté généré sont la propriété
          exclusive de Pack Vendeur. L'utilisateur dispose d'un droit d'utilisation du document
          généré dans le cadre strict de la vente de son bien immobilier.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Toute reproduction, distribution ou revente du format du document à des fins commerciales
          est interdite sans autorisation préalable écrite de Pack Vendeur.
        </p>
      </section>

      {/* Article 10 */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Article 10 - Droit applicable</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les présentes CGV sont soumises au droit français. Tout litige relatif à l'interprétation
          ou à l'exécution des présentes sera soumis à la compétence exclusive des tribunaux français.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          En cas de litige, l'utilisateur peut recourir à une médiation conventionnelle ou à tout
          autre mode alternatif de règlement des différends. Conformément à l'article L.612-1 du
          Code de la consommation, le consommateur peut également s'adresser au médiateur de la
          consommation dont relève le professionnel.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Tribunal compétent : Tribunal judiciaire de [à compléter].
        </p>
      </section>

      <p className="text-secondary-600 leading-relaxed font-medium mt-12 pt-6 border-t border-secondary-200">
        Dernière mise à jour : février 2026.
      </p>
    </div>
  );
}
