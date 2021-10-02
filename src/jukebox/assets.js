
export const assets = {}
export async function loadAssets() {
  const loader = new THREE.FontLoader()
  assets.font = await new Promise((resolve, reject) =>
    loader.load('/sandbox/jukebox/fonts/font.typeface.json', resolve, null, reject))
  // assets.audioBuffer = await new Promise((resolve) => {
  //   const audioLoader = new THREE.AudioLoader();
  //   audioLoader.load('/sandbox/jukebox/audio/cuco_64.mp3', resolve);
  // })
}

export function registerGlobalListeners() {
  const apiKey = 'AIzaSyD9tfFg9jh01ziREY2BqMgmZZUN8eoaLqA'
  function initClient() {
    gapi.client.init({
      apiKey: apiKey,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/urlshortener/v1/rest']
    })
  }

  window.handleClientLoad = function () {
    gapi.load('client', initClient);
  }
}