/**
 * Interactive Fullscreen Topic Constellation Graph for /notes/
 *
 * Visualizes notes as an interconnected network of topic clusters,
 * with nodes rendered using article cover art with hover scale + rotation,
 * cluster-adapted indicator badges, and clean passive preview cards on hover.
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

// Browser canvas runtime
export async function initNotesGraph(containerId = 'notes-graph-container') {
  if (typeof window === 'undefined') return
  const container = document.getElementById(containerId)
  if (!container) return

  const dataScript = document.getElementById('notes-graph-data')
  if (!dataScript) return
  let rawNotes = []
  try {
    rawNotes = JSON.parse(dataScript.textContent || '[]')
  } catch (e) {
    console.error('Failed to parse notes-graph-data', e)
    return
  }

  if (!rawNotes.length) return

  // Import D3 dynamically from ESM CDN
  const d3 = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')

  const fullGraph = buildGraphData(rawNotes, 3)
  let activeFilter = 'all'

  // Image cache for article cover art rendered inside node circles
  const imageCache = new Map()
  fullGraph.nodes.forEach((node) => {
    if (node.image && !imageCache.has(node.image)) {
      const img = new Image()
      img.src = node.image
      img.onload = () => {
        imageCache.set(node.image, img)
        render()
      }
      imageCache.set(node.image, img)
    }
  })

  // Setup DOM elements inside fullscreen container
  container.innerHTML = `
    <div class="tw-relative tw-w-full tw-h-full tw-overflow-hidden">
      <!-- Fullscreen Canvas (Initially invisible and scaled down, revealed smoothly via CSS scale-up) -->
      <canvas id="notes-graph-canvas" class="tw-w-full tw-h-full tw-block tw-cursor-grab active:tw-cursor-grabbing tw-opacity-0 tw-scale-95 tw-transition-all tw-duration-500 tw-ease-out"></canvas>

      <!-- Active Hovered Node DOM Anchor (Handles native browser status-bar link previews, clicks, and shortcuts) -->
      <a id="notes-graph-active-anchor" href="#" class="tw-absolute tw-hidden tw-rounded-full tw-pointer-events-auto tw-z-30 tw-cursor-pointer focus:tw-outline-none" aria-label="Open article"></a>

      <!-- Top Floating Navigation Bar -->
      <header class="tw-absolute tw-top-4 tw-left-4 tw-right-4 tw-pointer-events-none tw-flex tw-items-center tw-justify-between tw-z-30">
        <!-- Left: Home Button (Clickable -> Has border and subtle shadow) -->
        <div class="tw-pointer-events-auto tw-flex tw-items-center tw-gap-2">
          <a href="/" class="tw-flex tw-items-center tw-gap-1.5 tw-px-3.5 tw-py-2 tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised hover:tw-text-primary tw-text-xs tw-font-serif tw-transition tw-text-[var(--grey-light)]" title="Back to Home">
            <span class="material-symbols-outlined" style="font-size: 16px"> home </span>
            <span class="tw-font-medium">Home</span>
          </a>
        </div>

        <!-- Center: Category Filter Pills (Clickable buttons) -->
        <div class="tw-pointer-events-auto tw-hidden lg:tw-flex tw-flex-wrap tw-items-center tw-gap-1.5 tw-p-1 tw-rounded-full tw-bg-[var(--grey-dark)]/85 tw-backdrop-blur-md tw-border tw-border-[var(--ring-border)]" id="graph-filters">
          <button data-filter="all" class="graph-pill-btn is-active">All</button>
          <button data-filter="graphics" class="graph-pill-btn"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-mr-1" style="background: #a855f7"></span>Graphics</button>
          <button data-filter="systems" class="graph-pill-btn"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-mr-1" style="background: #ff7043"></span>Systems</button>
          <button data-filter="math" class="graph-pill-btn"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-mr-1" style="background: #38bdf8"></span>Math & Graphs</button>
          <button data-filter="ai" class="graph-pill-btn"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-mr-1" style="background: #34d399"></span>AI & Code</button>
          <button data-filter="music" class="graph-pill-btn"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-mr-1" style="background: #fbbf24"></span>Music & Life</button>
          <button data-filter="languages" class="graph-pill-btn"><span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-mr-1" style="background: #818cf8"></span>Languages</button>
          <button data-filter="interactive" class="graph-pill-btn tw-text-primary">✦ Interactive</button>
          <button data-filter="favorites" class="graph-pill-btn tw-text-amber-400">★ Favorites</button>
        </div>

        <!-- Right: Theme Toggle (Clickable -> Has border and subtle shadow) -->
        <div class="tw-pointer-events-auto tw-flex tw-items-center tw-gap-2">
          <button class="theme-toggle tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised tw-transition tw-hidden light:tw-flex" data-nexttheme="dark" title="Dark theme">
            <span class="material-symbols-outlined light:tw-text-zinc-800" style="font-size: 18px"> dark_mode </span>
          </button>
          <button class="theme-toggle tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised tw-transition light:tw-hidden" data-nexttheme="light" title="Light theme">
            <span class="material-symbols-outlined dark:tw-text-zinc-200" style="font-size: 18px"> light_mode </span>
          </button>
        </div>
      </header>

      <!-- Bottom Floating Overlay Bar (Pure flat typography, zero fake-button borders/shadows on passive labels) -->
      <footer class="tw-absolute tw-bottom-4 tw-left-4 tw-right-4 tw-pointer-events-none tw-flex tw-items-center tw-justify-between tw-text-xs tw-text-[var(--grey-light)] tw-z-20">
        <!-- Passive Label: Zero border, zero shadow -->
        <div class="tw-pointer-events-none tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-[var(--grey-light)] tw-font-serif">
          <span class="tw-text-primary tw-font-bold">✦ Topic Constellation</span>
          <span class="tw-opacity-60">• ${rawNotes.length} notes</span>
        </div>

        <div class="tw-pointer-events-auto tw-flex tw-items-center tw-gap-3">
          <!-- Clickable button: Has border and subtle shadow -->
          <button id="graph-reset-zoom" class="tw-px-3.5 tw-py-1.5 tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised hover:tw-text-primary tw-transition tw-font-serif tw-text-xs tw-cursor-pointer">
            Reset View
          </button>
          <!-- Passive Hint: Zero border, zero shadow -->
          <div class="tw-hidden md:tw-block tw-text-xs tw-text-[var(--grey-light)] tw-opacity-60 tw-font-serif">
            Scroll to zoom • Drag to explore • Click to open
          </div>
        </div>
      </footer>

      <!-- Tooltip Card: Strictly pointer-events-none (never hoverable or lingering when node is unhovered) -->
      <div id="notes-graph-tooltip" class="tw-absolute tw-pointer-events-none tw-opacity-0 tw-transition-opacity tw-duration-150 tw-z-40 tw-bg-[var(--grey-dark)]/95 tw-backdrop-blur-xl tw-border tw-border-[var(--ring-border)] tw-shadow-raised tw-rounded-xl tw-p-5 tw-max-w-[480px]"></div>
    </div>
  `

  const canvas = document.getElementById('notes-graph-canvas')
  const tooltip = document.getElementById('notes-graph-tooltip')
  const activeAnchor = document.getElementById('notes-graph-active-anchor')
  const filterBtns = container.querySelectorAll('.graph-pill-btn')
  const resetBtn = document.getElementById('graph-reset-zoom')

  // Inject scoped styles for filter buttons
  const style = document.createElement('style')
  style.textContent = `
    .graph-pill-btn {
      padding: 0.25rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.74rem;
      font-family: var(--family-sans, system-ui, sans-serif);
      font-weight: 500;
      color: var(--grey-light);
      background: transparent;
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.15s ease;
      white-space: nowrap;
    }
    .graph-pill-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      color: var(--grey-lighter);
    }
    .graph-pill-btn.is-active {
      background: rgba(var(--primary), 0.18);
      border-color: rgb(var(--primary));
      color: rgb(var(--primary));
      font-weight: 600;
    }
  `
  container.appendChild(style)

  // Wire theme toggle buttons directly for instant reactivity
  const themeToggles = container.querySelectorAll('.theme-toggle')
  themeToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const next = btn.getAttribute('data-nexttheme')
      if (next) {
        localStorage.setItem('theme', next)
        document.documentElement.setAttribute('data-theme', next)
        if (window.myBlog && window.myBlog.theme) {
          window.myBlog.theme.setTheme(next)
        }
      }
    })
  })

  const ctx = canvas.getContext('2d')
  let width = container.clientWidth || window.innerWidth
  let height = container.clientHeight || window.innerHeight
  let hoveredNode = null
  let isDragging = false
  let currentTransform = d3.zoomIdentity

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  function resizeCanvas() {
    width = container.clientWidth || window.innerWidth
    height = container.clientHeight || window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
  }
  resizeCanvas()

  // D3 Zoom / Pan Behavior (Bounded minimum zoom at 0.7)
  const zoom = d3
    .zoom()
    .scaleExtent([0.7, 3.5])
    .on('zoom', (event) => {
      currentTransform = event.transform
      render()
      if (hoveredNode) {
        const [screenX, screenY] = currentTransform.apply([hoveredNode.x, hoveredNode.y])
        positionTooltip(screenX, screenY)
        positionActiveAnchor(hoveredNode, screenX, screenY)
      }
    })

  const d3Canvas = d3.select(canvas)
  d3Canvas.call(zoom)

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      d3Canvas.transition().duration(600).call(zoom.transform, d3.zoomIdentity)
    })
  }

  // Theme observer: re-render canvas whenever data-theme changes
  const themeObserver = new MutationObserver(() => {
    render()
  })
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

  // Cluster Target Positioning: Creates distinct cosmic voids/gaps between thematic clusters
  const clusterAngles = {
    graphics: (-145 * Math.PI) / 180, // North-West
    math: (-35 * Math.PI) / 180, // North-East
    systems: (145 * Math.PI) / 180, // South-West
    ai: (35 * Math.PI) / 180, // South-East
    music: (85 * Math.PI) / 180, // South
    languages: (-90 * Math.PI) / 180 // North
  }

  function getClusterTargetX(d) {
    const angle = clusterAngles[d.cluster] || 0
    const clusterSpread = Math.min(width, height) * 0.35
    return width / 2 + Math.cos(angle) * clusterSpread
  }

  function getClusterTargetY(d) {
    const angle = clusterAngles[d.cluster] || 0
    const clusterSpread = Math.min(width, height) * 0.35
    return height / 2 + Math.sin(angle) * clusterSpread
  }

  // D3 Force Simulation Setup:
  // 1. Pre-seed node positions near their target cluster anchors so they never fly in from (0,0)
  fullGraph.nodes.forEach((n) => {
    const targetX = getClusterTargetX(n)
    const targetY = getClusterTargetY(n)
    n.x = targetX + (Math.random() - 0.5) * 80
    n.y = targetY + (Math.random() - 0.5) * 80
  })

  const simulation = d3
    .forceSimulation(fullGraph.nodes)
    .force(
      'link',
      d3
        .forceLink(fullGraph.links)
        .id((d) => d.id)
        .distance((d) => Math.max(30, 58 - d.weight * 9))
        .strength(0.35)
    )
    .force('charge', d3.forceManyBody().strength(-65))
    .force('clusterX', d3.forceX(getClusterTargetX).strength(0.18))
    .force('clusterY', d3.forceY(getClusterTargetY).strength(0.18))
    .force(
      'collide',
      d3.forceCollide().radius((d) => d.radius + 15).iterations(2)
    )
    .alphaDecay(0.02)

  // 2. Pre-warm simulation invisibly in memory so initial physics layout settles before canvas is visible
  for (let i = 0; i < 120; i++) {
    simulation.tick()
  }

  // 3. Render the settled constellation onto the hidden canvas
  render()

  // 4. Reveal canvas with smooth CSS scale-up from 0.95 to 1.0 and fade-in
  requestAnimationFrame(() => {
    canvas.classList.remove('tw-opacity-0', 'tw-scale-95')
    canvas.classList.add('tw-opacity-100', 'tw-scale-100')
  })

  // 5. Connect live tick listener for any subsequent user interaction/drag/framing
  simulation.on('tick', render)

  window.addEventListener('resize', () => {
    resizeCanvas()
    simulation.force('clusterX', d3.forceX(getClusterTargetX).strength(0.18))
    simulation.force('clusterY', d3.forceY(getClusterTargetY).strength(0.18))
    simulation.alpha(0.3).restart()
  })

  function render() {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light'
    const textDefault = isLight ? '#18181b' : 'rgba(255, 255, 255, 0.90)'
    const textHovered = isLight ? '#000000' : '#ffffff'
    const linkDefault = isLight ? 'rgba(0, 0, 0, 0.10)' : 'rgba(255, 255, 255, 0.12)'
    const linkConnected = isLight ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.55)'
    const linkDimmed = isLight ? 'rgba(0, 0, 0, 0.015)' : 'rgba(255, 255, 255, 0.025)'
    const haloFill = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.14)'
    const strokeDefault = isLight ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.4)'
    const strokeHovered = isLight ? '#000000' : '#ffffff'

    ctx.save()
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.scale(dpr, dpr)
    ctx.translate(currentTransform.x, currentTransform.y)
    ctx.scale(currentTransform.k, currentTransform.k)

    const zoomK = currentTransform.k
    const isFiltered = activeFilter !== 'all'

    // Neighbors of hovered node
    const activeNeighbors = new Set()
    if (hoveredNode) {
      activeNeighbors.add(hoveredNode.id)
      fullGraph.links.forEach((link) => {
        const s = typeof link.source === 'object' ? link.source.id : link.source
        const t = typeof link.target === 'object' ? link.target.id : link.target
        if (s === hoveredNode.id) activeNeighbors.add(t)
        if (t === hoveredNode.id) activeNeighbors.add(s)
      })
    }

    // ==========================================
    // PASS 1: DRAW ALL LINKS (Behind everything)
    // ==========================================
    fullGraph.links.forEach((link) => {
      const s = link.source
      const t = link.target
      if (!s.x || !t.x) return

      const sInFilter = isNodeInFilter(s, activeFilter)
      const tInFilter = isNodeInFilter(t, activeFilter)
      const linkInFilter = sInFilter && tInFilter

      const isConnected = hoveredNode && (s.id === hoveredNode.id || t.id === hoveredNode.id)

      ctx.beginPath()
      ctx.moveTo(s.x, s.y)
      ctx.lineTo(t.x, t.y)

      if (isConnected) {
        ctx.strokeStyle = linkConnected
        ctx.lineWidth = Math.min(3.5, 1.4 + link.weight * 0.7)
      } else if (hoveredNode) {
        ctx.strokeStyle = linkDimmed
        ctx.lineWidth = 1
      } else if (isFiltered && !linkInFilter) {
        ctx.strokeStyle = linkDimmed
        ctx.lineWidth = 0.8
      } else {
        ctx.strokeStyle = linkDefault
        ctx.lineWidth = Math.min(2.5, 0.8 + link.weight * 0.4)
      }
      ctx.stroke()
    })

    // ==========================================
    // PASS 2: DRAW OUTER HALOS (Hovered node)
    // ==========================================
    if (hoveredNode && hoveredNode.x && hoveredNode.y) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(hoveredNode.x, hoveredNode.y, hoveredNode.radius + 10, 0, Math.PI * 2)
      ctx.fillStyle = haloFill
      ctx.fill()
      ctx.restore()
    }

    // =========================================================================
    // PASS 3: DRAW ALL NODE CIRCLES, COVER ART, AND ELEVATED BADGES
    // =========================================================================
    fullGraph.nodes.forEach((node) => {
      if (!node.x || !node.y) return

      const inFilter = isNodeInFilter(node, activeFilter)
      const isHovered = hoveredNode && hoveredNode.id === node.id
      const isNeighbor = hoveredNode && activeNeighbors.has(node.id)

      let alpha = 1.0
      if (hoveredNode) {
        alpha = isHovered || isNeighbor ? 1.0 : 0.15
      } else if (isFiltered) {
        alpha = inFilter ? 1.0 : 0.08
      }

      ctx.save()
      ctx.globalAlpha = alpha

      // 1. Base Node Background Fill (Thematic cluster color)
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      ctx.fillStyle = node.color
      ctx.fill()

      // 2. Article Cover Art (Clipped circle with perf-series scale + rotate on hover)
      const img = node.image ? imageCache.get(node.image) : null
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.clip()

        // Apply scale(1.18) rotate(3deg) on hover matching perf series nav
        const scale = isHovered ? 1.18 : 1.0
        const rotate = isHovered ? (3 * Math.PI) / 180 : 0
        const imgOpacity = isHovered ? 0.95 : 0.80

        ctx.translate(node.x, node.y)
        ctx.rotate(rotate)
        ctx.scale(scale, scale)
        ctx.globalAlpha = alpha * imgOpacity

        // Center-cover draw image inside circle
        const imgAspect = img.naturalWidth / img.naturalHeight
        let dw, dh
        if (imgAspect > 1) {
          dh = node.radius * 2
          dw = dh * imgAspect
        } else {
          dw = node.radius * 2
          dh = dw / imgAspect
        }
        ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh)
        ctx.restore()
      }

      // 3. Node Perimeter Ring
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
      ctx.strokeStyle = isHovered ? strokeHovered : strokeDefault
      ctx.lineWidth = isHovered ? 2.8 : 1.2
      ctx.stroke()

      // 4. Badge Pod Radius & Box Shadow (Seamlessly matches node.color with gentle elevation)
      const badgeR = Math.max(6, Math.min(8, node.radius * 0.3))
      const badgeShadowColor = isLight ? 'rgba(0, 0, 0, 0.28)' : 'rgba(0, 0, 0, 0.65)'
      const indicatorColors = getIndicatorColors(node.cluster)

      // Star for Favorites ★ (Elevated badge pod matching node color with group-adapted glyph)
      if (node.isFavorite) {
        const starAngle = -Math.PI / 4 // 45 deg (top-right)
        const starX = node.x + Math.cos(starAngle) * node.radius
        const starY = node.y + Math.sin(starAngle) * node.radius

        ctx.save()
        ctx.shadowColor = badgeShadowColor
        ctx.shadowBlur = 3.5
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 1

        ctx.beginPath()
        ctx.arc(starX, starY, badgeR, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        ctx.font = `bold ${badgeR * 1.25}px system-ui, sans-serif`
        ctx.fillStyle = indicatorColors.star
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('★', starX, starY + 0.5)
        ctx.restore()
      }

      // Spark for Interactive ✦ (Elevated badge pod matching node color with group-adapted glyph)
      if (node.interactive) {
        const dotAngle = (-3 * Math.PI) / 4 // 135 deg (top-left)
        const dotX = node.x + Math.cos(dotAngle) * node.radius
        const dotY = node.y + Math.sin(dotAngle) * node.radius

        ctx.save()
        ctx.shadowColor = badgeShadowColor
        ctx.shadowBlur = 3.5
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 1

        ctx.beginPath()
        ctx.arc(dotX, dotY, badgeR, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        ctx.font = `bold ${badgeR * 1.15}px system-ui, sans-serif`
        ctx.fillStyle = indicatorColors.interactive
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('✦', dotX, dotY + 0.5)
        ctx.restore()
      }

      ctx.restore()
    })

    // =========================================================================
    // PASS 4: DRAW ALL TEXT LABELS (STRICTLY AT THE FRONT, NEVER BEHIND NODES)
    // =========================================================================
    const worldFontSize = 10.5 / zoomK
    const labelOffsetY = 5 / zoomK

    fullGraph.nodes.forEach((node) => {
      if (!node.x || !node.y) return

      const inFilter = isNodeInFilter(node, activeFilter)
      const isHovered = hoveredNode && hoveredNode.id === node.id
      const isNeighbor = hoveredNode && activeNeighbors.has(node.id)

      if (hoveredNode && !isHovered && !isNeighbor) return
      if (isFiltered && !inFilter && !isHovered && !isNeighbor) return

      const shouldShow = shouldShowNodeLabel(node, zoomK, isHovered, isNeighbor, isFiltered)
      if (!shouldShow) return

      ctx.save()
      ctx.font = isHovered ? `bold ${worldFontSize}px var(--family-sans, system-ui, sans-serif)` : `${worldFontSize}px var(--family-sans, system-ui, sans-serif)`
      ctx.fillStyle = isHovered ? textHovered : textDefault
      ctx.textAlign = 'center'
      ctx.textBaseline = 'top'

      const label = node.title.length > 25 ? node.title.slice(0, 23) + '…' : node.title
      const textY = node.y + node.radius + labelOffsetY

      if (isHovered) {
        ctx.shadowColor = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
        ctx.shadowBlur = 4 / zoomK
      }

      ctx.fillText(label, node.x, textY)
      ctx.restore()
    })

    ctx.restore()
  }

  // Pointer Hit Testing in transformed coordinates
  function getNodeAtScreen(screenX, screenY) {
    const [simX, simY] = currentTransform.invert([screenX, screenY])
    for (let i = fullGraph.nodes.length - 1; i >= 0; i--) {
      const node = fullGraph.nodes[i]
      if (!node.x || !node.y) continue
      if (activeFilter !== 'all' && !isNodeInFilter(node, activeFilter)) continue

      const dist = Math.hypot(node.x - simX, node.y - simY)
      if (dist <= node.radius + 6) {
        return node
      }
    }
    return null
  }

  function positionActiveAnchor(node, screenX, screenY) {
    if (!activeAnchor) return
    const screenRadius = Math.max(14, node.radius * currentTransform.k)
    activeAnchor.href = node.url
    activeAnchor.style.width = `${screenRadius * 2}px`
    activeAnchor.style.height = `${screenRadius * 2}px`
    activeAnchor.style.left = `${screenX - screenRadius}px`
    activeAnchor.style.top = `${screenY - screenRadius}px`
    activeAnchor.style.display = 'block'
    activeAnchor.setAttribute('title', `Open ${node.title}`)
  }

  function hideActiveAnchor() {
    if (activeAnchor) {
      activeAnchor.style.display = 'none'
    }
  }

  // Mouse / Pointer Move
  canvas.addEventListener('mousemove', (e) => {
    if (isDragging) return
    const rect = canvas.getBoundingClientRect()
    const screenX = e.clientX - rect.left
    const screenY = e.clientY - rect.top

    const found = getNodeAtScreen(screenX, screenY)
    if (found !== hoveredNode) {
      hoveredNode = found
      render()

      if (found) {
        canvas.style.cursor = 'pointer'
        const [nodeScreenX, nodeScreenY] = currentTransform.apply([found.x, found.y])
        showTooltip(found, nodeScreenX, nodeScreenY)
        positionActiveAnchor(found, nodeScreenX, nodeScreenY)
      } else {
        canvas.style.cursor = 'default'
        hideTooltip()
        hideActiveAnchor()
      }
    } else if (found) {
      const [nodeScreenX, nodeScreenY] = currentTransform.apply([found.x, found.y])
      positionTooltip(nodeScreenX, nodeScreenY)
      positionActiveAnchor(found, nodeScreenX, nodeScreenY)
    }
  })

  let isMouseOverAnchor = false
  if (activeAnchor) {
    activeAnchor.addEventListener('mouseenter', () => {
      isMouseOverAnchor = true
    })
    activeAnchor.addEventListener('mouseleave', (e) => {
      isMouseOverAnchor = false
      if (e.relatedTarget !== canvas) {
        hoveredNode = null
        hideTooltip()
        hideActiveAnchor()
        render()
      }
    })
  }

  canvas.addEventListener('mouseleave', (e) => {
    if (isDragging) return
    if (e.relatedTarget === activeAnchor || isMouseOverAnchor) {
      return
    }
    hoveredNode = null
    hideTooltip()
    hideActiveAnchor()
    render()
  })

  container.addEventListener('mouseleave', () => {
    if (!isDragging) {
      isMouseOverAnchor = false
      hoveredNode = null
      hideTooltip()
      hideActiveAnchor()
      render()
    }
  })

  // Click Navigation fallback on canvas
  let mouseDownPos = { x: 0, y: 0 }
  let isPotentialClick = false
  canvas.addEventListener('mousedown', (e) => {
    mouseDownPos = { x: e.clientX, y: e.clientY }
    isPotentialClick = true
  })

  canvas.addEventListener('mousemove', (e) => {
    if (isPotentialClick) {
      const dx = Math.abs(e.clientX - mouseDownPos.x)
      const dy = Math.abs(e.clientY - mouseDownPos.y)
      if (dx > 4 || dy > 4) {
        isPotentialClick = false
      }
    }
  })

  canvas.addEventListener('click', (e) => {
    if (!isPotentialClick) return
    const rect = canvas.getBoundingClientRect()
    const screenX = e.clientX - rect.left
    const screenY = e.clientY - rect.top
    const clickedNode = getNodeAtScreen(screenX, screenY)

    if (clickedNode && clickedNode.url) {
      window.location.href = clickedNode.url
    }
  })

  // Tooltip Helpers: Passive preview card with comfortable readable typography
  function showTooltip(node, screenX, screenY) {
    const starHtml = node.isFavorite
      ? `<span class="tw-inline-flex tw-items-center tw-gap-1 tw-text-amber-400 tw-font-medium tw-text-xs tw-leading-tight"><span class="material-symbols-outlined" style="font-size: 13.5px">star</span>Favorite</span>`
      : ''

    const interactiveHtml = node.interactive
      ? `<span class="tw-inline-flex tw-items-center tw-gap-1 tw-text-primary tw-font-medium tw-text-xs tw-leading-tight">✦ Interactive</span>`
      : ''

    const badges = [starHtml, interactiveHtml].filter(Boolean)
    const badgesHtml = badges.length
      ? `<div class="tw-flex tw-flex-wrap tw-items-center tw-gap-x-2.5 tw-gap-y-1 tw-leading-tight">${badges.join('')}</div>`
      : ''

    const tagsHtml = node.tags
      .slice(0, 4)
      .map((t) => `<span class="tw-text-xs tw-leading-tight tw-text-[var(--grey-light)] tw-opacity-70 tw-font-serif">#${t}</span>`)
      .join(' ')

    tooltip.innerHTML = `
      <div class="tw-flex tw-flex-col tw-gap-2.5">
        <!-- Row 1: Title on the left, Reading time on the right (perfectly aligned on font baseline) -->
        <div class="tw-flex tw-items-baseline tw-justify-between tw-gap-3">
          <h3 class="tw-font-bold tw-text-base md:tw-text-lg tw-text-primary tw-leading-snug tw-m-0 tw-flex-1">${node.title}</h3>
          <span class="tw-text-xs tw-text-[var(--grey-light)] tw-font-serif tw-opacity-70 tw-whitespace-nowrap">${node.readingTime} min read</span>
        </div>

        <!-- Row 2: Note summary with clear readable body font (15.5px) -->
        <div class="tw-text-[15.5px] tw-text-[var(--grey-lighter)] tw-line-clamp-4 tw-leading-relaxed tw-m-0 [&>p]:tw-m-0 [&>p]:tw-inline [&>p]:tw-text-[15.5px] [&_strong]:tw-text-primary [&_strong]:tw-font-semibold [&_em]:tw-text-white/95 [&_code]:tw-bg-white/10 [&_code]:tw-px-1.5 [&_code]:tw-py-0.5 [&_code]:tw-rounded [&_code]:tw-text-primary [&_code]:tw-font-mono [&_code]:tw-text-[13px]" style="font-size: 15.5px; line-height: 1.6;">
          ${node.summary}
        </div>

        <!-- Row 3: Favorite & Interactive badges + Compact tags at bottom (12px, tight line-height on wrapping) -->
        <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-x-3 tw-gap-y-1 tw-pt-2 tw-border-t tw-border-[var(--ring-border)] tw-leading-tight">
          ${badgesHtml}
          <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-x-2 tw-gap-y-1 tw-leading-tight">
            ${tagsHtml}
          </div>
        </div>
      </div>
    `

    // Render LaTeX formulas in summary using KaTeX if loaded
    if (typeof window !== 'undefined' && typeof window.renderMathInElement === 'function') {
      window.renderMathInElement(tooltip, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        ignoredClasses: ['tex2jax_ignore']
      })
    }

    positionTooltip(screenX, screenY)
    tooltip.style.opacity = '1'
  }

  function positionTooltip(screenX, screenY) {
    const tooltipWidth = 440
    const tooltipHeight = 220
    let left = screenX + 20
    let top = screenY + 20

    if (left + tooltipWidth > width) {
      left = screenX - tooltipWidth - 20
    }
    if (top + tooltipHeight > height) {
      top = screenY - tooltipHeight - 20
    }

    tooltip.style.left = `${Math.max(12, left)}px`
    tooltip.style.top = `${Math.max(12, top)}px`
  }

  function hideTooltip() {
    tooltip.style.opacity = '0'
  }

  // Dynamic Filter & Query Parameter System
  function frameMatchingNodes(filterKey) {
    const matching = fullGraph.nodes.filter((n) => isNodeInFilter(n, filterKey) && typeof n.x === 'number' && typeof n.y === 'number')
    if (!matching.length) return

    let sumX = 0
    let sumY = 0
    matching.forEach((n) => {
      sumX += n.x
      sumY += n.y
    })
    const centerX = sumX / matching.length
    const centerY = sumY / matching.length

    const targetK = matching.length <= 3 ? 1.4 : matching.length <= 8 ? 1.2 : 0.95
    const targetTransform = d3.zoomIdentity
      .translate(width / 2 - centerX * targetK, height / 2 - centerY * targetK)
      .scale(targetK)

    d3Canvas.transition().duration(800).call(zoom.transform, targetTransform)
  }

  function applyFilter(filterKey, updateUrl = false, shouldFrame = false) {
    activeFilter = filterKey

    // Manage preset buttons
    filterBtns.forEach((b) => {
      if (b.getAttribute('data-filter') === filterKey) {
        b.classList.add('is-active')
      } else {
        b.classList.remove('is-active')
      }
    })

    // Manage dynamic tag button
    let dynamicBtn = document.getElementById('dynamic-tag-filter')
    if (filterKey.startsWith('tag:')) {
      const tagLabel = filterKey.slice(4)
      if (!dynamicBtn) {
        dynamicBtn = document.createElement('button')
        dynamicBtn.id = 'dynamic-tag-filter'
        dynamicBtn.className = 'graph-pill-btn is-active tw-text-primary'
        const filtersContainer = document.getElementById('graph-filters')
        if (filtersContainer) {
          filtersContainer.appendChild(dynamicBtn)
        }
      }
      dynamicBtn.innerHTML = `#${tagLabel} <span class="tw-ml-1 tw-opacity-60 hover:tw-opacity-100" title="Clear filter">✕</span>`
      dynamicBtn.setAttribute('data-filter', filterKey)
      dynamicBtn.classList.add('is-active')
      dynamicBtn.onclick = (e) => {
        e.stopPropagation()
        applyFilter('all', true, true)
      }
    } else if (dynamicBtn) {
      dynamicBtn.remove()
    }

    if (updateUrl) {
      const newUrl = new URL(window.location.href)
      if (filterKey === 'all') {
        newUrl.searchParams.delete('tag')
        newUrl.searchParams.delete('filter')
      } else if (filterKey.startsWith('tag:')) {
        newUrl.searchParams.delete('filter')
        newUrl.searchParams.set('tag', filterKey.slice(4))
      } else {
        newUrl.searchParams.delete('tag')
        newUrl.searchParams.set('filter', filterKey)
      }
      window.history.replaceState(null, '', newUrl.toString())
    }

    hideTooltip()
    hideActiveAnchor()
    render()

    if (shouldFrame) {
      frameMatchingNodes(filterKey)
    }
  }

  // Hook up preset filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const filterKey = btn.getAttribute('data-filter')
      if (filterKey === activeFilter) return
      applyFilter(filterKey, true, true)
    })
  })

  // Apply initial filter or tag from URL query parameters
  const urlParams = new URLSearchParams(window.location.search)
  const initialTag = urlParams.get('tag')
  const initialFilter = urlParams.get('filter')

  if (initialTag) {
    const normTag = normalizeTag(initialTag)
    const categoryMatches = ['graphics', 'systems', 'math', 'ai', 'music', 'languages', 'interactive', 'favorites', 'performance']
    if (categoryMatches.includes(normTag)) {
      applyFilter(normTag, false, false)
    } else {
      applyFilter(`tag:${normTag}`, false, false)
    }
    setTimeout(() => {
      frameMatchingNodes(activeFilter)
    }, 450)
  } else if (initialFilter) {
    applyFilter(initialFilter, false, false)
    setTimeout(() => {
      frameMatchingNodes(activeFilter)
    }, 450)
  }
}

// Auto-initialize if container is in document
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initNotesGraph())
  } else {
    initNotesGraph()
  }
}
