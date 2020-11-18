import * as THREE from 'three'
import create from 'zustand'
import { addEffect, extend } from 'react-three-fiber'
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
extend({ OrbitControls })

// poor man seeded random generator
let seed = Math.PI / 4
window.Math.random = function () {
  const x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

function generateHeight(width, height) {
  const size = width * height
  const data = new Uint8Array(size)
  const perlin = new ImprovedNoise()
  const z = Math.random() * 100

  let quality = 1

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < size; i++) {
      const x = i % width
      const y = ~~(i / width)
      data[i] += Math.abs(perlin.noise(x / quality, y / quality, z) * quality * 1.75)
    }

    quality *= 5
  }

  return data
}

const useStore = create((set, get) => {
  const worldWidth = 128
  const worldHeight = 128
  const geometry = new THREE.PlaneBufferGeometry(128, 128, worldWidth - 1, worldHeight - 1)
  geometry.rotateX(-Math.PI / 2)

  const vertices = geometry.attributes.position.array

  const data = generateHeight(worldWidth, worldHeight)
  for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
    // modify the y coordinate of the generated geometry to the result of the noise
    vertices[j + 1] = data[i]
  }
  const material = new THREE.MeshPhongMaterial()

  return {
    mutation: {
      camera: null,
      fov: 70,
      terrainGeometry: geometry,
      terrainMaterial: material,
      clock: new THREE.Clock(false),
      mouse: new THREE.Vector2(-250, 50)
    },
    actions: {
      init(camera) {
        const { mutation, actions } = get()
        set({ camera })
        mutation.clock.start()
        console.log(mutation.clock)

        // addEffect(() => {
        //
        // }, [])
      },
      updateMouse({ clientX: x, clientY: y }) {
        get().mutation.mouse.set(x - window.innerWidth / 2, y - window.innerHeight / 2)
      }
    }
  }
})

export default useStore
