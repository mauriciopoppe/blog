import EventEmitter from 'events'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Image } from './Image'
import { Calendar } from './Calendar'
import { Text } from './Text'
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

const stats = new Stats()
stats.domElement.style.position = 'absolute'
document.querySelector('#root').appendChild(stats.domElement)
const clock = new THREE.Clock()
const gui = new dat.GUI()
const raycaster = new THREE.Raycaster();

const mouse = new THREE.Vector2();
class App extends EventEmitter {
  constructor() {
    super()
    this.setup()
    this.addLights()
    this.addObjects()
    this.gui()
    this.timers()
    this.listeners()
    this.audio()
  }

  setup() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    this.renderer.setClearColor(0xffffff, 0)
    this.renderer.domElement.style.opacity = 0
    document.body.querySelector('#root').appendChild(this.renderer.domElement);

    this.camera.position.z = 10

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.minDistance = 1;
    this.controls.maxDistance = 20;
    this.controls.update()

    this.composer = new THREE.EffectComposer(this.renderer );
    var renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass( renderPass );

    var effectGrayScale = new THREE.ShaderPass(THREE.LuminosityShader);
    this.composer.addPass( effectGrayScale );

    var effectSobel = new THREE.ShaderPass( THREE.SobelOperatorShader );
    effectSobel.uniforms[ "resolution" ].value.x = window.innerWidth;
    effectSobel.uniforms[ "resolution" ].value.y = window.innerHeight;
    this.effectSobel = effectSobel
    this.effectSobel.enabled = true
    this.composer.addPass( effectSobel );

    var afterImage = new THREE.AfterimagePass();
    this.afterimagePass = afterImage
    this.afterimagePass.uniforms['damp'].value = 0.7
    this.composer.addPass(afterImage);

    var bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( window.innerWidth, window.innerHeight ), 1.5, 0.4, 0.85 );
    bloomPass.threshold = 0
    bloomPass.strength = 0.5
    bloomPass.radius = 0
    this.composer.addPass( bloomPass );
    this.bloomPass = bloomPass

    // index of the current frame
    this.current = parseInt(window.localStorage.getItem('current')) || 1
  }

  addLights() {
    this.light = new THREE.PointLight( 0xffffff, 1, 0 );
    this.light.position.set(0, 0, 100 );
    this.scene.add(this.light)

    this.ambientLight = new THREE.AmbientLight( 0x333333 );
    this.scene.add(this.ambientLight)
  }

  addObjects() {
    // var axesHelper = new THREE.AxesHelper( 5 );
    // this.scene.add( axesHelper );

    this.image = new Image(this, this.current)
    this.scene.add(this.image.root)

    this.calendar = new Calendar(this)
    this.scene.add(this.calendar.root)

    this.title = new Text(this, {
      message: '100 Days of Songs',
      size: 1
    })
    this.title.root.position.y += 6
    this.scene.add(this.title.root)

    this.poem = new Text(this, {
      message: `
What would you do if you weren't afraid?

                                  Mauricio
      `,
      size: 0.3
    })
    this.poem.root.position.y += 2
    this.poem.root.position.z -= 0.5
    this.poem.root.rotation.y = Math.PI
    this.scene.add(this.poem.root)

    this.raycastTargets = [this.calendar.root]
  }

  listeners() {
    this.on('move', this.onMove.bind(this))
    const rootDom = document.body

    window.addEventListener('mousemove', (event) => {
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
      const mouseStyle = this.intersected ? 'pointer' : 'move'
      rootDom.style.cursor = mouseStyle
    }, false );

    window.addEventListener('click', () => {
      if (this.intersected) {
        this.intersected.onClick()
      }
    })

    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
    }, false);

  }

  audio() {
    // create an AudioListener and add it to the camera
    const listener = new THREE.AudioListener();
    this.camera.add(listener);

    // create an Audio source
    this.sound = new THREE.Audio(listener);
    this.sound.setBuffer(assets.audioBuffer)
    this.sound.setLoop(true);
    this.sound.setVolume(0);
    this.sound.play();

    // create an AudioAnalyser, passing in the sound and desired fftSize
    this.analyser = new THREE.AudioAnalyser(this.sound, 128);
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

  gui() {
    var params = {
      exposure: 1,
      bloomStrength: 1.5,
      bloomThreshold: 0,
      bloomRadius: 0,
      damp: 0.7,
      playSound: true,
      sobel: true
    }
    gui.localStorage = true
    gui.add( params, 'exposure', 0.1, 2 ).onChange(value => {
      this.renderer.toneMappingExposure = Math.pow( value, 4.0 );
    });
    gui.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange(value => {
      this.bloomPass.threshold = Number( value );
    });
    gui.add( params, 'bloomStrength', 0.0, 3.0 ).onChange(value => {
      this.bloomPass.strength = Number( value );
    }).listen();
    gui.add( params, 'bloomRadius', 0.0, 5.0 ).step( 0.01 ).onChange(value => {
      this.bloomPass.radius = Number( value );
    });
    gui.add( params, 'sobel').onChange(value => {
      this.effectSobel.enabled = value
    })
    gui.add( params, 'damp', 0, 1 ).step( 0.001 ).onChange(value => {
      this.afterimagePass.uniforms['damp'].value = value
    })
    gui.add(params, 'playSound').onChange(value => {
      if (value) {
        this.sound.play();
      } else {
        this.sound.pause();
      }
    })
    gui.close()
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
      const factor = between(0.9, .95)
      this.renderer.toneMappingExposure = Math.pow(factor, 4.0)
      // this.bloomPass.strength = between(0.2, 0.8)
      this.bloomPassDelta = 0
      this.bloomPassDeltaTotal += 1
      this.bloomPassDeltaNext = Math.random() * 0.3
      this.emit('factor', factor)
    }

    // position of the arrows
    this.calendar.root.position.copy(this.camera.position)
    this.calendar.root.lookAt(this.camera.position.clone().multiplyScalar(2))
    const negPos = this.calendar.root.position.clone()
    negPos.normalize()
    negPos.multiplyScalar(-1)
    this.calendar.root.position.add(negPos)

    // raycast
    raycaster.setFromCamera( mouse, this.camera );
    this.raycastTargets.forEach(target => {
      var intersects = raycaster.intersectObjects(target.children);
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

    // get the average frequency of the sound
    this.sound.setVolume(Math.min(0.5, clock.getElapsedTime() / 10));
    const avg = this.analyser.getAverageFrequency()
    const soundNormalized = avg / 100
    this.bloomPass.strength = soundNormalized

    // const lo = 0
    // const hi = 100
    // const c = (Math.min(Math.max(avg, lo), hi) - lo) / (hi - lo)
    // const color = `#${(new THREE.Color(c, c, c)).getHexString()}`
    // document.body.style.backgroundColor = color

    // broadcast
    this.emit('update', { delta })
  }

  loop() {
    requestAnimationFrame(this.loop.bind(this));
    stats.begin()
    this.controls.update()
    this.update(clock.getDelta())
    this.composer.render()
    TWEEN.update()
    stats.end()
  }
}

export { App }
