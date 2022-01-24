
export const assets = {}
export async function loadAssets() {
  const loader = new THREE.FontLoader()
  const [font, subtitles, claps] = await Promise.all([
    new Promise((resolve, reject) =>
      loader.load('/sandbox/jukebox/fonts/font.typeface.json', resolve, null, reject)),
    fetch('/sandbox/jukebox/bachata.srt').then(response => response.text()),
    fetch('/sandbox/jukebox/claps.json').then(response => response.json())
  ])
  assets.font = font
  assets.subtitles = subtitles
  assets.claps = claps
}
