import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'

/** Used by scripts/prerender.mjs to produce static HTML + head tags for every route. */
export function render(url) {
  const helmetContext = {}
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
  )
  return { html, helmet: helmetContext.helmet }
}

// Every URL that should exist as a static page (also drives sitemap.xml).
import { posts, postPath } from './data/posts/index.js'
import { services, servicePath } from './data/services.js'

export const pages = [
  { path: '/', priority: 1.0, changefreq: 'weekly', lastmod: posts[0].updated },
  { path: '/blog', priority: 0.9, changefreq: 'weekly', lastmod: posts[0].updated },
  ...services.map((s) => ({ path: servicePath(s), priority: 0.9, changefreq: 'monthly', lastmod: '2026-10-06' })),
  ...posts.map((p) => ({ path: postPath(p), priority: 0.8, changefreq: 'monthly', lastmod: p.updated })),
]
