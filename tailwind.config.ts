import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#2563EB",
        background: "#F8FAFC",
        foreground: "#0F172A",
        primary: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF"
        },
        secondary: {
          DEFAULT: "#EFF6FF",
          foreground: "#1D4ED8"
        },
        muted: {
          DEFAULT: "#F1F5F9",
          foreground: "#64748B"
        },
        accent: {
          DEFAULT: "#DBEAFE",
          foreground: "#1E3A8A"
        },
        success: {
          DEFAULT: "#16A34A",
          foreground: "#F0FDF4"
        },
        card: "#FFFFFF"
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem"
      },
      boxShadow: {
        soft: "0 20px 45px -30px rgba(37, 99, 235, 0.35)"
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        }
      },
      animation: {
        shake: 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "sans-serif"],
        heading: ["var(--font-sora)", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
