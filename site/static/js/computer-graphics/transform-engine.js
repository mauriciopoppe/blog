/**
 * TransformEngine: Headless Three.js 3D Transformation Chain & Animation State Machine
 *
 * Provides a modular, reusable engine to visualize 3D matrix transformations,
 * step-by-step composition (right-to-left evaluation), quaternion SLERP / vector LERP
 * interpolation, ghost reference frames, and matrix math callbacks.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import * as THREE from 'https://esm.sh/three@0.165.0'
import { OrbitControls } from 'https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js'

/**
 * Creates a 4x4 matrix from translation
 */
export function createTranslationMatrix(tx, ty, tz) {
  const m = new THREE.Matrix4()
  m.makeTranslation(tx, ty, tz)
  return m
}

/**
 * Creates a 4x4 matrix from scaling
 */
export function createScaleMatrix(sx, sy, sz) {
  const m = new THREE.Matrix4()
  m.makeScale(sx, sy, sz)
  return m
}

/**
 * Creates a 4x4 matrix from rotation around an axis
 */
export function createRotationMatrix(axis, angleRad) {
  const m = new THREE.Matrix4()
  if (axis === 'x') m.makeRotationX(angleRad)
  else if (axis === 'y') m.makeRotationY(angleRad)
  else if (axis === 'z') m.makeRotationZ(angleRad)
  else {
    const v = new THREE.Vector3(axis.x || 0, axis.y || 1, axis.z || 0).normalize()
    m.makeRotationAxis(v, angleRad)
  }
  return m
}

/**
 * Creates a 4x4 shear matrix (shearing along X by Y, etc.)
 */
export function createShearMatrix(sxy = 0, sxz = 0, syx = 0, syz = 0, szx = 0, szy = 0) {
  const m = new THREE.Matrix4()
  m.set(
    1, sxy, sxz, 0,
    syx, 1, syz, 0,
    szx, szy, 1, 0,
    0, 0, 0, 1
  )
  return m
}

/**
 * Multiplies a chain of matrices in application order (right-to-left)
 * If chain is [S, R, T], result is T * R * S
 */
export function multiplyMatrixChain(matrices) {
  const result = new THREE.Matrix4().identity()
  // Matrices applied right to left: result = M_n * ... * M_2 * M_1
  for (const m of matrices) {
    result.premultiply(m)
  }
  return result
}

/**
 * Cubic ease in-out curve for smooth visual progression
 */
export function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Headless 3D Transformation Engine
 */
export class TransformEngine {
  constructor(options = {}) {
    this.container = options.container || null
    this.width = options.width || 600
    this.height = options.height || 450
    this.stepDuration = options.stepDuration || 1200 // ms per step animation
    this.digestPauseDuration = options.digestPauseDuration || 700 // ms pause between steps

    this.scene = null
    this.camera = null
    this.renderer = null
    this.controls = null

    this.subjectMesh = null
    this.ghostMesh = null
    this.localAxes = null

    this.chain = []
    this.currentStepIndex = -1 // -1 means identity (no steps applied yet)
    this.targetStepIndex = -1

    this.state = 'idle' // 'idle' | 'playing' | 'animating_step' | 'digest_pause' | 'paused'
    this.animatingStartTime = 0
    this.stepStartMatrix = new THREE.Matrix4().identity()
    this.stepEndMatrix = new THREE.Matrix4().identity()
    this.currentMatrix = new THREE.Matrix4().identity()

    this.listeners = {
      stepChange: [],
      matrixUpdate: [],
      stateChange: [],
      complete: []
    }

    if (this.container) {
      this.initScene()
    }
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback)
    }
    return this
  }

  emit(event, ...args) {
    if (this.listeners[event]) {
      for (const cb of this.listeners[event]) {
        cb(...args)
      }
    }
  }

  initScene() {
    if (!this.container) return

    // Clear existing children
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild)
    }

    const rect = this.container.getBoundingClientRect()
    this.width = rect.width || this.width
    this.height = rect.height || this.height

    this.scene = new THREE.Scene()
    // Transparent background so WebGL canvas blends with CSS container background
    this.scene.background = null

    // Camera setup (isometric perspective)
    const aspect = this.width / this.height
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000)
    this.camera.position.set(6, 4.5, 7.5)
    this.camera.lookAt(0, 0.5, 0)

    // Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.setSize(this.width, this.height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.container.appendChild(this.renderer.domElement)

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.05
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05 // don't go below ground
    this.controls.target.set(0, 0.5, 0)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65)
    this.scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.9)
    keyLight.position.set(8, 12, 6)
    keyLight.castShadow = true
    keyLight.shadow.mapSize.width = 1024
    keyLight.shadow.mapSize.height = 1024
    this.scene.add(keyLight)

    const fillLight = new THREE.DirectionalLight(0xec5975, 0.35) // primary theme accent light
    fillLight.position.set(-6, -2, -4)
    this.scene.add(fillLight)

    // Ground Grid
    const gridHelper = new THREE.GridHelper(12, 12, 0x444444, 0x27272a)
    gridHelper.position.y = -0.001
    this.scene.add(gridHelper)

    // Global Origin Axes
    const globalAxes = new THREE.AxesHelper(2.0)
    globalAxes.renderOrder = 998
    this.scene.add(globalAxes)

    // Text labels for world coordinate axes (+x, +y, +z)
    const labelX = this.createAxisLabel('+x', '#ef4444')
    labelX.position.set(2.3, 0, 0)
    this.scene.add(labelX)

    const labelY = this.createAxisLabel('+y', '#22c55e')
    labelY.position.set(0, 2.3, 0)
    this.scene.add(labelY)

    const labelZ = this.createAxisLabel('+z', '#38bdf8')
    labelZ.position.set(0, 0, 2.3)
    this.scene.add(labelZ)

    // Build subject and ghost meshes
    this.buildMeshes()

    // Handle resize
    this.resizeObserver = new ResizeObserver(() => this.scheduleResize())
    this.resizeObserver.observe(this.container)

    // Render loop
    this.isRendering = true
    this.rafId = requestAnimationFrame((ts) => this.renderLoop(ts))
  }

  buildMeshes() {
    // Subject geometry: Faceted geometric shuttle / spacecraft shape
    // Combine an asymmetric geometry so scaling, rotation, and translation are unmistakable
    const group = new THREE.Group()

    // Main hull (faceted prism cone)
    const hullGeo = new THREE.ConeGeometry(0.8, 1.8, 5)
    hullGeo.rotateZ(-Math.PI / 2) // Point forward along +X
    hullGeo.translate(0.4, 0.4, 0)

    const hullMat = new THREE.MeshStandardMaterial({
      color: 0xec5975, // primary accent
      roughness: 0.3,
      metalness: 0.2,
      flatShading: true
    })
    const hullMesh = new THREE.Mesh(hullGeo, hullMat)
    hullMesh.castShadow = true
    group.add(hullMesh)

    // Cockpit / dorsal fin (distinguishes Top +Y from Bottom -Y)
    const finGeo = new THREE.BoxGeometry(0.7, 0.6, 0.15)
    finGeo.translate(0.1, 0.9, 0)
    const finMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // light blue highlight
      roughness: 0.2,
      metalness: 0.4,
      flatShading: true
    })
    const finMesh = new THREE.Mesh(finGeo, finMat)
    group.add(finMesh)

    // Wings (distinguishes Left +Z from Right -Z)
    const wingGeo = new THREE.BoxGeometry(0.6, 0.08, 2.2)
    wingGeo.translate(0, 0.3, 0)
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.4,
      flatShading: true
    })
    const wingMesh = new THREE.Mesh(wingGeo, wingMat)
    group.add(wingMesh)

    // Wireframe overlay for crisp edges
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    })
    const wireframeMesh = new THREE.Mesh(hullGeo, wireframeMat)
    group.add(wireframeMesh)

    // Local Axes Attached to Mesh (Red = +X Forward, Green = +Y Up, Blue = +Z Right)
    const localAxes = new THREE.AxesHelper(1.4)
    localAxes.renderOrder = 999
    group.add(localAxes)

    this.localAxes = localAxes

    group.matrixAutoUpdate = false
    this.subjectMesh = group
    this.scene.add(this.subjectMesh)

    // Ghost Mesh (Wireframe anchored at initial identity state)
    const ghostGroup = new THREE.Group()
    const ghostMat = new THREE.MeshBasicMaterial({
      color: 0x71717a,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    })
    const ghostHull = new THREE.Mesh(hullGeo, ghostMat)
    const ghostFin = new THREE.Mesh(finGeo, ghostMat)
    const ghostWing = new THREE.Mesh(wingGeo, ghostMat)
    ghostGroup.add(ghostHull, ghostFin, ghostWing)
    this.ghostMesh = ghostGroup
    this.scene.add(this.ghostMesh)
  }

  createAxisLabel(text, colorHex) {
    if (typeof document === 'undefined') return new THREE.Group()
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.font = 'bold 56px monospace, sans-serif'
      ctx.fillStyle = colorHex
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text, 128, 64)
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.minFilter = THREE.LinearFilter
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthTest: false
    })
    const sprite = new THREE.Sprite(spriteMat)
    sprite.scale.set(0.9, 0.45, 1)
    sprite.renderOrder = 1000
    return sprite
  }

  setChain(steps) {
    this.chain = steps.map((s, idx) => ({
      ...s,
      index: idx,
      matrix: s.matrix instanceof THREE.Matrix4 ? s.matrix : this.computeStepMatrix(s)
    }))
    this.reset()
    return this
  }

  computeStepMatrix(step) {
    switch (step.type) {
      case 'scale':
        return createScaleMatrix(step.x ?? 1, step.y ?? 1, step.z ?? 1)
      case 'rotate':
        return createRotationMatrix(step.axis || 'y', step.angleRad ?? ((step.angleDeg || 0) * Math.PI / 180))
      case 'translate':
        return createTranslationMatrix(step.x ?? 0, step.y ?? 0, step.z ?? 0)
      case 'shear':
        return createShearMatrix(step.sxy, step.sxz, step.syx, step.syz, step.szx, step.szy)
      default:
        return new THREE.Matrix4().identity()
    }
  }

  /**
   * Computes the accumulated matrix up to a given step index (inclusive).
   * -1 returns identity.
   */
  getAccumulatedMatrix(stepIndex) {
    const mat = new THREE.Matrix4().identity()
    if (stepIndex < 0 || !this.chain.length) return mat

    const maxIdx = Math.min(stepIndex, this.chain.length - 1)
    // Applied in chain order (0 to maxIdx): M = M_max * ... * M_1 * M_0
    for (let i = 0; i <= maxIdx; i++) {
      mat.premultiply(this.chain[i].matrix)
    }
    return mat
  }

  reset() {
    if (this.digestTimer) {
      clearTimeout(this.digestTimer)
      this.digestTimer = null
    }
    this.state = 'idle'
    this.currentStepIndex = -1
    this.targetStepIndex = -1
    this.currentMatrix.identity()
    this.applyMatrixToMesh(this.currentMatrix)
    this.emit('stepChange', -1, null, this.chain.length)
    this.emit('matrixUpdate', this.currentMatrix, null)
    this.emit('stateChange', this.state)
  }

  play() {
    if (this.currentStepIndex >= this.chain.length - 1) {
      this.reset()
    }
    this.state = 'playing'
    this.emit('stateChange', this.state)
    this.startNextStepAnimation()
  }

  pause() {
    if (this.digestTimer) {
      clearTimeout(this.digestTimer)
      this.digestTimer = null
    }
    this.state = 'paused'
    this.emit('stateChange', this.state)
  }

  stepForward() {
    if (this.digestTimer) {
      clearTimeout(this.digestTimer)
      this.digestTimer = null
    }
    if (this.currentStepIndex < this.chain.length - 1) {
      this.state = 'animating_step'
      this.emit('stateChange', this.state)
      this.startStepAnimation(this.currentStepIndex + 1, () => {
        this.state = 'paused'
        this.emit('stateChange', this.state)
      })
    }
  }

  stepBackward() {
    if (this.digestTimer) {
      clearTimeout(this.digestTimer)
      this.digestTimer = null
    }
    if (this.currentStepIndex > -1) {
      this.currentStepIndex--
      this.targetStepIndex = this.currentStepIndex
      this.currentMatrix.copy(this.getAccumulatedMatrix(this.currentStepIndex))
      this.applyMatrixToMesh(this.currentMatrix)
      const curStep = this.currentStepIndex >= 0 ? this.chain[this.currentStepIndex] : null
      this.emit('stepChange', this.currentStepIndex, curStep, this.chain.length)
      this.emit('matrixUpdate', this.currentMatrix, curStep ? curStep.matrix : null)
      this.state = 'paused'
      this.emit('stateChange', this.state)
    }
  }

  startNextStepAnimation() {
    if (this.state !== 'playing') return

    if (this.currentStepIndex >= this.chain.length - 1) {
      this.state = 'idle'
      this.emit('stateChange', this.state)
      this.emit('complete')
      return
    }

    const nextIdx = this.currentStepIndex + 1
    this.startStepAnimation(nextIdx, () => {
      if (this.state === 'playing') {
        this.state = 'digest_pause'
        this.emit('stateChange', this.state)
        this.digestTimer = setTimeout(() => {
          if (this.state === 'digest_pause') {
            this.state = 'playing'
            this.emit('stateChange', this.state)
            this.startNextStepAnimation()
          }
        }, this.digestPauseDuration)
      }
    })
  }

  startStepAnimation(targetIdx, onFinish) {
    this.stepStartMatrix.copy(this.getAccumulatedMatrix(targetIdx - 1))
    this.stepEndMatrix.copy(this.getAccumulatedMatrix(targetIdx))
    this.targetStepIndex = targetIdx
    this.animatingStartTime = performance.now()
    this.onStepAnimationFinish = onFinish

    const activeStep = this.chain[targetIdx]
    this.emit('stepChange', targetIdx, activeStep, this.chain.length)
  }

  applyMatrixToMesh(matrix) {
    if (this.subjectMesh) {
      this.subjectMesh.matrix.copy(matrix)
      this.subjectMesh.matrixWorldNeedsUpdate = true
    }
  }

  interpolateMatrices(mStart, mEnd, t) {
    const pStart = new THREE.Vector3()
    const qStart = new THREE.Quaternion()
    const sStart = new THREE.Vector3()
    mStart.decompose(pStart, qStart, sStart)

    const pEnd = new THREE.Vector3()
    const qEnd = new THREE.Quaternion()
    const sEnd = new THREE.Vector3()
    mEnd.decompose(pEnd, qEnd, sEnd)

    const easedT = easeInOutCubic(t)

    const pCur = new THREE.Vector3().lerpVectors(pStart, pEnd, easedT)
    const qCur = new THREE.Quaternion().copy(qStart).slerp(qEnd, easedT)
    const sCur = new THREE.Vector3().lerpVectors(sStart, sEnd, easedT)

    const result = new THREE.Matrix4().compose(pCur, qCur, sCur)
    return result
  }

  renderLoop(timestamp) {
    if (!this.isRendering) return

    // Update active step animation
    if (this.targetStepIndex > this.currentStepIndex) {
      const elapsed = timestamp - this.animatingStartTime
      const progress = Math.min(elapsed / this.stepDuration, 1.0)

      this.currentMatrix = this.interpolateMatrices(this.stepStartMatrix, this.stepEndMatrix, progress)
      this.applyMatrixToMesh(this.currentMatrix)
      this.emit('matrixUpdate', this.currentMatrix, this.chain[this.targetStepIndex]?.matrix)

      if (progress >= 1.0) {
        this.currentStepIndex = this.targetStepIndex
        this.currentMatrix.copy(this.stepEndMatrix)
        this.applyMatrixToMesh(this.currentMatrix)
        if (this.onStepAnimationFinish) {
          const cb = this.onStepAnimationFinish
          this.onStepAnimationFinish = null
          cb()
        }
      }
    }

    if (this.controls) {
      this.controls.update()
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera)
    }

    this.rafId = requestAnimationFrame((ts) => this.renderLoop(ts))
  }

  scheduleResize() {
    if (this.resizeRaf) return
    this.resizeRaf = requestAnimationFrame(() => {
      this.resizeRaf = null
      this.onResize()
    })
  }

  onResize() {
    if (!this.container || !this.camera || !this.renderer) return
    const rect = this.container.getBoundingClientRect()
    if (rect.width === 0 || rect.height === 0) return
    if (rect.width === this.width && rect.height === this.height) return

    this.width = rect.width
    this.height = rect.height
    this.camera.aspect = this.width / this.height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(this.width, this.height)
  }

  destroy() {
    this.isRendering = false
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf)
    this.resizeRaf = null
    if (this.rafId) cancelAnimationFrame(this.rafId)
    if (this.resizeObserver) this.resizeObserver.disconnect()
    if (this.renderer && this.renderer.domElement && this.renderer.domElement.parentNode) {
      this.renderer.domElement.parentNode.removeChild(this.renderer.domElement)
    }
  }
}
