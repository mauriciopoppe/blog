/* Import a Standard MIDI file into the avatar mini-player's CSV timeline. */

import fs from 'fs'
import path from 'path'

const inputPath = process.argv[2]
if (!inputPath) throw new Error('Pass a MIDI file path')

const outputDir = path.resolve('site/static/js/avatar/songs/aishite-aishite-aishite')
const phraseBars = 8

function readVlq(data: Buffer, offset: number) {
  let value = 0
  let byte = 0
  do {
    byte = data[offset++]
    value = (value << 7) | (byte & 0x7f)
  } while (byte & 0x80)
  return { value, next: offset }
}

function parseMidi(file: string) {
  const data = fs.readFileSync(file)
  const ppq = data.readUInt16BE(12)
  const trackCount = data.readUInt16BE(10)
  let offset = 14
  let tempo = 60000000 / 120
  let numerator = 4
  let denominator = 4
  const notes: Array<{ tick: number, endTick: number, midi: number, velocity: number }> = []
  let maxTick = 0

  for (let trackIndex = 0; trackIndex < trackCount; trackIndex++) {
    const trackLength = data.readUInt32BE(offset + 4)
    const end = offset + 8 + trackLength
    offset += 8
    let tick = 0
    let runningStatus = 0
    const active = new Map<string, { tick: number, velocity: number }[]>()

    while (offset < end) {
      const delta = readVlq(data, offset)
      tick += delta.value
      offset = delta.next
      const first = data[offset++]
      const status = first < 0x80 ? runningStatus : first
      if (first < 0x80) offset--

      if (status === 0xff) {
        const type = data[offset++]
        const size = readVlq(data, offset)
        offset = size.next
        if (type === 0x51 && size.value >= 3) tempo = data.readUIntBE(offset, 3)
        if (type === 0x58 && size.value >= 2) {
          numerator = data[offset]
          denominator = 2 ** data[offset + 1]
        }
        offset += size.value
        if (type === 0x2f) break
        continue
      }
      if (status === 0xf0 || status === 0xf7) {
        const size = readVlq(data, offset)
        offset = size.next + size.value
        continue
      }

      runningStatus = status
      const command = status & 0xf0
      const channel = status & 0x0f
      if (command === 0xc0 || command === 0xd0) {
        offset++
        continue
      }
      const midi = data[offset++]
      const velocity = data[offset++]
      const key = `${channel}:${midi}`
      if (command === 0x90 && velocity > 0) {
        const queue = active.get(key) || []
        queue.push({ tick, velocity: velocity / 127 })
        active.set(key, queue)
      } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
        const start = active.get(key)?.shift()
        if (start && tick > start.tick) {
          notes.push({ tick: start.tick, endTick: tick, midi, velocity: start.velocity })
          maxTick = Math.max(maxTick, tick)
        }
      }
    }
    offset = end
  }
  return { ppq, tempo, numerator, denominator, notes, maxTick }
}

function noteName(midi: number) {
  const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
  return `${names[midi % 12]}${Math.floor(midi / 12) - 1}`
}

function main() {
  const midi = parseMidi(path.resolve(inputPath))
  const secondsPerQuarter = midi.tempo / 1000000
  const ticksPerBar = midi.ppq * midi.numerator * (4 / midi.denominator)
  const totalBars = Math.ceil(midi.maxTick / ticksPerBar)
  const phraseCount = Math.ceil(totalBars / phraseBars)
  const phraseDuration = phraseBars * ticksPerBar / midi.ppq * secondsPerQuarter
  const absoluteNotes = midi.notes
    .sort((a, b) => a.tick - b.tick || a.midi - b.midi)
    .map((note) => ({
      time: note.tick / midi.ppq * secondsPerQuarter,
      freq: 440 * Math.pow(2, (note.midi - 69) / 12),
      dur: (note.endTick - note.tick) / midi.ppq * secondsPerQuarter,
      vel: note.velocity,
      name: noteName(note.midi),
      hand: note.midi < 60 ? 'left' : 'right'
    }))
  const notes: typeof absoluteNotes = []
  const phrases = Array.from({ length: phraseCount }, (_, index) => {
    const startBar = index * phraseBars + 1
    const endBar = Math.min(startBar + phraseBars, totalBars + 1)
    const duration = (endBar - startBar) * ticksPerBar / midi.ppq * secondsPerQuarter
    const phraseStart = index * phraseDuration
    const phraseNotes = absoluteNotes
      .filter((note) => note.time >= phraseStart && note.time < phraseStart + duration)
      .map((note) => ({ ...note, time: note.time - phraseStart }))
    const startRow = notes.length
    notes.push(...phraseNotes)
    return {
      title: `Phrase ${index + 1}`,
      phraseIndex: index + 1,
      startBar,
      startBeat: 1,
      endBar,
      endBeat: 1,
      duration: Number(duration.toFixed(6)),
      startRow,
      rowCount: phraseNotes.length
    }
  })

  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(path.join(outputDir, 'notes.csv'), ['time,freq,dur,vel,name,hand', ...notes.map((note) => [note.time, note.freq, note.dur, note.vel, note.name, note.hand].map((value) => typeof value === 'number' ? value.toFixed(6) : value).join(','))].join('\n') + '\n')
  fs.writeFileSync(path.join(outputDir, 'metadata.json'), JSON.stringify({
    id: 'aishite-aishite-aishite',
    name: 'Aishite Aishite Aishite',
    artist: 'Ado / Kikuo',
    credit: 'Yosi Spring',
    creditUrl: 'https://yosispring.github.io/Music/aishite_aishite_aishite.html',
    bpm: Number((60000000 / midi.tempo).toFixed(3)),
    timeSignature: `${midi.numerator}/${midi.denominator}`,
    beatsPerBar: midi.numerator,
    key: 'C',
    handSplit: 'C4 (MIDI 60)',
    totalPhrases: phrases.length,
    notesFile: 'notes.csv',
    phrases
  }, null, 2) + '\n')
}

main()
