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

---

## 2. Content & Markdown Conventions

### Headings & Section Separation
- **No Numbered Headings**: Never prefix headings with numbers (e.g. use `## Latency`, not `## 1. Latency`).
- **No Horizontal Rules**: Never use `<hr>` or markdown `---` rules to separate sections. Use clean typography and whitespace.
- **Tone & Style**: Follow [`conductor/code_styleguides/writing.md`](file:///conductor/code_styleguides/writing.md) (simple, human, direct voice; avoid AI tropes, marketing buzzwords, semicolons, and em-dashes).

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

### Underscores in Display Math
- Multi-line display math blocks with multiple underscores (e.g. `$$\text{TPS}_{\text{system}} = \frac{\sum_{i=1}^N O_i}{\Delta t}$$`) can conflict with Markdown emphasis parsers. Always place display math delimiters on separate lines:

```latex
$$
\text{TPS}_{\text{system}} = \frac{\sum_{i=1}^{N} O_i}{\Delta t}
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

  // Greuler
  import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm';
  ```
- **Pre-bundled CSS**: Graph and chart CSS rules (`greuler.css`, `function-plot.css`) are compiled into the core CSS bundle (`custom-components.css`), so styling is available without separate stylesheet `<link>` tags.
- **DOM Container Hooks**: Target standard HTML mount elements (e.g. `<div id="figure-tree"></div>`). Verify DOM elements exist or load after DOM parsing.

---

## 7. Note Preview Cards & Related Articles Architecture

- **Single Source of Truth**: [`site/layouts/_partials/note-preview.html`](file:///site/layouts/_partials/note-preview.html) is the single shared partial for rendering note cards across note lists, taxonomy pages, and the related notes block in [`site/layouts/_partials/single-related.html`](file:///site/layouts/_partials/single-related.html).
- **Card Styling Tokens**:
  - Container: `tw-bg-[var(--grey-dark)] tw-rounded-md tw-p-4 hover:tw-brightness-110`
  - Thumbnail: Fixed size `tw-w-28 tw-h-28 tw-object-cover tw-rounded-md`, aligned to top on desktop (`md:tw-items-start`, `tw-self-start`).
  - Title: Always `tw-text-primary` with subtle hover glow.
  - Summary: Tighter line-height (`tw-leading-normal`).
  - Tags: Rendered as `#tag` pills with `tw-border-primary tw-text-primary`.
- **Interactive Badging (`✦ Interactive`)**:
  - Automatically detected via multi-signal check in `note-preview.html`:
    1. Frontmatter `interactive: true`
    2. Tags (`"interactive"`, `"simulator"`)
    3. Content inspection (`<script type="module"`, `interactive-`, `-simulator`).
