import * as THREE from 'https://esm.sh/three@0.144.0'
import { OrbitControls } from 'https://esm.sh/three@0.144.0/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'https://esm.sh/three@0.144.0/examples/jsm/loaders/GLTFLoader.js'
import { EffectComposer } from 'https://esm.sh/three@0.144.0/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'https://esm.sh/three@0.144.0/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'https://esm.sh/three@0.144.0/examples/jsm/postprocessing/UnrealBloomPass.js'
import * as CANNON from '/js/vendor/cannon-es.js'
import GUI from 'https://cdn.jsdelivr.net/npm/lil-gui@0.20.0/+esm'
import {
  calculateAileronForce,
  calculateElevatorControlForce,
  calculateFlightForces,
  calculateHalfRollAileronForce,
  calculateHalfRollElevatorForce,
  calculateHalfRollRudderForce,
  calculateKnifeEdgeAileronForce,
  calculateKnifeEdgeElevatorForce,
  calculateKnifeEdgeRudderForce,
  calculateKnifeEdgeTargetBank,
  calculateLevelRoll,
  calculateLevelingAileronForce,
  calculateLoopElevatorForce,
  calculateRudderForce,
  cruiseConfig,
  evaluateFlightEnvelope
} from './flight-engine.js?v=flight-streamers-3'
import {
  createCannonRopes,
  stepCannonRopes,
  createRigidChain,
  updateRigidChainLeader,
  stepRigidChain,
  createRigidChainVisuals,
  syncRigidChainVisuals,
  syncRigidChainChords
} from './chain-engine.js?v=flight-letters-23'

const compare = false
const target = document.querySelector('#browser-sunset')
const sandbox = Boolean(target?.closest('.sunset-footer--sandbox'))
const flightControllerVersion = 'return-strategy-1'
// Prod-mode flag controlling whether the cosmetic 3D airplane model (isProduction = true)
// or the physics debug collision mesh and axes (isProduction = false) is rendered.
const isProduction = typeof process !== 'undefined' && process.env?.NODE_ENV !== undefined
  ? process.env.NODE_ENV === 'production'
  : (typeof window !== 'undefined' && window.__SUNSET_PROD__ !== undefined
      ? Boolean(window.__SUNSET_PROD__)
      : !(typeof window !== 'undefined' && new URLSearchParams(window.location?.search).has('debug')))

const formatTelemetry = (value) => {
  if (typeof value === 'number') return Math.round(value * 1000) / 1000
  if (Array.isArray(value)) return value.map(formatTelemetry)
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, formatTelemetry(item)]))
  return value
}

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
  scene.fog = new THREE.FogExp2(0x212220, 0.004)
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
  const createAxisLabel = (label, color) => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const context = canvas.getContext('2d')
    context.font = 'bold 72px system-ui, sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = color
    context.fillText(label, 64, 64)
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      depthTest: false,
      toneMapped: false
    }))
    sprite.scale.setScalar(0.45)
    return sprite
  }
  const createForceLabel = (label) => {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 64
    const context = canvas.getContext('2d')
    context.font = '600 30px system-ui, sans-serif'
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillStyle = '#ffffff'
    context.fillText(label, 128, 32)
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({
      map: new THREE.CanvasTexture(canvas),
      depthTest: false,
      toneMapped: false,
      transparent: true
    }))
    sprite.scale.set(0.8, 0.2, 1)
    return sprite
  }

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
  let groundSeed = 1337
  const groundRandom = () => {
    groundSeed = (groundSeed * 48271) % 2147483647
    return groundSeed / 2147483647
  }
  const moundCount = mobile ? 90 : 320
  const moundX = Array.from({ length: moundCount }, () => (groundRandom() - 0.5) * 120)
  const moundHeight = Array.from({ length: moundCount }, () => 0.4 + groundRandom() * 2.2)
  const moundZ = Array.from({ length: moundCount }, () => (groundRandom() - 0.5) * 120)
  for (let i = 0; i < moundCount; i += 1) {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(3 + groundRandom() * 4, moundHeight[i], Math.floor(4 + groundRandom() * 5)),
      groundMaterial
    )
    cone.position.set(moundX[i], moundHeight[i] / 2, moundZ[i])
    ground.add(cone)
  }
  const treeTrunkMaterial = new THREE.MeshLambertMaterial({ color: '#17120f' })
  const treeFoliageMaterial = new THREE.MeshLambertMaterial({ color: '#101c16' })
  const treeCount = mobile ? 12 : 36
  for (let i = 0; i < treeCount; i += 1) {
    const x = (groundRandom() - 0.5) * 90
    const z = (groundRandom() - 0.5) * 90
    const trunkHeight = 0.8 + groundRandom() * 0.7
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, trunkHeight, 6), treeTrunkMaterial)
    trunk.position.set(x, trunkHeight / 2, z)
    ground.add(trunk)
    const foliageHeight = 1.4 + groundRandom() * 1.1
    const foliage = new THREE.Mesh(new THREE.ConeGeometry(0.65 + groundRandom() * 0.3, foliageHeight, 7), treeFoliageMaterial)
    foliage.position.set(x, trunkHeight + foliageHeight / 2, z)
    ground.add(foliage)
  }
  const hazeCanvas = document.createElement('canvas')
  hazeCanvas.width = 256
  hazeCanvas.height = 128
  const hazeContext = hazeCanvas.getContext('2d')
  const hazeGradient = hazeContext.createRadialGradient(128, 64, 8, 128, 64, 128)
  hazeGradient.addColorStop(0, 'rgba(190, 170, 190, 0.24)')
  hazeGradient.addColorStop(1, 'rgba(190, 170, 190, 0)')
  hazeContext.fillStyle = hazeGradient
  hazeContext.fillRect(0, 0, 256, 128)
  const hazeMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(hazeCanvas),
    transparent: true,
    depthWrite: false,
    toneMapped: false
  })
  for (const [x, z, width, depth] of [[0, 22, 75, 38], [-35, 5, 45, 32], [38, 55, 48, 36]]) {
    const haze = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), hazeMaterial)
    haze.rotation.x = -Math.PI / 2
    haze.position.set(x, 0.08, z)
    ground.add(haze)
  }
  const poleMaterial = new THREE.MeshLambertMaterial({ color: '#151615' })
  const cableMaterial = new THREE.LineBasicMaterial({ color: '#292929', transparent: true, opacity: 0.7 })
  const polePositions = [[-24, -8], [-18, 4], [-12, 16], [-6, 27]]
  const poles = polePositions.map(([x, z]) => {
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.1, 3.2, 6), poleMaterial)
    pole.position.set(x, 1.6, z)
    ground.add(pole)
    const crossbar = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 0.08), poleMaterial)
    crossbar.position.set(x, 3.1, z)
    ground.add(crossbar)
    return pole
  })
  const cableGeometry = new THREE.BufferGeometry().setFromPoints(poles.map((pole) => new THREE.Vector3(pole.position.x, 3.1, pole.position.z)))
  ground.add(new THREE.Line(cableGeometry, cableMaterial))
  const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 6, 8), poleMaterial)
  beacon.position.set(27, 3, 22)
  ground.add(beacon)
  const beaconLight = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 8), new THREE.MeshBasicMaterial({ color: '#ff7043', toneMapped: false }))
  beaconLight.position.set(27, 6.2, 22)
  ground.add(beaconLight)
  const lightMaterial = new THREE.MeshBasicMaterial({ color: '#ffd180', toneMapped: false })
  for (let i = 0; i < 14; i += 1) {
    const x = (groundRandom() - 0.5) * 70
    const z = (groundRandom() - 0.5) * 70
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), lightMaterial)
    light.position.set(x, 0.18, z)
    ground.add(light)
  }
  for (const [x, z] of [[-34, 38], [-26, 48], [34, -25]]) {
    const turbine = new THREE.Group()
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 7, 8), poleMaterial)
    tower.position.y = 3.5
    turbine.add(tower)
    const hub = new THREE.Group()
    hub.position.y = 7
    for (let blade = 0; blade < 3; blade += 1) {
      const rotorBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.2, 0.08), new THREE.MeshBasicMaterial({ color: '#b5b5ae', toneMapped: false }))
      rotorBlade.position.y = 1.1
      rotorBlade.rotation.z = (blade / 3) * Math.PI * 2
      hub.add(rotorBlade)
    }
    turbine.add(hub)
    turbine.position.set(x, 0, z)
    ground.add(turbine)
  }
  const pond = new THREE.Mesh(
    new THREE.CircleGeometry(7, 32),
    new THREE.MeshBasicMaterial({ color: '#1c3032', transparent: true, opacity: 0.8, toneMapped: false })
  )
  pond.scale.set(1.5, 0.55, 1)
  pond.rotation.x = -Math.PI / 2
  pond.position.set(22, 0.025, -18)
  ground.add(pond)
  const distantMountainMaterial = new THREE.MeshLambertMaterial({ color: '#070807' })
  const distantMountainCount = mobile ? 32 : 64
  for (let i = 0; i < distantMountainCount; i += 1) {
    const angle = (i / distantMountainCount) * Math.PI * 2
    const radius = 68 + groundRandom() * 18
    const height = 6 + groundRandom() * 10
    const mountain = new THREE.Mesh(
      new THREE.ConeGeometry(5 + groundRandom() * 4, height, Math.floor(5 + groundRandom() * 4)),
      distantMountainMaterial
    )
    mountain.position.set(Math.cos(angle) * radius, height / 2, Math.sin(angle) * radius)
    ground.add(mountain)
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
  planeRoot.position.set(-45, 5, 0)
  planeRoot.rotation.y = Math.PI / 2
  // All animated motion is expressed in this local flight group. The plane
  // model keeps a stable forward (nose) axis while the group follows the path.
  const planeFlightGroup = new THREE.Group()
  planeRoot.add(planeFlightGroup)
  const planeGroup = new THREE.Group()
  planeFlightGroup.add(planeGroup)
  if (!isProduction) {
    planeGroup.add(new THREE.AxesHelper(1.5))
    const xLabel = createAxisLabel('X', '#ff5555')
    const yLabel = createAxisLabel('Y', '#55ff55')
    const zLabel = createAxisLabel('Z', '#5555ff')
    xLabel.position.x = 1.75
    yLabel.position.y = 1.75
    zLabel.position.z = 1.75
    planeGroup.add(xLabel, yLabel, zLabel)
    const addRigidBodyVolume = (halfExtents, color) => {
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(halfExtents.x * 2, halfExtents.y * 2, halfExtents.z * 2)),
        new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.85, depthTest: false, toneMapped: false })
      )
      planeGroup.add(edges)
    }
    // These match the Cannon shapes exactly: fuselage first, then the wing
    // inertia volume. The visual plane is hidden in debug mode so force
    // points can be read against the physical body.
    addRigidBodyVolume(new THREE.Vector3(0.45, 0.12, 0.9), 0xf5f5f5)
    addRigidBodyVolume(new THREE.Vector3(1, 0.05, 0.3), primaryColor)
  }
  let boundary = null
  const debugSettings = { showDebugData: false }
  if (sandbox) {
    boundary = new THREE.Mesh(
      new THREE.SphereGeometry(cruiseConfig.boundaryRadius, 48, 24),
      new THREE.MeshBasicMaterial({
        color: primaryColor,
        wireframe: true,
        transparent: true,
        opacity: 0.14,
        depthWrite: false,
        toneMapped: false
      })
    )
    boundary.position.fromArray(cruiseConfig.boundaryCenter)
    boundary.visible = debugSettings.showDebugData
    planeRoot.add(boundary)
  }
  scene.add(planeRoot)
  // Every force, including gravity, passes through the same explicit ramped
  // force pipeline below.
  const physicsWorld = new CANNON.World({ gravity: new CANNON.Vec3(0, 0, 0) })
  physicsWorld.solver.iterations = 12
  const planeBody = new CANNON.Body({
    mass: 3,
    linearDamping: 0.015,
    angularDamping: 0.08
  })
  // The box gives the body an aircraft-like inertia tensor instead of the
  // uniform inertia of the temporary spherical placeholder.
  planeBody.addShape(new CANNON.Box(new CANNON.Vec3(0.45, 0.12, 0.9)))
  // This shape contributes the roll inertia of the wings. It is a physics
  // volume only, so it does not change the loaded visual model.
  planeBody.addShape(new CANNON.Box(new CANNON.Vec3(1, 0.05, 0.3)))
  // Rotational motion comes from forces applied at the aircraft's physical
  // surfaces. Do not steer by mutating orientation or angular velocity.
  planeBody.angularFactor.set(1, 1, 1)
  planeBody.angularVelocity.set(0, 0, 0)
  planeBody.position.set(
    cruiseConfig.boundaryCenter[0],
    cruiseConfig.boundaryCenter[1],
    cruiseConfig.boundaryCenter[2] - cruiseConfig.boundaryRadius
  )
  physicsWorld.addBody(planeBody)
  planeBody.velocity.set(0, 0, 2.4)

  const letterChain = createRigidChain({
    CANNON,
    world: physicsWorld,
    parentBody: planeBody,
    tailOffset: [0, 0, -1],
    text: 'Until the next idea!',
    linkMass: 0.012,
    linkLength: 0.14,
    linkRadius: 0.02,
    delayFrames: 3
  })
  const letterVisuals = createRigidChainVisuals(THREE, letterChain, {
    color: primaryColor.getStyle(),
    font: '600 56px system-ui, sans-serif',
    scale: [0.52, 0.76, 1],
    rotationY: -Math.PI / 2,
    chordColor: primaryColor.getStyle(),
    chordOpacity: 0.72
  })
  planeRoot.add(letterVisuals.group)

  const streamerAnchors = [-0.78, -0.76, -0.74, -0.72, 0.72, 0.74, 0.76, 0.78]
    .map((x) => [x, -0.15, 0])
  const cannonRopes = createCannonRopes({
    CANNON,
    world: physicsWorld,
    anchors: streamerAnchors,
    particlesPerRope: 6,
    restLength: 0.15,
    particleMass: 0.005,
    linearDamping: 0.20
  })

  // Visual streamer ropes: independent spring-connected particle chains from both wing ends
  const streamerGroup = new THREE.Group()
  const streamerColors = [0xff7043, 0xff9800, 0xffca28, 0xffd54f, 0xffab91, 0xff6e40, 0xf43f5e]
  const streamerLines = cannonRopes.ropes.map((rope, rIdx) => {
    const points = new Array(cannonRopes.particlesPerRope).fill(null).map(() => new THREE.Vector3())
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({
      color: streamerColors[rIdx % streamerColors.length],
      linewidth: 2,
      transparent: true,
      opacity: 0.88
    })
    const line = new THREE.Line(geometry, material)
    line.frustumCulled = false
    streamerGroup.add(line)
    return line
  })
  planeRoot.add(streamerGroup)

  const fixedPhysicsStep = 1 / 60
  const forceRampDuration = 15
  let simulationElapsed = 0
  let flightCrashed = false
  let flightCrashTelemetry = null
  const boundaryTelemetry = { crossings: [] }
  let wasOutsideBoundary = false
  const forceVectors = {}
  if (sandbox) {
    const addForceVector = (name, color, usualMagnitude) => {
      const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(), 0.01, color)
      const marker = new THREE.Mesh(
        new THREE.SphereGeometry(0.075, 16, 12),
        new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8, depthTest: false, toneMapped: false })
      )
      const label = createForceLabel(name)
      arrow.add(marker)
      arrow.visible = false
      label.visible = false
      arrow.userData = { baseColor: new THREE.Color(color), label, marker, usualMagnitude }
      planeRoot.add(arrow)
      planeRoot.add(label)
      forceVectors[name] = arrow
    }
    addForceVector('thrust', 0xffffff, 3)
    addForceVector('leftLift', 0x55ff55, 0.85)
    addForceVector('rightLift', 0x55ff55, 0.85)
    addForceVector('drag', 0xff5555, 2.2)
    addForceVector('gravity', 0x5599ff, 1.5)
    addForceVector('rudder', 0xffcc55, 0.025)
    addForceVector('elevator', 0xcc77ff, 0.07)
  }
  const setDebugDataVisibility = (visible) => {
    if (boundary) boundary.visible = visible
    Object.values(forceVectors).forEach((arrow) => {
      arrow.visible = visible && arrow.visible
      arrow.userData.label.visible = visible && arrow.visible
    })
    persistCamera()
  }
  const updateForceVector = (name, origin, force) => {
    const arrow = forceVectors[name]
    if (!arrow) return
    const magnitude = Math.hypot(force.x, force.y, force.z)
    arrow.visible = debugSettings.showDebugData && magnitude > 0.001
    arrow.userData.label.visible = arrow.visible
    if (!arrow.visible) return
    const highlighted = magnitude > arrow.userData.usualMagnitude
    const color = highlighted ? primaryColor : arrow.userData.baseColor
    arrow.setColor(color)
    arrow.userData.marker.material.color.copy(color)
    const pulse = highlighted ? 1 + Math.sin(performance.now() * 0.012) * 0.35 : 1
    arrow.userData.marker.scale.setScalar(pulse)
    arrow.userData.marker.material.opacity = highlighted ? 1 : 0.8
    arrow.position.set(origin.x, origin.y, origin.z)
    arrow.setDirection(new THREE.Vector3(force.x, force.y, force.z).normalize())
    const emphasis = highlighted ? 1.35 : 1
    const arrowLength = Math.max(0.32, magnitude * 0.8 * emphasis)
    arrow.setLength(
      arrowLength,
      Math.max(0.1, Math.min(0.34, magnitude * 0.12 * emphasis)),
      Math.max(0.06, Math.min(0.2, magnitude * 0.07 * emphasis))
    )
    arrow.userData.label.material.color.copy(color)
    arrow.userData.label.position.set(
      origin.x + force.x / magnitude * (arrowLength + 0.25),
      origin.y + force.y / magnitude * (arrowLength + 0.25),
      origin.z + force.z / magnitude * (arrowLength + 0.25)
    )
  }

  if (isProduction) {
    new GLTFLoader().load('/models/plane/scene.gltf', ({ scene: model }) => {
      model.traverse((object) => {
        if (!object.isMesh) return
        const materials = Array.isArray(object.material) ? object.material : [object.material]
        materials.forEach((material) => {
          if (!material.emissive || !material.color) return
          material.emissive.copy(material.color)
          material.emissiveIntensity = 0.04
        })
      })
      planeGroup.add(model)
    })
  }

  const controls = new OrbitControls(camera, renderer.domElement)
  window.__SUNSET_CONTROLS__ = controls
  window.__SUNSET_SCENE__ = scene
  controls.enableZoom = sandbox
  controls.zoomSpeed = 0.8
  controls.enableDamping = true
  controls.dampingFactor = 0.08
  controls.autoRotate = false
  controls.autoRotateSpeed = 0.1
  controls.maxPolarAngle = Math.PI / 2 - 0.1
  const cameraDebugState = { mode: 'Third person' }
  let activeCameraMode = 'Orbit'
  const orbitCameraPosition = camera.position.clone()
  const orbitCameraTarget = controls.target.clone()
  planeRoot.updateWorldMatrix(true, false)
  orbitCameraTarget.copy(planeRoot.localToWorld(new THREE.Vector3(
    planeBody.position.x,
    planeBody.position.y,
    planeBody.position.z - 1.5
  )))
  orbitCameraPosition.copy(planeRoot.localToWorld(new THREE.Vector3(
    planeBody.position.x - 12,
    planeBody.position.y + 6,
    planeBody.position.z - 14
  )))
  camera.position.copy(orbitCameraPosition)
  controls.target.copy(orbitCameraTarget)
  const thirdPersonOffset = new THREE.Vector3(-8, 2.5, -4)
  const thirdPersonTarget = new THREE.Vector3(0, 0, 0)
  const thirdPersonPreviousMatrix = new THREE.Matrix4()
  const thirdPersonDeltaMatrix = new THREE.Matrix4()
  const thirdPersonInverseMatrix = new THREE.Matrix4()
  let persistCamera = () => {}
  const setCameraMode = (mode) => {
    if (mode === activeCameraMode) return
    if (mode === 'Third person') {
      orbitCameraPosition.copy(camera.position)
      orbitCameraTarget.copy(controls.target)
      planeGroup.updateWorldMatrix(true, false)
      camera.position.copy(thirdPersonOffset)
      controls.target.copy(thirdPersonTarget)
      planeGroup.localToWorld(camera.position)
      planeGroup.localToWorld(controls.target)
      thirdPersonPreviousMatrix.copy(planeGroup.matrixWorld)
      controls.enabled = true
      controls.update()
    } else {
      camera.position.copy(orbitCameraPosition)
      controls.target.copy(orbitCameraTarget)
      controls.enabled = true
      controls.update()
    }
    activeCameraMode = mode
    cameraDebugState.mode = mode
    persistCamera()
  }
  if (!sandbox) setCameraMode('Third person')
  const flightSettings = {
    returnStrategy: 'random'
  }
  let currentFlightMode = 'normal'
  const flightDebugState = {
    status: 'flying',
    strategy: 'random',
    mode: 'normal',
    position: '0.00, 0.00, 0.00',
    velocity: '0.00, 0.00, 0.00',
    angularVelocity: '0.00, 0.00, 0.00',
    airspeed: 0,
    angleOfAttack: '0.0°',
    thrust: 0,
    lift: 0,
    drag: 0,
    netVerticalForce: 0,
    altitudeCorrection: 0,
    boundaryCorrection: 0,
    forceRamp: 0,
    engineForce: 0,
    leftWingForce: 0,
    rightWingForce: 0,
    rudderForce: 0,
    elevatorForce: 0
  }
  if (sandbox) {
    const cameraStorageKey = 'sunset-sandbox-camera-v3'
    const restoreCamera = () => {
      try {
        const saved = JSON.parse(localStorage.getItem(cameraStorageKey))
        if (!saved?.position || !saved?.target) return
        orbitCameraPosition.fromArray(saved.position)
        orbitCameraTarget.fromArray(saved.target)
        if (typeof saved.zoom === 'number') camera.zoom = saved.zoom
        camera.position.copy(orbitCameraPosition)
        controls.target.copy(orbitCameraTarget)
        cameraDebugState.mode = saved.mode === 'Orbit' ? 'Orbit' : 'Third person'
        debugSettings.showDebugData = Boolean(saved.showDebugData)
        setDebugDataVisibility(debugSettings.showDebugData)
        controls.update()
      } catch {
        // A malformed debugging value should never prevent the scene loading.
      }
    }
    persistCamera = () => {
      localStorage.setItem(cameraStorageKey, JSON.stringify({
        position: orbitCameraPosition.toArray(),
        target: orbitCameraTarget.toArray(),
        zoom: camera.zoom,
        mode: cameraDebugState.mode,
        showDebugData: debugSettings.showDebugData
      }))
    }
    restoreCamera()
    const restoredCameraMode = cameraDebugState.mode
    activeCameraMode = 'Orbit'
    cameraDebugState.mode = 'Orbit'
    if (restoredCameraMode === 'Third person') setCameraMode(restoredCameraMode)
    controls.addEventListener('change', () => {
      if (cameraDebugState.mode !== 'Orbit') return
      orbitCameraPosition.copy(camera.position)
      orbitCameraTarget.copy(controls.target)
      persistCamera()
    })
    const gui = new GUI({ title: 'Flight debug', container: target.parentElement })
    gui.add(cameraDebugState, 'mode', ['Orbit', 'Third person']).name('Camera mode').onChange(setCameraMode)
    gui.add(flightSettings, 'returnStrategy', ['random', 'bank', 'half-loop', 'knife-edge']).name('Return strategy')
    gui.add(debugSettings, 'showDebugData').name('Show debug data').onChange(setDebugDataVisibility)
    gui.add(physicsWorld.solver, 'iterations', 4, 32, 1).name('Solver iterations')
    Object.keys(flightDebugState).forEach((key) => gui.add(flightDebugState, key).listen().disable())
  }
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
  if (!compare && !sandbox) {
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
  const render = (time) => {
    if (paused) {
      requestAnimationFrame(render)
      return
    }
    const now = performance.now()
    const forceRamp = Math.min(1, simulationElapsed / forceRampDuration)
    const boundaryDistance = Math.hypot(
      planeBody.position.x - cruiseConfig.boundaryCenter[0],
      planeBody.position.y - cruiseConfig.boundaryCenter[1],
      planeBody.position.z - cruiseConfig.boundaryCenter[2]
    )
    const isOutsideBoundary = boundaryDistance > cruiseConfig.boundaryRadius
    boundaryTelemetry.distance = Math.round(boundaryDistance * 1000) / 1000
    boundaryTelemetry.controllerVersion = flightControllerVersion
    boundaryTelemetry.outside = isOutsideBoundary
    boundaryTelemetry.position = [
      Math.round(planeBody.position.x * 1000) / 1000,
      Math.round(planeBody.position.y * 1000) / 1000,
      Math.round(planeBody.position.z * 1000) / 1000
    ]
    window.__SUNSET_FLIGHT_BOUNDARY__ = JSON.stringify(boundaryTelemetry)
    if (isOutsideBoundary !== wasOutsideBoundary) {
      const crossing = formatTelemetry({
        direction: isOutsideBoundary ? 'outbound' : 'inbound',
        elapsedMs: Math.round(simulationElapsed * 1000),
        distance: boundaryDistance,
        position: [planeBody.position.x, planeBody.position.y, planeBody.position.z],
        velocity: [planeBody.velocity.x, planeBody.velocity.y, planeBody.velocity.z]
      })
      boundaryTelemetry.crossings.push(crossing)
      window.__SUNSET_FLIGHT_BOUNDARY__ = JSON.stringify(boundaryTelemetry)
      console.info('[DEBUG-sunset-boundary]', window.__SUNSET_FLIGHT_BOUNDARY__)
      wasOutsideBoundary = isOutsideBoundary
    }
    const flightConfig = {
      ...cruiseConfig,
      returnStrategy: flightSettings.returnStrategy
    }
    const forward = planeBody.quaternion.vmult(new CANNON.Vec3(0, 0, 1))
    const wingRight = planeBody.quaternion.vmult(new CANNON.Vec3(1, 0, 0))
    const bodyUp = planeBody.quaternion.vmult(new CANNON.Vec3(0, 1, 0))
    const rollRate = planeBody.angularVelocity.dot(forward)
    const pitchRate = planeBody.angularVelocity.dot(wingRight)
    const yawRate = planeBody.angularVelocity.dot(bodyUp)
    const angularSpeed = planeBody.angularVelocity.length()
    const currentRoll = calculateLevelRoll({
      forward: [forward.x, forward.y, forward.z],
      up: [bodyUp.x, bodyUp.y, bodyUp.z]
    })
    const forces = calculateFlightForces({
      position: [planeBody.position.x, planeBody.position.y, planeBody.position.z],
      velocity: [planeBody.velocity.x, planeBody.velocity.y, planeBody.velocity.z],
      forward: [forward.x, forward.y, forward.z],
      wingRight: [wingRight.x, wingRight.y, wingRight.z],
      up: [bodyUp.x, bodyUp.y, bodyUp.z],
      currentRoll,
      rollRate,
      pitchRate,
      angularSpeed,
      currentMode: currentFlightMode,
      config: flightConfig
    })
    currentFlightMode = forces.flightMode
    boundaryTelemetry.mode = forces.flightMode
    // The shared engine provides every force. Each one is applied explicitly
    // below after the slow startup ramp.
    const engineOffset = planeBody.quaternion.vmult(new CANNON.Vec3(0, 0, 0))
    const leftWingOffset = planeBody.quaternion.vmult(new CANNON.Vec3(-0.75, 0, 0))
    const rightWingOffset = planeBody.quaternion.vmult(new CANNON.Vec3(0.75, 0, 0))
    const tailOffset = planeBody.quaternion.vmult(new CANNON.Vec3(0, 0, -0.9))
    const enginePoint = planeBody.position.vadd(engineOffset)
    const leftWingPoint = planeBody.position.vadd(leftWingOffset)
    const rightWingPoint = planeBody.position.vadd(rightWingOffset)
    const tailPoint = planeBody.position.vadd(tailOffset)
    const letterTailPoint = planeBody.position.vadd(
      planeBody.quaternion.vmult(new CANNON.Vec3(...letterChain.tailOffset))
    )
    const envelope = evaluateFlightEnvelope({
      forward: [forward.x, forward.y, forward.z],
      up: [bodyUp.x, bodyUp.y, bodyUp.z],
      angularVelocity: [planeBody.angularVelocity.x, planeBody.angularVelocity.y, planeBody.angularVelocity.z],
      flightMode: forces.flightMode,
      maxRoll: flightConfig.maxRoll ?? 0.7
    })
    let bankForce = 0
    let rudderForce = 0
    let elevatorControlForce = 0

    if (forces.flightMode === 'returning-loop') {
      elevatorControlForce = calculateLoopElevatorForce({
        pitchRate,
        config: flightConfig
      })
      rudderForce = calculateRudderForce({
        yawCommand: 0,
        yawRate,
        config: flightConfig
      })
      bankForce = 0
    } else if (forces.flightMode === 'returning-roll') {
      bankForce = calculateHalfRollAileronForce({
        currentRoll,
        rollRate,
        upY: bodyUp.y,
        config: flightConfig
      })
      elevatorControlForce = calculateHalfRollElevatorForce({
        forwardY: forward.y,
        pitchRate,
        config: flightConfig
      })
      rudderForce = calculateHalfRollRudderForce({
        forwardX: forward.x,
        upY: bodyUp.y,
        yawRate,
        config: flightConfig
      })
    } else if (forces.flightMode === 'returning-knife-roll' || forces.flightMode === 'returning-knife-turn') {
      const targetBank = calculateKnifeEdgeTargetBank({
        position: [planeBody.position.x, planeBody.position.y, planeBody.position.z],
        forward: [forward.x, forward.y, forward.z],
        config: flightConfig
      })
      bankForce = calculateKnifeEdgeAileronForce({
        currentRoll,
        rollRate,
        targetBank,
        config: flightConfig
      })
      elevatorControlForce = calculateKnifeEdgeElevatorForce({
        pitchRate,
        flightMode: forces.flightMode,
        config: flightConfig
      })
      rudderForce = calculateKnifeEdgeRudderForce({
        yawRate,
        config: flightConfig
      })
    } else if (forces.flightMode === 'returning-knife-level') {
      bankForce = calculateKnifeEdgeAileronForce({
        currentRoll,
        rollRate,
        targetBank: 0,
        config: flightConfig
      })
      elevatorControlForce = calculateKnifeEdgeElevatorForce({
        forwardY: forward.y,
        pitchRate,
        flightMode: 'returning-knife-level',
        config: flightConfig
      })
      rudderForce = calculateKnifeEdgeRudderForce({
        yawRate,
        config: flightConfig
      })
    } else if (forces.flightMode === 'normal') {
      bankForce = calculateLevelingAileronForce({
        currentRoll,
        rollRate,
        config: flightConfig
      })
      rudderForce = calculateRudderForce({
        yawCommand: 0,
        yawRate,
        config: flightConfig
      })
      elevatorControlForce = calculateElevatorControlForce({
        altitudeHold: forces.altitudeHold,
        pitchRate,
        pitchAngle: envelope.pitch,
        config: flightConfig
      })
    } else {
      bankForce = calculateAileronForce({
        desiredRoll: forces.boundarySteering.roll * flightConfig.maxBankAngle,
        currentRoll,
        rollRate,
        config: flightConfig
      })
      rudderForce = calculateRudderForce({
        yawCommand: forces.boundarySteering.yaw * -flightConfig.rudderGain,
        yawRate,
        config: flightConfig
      })
      elevatorControlForce = calculateElevatorControlForce({
        altitudeHold: forces.altitudeHold,
        pitchRate,
        pitchAngle: envelope.pitch,
        config: flightConfig
      })
    }
    const leftWingLift = new CANNON.Vec3(
      forces.lift[0] * 0.5 - bodyUp.x * bankForce,
      forces.lift[1] * 0.5 - bodyUp.y * bankForce,
      forces.lift[2] * 0.5 - bodyUp.z * bankForce
    )
    const rightWingLift = new CANNON.Vec3(
      forces.lift[0] * 0.5 + bodyUp.x * bankForce,
      forces.lift[1] * 0.5 + bodyUp.y * bankForce,
      forces.lift[2] * 0.5 + bodyUp.z * bankForce
    )
    const elevatorForce = new CANNON.Vec3(
      bodyUp.x * elevatorControlForce,
      bodyUp.y * elevatorControlForce,
      bodyUp.z * elevatorControlForce
    )
    const thrustForce = new CANNON.Vec3(...forces.thrust)
    const dragForce = new CANNON.Vec3(...forces.drag)
    const gravityForce = new CANNON.Vec3(...forces.gravity)
    const tailForce = new CANNON.Vec3(
      wingRight.x * rudderForce,
      wingRight.y * rudderForce,
      wingRight.z * rudderForce
    )
    const rampForce = (force) => new CANNON.Vec3(force.x * forceRamp, force.y * forceRamp, force.z * forceRamp)
    const appliedThrustForce = rampForce(thrustForce)
    const appliedLeftWingLift = rampForce(leftWingLift)
    const appliedRightWingLift = rampForce(rightWingLift)
    const appliedDragForce = rampForce(dragForce)
    const appliedGravityForce = rampForce(gravityForce)
    const appliedTailForce = rampForce(tailForce)
    const appliedElevatorForce = rampForce(elevatorForce)
    if (!flightCrashed && !envelope.safe) {
      flightCrashed = true
      flightCrashTelemetry = {
        controllerVersion: flightControllerVersion,
        reason: envelope.reason,
        elapsedMs: Math.round(simulationElapsed * 1000),
        envelope,
        position: [planeBody.position.x, planeBody.position.y, planeBody.position.z],
        velocity: [planeBody.velocity.x, planeBody.velocity.y, planeBody.velocity.z],
        angularVelocity: [planeBody.angularVelocity.x, planeBody.angularVelocity.y, planeBody.angularVelocity.z],
        quaternion: [planeBody.quaternion.x, planeBody.quaternion.y, planeBody.quaternion.z, planeBody.quaternion.w],
        boundary: {
          distance: boundaryDistance,
          outside: isOutsideBoundary,
          steering: forces.boundarySteering
        },
        control: {
          yawRate,
          pitchRate,
          rollRate,
          desiredRoll: forces.boundarySteering.roll * cruiseConfig.maxBankAngle,
          aileronForce: bankForce,
          rudderForce,
          elevatorForce: elevatorControlForce
        },
        forces: {
          ramp: forceRamp,
          thrust: [appliedThrustForce.x, appliedThrustForce.y, appliedThrustForce.z],
          leftWing: [appliedLeftWingLift.x, appliedLeftWingLift.y, appliedLeftWingLift.z],
          rightWing: [appliedRightWingLift.x, appliedRightWingLift.y, appliedRightWingLift.z],
          drag: [appliedDragForce.x, appliedDragForce.y, appliedDragForce.z],
          gravity: [appliedGravityForce.x, appliedGravityForce.y, appliedGravityForce.z],
          rudder: [appliedTailForce.x, appliedTailForce.y, appliedTailForce.z],
          elevator: [appliedElevatorForce.x, appliedElevatorForce.y, appliedElevatorForce.z]
        }
      }
      window.__SUNSET_FLIGHT_CRASH__ = JSON.stringify(formatTelemetry(flightCrashTelemetry))
      console.warn('[DEBUG-sunset-flight-crash]', window.__SUNSET_FLIGHT_CRASH__)
    }
    if (!flightCrashed) {
      planeBody.applyForce(appliedThrustForce, engineOffset)
      planeBody.applyForce(appliedLeftWingLift, leftWingOffset)
      planeBody.applyForce(appliedRightWingLift, rightWingOffset)
      planeBody.applyForce(appliedDragForce, new CANNON.Vec3())
      planeBody.applyForce(appliedGravityForce, new CANNON.Vec3())
      planeBody.applyForce(appliedTailForce, tailOffset)
      planeBody.applyForce(appliedElevatorForce, tailOffset)
    }
    if (sandbox) {
      const format = (value) => value.toFixed(2)
      flightDebugState.status = flightCrashed ? `crashed: ${flightCrashTelemetry.reason}` : 'flying'
      flightDebugState.strategy = flightSettings.returnStrategy
      flightDebugState.mode = forces.flightMode
      flightDebugState.position = `${format(planeBody.position.x)}, ${format(planeBody.position.y)}, ${format(planeBody.position.z)}`
      flightDebugState.velocity = `${format(planeBody.velocity.x)}, ${format(planeBody.velocity.y)}, ${format(planeBody.velocity.z)}`
      flightDebugState.angularVelocity = `${format(planeBody.angularVelocity.x)}, ${format(planeBody.angularVelocity.y)}, ${format(planeBody.angularVelocity.z)}`
      flightDebugState.airspeed = format(forces.airspeed)
      flightDebugState.angleOfAttack = `${(forces.angleOfAttack * 180 / Math.PI).toFixed(1)}°`
      flightDebugState.thrust = format(forces.thrustMagnitude)
      flightDebugState.lift = format(forces.lift[1])
      flightDebugState.drag = format(Math.hypot(...forces.drag))
      flightDebugState.netVerticalForce = format(forces.net[1])
      flightDebugState.altitudeCorrection = format(forces.altitudeHold)
      flightDebugState.boundaryCorrection = format(Math.abs(forces.boundarySteering.yaw))
      flightDebugState.forceRamp = format(forceRamp)
      flightDebugState.engineForce = format(appliedThrustForce.length())
      flightDebugState.leftWingForce = format(appliedLeftWingLift.length())
      flightDebugState.rightWingForce = format(appliedRightWingLift.length())
      flightDebugState.rudderForce = format(appliedTailForce.length())
      flightDebugState.elevatorForce = format(appliedElevatorForce.length())
    }
    if (!flightCrashed) {
      stepCannonRopes(cannonRopes, planeBody.position, planeBody.quaternion)
      updateRigidChainLeader(letterChain, letterTailPoint, planeBody.quaternion, planeBody.velocity)
      stepRigidChain(letterChain, fixedPhysicsStep, { forceRamp })
      physicsWorld.step(fixedPhysicsStep)
      simulationElapsed += fixedPhysicsStep
    }

    syncRigidChainVisuals(letterChain, letterVisuals.visuals, {
      headingQuaternion: planeBody.quaternion
    })
    syncRigidChainChords(letterChain, letterVisuals.chords, {
      anchor: letterTailPoint,
      anchorSegments: 3
    })

    // Update visual streamer lines
    for (let r = 0; r < cannonRopes.ropes.length; r += 1) {
      const posAttr = streamerLines[r].geometry.attributes.position
      const bodies = cannonRopes.ropes[r].bodies
      for (let p = 0; p < bodies.length; p += 1) {
        posAttr.setXYZ(p, bodies[p].position.x, bodies[p].position.y, bodies[p].position.z)
      }
      posAttr.needsUpdate = true
    }
    streamerGroup.visible = true

    // Render the vectors from the same post-step body pose as the wireframe.
    // Previously the arrows used the pre-step pose while the body used the
    // post-step pose, producing a fast A/B double image at force points.
    const renderedEngineOffset = planeBody.quaternion.vmult(new CANNON.Vec3(0, 0, 0))
    const renderedLeftWingOffset = planeBody.quaternion.vmult(new CANNON.Vec3(-0.75, 0, 0))
    const renderedRightWingOffset = planeBody.quaternion.vmult(new CANNON.Vec3(0.75, 0, 0))
    const renderedTailOffset = planeBody.quaternion.vmult(new CANNON.Vec3(0, 0, -0.9))
    updateForceVector('thrust', planeBody.position.vadd(renderedEngineOffset), appliedThrustForce)
    updateForceVector('leftLift', planeBody.position.vadd(renderedLeftWingOffset), appliedLeftWingLift)
    updateForceVector('rightLift', planeBody.position.vadd(renderedRightWingOffset), appliedRightWingLift)
    updateForceVector('drag', planeBody.position, appliedDragForce)
    updateForceVector('gravity', planeBody.position, appliedGravityForce)
    updateForceVector('rudder', planeBody.position.vadd(renderedTailOffset), appliedTailForce)
    updateForceVector('elevator', planeBody.position.vadd(renderedTailOffset), appliedElevatorForce)
    planeFlightGroup.position.set(planeBody.position.x, planeBody.position.y, planeBody.position.z)
    planeFlightGroup.quaternion.set(planeBody.quaternion.x, planeBody.quaternion.y, planeBody.quaternion.z, planeBody.quaternion.w)
    if (cameraDebugState.mode === 'Third person') {
      planeGroup.updateWorldMatrix(true, false)
      thirdPersonInverseMatrix.copy(thirdPersonPreviousMatrix).invert()
      thirdPersonDeltaMatrix.copy(planeGroup.matrixWorld).multiply(thirdPersonInverseMatrix)
      camera.position.applyMatrix4(thirdPersonDeltaMatrix)
      controls.target.applyMatrix4(thirdPersonDeltaMatrix)
      thirdPersonPreviousMatrix.copy(planeGroup.matrixWorld)
    }
    controls.update()
    composer.render()
    renderer.setClearAlpha(0)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
  }
}
