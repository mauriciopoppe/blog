# SVG Diagram Style Specification

This document defines the canonical visual design system, color palette, container metrics, and typography tokens for all inline SVG diagrams across the site.

Interactive widgets and diagrams follow the interaction model in [UX Interaction Principles](/notes/ux-interaction-principles/) (affordance in the resting state, distinct interactive vs passive surfaces, and the four interaction states). This document layers the visual and typography rules on top of those principles.

---

## 1. Outer Container & Framing

All diagrams are wrapped in a responsive `<svg>` element with a dark canvas background and generous padding:

```html
<svg viewBox="0 0 840 280" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid var(--grey-dark); box-sizing: border-box; margin: 1.5rem 0;">
  <!-- Zero blank lines inside SVG (Hugo Goldmark rule) -->
</svg>
```

### Key Metrics
- **Border**: `1px solid var(--grey-dark)` (a theme token, never a bright translucent-white `border: <n>px solid rgba(255, 255, 255, <opacity>)`). See "Border Rule" below.
- **Background**: `var(--grey-darker)`
- **Border Radius**: `12px`
- **Internal Padding**: `16px`
- **Vertical Margin**: `1.5rem 0`

### Border Rule: Prefer the Default Border

Never hardcode a bright translucent-white border with the `border` shorthand (for example `border: 1px solid rgba(255, 255, 255, 0.08)`). Tailwind's preflight already sets a default border on every element, `border: 0 solid #e5e7eb`, so the border value you need already exists. A full `border` declaration overrides that default and introduces a bright edge that does not adapt between the light and dark themes.

- **Default border**: The Tailwind base layer applies `*, ::before, ::after { border: 0 solid #e5e7eb; }` to all elements. Build on it. When a visible edge is genuinely required, adjust only `border-width` and `border-color` (or use theme tokens like `var(--grey)` / `var(--grey-dark)`), never a full bright `border` shorthand.
- **Avoid**: `border: 1px solid rgba(255, 255, 255, <opacity>)` in inline styles, JS widgets, or `<svg>` style attributes. Bright white borders look harsh and do not carry over to the light theme.
- **Inside SVG**: Use `stroke="rgba(255, 255, 255, 0.15)"` (as defined in the Color System) on `<rect>` / `<path>` shapes for subtle framing, not a CSS `border` on the container element.

---

## 2. Inset Panels & Layout Grid

Nested cards, sub-panels, and comparison columns are passive surfaces, so they use a flat `var(--grey-dark)` fill with no stroke. The fill contrast against the `var(--grey-darker)` canvas separates them from the frame, following the passive-surfaces-are-borderless rule in [UX Interaction Principles](/notes/ux-interaction-principles/). Only interactive or active cards carry a stroke:

```html
<!-- Standard Inset Card (passive, borderless) -->
<rect x="12" y="12" width="378" height="216" rx="8" fill="var(--grey-dark)" />

<!-- Interactive Inset Card (clickable, subtle ring stroke) -->
<rect x="12" y="12" width="378" height="216" rx="8" fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" cursor="pointer" />

<!-- Highlighted / Active Card (Primary Tint) -->
<rect x="402" y="12" width="386" height="216" rx="8" fill="rgba(var(--primary), 0.08)" stroke="rgba(var(--primary), 0.45)" stroke-width="1.2" />
```

### Full-Width Space Utilization & Framing
- **No Floating/Dead Margins**: The visual content must fully occupy the available canvas area edge-to-edge inside the outer frame padding (`12px` to `16px`).
- **Multi-Column Panels**: Side-by-side comparisons or graph + table layouts should wrap each column in a structured inset card (`fill="var(--grey-dark)" rx="8"`, no stroke), separated by a uniform `12px` gap. Interactive columns that must read as clickable use the subtle ring stroke above.

### Badge / Pill Chips
- **Primary Pill**: `<rect fill="rgba(var(--primary), 0.15)" rx="4" />` with text `fill="rgb(var(--primary))" font-size="11" font-weight="700"`
- **Emerald Pill**: `<rect fill="rgba(52, 211, 153, 0.12)" rx="4" />` with text `fill="#34d399" font-size="11" font-weight="700"`
- **Amber Pill**: `<rect fill="rgba(251, 191, 36, 0.12)" rx="4" />` with text `fill="#fbbf24" font-size="11" font-weight="700"`

---

## 3. Color System

Never use raw high-saturation neon primaries (avoid electric cyan `#38bdf8` or oversaturated reds). Use the site's harmonious theme palette:

| Role | Color Value | Usage |
| :--- | :--- | :--- |
| **Primary Accent** | `rgb(var(--primary))` / `rgba(var(--primary), 0.15)` | Primary data series, key vectors, active focus items |
| **Warning / Secondary** | `#ffa726` / `#fbbf24` / `rgba(251, 191, 36, 0.12)` | Tail latency, rotation axes, intermediate stages |
| **Success / Clean** | `#34d399` / `#22c55e` / `rgba(52, 211, 153, 0.12)` | Geodesics, target markers, baseline metrics |
| **Danger / High Tail** | `#ff7043` / `#ef4444` | Saturation cliff, failure modes, error paths |
| **Primary Text** | `var(--grey-lighter)` | Card headers, main metrics, emphasized labels |
| **Secondary Text** | `var(--grey-light)` | Axis labels, units, descriptions, formulas |
| **Axes & Gridlines** | `rgba(255, 255, 255, 0.15)` (`stroke-width="1.2"`) | Coordinate axes, division lines |
| **Dashed Guides** | `rgba(255, 255, 255, 0.15)` (`stroke-dasharray="2 2"`) | Threshold projections, bounding limits |

---

## 4. Typography Scale & LaTeX Sizing

All text elements must explicitly declare a `font-family` (inherited from the root SVG) with standard font weights, following the site's convention that titles and content use different fonts:

### Title vs. Content Font
- **Titles & headers** (panel section headers, card titles, axis titles, widget titles): `font-family="var(--family-sans, system-ui, sans-serif)"`.
- **Content & labels** (descriptions, data labels, axis tick values, micro annotations, and other body text): `font-family="var(--family-serif, system-ui, serif)"` to match the article's reading font.

| Element | Font Size | Weight | Color |
| :--- | :--- | :--- | :--- |
| **Panel Section Header** | `13px` - `14px` | `700` | `var(--grey-lighter)` (often uppercase) |
| **Subtitle / Subheader** | `12px` | `400` / `600` | `var(--grey-light)` |
| **Data Label / Formula** | `12px` - `12.5px` | `600` | `var(--grey-lighter)` or accent color |
| **Axis Ticks & Units** | `11px` - `11.5px` | `600` | `var(--grey-light)` |
| **Micro Annotations / Footnotes** | `10px` - `10.5px` | `400` | `var(--grey-light)` |

### LaTeX / Math Font Sizing in Graphs & Diagrams
- **Prefer Native Regular Text**: Always use native SVG `<text>` and `<tspan>` for English prose, card titles, section headers, bullet lists, descriptions, and basic labels. Never wrap ordinary English sentences or titles in `$\text{...}$`.
- **Targeted LaTeX Usage**: Use KaTeX / `<foreignObject>` only where genuine mathematical notation (fractions $\frac{a}{b}$, vector notations $\mathbf{v}_\perp$, complex products $q \mathbf{v} q^*$, transformations $\mathbf{R}(q)$) cannot be cleanly expressed with standard typography.
- **Font Sizing for LaTeX**: When KaTeX is used, formulas in diagrams and interactive widgets render at `1.25em !important` (inline) and `1.35em !important` (display) to keep subscripts and symbols easily legible:
  ```css
  svg foreignObject .katex,
  [class*="-sim-wrap"] .katex,
  [id*="-explorer"] .katex {
    font-size: 1.25em !important;
  }
  ```

---

## 5. Markers & Arrowheads

Define markers in `<defs>` with dedicated IDs using the canonical palette:

```html
<defs>
  <marker id="arrow-primary" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
    <path d="M0,1 L7,4 L0,7 Z" fill="rgb(var(--primary))" />
  </marker>
  <marker id="arrow-amber" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
    <path d="M0,1 L7,4 L0,7 Z" fill="#fbbf24" />
  </marker>
  <marker id="arrow-emerald" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
    <path d="M0,1 L7,4 L0,7 Z" fill="#34d399" />
  </marker>
  <marker id="arrow-axis" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
    <path d="M0,1 L7,4 L0,7 Z" fill="rgba(255, 255, 255, 0.45)" />
  </marker>
</defs>
```

---

## 6. Goldmark Parser Rules (Mandatory)
- **Zero empty lines**: An empty line inside `<svg> ... </svg>` breaks Hugo's Markdown parser. Use XML comments on contiguous lines if visual separation is needed.
- **Never use `<foreignObject>` for simple labels**: Use native SVG `<text>` and `<tspan>` for scalable, crisp cross-platform rendering.

---

## 7. Interactive 3D Visualizers & Canvas Labels

When building interactive Three.js / WebGL widgets:

- **Always Use Native WebGL Text Sprites (`THREE.Sprite`)**:
  - Never use HTML `div` overlay elements for in-canvas 3D geometry labels. HTML overlays cause layout thrashing (`clientWidth`/`clientHeight` queries), sync lag with `OrbitControls`, and CSS transition latency.
  - Render labels directly inside the Three.js scene graph as `THREE.Sprite` using dynamic high-DPI `THREE.CanvasTexture`.
  - **Dynamic Text Measurement**: Always measure text length using `ctx.measureText(text)` to dynamically size `canvas.width = Math.max(textWidth + paddingX * 2, 128)` and `canvas.height` with generous padding so strings like `n̂ (Rotation Axis)` are never cropped. Set sprite scale proportionally: `sprite.scale.set((canvasWidth / canvasHeight) * worldHeight, worldHeight, 1)`.
  - Set `depthTest: false`, `depthWrite: false`, and `renderOrder: 999` so labels billboard toward the camera and remain crisp and unoccluded.
- **No Backgrounds on In-Canvas 3D Labels**: Labels attached to 3D geometry (vector names $\mathbf{v}$, $\mathbf{v}^\prime$, axis $\hat{\mathbf{n}}$, points) must **never have pill or box backgrounds**. Use direct color-coded typography with high-contrast shadow.
- **Backgrounds Reserved for HUD Panels & Legends**: Translucent backgrounds (`var(--grey-dark)`) are reserved for HUD controls, telemetry cards, and corner/bottom legend overlays. These are passive surfaces, so they are borderless: no `border`, no `stroke` (see the passive-surfaces rule in Section 2). Only an interactive HUD element, one the user can click, gets the subtle ring stroke.
