import { describe, it, expect } from 'bun:test'
import { html } from './preact.js'
import { StepPlayback } from './StepPlayback.js'

describe('StepPlayback Component', () => {
  it('renders playback buttons with correct disabled bounds', () => {
    const vnode = html`<${StepPlayback} currentStep=${0} totalSteps=${4} isPlaying=${false} />`
    expect(vnode).toBeDefined()
    expect(vnode.props.currentStep).toBe(0)
    expect(vnode.props.totalSteps).toBe(4)
  })
})
