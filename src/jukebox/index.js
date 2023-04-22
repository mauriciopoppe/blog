import { App } from './components/App'
import { loadAssets } from './assets'

function skipIntro() {
  return !!window.location.search.match('skip')
}

function intro() {
  if (skipIntro()) return true
  return new Promise((resolve) => {
    document.querySelector('#overlay').addEventListener('click', () => {
      window.anime({
        targets: '#overlay',
        easing: 'easeInQuart',
        opacity: 0,
        duration: 5000,
        complete: () => {
          document.querySelector('#overlay').style.display = 'none'
          resolve()
        }
      })
    })
  })
}

function runApp() {
  window.app = new App()
  window.app.loop()
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
