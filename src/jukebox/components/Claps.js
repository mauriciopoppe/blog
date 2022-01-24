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
      if (claps[i-1] > claps[i]) {
        throw new Error("Claps must be increasing")
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
      const clap = document.createElement("span")
      clap.innerHTML = "👏🏽"
      clap.style.position = 'absolute'
      clap.style.fontSize = `10em`
      // make the last clap larger
      if (this.clapsIdx % 8 == 7) {
        clap.style.fontSize = `20em`
      }
      const delta = 50
      clap.style.top = `${between(delta, window.innerHeight - delta)}px`
      clap.style.left = `${between(delta, window.innerWidth - delta)}px`
      rootDom.appendChild(clap)

      anime.timeline({
        targets: clap,
        translateY: -50,
        duration: 250
      })
        .add({
          targets: clap,
          duration: 10000,
          opacity: 0,
          complete: (anim) => {
            rootDom.removeChild(clap)
          }
        })

      this.clapsIdx += 1
    }
  }
}

