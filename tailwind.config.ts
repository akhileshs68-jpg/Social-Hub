import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      colors: {
        brand: {
          pi: "#F4B814",
          premium: "#A855F7",
          dark: "#000000",
          surface: "#0A0A0A",
          elevated: "#121212",
          card: "#161616",
          border: "rgba(255,255,255,0.06)",
          active: "rgba(255,255,255,0.14)",
          muted: "#A1A1AA",
        },

        background: "#000000",
        foreground: "#FFFFFF",

        card: {
          DEFAULT: "#111111",
          foreground: "#FFFFFF",
        },
      },

      spacing: {
        "safe-top": "env(safe-area-inset-top, 0px)",
        "safe-bottom": "env(safe-area-inset-bottom, 0px)",
      },

      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },

      backdropBlur: {
        xs: "2px",
      },

      boxShadow: {
        soft: "0 4px 30px rgba(0,0,0,0.25)",
        glow: "0 0 30px rgba(168,85,247,0.35)",
        premium: "0 8px 40px rgba(0,0,0,0.45)",
      },

      backgroundImage: {
        "premium-gradient":
          "linear-gradient(135deg, #F4B814 0%, #DF2A77 50%, #8A3AB9 100%)",

        "story-gradient":
          "linear-gradient(135deg,#F4B814,#DF2A77,#8A3AB9)",

        "glass-gradient":
          "linear-gradient(to bottom right, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
      },

      letterSpacing: {
        tightest: "-0.03em",
      },

      keyframes: {
        fadeUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(12px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },

        pulseGlow: {
          "0%,100%": {
            opacity: "1",
          },
          "50%": {
            opacity: ".6",
          },
        },

        scaleIn: {
          "0%": {
            opacity: "0",
            transform: "scale(.95)",
          },
          "100%": {
            opacity: "1",
            transform: "scale(1)",
          },
        },
      },

      animation: {
        fadeUp: "fadeUp .35s ease-out",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        scaleIn: "scaleIn .25s ease-out",
      },

      fontSize: {
        xs: ["12px", "18px"],
        sm: ["14px", "20px"],
        base: ["16px", "24px"],
        lg: ["18px", "28px"],
        xl: ["20px", "30px"],
        "2xl": ["24px", "34px"],
        "3xl": ["30px", "40px"],
      },
    },
  },

  plugins: [],
}

export default config