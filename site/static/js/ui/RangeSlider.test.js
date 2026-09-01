import { describe, it, expect } from 'bun:test'
import { html } from './preact.js'
import { RangeSlider } from './RangeSlider.js'

describe('RangeSlider Component', () => {
  it('renders slider with label and custom value format', () => {
    const vnode = html`<${RangeSlider} id="test-slider" label="Progress" value=${0.5} valueText="t = 0.50" />`
    expect(vnode).toBeDefined()
    expect(vnode.props.value).toBe(0.5)
    expect(vnode.props.valueText).toBe('t = 0.50')
  })
})
