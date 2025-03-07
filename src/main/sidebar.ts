/*
 * Sidebar controls the positioning, height and other visual attributes of the sidebars in an article
 */

import tocbot from 'tocbot'
import debounce from 'debounce'
import isMobile from 'is-mobile'

const SidebarState = {
  AUTO: 'auto',
  FIXED: 'fixed',
  RELATIVE: 'relative'
}

class Sidebar {
  el: HTMLElement
  wrapper: HTMLElement
  hidden: boolean
  articleTopMargin: number
  navbarHeight: number
  state: string
  isMobile: boolean

  constructor(el: HTMLElement, wrapper: HTMLElement) {
    this.el = el
    this.wrapper = wrapper
    // initially the Sidebar is hidden
    this.hidden = true
    this.articleTopMargin = 20
    this.navbarHeight = 0
    this.state = SidebarState.AUTO
    const mediaQuery = window.matchMedia('(min-width: 768px)')
    this.isMobile = !mediaQuery.matches
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
   */
  get footerLocationFromDocument() {
    const footer = document.querySelector('footer')
    return footer.getBoundingClientRect().top + document.documentElement.scrollTop - window.innerHeight
  }

  get contentLocationInPage() {
    const content = document.querySelector('article[role=main]')
    return content.getBoundingClientRect().top + document.documentElement.scrollTop - this.articleTopMargin
  }

  onScroll = () => {
    this.state = SidebarState.AUTO
    if (!this.isMobile && window.scrollY > this.contentLocationInPage) {
      this.state = SidebarState.FIXED
      this.showIfHidden()
    }
    if (!this.isMobile && window.scrollY > this.footerLocationFromDocument) {
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
      this.wrapper.style.opacity = '1'
      this.hidden = false
    }
  }
}

function initializeSidebar(sidebarWrapper: HTMLElement, sidebarContent: HTMLElement) {
  if (!sidebarWrapper || !sidebarContent) {
    console.warn('Attempted to initialize a sidebar where the elements were not found!')
    return
  }

  const sidebar = new Sidebar(sidebarContent, sidebarWrapper)

  const onResize = debounce(function onResize() {
    sidebar.refresh()
  }, 250)

  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)

  // only enable fixing the position of the sidebars on scroll in desktop
  if (!isMobile()) {
    window.addEventListener('scroll', function () {
      // function is not debounced since the scroll waypoints
      // need to be tested every time
      sidebar.onScroll()
    })
  } else {
    // Show the sidebars immediately in mobile devices.
    sidebar.showIfHidden()
  }

  // initial refresh
  sidebar.onScroll()
}

function initialize() {
  const sitemap: HTMLElement = document.querySelector('.my-sitemap')
  const sitemapWrapper: HTMLElement = document.querySelector('.my-sitemap-wrapper')
  initializeSidebar(sitemapWrapper, sitemap)

  const toc: HTMLElement = document.querySelector('.toc')
  const tocWrapper: HTMLElement = document.querySelector('.toc-wrapper')
  initializeSidebar(tocWrapper, toc)

  // tocbot offset for the links
  const header = document.querySelector('header')
  tocbot.init({
    tocSelector: '.toc',
    contentSelector: 'article[role=main]',
    headingSelector: 'h1,h2,h3,h4,h5,h6',
    collapseDepth: 6,
    throttleTimeout: 200,
    headingsOffset: -header.getBoundingClientRect().height
  })
}

export function sidebarsMain() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }
}
