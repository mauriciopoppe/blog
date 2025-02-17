import { EventEmitter } from 'events'
import * as THREE from 'three'
import { Video } from './Video.js'
import { between } from '../utils.js'
import { assets } from '../assets.js'

const loader = new THREE.TextureLoader()

class VideoControls {
  parent: EventEmitter
  video: Video
  root: THREE.Object3d
  playButton: THREE.Mesh

  constructor(parent: EventEmitter, video: Video) {
    this.parent = parent
    this.video = video

    this.root = new THREE.Object3D()

    const play = loader.load('/sandbox/jukebox/play-pause.png')

    const geometry = new THREE.PlaneGeometry(1.5, 1.5, 1.5)
    const material = (params: any) =>
      new THREE.MeshLambertMaterial(
        Object.assign(
          {
            transparent: true,
            side: THREE.DoubleSide
          },
          params
        )
      )
    const xDelta = 0
    const yDelta = -7
    this.playButton = new THREE.Mesh(geometry, material({ map: play }))
    this.playButton.position.x = xDelta
    this.playButton.position.y = yDelta
    this.playButton.onClick = () => {
      if (this.video.isPlaying()) {
        this.video.pause()
      } else {
        this.video.play()
      }
    }
    this.root.add(this.playButton)

    const letsgo = this.createText('play/pause')
    letsgo.position.y = -9
    this.root.add(letsgo)

    this.parent.on('factor', () => {
      const k = 5
      const rotationFactor = (between(-k, k) * Math.PI) / 180
      this.root.children.forEach((child: THREE.Object3D) => {
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

  createText(message: string) {
    const shapes = assets.font.generateShapes(message, 1)
    const geometry = new THREE.ShapeGeometry(shapes)
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

export { VideoControls }
