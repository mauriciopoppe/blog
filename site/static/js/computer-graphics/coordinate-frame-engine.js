import * as THREE from 'https://esm.sh/three@0.165.0'
import { OrbitControls } from 'https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js'
import { createCameraMesh } from './camera-mesh.js'

export const FRAME_PRESETS = {
  default_camera: {
    id: 'default_camera',
    title: 'General 3D Camera',
    description: 'General 3D Camera ($\\mathbf{R}^T \\mathbf{T}_{-\\mathbf{e}}$): Camera at $\\mathbf{e} = (2.0, 1.5, 3.0)$ pitched and yawed looking toward $\\mathbf{p}$. Translates by $-\\mathbf{e}$ then rotates by $\\mathbf{R}^T$ to align with the canonical origin.',
    eye: [2.0, 1.5, 3.0],
    target: [0.5, 0.8, -0.5],
    pointLocal: [-0.3, 0.2, -3.2] // Point expressed in local (u,v,w) space in front of camera (-w)
  },
  top_down: {
    id: 'top_down',
    title: 'Top-Down Camera',
    description: 'Top-Down Camera: The camera hovers above at $\\mathbf{e} = (0.6, 4.8, 0.6)$ looking straight down at the origin. Step 1 ($\\mathbf{T}_{-\\mathbf{e}}$) drops the eye onto the origin, and Step 2 ($\\mathbf{R}^T$) swings the world through $90^\\circ$ to align the camera with the canonical axes.',
    eye: [0.6, 4.8, 0.6],
    target: [0.6, 0.0, 0.6],
    pointLocal: [0.3, 0.1, -2.2]
  },
  pure_offset: {
    id: 'pure_offset',
    title: 'Pure Translation',
    description: 'Pure Translation ($\\mathbf{R} = \\mathbf{I}$): Camera axes $(u,v,w)$ are already parallel to $(x,y,z)$. Step 1 ($\\mathbf{T}_{-\\mathbf{e}}$) performs the entire transform, while Step 2 ($\\mathbf{R}^T$) is an identity no-op.',
    eye: [2.2, 1.4, 1.8],
    target: [2.2, 1.4, -1.8],
    pointLocal: [-0.4, 0.3, -2.8]
  }
}

export function createBasisMatrix(u, v, w, e) {
  // Returns a 4x4 column-major matrix array [m00, m10, m20, 0, m01, m11, ...]
  // Mat: [ u.x  v.x  w.x  e.x ]
  //      [ u.y  v.y  w.y  e.y ]
  //      [ u.z  v.z  w.z  e.z ]
  //      [  0    0    0    1  ]
  const m = new THREE.Matrix4()
  m.set(
    u.x, v.x, w.x, e.x,
    u.y, v.y, w.y, e.y,
    u.z, v.z, w.z, e.z,
    0,   0,   0,   1
  )
  return m
}

export function computeViewMatrix(u, v, w, e) {
  // Inverse of Frame Matrix: R^T * T_{-e}
  const m = createBasisMatrix(u, v, w, e)
  const inv = new THREE.Matrix4()
  inv.copy(m).invert()
  return inv
}

export class CoordinateFrameEngine {
  constructor(container) {
    this.container = container
    this.listeners = new Map()
    this.isDisposed = false

    // State
    this.activePresetKey = 'default_camera'
    this.currentStepIndex = 0 // 0: World Rest, 1: Translated by -e, 2: Rotated by R^T (Full View Space)
    this.targetStepIndex = 0
    this.animationProgress = 0
    this.isPlaying = false
    this.viewMode = 'third-person' // 'third-person' | 'camera-view'
    this.animDuration = 1200 // ms per step
    this.digestTimer = null
    // The camera apparatus (body, frustum, PiP view) reveals only once the
    // chain rests in canonical view space (both steps applied), easing in
    // together instead of popping.
    this.restReveal = 0
    this.restRevealTarget = 0
    // Brief scale pulse on the target octahedron when the chain completes,
    // pointing the eye at the point that kept its (u,v,w) coordinates.
    this.targetPulse = 0

    // Frame parameters
    this.eye = new THREE.Vector3(2.0, 1.5, 3.0)
    this.target = new THREE.Vector3(0.5, 0.8, -0.5)
    this.u = new THREE.Vector3(1, 0, 0)
    this.v = new THREE.Vector3(0, 1, 0)
    this.w = new THREE.Vector3(0, 0, 1)
    this.pointWorld = new THREE.Vector3(0.5, 0.8, -0.5)
    this.pointLocal = new THREE.Vector3(-0.5, 0.4, -3.2)

    this.initScene()
    this.applyPreset(this.activePresetKey, false)
    this.startLoop()
  }

  on(event, cb) {
    if (!this.listeners.has(event)) this.listeners.set(event, [])
    this.listeners.get(event).push(cb)
  }

  emit(event, data) {
    const cbs = this.listeners.get(event) || []
    cbs.forEach(cb => {
      try { cb(data) } catch (e) { console.error('Listener err:', e) }
    })
  }

  initScene() {
    this.scene = new THREE.Scene()

    const width = this.container.clientWidth || 640
    const height = this.container.clientHeight || 420

    // Third-person Orbit Camera - Zoomed out comfortably to show both frames and all axes
    this.orbitCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    this.orbitCamera.position.set(9.5, 7.5, 11.5)

    // In-scene Camera Frame (u, v, w) with CameraHelper wireframe (matching projection-transform)
    this.inSceneCamera = new THREE.PerspectiveCamera(50, width / height, 0.4, 4.5)
    this.cameraHelper = new THREE.CameraHelper(this.inSceneCamera)
    this.cameraHelper.material.opacity = 0
    this.cameraHelper.material.transparent = true
    this.scene.add(this.cameraHelper)

    // Active Camera Pointer
    this.activeCamera = this.orbitCamera

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setClearColor(0x000000, 0)
    this.container.appendChild(this.renderer.domElement)

    // Picture-in-Picture container for the nested camera viewport.
    this.pipContainer = document.createElement('div')
    this.pipContainer.className = 'coord-pip-container tw-absolute tw-bottom-2.5 tw-right-2.5 tw-rounded-md tw-overflow-hidden tw-bg-[var(--grey-dark)] tw-pointer-events-none tw-z-[3]'
    this.pipContainer.style.cssText = `
      width: 100px;
      height: 100px;
      opacity: 0;
      display: none;
    `

    this.pipCanvas = document.createElement('canvas')
    this.pipCanvas.style.cssText = 'width: 100%; height: 100%; display: block;'
    this.pipContainer.appendChild(this.pipCanvas)

    this.pipRenderer = new THREE.WebGLRenderer({
      canvas: this.pipCanvas,
      antialias: true,
      alpha: false
    })
    this.pipRenderer.setSize(100, 100, false)
    this.pipRenderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.pipRenderer.setClearColor(this.getCssColor('--grey-dark', 0x0d0d10), 1)

    this.pipLabel = document.createElement('div')
    this.pipLabel.className = 'coord-pip-label'
    this.pipLabel.style.cssText = `
      position: absolute;
      bottom: 2px;
      left: 0;
      right: 0;
      text-align: center;
      font-family: var(--family-sans, system-ui, sans-serif);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.04em;
      color: rgb(var(--primary));
      pointer-events: none;
      z-index: 4;
      white-space: nowrap;
      line-height: 1.1;
      text-shadow: 0 1px 2px rgba(0,0,0,0.85);
    `
    this.pipLabel.textContent = 'Nested (u,v,w) view'
    this.pipContainer.appendChild(this.pipLabel)
    this.container.appendChild(this.pipContainer)

    // Orbit Controls
    this.controls = new OrbitControls(this.orbitCamera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.target.set(1.0, 0.8, 0.5)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(6, 12, 8)
    this.scene.add(dirLight)

    // Canonical Root (Fixed — never transforms: grid, world axes, origin label, guideline)
    this.canonicalRoot = new THREE.Group()
    this.scene.add(this.canonicalRoot)

    // Two-level transform hierarchy implementing M_view = R^T · T_{-e}:
    //   translateRoot: handles Step 1 — T_{-e} (pure position offset, no rotation)
    //   rotateRoot:    handles Step 2 — R^T  (pure rotation around the translated origin)
    //
    // nestedFrameGroup and targetPointGroup sit inside rotateRoot at their
    // initial world-space local positions (eye and pointWorld respectively).
    // When translateRoot.position = -eye and rotateRoot.quaternion = identity:
    //   camera world = -eye + eye = (0,0,0)  ← T_{-e} complete, no spurious rotation.
    // When rotateRoot.quaternion = R^T:
    //   camera world = R^T * (-eye + eye) = R^T * 0 = (0,0,0)  ← stays at origin.
    this.rotateRoot = new THREE.Group()
    this.scene.add(this.rotateRoot)

    this.translateRoot = new THREE.Group()
    this.rotateRoot.add(this.translateRoot)

    // Nested Frame Group (Camera Object + Basis Vectors u, v, w)
    this.nestedFrameGroup = new THREE.Group()
    this.translateRoot.add(this.nestedFrameGroup)

    // Target Point Group (Wireframe Octahedron p + Orbiting Satellite)
    this.targetPointGroup = new THREE.Group()
    this.translateRoot.add(this.targetPointGroup)

    this.buildWorldGridAndAxes()
    this.buildNestedFrameAndCamera()
    this.buildTargetPointObject()

    // Handle Resize
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

  createAxisLabel(text, colorHex, pos, scale = 1.0) {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.fillStyle = colorHex
      ctx.font = 'bold 56px monospace, sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, 256, 64)
    }
    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: false })
    const sprite = new THREE.Sprite(material)
    sprite.position.copy(pos)
    const baseW = 1.4 * scale
    const baseH = 0.35 * scale
    sprite.scale.set(baseW, baseH, 1)
    sprite.renderOrder = 999
    return sprite
  }

  getCssColor(varName, fallbackHex) {
    if (typeof window === 'undefined') return fallbackHex
    const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    if (!val) return fallbackHex
    if (val.startsWith('#')) return parseInt(val.slice(1), 16)
    if (val.startsWith('rgb')) {
      const matches = val.match(/\d+/g)
      if (matches && matches.length >= 3) {
        return (parseInt(matches[0]) << 16) + (parseInt(matches[1]) << 8) + parseInt(matches[2])
      }
    }
    return fallbackHex
  }

  buildWorldGridAndAxes() {
    // Canonical Ground Grid (Stationary)
    const grid = new THREE.GridHelper(10, 20, 0x444444, 0x27272a)
    grid.position.y = 0
    this.canonicalRoot.add(grid)

    // World Axes Lines (Stationary)
    const axisMatX = new THREE.LineBasicMaterial({ color: 0xef4444, linewidth: 2 })
    const axisMatY = new THREE.LineBasicMaterial({ color: 0x22c55e, linewidth: 2 })
    const axisMatZ = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 })

    const geomX = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(4.2, 0, 0)])
    const geomY = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 4.2, 0)])
    const geomZ = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 4.2)])

    this.canonicalRoot.add(new THREE.Line(geomX, axisMatX))
    this.canonicalRoot.add(new THREE.Line(geomY, axisMatY))
    this.canonicalRoot.add(new THREE.Line(geomZ, axisMatZ))

    // World Labels (Stationary at Canonical Origin)
    this.labelX = this.createAxisLabel('+x', '#ef4444', new THREE.Vector3(4.6, 0, 0), 0.9)
    this.labelY = this.createAxisLabel('+y', '#22c55e', new THREE.Vector3(0, 4.6, 0), 0.9)
    this.labelZ = this.createAxisLabel('+z', '#38bdf8', new THREE.Vector3(0, 0, 4.6), 0.9)
    this.originLabel = this.createAxisLabel('Origin (0,0,0)', '#94a3b8', new THREE.Vector3(-0.55, -0.2, -0.35), 1.3)
    this.canonicalRoot.add(this.labelX)
    this.canonicalRoot.add(this.labelY)
    this.canonicalRoot.add(this.labelZ)
    this.canonicalRoot.add(this.originLabel)
  }

  buildNestedFrameAndCamera() {
    // In-scene Camera attached to nestedFrameGroup
    this.nestedFrameGroup.add(this.inSceneCamera)

    // Nested frame grid in the (u, w) plane, moving with the camera frame.
    // It lands on the canonical xz grid once the transform completes.
    this.uwGrid = new THREE.GridHelper(4, 8, 0x6b5f8a, 0x403a54)
    this.uwGrid.material.opacity = 0.55
    this.uwGrid.material.transparent = true
    this.nestedFrameGroup.add(this.uwGrid)

    // Stylized 3D Camera Object at Eye Origin e (using theme var(--grey-dark))
    this.eyeMesh = createCameraMesh()
    this.nestedFrameGroup.add(this.eyeMesh)

    // Basis Vectors Arrows (u, v, w) aligned to X/Y/Z color families
    this.arrowU = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 2.0, 0xf43f5e, 0.4, 0.22) // Red family (X/U)
    this.arrowV = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 2.0, 0x10b981, 0.4, 0.22) // Green family (Y/V)
    this.arrowW = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(0, 0, 0), 2.0, 0x3b82f6, 0.4, 0.22) // Blue family (Z/W)

    this.nestedFrameGroup.add(this.arrowU)
    this.nestedFrameGroup.add(this.arrowV)
    this.nestedFrameGroup.add(this.arrowW)

    // Basis Labels
    this.labelU = this.createAxisLabel('+u', '#f43f5e', new THREE.Vector3(2.4, 0, 0), 0.9)
    this.labelV = this.createAxisLabel('+v', '#10b981', new THREE.Vector3(0, 2.4, 0), 0.9)
    this.labelW = this.createAxisLabel('+w', '#3b82f6', new THREE.Vector3(0, 0, 2.4), 0.9)
    this.labelE = this.createAxisLabel('e (Eye)', '#f43f5e', new THREE.Vector3(0, -0.42, 0), 1.2)

    this.nestedFrameGroup.add(this.labelU)
    this.nestedFrameGroup.add(this.labelV)
    this.nestedFrameGroup.add(this.labelW)
    this.nestedFrameGroup.add(this.labelE)
  }

  buildTargetPointObject() {
    // targetPointGroup is already added to scene in initThree

    // Primary Target Object p: Wireframe Octahedron (Option B)
    const octGeom = new THREE.OctahedronGeometry(0.26, 0)
    const octMat = new THREE.MeshBasicMaterial({
      color: 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.95
    })
    this.targetMesh = new THREE.Mesh(octGeom, octMat)
    this.targetPointGroup.add(this.targetMesh)

    // Orbiting Satellite Object q: Wireframe Cube / Diamond (Option B)
    this.satelliteOrbitGroup = new THREE.Group()
    this.targetPointGroup.add(this.satelliteOrbitGroup)
    this.satelliteOrbitGroup.rotation.x = 0.45 // Inclined orbital plane

    // Faint dashed orbit ring
    const ringCurve = new THREE.EllipseCurve(0, 0, 0.52, 0.52, 0, 2 * Math.PI, false, 0)
    const ringPoints = ringCurve.getPoints(40)
    const ringGeom = new THREE.BufferGeometry().setFromPoints(ringPoints.map(pt => new THREE.Vector3(pt.x, 0, pt.y)))
    const ringMat = new THREE.LineDashedMaterial({
      color: 0xf43f5e,
      dashSize: 0.08,
      gapSize: 0.05,
      opacity: 0.4,
      transparent: true
    })
    this.orbitRing = new THREE.Line(ringGeom, ringMat)
    this.orbitRing.computeLineDistances()
    this.satelliteOrbitGroup.add(this.orbitRing)

    const cubeGeom = new THREE.BoxGeometry(0.12, 0.12, 0.12)
    const cubeMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.95
    })
    this.satelliteMesh = new THREE.Mesh(cubeGeom, cubeMat)
    this.satelliteOrbitGroup.add(this.satelliteMesh)

    // Label for p positioned comfortably above wireframe octahedron
    this.labelP = this.createAxisLabel('p (Target)', '#fbbf24', new THREE.Vector3(0, 0.48, 0), 0.9)
    this.targetPointGroup.add(this.labelP)

    // Dashed Guide Line from e to p
    const lineMat = new THREE.LineDashedMaterial({
      color: 0xf59e0b,
      dashSize: 0.15,
      gapSize: 0.08,
      opacity: 0.75,
      transparent: true
    })
    const lineGeom = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 1, 1)])
    this.guidelineEP = new THREE.Line(lineGeom, lineMat)
    this.guidelineEP.computeLineDistances()
    this.canonicalRoot.add(this.guidelineEP)
  }

  updateGuideline() {
    if (!this.guidelineEP) return
    const ePos = new THREE.Vector3()
    this.nestedFrameGroup.getWorldPosition(ePos)

    const pPos = new THREE.Vector3()
    this.targetPointGroup.getWorldPosition(pPos)

    const geom = this.guidelineEP.geometry
    const positions = new Float32Array([
      ePos.x, ePos.y, ePos.z,
      pPos.x, pPos.y, pPos.z
    ])
    geom.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geom.attributes.position.needsUpdate = true
    this.guidelineEP.computeLineDistances()
  }

  applyPreset(presetKey, notify = true) {
    const preset = FRAME_PRESETS[presetKey] || FRAME_PRESETS.default_camera
    this.activePresetKey = preset.id

    this.eye.set(preset.eye[0], preset.eye[1], preset.eye[2])
    this.target.set(preset.target[0], preset.target[1], preset.target[2])

    // Standard Right-Handed Camera Basis:
    // Look direction is along -w (down -z in camera space)
    // w points backwards from target to eye
    this.w.subVectors(this.eye, this.target).normalize()

    let up = new THREE.Vector3(0, 1, 0)
    if (Math.abs(this.w.dot(up)) > 0.95) up = new THREE.Vector3(0, 0, 1)

    this.u.crossVectors(up, this.w).normalize() // u points Right (+x in camera space)
    this.v.crossVectors(this.w, this.u).normalize() // v points Up (+y in camera space)

    if (preset.rollAngle) {
      this.u.applyAxisAngle(this.w, preset.rollAngle).normalize()
      this.v.applyAxisAngle(this.w, preset.rollAngle).normalize()
    }

    // Set position and orientation of nestedFrameGroup
    this.nestedFrameGroup.position.copy(this.eye)
    const rotMat = new THREE.Matrix4().makeBasis(this.u, this.v, this.w)
    this.nestedFrameGroup.quaternion.setFromRotationMatrix(rotMat)

    // In-scene Camera sits at the local origin of nestedFrameGroup (eye position e)
    this.inSceneCamera.position.set(0, 0, 0)
    this.inSceneCamera.quaternion.identity()

    // Compute target point p in world space from pointLocal in (u,v,w)
    const pLocal = new THREE.Vector3(preset.pointLocal[0], preset.pointLocal[1], preset.pointLocal[2])
    this.pointLocal.copy(pLocal)

    this.pointWorld.copy(this.eye)
      .addScaledVector(this.u, pLocal.x)
      .addScaledVector(this.v, pLocal.y)
      .addScaledVector(this.w, pLocal.z)

    this.targetPointGroup.position.copy(this.pointWorld)

    // Reset step
    this.currentStepIndex = 0
    this.targetStepIndex = 0
    this.animationProgress = 0
    this.isPlaying = false
    if (this.digestTimer) {
      clearTimeout(this.digestTimer)
      this.digestTimer = null
    }

    this.updateTransformVisuals(0)
    this.updateGuideline()

    if (notify) {
      this.emit('state-changed', this.getState())
    }
  }

  updateTransformVisuals(progressFraction) {
    const t = Math.max(0, Math.min(2, progressFraction))

    // R^T: the transpose of the basis matrix [u v w] — aligns the (u,v,w) frame with (x,y,z).
    const invRotation = new THREE.Matrix4().makeBasis(this.u, this.v, this.w).invert()
    const targetQuat = new THREE.Quaternion().setFromRotationMatrix(invRotation)

    if (t <= 1.0) {
      // Step 1 — T_{-e}: pure translation, zero rotation.
      // translateRoot.position slides from (0,0,0) to (-eye).
      // rotateRoot stays at identity — no rotation applied yet.
      const easeT = this.easeInOutCubic(t)
      this.translateRoot.position.copy(this.eye).multiplyScalar(-easeT)
      this.rotateRoot.quaternion.identity()
    } else {
      // Step 2 — R^T: translation is fully applied, now slerp rotation only.
      // translateRoot stays at (-eye) — no further translation.
      // rotateRoot slerps from identity to R^T.
      this.translateRoot.position.copy(this.eye).multiplyScalar(-1)
      const easeR = this.easeInOutCubic(t - 1.0)
      this.rotateRoot.quaternion.identity().slerp(targetQuat, easeR)
    }

    this.updateGuideline()
  }

  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }

  stepForward() {
    if (this.viewMode === 'camera-view') {
      this.setViewMode('third-person')
    }
    if (this.currentStepIndex < 2) {
      this.targetStepIndex = this.currentStepIndex + 1
      this.isPlaying = false
      if (this.digestTimer) {
        clearTimeout(this.digestTimer)
        this.digestTimer = null
      }
      this.emit('state-changed', this.getState())
    }
  }

  stepBackward() {
    if (this.viewMode === 'camera-view') {
      this.setViewMode('third-person')
    }
    if (this.currentStepIndex > 0) {
      this.targetStepIndex = this.currentStepIndex - 1
      this.isPlaying = false
      if (this.digestTimer) {
        clearTimeout(this.digestTimer)
        this.digestTimer = null
      }
      this.emit('state-changed', this.getState())
    }
  }

  reset() {
    if (this.viewMode === 'camera-view') {
      this.setViewMode('third-person')
    }
    this.targetStepIndex = 0
    this.currentStepIndex = 0
    this.animationProgress = 0
    this.isPlaying = false
    if (this.digestTimer) {
      clearTimeout(this.digestTimer)
      this.digestTimer = null
    }
    this.updateTransformVisuals(0)
    this.emit('state-changed', this.getState())
  }

  play() {
    if (this.viewMode === 'camera-view') {
      this.setViewMode('third-person')
    }
    if (this.currentStepIndex >= 2) {
      this.currentStepIndex = 0
      this.animationProgress = 0
    }
    this.isPlaying = true
    this.targetStepIndex = this.currentStepIndex + 1
    this.emit('state-changed', this.getState())
  }

  pause() {
    this.isPlaying = false
    this.targetStepIndex = this.currentStepIndex
    if (this.digestTimer) {
      clearTimeout(this.digestTimer)
      this.digestTimer = null
    }
    this.emit('state-changed', this.getState())
  }

  setViewMode(mode) {
    this.viewMode = mode === 'camera-view' ? 'camera-view' : 'third-person'
    this.activeCamera = this.viewMode === 'camera-view' ? this.inSceneCamera : this.orbitCamera
    this.controls.enabled = this.viewMode === 'third-person'

    const isThirdPerson = this.viewMode === 'third-person'
    if (this.cameraHelper) this.cameraHelper.visible = isThirdPerson
    if (this.eyeMesh) this.eyeMesh.visible = isThirdPerson
    if (this.uwGrid) this.uwGrid.visible = isThirdPerson
    if (this.arrowU) this.arrowU.visible = isThirdPerson
    if (this.arrowV) this.arrowV.visible = isThirdPerson
    if (this.arrowW) this.arrowW.visible = isThirdPerson
    if (this.labelU) this.labelU.visible = isThirdPerson
    if (this.labelV) this.labelV.visible = isThirdPerson
    if (this.labelW) this.labelW.visible = isThirdPerson
    if (this.labelE) this.labelE.visible = isThirdPerson

    this.emit('state-changed', this.getState())
  }

  // Reveal the camera body, frustum, and PiP view only when the chain has
  // fully applied. The render loop eases restReveal toward the target so the
  // apparatus fades in and out instead of popping.
  setRestReveal(visible) {
    this.restRevealTarget = visible ? 1 : 0
  }

  getState() {
    const frameMat = createBasisMatrix(this.u, this.v, this.w, this.eye)
    const viewMat = computeViewMatrix(this.u, this.v, this.w, this.eye)
    const translationMat = new THREE.Matrix4().makeTranslation(-this.eye.x, -this.eye.y, -this.eye.z)
    const livePointWorld = this.getLivePointWorld()

    return {
      presetKey: this.activePresetKey,
      currentStepIndex: this.currentStepIndex,
      targetStepIndex: this.targetStepIndex,
      animationProgress: this.animationProgress,
      isPlaying: this.isPlaying,
      isAnimating: this.isPlaying || Math.abs(this.animationProgress - this.targetStepIndex) > 0.001,
      viewMode: this.viewMode,
      eye: [this.eye.x, this.eye.y, this.eye.z],
      u: [this.u.x, this.u.y, this.u.z],
      v: [this.v.x, this.v.y, this.v.z],
      w: [this.w.x, this.w.y, this.w.z],
      pointWorld: [livePointWorld.x, livePointWorld.y, livePointWorld.z],
      pointLocal: [this.pointLocal.x, this.pointLocal.y, this.pointLocal.z],
      frameMatrix: frameMat.elements,
      viewMatrix: viewMat.elements,
      translationMatrix: translationMat.elements
    }
  }

  // World position of the target point after the current view transform is
  // applied. At rest this equals the preset's rest position; as the steps
  // animate, the point (a child of the transform hierarchy) slides toward its
  // fully-transformed position. getWorldPosition updates the matrix chain, so
  // this is safe to call mid-animation.
  getLivePointWorld() {
    if (!this.targetPointGroup) return this.pointWorld
    const p = new THREE.Vector3()
    this.targetPointGroup.getWorldPosition(p)
    return p
  }

  handleResize() {
    if (!this.container || !this.renderer) return
    const width = this.container.clientWidth
    const height = this.container.clientHeight
    if (width === 0 || height === 0) return
    if (width === this.width && height === this.height) return

    this.width = width
    this.height = height
    this.orbitCamera.aspect = width / height
    this.orbitCamera.updateProjectionMatrix()

    this.inSceneCamera.aspect = width / height
    this.inSceneCamera.updateProjectionMatrix()

    this.renderer.setSize(width, height)
  }

  // Renders the nested camera viewport into the rounded PiP canvas in the
  // bottom-right corner. The main view stays in third person, so animating
  // through the steps never kicks the user out of canonical space.
  renderNestedCameraPip(width, height) {
    if (!this.inSceneCamera || !this.pipRenderer || !this.pipContainer) return

    const size = Math.round(Math.min(width, height) * 0.28)
    if (size > 0 && (parseInt(this.pipContainer.style.width, 10) !== size)) {
      this.pipContainer.style.width = `${size}px`
      this.pipContainer.style.height = `${size}px`
      this.pipRenderer.setSize(size, size, false)
    }

    this.pipContainer.style.opacity = `${this.restReveal}`
    this.pipContainer.style.display = this.restReveal < 0.01 ? 'none' : 'block'

    if (this.restReveal < 0.01) return

    // Objects attached to the nested frame sit at the camera's own position, so
    // hide them while rendering from the camera's POV to keep the PiP clean.
    const decor = [
      this.cameraHelper, this.eyeMesh, this.uwGrid,
      this.arrowU, this.arrowV, this.arrowW,
      this.labelU, this.labelV, this.labelW, this.labelE,
      this.originLabel,
      this.guidelineEP
    ]
    const saved = []
    decor.forEach(o => {
      if (o) {
        saved.push([o, o.visible])
        o.visible = false
      }
    })

    const savedAspect = this.inSceneCamera.aspect
    this.inSceneCamera.aspect = 1
    this.inSceneCamera.updateProjectionMatrix()

    this.pipRenderer.render(this.scene, this.inSceneCamera)

    this.inSceneCamera.aspect = savedAspect
    this.inSceneCamera.updateProjectionMatrix()
    saved.forEach(([o, vis]) => { o.visible = vis })
  }

  startLoop() {
    let lastTime = performance.now()

    const animate = (now) => {
      if (this.isDisposed) return
      requestAnimationFrame(animate)

      const dt = Math.min(now - lastTime, 50)
      lastTime = now

      if (this.currentStepIndex !== this.targetStepIndex || this.animationProgress !== this.targetStepIndex) {
        const stepDir = Math.sign(this.targetStepIndex - this.animationProgress)
        const stepRate = dt / this.animDuration

        this.animationProgress += stepDir * stepRate
        if ((stepDir > 0 && this.animationProgress >= this.targetStepIndex) ||
            (stepDir < 0 && this.animationProgress <= this.targetStepIndex)) {
          this.animationProgress = this.targetStepIndex
          this.currentStepIndex = this.targetStepIndex
          if (stepDir > 0 && this.currentStepIndex === 2) {
            this.targetPulse = 1
          }

          if (this.isPlaying) {
            if (this.currentStepIndex < 2) {
              this.digestTimer = setTimeout(() => {
                if (this.isPlaying) {
                  this.targetStepIndex = this.currentStepIndex + 1
                  this.emit('state-changed', this.getState())
                }
              }, 600)
            } else {
              this.isPlaying = false
            }
          }
          this.emit('state-changed', this.getState())
        }

        this.updateTransformVisuals(this.animationProgress)
        this.emit('point-updated', {
          pointWorld: this.getLivePointWorld().toArray(),
          pointLocal: [this.pointLocal.x, this.pointLocal.y, this.pointLocal.z]
        })
      }

      if (this.viewMode === 'third-person') {
        this.controls.update()
      }

      if (this.cameraHelper) {
        this.cameraHelper.update()
      }

      if (this.restReveal !== this.restRevealTarget) {
        this.restReveal += (this.restRevealTarget - this.restReveal) * 0.08
        if (Math.abs(this.restRevealTarget - this.restReveal) < 0.005) {
          this.restReveal = this.restRevealTarget
        }
      }

      if (this.cameraHelper) {
        this.cameraHelper.material.opacity = 0.75 * this.restReveal
      }

      // The stylized camera body materializes at the eye only at rest.
      if (this.eyeMesh) {
        const s = 0.001 + 0.999 * this.restReveal
        this.eyeMesh.scale.set(s, s, s)
      }

      if (this.pipLabel) {
        this.pipLabel.style.opacity = String(this.restReveal)
      }

      // Option B: Animate Primary Wireframe Octahedron (gentle, slow rotation)
      if (this.targetMesh) {
        this.targetMesh.rotation.x = now * 0.00015
        this.targetMesh.rotation.y = now * 0.00025
        if (this.targetPulse > 0) {
          this.targetPulse = Math.max(0, this.targetPulse - dt / 700)
        }
        const pulseScale = 1 + 0.2 * this.targetPulse
        this.targetMesh.scale.set(pulseScale, pulseScale, pulseScale)
      }

      // Option B: Animate Orbiting Satellite Cube (slow orbital drift)
      if (this.satelliteMesh) {
        const orbitAngle = now * 0.0003
        const rOrbit = 0.52
        this.satelliteMesh.position.set(
          rOrbit * Math.cos(orbitAngle),
          0,
          rOrbit * Math.sin(orbitAngle)
        )
        this.satelliteMesh.rotation.x = now * 0.00035
        this.satelliteMesh.rotation.y = now * 0.0005
      }

      this.renderer.render(this.scene, this.orbitCamera)
      if (this.restReveal > 0.01) {
        this.renderNestedCameraPip(this.container.clientWidth || 640, this.container.clientHeight || 420)
      }
    }

    requestAnimationFrame(animate)
  }

  dispose() {
    this.isDisposed = true
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf)
    this.resizeRaf = null
    if (this.resizeObserver) this.resizeObserver.disconnect()
    if (this.controls) this.controls.dispose()
    if (this.pipRenderer) {
      this.pipRenderer.dispose()
      this.pipRenderer = null
    }
    if (this.pipContainer && this.pipContainer.parentNode) {
      this.pipContainer.parentNode.removeChild(this.pipContainer)
    }
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement)
      this.renderer.dispose()
    }
  }
}
