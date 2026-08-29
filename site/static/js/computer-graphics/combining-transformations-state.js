/**
 * Pure state mapping for the combining transformations step pipeline.
 *
 * completedCount is the number of fully applied steps (-1 before any), so the
 * next pending step is completedCount + 1. When the chain is done there is no
 * next step, so every row is 'completed' and none is highlighted. Returns one
 * of:
 *   'completed' - step fully applied (disabled, tick)
 *   'active'    - next pending step (highlighted)
 *   'plain'     - future step, not yet reached
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */
export function getStepRowState(completedCount, isDone, idx) {
  if (isDone || idx <= completedCount) return 'completed'
  if (idx === completedCount + 1) {
    return 'active'
  }
  return 'plain'
}
