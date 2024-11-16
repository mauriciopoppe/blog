declare global {
  interface Window {
    MathJax: any
    gtag: any
  }
}

import './css/main.css'
import './sass/main.scss'

import { sidebarsMain } from './sidebar.js'
import { sitemapMain } from './sitemap.js'

// TODO(tailwind): enable the plugins again with exports and runners (no auto run by default)
// import './equation-preview.js'
// import './footnotes-preview.js'
// import './lazy-load.js'
// import './sass/mobile.scss'
// import './heart.js'
sidebarsMain()
sitemapMain()
// import './sitemap.js'
//
// export * from './font-face-observer.js'
// export * from './lazy-load.js'
// // eslint-disable-next-line
// export * from './sidebar.js'
// // eslint-disable-next-line
// export * from './sitemap.js'
// // eslint-disable-next-line
// export * from './heart.js'
// export * from './equation-preview.js'
// export * from './footnotes-preview.js'
