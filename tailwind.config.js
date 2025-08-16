/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'nfl-green': '#013369',
        'nfl-red': '#D50A0A',
      }
    },
  },
  plugins: [],
}