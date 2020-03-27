const path = require('path')
const fs = require('fs')
const { getColors } = require('../main/colors')

const file = fs.createWriteStream(path.join(__dirname, '../main/sass/_palette_neon.scss'))
const colors = getColors()
colors.forEach((v, i) => {
  file.write(`$color${i}: ${v};\n`)
})
