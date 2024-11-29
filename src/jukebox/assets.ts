import { FontLoader, Font } from 'three/addons/loaders/FontLoader.js'

export interface Assets {
  initialized: boolean
  font: Font
  subtitles: string
  subtitlesEnglish: string
  claps: string
  audioBuffer: ArrayBuffer
}

export const assets: Assets = {
  initialized: false,
  font: null,
  subtitles: null,
  subtitlesEnglish: null,
  claps: null,
  audioBuffer: null
}

export async function loadAssets() {
  // @ts-ignore
  const loader = new FontLoader()
  const [font, subtitles, subtitlesEnglish, claps, audioBuffer] = await Promise.all([
    new Promise<Font>((resolve, reject) =>
      loader.load('/sandbox/jukebox/fonts/font.typeface.json', resolve, null /* onProgress */, reject)
    ),
    fetch('/sandbox/jukebox/bachata.srt').then((response) => response.text()),
    fetch('/sandbox/jukebox/bachata_english.srt').then((response) => response.text()),
    fetch('/sandbox/jukebox/claps.json').then((response) => response.json()),
    fetch('/sandbox/jukebox/bachata.mp3').then((response) => response.arrayBuffer())
  ])
  assets.font = font
  assets.subtitles = subtitles
  assets.subtitlesEnglish = subtitlesEnglish
  assets.claps = claps
  assets.audioBuffer = audioBuffer
  assets.initialized = true
}
