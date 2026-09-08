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

  it('keeps the detached-avatar restore control inside the player header', () => {
    const player = readFileSync(join(import.meta.dir, 'mini-player.js'), 'utf8')

    expect(player).toContain('aria-label="Return avatar to original position"')
    expect(player).toContain('↩')
    expect(player).toContain('tw-w-[360px]')
  })

  it('places transport toggles around the verse controls', () => {
    const player = readFileSync(join(import.meta.dir, 'mini-player.js'), 'utf8')
    const head = readFileSync(join(repoRoot, 'site/layouts/_partials/head.html'), 'utf8')

    expect(player).toContain("title=\"Toggle Metronome (⏱)\"")
    expect(player).toContain('>autoplay</span>')
    expect(player).toContain("${isPlaying ? '⏹ Stop' : '▶ Play'}")
    expect(player).toContain('aria-label="Previous song"')
    expect(player).toContain('aria-label="Previous verse"')
    expect(player).toContain('aria-label="Next verse"')
    expect(player).toContain('aria-label="Next song"')
    expect(head).toContain('fast_forward')
    expect(head).toContain('fast_rewind')
    expect(head).toContain('skip_next')
    expect(head).toContain('skip_previous')
  })

  it('exposes explicit song selection and randomization controls', () => {
    const player = readFileSync(join(import.meta.dir, 'mini-player.js'), 'utf8')
    const engine = readFileSync(join(import.meta.dir, 'audio-engine.js'), 'utf8')
    const head = readFileSync(join(repoRoot, 'site/layouts/_partials/head.html'), 'utf8')

    expect(player).toContain('aria-label="Select song"')
    expect(player).toContain('aria-haspopup="listbox"')
    expect(player).toContain('role="listbox"')
    expect(player).toContain('role="option"')
    expect(player).toContain('isSongPickerOpen')
    expect(player).toContain("event.key === 'Escape'")
    expect(player).toContain('<select')
    expect(player).toContain('isMobile ? html`')
    expect(player).toContain('Choose a random song')
    expect(player).toContain('playerStore.selectRandomSong()')
    expect(player).toContain('aria-label="Show MIDI credit"')
    expect(player).toContain('title="Show MIDI credit"')
    expect(head).toContain('expand_more')
    expect(player).toContain('setIsCreditOpen((open) => !open)')
    expect(player).toContain('mini-player-credit-tooltip')
    expect(player).toContain('MIDI transcription')
    expect(player).toContain('top: calc(100% + 4px)')
    expect(player).not.toContain('text-transform: uppercase')
    expect(player).not.toContain('tw-min-w-0 tw-overflow-hidden tw-text-[0.68rem]')
    expect(engine).toContain('selectRandomSong()')
    expect(engine).toContain('prevSong()')
    expect(engine).toContain('nextSong()')
    expect(engine).toContain('scheduleContinuousCompletion')
    expect(engine).toContain('this.nextSong()')
    expect(engine).toContain('const fadeOutSeconds = 0.6')
    expect(engine).toContain('phraseEnd + 0.05')
    expect(engine).toContain('const nextIdx = (newIdx + 1) % phrases.length')
  })

  it('dismisses the desktop player after an outside click', () => {
    const player = readFileSync(join(import.meta.dir, 'mini-player.js'), 'utf8')

    expect(player).toContain('setIsDesktopDismissed(true)')
    expect(player).toContain("document.addEventListener('pointerdown'")
    expect(player).toContain('setIsSongPickerOpen(false)')
    expect(player).toContain('aria-expanded=${isSongPickerOpen}')
  })

  it('does not clear outside dismissal when the player is re-entered', () => {
    const player = readFileSync(join(import.meta.dir, 'mini-player.js'), 'utf8')
    const playerEnter = player.slice(player.indexOf('const onPlayerEnter'), player.indexOf('const onPlayerLeave'))

    expect(playerEnter).not.toContain('setIsDesktopDismissed(false)')
  })
})
