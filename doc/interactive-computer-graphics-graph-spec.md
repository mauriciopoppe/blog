# Interactive Computer Graphics Graph Spec

## Purpose

This spec defines the visual language for interactive 3D graph explorers in the computer graphics notes. The reference implementation is the Coordinate Frames & Camera View Transform explorer at `site/static/js/computer-graphics/coordinate-frame-explorer.js`. New graphs should reproduce its structure and styling, and existing graphs should converge on these values.

Interactive graphs follow the interaction model in [UX Interaction Principles](/notes/ux-interaction-principles/): affordance in the resting state, distinct interactive vs passive surfaces, and the four interaction states. This spec layers the graph-specific visual and typography rules on top of those principles.

## Design Tokens

Graphs use the theme CSS custom properties from the site design system. Never hardcode hex colors.

| Token | Role in graphs |
| :--- | :--- |
| `--primary` | Accent color for titles, active states, and highlights |
| `--grey-darker` | Canvas backdrop and deep surfaces |
| `--grey-dark` | Cards, headers, inset panels, and passive borders |
| `--grey` | Interactive borders and completed step badges |
| `--grey-light` | Secondary text and captions |
| `--grey-lighter` | Primary text |
| `--family-sans` | Titles and headers |
| `--family-serif` | Content, labels, and body copy |

## Card Container

- Outer card: a passive container, `background: var(--grey-darker)`, `border: 1px solid var(--grey-dark)`, `border-radius: 12px`, `overflow: hidden`, `margin: 1.75rem 0`. Passive containers stay flat with the subtle `var(--grey-dark)` border and no elevation or pointer cursor
- Body grid: two columns of `335px` and `1fr`, `gap: 12px`, `padding: 12px`. The grid collapses to one column below `860px`
- The header is a full-width strip inside the card with no gaps at the edges, so its background reaches the rounded corners

## Header

- `background: var(--grey-dark)`, `padding: 10px 14px`, `border-bottom: 1px solid var(--grey-dark)`
- Title on the left: `12.5px`, `font-weight: 700`, `letter-spacing: 0.08em`, `color: rgb(var(--primary))`, with a leading `15px` stroke SVG icon at `6px` gap. The icon uses `currentColor` so it matches the title color
- Subtitle or badge on the right: `11px`, `letter-spacing: 0.04em`, `color: var(--grey-light)`
- No uppercase. Graph text renders as written

## Buttons

Buttons are interactive and must read as interactive in the resting state. Every button sets `cursor: pointer`, a soft resting elevation, and a visible focus ring, and defines all four interaction states (default, hover, focus, active). Interactive buttons use a lighter border (`var(--grey)` or a primary tint) so they stay distinct from passive panels, which keep the subtle `var(--grey-dark)` border.

Shared focus state: `outline: 2px solid rgba(var(--primary), 0.6); outline-offset: 2px`

Shared active (pressed) state: reduce the resting elevation and apply a subtle scale, so the button visibly presses down

### Playback buttons

Default: `padding: 5px 8px`, `border-radius: 5px`, `font-size: 11.5px`, `font-weight: 700`, `border: 1px solid var(--grey)`, `background: var(--grey-darker)`, `color: var(--grey-lighter)`, `cursor: pointer`, soft resting shadow so the button reads as raised

Hover: `color: rgb(var(--primary))`, `border-color: rgba(var(--primary), 0.5)`, glow via `drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1)`, shadow deepens

Disabled: `opacity: 0.45`, `cursor: not-allowed`, no elevation or glow, hover stays neutral

### Primary action button

Used for Play. `background: rgba(var(--primary), 0.16)`, `color: rgb(var(--primary))`, `border: 1px solid rgba(var(--primary), 0.35)`, `padding: 5px 12px`, `flex: 1`, `cursor: pointer`, soft resting shadow

Hover: `background: rgba(var(--primary), 0.28)`, `border-color: rgb(var(--primary))`, shadow deepens

### Preset toggle buttons

Default: `padding: 5px 6px`, `border-radius: 6px`, `font-size: 11.5px`, `font-weight: 600`, `border: 1px solid var(--grey)`, `background: var(--grey-dark)`, `color: var(--grey-light)`, `cursor: pointer`

Selected: `background: rgba(var(--primary), 0.16)`, `color: rgb(var(--primary))`, `border-color: rgba(var(--primary), 0.5)`

Hover: primary glow like playback buttons. Focus and active states follow the shared pattern above

## Steps

- Row: `padding: 5px 8px`, `border-radius: 6px`, `background: var(--grey-dark)`, `border: 1px solid transparent`. Clickable rows set `cursor: pointer` and carry a resting affordance (a subtle `var(--grey)` border) so clickability is visible before hover. Hover sets `border-color: rgba(var(--primary), 0.3)`
- Next pending step (active): `border-color: rgba(var(--primary), 0.6)`, `background: rgba(var(--primary), 0.08)`. Hover strengthens to `0.85` border and `0.13` background
- Completed step: `opacity: 0.55`, `pointer-events: none`, with a check mark in the badge
- Number badge: `18px` circle, `font-size: 10px`, `font-weight: 700`. Rest state uses `background: var(--grey-darker)` with `color: var(--grey-light)`. Active uses `background: rgb(var(--primary))` with `color: var(--grey-darker)`. Completed uses `background: var(--grey)` with `color: var(--grey-lighter)`
- LaTeX symbol tag: `font-size: 13.5px`, `font-weight: 700`, `color: rgb(var(--primary))`, `background: var(--grey-darker)`, `padding: 2px 7px`, `border-radius: 4px`, `min-width: 32px`

Step semantics: the next pending step is the only highlighted row. Applied steps get the tick and stay disabled. When the chain is done, no row is highlighted, because there is no next step, and the step forward button disables at the same moment

## Background Colors

- Cards, headers, and inset panels use `var(--grey-dark)`
- The canvas backdrop and other surfaces that are part of the visualization use `var(--grey-darker)`
- The canvas viewport: a passive container, `border: 1px solid var(--grey-dark)`, `border-radius: 10px`, `min-height: 380px`, transparent background so the wrap's `grey-darker` shows through. It is not interactive and uses the default cursor
- Floating labels over the canvas (legend, coordinate chip) use `var(--grey-dark)`

## Typography and KaTeX

Graph text follows the site's title/content convention from [UX Interaction Principles](/notes/ux-interaction-principles/). Titles and headers (the header title, step names, and section labels) use `var(--family-sans)`. Content, labels, and body copy (descriptions, captions, legends, matrix values) use `var(--family-serif)` to match the article's reading font.

Regular text scale:

| Element | Size | Font |
| :--- | :--- | :--- |
| Header title | 12.5px, weight 700 | sans |
| Step name | 12.5px, weight 700 | sans |
| Step description | 11px | serif |
| Buttons | 11.5px, weight 600 to 700 | serif |
| Description and body copy | 12px, line-height 1.5 | serif |
| Secondary rows | 11.5px | serif |
| Section labels | 10.5px, weight 700 | sans |
| Captions and legends | 10 to 10.5px | serif |
| Matrix values | 11px monospace | serif (monospace) |

Embedded LaTeX renders at `1.25em` relative to the parent font size, so math reads noticeably larger than surrounding text. Graph-scoped KaTeX rules must use `!important`, because the site-wide normalization (`0.88em !important` in the KaTeX partial) would otherwise win the cascade. Specific contexts override the size further: the canvas coordinate chip uses `1.15em` and step symbol tags use `1.25em`

## Conventions

- Radii: `12px` outer card, `10px` canvas viewport, `6px` inset cards, `5px` buttons, `4px` symbol chips, `50%` step badges
- Hover glow on interactive elements: `drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1)`
- Interactive elements set `cursor: pointer` and a soft resting elevation so clickability is visible at rest. Passive containers stay flat with the default cursor. See [UX Interaction Principles](/notes/ux-interaction-principles/)
- Transitions: `0.2s ease` on buttons, `0.25s ease` on step rows
- No uppercase text anywhere in a graph
- Interactive modules stay self-contained ES6 files with scoped styles injected into their mount element

---

## Modernization Checklist

When converting an existing graph (for example the Quaternion SLERP vs Euler LERP Flight Simulator) to this design system, apply these steps in order. Each step is self-contained so the graph stays working while you migrate it.

### 1. Widget frame

- Tailwind-first: replace every inline `style="..."` attribute with Tailwind classes. Inline styles are the last resort, used only where Tailwind cannot express the rule (range-input pseudo-elements, KaTeX overrides, code-token colors). The only remaining inline CSS lives in the scoped `<style>` block
- Wrap everything in the passive outer card: `tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden tw-font-sans`
- Header strip: `tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)] tw-px-3.5 tw-py-2.5`, title on the left (`tw-font-sans tw-text-sm tw-font-semibold tw-text-primary`), descriptor on the right (`tw-font-serif tw-text-sm tw-text-[var(--grey-light)]`)
- Body: `tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 tw-font-serif`, collapsing to one column below `860px`. Left column is controls (`tw-flex tw-flex-col tw-gap-2`), right column is the canvas

### 2. Border token

- Replace all hardcoded borders with `--ring-border` (`tw-border-[var(--ring-border)]`). The token resolves from theme CSS variables (`light: zinc-900/5`, `dark: white/10`) so it adapts between themes
- Resting interactive surfaces use the neutral ring border. Primary appears only on hover/active states, never at rest

### 3. Segmented control groups (presets, modes, radio groups)

- One flex row with `tw-border tw-border-[var(--ring-border)] tw-rounded-md tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden`
- Toggle state via a class-string swap. Define `*_BASE`, `*_ACTIVE`, `*_INACTIVE` constants and reassign `btn.className` on click (also reset siblings to `INACTIVE`). Active: `tw-bg-primary-soft tw-text-primary`; inactive: `tw-bg-transparent tw-text-[var(--grey-light)]`
- Rows stay compact: `tw-px-2.5 tw-py-1 tw-leading-none`, `tw-text-[0.8rem]`, `tw-font-semibold`
- Verify the row height against the surrounding controls: a segmented row should be about as tall as the buttons next to it, not taller. If it renders too tall, the culprit is usually line-height, not padding

### 4. Buttons (step back / play / step forward)

- Resting state: `tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-shadow-subtle`, hover: `hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft`
- Equal heights: wrap in `tw-flex tw-gap-1.5 tw-items-stretch`, buttons use `tw-flex-1` (play) and `tw-flex-none` (step buttons)
- Verify every button in a row shares the same height (prev/play/next), and that button rows line up with the segmented groups above them. Mismatch usually comes from inconsistent `py-*`, line-height, or missing `items-stretch`
- Play/pause is neutral at rest and only turns primary while playing (`tw-bg-primary-soft tw-border-primary-border tw-text-primary`). Swap both `className` and the icon (play triangle / pause bars) in the update callback

### 5. Custom slider

Tailwind cannot style `<input type="range">` internals, so a scoped `<style>` block is required:

- Track: `linear-gradient(to right, primary 0%, primary var(--range-fill), var(--ring-border) var(--range-fill), var(--ring-border) 100%)`, `8px` height, `999px` radius
- Thumb: `18px` circle, primary fill, `2px solid var(--grey)` border, `box-shadow: var(--elevation-subtle)` so it reads as draggable; hover adds a `4px` primary halo
- `:focus-visible` outline: `2px solid rgba(var(--primary), 0.6)` with offset
- Sync the fill from JS: set `--range-fill` as a percentage on the input element and call it on `input`, preset changes, and initialization

### 6. Typography audit and KaTeX

- Titles, headers, and section labels: sans. Body, descriptions, and labels: serif. Telemetry values: monospace. Canvas legends: `tw-text-[11px]` (one half-step below the `12px` body labels)
- Audit every nested component for font family and size, not just the obvious ones: section titles, labels, values, badges, legends, descriptions, code, and KaTeX. Each one must explicitly declare the right family (sans for headers, serif for body, mono for values) at the right size in the scale below. Shared-looking text (two labels, two values) must use identical classes
- Scoped KaTeX override when the widget body uses a smaller font: `#<widget-id> .katex { font-size: 0.8em !important; }`. `!important` is mandatory because the site-wide normalization (`0.88em !important` in the KaTeX partial) otherwise wins the cascade
- Code snippets: if `.content pre` (higher specificity) overrides a Tailwind size utility, scope the size with `#<widget-id> .<code-class> { font-size: 0.625rem; }` instead of relying on `text-xs`

### 7. Canvas and overlays

- Canvas container: `tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[320px] tw-overflow-hidden`
- Keep overlays minimal and `tw-pointer-events-none` so orbit controls are unaffected. Status pill at top-right, axis legend at bottom-left
- Prefer embedding live telemetry into the Three.js scene as `THREE.Sprite` labels (reuse `createTextSprite`, add an `updateTextSprite(sprite, text)` that caches the last text and regenerates the canvas texture only when it changes) over large DOM legends that cover the graph

### 8. Layout budget

- The full-width code card sits below the grid, so tall left-column cards push it below the fold. Remove or relocate bulky telemetry cards into the canvas instead of shrinking the code font
- Give variable-height text (preset descriptions) a `min-height` so the layout does not shift when the text length changes

### 9. Cleanup after DOM edits

- When removing a card or element, also remove its `querySelector` refs, the `updateUI` writes, and any KaTeX render loops that targeted it, plus now-unused helpers
- When `updateUI` reassigns `className` wholesale, keep positional Tailwind classes in a shared constant (for example `BADGE_POS`) and append it to every swapped class string, or they get dropped on the first state change

### 10. Verify against the UX principles page

Before calling the migration done, compare the widget side-by-side with the reference demo ("Two Columns: Controls Left, Canvas Right" in [UX Interaction Principles](/notes/ux-interaction-principles/)) and check every detail, not just the frame:

- Border colors and styles match across every nested component (ring border on interactive surfaces, subtle `grey-dark` on passive cards, no stray hardcoded hex borders)
- Hover states on control buttons behave identically (primary tint + glow) and resting states stay neutral
- Font family and size of every label, value, title, and legend match the demo
- Button and radio-group heights line up horizontally
- Spacing, radii, and gaps match the demo (`12px` frame, `10px` canvas, `6px` inset cards)
- The layout survives the mobile breakpoint (one column below `860px`) with no overflow
