;(() => {
  const filterPanel = document.querySelector('.mobile-filters')
  if (!filterPanel) return

  const originButtons = document.querySelector('#origin-filter')
  const foodButtons = document.querySelector('#food-filter')
  const emptyMessage = document.querySelector('#filter-empty')
  const vendors = [...document.querySelectorAll('.vendor')]
  const saveStorageKey = 'qnm-2026:vendor-saves'
  const saveStates = (() => {
    try {
      return JSON.parse(localStorage.getItem(saveStorageKey) || '{}')
    } catch {
      return {}
    }
  })()
  const standLocations = JSON.parse(document.querySelector('#stand-locations').textContent)
  const mapWrap = document.querySelector('.map-wrap')
  const mapImage = mapWrap.querySelector('img')
  const mapHighlight = document.querySelector('#map-highlight')
  const saveCountElements = Object.fromEntries(
    [...document.querySelectorAll('[data-save-count]')].map((element) => [element.dataset.saveCount, element])
  )

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

  const originGroups = {
    'Latin American': new Set([
      'Latin American',
      'Argentine',
      'Brazilian',
      'Colombian',
      'Mexican',
      'Panamanian',
      'Peruvian',
      'Puerto Rican',
      'Salvadoran',
      'Venezuelan'
    ])
  }

  const matchesOrigin = (vendor, selectedOrigin) => {
    const origin = originFor(vendor)
    return originGroups[selectedOrigin]?.has(origin) || origin === selectedOrigin
  }

  const foodTypeDefinitions = [
    {
      key: 'seafood',
      label: '🐟 Fish & seafood',
      pattern: /🐟|🦀|🦑|fish|crab|squid|shark|ceviche/
    },
    {
      key: 'meat',
      label: '🥩🍗🍖 Meat',
      pattern: /🍗|🍖|🥩|🌭|🍔|meat|beef|chicken|pork|lamb|steak|ribs|sausage|choripan|churrasco|suya|kbbq|pernil|bofe|chicharron|pigtail|picada|duck/
    },
    {
      key: 'dessert',
      label: '🍰 Dessert & sweets',
      pattern: /🍰|🍬|🍭|🍦|🍩|🍡|🧇|sweet|dango|waffle|cake|kunafa|pasteis/
    },
    {
      key: 'noodles',
      label: '🍜 Noodles',
      pattern: /🍜|noodle|ramen/
    },
    {
      key: 'rice',
      label: '🍚 Rice',
      pattern: /🍚|🍛|jollof|rice|biryani|silog|pelau/
    },
    {
      key: 'drinks',
      label: '🥤 Drinks',
      pattern: /🧋|☕|tea|drink|bubble/
    },
    {
      key: 'dumplings',
      label: '🥟 Dumplings & filled dough',
      pattern: /🥟|dumpling|momo|lumpia|pierog|empanada|esfiha|carimañola|alcapurria/
    },
    {
      key: 'sandwiches',
      label: '🥪 Sandwiches',
      pattern: /🥪|sandwich|burger|choripan/
    },
    {
      key: 'flatbreads',
      label: '🫓 Flatbreads',
      pattern: /🫓|arepa|pupusa|sorullito|huarache|hojaldre|gözleme|gozleme/
    },
    {
      key: 'soups',
      label: '🍲 Soups & stews',
      pattern: /🍲|soup|haleem|nihari|stew|metemgee|pepper pot|bouillon/
    },
    {
      key: 'skewers',
      label: '🍢 Skewers',
      pattern: /🍢|skewer|suya/
    },
    {
      key: 'tacos',
      label: '🌮 Tacos',
      pattern: /🌮|taco/
    },
    {
      key: 'vegetables',
      label: '🌱 Vegetables & roots',
      pattern: /🥗|🌽|🥔|vegetable|salad|corn|potato|cassava|kookoo sabzi|moimoi|tahu isi|batagor/
    },
    {
      key: 'potatoes',
      label: '🥔 Potatoes & roots',
      pattern: /🥔|potato|cassava|bombas de papa/
    }
  ]

  const foodTypesFor = (vendor) => {
    const details = vendor.querySelector('.details')?.textContent || ''
    const menu = details.split('·').slice(1).join('·').toLowerCase()

    return foodTypeDefinitions.filter(({ pattern }) => pattern.test(menu)).map(({ key }) => key)
  }

  const setPressed = (buttons, key, value) => {
    buttons.forEach((button) => {
      button.setAttribute('aria-pressed', value !== null && button.dataset[key] === value ? 'true' : 'false')
    })
  }

  const applyFilters = () => {
    const origin = originButtons.querySelector('button[aria-pressed="true"]')?.dataset.origin || ''
    const foodType = foodButtons.querySelector('button[aria-pressed="true"]')?.dataset.foodType || ''
    let visibleCount = 0

    vendors.forEach((vendor) => {
      const visible =
        (!origin || matchesOrigin(vendor, origin)) && (!foodType || foodTypesFor(vendor).includes(foodType))
      vendor.hidden = !visible
      if (visible) visibleCount += 1
    })

    emptyMessage.hidden = visibleCount > 0
  }

  const saveStateLabel = (state) => {
    if (state === 'bookmarked') return 'Bookmarked. Mark as favorite'
    if (state === 'tried') return 'Tried. Mark as favorite'
    if (state === 'favorite') return 'Favorited. Remove saved mark'
    return 'Bookmark this vendor'
  }

  const updateSaveButton = (vendor, button, state) => {
    vendor.dataset.saveState = state
    button.setAttribute(
      'aria-label',
      `${saveStateLabel(state)}: ${vendor.querySelector('.name')?.textContent || 'vendor'}`
    )
    button.setAttribute('aria-pressed', state === 'none' ? 'false' : 'true')
  }

  const updateSaveCounts = () => {
    const counts = { bookmarked: 0, tried: 0, favorite: 0 }
    vendors.forEach((vendor) => {
      const state = vendor.dataset.saveState
      if (state in counts) counts[state] += 1
    })
    Object.entries(counts).forEach(([state, count]) => {
      if (saveCountElements[state]) saveCountElements[state].textContent = count
    })
  }

  const addSaveButton = (vendor) => {
    const number = String(Number(vendor.querySelector('.num')?.textContent || ''))
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'vendor-save'
    button.innerHTML = `<svg class="save-bookmark" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3.5A1.5 1.5 0 0 1 7.5 2h9A1.5 1.5 0 0 1 18 3.5V21l-6-3.75L6 21V3.5Z" /></svg><svg class="save-tried" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><svg class="save-star" viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6-4.4-4.3 6.1-.9L12 3Z" /></svg>`
    const initialState = saveStates[number] || 'none'
    updateSaveButton(vendor, button, initialState)
    button.addEventListener('click', (event) => {
      event.stopPropagation()
      const currentState = vendor.dataset.saveState || 'none'
      const nextState =
        { none: 'bookmarked', bookmarked: 'tried', tried: 'favorite', favorite: 'none' }[currentState] || 'bookmarked'
      if (nextState === 'none') delete saveStates[number]
      else saveStates[number] = nextState
      try {
        localStorage.setItem(saveStorageKey, JSON.stringify(saveStates))
      } catch {
        // Ignore storage failures and keep the in-memory state.
      }
      updateSaveButton(vendor, button, nextState)
      updateSaveCounts()
    })
    button.addEventListener('keydown', (event) => event.stopPropagation())
    vendor.append(button)
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
    addSaveButton(vendor)
    vendor.tabIndex = 0
    vendor.addEventListener('click', () => highlightStand(vendor))
    vendor.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return
      event.preventDefault()
      highlightStand(vendor)
    })
  })
  updateSaveCounts()

  const originLabels = new Map(vendors.map((vendor) => [originFor(vendor), originLabelFor(vendor)]))
  const originButtonList = []
  const foodButtonList = []

  const addFilterButton = (container, buttons, key, value, label) => {
    const button = document.createElement('button')
    button.type = 'button'
    button.className = 'filter-chip'
    button.dataset[key] = value
    button.setAttribute('aria-pressed', value ? 'false' : 'true')
    button.textContent = label
    button.addEventListener('click', () => {
      const isSelected = button.getAttribute('aria-pressed') === 'true'
      setPressed(buttons, key, isSelected ? null : value)
      applyFilters()
    })
    container.append(button)
    buttons.push(button)
  }

  addFilterButton(originButtons, originButtonList, 'origin', '', '🍽️ All origins')
  ;[...new Set(vendors.map(originFor).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b))
    .forEach((origin) =>
      addFilterButton(originButtons, originButtonList, 'origin', origin, originLabels.get(origin) || origin)
    )

  const foodTypeCounts = new Map()
  vendors.forEach((vendor) => {
    foodTypesFor(vendor).forEach((foodType) => {
      foodTypeCounts.set(foodType, (foodTypeCounts.get(foodType) || 0) + 1)
    })
  })

  addFilterButton(foodButtons, foodButtonList, 'foodType', '', '🍽️ All food')
  foodTypeDefinitions
    .filter(({ key }) => foodTypeCounts.has(key))
    .forEach(({ key, label }) => addFilterButton(foodButtons, foodButtonList, 'foodType', key, label))

  applyFilters()
})()
