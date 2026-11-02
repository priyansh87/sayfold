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
        serif: ["Charter", "Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
} satisfies Config;

