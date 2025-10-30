import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        primary: {
          DEFAULT: "#0287BE",
          foreground: "#F5F8FA",
        },
        accent: {
          DEFAULT: "#00C2FF",
          foreground: "#0C273C",
        },
        muted: {
          DEFAULT: "#F5F8FA",
          foreground: "#516173",
        },
        secondary: {
          DEFAULT: "#0B2746",
          foreground: "#F5F8FA",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#F5F8FA",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
      boxShadow: {
        glass: "0 24px 60px -30px rgba(2, 135, 190, 0.45)",
        card: "0 20px 45px -22px rgba(12, 39, 60, 0.18)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        heading: ["var(--font-heading)", "sans-serif"],
      },
      backgroundImage: {
        "hero-overlay":
          "linear-gradient(135deg, rgba(2, 135, 190, 0.75), rgba(0, 194, 255, 0.55))",
        "auth-pattern":
          "linear-gradient(135deg, rgba(2, 135, 190, 0.85), rgba(0, 194, 255, 0.65))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
