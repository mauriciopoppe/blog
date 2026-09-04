import { describe, expect, test } from 'bun:test'
import { readFileSync } from 'fs'
import { join } from 'path'

const shortcode = readFileSync(join(import.meta.dir, 'full-screen-with-background.html'), 'utf8')

describe('full-screen-with-background shortcode', () => {
  test('keeps decorative backgrounds inside the layout viewport', () => {
    expect(shortcode).toContain('tw-w-screen tw-h-screen')
    expect(shortcode).not.toContain('tw-overflow-x-clip')
    expect(shortcode).toContain('html { overflow-x: clip; }')
    expect(shortcode).toContain('left: calc(50% - 50vw)')
    expect(shortcode).toContain('tw-inset-0 tw-w-full tw-h-full')
    expect(shortcode).toContain('width: 100%')
  })
})
