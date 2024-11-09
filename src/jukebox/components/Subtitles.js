import { assets } from '../assets.js'
import { shake } from '../utils.js'

/**
 * Transforms the string 00:00:00,000 to ms
 */
function durationToMs(duration) {
  const durationRegexp = /(?<hh>\d+):(?<mm>\d+):(?<ss>\d+),(?<ms>\d+)/
  const { mm, ss, ms } = duration.match(durationRegexp).groups
  return parseInt(ms, 10) + parseInt(ss, 10) * 1000 + parseInt(mm, 10) * 1000 * 60
}

export class Subtitles {
  constructor(parent, { subtitles, video, color }) {
    this.parent = parent
    this.root = new THREE.Object3D()
    this.subtitles = this.processSubtitles(subtitles)
    this.subtitleIdx = 0
    this.video = video
    this.color = color
    this.lastTextAdded = null

    this.parent.on('update', this.onUpdate.bind(this))
    this.parent.on('factor', shake(this.root, 3))
  }

  processSubtitles(subtitles) {
    // the subtitle file has this form:
    //
    // 1
    // 00:00:05,370 --> 00:00:07,370
    // Es por ti
    // <new line>
    const lines = subtitles.split('\n')
    const durationRegexp = /(?<start>\d+:\d+:\d+,\d+) --> (?<end>\d+:\d+:\d+,\d+)/
    const out = []
    for (let i = 0; i < lines.length; i += 4) {
      const id = lines[i + 0].trim()
      const { start, end } = lines[i + 1].match(durationRegexp).groups
      const startMs = durationToMs(start)
      const endMs = durationToMs(end)
      const text = lines[i + 2].trim()
      out.push({ id, start, end, startMs, endMs, text })
    }
    return out
  }

  onUpdate() {
    // console.log(this.video.getElapsedTime() * 1000)
    const elapsedTime = this.video.getElapsedTime() * 1000
    if (this.subtitleIdx > 0 && elapsedTime > this.subtitles[this.subtitleIdx - 1].endMs) {
      this.root.remove(this.lastTextAdded)
      this.lastTextAdded = null
    }

    if (elapsedTime > this.subtitles[this.subtitleIdx].startMs) {
      // console.log('text added', this.subtitles[this.subtitleIdx])
      const shapes = assets.font.generateShapes(this.subtitles[this.subtitleIdx].text, 1)
      const geometry = new THREE.ShapeBufferGeometry(shapes)
      const material = new THREE.MeshBasicMaterial({
        color: this.color || '#ffffff',
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      })
      geometry.computeBoundingBox()
      const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x)
      geometry.translate(xMid, 0, 0)
      const text = new THREE.Mesh(geometry, material)

      this.lastTextAdded = text
      this.root.add(text)
      this.subtitleIdx += 1
    }
  }
}
