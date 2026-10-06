import { Helmet } from 'react-helmet-async'
import { SITE_URL, SITE_NAME } from '../config.js'
import { toJsonLd } from '../lib/schema.js'

/**
 * Per-page head tags. `path` must start with "/" and is used for the canonical URL.
 * `schemas` is an array of JSON-LD objects.
 */
export default function Seo({ title, description, path = '/', type = 'website', lang = 'ar', image, schemas = [], noindex = false, published, modified }) {
  const url = `${SITE_URL}${path}`
  const img = image || `${SITE_URL}/og-image.png`
  return (
    <Helmet>
      <html lang={lang} dir="rtl" />
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, follow" />}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content={lang === 'ar' ? 'ar_AR' : 'en_US'} />
      {published && <meta property="article:published_time" content={published} />}
      {modified && <meta property="article:modified_time" content={modified} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">{toJsonLd(schema)}</script>
      ))}
    </Helmet>
  )
}
