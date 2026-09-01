import { html } from './preact.js'
import { UI } from './tokens.js'

export function WidgetFrame({ title, descriptor, children, className = '' }) {
  return html`
    <div class="widget-frame ${UI.card.widgetFrame} ${className}">
      <style>
        .widget-frame .ux-range {
          -webkit-appearance: none;
          appearance: none;
          height: 28px;
          background: transparent;
          cursor: pointer;
          --range-fill: 50%;
        }
        .widget-frame .ux-range::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 999px;
          background: linear-gradient(to right, rgb(var(--primary)) 0%, rgb(var(--primary)) var(--range-fill), var(--ring-border) var(--range-fill), var(--ring-border) 100%);
        }
        .widget-frame .ux-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgb(var(--primary));
          border: 2px solid var(--grey);
          margin-top: -5px;
          box-shadow: var(--elevation-subtle);
        }
        .widget-frame .ux-range::-moz-range-track {
          height: 8px;
          border-radius: 999px;
          background: var(--ring-border);
        }
        .widget-frame .ux-range::-moz-range-progress {
          height: 8px;
          border-radius: 999px;
          background: rgb(var(--primary));
        }
        .widget-frame .ux-range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgb(var(--primary));
          border: 2px solid var(--grey);
          box-shadow: var(--elevation-subtle);
        }
        .widget-frame .ux-range:hover::-webkit-slider-thumb {
          box-shadow: 0 0 0 4px rgba(var(--primary), 0.15);
        }
        .widget-frame .ux-range:hover::-moz-range-thumb {
          box-shadow: 0 0 0 4px rgba(var(--primary), 0.15);
        }
        .widget-frame .ux-range:focus-visible {
          outline: 2px solid rgba(var(--primary), 0.6);
          outline-offset: 2px;
          border-radius: 999px;
        }
        .widget-frame .katex {
          font-size: 0.88em !important;
        }
      </style>
      <header class=${UI.card.header}>
        <div class="tw-font-sans tw-text-sm tw-font-semibold tw-leading-tight tw-text-primary">${title}</div>
        ${descriptor ? html`<div class="tw-font-serif tw-text-xs tw-leading-tight tw-text-[var(--grey-light)]">${descriptor}</div>` : null}
      </header>
      ${children}
    </div>
  `
}

