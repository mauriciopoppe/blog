const path = require('path')

const globby = require('globby')
const fm = require('front-matter')
const fs = require('fs-extra')
const { titleCase } = require('title-case')
const defined = require('defined')
const toDate = require('date-fns/toDate')

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  console.log('sitemap generator running in production mode')
}

const addFileToMap = (cwd, map) => (file, i) => {
  const data = fs.readFileSync(path.join(cwd, file), { encoding: 'utf-8' })
  const { birthtime } = fs.statSync(path.join(cwd, file))
  const { attributes } = fm(data)

  // skip draft articles in production
  if (isProduction && attributes.draft) { return }

  const tokens = file.substring(0, file.length - path.extname(file).length).split('/')
  let it = map
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    let node = it.children.find(d => d.path === token)
    if (!node) {
      it.children.push((node = {
        fullPath: tokens.slice(0, i + 1).join('/'),
        path: token,
        children: []
      }))
    }
    it = node
  }

  // node has additional attributes that come from the header yaml
  Object.assign(it, attributes, {
    fullPath: file,
    createdDate: birthtime,
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

  const dateSortAttribute = 'date'
  if (a[dateSortAttribute] || b[dateSortAttribute]) {
    if (a[dateSortAttribute] && b[dateSortAttribute]) {
      // convert to dates and toDate
      const aDate = toDate(a[dateSortAttribute])
      const bDate = toDate(b[dateSortAttribute])
      // console.log('by date')
      // console.log(a.title, aDate)
      // console.log(b.title, bDate)
      // if both are articles that have dates sort them by date
      if (aDate < bDate) return -1
      return 1
    }
    if (a[dateSortAttribute]) return -1
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
  return globby('**/*.{mmark,md}', { cwd, mark: true, nodir: true })
    .then(files => {
      const map = { children: [] }
      files.forEach(addFileToMap(cwd, map))
      return map
    })
    .then(sortBy(byDate))
}

function createNavBarRecursive (node, depth) {
  let target = ''
  let content = titleCase(defined(node.title, node.path))
  content = content.replace(/-/g, ' ')
  if (node.isLeaf) {
    // eslint-disable-next-line
    target = `
      data-url-target="${node.fullPath}"
      ${node.date ? `data-url-date="${node.date}"` : ''}
      ${node.draft ? 'data-draft="true"' : ''}
    `

    // eslint-disable-next-line
    content = `
      <a href="/${node.fullPath.substring(0, node.fullPath.indexOf('.'))}/">
        ${content}
      </a>
    `
  } else {
    // identifier for non leaf children to save their expanded state
    target = `
      data-full-path="${node.fullPath}"
    `
  }

  const childrenToggle = node.children.length ? `<i class="children-toggle"></i>` : ''

  return `
    <li ${target}>
      <div>
        ${childrenToggle}
        ${content}
      </div>
      ${!node.isLeaf ? createNavBar(node, depth + 1) : ''}
    </li>
  `
}

function createNavBar (node, depth = 0) {
  return `
    <ul class="list-is-collapsible ${depth > 0 ? '{{ .Scratch.Get "collapsed" }}' : ''}">
      ${node.children.map(node => createNavBarRecursive(node, depth)).join('\n')}
    </ul>
  `
}

async function main () {
  const sitemapJson = await dfs(path.join(process.cwd(), 'content/'))
  await fs.ensureDir(path.join(process.cwd(), 'data/metadata/'))
  await fs.writeJson(path.join(process.cwd(), 'data/metadata/render-tree.json'), sitemapJson)
  const navbar = await createNavBar(sitemapJson.children.filter(node => node.path === 'notes')[0])
  await fs.ensureDir('layouts/partials/')
  await fs.writeFile('layouts/partials/sitemap-content.html', navbar)
}

main()
