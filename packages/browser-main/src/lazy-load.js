const Lozad = require('lozad')
new Lozad('.lazy-load').observe()

// hide if not visible
const observer = new window.IntersectionObserver(onIntersection)
Array.from(document.querySelectorAll('.lazy-load'))
  .forEach(el => observer.observe(el))

function onIntersection (entries, observer) {
  entries.forEach(entry => {
    let visibility = ''
    if (entry.isIntersecting) {
      visibility = ''
    } else {
      visibility = 'hidden'
    }

    entry.target.style.visibility = visibility
  })
}
