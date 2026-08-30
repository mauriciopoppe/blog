/*
 * Shared spacecraft / plane mesh used by the interactive computer graphics simulators.
 *
 * createSpacecraftMesh builds a toy plane out of Three.js primitives: a fuselage cone,
 * cockpit canopy, delta wings, vertical tail fin, and horizontal tailplane, each with a
 * dim palette derived from the site's accent colors. The ghost variant renders the same
 * silhouette as a wireframe.
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

export function createSpacecraftMesh(isGhost = false) {
  const group = new THREE.Group()

  const greyHex = getCssColor('--grey', 0x4f4f4f)

  if (isGhost) {
    const ghostMat = new THREE.MeshBasicMaterial({
      color: greyHex,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    })

    const fuselageGeo = new THREE.ConeGeometry(0.35, 1.6, 6)
    fuselageGeo.rotateX(-Math.PI / 2)
    group.add(new THREE.Mesh(fuselageGeo, ghostMat))

    const wingShape = new THREE.Shape()
    wingShape.moveTo(0, 0.5)
    wingShape.lineTo(1.1, -0.4)
    wingShape.lineTo(0.9, -0.5)
    wingShape.lineTo(-0.9, -0.5)
    wingShape.lineTo(-1.1, -0.4)
    wingShape.closePath()

    const wingGeo = new THREE.ExtrudeGeometry(wingShape, { depth: 0.04, bevelEnabled: false })
    wingGeo.rotateX(-Math.PI / 2)
    wingGeo.translate(0, 0, 0.02)
    group.add(new THREE.Mesh(wingGeo, ghostMat))

    const finShape = new THREE.Shape()
    finShape.moveTo(-0.09, 0.24)
    finShape.lineTo(0.09, 0.24)
    finShape.lineTo(0.07, 0.6)
    finShape.lineTo(-0.07, 0.6)
    finShape.closePath()
    const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.03, bevelEnabled: false })
    finGeo.translate(0, 0, 0.42)
    group.add(new THREE.Mesh(finGeo, ghostMat))

    const tailShape = new THREE.Shape()
    tailShape.moveTo(0, 0.16)
    tailShape.lineTo(0.48, -0.1)
    tailShape.lineTo(0.42, -0.14)
    tailShape.lineTo(-0.42, -0.14)
    tailShape.lineTo(-0.48, -0.1)
    tailShape.closePath()
    const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.03, bevelEnabled: false })
    tailGeo.rotateX(-Math.PI / 2)
    tailGeo.translate(0, 0.18, 0.48)
    group.add(new THREE.Mesh(tailGeo, ghostMat))

    return group
  }

  // Active Craft Materials (dim palette: site accent greens, blues, yellows)
  const fuselageMat = new THREE.MeshStandardMaterial({
    color: 0x2f6db3, // dim blue (site blue #3b82f6 family)
    roughness: 0.55,
    metalness: 0.3
  })

  const wingMat = new THREE.MeshStandardMaterial({
    color: 0x1e9e50, // dim green (site green #22c55e family)
    roughness: 0.5,
    metalness: 0.35
  })

  const finMat = new THREE.MeshStandardMaterial({
    color: 0xd39b2f, // dim amber (site yellow #fbbf24 family)
    roughness: 0.5,
    metalness: 0.3
  })

  const cockpitMat = new THREE.MeshStandardMaterial({
    color: 0x2d7bb8, // lighter blue glass
    roughness: 0.1,
    metalness: 0.5,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.35,
    transparent: true,
    opacity: 0.85
  })

  const edgeMat = new THREE.LineBasicMaterial({
    color: 0x94a3b8, // neutral slate edge so the body colors lead
    transparent: true,
    opacity: 0.5
  })

  // 1. Fuselage
  const fuselageGeo = new THREE.ConeGeometry(0.35, 1.6, 6)
  fuselageGeo.rotateX(-Math.PI / 2)
  const fuselage = new THREE.Mesh(fuselageGeo, fuselageMat)
  const fuselageEdges = new THREE.LineSegments(new THREE.EdgesGeometry(fuselageGeo), edgeMat)
  group.add(fuselage)
  group.add(fuselageEdges)

  // 2. Cockpit Canopy
  const cockpitGeo = new THREE.SphereGeometry(0.18, 12, 12)
  cockpitGeo.scale(1, 1, 1.8)
  const cockpit = new THREE.Mesh(cockpitGeo, cockpitMat)
  cockpit.position.set(0, 0.14, -0.15)
  group.add(cockpit)

  // 3. Delta Wings
  const wingShape = new THREE.Shape()
  wingShape.moveTo(0, 0.5)
  wingShape.lineTo(1.1, -0.4)
  wingShape.lineTo(0.9, -0.5)
  wingShape.lineTo(-0.9, -0.5)
  wingShape.lineTo(-1.1, -0.4)
  wingShape.closePath()

  const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 }
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, extrudeSettings)
  wingGeo.rotateX(-Math.PI / 2)
  wingGeo.translate(0, 0, 0.02)
  const wings = new THREE.Mesh(wingGeo, wingMat)
  const wingEdges = new THREE.LineSegments(new THREE.EdgesGeometry(wingGeo), edgeMat)
  group.add(wings)
  group.add(wingEdges)

  // 4. Vertical Tail Fin (swept, centered on the fuselage)
  const finShape = new THREE.Shape()
  finShape.moveTo(-0.09, 0.24)
  finShape.lineTo(0.09, 0.24)
  finShape.lineTo(0.07, 0.6)
  finShape.lineTo(-0.07, 0.6)
  finShape.closePath()

  const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.03, bevelEnabled: false })
  finGeo.translate(0, 0, 0.42)
  const fin = new THREE.Mesh(finGeo, finMat)
  const finEdges = new THREE.LineSegments(new THREE.EdgesGeometry(finGeo), edgeMat)
  group.add(fin)
  group.add(finEdges)

  // 5. Horizontal Tailplane
  const tailShape = new THREE.Shape()
  tailShape.moveTo(0, 0.16)
  tailShape.lineTo(0.48, -0.1)
  tailShape.lineTo(0.42, -0.14)
  tailShape.lineTo(-0.42, -0.14)
  tailShape.lineTo(-0.48, -0.1)
  tailShape.closePath()

  const tailGeo = new THREE.ExtrudeGeometry(tailShape, { depth: 0.03, bevelEnabled: false })
  tailGeo.rotateX(-Math.PI / 2)
  tailGeo.translate(0, 0.18, 0.48)
  const tail = new THREE.Mesh(tailGeo, wingMat)
  const tailEdges = new THREE.LineSegments(new THREE.EdgesGeometry(tailGeo), edgeMat)
  group.add(tail)
  group.add(tailEdges)

  // 6. Attached Coordinate Frame Axes
  const axisLength = 0.85
  const arrowX = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), axisLength, 0xef4444, 0.14, 0.08)
  const arrowY = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), axisLength, 0x22c55e, 0.14, 0.08)
  const arrowZ = new THREE.ArrowHelper(new THREE.Vector3(0, 0, -1), new THREE.Vector3(0, 0, 0), axisLength, 0x60a5fa, 0.14, 0.08)

  group.add(arrowX)
  group.add(arrowY)
  group.add(arrowZ)

  return group
}
