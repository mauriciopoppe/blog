const Lozad = require('lozad')

export function lazyLoadMain() {
  new Lozad('.lazy-load').observe()
}
