/*
    Sitemap controls the state of the sitemap component including:

    - highlighting the current note in the flat recent-notes list
 */

function initialize() {
  const sitemap = document.querySelector('#sitemap-tree')
  if (!sitemap) return
  const current = Array.from(sitemap.querySelectorAll('a')).find((link) => link.pathname === window.location.pathname)
  if (current) {
    const activeItem = current.closest('li')
    if (activeItem) activeItem.classList.add('is-active')
  }
}

export function sitemapMain() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize)
  } else {
    initialize()
  }
}
