import { Helmet } from 'react-helmet-async';

export default function PageMeta({ title, description, canonical, type = 'website', noindex = false }) {
  const fullTitle = title ? `${title} | Dossiervente.ai` : 'Dossiervente.ai - Pré-état daté en ligne en 5 minutes';
  const desc = description || 'Générez votre pré-état daté et Pack Vendeur en ligne pour 19,99 €. Analyse IA des documents de copropriété, conforme loi ALUR.';

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      {canonical && <link rel="canonical" href={`https://dossiervente.ai${canonical}`} />}
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Dossiervente.ai" />
      <meta property="og:locale" content="fr_FR" />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
    </Helmet>
  );
}
