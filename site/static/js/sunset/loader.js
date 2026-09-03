const target = document.querySelector('#browser-sunset')

if (target) {
  const load = async () => {
    const mobile = navigator.userAgentData?.mobile || /Android|iPhone|iPad|iPod|Windows Phone|BlackBerry/i.test(navigator.userAgent)
    const module = await import(mobile ? './mobile.js' : './index.js?v=flight-rudder-return-2')
    if (mobile) module.render({ target })
  }
  if (target.closest('.sunset-footer--sandbox')) {
    load()
  } else {
    const observer = new IntersectionObserver(async ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      load()
    }, { rootMargin: '400px' })
    observer.observe(target)
  }
}
