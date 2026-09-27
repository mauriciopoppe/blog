;(() => {
  const filterPanel = document.querySelector('.mobile-filters')
  if (!filterPanel) return

  const originButtons = document.querySelector('#origin-filter')
  const emptyMessage = document.querySelector('#filter-empty')
  const vendors = [...document.querySelectorAll('.vendor')]
  const standLocations = JSON.parse(document.querySelector('#stand-locations').textContent)
  const mapWrap = document.querySelector('.map-wrap')
  const mapImage = mapWrap.querySelector('img')
  const mapHighlight = document.querySelector('#map-highlight')

  const originFor = (vendor) => {
    const details = vendor.querySelector('.details')?.textContent || ''
    return details
      .split('·')[0]
      .replace(/^[^\p{L}\p{N}]*/u, '')
      .trim()
  }

  const originLabelFor = (vendor) => {
    const details = vendor.querySelector('.details')?.textContent || ''
    return details.split('·')[0].trim()
  }

  const setPressed = (buttons, value) => {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', value !== null && button.dataset.origin === value ? 'true' : 'false')
    })
  }

  const applyFilters = () => {
    const origin = originButtons.querySelector('button[aria-pressed="true"]')?.dataset.origin || ''
    let visibleCount = 0

    vendors.forEach((vendor) => {
      const visible = !origin || originFor(vendor) === origin
      vendor.hidden = !visible
      if (visible) visibleCount += 1
    })

    emptyMessage.hidden = visibleCount > 0
  }

  const clearHighlight = () => {
    mapHighlight.setAttribute('hidden', '')
    vendors.forEach((item) => item.removeAttribute('data-map-active'))
  }

  const highlightStand = (vendor) => {
    if (vendor.hasAttribute('data-map-active')) {
      clearHighlight()
      return
    }

    const standNumber = String(Number(vendor.querySelector('.num')?.textContent || ''))
    const location = standLocations[standNumber]
    if (!location) return

    mapHighlight.setAttribute('cx', location.x)
    mapHighlight.setAttribute('cy', location.y)
    const renderedWidth = mapImage.getBoundingClientRect().width || 2746
    const radiusForVisibility = (18 * 2746) / renderedWidth
    mapHighlight.setAttribute('r', Math.max(location.r, radiusForVisibility))
    mapHighlight.removeAttribute('hidden')
    vendors.forEach((item) => item.toggleAttribute('data-map-active', item === vendor))
  }

  vendors.forEach((vendor) => {
    vendor.tabIndex = 0
    vendor.addEventListener('click', () => highlightStand(vendor))
    vendor.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      highlightStand(vendor)
    })
  })

  const originLabels = new Map(vendors.map((vendor) => [originFor(vendor), originLabelFor(vendor)]))
  const originButtonList = []

  const addOriginButton = (origin, label) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'filter-chip'
    button.dataset.origin = origin
    button.setAttribute('aria-pressed', origin ? 'false' : 'true')
    button.textContent = label
    button.addEventListener('click', () => {
      const isSelected = button.getAttribute('aria-pressed') === 'true'
      setPressed(originButtonList, isSelected ? null : origin)
      applyFilters()
    })
    originButtons.append(button)
    originButtonList.push(button)
  }

  addOriginButton('', '🍽️ All origins')
  ;[...new Set(vendors.map(originFor).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .forEach((origin) => addOriginButton(origin, originLabels.get(origin) || origin))

  applyFilters()
})()
