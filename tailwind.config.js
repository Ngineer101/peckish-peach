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
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
