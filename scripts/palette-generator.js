const fs = require('fs')
const { getColors } = require('../packages/browser-sunset/src/components/colors')

const file = fs.createWriteStream('./sass/_palette_neon.scss')
const colors = getColors()
colors.forEach((v, i) => {
  file.write(`$color${i}: ${v};\n`)
})
