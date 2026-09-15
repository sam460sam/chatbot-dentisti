/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /* Text on dark ground. */
        ink: {
          DEFAULT: '#e9f0f4',
          soft: '#a9bdc7',
          muted: '#7c929d',
        },
        /* Surfaces, from the page ground up to a raised card. */
        surface: {
          sunken: '#080d13',
          DEFAULT: '#0d141c',
          raised: '#121b25',
        },
        night: {
          DEFAULT: '#070c16',
          soft: '#0d1524',
          card: '#131c2e',
        },
        /* Brand colours, taken from the logo. */
        accent: {
          DEFAULT: '#1f6f8b',
          dark: '#175a72',
          bright: '#7fd3c1',
          light: '#e8f1f4',
        },
      },
      fontFamily: {
        sans: [
          'InterVariable',
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      maxWidth: { content: '76rem' },
      boxShadow: {
        lift: '0 24px 60px -24px rgba(16, 23, 34, 0.35)',
        glow: '0 0 0 1px rgba(45, 212, 191, 0.25), 0 20px 60px -20px rgba(13, 148, 136, 0.55)',
        float: '0 40px 90px -30px rgba(7, 12, 22, 0.65)',
      },
      keyframes: {
        drift: {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%': { transform: 'translate3d(2%, -4%, 0) scale(1.08)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        blink: {
          '0%, 100%': { opacity: '0.25' },
          '50%': { opacity: '1' },
        },
        pop: {
          '0%': { opacity: '0', transform: 'translateY(8px) scale(0.98)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-120%)' },
          '100%': { transform: 'translateX(220%)' },
        },
      },
      animation: {
        drift: 'drift 18s ease-in-out infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        blink: 'blink 1.2s ease-in-out infinite',
        pop: 'pop 0.45s cubic-bezier(0.22, 1, 0.36, 1) both',
        sheen: 'sheen 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
