function isDesktopPointer() {
  return typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

export function makeAvatarDraggable(avatar) {
  if (!avatar || !isDesktopPointer() || avatar.dataset.avatarDraggable === 'true') return
  const shell = avatar.parentElement
  if (!shell) return
  const originalParent = shell.parentElement
  const shellWasStatic = getComputedStyle(shell).position === 'static'
  if (shellWasStatic) shell.style.position = 'relative'

  avatar.dataset.avatarDraggable = 'true'
  let placeholder = null
  let dragging = false
  let moved = false
  let offsetX = 0
  let offsetY = 0
  let dropZone = null
  let dropTargetRect = null
  let dropZoneScrollX = 0
  let dropZoneScrollY = 0
  let dropZoneScrollHandler = null
  const originalUserSelect = document.body.style.userSelect
  const originalStyles = {
    position: shellWasStatic ? 'relative' : shell.style.position,
    zIndex: shell.style.zIndex,
    margin: shell.style.margin,
    left: shell.style.left,
    top: shell.style.top
  }

  const setPosition = (left, top) => {
    const rect = shell.getBoundingClientRect()
    const maxLeft = Math.max(0, window.innerWidth - rect.width)
    const maxTop = Math.max(0, window.innerHeight - rect.height)
    shell.style.left = `${clamp(left, 0, maxLeft)}px`
    shell.style.top = `${clamp(top, 0, maxTop)}px`
  }

  const showDropZone = () => {
    if (!dropTargetRect) return
    const rect = dropTargetRect
    const positionDropZone = () => {
      if (!dropZone) return
      // The page can establish a scrolling containing block for fixed
      // descendants. Compensate explicitly so the target remains viewport-
      // anchored while the document scrolls.
      dropZone.style.left = `${rect.left + window.scrollX - dropZoneScrollX - 8}px`
      dropZone.style.top = `${rect.top + window.scrollY - dropZoneScrollY - 8}px`
    }
    if (!dropZone) {
      dropZone = document.createElement('div')
      dropZone.setAttribute('aria-hidden', 'true')
      // Keep the overlay outside the document body so page scrolling or a
      // transformed content wrapper cannot establish a moving containing block.
      dropZone.style.setProperty('position', 'fixed', 'important')
      dropZone.style.pointerEvents = 'none'
      dropZone.style.border = '1px dashed rgb(var(--primary))'
      dropZone.style.borderRadius = '9999px'
      dropZone.style.background = 'rgba(var(--primary), 0.08)'
      dropZone.style.opacity = '0.7'
      dropZone.style.zIndex = '9999'
      document.documentElement.appendChild(dropZone)
    }
    dropZone.style.display = 'block'
    dropZone.style.width = `${rect.width + 16}px`
    dropZone.style.height = `${rect.height + 16}px`
    positionDropZone()
    if (!dropZoneScrollHandler) {
      dropZoneScrollHandler = positionDropZone
      window.addEventListener('scroll', dropZoneScrollHandler, { passive: true })
    }
  }

  const hideDropZone = () => {
    if (dropZone) dropZone.style.display = 'none'
    if (dropZoneScrollHandler) {
      window.removeEventListener('scroll', dropZoneScrollHandler)
      dropZoneScrollHandler = null
    }
  }

  const restoreOriginalPosition = () => {
    if (placeholder && shell.parentElement !== originalParent) {
      originalParent.insertBefore(shell, placeholder)
    }
    shell.style.position = originalStyles.position
    shell.style.zIndex = originalStyles.zIndex
    shell.style.margin = originalStyles.margin
    shell.style.left = originalStyles.left
    shell.style.top = originalStyles.top
    if (placeholder) {
      placeholder.remove()
      placeholder = null
    }
    hideDropZone()
    dropTargetRect = null
    delete avatar.dataset.avatarDetached
    avatar.dispatchEvent(new CustomEvent('avatar-position-change'))
  }

  const startDrag = (event) => {
    if (event.button !== 0) return
    event.preventDefault()
    const rect = shell.getBoundingClientRect()
    offsetX = event.clientX - rect.left
    offsetY = event.clientY - rect.top
    dragging = true
    moved = false
  }

  const moveDrag = (event) => {
    if (!dragging) return
    const dx = event.clientX - (shell.getBoundingClientRect().left + offsetX)
    const dy = event.clientY - (shell.getBoundingClientRect().top + offsetY)
    if (!moved && Math.hypot(dx, dy) < 6) return
    if (!moved) {
      moved = true
      const detachRect = shell.getBoundingClientRect()
      if (!dropTargetRect) {
        const avatarRect = avatar.getBoundingClientRect()
        // Store plain coordinates. DOMRect implementations may expose live
        // values, which would make the restore target follow the dragged node.
        dropTargetRect = {
          left: avatarRect.left,
          top: avatarRect.top,
          width: avatarRect.width,
          height: avatarRect.height,
          right: avatarRect.right,
          bottom: avatarRect.bottom
        }
      }
      dropZoneScrollX = window.scrollX
      dropZoneScrollY = window.scrollY
      if (!placeholder) {
        placeholder = document.createElement('span')
        placeholder.style.display = 'inline-block'
        placeholder.style.width = `${detachRect.width}px`
        placeholder.style.height = `${detachRect.height}px`
        shell.parentElement.insertBefore(placeholder, shell)
      }
      shell.style.position = 'fixed'
      shell.style.zIndex = '10000'
      shell.style.margin = '0'
      shell.style.left = `${detachRect.left}px`
      shell.style.top = `${detachRect.top}px`
      document.documentElement.appendChild(shell)
      document.body.style.userSelect = 'none'
      showDropZone()
    }
    setPosition(event.clientX - offsetX, event.clientY - offsetY)
    event.preventDefault()
  }

  const endDrag = (event) => {
    if (!dragging) return
    dragging = false
    document.body.style.userSelect = originalUserSelect
    if (!moved) return
    const target = dropZone ? dropZone.getBoundingClientRect() : null
    const droppedInsideTarget = target && event.clientX >= target.left && event.clientX <= target.right &&
      event.clientY >= target.top && event.clientY <= target.bottom
    hideDropZone()
    if (droppedInsideTarget) {
      restoreOriginalPosition()
      return
    }
    avatar.dataset.avatarDragged = 'true'
    avatar.dataset.avatarDetached = 'true'
    avatar.dispatchEvent(new CustomEvent('avatar-position-change'))
  }

  avatar.addEventListener('pointerdown', startDrag)
  window.addEventListener('pointermove', moveDrag)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)

  avatar.addEventListener('avatar-restore-request', restoreOriginalPosition)
  avatar.title = 'Drag to move avatar'
  avatar.style.cursor = 'grab'
  const dragIndicator = document.createElement('span')
  dragIndicator.className = 'avatar-drag-indicator'
  dragIndicator.setAttribute('aria-hidden', 'true')
  Object.assign(dragIndicator.style, {
    position: 'absolute',
    left: '50%',
    bottom: '-34px',
    zIndex: '3',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '3px',
    padding: '3px 7px 3px 5px',
    borderRadius: '9999px',
    background: 'var(--grey-dark)',
    border: '1px solid var(--ring-border)',
    boxShadow: 'var(--elevation-subtle)',
    color: 'rgb(var(--primary))',
    fontFamily: 'var(--family-sans, system-ui, sans-serif)',
    fontSize: '11px',
    whiteSpace: 'nowrap',
    opacity: '0',
    pointerEvents: 'none',
    textShadow: '0 1px 4px var(--grey-darker)',
    transform: 'translate(-50%, 0)',
    transition: 'opacity 150ms ease, transform 150ms ease'
  })
  const indicatorIcon = document.createElement('span')
  indicatorIcon.className = 'material-symbols-outlined'
  indicatorIcon.textContent = 'drag_pan'
  indicatorIcon.style.fontSize = '16px'
  const indicatorText = document.createElement('span')
  indicatorText.textContent = 'Drag to move'
  dragIndicator.append(indicatorIcon, indicatorText)
  shell.appendChild(dragIndicator)
  avatar.addEventListener('mouseenter', () => {
    dragIndicator.style.opacity = '0.95'
    dragIndicator.style.transform = 'translate(-50%, -3px)'
  })
  avatar.addEventListener('mouseleave', () => {
    if (!dragging) {
      dragIndicator.style.opacity = '0'
      dragIndicator.style.transform = 'translate(-50%, 0)'
    }
  })

}

export function draggableAvatarMain() {
  if (typeof document === 'undefined' || !isDesktopPointer()) return
  document.querySelectorAll('.js-avatar-scene, .profile-avatar-scene').forEach(makeAvatarDraggable)
}
