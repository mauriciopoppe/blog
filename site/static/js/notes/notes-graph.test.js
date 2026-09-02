import { describe, it, expect } from 'bun:test'
import {
  calculateNodeRadius,
  getClusterColor,
  getClusterCategory,
  getIndicatorColors,
  normalizeTag,
  isNodeInFilter,
  buildGraphData,
  calculateEdgeWeight,
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
    it('accurately identifies primary thematic cluster from tags across 4 core clusters', () => {
      expect(getClusterCategory(['computer graphics', 'rotation'])).toBe('graphics')
      expect(getClusterCategory(['performance', 'system design'])).toBe('systems')
      expect(getClusterCategory(['c++', 'programming', 'tooling'])).toBe('systems')
      expect(getClusterCategory(['math', 'calculus', 'graph theory'])).toBe('math')
      expect(getClusterCategory(['ai', 'machine learning'])).toBe('math')
      expect(getClusterCategory(['machine learning', 'hyperparameter tuning'])).toBe('math')
      expect(getClusterCategory(['music', 'bachata', 'guitar'])).toBe('life')
      expect(getClusterCategory(['life', 'productivity', 'task management'])).toBe('life')
      expect(getClusterCategory(['career', 'productivity', 'software-engineering'])).toBe('life')
      expect(getClusterCategory(['learning', 'languages', 'french', 'life'])).toBe('life')
      expect(getClusterCategory(['learning', 'languages', 'japanese', 'life'])).toBe('life')
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
      expect(getClusterColor(['c++', 'tooling'])).toBe('#ff7043')
    })

    it('maps mathematics, graph theory, and ML tags to sky blue cluster token', () => {
      expect(getClusterColor(['math', 'calculus'])).toBe('#38bdf8')
      expect(getClusterColor(['graph theory', 'trees'])).toBe('#38bdf8')
      expect(getClusterColor(['machine learning', 'hyperparameter tuning'])).toBe('#38bdf8')
    })

    it('maps music, life, languages, and productivity tags to amber cluster token', () => {
      expect(getClusterColor(['music', 'bachata'])).toBe('#fbbf24')
      expect(getClusterColor(['productivity', 'life'])).toBe('#fbbf24')
      expect(getClusterColor(['learning', 'french'])).toBe('#fbbf24')
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

    it('provides white star on life amber to prevent blending with amber background', () => {
      const colors = getIndicatorColors('life')
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

      const lifeNote = { tags: ['life', 'habits', 'journaling'], cluster: 'life' }
      const frenchNote = { tags: ['learning', 'languages', 'french', 'life'], cluster: 'life' }
      const mathNote = { tags: ['math', 'calculus'], cluster: 'math' }

      expect(isNodeInFilter(lifeNote, 'tag:life')).toBe(true)
      expect(isNodeInFilter(frenchNote, 'tag:life')).toBe(true)
      expect(isNodeInFilter(mathNote, 'tag:life')).toBe(false)
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

    it('level 1: resting overview (k < 1.25): shows labels strictly for favorite notes', () => {
      expect(shouldShowNodeLabel(favoriteNode, 1.0)).toBe(true)
      expect(shouldShowNodeLabel(landmarkNode, 1.0)).toBe(false)
      expect(shouldShowNodeLabel(midNode, 1.0)).toBe(false)
      expect(shouldShowNodeLabel(interactiveNode, 1.0)).toBe(false)
      expect(shouldShowNodeLabel(minorNode, 1.0)).toBe(false)
    })

    it('level 2: moderate zoom (1.25 <= k < 1.75): reveals favorites and major interactive hubs', () => {
      const popularInteractiveNode = { isFavorite: false, interactive: true, popularity: 80 }
      expect(shouldShowNodeLabel(favoriteNode, 1.4)).toBe(true)
      expect(shouldShowNodeLabel(popularInteractiveNode, 1.4)).toBe(true)
      expect(shouldShowNodeLabel(minorNode, 1.4)).toBe(false)
    })

    it('level 3: deep zoom (k >= 1.75): reveals all notes in the focused view', () => {
      expect(shouldShowNodeLabel(minorNode, 2.0)).toBe(true)
      expect(shouldShowNodeLabel(landmarkNode, 2.0)).toBe(true)
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
      expect(cgLink.weight).toBeGreaterThan(0)
    })
  })

  describe('calculateEdgeWeight (Graph Edge Audit)', () => {
    const quaternions = {
      cluster: 'graphics',
      tags: ['quaternions', '3d', 'computer graphics', 'rotation']
    }
    const queuingTheory = {
      cluster: 'systems',
      tags: ['system design', 'performance', 'queuing theory', 'distributed systems', 'math', 'latency']
    }
    const complexNumbers = {
      cluster: 'math',
      tags: ['math', 'numeral systems', 'complex numbers', 'imaginary numbers']
    }
    const bayesNets = {
      cluster: 'math',
      tags: ['math', 'probability', 'bayesian networks', 'exact inference']
    }
    const performanceFundamentals = {
      cluster: 'systems',
      tags: ['performance', 'system design', 'queuing theory', 'latency']
    }
    const rotation = {
      cluster: 'graphics',
      tags: ['rotation', 'quaternions', '3d', 'computer graphics']
    }

    it('prevents cross-cluster connections when only sharing broad generic umbrella tags', () => {
      // Quaternions and Queuing Theory must never connect!
      expect(calculateEdgeWeight(quaternions, queuingTheory)).toBe(0)

      // Complex Numbers and Queuing Theory must never connect!
      expect(calculateEdgeWeight(complexNumbers, queuingTheory)).toBe(0)

      // Bayesian Networks and Quaternions must never connect!
      expect(calculateEdgeWeight(bayesNets, quaternions)).toBe(0)
    })

    it('creates strong edges for genuinely related articles with shared specific domain tags', () => {
      // Quaternions and Rotation are deeply related 3D rotation topics
      expect(calculateEdgeWeight(quaternions, rotation)).toBeGreaterThan(0)

      // Queuing Theory and Performance Fundamentals share queuing theory, latency, performance
      expect(calculateEdgeWeight(queuingTheory, performanceFundamentals)).toBeGreaterThan(0)
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
