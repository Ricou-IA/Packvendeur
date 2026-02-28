import PageMeta from '@components/seo/PageMeta';

export default function MentionsLegalesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <PageMeta
        title="Mentions légales"
        description="Mentions légales du site Pack Vendeur, service de génération de pré-état daté en ligne."
        canonical="/mentions-legales"
      />

      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Mentions légales</h1>

      {/* Editeur du site */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Éditeur du site</h2>
        <div className="text-secondary-600 leading-relaxed space-y-2">
          <p><strong>Pack Vendeur</strong></p>
          <p>SIRET : [en cours d'immatriculation]</p>
          <p>Adresse : [adresse à compléter]</p>
          <p>Email : <a href="mailto:contact@pre-etat-date.ai" className="text-primary-600 hover:underline">contact@pre-etat-date.ai</a></p>
          <p>Téléphone : [à compléter]</p>
        </div>
      </section>

      {/* Hebergement */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Hébergement</h2>
        <div className="text-secondary-600 leading-relaxed space-y-2">
          <p><strong>Vercel Inc.</strong></p>
          <p>440 N Barranca Ave #4133</p>
          <p>Covina, CA 91723, USA</p>
          <p>Site web : <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">vercel.com</a></p>
        </div>
      </section>

      {/* Directeur de la publication */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Directeur de la publication</h2>
        <p className="text-secondary-600 leading-relaxed">
          [Nom du directeur de la publication à compléter]
        </p>
      </section>

      {/* Propriete intellectuelle */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Propriété intellectuelle</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          L'ensemble du contenu du site Pack Vendeur (textes, images, graphismes, logo, icônes, logiciels,
          structure générale et mise en forme) est la propriété exclusive de Pack Vendeur ou de ses partenaires
          et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Toute reproduction, représentation, modification, publication, adaptation de tout ou partie des
          éléments du site, quel que soit le moyen ou le procédé utilisé, est interdite sauf autorisation
          écrite préalable de Pack Vendeur.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Toute exploitation non autorisée du site ou de son contenu sera considérée comme constitutive
          d'une contrefaçon et poursuivie conformément aux dispositions des articles L.335-2 et suivants
          du Code de la Propriété Intellectuelle.
        </p>
      </section>

      {/* Responsabilite */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Responsabilité</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Pack Vendeur s'efforce de fournir sur le site des informations aussi précises que possible.
          Toutefois, Pack Vendeur ne pourra être tenu responsable des omissions, des inexactitudes ou
          des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires
          qui lui fournissent ces informations.
        </p>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Le pré-état daté généré par le service est établi sur la base des déclarations du vendeur et
          des documents fournis. Il ne se substitue pas à l'état daté du syndic prévu par l'article 5
          du décret n°67-223 du 17 mars 1967.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Pack Vendeur ne saurait être tenu responsable des dommages directs ou indirects causés au
          matériel de l'utilisateur lors de l'accès au site, résultant soit de l'utilisation d'un
          matériel ne répondant pas aux spécifications techniques requises, soit de l'apparition d'un
          bug ou d'une incompatibilité.
        </p>
      </section>

      {/* Droit applicable */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-secondary-900 mt-10 mb-4">Droit applicable</h2>
        <p className="text-secondary-600 leading-relaxed mb-4">
          Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut
          de résolution amiable, le litige sera porté devant les tribunaux français conformément aux
          règles de compétence en vigueur.
        </p>
        <p className="text-secondary-600 leading-relaxed">
          Tribunal compétent : Tribunal judiciaire de [à compléter].
        </p>
      </section>
    </div>
  );
}
