import { describe, it, expect } from 'bun:test'
import { html } from './preact.js'
import { WidgetFrame } from './WidgetFrame.js'

describe('WidgetFrame Component', () => {
  it('renders frame with header and title', () => {
    const vnode = html`<${WidgetFrame} title="Test Title" descriptor="Test Subtitle"><p>Body content</p><//>`
    expect(vnode).toBeDefined()
    expect(vnode.props.title).toBe('Test Title')
    expect(vnode.props.descriptor).toBe('Test Subtitle')
  })
})
