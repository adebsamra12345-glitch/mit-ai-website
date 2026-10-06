const formatters = {}

/** Locale-stable date (UTC) so server-rendered and client-rendered output match. */
export function formatDate(iso, lang = 'ar') {
  const locale = lang === 'ar' ? 'ar-u-nu-latn' : 'en-US'
  formatters[locale] ||= new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
  return formatters[locale].format(new Date(`${iso}T00:00:00Z`))
}

export const readTimeLabel = (minutes, lang = 'ar') => (lang === 'ar' ? `${minutes} دقائق قراءة` : `${minutes} min read`)
