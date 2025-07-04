import path from 'path'

import fg from 'tiny-glob'
import fm from 'front-matter'
import fs from 'fs-extra'
import { titleCase } from 'title-case'
import { toDate } from 'date-fns'
import defined from 'defined'

const isProduction = process.env.NODE_ENV === 'production'

if (isProduction) {
  console.log('sitemap generator running in production mode')
}

interface ArticleFrontMatter {
  title?: string
  date?: Date
  createdDate?: Date
  draft?: boolean
  // ordering within the parent's children.
  order?: number
}

interface SitemapItem extends ArticleFrontMatter {
  fullPath: string
  path: string
  isLeaf?: boolean
  children: SitemapItem[]
}

// addFileToMap adds an entry of the form "a/b/c" to a structured map
const addFileToMap = (cwd: string, item: SitemapItem) => (file: string) => {
  const data = fs.readFileSync(path.join(cwd, file), { encoding: 'utf-8' })
  const { birthtime } = fs.statSync(path.join(cwd, file))
  const { attributes } = fm<ArticleFrontMatter>(data)

  // if the file is _index.md skip it
  if (file.indexOf('_index.md') >= 0) {
    return
  }

  // skip draft articles in production
  if (isProduction) {
    if (attributes.draft) {
      return
    }
  }

  const tokens = file.substring(0, file.length - path.extname(file).length).split('/')
  let it = item
  for (let i = 0; i < tokens.length; i += 1) {
    const token = tokens[i]
    let node = it.children.find((d) => d.path === token)
    if (!node) {
      it.children.push(
        (node = {
          fullPath: tokens.slice(0, i + 1).join('/'),
          path: token,
          children: []
        })
      )
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

function byOrderAndDate(a: SitemapItem, b: SitemapItem) {
  // if the front matter defines the order use it for sorting
  if ('order' in a || 'order' in b) {
    const aOrder = a.order || 0
    const bOrder = b.order || 0
    return aOrder - bOrder
  }

  const dateSortAttribute = 'date'
  if (a[dateSortAttribute] || b[dateSortAttribute]) {
    if (a[dateSortAttribute] && b[dateSortAttribute]) {
      // convert to dates and toDate
      const aDate = toDate(a[dateSortAttribute])
      const bDate = toDate(b[dateSortAttribute])
      // if both are articles that have dates sort them by date, latest written first.
      if (aDate > bDate) return -1
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

function sortBy(sorterFn: (a: SitemapItem, b: SitemapItem) => number) {
  return function sorter(node: SitemapItem, depth = 0) {
    // sort children first
    node.children.forEach((child) => sorter(child, depth + 1))

    // sort current node children
    node.children.sort(sorterFn)

    // return itself for the next consumer
    return node
  }
}

function dfs(cwd: string) {
  return fg('**/*.{mmark,md}', { cwd })
    .then((files) => {
      const sitemapItem: SitemapItem = { children: [], path: '', fullPath: '' }
      files.forEach(addFileToMap(cwd, sitemapItem))
      return sitemapItem
    })
    .then(sortBy(byOrderAndDate))
}

function createNavBarRecursive(node: SitemapItem, depth: number) {
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
    content = `
      <span data-toggle-text>${content}</span>
    `
  }

  const childrenToggle = node.children.length ? '<i class="children-toggle"></i>' : ''

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

function createNavBar(node: SitemapItem, depth = 0) {
  return `
    <ul class="list-is-collapsible ${depth > 0 ? '{{ .Scratch.Get "collapsed" }}' : ''}">
      ${node.children.map((node) => createNavBarRecursive(node, depth)).join('\n')}
    </ul>
  `
}

async function main() {
  const hugo = path.join(__dirname, '../../site')
  const sitemapJson = await dfs(path.join(hugo, '/content/'))
  await fs.ensureDir(path.join(hugo, '/data/metadata/'))
  await fs.writeJson(path.join(hugo, '/data/metadata/render-tree.json'), sitemapJson, { spaces: 2 })
  const navbar = createNavBar(sitemapJson.children.filter((node) => node.path === 'notes')[0])
  await fs.ensureDir(path.join(hugo, '/layouts/partials/'))
  await fs.writeFile(path.join(hugo, '/layouts/partials/sitemap-tree.auto.html'), navbar)
}

main()
