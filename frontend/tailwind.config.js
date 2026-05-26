/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink:    "#0D1117",
        navy:   "#0F2A4A",
        gold:   "#C9A84C",
        "gold-light": "#E8C97A",
        "gold-dim":   "#8A6E2F",
        parchment: "#F5EFE0",
        "parchment-dark": "#E8DFC8",
        slate:  "#4A5568",
        mist:   "#EEF2F7",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        body:    ["'DM Sans'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #C9A84C 0%, #E8C97A 50%, #C9A84C 100%)",
        "navy-gradient": "linear-gradient(160deg, #0F2A4A 0%, #1a3a5c 50%, #0F2A4A 100%)",
        "parchment-gradient": "linear-gradient(180deg, #F5EFE0 0%, #EDE5CC 100%)",
      },
      boxShadow: {
        "gold": "0 0 30px rgba(201,168,76,0.3)",
        "card": "0 4px 24px rgba(15,42,74,0.12)",
        "card-hover": "0 8px 40px rgba(15,42,74,0.2)",
      },
      animation: {
        "fade-up":   "fadeUp 0.6s ease forwards",
        "fade-in":   "fadeIn 0.4s ease forwards",
        "shimmer":   "shimmer 2s linear infinite",
        "pulse-gold":"pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:    { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        pulseGold: { "0%,100%": { boxShadow: "0 0 20px rgba(201,168,76,0.2)" }, "50%": { boxShadow: "0 0 40px rgba(201,168,76,0.5)" } },
      },
    },
  },
  plugins: [],
}
