import { between } from '../utils.js'
import { assets } from '../assets.js'

const loader = new THREE.TextureLoader()

class Calendar {
  constructor(parent) {
    this.parent = parent
    this.root = new THREE.Object3D()

    const leftTexture = loader.load('/sandbox/jukebox/arrow_left.jpg')
    const rightTexture = loader.load('/sandbox/jukebox/arrow_right.jpg')

    const geometry = new THREE.PlaneGeometry(0.2, 0.2, 0.05)
    const material = (params) =>
      new THREE.MeshLambertMaterial(
        Object.assign(
          {
            transparent: true,
            side: THREE.DoubleSide
          },
          params
        )
      )
    const xDelta = 0.8
    const yDelta = 0.2
    this.left = new THREE.Mesh(geometry, material({ map: leftTexture }))
    this.left.position.x = -xDelta

    this.right = new THREE.Mesh(geometry, material({ map: rightTexture }))
    this.right.position.x = xDelta

    this.root.add(this.left)
    this.root.add(this.right)

    const leftMessage = this.createText('prev')
    leftMessage.position.y += yDelta
    const rightMessage = this.createText('next')
    rightMessage.position.y += yDelta
    this.left.add(leftMessage)
    this.right.add(rightMessage)

    const move = (step) => () => this.parent.emit('move', step)

    this.left.onClick = move(-1)
    this.right.onClick = move(1)

    this.parent.on('factor', (factor) => {
      const k = 5
      const rotationFactor = (between(-k, k) * Math.PI) / 180
      this.root.children.forEach((child) => {
        if (child.isPicked) {
          child.scale.setScalar(1.5)
        } else {
          child.rotation.z = rotationFactor
          child.rotation.x = rotationFactor
          child.rotation.y = rotationFactor
          child.scale.setScalar(1)
        }
      })
    })
  }

  createText(message) {
    const shapes = assets.font.generateShapes(message, 0.05)
    const geometry = new THREE.ShapeBufferGeometry(shapes)
    const material = new THREE.MeshBasicMaterial({
      color: '#ffffff',
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    })
    geometry.computeBoundingBox()
    const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
    geometry.translate(xMid, 0, 0)
    const text = new THREE.Mesh(geometry, material)
    return text
  }
}

export { Calendar }
