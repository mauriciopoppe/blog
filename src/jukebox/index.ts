import { App } from './components/App.js'
import { loadAssets } from './assets.js'

function skipIntro() {
  return !!window.location.search.match('skip')
}

function intro() {
  if (skipIntro()) return true
  return new Promise((resolve) => {
    document.querySelector('#overlay').addEventListener('click', () => {
      // @ts-ignore
      window.anime({
        targets: '#overlay',
        easing: 'easeInQuart',
        opacity: 0,
        duration: 5000,
        complete: () => {
          ;(document.querySelector('#overlay') as HTMLElement).style.display = 'none'
          // @ts-ignore
          resolve()
        }
      })
    })
  })
}

function runApp() {
  // @ts-ignore
  window.app = new App()
  // @ts-ignore
  window.app.loop()
  // @ts-ignore
  window.anime.timeline().add({
    targets: '#root',
    easing: 'linear',
    opacity: [0, 1],
    duration: skipIntro() ? 1 : 5000
  })
}

;(async function () {
  await loadAssets()
  runApp()

  await intro()
})()
