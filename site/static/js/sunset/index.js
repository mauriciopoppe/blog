import * as THREE from 'https://esm.sh/three@0.144.0'
import { OrbitControls } from 'https://esm.sh/three@0.144.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://esm.sh/three@0.144.0/examples/jsm/loaders/GLTFLoader.js'
import { Text as TroikaText } from 'https://esm.sh/troika-three-text@0.49.0?deps=three@0.144.0'
import { EffectComposer } from 'https://esm.sh/three@0.144.0/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://esm.sh/three@0.144.0/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'https://esm.sh/three@0.144.0/examples/jsm/postprocessing/UnrealBloomPass.js'

const compare = false
const target = document.querySelector('#browser-sunset')

function getPrimaryColor() {
  const channels = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .split(',')
    .map((channel) => Number(channel.trim()) / 255)
  return new THREE.Color().setRGB(...channels)
}

function renderMobileScene(targetEl) {
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('preserveAspectRatio', 'none')
  svg.style.cssText = 'position:absolute;width:100%;height:100%;display:block;left:0;top:0;'
  targetEl.replaceChildren(svg)
  const primaryChannels = getComputedStyle(document.documentElement)
    .getPropertyValue('--primary')
    .split(',')
    .map((channel) => Number(channel.trim()))
  const colors = [primaryChannels, [33, 34, 32]]
  const colorAt = (t) => {
    const r = Math.round(colors[0][0] * (1 - t) + colors[1][0] * t)
    const g = Math.round(colors[0][1] * (1 - t) + colors[1][1] * t)
    const b = Math.round(colors[0][2] * (1 - t) + colors[1][2] * t)
    return `rgb(${r},${g},${b})`
  }
  let width = 1
  let height = 1
  const hillLayers = []
  const draw = () => {
    let starsSeed = 1337
    const starsRandom = () => {
      starsSeed = (starsSeed * 48271) % 2147483647
      return starsSeed / 2147483647
    }
    let hillsSeed = 1337
    const hillsRandom = () => {
      hillsSeed = (hillsSeed * 48271) % 2147483647
      return hillsSeed / 2147483647
    }
    width = Math.max(targetEl.clientWidth, 1)
    height = Math.max(targetEl.clientHeight, 1)
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
    svg.replaceChildren()
    hillLayers.length = 0
    for (let i = 0; i < 250; i += 1) {
      const star = document.createElementNS(svgNS, 'circle')
      star.setAttribute('cx', String(starsRandom() * width))
      star.setAttribute('cy', String(starsRandom() * height))
      const radius = starsRandom()
      star.setAttribute('r', String(radius + starsRandom()))
      star.setAttribute('fill', 'var(--link)')
      svg.appendChild(star)
    }
    for (let layer = 0; layer < 10; layer += 1) {
      const points = []
      const baseline = height * 0.1 + (1 - layer / 10) * height * 0.3
      for (let i = -1; i <= 11; i += 1) {
        const x = (i / 10) * width + (hillsRandom() - 0.5) * width * 0.06
        const y = Math.max(0, baseline + (hillsRandom() - 0.5) * 200)
        points.push(`${x.toFixed(1)},${(height - y).toFixed(1)}`)
      }
      points.push(`${width},${height}`, `0,${height}`)
      const hill = document.createElementNS(svgNS, 'polygon')
      hill.setAttribute('points', points.join(' '))
      hill.setAttribute('fill', colorAt(0.25 + ((10 - layer) / 10) * 0.75))
      svg.appendChild(hill)
      hillLayers.push({ element: hill, depth: layer })
    }
  }
  const resizeObserver = new ResizeObserver(draw)
  resizeObserver.observe(targetEl)
  draw()
  let tracked = false
  let mouseX = 0
  const updateLayers = (scrollT) => {
    hillLayers.forEach(({ element, depth }) => {
      const x = (mouseX * 100 * depth) / 10
      const y = ((depth * 500) / 10) * (1 - Math.max(0, scrollT))
      element.setAttribute('transform', `translate(${x.toFixed(2)} ${y.toFixed(2)})`)
    })
  }
  const onScroll = () => {
    const scrollT = (window.scrollY - (document.documentElement.scrollHeight - window.innerHeight - height)) / height
    svg.style.opacity = String(Math.max(0, Math.min(1, scrollT)))
    updateLayers(scrollT)
    if (scrollT > 0.8 && !tracked) {
      tracked = true
      window.gtag?.('event', 'footer_animation')
    }
  }
  const onMouseMove = (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2
    onScroll()
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  document.addEventListener('mousemove', onMouseMove)
  onScroll()
}

if (target) {
  if (window.matchMedia('(pointer: coarse)').matches) {
    renderMobileScene(target)
  } else {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
  const mobile = window.matchMedia('(pointer: coarse)').matches
  camera.position.set(0, 1, 10)
  window.__SUNSET_CAMERA__ = camera
  const renderer = new THREE.WebGLRenderer({ antialias: !mobile, alpha: true })
  renderer.setClearColor(0x000000, 0)
  renderer.setClearAlpha(0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace
  target.replaceChildren(renderer.domElement)
  renderer.domElement.style.display = 'block'
  renderer.domElement.style.width = '100%'
  renderer.domElement.style.height = '100%'
  // Keep the canvas transparent so the page's CSS background is composited in
  // sRGB, matching the original R3F renderer.

  scene.add(new THREE.AmbientLight(0xffffff, 1))
  const moonPosition = new THREE.Vector3(10, 10, -50)
  const primaryColor = getPrimaryColor()
  const moonLight = new THREE.PointLight(0xffffff, 1)
  moonLight.position.copy(moonPosition)
  scene.add(moonLight)
  const accentLight = new THREE.PointLight(primaryColor, 1)
  accentLight.position.copy(moonPosition)
  scene.add(accentLight)

  let starSeed = 1337
  const random = () => {
    starSeed = (starSeed * 48271) % 2147483647
    return starSeed / 2147483647
  }
  const starPositions = new Float32Array((mobile ? 350 : 1000) * 3)
  for (let i = 0; i < starPositions.length; i += 3) {
    const theta = random() * Math.PI * 2
    const z = random() * 2 - 1
    const radius = Math.sqrt(1 - z * z) * 100
    starPositions[i] = radius * Math.cos(theta)
    starPositions[i + 1] = z * 100
    starPositions[i + 2] = radius * Math.sin(theta)
  }
  const starsGeometry = new THREE.BufferGeometry()
  starsGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  scene.add(new THREE.Points(starsGeometry, new THREE.PointsMaterial({ color: '#ffa0e0', size: 0.25, transparent: true, depthWrite: false })))

  const ground = new THREE.Group()
  // The reference scene's #212220 hills remain almost black after lighting.
  // Use a darker linear albedo here so the native renderer keeps that dim
  // silhouette while the moon and plane retain their original illumination.
  const groundMaterial = new THREE.MeshLambertMaterial({ color: '#0b0c0b' })
  const moundCount = mobile ? 80 : 200
  let groundSeed = 1337
  const groundRandom = () => {
    groundSeed = (groundSeed * 48271) % 2147483647
    return groundSeed / 2147483647
  }
  const moundX = Array.from({ length: moundCount }, () => (groundRandom() - 0.5) * 50)
  const moundHeight = Array.from({ length: moundCount }, () => groundRandom() * 5)
  const moundZ = Array.from({ length: moundCount }, () => (groundRandom() - 0.5) * 50)
  for (let i = 0; i < moundCount; i += 1) {
    const cone = new THREE.Mesh(new THREE.ConeGeometry(5, moundHeight[i], Math.floor(4 + groundRandom() * 5)), groundMaterial)
    cone.position.set(moundX[i], 0, moundZ[i])
    ground.add(cone)
  }
  const floor = new THREE.Mesh(new THREE.CircleGeometry(100, 32), groundMaterial)
  floor.rotation.x = -Math.PI / 2
  ground.add(floor)
  scene.add(ground)

  const moonMaterial = new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false })
  // Keep the visible core white while giving bloom enough HDR energy to form
  // the strong halo used by the standalone scene.
  moonMaterial.color.setRGB(20, 20, 20)
  const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 128, 128), moonMaterial)
  moon.position.copy(moonPosition)
  moon.rotation.x = -Math.PI / 2
  scene.add(moon)

  const planeRoot = new THREE.Group()
  planeRoot.position.set(-15, 5, 0)
  planeRoot.rotation.y = Math.PI / 2
  const wrapper = new THREE.Group()
  planeRoot.add(wrapper)
  scene.add(planeRoot)

  const flagGeometry = new THREE.PlaneGeometry(0.3, 3, 10, 10)
  const flagTime = { value: 0 }
  const flagMaterial = new THREE.MeshPhongMaterial({
    color: primaryColor,
    emissive: primaryColor,
    emissiveIntensity: 0.06,
    side: THREE.DoubleSide
  })
  flagMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.time = flagTime
    shader.vertexShader = shader.vertexShader.replace(
      '#include <begin_vertex>',
      'vec3 transformed = position; transformed.x += sin(position.y * 3.0 + time * 5.0) * 0.08 * uv.y;'
    )
    shader.vertexShader = `uniform float time;\n${shader.vertexShader}`
  }
  flagMaterial.customProgramCacheKey = () => 'sunset-flag-wobble'
  const flag = new THREE.Mesh(flagGeometry, flagMaterial)
  flag.rotation.set(-Math.PI / 2, Math.PI / 2, 0)
  flag.position.set(0, 0, -2.4)
  wrapper.add(flag)

  const textMesh = new TroikaText()
  textMesh.text = 'Thanks for reading!'
  textMesh.font = 'https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff'
  textMesh.fontSize = 12
  textMesh.maxWidth = 200
  textMesh.lineHeight = 1
  textMesh.letterSpacing = 0.01
  textMesh.textAlign = 'left'
  textMesh.anchorX = 'center'
  textMesh.anchorY = 'middle'
  textMesh.color = primaryColor.clone().multiplyScalar(1.15)
  textMesh.position.set(0, 0, -7)
  textMesh.rotation.y = (Math.PI * 3) / 2
  textMesh.scale.setScalar(0.035)
  textMesh.sync()
  textMesh.material.toneMapped = false
  wrapper.add(textMesh)

  let mixer = null
  new GLTFLoader().load('/models/plane/scene.gltf', ({ scene: model, animations }) => {
    model.traverse((object) => {
      if (!object.isMesh) return
      const materials = Array.isArray(object.material) ? object.material : [object.material]
      materials.forEach((material) => {
        if (!material.emissive || !material.color) return
        material.emissive.copy(material.color)
        material.emissiveIntensity = 0.04
      })
    })
    wrapper.add(model)
    if (animations.length) {
      mixer = new THREE.AnimationMixer(model)
      mixer.clipAction(animations[0]).play()
    }
  })

  const controls = new OrbitControls(camera, renderer.domElement)
  window.__SUNSET_CONTROLS__ = controls
  window.__SUNSET_SCENE__ = scene
  controls.enableZoom = false
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.autoRotate = !compare
  controls.autoRotateSpeed = 0.1
  controls.maxPolarAngle = Math.PI / 2 - 0.1
  const composerTarget = new THREE.WebGLRenderTarget(1, 1, {
    depthBuffer: true,
    format: THREE.RGBAFormat,
    stencilBuffer: false
  })
  const composer = new EffectComposer(renderer, composerTarget)
  const renderPass = new RenderPass(scene, camera)
  renderPass.clearColor = new THREE.Color(0x000000)
  renderPass.clearAlpha = 0
  composer.addPass(renderPass)
  const bloomPass = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.4, 0)
  bloomPass.highPassUniforms.smoothWidth.value = 0.4
  // Preserve transparent pixels when the bloom pass copies the base frame.
  bloomPass.basic.transparent = true
  bloomPass.oldClearAlpha = 0
  bloomPass.materialCopy.blending = THREE.CustomBlending
  bloomPass.materialCopy.blendEquation = THREE.AddEquation
  bloomPass.materialCopy.blendSrc = THREE.OneFactor
  bloomPass.materialCopy.blendDst = THREE.OneFactor
  bloomPass.materialCopy.blendSrcAlpha = THREE.ZeroFactor
  bloomPass.materialCopy.blendDstAlpha = THREE.OneFactor
  composer.addPass(bloomPass)
  window.__SUNSET_DEBUG__ = {
    camera,
    composer,
    controls,
    renderer,
    scene,
    setCamera(position, target = [0, 0, 0]) {
      camera.position.set(...position)
      controls.target.set(...target)
      controls.update()
    }
  }

  const resize = () => {
    const width = target.clientWidth
    const height = target.clientHeight
    camera.aspect = Math.max(width, 1) / Math.max(height, 1)
    camera.updateProjectionMatrix()
    renderer.setSize(Math.max(width, 1), Math.max(height, 1), false)
    composer.setSize(Math.max(width, 1), Math.max(height, 1))
  }
  const observer = new ResizeObserver(resize)
  observer.observe(target)
  resize()
  let paused = false
  if (!compare) {
    const visibilityObserver = new IntersectionObserver(([entry]) => {
      paused = !entry.isIntersecting
    })
    visibilityObserver.observe(target)
  }
  let tracked = false
  const onPointerDown = () => {
    if (!tracked) {
      tracked = true
      window.gtag?.('event', 'footer_animation')
    }
    renderer.domElement.style.cursor = 'grabbing'
  }
  const onPointerUp = () => { renderer.domElement.style.cursor = 'grab' }
  renderer.domElement.style.cursor = 'grab'
  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointerup', onPointerUp)
  let previousTime = null
  const render = (time) => {
    if (paused) {
      requestAnimationFrame(render)
      return
    }
    const delta = previousTime === null ? 0 : Math.min((time - previousTime) / 1000, 0.1)
    previousTime = time
    const seconds = time * 0.001
    wrapper.position.z += delta
    wrapper.position.y = Math.sin(seconds) * 0.5
    wrapper.rotation.x = Math.sin(seconds - Math.PI / 2) * 0.1
    flagTime.value = seconds
    textMesh.rotation.z = Math.sin(seconds) * 0.02
    textMesh.position.y = Math.sin(seconds * 1.5) * 0.04
    mixer?.update(delta)
    controls.update()
    composer.render()
    renderer.setClearAlpha(0)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
  }
}
