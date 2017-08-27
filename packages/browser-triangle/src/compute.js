import { vec4, mat4 } from 'gl-matrix'
import { toRad } from './utils'

export function equilateral (side) {
  const hi = side / 2
  const lo = Math.tan(toRad(30)) * hi
  const hyp = Math.sqrt(hi * hi + lo * lo)
  // vec4
  return [
    [0, hyp, 0, 1],   // top
    [-hi, -lo, 0, 1], // left
    [hi, -lo, 0, 1]   // right
  ]
}

export function nest ({ triangle, rotate, scale, iterations = 1 }) {
  const out = []
  for (let i = 0; i < iterations; i += 1) {
    const nt = []
    for (let j = 0; j < 3; j += 1) {
      let t = [...triangle[j]]
      if (rotate) {
        const mat = mat4.rotateZ([], mat4.create(), rotate(i))
        t = vec4.transformMat4([], t, mat)
      }
      if (scale) {
        const mat = mat4.multiplyScalar([], mat4.create(), scale(i))
        t = vec4.transformMat4([], t, mat)
      }
      nt.push(t)
    }
    out.push(nt)
  }
  return out
}
