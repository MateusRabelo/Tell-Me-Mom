/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // Importante: não purgar classes do Ionic
  safelist: [
    {
      pattern: /ion-*/,
    },
  ],
}