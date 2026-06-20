import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        salonBlack: "#050505",
        salonGold: "#E4007C",
        salonPink: "#E4007C",
        blush: "#F6C6CF",
        rose: "#8A2942",
        champagne: "#FCE4F1",
        ivory: "#FFF9F0",
        beige: "#E8D7B7",
        charcoal: "#222222",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        serif: ["var(--font-playfair)", "Playfair Display", "serif"],
        arabic: ["var(--font-cairo)", "Cairo", "sans-serif"],
      },
      boxShadow: {
        gold: "0 18px 50px rgba(228, 0, 124, 0.26)",
        soft: "0 18px 60px rgba(34, 34, 34, 0.10)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(135deg, #E4007C, #FFD1DC, #F6C6CF)",
        "salon-pattern":
          "radial-gradient(circle at 20% 20%, rgba(228,0,124,0.18), transparent 28%), radial-gradient(circle at 80% 10%, rgba(228,0,124,0.20), transparent 22%), radial-gradient(circle at 50% 85%, rgba(246,198,207,0.34), transparent 30%)",
      },
    },
  },
  plugins: [],
};

export default config;
