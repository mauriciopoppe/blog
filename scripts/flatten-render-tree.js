const globby = require('globby')
const path = require('path')
const fm = require('front-matter')
const fs = require('fs-extra')
const bel = require('bel')
const raw = require('bel/raw')
const titleCase = require('title-case')
const defined = require('defined')
const parse = require('date-fns/parse')

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

function byDate (a, b) {
  // if the front matter defines the order use it for sorting
  if ('order' in a || 'order' in b) {
    if ('order' in a && 'order' in b) return a - b
    if ('order' in a) return -1
    return 1
  }

  if (a.date || b.date) {
    if (a.date && b.date) {
      // convert to dates and parse
      const aDate = parse(a.date)
      const bDate = parse(b.date)
      // console.log('by date')
      // console.log(a.title, aDate)
      // console.log(b.title, bDate)
      // if both are articles that have dates sort them by date
      if (aDate < bDate) return -1
      return 1
    }
    if (a.date) return -1
    return 1
  }
  // sort lexicographically based on the path
  // console.log('sort by path')
  if (a.path < b.path) return -1
  return 1
}

function sortBy (fn) {
  return function sorter (node, depth = 0) {
    // sort children first
    node.children.forEach(child => sorter(child, depth + 1))

    // sort current node children
    node.children.sort(fn)

    // return itself for the next consumer
    return node
  }
}

function dfs (cwd, obj = {}) {
  return globby('**/*', {cwd, mark: true, nodir: true})
    .then(files => {
      const map = { children: [] }
      files.forEach(addFileToMap(cwd, map))
      return map
    })
    .then(sortBy(byDate))
}

function createNavBarRecursive (node, depth) {
  let target = ''
  let content = defined(node.title, titleCase(node.path))
  if (node.isLeaf) {
    // eslint-disable-next-line
    target = new String(raw(`data-url-target="${node.fullPath}"`))
    target.__encoded = true

    // eslint-disable-next-line
    content = bel`
      <a href="/${node.fullPath.substring(0, node.fullPath.indexOf('.'))}/">
        ${content}
      </a>
    `
  }

  const hasChildren = node.children.length ? bel`<i class="children-toggle"></i>` : ''

  return bel`
    <li ${target}>
      <div>
        ${hasChildren}
        ${content}
      </div>
      ${!node.isLeaf && createNavBar(node, depth + 1)}
    </li>
  `
}

function createNavBar (node, depth = 0) {
  return bel`
    <ul class="list-is-collapsible ${depth > 0 && 'list-is-collapsed'}">
      ${node.children.map(node => createNavBarRecursive(node, depth))}
    </ul>
  `
}

const promise = fs.ensureDir(path.join(process.cwd(), 'data/metadata/'))
  .then(() => dfs(path.join(process.cwd(), 'content/')))

promise
  .then(file => fs.writeJson(path.join(process.cwd(), 'data/metadata/render-tree.json'), file))

promise
  .then(file => createNavBar(file.children[0]))
  .then(async navbar => {
    await fs.ensureDir('layouts/partials/')
    await fs.writeFile('layouts/partials/sitemap-content.html', navbar)
  })
