import './css/main.css'
import './css/math-popover.css'

import { sidebarsMain } from './sidebar.js'
import { sitemapMain } from './sitemap.js'
import { searchShortcutMain } from './search-shortcut.js'
import { lazyLoadMain } from './lazy-load.js'
import { equationPreviewMain } from './equation-preview.js'
import { footnotesPreviewMain } from './footnotes-preview.js'
import { mathTermPreviewMain } from './math-term-preview.js'

declare global {
  interface Window {
    MathJax: any
    gtag: any
  }
}

sidebarsMain()
searchShortcutMain()
sitemapMain()
lazyLoadMain()
equationPreviewMain()
footnotesPreviewMain()
mathTermPreviewMain()
