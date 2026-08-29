/**
 * Reusable stylized 3D camera built from simple primitives.
 *
 * The camera body is a small group whose lens points along the local negative
 * z-axis, matching a THREE camera's view direction. Used by the view transform
 * and projection explorers.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import * as THREE from 'https://esm.sh/three@0.165.0'

function getCssColor(varName, fallbackHex) {
  if (typeof window === 'undefined') return fallbackHex
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  if (!val) return fallbackHex
  if (val.startsWith('#')) return parseInt(val.slice(1), 16)
  if (val.startsWith('rgb')) {
    const matches = val.match(/\d+/g)
    if (matches && matches.length >= 3) {
      return (parseInt(matches[0]) << 16) + (parseInt(matches[1]) << 8) + parseInt(matches[2])
    }
  }
  return fallbackHex
}

export function createCameraMesh(options = {}) {
  const { scale = 1 } = options
  const group = new THREE.Group()

  const greyDark = getCssColor('--grey-dark', 0x2b2b2b)
  const bodyMat = new THREE.MeshStandardMaterial({ color: greyDark, roughness: 0.5, metalness: 0.2 })
  const lensMat = new THREE.MeshStandardMaterial({ color: greyDark, roughness: 0.3, metalness: 0.5 })
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.1, metalness: 0.8, emissive: 0x0284c7, emissiveIntensity: 0.4 })
  const accentMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.3, metalness: 0.5, emissive: 0x9f1239, emissiveIntensity: 0.3 })
  const edgeMat = new THREE.LineBasicMaterial({ color: 0xf43f5e, transparent: true, opacity: 0.85 })

  // 1. Camera Body Box
  const bodyGeom = new THREE.BoxGeometry(0.34, 0.22, 0.20)
  const body = new THREE.Mesh(bodyGeom, bodyMat)
  const bodyEdges = new THREE.LineSegments(new THREE.EdgesGeometry(bodyGeom), edgeMat)
  group.add(body)
  group.add(bodyEdges)

  // 2. Viewfinder Prism on Top
  const viewGeom = new THREE.BoxGeometry(0.13, 0.07, 0.15)
  const viewMesh = new THREE.Mesh(viewGeom, bodyMat)
  viewMesh.position.set(0, 0.13, -0.01)
  const viewEdges = new THREE.LineSegments(new THREE.EdgesGeometry(viewGeom), edgeMat)
  viewEdges.position.copy(viewMesh.position)
  group.add(viewMesh)
  group.add(viewEdges)

  // 3. Lens Cylinder (pointing forward along -z)
  const lensGeom = new THREE.CylinderGeometry(0.085, 0.085, 0.14, 16)
  lensGeom.rotateX(Math.PI / 2)
  const lens = new THREE.Mesh(lensGeom, lensMat)
  lens.position.set(0, 0, -0.14)
  group.add(lens)

  // 4. Lens Front Glass & Accent Ring
  const glassGeom = new THREE.CylinderGeometry(0.07, 0.07, 0.02, 16)
  glassGeom.rotateX(Math.PI / 2)
  const glass = new THREE.Mesh(glassGeom, glassMat)
  glass.position.set(0, 0, -0.21)
  group.add(glass)

  // 5. Top Shutter Dial
  const dialGeom = new THREE.CylinderGeometry(0.032, 0.032, 0.035, 12)
  const dial = new THREE.Mesh(dialGeom, accentMat)
  dial.position.set(0.11, 0.12, 0.02)
  group.add(dial)

  if (scale !== 1) {
    group.scale.set(scale, scale, scale)
  }
  return group
}
