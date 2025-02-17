import { EventEmitter } from 'events'
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { AfterimagePass } from 'three/addons/postprocessing/AfterimagePass.js'

import { Video } from './Video.js'
import { Image } from './Image.js'
import { VideoControls } from './VideoControls.js'
import { Text } from './Text.js'
import { Subtitles } from './Subtitles.js'
import { Claps } from './Claps.js'
import { between } from '../utils.js'
import { assets } from '../assets.js'

const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

class App extends EventEmitter {
  scene: THREE.Scene
  camera: THREE.Camera
  renderer: THREE.Renderer
  controls: OrbitControls
  composer: EffectComposer
  afterimagePass: AfterimagePass
  bloomPass: UnrealBloomPass
  current: number

  light: THREE.Light
  ambientLight: THREE.Light

  video: Video
  videoControls: VideoControls
  title: Text
  subtitles: Subtitles
  subtitlesEnglish: Subtitles
  poem: Text
  claps: Claps
  image: Image

  raycastTargets: THREE.Object3D[]
  intersected?: THREE.Object3D

  bloomPassDelta: number
  bloomPassDeltaTotal: number
  bloomPassDeltaNext: number

  constructor() {
    super()
    this.setup()
    this.addLights()
    this.addObjects()
    this.timers()
    this.setupListeners()
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

    /**
     * @type any
     */
    this.composer = new EffectComposer(this.renderer)
    var renderPass = new RenderPass(this.scene, this.camera)
    this.composer.addPass(renderPass)

    var afterImage = new AfterimagePass()
    /**
     * @type any
     */
    this.afterimagePass = afterImage
    this.afterimagePass.uniforms.damp.value = 0.7
    this.composer.addPass(afterImage)

    var bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85)
    bloomPass.threshold = 0
    bloomPass.strength = 0.5
    bloomPass.radius = 0
    this.composer.addPass(bloomPass)
    /**
     * @type any
     */
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
      size: 0.3,
      color: '#ffffff'
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
      video: this.video,
      color: '#ffffff'
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

  setupListeners() {
    this.on('move', this.onMove.bind(this))
    const rootDom: HTMLElement = document.body.querySelector('#root')

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

  onMove(step: number) {
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

  update(delta: number) {
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

  setBloomPassStrength(strength: number) {
    this.bloomPass.strength = strength
  }

  loop() {
    requestAnimationFrame(this.loop.bind(this))
    // stats.begin()
    this.controls.update()
    this.update(clock.getDelta())
    this.composer.render()
    window.TWEEN.update()
    // stats.end()
  }
}

export { App }
