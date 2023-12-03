import Pjax from 'pjax'

export function initializeWithReloadFn({ onStart, onComplete }) {
  // eslint-disable-next-line
  var pjax = new Pjax({
    selectors: ['header', 'section.main'],
    switches: {
      header: Pjax.switches.outerHTML,
      'section.main': Pjax.switches.outerHTML
    }
  })

  document.addEventListener('pjax:send', onStart)
  document.addEventListener('pjax:complete', onComplete)
}
