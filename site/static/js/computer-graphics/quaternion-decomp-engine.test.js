import { describe, it, expect } from 'bun:test'

function decomposeVector(v, nHat) {
  const nLen = Math.hypot(nHat[0], nHat[1], nHat[2]) || 1
  const nx = nHat[0] / nLen
  const ny = nHat[1] / nLen
  const nz = nHat[2] / nLen

  const dot = v[0] * nx + v[1] * ny + v[2] * nz
  const vParallel = [dot * nx, dot * ny, dot * nz]
  const vPerp = [v[0] - vParallel[0], v[1] - vParallel[1], v[2] - vParallel[2]]

  const nCrossVPerp = [
    ny * vPerp[2] - nz * vPerp[1],
    nz * vPerp[0] - nx * vPerp[2],
    nx * vPerp[1] - ny * vPerp[0]
  ]

  return {
    dot,
    vParallel,
    vPerp,
    nCrossVPerp
  }
}

function rotateVectorByAxisAngle(v, nHat, angleRad) {
  const { vParallel, vPerp, nCrossVPerp } = decomposeVector(v, nHat)
  const cosA = Math.cos(angleRad)
  const sinA = Math.sin(angleRad)

  const vPerpPrime = [
    cosA * vPerp[0] + sinA * nCrossVPerp[0],
    cosA * vPerp[1] + sinA * nCrossVPerp[1],
    cosA * vPerp[2] + sinA * nCrossVPerp[2]
  ]

  const vPrime = [
    vParallel[0] + vPerpPrime[0],
    vParallel[1] + vPerpPrime[1],
    vParallel[2] + vPerpPrime[2]
  ]

  return {
    vPerpPrime,
    vPrime
  }
}

describe('3D Vector Orthogonal Decomposition & Sandwich Rotation', () => {
  it('correctly decomposes arbitrary 3D vector into parallel and perpendicular components', () => {
    const v = [1.2, 0.9, 0]
    const nHat = [0, 1, 0]

    const { dot, vParallel, vPerp } = decomposeVector(v, nHat)

    expect(dot).toBeCloseTo(0.9, 5)
    expect(vParallel[0]).toBeCloseTo(0, 5)
    expect(vParallel[1]).toBeCloseTo(0.9, 5)
    expect(vParallel[2]).toBeCloseTo(0, 5)

    expect(vPerp[0]).toBeCloseTo(1.2, 5)
    expect(vPerp[1]).toBeCloseTo(0, 5)
    expect(vPerp[2]).toBeCloseTo(0, 5)

    // Parallel + Perpendicular = Original
    expect(vParallel[0] + vPerp[0]).toBeCloseTo(v[0], 5)
    expect(vParallel[1] + vPerp[1]).toBeCloseTo(v[1], 5)
    expect(vParallel[2] + vPerp[2]).toBeCloseTo(v[2], 5)

    // Orthogonality: v_parallel . v_perp = 0
    const inner = vParallel[0] * vPerp[0] + vParallel[1] * vPerp[1] + vParallel[2] * vPerp[2]
    expect(inner).toBeCloseTo(0, 5)
  })

  it('correctly handles strictly perpendicular case (v . n_hat = 0)', () => {
    const v = [1.5, 0, 0]
    const nHat = [0, 1, 0]

    const { dot, vParallel, vPerp } = decomposeVector(v, nHat)

    expect(dot).toBeCloseTo(0, 5)
    expect(vParallel[0]).toBeCloseTo(0, 5)
    expect(vParallel[1]).toBeCloseTo(0, 5)
    expect(vParallel[2]).toBeCloseTo(0, 5)

    expect(vPerp[0]).toBeCloseTo(1.5, 5)
    expect(vPerp[1]).toBeCloseTo(0, 5)
    expect(vPerp[2]).toBeCloseTo(0, 5)
  })

  it('rotates perpendicular vector by 90 degrees around Y axis correctly', () => {
    const v = [1.0, 0, 0]
    const nHat = [0, 1, 0]
    const angleRad = Math.PI / 2

    const { vPerpPrime, vPrime } = rotateVectorByAxisAngle(v, nHat, angleRad)

    // Initial [1, 0, 0] rotated 90 deg around +Y gives [0, 0, -1]
    expect(vPerpPrime[0]).toBeCloseTo(0, 5)
    expect(vPerpPrime[1]).toBeCloseTo(0, 5)
    expect(vPerpPrime[2]).toBeCloseTo(-1.0, 5)

    expect(vPrime[0]).toBeCloseTo(0, 5)
    expect(vPrime[1]).toBeCloseTo(0, 5)
    expect(vPrime[2]).toBeCloseTo(-1.0, 5)
  })

  it('preserves vector length under arbitrary rotation', () => {
    const v = [1.2, 0.9, -0.5]
    const nHat = [0, 1, 0]
    const angleRad = 1.234

    const { vPrime } = rotateVectorByAxisAngle(v, nHat, angleRad)

    const lenOrig = Math.hypot(v[0], v[1], v[2])
    const lenPrime = Math.hypot(vPrime[0], vPrime[1], vPrime[2])

    expect(lenPrime).toBeCloseTo(lenOrig, 5)
  })
})
