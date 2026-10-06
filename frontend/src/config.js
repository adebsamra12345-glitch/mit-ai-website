/** Single source of truth for site-wide constants (also used by the prerender script). */
export const SITE_URL = (import.meta.env?.VITE_SITE_URL || 'https://mitaitechnology.tech').replace(/\/$/, '')
export const SITE_NAME = 'Mit AI Technology'
export const CONTACT = {
  email: 'mmitaitechnoloy@gmail.com',
  phone: '0993448083',
  phoneIntl: '+963993448083',
}
