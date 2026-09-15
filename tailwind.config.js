/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#14181d',
          soft: '#3d4650',
          muted: '#5f6b77',
        },
        accent: {
          DEFAULT: '#0f766e',
          dark: '#0b5c56',
          light: '#e6f4f2',
        },
      },
      fontFamily: {
        sans: [
          'system-ui',
          '-apple-system',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      maxWidth: {
        content: '68rem',
      },
    },
  },
  plugins: [],
}
