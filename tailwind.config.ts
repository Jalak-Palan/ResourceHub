import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: "#FFFDFB",
          100: "#FFF7F1",
          200: "#FCEEE5",
          300: "#F8D8C8",
          400: "#F2BFA6",
          500: "#E77B52",
        },
        peach: {
          DEFAULT: "#E77B52",
          50: "#FFF5EF",
          100: "#FCEEE5",
          200: "#F8D8C8",
          300: "#F2B89F",
          400: "#EB9673",
          500: "#E77B52",
          600: "#D3683E",
          700: "#B85129",
          800: "#923E1D",
        },
        dark: {
          DEFAULT: "#29201D",
          text: "#29201D",
          muted: "#89817D",
          subtle: "#B5ACA7",
        },
        success: {
          DEFAULT: "#16A34A",
          bg: "#EBF9F0",
          border: "#BBF7D0",
          text: "#15803D",
        },
        warning: {
          DEFAULT: "#D97706",
          bg: "#FFFBEB",
          border: "#FDE68A",
          text: "#B45309",
        },
        danger: {
          DEFAULT: "#DC2626",
          bg: "#FEF2F2",
          border: "#FECACA",
          text: "#B91C1C",
        },
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(231, 123, 82, 0.08)",
        card: "0 6px 24px -4px rgba(41, 32, 29, 0.06)",
        float: "0 10px 30px -5px rgba(231, 123, 82, 0.2)",
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
