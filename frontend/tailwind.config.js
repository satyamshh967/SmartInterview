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
        dark: {
          900: '#090D16',
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
        },
        brand: {
          500: '#6366F1',
          600: '#4F46E5',
          accent: '#06B6D4'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'JetBrains Mono', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
}
