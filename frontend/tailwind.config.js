/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
      },
      colors: {
        primary: {
          50: "#f0f9fc",
          100: "#dcf0f7",
          200: "#b9e1ef",
          300: "#8ecfe3",
          400: "#57bbdd",
          500: "#35a4cc",
          600: "#2586ac",
          700: "#1f6b8a",
          800: "#1d5670",
          900: "#1c485e",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 2px 8px -2px rgba(15, 23, 42, 0.08), 0 8px 24px -4px rgba(15, 23, 42, 0.06)",
        card: "0 1px 2px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};
