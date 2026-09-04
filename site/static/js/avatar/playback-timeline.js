/* Pure song timeline construction. Note times in each phrase are relative. */

export function buildSongTimeline(metadata, notes) {
  const phrases = (metadata.phrases || []).map((phrase, index) => ({
    ...phrase,
    index,
    offset: 0
  }))

  let offset = 0
  phrases.forEach((phrase) => {
    phrase.offset = offset
    offset += phrase.duration
  })

  const timelineNotes = []
  phrases.forEach((phrase) => {
    notes
      .slice(phrase.startRow, phrase.startRow + phrase.rowCount)
      .forEach((note) => {
        timelineNotes.push({
          ...note,
          phraseIndex: phrase.index,
          audioOffset: phrase.offset + note.time
        })
      })
  })

  return {
    phrases,
    notes: timelineNotes,
    duration: offset
  }
}

export function findPhraseAtOffset(timeline, offset) {
  const normalized = ((offset % timeline.duration) + timeline.duration) % timeline.duration
  const boundary = timeline.phrases.find((phrase) => Math.abs(normalized - phrase.offset) < 1e-9)
  if (boundary) return boundary
  return timeline.phrases.find((phrase) => normalized >= phrase.offset && normalized < phrase.offset + phrase.duration) ||
    timeline.phrases[timeline.phrases.length - 1] || null
}

export function getPhrasePosition(timeline, offset, beatsPerBar = 4) {
  const phrase = findPhraseAtOffset(timeline, offset)
  if (!phrase) return null

  const normalized = ((offset % timeline.duration) + timeline.duration) % timeline.duration
  const phraseElapsed = Math.max(0, normalized - phrase.offset)
  const totalBeats = Math.max(
    1,
    (phrase.endBar - phrase.startBar) * beatsPerBar + (phrase.endBeat - phrase.startBeat)
  )
  const beatOffset = Math.min(totalBeats - 1, Math.floor(phraseElapsed / (phrase.duration / totalBeats)))
  const absoluteBeat = phrase.startBeat - 1 + beatOffset

  return {
    phrase,
    progress: Math.min(1, phraseElapsed / phrase.duration),
    currentBar: phrase.startBar + Math.floor(absoluteBeat / beatsPerBar),
    currentBeat: (absoluteBeat % beatsPerBar) + 1
  }
}
