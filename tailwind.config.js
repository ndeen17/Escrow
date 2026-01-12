/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'escon-green': '#ADF033',
        'escon-green-hover': '#9DE020',
      },
    },
  },
  plugins: [],
}
