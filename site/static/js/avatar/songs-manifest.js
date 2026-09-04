/**
 * Lightweight song catalog manifest.
 * Contains only top-level song descriptors without phrase tables or note data.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

export const SONGS_MANIFEST = [
  {
    id: 'aishite-aishite-aishite',
    name: 'Aishite Aishite Aishite',
    artist: 'Ado / Kikuo',
    credit: 'Yosi Spring',
    creditUrl: 'https://yosispring.github.io/Music/aishite_aishite_aishite.html',
    icon: '🖤',
    bpm: 226,
    timeSignature: '6/4',
    beatsPerBar: 6,
    key: 'C',
    accents: [1, 4],
    dir: '/js/avatar/songs/aishite-aishite-aishite/'
  },
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
  },
  {
    id: 'lagtrain',
    name: 'Lagtrain',
    artist: 'Inabakumori',
    credit: 'NekoOkto',
    creditUrl: 'https://www.youtube.com/watch?v=kKqEDtqowxA',
    icon: '🚆',
    bpm: 147,
    timeSignature: '4/4',
    beatsPerBar: 4,
    key: 'C',
    accents: [1, 3],
    dir: '/js/avatar/songs/lagtrain/'
  }
]

export const DEFAULT_SONG = SONGS_MANIFEST[0]
