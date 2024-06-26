import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

function perspectiveProjection(el, cameraType = 'perspective') {
  el.style.width = '100%'
  el.style.height = '50vh'
  el.style.position = 'relative'
  const { width, height } = el.getBoundingClientRect()
  const aspect = width / height

  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(width, height)
  renderer.setAnimationLoop(animate)
  renderer.setScissorTest(true)
  el.appendChild(renderer.domElement)

  const globalCamera = new THREE.PerspectiveCamera(75, aspect, 1, 5000)
  globalCamera.position.x = -500
  globalCamera.position.z = 1500

  // cameras
  const guiParams = {
    fov: 50,
    near: 300,
    far: 1000
  }
  const gui = new GUI({ container: el })

  let camera
  if (cameraType === 'perspective') {
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

    // The cameraPerspective params might have been updated by the UI
    cameraHelper.update()

    controls.target.copy(mesh.position)
    controls.update()

    // render global camera POV
    cameraHelper.visible = true
    renderer.setClearColor(0x111111, 1)
    renderer.setScissor(0, 0, width, height)
    renderer.setViewport(0, 0, width, height)
    renderer.render(scene, globalCamera)

    // render minimap side
    cameraHelper.visible = false

    // minimap occupies 1/4 of the screen
    const square = Math.max(height, width) * 0.25
    renderer.setClearColor(0x000000, 1)
    renderer.setScissor(0, 0, square, square)
    renderer.setViewport(0, 0, square, square)
    renderer.render(scene, camera)
  }
}

function main() {
  perspectiveProjection(document.querySelector('#perspective-projection-animation'), 'perspective')
  perspectiveProjection(document.querySelector('#orthographic-projection-animation'), 'orthographic')
}

document.addEventListener('DOMContentLoaded', main)
