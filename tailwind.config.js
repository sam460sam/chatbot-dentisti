/** @type {import('tailwindcss').Config} */

/*
 * THE TWINBYTE PALETTE: navy, petrol, mint, cream.
 *
 * The token names are the old ones on purpose (paper, ink, teal, verm), so
 * every component kept its meaning while the colours changed underneath:
 *   paper = cream ground          ink  = navy text and dark plates
 *   teal  = petrol, the assistant verm = deep mint, the websites
 * `teal.bright` is mint itself: the bright accent on dark ground.
 *
 * Contrast, measured:
 *   - petrol on cream 4.8:1, ink-soft on cream 8.2:1, ink-mute on cream 5.4:1
 *     and on paper-deep 4.8:1 (the old 4.29:1 failure is gone).
 *   - verm (deep mint) on cream 4.8:1. verm-fill and mint are fills only,
 *     never text on light ground.
 *   - mint on navy 11.2:1, cream on navy 16.7:1.
 *   - `danger` is the one colour outside the palette: an error must look
 *     like an error. 6.6:1 on white, 5.7:1 on cream.
 */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  future: { hoverOnlyWhenSupported: true },
  theme: {
    /* A closed spacing set — the only vertical values on the page. */
    spacing: {
      0: '0px', px: '1px', 0.5: '4px',
      1: '8px', 2: '16px', 3: '24px', 4: '32px', 5: '40px',
      6: '48px', 7: '56px', 8: '72px', 9: '96px', 10: '120px', 11: '160px', 12: '200px',
    },
    /* A closed type scale. Line-heights in px so ruled rows snap to the baseline. */
    fontSize: {
      micro: ['11px', { lineHeight: '16px', letterSpacing: '0.14em' }],
      label: ['12px', { lineHeight: '16px', letterSpacing: '0.10em' }],
      small: ['14px', { lineHeight: '22px' }],
      body: ['16px', { lineHeight: '26px' }],
      lead: ['19px', { lineHeight: '30px' }],
      h4: ['21px', { lineHeight: '28px', letterSpacing: '-0.015em' }],
      h3: ['27px', { lineHeight: '34px', letterSpacing: '-0.02em' }],
      h2: ['38px', { lineHeight: '42px', letterSpacing: '-0.028em' }],
      h1: ['54px', { lineHeight: '56px', letterSpacing: '-0.035em' }],
      display: ['76px', { lineHeight: '74px', letterSpacing: '-0.04em' }],
    },
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F4EFE6', deep: '#EAE3D6', edge: '#D9D0C0',
          'edge-deep': '#CBC1AE', dim: '#B5AD9E', mute: '#9A9282',
        },
        ink: { DEFAULT: '#0A0F1E', soft: '#3F4659', mute: '#5A6173', edge: '#1B2742', raised: '#111A30' },
        teal: { DEFAULT: '#356F8E', deep: '#2A5A74', mid: '#4A88A8', bright: '#96D3C0' },
        verm: { DEFAULT: '#2F7563', fill: '#6DB8A2', deep: '#245C4D', bright: '#C9E8DE' },
        navy: '#0A0F1E',
        petrol: '#356F8E',
        mint: { DEFAULT: '#96D3C0', deep: '#6DB8A2' },
        cream: '#F4EFE6',
        danger: '#B42318',
      },
      fontFamily: {
        display: ['Bricolage', 'Georgia', 'serif'],
        sans: ['InterVariable', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['InstrumentSerif', 'Georgia', 'Times New Roman', 'serif'],
      },
      maxWidth: { content: '74rem', measure: '62ch', lead: '46ch', title: '17ch' },
      borderRadius: {
        /* Closed set. The square corner is the brand mark — see .mark-in / .mark-out. */
        none: '0px', sm: '4px', DEFAULT: '10px', lg: '16px',
      },
      keyframes: {
        /* Opacity and 2D transform only. No blur, no 3D, no filter — iOS Safari drops
           whole tiles when it has to composite those while scrolling. */
        rise: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fade: { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      animation: {
        rise: 'rise 420ms cubic-bezier(0.22, 1, 0.36, 1) both',
        fade: 'fade 500ms ease-out both',
      },
    },
  },
  plugins: [],
}
