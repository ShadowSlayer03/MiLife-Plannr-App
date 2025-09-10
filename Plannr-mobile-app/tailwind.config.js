/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
    "./navigation/**/*.{js,jsx,ts,tsx}",
    "./config/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        //Heading
        "bricolage": ["bricolage"],
        "bricolage-semibold": ["bricolage-semibold"],
        "bricolage-bold": ["bricolage-bold"],
        //Inside text
        "kanit": ["kanit"],
        "kanit-bold": ["kanit-bold"],
        "kanit-semibold": ["kanit-semibold"],
      },
      colors: {
        "mi-purple": "#602c66",
        "mi-pink": "#d15782",
        "mi-tint-light": "#0a7ea4",
        "mi-tint-dark": "#ffffff",
        "mi-text-light": "#11181C",
        "mi-text-dark": "#ECEDEE",
        "mi-bg-light": "#ffffff",
        "mi-bg-dark": "#151718",
      },
    },
  },
  plugins: [],
};
