import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "var(--brand-primary)",
          "primary-dark": "var(--brand-primary-dark)",
          bg: "var(--brand-bg)",
          "bg-secondary": "var(--brand-bg-secondary)",
          "bg-tertiary": "var(--brand-bg-tertiary)",
          accent: "var(--brand-accent)",
          "accent-secondary": "var(--brand-accent-secondary)",
          text: "var(--brand-text)",
          muted: "var(--brand-muted)",
          faint: "var(--brand-faint)",
          border: "var(--brand-border)",
          "border-glow": "var(--brand-border-glow)",
        },
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
        sans: ["'Inter'", "ui-sans-serif", "system-ui"],
      },
      animation: {
        "glitch-1": "glitch1 0.4s steps(2) infinite",
        "glitch-2": "glitch2 0.4s steps(2) infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "scan-line": "scanLine 3s linear infinite",
        "flicker": "flicker 0.15s infinite linear",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "ticker": "ticker 20s linear infinite",
      },
      keyframes: {
        glitch1: {
          "0%, 100%": { clipPath: "inset(0 0 95% 0)", transform: "translate(-2px, 0)" },
          "50%": { clipPath: "inset(80% 0 0 0)", transform: "translate(2px, 0)" },
        },
        glitch2: {
          "0%, 100%": { clipPath: "inset(50% 0 30% 0)", transform: "translate(2px, 0)" },
          "50%": { clipPath: "inset(10% 0 60% 0)", transform: "translate(-2px, 0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px var(--brand-primary), 0 0 40px var(--brand-primary)" },
          "50%": { boxShadow: "0 0 40px var(--brand-primary), 0 0 80px var(--brand-primary)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        flicker: {
          "0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%": { opacity: "1" },
          "20%, 24%, 55%": { opacity: "0.4" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        "neon-primary": "0 0 20px var(--brand-primary), 0 0 40px var(--brand-primary-dark)",
        "neon-accent": "0 0 20px var(--brand-accent), 0 0 40px var(--brand-accent)",
        "neon-sm": "0 0 8px var(--brand-primary)",
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(var(--brand-border) 1px, transparent 1px), linear-gradient(90deg, var(--brand-border) 1px, transparent 1px)",
        "scanline": "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,178,0.03) 2px, rgba(0,255,178,0.03) 4px)",
      },
      backgroundSize: {
        "grid": "40px 40px",
      },
    },
  },
  plugins: [],
};

export default config;
