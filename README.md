# Twinbyte — showcase site

Static marketing site for Twinbyte (Anna & Samuele): an AI assistant for dental
practices and websites for small businesses.

React + TypeScript + Vite + Tailwind. No backend, no CMS, no cookies, no
analytics, no external fonts — so no cookie banner is needed.

## Commands

```bash
npm install
npm run dev      # local dev server
npm run build    # typecheck + build + per-language HTML shells in dist/
npm run preview  # serve dist/
```

## Structure

- `src/i18n/` — all copy. `meta.json` holds titles/descriptions (shared with the
  prerender script); `en.ts`, `nl.ts`, `it.ts` hold the rest, typed by `types.ts`.
- `src/router.tsx` — tiny path router: `/`, `/privacy`, `/nl`, `/nl/privacy`,
  `/it`, `/it/privacy`.
- `scripts/prerender-meta.mjs` — after the Vite build, writes one HTML shell per
  route with the right `lang`, title, description, OG tags and hreflang, so link
  previews and crawlers are correct per language without running JS.
- `public/_redirects` — SPA fallback for Cloudflare Pages.

## Deploy — Cloudflare Pages (free plan)

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** →
   **Connect to Git** → pick this repository.
2. Settings:
   - Framework preset: **None** (or Vite)
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: *(leave empty)*
   - Environment variables: **none needed**
   - Node version: 20 or newer (set `NODE_VERSION=20` if the build fails on an
     older default).
3. Deploy. The site lands on `https://<project>.pages.dev`.
4. Replace the domain in `src/site.ts` (`baseUrl`), `index.html`,
   `scripts/prerender-meta.mjs` (`BASE`), `public/robots.txt` and
   `public/sitemap.xml` with the real one, then push again.

## TODO before going live

- `src/site.ts` → `baseUrl`: final Pages/custom domain (also in the four files above).
- `src/i18n/*.ts` → privacy page: `TODO_LEGAL_NAME`, `TODO_ADDRESS`,
  `TODO_VAT_NUMBER`, `TODO_SUPERVISORY_AUTHORITY`.
- `src/components/Home.tsx` → `PRICE_TODO`: the monthly price, once decided.
- `index.html` → `TWINBYTE_WIDGET` comment: uncomment to put the assistant on
  this site too.
