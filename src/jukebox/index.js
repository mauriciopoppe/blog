import { App } from './components/App'
import { loadAssets, registerGlobalListeners } from './assets'

function skipIntro() {
  return !!location.search.match('skip')
}

function intro() {
  if (skipIntro()) return true;

  const chars = Array.from(document.querySelectorAll('.letters,.mauricio'))
  chars.forEach(chEl => {
    chEl.innerHTML = chEl.innerHTML.replace(/([^\x00-\x80]|\w|,|\.|\d|\/)/g, "<span class='letter'>$&</span>")
  })

  anime.timeline()
    .add({
      targets: 'body',
      opacity: [0, 1]
    })
    .add({
      targets: '.letters .letter',
      translateY: [-100, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 2500,
      delay: function(el, i) {
        return 30 * i;
      }
    })
    .add({
      targets: '.mauricio .letter',
      translateY: [-100, 0],
      opacity: [0, 1],
      easing: "easeOutExpo",
      duration: 2500,
      delay: function(el, i) {
        return 50 * i;
      }
    })
    .add({
      targets: '#start',
      opacity: [0, 1]
    })

  return new Promise(resolve => {
    document.querySelector('#start').addEventListener('click', resolve)
  })
}

function runApp() {
  document.querySelector('#overlay').style.display = 'none'
  console.log('Playback resumed successfully')
  const app = new App
  app.loop()
  anime.timeline()
    .add({
      targets: '#overlay',
      opacity: [1, 0],
      duration: skipIntro() ? 1 : 1000
    })
    .add({
      targets: 'canvas, body',
      easing: 'linear',
      opacity: [0, 1],
      duration: skipIntro() ? 1 : 15000
    })
}

(async function () {
  registerGlobalListeners()
  await loadAssets()
  await intro()
  runApp()
})()

