/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0F766E",     // Teal
        secondary: "#14B8A6",
        accent: "#22C55E"
      }
    },
  },
  plugins: [],
}