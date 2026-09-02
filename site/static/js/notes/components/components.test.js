import { describe, it, expect } from 'bun:test'
import { html } from '../../ui/preact.js'
import { TopFilterBar } from './TopFilterBar.js'
import { NoteTooltip } from './NoteTooltip.js'
import { BottomBar } from './BottomBar.js'

describe('Topic Constellation Graph Preact Components', () => {
  describe('TopFilterBar', () => {
    it('creates virtual node for TopFilterBar with active filter', () => {
      let selected = null
      const vnode = html`<${TopFilterBar}
        activeFilter="systems"
        onSelectFilter=${(k) => { selected = k }}
      />`
      expect(vnode).toBeDefined()
      expect(vnode.props.activeFilter).toBe('systems')
      expect(typeof vnode.props.onSelectFilter).toBe('function')
    })

    it('handles dynamic tag filter format correctly', () => {
      const vnode = html`<${TopFilterBar}
        activeFilter="tag:productivity"
        onSelectFilter=${() => {}}
      />`
      expect(vnode.props.activeFilter).toBe('tag:productivity')
    })
  })

  describe('NoteTooltip', () => {
    const mockNode = {
      title: 'Performance Fundamentals',
      readingTime: 6,
      summary: '<p>Latency, throughput, and utilization</p>',
      isFavorite: true,
      interactive: true,
      tags: ['systems', 'performance']
    }

    it('renders virtual node for NoteTooltip with node data and screen coordinates', () => {
      const pos = { x: 300, y: 200 }
      const vnode = html`<${NoteTooltip} node=${mockNode} pos=${pos} />`
      expect(vnode).toBeDefined()
      expect(vnode.props.node.title).toBe('Performance Fundamentals')
      expect(vnode.props.node.isFavorite).toBe(true)
      expect(vnode.props.node.interactive).toBe(true)
      expect(vnode.props.pos.x).toBe(300)
    })

    it('renders empty placeholder when node or pos is null', () => {
      const vnode = html`<${NoteTooltip} node=${null} pos=${null} />`
      expect(vnode).toBeDefined()
      expect(vnode.props.node).toBeNull()
    })
  })

  describe('BottomBar', () => {
    it('renders stats with matching and total counts', () => {
      let resetCalled = false
      const vnode = html`<${BottomBar}
        matchingCount=${12}
        totalCount=${92}
        onResetZoom=${() => { resetCalled = true }}
      />`
      expect(vnode).toBeDefined()
      expect(vnode.props.matchingCount).toBe(12)
      expect(vnode.props.totalCount).toBe(92)
      expect(typeof vnode.props.onResetZoom).toBe('function')
    })
  })
})
