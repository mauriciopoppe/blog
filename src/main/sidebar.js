import tocbot from 'tocbot'
import debounce from 'debounce'

const content = document.querySelector('article[role=main]')

const sitemap = document.querySelector('.sitemap')
const sitemapWrapper = document.querySelector('.sitemap-wrapper')

const toc = document.querySelector('.toc')
const tocWrapper = document.querySelector('.toc-wrapper')

const footer = document.querySelector('footer')

class Sidebar {
  constructor(el, wrapper) {
    this.el = el
    this.wrapper = wrapper
    this.scrollTrigger = 0
    this.articleTopMargin = 30
    this.navbarHeight = 0
    this.refresh()
  }

  computeTop() {
    if (this.el.style.position === 'fixed') {
      this.el.style.top = `${this.navbarHeight + this.articleTopMargin}px`
    } else {
      this.el.style.top = ''
    }
  }

  computeWidth() {
    if (this.el.style.position === 'fixed') {
      this.el.style.width = `${this.wrapper.getBoundingClientRect().width}px`
    } else {
      this.el.style.width = 'auto'
    }
  }

  computeTrigger() {
    if (!window.matchMedia('(pointer:coarse)').matches) {
      this.scrollTrigger = content.getBoundingClientRect().top - this.articleTopMargin
    }
  }

  updateHeight() {
    if (this.el.style.position === 'fixed') {
      // max height is bounded by the footer
      const footerTop = footer.getBoundingClientRect().top
      if (footerTop < window.innerHeight) {
        // 50: padding and other stuff
        this.el.style.height = `${footerTop - this.articleTopMargin}px`
      } else {
        this.el.style.height = 'auto'
      }
    }
  }

  onScroll = () => {
    if (window.scrollY > this.scrollTrigger) {
      this.el.style.position = 'fixed'
    } else {
      this.el.style.position = ''
    }
    this.computeTop()
    this.computeWidth()
    this.updateHeight()
  }

  refresh() {
    this.el.style.maxHeight = `calc(100vh - ${this.articleTopMargin * 2}px)`
    this.computeTrigger()
    this.computeWidth()
    this.computeTop()
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
  window.addEventListener('scroll', onScroll)
}

main()
