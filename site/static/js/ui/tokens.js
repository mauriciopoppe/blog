/**
 * UI Component Tokens & Class Utilities
 *
 * Centralized repository of standard Tailwind class strings for interactive widgets,
 * 3D explorers, and simulators. Conforms strictly to the UX Interaction Principles:
 * - Affordance in the resting state (distinct ring border + elevation)
 * - Hover state highlights (primary background tint, accent border, raised elevation without positional displacement)
 * - Active / Selected states (primary-soft surface + primary accent)
 * - Accessible disabled states (reduced opacity, no shadow/glow, neutral hover)
 *
 * Usage in any interactive ES6 script:
 * ```javascript
 * import { UI } from '../ui/tokens.js'
 *
 * const btn = `<button class="${UI.btn.base}">Click me</button>`
 * const group = `
 *   <div class="${UI.segmented.group}">
 *     <button class="${UI.segmented.itemActive}">Option 1</button>
 *     <button class="${UI.segmented.itemInactive}">Option 2</button>
 *   </div>
 * `
 * ```
 *
 * Copyright (c) 2026 Mauricio Poppe
 * Licensed under the MIT license.
 */

export const UI = {
  // Buttons
  btn: {
    // Standard interactive button (resting raised elevation, hover primary accent)
    base: 'tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-px-2.5 tw-py-1.5 tw-rounded-md tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-shadow-subtle tw-cursor-pointer tw-transition-all hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)]',

    // Fixed-size step / control buttons (prev, next, reset)
    ctrl: 'tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)] disabled:hover:tw-filter-none tw-transition-all',

    // Flexible play/action button (neutral at rest)
    playNeutral: 'tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised tw-transition-all',

    // Active playing state
    playActive: 'tw-flex-1 tw-bg-primary-soft tw-border tw-border-primary-border tw-text-primary tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-bg-primary-soft hover:tw-border-primary hover:tw-shadow-raised tw-transition-all',

    // Compact mini button (for overlays and popups)
    mini: 'tw-bg-[var(--grey-dark)]/80 tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-rounded-md tw-px-1.5 tw-py-0.5 tw-font-semibold tw-cursor-pointer tw-leading-none tw-shadow-subtle hover:tw-bg-primary-soft hover:tw-border-primary hover:tw-text-primary hover:tw-shadow-raised tw-transition-all tw-flex tw-items-center tw-justify-center tw-gap-0.5'
  },

  // Segmented single-select radio groups
  segmented: {
    // Outer flex wrapper
    group: 'tw-flex tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden',

    // Shared base classes for items
    itemBase: 'tw-flex-1 tw-text-center tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-px-3 tw-py-2 tw-leading-none tw-cursor-pointer tw-transition-colors',

    // Inactive item (neutral transparent at rest, text color highlight on hover without background change)
    itemInactive: 'tw-flex-1 tw-text-center tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-px-3 tw-py-2 tw-leading-none tw-cursor-pointer tw-transition-colors tw-bg-transparent tw-text-[var(--grey-light)] hover:tw-text-primary',

    // Active/Selected item (tinted background and primary coral text)
    itemActive: 'tw-flex-1 tw-text-center tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-px-3 tw-py-2 tw-leading-none tw-cursor-pointer tw-transition-colors tw-bg-primary-soft tw-text-primary'
  },

  // Card & Container Surfaces
  card: {
    // Outer widget frame
    widgetFrame: 'tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden tw-font-sans',

    // Header strip
    header: 'tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]',

    // Interactive clickable card (resting elevation, raises more on hover)
    interactive: 'tw-rounded-lg tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-cursor-pointer tw-shadow-raised hover:tw-border-primary hover:tw-bg-primary-soft hover:tw-shadow-deep tw-transition-all',

    // Passive flat card (borderless, default cursor)
    passive: 'tw-rounded-lg tw-bg-[var(--grey-dark)] tw-border-0',

    // Inset callout / description box
    inset: 'tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-text-[0.8125rem] tw-leading-snug tw-text-[var(--grey-light)]'
  },

  // Tags & Pills
  pill: {
    neutral: 'tw-inline-block tw-px-3 tw-py-1 tw-rounded-full tw-font-serif tw-text-[0.72rem] tw-font-semibold tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--grey-dark)] tw-text-[var(--grey-light)]',
    interactive: 'tw-inline-block tw-px-3 tw-py-1 tw-rounded-full tw-font-serif tw-text-[0.72rem] tw-font-semibold tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-shadow-subtle tw-cursor-pointer hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised tw-transition-all',
    active: 'tw-inline-block tw-px-3 tw-py-1 tw-rounded-full tw-font-serif tw-text-[0.72rem] tw-font-semibold tw-bg-primary-soft tw-border tw-border-primary tw-text-primary tw-shadow-subtle'
  }
}
