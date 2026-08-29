# Interactive Computer Graphics Graph Spec

## Purpose

This spec defines the visual language for interactive 3D graph explorers in the computer graphics notes. The reference implementation is the Coordinate Frames & Camera View Transform explorer at `site/static/js/computer-graphics/coordinate-frame-explorer.js`. New graphs should reproduce its structure and styling, and existing graphs should converge on these values.

## Design Tokens

Graphs use the theme CSS custom properties from the site design system. Never hardcode hex colors.

| Token | Role in graphs |
| :--- | :--- |
| `--primary` | Accent color for titles, active states, and highlights |
| `--grey-darker` | Canvas backdrop and deep surfaces |
| `--grey-dark` | Cards, headers, and inset panels |
| `--grey` | Completed step badges and subtle borders |
| `--grey-light` | Secondary text and captions |
| `--grey-lighter` | Primary text |
| `--family-sans` | All graph text |

## Card Container

- Outer card: `background: var(--grey-darker)`, `border: 1px solid var(--grey-dark)`, `border-radius: 12px`, `overflow: hidden`, `margin: 1.75rem 0`
- Body grid: two columns of `335px` and `1fr`, `gap: 12px`, `padding: 12px`. The grid collapses to one column below `860px`
- The header is a full-width strip inside the card with no gaps at the edges, so its background reaches the rounded corners

## Header

- `background: var(--grey-dark)`, `padding: 10px 14px`, `border-bottom: 1px solid var(--grey-dark)`
- Title on the left: `12.5px`, `font-weight: 700`, `letter-spacing: 0.08em`, `color: rgb(var(--primary))`, with a leading `15px` stroke SVG icon at `6px` gap. The icon uses `currentColor` so it matches the title color
- Subtitle or badge on the right: `11px`, `letter-spacing: 0.04em`, `color: var(--grey-light)`
- No uppercase. Graph text renders as written

## Buttons

### Playback buttons

Base state: `padding: 5px 8px`, `border-radius: 5px`, `font-size: 11.5px`, `font-weight: 700`, `border: 1px solid rgba(255, 255, 255, 0.06)`, `background: var(--grey-darker)`, `color: var(--grey-lighter)`

Hover state: `color: rgb(var(--primary))`, `border-color: rgba(var(--primary), 0.5)`, glow via `drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1)`

Disabled state: `opacity: 0.45`, `cursor: not-allowed`. Hover stays neutral with no glow

### Primary action button

Used for Play. `background: rgba(var(--primary), 0.16)`, `color: rgb(var(--primary))`, `border: 1px solid rgba(var(--primary), 0.35)`, `padding: 5px 12px`, `flex: 1`

Hover state: `background: rgba(var(--primary), 0.28)`, `border-color: rgb(var(--primary))`

### Preset toggle buttons

Base state: `padding: 5px 6px`, `border-radius: 6px`, `font-size: 11.5px`, `font-weight: 600`, `border: 1px solid var(--grey-dark)`, `background: var(--grey-dark)`, `color: var(--grey-light)`

Selected state: `background: rgba(var(--primary), 0.16)`, `color: rgb(var(--primary))`, `border-color: rgba(var(--primary), 0.5)`

Hover state: primary glow like playback buttons

## Steps

- Row: `padding: 5px 8px`, `border-radius: 6px`, `background: var(--grey-dark)`, `border: 1px solid transparent`. Hover sets `border-color: rgba(var(--primary), 0.3)`
- Next pending step (active): `border-color: rgba(var(--primary), 0.6)`, `background: rgba(var(--primary), 0.08)`. Hover strengthens to `0.85` border and `0.13` background
- Completed step: `opacity: 0.55`, `pointer-events: none`, with a check mark in the badge
- Number badge: `18px` circle, `font-size: 10px`, `font-weight: 700`. Rest state uses `background: var(--grey-darker)` with `color: var(--grey-light)`. Active uses `background: rgb(var(--primary))` with `color: var(--grey-darker)`. Completed uses `background: var(--grey)` with `color: var(--grey-lighter)`
- LaTeX symbol tag: `font-size: 13.5px`, `font-weight: 700`, `color: rgb(var(--primary))`, `background: var(--grey-darker)`, `padding: 2px 7px`, `border-radius: 4px`, `min-width: 32px`

Step semantics: the next pending step is the only highlighted row. Applied steps get the tick and stay disabled. When the chain is done, no row is highlighted, because there is no next step, and the step forward button disables at the same moment

## Background Colors

- Cards, headers, and inset panels use `var(--grey-dark)`
- The canvas backdrop and other surfaces that are part of the visualization use `var(--grey-darker)`
- The canvas viewport: `border: 1px solid var(--grey-dark)`, `border-radius: 10px`, `min-height: 380px`, transparent background so the wrap's `grey-darker` shows through
- Floating labels over the canvas (legend, coordinate chip) use `var(--grey-dark)`

## Typography and KaTeX

Regular text scale:

| Element | Size |
| :--- | :--- |
| Header title | 12.5px, weight 700 |
| Step name | 12.5px, weight 700 |
| Step description | 11px |
| Buttons | 11.5px, weight 600 to 700 |
| Description and body copy | 12px, line-height 1.5 |
| Secondary rows | 11.5px |
| Section labels | 10.5px, weight 700 |
| Captions and legends | 10 to 10.5px |
| Matrix values | 11px monospace |

Embedded LaTeX renders at `1.25em` relative to the parent font size, so math reads noticeably larger than surrounding text. Graph-scoped KaTeX rules must use `!important`, because the site-wide normalization (`0.88em !important` in the KaTeX partial) would otherwise win the cascade. Specific contexts override the size further: the canvas coordinate chip uses `1.15em` and step symbol tags use `1.25em`

## Conventions

- Radii: `12px` outer card, `10px` canvas viewport, `6px` inset cards, `5px` buttons, `4px` symbol chips, `50%` step badges
- Hover glow on interactive elements: `drop-shadow(0px 0px 4px rgba(var(--primary), 0.35)) brightness(1.1)`
- Transitions: `0.2s ease` on buttons, `0.25s ease` on step rows
- No uppercase text anywhere in a graph
- Interactive modules stay self-contained ES6 files with scoped styles injected into their mount element
