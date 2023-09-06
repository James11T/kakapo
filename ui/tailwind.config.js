/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kakapo: {
          100: "#425312",
          200: "#475E21",
          300: "#5A7932",
          400: "#6C8D46",
          500: "#82AD5A",
          600: "#8BC05B",
          700: "#8ECD56",
          800: "#8DD650",
          900: "#94E549",
        },
      },
    },
  },
  plugins: [require("daisyui")],
  safelist: [],
  daisyui: {
    themes: ["light", "dark", "luxury"],
  },
};
