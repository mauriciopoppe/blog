import * as THREE from 'https://esm.sh/three@0.165.0'
import { OrbitControls } from 'https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js'
import { createSpacecraftMesh } from './spacecraft-mesh.js'

export const SLERP_PRESETS = {
  gimbal_lock: {
    id: 'gimbal_lock',
    title: 'Gimbal Lock Flip (Pitch 90°)',
    description: 'Orienting to Pitch $90^\\circ$: Euler LERP locks yaw and roll into the same degree of freedom, causing erratic spinning and non-planar drift. Quaternion SLERP rotates along the shortest geodesic arc around invariant axis $\\hat{\\mathbf{n}}$ at constant angular speed.',
    startEuler: [0, 0, 0], // pitch, yaw, roll in radians
    endEuler: [Math.PI / 2 - 0.01, Math.PI / 2, Math.PI / 2],
    startQuat: [1, 0, 0, 0],
    endQuat: null // computed from endEuler
  },
  aerobatic_flip: {
    id: 'aerobatic_flip',
    title: 'Aerobatic Immelmann Flip',
    description: 'A combined $180^\\circ$ pitch climb and $180^\\circ$ roll inversion. Euler interpolation independently decouples all three axes, producing an erratic non-planar trajectory with no single rotation plane. SLERP finds the unique invariant 3D axis $\\hat{\\mathbf{n}}$ and rotates purely in a planar disc at constant speed.',
    startEuler: [0, 0, 0],
    endEuler: [Math.PI * 0.85, 0, Math.PI * 0.95],
    startQuat: [1, 0, 0, 0],
    endQuat: null
  },
  diagonal_turn: {
    id: 'diagonal_turn',
    title: 'Diagonal Banked Turn',
    description: 'Coordinated $90^\\circ$ yaw turn with a $45^\\circ$ inward bank. Euler angle interpolation wobbles across shifting axes, while Quaternion SLERP maintains a planar great-circle geodesic around invariant axis $\\hat{\\mathbf{n}}$.',
    startEuler: [0, 0, 0],
    endEuler: [0.35, 1.57, -0.78],
    startQuat: [1, 0, 0, 0],
    endQuat: null
  }
}

// Pure Quaternion Math Helper Functions
export function normalizeQuaternion(q) {
  const len = Math.hypot(q[0], q[1], q[2], q[3])
  if (len < 1e-9) return [1, 0, 0, 0]
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len]
}

export function quaternionDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
}

export function quaternionFromEuler(pitch, yaw, roll) {
  // XYZ intrinsic Euler rotation
  const c1 = Math.cos(pitch / 2)
  const s1 = Math.sin(pitch / 2)
  const c2 = Math.cos(yaw / 2)
  const s2 = Math.sin(yaw / 2)
  const c3 = Math.cos(roll / 2)
  const s3 = Math.sin(roll / 2)

  const w = c1 * c2 * c3 - s1 * s2 * s3
  const x = s1 * c2 * c3 + c1 * s2 * s3
  const y = c1 * s2 * c3 - s1 * c2 * s3
  const z = c1 * c2 * s3 + s1 * s2 * c3

  return normalizeQuaternion([w, x, y, z])
}

export function quaternionToEuler(q) {
  // Returns [pitch, yaw, roll]
  const [w, x, y, z] = q
  const sinr_cosp = 2 * (w * x + y * z)
  const cosr_cosp = 1 - 2 * (x * x + y * y)
  const pitch = Math.atan2(sinr_cosp, cosr_cosp)

  const sinp = 2 * (w * y - z * x)
  let yaw = 0
  if (Math.abs(sinp) >= 1) {
    yaw = Math.sign(sinp) * (Math.PI / 2)
  } else {
    yaw = Math.asin(sinp)
  }

  const siny_cosp = 2 * (w * z + x * y)
  const cosy_cosp = 1 - 2 * (y * y + z * z)
  const roll = Math.atan2(siny_cosp, cosy_cosp)

  return [pitch, yaw, roll]
}

export function quaternionSlerp(q1, q2, t) {
  let [w1, x1, y1, z1] = normalizeQuaternion(q1)
  let [w2, x2, y2, z2] = normalizeQuaternion(q2)

  let dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2

  // Take the shortest path on the 3-sphere (antipodal identification: q == -q)
  if (dot < 0) {
    w2 = -w2
    x2 = -x2
    y2 = -y2
    z2 = -z2
    dot = -dot
  }

  // If quaternions are extremely close, linearly interpolate (LERP)
  if (dot > 0.9995) {
    const w = w1 + t * (w2 - w1)
    const x = x1 + t * (x2 - x1)
    const y = y1 + t * (y2 - y1)
    const z = z1 + t * (z2 - z1)
    return normalizeQuaternion([w, x, y, z])
  }

  const theta0 = Math.acos(Math.min(Math.max(dot, -1), 1))
  const theta = theta0 * t
  const sinTheta = Math.sin(theta)
  const sinTheta0 = Math.sin(theta0)

  const s1 = Math.cos(theta) - (dot * sinTheta) / sinTheta0
  const s2 = sinTheta / sinTheta0

  const w = s1 * w1 + s2 * w2
  const x = s1 * x1 + s2 * x2
  const y = s1 * y1 + s2 * y2
  const z = s1 * z1 + s2 * z2

  return normalizeQuaternion([w, x, y, z])
}

export function eulerLerp(e1, e2, t) {
  const pitch = e1[0] + t * (e2[0] - e1[0])
  const yaw = e1[1] + t * (e2[1] - e1[1])
  const roll = e1[2] + t * (e2[2] - e1[2])
  return quaternionFromEuler(pitch, yaw, roll)
}

export function getAxisAngle(q) {
  const [w, x, y, z] = normalizeQuaternion(q)
  const clampedW = Math.min(Math.max(w, -1), 1)
  const angle = 2 * Math.acos(clampedW)
  const s = Math.sqrt(Math.max(0, 1 - clampedW * clampedW))
  if (s < 1e-6) {
    return { axis: [1, 0, 0], angle: 0 }
  }
  return {
    axis: [x / s, y / s, z / s],
    angle
  }
}

export function computeAngularDistance(q1, q2) {
  const dot = Math.abs(quaternionDot(normalizeQuaternion(q1), normalizeQuaternion(q2)))
  const clamped = Math.min(Math.max(dot, -1), 1)
  return 2 * Math.acos(clamped)
}

function createTextSprite(text, colorHex, fontSize = 36) {
  if (typeof document === 'undefined') return new THREE.Object3D()

  // First pass: accurately measure text width with matching typography
  const tempCanvas = document.createElement('canvas')
  const tempCtx = tempCanvas.getContext('2d')
  const fontStyle = `bold ${fontSize}px "KaTeX_Math", "KaTeX_Main", "Times New Roman", -apple-system, system-ui, sans-serif`
  tempCtx.font = fontStyle

  const metrics = tempCtx.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const paddingX = 24
  const paddingY = 16

  const canvasWidth = Math.max(textWidth + paddingX * 2, 128)
  const canvasHeight = Math.max(fontSize * 2 + paddingY * 2, 64)

  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasHeight
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.font = fontStyle
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  ctx.shadowColor = 'rgba(0, 0, 0, 0.95)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 2

  ctx.fillStyle = typeof colorHex === 'number' ? '#' + colorHex.toString(16).padStart(6, '0') : colorHex
  ctx.fillText(text, canvas.width / 2, canvas.height / 2)

  const texture = new THREE.CanvasTexture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.generateMipmaps = false

  const mat = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false
  })

  const sprite = new THREE.Sprite(mat)
  // Scale proportional to aspect ratio so text never stretches or clips
  const worldHeight = 0.26
  const worldWidth = (canvasWidth / canvasHeight) * worldHeight
  sprite.scale.set(worldWidth, worldHeight, 1)
  sprite.renderOrder = 999
  return sprite
}

export function quaternionDifference(q1, q2) {
  const [w1, x1, y1, z1] = normalizeQuaternion(q1)
  const [w2, x2, y2, z2] = normalizeQuaternion(q2)
  const invW1 = w1
  const invX1 = -x1
  const invY1 = -y1
  const invZ1 = -z1

  const w = w2 * invW1 - x2 * invX1 - y2 * invY1 - z2 * invZ1
  const x = w2 * invX1 + x2 * invW1 + y2 * invZ1 - z2 * invY1
  const y = w2 * invY1 - x2 * invZ1 + y2 * invW1 + z2 * invX1
  const z = w2 * invZ1 + x2 * invY1 - y2 * invX1 + z2 * invW1
  return normalizeQuaternion([w, x, y, z])
}

export class QuaternionSlerpEngine {
  constructor(container) {
    this.container = container
    this.listeners = new Map()
    this.isDisposed = false
    this.loopActive = true

    // State
    this.activePresetKey = 'gimbal_lock'
    this.mode = 'slerp' // 'slerp' | 'euler'
    this.progress = 0 // 0 to 1
    this.isPlaying = false
    this.speed = 0.35 // cycles per second
    this.lastTime = performance.now()

    // Active orientation data
    this.q1 = [1, 0, 0, 0]
    this.q2 = [1, 0, 0, 0]
    this.e1 = [0, 0, 0]
    this.e2 = [0, 0, 0]

    this.initScene()
    this.applyPreset(this.activePresetKey)
    this.startLoop()
  }

  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, [])
    this.listeners.get(event).push(cb)
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(cb => cb(data))
    }
  }

  initScene() {
    const width = this.container.clientWidth || 600
    const height = this.container.clientHeight || 420

    this.scene = new THREE.Scene()
    this.scene.background = null

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    this.camera.position.set(3.4, 2.4, 4.4)

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setClearColor(0x000000, 0)
    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 2.0
    this.controls.maxDistance = 10.0
    this.controls.target.set(0, 0.2, 0)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4)
    dirLight.position.set(5, 8, 5)
    this.scene.add(dirLight)

    const backLight = new THREE.DirectionalLight(0x88bbff, 0.6)
    backLight.position.set(-5, -3, -5)
    this.scene.add(backLight)

    // Ground Grid
    const grid = new THREE.GridHelper(8, 16, 0x445566, 0x222a33)
    grid.position.y = -1.2
    this.scene.add(grid)

    // Orientation Sphere
    const sphereGeo = new THREE.SphereGeometry(1.6, 24, 16)
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0x334455,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    })
    this.sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
    this.scene.add(this.sphereMesh)

    // Spacecraft Models
    this.craft = createSpacecraftMesh(false)
    this.scene.add(this.craft)

    this.ghostStart = createSpacecraftMesh(true)
    this.scene.add(this.ghostStart)

    this.ghostEnd = createSpacecraftMesh(true)
    this.scene.add(this.ghostEnd)

    // Rotation Axis Arrow
    this.axisArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2.2, 0xffbb33, 0.2, 0.1)
    this.scene.add(this.axisArrow)

    // Rotation Plane Disc perpendicular to n_hat
    const discGeo = new THREE.CircleGeometry(1.6, 48)
    const discMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    this.rotationDisc = new THREE.Mesh(discGeo, discMat)
    this.scene.add(this.rotationDisc)

    // Disc perimeter ring
    const ringGeo = new THREE.RingGeometry(1.58, 1.6, 48)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    this.rotationRing = new THREE.Mesh(ringGeo, ringMat)
    this.scene.add(this.rotationRing)

    // Trajectory Path Line (drawn along orientation sphere at R = 1.6)
    this.trajectoryGeo = new THREE.BufferGeometry()
    this.trajectoryMat = new THREE.LineBasicMaterial({ color: 0x34d399, linewidth: 2 })
    this.trajectoryLine = new THREE.Line(this.trajectoryGeo, this.trajectoryMat)
    this.scene.add(this.trajectoryLine)

    // Tether Guide Line between tip of Z arrow and current trajectory arc point
    this.tetherGeo = new THREE.BufferGeometry()
    this.tetherMat = new THREE.LineDashedMaterial({
      color: 0x60a5fa,
      dashSize: 0.05,
      gapSize: 0.03,
      transparent: true,
      opacity: 0.85
    })
    this.tetherLine = new THREE.Line(this.tetherGeo, this.tetherMat)
    this.scene.add(this.tetherLine)

    // Current Trajectory Arc Point Dot
    const arcDotGeo = new THREE.SphereGeometry(0.045, 12, 12)
    const arcDotMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa })
    this.arcPointMesh = new THREE.Mesh(arcDotGeo, arcDotMat)
    this.scene.add(this.arcPointMesh)

    // 3D Text Mesh Sprites
    this.labelQ1 = createTextSprite('q₁ (Start)', 0x93c5fd, 36)
    this.scene.add(this.labelQ1)

    this.labelQ2 = createTextSprite('q₂ (Target)', 0xf472b6, 36)
    this.scene.add(this.labelQ2)

    this.labelNormal = createTextSprite('n̂ (Rotation Axis)', 0xfbbf24, 38)
    this.scene.add(this.labelNormal)

    this.labelCurrent = createTextSprite('q(t)', 0x34d399, 42)
    this.scene.add(this.labelCurrent)

    // Resize Handler
    this.resizeObserver = new ResizeObserver(() => this.scheduleResize())
    this.resizeObserver.observe(this.container)
  }

  scheduleResize() {
    if (this.resizeRaf) return
    this.resizeRaf = requestAnimationFrame(() => {
      this.resizeRaf = null
      this.handleResize()
    })
  }

  handleResize() {
    if (this.isDisposed || !this.renderer) return
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    if (width === 0 || height === 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  applyPreset(key) {
    const preset = SLERP_PRESETS[key]
    if (!preset) return
    this.activePresetKey = key

    this.e1 = [...preset.startEuler]
    this.e2 = [...preset.endEuler]
    this.q1 = quaternionFromEuler(this.e1[0], this.e1[1], this.e1[2])
    this.q2 = quaternionFromEuler(this.e2[0], this.e2[1], this.e2[2])

    // Update Ghost Start & End Meshes
    const qThreeStart = new THREE.Quaternion(this.q1[1], this.q1[2], this.q1[3], this.q1[0])
    const qThreeEnd = new THREE.Quaternion(this.q2[1], this.q2[2], this.q2[3], this.q2[0])
    this.ghostStart.setRotationFromQuaternion(qThreeStart)
    this.ghostEnd.setRotationFromQuaternion(qThreeEnd)

    // Compute the true 3D rigid body rotation axis deltaQ = q2 * q1^*
    const deltaQ = quaternionDifference(this.q1, this.q2)
    const { axis } = getAxisAngle(deltaQ)

    let normal = new THREE.Vector3(axis[0], axis[1], axis[2])
    if (normal.lengthSq() < 1e-6) {
      normal.set(0, 1, 0)
    } else {
      normal.normalize()
    }

    this.axisArrow.setDirection(normal)

    // Align the Rotation Disc and Ring to be strictly perpendicular to normal
    const discQuat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    this.rotationDisc.quaternion.copy(discQuat)
    this.rotationRing.quaternion.copy(discQuat)

    const isSlerp = this.mode === 'slerp'
    this.axisArrow.visible = isSlerp
    this.rotationDisc.visible = isSlerp
    this.rotationRing.visible = isSlerp
    this.labelNormal.visible = isSlerp

    // Position 3D Text Sprites for Start, End, and Normal
    const p1 = new THREE.Vector3(0, 0, -1.85).applyQuaternion(qThreeStart)
    this.labelQ1.position.copy(p1)

    const p2 = new THREE.Vector3(0, 0, -1.85).applyQuaternion(qThreeEnd)
    this.labelQ2.position.copy(p2)

    this.labelNormal.position.copy(normal.clone().multiplyScalar(2.45))

    this.rebuildTrajectory()
    this.setProgress(0)
  }

  setMode(mode) {
    if (mode !== 'slerp' && mode !== 'euler') return
    this.mode = mode

    const isSlerp = mode === 'slerp'
    this.axisArrow.visible = isSlerp
    this.rotationDisc.visible = isSlerp
    this.rotationRing.visible = isSlerp
    this.labelNormal.visible = isSlerp

    this.rebuildTrajectory()
    this.updateCraftOrientation()
    this.emitState()
  }

  setProgress(t) {
    this.progress = Math.min(Math.max(t, 0), 1)
    this.updateCraftOrientation()
    this.emitState()
  }

  rebuildTrajectory() {
    const points = []
    const arcRadius = 1.6
    const forwardVec = new THREE.Vector3(0, 0, -arcRadius)
    const steps = 80

    for (let i = 0; i <= steps; i++) {
      const t = i / steps
      let qCurrent
      if (this.mode === 'slerp') {
        qCurrent = quaternionSlerp(this.q1, this.q2, t)
      } else {
        qCurrent = eulerLerp(this.e1, this.e2, t)
      }
      const qThree = new THREE.Quaternion(qCurrent[1], qCurrent[2], qCurrent[3], qCurrent[0])
      const p = forwardVec.clone().applyQuaternion(qThree)
      points.push(p)
    }

    this.trajectoryGeo.setFromPoints(points)

    if (this.mode === 'slerp') {
      this.trajectoryMat.color.setHex(0x34d399) // Emerald for SLERP
    } else {
      this.trajectoryMat.color.setHex(0xff7043) // Coral/Orange for Euler LERP
    }
  }

  updateCraftOrientation() {
    let currentQ
    if (this.mode === 'slerp') {
      currentQ = quaternionSlerp(this.q1, this.q2, this.progress)
    } else {
      currentQ = eulerLerp(this.e1, this.e2, this.progress)
    }

    const qThree = new THREE.Quaternion(currentQ[1], currentQ[2], currentQ[3], currentQ[0])
    this.craft.setRotationFromQuaternion(qThree)
    this.currentQ = currentQ

    // Tether line from tip of Z (local (0, 0, -0.85)) to trajectory arc point on sphere (local (0, 0, -1.6))
    const tipZWorld = new THREE.Vector3(0, 0, -0.85).applyQuaternion(qThree)
    const arcPointWorld = new THREE.Vector3(0, 0, -1.6).applyQuaternion(qThree)

    this.tetherGeo.setFromPoints([tipZWorld, arcPointWorld])
    if (this.tetherLine.computeLineDistances) this.tetherLine.computeLineDistances()

    if (this.arcPointMesh) {
      this.arcPointMesh.position.copy(arcPointWorld)
    }

    // Position current orientation label
    const pCurrent = new THREE.Vector3(0, 0.22, -1.85).applyQuaternion(qThree)
    this.labelCurrent.position.copy(pCurrent)
    this.labelCurrent.visible = this.progress > 0.05 && this.progress < 0.95
  }

  startLoop() {
    if (this.isDisposed || !this.loopActive) return
    const loop = (time) => {
      if (this.isDisposed || !this.loopActive) return
      requestAnimationFrame(loop)

      const dt = (time - this.lastTime) / 1000
      this.lastTime = time

      if (this.isPlaying) {
        let nextP = this.progress + dt * this.speed
        if (nextP >= 1) {
          nextP = 0
        }
        this.setProgress(nextP)
      }

      this.controls.update()
      this.renderer.render(this.scene, this.camera)
    }
    requestAnimationFrame(loop)
  }

  resumeLoop() {
    if (this.isDisposed || this.loopActive) return
    this.loopActive = true
    this.lastTime = performance.now()
    this.startLoop()
  }

  pauseLoop() {
    this.loopActive = false
  }

  emitState() {
    const currentQ = this.currentQ || this.q1
    const { axis, angle } = getAxisAngle(currentQ)
    const angularDist = computeAngularDistance(this.q1, this.q2)
    const euler = quaternionToEuler(currentQ)

    this.emit('update', {
      presetKey: this.activePresetKey,
      mode: this.mode,
      progress: this.progress,
      isPlaying: this.isPlaying,
      quaternion: currentQ,
      euler,
      axis,
      angle,
      totalAngularDistance: angularDist
    })
  }

  play() {
    this.isPlaying = true
    this.emit('playState', true)
  }

  pause() {
    this.isPlaying = false
    this.emit('playState', false)
  }

  togglePlay() {
    if (this.isPlaying) this.pause()
    else this.play()
  }

  dispose() {
    this.isDisposed = true
    this.loopActive = false
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf)
    if (this.resizeObserver) this.resizeObserver.disconnect()
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove()
      this.renderer.dispose()
    }
  }
}
