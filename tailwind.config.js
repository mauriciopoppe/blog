/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors')

module.exports = {
  prefix: 'tw-',
  content: ['src/**/*.{tsx,jsx}', 'site/content/**/*.md', 'site/layouts/**/*.html'],
  theme: {
    extend: {
      colors: {
        // TODO(tailwind): define these variables as CSS variables following https://tailwindcss.com/docs/customizing-colors#using-css-variables
        primary: 'rgb(var(--primary))'
      }
    }
  },
  plugins: [
    createThemes({
      light: {
        primary: 'rgb(var(--primary))'
      },
      dark: {
        primary: 'rgb(var(--primary))'
      }
    })
  ]
}
