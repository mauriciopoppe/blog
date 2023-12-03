/*
 * Footnote preview
 *
 * Copyright (c) 2023 Mauricio Poppe
 * Licensed under the MIT license.
 */
/** @type HTMLDivElement */

function run() {
  /** @type HTMLDivElement */
  const tooltip = document.createElement('div')
  const container = document.querySelector('article[role=main]')
  tooltip.classList.add('footnotes', 'footnotes-tooltip', 'ref-tooltip-preview')
  container.appendChild(tooltip)

  /**
   * @returns {HTMLElement}
   */
  function getTarget(ev) {
    return ev.currentTarget.closest('a')
  }

  function onMouseOver(ev) {
    const href = getTarget(ev)
    if (!href) return
    /** @type HTMLLinkElement */

    let target = decodeURIComponent(href.hash)
    target = target.replace(/:/g, '\\:')
    const footnote = document.querySelector(target)
    Object.assign(tooltip.style, {
      top: `${href.offsetTop + 30}px`,
      display: 'block'
    })

    tooltip.appendChild(footnote.cloneNode(true))
  }

  function onMouseOut(ev) {
    const href = getTarget(ev)
    if (!href) return
    tooltip.innerHTML = ''
    Object.assign(tooltip.style, { display: 'none' })
  }

  document.addEventListener('DOMContentLoaded', async function () {
    Array.from(document.querySelectorAll('.footnote-ref')).forEach((el) => {
      el.addEventListener('mouseover', onMouseOver)
      el.addEventListener('mouseout', onMouseOut)
    })
  })
}

function main() {
  const container = document.querySelector('article[role=main]')
  if (container) run()
}

export function footnotesPreviewHotReload() {
  main()
}

main()
