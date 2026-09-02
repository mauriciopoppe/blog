const target = document.querySelector('#browser-sunset')

if (target) {
  const observer = new IntersectionObserver(async ([entry]) => {
    if (!entry.isIntersecting) return
    observer.disconnect()
    const mobile = navigator.userAgentData?.mobile || /Android|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent)
    const module = await import(mobile ? './mobile.js' : './index.js')
    if (mobile) module.render({ target })
  }, { rootMargin: '400px' })
  observer.observe(target)
}
