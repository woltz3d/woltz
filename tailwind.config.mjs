/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        woltz: {
          bg: '#121214',
          surface: '#1c1c1f',
          border: '#2a2a2d',
          text: '#e1e1e6',
          muted: '#8d8d99',
          accent: '#ffffff'
        }
      },
      fontFamily: {
        masque: ['Masque', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}
