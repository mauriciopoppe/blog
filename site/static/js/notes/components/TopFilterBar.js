/**
 * Top Navigation & Category Filter Bar component for Topic Constellation Graph
 *
 * Restores single-line layout using compact labels, flex-nowrap with invisible
 * horizontal scrolling on narrow viewports, and clean responsive pill metrics.
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

import { html, useRef, useEffect } from '../../ui/preact.js'

const PRESET_FILTERS = [
  { key: 'all', label: 'All', dot: null, className: '' },
  { key: 'graphics', label: 'Graphics', dot: '#a855f7', className: '' },
  { key: 'systems', label: 'Systems', dot: '#ff7043', className: '' },
  { key: 'math', label: 'Math', dot: '#38bdf8', className: '' },
  { key: 'life', label: 'Life', dot: '#fbbf24', className: '' },
  { key: 'interactive', label: '✦ Interactive', dot: null, className: 'tw-text-primary' },
  { key: 'favorites', label: '★ Favorites', dot: null, className: 'tw-text-amber-400' }
]

export function TopFilterBar({
  activeFilter,
  onSelectFilter,
  searchQuery = '',
  onSearchChange,
  onSearchSubmit,
  onSearchClose,
  isSearchOpen = false,
  setIsSearchOpen
}) {
  const isDynamicTag = activeFilter && activeFilter.startsWith('tag:')
  const dynamicTagLabel = isDynamicTag ? activeFilter.slice(4) : ''
  const searchInputRef = useRef(null)

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      if (onSearchClose) onSearchClose()
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (onSearchSubmit) onSearchSubmit()
    }
  }

  const toggleTheme = (nextTheme) => {
    document.documentElement.setAttribute('data-theme', nextTheme)
    try {
      localStorage.setItem('theme', nextTheme)
    } catch (_) {}
  }

  return html`
    <!-- Scoped style block enforcing single-line layout and custom scrollbar hiding -->
    <style>
      .graph-pill-btn {
        padding: 0.2rem 0.55rem;
        border-radius: 9999px;
        font-size: 0.72rem;
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
        flex-shrink: 0;
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
      #graph-filters::-webkit-scrollbar {
        display: none;
      }
      #graph-filters {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    </style>

    <header class="tw-absolute tw-top-4 tw-left-4 tw-right-4 tw-pointer-events-none tw-flex tw-items-center tw-justify-between tw-z-30">
      <!-- Left: Home Button (Compact on mobile, text on desktop) -->
      <div class="tw-pointer-events-auto tw-flex tw-items-center tw-gap-2 tw-shrink-0">
        <a
          href="/"
          class="tw-flex tw-items-center tw-gap-1.5 tw-px-3 tw-py-2 tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-shadow-raised hover:tw-text-primary tw-text-xs tw-font-sans tw-transition tw-text-[var(--grey-light)]"
          title="Back to Home"
        >
          <span class="material-symbols-outlined" style="font-size: 16px">home</span>
          <span class="tw-font-medium tw-hidden md:tw-inline">Home</span>
        </a>
      </div>

      <!-- Center: Category Filter Pills strictly in a SINGLE ROW (flex-nowrap, zero wrapping) -->
      <div
        id="graph-filters"
        class="tw-pointer-events-auto tw-flex tw-flex-nowrap tw-items-center tw-gap-1 tw-p-1 tw-rounded-full tw-bg-[var(--grey-dark)]/85 tw-backdrop-blur-md tw-border tw-border-[var(--ring-border)] tw-max-w-[75vw] tw-overflow-x-auto"
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
                ? html`<span class="tw-inline-block tw-w-2 tw-h-2 tw-rounded-full tw-mr-1" style="background: ${f.dot}"></span>`
                : null}
              <span>${f.label}</span>
              ${isActive && f.key !== 'all'
                ? html`<span class="tw-ml-1 tw-opacity-60 hover:tw-opacity-100">✕</span>`
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
                <span class="tw-ml-1 tw-opacity-60 hover:tw-opacity-100">✕</span>
              </button>
            `
          : null}

        <!-- Divider before Search -->
        <div class="tw-w-[1px] tw-h-3.5 tw-bg-white/15 tw-mx-0.5 tw-shrink-0"></div>

        <!-- Search Pill or Expanded Input -->
        ${isSearchOpen
          ? html`
              <div
                class="tw-flex tw-flex-nowrap tw-items-center tw-gap-1.5 tw-bg-white/10 tw-border tw-border-primary/40 tw-rounded-full tw-px-2.5 tw-py-0.5 tw-transition-all tw-duration-200 tw-shrink-0"
              >
                <span class="material-symbols-outlined tw-text-primary tw-shrink-0" style="font-size: 13.5px">search</span>
                <input
                  ref=${searchInputRef}
                  id="notes-search-input"
                  type="text"
                  value=${searchQuery || ''}
                  onInput=${(e) => onSearchChange(e.target.value)}
                  onKeyDown=${handleSearchKeyDown}
                  placeholder="Search title, tag, or summary..."
                  class="tw-bg-transparent tw-border-none tw-outline-none tw-text-xs tw-text-[var(--grey-lighter)] placeholder:tw-text-[var(--grey-light)]/50 tw-w-36 sm:tw-w-52 md:tw-w-60 tw-font-sans"
                />
                ${searchQuery
                  ? html`
                      <button
                        onClick=${() => onSearchChange('')}
                        class="tw-text-[var(--grey-light)] hover:tw-text-white tw-text-xs tw-p-0.5 tw-cursor-pointer"
                        title="Clear input"
                      >
                        ✕
                      </button>
                    `
                  : null}
                <button
                  onClick=${onSearchClose}
                  class="tw-text-[10px] tw-text-[var(--grey-light)] hover:tw-text-primary tw-border tw-border-white/10 tw-rounded tw-px-1 tw-font-mono tw-opacity-80 tw-cursor-pointer"
                  title="Close search (Esc)"
                >
                  Esc
                </button>
              </div>
            `
          : html`
              <button
                id="graph-search-btn"
                onClick=${() => setIsSearchOpen(true)}
                class="graph-pill-btn tw-text-[var(--grey-light)] hover:tw-text-primary tw-gap-1.5"
                title="Search notes (⌘K or /)"
              >
                <span class="material-symbols-outlined" style="font-size: 13.5px">search</span>
                <span>Search</span>
                <kbd class="tw-hidden sm:tw-inline-block tw-text-[10px] tw-px-1 tw-py-0.2 tw-rounded tw-bg-white/10 tw-border tw-border-white/10 tw-font-mono tw-opacity-70">⌘K</kbd>
              </button>
            `}
      </div>

      <!-- Right: Theme Toggle -->
      <div class="tw-pointer-events-auto tw-flex tw-items-center tw-gap-2 tw-shrink-0">
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
