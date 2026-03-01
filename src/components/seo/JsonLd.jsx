import { Helmet } from 'react-helmet-async';

export default function JsonLd({ data }) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}

// --- Reusable schema builders ---

export const SITE_URL = 'https://pre-etat-date.ai';
export const SITE_NAME = 'Pre-etat-date.ai';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: DEFAULT_OG_IMAGE,
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contact@pre-etat-date.ai',
      contactType: 'customer service',
      availableLanguage: 'French',
    },
    sameAs: [
      'https://facebook.com/preetatdate',
      'https://instagram.com/preetatdate',
      'https://linkedin.com/company/pre-etat-date',
    ],
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'fr-FR',
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
  };
}

export function productSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Pack Vendeur - Pre-etat date en ligne',
    description:
      'Generez votre pre-etat date et Pack Vendeur en ligne. Analyse IA des documents de copropriete, conforme loi ALUR et modele CSN.',
    image: DEFAULT_OG_IMAGE,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      price: '24.99',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/dossier`,
      priceValidUntil: '2027-12-31',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'FR',
        returnPolicyCategory: 'https://schema.org/MerchantReturnNotPermitted',
        merchantReturnDays: 0,
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'EUR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'FR',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 0,
            maxValue: 0,
            unitCode: 'DAY',
          },
        },
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
    },
  };
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleSchema({ title, description, slug, datePublished, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url: `${SITE_URL}/guide/${slug}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: { '@type': 'Organization', name: SITE_NAME },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: DEFAULT_OG_IMAGE },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/guide/${slug}` },
    inLanguage: 'fr-FR',
  };
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url ? `${SITE_URL}${item.url}` : undefined,
    })),
  };
}

/**
 * Schema.org CollectionPage + ItemList — for the guides index page.
 * Lists all articles so AI crawlers can discover the full content catalog.
 */
export function guidesCollectionSchema(articles) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Guides copropriete et vente — Articles et conseils',
    description:
      'Tous nos guides sur la vente en copropriete : pre-etat date, loi ALUR, diagnostics, tantiemes, documents obligatoires.',
    url: `${SITE_URL}/guide`,
    inLanguage: 'fr-FR',
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: articles.length,
      itemListElement: articles.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/guide/${a.slug}`,
        name: a.title,
        description: a.excerpt,
      })),
    },
  };
}

/**
 * Schema.org DefinedTermSet — for the glossary page.
 * Each term becomes a DefinedTerm with name, description and URL.
 */
export function definedTermSetSchema(terms) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTermSet',
    name: 'Glossaire de la copropriete',
    description: 'Definitions des termes lies a la copropriete et a la vente immobiliere en France.',
    url: `${SITE_URL}/glossaire`,
    inLanguage: 'fr-FR',
    hasDefinedTerm: terms.map((t) => ({
      '@type': 'DefinedTerm',
      name: t.term,
      description: t.definition,
      url: `${SITE_URL}/glossaire#${t.id}`,
    })),
  };
}

/**
 * Schema.org HowTo — "Comment obtenir son pre-etat date en ligne"
 */
export function howToSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'Comment obtenir son pre-etat date en ligne',
    description:
      "Generez votre pre-etat date en ligne en 4 etapes simples grace a l'analyse IA de vos documents de copropriete. Service conforme loi ALUR et modele CSN.",
    totalTime: 'PT10M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'EUR',
      value: '24.99',
    },
    tool: [
      {
        '@type': 'HowToTool',
        name: "Documents de copropriete (PV d'AG, reglement, appels de fonds, diagnostics)",
      },
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Deposez vos documents',
        text: "Glissez-deposez vos PDF de copropriete : PV d'assemblee generale, reglement de copropriete, appels de fonds, releves de charges, diagnostics techniques.",
        url: `${SITE_URL}/dossier`,
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: "L'IA analyse vos documents",
        text: "L'intelligence artificielle (Google Gemini) classifie automatiquement chaque document et extrait les donnees financieres, juridiques et techniques de votre copropriete.",
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Validez les donnees extraites',
        text: "Verifiez et completez les informations extraites par l'IA dans un formulaire. Corrigez si necessaire avant de proceder au paiement de 24,99 EUR.",
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Partagez avec votre notaire',
        text: 'Telechargez votre pre-etat date au format PDF ou copiez un lien de partage securise a transmettre a votre notaire par email.',
      },
    ],
  };
}

/**
 * Schema.org SoftwareApplication — for AI/product visibility
 */
export function softwareApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Pre-etat-date.ai',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description:
      'Service en ligne de generation de pre-etat date pour la vente en copropriete en France. Analyse IA des documents, conforme loi ALUR et modele CSN.',
    url: SITE_URL,
    offers: {
      '@type': 'Offer',
      price: '24.99',
      priceCurrency: 'EUR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '127',
      bestRating: '5',
    },
    featureList: [
      'Analyse IA des documents de copropriete',
      'Classification automatique des documents',
      'Extraction financiere et juridique par IA',
      'Generation PDF conforme modele CSN',
      'Verification DPE via ADEME',
      'Lien de partage notaire securise',
      'Conforme loi ALUR et loi ELAN',
      'RGPD compliant - donnees supprimees sous 7 jours',
    ],
    screenshot: DEFAULT_OG_IMAGE,
  };
}
