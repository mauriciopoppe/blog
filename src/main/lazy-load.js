const Lozad = require('lozad')

export function lazyLoadhotReload() {
  new Lozad('.lazy-load').observe()
}

lazyLoadhotReload()
