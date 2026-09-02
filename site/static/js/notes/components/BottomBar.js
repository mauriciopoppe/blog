/**
 * Bottom Floating Status Bar component for Topic Constellation Graph
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html } from '../../ui/preact.js'

export function BottomBar({ matchingCount, totalCount, onResetZoom }) {
  return html`
    <footer
      class="tw-absolute tw-left-3 tw-right-3 sm:tw-left-4 sm:tw-right-4 tw-pointer-events-none tw-flex tw-flex-nowrap tw-items-center tw-justify-between tw-gap-2 tw-text-xs tw-text-[var(--grey-light)] tw-z-20 tw-font-sans tw-whitespace-nowrap"
      style="bottom: max(1rem, calc(env(safe-area-inset-bottom, 0px) + 0.75rem));"
    >
      <!-- Passive Label: Zero border, zero shadow, compact on mobile -->
      <div class="tw-pointer-events-none tw-flex tw-flex-nowrap tw-items-center tw-gap-1.5 tw-text-xs tw-text-[var(--grey-light)] tw-font-sans tw-whitespace-nowrap tw-shrink-0">
        <span class="tw-text-primary tw-font-bold">✦ <span class="tw-hidden sm:tw-inline">Topic </span>Constellation</span>
        <span class="tw-opacity-60">• ${matchingCount}/${totalCount}<span class="tw-hidden sm:tw-inline"> notes</span></span>
      </div>

      <!-- Right: Actionable Reset Button + Passive Hint -->
      <div class="tw-pointer-events-auto tw-flex tw-flex-nowrap tw-items-center tw-gap-3 tw-shrink-0">
        <button
          id="graph-reset-zoom"
          onClick=${onResetZoom}
          class="tw-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-1.5 tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised hover:tw-text-primary tw-transition tw-font-sans tw-text-xs tw-cursor-pointer tw-whitespace-nowrap"
          title="Reset camera view"
        >
          <span class="material-symbols-outlined" style="font-size: 15px">center_focus_strong</span>
          <span class="tw-font-medium sm:tw-hidden">Reset</span>
          <span class="tw-font-medium tw-hidden sm:tw-inline">Reset View</span>
        </button>
        <!-- Passive Hint: Visible on desktop only -->
        <div class="tw-hidden md:tw-block tw-text-xs tw-text-[var(--grey-light)] tw-opacity-60 tw-font-sans">
          Scroll to zoom • Drag to explore • Click to open
        </div>
      </div>
    </footer>
  `
}
