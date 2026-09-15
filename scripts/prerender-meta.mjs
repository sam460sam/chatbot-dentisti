/**
 * Writes one static HTML shell per language/page after the Vite build, so that
 * crawlers and link previews get the right title, description and hreflang
 * without running JavaScript. The app itself still renders client-side.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const BASE = 'https://twinbyte.pages.dev'
const LANGS = ['en', 'nl', 'it']

const meta = JSON.parse(await readFile(join(root, 'src/i18n/meta.json'), 'utf8'))
const template = await readFile(join(root, 'dist/index.html'), 'utf8')

const pathFor = (lang, page) =>
  (lang === 'en' ? '' : `/${lang}`) + (page === 'privacy' ? '/privacy' : '') || '/'

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;')

for (const lang of LANGS) {
  for (const page of ['home', 'privacy']) {
    const path = pathFor(lang, page)
    const title = page === 'privacy' ? meta[lang].privacyTitle : meta[lang].title
    const description = page === 'privacy' ? meta[lang].privacyDescription : meta[lang].description

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
      .replace(/<!-- alt:start -->[\s\S]*?<!-- alt:end -->/, alternates)

    const outDir = join(root, 'dist', path === '/' ? '.' : path)
    await mkdir(outDir, { recursive: true })
    await writeFile(join(outDir, 'index.html'), html, 'utf8')
    console.log(`prerendered ${path}`)
  }
}
