/**
 * Interactive Fullscreen Topic Constellation Graph for /notes/
 *
 * Entry point that parses server-provided graph data, dynamically imports D3,
 * and mounts the reactive Preact application.
 *
 * Re-exports all mathematical and graph transformation utilities to maintain
 * 100% backward compatibility with test suites and external consumers.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html, render } from '../ui/preact.js'
import { NotesGraphApp } from './NotesGraphApp.js'
import { buildGraphData } from './notes-graph-math.js'

// Re-export all pure math and graph algorithms
export {
  calculateNodeRadius,
  getClusterCategory,
  getClusterColor,
  getIndicatorColors,
  normalizeTag,
  isNodeInFilter,
  buildGraphData,
  filterGraphData,
  shouldShowNodeLabel
} from './notes-graph-math.js'

export async function initNotesGraph(containerId = 'notes-graph-container') {
  if (typeof window === 'undefined') return
  const container = document.getElementById(containerId)
  if (!container) return

  const dataScript = document.getElementById('notes-graph-data')
  if (!dataScript) return

  let rawNotes = []
  try {
    rawNotes = JSON.parse(dataScript.textContent || '[]')
  } catch (e) {
    console.error('Failed to parse notes-graph-data', e)
    return
  }

  if (!rawNotes.length) return

  // Import D3 dynamically from ESM CDN
  const d3 = await import('https://cdn.jsdelivr.net/npm/d3@7/+esm')

  const fullGraph = buildGraphData(rawNotes, 3)

  render(html`<${NotesGraphApp} fullGraph=${fullGraph} d3=${d3} />`, container)
}

// Auto-initialize if container is in document
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => initNotesGraph())
  } else {
    initNotesGraph()
  }
}
