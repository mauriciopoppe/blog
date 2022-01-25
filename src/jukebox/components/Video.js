import { between } from '../utils'

const loader = new THREE.TextureLoader()

const format = v =>
  v < 10 ? `00${v}` : v < 100 ? `0${v}` : v

class Video {
  constructor(app) {
    const self = this

    const video = document.querySelector('#video-source')
    video.volume = 0
    this.video = video

    const audio = document.querySelector('#audio-source')
    this.audio = audio

    // set to true on user interaction
    this.audioSetupDone = false

    this.geometry = new THREE.PlaneGeometry(20, 10)
    this.material = new THREE.MeshLambertMaterial({
      map: new THREE.VideoTexture(this.video),
      transparent: true,
      side: THREE.DoubleSide
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
    this.audio.pause()
  }

  play() {
    if (!this.audioSetupDone) {
      // create an Audio source
      const audioCtx = new window.AudioContext()
      const gainNode = audioCtx.createGain()
      const track = audioCtx.createMediaElementSource(this.audio)
      track.connect(gainNode).connect(audioCtx.destination)
      this.track = track

      const volumeControl = document.querySelector('#volume')
      volumeControl.addEventListener('input', function() {
          gainNode.gain.value = this.value
      }, false)
      this.audioSetupDone = true
    }

    this.audio.play()
    // it looks like processing audio is an expensive operation (takes a few
    // ms to complete), I did the following hacks:
    // - load the audio and the video in different sources (mp4 and mp3)
    // - delay playing the video because of the processing lag
    setTimeout(() => {
      this.video.play()
    }, 100)
  }

  isPlaying() {
    return !this.video.paused
  }

  getElapsedTime() {
    return this.currentTime
  }
}

export { Video }
