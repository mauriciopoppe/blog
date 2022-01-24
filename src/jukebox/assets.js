
export const assets = {}
export async function loadAssets() {
  const loader = new THREE.FontLoader()
  assets.font = await new Promise((resolve, reject) =>
    loader.load('/sandbox/jukebox/fonts/font.typeface.json', resolve, null, reject))
  assets.subtitles = await fetch('/sandbox/jukebox/bachata.srt')
    .then(response => response.text())
}
