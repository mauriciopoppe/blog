/*
 * Math and Systems Terms Popover Preview Controller
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { getTermsForCategories, normalizeTermKey, MathTermDefinition, TermCategory } from './math-terms.js'

declare global {
  interface Window {
    katex?: {
      renderToString: (tex: string, options?: { displayMode?: boolean; throwOnError?: boolean }) => string
    }
  }
}

export function formatMathSnippet(tex: string): string {
  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex, { displayMode: false, throwOnError: false })
    } catch {
      return `<code>${tex}</code>`
    }
  }
  return `<code>${tex}</code>`
}

export function buildPopoverHTML(term: MathTermDefinition): string {
  const renderedSymbol = formatMathSnippet(term.symbol)
  const unitBadge = term.unit
    ? `<div class="math-popover-unit-group"><span class="math-popover-unit-label">Unit:</span><span class="math-popover-unit">${term.unit}</span></div>`
    : ''

  const formulaRows = (term.formulas || [])
    .map(f => `<div class="math-popover-formula-line">${formatMathSnippet(f)}</div>`)
    .join('')

  const formulasSection = formulaRows
    ? `<div class="math-popover-formulas-block">
        <div class="math-popover-section-label">Key Formulas</div>
        <div class="math-popover-formulas">${formulaRows}</div>
      </div>`
    : ''

  const insightSection = term.insight
    ? `<div class="math-popover-insight"><strong class="math-popover-insight-tag">Insight</strong> ${term.insight}</div>`
    : ''

  return `
    <div class="math-popover-header">
      <div class="math-popover-title-row">
        <span class="math-popover-symbol">${renderedSymbol}</span>
        <span class="math-popover-name">${term.name}</span>
      </div>
      <div class="math-popover-meta-row">
        <span class="math-popover-category">${term.category}</span>
        ${unitBadge}
      </div>
    </div>
    <div class="math-popover-summary">${term.summary}</div>
    ${formulasSection}
    ${insightSection}
  `
}

export function initMathTermPreview(containerSelector = 'article[role=main]') {
  const container = document.querySelector(containerSelector) as HTMLElement
  if (!container) return

  // Check if current article explicitly opted in to math terms via frontmatter
  const section = container.closest('section') || document.querySelector('section[data-libraries]')
  let activeCategories: TermCategory[] | 'all' | null = null

  if (section) {
    const rawMathTerms = section.getAttribute('data-math-terms')
    const rawLibraries = section.getAttribute('data-libraries')

    if (rawMathTerms && rawMathTerms !== '""' && rawMathTerms !== 'null') {
      try {
        const parsed = JSON.parse(rawMathTerms)
        if (Array.isArray(parsed)) {
          activeCategories = parsed as TermCategory[]
        } else if (parsed === true || parsed === 'all') {
          activeCategories = 'all'
        }
      } catch {
        if (rawMathTerms.includes('queuing') || rawMathTerms.includes('systems') || rawMathTerms.includes('llm')) {
          activeCategories = rawMathTerms.split(',').map(s => s.trim()) as TermCategory[]
        }
      }
    } else if (rawLibraries && rawLibraries.includes('math-terms')) {
      activeCategories = 'all'
    }
  }

  // If no math terms enabled on this page, do not activate
  if (!activeCategories || (Array.isArray(activeCategories) && activeCategories.length === 0)) {
    return
  }

  const activeTerms = getTermsForCategories(activeCategories)
  if (Object.keys(activeTerms).length === 0) return

  // Singleton Popover Card
  let popover = document.querySelector('.math-popover-card') as HTMLElement
  if (!popover) {
    popover = document.createElement('div')
    popover.className = 'math-popover-card'
    popover.style.display = 'none'
    document.body.appendChild(popover)
  }

  let showTimer: any = null
  let hideTimer: any = null

  function showCard(target: HTMLElement, termKey: string) {
    clearTimeout(hideTimer)
    const term = activeTerms[termKey]
    if (!term) return

    popover.innerHTML = buildPopoverHTML(term)
    popover.style.display = 'block'

    const targetRect = target.getBoundingClientRect()
    const popoverRect = popover.getBoundingClientRect()
    const scrollY = window.pageYOffset || document.documentElement.scrollTop
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft

    // Vertical positioning: default below, flip above if close to bottom
    let top = targetRect.bottom + scrollY + 8
    if (targetRect.bottom + popoverRect.height + 20 > window.innerHeight && targetRect.top > popoverRect.height + 20) {
      top = targetRect.top + scrollY - popoverRect.height - 8
    }

    // Horizontal positioning: align with target left, clamp within viewport
    let left = targetRect.left + scrollX - 20
    const maxLeft = scrollX + window.innerWidth - popoverRect.width - 16
    if (left > maxLeft) {
      left = maxLeft
    }
    if (left < scrollX + 16) {
      left = scrollX + 16
    }

    popover.style.top = `${top}px`
    popover.style.left = `${left}px`

    // Trigger transition
    requestAnimationFrame(() => {
      popover.classList.add('is-visible')
    })
  }

  function hideCard() {
    clearTimeout(showTimer)
    hideTimer = setTimeout(() => {
      popover.classList.remove('is-visible')
      setTimeout(() => {
        if (!popover.classList.contains('is-visible')) {
          popover.style.display = 'none'
        }
      }, 160)
    }, 120)
  }

  // Mouse Bridge for Popover
  popover.addEventListener('mouseenter', () => {
    clearTimeout(hideTimer)
  })

  popover.addEventListener('mouseleave', () => {
    hideCard()
  })

  function bindElement(el: HTMLElement, key: string) {
    if (el.hasAttribute('data-term-bound')) return
    el.setAttribute('data-term-bound', 'true')
    el.setAttribute('data-term-active', 'true')

    el.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer)
      showTimer = setTimeout(() => showCard(el, key), 100)
    })
    el.addEventListener('mouseleave', hideCard)
  }

  function scanKaTeXInsideEquation(katexEl: HTMLElement) {
    const htmlContainer = katexEl.querySelector('.katex-html')
    if (!htmlContainer) return

    // 1. First pass: identify composite subscript pairs (e.g. W_q, L_q, C_v)
    const supsubElements = htmlContainer.querySelectorAll<HTMLElement>('.msupsub')
    supsubElements.forEach(subEl => {
      const prevEl = subEl.previousElementSibling as HTMLElement | null
      if (!prevEl) return

      const baseText = (prevEl.textContent || '').trim()
      const subText = (subEl.textContent || '').trim()

      let compositeKey: string | null = null
      if (baseText === 'W' && subText.includes('q')) {
        compositeKey = 'W_q'
      } else if (baseText === 'L' && subText.includes('q')) {
        compositeKey = 'L_q'
      } else if (baseText === 'C' && subText.includes('v')) {
        compositeKey = 'Cv'
      }

      if (compositeKey && activeTerms[compositeKey]) {
        bindElement(prevEl, compositeKey)
        bindElement(subEl, compositeKey)
      }
    })

    // 2. Second pass: scan individual symbol elements (mord, mathnormal, text)
    const symbolElements = htmlContainer.querySelectorAll<HTMLElement>('.mord, .mord.mathnormal, .mord.text')
    symbolElements.forEach(symEl => {
      if (symEl.hasAttribute('data-term-bound')) return

      // Avoid matching parent nodes if they contain child .mord nodes
      if (symEl.querySelector('.mord')) return

      const text = (symEl.textContent || '').trim()
      if (!text || text.length > 10) return

      const key = normalizeTermKey(text, activeTerms)
      if (key) {
        bindElement(symEl, key)
      }
    })
  }

  function scanTerms() {
    // 1. Scan explicit [data-term] elements
    const explicitTerms = container.querySelectorAll<HTMLElement>('[data-term]')
    explicitTerms.forEach(el => {
      const raw = el.getAttribute('data-term') || ''
      const key = normalizeTermKey(raw, activeTerms)
      if (key) {
        bindElement(el, key)
      }
    })

    // 2. Scan KaTeX Math elements (both isolated and inside equations)
    const katexElements = container.querySelectorAll<HTMLElement>('.katex')
    katexElements.forEach(el => {
      const annotation = el.querySelector('annotation')
      const rawTex = annotation ? (annotation.textContent || '').trim() : (el.textContent || '').trim()
      const isolatedKey = normalizeTermKey(rawTex, activeTerms)

      if (isolatedKey) {
        // Entire KaTeX element is a single standalone term (e.g. $\lambda$ or $W_q$)
        bindElement(el, isolatedKey)
      } else {
        // Multi-term equation (e.g. $W = W_q + S$ or $\rho = \frac{\lambda}{c \mu}$)
        scanKaTeXInsideEquation(el)
      }
    })
  }

  // Initial scanning passes
  scanTerms()
  setTimeout(scanTerms, 150)
  setTimeout(scanTerms, 600)

  // Observe dynamically rendered KaTeX mutations
  const observer = new MutationObserver(() => {
    scanTerms()
  })
  observer.observe(container, { childList: true, subtree: true })

  // 3. Mobile touch / Click dismiss
  document.addEventListener('click', (e) => {
    const clicked = e.target as HTMLElement
    if (!clicked.closest('.math-popover-card') && !clicked.closest('[data-term-active]')) {
      popover.classList.remove('is-visible')
      popover.style.display = 'none'
    }
  })
}

export function mathTermPreviewMain() {
  if (typeof document === 'undefined') return
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initMathTermPreview())
  } else {
    initMathTermPreview()
  }
}
