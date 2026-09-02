/**
 * Canvas Physics & 4-Pass Rendering Engine for Topic Constellation Graph
 *
 * Handles D3 force simulation, smooth camera transitions, spatial hit testing,
 * circular cover art clipping with animated scale + rotation, smooth opacity transitions,
 * and element-matching hover outlines.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import {
  isNodeInFilter,
  getIndicatorColors,
  shouldShowNodeLabel
} from './notes-graph-math.js'

export class NotesGraphEngine {
  constructor({
    canvas,
    fullGraph,
    d3,
    initialFilter = 'all',
    onHoverNode = () => {},
    onLeaveNode = () => {},
    onClickNode = () => {},
    onReady = () => {}
  }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.fullGraph = fullGraph
    this.d3 = d3
    this.onHoverNode = onHoverNode
    this.onLeaveNode = onLeaveNode
    this.onClickNode = onClickNode
    this.onReady = onReady

    this.activeFilter = initialFilter
    this.hoveredNode = null
    this.hoveredNeighbors = new Set()
    this.transform = d3.zoomIdentity
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.dpr = window.devicePixelRatio || 1

    // Initialize per-node animation state honoring initial filter
    this.fullGraph.nodes.forEach((node) => {
      const inFilter = isNodeInFilter(node, this.activeFilter)
      node.animScale = 1.0
      node.animRotate = 0.0
      node.animAlpha = this.activeFilter !== 'all' ? (inFilter ? 1.0 : 0.08) : 1.0
      node.animHalo = 0.0
    })

    // Image cache for article cover art
    this.imageCache = new Map()
    this.preloadImages()

    // Setup Canvas & D3 Zoom
    this.resizeCanvas()
    this.setupZoom()

    // Cluster Target Anchors
    // 4-Quadrant Cluster Target Anchors
    this.clusterAngles = {
      graphics: (-135 * Math.PI) / 180, // North-West
      math: (-45 * Math.PI) / 180,       // North-East
      systems: (135 * Math.PI) / 180,    // South-West
      life: (45 * Math.PI) / 180         // South-East
    }

    // Setup Animation Loop
    this.isAnimating = false
    this.animFrameId = null
    this.lastAnimTime = 0
    this.setupAnimationStep()

    // Setup Physics & Pre-warm
    this.setupSimulation()

    // Setup Event Listeners
    this.bindEvents()

    // Theme observer
    this.themeObserver = new MutationObserver(() => this.render())
    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
  }

  preloadImages() {
    this.fullGraph.nodes.forEach((node) => {
      if (node.image && !this.imageCache.has(node.image)) {
        const img = new Image()
        img.src = node.image
        img.onload = () => {
          this.imageCache.set(node.image, img)
          this.render()
        }
        this.imageCache.set(node.image, img)
      }
    })
  }

  resizeCanvas() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.dpr = window.devicePixelRatio || 1

    this.canvas.width = Math.floor(this.width * this.dpr)
    this.canvas.height = Math.floor(this.height * this.dpr)
    this.canvas.style.width = `${this.width}px`
    this.canvas.style.height = `${this.height}px`

    this.ctx.setTransform(1, 0, 0, 1, 0, 0)
    this.ctx.scale(this.dpr, this.dpr)
  }

  setupZoom() {
    this.zoom = this.d3
      .zoom()
      .scaleExtent([0.7, 3.5])
      .on('zoom', (event) => {
        this.transform = event.transform
        this.render()
        if (this.hoveredNode) {
          const screenX = this.transform.applyX(this.hoveredNode.x)
          const screenY = this.transform.applyY(this.hoveredNode.y)
          this.onHoverNode(this.hoveredNode, { x: screenX, y: screenY })
        }
      })

    this.d3Canvas = this.d3.select(this.canvas)
    this.d3Canvas.call(this.zoom)
  }

  getClusterTargetX(d) {
    const angle = this.clusterAngles[d.cluster] || 0
    const clusterSpread = Math.min(this.width, this.height) * 0.2
    return this.width / 2 + Math.cos(angle) * clusterSpread
  }

  getClusterTargetY(d) {
    const angle = this.clusterAngles[d.cluster] || 0
    const clusterSpread = Math.min(this.width, this.height) * 0.2
    return this.height / 2 + Math.sin(angle) * clusterSpread
  }

  setupSimulation() {
    // 1. Pre-seed coordinates near cluster target anchors so nodes relax organically from center
    this.fullGraph.nodes.forEach((n) => {
      const targetX = this.getClusterTargetX(n)
      const targetY = this.getClusterTargetY(n)
      n.x = targetX + (Math.random() - 0.5) * 60
      n.y = targetY + (Math.random() - 0.5) * 60
    })

    this.simulation = this.d3
      .forceSimulation(this.fullGraph.nodes)
      .force(
        'link',
        this.d3
          .forceLink(this.fullGraph.links)
          .id((d) => d.id)
          .distance((d) => Math.max(45, 80 - d.weight * 10))
          .strength(0.35)
      )
      .force('charge', this.d3.forceManyBody().strength(-70))
      .force('center', this.d3.forceCenter(this.width / 2, this.height / 2))
      .force('clusterX', this.d3.forceX((d) => this.getClusterTargetX(d)).strength(0.06))
      .force('clusterY', this.d3.forceY((d) => this.getClusterTargetY(d)).strength(0.06))
      .force(
        'collide',
        this.d3.forceCollide().radius((d) => d.radius + 18).iterations(2)
      )
      .alphaDecay(0.02)

    // 2. Pre-warm simulation invisibly in memory
    for (let i = 0; i < 120; i++) {
      this.simulation.tick()
    }

    // 3. Render settled constellation
    this.render()

    // 4. Notify Preact app that engine is ready for scale-up entrance
    requestAnimationFrame(() => {
      this.onReady()
    })

    // 5. Connect live tick listener for any ongoing physics/interactions
    this.simulation.on('tick', () => this.render())
  }

  setupAnimationStep() {
    this.stepAnimation = (now) => {
      if (!this.isAnimating) return
      const dt = Math.min(34, now - (this.lastAnimTime || now))
      this.lastAnimTime = now

      // Smooth easing (~180ms ease-out)
      const t = 1 - Math.exp(-dt * 0.014)
      let needsContinue = false

      const hovered = this.hoveredNode
      const hoveredNeighbors = this.hoveredNeighbors

      this.fullGraph.nodes.forEach((node) => {
        const inFilter = isNodeInFilter(node, this.activeFilter)
        const isHovered = hovered && node.id === hovered.id
        const isNeighbor = hovered && hoveredNeighbors.has(node.id)

        let targetAlpha = 1.0
        if (hovered) {
          targetAlpha = isHovered || isNeighbor ? 1.0 : 0.15
        } else if (this.activeFilter !== 'all') {
          targetAlpha = inFilter ? 1.0 : 0.08
        }

        const targetScale = isHovered ? 1.18 : 1.0
        const targetRotate = isHovered ? (3 * Math.PI) / 180 : 0.0
        const targetHalo = isHovered ? 1.0 : 0.0

        node.animAlpha += (targetAlpha - node.animAlpha) * t
        node.animScale += (targetScale - node.animScale) * t
        node.animRotate += (targetRotate - node.animRotate) * t
        node.animHalo += (targetHalo - node.animHalo) * t

        if (
          Math.abs(targetAlpha - node.animAlpha) > 0.003 ||
          Math.abs(targetScale - node.animScale) > 0.003 ||
          Math.abs(targetRotate - node.animRotate) > 0.001 ||
          Math.abs(targetHalo - node.animHalo) > 0.003
        ) {
          needsContinue = true
        }
      })

      this.render()

      if (needsContinue) {
        this.animFrameId = requestAnimationFrame(this.stepAnimation)
      } else {
        // Snap values cleanly when animation settles
        this.fullGraph.nodes.forEach((node) => {
          const inFilter = isNodeInFilter(node, this.activeFilter)
          const isHovered = hovered && node.id === hovered.id
          const isNeighbor = hovered && hoveredNeighbors.has(node.id)

          node.animAlpha = hovered
            ? isHovered || isNeighbor ? 1.0 : 0.15
            : this.activeFilter !== 'all' ? (inFilter ? 1.0 : 0.08) : 1.0
          node.animScale = isHovered ? 1.18 : 1.0
          node.animRotate = isHovered ? (3 * Math.PI) / 180 : 0.0
          node.animHalo = isHovered ? 1.0 : 0.0
        })
        this.render()
        this.isAnimating = false
        this.animFrameId = null
      }
    }
  }

  startAnimation() {
    this.lastAnimTime = performance.now()
    if (!this.isAnimating) {
      this.isAnimating = true
      this.animFrameId = requestAnimationFrame(this.stepAnimation)
    }
  }

  updateHoveredNeighbors(hovered) {
    this.hoveredNeighbors.clear()
    if (hovered) {
      this.fullGraph.links.forEach((l) => {
        const sId = typeof l.source === 'object' ? l.source.id : l.source
        const tId = typeof l.target === 'object' ? l.target.id : l.target
        if (sId === hovered.id) this.hoveredNeighbors.add(tId)
        if (tId === hovered.id) this.hoveredNeighbors.add(sId)
      })
    }
  }

  bindEvents() {
    this.handleResize = () => {
      this.resizeCanvas()
      this.simulation.force('clusterX', this.d3.forceX((d) => this.getClusterTargetX(d)).strength(0.18))
      this.simulation.force('clusterY', this.d3.forceY((d) => this.getClusterTargetY(d)).strength(0.18))
      this.simulation.alpha(0.3).restart()
    }
    window.addEventListener('resize', this.handleResize)

    let isMouseDown = false
    let isDragging = false
    let pointerDownPos = { x: 0, y: 0 }

    this.canvas.addEventListener('mousedown', (e) => {
      isMouseDown = true
      isDragging = false
      pointerDownPos = { x: e.clientX, y: e.clientY }
    })

    this.handleMouseUp = () => {
      isMouseDown = false
      isDragging = false
    }
    window.addEventListener('mouseup', this.handleMouseUp)

    this.canvas.addEventListener('mousemove', (e) => {
      if (isMouseDown) {
        const dist = Math.hypot(e.clientX - pointerDownPos.x, e.clientY - pointerDownPos.y)
        if (dist > 5) {
          isDragging = true
        }
      }
      this.handleMouseMove(e, isDragging)
    })

    this.canvas.addEventListener('click', (e) => {
      if (!isDragging && this.hoveredNode) {
        this.onClickNode(this.hoveredNode, e)
      }
    })

    this.canvas.addEventListener('mouseleave', () => {
      if (this.hoveredNode) {
        this.hoveredNode = null
        this.updateHoveredNeighbors(null)
        this.onLeaveNode()
        this.startAnimation()
      }
    })
  }

  handleMouseMove(e, isDragging) {
    if (isDragging) {
      if (this.hoveredNode) {
        this.hoveredNode = null
        this.updateHoveredNeighbors(null)
        this.onLeaveNode()
        this.startAnimation()
      }
      return
    }

    const rect = this.canvas.getBoundingClientRect()
    const mouseScreenX = e.clientX - rect.left
    const mouseScreenY = e.clientY - rect.top

    // Invert zoom transform to find canvas world coordinates
    const worldX = this.transform.invertX(mouseScreenX)
    const worldY = this.transform.invertY(mouseScreenY)

    let found = null
    for (let i = this.fullGraph.nodes.length - 1; i >= 0; i--) {
      const node = this.fullGraph.nodes[i]
      if (this.activeFilter !== 'all' && !isNodeInFilter(node, this.activeFilter)) {
        continue
      }
      const dx = worldX - node.x
      const dy = worldY - node.y
      if (dx * dx + dy * dy <= (node.radius + 6) * (node.radius + 6)) {
        found = node
        break
      }
    }

    if (found !== this.hoveredNode) {
      this.hoveredNode = found
      this.updateHoveredNeighbors(found)
      if (found) {
        this.canvas.style.cursor = 'pointer'
        const screenX = this.transform.applyX(found.x)
        const screenY = this.transform.applyY(found.y)
        this.onHoverNode(found, { x: screenX, y: screenY })
      } else {
        this.canvas.style.cursor = 'default'
        this.onLeaveNode()
      }
      this.startAnimation()
    } else if (found) {
      // Update screen coords on slight adjustments
      const screenX = this.transform.applyX(found.x)
      const screenY = this.transform.applyY(found.y)
      this.onHoverNode(found, { x: screenX, y: screenY })
    }
  }

  setFilter(filterKey) {
    this.activeFilter = filterKey
    this.hoveredNode = null
    this.updateHoveredNeighbors(null)
    this.onLeaveNode()
    this.startAnimation()
  }

  resetZoom() {
    this.d3Canvas.transition().duration(600).call(this.zoom.transform, this.d3.zoomIdentity)
  }

  frameMatchingNodes(filterKey) {
    const matching = this.fullGraph.nodes.filter(
      (n) => isNodeInFilter(n, filterKey) && typeof n.x === 'number' && typeof n.y === 'number'
    )
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
    const targetTransform = this.d3.zoomIdentity
      .translate(this.width / 2 - centerX * targetK, this.height / 2 - centerY * targetK)
      .scale(targetK)

    this.d3Canvas.transition().duration(800).call(this.zoom.transform, targetTransform)
  }

  render() {
    const ctx = this.ctx
    const isLight = document.documentElement.getAttribute('data-theme') === 'light'
    const textDefault = isLight ? '#18181b' : 'rgba(255, 255, 255, 0.90)'
    const textHovered = isLight ? '#000000' : '#ffffff'
    const linkDefault = isLight ? 'rgba(0, 0, 0, 0.10)' : 'rgba(255, 255, 255, 0.12)'
    const linkConnected = isLight ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.55)'
    const strokeDefault = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(255, 255, 255, 0.22)'

    const zoomK = this.transform.k

    ctx.save()
    ctx.clearRect(0, 0, this.width, this.height)
    ctx.translate(this.transform.x, this.transform.y)
    ctx.scale(this.transform.k, this.transform.k)

    const hovered = this.hoveredNode
    const hoveredNeighbors = this.hoveredNeighbors

    // PASS 1: Links / Constellation Edges
    this.fullGraph.links.forEach((link) => {
      const source = link.source
      const target = link.target
      if (typeof source.x !== 'number' || typeof target.x !== 'number') return

      const isSourceMatch = isNodeInFilter(source, this.activeFilter)
      const isTargetMatch = isNodeInFilter(target, this.activeFilter)
      if (!isSourceMatch && !isTargetMatch) return

      const isConnected =
        hovered && (source.id === hovered.id || target.id === hovered.id)

      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.lineTo(target.x, target.y)

      if (isConnected) {
        ctx.strokeStyle = linkConnected
        ctx.lineWidth = Math.min(2.8, 1.2 + link.weight * 0.55)
      } else if (hovered) {
        ctx.strokeStyle = linkDefault
        ctx.lineWidth = 0.6
      } else {
        ctx.strokeStyle = linkDefault
        ctx.lineWidth = Math.min(2.0, 0.7 + link.weight * 0.35)
      }
      ctx.stroke()
    })

    // PASS 2: Ambient Halo on hover (Smoothly animated matching element background color)
    this.fullGraph.nodes.forEach((node) => {
      if (!node.animHalo || node.animHalo < 0.01 || typeof node.x !== 'number') return
      ctx.save()
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius + 10 * node.animHalo, 0, Math.PI * 2)
      ctx.fillStyle = node.color
      ctx.globalAlpha = node.animHalo * (isLight ? 0.22 : 0.35)
      ctx.fill()
      ctx.restore()
    })

    // PASS 3: Nodes + Article Cover Art + Cluster-Themed Indicators
    this.fullGraph.nodes.forEach((node) => {
      if (typeof node.x !== 'number') return

      ctx.save()
      ctx.globalAlpha = node.animAlpha

      // 1. Base Node Background Fill (Cluster color)
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
      ctx.fillStyle = node.color
      ctx.fill()

      // 2. Article Cover Art with Smooth Animated Scale + Rotate
      const img = node.image ? this.imageCache.get(node.image) : null
      if (img && img.complete && img.naturalWidth > 0) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
        ctx.clip()

        const imgOpacity = 0.80 + 0.15 * node.animHalo

        ctx.translate(node.x, node.y)
        ctx.rotate(node.animRotate)
        ctx.scale(node.animScale, node.animScale)
        ctx.globalAlpha = node.animAlpha * imgOpacity

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

      // 3. Crisp Perimeter Ring: On hover strictly matches background color of the element (node.color)
      ctx.beginPath()
      ctx.arc(node.x, node.y, node.radius, 0, 2 * Math.PI)
      if (node.animHalo > 0.05) {
        ctx.strokeStyle = node.color
        ctx.lineWidth = 1.2 + 1.6 * node.animHalo
      } else {
        ctx.strokeStyle = strokeDefault
        ctx.lineWidth = 1.2
      }
      ctx.stroke()

      // 4. Indicator Badges (★ Favorite, ✦ Interactive)
      const badgeR = Math.max(6, Math.min(8, node.radius * 0.3))
      const badgeShadowColor = isLight ? 'rgba(0, 0, 0, 0.28)' : 'rgba(0, 0, 0, 0.65)'
      const indicatorColors = getIndicatorColors(node.cluster)

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
        ctx.arc(starX, starY, badgeR, 0, 2 * Math.PI)
        ctx.fillStyle = node.color
        ctx.fill()

        ctx.font = `bold ${badgeR * 1.25}px system-ui, sans-serif`
        ctx.fillStyle = indicatorColors.star
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('★', starX, starY + 0.5)
        ctx.restore()
      }

      if (node.interactive) {
        const sparkAngle = (-3 * Math.PI) / 4 // 135 deg (top-left)
        const sparkX = node.x + Math.cos(sparkAngle) * node.radius
        const sparkY = node.y + Math.sin(sparkAngle) * node.radius

        ctx.save()
        ctx.shadowColor = badgeShadowColor
        ctx.shadowBlur = 3.5
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 1

        ctx.beginPath()
        ctx.arc(sparkX, sparkY, badgeR, 0, 2 * Math.PI)
        ctx.fillStyle = node.color
        ctx.fill()

        ctx.font = `bold ${badgeR * 1.15}px system-ui, sans-serif`
        ctx.fillStyle = indicatorColors.interactive
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText('✦', sparkX, sparkY + 0.5)
        ctx.restore()
      }

      ctx.restore()
    })

    // PASS 4: Clean Text Labels with Animated Opacity
    const worldFontSize = 10.5 / zoomK
    const labelOffsetY = 5 / zoomK

    // Viewport bounds in world coordinates with margin
    const minWorldX = -this.transform.x / zoomK - 60
    const maxWorldX = (this.width - this.transform.x) / zoomK + 60
    const minWorldY = -this.transform.y / zoomK - 60
    const maxWorldY = (this.height - this.transform.y) / zoomK + 60

    this.fullGraph.nodes.forEach((node) => {
      if (typeof node.x !== 'number') return

      // Viewport culling: only render labels for nodes physically in view
      if (
        node.x < minWorldX ||
        node.x > maxWorldX ||
        node.y < minWorldY ||
        node.y > maxWorldY
      ) {
        return
      }
      const inFilter = isNodeInFilter(node, this.activeFilter)
      const isHovered = hovered && node.id === hovered.id
      const isNeighbor = hovered && hoveredNeighbors.has(node.id)
      const isFiltered = this.activeFilter !== 'all'

      if (hovered && !isHovered && !isNeighbor) return
      if (isFiltered && !inFilter && !isHovered && !isNeighbor) return

      const showLabel = shouldShowNodeLabel(
        node,
        zoomK,
        isHovered,
        isNeighbor,
        isFiltered
      )
      if (!showLabel) return

      ctx.save()
      ctx.globalAlpha = node.animAlpha
      ctx.font = isHovered
        ? `bold ${worldFontSize}px var(--family-sans, system-ui, sans-serif)`
        : `${worldFontSize}px var(--family-sans, system-ui, sans-serif)`
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

  destroy() {
    if (this.simulation) this.simulation.stop()
    if (this.themeObserver) this.themeObserver.disconnect()
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId)
    window.removeEventListener('resize', this.handleResize)
    if (this.handleMouseUp) window.removeEventListener('mouseup', this.handleMouseUp)
  }
}
