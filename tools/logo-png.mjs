/*
 * PNG icons and the link-preview image, rendered from public/brand/*.svg in a
 * headless browser so they match the SVGs exactly.
 *
 *     node tools/logo-png.mjs        (needs Playwright: PLAYWRIGHT=/path/to/playwright/index.mjs if not installed locally)
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright')
const root = resolve(import.meta.dirname, '..')
const svg = (name) => 'data:image/svg+xml;base64,' + readFileSync(`${root}/public/brand/${name}`).toString('base64')
const font = (name) => 'data:font/woff2;base64,' + readFileSync(`${root}/src/fonts/${name}`).toString('base64')

const icon = (size, bg, name, scale) => `
  <body style="margin:0;width:${size}px;height:${size}px;display:grid;place-items:center;background:${bg}">
    <img src="${svg(name)}" style="width:${Math.round(size * scale)}px;height:${Math.round(size * scale)}px">
  </body>`

const og = `
  <style>
    @font-face { font-family: Inter; src: url(${font('inter-latin-var.woff2')}) format('woff2'); font-weight: 100 900 }
    body { margin: 0; width: 1200px; height: 630px; background: radial-gradient(90% 120% at 85% 110%, #356F8E55, transparent 60%), #0A0F1E;
           display: flex; flex-direction: column; justify-content: center; padding: 0 96px; box-sizing: border-box; font-family: Inter }
    p { color: #96D3C0; font-size: 34px; font-weight: 500; letter-spacing: -0.01em; margin: 44px 0 0 }
    small { color: #C9C2B4; font-size: 22px; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 18px }
  </style>
  <img src="${svg('logo-on-dark.svg')}" style="height:150px;align-self:flex-start">
  <p>Websites · Digital assistant · Online ads</p>
  <small>For local businesses — twinbyteservices.com</small>`

const jobs = [
  ['icon-32.png', 32, icon(32, 'transparent', 'mark-flat.svg', 1)],
  ['icon-180.png', 180, icon(180, '#F4EFE6', 'mark.svg', 0.66)],
  ['icon-192.png', 192, icon(192, '#F4EFE6', 'mark.svg', 0.66)],
  ['icon-512.png', 512, icon(512, '#F4EFE6', 'mark.svg', 0.66)],
  ['og.png', [1200, 630], og],
]

const browser = await chromium.launch()
for (const [file, size, html] of jobs) {
  const [width, height] = Array.isArray(size) ? size : [size, size]
  const page = await browser.newPage({ viewport: { width, height } })
  await page.setContent(html)
  await page.evaluate(() => document.fonts.ready)
  await page.screenshot({ path: `${root}/public/${file}`, omitBackground: true })
  await page.close()
  console.log('wrote public/' + file)
}
await browser.close()
