/*
 * Footnote preview
 *
 * Copyright (c) 2023 Mauricio Poppe
 * Licensed under the MIT license.
 */
function run() {
  const tooltip = document.createElement('div')
  const container = document.querySelector('article[role=main]')
  tooltip.style.display = 'none'
  tooltip.style.backgroundColor = 'var(--grey-dark)'
  tooltip.classList.add(
    'footnotes' /* Make it inherit the style set on .footnotes at the end of the article */,
    'footnotes-tooltip',
    'tw-rounded',
    'tw-mx-auto',
    'tw-absolute',
    'tw-p-3'
  )
  container.appendChild(tooltip)

  function getTarget(ev: Event) {
    return (ev.currentTarget as HTMLElement).closest('a')
  }

  function onMouseOver(ev: Event) {
    const a = getTarget(ev)
    if (!a) return
    /** @type HTMLLinkElement */

    let target: string = decodeURIComponent(a.hash)
    target = target.replace(/:/g, '\\:')
    const footnote = document.querySelector(target)
    const targetContainer = footnote.closest('.content')
    console.log(footnote)

    Object.assign(tooltip.style, {
      // Get the position of the parent <sup> element instead of the <a> element.
      // The reason is that <sup> sets position: relative making offsetTop not work
      // as expected on <a>.
      top: `${a.parentElement.offsetTop + 50}px`,
      width: `${targetContainer.getBoundingClientRect().width}px`,
      display: 'block'
    })

    tooltip.appendChild(footnote.cloneNode(true))
    // debugger
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
