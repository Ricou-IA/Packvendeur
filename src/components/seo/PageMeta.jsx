import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://dossiervente.ai';
const DEFAULT_IMAGE = `${SITE_URL}/og-default.png`;

export default function PageMeta({
  title,
  description,
  canonical,
  type = 'website',
  noindex = false,
  image,
  publishedTime,
  modifiedTime,
}) {
  const fullTitle = title
    ? `${title} | Dossiervente.ai`
    : 'Dossiervente.ai - Pre-etat date en ligne en 5 minutes';
  const desc =
    description ||
    'Generez votre pre-etat date et Pack Vendeur en ligne pour 24,99 EUR. Analyse IA des documents de copropriete, conforme loi ALUR.';
  const ogImage = image || DEFAULT_IMAGE;
  const ogUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={ogUrl} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Dossiervente.ai" />
      <meta property="og:locale" content="fr_FR" />

      {/* Article-specific OG */}
      {type === 'article' && publishedTime && (
        <meta property="article:published_time" content={publishedTime} />
      )}
      {type === 'article' && modifiedTime && (
        <meta property="article:modified_time" content={modifiedTime} />
      )}
      {type === 'article' && (
        <meta property="article:author" content="Dossiervente.ai" />
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
