import { equationPreviewHotReload } from './equation-preview'
import { footnotesPreviewHotReload } from './footnotes-preview'
import { lazyLoadhotReload } from './lazy-load'
import './sass/main.scss'
import './sass/mobile.scss'
import { heartHotReload } from './heart'
import { sidebarHotReload } from './sidebar'
import { sitemapHotReload } from './sitemap'
import { initializeWithReloadFn } from './spa'

initializeWithReloadFn({
  onStart: function () {},
  onComplete: function () {
    lazyLoadhotReload()
    sidebarHotReload()
    sitemapHotReload()
    heartHotReload()
    equationPreviewHotReload()
    footnotesPreviewHotReload()

    // reload Mathjax if it's installed in the page
    if ('MathJax' in window) {
      // Reset equation numbering https://docs.mathjax.org/en/latest/web/typeset.html#resetting-automatic-equation-numbering
      // to avoid `duplicated label` errors.
      window.MathJax.texReset()
      window.MathJax.typesetClear()
      // Run MathJax asynchronously.
      window.MathJax.typesetPromise()
    }

    // Set in site/layouts/partials/head.html
    if ('myBlog' in window) {
      window.myBlog.onLoad()
    }
  }
})

export * from './font-face-observer'
export * from './lazy-load'
// eslint-disable-next-line
export * from './sidebar'
// eslint-disable-next-line
export * from './sitemap'
// eslint-disable-next-line
export * from './heart'
export * from './equation-preview'
export * from './footnotes-preview'
