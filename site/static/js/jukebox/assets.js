import { FontLoader } from 'https://esm.sh/three@0.144.0/examples/jsm/loaders/FontLoader.js'
export const assets = {
  initialized: false,
  font: null,
  subtitles: null,
  subtitlesEnglish: null,
  claps: null,
  audioBuffer: null
}
export async function loadAssets() {
  const loader = new FontLoader()
  const [font, subtitles, subtitlesEnglish, claps, audioBuffer] = await Promise.all([
    new Promise((resolve, reject) => loader.load('/sandbox/jukebox/fonts/font.typeface.json', resolve, null /* onProgress */, reject)),
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
