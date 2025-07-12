import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Real estate investor focused colors
        investor: {
          navy: "#0A2342", // Deep navy (trust, stability)
          gold: "#D5A021", // Rich gold (wealth, success)
          green: "#1E5631", // Deep green (growth, prosperity)
          charcoal: "#2D3142", // Sophisticated dark (premium feel)
          cream: "#F8F4E3", // Warm cream (inviting, clean)
          burgundy: "#6E2B3D", // Rich burgundy (luxury, premium)
          slate: "#3F4E5E", // Business slate (professional)
          sand: "#D6C9B8", // Neutral sand (timeless, grounding)
        },
        // Original colors preserved
        green: {
          800: "#006400",
        },
        yellow: {
          100: "#ffffcc",
          300: "#ffff00",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.85" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
      },
      backgroundImage: {
        "wealth-gradient": "linear-gradient(135deg, #0A2342 0%, #1E5631 100%)",
        "gold-gradient": "linear-gradient(90deg, #D5A021 0%, #F2C94C 100%)",
      },
      boxShadow: {
        premium: "0 4px 14px 0 rgba(10, 35, 66, 0.1)",
        wealth: "0 8px 30px rgba(213, 160, 33, 0.2)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config

