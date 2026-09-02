/**
 * Top Navigation & Category Filter Bar component for Topic Constellation Graph
 *
 * Restores original pill styling, colored cluster dots, and clear-filter affordances
 * for both preset category filters (?filter=...) and dynamic tag filters (?tag=...).
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html } from '../../ui/preact.js'

const PRESET_FILTERS = [
  { key: 'all', label: 'All', dot: null, className: '' },
  { key: 'graphics', label: 'Graphics', dot: '#a855f7', className: '' },
  { key: 'systems', label: 'Systems', dot: '#ff7043', className: '' },
  { key: 'math', label: 'Math & Graphs', dot: '#38bdf8', className: '' },
  { key: 'ai', label: 'AI & Code', dot: '#34d399', className: '' },
  { key: 'music', label: 'Music & Life', dot: '#fbbf24', className: '' },
  { key: 'languages', label: 'Languages', dot: '#818cf8', className: '' },
  { key: 'interactive', label: '✦ Interactive', dot: null, className: 'tw-text-primary' },
  { key: 'favorites', label: '★ Favorites', dot: null, className: 'tw-text-amber-400' }
]

export function TopFilterBar({ activeFilter, onSelectFilter }) {
  const isDynamicTag = activeFilter && activeFilter.startsWith('tag:')
  const dynamicTagLabel = isDynamicTag ? activeFilter.slice(4) : ''

  const toggleTheme = (nextTheme) => {
    document.documentElement.setAttribute('data-theme', nextTheme)
    try {
      localStorage.setItem('theme', nextTheme)
    } catch (_) {}
  }

  return html`
    <!-- Scoped style block restoring exact pill styling and interaction feedback -->
    <style>
      .graph-pill-btn {
        padding: 0.25rem 0.65rem;
        border-radius: 9999px;
        font-size: 0.74rem;
        font-family: var(--family-sans, system-ui, sans-serif);
        font-weight: 500;
        color: var(--grey-light);
        background: transparent;
        border: 1px solid transparent;
        cursor: pointer;
        transition: all 0.15s ease;
        white-space: nowrap;
        display: inline-flex;
        align-items: center;
      }
      .graph-pill-btn:hover {
        background: rgba(255, 255, 255, 0.08);
        color: var(--grey-lighter);
      }
      .graph-pill-btn.is-active {
        background: rgba(var(--primary), 0.18);
        border-color: rgb(var(--primary));
        color: rgb(var(--primary));
        font-weight: 600;
      }
    </style>

    <header class="tw-absolute tw-top-4 tw-left-4 tw-right-4 tw-pointer-events-none tw-flex tw-items-center tw-justify-between tw-z-30">
      <!-- Left: Home Button (Clickable -> border, subtle shadow, icon + text) -->
      <div class="tw-pointer-events-auto tw-flex tw-items-center tw-gap-2">
        <a
          href="/"
          class="tw-flex tw-items-center tw-gap-1.5 tw-px-3.5 tw-py-2 tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised hover:tw-text-primary tw-text-xs tw-font-serif tw-transition tw-text-[var(--grey-light)]"
          title="Back to Home"
        >
          <span class="material-symbols-outlined" style="font-size: 16px">home</span>
          <span class="tw-font-medium">Home</span>
        </a>
      </div>

      <!-- Center: Category Filter Pills with colored dots and active clear ✕ button -->
      <div
        id="graph-filters"
        class="tw-pointer-events-auto tw-flex tw-flex-wrap tw-items-center tw-gap-1.5 tw-p-1 tw-rounded-full tw-bg-[var(--grey-dark)]/85 tw-backdrop-blur-md tw-border tw-border-[var(--ring-border)] tw-max-w-[75vw] tw-overflow-x-auto"
      >
        ${PRESET_FILTERS.map((f) => {
          const isActive = activeFilter === f.key
          return html`
            <button
              key=${f.key}
              onClick=${() => onSelectFilter(isActive && f.key !== 'all' ? 'all' : f.key)}
              class="graph-pill-btn ${f.className} ${isActive ? 'is-active' : ''}"
              title=${isActive && f.key !== 'all' ? 'Click to clear filter' : f.label}
            >
              ${f.dot
                ? html`<span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-mr-1.5" style="background: ${f.dot}"></span>`
                : null}
              <span>${f.label}</span>
              ${isActive && f.key !== 'all'
                ? html`<span class="tw-ml-1.5 tw-opacity-60 hover:tw-opacity-100">✕</span>`
                : null}
            </button>
          `
        })}

        ${isDynamicTag
          ? html`
              <button
                key="dynamic-tag"
                id="dynamic-tag-filter"
                onClick=${(e) => {
                  e.stopPropagation()
                  onSelectFilter('all')
                }}
                class="graph-pill-btn is-active tw-text-primary"
                title="Click to clear filter"
              >
                <span>#${dynamicTagLabel}</span>
                <span class="tw-ml-1.5 tw-opacity-60 hover:tw-opacity-100">✕</span>
              </button>
            `
          : null}
      </div>

      <!-- Right: Theme Toggle -->
      <div class="tw-pointer-events-auto tw-flex tw-items-center tw-gap-2">
        <button
          onClick=${() => toggleTheme('dark')}
          class="theme-toggle tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised tw-transition tw-hidden light:tw-flex"
          data-nexttheme="dark"
          title="Dark theme"
        >
          <span class="material-symbols-outlined light:tw-text-zinc-800" style="font-size: 18px">dark_mode</span>
        </button>
        <button
          onClick=${() => toggleTheme('light')}
          class="theme-toggle tw-flex tw-h-10 tw-w-10 tw-items-center tw-justify-center tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised tw-transition light:tw-hidden"
          data-nexttheme="light"
          title="Light theme"
        >
          <span class="material-symbols-outlined dark:tw-text-zinc-200" style="font-size: 18px">light_mode</span>
        </button>
      </div>
    </header>
  `
}
