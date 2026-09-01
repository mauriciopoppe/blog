/*
 * Unit tests for CSV MIDI parser and phrase interval slicing
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

export function parseNotesCsv(csvText) {
  const lines = csvText.trim().split('\n')
  const notes = []
  const startIdx = lines[0].startsWith('time') ? 1 : 0

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    const parts = line.split(',')
    notes.push({
      time: parseFloat(parts[0]),
      freq: parseFloat(parts[1]),
      dur: parseFloat(parts[2]),
      vel: parseFloat(parts[3]),
      name: parts[4]
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
