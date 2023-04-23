import mojs, { CustomShape, ShapeSwirl } from '@mojs/core'

class MoHeart extends CustomShape {
  getShape() {
    return '<path d="M92.5939814,7.35914503 C82.6692916,-2.45304834 66.6322927,-2.45304834 56.7076029,7.35914503 L52.3452392,11.6965095 C51.0327802,12.9714696 48.9328458,12.9839693 47.6203869,11.6715103 L47.6203869,11.6715103 L43.2705228,7.35914503 C33.3833318,-2.45304834 17.3213337,-2.45304834 7.43414268,7.35914503 C-2.47804756,17.1963376 -2.47804756,33.12084 7.43414268,42.9205337 L29.7959439,65.11984 C29.7959439,65.1323396 29.8084435,65.1323396 29.8084435,65.1448392 L43.2580232,78.4819224 C46.9704072,82.1818068 52.9952189,82.1818068 56.7076029,78.4819224 L70.1696822,65.1448392 C70.1696822,65.1448392 70.1696822,65.1323396 70.1821818,65.1323396 L92.5939814,42.9205337 C102.468673,33.12084 102.468673,17.1963376 92.5939814,7.35914503 L92.5939814,7.35914503 Z"></path>'
  }

  getLength() {
    return 292.110107421875
  }
}
mojs.addShape('heart', MoHeart)

function setupHearts(rootEl) {
  const heartShapes = []
  for (let i = 0; i < 10; i++) {
    const heart = new ShapeSwirl({
      parent: rootEl,
      shape: 'heart',
      fill: { white: 'deeppink' },
      degreeShift: 'rand(-20, 20)',
      duration: 'rand(600, 1500)',
      radius: 'rand(10, 20)',
      pathScale: 'rand(.5, 1)',
      swirlFrequency: 'rand(2,4)',
      swirlSize: 'rand(6,14)'
    })
    heartShapes.push(heart)
  }

  const animateHearts = () => {
    heartShapes.forEach((heart) => {
      heart
        .tune({ x: 0, y: { 0: 'rand(-75, -50)' } })
        .generate()
        .replay()
    })
  }

  rootEl.addEventListener('mouseenter', animateHearts)
  rootEl.addEventListener('click', () => {
    new mojs.Html({
      el: document.body,
      duration: 2000,
      opacity: { 1: 0 },
      scaleX: { 1: 2 },
      scaleY: { 1: 2 },
      onComplete() {
        window.gtag('event', 'profile_easter_egg')
        document.location = '/sandbox/jukebox/'
      }
    }).play()
  })
}

function main() {
  const hearts = Array.from(document.querySelectorAll('.heart'))
  // exit early if no hearts were found
  if (!hearts.length) return
  hearts.forEach((h) => setupHearts(h))
}

main()
