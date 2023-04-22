import { shake } from '../utils'
import { assets } from '../assets'

export class Text {
  constructor(parent, { message, size, color }) {
    this.parent = parent
    this.root = new THREE.Object3D()

    const shapes = assets.font.generateShapes(message, size)
    const geometry = new THREE.ShapeBufferGeometry(shapes)
    const material = new THREE.MeshBasicMaterial({
      color: color || '#ffffff',
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    })
    geometry.computeBoundingBox()
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
    geometry.translate(xMid, 0, 0)
    const text = new THREE.Mesh(geometry, material)

    this.root.add(text)
    this.parent.on('factor', shake(text, 3))
  }
}
