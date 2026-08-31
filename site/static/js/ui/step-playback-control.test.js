/*
 * Unit tests for the reusable StepPlaybackControl widget.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { describe, it, expect } from 'bun:test'
import {
  CTRL_BTN_CLASS,
  PLAY_NEUTRAL_CLASS,
  PLAY_ACTIVE_CLASS,
  renderStepPlaybackControlHTML,
  StepPlaybackControl
} from './step-playback-control.js'

describe('StepPlaybackControl Component & Tokens', () => {
  it('includes disabled state tokens that omit hover box shadow and cursor pointer', () => {
    expect(CTRL_BTN_CLASS).toContain('disabled:tw-shadow-none')
    expect(CTRL_BTN_CLASS).toContain('disabled:hover:tw-shadow-none')
    expect(CTRL_BTN_CLASS).toContain('disabled:tw-cursor-not-allowed')
    expect(CTRL_BTN_CLASS).toContain('disabled:hover:tw-filter-none')

    expect(PLAY_NEUTRAL_CLASS).toContain('disabled:tw-shadow-none')
    expect(PLAY_NEUTRAL_CLASS).toContain('disabled:hover:tw-shadow-none')
    expect(PLAY_NEUTRAL_CLASS).toContain('disabled:tw-cursor-not-allowed')
    expect(PLAY_NEUTRAL_CLASS).toContain('disabled:hover:tw-filter-none')
  })

  it('renders HTML template with proper identifiers and classes', () => {
    const html = renderStepPlaybackControlHTML({
      idPrefix: 'demo-ctrl',
      showReset: true,
      playLabel: 'Play Simulation'
    })

    expect(html).toContain('id="demo-ctrl-reset"')
    expect(html).toContain('id="demo-ctrl-back"')
    expect(html).toContain('id="demo-ctrl-play"')
    expect(html).toContain('id="demo-ctrl-forward"')
    expect(html).toContain('▶ Play Simulation')
  })

  it('correctly disables back and reset at the beginning', () => {
    // Mock DOM node
    const listeners = {}
    const elements = {}

    function createMockElement(id) {
      return {
        id,
        disabled: false,
        className: '',
        textContent: '',
        addEventListener: (event, handler) => {
          listeners[`${id}:${event}`] = handler
        }
      }
    }

    const mountEl = {
      innerHTML: '',
      querySelector: (selector) => {
        const id = selector.replace('#', '')
        if (!elements[id]) {
          elements[id] = createMockElement(id)
        }
        return elements[id]
      }
    }

    const ctrl = new StepPlaybackControl({
      mountEl,
      idPrefix: 'test-ctrl',
      totalSteps: 3,
      currentStep: 0,
      playLabel: 'Play'
    })

    expect(elements['test-ctrl-back'].disabled).toBe(true)
    expect(elements['test-ctrl-reset'].disabled).toBe(true)
    expect(elements['test-ctrl-forward'].disabled).toBe(false)
    expect(elements['test-ctrl-play-text'].textContent).toBe('▶ Play')
  })

  it('enables back button and disables forward button at the end step', () => {
    const listeners = {}
    const elements = {}

    function createMockElement(id) {
      return {
        id,
        disabled: false,
        className: '',
        textContent: '',
        addEventListener: (event, handler) => {
          listeners[`${id}:${event}`] = handler
        }
      }
    }

    const mountEl = {
      innerHTML: '',
      querySelector: (selector) => {
        const id = selector.replace('#', '')
        if (!elements[id]) {
          elements[id] = createMockElement(id)
        }
        return elements[id]
      }
    }

    const ctrl = new StepPlaybackControl({
      mountEl,
      idPrefix: 'test-ctrl',
      totalSteps: 3,
      currentStep: 0
    })

    // Advance to last step
    ctrl.update({ currentStep: 2, totalSteps: 3, isPlaying: false })

    expect(elements['test-ctrl-back'].disabled).toBe(false)
    expect(elements['test-ctrl-reset'].disabled).toBe(false)
    expect(elements['test-ctrl-forward'].disabled).toBe(true)
    expect(elements['test-ctrl-play-text'].textContent).toBe('↺ Replay')
  })

  it('updates play button to pause state during animation', () => {
    const listeners = {}
    const elements = {}

    function createMockElement(id) {
      return {
        id,
        disabled: false,
        className: '',
        textContent: '',
        addEventListener: (event, handler) => {
          listeners[`${id}:${event}`] = handler
        }
      }
    }

    const mountEl = {
      innerHTML: '',
      querySelector: (selector) => {
        const id = selector.replace('#', '')
        if (!elements[id]) {
          elements[id] = createMockElement(id)
        }
        return elements[id]
      }
    }

    const ctrl = new StepPlaybackControl({
      mountEl,
      idPrefix: 'test-ctrl',
      totalSteps: 3,
      currentStep: 1
    })

    ctrl.update({ currentStep: 1, isPlaying: true })

    expect(elements['test-ctrl-play'].className).toBe(PLAY_ACTIVE_CLASS)
    expect(elements['test-ctrl-play-text'].textContent).toBe('⏸ Pause')
  })
})
