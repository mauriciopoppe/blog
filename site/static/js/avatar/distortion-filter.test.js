import { describe, it, expect } from 'bun:test'
import { readFileSync } from 'fs'
import {
  calculateImpulseDecay,
  calculateBaseFrequency,
  calculateTierScale,
  distanceBetweenRects,
  isTextualRegion,
  canApplyDistortion,
  ARTICLE_TEXT_EXCLUSION_SELECTOR,
  ARTICLE_FRAGMENT_SELECTOR,
  ARTICLE_TEXT_TARGET_SELECTOR,
  DISTORTION_TARGET_SELECTOR
} from './distortion-filter.js'

describe('Article distortion boundaries', () => {
  it('never rewrites or filters SVG content', () => {
    expect(ARTICLE_TEXT_EXCLUSION_SELECTOR).toContain('svg')
    expect(ARTICLE_FRAGMENT_SELECTOR).not.toContain('svg')
  })

  it('never applies distortion to document roots after avatar detachment', () => {
    expect(canApplyDistortion({ nodeName: 'HTML' })).toBe(false)
    expect(canApplyDistortion({ nodeName: 'BODY' })).toBe(false)
    expect(canApplyDistortion({ nodeName: 'DIV' })).toBe(true)
  })

  it('keeps text-bearing containers out of whole-region distortion', () => {
    expect(isTextualRegion({ textContent: 'A nearby description row' })).toBe(true)
    expect(isTextualRegion({ textContent: '   ' })).toBe(false)
    expect(isTextualRegion({ textContent: '' })).toBe(false)
  })

  it('uses explicit distortion target attributes instead of layout classes', () => {
    expect(DISTORTION_TARGET_SELECTOR).toBe('[data-avatar-distortion-target]')
  })

  it('includes the article header so summaries and dates can become fragments', () => {
    expect(ARTICLE_TEXT_TARGET_SELECTOR).toContain('article[role="main"]')
    expect(ARTICLE_TEXT_TARGET_SELECTOR).toContain('[data-avatar-distortion-target="note-header"]')
  })

  it('includes both article sidebars in the text target scan', () => {
    const content = readFileSync(new URL('../../../../site/layouts/_partials/single-content.html', import.meta.url), 'utf8')
    expect(content.match(/data-avatar-distortion-target="article-sidebar"/g)).toHaveLength(2)
    expect(ARTICLE_TEXT_TARGET_SELECTOR).toContain('[data-avatar-distortion-target="article-sidebar"]')
  })

  it('does not traverse mini-player text as distortion content', () => {
    expect(ARTICLE_TEXT_EXCLUSION_SELECTOR).toContain('.avatar-mini-player')
  })

  it('marks the homepage profile heading as one distortion fragment', () => {
    const profile = readFileSync(new URL('../../../../site/layouts/_partials/profile.html', import.meta.url), 'utf8')
    expect(profile).toContain('data-avatar-distortion-fragment')
  })
})

describe('Acoustic Shockwave Distortion Math', () => {
  it('ranks nearby rectangles by their closest edges instead of their centers', () => {
    const avatar = { left: 502, top: 239, right: 598, bottom: 335, width: 96, height: 96 }
    const heading = { left: 266, top: 215, right: 478, bottom: 335, width: 212, height: 120 }

    expect(distanceBetweenRects(heading, avatar)).toBe(24)
  })

  it('starts at initial scale and decays monotonically towards zero', () => {
    const initialScale = 20
    const duration = 180

    const atStart = calculateImpulseDecay(0, duration, initialScale)
    const atQuarter = calculateImpulseDecay(45, duration, initialScale)
    const atHalf = calculateImpulseDecay(90, duration, initialScale)
    const atEnd = calculateImpulseDecay(duration, duration, initialScale)

    expect(atStart).toBe(initialScale)
    expect(atQuarter).toBeLessThan(atStart)
    expect(atHalf).toBeLessThan(atQuarter)
    expect(atEnd).toBe(0)
  })

  it('clamps and scales base frequency based on pitch frequency', () => {
    const bassFreq = calculateBaseFrequency(100)
    const trebleFreq = calculateBaseFrequency(800)

    expect(bassFreq).toBeGreaterThanOrEqual(0.025)
    expect(trebleFreq).toBeGreaterThan(bassFreq)
    expect(trebleFreq).toBeLessThanOrEqual(0.06)

    const ultraBass = calculateBaseFrequency(10)
    const ultraTreble = calculateBaseFrequency(5000)

    expect(ultraBass).toBe(0.025)
    expect(ultraTreble).toBe(0.06)
  })

  it('scales displacement force monotonically downwards across tiers', () => {
    const baseScale = 40

    const tier1 = calculateTierScale(1, baseScale)
    const tier2 = calculateTierScale(2, baseScale)
    const tier3 = calculateTierScale(3, baseScale)
    const tier0 = calculateTierScale(0, baseScale)

    expect(tier1).toBe(40)
    expect(tier2).toBeCloseTo(24.8)
    expect(tier3).toBeCloseTo(14.0)
    expect(tier0).toBe(0)

    expect(tier1).toBeGreaterThan(tier2)
    expect(tier2).toBeGreaterThan(tier3)
    expect(tier3).toBeGreaterThan(tier0)
  })
})
