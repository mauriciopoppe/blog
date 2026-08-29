/*
 * Unit tests for the combining transformations step pipeline state mapping.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { describe, it, expect } from 'bun:test'
import { getStepRowState } from './combining-transformations-state.js'

describe('combining transformations step pipeline state', () => {
  it('highlights the first step as next before anything is applied', () => {
    expect(getStepRowState(-1, false, 0)).toBe('active')
    expect(getStepRowState(-1, false, 1)).toBe('plain')
    expect(getStepRowState(-1, false, 2)).toBe('plain')
  })

  it('keeps the animating step active while it is being applied', () => {
    // During step 0 (Scale) animation, completedCount is still -1.
    expect(getStepRowState(-1, false, 0)).toBe('active')
  })

  it('marks the applied step complete and highlights the next one', () => {
    // Scale applied: completedCount = 0 -> Scale is checked, Rotate Y is next.
    expect(getStepRowState(0, false, 0)).toBe('completed')
    expect(getStepRowState(0, false, 1)).toBe('active')
    expect(getStepRowState(0, false, 2)).toBe('plain')
  })

  it('marks all steps complete with no highlight when done', () => {
    expect(getStepRowState(2, true, 0)).toBe('completed')
    expect(getStepRowState(2, true, 1)).toBe('completed')
    expect(getStepRowState(2, true, 2)).toBe('completed')
  })
})
