import expoInOut from 'eases/expo-in-out'

const sitemapEl = document.querySelector('.sitemap')

function animate ({ timing, draw, duration }) {
  return new Promise(resolve => {
    const start = window.performance.now()
    window.requestAnimationFrame(function animate (time) {
      const t = Math.min(1, (time - start) / duration)
      const progress = timing(t)
      draw(progress)
      if (t < 1) window.requestAnimationFrame(animate)
      else resolve()
    })
  })
}

function getHeight (el) {
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

function addClickListener() {
  sitemapEl.addEventListener('click', function (e) {
    // find closest ancestor that is li
    const li = e.target.closest('li')
    // find closest child that is ul
    const ul = Array.from(li.children)
      .filter(node => node.tagName === 'UL')[0]
    const opts = {
      timing: expoInOut,
      duration: 250
    }

    if (!ul) return
    let p
    if (ul.classList.contains('list-is-collapsed')) {
      const newHeight = getHeight(ul)
      p = animate({
        ...opts,
        draw (t) {
          ul.style.height = `${t * newHeight}px`
        }
      })
        .then(() => {
          ul.style.height = 'auto'
        })
    } else {
      const oldHeight = ul.offsetHeight
      p = animate({
        ...opts,
        draw (t) {
          ul.style.height = `${(1 - t) * oldHeight}px`
        }
      })
        .then(() => {
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
function setActiveItemInSidebar () {
  let pn = window.location.pathname
  // strips the / and adds .mmark
  pn = pn.substring(1, pn.length - 1) + '.md'
  const target = document.querySelector(`[data-url-target="${pn}"]`)
  if (target) {
    let it = target
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
  } else {
    // expand all the items
    const items = Array.from(sitemapEl.querySelectorAll('.list-is-collapsed'))
    items.forEach(el => {
      el.classList.remove('list-is-collapsed')
    })
  }
}

if (sitemapEl) {
  addClickListener()
  setActiveItemInSidebar()
}
