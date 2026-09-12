import { describe, expect, it } from 'bun:test'
import { retainFutureEvents } from './avatar-effects.js'

describe('Avatar playback visibility recovery', () => {
  it('keeps future events and removes events that already played', () => {
    const events = [
      { audioTime: 4 },
      { audioTime: 10 },
      { audioTime: 16 }
    ]

    expect(retainFutureEvents(events, 10)).toEqual([
      { audioTime: 16 }
    ])
  })
})
