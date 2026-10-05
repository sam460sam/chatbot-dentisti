/**
 * Writes one static HTML shell per language/page after the Vite build, so that
 * crawlers and link previews get the right title, description and hreflang
 * without running JavaScript. The app itself still renders client-side.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// Read, not repeated. The address used to be written out in five files and a
// move would have left some of them behind.
const siteTs = await readFile(join(root, 'src/site.ts'), 'utf8')
const BASE = (siteTs.match(/baseUrl:\s*'([^']+)'/) || [])[1]
if (!BASE) throw new Error('src/site.ts: baseUrl not found — nothing to stamp the canonical tags with')
const LANGS = ['en', 'nl', 'it']

const meta = JSON.parse(await readFile(join(root, 'src/i18n/meta.json'), 'utf8'))
let template = await readFile(join(root, 'dist/index.html'), 'utf8')

// Preload the latin font: it is requested by the CSS, so without this hint the
// browser only discovers it after the stylesheet has been parsed.
const assets = await readdir(join(root, 'dist/assets'))
const font = assets.find((f) => f.startsWith('inter-latin-var') && f.endsWith('.woff2'))
if (font && !template.includes('rel="preload" as="font"')) {
  template = template.replace(
    '</head>',
    `  <link rel="preload" as="font" type="font/woff2" href="/assets/${font}" crossorigin />\n  </head>`,
  )
  await writeFile(join(root, 'dist/index.html'), template, 'utf8')
}

const PAGES = ['home', 'assistant', 'websites', 'prices', 'privacy']
const pathFor = (lang, page) =>
  (lang === 'en' ? '' : `/${lang}`) + (page === 'home' ? '' : `/${page}`) || '/'
/* same lookup as src/pageMeta.ts */
const titleOf = (lang, page) => meta[lang][page === 'home' ? 'title' : `${page}Title`]
const descriptionOf = (lang, page) => meta[lang][page === 'home' ? 'description' : `${page}Description`]

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

for (const lang of LANGS) {
  for (const page of PAGES) {
    const path = pathFor(lang, page)
    const title = titleOf(lang, page)
    const description = descriptionOf(lang, page)
    if (!title || !description) throw new Error(`src/i18n/meta.json: no title/description for ${lang} ${page}`)

    const alternates = [
      `<link rel="canonical" href="${BASE}${path}" />`,
      ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${BASE}${pathFor(l, page)}" />`),
      `<link rel="alternate" hreflang="x-default" href="${BASE}${pathFor('en', page)}" />`,
    ].join('\n    ')

    const html = template
      .replace('<html lang="en">', `<html lang="${lang}">`)
      .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
      .replace(
        /<meta name="description" content="[^"]*" \/>/,
        `<meta name="description" content="${escapeAttr(description)}" />`,
      )
      .replace(
        /<meta property="og:locale" content="[^"]*" \/>/,
        `<meta property="og:locale" content="${lang}" />`,
      )
      .replace(
        /<meta property="og:title" content="[^"]*" \/>/,
        `<meta property="og:title" content="${escapeAttr(title)}" />`,
      )
      .replace(
        /<meta property="og:description" content="[^"]*" \/>/,
        `<meta property="og:description" content="${escapeAttr(description)}" />`,
      )
      .replace(
        /<meta property="og:url" content="[^"]*" \/>/,
        `<meta property="og:url" content="${BASE}${path}" />`,
      )
      .replace(
        /<meta property="og:image" content="[^"]*" \/>/,
        `<meta property="og:image" content="${BASE}/og.png" />`,
      )
      .replace(/<!-- alt:start -->[\s\S]*?<!-- alt:end -->/, alternates)

    /* /nl/prices is written as nl/prices.html, not nl/prices/index.html:
       Cloudflare Pages then serves the canonical address with a 200 instead
       of a 308 to a trailing-slash copy of it. */
    const file = path === '/' ? join(root, 'dist', 'index.html') : join(root, 'dist', `${path.slice(1)}.html`)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html, 'utf8')
    console.log(`prerendered ${path}`)
  }
}

// robots.txt and the sitemap, written from the same address as the canonical
// tags rather than kept by hand in public/ where they drifted out of step.
const pages = []
for (const page of PAGES) {
  for (const lang of LANGS) pages.push({ lang, page, path: pathFor(lang, page) })
}

await writeFile(
  join(root, 'dist/robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${BASE}/sitemap.xml\n`,
  'utf8',
)

const urls = pages
  .map(({ lang, page, path }) => {
    const alts = [
      ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}${pathFor(l, page)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${pathFor('en', page)}"/>`,
    ].join('\n')
    const priority = page === 'privacy' ? '0.3' : page === 'home' ? (lang === 'en' ? '1.0' : '0.9') : '0.7'
    return `  <url>\n    <loc>${BASE}${path}</loc>\n${alts}\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')

await writeFile(
  join(root, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  'utf8',
)
console.log('wrote robots.txt and sitemap.xml for ' + BASE)
