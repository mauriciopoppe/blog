import tocbot from 'tocbot'
import debounce from 'debounce'

const content = document.querySelector('article[role=main]')

const sitemap = document.querySelector('nav[role=sitemap]')
const sitemapWrapper = document.querySelector('.sitemap-wrapper')

const toc = document.querySelector('nav[role=toc]')
const tocWrapper = document.querySelector('.toc-wrapper')

const footer = document.querySelector('footer')

function main () {
  if (!toc || !sitemap) {
    return
  }

  const tocbotOpts = {
    tocSelector: '.toc',
    contentSelector: 'body',
    headingSelector: 'h1,h2,h3,h4,h5,h6',
    collapseDepth: 6,
    throttleTimeout: 200,
  }
  const margin = 20
  const navbarHeight = 0

  class Sidebar {
    constructor (el, wrapper) {
      this.el = el
      this.wrapper = wrapper
      this.position = ''
      this.scrollTrigger = 1e9
      this.refresh()
    }

    setPosition (position) {
      if (position !== this.position) {
        this.el.style.position = this.position = position
        this.computeTop()
        this.computeWidth()
      }
    }

    computeTop () {
      if (this.position === 'fixed') {
        this.el.style.top = `${navbarHeight + margin}px`
      } else {
        this.el.style.top = ''
      }
    }

    computeWidth () {
      if (this.position === 'fixed') {
        this.el.style.width = `${this.wrapper.getBoundingClientRect().width}px`
      } else {
        this.el.style.width = 'auto'
      }
    }

    computeTrigger () {
      if (!window.matchMedia("(pointer:coarse)").matches) {
        this.scrollTrigger = window.scrollY + content.getBoundingClientRect().top - navbarHeight
      }
    }

    updateHeight () {
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
      if (window.scrollY > this.scrollTrigger - margin) {
        newPosition = 'fixed'
      }
      this.setPosition(newPosition)
      this.updateHeight()
    }

    refresh () {
      this.computeTrigger()
      this.computeWidth()
      this.computeTop()
    }
  }

  const tocSidebar = new Sidebar(toc, tocWrapper)
  const sitemapSidebar = new Sidebar(sitemap, sitemapWrapper)

  const onResize = debounce(function onResize (...args) {
    tocSidebar.refresh()
    sitemapSidebar.refresh()
  }, 250)

  // function is not debounced since the scroll waypoints
  // need to be tested everytime
  const onScroll = function () {
    tocSidebar.onScroll()
    sitemapSidebar.onScroll()
  }

  function sidebarToc () {
    tocbot.init(tocbotOpts)
    tocbot.zenscroll.setup(420, navbarHeight + margin)
  }

  function embeddedToc () {
    const headingsArray = tocbot._parseContent.selectHeadings(
      tocbotOpts.contentSelector,
      tocbotOpts.headingSelector
    )
    if (headingsArray === null) {
      return
    }

    const nestedHeadingsObj = tocbot._parseContent.nestHeadingsArray(headingsArray)
    const nestedHeadings = nestedHeadingsObj.nest

    tocbot._buildHtml.render('.toc-embedded', nestedHeadings)
  }

  function setup () {
    sidebarToc()
    embeddedToc()
  }

  setup()
  window.addEventListener('resize', onResize)
  window.addEventListener('orientationchange', onResize)
  window.addEventListener('scroll', onScroll)
}

main()
