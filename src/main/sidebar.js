/*
 * Sidebar controls the positioning, height and other visual attributes of the sidebars in an article
 */

import tocbot from 'tocbot'
import debounce from 'debounce'
import isMobile from 'is-mobile'

const content = document.querySelector('article[role=main]')

const sitemap = document.querySelector('.sitemap')
const sitemapWrapper = document.querySelector('.sitemap-wrapper')

const toc = document.querySelector('.toc')
const tocWrapper = document.querySelector('.toc-wrapper')

const footer = document.querySelector('footer')

const SidebarState = {
  AUTO: 'auto',
  FIXED: 'fixed',
  RELATIVE: 'relative'
}

class Sidebar {
  /**
   * @param {HTMLElement} el
   * @param {HTMLElement} wrapper
   */
  constructor(el, wrapper) {
    this.el = el
    this.wrapper = wrapper
    this.contentLocationInPage = 1e9
    this.articleTopMargin = 30
    this.navbarHeight = 0
    this.state = SidebarState.AUTO
    this.refresh()
  }

  computePosition() {
    if (this.state === SidebarState.AUTO) {
      this.el.style.position = 'initial'
      this.el.style.top = ''
      this.el.style.width = 'auto'
    } else if (this.state === SidebarState.FIXED) {
      this.el.style.position = 'fixed'
      this.el.style.top = `${this.navbarHeight + this.articleTopMargin}px`
      this.el.style.width = `${this.wrapper.getBoundingClientRect().width}px`
    } else if (this.state === SidebarState.RELATIVE) {
      this.el.style.position = 'relative'
      this.el.style.top = this._getFooterLocationFromDocument() - this.contentLocationInPage + 'px'
      this.el.style.width = 'auto'
    }
  }

  /**
   * Returns the top location of the footer with respect to the document root element,
   * the value can't be cached because there are images and other layout things going on
   * while scrolling
   *
   * @returns {number}
   * @private
   */
  _getFooterLocationFromDocument() {
    return footer.getBoundingClientRect().top + document.documentElement.scrollTop - window.innerHeight
  }

  _computeTrigger() {
    this.contentLocationInPage = content.getBoundingClientRect().top - this.articleTopMargin
  }

  onScroll = () => {
    this.state = SidebarState.AUTO
    if (window.scrollY > this.contentLocationInPage) {
      this.state = SidebarState.FIXED
    }
    if (window.scrollY > this._getFooterLocationFromDocument()) {
      this.state = SidebarState.RELATIVE
    }

    this.computePosition()
  }

  refresh() {
    if (isMobile()) {
      this.el.style.maxHeight = 'initial'
    } else {
      this.el.style.maxHeight = `calc(100vh - ${this.articleTopMargin * 2}px)`
    }
    this._computeTrigger()
    this.computePosition()
  }
}

function main() {
  if (!toc || !sitemap) {
    return
  }

  // tocbot offset for the links
  const hero = document.querySelector('section.hero')
  const tocbotOpts = {
    tocSelector: '.toc',
    contentSelector: 'body',
    headingSelector: 'h1,h2,h3,h4,h5,h6',
    collapseDepth: 6,
    throttleTimeout: 200,
    headingsOffset: -hero.getBoundingClientRect().height
  }

  const tocSidebar = new Sidebar(toc, tocWrapper)
  const sitemapSidebar = new Sidebar(sitemap, sitemapWrapper)

  const onResize = debounce(function onResize() {
    tocSidebar.refresh()
    sitemapSidebar.refresh()
  }, 250)

  // function is not debounced since the scroll waypoints
  // need to be tested everytime
  const onScroll = function () {
    tocSidebar.onScroll()
    sitemapSidebar.onScroll()
  }

  function setup() {
    // initialize tocbot
    tocbot.init(tocbotOpts)
  }

  setup()
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)
  // only enable fixing the position of the sidebars on scroll in desktop
  if (!isMobile()) {
    window.addEventListener('scroll', onScroll)
  }
}

main()
