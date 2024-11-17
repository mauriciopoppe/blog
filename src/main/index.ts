declare global {
  interface Window {
    MathJax: any
    gtag: any
  }
}

import './css/main.css'

import { sidebarsMain } from './sidebar.js'
import { sitemapMain } from './sitemap.js'
import { lazyLoadMain } from './lazy-load.js'
import { equationPreviewMain } from './equation-preview.js'
import { footnotesPreviewMain } from './footnotes-preview.js'

sidebarsMain()
sitemapMain()
lazyLoadMain()
equationPreviewMain()
footnotesPreviewMain()
