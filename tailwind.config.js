/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
        "montserrat-mono": ["Montserrat", { fontFeatureSettings: '"tnum"' }],
      },
      colors: {
        primary: "#015b37",
        "primary-light": "#1a6b4b",
      },
    },
  },
  plugins: [],
};
