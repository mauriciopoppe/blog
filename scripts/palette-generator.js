const fs = require('fs')
const { interpolateMagma } = require('d3-scale')

const file = fs.createWriteStream('./themes/blank/_compile/sass/_palette.scss')
for (let i = 0; i <= 100; i += 1) {
  file.write(`$color${i}: ${interpolateMagma(i / 100)};\n`)
}
