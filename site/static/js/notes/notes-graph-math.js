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
  const t = tags.map((x) => String(x).toLowerCase().trim())

  // 1. Computer Graphics & 3D Geometry
  if (t.some((x) => x.includes('graphics') || x.includes('transformation matrix') || x.includes('quaternion') || x.includes('shading') || x.includes('ray tracing') || x.includes('camera') || x.includes('projection') || x.includes('rotation') || x.includes('shearing') || x.includes('clipping') || x.includes('normals'))) {
    return 'graphics'
  }

  // 2. Life (Personal essays, builder mindset, productivity, music, open mic, languages: French, Japanese)
  if (t.some((x) => x.includes('music') || x.includes('bachata') || x.includes('dancing') || x.includes('singing') || x.includes('guitar') || x.includes('open mic') || x.includes('life') || x.includes('productivity') || x.includes('career') || x.includes('habits') || x.includes('journaling') || x.includes('tmux') || x.includes('zellij') || x.includes('french') || x.includes('japanese') || x.includes('spanish') || x.includes('orange pi') || x.includes('home server'))) {
    return 'life'
  }

  // 3. Systems, Distributed Computing, Performance & Software Engineering
  if (t.some((x) => (x.includes('system') && !x.includes('numeral')) || x.includes('performance') || x.includes('distributed') || x.includes('queuing') || x.includes('benchmarking') || (x.includes('inference') && !x.includes('exact inference')) || x.includes('kubernetes') || x.includes('kafka') || x.includes('cassandra') || x.includes('database') || x.includes('storage') || x.includes('memtable') || x.includes('sstable') || x.includes('c++') || x === 'c' || x.includes('gcc') || x.includes('make') || x.includes('cmake') || x.includes('concurrency') || x.includes('linux') || x.includes('kernel') || (x.includes('network') && !x.includes('bayesian')) || x.includes('promises') || x.includes('javascript') || x.includes('tooling') || x.includes('data structures') || x.includes('big data') || x.includes('software engineer') || x.includes('ux'))) {
    return 'systems'
  }

  // 4. Mathematics, Probability, Graph Theory & Statistical ML
  if (t.some((x) => x.includes('math') || x.includes('calculus') || x.includes('number theory') || x.includes('graph theory') || x.includes('affine') || x.includes('vector spaces') || x.includes('prime') || x.includes('integral') || x.includes('derivative') || x.includes('tree') || x.includes('machine learning') || x.includes('hyperparameter') || x.includes('expectation maximization') || x === 'ml' || x === 'ai' || x.includes('artificial intelligence') || x.includes('modulo') || x.includes('euclidean') || x.includes('divisibility') || x.includes('linear algebra') || x.includes('probability') || x.includes('bayesian') || x.includes('numeral'))) {
    return 'math'
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
    case 'life':
      return '#fbbf24' // Amber
    default:
      return 'rgba(255, 255, 255, 0.75)'
  }
}

export function getIndicatorColors(cluster = 'systems') {
  switch (cluster) {
    case 'systems': // Coral #ff7043
      return {
        star: '#fef08a',       // Luminous light gold on coral
        interactive: '#ffffff' // Crisp pure white on coral
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
    case 'life': // Amber #fbbf24
      return {
        star: '#ffffff',       // Pure white on amber
        interactive: '#065f46' // Deep rich emerald on amber
      }
    default:
      return {
        star: '#fbbf24',
        interactive: '#ffffff'
      }
  }
}

/**
 * Mulberry32 PRNG (Pseudo-Random Number Generator)
 * Produces deterministic, reproducible floating-point numbers in [0, 1) across all runs.
 */
export function createSeededRandom(seed = 42) {
  let s = seed >>> 0
  return function () {
    s = (s + 0x6d2b79f5) >>> 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Strips HTML tags from markdown-rendered summary string for clean plain-text search.
 */
function stripHtml(htmlStr = '') {
  return String(htmlStr).replace(/<[^>]*>/g, ' ')
}

/**
 * Calculates relevance score of a note against search tokens.
 * All tokens must match somewhere across title, tags, or summary (AND match).
 * Higher score = more relevant. Returns 0 if not matching.
 */
export function scoreNoteMatch(node, query = '') {
  if (!node) return 0
  const cleanQuery = String(query).trim().toLowerCase()
  if (!cleanQuery) return 0

  const tokens = cleanQuery.split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return 0

  const title = (node.title || '').toLowerCase()
  const tags = Array.isArray(node.tags) ? node.tags.map((t) => String(t).toLowerCase()) : []
  const summary = stripHtml(node.summary || '').toLowerCase()

  let totalScore = 0

  for (const token of tokens) {
    let tokenMatched = false
    let tokenScore = 0

    // 1. Title match (highest weight: 5 for exact start, 3 for substring)
    if (title.includes(token)) {
      tokenMatched = true
      tokenScore += title.startsWith(token) ? 5 : 3
    }

    // 2. Tag match (weight: 2.5)
    for (const tag of tags) {
      if (tag.includes(token)) {
        tokenMatched = true
        tokenScore += tag === token ? 3 : 2
        break
      }
    }

    // 3. Summary match (weight: 1)
    if (summary.includes(token)) {
      tokenMatched = true
      tokenScore += 1
    }

    // All tokens must match
    if (!tokenMatched) {
      return 0
    }

    totalScore += tokenScore
  }

  // Slight boost for favorite or interactive notes to break ties nicely
  if (node.isFavorite) totalScore += 0.5
  if (node.interactive) totalScore += 0.25

  return totalScore
}

/**
 * Searches and ranks notes by relevance score descending.
 */
export function searchNotes(notes = [], query = '') {
  if (!query || !query.trim()) return notes
  const scored = []
  for (const n of notes) {
    const score = scoreNoteMatch(n, query)
    if (score > 0) {
      scored.push({ node: n, score })
    }
  }
  scored.sort((a, b) => b.score - a.score)
  return scored.map((item) => item.node)
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
  if (filterKey.startsWith('search:')) {
    const q = filterKey.slice(7)
    return scoreNoteMatch(node, q) > 0
  }
  if (filterKey === 'interactive') return Boolean(node.interactive)
  if (filterKey === 'favorites' || filterKey === 'favorite') return Boolean(node.isFavorite)
  if (filterKey === 'performance' || filterKey === 'systems') return node.cluster === 'systems'
  if (filterKey === 'life') return node.cluster === 'life'
  if (filterKey === 'math' || filterKey === 'ml' || filterKey === 'ai') return node.cluster === 'math'
  if (filterKey.startsWith('tag:')) {
    const target = normalizeTag(filterKey.slice(4))
    return Array.isArray(node.tags) && node.tags.some((t) => normalizeTag(t) === target)
  }
  return node.cluster === filterKey
}

export function calculateEdgeWeight(nodeA, nodeB, tagFreq = new Map(), totalNotes = 1) {
  const setA = new Set(nodeA.tags.map((t) => t.toLowerCase()))
  const shared = nodeB.tags.filter((t) => setA.has(t.toLowerCase()))
  if (shared.length === 0) return 0

  const UMBRELLA_TAGS = new Set([
    'math',
    'computer graphics',
    'system design',
    'life',
    '3d',
    '2d',
    'tooling',
    'software engineer',
    'learning'
  ])

  const sameCluster = nodeA.cluster === nodeB.cluster
  const onlyUmbrella = shared.every((t) => UMBRELLA_TAGS.has(t.toLowerCase()))

  // Broad category umbrella tags alone NEVER connect across different clusters
  if (onlyUmbrella && !sameCluster) {
    return 0
  }

  let totalWeight = 0
  for (const t of shared) {
    const norm = t.toLowerCase()
    const count = tagFreq.get(norm) || 1
    // Rare specific tags get full IDF; broad umbrella tags get damped weight
    const idf = Math.log(1 + totalNotes / count)
    const isUmbrella = UMBRELLA_TAGS.has(norm)
    totalWeight += isUmbrella ? idf * 0.15 : idf
  }

  // Same-cluster affinity bonus
  if (sameCluster) {
    totalWeight *= 1.25
  }

  return totalWeight
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
      isDraft: Boolean(note.isDraft),
      popularity,
      radius,
      cluster,
      color
    }
  })

  // 1. Calculate global tag frequencies across nodes for IDF weighting
  const tagFreq = new Map()
  for (const n of nodes) {
    for (const t of n.tags) {
      const norm = t.toLowerCase()
      tagFreq.set(norm, (tagFreq.get(norm) || 0) + 1)
    }
  }

  // 2. Compute top-k edges per node based on semantic affinity
  const links = []
  const edgeSet = new Set()

  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i]
    const candidates = []

    for (let j = 0; j < nodes.length; j++) {
      if (i === j) continue
      const b = nodes[j]
      const weight = calculateEdgeWeight(a, b, tagFreq, nodes.length)

      if (weight > 0) {
        candidates.push({ targetId: b.id, weight })
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
          weight: Math.round(c.weight * 10) / 10
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
  // Always show on hover (for the hovered node and its direct neighbors)
  if (isHovered || isNeighbor) return true

  // If a search or specific filter is active, reveal labels for matching visible nodes
  if (isFiltered) return true

  // Level 1: Resting / overview zoom (k < 1.25) - Show strictly curated favorites
  if (zoomK < 1.25) {
    return Boolean(node.isFavorite)
  }

  // Level 2: Moderate zoom (1.25 <= k < 1.75) - Reveal favorites and major interactive hubs
  if (zoomK < 1.75) {
    return Boolean(node.isFavorite || (node.interactive && typeof node.popularity === 'number' && node.popularity >= 65))
  }

  // Level 3: Deep zoom (k >= 1.75) - Reveal all notes in the focused view
  return true
}
