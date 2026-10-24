
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#070a22',
          900: '#0b1030',
          800: '#131a47',
          700: '#1d2760',
        },
        volt: '#3b82f6',
        violet: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
        },
        sun: '#fbbf24',
      },
      fontFamily: {
        display: [
          '"Trebuchet MS"',
          '"Segoe UI"',
          'system-ui',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
