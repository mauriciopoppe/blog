const fs = require("fs")
const { getColors } = require("../packages/browser-main/src/colors")

const file = fs.createWriteStream("./sass/_palette_neon.scss")
const colors = getColors()
colors.forEach((v, i) => {
  file.write(`$color${i}: ${v};\n`)
})
