const projects = [...document.querySelectorAll('[data-software-project]')]
const links = new Map([...document.querySelectorAll('[data-software-nav]')].map((link) => [link.dataset.softwareNav, link]))

const setActive = (id) => {
  links.forEach((link, linkId) => {
    const active = linkId === id
    link.classList.toggle('tw-text-primary', active)
    link.classList.toggle('tw-bg-[var(--accent-tint)]', active)
    link.setAttribute('aria-current', active ? 'true' : 'false')
    link.querySelector('.software-project-dot')?.classList.toggle('tw-bg-primary', active)
  })
}

if (projects.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
    if (!visible) return
    const id = visible.target.dataset.softwareProject
    setActive(id)
    links.get(id)?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
  }, { rootMargin: '-15% 0px -65% 0px', threshold: [0, 0.25, 0.5, 1] })

  projects.forEach((project) => observer.observe(project))
}

const initialId = window.location.hash.slice(1)
setActive(links.has(initialId) ? initialId : projects[0]?.dataset.softwareProject)
