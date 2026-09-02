/**
 * Root Preact Application for Topic Constellation Graph
 *
 * Couples the Canvas physics/render engine to the reactive Preact UI Shell,
 * handling filter state, dynamic tag routing, tooltip positioning, and URL sync.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html, useState, useEffect, useRef, useMemo, useCallback } from '../ui/preact.js'
import { NotesGraphEngine } from './NotesGraphEngine.js'
import { TopFilterBar } from './components/TopFilterBar.js'
import { NoteTooltip } from './components/NoteTooltip.js'
import { BottomBar } from './components/BottomBar.js'
import { isNodeInFilter, normalizeTag } from './notes-graph-math.js'

export function NotesGraphApp({ fullGraph, d3 }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const activeAnchorRef = useRef(null)

  // Initialize filter from URL parameters
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window === 'undefined') return 'all'
    const urlParams = new URLSearchParams(window.location.search)
    const initialTag = urlParams.get('tag')
    const initialFilter = urlParams.get('filter')

    if (initialTag) {
      const normTag = normalizeTag(initialTag)
      const categoryMatches = ['graphics', 'systems', 'math', 'ai', 'music', 'languages', 'interactive', 'favorites', 'performance']
      return categoryMatches.includes(normTag) ? normTag : `tag:${normTag}`
    }
    return initialFilter || 'all'
  })

  const [hoveredNode, setHoveredNode] = useState(null)
  const [tooltipPos, setTooltipPos] = useState(null)
  const [isReady, setIsReady] = useState(false)

  // Matching node count calculation
  const matchingCount = useMemo(() => {
    return fullGraph.nodes.filter((n) => isNodeInFilter(n, activeFilter)).length
  }, [fullGraph.nodes, activeFilter])

  // Instantiate canvas engine once on mount
  useEffect(() => {
    if (!canvasRef.current) return

    const engine = new NotesGraphEngine({
      canvas: canvasRef.current,
      fullGraph,
      d3,
      onHoverNode: (node, coords) => {
        setHoveredNode(node)
        setTooltipPos(coords)

        // Update active anchor for native link preview and keyboard shortcuts
        if (activeAnchorRef.current) {
          activeAnchorRef.current.href = node.url
          activeAnchorRef.current.style.left = `${coords.x - node.radius}px`
          activeAnchorRef.current.style.top = `${coords.y - node.radius}px`
          activeAnchorRef.current.style.width = `${node.radius * 2}px`
          activeAnchorRef.current.style.height = `${node.radius * 2}px`
          activeAnchorRef.current.classList.remove('tw-hidden')
        }
      },
      onLeaveNode: () => {
        setHoveredNode(null)
        setTooltipPos(null)
        if (activeAnchorRef.current) {
          activeAnchorRef.current.classList.add('tw-hidden')
        }
      },
      onClickNode: (node) => {
        if (node && node.url) {
          window.location.href = node.url
        }
      },
      onReady: () => {
        setIsReady(true)
        if (activeFilter !== 'all') {
          setTimeout(() => {
            engine.frameMatchingNodes(activeFilter)
          }, 350)
        }
      }
    })

    engineRef.current = engine

    return () => {
      engine.destroy()
    }
  }, [fullGraph, d3])

  // Filter Selection Handler
  const handleSelectFilter = useCallback((filterKey) => {
    setActiveFilter(filterKey)

    if (engineRef.current) {
      engineRef.current.setFilter(filterKey)
      if (filterKey !== 'all') {
        engineRef.current.frameMatchingNodes(filterKey)
      }
    }

    // Synchronize browser history and URL query parameters
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
  }, [])

  // Camera Reset Handler
  const handleResetZoom = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.resetZoom()
    }
  }, [])

  return html`
    <div class="tw-relative tw-w-full tw-h-full tw-overflow-hidden">
      <!-- Fullscreen Canvas (pre-warmed in memory, animated via CSS scale-up on ready) -->
      <canvas
        ref=${canvasRef}
        id="notes-graph-canvas"
        class="tw-w-full tw-h-full tw-block tw-cursor-grab active:tw-cursor-grabbing tw-transition-all tw-duration-500 tw-ease-out ${isReady ? 'tw-opacity-100 tw-scale-100' : 'tw-opacity-0 tw-scale-95'}"
      />

      <!-- Active Hovered Node DOM Anchor (accessibility / title preview only, zero pointer interference) -->
      <a
        ref=${activeAnchorRef}
        id="notes-graph-active-anchor"
        href="#"
        class="tw-absolute tw-hidden tw-rounded-full tw-pointer-events-none tw-z-30 focus:tw-outline-none"
        aria-label="Open article"
      />

      <!-- Top Navigation & Filter Bar -->
      <${TopFilterBar}
        activeFilter=${activeFilter}
        onSelectFilter=${handleSelectFilter}
      />

      <!-- Floating Passive Note Preview Card -->
      <${NoteTooltip}
        node=${hoveredNode}
        pos=${tooltipPos}
      />

      <!-- Bottom Floating Status Bar -->
      <${BottomBar}
        matchingCount=${matchingCount}
        totalCount=${fullGraph.nodes.length}
        onResetZoom=${handleResetZoom}
      />
    </div>
  `
}
