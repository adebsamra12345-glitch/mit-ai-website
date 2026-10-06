// Post-build step: renders every route to static HTML (so search engines see full content
// without running JS), then writes sitemap.xml, robots.txt and 404.html into dist/.
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const serverDir = path.join(root, 'dist-server')
const SITE_URL = (process.env.VITE_SITE_URL || 'https://mitaitechnology.tech').replace(/\/$/, '')

const { render, pages } = await import(pathToFileURL(path.join(serverDir, 'entry-server.js')).href)
const template = await readFile(path.join(dist, 'index.html'), 'utf8')

function toHtml(url) {
  const { html, helmet } = render(url)
  const head = ['title', 'priority', 'meta', 'link', 'script'].map((k) => helmet[k].toString()).join('\n    ')
  return template
    .replace('<html lang="ar" dir="rtl">', `<html ${helmet.htmlAttributes.toString()}>`)
    .replace('<!--app-head-->', head)
    .replace('<!--app-html-->', html)
}

async function write(file, content) {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, content)
}

for (const { path: route } of pages) {
  const file = route === '/' ? 'index.html' : path.join(route, 'index.html')
  await write(path.join(dist, file), toHtml(route))
}
await write(path.join(dist, '404.html'), toHtml('/404-not-found'))

const urls = pages
  .map((p) => `  <url>\n    <loc>${SITE_URL}${p.path === '/' ? '/' : p.path}</loc>\n    <lastmod>${p.lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority.toFixed(1)}</priority>\n  </url>`)
  .join('\n')
await write(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)

await write(
  path.join(dist, 'robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
)

await rm(serverDir, { recursive: true, force: true })
console.log(`Prerendered ${pages.length} pages + 404.html, sitemap.xml, robots.txt (${SITE_URL})`)
