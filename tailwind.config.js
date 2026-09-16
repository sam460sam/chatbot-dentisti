/** @type {import('tailwindcss').Config} */

/*
 * TWO INKS.
 *
 * Teal is the assistant. Terracotta is the websites. There is no third accent.
 * A visitor who came for one half of the business can follow it down the page by
 * colour alone — the thing the old single-accent palette could not do.
 *
 * Contrast, measured rather than assumed:
 *   - On `paper` every pairing below passes AA.
 *   - On `paper-deep`, `ink-mute` does NOT (4.29:1). Use `ink-soft` there.
 *   - On a `teal` or `verm` flood ONLY `paper` at full strength passes AA (7.77 / 5.82).
 *     There is no dimmed secondary text on a flood; flood sections carry short, bright copy.
 *   - `verm` is the text-safe terracotta (5.82 on paper). `verm-fill` is lighter and is for
 *     fills and rules only, never text. The split is in the name so the mistake is visible.
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
          DEFAULT: '#F5F2EC', deep: '#EAE5DA', edge: '#D9D4C8',
          'edge-deep': '#CFC9BB', dim: '#B4AFA3', mute: '#9A9488',
        },
        ink: { DEFAULT: '#17160F', soft: '#4A4740', mute: '#6E6A60', edge: '#3F3C33' },
        teal: { DEFAULT: '#0E5266', deep: '#0A3F4F', bright: '#59B9CC' },
        verm: { DEFAULT: '#A8371F', fill: '#C8622F', deep: '#8C2C17', bright: '#D96A46' },
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
