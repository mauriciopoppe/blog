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
    nameJapanese: '愛して愛して愛して',
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
    name: 'Crime and Punishment',
    nameJapanese: '罪と罰',
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
    nameJapanese: 'ラグトレイン',
    artist: 'inabakumori',
    artistUrl: 'https://www.youtube.com/channel/UCNElM45JypxqAR73RoUQ10g',
    credit: 'NekoOkto',
    creditUrl: 'https://www.youtube.com/watch?v=kKqEDtqowxA',
    icon: '🚆',
    bpm: 147,
    timeSignature: '4/4',
    beatsPerBar: 4,
    key: 'C',
    accents: [1, 3],
    dir: '/js/avatar/songs/lagtrain/'
  },
  {
    id: 'rainy-boots',
    name: 'Rainy Boots',
    nameJapanese: 'レイニーブーツ',
    artist: 'inabakumori',
    artistUrl: 'https://www.youtube.com/channel/UCNElM45JypxqAR73RoUQ10g',
    credit: 'NekoOkto',
    creditUrl: 'https://www.youtube.com/watch?v=gFF_SBmsP34',
    icon: '🌧️',
    bpm: 144,
    timeSignature: '4/4',
    beatsPerBar: 4,
    key: 'C',
    accents: [1, 3],
    dir: '/js/avatar/songs/rainy-boots/'
  },
  {
    id: 'time-left',
    name: 'Time Left',
    artist: 'Zutomayo',
    icon: '⏳',
    bpm: 120,
    timeSignature: '4/4',
    beatsPerBar: 4,
    key: 'C',
    accents: [1, 3],
    dir: '/js/avatar/songs/time-left/'
  },
  {
    id: 'float-play',
    name: 'Float Play',
    nameJapanese: 'フロートプレイ',
    artist: 'inabakumori',
    artistUrl: 'https://www.youtube.com/channel/UCNElM45JypxqAR73RoUQ10g',
    songUrl: 'https://www.youtube.com/watch?v=NRQRC_0ZQ00',
    credit: 'oldfrenchguy',
    creditUrl: 'https://www.youtube.com/watch?v=QEkArRFt4ws',
    icon: '🫧',
    bpm: 167,
    timeSignature: '4/4',
    beatsPerBar: 4,
    key: 'C',
    accents: [1, 3],
    dir: '/js/avatar/songs/float-play/'
  },
  {
    id: 'young-a-girl',
    name: 'Young Girl A',
    artist: 'siinamota',
    singer: 'Hatsune Miku',
    songUrl: 'https://www.youtube.com/watch?v=AqI97zHMoQw',
    icon: '🎤',
    bpm: 130,
    timeSignature: '4/4',
    beatsPerBar: 4,
    key: 'C',
    accents: [1, 3],
    dir: '/js/avatar/songs/young-a-girl/'
  }
]

export const DEFAULT_SONG = SONGS_MANIFEST[0]
