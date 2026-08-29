import { describe, it, expect } from 'bun:test'
import * as THREE from 'three'

export const FRAME_PRESETS = {
  default_camera: {
    id: 'default_camera',
    title: 'General 3D Camera',
    description: 'General 3D Camera ($\\mathbf{R}^T \\mathbf{T}_{-\\mathbf{e}}$): Camera at $\\mathbf{e} = (2.0, 1.5, 3.0)$ pitched and yawed looking toward $\\mathbf{p}$. Translates by $-\\mathbf{e}$ then rotates by $\\mathbf{R}^T$ to align with the canonical origin.',
    eye: [2.0, 1.5, 3.0],
    target: [0.5, 0.8, -0.5],
    pointLocal: [-0.3, 0.2, -3.2]
  },
  top_down: {
    id: 'top_down',
    title: 'Top-Down Camera',
    description: 'Top-Down Camera: The camera hovers above at $\\mathbf{e} = (0.6, 4.8, 0.6)$ looking straight down at the origin. Step 1 ($\\mathbf{T}_{-\\mathbf{e}}$) drops the eye onto the origin, and Step 2 ($\\mathbf{R}^T$) swings the world through $90^\\circ$ to align the camera with the canonical axes.',
    eye: [0.6, 4.8, 0.6],
    target: [0.6, 0.0, 0.6],
    pointLocal: [0.3, 0.1, -2.2]
  },
  pure_offset: {
    id: 'pure_offset',
    title: 'Pure Translation',
    description: 'Pure Translation ($\\mathbf{R} = \\mathbf{I}$): Camera axes $(u,v,w)$ are already parallel to $(x,y,z)$. Step 1 ($\\mathbf{T}_{-\\mathbf{e}}$) performs the entire transform, while Step 2 ($\\mathbf{R}^T$) is an identity no-op.',
    eye: [2.2, 1.4, 1.8],
    target: [2.2, 1.4, -1.8],
    pointLocal: [-0.4, 0.3, -2.8]
  }
}

export function createBasisMatrix(u, v, w, e) {
  const m = new THREE.Matrix4()
  m.set(
    u.x, v.x, w.x, e.x,
    u.y, v.y, w.y, e.y,
    u.z, v.z, w.z, e.z,
    0,   0,   0,   1
  )
  return m
}

export function computeViewMatrix(u, v, w, e) {
  const m = createBasisMatrix(u, v, w, e)
  const inv = new THREE.Matrix4()
  inv.copy(m).invert()
  return inv
}

describe('Coordinate Frame & Camera View Matrix Mathematics', () => {
  it('correctly constructs frame-to-world basis matrix [u v w e]', () => {
    const u = new THREE.Vector3(1, 0, 0)
    const v = new THREE.Vector3(0, 1, 0)
    const w = new THREE.Vector3(0, 0, 1)
    const e = new THREE.Vector3(2.5, 1.2, 3.8)

    const mat = createBasisMatrix(u, v, w, e)
    const el = mat.elements // column-major

    // Column 0: u
    expect(el[0]).toBeCloseTo(1, 5)
    expect(el[1]).toBeCloseTo(0, 5)
    expect(el[2]).toBeCloseTo(0, 5)
    expect(el[3]).toBeCloseTo(0, 5)

    // Column 1: v
    expect(el[4]).toBeCloseTo(0, 5)
    expect(el[5]).toBeCloseTo(1, 5)
    expect(el[6]).toBeCloseTo(0, 5)
    expect(el[7]).toBeCloseTo(0, 5)

    // Column 2: w
    expect(el[8]).toBeCloseTo(0, 5)
    expect(el[9]).toBeCloseTo(0, 5)
    expect(el[10]).toBeCloseTo(1, 5)
    expect(el[11]).toBeCloseTo(0, 5)

    // Column 3: e
    expect(el[12]).toBeCloseTo(2.5, 5)
    expect(el[13]).toBeCloseTo(1.2, 5)
    expect(el[14]).toBeCloseTo(3.8, 5)
    expect(el[15]).toBeCloseTo(1, 5)
  })

  it('computes exact inverse View Matrix M_view = R^T * T_{-e}', () => {
    // 45 degree yaw rotation on Y + eye translation
    const theta = Math.PI / 4
    const u = new THREE.Vector3(Math.cos(theta), 0, -Math.sin(theta))
    const v = new THREE.Vector3(0, 1, 0)
    const w = new THREE.Vector3(Math.sin(theta), 0, Math.cos(theta))
    const e = new THREE.Vector3(3, 2, 5)

    const frameMat = createBasisMatrix(u, v, w, e)
    const viewMat = computeViewMatrix(u, v, w, e)

    // Check M_view * M_frame = Identity
    const product = new THREE.Matrix4().multiplyMatrices(viewMat, frameMat)
    const pEl = product.elements

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        const expected = r === c ? 1 : 0
        expect(pEl[c * 4 + r]).toBeCloseTo(expected, 4)
      }
    }
  })

  it('performs exact round-trip coordinate transformations: p_xyz <-> p_uvw', () => {
    const u = new THREE.Vector3(0, 0, -1)
    const v = new THREE.Vector3(0, 1, 0)
    const w = new THREE.Vector3(1, 0, 0)
    const e = new THREE.Vector3(4.0, 1.5, -2.0)

    const frameMat = createBasisMatrix(u, v, w, e)
    const viewMat = computeViewMatrix(u, v, w, e)

    // Point in local frame (u, v, w)
    const pLocal = new THREE.Vector3(1.2, -0.8, 3.4)

    // Forward transform: p_world = M * p_local
    const pWorld = pLocal.clone().applyMatrix4(frameMat)

    // Verify p_world = e + u*p.u + v*p.v + w*p.w
    const manualWorld = e.clone()
      .addScaledVector(u, pLocal.x)
      .addScaledVector(v, pLocal.y)
      .addScaledVector(w, pLocal.z)

    expect(pWorld.x).toBeCloseTo(manualWorld.x, 5)
    expect(pWorld.y).toBeCloseTo(manualWorld.y, 5)
    expect(pWorld.z).toBeCloseTo(manualWorld.z, 5)

    // Inverse transform: p_recovered_local = M_view * p_world
    const pRecovered = pWorld.clone().applyMatrix4(viewMat)
    expect(pRecovered.x).toBeCloseTo(pLocal.x, 5)
    expect(pRecovered.y).toBeCloseTo(pLocal.y, 5)
    expect(pRecovered.z).toBeCloseTo(pLocal.z, 5)
  })

  it('validates that all preset configurations have orthonormal basis frames', () => {
    for (const [key, preset] of Object.entries(FRAME_PRESETS)) {
      const eye = new THREE.Vector3(...preset.eye)
      const target = new THREE.Vector3(...preset.target)

      const w = new THREE.Vector3().subVectors(eye, target).normalize()
      let up = new THREE.Vector3(0, 1, 0)
      if (Math.abs(w.dot(up)) > 0.95) up = new THREE.Vector3(0, 0, 1)

      const u = new THREE.Vector3().crossVectors(up, w).normalize()
      const v = new THREE.Vector3().crossVectors(w, u).normalize()

      if (preset.rollAngle) {
        u.applyAxisAngle(w, preset.rollAngle).normalize()
        v.applyAxisAngle(w, preset.rollAngle).normalize()
      }

      // Orthogonality: dot products must be 0
      expect(u.dot(v)).toBeCloseTo(0, 5)
      expect(u.dot(w)).toBeCloseTo(0, 5)
      expect(v.dot(w)).toBeCloseTo(0, 5)

      // Unit lengths: lengths must be 1
      expect(u.length()).toBeCloseTo(1, 5)
      expect(v.length()).toBeCloseTo(1, 5)
      expect(w.length()).toBeCloseTo(1, 5)
    }
  })
})
