/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: "#641B25",
        burgundy: "#42121B",
        gold: "#C5A15B",
        "gold-soft": "#D9BF87",
        ivory: "#FFF8EC",
        terracotta: "#B85C38",
        saffron: "#D99A35",
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        "serif-display": ["Cormorant Garamond", "Cardo", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
}
