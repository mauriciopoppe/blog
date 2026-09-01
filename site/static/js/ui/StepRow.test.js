import { describe, it, expect } from 'bun:test'
import { html } from './preact.js'
import { StepRow } from './StepRow.js'

describe('StepRow Component', () => {
  it('renders step row with title, description, and badge', () => {
    const vnode = html`<${StepRow}
      stepNumber=${1}
      title="Scale S"
      description="Scale geometry at origin"
      symbol="\\mathbf{S}" />`

    expect(vnode).toBeDefined()
    expect(vnode.props.stepNumber).toBe(1)
    expect(vnode.props.title).toBe('Scale S')
    expect(vnode.props.description).toBe('Scale geometry at origin')
    expect(vnode.props.symbol).toBe('\\mathbf{S}')
  })

  it('renders completed and active states', () => {
    const activeNode = html`<${StepRow} stepNumber=${2} title="Rotate Y" isActive=${true} isAnimating=${true} />`
    expect(activeNode.props.isActive).toBe(true)
    expect(activeNode.props.isAnimating).toBe(true)

    const completedNode = html`<${StepRow} stepNumber=${1} title="Scale S" isCompleted=${true} />`
    expect(completedNode.props.isCompleted).toBe(true)
  })
})
