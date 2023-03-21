const path = require('path')
const fs = require('fs')
const { theme } = require('../main/colors')

const file = fs.createWriteStream(path.join(__dirname, '../main/sass/_palette_neon.scss'))
const colors = theme.getFlattenedColorPalette()
colors.forEach((v, i) => {
  file.write(`$color${i}: ${v};\n`)
})
