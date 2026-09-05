import { describe, expect, it } from 'bun:test'
import { buildSongTimeline, findPhraseAtOffset, getPhrasePosition } from './playback-timeline.js'
import { getPhraseMasterLevel, resetMasterGainForLoop } from './audio-engine.js'

describe('Playback timeline', () => {
  const metadata = {
    phrases: [
      { title: 'A', duration: 2, startRow: 0, rowCount: 2 },
      { title: 'B', duration: 3, startRow: 2, rowCount: 1 }
    ]
  }
  const notes = [
    { time: 0, freq: 220 },
    { time: 1.5, freq: 330 },
    { time: 0.25, freq: 440 }
  ]

  it('flattens phrase-relative notes onto one absolute timeline', () => {
    const timeline = buildSongTimeline(metadata, notes)

    expect(timeline.duration).toBe(5)
    expect(timeline.phrases[1].offset).toBe(2)
    expect(timeline.notes.map((note) => note.audioOffset)).toEqual([0, 1.5, 2.25])
  })

  it('maps wrapped offsets to the correct phrase', () => {
    const timeline = buildSongTimeline(metadata, notes)

    expect(findPhraseAtOffset(timeline, 0).title).toBe('A')
    expect(findPhraseAtOffset(timeline, 2).title).toBe('B')
    expect(findPhraseAtOffset(timeline, 1.9999999999999998).title).toBe('B')
    expect(findPhraseAtOffset(timeline, 5).title).toBe('A')
    expect(findPhraseAtOffset(timeline, -1).title).toBe('B')
  })

  it('calculates the current bar and beat inside a phrase', () => {
    const timeline = buildSongTimeline({
      phrases: [{ title: 'A', duration: 6, startBar: 10, startBeat: 6, endBar: 12, endBeat: 6, startRow: 0, rowCount: 0 }]
    }, [])

    expect(getPhrasePosition(timeline, 0, 6)).toMatchObject({ currentBar: 10, currentBeat: 6 })
    expect(getPhrasePosition(timeline, 1.1, 6)).toMatchObject({ currentBar: 11, currentBeat: 2 })
  })

  it('restores the master gain when loop mode is enabled mid-phrase', () => {
    const calls = []
    resetMasterGainForLoop({
      gain: {
        cancelScheduledValues: (time) => calls.push(['cancel', time]),
        setValueAtTime: (value, time) => calls.push(['set', value, time])
      }
    }, 42)

    expect(calls).toEqual([
      ['cancel', 42],
      ['set', 0.35, 42]
    ])
  })

  it('scales the master level for a phrase without changing the default', () => {
    expect(getPhraseMasterLevel({ gain: 0.35 })).toBeCloseTo(0.1225)
    expect(getPhraseMasterLevel({})).toBe(0.35)
  })
})
