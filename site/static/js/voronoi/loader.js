const target = document.querySelector('#voronoi')

if (target) {
  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    const { generate } = await import('./index.js')
    generate({ target, enableRainbowAnimation: true, enableWaveAnimation: false, n: 300 })
  }, { rootMargin: '200px' })
  observer.observe(target)
}
