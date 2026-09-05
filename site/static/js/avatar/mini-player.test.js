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

  it('places transport toggles around the verse controls', () => {
    const player = readFileSync(join(import.meta.dir, 'mini-player.js'), 'utf8')

    expect(player).toContain("title=\"Toggle Metronome (⏱)\"")
    expect(player).toContain('>autoplay</span>')
    expect(player).toContain("${isPlaying ? '⏹ Stop' : '▶ Play'}")
  })

  it('exposes explicit song selection and randomization controls', () => {
    const player = readFileSync(join(import.meta.dir, 'mini-player.js'), 'utf8')
    const engine = readFileSync(join(import.meta.dir, 'audio-engine.js'), 'utf8')

    expect(player).toContain('aria-label="Select song"')
    expect(player).toContain('<select')
    expect(player).not.toContain('isSongMenuOpen')
    expect(player).toContain('Choose a random song')
    expect(player).toContain('playerStore.selectRandomSong()')
    expect(engine).toContain('selectRandomSong()')
  })
})
