import { html, useEffect, useRef } from './preact.js'

export function RangeSlider({
  id,
  label,
  valueText,
  min = 0,
  max = 1,
  step = 0.01,
  value,
  defaultValue = 0,
  onChange,
  disabled = false,
  className = '',
  inputRef = null
}) {
  const localRef = useRef(null)
  const actualRef = inputRef || localRef

  const showHeader = Boolean(label || valueText !== undefined)

  useEffect(() => {
    if (actualRef.current) {
      if (value !== undefined) {
        const numVal = Number(value)
        const pct = max > min ? ((numVal - min) / (max - min)) * 100 : 0
        actualRef.current.value = numVal
        actualRef.current.style.setProperty('--range-fill', `${pct.toFixed(1)}%`)
      } else {
        const curVal = Number(actualRef.current.value !== '' ? actualRef.current.value : defaultValue)
        const pct = max > min ? ((curVal - min) / (max - min)) * 100 : 0
        actualRef.current.style.setProperty('--range-fill', `${pct.toFixed(1)}%`)
      }
    }
  }, [value, min, max])

  const handleInput = (e) => {
    const val = Number(e.target.value)
    const newPct = max > min ? ((val - min) / (max - min)) * 100 : 0
    e.target.style.setProperty('--range-fill', `${newPct.toFixed(1)}%`)
    if (onChange) onChange(val)
  }

  return html`
    <div class="tw-flex tw-flex-col tw-gap-1 ${className}">
      ${showHeader
        ? html`
            <div class="tw-flex tw-items-center tw-justify-between">
              ${label ? html`<label class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]" for=${id}>${label}</label>` : null}
              ${valueText !== undefined ? html`<span class="tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-text-primary">${valueText}</span>` : null}
            </div>
          `
        : null}
      <input
        ref=${actualRef}
        type="range"
        class="ux-range"
        id=${id}
        min=${min}
        max=${max}
        step=${step}
        value=${value}
        defaultValue=${defaultValue}
        disabled=${disabled}
        onInput=${handleInput} />
    </div>
  `
}
