declare global {
  interface Window {
    MathJax: any
    gtag: any
  }
}

import './sass/main.scss'

import './equation-preview.js'
import './footnotes-preview.js'
import './lazy-load.js'
import './sass/mobile.scss'
import './heart.js'
import './sidebar.js'
import './sitemap.js'

export * from './font-face-observer.js'
export * from './lazy-load.js'
// eslint-disable-next-line
export * from './sidebar.js'
// eslint-disable-next-line
export * from './sitemap.js'
// eslint-disable-next-line
export * from './heart.js'
export * from './equation-preview.js'
export * from './footnotes-preview.js'
