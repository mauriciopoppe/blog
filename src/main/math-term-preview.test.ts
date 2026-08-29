/*
 * Unit tests for Math & Systems Terms Dictionary and Popover Preview
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { describe, it, expect } from 'bun:test'
import {
  SYSTEMS_TERMS,
  QUEUING_TERMS,
  LLM_TERMS,
  GRAPHICS_TERMS,
  CALCULUS_TERMS,
  getTermsForCategories,
  normalizeTermKey
} from './math-terms.js'
import { buildPopoverHTML, formatMathSnippet } from './math-term-preview.js'

describe('Math & Systems Term Dictionary', () => {
  it('contains valid definitions across separate category dictionaries', () => {
    expect(Object.keys(SYSTEMS_TERMS).length).toBeGreaterThan(5)
    expect(Object.keys(QUEUING_TERMS).length).toBeGreaterThan(5)
    expect(Object.keys(LLM_TERMS).length).toBeGreaterThan(3)
    expect(Object.keys(GRAPHICS_TERMS).length).toBeGreaterThan(3)
    expect(Object.keys(CALCULUS_TERMS).length).toBeGreaterThan(2)

    const allTerms = getTermsForCategories('all')
    const requiredKeys = ['lambda', 'mu', 'rho', 'W', 'W_q', 'S', 'L', 'L_q', 'c', 'Cv', 'TTFT', 'TPOT', 'TPS', 'ITL', 'NTTFT', 'M_proj', 'M_view', 'M_model', 'ndc', 'quaternion', 'derivative', 'integral']

    for (const key of requiredKeys) {
      const term = allTerms[key]
      expect(term).toBeDefined()
      expect(term.name.length).toBeGreaterThan(2)
      expect(term.symbol.length).toBeGreaterThan(0)
      expect(term.summary.length).toBeGreaterThan(10)
      expect(term.insight.length).toBeGreaterThan(10)
      expect(term.category).toBeDefined()
    }
  })

  it('filters terms strictly by active categories for an article', () => {
    const queuingOnly = getTermsForCategories(['queuing'])
    expect(queuingOnly.W_q).toBeDefined()
    expect(queuingOnly.TTFT).toBeUndefined()
    expect(queuingOnly.M_proj).toBeUndefined()

    const graphicsOnly = getTermsForCategories(['graphics'])
    expect(graphicsOnly.M_proj).toBeDefined()
    expect(graphicsOnly.W_q).toBeUndefined()

    const calculusOnly = getTermsForCategories(['calculus'])
    expect(calculusOnly.derivative).toBeDefined()
    expect(calculusOnly.M_proj).toBeUndefined()
  })

  it('normalizes diverse LaTeX syntax and plain aliases within active term context', () => {
    const allTerms = getTermsForCategories('all')

    expect(normalizeTermKey('\\lambda', allTerms)).toBe('lambda')
    expect(normalizeTermKey('$\\lambda$', allTerms)).toBe('lambda')
    expect(normalizeTermKey('lambda', allTerms)).toBe('lambda')

    expect(normalizeTermKey('\\mu', allTerms)).toBe('mu')
    expect(normalizeTermKey('mu', allTerms)).toBe('mu')

    expect(normalizeTermKey('\\rho', allTerms)).toBe('rho')
    expect(normalizeTermKey('rho', allTerms)).toBe('rho')

    expect(normalizeTermKey('W_q', allTerms)).toBe('W_q')
    expect(normalizeTermKey('W_{q}', allTerms)).toBe('W_q')
    expect(normalizeTermKey('wq', allTerms)).toBe('W_q')

    expect(normalizeTermKey('C_v', allTerms)).toBe('Cv')
    expect(normalizeTermKey('C_{v}', allTerms)).toBe('Cv')
    expect(normalizeTermKey('Cv', allTerms)).toBe('Cv')

    expect(normalizeTermKey('\\text{TTFT}', allTerms)).toBe('TTFT')
    expect(normalizeTermKey('TTFT', allTerms)).toBe('TTFT')
    expect(normalizeTermKey('ttft', allTerms)).toBe('TTFT')

    expect(normalizeTermKey('\\text{TPOT}', allTerms)).toBe('TPOT')
    expect(normalizeTermKey('tps', allTerms)).toBe('TPS')

    // Case-sensitive single-letter symbols: units like 's' (seconds) must NOT match 'S' (Service Time)
    expect(normalizeTermKey('S', allTerms)).toBe('S')
    expect(normalizeTermKey('s', allTerms)).toBeNull()

    expect(normalizeTermKey('W', allTerms)).toBe('W')
    expect(normalizeTermKey('w', allTerms)).toBeNull()

    expect(normalizeTermKey('L', allTerms)).toBe('L')
    expect(normalizeTermKey('l', allTerms)).toBeNull()
  })

  it('does not resolve terms if they are not in the active category', () => {
    const queuingOnly = getTermsForCategories(['queuing'])
    // TTFT is not in queuing terms
    expect(normalizeTermKey('TTFT', queuingOnly)).toBeNull()
  })

  it('returns null for unknown or non-matching terms', () => {
    const allTerms = getTermsForCategories('all')
    expect(normalizeTermKey('', allTerms)).toBeNull()
    expect(normalizeTermKey('xyz_non_existent_symbol', allTerms)).toBeNull()
  })

  it('builds rich HTML markup containing header, summary, formula rows, and systems insight', () => {
    const allTerms = getTermsForCategories('all')
    const lambdaTerm = allTerms.lambda
    const html = buildPopoverHTML(lambdaTerm)

    expect(html).toContain('math-popover-header')
    expect(html).toContain('Arrival Rate')
    expect(html).toContain('req/s')
    expect(html).toContain('System Capacity')
    expect(html).toContain('math-popover-summary')
    expect(html).toContain('math-popover-formulas')
    expect(html).toContain('math-popover-insight')
    expect(html).toContain('Insight')
  })

  it('formats math snippets safely even without KaTeX runtime in test environment', () => {
    const snippet = formatMathSnippet('\\lambda = \\frac{N}{\\Delta t}')
    expect(snippet).toContain('code')
  })
})
