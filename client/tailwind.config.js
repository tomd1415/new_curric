echo "/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4da6ff',
          DEFAULT: '#0056b3',
          dark: '#003366',
        },
      },
    },
  },
  plugins: [],
}" > tailwind.config.js
