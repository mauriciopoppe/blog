# Agent Guidelines & Engineering Learnings

This document captures development workflows, architecture rules, system quirks, and conventions for AI agents and developers working on this codebase.

---

## 1. Development Workflow & Tooling

### Prerequisites & Commands
- **Tooling**: [Hugo](https://gohugo.io/) (extended) and [Bun](https://bun.sh/).
- **Local Dev Server**:
  ```bash
  hugo server -D -p 3000
  ```
  Runs Hugo with draft posts enabled at `http://localhost:3000`.
- **Automated Tests**:
  ```bash
  npm run test # or bun test site/ src/
  ```
  Runs co-located unit test suites (`*.test.js`, `*.test.ts`) across `site/` and `src/`.
- **Asset Builds**:
  ```bash
  bun run build # builds sitemaps, webpack bundles, and hugo site into dist/
  ```

### Article Pre-Flight & Publishing Workflow
- **Pre-Flight Validation**:
  ```bash
  bun run preflight site/content/notes/<article>.md
  ```
  Validates:
  1. Frontmatter metadata (`date` is today's date, `draft` property is absent, hero `image` exists in `site/static/images/` and is non-empty).
  2. Syntax integrity (Hugo Goldmark SVG contiguity with zero empty blank lines, LaTeX `%` checks).
  3. Playwright headless browser check across mobile (`375px`, `390px`) and desktop (`1280px`) viewports to guarantee zero horizontal page-level overflow (`overflow-x`).

- **Deterministic One-Step Publishing**:
  ```bash
  bun run publish:note site/content/notes/<article>.md
  ```
  Automates:
  1. Setting `date` in frontmatter to the current timestamp and removing `draft: true`.
  2. Executing the preflight suite.
  3. Creating a dedicated git commit (`"Publish note: <title>"`).
  4. Creating the annotated git tag `vYYYY-MM-DD-<slug>` (e.g. `v2026-08-28-benchmarking-and-capacity-planning`).
  5. Deploying and triggering automated GitHub Releases via `git push origin main --tags`.

- **Automated GitHub Releases**:
  - The workflow [`.github/workflows/release-on-tag.yml`](file:///.github/workflows/release-on-tag.yml) automatically triggers upon pushing `v*` tags, extracting the article's title, summary, tags, and publishing a rich GitHub Release linking directly to `https://mauriciopoppe.com/notes/<slug>`.

---

## 2. Content & Markdown Conventions

### Headings & Section Separation
- **No Numbered Headings**: Never prefix headings with numbers (e.g. use `## Latency`, not `## 1. Latency`).
- **No Horizontal Rules**: Never use `<hr>` or markdown `---` rules to separate content sections. Use clean typography and vertical whitespace.

### Writing Voice & Style (Human, Direct, Anti-Tropes)
- **Direct Technical Mechanics**: State the mechanism, facts, and tradeoffs immediately without throat-clearing preambles ("Let's break this down step by step", "Two constraints shape the design", "What is worth noting here is...").
- **No Em-Dashes (`—`)**: Never use em-dashes (`—`). When inserting side notes, clarifications, or soft thoughts, use parentheses `(soft thoughts)` instead, or split the thought into separate, clear sentences.
  - *Avoid*: `In a synchronized system—say, exactly one request every 20ms—the worker is idle.`
  - *Use*: `In a synchronized system (say, exactly one request every 20ms), the worker is idle.`
- **No Semicolons (`;`)**: Avoid semicolons in prose. Split long compound thoughts into separate, clear sentences.
- **No Negative Parallelism**: Never use "It's not X — it's Y" or "The question isn't X, it's Y". State the positive truth directly.
- **No Triple Negations or Reveal Drama**: Avoid "Not X. Not Y. Just Z" or "Not a bug. Not a feature. A design flaw."
- **No False Ranges**: Avoid "from X to Y" unless X and Y form a real, measurable numeric spectrum (avoid "from innovation to implementation").
- **No Rhetorical Q&A**: Never pose a rhetorical question only to answer it immediately for false drama ("The result? Devastating", "The scary part? Nobody saw it coming").
- **No Grandiose Stakes Inflation**: Do not inflate technical trade-offs into world-historical revolutions ("fundamentally reshapes how we think about computing").
- **No Patronizing Analogies**: Avoid "Think of it as a Swiss Army knife...". Explain the technical model directly.
- **No Manufactured Suspense**: Avoid "Here's the catch", "Here's what most people miss", "Here's the kicker".
- **Banned AI Tell Words**:
  - `delve`, `leverage`, `utilize`, `harness`, `streamline`, `robust`, `seamless`, `deceptively`
  - `tapestry`, `landscape`, `paradigm`, `synergy`, `ecosystem`, `load-bearing` (when used as a buzzword)
  - `serves as`, `stands as`, `marks a pivotal moment` (use `is` or `are`)
  - `quietly`, `deeply`, `fundamentally`, `remarkably`, `arguably`
  - `game-changer`, `superpower`, `revolutionize`
- **Percentages in Prose**: Always write percentages in standard prose (`50%`, `75%`, `90%`, `99%`) rather than wrapping them in inline math (`$50\%$`), as LaTeX/KaTeX treats `%` as a comment symbol.

---

## 3. Hugo Goldmark & Inline HTML / SVG Rules

### Critical Rule: No Blank Lines Inside Inline HTML / SVG
- **The Issue**: Hugo uses the Goldmark Markdown parser. Encountering an empty blank line inside an inline `<svg> ... </svg>` or `<div> ... </div>` block terminates the raw HTML block early. Goldmark then treats all subsequent SVG elements (`<text>`, `<rect>`, `<path>`) as raw Markdown text paragraphs, corrupting the layout.
- **The Rule**: Always keep `<svg>` and raw HTML blocks **completely contiguous with zero empty blank lines**. Use comments on adjacent lines if visual separation is needed:

```html
<!-- Correct -->
<svg viewBox="0 0 840 270" width="100%">
  <!-- Section 1 -->
  <rect x="0" y="0" width="100" height="50" />
  <!-- Section 2 -->
  <text x="50" y="25">Label</text>
</svg>
```

### Self-Contained SVG `<defs>`
- When using markers (such as arrowheads `marker-end="url(#arrow-id)"`), define a unique `<defs><marker id="..."></marker></defs>` inside each `<svg>` rather than relying on cross-SVG definitions.

### Critical Rule: Never Use `<foreignObject>` in Responsive SVGs
- **The Issue**: WebKit (Safari, Chrome on iOS) has a notorious rendering bug where HTML DOM elements inside `<foreignObject>` do not scale when the SVG's `viewBox` shrinks to fit mobile viewports. The SVG container scales down, but the `<foreignObject>` contents stay rendered at unscaled pixel coordinates, spilling outside the SVG container and overlapping article paragraphs.
- **The Rule**: Always use **native SVG `<text>` and `<tspan>` elements** for labels and mathematical subscripts/superscripts inside SVGs (e.g. `<text x="100" y="50">W<tspan font-size="11" dy="2">q</tspan><tspan font-size="14" dy="-2"> + S</tspan></text>`). Native SVG text scales with mathematical precision across all browser engines.

### SVG Diagram Design System (`doc/diagram-style-spec.md`)
- Interactive widgets and diagrams follow the interaction model in [UX Interaction Principles](/notes/ux-interaction-principles/) (affordance in the resting state, distinct interactive vs passive surfaces, and the four interaction states).
- All diagrams follow [`doc/diagram-style-spec.md`](file:///doc/diagram-style-spec.md):
  - **Outer Frame**: `style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 16px; border: 1px solid var(--grey-dark); box-sizing: border-box; margin: 1.5rem 0;"`
  - **Cards & Sub-panels**: `fill="var(--grey-dark)" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" rx="8"`
  - **Color Palette**: Use canonical tokens (`rgb(var(--primary))` / `rgba(var(--primary), 0.15)`, `#ffa726` / `#fbbf24`, `#34d399` / `#22c55e`, `#ff7043` / `#ef4444`, `var(--grey-lighter)`, `var(--grey-light)`). Never use harsh neon cyans (`#38bdf8`) or bright solid borders.
  - **Axes & Dividers**: `stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.2"`


---

## 4. LaTeX & Math Rendering

### Frontmatter Library Activation
The site selectively loads math engines via the `libraries` array in frontmatter:

- **KaTeX (`libraries: ["katex"]`)** [Recommended for new articles]:
  - Ultra-fast, lightweight, renders into pure inline `<span>` elements without line-breaking glitches.
  - Normalized to `0.88em` font-size in [`site/layouts/_partials/lib/katex.html`](file:///site/layouts/_partials/lib/katex.html) to optically match sans-serif body typography, with an explicit `svg foreignObject .katex { font-size: 1.08em !important; }` override so math inside scaled SVG diagrams remains clear and balanced.
  - Supports inline math (`$...$`, `\(...\)`) and display math (`$$...$$`, `\[...\]`).
- **MathJax 3 CHTML (`libraries: ["math"]`)**:
  - Legacy default configured in [`site/layouts/_partials/lib/mathjax3.html`](file:///site/layouts/_partials/lib/mathjax3.html). **Do not modify this file directly** to avoid regressions across existing notes.

### Math Inside SVGs
- To render LaTeX math inside inline SVGs, wrap elements in `<foreignObject>`:

```html
<foreignObject x="120" y="220" width="600" height="40">
  <div xmlns="http://www.w3.org/1999/xhtml" style="color: rgb(var(--primary)); font-size: 15px; text-align: center; font-family: var(--family-sans);">
    $\text{Throughput } (\lambda) = \frac{N}{\Delta t}$
  </div>
</foreignObject>
```

### Underscores & `\underbrace` in Display Math
- Multi-line display math blocks with multiple underscores (e.g. `$$\text{TPS}_{\text{system}} = \frac{\sum_{i=1}^N O_i}{\Delta t}$$`) or repeated `\underbrace` annotations can conflict with Goldmark's Markdown emphasis parser (`_italic_`).
- Always place display math delimiters (`$$`) on their own separate lines.
- For `\underbrace{...}_{...}`, escape the underscore as `\underbrace{...}\_{\text{...}}` so Goldmark does not convert paired underscores into HTML `<em>` italic tags that break KaTeX parsing.

```latex
<!-- Correct: escaped underscores for KaTeX underbrace in Markdown -->
$$
W_q = \underbrace{(1 - \rho) \cdot 0}\_{\text{Arrive when Idle}} + \underbrace{\rho \cdot \left(\frac{S}{1 - \rho}\right)}\_{\text{Arrive when Busy}}
$$
```

### Quadruple Backslashes (`\\\\`) for Row Breaks in Markdown Math
- **The Issue**: Hugo's Goldmark Markdown parser treats `\\` inside Markdown paragraphs as an escaped backslash, passing a single `\` to KaTeX/MathJax. In multiline environments like `\begin{bmatrix}`, `\begin{aligned}`, `\begin{cases}`, and equation systems, this strips row breaks and collapses the entire matrix/system into a single horizontal row.
- **The Rule**: Always use **quadruple backslashes (`\\\\`)** for line breaks in multiline LaTeX environments written in Markdown:

```latex
<!-- Correct: renders 5x5 matrix with proper row breaks -->
$$
A = \begin{bmatrix}
0 & 1 & 1 & 1 & 0 \\\\
1 & 0 & 0 & 1 & 0 \\\\
1 & 0 & 0 & 1 & 0 \\\\
1 & 1 & 1 & 0 & 1 \\\\
0 & 0 & 0 & 1 & 0
\end{bmatrix}
$$
```

### No `<div>` Wrappers Around Display Math
- Do not wrap display math in raw `<div>$$ ... $$</div>` containers. Goldmark may treat the block as raw HTML and bypass Markdown parsing, or interfere with KaTeX delimiters. Always place `$$` on its own separate line directly in Markdown.

### LaTeX in Note Summaries & Index Pages
- Note summaries rendered in preview cards use `markdownify` so inline LaTeX formulas (`$...$`) render automatically on the `/notes/` index and taxonomy pages.
- Section indexes and taxonomy templates (`site/layouts/term.html`, `site/content/notes/_index.md`) include KaTeX via `libraries: ["katex"]` or direct partial inclusion.

---

## 5. Design System & Theme CSS Tokens

Always use theme CSS custom properties instead of hardcoded hex values to support both light and dark themes:

| CSS Variable | Purpose | Usage |
| :--- | :--- | :--- |
| `--primary` | Accent color (coral/rose) | `rgb(var(--primary))` or `rgba(var(--primary), 0.35)` |
| `--grey-darker` | Diagram canvas background | `var(--grey-darker)` |
| `--grey-dark` | Inset cards, blockquote background | `var(--grey-dark)` |
| `--grey` | Borders, subtle axes | `var(--grey)` |
| `--grey-light` | Secondary text, captions | `var(--grey-light)` |
| `--grey-lighter` | Primary text, titles | `var(--grey-lighter)` |
| `--family-sans` | Sans-serif typography | `var(--family-sans, system-ui, sans-serif)` |

### Link Hover Glow
- Link hover drop shadows in `src/main/css/custom-base-styles.css` use subtle `rgba(var(--primary), 0.35)` opacity to provide a smooth, dim glow effect rather than harsh oversaturated shadows.

---

## 6. Interactive Visualizations & Self-Contained ES6 Modules

All interactive modules are self-contained ES6 modules without global UMD library dependencies:

- **Interactive 3D graph style spec**: Interactive Three.js / WebGL explorers (quaternions, coordinate frames, etc.) follow [`doc/interactive-computer-graphics-graph-spec.md`](file:///doc/interactive-computer-graphics-graph-spec.md) for the target visual language (widget frame, buttons, steps, typography, KaTeX sizing). When converting a legacy graph to the design system, follow its **Modernization Checklist** in order: widget frame (Tailwind-first) → border token → segmented groups → buttons → custom slider → typography audit → canvas overlays → layout budget → cleanup → verify against the UX principles page
- **Widget implementation pattern**: These widgets are built as Tailwind classes in the markup plus a scoped `<style>` block injected into the mount element for what Tailwind cannot express (range-input pseudo-elements, KaTeX overrides, code-token colors). Inline `style="..."` attributes are the last resort; the first rule is Tailwind classes
- **Script Inclusions**: Interactive scripts are loaded using `<script type="module" src="...">` or inline `<script type="module">` at the bottom of content files:
  ```html
  <script type="module" src="/js/ai/pareto-frontier.js"></script>
  ```
- **Direct CDN ESM Imports**: Use native ESM CDN URLs instead of global scripts or complex importmaps:
  ```javascript
  // D3
  import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';

  // Three.js
  import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js';

  // FunctionPlot (use esm.sh bundle for correct interval-arithmetic sub-dependencies)
  import functionPlot from 'https://esm.sh/function-plot@1.25.4';

  // Greuler
  import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm';
  ```
- **Pre-bundled CSS**: Graph and chart CSS rules (`greuler.css`, `function-plot.css`) are compiled into the core CSS bundle (`custom-components.css`), so styling is available without separate stylesheet `<link>` tags.
- **DOM Container Hooks**: Target standard HTML mount elements (e.g. `<div id="figure-tree"></div>`). Verify DOM elements exist or load after DOM parsing.

---

## 7. Note Preview Cards & Related Articles Architecture

- **Single Source of Truth**: [`site/layouts/_partials/note-preview.html`](file:///site/layouts/_partials/note-preview.html) is the single shared partial for rendering note cards across note lists, taxonomy pages, and the related notes block in [`site/layouts/_partials/single-related.html`](file:///site/layouts/_partials/single-related.html).
- **Card Styling Tokens**:
  - Container: `tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-shadow-subtle hover:tw-border-[var(--accent-border)] hover:tw-bg-[var(--accent-tint)] hover:tw-shadow-md tw-rounded-lg tw-p-4 tw-cursor-pointer`
  - Thumbnail: Fixed size `tw-w-28 tw-h-28 tw-object-cover tw-rounded-md`, aligned to top on desktop (`md:tw-items-start`, `tw-self-start`).
  - Title: Always `tw-text-primary` with subtle hover glow.
  - Summary: Tighter line-height (`tw-leading-normal`).
  - Tags: Rendered as `#tag` pills following UX principles (`tw-rounded-full tw-bg-[var(--grey-dark)] tw-border tw-border-[var(--ring-border)] tw-text-[var(--grey-light)] tw-shadow-subtle tw-font-serif tw-font-semibold tw-text-[0.72rem]`).
- **Interactive Badging (`✦ Interactive`)**:
  - Automatically detected via multi-signal check in `note-preview.html`:
    1. Frontmatter `interactive: true`
    2. Tags (`"interactive"`, `"simulator"`)
    3. Content inspection (`<script type="module"`, `interactive-`, `-simulator`).
