import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(222 47% 3%)",
        foreground: "hsl(210 20% 92%)",
        card: {
          DEFAULT: "hsl(222 47% 6%)",
          foreground: "hsl(210 20% 92%)",
        },
        primary: {
          DEFAULT: "hsl(187 100% 45%)",
          foreground: "hsl(222 47% 3%)",
        },
        secondary: {
          DEFAULT: "hsl(215 28% 12%)",
          foreground: "hsl(210 20% 92%)",
        },
        muted: {
          DEFAULT: "hsl(215 28% 12%)",
          foreground: "hsl(240 4% 46%)",
        },
        accent: {
          DEFAULT: "hsl(199 89% 48%)",
          foreground: "hsl(222 47% 3%)",
        },
        destructive: "hsl(0 84% 60%)",
        border: "hsl(215 28% 14%)",
        input: "hsl(215 28% 14%)",
        ring: "hsl(187 100% 45%)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
    },
  },
  plugins: [],
}

export default config
