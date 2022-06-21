// https://github.com/webpack/webpack/issues/7077#issuecomment-383029585
const url = new URL(document.currentScript.src)
__webpack_public_path__ = url.origin + __webpack_public_path__ + '/'

function isMobile() {
  if (navigator.userAgentData) {
    return navigator.userAgentData.mobile
  }
  const toMatch = [/Android/i, /webOS/i, /iPhone/i, /iPad/i, /iPod/i, /BlackBerry/i, /Windows Phone/i]

  return toMatch.some((toMatchItem) => {
    return navigator.userAgent.match(toMatchItem)
  })
}

const target = document.querySelector('footer')
const options = {
  rootMargin: '400px'
}
let rendered = false
function callback(entries) {
  if (rendered) return

  entries.forEach(async function (entry) {
    if (!entry.isIntersecting) return
    rendered = true

    let app
    if (isMobile()) {
      // load stars with hills
      app = await import('./components/App.jsx')
    } else {
      // load three js app
      app = await import('./components2/App.jsx')
    }

    app.render({
      target: document.querySelector('#browser-sunset'),
    })
  })
}

const observer = new IntersectionObserver(callback, options)
observer.observe(target)
