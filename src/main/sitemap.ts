/*
    Sitemap controls the state of the sitemap component including:

    - how items are expanded/collapsed
    - which folders where expanded (saved in local storage)
 */

import expoInOut from 'eases/expo-in-out'

function animate({ timing, draw, duration }) {
  return new Promise<void>((resolve) => {
    const start = window.performance.now()
    window.requestAnimationFrame(function animate(time) {
      const t = Math.min(1, (time - start) / duration)
      const progress = timing(t)
      draw(progress)
      if (t < 1) window.requestAnimationFrame(animate)
      else resolve()
    })
  })
}

function getHeight(el: HTMLElement) {
  // save properties for later
  const elDisplay = el.style.display
  const elPosition = el.style.position
  const elVisibility = el.style.visibility
  const elHeight = el.style.height

  el.style.display = 'block'
  el.style.position = 'absolute'
  el.style.visibility = 'hidden'
  el.style.height = 'auto'
  const height = el.offsetHeight
  el.style.display = elDisplay
  el.style.position = elPosition
  el.style.visibility = elVisibility
  el.style.height = elHeight
  return height
}

// remembers items opened in the sitemap
const activeItems = {
  KEY: 'sitemap',
  _state: null,
  getState() {
    if (!this._state) {
      this._state = JSON.parse(window.localStorage.getItem(this.KEY) || '{}')
    }
    return this._state
  },
  getActiveItems() {
    return Object.entries(this.getState())
      .filter((t) => t[1] === true)
      .map((t) => t[0])
  },
  setState(k: string, v: any) {
    this.getState()[k] = v
    window.localStorage.setItem(this.KEY, JSON.stringify(this._state))
  }
}

/**
 * Adds tabs listener so that only one of the sitemaps is visible at a time
 */
function addTabsListener() {
  const tabs = Array.from(document.querySelectorAll('.tab-trigger'))
  const targets = Array.from(document.querySelectorAll('.sitemap-content'))
  tabs.forEach((tab) => {
    tab.addEventListener('click', (event) => {
      // hide everything
      tabs.forEach((tab) => (tab.parentNode as HTMLElement).classList.remove('is-active'))
      targets.forEach((target) => target.classList.add('is-hidden'))

      // display selectively
      const toOpen = (event.target as HTMLElement).dataset.target
      const $toOpen: HTMLElement = document.querySelector(toOpen)
      $toOpen.classList.remove('is-hidden')
      ;(tab.parentNode as HTMLElement).classList.add('is-active')
    })
  })

  // simulate tab click on root
  const rootTrigger: HTMLElement = document.querySelector('a.tab-trigger')
  if (rootTrigger) rootTrigger.click()
}

function sitemapTreeListeners() {
  const sitemapTree = document.querySelector('#sitemap-tree')
  if (!sitemapTree) {
    return
  }
  sitemapTree.addEventListener('click', function (e) {
    // find closest ancestor that is li
    const li = (e.target as HTMLElement).closest('li')
    const liPath = li.getAttribute('data-full-path')
    // find closest child that is ul
    const ul: HTMLElement = Array.from(li.children).filter((node) => node.tagName === 'UL')[0] as HTMLElement
    const opts = {
      timing: expoInOut,
      duration: 250
    }

    if (!ul) return
    const isCollapsed = ul.classList.contains('list-is-collapsed')
    let p: Promise<void>
    if (isCollapsed) {
      const newHeight = getHeight(ul)
      activeItems.setState(liPath, true)
      p = animate({
        ...opts,
        draw(t: number) {
          ul.style.height = `${t * newHeight}px`
        }
      }).then(() => {
        ul.style.height = 'auto'
      })
    } else {
      const oldHeight = ul.offsetHeight
      activeItems.setState(liPath, false)
      p = animate({
        ...opts,
        draw(t: number) {
          ul.style.height = `${(1 - t) * oldHeight}px`
        }
      }).then(() => {
        ul.style.height = '0'
      })
    }
    ;(ul.parentNode as HTMLElement).classList.toggle('item-expanded')
    p.then(() => {
      ul.classList.toggle('list-is-collapsed')
    })
  })
}

// open active items as needed
function sitemapTreeSetActiveItemInSidebar() {
  const sitemapTree = document.querySelector('#sitemap-tree')
  if (!sitemapTree) {
    return
  }
  let pn = window.location.pathname
  // strips the / and adds .md
  pn = pn.substring(1, pn.length - 1) + '.md'
  const target: HTMLElement = document.querySelector(`[data-url-target="${pn}"]`)
  if (target) {
    let it: HTMLElement = target
    // expand parent recursively
    while (!it.classList.contains('sitemap')) {
      if (it.classList.contains('list-is-collapsed')) {
        it.classList.remove('list-is-collapsed')
        it.style.height = 'auto'
      }
      if (it.tagName === 'LI') {
        it.classList.add('is-active')
        it.classList.add('item-expanded')
      }
      it = it.parentNode as HTMLElement
    }
    // traverse down all the links of active items and expand them
    activeItems.getActiveItems().forEach((item) => {
      const li = document.querySelector(`[data-full-path="${item}"]`)
      li.classList.add('item-expanded')
      const ul = li.querySelector('ul')
      ul.classList.remove('list-is-collapsed')
    })
  } else {
    // expand all the items
    const items = Array.from(sitemapTree.querySelectorAll('.list-is-collapsed'))
    items.forEach((el) => {
      el.classList.remove('list-is-collapsed')
    })
  }
}

function initialize() {
  const sitemap = document.querySelector('#sitemap')
  if (sitemap) {
    addTabsListener()
    sitemapTreeListeners()
    sitemapTreeSetActiveItemInSidebar()
  }
}

export function sitemapMain() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }
}
