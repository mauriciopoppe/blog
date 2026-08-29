import fs from 'fs'
import path from 'path'
import http from 'http'
import frontMatter from 'front-matter'
import { chromium, type Browser } from 'playwright'

interface FrontmatterAttributes {
  title?: string;
  summary?: string;
  image?: string;
  date?: string | Date;
  draft?: boolean;
  tags?: string[];
  libraries?: string[];
  [key: string]: any;
}

export interface ValidationIssue {
  type: 'error' | 'warning';
  category: 'frontmatter' | 'date' | 'draft' | 'asset' | 'syntax' | 'math' | 'overflow';
  message: string;
  details?: any;
}

export interface PreflightResult {
  file: string;
  valid: boolean;
  issues: ValidationIssue[];
}

const ROOT_DIR = path.resolve(__dirname, '../..')
const STATIC_DIR = path.resolve(ROOT_DIR, 'site/static')
const CONTENT_DIR = path.resolve(ROOT_DIR, 'site/content')
const DIST_DIR = path.resolve(ROOT_DIR, 'dist')

/**
 * Validates frontmatter and markdown syntax rules for a single file.
 */
export function validateStatic(filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = []
  const fullPath = path.isAbsolute(filePath) ? filePath : path.resolve(ROOT_DIR, filePath)

  if (!fs.existsSync(fullPath)) {
    issues.push({
      type: 'error',
      category: 'frontmatter',
      message: `File does not exist: ${filePath}`
    })
    return issues
  }

  const rawContent = fs.readFileSync(fullPath, 'utf8')
  let parsed: { attributes: FrontmatterAttributes; body: string }

  try {
    parsed = frontMatter<FrontmatterAttributes>(rawContent)
  } catch (err: any) {
    issues.push({
      type: 'error',
      category: 'frontmatter',
      message: `Failed to parse YAML frontmatter: ${err.message}`
    })
    return issues
  }

  const { attributes, body } = parsed

  // 1. Title & Summary
  if (!attributes.title || typeof attributes.title !== 'string' || attributes.title.trim().length === 0) {
    issues.push({
      type: 'error',
      category: 'frontmatter',
      message: 'Missing or empty "title" property in frontmatter.'
    })
  }

  if (!attributes.summary || typeof attributes.summary !== 'string' || attributes.summary.trim().length === 0) {
    issues.push({
      type: 'error',
      category: 'frontmatter',
      message: 'Missing or empty "summary" property in frontmatter.'
    })
  }

  // 2. Draft Status
  if (attributes.draft === true) {
    issues.push({
      type: 'error',
      category: 'draft',
      message: 'Article is marked as "draft: true". Remove draft property or set to false before publishing.'
    })
  }

  // 3. Publication Date (Must be today with ±36 hours grace for timezone drift)
  if (!attributes.date) {
    issues.push({
      type: 'error',
      category: 'date',
      message: 'Missing "date" property in frontmatter.'
    })
  } else {
    const parsedDate = new Date(attributes.date)
    if (isNaN(parsedDate.getTime())) {
      issues.push({
        type: 'error',
        category: 'date',
        message: `Invalid date format in frontmatter: "${attributes.date}"`
      })
    } else {
      const now = new Date()
      const diffMs = Math.abs(now.getTime() - parsedDate.getTime())
      const maxDiffMs = 36 * 60 * 60 * 1000 // 36 hours grace window
      if (diffMs > maxDiffMs) {
        issues.push({
          type: 'warning',
          category: 'date',
          message: `Article date (${parsedDate.toISOString().slice(0, 10)}) is not today (${now.toISOString().slice(0, 10)}). Update date before publishing.`
        })
      }
    }
  }

  // 4. Hero Image Check
  if (!attributes.image) {
    issues.push({
      type: 'error',
      category: 'asset',
      message: 'Missing "image" property in frontmatter.'
    })
  } else {
    const imgPath = attributes.image
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      // Remote image URL
    } else {
      // Local image relative to site/static
      const cleanPath = imgPath.startsWith('/') ? imgPath.slice(1) : imgPath
      const resolvedPath = path.resolve(STATIC_DIR, cleanPath)
      if (!fs.existsSync(resolvedPath)) {
        issues.push({
          type: 'error',
          category: 'asset',
          message: `Hero image not found in site/static/: "${imgPath}" (checked "${resolvedPath}")`
        })
      } else {
        const stats = fs.statSync(resolvedPath)
        if (stats.size === 0) {
          issues.push({
            type: 'error',
            category: 'asset',
            message: `Hero image is empty (0 bytes): "${imgPath}"`
          })
        }
      }
    }
  }

  // 5. Embedded Static Assets (images, scripts)
  const localImgRegex = /(?:<img[^>]+src=["'](\/[^"']+)["']|!\[[^\]]*\]\((\/[^)\s]+)\))/g
  let match: RegExpExecArray | null
  while ((match = localImgRegex.exec(body)) !== null) {
    const assetPath = match[1] || match[2]
    if (assetPath && !assetPath.startsWith('http')) {
      const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath
      const resolved = path.resolve(STATIC_DIR, cleanPath)
      if (!fs.existsSync(resolved)) {
        issues.push({
          type: 'error',
          category: 'asset',
          message: `Referenced image asset not found: "${assetPath}"`
        })
      }
    }
  }

  // 6. Hugo Goldmark SVG Contiguity (No blank lines inside <svg>...</svg>)
  const svgBlocks = body.match(/<svg[\s\S]*?<\/svg>/g) || []
  for (const svg of svgBlocks) {
    const lines = svg.split('\n')
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim() === '') {
        issues.push({
          type: 'error',
          category: 'syntax',
          message: `Found blank line inside <svg> block (Line ${i + 1} of SVG). Goldmark parser will truncate SVG block! Remove empty lines.`
        })
        break
      }
    }
  }

  // 7. Math % in Prose Check (Line-by-line inspection)
  const bodyLines = body.split('\n')
  for (let lineIdx = 0; lineIdx < bodyLines.length; lineIdx++) {
    const line = bodyLines[lineIdx]
    // Find inline math delimiters on the single line
    const inlineMathMatches = line.match(/\$(?:\\\$|[^$\n])+\$/g) || []
    for (const mathSnippet of inlineMathMatches) {
      if (/\d+\s*\\?%/.test(mathSnippet)) {
        issues.push({
          type: 'warning',
          category: 'math',
          message: `Percentage wrapped inside inline math on line ${lineIdx + 1}: "${mathSnippet}". Unwrap percentages to standard prose (e.g. 50%, 75%).`
        })
      }
    }
  }

  return issues
}

/**
 * Creates a lightweight static file server to serve `dist/` directory.
 */
function createStaticServer (distDir: string): Promise<{ server: http.Server; port: number; close: () => Promise<void> }> {
  return new Promise((resolve, reject) => {
    const mimeTypes: Record<string, string> = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff2': 'font/woff2'
    }

    const server = http.createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url || '/').split('?')[0]
      let filePath = path.join(distDir, urlPath)

      if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
        filePath = path.join(filePath, 'index.html')
      }

      if (!fs.existsSync(filePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' })
        res.end('404 Not Found')
        return
      }

      const ext = path.extname(filePath).toLowerCase()
      const contentType = mimeTypes[ext] || 'application/octet-stream'

      try {
        const content = fs.readFileSync(filePath)
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(content)
      } catch (err: any) {
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end(`Internal error: ${err.message}`)
      }
    })

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address()
      const port = typeof addr === 'object' && addr ? addr.port : 3000
      resolve({
        server,
        port,
        close: () => new Promise<void>((resolve) => server.close(() => resolve()))
      })
    })

    server.on('error', reject)
  })
}

/**
 * Derives the URL path in dist/ for a given markdown file.
 */
export function getArticleUrlPath(filePath: string): string {
  const relPath = path.relative(CONTENT_DIR, path.resolve(ROOT_DIR, filePath))
  let url = relPath.replace(/\.md$/, '')
  if (url.endsWith('/_index') || url === '_index') {
    url = url.replace(/_index$/, '')
  } else if (url.endsWith('/index')) {
    url = url.replace(/index$/, '')
  }
  return '/' + url.replace(/\\/g, '/') + (url.endsWith('/') ? '' : '/')
}

export interface ViewportConfig {
  name: string;
  width: number;
  height: number;
}

const VIEWPORTS: ViewportConfig[] = [
  { name: 'Mobile SE', width: 375, height: 667 },
  { name: 'Mobile Modern', width: 390, height: 844 },
  { name: 'Desktop Large', width: 1280, height: 800 }
]

/**
 * Tests rendered page across viewports using Playwright to detect horizontal overflow.
 */
export async function validateViewportOverflow(filePath: string): Promise<ValidationIssue[]> {
  const issues: ValidationIssue[] = []
  const urlPath = getArticleUrlPath(filePath)
  const targetHtml = path.join(DIST_DIR, urlPath, 'index.html')

  if (!fs.existsSync(targetHtml)) {
    issues.push({
      type: 'error',
      category: 'overflow',
      message: `Built HTML file not found at ${targetHtml}. Run "bun run build" before running preflight.`
    })
    return issues
  }

  let serverInstance: { port: number; close: () => Promise<void> } | null = null
  let browser: Browser | null = null

  try {
    serverInstance = await createStaticServer(DIST_DIR)
    const testUrl = `http://127.0.0.1:${serverInstance.port}${urlPath}`

    browser = await chromium.launch({ headless: true })
    const context = await browser.newContext()
    const page = await context.newPage()
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height })
      await page.goto(testUrl, { waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(500) // Allow math and responsive diagrams to layout
      const evalResult = await page.evaluate(() => {
        const docEl = document.documentElement
        const body = document.body
        const clientWidth = docEl.clientWidth

        const isInsideScrollContainer = (element: Element) => {
          let parent = element.parentElement
          while (parent && parent !== document.body && parent !== document.documentElement) {
            const parentStyle = window.getComputedStyle(parent)
            if (parentStyle.overflowX === 'auto' || parentStyle.overflowX === 'scroll' || parentStyle.overflowX === 'hidden' || parentStyle.contain.includes('layout')) {
              return true
            }
            parent = parent.parentElement
          }
          return false
        }

        const offending: Array<{
          tag: string
          id: string
          className: string
          right: number
          excess: number
          snippet: string
        }> = []

        const wideBlocks = Array.from(document.body.querySelectorAll('*')).filter(el => {
          if (['g', 'path', 'rect', 'circle', 'text', 'tspan', 'line', 'defs', 'marker', 'polygon', 'foreignobject', 'math', 'semantics', 'annotation', 'annotation-xml'].includes(el.tagName.toLowerCase())) return false
          if (el.closest('svg')) return false
          if (el.closest('.katex-mathml')) return false
          if (isInsideScrollContainer(el)) return false

          const style = window.getComputedStyle(el)
          if (style.display === 'none' || style.visibility === 'hidden') return false
          if (style.overflowX === 'auto' || style.overflowX === 'scroll' || style.overflowX === 'hidden' || style.contain.includes('layout')) return false

          const rect = el.getBoundingClientRect()
          return rect.right > clientWidth + 2 || el.offsetWidth > clientWidth + 2
        })

        for (const el of wideBlocks) {
          const rect = el.getBoundingClientRect()
          const className = typeof el.className === 'string' ? el.className.trim() : ''
          offending.push({
            tag: el.tagName.toLowerCase(),
            id: el.id || '',
            className: className.slice(0, 50),
            right: Math.round(Math.max(rect.right, el.offsetWidth)),
            excess: Math.round(Math.max(rect.right, el.offsetWidth) - clientWidth),
            snippet: `<${el.tagName.toLowerCase()}${el.id ? ` id="${el.id}"` : ''}${className ? ` class="${className}"` : ''}> [width=${Math.round(Math.max(rect.right, el.offsetWidth))}px] text: "${(el.textContent || '').slice(0, 60).replace(/\s+/g, ' ')}"`
          })
        }

        window.scrollTo(1000, 0)
        const canScrollHorizontally = window.scrollX > 0 || docEl.scrollLeft > 0 || body.scrollLeft > 0
        window.scrollTo(0, 0)

        const scrollWidth = Math.max(docEl.scrollWidth, body.scrollWidth)
        const hasOverflow = canScrollHorizontally || offending.length > 0
        return { hasOverflow, canScrollHorizontally, scrollWidth, clientWidth, offending }
      })

      if (evalResult.hasOverflow) {
        const details = evalResult.offending.length > 0 ? evalResult.offending : [{
          tag: 'document',
          id: '',
          className: '',
          right: evalResult.scrollWidth,
          excess: evalResult.scrollWidth - evalResult.clientWidth,
          snippet: `document.scrollWidth (${evalResult.scrollWidth}px) > clientWidth (${evalResult.clientWidth}px) [canScrollHorizontally=${evalResult.canScrollHorizontally}, offendingCount=${evalResult.offending.length}]`
        }]
        const summaryDetails = details.slice(0, 5).map(d => d.snippet).join('\n    - ')
        issues.push({
          type: 'error',
          category: 'overflow',
          message: `Horizontal X-axis overflow detected on ${vp.name} (${vp.width}px): Page scrollWidth (${evalResult.scrollWidth}px) exceeds clientWidth (${evalResult.clientWidth}px) by +${evalResult.scrollWidth - evalResult.clientWidth}px.\n    - ${summaryDetails}`,
          details
        })
      }
    }
  } catch (err: any) {
    issues.push({
      type: 'error',
      category: 'overflow',
      message: `Failed to execute Playwright viewport check: ${err.message}`
    })
  } finally {
    if (browser) await browser.close()
    if (serverInstance) await serverInstance.close()
  }

  return issues
}

/**
 * Runs full preflight validation for a file.
 */
export async function runPreflight(filePath: string, options: { staticOnly?: boolean } = {}): Promise<PreflightResult> {
  const staticIssues = validateStatic(filePath)
  let overflowIssues: ValidationIssue[] = []

  if (!options.staticOnly && staticIssues.filter(i => i.type === 'error').length === 0) {
    overflowIssues = await validateViewportOverflow(filePath)
  }

  const allIssues = [...staticIssues, ...overflowIssues]
  const valid = allIssues.filter(i => i.type === 'error').length === 0

  return {
    file: filePath,
    valid,
    issues: allIssues
  }
}

// CLI Execution
if (import.meta.main) {
  const args = process.argv.slice(2)
  const staticOnly = args.includes('--static-only')
  const targetFiles = args.filter(a => !a.startsWith('--'))

  if (targetFiles.length === 0) {
    console.error('Usage: bun run src/scripts/preflight.ts <path-to-article.md> [--static-only]')
    process.exit(1)
  }

  (async () => {
    let hasFailures = false
    for (const file of targetFiles) {
      console.log(`\n🔍 Running Preflight on: ${file}`)
      const result = await runPreflight(file, { staticOnly })

      if (result.issues.length === 0) {
        console.log('✅ All preflight checks passed! Ready for publication.')
      } else {
        for (const issue of result.issues) {
          const icon = issue.type === 'error' ? '❌' : '⚠️'
          console.log(`  ${icon} [${issue.category.toUpperCase()}] ${issue.message}`)
        }
        if (!result.valid) {
          hasFailures = true
        }
      }
    }

    if (hasFailures) {
      console.error('\n❌ Preflight validation failed with errors.')
      process.exit(1)
    } else {
      console.log('\n✨ Preflight validation completed successfully.')
      process.exit(0)
    }
  })()
}
