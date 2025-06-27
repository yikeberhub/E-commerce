/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "custom-gradient": "linear-gradient(62deg, #8EC5FC 0%, #E0C3FC 100%)",
      },
    },
  },
  plugins: [],
};
