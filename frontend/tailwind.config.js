/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#04070d",
          900: "#070b13",
          850: "#0a101c",
          800: "#0d1424",
          700: "#16203a",
        },
        brand: {
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
        gold: {
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(45, 212, 191, 0.45)",
        "glow-sm": "0 0 24px -6px rgba(45, 212, 191, 0.4)",
        "glow-gold": "0 0 36px -8px rgba(251, 191, 36, 0.4)",
        panel: "0 20px 60px -20px rgba(0, 0, 0, 0.6)",
      },
      backgroundImage: {
        "radial-fade":
          "radial-gradient(1200px 600px at 80% -10%, rgba(45,212,191,0.09), transparent 60%), radial-gradient(900px 500px at -10% 20%, rgba(251,191,36,0.05), transparent 60%)",
        "brand-gradient": "linear-gradient(135deg, #2dd4bf 0%, #0ea5e9 100%)",
        "carbon":
          "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0) 40%), linear-gradient(180deg, #0a101c 0%, #070b13 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "1", filter: "brightness(1)" },
          "50%": { opacity: "0.55", filter: "brightness(1.4)" },
        },
        "slide-right": {
          "0%": { opacity: "0", transform: "translateX(18px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        caret: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.45s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.4s ease-out both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-glow": "pulse-glow 2.2s ease-in-out infinite",
        "slide-right": "slide-right 0.35s cubic-bezier(0.22, 1, 0.36, 1) both",
        caret: "caret 1s steps(1) infinite",
        scan: "scan 3s linear infinite",
      },
    },
  },
  plugins: [],
};