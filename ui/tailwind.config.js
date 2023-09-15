const baseTheme = {
  "--rounded-box": "0.5rem",
  "--rounded-btn": ".25rem",
  "--rounded-badge": ".25rem",
};

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
    darkMode: "dark",
    themes: [
      {
        light: {
          ...baseTheme,
          "color-scheme": "light",
          primary: "#570df8",
          "primary-content": "#E0D2FE",
          secondary: "#f000b8",
          "secondary-content": "#FFD1F4",
          accent: "#1ECEBC",
          "accent-content": "#07312D",
          neutral: "#2B3440",
          "neutral-content": "#D7DDE4",
          "base-100": "#ffffff",
          "base-200": "#F2F2F2",
          "base-300": "#E5E6E6",
        },
        dark: {
          ...baseTheme,
          "color-scheme": "dark",
          primary: "#1C4E80",
          secondary: "#7C909A",
          accent: "#EA6947",
          neutral: "#23282E",
          "base-100": "#080808",
          info: "#0091D5",
          success: "#6BB187",
          warning: "#DBAE59",
          error: "#AC3E31",
        },
        luxury: {
          ...baseTheme,
          "color-scheme": "dark",
          primary: "#ffffff",
          secondary: "#152747",
          accent: "#513448",
          neutral: "#331800",
          "neutral-content": "#FFE7A3",
          "base-100": "#09090b",
          "base-200": "#171618",
          "base-300": "#2e2d2f",
          "base-content": "#dca54c",
          info: "#66c6ff",
          success: "#87d039",
          warning: "#e2d562",
          error: "#ff6f6f",
        },
      },
    ],
  },
};
