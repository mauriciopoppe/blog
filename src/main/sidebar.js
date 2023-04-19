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
    // initially the Sidebar is hidden
    this.hidden = true
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
      this.el.style.top = this.footerLocationFromDocument - this.contentLocationInPage + 'px'
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
  get footerLocationFromDocument() {
    return footer.getBoundingClientRect().top + document.documentElement.scrollTop - window.innerHeight
  }

  get contentLocationInPage() {
    return content.getBoundingClientRect().top + document.documentElement.scrollTop - this.articleTopMargin
  }

  onScroll = () => {
    this.state = SidebarState.AUTO
    if (window.scrollY > this.contentLocationInPage) {
      this.state = SidebarState.FIXED
      this.showIfHidden()
    }
    if (window.scrollY > this.footerLocationFromDocument) {
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
    this.computePosition()
  }

  // showIfHidden shows the sidebar if it's hidden
  showIfHidden() {
    if (this.hidden) {
      this.wrapper.classList.remove('hide')
      this.hidden = false
    }
  }
}

function main() {
  if (!toc || !sitemap) {
    return
  }

  const tocSidebar = new Sidebar(toc, tocWrapper)
  const sitemapSidebar = new Sidebar(sitemap, sitemapWrapper)
  const sidebars = [tocSidebar, sitemapSidebar]

  const onResize = debounce(function onResize() {
    for (let sidebar of sidebars) {
      sidebar.refresh()
    }
  }, 250)

  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)

  // only enable fixing the position of the sidebars on scroll in desktop
  if (!isMobile()) {
    window.addEventListener('scroll', function () {
      // function is not debounced since the scroll waypoints
      // need to be tested everytime
      for (let sidebar of sidebars) {
        sidebar.onScroll()
      }
    })
  } else {
    // Show the sidebars immediately in mobile devices.
    for (let sidebar of sidebars) {
      sidebar.showIfHidden()
    }
  }

  // tocbot offset for the links
  const header = document.querySelector('header')
  tocbot.init({
    tocSelector: '.toc',
    contentSelector: 'body',
    headingSelector: 'h1,h2,h3,h4,h5,h6',
    collapseDepth: 6,
    throttleTimeout: 200,
    headingsOffset: -header.getBoundingClientRect().height
  })

  // initial refresh
  for (const sidebar of sidebars) {
    sidebar.onScroll()
  }
}

main()
