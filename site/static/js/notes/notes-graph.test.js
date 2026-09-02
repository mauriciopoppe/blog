import { describe, it, expect } from 'bun:test'
import {
  calculateNodeRadius,
  getClusterColor,
  getClusterCategory,
  getIndicatorColors,
  normalizeTag,
  isNodeInFilter,
  buildGraphData,
  filterGraphData,
  shouldShowNodeLabel
} from './notes-graph.js'

describe('Notes Knowledge Graph Logic', () => {
  describe('calculateNodeRadius', () => {
    it('scales radius smoothly with square root of popularity score', () => {
      const minR = 14
      const maxR = 32

      const r0 = calculateNodeRadius(0, false, minR, maxR)
      const r25 = calculateNodeRadius(25, false, minR, maxR)
      const r100 = calculateNodeRadius(100, false, minR, maxR)

      expect(r0).toBe(minR)
      expect(r100).toBe(maxR)
      expect(r25).toBe(minR + (maxR - minR) * 0.5)
    })

    it('boosts radius significantly for curated favorite articles', () => {
      const minR = 14
      const maxR = 32

      const rRegular = calculateNodeRadius(50, false, minR, maxR)
      const rFavorite = calculateNodeRadius(50, true, minR, maxR)

      expect(rFavorite).toBeGreaterThan(rRegular)
      expect(rFavorite - rRegular).toBeGreaterThanOrEqual(6)
    })

    it('handles missing or undefined popularity with baseline fallback', () => {
      const minR = 14
      const maxR = 32
      const rDefault = calculateNodeRadius(undefined, false, minR, maxR)
      expect(rDefault).toBeGreaterThan(minR)
      expect(rDefault).toBeLessThan(maxR)
    })
  })

  describe('getClusterCategory', () => {
    it('accurately identifies primary thematic cluster from tags', () => {
      expect(getClusterCategory(['computer graphics', 'rotation'])).toBe('graphics')
      expect(getClusterCategory(['performance', 'system design'])).toBe('systems')
      expect(getClusterCategory(['math', 'calculus', 'graph theory'])).toBe('math')
      expect(getClusterCategory(['ai', 'machine learning', 'c++'])).toBe('ai')
      expect(getClusterCategory(['music', 'bachata', 'guitar'])).toBe('music')
      expect(getClusterCategory(['languages', 'french', 'learning'])).toBe('languages')
      expect(getClusterCategory(['learning', 'languages', 'french', 'life'])).toBe('languages')
      expect(getClusterCategory(['learning', 'languages', 'japanese', 'life'])).toBe('languages')
    })
  })

  describe('getClusterColor', () => {
    it('maps computer graphics tags to purple cluster token', () => {
      expect(getClusterColor(['computer graphics', 'transformation matrix'])).toBe('#a855f7')
      expect(getClusterColor(['quaternions', 'rotation'])).toBe('#a855f7')
    })

    it('maps systems and performance tags to coral cluster token', () => {
      expect(getClusterColor(['performance', 'queuing theory'])).toBe('#ff7043')
      expect(getClusterColor(['system design', 'distributed systems'])).toBe('#ff7043')
    })

    it('maps mathematics and graph theory tags to sky blue cluster token', () => {
      expect(getClusterColor(['math', 'calculus'])).toBe('#38bdf8')
      expect(getClusterColor(['graph theory', 'trees'])).toBe('#38bdf8')
    })

    it('maps AI and software engineering tags to emerald cluster token', () => {
      expect(getClusterColor(['ai', 'machine learning'])).toBe('#34d399')
      expect(getClusterColor(['c++', 'programming languages'])).toBe('#34d399')
    })

    it('maps music, life, and productivity tags to amber cluster token', () => {
      expect(getClusterColor(['music', 'bachata'])).toBe('#fbbf24')
      expect(getClusterColor(['productivity', 'life'])).toBe('#fbbf24')
    })

    it('maps language learning tags to indigo cluster token', () => {
      expect(getClusterColor(['languages', 'french'])).toBe('#818cf8')
    })

    it('falls back to default luminous white/grey when tags are empty or unmatched', () => {
      expect(getClusterColor([])).toBe('rgba(255, 255, 255, 0.75)')
    })
  })

  describe('getIndicatorColors', () => {
    it('provides high contrast white interactive indicator on systems coral to avoid color clashing', () => {
      const colors = getIndicatorColors('systems')
      expect(colors.interactive).toBe('#ffffff')
      expect(colors.star).toBe('#fef08a')
    })

    it('provides electric cyan interactive indicator on graphics purple', () => {
      const colors = getIndicatorColors('graphics')
      expect(colors.interactive).toBe('#67e8f9')
      expect(colors.star).toBe('#fbbf24')
    })

    it('provides white star on music amber to prevent blending with amber background', () => {
      const colors = getIndicatorColors('music')
      expect(colors.star).toBe('#ffffff')
    })
  })

  describe('isNodeInFilter', () => {
    const cgNode = { cluster: 'graphics', interactive: false }
    const sysNode = { cluster: 'systems', interactive: true }

    it('matches all nodes when filter is all', () => {
      expect(isNodeInFilter(cgNode, 'all')).toBe(true)
      expect(isNodeInFilter(sysNode, 'all')).toBe(true)
    })

    it('matches by cluster category', () => {
      expect(isNodeInFilter(cgNode, 'graphics')).toBe(true)
      expect(isNodeInFilter(sysNode, 'graphics')).toBe(false)
      expect(isNodeInFilter(sysNode, 'performance')).toBe(true)
    })

    it('matches interactive articles', () => {
      expect(isNodeInFilter(cgNode, 'interactive')).toBe(false)
      expect(isNodeInFilter(sysNode, 'interactive')).toBe(true)
    })

    it('matches favorite articles', () => {
      const favNode = { cluster: 'systems', isFavorite: true }
      const regularNode = { cluster: 'systems', isFavorite: false }
      expect(isNodeInFilter(favNode, 'favorites')).toBe(true)
      expect(isNodeInFilter(favNode, 'favorite')).toBe(true)
      expect(isNodeInFilter(regularNode, 'favorites')).toBe(false)
    })

    it('matches dynamic tag filters with slug normalization', () => {
      const tmuxNode = { tags: ['tmux', 'zellij', 'terminal', 'productivity'] }
      const cgNodeWithSpaces = { tags: ['Computer Graphics', 'Transformation Matrix'] }

      expect(isNodeInFilter(tmuxNode, 'tag:tmux')).toBe(true)
      expect(isNodeInFilter(tmuxNode, 'tag:productivity')).toBe(true)
      expect(isNodeInFilter(tmuxNode, 'tag:graphics')).toBe(false)

      expect(isNodeInFilter(cgNodeWithSpaces, 'tag:computer-graphics')).toBe(true)
      expect(isNodeInFilter(cgNodeWithSpaces, 'tag:transformation-matrix')).toBe(true)
    })
  })

  describe('normalizeTag', () => {
    it('normalizes tags by trimming, lowercasing, and replacing spaces with hyphens', () => {
      expect(normalizeTag('Computer Graphics')).toBe('computer-graphics')
      expect(normalizeTag('  System Design ')).toBe('system-design')
      expect(normalizeTag('Machine_Learning')).toBe('machine-learning')
      expect(normalizeTag('C++')).toBe('c')
    })
  })

  describe('shouldShowNodeLabel (Semantic Zoom & Level of Detail)', () => {
    const favoriteNode = { id: '1', isFavorite: true, popularity: 50, interactive: false }
    const landmarkNode = { id: '2', isFavorite: false, popularity: 90, interactive: false }
    const midNode = { id: '3', isFavorite: false, popularity: 65, interactive: false }
    const minorNode = { id: '4', isFavorite: false, popularity: 40, interactive: false }
    const interactiveNode = { id: '5', isFavorite: false, popularity: 40, interactive: true }

    it('level 1 (zoomed out, k < 0.9): shows only favorites and top landmarks', () => {
      const zoomK = 0.6
      expect(shouldShowNodeLabel(favoriteNode, zoomK)).toBe(true)
      expect(shouldShowNodeLabel(landmarkNode, zoomK)).toBe(true)
      expect(shouldShowNodeLabel(midNode, zoomK)).toBe(false)
      expect(shouldShowNodeLabel(minorNode, zoomK)).toBe(false)
    })

    it('level 2 (mid zoom, 0.9 <= k < 1.4): shows favorites, secondary hubs, and interactive nodes', () => {
      const zoomK = 1.0
      expect(shouldShowNodeLabel(favoriteNode, zoomK)).toBe(true)
      expect(shouldShowNodeLabel(landmarkNode, zoomK)).toBe(true)
      expect(shouldShowNodeLabel(midNode, zoomK)).toBe(true)
      expect(shouldShowNodeLabel(interactiveNode, zoomK)).toBe(true)
      expect(shouldShowNodeLabel(minorNode, zoomK)).toBe(false)
    })

    it('level 3 (zoomed in, k >= 1.4): shows all nodes', () => {
      const zoomK = 1.6
      expect(shouldShowNodeLabel(minorNode, zoomK)).toBe(true)
    })

    it('always shows label when hovered or neighbor regardless of zoom', () => {
      const zoomK = 0.4
      expect(shouldShowNodeLabel(minorNode, zoomK, true, false)).toBe(true)
      expect(shouldShowNodeLabel(minorNode, zoomK, false, true)).toBe(true)
    })
  })

  describe('buildGraphData', () => {
    const mockNotes = [
      {
        id: '/notes/computer-graphics/transformation-matrix/',
        url: '/notes/computer-graphics/transformation-matrix/',
        title: 'Transformation Matrix',
        tags: ['computer graphics', 'transformation matrix', 'linear algebra'],
        popularity: 80,
        isFavorite: true,
        interactive: true
      },
      {
        id: '/notes/computer-graphics/rotation/',
        url: '/notes/computer-graphics/rotation/',
        title: 'Rotation',
        tags: ['computer graphics', 'transformation matrix', 'rotation'],
        popularity: 40,
        isFavorite: false,
        interactive: false
      },
      {
        id: '/notes/performance-fundamentals/',
        url: '/notes/performance-fundamentals/',
        title: 'Performance Fundamentals',
        tags: ['performance', 'system design'],
        popularity: 100,
        isFavorite: true,
        interactive: true
      }
    ]

    it('creates nodes with radius, favorite boost, cluster category, and thematic color', () => {
      const graph = buildGraphData(mockNotes)
      expect(graph.nodes.length).toBe(3)

      const cgNode = graph.nodes.find((n) => n.id === '/notes/computer-graphics/transformation-matrix/')
      expect(cgNode.isFavorite).toBe(true)
      expect(cgNode.cluster).toBe('graphics')
      expect(cgNode.color).toBe('#a855f7')
      expect(cgNode.radius).toBeGreaterThan(30)
    })

    it('creates weighted edges between nodes that share tags', () => {
      const graph = buildGraphData(mockNotes, 3)
      const cgLink = graph.links.find(
        (l) =>
          (l.source === '/notes/computer-graphics/transformation-matrix/' && l.target === '/notes/computer-graphics/rotation/') ||
          (l.target === '/notes/computer-graphics/transformation-matrix/' && l.source === '/notes/computer-graphics/rotation/')
      )

      expect(cgLink).toBeDefined()
      expect(cgLink.weight).toBe(2)
    })
  })

  describe('filterGraphData', () => {
    const mockNotes = [
      {
        id: '/cg',
        url: '/cg',
        title: 'CG',
        tags: ['computer graphics'],
        interactive: true,
        popularity: 80
      },
      {
        id: '/perf',
        url: '/perf',
        title: 'Perf',
        tags: ['performance'],
        interactive: false,
        popularity: 60
      },
      {
        id: '/math',
        url: '/math',
        title: 'Math',
        tags: ['math'],
        interactive: false,
        popularity: 50
      }
    ]

    it('filters nodes by graphics category', () => {
      const fullGraph = buildGraphData(mockNotes)
      const filtered = filterGraphData(fullGraph, 'graphics')

      expect(filtered.nodes.length).toBe(1)
      expect(filtered.nodes[0].id).toBe('/cg')
    })

    it('filters nodes by performance category', () => {
      const fullGraph = buildGraphData(mockNotes)
      const filtered = filterGraphData(fullGraph, 'performance')

      expect(filtered.nodes.length).toBe(1)
      expect(filtered.nodes[0].id).toBe('/perf')
    })

    it('returns all nodes when filter is all', () => {
      const fullGraph = buildGraphData(mockNotes)
      const filtered = filterGraphData(fullGraph, 'all')

      expect(filtered.nodes.length).toBe(3)
    })
  })
})
