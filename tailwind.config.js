const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      orange: {
        DEFAULT: '#ffb383',
      },
      lightGreen: {
        DEFAULT: '#C6E5B3',
      },
      white: colors.white,
      black: colors.black,
      red: colors.red,
      blue: colors.blue,
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
