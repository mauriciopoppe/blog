;(() => {
  const filterPanel = document.querySelector('.mobile-filters')
  if (!filterPanel) return

  const originButtons = document.querySelector('#origin-filter')
  const emptyMessage = document.querySelector('#filter-empty')
  const vendors = [...document.querySelectorAll('.vendor')]

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
