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
import { isNodeInFilter, normalizeTag, searchNotes } from './notes-graph-math.js'

export function NotesGraphApp({ fullGraph, d3 }) {
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const activeAnchorRef = useRef(null)
  const searchDebounceRef = useRef(null)

  // Initialize filter from URL parameters
  const [activeFilter, setActiveFilter] = useState(() => {
    if (typeof window === 'undefined') return 'all'
    const urlParams = new URLSearchParams(window.location.search)
    const initialTag = urlParams.get('tag')
    const initialFilter = urlParams.get('filter')

    if (initialTag) {
      const normTag = normalizeTag(initialTag)
      return `tag:${normTag}`
    }
    return initialFilter || 'all'
  })

  const activeFilterRef = useRef(activeFilter)
  activeFilterRef.current = activeFilter

  const [hoveredNode, setHoveredNode] = useState(null)
  const [tooltipPos, setTooltipPos] = useState(null)
  const [isReady, setIsReady] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Matching node count calculation
  const matchingCount = useMemo(() => {
    return fullGraph.nodes.filter((n) => isNodeInFilter(n, activeFilter)).length
  }, [fullGraph.nodes, activeFilter])

  // Instantiate canvas engine once on mount (NEVER re-instantiate on filter/search)
  useEffect(() => {
    if (!canvasRef.current) return

    const initialF = activeFilterRef.current
    const engine = new NotesGraphEngine({
      canvas: canvasRef.current,
      fullGraph,
      d3,
      initialFilter: initialF,
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
          if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
            window.gtag('event', 'notes_graph_node_click', {
              note_title: node.title,
              note_url: node.url,
              note_cluster: node.cluster,
              is_favorite: Boolean(node.isFavorite),
              is_interactive: Boolean(node.interactive),
              active_filter: activeFilterRef.current
            })
          }
          window.location.href = node.url
        }
      },
      onReady: () => {
        setIsReady(true)
        if (initialF !== 'all') {
          setTimeout(() => {
            engine.frameMatchingNodes(initialF, 900)
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
    if (isSearchOpen) {
      setIsSearchOpen(false)
      setSearchQuery('')
    }

    setActiveFilter(filterKey)

    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const count = fullGraph.nodes.filter((n) => isNodeInFilter(n, filterKey)).length
      window.gtag('event', 'notes_graph_filter_select', {
        filter_name: filterKey,
        matching_count: count
      })
    }

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
    } else if (!filterKey.startsWith('search:')) {
      newUrl.searchParams.delete('tag')
      newUrl.searchParams.set('filter', filterKey)
    }
    window.history.replaceState(null, '', newUrl.toString())
  }, [fullGraph.nodes, isSearchOpen])

  // Search Handlers
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query)
    const trimmed = query.trim()
    const filterKey = trimmed ? `search:${trimmed}` : 'all'
    setActiveFilter(filterKey)

    // 1. Instant node visibility update: matching nodes illuminate immediately with zero lag
    if (engineRef.current) {
      engineRef.current.setFilter(filterKey)
    }

    // 2. Progressive, gentle camera zoom/pan (debounced so typing remains completely static)
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }

    searchDebounceRef.current = setTimeout(() => {
      if (!engineRef.current) return
      if (trimmed) {
        const matches = searchNotes(fullGraph.nodes, trimmed)
        if (matches.length > 0 && matches.length <= 14) {
          engineRef.current.frameMatchingNodes(filterKey, 1100)
        }
      } else {
        engineRef.current.resetZoom(800)
      }
    }, 380)
  }, [fullGraph.nodes])

  const handleSearchClose = useCallback(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current)
    }
    setIsSearchOpen(false)
    setSearchQuery('')
    setActiveFilter('all')
    if (engineRef.current) {
      engineRef.current.setFilter('all')
      engineRef.current.resetZoom(800)
    }
  }, [])

  const handleSearchSubmit = useCallback(() => {
    if (!searchQuery || !searchQuery.trim()) return
    const matches = searchNotes(fullGraph.nodes, searchQuery)
    if (matches.length > 0) {
      const topMatch = matches[0]
      if (topMatch.url) {
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'notes_graph_search', {
            search_term: searchQuery,
            matching_count: matches.length,
            selected_url: topMatch.url
          })
        }
        window.location.href = topMatch.url
      }
    }
  }, [fullGraph.nodes, searchQuery])

  // Global Keyboard Shortcuts: Cmd+K / Ctrl+K / '/' to open search, Escape to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isCmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'
      const isSlash =
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'

      if (isCmdK || isSlash) {
        e.preventDefault()
        setIsSearchOpen(true)
      } else if (e.key === 'Escape' && isSearchOpen) {
        e.preventDefault()
        handleSearchClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSearchOpen, handleSearchClose])

  // Camera Reset Handler
  const handleResetZoom = useCallback(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'notes_graph_reset_view')
    }
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
        searchQuery=${searchQuery}
        onSearchChange=${handleSearchChange}
        onSearchSubmit=${handleSearchSubmit}
        onSearchClose=${handleSearchClose}
        isSearchOpen=${isSearchOpen}
        setIsSearchOpen=${setIsSearchOpen}
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
