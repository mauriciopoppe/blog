export interface TocHeading {
  id: string
  level: number
  label: string
}

export interface TocNode extends TocHeading {
  children: TocNode[]
}

export function buildTocTree(headings: readonly TocHeading[]): TocNode[] {
  const roots: TocNode[] = []
  const stack: TocNode[] = []

  for (const heading of headings) {
    const node: TocNode = { ...heading, children: [] }

    while (stack.length > 0 && stack[stack.length - 1].level >= node.level) {
      stack.pop()
    }

    const parent = stack[stack.length - 1]
    if (parent) {
      parent.children.push(node)
    } else {
      roots.push(node)
    }

    stack.push(node)
  }

  return roots
}

function visibleText(element: HTMLElement): string {
  const clone = element.cloneNode(true) as HTMLElement

  clone.querySelectorAll('.katex').forEach((math) => {
    const renderedMath = math.querySelector('.katex-html')
    const label = renderedMath?.textContent || math.textContent || ''
    math.replaceWith(document.createTextNode(label))
  })

  clone.querySelectorAll('mjx-assistive-mml, script, style').forEach((node) => node.remove())

  return (clone.textContent || '').replace(/\s+/g, ' ').trim()
}

function createTocList(nodes: readonly TocNode[], links: Map<string, HTMLAnchorElement>): HTMLUListElement {
  const list = document.createElement('ul')
  list.className = 'toc-list'

  for (const node of nodes) {
    const item = document.createElement('li')
    item.className = 'toc-list-item'

    const link = document.createElement('a')
    link.className = `toc-link node-name--H${node.level}`
    link.href = `#${node.id}`
    link.textContent = node.label
    links.set(node.id, link)
    item.appendChild(link)

    if (node.children.length > 0) {
      item.appendChild(createTocList(node.children, links))
    }

    list.appendChild(item)
  }

  return list
}

export function initializeToc(toc: HTMLElement, content: HTMLElement): () => void {
  const headingElements = Array.from(content.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6'))
    .filter((heading) => heading.id)
  const headings = headingElements.map((heading) => ({
    id: heading.id,
    level: Number(heading.tagName.slice(1)),
    label: visibleText(heading)
  }))
  const links = new Map<string, HTMLAnchorElement>()

  toc.replaceChildren(createTocList(buildTocTree(headings), links))

  let scheduled = false
  const updateActiveLink = () => {
    scheduled = false
    if (headingElements.length === 0) return

    const threshold = 32
    let activeHeading = headingElements[0]
    for (const heading of headingElements) {
      if (heading.getBoundingClientRect().top <= threshold) {
        activeHeading = heading
      } else {
        break
      }
    }

    for (const [id, link] of links) {
      link.classList.toggle('is-active-link', id === activeHeading.id)
    }
  }

  const scheduleActiveLinkUpdate = () => {
    if (!scheduled) {
      scheduled = true
      window.requestAnimationFrame(updateActiveLink)
    }
  }

  const onClick = (event: MouseEvent) => {
    const target = event.target
    if (!(target instanceof Element)) return

    const link = target.closest<HTMLAnchorElement>('a.toc-link')
    if (!link) return

    const heading = document.getElementById(link.hash.slice(1))
    if (!heading) return

    event.preventDefault()
    heading.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.replaceState(null, '', link.hash)
    scheduleActiveLinkUpdate()
  }

  toc.addEventListener('click', onClick)
  window.addEventListener('scroll', scheduleActiveLinkUpdate, { passive: true })
  window.addEventListener('resize', scheduleActiveLinkUpdate)
  updateActiveLink()

  return () => {
    toc.removeEventListener('click', onClick)
    window.removeEventListener('scroll', scheduleActiveLinkUpdate)
    window.removeEventListener('resize', scheduleActiveLinkUpdate)
  }
}
