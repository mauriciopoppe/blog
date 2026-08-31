---
title: "UX Interaction Principles"
summary: |
  The implementation reference for building UI. Design tokens, the typography and border conventions, the four interaction states, and the canonical two column widget layout, each shown with the CSS that implements it and a live example built from the real theme tokens.
tags: ["design", "design system", "ux"]
date: 2015-01-01T00:00:00Z
weight: 9999
---

This note is the implementation reference for building UI on this site. It covers the design tokens, the font and border conventions, the interaction states, and the canonical widget layout. Every rule is shown with the CSS that implements it and, where useful, a live example built from the real theme tokens so it adapts to light and dark themes.

## Design Tokens

All surfaces use the theme CSS custom properties. Never hardcode hex colors. The tokens resolve to theme-specific values, so the same markup works in light and dark themes. Use the token name, never a literal value.

| Token | Role | Example use |
| :--- | :--- | :--- |
| `var(--grey-darker)` | Deep canvas backdrop | Widget background, plot surface |
| `var(--grey-dark)` | Cards, headers, inset panels | Widget header, card background |
| `var(--ring-border)` | Outline that marks interactive surfaces and widget boundaries | Resting border on controls, clickable cards, widget frames; passive surfaces are borderless |
| `var(--grey)` | Mid-tone accents, completed badges | Badges, dividers |
| `var(--grey-light)` | Secondary text and captions | Descriptions, axis labels |
| `var(--grey-lighter)` | Primary text | Titles, emphasized labels |
| `rgb(var(--primary))` | Accent | Active states, hover, highlights |
| `var(--family-sans)` | Titles and headers | Widget title, card header |
| `var(--family-serif)` | Content, labels, body copy | Descriptions, plot labels, button text |

The swatches below are the tokens that matter most for surfaces. `--primary` renders as the accent on interactive elements, usually at reduced opacity.

<div id="ux-demo-tokens"></div>

## Implementing With Tailwind

The site builds on Tailwind. Express these rules as Tailwind utilities rather than raw CSS, so the markup stays consistent with the codebase. The raw CSS in this note describes the intent. In markup, prefer the site's custom utilities where they exist (for example `tw-text-primary` for `rgb(var(--primary))`) and arbitrary values for the rest.

```html
<!-- interactive card: ring outline + resting elevation mark it as clickable -->
<div class="tw-rounded-lg tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-cursor-pointer tw-shadow-[0_2px_6px_rgba(0,0,0,0.35)]">
  ...
</div>

<!-- passive card: flat surface, no border, no elevation -->
<div class="tw-rounded-lg tw-bg-[var(--grey-dark)]">
  ...
</div>
```

Where Tailwind utilities do not apply, write the rules inline on the node. This is most common for SVG. Presentation and layout that Tailwind does not cover go directly on the SVG element or its children, as presentation attributes or a `style` attribute.

```html
<svg style="border: 1px solid var(--grey-dark); font-family: var(--family-sans, system-ui, sans-serif);">
  <line stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2" />
  <text fill="var(--grey-light)" font-family="var(--family-serif, system-ui, serif)">label</text>
</svg>
```

## Typography: Titles Sans, Content Serif

Headers and titles use the sans family. Content, labels, and descriptions use the serif family to match the article body. A widget title and its section labels use `--family-sans`, while the descriptions, captions, and button text below them use `--family-serif`.

```css
.widget-title {
  font-family: var(--family-sans, system-ui, sans-serif);
}
.widget-description,
.widget-label {
  font-family: var(--family-serif, system-ui, serif);
}
```

<div id="ux-demo-typography"></div>

## Interactive and Passive Surfaces Differ

A passive surface is a flat `var(--grey-dark)` block with no border. An interactive surface starts from the same background but adds a `var(--ring-border)` outline, a resting elevation, a pointer cursor, and a chevron where one makes sense. The resting state carries no primary accent. The accent arrives only on hover and active states. This is the single most important rule: the ring border is reserved for what can be clicked, so the border itself carries the information. A static block has no border, and a clickable element does, which makes the interactive surfaces pop at a glance.

```css
.passive-panel {
  background: var(--grey-dark);
  border: none; /* passive surfaces are borderless */
  cursor: default;
}
.interactive-card {
  background: var(--grey-dark);
  border: 1px solid var(--ring-border); /* the outline marks the surface as clickable */
  cursor: pointer;
  box-shadow: var(--elevation-raised); /* resting drop shadow, more elevated than passive */
}
.interactive-card:hover {
  border-color: var(--accent-border);
  background: var(--accent-tint);
  box-shadow: var(--elevation-deep); /* hover raises elevation by one level */
}
.card-active {
  background: rgba(var(--primary), 0.16);
  border: 1px solid rgb(var(--primary)); /* solid primary, signals the current or selected card */
  color: var(--grey-lighter);
  box-shadow: var(--elevation-raised);
}
```

The live example below uses the same classes. Cards share the same background, but the states read differently. The passive card is inert, flat, borderless, and default-cursor. The interactive card reads as clickable through its ring outline, raised shadow, pointer cursor, and chevron. The active card is the current page or selected item, marked with a solid primary border and a primary-tinted background.

<div id="ux-demo-surfaces"></div>

Shadows come from an elevation scale, `--elevation-subtle` through `--elevation-deep`, defined per theme so they adapt to light and dark. The shadows are pure drop shadows with no inner top edge, so they do not stack with the `--ring-border` outline into a double line. Hover raises an element by one level, so there is no separate `-hover` token to keep in sync. In dark mode the tokens rely on a stronger black shadow, since a black shadow alone can be easy to miss against a dark background. In light mode they use a soft black shadow instead, strong enough to read as raised but not to dominate the page.

Use one interaction language everywhere. If one clickable card uses a neutral resting surface, a raised shadow, and a pointer cursor, then every clickable card should. Users learn the language once and trust it.

## Four Interaction States

Every interactive element defines default, hover, focus, and active, and a disabled state where it applies. Each state is distinct from the resting state. The default stays neutral with the subtle ring outline. The accent arrives on hover. Focus shows a visible ring for keyboard users. Active presses the element down.

All interactive elements share one hover language. On hover the element moves toward the primary accent and its surface takes a subtle primary tint. Raised surfaces (buttons, cards, toggles) also deepen their elevation shadow. Inline text links glow instead, because they have no surface to tint. The CSS below is the pattern to follow.

```css
.ctrl {
  font-family: var(--family-serif, system-ui, serif);
  font-size: 0.85rem;
  background: var(--grey-dark);
  border: 1px solid var(--ring-border); /* neutral at rest */
  color: var(--grey-light);
  cursor: pointer;
  box-shadow: var(--elevation-subtle);
}
.ctrl:hover {
  color: rgb(var(--primary));
  border-color: var(--accent-border);
  background: var(--accent-tint);
  box-shadow: var(--elevation-raised);
  filter: none;
}
.ctrl:focus-visible {
  outline: 2px solid rgba(var(--primary), 0.6);
  outline-offset: 2px;
}
.ctrl:active {
  background: rgba(var(--primary), 0.16);
  color: rgb(var(--primary));
  border-color: var(--accent-border);
  box-shadow: var(--elevation-subtle);
  transform: translateY(1px);
}
.ctrl:disabled,
.ctrl:disabled:hover {
  opacity: 0.45;
  cursor: not-allowed;
  box-shadow: none;
  filter: none;
  transform: none;
  color: var(--grey-light);
  border-color: var(--ring-border);
}
```

The buttons below show each state in turn.

<div id="ux-demo-states"></div>

## Tags and Pills

Tags are compact pills for categories, series badges, and status. They follow the same interactive and passive rules and the same state model as buttons, but at a smaller size. A neutral tag is informational and inert. A selectable or dismissible tag stays neutral at rest and shows the accent on hover and active states.

```css
.tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  font-family: var(--family-serif, system-ui, serif);
  font-size: 0.72rem;
  font-weight: 600;
}
.tag-neutral {
  background: var(--grey-dark);
  border: 1px solid var(--grey-dark); /* same color as the surface, invisible; keeps pill height equal to bordered tags */
  color: var(--grey-light);
}
.tag-primary {
  background: var(--grey-dark); /* same surface as buttons */
  border: 1px solid var(--ring-border); /* neutral at rest */
  color: var(--grey-light);
  cursor: pointer;
  box-shadow: var(--elevation-subtle);
}
.tag-primary:hover {
  color: rgb(var(--primary));
  border-color: var(--accent-border);
  background: var(--accent-tint);
  box-shadow: var(--elevation-raised);
}
.tag:focus-visible {
  outline: 2px solid rgba(var(--primary), 0.6);
  outline-offset: 2px;
}
.tag-active {
  background: rgba(var(--primary), 0.16);
  color: rgb(var(--primary));
  border-color: var(--accent-border);
  box-shadow: var(--elevation-subtle);
}
```

<div id="ux-demo-tags"></div>

## Single-Select Controls (Radio / Segmented)

A single-select control lets the user pick exactly one option from a group. Each option is a ctrl: focusable, hover shows the accent, and the selected option uses the active state. Only one option is selected at a time, so selecting one clears the others.

```css
.radio-group {
  display: inline-flex;
  border: 1px solid var(--ring-border);
  border-radius: 6px;
  background: var(--grey-dark);
  box-shadow: var(--elevation-subtle);
  overflow: hidden;
}
.radio-option {
  appearance: none;
  font-family: var(--family-serif, system-ui, serif);
  font-size: 0.8rem;
  font-weight: 600;
  padding: 6px 12px;
  background: transparent;
  color: var(--grey-light);
  cursor: pointer;
}
.radio-option:hover {
  color: rgb(var(--primary));
  background: var(--accent-tint);
  filter: none;
}
.radio-option:focus-visible {
  outline: 2px solid rgba(var(--primary), 0.6);
  outline-offset: -2px;
}
.radio-option.is-selected {
  background: rgba(var(--primary), 0.16);
  color: rgb(var(--primary));
}
```

<div id="ux-demo-radio"></div>

## Slider

A range slider is a single-value control. The track shows the filled portion in the primary accent, and the thumb is a primary circle. The states follow the shared model: default, hover, focus, active, and disabled. On hover the thumb gains a soft primary halo, and on focus it shows a visible ring.

```css
.range {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 22px;
  background: transparent;
  cursor: pointer;
  --range-fill: 50%;
}
.range::-webkit-slider-runnable-track {
  height: 6px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    rgb(var(--primary)) 0%,
    rgb(var(--primary)) var(--range-fill),
    var(--ring-border) var(--range-fill),
    var(--ring-border) 100%
  );
}
.range::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(var(--primary));
  border: 2px solid var(--grey);
  margin-top: -5px;
  box-shadow: var(--elevation-subtle);
}
.range::-moz-range-track {
  height: 6px;
  border-radius: 999px;
  background: var(--ring-border);
}
.range::-moz-range-progress {
  height: 6px;
  border-radius: 999px;
  background: rgb(var(--primary));
}
.range::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgb(var(--primary));
  border: 2px solid var(--grey);
  box-shadow: var(--elevation-subtle);
}
.range:hover::-webkit-slider-thumb,
.range-hover::-webkit-slider-thumb {
  box-shadow: 0 0 0 4px rgba(var(--primary), 0.15);
}
.range:hover::-moz-range-thumb,
.range-hover::-moz-range-thumb {
  box-shadow: 0 0 0 4px rgba(var(--primary), 0.15);
}
.range:focus-visible,
.range-focus {
  outline: 2px solid rgba(var(--primary), 0.6);
  outline-offset: 2px;
  border-radius: 999px;
}
.range:disabled,
.range:disabled:hover {
  opacity: 0.45;
  cursor: not-allowed;
}
```

<div id="ux-demo-slider"></div>

## Text Input

A text input follows the same surface and border rules as the other controls. The resting state is a neutral `var(--ring-border)` outline on `var(--grey-dark)`. Focus shows a visible ring and a primary border. The placeholder text uses the mid-tone grey, and the disabled state dims the field.

```css
.input-field {
  font-family: var(--family-serif, system-ui, serif);
  font-size: 0.85rem;
  line-height: 1.25;
  padding: 6px 12px;
  border-radius: 6px;
  background: var(--grey-dark);
  border: 1px solid var(--ring-border);
  color: var(--grey-light);
  box-shadow: var(--elevation-subtle);
  width: 100%;
}
.input-field::placeholder {
  color: var(--grey-light);
  opacity: 0.6;
}
.input-field:hover:not(:disabled),
.input-field-hover {
  border-color: var(--accent-border);
}
.input-field:focus-visible,
.input-field-focus {
  outline: 2px solid rgba(var(--primary), 0.6);
  outline-offset: 2px;
  border-color: var(--accent-border);
}
.input-field:disabled,
.input-field:disabled:hover {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: var(--ring-border);
  box-shadow: none;
}
```

<div id="ux-demo-input"></div>

## Dropdown / Select

A select dropdown lets the user choose one option from a collapsible list. Like other controls, it uses a neutral `var(--ring-border)` border on `var(--grey-dark)` at rest. Hover brightens the border, and focus displays the primary focus ring.

```css
.select-field {
  appearance: none;
  -webkit-appearance: none;
  font-family: var(--family-serif, system-ui, serif);
  font-size: 0.85rem;
  line-height: 1.25;
  padding: 6px 30px 6px 12px;
  border-radius: 6px;
  background: var(--grey-dark);
  border: 1px solid var(--ring-border);
  color: var(--grey-light);
  box-shadow: var(--elevation-subtle);
  width: 100%;
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}
.select-field:hover:not(:disabled) {
  border-color: var(--accent-border);
  color: var(--grey-lighter);
}
.select-field:focus-visible {
  outline: 2px solid rgba(var(--primary), 0.6);
  outline-offset: 2px;
  border-color: var(--accent-border);
}
.select-field:disabled,
.select-field:disabled:hover {
  opacity: 0.45;
  cursor: not-allowed;
  border-color: var(--ring-border);
  color: var(--grey-light);
  box-shadow: none;
}
```

<div id="ux-demo-select"></div>

## Links

Text links use the `<a>` node. Inline links are primary colored with an underline. They follow the same state model as other interactive elements. Hover brightens the link, and focus shows a visible ring.

```css
a {
  color: rgb(var(--primary));
  text-decoration: underline;
  text-underline-offset: 3px;
}
a:hover {
  color: rgb(var(--primary));
  filter: drop-shadow(var(--link-glow));
}
a:focus-visible {
  outline: 2px solid rgba(var(--primary), 0.6);
  outline-offset: 2px;
}
```

<div id="ux-demo-links"></div>

## Accessibility Is Not Optional

Clickable elements must be focusable and operable with the keyboard. Provide a visible focus ring that is distinct from the hover state. Never rely on color alone to convey interactivity. Pair color with a surface or cursor change.

<div id="ux-demo-accessibility"></div>

## Widgets

Widgets combine the rules above into a reusable component. A widget is a wrapper for content: an outer card with a header strip and a body slot. Every example follows the interaction, typography, and border conventions already defined in this note. As more widgets are built, add their patterns here.

### Widget Frame

A widget frame wraps content in an outer card with a header. The header uses a distinct surface (`var(--grey-dark)`) so it reads as a title bar against the deeper body surface (`var(--grey-darker)`), and the title text uses the primary accent. The title sits on the left and an optional descriptor on the right. The body is a slot that takes any content.

```html
<div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
  <header class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
    <div class="tw-font-sans tw-text-sm tw-font-semibold tw-leading-tight tw-text-primary">Widget title</div>
    <div class="tw-text-sm tw-leading-tight tw-text-[var(--grey-light)]">Optional descriptor</div>
  </header>
  <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5">
    ...body content...
  </div>
</div>
```

<div id="ux-demo-widget-frame"></div>

### Metric Card

A metric card is a compact passive surface that presents a single number with a small title above it and an optional caption below. It is used in grids to give a dashboard-style overview. Because the card is passive, it is a flat `var(--grey-dark)` block with no border. The card centers its content: the title and caption use the serif content font, and the value uses the sans family so numerals stay legible at a glance. The value picks up the accent or a status color when it needs emphasis.

```html
<div class="tw-bg-[var(--grey-dark)] tw-rounded-lg tw-px-2.5 tw-py-2 tw-flex tw-flex-col tw-items-center tw-justify-center tw-text-center">
  <div class="tw-text-[0.75rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Util (theoretical)</div>
  <div class="tw-font-sans tw-text-[1rem] tw-font-semibold tw-text-[var(--grey-lighter)]">75.0%</div>
  <div class="tw-text-[0.65rem] tw-text-[var(--grey-light)] tw-whitespace-nowrap">Cap: 4.0 req/s</div>
</div>
```

<div id="ux-demo-metric-card"></div>

### Step Playback Control

Step playback bars control time-series, multi-phase transformation pipelines, and animations. The control groups four actions: Reset to origin (`↺`), Step back (`⏮`), Play/Pause/Replay (`▶ Play` / `⏸ Pause` / `↺ Replay`), and Step forward (`⏭`).

At the boundaries, actions that cannot execute are disabled:
- **Step Back & Reset** are disabled when at the start / origin step.
- **Step Forward** is disabled when at the final completed step.
- **Disabled state** uses `opacity: 0.45`, `cursor: not-allowed`, and suppresses hover shadows and filter glows (`disabled:tw-shadow-none disabled:hover:tw-shadow-none disabled:hover:tw-filter-none`).

```html
<div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-gap-1.5 tw-items-stretch">
  <button type="button" class="tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-shadow-none disabled:hover:tw-filter-none" title="Reset to Start" disabled>↺</button>
  <button type="button" class="tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised disabled:tw-opacity-45 disabled:tw-cursor-not-allowed disabled:tw-shadow-none disabled:hover:tw-shadow-none disabled:hover:tw-filter-none" title="Step Back" disabled>⏮</button>
  <button type="button" class="tw-flex-1 tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center tw-gap-1 hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised"><span>▶ Play</span></button>
  <button type="button" class="tw-flex-none tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-px-2.5 tw-py-1.5 tw-rounded-md tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-cursor-pointer tw-shadow-subtle tw-flex tw-items-center tw-justify-center hover:tw-border-primary hover:tw-text-primary hover:tw-bg-primary-soft hover:tw-shadow-raised" title="Step Forward">⏭</button>
</div>
```

<div id="ux-demo-step-control"></div>

### Two Columns: Controls Left, Canvas Right

The canonical two column widget applies the widget frame with a two column body. The left column holds the controls form (text input, segmented single-select mode toggle, select dropdown, progress slider, and playback controls), while the right column holds the canvas with overlay readouts (top-left mode/progress badge, bottom-left legend, and bottom-right minimap).

A card with a title within the left panel presents secondary status, telemetry, or preset summaries cleanly with an inset header.

```html
<div class="tw-my-7 tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[12px] tw-overflow-hidden">
  <header class="tw-flex tw-items-center tw-justify-between tw-gap-2 tw-flex-wrap tw-px-3.5 tw-py-2.5 tw-bg-[var(--grey-dark)] tw-border-b tw-border-[var(--ring-border)]">
    <div class="tw-font-sans tw-text-sm tw-font-semibold tw-leading-tight tw-text-primary">Quaternion SLERP vs Euler LERP Flight Simulator</div>
    <div class="tw-text-sm tw-leading-tight tw-text-[var(--grey-light)]">3D Geodesic vs Decoupled Interpolation</div>
  </header>
  <div class="tw-grid tw-grid-cols-[335px_1fr] tw-gap-2.5 tw-p-2.5 max-[860px]:tw-grid-cols-1">
    <form class="tw-flex tw-flex-col tw-gap-3">
      <div class="tw-flex tw-flex-col tw-gap-1">
        <label class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]" for="widget-name">Simulation name</label>
        <input class="input-field" id="widget-name" type="text" placeholder="e.g. quaternion slerp">
      </div>
      <div class="tw-flex tw-flex-col tw-gap-1">
        <span class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]">Interpolation</span>
        <div class="tw-flex tw-w-full tw-border tw-border-[var(--ring-border)] tw-rounded-[6px] tw-bg-[var(--grey-dark)] tw-shadow-subtle tw-overflow-hidden">
          <button type="button" class="tw-flex-1 tw-text-center tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-leading-none tw-px-[8px] tw-py-[5px] tw-cursor-pointer tw-bg-primary-soft tw-text-primary">Quaternion SLERP</button>
          <button type="button" class="tw-flex-1 tw-text-center tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-leading-none tw-px-[8px] tw-py-[5px] tw-cursor-pointer tw-bg-transparent tw-text-[var(--grey-light)]">Euler Angle LERP</button>
        </div>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-1">
        <label class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]" for="widget-preset">Flight path preset</label>
        <select class="select-field" id="widget-preset">
          <option value="gimbal">Gimbal 90°</option>
          <option value="flip">Aerobatic Flip</option>
          <option value="turn">Banked Turn</option>
        </select>
      </div>
      <div class="tw-flex tw-flex-col tw-gap-1">
        <div class="tw-flex tw-items-center tw-justify-between">
          <label class="tw-font-sans tw-text-[0.7rem] tw-tracking-[0.04em] tw-text-[var(--grey-light)]" for="widget-t">Progress</label>
          <span class="tw-font-serif tw-text-[0.8rem] tw-font-semibold tw-text-primary">t = 0.00</span>
        </div>
        <input type="range" class="range" id="widget-t" min="0" max="1" step="0.01" value="0" style="--range-fill: 0%">
      </div>
      <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-px-2.5 tw-py-2 tw-flex tw-gap-1.5 tw-items-stretch">
        <button type="button" class="ctrl-btn" title="Reset to Start" disabled>↺</button>
        <button type="button" class="ctrl-btn" title="Step Back" disabled>⏮</button>
        <button type="button" class="play-btn"><span>▶ Play Flight</span></button>
        <button type="button" class="ctrl-btn" title="Step Forward">⏭</button>
      </div>
      <button type="button" class="tw-w-full tw-font-serif tw-text-[0.85rem] tw-font-semibold tw-leading-none tw-px-[8px] tw-py-[5px] tw-rounded-[6px] tw-border tw-border-[var(--ring-border)] tw-bg-[var(--grey-dark)] tw-text-[var(--grey-light)] tw-cursor-pointer tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-bg-primary-soft hover:tw-text-primary hover:tw-shadow-raised hover:tw-filter-none">&#9654; Launch simulation</button>
      
      <!-- Passive card with title -->
      <div class="tw-bg-[var(--grey-dark)] tw-rounded-md tw-overflow-hidden">
        <div class="tw-font-sans tw-text-[0.72rem] tw-font-semibold tw-tracking-[0.04em] tw-leading-tight tw-text-primary tw-px-3 tw-py-1.5 tw-border-b tw-border-[var(--ring-border)] tw-flex tw-justify-between tw-items-center">
          <span>Configuration Summary</span>
          <span class="tw-font-mono tw-text-[0.65rem] tw-text-[var(--grey-light)]">Geodesic S³</span>
        </div>
        <div class="tw-font-serif tw-text-[0.8rem] tw-leading-relaxed tw-text-[var(--grey-light)] tw-p-3">
          90° pitch rotation maintaining constant angular velocity along the geodesic arc.
        </div>
      </div>
    </form>
    <div class="tw-relative tw-bg-[var(--grey-darker)] tw-border tw-border-[var(--ring-border)] tw-rounded-[10px] tw-min-h-[320px] tw-overflow-hidden">
      <div class="tw-absolute tw-top-2 tw-left-2 tw-flex tw-items-center tw-gap-1.5 tw-bg-[var(--grey-dark)] tw-rounded-[6px] tw-px-2.5 tw-py-1.5 tw-font-sans tw-text-[11px] tw-text-[var(--grey-light)]">
        <span class="tw-font-semibold tw-text-primary">Quaternion SLERP</span>
        <span class="tw-text-[var(--grey)]">/</span>
        <span>t = 0.00</span>
      </div>
      <div class="tw-absolute tw-bottom-2 tw-left-2 tw-flex tw-items-center tw-gap-3 tw-bg-[var(--grey-dark)] tw-rounded-[6px] tw-px-2.5 tw-py-1.5 tw-font-sans tw-text-[11px] tw-text-[var(--grey-light)]">
        <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-h-2 tw-w-2 tw-rounded-full" style="background: rgb(var(--primary))"></span>Body</span>
        <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-h-2 tw-w-2 tw-rounded-full" style="background: var(--grey-light)"></span>Path</span>
        <span class="tw-flex tw-items-center tw-gap-1"><span class="tw-h-2 tw-w-2 tw-rounded-full" style="background: var(--grey)"></span>Axis</span>
      </div>
      <div class="tw-absolute tw-bottom-2 tw-right-2 tw-flex tw-h-16 tw-w-24 tw-items-center tw-justify-center tw-bg-[var(--grey-dark)] tw-rounded-[6px] tw-font-sans tw-text-[10px] tw-text-[var(--grey-light)]">Minimap</div>
    </div>
  </div>
</div>
```

<div id="ux-demo-layout"></div>

<script type="module" src="/js/design/ux-principles-demo.js"></script>
