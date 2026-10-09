#!/usr/bin/env node
/*
 * demo-screens.mjs — the demo practice as the screens on /websites show it.
 *
 * Full-page screenshots of /demo/, /demo/nl/ and /demo/it/ from a local
 * build: once as a desktop (1440 wide) and once as a phone (390 wide), with
 * reduced motion (no film plays), fonts and pictures loaded, and the floating
 * chat button and the phone's bottom bar hidden (in a full-page shot a fixed
 * bar would be painted once, in the middle of nowhere). Each shot is rendered
 * straight at the width the device screen needs at 2x and again at 1x, then
 * encoded to WebP by the browser itself, so nothing but Playwright is needed.
 *
 *   npm run build
 *   npx -y wrangler@4 pages dev dist --port 8806 --compatibility-date 2026-09-01
 *   node tools/demo-screens.mjs [http://localhost:8806]
 *
 * Writes public/media/screens/demo-{desk,phone}-{en,nl,it}[-1x].webp and
 * src/components/demoScreens.ts (their sizes, which the page needs to know
 * how far each picture scrolls).
 */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs'
import { mkdirSync, writeFileSync, statSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public/media/screens')
const BASE = (process.argv[2] || 'http://localhost:8806').replace(/\/$/, '')
const QUALITY = 0.7

const LANGS = { en: '/demo/', nl: '/demo/nl/', it: '/demo/it/' }

/* `width`: the CSS width the page is laid out at. `out`: the pixel width of
   the 2x picture — the largest the screen in src/components/DeviceScroll.tsx
   is ever drawn, times two. `cut`: how much of the bottom to leave off (the
   footer of the practice adds weight and nothing to look at). */
const SHOTS = {
  desk: { width: 1440, height: 900, out: 1280, mobile: false },
  phone: { width: 390, height: 844, out: 400, mobile: true },
}

const HIDE = `
  .launch, .dock, .panel { display: none !important; }
  html { scroll-behavior: auto !important; }
`

mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

/* the page that turns a PNG into a WebP: canvas.toBlob does the encoding */
const encoder = await browser.newPage()
async function toWebp(png) {
  const b64 = await encoder.evaluate(
    async ({ src, q }) => {
      const img = new Image()
      img.src = src
      await img.decode()
      const c = document.createElement('canvas')
      c.width = img.naturalWidth
      c.height = img.naturalHeight
      c.getContext('2d').drawImage(img, 0, 0)
      const blob = await new Promise((r) => c.toBlob(r, 'image/webp', q))
      const buf = new Uint8Array(await blob.arrayBuffer())
      let s = ''
      for (let i = 0; i < buf.length; i += 0x8000) s += String.fromCharCode(...buf.subarray(i, i + 0x8000))
      return btoa(s)
    },
    { src: `data:image/png;base64,${png.toString('base64')}`, q: QUALITY },
  )
  return Buffer.from(b64, 'base64')
}

async function shoot(path, shot, scale) {
  const ctx = await browser.newContext({
    viewport: { width: shot.width, height: shot.height },
    deviceScaleFactor: scale,
    isMobile: shot.mobile,
    hasTouch: shot.mobile,
    reducedMotion: 'reduce',
  })
  const page = await ctx.newPage()
  await page.goto(BASE + path, { waitUntil: 'networkidle' })
  await page.addStyleTag({ content: HIDE })
  // walk down once so lazy pictures load, then back to the top
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += shot.height / 2) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await page.waitForTimeout(60)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all(
      [...document.images].map((i) => (i.complete ? null : new Promise((r) => (i.onload = i.onerror = r)))),
    )
  })
  await page.waitForTimeout(400)
  const footer = await page.evaluate(() => {
    const f = document.querySelector('footer')
    return f ? f.getBoundingClientRect().top + window.scrollY : document.documentElement.scrollHeight
  })
  const png = await page.screenshot({
    fullPage: true,
    clip: { x: 0, y: 0, width: shot.width, height: Math.round(footer) },
  })
  await ctx.close()
  return png
}

const sizes = {}
for (const [lang, path] of Object.entries(LANGS)) {
  sizes[lang] = {}
  for (const [kind, shot] of Object.entries(SHOTS)) {
    const files = {}
    for (const [suffix, w] of [['', shot.out], ['-1x', shot.out / 2]]) {
      const png = await shoot(path, shot, w / shot.width)
      const webp = await toWebp(png)
      const name = `demo-${kind}-${lang}${suffix}.webp`
      writeFileSync(join(OUT, name), webp)
      const dims = await encoder.evaluate(async (src) => {
        const i = new Image()
        i.src = src
        await i.decode()
        return [i.naturalWidth, i.naturalHeight]
      }, `data:image/webp;base64,${webp.toString('base64')}`)
      files[suffix || '2x'] = { name, w: dims[0], h: dims[1] }
      console.log(`${name}  ${dims[0]}x${dims[1]}  ${(statSync(join(OUT, name)).size / 1024).toFixed(0)} KB`)
    }
    sizes[lang][kind] = { w: files['2x'].w, h: files['2x'].h, w1: files['-1x'].w }
  }
}
await browser.close()

writeFileSync(
  join(ROOT, 'src/components/demoScreens.ts'),
  `/* Written by tools/demo-screens.mjs — the pixel sizes of the demo
   screenshots in public/media/screens (2x; w1 is the 1x width). Run the
   script again when the demo changes; do not edit by hand. */
export const DEMO_SCREENS = ${JSON.stringify(sizes, null, 2)} as const
`,
)
console.log('wrote src/components/demoScreens.ts')
