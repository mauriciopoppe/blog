const FontFaceObserver = require('fontfaceobserver')

const fontNN = new FontFaceObserver('Computer Modern Serif', {
  style: 'normal',
  weight: 'normal'
})
const fontBN = new FontFaceObserver('Computer Modern Serif', {
  style: 'normal',
  weight: 'bold'
})
const fontNI = new FontFaceObserver('Computer Modern Serif', {
  style: 'italic',
  weight: 'normal'
})
const fontBI = new FontFaceObserver('Computer Modern Serif', {
  style: 'italic',
  weight: 'bold'
})
Promise.all([
  fontNN.load(),
  fontBN.load(),
  fontNI.load(),
  fontBI.load()
]).then(function () {
  document.documentElement.className += ' fonts-loaded'
})
