/*
 * Footnote preview
 *
 * Copyright (c) 2023 Mauricio Poppe
 * Licensed under the MIT license.
 */
function run() {
  const tooltip = document.createElement('div')
  const container = document.querySelector('article[role=main]')
  tooltip.classList.add('footnotes', 'footnotes-tooltip', 'ref-tooltip-preview')
  container.appendChild(tooltip)

  function getTarget(ev: Event) {
    return (ev.currentTarget as HTMLElement).closest('a')
  }

  function onMouseOver(ev: Event) {
    const href = getTarget(ev)
    if (!href) return
    /** @type HTMLLinkElement */

    let target: string = decodeURIComponent(href.hash)
    target = target.replace(/:/g, '\\:')
    const footnote = document.querySelector(target)
    Object.assign(tooltip.style, {
      top: `${href.offsetTop + 30}px`,
      display: 'block'
    })

    tooltip.appendChild(footnote.cloneNode(true))
  }

  function onMouseOut(ev: Event) {
    const href = getTarget(ev)
    if (!href) return
    tooltip.innerHTML = ''
    Object.assign(tooltip.style, { display: 'none' })
  }

  async function start() {
    Array.from(document.querySelectorAll('.footnote-ref')).forEach((el) => {
      el.addEventListener('mouseover', onMouseOver)
      el.addEventListener('mouseout', onMouseOut)
    })
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    start()
  } else {
    document.addEventListener('DOMContentLoaded', start)
  }
}

function main() {
  const container = document.querySelector('article[role=main]')
  if (container) run()
}

export function footnotesPreviewMain() {
  main()
}
