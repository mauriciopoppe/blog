/*
 * Unit tests for 3D Transformation Matrix Engine and Mathematics
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { describe, it, expect } from 'bun:test'
import * as THREE from 'three'

describe('3D Matrix Transformation Math & Ordering', () => {
  it('correctly constructs basic 4x4 affine transformation matrices', () => {
    // Translation matrix
    const T = new THREE.Matrix4().makeTranslation(3, 4, 5)
    const v = new THREE.Vector3(1, 1, 1).applyMatrix4(T)
    expect(v.x).toBeCloseTo(4)
    expect(v.y).toBeCloseTo(5)
    expect(v.z).toBeCloseTo(6)

    // Scale matrix
    const S = new THREE.Matrix4().makeScale(2, 0.5, 3)
    const v2 = new THREE.Vector3(2, 4, 1).applyMatrix4(S)
    expect(v2.x).toBeCloseTo(4)
    expect(v2.y).toBeCloseTo(2)
    expect(v2.z).toBeCloseTo(3)

    // Rotation Y matrix (90 deg)
    const R = new THREE.Matrix4().makeRotationY(Math.PI / 2)
    const v3 = new THREE.Vector3(1, 0, 0).applyMatrix4(R)
    expect(v3.x).toBeCloseTo(0)
    expect(v3.y).toBeCloseTo(0)
    expect(v3.z).toBeCloseTo(-1)
  })

  it('demonstrates non-commutativity: TRS != RTS (Standard vs Orbit)', () => {
    const S = new THREE.Matrix4().makeScale(2, 2, 2)
    const R = new THREE.Matrix4().makeRotationY(Math.PI / 2) // 90 deg around Y
    const T = new THREE.Matrix4().makeTranslation(5, 0, 0)

    // Standard TRS: applied Scale first, then Rotate, then Translate (M = T * R * S)
    const M_trs = new THREE.Matrix4().identity()
    M_trs.premultiply(S)
    M_trs.premultiply(R)
    M_trs.premultiply(T)

    // Orbit RTS: applied Translate first, then Rotate, then Scale (M = S * R * T)
    const M_rts = new THREE.Matrix4().identity()
    M_rts.premultiply(T)
    M_rts.premultiply(R)
    M_rts.premultiply(S)

    const vTest = new THREE.Vector3(1, 0, 0)

    const v_trs = vTest.clone().applyMatrix4(M_trs)
    // S: (2, 0, 0) -> R: (0, 0, -2) -> T: (5, 0, -2)
    expect(v_trs.x).toBeCloseTo(5)
    expect(v_trs.y).toBeCloseTo(0)
    expect(v_trs.z).toBeCloseTo(-2)

    const v_rts = vTest.clone().applyMatrix4(M_rts)
    // T: (6, 0, 0) -> R: (0, 0, -6) -> S: (0, 0, -12)
    expect(v_rts.x).toBeCloseTo(0)
    expect(v_rts.y).toBeCloseTo(0)
    expect(v_rts.z).toBeCloseTo(-12)

    // TRS and RTS must be drastically different
    expect(v_trs.x).not.toEqual(v_rts.x)
    expect(v_trs.z).not.toEqual(v_rts.z)
  })

  it('decomposes and interpolates between identity and target transformation matrices via SLERP & LERP', () => {
    const startMat = new THREE.Matrix4().identity()
    const endMat = new THREE.Matrix4().compose(
      new THREE.Vector3(4, 2, -1),
      new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2),
      new THREE.Vector3(2, 2, 2)
    )

    const pStart = new THREE.Vector3()
    const qStart = new THREE.Quaternion()
    const sStart = new THREE.Vector3()
    startMat.decompose(pStart, qStart, sStart)

    const pEnd = new THREE.Vector3()
    const qEnd = new THREE.Quaternion()
    const sEnd = new THREE.Vector3()
    endMat.decompose(pEnd, qEnd, sEnd)

    // Midpoint interpolation t = 0.5
    const t = 0.5
    const pMid = new THREE.Vector3().lerpVectors(pStart, pEnd, t)
    const qMid = new THREE.Quaternion().copy(qStart).slerp(qEnd, t)
    const sMid = new THREE.Vector3().lerpVectors(sStart, sEnd, t)

    expect(pMid.x).toBeCloseTo(2)
    expect(pMid.y).toBeCloseTo(1)
    expect(pMid.z).toBeCloseTo(-0.5)

    expect(sMid.x).toBeCloseTo(1.5)
    expect(sMid.y).toBeCloseTo(1.5)
    expect(sMid.z).toBeCloseTo(1.5)

    const midMat = new THREE.Matrix4().compose(pMid, qMid, sMid)
    expect(midMat.elements.length).toBe(16)
  })
})
