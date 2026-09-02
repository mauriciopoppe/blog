/**
 * Floating Passive Note Preview Card component for Topic Constellation Graph
 *
 * Typesets KaTeX LaTeX math dynamically on node changes, enforces baseline
 * alignment on Row 1, comfortable 15.5px summary typography on Row 2,
 * and tight multi-line wrapping for badges and tags on Row 3.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html, useEffect, useRef } from '../../ui/preact.js'

export function NoteTooltip({ node, pos }) {
  const cardRef = useRef(null)

  // Typeset KaTeX formulas dynamically when hovered node changes
  useEffect(() => {
    if (node && cardRef.current && typeof window !== 'undefined' && typeof window.renderMathInElement === 'function') {
      window.renderMathInElement(cardRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        ignoredClasses: ['tex2jax_ignore']
      })
    }
  }, [node])

  if (!node || !pos) {
    return html`
      <div
        class="tw-absolute tw-pointer-events-none tw-opacity-0 tw-transition-opacity tw-duration-150 tw-z-40"
      ></div>
    `
  }

  // Calculate clamped viewport position
  // Calculate clamped viewport position
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const tooltipWidth = Math.min(440, Math.max(280, viewportWidth - 24))
  const tooltipHeight = 220

  let left = pos.x + 20
  let top = pos.y + 20

  if (left + tooltipWidth > viewportWidth) {
    left = pos.x - tooltipWidth - 20
  }
  if (top + tooltipHeight > viewportHeight) {
    top = pos.y - tooltipHeight - 20
  }

  const safeLeft = Math.max(12, Math.min(viewportWidth - tooltipWidth - 12, left))
  const safeTop = Math.max(12, Math.min(viewportHeight - tooltipHeight - 12, top))

  const tags = Array.isArray(node.tags) ? node.tags.slice(0, 4) : []

  return html`
    <div
      ref=${cardRef}
      id="notes-graph-tooltip"
      class="tw-absolute tw-pointer-events-none tw-opacity-100 tw-transition-opacity tw-duration-150 tw-z-40 tw-bg-[var(--grey-dark)]/95 tw-backdrop-blur-xl tw-border tw-border-[var(--ring-border)] tw-shadow-raised tw-rounded-xl tw-p-4 sm:tw-p-5 tw-max-w-[calc(100vw-24px)] md:tw-max-w-[480px]"
      style="left: ${safeLeft}px; top: ${safeTop}px;"
    >
      <div class="tw-flex tw-flex-col tw-gap-2.5">
        <!-- Row 1: Title on the left, Reading time on the right (aligned on font baseline) -->
        <div class="tw-flex tw-items-baseline tw-justify-between tw-gap-3">
          <h3 class="tw-font-bold tw-text-base md:tw-text-lg tw-text-primary tw-leading-snug tw-m-0 tw-flex-1">
            ${node.title}
          </h3>
          <span class="tw-text-xs tw-text-[var(--grey-light)] tw-font-serif tw-opacity-70 tw-whitespace-nowrap">
            ${node.readingTime} min read
          </span>
        </div>

        <!-- Row 2: Note summary with clear readable body font (15.5px) -->
        <div
          class="tw-text-[15.5px] tw-text-[var(--grey-lighter)] tw-line-clamp-4 tw-leading-relaxed tw-m-0 [&>p]:tw-m-0 [&>p]:tw-inline [&>p]:tw-text-[15.5px] [&_strong]:tw-text-primary [&_strong]:tw-font-semibold [&_em]:tw-text-white/95 [&_code]:tw-bg-white/10 [&_code]:tw-px-1.5 [&_code]:tw-py-0.5 [&_code]:tw-rounded [&_code]:tw-text-primary [&_code]:tw-font-mono [&_code]:tw-text-[13px]"
          style="font-size: 15.5px; line-height: 1.6;"
          dangerouslySetInnerHTML=${{ __html: node.summary }}
        />

        <!-- Row 3: Favorite & Interactive badges + Compact tags at bottom (12px, tight line-height) -->
        <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-x-3 tw-gap-y-1 tw-pt-2 tw-border-t tw-border-[var(--ring-border)] tw-leading-tight">
          <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-x-2.5 tw-gap-y-1 tw-leading-tight">
            ${node.isFavorite
              ? html`
                  <span class="tw-inline-flex tw-items-center tw-gap-1 tw-text-amber-400 tw-font-medium tw-text-xs tw-leading-tight">
                    <span class="material-symbols-outlined" style="font-size: 13.5px">star</span>
                    Favorite
                  </span>
                `
              : null}
            ${node.interactive
              ? html`
                  <span class="tw-inline-flex tw-items-center tw-gap-1 tw-text-primary tw-font-medium tw-text-xs tw-leading-tight">
                    ✦ Interactive
                  </span>
                `
              : null}
          </div>

          <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-x-2 tw-gap-y-1 tw-leading-tight">
            ${tags.map(
              (t) => html`
                <span class="tw-text-xs tw-leading-tight tw-text-[var(--grey-light)] tw-opacity-70 tw-font-serif">
                  #${t}
                </span>
              `
            )}
          </div>
        </div>
      </div>
    </div>
  `
}
