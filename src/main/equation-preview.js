/*
 * MathJax eqn preview for a tags
 *
 * Copyright (c) 2015 Mauricio Poppe
 * Licensed under the MIT license.
 */
var container = document.querySelector('article[role=main]')

var tooltip = document.createElement('div')
tooltip.classList.add('mathjax-tooltip')
Object.assign(tooltip.style, {
  display: 'none',
  width: '100%',
  position: 'absolute',
  border: '1px solid #aaa',
  backgroundColor: '#121211'
})
container.appendChild(tooltip)

function getTarget(ev) {
  return ev.currentTarget.closest('a')
}

function onMouseOver(ev) {
  var href = getTarget(ev)
  if (!href) return
  var number = document.querySelector(href.hash)
  var equation = number.closest('.MathJax')

  var equationBounds = equation.getBoundingClientRect()
  Object.assign(tooltip.style, {
    top: href.closest('.MathJax').offsetTop - equationBounds.height - 50 + 'px',
    display: 'block'
  })

  tooltip.appendChild(equation.cloneNode(true))
}

function onMouseOut(ev) {
  var href = getTarget(ev)
  if (!href) return
  tooltip.innerHTML = ''
  Object.assign(tooltip.style, { display: 'none' })
}

document.addEventListener('DOMContentLoaded', function () {
  ;(async function afterMathJaxRender() {
    await MathJax.startup.promise
    Array.from(document.querySelectorAll('.MathJax_ref')).forEach((el) => {
      el.addEventListener('mouseover', onMouseOver)
      el.addEventListener('mouseout', onMouseOut)
    })
    console.log('done!')
  })()
})
