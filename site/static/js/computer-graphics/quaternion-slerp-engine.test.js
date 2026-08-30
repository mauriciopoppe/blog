import { describe, it, expect } from 'bun:test'

function normalizeQuaternion(q) {
  const len = Math.hypot(q[0], q[1], q[2], q[3])
  if (len < 1e-9) return [1, 0, 0, 0]
  return [q[0] / len, q[1] / len, q[2] / len, q[3] / len]
}

function quaternionDot(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3]
}

function quaternionSlerp(q1, q2, t) {
  let [w1, x1, y1, z1] = normalizeQuaternion(q1)
  let [w2, x2, y2, z2] = normalizeQuaternion(q2)

  let dot = w1 * w2 + x1 * x2 + y1 * y2 + z1 * z2

  if (dot < 0) {
    w2 = -w2
    x2 = -x2
    y2 = -y2
    z2 = -z2
    dot = -dot
  }

  if (dot > 0.9995) {
    const w = w1 + t * (w2 - w1)
    const x = x1 + t * (x2 - x1)
    const y = y1 + t * (y2 - y1)
    const z = z1 + t * (z2 - z1)
    return normalizeQuaternion([w, x, y, z])
  }

  const theta0 = Math.acos(Math.min(Math.max(dot, -1), 1))
  const theta = theta0 * t
  const sinTheta = Math.sin(theta)
  const sinTheta0 = Math.sin(theta0)

  const s1 = Math.cos(theta) - (dot * sinTheta) / sinTheta0
  const s2 = sinTheta / sinTheta0

  const w = s1 * w1 + s2 * w2
  const x = s1 * x1 + s2 * x2
  const y = s1 * y1 + s2 * y2
  const z = s1 * z1 + s2 * z2

  return normalizeQuaternion([w, x, y, z])
}

function computeAngularDistance(q1, q2) {
  const dot = Math.abs(quaternionDot(normalizeQuaternion(q1), normalizeQuaternion(q2)))
  const clamped = Math.min(Math.max(dot, -1), 1)
  return 2 * Math.acos(clamped)
}

describe('Quaternion SLERP Mathematics & Interpolation', () => {
  it('correctly returns boundary values at t = 0 and t = 1', () => {
    const q1 = [1, 0, 0, 0] // Identity
    const q2 = [Math.cos(Math.PI / 4), 0, 0, Math.sin(Math.PI / 4)] // 90 deg yaw around Z

    const at0 = quaternionSlerp(q1, q2, 0)
    expect(at0[0]).toBeCloseTo(q1[0], 5)
    expect(at0[1]).toBeCloseTo(q1[1], 5)
    expect(at0[2]).toBeCloseTo(q1[2], 5)
    expect(at0[3]).toBeCloseTo(q1[3], 5)

    const at1 = quaternionSlerp(q1, q2, 1)
    expect(at1[0]).toBeCloseTo(q2[0], 5)
    expect(at1[1]).toBeCloseTo(q2[1], 5)
    expect(at1[2]).toBeCloseTo(q2[2], 5)
    expect(at1[3]).toBeCloseTo(q2[3], 5)
  })

  it('maintains constant angular speed along the geodesic arc', () => {
    const q1 = [1, 0, 0, 0]
    const q2 = [Math.cos(Math.PI / 4), 0, Math.sin(Math.PI / 4), 0] // 90 deg around Y

    const totalAngle = computeAngularDistance(q1, q2)
    expect(totalAngle).toBeCloseTo(Math.PI / 2, 4)

    const atQuarter = quaternionSlerp(q1, q2, 0.25)
    const angleQuarter = computeAngularDistance(q1, atQuarter)
    expect(angleQuarter).toBeCloseTo((Math.PI / 2) * 0.25, 4)

    const atHalf = quaternionSlerp(q1, q2, 0.5)
    const angleHalf = computeAngularDistance(q1, atHalf)
    expect(angleHalf).toBeCloseTo((Math.PI / 2) * 0.5, 4)

    const atThreeQuarters = quaternionSlerp(q1, q2, 0.75)
    const angleThreeQuarters = computeAngularDistance(q1, atThreeQuarters)
    expect(angleThreeQuarters).toBeCloseTo((Math.PI / 2) * 0.75, 4)
  })

  it('correctly handles antipodal quaternion pairs (q and -q represent same orientation)', () => {
    const q1 = [1, 0, 0, 0]
    // Negative scalar representation of a small 10 degree rotation
    const angle = (10 * Math.PI) / 180
    const q2 = [-Math.cos(angle / 2), 0, -Math.sin(angle / 2), 0]

    // Dot product is negative:
    expect(quaternionDot(q1, q2)).toBeLessThan(0)

    // SLERP should take the shortest arc (10 deg), not the long way around (350 deg)
    const mid = quaternionSlerp(q1, q2, 0.5)
    const distToMid = computeAngularDistance(q1, mid)
    expect(distToMid).toBeCloseTo(angle / 2, 4)
  })

  it('preserves unit norm throughout interpolation', () => {
    const q1 = normalizeQuaternion([0.5, 0.5, 0.5, 0.5])
    const q2 = normalizeQuaternion([0.7071, -0.7071, 0, 0])

    for (let t = 0; t <= 1.0; t += 0.1) {
      const qt = quaternionSlerp(q1, q2, t)
      const norm = Math.hypot(qt[0], qt[1], qt[2], qt[3])
      expect(norm).toBeCloseTo(1.0, 5)
    }
  })

  it('computes rotation plane normal strictly perpendicular to forward trajectory vectors', () => {
    function rotateVec(q, v) {
      const [w, x, y, z] = normalizeQuaternion(q)
      const [vx, vy, vz] = v
      // v' = v + 2 * cross(q_v, cross(q_v, v) + w * v)
      const cx = y * vz - z * vy + w * vx
      const cy = z * vx - x * vz + w * vy
      const cz = x * vy - y * vx + w * vz
      return [
        vx + 2 * (y * cz - z * cy),
        vy + 2 * (z * cx - x * cz),
        vz + 2 * (x * cy - y * cx)
      ]
    }

    const q1 = [1, 0, 0, 0]
    const q2 = [Math.cos(Math.PI / 4), 0, Math.sin(Math.PI / 4), 0] // 90 deg turn around Y

    const v1 = rotateVec(q1, [0, 0, -1])
    const v2 = rotateVec(q2, [0, 0, -1])

    // Normal = cross(v1, v2)
    const nx = v1[1] * v2[2] - v1[2] * v2[1]
    const ny = v1[2] * v2[0] - v1[0] * v2[2]
    const nz = v1[0] * v2[1] - v1[1] * v2[0]
    const nLen = Math.hypot(nx, ny, nz)
    const normal = [nx / nLen, ny / nLen, nz / nLen]

    // Dot product with v1 and v2 must be 0 (strictly perpendicular)
    const dot1 = v1[0] * normal[0] + v1[1] * normal[1] + v1[2] * normal[2]
    const dot2 = v2[0] * normal[0] + v2[1] * normal[1] + v2[2] * normal[2]

    expect(dot1).toBeCloseTo(0, 6)
    expect(dot2).toBeCloseTo(0, 6)
  })
})
