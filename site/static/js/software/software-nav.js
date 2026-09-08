const items = [...document.querySelectorAll('[data-software-project], [data-talk]')]
const links = new Map([...document.querySelectorAll('[data-software-nav], [data-talk-nav]')].map((link) => [link.dataset.softwareNav || link.dataset.talkNav, link]))

const setActive = (id) => {
  links.forEach((link, linkId) => {
    const active = linkId === id
    link.classList.toggle('tw-text-primary', active)
    link.classList.toggle('tw-bg-[var(--accent-tint)]', active)
    link.setAttribute('aria-current', active ? 'true' : 'false')
    link.querySelector('.software-project-dot, .talk-dot')?.classList.toggle('tw-bg-primary', active)
  })
}

if (items.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (!visible) return
    const id = visible.target.dataset.softwareProject || visible.target.dataset.talk
    setActive(id)
    links.get(id)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, { rootMargin: '-15% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] })

  items.forEach((item) => observer.observe(item))
}

const initialId = window.location.hash.slice(1)
setActive(links.has(initialId) ? initialId : items[0]?.dataset.softwareProject || items[0]?.dataset.talk)
