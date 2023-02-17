/*
 * Footnote preview
 *
 * Copyright (c) 2023 Mauricio Poppe
 * Licensed under the MIT license.
 */
/** @type HTMLDivElement */
const container = document.querySelector('article[role=main]')
if (container) run()

function run() {
  /** @type HTMLDivElement */
  const tooltip = document.createElement('div')
  tooltip.classList.add('footnotes-tooltip')
  tooltip.classList.add('footnotes')
  Object.assign(tooltip.style, {
    display: 'none',
    width: '100%',
    position: 'absolute',
    border: '1px solid #aaa',
    backgroundColor: '#121211'
  })
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
