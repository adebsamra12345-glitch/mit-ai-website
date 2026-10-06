/**
 * SEO Schema Markup Utility
 * Centralises all JSON-LD structured data for the site.
 * Google uses these to generate rich results in SERPs.
 */

import { SITE_URL, SITE_NAME as ORG_NAME, CONTACT } from '../config.js'

const ORG_EMAIL = CONTACT.email
const ORG_PHONE = CONTACT.phoneIntl

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
    description:
    'Mit AI Technology provides enterprise RAG solutions, LLM fine-tuning services, and AI-powered search APIs for B2B SaaS companies.',
}

/** WebSite schema */
export const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: ORG_NAME,
  url: SITE_URL,
  inLanguage: ['ar', 'en'],
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
export function articleSchema({ headline, description, url, datePublished, dateModified, inLanguage = 'en', image = `${SITE_URL}/og-image.png`, keywords = [] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline,
    description,
    url: `${SITE_URL}${url}`,
    inLanguage,
    image,
    keywords: keywords.join(', '),
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
    provider: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE_URL,
    },
  }
}

/** Blog index — lists posts so crawlers understand the collection. */
export function blogSchema(posts) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${ORG_NAME} Blog`,
    url: `${SITE_URL}/blog`,
    publisher: { '@type': 'Organization', name: ORG_NAME, url: SITE_URL },
    blogPost: posts.map((p) => ({
      '@type': 'BlogPosting',
      headline: p.title,
      url: `${SITE_URL}/blog/${p.slug}`,
      datePublished: p.date,
    })),
  }
}

/** Helper — injects any schema object as a <script type="application/ld+json"> string */
export function toJsonLd(schema) {
  return JSON.stringify(schema)
}
