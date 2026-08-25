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

---

## 6. Interactive JavaScript & D3 Modules

- **Modern ES6 Modules**: Interactive widgets are written as ES6 modules in `site/static/js/...` and loaded at the end of content files:
  ```html
  <script type="module" src="/js/ai/pareto-frontier.js"></script>
  ```
- **CDN ESM Imports**: Use native ESM CDN URLs instead of bundling everything:
  ```javascript
  import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
  ```
- **DOM Container Hooks**: Target standard HTML mount elements (e.g. `<div id="interactive-queue-curve"></div>`). Verify DOM elements exist before initialization.
