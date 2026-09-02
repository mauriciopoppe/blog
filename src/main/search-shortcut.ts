/**
 * Global keyboard shortcuts for single article pages.
 * Pressing Cmd+K or Ctrl+K redirects the user to the unified topic constellation search.
 */
export function searchShortcutMain(): void {
  window.addEventListener('keydown', (event: KeyboardEvent) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      const target = event.target as HTMLElement | null
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return
      }
      event.preventDefault()
      window.location.href = '/notes/?search=true'
    }
  })
}
