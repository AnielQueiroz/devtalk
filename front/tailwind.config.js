import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {},
  },

  // daisyui: {
  //   themes: [
  //     {
  //       neneltheme: {
  //         "primary": "#000000",
  //         "secondary": "#fcd34d",
  //       }
  //     }
  //   ]
  // },

  plugins: [daisyui],
  daisyui: {
    themes: [
      "light",
      "dark",
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
      {
        devTalk: {
          primary: "#000000",
          secondary: "#ffff00",
          accent: "#ff00ff",
          neutral: "#ff00ff",
          "base-100": "#000000",
          "base-200": "#333300",
          // "base-300": "#330033",
          info: "#00ffff",
          success: "#00ff00",
          warning: "#00ff00",
          error: "#ff0000",
        },
      },
    ],
  },
};
