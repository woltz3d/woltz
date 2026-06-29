/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        woltz: {
          bg: '#0a0e17',
          surface: '#111827',
          border: '#1e293b',
          text: '#e2e8f0',
          muted: '#64748b',
          accent: '#a8b5c4'
        }
      },
      fontFamily: {
        display: ['Anton', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
