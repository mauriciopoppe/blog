/*
    Sitemap controls the state of the sitemap component including:

    - how items are expanded/collapsed
    - which folders where expanded (saved in local storage)
 */

import expoInOut from 'eases/expo-in-out'

function animate({ timing, draw, duration }) {
  return new Promise((resolve) => {
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

function getHeight(el) {
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
  setState(k, v) {
    this._state[k] = v
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
      tabs.forEach((tab) => tab.parentNode.classList.remove('is-active'))
      targets.forEach((target) => target.classList.add('is-hidden'))

      // display selectively
      const toOpen = event.target.dataset.target
      document.querySelector(toOpen).classList.remove('is-hidden')
      tab.parentNode.classList.add('is-active')
    })
  })

  // simulate tab click on root
  const rootTrigger = document.querySelector('a.tab-trigger')
  if (rootTrigger) rootTrigger.click()
}

function addClickListener() {
  const sitemapTree = document.querySelector('#sitemap-tree')
  sitemapTree.addEventListener('click', function (e) {
    // find closest ancestor that is li
    const li = e.target.closest('li')
    const liPath = li.getAttribute('data-full-path')
    // find closest child that is ul
    const ul = Array.from(li.children).filter((node) => node.tagName === 'UL')[0]
    const opts = {
      timing: expoInOut,
      duration: 250
    }

    if (!ul) return
    const isCollapsed = ul.classList.contains('list-is-collapsed')
    let p
    if (isCollapsed) {
      const newHeight = getHeight(ul)
      activeItems.setState(liPath, true)
      p = animate({
        ...opts,
        draw(t) {
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
        draw(t) {
          ul.style.height = `${(1 - t) * oldHeight}px`
        }
      }).then(() => {
        ul.style.height = '0'
      })
    }
    ul.parentNode.classList.toggle('item-expanded')
    p.then(() => {
      ul.classList.toggle('list-is-collapsed')
    })
  })
}

// open active items as needed
function setActiveItemInSidebar() {
  const sitemapTree = document.querySelector('#sitemap-tree')
  let pn = window.location.pathname
  // strips the / and adds .md
  pn = pn.substring(1, pn.length - 1) + '.md'
  const target = document.querySelector(`[data-url-target="${pn}"]`)
  if (target) {
    let it = target
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
      it = it.parentNode
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

function main() {
  const sitemapWrapper = document.querySelector('.sitemap')
  if (sitemapWrapper) {
    addTabsListener()
    addClickListener()
    setActiveItemInSidebar()
  }
}

export function sitemapHotReload() {
  main()
}

// initial load.
main()
