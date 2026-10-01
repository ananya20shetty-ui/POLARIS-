/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        carbon: {
          950: '#0A0D10',
          900: '#111519',
          850: '#171C22',
          800: '#1E252D',
          750: '#262F39',
          700: '#2E3945',
          650: '#364451',
          600: '#3E4C5C',
          500: '#526477',
        },
        aurora: {
          950: '#022118',
          900: '#064E3B',
          800: '#065F46',
          700: '#047857',
          600: '#059669',
          500: '#10B981',
          400: '#34D399',
          300: '#6EE7B7',
          200: '#A7F3D0',
          100: '#D1FAE5',
          50: '#ECFDF5',
        },
        ochre: {
          950: '#261203',
          900: '#451A03',
          800: '#78350F',
          700: '#B45309',
          600: '#D97706',
          500: '#F59E0B',
          400: '#FBBF24',
          300: '#FCD34D',
          200: '#FDE68A',
          100: '#FEF3C7',
          50: '#FFFBEB',
        },
        frost: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
}
