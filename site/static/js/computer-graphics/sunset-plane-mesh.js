import * as THREE from 'https://esm.sh/three@0.165.0'
import { GLTFLoader } from 'https://esm.sh/three@0.165.0/examples/jsm/loaders/GLTFLoader.js'

const MODEL_URL = '/models/plane/scene.gltf'
let modelPromise

function loadModel() {
  if (!modelPromise) {
    modelPromise = new Promise((resolve, reject) => {
      new GLTFLoader().load(MODEL_URL, (gltf) => resolve(gltf.scene), undefined, reject)
    })
  }
  return modelPromise
}

function cloneMaterials(model, ghost) {
  model.traverse((object) => {
    if (!object.isMesh) return
    object.castShadow = true
    object.receiveShadow = true
    if (!ghost) return

    const materials = Array.isArray(object.material) ? object.material : [object.material]
    object.material = materials.map((material) => {
      const ghostMaterial = material.clone()
      ghostMaterial.wireframe = true
      ghostMaterial.transparent = true
      ghostMaterial.opacity = 0.25
      ghostMaterial.depthWrite = false
      return ghostMaterial
    })
  })
}

export async function loadSunsetPlaneMesh({ ghost = false, rotationY = 0 } = {}) {
  const source = await loadModel()
  const model = source.clone(true)
  model.rotation.y = rotationY
  cloneMaterials(model, ghost)
  return model
}
