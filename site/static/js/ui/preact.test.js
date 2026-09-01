import { describe, it, expect } from 'bun:test'
import { html, h } from './preact.js'

describe('Preact + HTM Integration', () => {
  it('binds html tagged template correctly to Preact h', () => {
    const vnode = html`<div class="test-class"><span>Hello</span></div>`
    expect(vnode).toBeDefined()
    expect(vnode.type).toBe('div')
    expect(vnode.props.class).toBe('test-class')
  })
})
