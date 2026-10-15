/**
 * Writes one static HTML shell per language/page after the Vite build, so that
 * crawlers and link previews get the right title, description and hreflang
 * without running JavaScript. The app itself still renders client-side.
 *
 * Each shell also carries a plain fallback in #root (the page's name, its
 * description and plain links) for readers that run no script, the home
 * shells carry the organisation as JSON-LD, and every language gets a
 * not-found shell that Cloudflare serves with a real 404 status.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
// Read, not repeated. The address used to be written out in five files and a
// move would have left some of them behind.
const siteTs = await readFile(join(root, 'src/site.ts'), 'utf8')
const fromSite = (key) => {
  const value = (siteTs.match(new RegExp(`${key}:\\s*'([^']+)'`)) || [])[1]
  if (!value) throw new Error(`src/site.ts: ${key} not found`)
  return value
}
const BASE = fromSite('baseUrl')
const SITE = {
  name: fromSite('name'),
  email: fromSite('email'),
  whatsappNumber: fromSite('whatsappNumber'),
  whatsappDisplay: fromSite('whatsappDisplay'),
  lastUpdated: fromSite('lastUpdated'),
}
const LANGS = ['en', 'nl', 'it']
const LANG_LABELS = { en: 'English', nl: 'Nederlands', it: 'Italiano' }
/* Open Graph wants a territory as well as a language */
const OG_LOCALE = { en: 'en_GB', nl: 'nl_NL', it: 'it_IT' }

const meta = JSON.parse(await readFile(join(root, 'src/i18n/meta.json'), 'utf8'))
let template = await readFile(join(root, 'dist/index.html'), 'utf8')

// Preload the latin fonts: they are requested by the CSS, so without this hint
// the browser only discovers them after the stylesheet has been parsed. Inter
// sets the text; Bricolage sets the headlines, the largest paint on most pages.
const assets = await readdir(join(root, 'dist/assets'))
const fonts = ['inter-latin-var', 'bricolage-latin-var']
  .map((name) => assets.find((f) => f.startsWith(name + '-') && f.endsWith('.woff2')))
  .filter(Boolean)
if (fonts.length && !template.includes('rel="preload" as="font"')) {
  template = template.replace(
    '</head>',
    fonts.map((f) => `  <link rel="preload" as="font" type="font/woff2" href="/assets/${f}" crossorigin />\n`).join('') + '  </head>',
  )
  await writeFile(join(root, 'dist/index.html'), template, 'utf8')
}

const PAGES = ['home', 'assistant', 'websites', 'prices', 'privacy']
const pathFor = (lang, page) =>
  (lang === 'en' ? '' : `/${lang}`) + (page === 'home' ? '' : `/${page}`) || '/'
/* same lookup as src/pageMeta.ts */
const titleOf = (lang, page) => meta[lang][page === 'home' ? 'title' : `${page}Title`]
const descriptionOf = (lang, page) => meta[lang][page === 'home' ? 'description' : `${page}Description`]

const escapeText = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const escapeAttr = (value) => escapeText(value).replace(/"/g, '&quot;')

/* A page's name is its title without the brand; the home title starts with
   the brand and is its own name. */
const nameOf = (lang, page) => titleOf(lang, page).replace(new RegExp(` — ${SITE.name}$`), '')

/* The first picture of each page is its largest paint. The app renders it,
   so without a hint the browser would only find it after the script ran. */
const picture = (name) =>
  `<link rel="preload" as="image" imagesrcset="/media/${name}-640.webp 640w, /media/${name}-960.webp 960w, /media/${name}-1600.webp 1600w" imagesizes="100vw" fetchpriority="high" />`
const PRELOAD = {
  home: [
    '<link rel="preload" as="image" imagesrcset="/media/hero-portrait-640.webp 640w, /media/hero-portrait-960.webp 960w, /media/hero-portrait-1280.webp 1280w" imagesizes="100vw" media="(max-aspect-ratio: 4/5)" fetchpriority="high" />',
    '<link rel="preload" as="image" imagesrcset="/media/hero-800.webp 800w, /media/hero-1280.webp 1280w, /media/hero-1920.webp 1920w" imagesizes="100vw" media="not all and (max-aspect-ratio: 4/5)" fetchpriority="high" />',
  ].join('\n    '),
  assistant: picture('assistant'),
  websites: picture('websites'),
}

/*
 * The fallback inside #root, for readers that run no script: crawlers that
 * only read the HTML, link previews, a browser with scripts off. The app
 * empties #root before it renders (src/main.tsx), so the two never sit side
 * by side and nothing is diffed or shifted.
 *
 * Where scripts run, its words stay invisible for their first three seconds,
 * by then the app has replaced them, so a visitor never sees them flash by.
 * If the script never arrives they appear anyway: they are not hidden
 * waiting for it. The navy box keeps the first paint as navy as it was.
 */
const SHELL_CSS = [
  '.shell{min-height:100vh;padding:120px 16px 56px;background:#0A0F1E;color:#F4EFE6}',
  '.shell>*{max-width:46rem;margin:0 auto 24px;animation:shell 0s 3s both}',
  '.shell h1{font:700 clamp(36px,7vw,64px)/1.02 Bricolage,Georgia,serif;letter-spacing:-.03em;color:#F4EFE6}',
  '.shell a{color:#96D3C0;text-decoration:underline}',
  '.shell li{margin:4px 0}',
  '@keyframes shell{from{visibility:hidden}}',
  '@media (scripting:none){.shell>*{animation:none}}',
].join('')

const fallback = (lang, heading, description, pathIn) =>
  [
    '<div class="shell">',
    `<h1>${escapeText(heading)}</h1>`,
    `<p>${escapeText(description)}</p>`,
    '<ul>',
    ...PAGES.map((page) => `<li><a href="${pathFor(lang, page)}">${escapeText(page === 'home' ? SITE.name : nameOf(lang, page))}</a></li>`),
    '</ul>',
    `<p><a href="mailto:${SITE.email}">${SITE.email}</a> · <a href="https://wa.me/${SITE.whatsappNumber}">WhatsApp ${escapeText(SITE.whatsappDisplay)}</a></p>`,
    `<p>${LANGS.filter((l) => l !== lang).map((l) => `<a href="${pathIn(l)}" hreflang="${l}" lang="${l}">${LANG_LABELS[l]}</a>`).join(' · ')}</p>`,
    '</div>',
  ].join('')

/* Who is behind the site, for the brand result. Only what is settled: the
   legal name, address and VAT number are still TODO (see the privacy page),
   and no prices. A data block is never executed. */
const ORG = `${BASE}/#org`
const JSON_LD = `<script type="application/ld+json">${JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORG,
      name: SITE.name,
      url: `${BASE}/`,
      logo: `${BASE}/icon-512.png`,
      email: SITE.email,
      contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', email: SITE.email, availableLanguage: LANGS },
    },
    { '@type': 'WebSite', '@id': `${BASE}/#website`, url: `${BASE}/`, name: SITE.name, inLanguage: LANGS, publisher: { '@id': ORG } },
  ],
}).replace(/</g, '\\u003c')}</script>`

/* One shell: the template with this page's language, words and head. A
   shell without an address of its own (the not-found one) has no og:url.
   `alternates` takes the place of the canonical and hreflang block; `tail`
   goes at the end of the head, after the stylesheet. */
const shell = ({ lang, url, title, description, alternates, tail = [], body }) =>
  template
    .replace('<html lang="en">', `<html lang="${lang}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeText(title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeAttr(description)}" />`,
    )
    .replace(
      /<meta property="og:locale" content="[^"]*" \/>/,
      `<meta property="og:locale" content="${OG_LOCALE[lang]}" />`,
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
      /\s*<meta property="og:url" content="[^"]*" \/>/,
      url ? `\n    <meta property="og:url" content="${url}" />` : '',
    )
    .replace(
      /<meta property="og:image" content="[^"]*" \/>/,
      `<meta property="og:image" content="${BASE}/og.png" />`,
    )
    .replace(
      /<meta property="og:image:alt" content="[^"]*" \/>/,
      `<meta property="og:image:alt" content="${escapeAttr(meta[lang].ogImageAlt)}" />`,
    )
    .replace(/<!-- alt:start -->[\s\S]*?<!-- alt:end -->/, alternates)
    .replace('</head>', `  ${[...tail, `<style>${SHELL_CSS}</style>`].join('\n    ')}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`)

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

    const html = shell({
      lang,
      url: `${BASE}${path}`,
      title,
      description,
      alternates,
      tail: [...(PRELOAD[page] ? [PRELOAD[page]] : []), ...(page === 'home' ? [JSON_LD] : [])],
      body: fallback(lang, nameOf(lang, page), description, (l) => pathFor(l, page)),
    })

    /* /nl/prices is written as nl/prices.html, not nl/prices/index.html:
       Cloudflare Pages then serves the canonical address with a 200 instead
       of a 308 to a trailing-slash copy of it. */
    const file = path === '/' ? join(root, 'dist', 'index.html') : join(root, 'dist', `${path.slice(1)}.html`)
    await mkdir(dirname(file), { recursive: true })
    await writeFile(file, html, 'utf8')
    console.log(`prerendered ${path}`)
  }

  /* The not-found shell. Cloudflare serves the nearest 404.html with a 404
     status for any path that is not a file, so /nl/whatever gets the Dutch
     one and anything outside /nl and /it the English one. No canonical, no
     hreflang, not indexed. */
  const notFound = shell({
    lang,
    title: meta[lang].notfoundTitle,
    description: meta[lang].notfoundDescription,
    alternates: '<meta name="robots" content="noindex" />',
    body: fallback(lang, meta[lang].notfoundHeading, meta[lang].notfoundDescription, (l) => pathFor(l, 'home')),
  })
  const notFoundFile = join(root, 'dist', lang === 'en' ? '' : lang, '404.html')
  await mkdir(dirname(notFoundFile), { recursive: true })
  await writeFile(notFoundFile, notFound, 'utf8')
  console.log(`prerendered ${pathFor(lang, 'home').replace(/\/?$/, '/')}404.html`)
}

// robots.txt and the sitemap, written from the same address as the canonical
// tags rather than kept by hand in public/ where they drifted out of step.
const pages = []
for (const page of PAGES) {
  for (const lang of LANGS) pages.push({ lang, page, path: pathFor(lang, page) })
}

/* /api/ is the booking backend: a crawler rendering the home page would
   otherwise ask it for free slots, which asks Google Calendar. */
await writeFile(
  join(root, 'dist/robots.txt'),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${BASE}/sitemap.xml\n`,
  'utf8',
)

const urls = pages
  .map(({ lang, page, path }) => {
    const alts = [
      ...LANGS.map((l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${BASE}${pathFor(l, page)}"/>`),
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${BASE}${pathFor('en', page)}"/>`,
    ].join('\n')
    const priority = page === 'privacy' ? '0.3' : page === 'home' ? (lang === 'en' ? '1.0' : '0.9') : '0.7'
    /* the one page whose date of change is written down; a build date on
       the others would claim a change that did not happen */
    const lastmod = page === 'privacy' ? `\n    <lastmod>${SITE.lastUpdated}</lastmod>` : ''
    return `  <url>\n    <loc>${BASE}${path}</loc>${lastmod}\n${alts}\n    <priority>${priority}</priority>\n  </url>`
  })
  .join('\n')

await writeFile(
  join(root, 'dist/sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
  'utf8',
)
console.log('wrote robots.txt and sitemap.xml for ' + BASE)
