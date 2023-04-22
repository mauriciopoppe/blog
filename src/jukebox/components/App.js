import EventEmitter from 'events'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Video } from './Video'
import { VideoControls } from './VideoControls'
import { Text } from './Text'
import { Subtitles } from './Subtitles'
import { Claps } from './Claps'
import { between } from '../utils'
import { assets } from '../assets'

import '../shaders/CopyShader'
import '../shaders/LuminosityShader'
import '../shaders/LuminosityHighPassShader'
import '../shaders/SobelOperatorShader'
import '../shaders/AfterimageShader'

import '../postprocessing/EffectComposer'
import '../postprocessing/RenderPass'
import '../postprocessing/ShaderPass'
import '../postprocessing/UnrealBloomPass'
import '../postprocessing/AfterimagePass'

// const stats = new Stats()
// stats.domElement.style.position = 'absolute'
// document.querySelector('#root').appendChild(stats.domElement)
const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()
class App extends EventEmitter {
  constructor() {
    super()
    this.setup()
    this.addLights()
    this.addObjects()
    this.timers()
    this.listeners()
  }

  setup() {
    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    this.renderer = new THREE.WebGLRenderer({ alpha: true })
    this.renderer.setSize(window.innerWidth, window.innerHeight)
    this.renderer.setClearColor(0xffffff, 0)
    // this.renderer.domElement.style.opacity = 0
    document.body.querySelector('#root').appendChild(this.renderer.domElement)

    this.camera.position.z = 18

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.minDistance = 1
    this.controls.maxDistance = 20
    this.controls.update()

    this.composer = new THREE.EffectComposer(this.renderer)
    var renderPass = new THREE.RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    var afterImage = new THREE.AfterimagePass()
    this.afterimagePass = afterImage
    this.afterimagePass.uniforms.damp.value = 0.7
    this.composer.addPass(afterImage)

    var bloomPass = new THREE.UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = 0
    bloomPass.strength = 0.5
    bloomPass.radius = 0
    this.composer.addPass(bloomPass)
    this.bloomPass = bloomPass

    // index of the current frame
    this.current = parseInt(window.localStorage.getItem('current')) || 1
  }

  addLights() {
    this.light = new THREE.PointLight(0xffffff, 1, 0)
    this.light.position.set(0, 0, 100)
    this.scene.add(this.light)

    this.ambientLight = new THREE.AmbientLight(0x333333)
    this.scene.add(this.ambientLight)
  }

  addObjects() {
    // var axesHelper = new THREE.AxesHelper( 5 );
    // this.scene.add( axesHelper );

    this.video = new Video(this)
    this.scene.add(this.video.root)

    this.videoControls = new VideoControls(this, this.video)
    this.scene.add(this.videoControls.root)

    this.title = new Text(this, {
      color: '#fc0349',
      message: 'Kay One feat. Cristobal - Bachata',
      size: 1.5
    })
    this.title.root.position.y += 10
    this.scene.add(this.title.root)

    this.poem = new Text(this, {
      message: `

        Lo unico que quiero es bailar...
        Bailar esta bachata

                                  Jan 23, 2022
                                      Mauricio
      `,
      size: 0.3
    })
    this.poem.root.position.y += 2
    this.poem.root.position.z -= 0.5
    this.poem.root.rotation.y = Math.PI
    this.scene.add(this.poem.root)

    this.subtitles = new Subtitles(this, {
      color: '#ff8300',
      subtitles: assets.subtitles,
      video: this.video
    })
    this.subtitles.root.position.y += 7.5
    this.scene.add(this.subtitles.root)

    this.subtitlesEnglish = new Subtitles(this, {
      subtitles: assets.subtitlesEnglish,
      video: this.video
    })
    this.subtitlesEnglish.root.scale.x *= 0.7
    this.subtitlesEnglish.root.scale.y *= 0.7
    this.subtitlesEnglish.root.position.y += 6
    this.scene.add(this.subtitlesEnglish.root)

    this.claps = new Claps(this, {
      claps: assets.claps,
      video: this.video
    })
    // nothing added yet
    this.scene.add(this.claps.root)

    this.raycastTargets = [this.videoControls.root]
  }

  listeners() {
    this.on('move', this.onMove.bind(this))
    const rootDom = document.body.querySelector('#root')

    window.addEventListener(
      'mousemove',
      (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        const mouseStyle = this.intersected ? 'pointer' : 'move'
        rootDom.style.cursor = mouseStyle
      },
      false
    )

    window.addEventListener('click', () => {
      if (this.intersected) {
        this.intersected.onClick()
      }
    })

    window.addEventListener(
      'resize',
      () => {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
      },
      false
    )
  }

  onMove(step) {
    this.current = this.current + step
    if (this.current <= 0) this.current = 100
    if (this.current > 100) this.current = 1

    window.localStorage.setItem('current', `${this.current}`)
    const newImage = new Image(this, this.current)
    this.scene.add(newImage.root)
    this.image.move(step, () => {
      this.scene.remove(this.image.root)
      this.image = newImage
    })
  }

  timers() {
    this.bloomPassDelta = 0
    this.bloomPassDeltaTotal = 0
    this.bloomPassDeltaNext = 1
  }

  update(delta) {
    // update the filters to do the flickering
    this.bloomPassDelta += delta
    if (this.bloomPassDelta > this.bloomPassDeltaNext) {
      const factor = between(0.98, 0.99)
      this.renderer.toneMappingExposure = Math.pow(factor, 4.0)
      this.bloomPassDelta = 0
      this.bloomPassDeltaTotal += 1
      this.bloomPassDeltaNext = 0.5
      this.emit('factor', factor)
    }

    // raycast
    raycaster.setFromCamera(mouse, this.camera)
    this.raycastTargets.forEach((target) => {
      var intersects = raycaster.intersectObjects(target.children)
      if (intersects.length) {
        const candidate = intersects[0].object
        if (candidate !== this.intersected && !candidate.skipRaycast) {
          this.intersected = candidate
          this.intersected.originalScale = this.intersected.scale.clone()
          this.intersected.isPicked = true
        }
      } else {
        if (this.intersected) {
          this.intersected.scale.copy(this.intersected.originalScale)
          this.intersected.isPicked = false
        }
        this.intersected = null
      }
    })

    // const lo = 0
    // const hi = 100
    // const c = (Math.min(Math.max(avg, lo), hi) - lo) / (hi - lo)
    // const color = `#${(new THREE.Color(c, c, c)).getHexString()}`
    // document.body.style.backgroundColor = color

    // broadcast
    this.emit('update', { delta })
  }

  setBloomPassStrength(strength) {
    this.bloomPass.strength = strength
  }

  loop() {
    requestAnimationFrame(this.loop.bind(this))
    // stats.begin()
    this.controls.update()
    this.update(clock.getDelta())
    this.composer.render()
    TWEEN.update()
    // stats.end()
  }
}

export { App }
