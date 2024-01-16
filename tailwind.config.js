/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat"],
        lato: ["Lato"],
        garamond: ["Garamond"],
      },
      colors: {
        "lsf-green": "#015b37",
        "lsf-green-light": "#1a6b4b",
      },
    },
  },
  plugins: [],
};
