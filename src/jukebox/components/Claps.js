// import { assets } from '../assets'
import { between } from '../utils'

export class Claps {
  constructor(parent, { claps, video }) {
    this.parent = parent
    this.root = new THREE.Object3D()
    // the claps file has this form:
    // [time, time, time, ...]
    // it must be sorted
    this.claps = claps
    for (let i = 1; i < claps.length; i += 1) {
      if (claps[i - 1] > claps[i]) {
        throw new Error('Claps must be increasing')
      }
    }
    this.clapsIdx = 0
    this.video = video

    this.parent.on('update', this.onUpdate.bind(this))
    // this.parent.on('factor', shake(this.root, 3))
  }

  onUpdate() {
    const elapsedTime = this.video.getElapsedTime() * 1000
    const rootDom = document.body.querySelector('#root')

    if (elapsedTime > this.claps[this.clapsIdx]) {
      const clap = document.createElement('span')
      rootDom.appendChild(clap)
      clap.innerHTML = '👏🏽'
      clap.style.position = 'absolute'
      clap.style.fontSize = '10em'
      const clapBoundsDelta = 20
      // make the last clap larger
      if (this.clapsIdx % 8 === 7) {
        clap.style.fontSize = '20em'
      }

      // it should be right border - image width and bottom border - image
      const { width: imageWidth, height: imageHeight } = clap.getBoundingClientRect()
      clap.style.top = `${between(clapBoundsDelta, window.innerHeight - imageHeight - clapBoundsDelta)}px`
      clap.style.left = `${between(clapBoundsDelta, window.innerWidth - imageWidth - clapBoundsDelta)}px`

      anime({
        targets: clap,
        easing: 'easeInOutQuad',
        translateY: -50,
        opacity: 0,
        duration: 1000,
        complete: (anim) => {
          rootDom.removeChild(clap)
        }
      })
      // .add({
      //   targets: clap,
      //   duration: 8000,
      //   opacity: 0,
      // })

      this.clapsIdx += 1
    }
  }
}
