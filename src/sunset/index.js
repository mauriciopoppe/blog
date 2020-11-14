// https://github.com/webpack/webpack/issues/7077#issuecomment-383029585
const url = new URL(document.currentScript.src)
__webpack_public_path__ = url.origin + __webpack_public_path__ + '/'

const target = document.querySelector('footer')
const options = {
  rootMargin: '400px'
}
let shouldRender = false
function callback(entries) {
  entries.forEach(async function (entry) {
    if (entry.isIntersecting === shouldRender) return
    shouldRender = entry.isIntersecting

    const app = await import('./components/app')
    app.render({
      target: document.querySelector('#browser-sunset'),
      shouldRender: shouldRender
    })
  })
}

const observer = new IntersectionObserver(callback, options)
observer.observe(target)
