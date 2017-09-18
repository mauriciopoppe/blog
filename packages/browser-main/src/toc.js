import tocbot from 'tocbot'
import debounce from 'debounce'

const content = document.querySelector('article[role=main]')
const nav = document.querySelector('nav.navbar')

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
    collapseDepth: 6
  }
  const margin = 20
  const navbarHeight = nav.getBoundingClientRect().height

  class Sidebar {
    constructor (el, wrapper) {
      this.el = el
      this.wrapper = wrapper
      this.position = ''
      this.computeTrigger()
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
      this.scrollTrigger = window.scrollY + content.getBoundingClientRect().top - navbarHeight
    }

    updateHeight () {
      if (this.position === 'fixed') {
        // max height is bounded by the footer
        const fTop = footer.getBoundingClientRect().top
        if (fTop < window.innerHeight) {
          // 50: navbar
          // 50: padding and other stuff
          this.el.style.height = `${fTop - 100}px`
        } else {
          this.el.style.height = 'auto'
        }
      } else {
        const wrapperTop = this.wrapper.getBoundingClientRect().top
        const footerTop = footer.getBoundingClientRect().top
        // 50: padding and other stuff
        const height = Math.min(window.innerHeight, footerTop) - wrapperTop - 25
        this.el.style.height = `${height}px`
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

  const onScroll = (function () {
    return function () {
      tocSidebar.onScroll()
      sitemapSidebar.onScroll()
    }
  })()

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
