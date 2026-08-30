/**
 * Projection Transform Interactive 3D Explorers
 *
 * Mounts an orthographic and a perspective projection visualization, each in a
 * card matching the interactive computer graphics graph spec: theme tokens,
 * header strip with icon, and a two-column body with an explanation and
 * parameter panel on the left and the 3D viewport on the right.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import * as THREE from 'https://esm.sh/three@0.165.0'
import { OrbitControls } from 'https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'https://cdn.jsdelivr.net/npm/three@0.165.0/examples/jsm/libs/lil-gui.module.min.js/+esm'
import { createCameraMesh } from './camera-mesh.js'

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

function renderMath(tex, isDisplay = false) {
  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex, { displayMode: isDisplay, throwOnError: false })
    } catch {
      return tex
    }
  }
  return tex
}

const PROJECTION_CARDS = {
  perspective: {
    title: 'Perspective Projection',
    badge: 'Frustum to canonical cube'
  },
  orthographic: {
    title: 'Orthographic Projection',
    badge: 'Box to canonical cube'
  }
}

function projectionExplorer(mountSelector, cameraType) {
  const mountEl = typeof mountSelector === 'string' ? document.querySelector(mountSelector) : mountSelector
  if (!mountEl) return

  const card = PROJECTION_CARDS[cameraType]
  const isPerspective = cameraType === 'perspective'

  const panelHtml = isPerspective
    ? `
      <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-1.5 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)]">
        The wireframe frustum is the perspective view volume, a truncated pyramid from the near plane to the far plane. Drag to orbit, scroll to zoom.
      </div>
      <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-1.5 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)]">
        In the minimap, the camera sees the scene with foreshortening: the division by ${renderMath('w = -z')} makes distant objects appear smaller.
      </div>
    `
    : `
      <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-1.5 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)]">
        The wireframe box is the orthographic view volume ${renderMath('[l, r] \\times [b, t] \\times [n, f]')}. Drag to orbit, scroll to zoom.
      </div>
      <div class="tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-px-2.5 tw-py-1.5 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)]">
        In the minimap, the camera sees the scene with no perspective: parallel lines stay parallel and distance does not shrink objects, because the projection keeps ${renderMath('w = 1')}.
      </div>
    `

  mountEl.innerHTML = `
    <style>
      #${cameraType}-projection-animation .katex {
        font-size: 0.8em !important;
      }
      .proj-card .lil-gui {
        position: static;
        width: 100%;
        box-sizing: border-box;
        background: var(--grey-darker);
        border: 1px solid var(--ring-border);
        border-radius: 6px;
        font-family: var(--family-sans, system-ui, sans-serif);
      }
      .proj-card .lil-gui .title {
        background: var(--grey-dark);
        color: var(--grey-lighter);
        font-size: 10.5px;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: none;
      }
      .proj-card .lil-gui .controller {
        border-bottom: 1px solid var(--ring-border);
      }
      .proj-card .lil-gui .name {
        color: var(--grey-light);
        font-size: 11px;
      }
      .proj-card .lil-gui .number {
        color: var(--grey-light);
        font-family: var(--family-monospace, Consolas, monospace);
        font-size: 10.5px;
      }
      .proj-card .lil-gui .slider {
        background: var(--grey-dark);
      }
      .proj-card .lil-gui .slider .fill {
        background: rgb(var(--primary));
      }
    </style>

    <div class="proj-card tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden tw-font-sans">
      <div class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-text-primary tw-flex tw-items-center tw-gap-1.5">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          ${card.title}
        </div>
        <div class="tw-font-serif tw-text-sm tw-text-[var(--grey-light)]">${card.badge}</div>
      </div>
      <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif max-[860px]:tw-grid-cols-1">
        <div class="tw-flex tw-flex-col tw-gap-1.5">
          ${panelHtml}
          <div id="proj-controls-${cameraType}"></div>
        </div>
        <div class="proj-canvas tw-relative tw-h-[50vh] tw-min-h-[320px] tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-overflow-hidden"></div>
      </div>
    </div>
  `

  const canvasMount = mountEl.querySelector('.proj-canvas')
  const controlsMount = mountEl.querySelector(`#proj-controls-${cameraType}`)

  const width = canvasMount.clientWidth || 640
  const height = canvasMount.clientHeight || 420
  const aspect = width / height

  const scene = new THREE.Scene()

  // Lights for the standard-material camera body.
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
  scene.add(ambientLight)
  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dirLight.position.set(6, 12, 8)
  scene.add(dirLight)

  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setAnimationLoop(animate)
  renderer.setScissorTest(true)
  canvasMount.appendChild(renderer.domElement)

  const greyDarker = getCssColor('--grey-darker', 0x1d1e1c)
  const greyDark = getCssColor('--grey-dark', 0x2b2b2b)

  const globalCamera = new THREE.PerspectiveCamera(75, aspect, 1, 5000)
  globalCamera.position.x = -500
  globalCamera.position.z = 1500

  // Projection camera rendered in the minimap. The aspect is 1 because the
  // minimap is square.
  const guiParams = {
    fov: 50,
    near: 300,
    far: 1000
  }
  const gui = new GUI({ container: controlsMount, title: 'Parameters' })

  let camera
  const defaults = { fov: 50, near: 300, far: 1000 }
  if (isPerspective) {
    camera = new THREE.PerspectiveCamera(guiParams.fov, 1, guiParams.near, guiParams.far)
    camera.rotation.y = Math.PI

    gui.add(guiParams, 'fov', 40, 90).onChange((v) => {
      camera.fov = v
      camera.updateProjectionMatrix()
    })
  } else {
    const frustumSize = height
    guiParams.lr = frustumSize / 2
    guiParams.tb = frustumSize / 2
    defaults.lr = guiParams.lr
    defaults.tb = guiParams.tb

    camera = new THREE.OrthographicCamera(
      guiParams.lr,
      -guiParams.lr,
      guiParams.tb,
      -guiParams.tb,
      guiParams.near,
      guiParams.far
    )
    camera.rotation.y = Math.PI

    gui.add(guiParams, 'lr', frustumSize / 4, frustumSize).onChange((v) => {
      camera.left = v
      camera.right = -v
      camera.updateProjectionMatrix()
    })
    gui.add(guiParams, 'tb', frustumSize / 4, frustumSize).onChange((v) => {
      camera.top = v
      camera.bottom = -v
      camera.updateProjectionMatrix()
    })
  }
  gui.add(guiParams, 'near', 50, 2000).onChange((v) => {
    camera.near = v
    camera.updateProjectionMatrix()
  })
  gui.add(guiParams, 'far', 0, 2000).onChange((v) => {
    camera.far = v
    camera.updateProjectionMatrix()
  })
  gui.add({ reset: () => resetProjection() }, 'reset').name('Reset to Original')

  function resetProjection() {
    guiParams.fov = defaults.fov
    guiParams.near = defaults.near
    guiParams.far = defaults.far
    if (isPerspective) {
      camera.fov = defaults.fov
    } else {
      guiParams.lr = defaults.lr
      guiParams.tb = defaults.tb
      camera.left = defaults.lr
      camera.right = -defaults.lr
      camera.top = defaults.tb
      camera.bottom = -defaults.tb
    }
    camera.near = defaults.near
    camera.far = defaults.far
    camera.updateProjectionMatrix()
    gui.controllers.forEach((c) => c.updateDisplay())
  }

  // Little camera body at the projection camera, scaled to the scene size.
  // Attached to the camera so its lens points where the camera looks.
  camera.add(createCameraMesh({ scale: 300 }))

  const cameraHelper = new THREE.CameraHelper(camera)
  scene.add(cameraHelper)

  // camera control
  const controls = new OrbitControls(globalCamera, renderer.domElement)

  // objects
  const cameraRig = new THREE.Group()
  cameraRig.add(camera)
  scene.add(cameraRig)

  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(100, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
  )
  scene.add(mesh)

  const mesh2 = new THREE.Mesh(
    new THREE.SphereGeometry(50, 16, 8),
    new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
  )
  mesh.add(mesh2)

  const geometry = new THREE.BufferGeometry()
  const vertices = []
  for (let i = 0; i < 10000; i++) {
    vertices.push(THREE.MathUtils.randFloatSpread(4000)) // x
    vertices.push(THREE.MathUtils.randFloatSpread(4000)) // y
    vertices.push(THREE.MathUtils.randFloatSpread(4000)) // z
  }
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
  const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }))
  scene.add(particles)

  const r0 = 13.5
  const start = Date.now()
  function animate() {
    const r = (Date.now() - start) * 0.0005

    mesh.position.x = 700 * Math.cos(r0)
    mesh.position.z = 700 * Math.sin(r0)
    mesh.position.y = 700 * Math.sin(r0)
    mesh2.position.x = 150 * Math.cos(r)
    mesh2.position.y = 150 * Math.sin(r)
    mesh2.position.z = 100 * Math.sin(r)
    globalCamera.lookAt(mesh.position)
    cameraRig.lookAt(mesh.position)

    cameraHelper.update()

    controls.target.copy(mesh.position)
    controls.update()

    // render global camera POV
    cameraHelper.visible = true
    renderer.setClearColor(greyDarker, 1)
    renderer.setScissor(0, 0, width, height)
    renderer.setViewport(0, 0, width, height)
    renderer.render(scene, globalCamera)

    // render minimap side
    cameraHelper.visible = false

    // minimap occupies 1/4 of the screen, anchored to the bottom-right corner
    const square = Math.max(height, width) * 0.25
    const margin = 10
    renderer.setClearColor(greyDark, 1)
    renderer.setScissor(width - square - margin, margin, square, square)
    renderer.setViewport(width - square - margin, margin, square, square)
    renderer.render(scene, camera)
  }
}

function main() {
  projectionExplorer('#perspective-projection-animation', 'perspective')
  projectionExplorer('#orthographic-projection-animation', 'orthographic')
}

document.addEventListener('DOMContentLoaded', main)
