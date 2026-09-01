import { describe, it, expect } from 'bun:test'
import { UI } from './tokens.js'

describe('UI Design Tokens', () => {
  it('exports valid button classes following UX principles', () => {
    expect(UI.btn.base).toContain('tw-cursor-pointer')
    expect(UI.btn.base).toContain('hover:tw-border-primary')
    expect(UI.btn.base).toContain('hover:tw-bg-primary-soft')
    expect(UI.btn.base).toContain('hover:tw-shadow-raised')
    expect(UI.btn.base).toContain('disabled:tw-cursor-not-allowed')
  })

  it('exports valid segmented radio classes with hover feedback', () => {
    expect(UI.segmented.group).toContain('tw-overflow-hidden')
    expect(UI.segmented.group).toContain('tw-border-[var(--ring-border)]')
    expect(UI.segmented.itemInactive).toContain('tw-bg-transparent')
    expect(UI.segmented.itemInactive).toContain('hover:tw-text-primary')
    expect(UI.segmented.itemActive).toContain('tw-bg-primary-soft')
    expect(UI.segmented.itemActive).toContain('tw-text-primary')
  })

  it('exports valid card and pill tokens', () => {
    expect(UI.card.widgetFrame).toContain('tw-rounded-[12px]')
    expect(UI.card.interactive).toContain('tw-cursor-pointer')
    expect(UI.card.interactive).toContain('tw-shadow-raised')
    expect(UI.card.interactive).toContain('hover:tw-shadow-deep')
    expect(UI.pill.interactive).toContain('hover:tw-border-primary')
  })
})
