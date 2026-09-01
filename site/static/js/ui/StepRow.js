import { html } from './preact.js'

function renderMath(tex, isDisplay = false) {
  if (typeof window !== 'undefined' && window.katex && typeof window.katex.renderToString === 'function') {
    try {
      return window.katex.renderToString(tex, { displayMode: isDisplay, throwOnError: false })
    } catch {
      return tex
    }
  }
  return tex
}

function renderTextWithMath(str) {
  if (!str) return ''
  return str.replace(/\$([^\$]+)\$/g, (_, math) => renderMath(math))
}

export function StepRow({
  stepNumber = 1,
  title = '',
  description = '',
  symbol = '',
  isCompleted = false,
  isActive = false,
  isAnimating = false,
  className = ''
}) {
  const rowClass = `tw-flex tw-items-center tw-justify-between tw-gap-2 tw-px-2 tw-py-1 tw-rounded-[5px] tw-border tw-transition-colors ${
    isActive
      ? 'tw-bg-primary-soft tw-border-[var(--accent-border)]'
      : isCompleted
      ? 'tw-bg-[var(--grey-dark)] tw-border-transparent tw-opacity-55'
      : 'tw-bg-[var(--grey-dark)] tw-border-transparent'
  } ${className}`

  const badgeClass = `tw-w-[17px] tw-h-[17px] tw-rounded-full tw-text-[9.5px] tw-font-semibold tw-flex tw-items-center tw-justify-center tw-flex-shrink-0 tw-font-sans ${
    isActive
      ? 'tw-bg-primary tw-text-white'
      : isCompleted
      ? 'tw-bg-emerald-600 tw-text-white'
      : 'tw-bg-[var(--grey-darker)] tw-text-[var(--grey-light)]'
  }`

  return html`
    <div class=${rowClass}>
      <div class="tw-flex tw-items-center tw-gap-1.5 tw-flex-1 tw-min-w-0">
        <div class=${badgeClass}>
          ${isCompleted
            ? '✓'
            : isActive && isAnimating
            ? html`<span class="tw-inline-block tw-w-2 tw-h-2 tw-border-[1.5px] tw-border-white/30 tw-border-t-white tw-rounded-full tw-animate-spin"></span>`
            : stepNumber}
        </div>
        <div class="tw-flex tw-flex-col tw-min-w-0 tw-gap-0.5">
          <span class="tw-font-sans tw-text-[0.6875rem] tw-font-semibold tw-leading-tight tw-text-[var(--grey-lighter)]">
            <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath(title) }} />
          </span>
          ${description ? html`
            <span class="tw-font-serif tw-text-[0.72rem] tw-leading-tight tw-text-[var(--grey-light)]">
              <span dangerouslySetInnerHTML=${{ __html: renderTextWithMath(description) }} />
            </span>
          ` : null}
        </div>
      </div>
      ${symbol ? html`
        <div
          class="step-symbol tw-font-serif tw-text-sm tw-leading-none tw-font-semibold tw-text-primary tw-flex-shrink-0"
          dangerouslySetInnerHTML=${{ __html: renderMath(symbol) }} />
      ` : null}
    </div>
  `
}

