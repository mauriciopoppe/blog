const globby = require('globby')
const path = require('path')
const fm = require('front-matter')
const fs = require('fs')

const addFileToMap = (cwd, map) => (file, i) => {
  const data = fs.readFileSync(path.join(cwd, file), { encoding: 'utf-8' })
  const { attributes } = fm(data)
  if (attributes.draft) { return }

  const tokens = file.substring(0, file.length - path.extname(file).length).split('/')
  let it = map
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    let node = it.children.find(d => d.path === token)
    if (!node) {
      it.children.push((node = {
        path: token,
        children: []
      }))
    }
    it = node
  }

  Object.assign(it, attributes, {
    fullPath: file,
    isLeaf: true
  })
}

function dfs (cwd, obj = {}) {
  return globby('**/*', {cwd, mark: true, nodir: true})
    .then(files => {
      const map = { children: [] }
      files.forEach(addFileToMap(cwd, map))
      return map
    })
}

dfs(path.join(__dirname, '../content/'))
  .then(file => fs.writeFileSync(
    path.join(__dirname, '../data/metadata/render-tree.json'),
    JSON.stringify(file)
  ))
