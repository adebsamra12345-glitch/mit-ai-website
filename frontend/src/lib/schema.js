/**
 * SEO Schema Markup Utility
 * Centralises all JSON-LD structured data for the site.
 * Google uses these to generate rich results in SERPs.
 */

const SITE_URL = 'https://mit-ai-technology.com'
const ORG_NAME = 'Mit AI Technology'
const ORG_EMAIL = 'mmitaitechnoloy@gmail.com'
const ORG_PHONE = '+9630993448083'

/** Organization schema — injected on the homepage */
export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: ORG_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: ORG_PHONE,
    contactType: 'customer support',
    email: ORG_EMAIL,
    availableLanguage: ['Arabic', 'English'],
  },
  sameAs: [],
  description:
    'Mit AI Technology provides enterprise RAG solutions, LLM fine-tuning services, and AI-powered search APIs for B2B SaaS companies.',
}

/** WebSite schema — enables Google Sitelinks Search Box */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: ORG_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/search?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
}

/**
 * BreadcrumbList schema factory.
 * @param {Array<{name: string, url: string}>} items
 */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}

/**
 * FAQPage schema factory.
 * @param {Array<{question: string, answer: string}>} faqs
 */
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Article schema factory — for blog posts.
 * @param {object} opts
 */
export function articleSchema({ headline, description, url, datePublished, dateModified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url: `${SITE_URL}${url}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: ORG_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${url}`,
    },
  }
}

/**
 * SoftwareApplication schema factory — for API/product pages.
 * @param {object} opts
 */
export function softwareSchema({ name, description, url, category }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    url: `${SITE_URL}${url}`,
    applicationCategory: category,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Contact us for enterprise pricing.',
    },
    provider: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
  }
}

/** Helper — injects any schema object as a <script type="application/ld+json"> string */
export function toJsonLd(schema) {
  return JSON.stringify(schema)
}
