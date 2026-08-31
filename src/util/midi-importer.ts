/*
 * Utility to parse MIDI files in site/static/audio/ and generate src/main/songs-midi.ts
 *
 * Usage:
 *   bun run src/util/midi-importer.ts
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import fs from 'fs'
import path from 'path'
import { Midi } from '../../../../../../../../../tmp/node_modules/@tonejs/midi/dist/Midi.js'

interface SongConfig {
  file: string
  name: string
  artist: string
  icon: string
  phraseLengthSec: number
  maxDurationSec: number
}

const SONG_CONFIGS: SongConfig[] = [
  {
    file: 'site/static/audio/sheena_ringo_crime_and_punishment.mid',
    name: 'Crime and Punishment (罪と罰)',
    artist: 'Sheena Ringo',
    icon: '🥀',
    phraseLengthSec: 12.1008, // 8 full bars at 119 BPM (1.5126s per bar)
    maxDurationSec: 270.0 // Full song from start to end
  }
]

function processSongs() {
  const songs = SONG_CONFIGS.map((cfg) => {
    const fullPath = path.resolve(cfg.file)
    if (!fs.existsSync(fullPath)) {
      console.warn(`Warning: MIDI file not found: ${fullPath}`)
      return null
    }

    const midiData = fs.readFileSync(fullPath)
    const midi = new Midi(midiData)
    const track = midi.tracks[0]

    const totalTime = Math.min(midi.duration, cfg.maxDurationSec)
    const phrases = []
    let currentStart = 0
    let phraseIdx = 1

    while (currentStart < totalTime) {
      const currentEnd = Math.min(currentStart + cfg.phraseLengthSec, totalTime)
      const phraseStart = currentStart
      const notes = track.notes
        .filter((n) => n.time >= phraseStart && n.time < currentEnd)
        .map((n) => ({
          time: Number((n.time - phraseStart).toFixed(3)),
          freq: Number((440 * Math.pow(2, (n.midi - 69) / 12)).toFixed(2)),
          dur: Number(n.duration.toFixed(3)),
          vel: Number(n.velocity.toFixed(2)),
          name: n.name
        }))

      if (notes.length > 0) {
        phrases.push({
          title: `Phrase ${phraseIdx++} (${currentStart.toFixed(1)}s - ${currentEnd.toFixed(1)}s)`,
          notes
        })
      }

      currentStart = currentEnd
    }

    return {
      name: cfg.name,
      artist: cfg.artist,
      icon: cfg.icon,
      phrases
    }
  }).filter(Boolean)

  const code = `// Auto-generated from MIDI files in site/static/audio/
export interface MidiNote {
  time: number
  freq: number
  dur: number
  vel: number
  name: string
}

export interface MidiPhrase {
  title: string
  notes: MidiNote[]
}

export interface MidiSong {
  name: string
  artist: string
  icon: string
  phrases: MidiPhrase[]
}

export const MIDI_SONGS: MidiSong[] = ${JSON.stringify(songs, null, 2)}
`

  const targetPath = path.resolve('src/main/songs-midi.ts')
  fs.writeFileSync(targetPath, code)
  console.log(`Successfully generated ${targetPath} with ${songs.length} songs!`)
}

processSongs()
