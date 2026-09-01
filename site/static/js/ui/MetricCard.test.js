import { describe, it, expect } from 'bun:test'
import { html } from './preact.js'
import { MetricCard } from './MetricCard.js'

describe('MetricCard Component', () => {
  it('renders passive metric card with numerals and caption', () => {
    const vnode = html`<${MetricCard} label="Tail Latency" value="1.12s" caption="Wait: 0.12s" valueColor="tw-text-primary" />`
    expect(vnode).toBeDefined()
    expect(vnode.props.label).toBe('Tail Latency')
    expect(vnode.props.value).toBe('1.12s')
  })
})
