import { between } from '../utils'
const loader = new THREE.TextureLoader()

const format = v =>
  v < 10 ? `00${v}` : v < 100 ? `0${v}` : v

class Video {
  constructor(app) {
    const self = this
    const video = document.querySelector('#video-source')
    const texture = new THREE.VideoTexture(video)

    this.video = video
    this.geometry = new THREE.PlaneGeometry(20, 10)
    this.material = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
      // map: loader.load('https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg')
    })
    this.root = new THREE.Mesh(this.geometry, this.material);

    // set the position of the image root in the x,y,z dimensions
    this.root.position.set(0,0,0)
    this.root.skipRaycast = true

    this.currentTime = 0
    this.duration = 0
    this.video.addEventListener('timeupdate', function () {
      self.currentTime = this.currentTime
      self.duration = this.duration
    })

    app.on('factor', () => {
      const scaleFactor = 0.99 + Math.random() * 0.01
      const rotationFactor = between(-0.5, 0.5) * Math.PI / 180
      this.root.rotation.z = rotationFactor
      this.root.rotation.x = rotationFactor
      this.root.rotation.y = rotationFactor

      this.root.scale.x = scaleFactor
      this.root.scale.y = scaleFactor
      this.root.scale.z = scaleFactor
    })
  }

  pause() {
    this.video.pause()
  }

  play() {
    this.video.play()
  }

  isPlaying() {
    return !this.video.paused
  }

  getElapsedTime() {
    return this.currentTime
  }
}

export { Video }
