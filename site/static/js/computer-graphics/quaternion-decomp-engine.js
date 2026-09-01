/**
 * 3D Vector Orthogonal Decomposition & Quaternion Sandwich Rotation Engine
 *
 * Visualizes:
 * - Rotation axis n_hat
 * - Orthogonal plane P perp n_hat
 * - Parallel component v_parallel = (v . n_hat) n_hat
 * - Perpendicular component v_perp = v - v_parallel
 * - Orthogonal vector n_hat x v_perp
 * - Rotated perpendicular vector v_perp_prime = cos(theta) v_perp + sin(theta) (n_hat x v_perp)
 * - Rotated total vector v_prime = v_parallel + v_perp_prime
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import * as THREE from 'https://esm.sh/three@0.165.0'
import { OrbitControls } from 'https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js'

function getCssColor(varName, fallbackHex) {
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

function createTextSprite(text, colorHex, fontSize = 40) {
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

  // Subtle contrast shadow for 3D depth
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
  const worldHeight = 0.22
  const worldWidth = (canvasWidth / canvasHeight) * worldHeight
  sprite.scale.set(worldWidth, worldHeight, 1)
  sprite.renderOrder = 999
  return sprite
}

function updateTextSprite(sprite, text, colorHex, fontSize = 40) {
  if (!sprite || !sprite.material || !sprite.material.map) return
  const texture = sprite.material.map
  const canvas = texture.image
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const fontStyle = `bold ${fontSize}px "KaTeX_Math", "KaTeX_Main", "Times New Roman", -apple-system, system-ui, sans-serif`

  ctx.font = fontStyle
  const metrics = ctx.measureText(text)
  const textWidth = Math.ceil(metrics.width)
  const paddingX = 24
  const paddingY = 16
  const targetWidth = Math.max(textWidth + paddingX * 2, 128)
  const targetHeight = Math.max(fontSize * 2 + paddingY * 2, 64)

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth
    canvas.height = targetHeight
  }

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

  const worldHeight = 0.22
  const worldWidth = (canvas.width / canvas.height) * worldHeight
  sprite.scale.set(worldWidth, worldHeight, 1)
  texture.needsUpdate = true
}

export function decomposeVector(v, nHat) {
  const nLen = Math.hypot(nHat[0], nHat[1], nHat[2]) || 1
  const nx = nHat[0] / nLen
  const ny = nHat[1] / nLen
  const nz = nHat[2] / nLen

  const dot = v[0] * nx + v[1] * ny + v[2] * nz
  const vParallel = [dot * nx, dot * ny, dot * nz]
  const vPerp = [v[0] - vParallel[0], v[1] - vParallel[1], v[2] - vParallel[2]]

  // n_hat x v_perp
  const nCrossVPerp = [
    ny * vPerp[2] - nz * vPerp[1],
    nz * vPerp[0] - nx * vPerp[2],
    nx * vPerp[1] - ny * vPerp[0]
  ]

  return {
    dot,
    vParallel,
    vPerp,
    nCrossVPerp
  }
}

export function rotateVectorByAxisAngle(v, nHat, angleRad) {
  const { vParallel, vPerp, nCrossVPerp } = decomposeVector(v, nHat)
  const cosA = Math.cos(angleRad)
  const sinA = Math.sin(angleRad)

  const vPerpPrime = [
    cosA * vPerp[0] + sinA * nCrossVPerp[0],
    cosA * vPerp[1] + sinA * nCrossVPerp[1],
    cosA * vPerp[2] + sinA * nCrossVPerp[2]
  ]

  const vPrime = [
    vParallel[0] + vPerpPrime[0],
    vParallel[1] + vPerpPrime[1],
    vParallel[2] + vPerpPrime[2]
  ]

  return {
    vPerpPrime,
    vPrime
  }
}

export class QuaternionDecompEngine {
  constructor(container) {
    this.container = container
    this.angleRad = 0
    this.isPlaying = false
    this.playSpeed = 0.8
    this.listeners = new Set()
    this.loopActive = true

    // Default configuration: 3D vector with non-zero parallel and perpendicular components
    this.axis = [0, 1, 0]
    this.initialVector = [1.2, 0.9, 0]

    this.initScene()
    this.initGeometry()
    this.setupResizeObserver()
    this.updateState()
    this.startLoop()
  }

  initScene() {
    const width = this.container.clientWidth || 600
    const height = this.container.clientHeight || 400

    this.scene = new THREE.Scene()
    this.scene.background = null

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    this.camera.position.set(2.8, 2.2, 3.8)

    this.width = width
    this.height = height

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    this.renderer.setClearColor(0x000000, 0)
    this.container.appendChild(this.renderer.domElement)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.enableDamping = true
    this.controls.dampingFactor = 0.08
    this.controls.minDistance = 1.8
    this.controls.maxDistance = 8.0
    this.controls.target.set(0, 0.4, 0)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
    this.scene.add(ambientLight)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(5, 8, 5)
    this.scene.add(dirLight)
  }

  initGeometry() {
    this.group = new THREE.Group()
    this.scene.add(this.group)

    const primaryHex = getCssColor('--primary', 0xf43f5e)
    const amberHex = 0xfbbf24
    const emeraldHex = 0x34d399

    // 1. Rotation Plane Disc (Orthogonal to axis Y)
    const planeGeo = new THREE.CylinderGeometry(1.6, 1.6, 0.01, 32)
    const planeMat = new THREE.MeshBasicMaterial({
      color: 0x2b2b2b,
      transparent: true,
      opacity: 0.45
    })
    this.planeMesh = new THREE.Mesh(planeGeo, planeMat)
    this.group.add(this.planeMesh)

    // Plane outline circle
    const circleGeo = new THREE.BufferGeometry()
    const circlePts = []
    for (let i = 0; i <= 64; i++) {
      const theta = (i / 64) * Math.PI * 2
      circlePts.push(Math.cos(theta) * 1.6, 0, Math.sin(theta) * 1.6)
    }
    circleGeo.setAttribute('position', new THREE.Float32BufferAttribute(circlePts, 3))
    const circleMat = new THREE.LineDashedMaterial({
      color: 0x555555,
      dashSize: 0.08,
      gapSize: 0.04
    })
    const circleLine = new THREE.Line(circleGeo, circleMat)
    circleLine.computeLineDistances()
    this.group.add(circleLine)

    // 2. Rotation Axis n_hat (Amber Arrow)
    this.axisArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 0, 0),
      1.8,
      amberHex,
      0.16,
      0.1
    )
    this.group.add(this.axisArrow)

    // 3. Parallel Component v_parallel (Thick Amber bar along axis)
    const parGeo = new THREE.CylinderGeometry(0.025, 0.025, 1, 16)
    const parMat = new THREE.MeshStandardMaterial({ color: amberHex, roughness: 0.3 })
    this.vParallelMesh = new THREE.Mesh(parGeo, parMat)
    this.group.add(this.vParallelMesh)

    // 4. Perpendicular Component v_perp (Grey Arrow on plane)
    this.vPerpArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      1.2,
      0xdadada,
      0.14,
      0.08
    )
    this.group.add(this.vPerpArrow)

    // 5. Orthogonal Vector n_hat x v_perp (Dashed Green Arrow on plane)
    this.nCrossArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 0),
      1.2,
      0x888888,
      0.12,
      0.06
    )
    this.group.add(this.nCrossArrow)

    // 6. Original Vector v (Primary Coral Arrow)
    this.vOriginalArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 1, 0).normalize(),
      new THREE.Vector3(0, 0, 0),
      1.5,
      primaryHex,
      0.16,
      0.09
    )
    this.group.add(this.vOriginalArrow)

    // 7. Rotated Perpendicular Vector v_perp_prime (Emerald Arrow on plane)
    this.vPerpPrimeArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(0, 0, 0),
      1.2,
      emeraldHex,
      0.14,
      0.08
    )
    this.group.add(this.vPerpPrimeArrow)

    // 8. Rotated Total Vector v_prime (Emerald Solid Arrow)
    this.vPrimeArrow = new THREE.ArrowHelper(
      new THREE.Vector3(1, 1, 0).normalize(),
      new THREE.Vector3(0, 0, 0),
      1.5,
      emeraldHex,
      0.18,
      0.1
    )
    this.group.add(this.vPrimeArrow)

    // 9. Dashed Parallelogram Lines (Connecting v_prime to v_parallel + v_perp_prime)
    const guideGeo1 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    const guideMat = new THREE.LineDashedMaterial({ color: 0x666666, dashSize: 0.05, gapSize: 0.03 })
    this.guideLine1 = new THREE.Line(guideGeo1, guideMat)
    this.group.add(this.guideLine1)

    const guideGeo2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(), new THREE.Vector3()])
    this.guideLine2 = new THREE.Line(guideGeo2, guideMat)
    this.group.add(this.guideLine2)

    // 10. Circular Trajectory Arc on Plane for v_perp
    this.arcGeo = new THREE.BufferGeometry()
    this.arcMat = new THREE.LineBasicMaterial({ color: emeraldHex, transparent: true, opacity: 0.6 })
    this.arcLine = new THREE.Line(this.arcGeo, this.arcMat)
    this.group.add(this.arcLine)

    // 10b. Angle theta rotation arc on plane
    this.thetaArcGeo = new THREE.BufferGeometry()
    this.thetaArcMat = new THREE.LineBasicMaterial({ color: amberHex, transparent: true, opacity: 0.95 })
    this.thetaArcLine = new THREE.Line(this.thetaArcGeo, this.thetaArcMat)
    this.group.add(this.thetaArcLine)

    // 11. 3D Text Mesh Sprites (Native WebGL)
    this.labelN = createTextSprite('n̂', amberHex)
    this.group.add(this.labelN)

    this.labelTheta = createTextSprite('θ', amberHex, 44)
    this.group.add(this.labelTheta)

    this.labelV = createTextSprite('v', primaryHex)
    this.group.add(this.labelV)

    this.labelVPrime = createTextSprite('v′', emeraldHex)
    this.group.add(this.labelVPrime)

    this.labelVPar = createTextSprite('v∥', amberHex)
    this.group.add(this.labelVPar)

    this.labelVPerp = createTextSprite('v⊥', 0xdedede)
    this.group.add(this.labelVPerp)

    this.labelVPerpPrime = createTextSprite('v⊥′', emeraldHex)
    this.group.add(this.labelVPerpPrime)

    this.labelNCross = createTextSprite('n̂ × v⊥', 0xb8b8b8, 38)
    this.group.add(this.labelNCross)
  }

  setVector(v) {
    this.initialVector = [...v]
    this.updateState()
  }

  setAngle(angleRad) {
    this.angleRad = ((angleRad % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
    this.updateState()
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying
    this.emitState()
  }

  play() {
    this.isPlaying = true
    this.emitState()
  }

  pause() {
    this.isPlaying = false
    this.emitState()
  }

  updateState() {
    const v = this.initialVector
    const n = this.axis
    const { dot, vParallel, vPerp, nCrossVPerp } = decomposeVector(v, n)
    const { vPerpPrime, vPrime } = rotateVectorByAxisAngle(v, n, this.angleRad)

    const vVec = new THREE.Vector3(...v)
    const vLength = vVec.length()
    if (vLength > 0.001) {
      this.vOriginalArrow.setDirection(vVec.clone().normalize())
      this.vOriginalArrow.setLength(vLength, 0.16, 0.09)
      this.vOriginalArrow.visible = true
    } else {
      this.vOriginalArrow.visible = false
    }

    // Parallel bar
    const parLength = Math.abs(dot)
    if (parLength > 0.01) {
      this.vParallelMesh.scale.set(1, parLength, 1)
      this.vParallelMesh.position.set(0, dot / 2, 0)
      this.vParallelMesh.visible = true
    } else {
      this.vParallelMesh.visible = false
    }

    // Perpendicular vector
    const perpVec = new THREE.Vector3(...vPerp)
    const perpLen = perpVec.length()
    if (perpLen > 0.01) {
      this.vPerpArrow.setDirection(perpVec.clone().normalize())
      this.vPerpArrow.setLength(perpLen, 0.14, 0.08)
      this.vPerpArrow.visible = true

      const nCrossVec = new THREE.Vector3(...nCrossVPerp)
      this.nCrossArrow.setDirection(nCrossVec.clone().normalize())
      this.nCrossArrow.setLength(nCrossVec.length(), 0.12, 0.06)
      this.nCrossArrow.visible = true
    } else {
      this.vPerpArrow.visible = false
      this.nCrossArrow.visible = false
    }

    // Rotated perpendicular vector
    const perpPrimeVec = new THREE.Vector3(...vPerpPrime)
    const perpPrimeLen = perpPrimeVec.length()
    if (perpPrimeLen > 0.01) {
      this.vPerpPrimeArrow.setDirection(perpPrimeVec.clone().normalize())
      this.vPerpPrimeArrow.setLength(perpPrimeLen, 0.14, 0.08)
      this.vPerpPrimeArrow.visible = true
    } else {
      this.vPerpPrimeArrow.visible = false
    }

    // Rotated total vector
    const primeVec = new THREE.Vector3(...vPrime)
    const primeLen = primeVec.length()
    if (primeLen > 0.01) {
      this.vPrimeArrow.setDirection(primeVec.clone().normalize())
      this.vPrimeArrow.setLength(primeLen, 0.18, 0.1)
      this.vPrimeArrow.visible = true
    } else {
      this.vPrimeArrow.visible = false
    }

    // Update guide lines
    const pTopParallel = new THREE.Vector3(0, dot, 0)
    this.guideLine1.geometry.setFromPoints([perpPrimeVec, primeVec])
    this.guideLine1.computeLineDistances()

    this.guideLine2.geometry.setFromPoints([pTopParallel, primeVec])
    this.guideLine2.computeLineDistances()

    // Update sweep arc
    if (perpLen > 0.01 && this.angleRad > 0.01) {
      const arcPts = []
      const steps = Math.max(8, Math.floor(this.angleRad * 20))
      for (let i = 0; i <= steps; i++) {
        const a = (i / steps) * this.angleRad
        const rot = rotateVectorByAxisAngle(v, n, a)
        arcPts.push(new THREE.Vector3(...rot.vPerpPrime))
      }
      this.arcGeo.setFromPoints(arcPts)
      this.arcLine.visible = true
    } else {
      this.arcLine.visible = false
    }

    // Update theta rotation angle arc & label
    if (perpLen > 0.05 && this.angleRad > 0.04) {
      const thetaArcRadius = Math.min(0.48, perpLen * 0.45)
      const thetaArcPts = []
      const thetaSteps = Math.max(8, Math.floor(this.angleRad * 24))
      for (let i = 0; i <= thetaSteps; i++) {
        const a = (i / thetaSteps) * this.angleRad
        const rot = rotateVectorByAxisAngle(v, n, a)
        const dir = new THREE.Vector3(...rot.vPerpPrime).normalize()
        thetaArcPts.push(new THREE.Vector3(dir.x * thetaArcRadius, 0.015, dir.z * thetaArcRadius))
      }
      this.thetaArcGeo.setFromPoints(thetaArcPts)
      this.thetaArcLine.visible = true

      // Midpoint of arc for label theta
      const degText = `${((this.angleRad * 180) / Math.PI).toFixed(1)}°`
      const amberHex = 0xfbbf24
      updateTextSprite(this.labelTheta, `θ = ${degText}`, amberHex, 40)

      const midAngle = this.angleRad / 2
      const midRot = rotateVectorByAxisAngle(v, n, midAngle)
      const midDir = new THREE.Vector3(...midRot.vPerpPrime).normalize()
      const labelRadius = thetaArcRadius + 0.22
      this.labelTheta.position.set(midDir.x * labelRadius, 0.06, midDir.z * labelRadius)
      this.labelTheta.visible = true
    } else {
      this.thetaArcLine.visible = false
      this.labelTheta.visible = false
    }

    // 12. Update 3D Text Mesh Sprites with collision prevention
    this.labelN.position.set(0, 2.05, 0)

    const isPerpendicular = parLength < 0.05
    const isAxial = perpLen < 0.05
    const hasRotation = this.angleRad > 0.08 && this.angleRad < (Math.PI * 2 - 0.08)

    // Original v
    if (vLength > 0.05) {
      if (isPerpendicular) {
        this.labelV.position.set(v[0] * 1.15, 0.08, v[2] * 1.15)
      } else {
        this.labelV.position.set(v[0] * 1.12, v[1] * 1.12 + 0.08, v[2] * 1.12)
      }
      this.labelV.visible = true
    } else {
      this.labelV.visible = false
    }

    // Rotated v'
    const primeLength = Math.hypot(...vPrime)
    if (primeLength > 0.05 && hasRotation && !isAxial) {
      if (isPerpendicular) {
        this.labelVPrime.position.set(vPrime[0] * 1.15, 0.08, vPrime[2] * 1.15)
      } else {
        this.labelVPrime.position.set(vPrime[0] * 1.12, vPrime[1] * 1.12 + 0.08, vPrime[2] * 1.12)
      }
      this.labelVPrime.visible = true
    } else {
      this.labelVPrime.visible = false
    }

    // Parallel component v∥ (only when not strictly perpendicular and not purely axial)
    if (parLength > 0.1 && !isPerpendicular && !isAxial) {
      this.labelVPar.position.set(-0.18, dot * 0.5, 0)
      this.labelVPar.visible = true
    } else {
      this.labelVPar.visible = false
    }

    // Perpendicular component v⊥ (only when non-zero and not strictly perpendicular)
    if (perpLen > 0.1 && !isPerpendicular && !isAxial) {
      this.labelVPerp.position.set(vPerp[0] * 1.15, 0.08, vPerp[2] * 1.15)
      this.labelVPerp.visible = true
    } else {
      this.labelVPerp.visible = false
    }

    // Orthogonal Vector n̂ × v⊥
    if (perpLen > 0.1 && !isAxial) {
      this.labelNCross.position.set(nCrossVPerp[0] * 1.15, 0.08, nCrossVPerp[2] * 1.15)
      this.labelNCross.visible = true
    } else {
      this.labelNCross.visible = false
    }

    // Rotated perpendicular v⊥'
    if (perpPrimeLen > 0.1 && hasRotation && !isPerpendicular && !isAxial) {
      this.labelVPerpPrime.position.set(vPerpPrime[0] * 1.15, 0.08, vPerpPrime[2] * 1.15)
      this.labelVPerpPrime.visible = true
    } else {
      this.labelVPerpPrime.visible = false
    }

    this.emitState()
  }

  subscribe(fn) {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  emitState() {
    const v = this.initialVector
    const n = this.axis
    const { dot, vParallel, vPerp, nCrossVPerp } = decomposeVector(v, n)
    const { vPerpPrime, vPrime } = rotateVectorByAxisAngle(v, n, this.angleRad)

    const state = {
      angleRad: this.angleRad,
      angleDeg: (this.angleRad * 180) / Math.PI,
      isPlaying: this.isPlaying,
      vOriginal: v,
      axis: n,
      dotProduct: dot,
      vParallel,
      vPerp,
      nCrossVPerp,
      vPerpPrime,
      vPrime
    }

    this.listeners.forEach((fn) => fn(state))
  }

  setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return
    this.resizeObserver = new ResizeObserver(() => this.scheduleResize())
    this.resizeObserver.observe(this.container)
  }

  scheduleResize() {
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf)
    this.resizeRaf = requestAnimationFrame(() => {
      this.resizeRaf = null
      this.handleResize()
    })
  }

  handleResize() {
    if (!this.container || !this.renderer || !this.camera) return
    const width = this.container.clientWidth
    const height = this.container.clientHeight || 400
    if (width === 0 || height === 0) return

    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(width, height)
  }

  startLoop() {
    if (this.isDisposed || !this.loopActive) return
    this.animate()
  }

  resumeLoop() {
    if (this.isDisposed || this.loopActive) return
    this.loopActive = true
    this.lastTime = undefined
    this.startLoop()
  }

  pauseLoop() {
    this.loopActive = false
  }

  animate(time = performance.now()) {
    if (this.isDisposed || !this.loopActive) return
    this.animationFrameId = requestAnimationFrame((t) => this.animate(t))

    if (this.lastTime === undefined) this.lastTime = time
    const dt = Math.min((time - this.lastTime) / 1000, 0.1)
    this.lastTime = time

    if (this.isPlaying) {
      // 1 smooth revolution in 9 seconds (0.70 rad/s)
      this.setAngle(this.angleRad + dt * 0.7)
    }

    this.controls.update()
    this.renderer.render(this.scene, this.camera)
  }

  dispose() {
    this.loopActive = false
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId)
    if (this.resizeRaf) cancelAnimationFrame(this.resizeRaf)
    if (this.resizeObserver) this.resizeObserver.disconnect()
    if (this.renderer && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement)
      this.renderer.dispose()
    }
    this.listeners.clear()
  }
}
