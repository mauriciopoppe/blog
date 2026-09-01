/**
 * Lightweight song catalog manifest.
 * Contains only top-level song descriptors without phrase tables or note data.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

export const SONGS_MANIFEST = [
  {
    id: 'crime-and-punishment',
    name: 'Crime and Punishment (罪と罰)',
    artist: 'Sheena Ringo',
    icon: '🥀',
    bpm: 119,
    timeSignature: '6/8',
    beatsPerBar: 6,
    key: 'Bmin',
    accents: [1, 4],
    dir: '/js/avatar/songs/crime-and-punishment/'
  }
]

export const DEFAULT_SONG = SONGS_MANIFEST[0]
