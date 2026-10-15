/*
 * The short links behind the QR codes: /wa/{lang} and /wa/{lang}/{page}.
 *
 * Each one is a 302 to the same wa.me link the page's WhatsApp button
 * opens, with the same prefilled message. The QR codes (public/brand/
 * qr-wa-*.svg, made once by tools/qr.py) encode only the short address,
 * so they stay small and never need regenerating when a message changes:
 * the messages live in src/i18n/contact.ts, and this script, run after
 * `vite build`, writes the redirects from there.
 *
 * Run by `npm run build` with `node --experimental-strip-types`, which is
 * why site.ts and contact.ts use type-only imports.
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { SITE, waLink } from '../src/site.ts'
import { contact, CONTACT_PAGES, PAGE_PREFILL } from '../src/i18n/contact.ts'

const LANGS = ['en', 'nl', 'it']
const out = fileURLToPath(new URL('../dist/_redirects', import.meta.url))

const lines = []
for (const lang of LANGS) {
  const prefill = contact[lang]?.prefill
  if (!prefill) throw new Error(`wa-redirects: no contact copy for "${lang}"`)
  const rows = [[`/wa/${lang}`, prefill.default], ...CONTACT_PAGES.map((page) => [`/wa/${lang}/${page}`, prefill[PAGE_PREFILL[page]]])]
  for (const [path, text] of rows) {
    if (typeof text !== 'string' || !text.trim()) throw new Error(`wa-redirects: missing prefill for ${path}`)
    lines.push(`${path} ${waLink(text)} 302`)
  }
}

if (lines.length !== 12) throw new Error(`wa-redirects: expected 12 short links, made ${lines.length}`)
if (!existsSync(out)) throw new Error('wa-redirects: dist/_redirects is missing; run vite build first')
if (readFileSync(out, 'utf8').includes('/wa/')) throw new Error('wa-redirects: dist/_redirects already has /wa/ lines')

appendFileSync(out, [
  '',
  `# WhatsApp short links for the QR codes (scripts/wa-redirects.mjs): each opens`,
  `# the chat with ${SITE.whatsappDisplay}, message ready, exactly as the page's button does.`,
  ...lines,
  '',
].join('\n'))
console.log(`wa-redirects: ${lines.length} short links appended to dist/_redirects`)
