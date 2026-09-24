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
        theme: {
          bg: '#F1F3F7',
          card: '#FFFFFF',
          sidebar: '#111827',
          darkBg: '#090D16',
          darkCard: '#111827',
          teal: '#0D9488',
          tealHover: '#0F766E',
          tealLight: '#CCFBF1',
          accent: '#10B981',
          coral: '#F97316'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace']
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(0, 0, 0, 0.05), 0 1px 3px -1px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.06)'
      }
    },
  },
  plugins: [],
}
