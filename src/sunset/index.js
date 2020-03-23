// https://github.com/webpack/webpack/issues/7077#issuecomment-383029585
const url = new URL(document.currentScript.src)
__webpack_public_path__ = url.origin + __webpack_public_path__ + '/'

const target = document.querySelector('footer')
const options = {
  rootMargin: '400px'
}
let loaded = false
function callback(entries) {
  entries.forEach(async function (entry) {
    if (loaded || !entry.isIntersecting) return
    loaded = true

    const app = await import('./components/app')
    app.render({
      target: document.querySelector('#browser-sunset')
    })
  })
}

const observer = new IntersectionObserver(callback, options)
observer.observe(target)
