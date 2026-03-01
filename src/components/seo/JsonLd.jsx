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
