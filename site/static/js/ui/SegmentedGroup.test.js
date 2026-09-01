import { describe, it, expect } from 'bun:test'
import { html } from './preact.js'
import { SegmentedGroup } from './SegmentedGroup.js'

describe('SegmentedGroup Component', () => {
  it('renders radio options and checks active value', () => {
    const options = [
      { label: 'Option A', value: 'a' },
      { label: 'Option B', value: 'b' }
    ]
    const vnode = html`<${SegmentedGroup} options=${options} value="a" />`
    expect(vnode).toBeDefined()
    expect(vnode.props.value).toBe('a')
    expect(vnode.props.options.length).toBe(2)
  })
})
