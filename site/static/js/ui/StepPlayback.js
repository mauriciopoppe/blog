import { html } from './preact.js'
import { UI } from './tokens.js'

export function StepPlayback({
  currentStep = 0,
  totalSteps = 1,
  isPlaying = false,
  playLabel = 'Play',
  showReset = true,
  zeroIsOrigin = false,
  onReset,
  onStepBack,
  onStepForward,
  onTogglePlay,
  className = ''
}) {
  const minStep = zeroIsOrigin ? -1 : 0
  const isAtStart = currentStep <= minStep
  const isAtEnd = currentStep >= totalSteps - 1

  return html`
    <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-gap-1.5 tw-items-stretch ${className}">
      ${showReset ? html`
        <button
          type="button"
          class=${UI.btn.ctrl}
          title="Reset to Start"
          disabled=${isAtStart}
          onClick=${onReset}>
          ↺
        </button>
      ` : null}
      <button
        type="button"
        class=${UI.btn.ctrl}
        title="Step Back"
        disabled=${isAtStart}
        onClick=${onStepBack}>
        ⏮
      </button>
      <button
        type="button"
        class=${isPlaying ? UI.btn.playActive : UI.btn.playNeutral}
        onClick=${() => onTogglePlay && onTogglePlay(!isPlaying)}>
        <span>${isPlaying ? '⏸ Pause' : (isAtEnd ? '↺ Replay' : `▶ ${playLabel}`)}</span>
      </button>
      <button
        type="button"
        class=${UI.btn.ctrl}
        title="Step Forward"
        disabled=${isAtEnd}
        onClick=${onStepForward}>
        ⏭
      </button>
    </div>
  `
}
