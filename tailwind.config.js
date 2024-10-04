/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: ["class"],

  theme: {
    fontFamily: {
      bicubik: ["Bicubik", "Arial", "Helvetica", "sans-serif"],
    },

    extend: {
      backgroundImage: {
        sign: "url('/src/assets/images/bg-sign.svg')",
        "landing-page": "url('/src/assets/images/bg-landing-page.png')",
        "landing-page-mobile": "url('/src/assets/images/bg-landing-page-mobile.svg')",
        "arrow-down-black": "url('/src/assets/icons/arrow-down-black.svg')",
        "arrow-down-white": "url('/src/assets/icons/arrow-down-white.svg')",
        "resizable-button": "url('/src/assets/icons/resizable-button.svg')",
      },

      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
      },

      colors: {
        black: "#031E30",
        white: "#FFFFFF",
        white_10: "#FFFFFF10",
        white_50: "#FFFFFF50",
        white_70: "#FFFFFF70",
        gray_dark: "#546172",
        gray: "#95A5BA",
        gray_lighter: "#D1DAE6",
        gray_light: "#F2F5F9",
        gray_placeholder: "#BDC6D2",
        yellow: "#D0B03F",
        yellow_light: "#FAF3DA",
        red: "#F10F0F",
        red_light: "#FBE7E7",
        green: "#04B30B",
        green_dark: "#071724",
        green_darker: "#1C3340",
        green_light: "#E0F8E1",
        green_1: "#152833",
        green_2: "#263A45",
        green_3: "#2C495A",
        green_4: "#243B48",
        green_5: "#365364",
        green_6: "#1F323C",
        green_7: "#294050",
        green_8: "#3E6277",
        green_9: "#1A313E",
        green_10: "#344B58",
        green_11: "#3C5E71",
        blue: "#3F96D0",
        blue_10: "#3F96D010",
        blue_light: "#E8EEF7",
        blue_dark: "#0B67A4",
        blue_1: "#87C0E7",
        blue_2: "#E3E9F1",
        blue_3: "#D7E2ED",
        blue_4: "#DFF2FC",
        blue_5: "#DBE6ED",
        blue_6: "#F1FAFF",
        blue_7: "#D8ECF9",
        gray_1: "#F9FCFF",
        gray_2: "#F0F2F5",
      },

      screens: {
        // "2xl": { max: "1920px" },
        xl: { max: "1440px" },
        lg: { max: "1024px" },
        md: { max: "768px" },
        sm: { max: "640px" },
      },
    },

    darkSelector: ".dark-mode", // Add this line to specify the dark mode selector
  },

  variants: {
    extend: {
      backgroundColor: ["dark-mode"], // Enable dark mode for background colors
      textColor: ["dark-mode"], // Enable dark mode for text colors
    },
  },

  plugins: [
    "tailwindcss-dark-mode", // Add the Tailwind Dark Mode plugin
    require("autoprefixer"),
  ],
};
