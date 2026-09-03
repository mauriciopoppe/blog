import { describe, expect, it } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const repoRoot = process.cwd()

describe('Avatar mini-player stacking hook', () => {
  it('uses the explicit homepage stacking-container data hook', () => {
    const layout = readFileSync(join(repoRoot, 'site/layouts/index.html'), 'utf8')
    const player = readFileSync(join(import.meta.dir, 'mini-player.js'), 'utf8')

    expect(layout).toContain('data-avatar-stacking-container')
    expect(player).toContain("closest('[data-avatar-stacking-container]')")
    expect(player).not.toContain("closest('[class*=\"tw-basis-1/3\"]')")
  })
})
