import { html } from './preact.js'
import { UI } from './tokens.js'

export function MetricCard({ label, value, caption, valueColor = '', className = '' }) {
  return html`
    <div class="${UI.card.passive} tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center ${className}">
      <div class="tw-text-[0.75rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">${label}</div>
      <div class="tw-font-sans tw-text-[1rem] tw-font-semibold ${valueColor || 'tw-text-[var(--grey-lighter)]'}">${value}</div>
      ${caption ? html`<div class="tw-text-[0.65rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">${caption}</div>` : null}
    </div>
  `
}
