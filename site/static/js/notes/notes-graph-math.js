/**
 * Pure mathematical calculations and data transformations for Topic Constellation Graph
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

export function calculateNodeRadius(popularity, isFavorite = false, minR = 14, maxR = 32) {
  const pop = typeof popularity === 'number' ? Math.max(0, Math.min(100, popularity)) : 40
  const normalized = pop / 100
  let r = minR + (maxR - minR) * Math.sqrt(normalized)
  if (isFavorite) {
    r = Math.min(maxR + 4, r + 7)
  }
  return Math.round(r)
}

export function getClusterCategory(tags = []) {
  if (!tags || !tags.length) return 'other'
  const t = tags.map((x) => String(x).toLowerCase())

  // 1. Computer Graphics & Geometry
  if (t.some((x) => x.includes('graphics') || x.includes('transformation matrix') || x.includes('quaternion') || x.includes('shading') || x.includes('ray tracing') || x.includes('camera') || x.includes('projection') || x.includes('rotation') || x.includes('shearing') || x.includes('clipping') || x.includes('normals'))) {
    return 'graphics'
  }
  // 2. Systems & Performance
  if (t.some((x) => x.includes('performance') || x.includes('system design') || x.includes('distributed') || x.includes('queuing') || x.includes('benchmarking') || x.includes('inference') || x.includes('kubernetes') || x.includes('kafka') || x.includes('cassandra'))) {
    return 'systems'
  }
  // 3. Mathematics & Graph Theory
  if (t.some((x) => x.includes('math') || x.includes('calculus') || x.includes('number theory') || x.includes('graph theory') || x.includes('affine') || x.includes('vector spaces') || x.includes('prime') || x.includes('integral') || x.includes('derivative') || x.includes('tree'))) {
    return 'math'
  }
  // 4. AI, Code & Tooling
  if (t.some((x) => x.includes('ai') || x.includes('machine learning') || x.includes('c++') || x === 'c' || x.includes('javascript') || x.includes('promises') || x.includes('software-engineering') || x.includes('software engineering') || x.includes('gcc') || x.includes('make') || x.includes('cmake'))) {
    return 'ai'
  }
  // 5. Languages & Learning (evaluate before generic 'life')
  if (t.some((x) => x.includes('language') || x.includes('french') || x.includes('japanese') || x.includes('learning'))) {
    return 'languages'
  }
  // 6. Music, Dancing, Life & Productivity
  if (t.some((x) => x.includes('music') || x.includes('bachata') || x.includes('dancing') || x.includes('singing') || x.includes('guitar') || x.includes('open mic') || x.includes('life') || x.includes('productivity') || x.includes('habits') || x.includes('journaling') || x.includes('tmux') || x.includes('zellij'))) {
    return 'music'
  }

  return 'other'
}

export function getClusterColor(tags = []) {
  const category = getClusterCategory(tags)
  switch (category) {
    case 'graphics':
      return '#a855f7' // Purple
    case 'systems':
      return '#ff7043' // Coral
    case 'math':
      return '#38bdf8' // Sky Blue
    case 'ai':
      return '#34d399' // Emerald
    case 'music':
      return '#fbbf24' // Amber
    case 'languages':
      return '#818cf8' // Indigo
    default:
      return 'rgba(255, 255, 255, 0.75)'
  }
}

export function getIndicatorColors(cluster = 'systems') {
  switch (cluster) {
    case 'systems': // Coral #ff7043
      return {
        star: '#fef08a',       // Luminous light gold on coral
        interactive: '#ffffff' // Crisp pure white on coral (no green-on-orange clash!)
      }
    case 'graphics': // Purple #a855f7
      return {
        star: '#fbbf24',       // Warm gold on purple
        interactive: '#67e8f9' // Electric cyan on purple
      }
    case 'math': // Sky Blue #38bdf8
      return {
        star: '#fbbf24',       // Warm gold on sky blue
        interactive: '#ffffff' // Crisp white on sky blue
      }
    case 'ai': // Emerald #34d399
      return {
        star: '#fbbf24',       // Warm gold on emerald
        interactive: '#ffffff' // Crisp white on emerald
      }
    case 'music': // Amber #fbbf24
      return {
        star: '#ffffff',       // Pure white on amber (prevents gold-on-amber blending)
        interactive: '#065f46' // Deep rich emerald on amber
      }
    case 'languages': // Indigo #818cf8
      return {
        star: '#fbbf24',       // Warm gold on indigo
        interactive: '#ffffff' // Crisp white on indigo
      }
    default:
      return {
        star: '#fbbf24',
        interactive: '#ffffff'
      }
  }
}

export function normalizeTag(str = '') {
  return String(str)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
}

export function isNodeInFilter(node, filterKey = 'all') {
  if (!filterKey || filterKey === 'all') return true
  if (filterKey === 'interactive') return Boolean(node.interactive)
  if (filterKey === 'favorites' || filterKey === 'favorite') return Boolean(node.isFavorite)
  if (filterKey === 'performance' || filterKey === 'systems') return node.cluster === 'systems'
  if (filterKey.startsWith('tag:')) {
    const target = normalizeTag(filterKey.slice(4))
    return Array.isArray(node.tags) && node.tags.some((t) => normalizeTag(t) === target)
  }
  return node.cluster === filterKey
}

export function buildGraphData(rawNotes = [], maxEdgesPerNode = 3) {
  const nodes = rawNotes.map((note) => {
    const tags = Array.isArray(note.tags) ? note.tags : []
    const isFavorite = Boolean(note.isFavorite)
    const interactive = Boolean(note.interactive)
    const popularity = typeof note.popularity === 'number' ? note.popularity : 40
    const radius = calculateNodeRadius(popularity, isFavorite)
    const cluster = getClusterCategory(tags)
    const color = getClusterColor(tags)

    return {
      id: note.id || note.url,
      url: note.url,
      title: note.title,
      summary: note.summary || '',
      image: note.image || '',
      date: note.date || '',
      readingTime: note.readingTime || 3,
      tags,
      isFavorite,
      interactive,
      popularity,
      radius,
      cluster,
      color
    }
  })

  // Compute top-k edges per node based on shared tags to form clean constellations
  const links = []
  const edgeSet = new Set()

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    const setA = new Set(a.tags.map((t) => t.toLowerCase()))
    const candidates = []

    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue
      const b = nodes[j]
      const shared = b.tags.filter((t) => setA.has(t.toLowerCase())).length

      if (shared > 0) {
        candidates.push({ targetId: b.id, weight: shared })
      }
    }

    candidates.sort((x, y) => y.weight - x.weight)
    const topCandidates = candidates.slice(0, maxEdgesPerNode)

    topCandidates.forEach((c) => {
      const key = a.id < c.targetId ? `${a.id}->${c.targetId}` : `${c.targetId}->${a.id}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        links.push({
          source: a.id,
          target: c.targetId,
          weight: c.weight
        })
      }
    })
  }

  return { nodes, links }
}

export function filterGraphData(fullGraph, filterKey = 'all') {
  if (filterKey === 'all') {
    return fullGraph
  }

  const filteredNodes = fullGraph.nodes.filter((n) => isNodeInFilter(n, filterKey))
  const nodeIds = new Set(filteredNodes.map((n) => (typeof n.id === 'object' ? n.id.id : n.id)))
  const filteredLinks = fullGraph.links.filter((l) => {
    const sId = typeof l.source === 'object' ? l.source.id : l.source
    const tId = typeof l.target === 'object' ? l.target.id : l.target
    return nodeIds.has(sId) && nodeIds.has(tId)
  })

  return { nodes: filteredNodes, links: filteredLinks }
}

export function shouldShowNodeLabel(node, zoomK = 1.0, isHovered = false, isNeighbor = false, isFiltered = false) {
  // Always show on hover
  if (isHovered || isNeighbor) return true

  // If a category filter is active and the subset is small, show all in that category
  if (isFiltered) return true

  // Level 1: Zoomed out (k < 0.9) - Major landmarks only
  if (zoomK < 0.9) {
    return node.isFavorite || (typeof node.popularity === 'number' && node.popularity >= 85)
  }

  // Level 2: Mid zoom (0.9 <= k < 1.4) - Secondary hubs and favorites
  if (zoomK < 1.4) {
    return node.isFavorite || node.interactive || (typeof node.popularity === 'number' && node.popularity >= 60)
  }

  // Level 3: Zoomed in (k >= 1.4) - Show all
  return true
}
