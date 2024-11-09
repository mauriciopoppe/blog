/*
 * MathJax eqn preview for a tags
 *
 * Copyright (c) 2020 Mauricio Poppe
 * Licensed under the MIT license.
 */
function run() {
  const tooltip = document.createElement('div')
  const container = document.querySelector('article[role=main]')
  tooltip.classList.add('mathjax-tooltip', 'ref-tooltip-preview')
  container.appendChild(tooltip)

  function getTarget(ev: Event) {
    return (ev.currentTarget as HTMLElement).closest('a')
  }

  function onMouseOver(ev: Event) {
    const href: HTMLAnchorElement = getTarget(ev)
    if (!href) return
    // @ts-ignore
    let target = decodeURIComponent(href.hash || href?.href?.baseVal)
    target = target.replace(/:/g, '\\:')
    const number = document.querySelector(target)
    const equation = number.closest('.MathJax')

    const equationBounds = equation.getBoundingClientRect()
    Object.assign(tooltip.style, {
      top: (href.closest('.MathJax') as HTMLElement).offsetTop - equationBounds.height - 50 + 'px',
      display: 'block'
    })

    tooltip.appendChild(equation.cloneNode(true))
  }

  function onMouseOut(ev: Event) {
    const href = getTarget(ev)
    if (!href) return
    tooltip.innerHTML = ''
    Object.assign(tooltip.style, { display: 'none' })
  }

  document.addEventListener('DOMContentLoaded', async function () {
    // some pages don't have mathjax enabled by default
    if (!window.MathJax) return

    await window.MathJax.startup.promise
    Array.from(document.querySelectorAll('.MathJax_ref')).forEach((el) => {
      el.addEventListener('mouseover', onMouseOver)
      el.addEventListener('mouseout', onMouseOut)
    })
  })
}

function main() {
  const container = document.querySelector('article[role=main]')
  if (container) run()
}

export function equationPreviewHotReload() {
  main()
}

main()
