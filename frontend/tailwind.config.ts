import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#08111F",
        foreground: "#F8FAFC",
        card: "#111827",
        elevated: "#1a2332",
        sidebar: "#0C1528",
        border: "rgba(255, 255, 255, 0.06)",
        "border-medium": "rgba(255, 255, 255, 0.12)",
        muted: "#64748B",
        "muted-foreground": "#94A3B8",
        accent: {
          blue: "#4F7CFF",
          purple: "#7C3AED",
          cyan: "#00D4FF",
          emerald: "#22C55E",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        primary: {
          DEFAULT: "#4F7CFF",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          foreground: "#F8FAFC",
        },
        destructive: {
          DEFAULT: "#F43F5E",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.125rem",
      },
      boxShadow: {
        glow: "0 0 20px rgba(79, 124, 255, 0.15), 0 0 60px rgba(79, 124, 255, 0.05)",
        "glow-purple": "0 0 20px rgba(124, 58, 237, 0.15), 0 0 60px rgba(124, 58, 237, 0.05)",
        "glow-cyan": "0 0 20px rgba(0, 212, 255, 0.15), 0 0 60px rgba(0, 212, 255, 0.05)",
        "glow-emerald": "0 0 20px rgba(34, 197, 94, 0.15), 0 0 60px rgba(34, 197, 94, 0.05)",
        "soft": "0 4px 24px rgba(0, 0, 0, 0.25)",
        "soft-lg": "0 8px 40px rgba(0, 0, 0, 0.35)",
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "slide-down": "slide-down 0.3s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "spin-slow": "spin 20s linear infinite",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          from: { opacity: "0", transform: "translateY(-10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 15px rgba(79, 124, 255, 0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(79, 124, 255, 0.4)" },
        },
      },
    },
  },
  plugins: [],
}
export default config
