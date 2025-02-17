import { EventEmitter } from 'events'
import * as THREE from 'three'
import { shake } from '../utils.js'
import { assets } from '../assets.js'

export class Text {
  parent: EventEmitter
  root: THREE.Object3D

  constructor(parent: EventEmitter, { message, size, color }) {
    this.parent = parent
    this.root = new THREE.Object3D()

    const shapes = assets.font.generateShapes(message, size)
    const geometry = new THREE.ShapeGeometry(shapes)
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
