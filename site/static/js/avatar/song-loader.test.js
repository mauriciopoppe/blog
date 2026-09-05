/*
 * Unit tests for CSV MIDI parser and phrase interval slicing
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'
import { getRandomSong } from './audio-engine.js'

describe('Random initial song selection', () => {
  it('selects a song from the manifest without exceeding its bounds', () => {
    const songs = [{ id: 'first' }, { id: 'second' }]
    expect(getRandomSong(songs, 0).id).toBe('first')
    expect(getRandomSong(songs, 0.99).id).toBe('second')
    expect(getRandomSong(songs, 1).id).toBe('second')
  })
})

export function parseNotesCsv(csvText) {
  const lines = csvText.trim().split('\n')
  const notes = []
  const startIdx = lines[0].startsWith('time') ? 1 : 0

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const parts = line.split(',')
    const frequency = parseFloat(parts[1])
    notes.push({
      time: parseFloat(parts[0]),
      freq: frequency,
      dur: parseFloat(parts[2]),
      vel: parseFloat(parts[3]),
      name: parts[4],
      hand: parts[5] || (frequency < 261.63 ? 'left' : 'right')
    })
  }
  return notes
}

describe('MIDI CSV Song Loader: Crime and Punishment', () => {
  const songDir = join(import.meta.dir, 'songs/crime-and-punishment')
  const metaJson = JSON.parse(readFileSync(join(songDir, 'metadata.json'), 'utf8'))
  const csvText = readFileSync(join(songDir, 'notes.csv'), 'utf8')

  it('parses all notes accurately from notes.csv', () => {
    const notes = parseNotesCsv(csvText)
    expect(notes.length).toBeGreaterThan(1000)

    const firstNote = notes[0]
    expect(firstNote.time).toBeCloseTo(0.756, 3)
    expect(firstNote.freq).toBeCloseTo(493.88, 2)
    expect(firstNote.dur).toBeCloseTo(0.756, 3)
    expect(firstNote.vel).toBeCloseTo(0.5, 2)
    expect(firstNote.name).toBe('B4')
    expect(firstNote.hand).toBe('right')
    expect(notes.some((note) => note.hand === 'left')).toBe(true)
  })

  it('slices correct phrase ranges based on startRow and rowCount', () => {
    const notes = parseNotesCsv(csvText)
    expect(metaJson.phrases.length).toBe(21)

    let totalSlicedNotes = 0
    metaJson.phrases.forEach((phrase) => {
      const phraseNotes = notes.slice(phrase.startRow, phrase.startRow + phrase.rowCount)
      expect(phraseNotes.length).toBe(phrase.rowCount)
      totalSlicedNotes += phraseNotes.length
    })

    expect(totalSlicedNotes).toBe(notes.length)
  })
})

describe('MIDI CSV Song Loader: Marunouchi Sadistic', () => {
  const songDir = join(import.meta.dir, 'songs/marunouchi-sadistic')
  const metaJson = JSON.parse(readFileSync(join(songDir, 'metadata.json'), 'utf8'))
  const csvText = readFileSync(join(songDir, 'notes.csv'), 'utf8')

  it('parses all notes accurately from notes.csv', () => {
    const notes = parseNotesCsv(csvText)
    expect(notes.length).toBe(1649)
    expect(notes.some((note) => note.hand === 'left')).toBe(true)
    expect(notes.some((note) => note.hand === 'right')).toBe(true)
  })

  it('slices user-defined verse ranges perfectly without gap or overlap', () => {
    const notes = parseNotesCsv(csvText)
    expect(metaJson.phrases.length).toBe(9)

    let totalSlicedNotes = 0
    metaJson.phrases.forEach((phrase) => {
      const phraseNotes = notes.slice(phrase.startRow, phrase.startRow + phrase.rowCount)
      expect(phraseNotes.length).toBe(phrase.rowCount)
      totalSlicedNotes += phraseNotes.length
    })

    expect(totalSlicedNotes).toBe(1649)
  })
})

describe('MIDI CSV Song Loader: Aishite Aishite Aishite', () => {
  const songDir = join(import.meta.dir, 'songs/aishite-aishite-aishite')
  const metaJson = JSON.parse(readFileSync(join(songDir, 'metadata.json'), 'utf8'))
  const csvText = readFileSync(join(songDir, 'notes.csv'), 'utf8')

  it('imports the MIDI tempo, meter, and arranger credit', () => {
    const notes = parseNotesCsv(csvText)
    expect(notes.length).toBeGreaterThan(2000)
    expect(metaJson.bpm).toBe(226)
    expect(metaJson.timeSignature).toBe('6/4')
    expect(metaJson.credit).toBe('Yosi Spring')
    expect(metaJson.creditUrl).toContain('yosispring.github.io/Music/aishite_aishite_aishite.html')
    expect(notes.some((note) => note.hand === 'left')).toBe(true)
    expect(notes.some((note) => note.hand === 'right')).toBe(true)
  })
})

describe('MIDI CSV Song Loader: Lagtrain', () => {
  const songDir = join(import.meta.dir, 'songs/lagtrain')
  const metaJson = JSON.parse(readFileSync(join(songDir, 'metadata.json'), 'utf8'))
  const csvText = readFileSync(join(songDir, 'notes.csv'), 'utf8')

  it('imports the MIDI tempo, meter, and arranger credit', () => {
    const notes = parseNotesCsv(csvText)
    expect(notes.length).toBeGreaterThan(3000)
    expect(metaJson.bpm).toBe(147)
    expect(metaJson.timeSignature).toBe('4/4')
    expect(metaJson.credit).toBe('NekoOkto')
    expect(metaJson.creditUrl).toContain('youtube.com/watch?v=kKqEDtqowxA')
    expect(notes.some((note) => note.hand === 'left')).toBe(true)
    expect(notes.some((note) => note.hand === 'right')).toBe(true)
  })
})

describe('MIDI CSV Song Loader: Rainy Boots', () => {
  const songDir = join(import.meta.dir, 'songs/rainy-boots')
  const metaJson = JSON.parse(readFileSync(join(songDir, 'metadata.json'), 'utf8'))
  const csvText = readFileSync(join(songDir, 'notes.csv'), 'utf8')

  it('imports the MIDI tempo, meter, and arranger credit', () => {
    const notes = parseNotesCsv(csvText)
    expect(notes.length).toBeGreaterThan(2700)
    expect(metaJson.bpm).toBe(144)
    expect(metaJson.timeSignature).toBe('4/4')
    expect(metaJson.credit).toBe('NekoOkto')
    expect(metaJson.creditUrl).toContain('youtube.com/watch?v=gFF_SBmsP34')
    expect(notes.some((note) => note.hand === 'left')).toBe(true)
    expect(notes.some((note) => note.hand === 'right')).toBe(true)
  })
})

describe('MIDI CSV Song Loader: Float Play', () => {
  const songDir = join(import.meta.dir, 'songs/float-play')
  const metaJson = JSON.parse(readFileSync(join(songDir, 'metadata.json'), 'utf8'))
  const csvText = readFileSync(join(songDir, 'notes.csv'), 'utf8')

  it('imports the MIDI tempo, meter, and credits', () => {
    const notes = parseNotesCsv(csvText)
    expect(notes.length).toBeGreaterThan(2000)
    expect(metaJson.bpm).toBe(167)
    expect(metaJson.timeSignature).toBe('4/4')
    expect(metaJson.artist).toBe('inabakumori')
    expect(metaJson.songUrl).toContain('youtube.com/watch?v=NRQRC_0ZQ00')
    expect(metaJson.totalPhrases).toBe(20)
    expect(notes[0].time).toBeCloseTo(0.031029, 6)
    expect(metaJson.credit).toBe('oldfrenchguy')
    expect(metaJson.creditUrl).toContain('youtube.com/watch?v=QEkArRFt4ws')
    expect(notes.some((note) => note.hand === 'left')).toBe(true)
    expect(notes.some((note) => note.hand === 'right')).toBe(true)
  })
})

describe('MIDI CSV Song Loader: Young a girl', () => {
  const songDir = join(import.meta.dir, 'songs/young-a-girl')
  const metaJson = JSON.parse(readFileSync(join(songDir, 'metadata.json'), 'utf8'))
  const csvText = readFileSync(join(songDir, 'notes.csv'), 'utf8')

  it('imports the MIDI tempo, meter, author, and singer', () => {
    const notes = parseNotesCsv(csvText)
    expect(notes.length).toBeGreaterThan(2400)
    expect(metaJson.bpm).toBe(130)
    expect(metaJson.timeSignature).toBe('4/4')
    expect(metaJson.artist).toBe('siinamota')
    expect(metaJson.singer).toBe('Hatsune Miku')
    expect(metaJson.songUrl).toContain('youtube.com/watch?v=AqI97zHMoQw')
    expect(notes.some((note) => note.hand === 'left')).toBe(true)
    expect(notes.some((note) => note.hand === 'right')).toBe(true)
  })
})
