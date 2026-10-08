# Twinbyte — twinbyteservices.com

The site of Twinbyte: websites, a digital assistant and online ads for
small local businesses. Visitors book a free 15-minute call or
send a request. EN / NL / IT.

React + TypeScript + Vite + Tailwind (React runs as Preact). Booking runs on
Cloudflare Pages Functions with Google Calendar and Gmail — see
[BOOKING.md](BOOKING.md). No cookies, no analytics, no external fonts, so no
cookie banner.

## Commands

```bash
npm install
npm run dev      # local dev server (no booking API)
npm run dev:api  # build + wrangler with the pretend calendar (GOOGLE_MOCK=1)
npm run build    # typecheck + build + per-language HTML shells + checks
npm test         # the slot and mail tests
```

## Structure

- `src/components/` — pages and pieces. `BookingPage.tsx` is the home page
  (hero, booking card, services, closing); `Booker.tsx` is the booking flow;
  `Pages.tsx` the assistant / websites / prices pages.
- `src/i18n/` — all copy. `booking.ts` (booking + home), `home.ts` (hero line,
  ads card, footer), `en/nl/it.ts` (inner pages), `meta.json` (titles and
  descriptions, shared with the prerender script).
- `src/index.css` — type, spacing and the older section styles.
  `src/site.css` — the brand layer: cut corners, buttons, hero, header,
  footer, scroll motion. Read its header before adding motion.
- `public/brand/` — logo and mark SVGs. `public/media/` — photographs, the
  hero loop and the 3D mark film. Both are generated, see `tools/`.
- `scripts/prerender-meta.mjs` — after the build, one HTML shell per route
  with the right language, meta, hreflang and image preloads, a plain
  fallback for readers that run no script, JSON-LD on the home pages, and a
  not-found shell per language (`404.html`, `nl/404.html`, `it/404.html`).
- `public/_redirects` — deliberately no catch-all: an unknown address gets
  the nearest `404.html` with a real 404 status.
- `public/_headers` — security headers and year-long caching for the
  hashed files in `/assets/`.
- `scripts/check-placeholders.mjs` — fails the build on an unfilled
  placeholder, or on a title or description quoting a price that is no
  longer on the price list.

## Brand files (tools/)

- `python3 tools/logo.py` — the mark and lockups from code (exact geometry),
  plus `public/favicon.svg` and `src/brand/mark.ts`.
- `node tools/logo-png.mjs` — PNG icons and `og.png` from the SVGs.
- `python tools/logo-3d.py` — the turning 3D mark for the footer (Blender as
  a Python module). Pack the frames as described at the top of the file.

## Deploy — Cloudflare Pages (free plan)

Project `twinbyteservices`, connected to this repository:

- Production branch: `twinbyteservices`
- Build command: `npm run build` · Output: `dist` · Root: *(empty)*
- Environment variable: `NODE_VERSION=20`
- Custom domains: `twinbyteservices.com` and `www.twinbyteservices.com`
  (www redirects to the apex)

The booking secrets and their one-time setup are in [BOOKING.md](BOOKING.md).
The address the build stamps everywhere (canonical, sitemap, robots) is
`baseUrl` in `src/site.ts`.

## Still to fill in

- `src/i18n/*.ts` → privacy page: `TODO_LEGAL_NAME`, `TODO_ADDRESS`,
  `TODO_VAT_NUMBER`, `TODO_SUPERVISORY_AUTHORITY`. Withheld from the page
  until filled; the build warns.
