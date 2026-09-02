/**
 * Bottom Floating Status Bar component for Topic Constellation Graph
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html } from '../../ui/preact.js'

export function BottomBar({ matchingCount, totalCount, onResetZoom }) {
  return html`
    <footer class="tw-absolute tw-bottom-4 tw-left-4 tw-right-4 tw-pointer-events-none tw-flex tw-items-center tw-justify-between tw-text-xs tw-text-[var(--grey-light)] tw-z-20 tw-font-sans">
      <!-- Passive Label: Zero border, zero shadow -->
      <div class="tw-pointer-events-none tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-[var(--grey-light)] tw-font-sans">
        <span class="tw-text-primary tw-font-bold">✦ Topic Constellation</span>
        <span class="tw-opacity-60">• ${matchingCount} / ${totalCount} notes</span>
      </div>

      <!-- Right: Actionable Reset Button + Passive Hint -->
      <div class="tw-pointer-events-auto tw-flex tw-items-center tw-gap-3">
        <button
          id="graph-reset-zoom"
          onClick=${onResetZoom}
          class="tw-flex tw-items-center tw-gap-1.5 tw-px-3.5 tw-py-1.5 tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised hover:tw-text-primary tw-transition tw-font-sans tw-text-xs tw-cursor-pointer"
          title="Reset camera view"
        >
          <span class="material-symbols-outlined" style="font-size: 15px">center_focus_strong</span>
          <span class="tw-font-medium">Reset View</span>
        </button>
        <!-- Passive Hint: Zero border, zero shadow -->
        <div class="tw-hidden md:tw-block tw-text-xs tw-text-[var(--grey-light)] tw-opacity-60 tw-font-sans">
          Scroll to zoom • Drag to explore • Click to open
        </div>
      </div>
    </footer>
  `
}
