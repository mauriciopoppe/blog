import './css/main.css'

import { sidebarsMain } from './sidebar.js'
import { sitemapMain } from './sitemap.js'
import { algoliaMain } from './algolia.jsx'
import { lazyLoadMain } from './lazy-load.js'
import { equationPreviewMain } from './equation-preview.js'
import { footnotesPreviewMain } from './footnotes-preview.js'

declare global {
  interface Window {
    MathJax: any
    gtag: any
  }
}

sidebarsMain()
algoliaMain()
sitemapMain()
lazyLoadMain()
equationPreviewMain()
footnotesPreviewMain()
