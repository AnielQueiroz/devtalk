import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */

export default {

  content: [

    "./index.html",

    "./src/**/*.{js,ts,jsx,tsx}",

  ],

  theme: {

    extend: {},

  },

  daisyui: {
    themes: [
      "synthwave",
      "black",
      "retro"
    ]
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

}
