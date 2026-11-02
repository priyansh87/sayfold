import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        sayfold: {
          bg: "#F6F1E9",
          charcoal: "#1F1E1B",
          accent: "#E8643C",
          "accent-hover": "#D4532B",
          "accent-light": "#FDF2EC",
          border: "#E7DFD3",
          muted: "#6E6B65",
          card: "#FFFFFF",
          "card-dark": "#161513",
        },
        parchment: {
          50: "#faf8f5",
          100: "#f5f1ea",
          200: "#eae2d5",
          300: "#ded0bd",
          400: "#c7b296",
          500: "#ab9273",
          600: "#8f7556",
          700: "#745d43",
          800: "#5c4936",
          900: "#45372a",
        },
        ink: {
          50: "#f6f6f7",
          100: "#e7e7e9",
          200: "#d1d1d6",
          300: "#b0b0b8",
          400: "#888893",
          500: "#6d6d78",
          600: "#575760",
          700: "#44444b",
          800: "#27272a",
          900: "#18181b",
          950: "#0e0e10",
        },
      },
      fontFamily: {
        serif: ["var(--font-newsreader)", "Newsreader", "Fraunces", "Charter", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

