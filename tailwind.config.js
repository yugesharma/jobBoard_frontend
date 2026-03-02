/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        background: '#F0F0F0',
        foreground: '#121212',
        'primary-red': '#D02020',
        'primary-blue': '#1040C0',
        'primary-yellow': '#F0C020',
        border: '#121212',
        muted: '#E0E0E0',
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
        full: '9999px',
      },
      boxShadow: {
        'bauhaus-sm': '3px 3px 0px 0px #121212',
        'bauhaus': '4px 4px 0px 0px #121212',
        'bauhaus-md': '6px 6px 0px 0px #121212',
        'bauhaus-lg': '8px 8px 0px 0px #121212',
      },
      transitionDuration: {
        '200': '200ms',
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
