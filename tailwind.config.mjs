/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        woltz: {
          bg: '#121214',      // Fundo principal (quase preto, mas não total)
          surface: '#1c1c1f', // Cartões e painéis laterais
          border: '#2a2a2d',  // Bordas sutis
          text: '#e1e1e6',    // Texto principal
          muted: '#8d8d99',   // Textos secundários
          accent: '#ffffff'   // Destaques e botões
        }
      },
      fontFamily: {
        masque: ['Masque', 'sans-serif'], // Preparado para sua logo/fonte
        sans: ['Inter', 'system-ui', 'sans-serif'] // Fonte base minimalista
      }
    }
  },
  plugins: []
}
