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
    this.position = ''
    this.scrollTrigger = 1e9
    this.articleTopMargin = 20
    this.navbarHeight = 0
    this.refresh()
  }

  setPosition(position) {
    if (position !== this.position) {
      this.el.style.position = this.position = position
      this.computeTop()
      this.computeWidth()
    }
  }

  computeTop() {
    if (this.position === 'fixed') {
      this.el.style.top = `${this.navbarHeight + this.articleTopMargin}px`
    } else {
      this.el.style.top = ''
    }
  }

  computeWidth() {
    if (this.position === 'fixed') {
      this.el.style.width = `${this.wrapper.getBoundingClientRect().width}px`
    } else {
      this.el.style.width = 'auto'
    }
  }

  computeTrigger() {
    if (!window.matchMedia('(pointer:coarse)').matches) {
      this.scrollTrigger = window.scrollY + content.getBoundingClientRect().top - this.navbarHeight
    }
  }

  updateHeight() {
    if (this.position === 'fixed') {
      // max height is bounded by the footer
      const fTop = footer.getBoundingClientRect().top
      if (fTop < window.innerHeight) {
        // 50: padding and other stuff
        this.el.style.height = `${fTop - 50}px`
      } else {
        this.el.style.height = 'auto'
      }
    }
  }

  onScroll = () => {
    let newPosition = ''
    if (window.scrollY > this.scrollTrigger - this.articleTopMargin) {
      newPosition = 'fixed'
    }
    this.setPosition(newPosition)
    this.updateHeight()
  }

  refresh() {
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
