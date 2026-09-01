import { html } from './preact.js'
import { UI } from './tokens.js'

export function SegmentedGroup({ options = [], value, onChange, className = '' }) {
  return html`
    <div class="${UI.segmented.group} ${className}" role="radiogroup">
      ${options.map((opt) => {
        const isSelected = opt.value === value
        const activeClass = opt.activeClass || UI.segmented.itemActive
        return html`
          <button
            key=${opt.value}
            type="button"
            role="radio"
            aria-checked=${isSelected}
            class=${isSelected ? activeClass : UI.segmented.itemInactive}
            onClick=${() => onChange && onChange(opt.value)}>
            ${opt.label}
          </button>
        `
      })}
    </div>
  `
}
