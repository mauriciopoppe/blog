import { between } from '../utils.js'
const loader = new THREE.TextureLoader()

const format = (v) => (v < 10 ? `00${v}` : v < 100 ? `0${v}` : v)

class Image {
  constructor(app, index = 1) {
    const path = `/sandbox/jukebox/pictures/${format(index)}.jpg`
    console.log(`loading path ${path}`)
    const texture = loader.load(path, (texture) => {
      // document.body.append(texture.image)
      // console.log(texture.image.height, texture.image.width)
      // this.geometry.scale.y = texture.image.height
      // this.geometry.scale.x = texture.image.width
      // this.geometry.verticesNeedUpdate = true
    })
    this.geometry = new THREE.PlaneGeometry(10, 10)
    this.material = new THREE.MeshLambertMaterial({
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
      // map: loader.load('https://s3.amazonaws.com/duhaime/blog/tsne-webgl/assets/cat.jpg')
    })
    this.root = new THREE.Mesh(this.geometry, this.material)
    // set the position of the image root in the x,y,z dimensions
    this.root.position.set(0, 0, 0)
    this.root.skipRaycast = true

    app.on('factor', (factor) => {
      const scaleFactor = 0.99 + Math.random() * 0.01
      const rotationFactor = (between(-0.5, 0.5) * Math.PI) / 180
      this.root.rotation.z = rotationFactor
      this.root.rotation.x = rotationFactor
      this.root.rotation.y = rotationFactor

      this.root.scale.x = scaleFactor
      this.root.scale.y = scaleFactor
      this.root.scale.z = scaleFactor
    })
  }

  move(delta, onComplete) {
    const forward = (step) => {
      const forwardParams = { z: 0 }
      return new TWEEN.Tween(forwardParams)
        .to({ z: step }, 300)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(() => {
          this.root.position.z = forwardParams.z
        })
    }
    var sideCoords = { x: 0, opacity: 1 }
    const side = new TWEEN.Tween(sideCoords)
      .to({ x: 10 * delta, opacity: 0 }, 1000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .onUpdate(() => {
        this.root.position.x = sideCoords.x
        this.root.material.opacity = sideCoords.opacity
      })
      .onComplete(onComplete)

    const trigger = forward(1)
    trigger.chain(side)
    trigger.start()
  }
}

export { Image }
