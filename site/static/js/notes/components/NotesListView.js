/**
 * Accessible Scannable List View component for /notes/?view=list
 *
 * Renders the currently filtered notes as semantic <article> cards with
 * direct links, summaries (with KaTeX rendering), badges, and clickable tags.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html, useEffect, useRef } from '../../ui/preact.js'

export function NotesListView({ nodes = [], activeFilter = 'all', onSelectFilter }) {
  const listRef = useRef(null)

  // Typeset KaTeX formulas in summaries after initial paint to avoid toggle lag
  useEffect(() => {
    if (!listRef.current || typeof window === 'undefined' || typeof window.renderMathInElement !== 'function') return
    const frameId = window.requestAnimationFrame(() => {
      if (!listRef.current) return
      window.renderMathInElement(listRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false,
        ignoredClasses: ['tex2jax_ignore']
      })
    })
    return () => window.cancelAnimationFrame(frameId)
  }, [nodes])

  return html`
    <main
      ref=${listRef}
      id="notes-list-view"
      aria-label="Notes list"
      class="tw-absolute tw-inset-0 tw-overflow-y-auto tw-pt-20 tw-pb-20 tw-px-4 sm:tw-px-6 tw-z-10"
    >
      <div class="tw-max-w-3xl tw-mx-auto tw-flex tw-flex-col tw-gap-3">
        <h1 class="tw-sr-only">Notes</h1>

        ${nodes.length === 0
          ? html`
              <div class="tw-rounded-xl tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-p-8 tw-text-center tw-font-sans">
                <p class="tw-text-[var(--grey-light)] tw-text-sm tw-m-0 tw-mb-4">
                  No notes match the current filter.
                </p>
                <button
                  onClick=${() => onSelectFilter && onSelectFilter('all')}
                  class="tw-inline-flex tw-items-center tw-gap-1.5 tw-px-3.5 tw-py-1.5 tw-rounded-full tw-bg-primary-soft tw-border tw-border-primary tw-text-primary tw-text-xs tw-font-semibold tw-cursor-pointer hover:tw-shadow-raised tw-transition"
                >
                  Clear filter
                </button>
              </div>
            `
          : nodes.map((node) => {
              const tags = Array.isArray(node.tags) ? node.tags : []
              return html`
                <article
                  key=${node.id || node.url}
                  class="tw-rounded-xl tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-p-4 sm:tw-p-5 tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised tw-transition-all"
                >
                  <div class="tw-flex tw-flex-col tw-gap-2">
                    <!-- Row 1: Title link + Date & Reading time -->
                    <div class="tw-flex tw-flex-wrap tw-items-baseline tw-justify-between tw-gap-x-3 tw-gap-y-1">
                      <h2 class="tw-font-bold tw-text-base sm:tw-text-lg tw-leading-snug tw-m-0">
                        <a
                          href=${node.url}
                          class="tw-text-primary hover:tw-underline tw-no-underline"
                        >
                          ${node.title}
                        </a>
                      </h2>
                      <div class="tw-flex tw-items-center tw-gap-2 tw-text-xs tw-text-[var(--grey-light)] tw-opacity-75 tw-font-serif tw-whitespace-nowrap">
                        ${node.date ? html`<span>${node.date}</span>` : null}
                        ${node.date && node.readingTime ? html`<span>•</span>` : null}
                        ${node.readingTime ? html`<span>${node.readingTime} min read</span>` : null}
                      </div>
                    </div>

                    <!-- Row 2: Summary -->
                    ${node.summary
                      ? html`
                          <div
                            class="tw-text-sm sm:tw-text-[15px] tw-text-[var(--grey-lighter)] tw-leading-relaxed tw-m-0 [&>p]:tw-m-0 [&>p]:tw-inline [&_strong]:tw-text-primary [&_strong]:tw-font-semibold [&_code]:tw-bg-white/10 [&_code]:tw-px-1.5 [&_code]:tw-py-0.5 [&_code]:tw-rounded [&_code]:tw-text-primary [&_code]:tw-font-mono [&_code]:tw-text-[12.5px]"
                            dangerouslySetInnerHTML=${{ __html: node.summary }}
                          />
                        `
                      : null}

                    <!-- Row 3: Badges + Clickable Tags -->
                    <div class="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-x-3 tw-gap-y-1.5 tw-pt-2 tw-border-t tw-border-[var(--ring-border)]">
                      <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-x-2.5 tw-gap-y-1">
                        ${node.isFavorite
                          ? html`
                              <span class="tw-inline-flex tw-items-center tw-gap-1 tw-text-amber-400 tw-font-medium tw-text-xs">
                                <span class="material-symbols-outlined" style="font-size: 13.5px">star</span>
                                Favorite
                              </span>
                            `
                          : null}
                        ${node.interactive
                          ? html`
                              <span class="tw-inline-flex tw-items-center tw-gap-1 tw-text-primary tw-font-medium tw-text-xs">
                                ✦ Interactive
                              </span>
                            `
                          : null}
                        ${node.isDraft
                          ? html`
                              <span class="tw-inline-flex tw-items-center tw-gap-1 tw-text-amber-400 tw-font-medium tw-text-xs">
                                Draft
                              </span>
                            `
                          : null}
                        ${node.series
                          ? html`
                              <a
                                href=${node.seriesUrl || '#'}
                                class="tw-inline-flex tw-items-center tw-gap-1 tw-text-primary tw-font-medium tw-text-xs tw-border tw-border-primary/30 tw-rounded-full tw-px-2 tw-py-0.5 hover:tw-bg-primary-soft tw-no-underline tw-transition"
                              >
                                <span class="material-symbols-outlined" style="font-size: 13.5px">route</span>
                                ${node.series}
                              </a>
                            `
                          : null}
                      </div>

                      <div class="tw-flex tw-flex-wrap tw-items-center tw-gap-1.5">
                        ${tags.map(
                          (t) => html`
                            <button
                              key=${t}
                              onClick=${() => onSelectFilter && onSelectFilter(`tag:${String(t).toLowerCase()}`)}
                              class="tw-text-xs tw-text-[var(--grey-light)] tw-opacity-80 hover:tw-opacity-100 hover:tw-text-primary tw-bg-transparent tw-border-0 tw-p-0 tw-font-serif tw-cursor-pointer tw-transition"
                              title="Filter by #${t}"
                            >
                              #${t}
                            </button>
                          `
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              `
            })}
      </div>
    </main>
  `
}
