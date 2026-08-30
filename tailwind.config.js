/** @type {import('tailwindcss').Config} */
const { createThemes } = require('tw-colors')

module.exports = {
  prefix: 'tw-',
  content: ['src/**/*.{tsx,jsx}', 'site/content/**/*.md', 'site/layouts/**/*.html', 'site/static/**/*.js'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--primary))',
        'primary-soft': 'rgba(var(--primary), 0.16)',
        'primary-text': 'rgba(var(--primary), 0.85)',
        'primary-border': 'rgba(var(--primary), 0.4)',
        'primary-border-strong': 'rgba(var(--primary), 0.5)',
        'primary-border-light': 'rgba(var(--primary), 0.35)'
      },
      fontFamily: {
        sans: ['var(--family-sans, system-ui, sans-serif)'],
        serif: ['var(--family-serif, system-ui, serif)']
      },
      boxShadow: {
        subtle: 'var(--elevation-subtle)',
        raised: 'var(--elevation-raised)',
        deep: 'var(--elevation-deep)'
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
