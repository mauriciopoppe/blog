/**
 * StepPlaybackControl Component
 *
 * A reusable playback and step navigation bar conforming to the UX Interaction Principles.
 * Provides Reset (↺), Step Back (⏮), Play/Pause/Replay (▶/⏸/↺), and Step Forward (⏭).
 *
 * Enforces UX rules:
 * - Step Back & Reset disabled when at initial/start step.
 * - Step Forward disabled when at final/completed step.
 * - Disabled states omit hover box-shadow, cursor pointer, and hover tints.
 * - Active play state applies primary-soft surface and primary accent border.
 */

export const CTRL_BTN_CLASS = 'tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-shadow-none disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)] disabled:hover:tw-filter-none tw-transition'

export const PLAY_NEUTRAL_CLASS = 'tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-shadow-none disabled:hover:tw-border-[var(--ring-border)] disabled:hover:tw-text-[var(--grey-light)] disabled:hover:tw-bg-[var(--grey-dark)] disabled:hover:tw-filter-none tw-transition'

export const PLAY_ACTIVE_CLASS = 'tw-flex-1 tw-bg-primary-soft tw-border tw-border-primary-border tw-text-primary tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 tw-whitespace-nowrap hover:tw-bg-primary-soft hover:tw-border-primary hover:tw-shadow-raised tw-transition'

/**
 * Returns HTML string template for the control bar.
 */
export function renderStepPlaybackControlHTML({
  idPrefix = 'step-ctrl',
  showReset = true,
  playLabel = 'Play'
} = {}) {
  return `
    <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-gap-1.5 tw-items-stretch">
      ${showReset ? `
        <button type="button" id="${idPrefix}-reset" class="${CTRL_BTN_CLASS}" title="Reset to Start">
          ↺
        </button>
      ` : ''}
      <button type="button" id="${idPrefix}-back" class="${CTRL_BTN_CLASS}" title="Step Back">
        ⏮
      </button>
      <button type="button" id="${idPrefix}-play" class="${PLAY_NEUTRAL_CLASS}">
        <span id="${idPrefix}-play-text">▶ ${playLabel}</span>
      </button>
      <button type="button" id="${idPrefix}-forward" class="${CTRL_BTN_CLASS}" title="Step Forward">
        ⏭
      </button>
    </div>
  `
}

export class StepPlaybackControl {
  constructor(options = {}) {
    const {
      mountEl,
      idPrefix = 'step-ctrl',
      showReset = true,
      playLabel = 'Play',
      totalSteps = 1,
      currentStep = 0,
      zeroIsOrigin = false, // if true, -1 is start/origin state before step 0
      onStepBack = null,
      onStepForward = null,
      onPlay = null,
      onPause = null,
      onTogglePlay = null,
      onReset = null
    } = options

    this.mountEl = typeof mountEl === 'string' ? document.querySelector(mountEl) : mountEl
    this.idPrefix = idPrefix
    this.showReset = showReset
    this.playLabel = playLabel
    this.totalSteps = totalSteps
    this.currentStep = currentStep
    this.zeroIsOrigin = zeroIsOrigin
    this.isPlaying = false

    this.onStepBack = onStepBack
    this.onStepForward = onStepForward
    this.onPlay = onPlay
    this.onPause = onPause
    this.onTogglePlay = onTogglePlay
    this.onReset = onReset

    if (this.mountEl) {
      this.init()
    }
  }

  init() {
    this.mountEl.innerHTML = renderStepPlaybackControlHTML({
      idPrefix: this.idPrefix,
      showReset: this.showReset,
      playLabel: this.playLabel
    })

    this.resetBtn = this.mountEl.querySelector(`#${this.idPrefix}-reset`)
    this.backBtn = this.mountEl.querySelector(`#${this.idPrefix}-back`)
    this.playBtn = this.mountEl.querySelector(`#${this.idPrefix}-play`)
    this.forwardBtn = this.mountEl.querySelector(`#${this.idPrefix}-forward`)
    this.playText = this.mountEl.querySelector(`#${this.idPrefix}-play-text`)

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        if (this.onReset) this.onReset()
      })
    }

    if (this.backBtn) {
      this.backBtn.addEventListener('click', () => {
        if (this.onStepBack) this.onStepBack()
      })
    }

    if (this.forwardBtn) {
      this.forwardBtn.addEventListener('click', () => {
        if (this.onStepForward) this.onStepForward()
      })
    }

    if (this.playBtn) {
      this.playBtn.addEventListener('click', () => {
        if (this.onTogglePlay) {
          this.onTogglePlay(this.isPlaying)
        } else if (this.isPlaying) {
          if (this.onPause) this.onPause()
        } else {
          if (this.onPlay) this.onPlay()
        }
      })
    }

    this.update({
      currentStep: this.currentStep,
      totalSteps: this.totalSteps,
      isPlaying: this.isPlaying
    })
  }

  update(state = {}) {
    if (state.totalSteps !== undefined) this.totalSteps = state.totalSteps
    if (state.currentStep !== undefined) this.currentStep = state.currentStep
    if (state.isPlaying !== undefined) this.isPlaying = state.isPlaying

    const isAtStart = state.isAtStart !== undefined
      ? state.isAtStart
      : (this.zeroIsOrigin ? this.currentStep < 0 : this.currentStep <= 0)

    const isDone = state.isDone !== undefined
      ? state.isDone
      : (this.totalSteps <= 0 || this.currentStep >= this.totalSteps - 1)

    if (this.backBtn) {
      this.backBtn.disabled = isAtStart
    }
    if (this.resetBtn) {
      this.resetBtn.disabled = isAtStart
    }
    if (this.forwardBtn) {
      this.forwardBtn.disabled = isDone
    }

    if (this.playBtn && this.playText) {
      if (this.isPlaying) {
        this.playBtn.className = PLAY_ACTIVE_CLASS
        this.playText.textContent = '⏸ Pause'
      } else if (isDone) {
        this.playBtn.className = PLAY_NEUTRAL_CLASS
        this.playText.textContent = `↺ Replay`
      } else {
        this.playBtn.className = PLAY_NEUTRAL_CLASS
        this.playText.textContent = `▶ ${this.playLabel}`
      }
    }
  }
}

export function createStepPlaybackControl(options) {
  return new StepPlaybackControl(options)
}
