import { describe, expect, it } from 'bun:test'
import { buildTocTree } from './toc.js'

describe('table of contents', () => {
  it('preserves heading hierarchy without duplicating labels', () => {
    const tree = buildTocTree([
      { id: 'first', level: 2, label: 'First' },
      { id: 'first-detail', level: 3, label: 'First detail' },
      { id: 'second', level: 2, label: 'Second' },
      { id: 'second-detail', level: 3, label: 'Second detail' }
    ])

    expect(tree.map(({ id }) => id)).toEqual(['first', 'second'])
    expect(tree[0].children.map(({ id }) => id)).toEqual(['first-detail'])
    expect(tree[1].children.map(({ id }) => id)).toEqual(['second-detail'])
  })

  it('attaches skipped heading levels to the nearest preceding parent', () => {
    const tree = buildTocTree([
      { id: 'section', level: 2, label: 'Section' },
      { id: 'detail', level: 4, label: 'Detail' },
      { id: 'subsection', level: 3, label: 'Subsection' },
      { id: 'subsection-detail', level: 4, label: 'Subsection detail' }
    ])

    expect(tree[0].children[0].id).toBe('detail')
    expect(tree[0].children[1].id).toBe('subsection')
    expect(tree[0].children[1].children[0].id).toBe('subsection-detail')
  })
})
