export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sage / Nature-inspired palette
        primary: {
          50: '#f4f7f6',
          100: '#e3ebe8',
          200: '#c5d8d3',
          300: '#9dbbb4',
          400: '#759993',
          500: '#567c76', // Base Sage
          600: '#43615d',
          700: '#384f4c',
          800: '#30413f',
          900: '#2a3635',
          950: '#17201f',
        },
        accent: {
          50: '#fffbf0',
          100: '#fff5d6',
          200: '#ffe8ad',
          300: '#ffd675',
          400: '#ffc03d',
          500: '#f9a416', // Warm Gold/Amber
          600: '#dd8008',
          700: '#b75b09',
          800: '#94460e',
          900: '#7a3a0f',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      }
    },
  },
  plugins: [],
}
