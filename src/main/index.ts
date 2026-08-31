import './css/main.css'
import './css/math-popover.css'

import { sidebarsMain } from './sidebar.js'
import { sitemapMain } from './sitemap.js'
import { algoliaMain } from './algolia.jsx'
import { lazyLoadMain } from './lazy-load.js'
import { equationPreviewMain } from './equation-preview.js'
import { footnotesPreviewMain } from './footnotes-preview.js'
import { mathTermPreviewMain } from './math-term-preview.js'
import { avatarTiltMain } from './avatar-tilt.js'
import { avatarGuitarMain } from './avatar-guitar.js'

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
mathTermPreviewMain()
avatarTiltMain()
avatarGuitarMain()
