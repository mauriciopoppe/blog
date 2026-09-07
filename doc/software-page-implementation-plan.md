# Software Page Implementation Plan

## Goal

Create `/software/`, a chronological archive of software projects produced by Mauricio Poppe.

The page should make the projects easy to scan, while preserving enough context to explain why each project was made. Desktop users get a persistent project rail. Mobile users get a compact horizontal navigation strip that can be scrolled or tapped.

## Chosen layout

Use the timeline layout discussed as Layout A:

```text
┌──────────────────────────────────────────────────────────────┐
│ SOFTWARE                                                     │
│ Things I made to understand something, solve a problem,      │
│ or build a tool I wanted to use.                             │
│                                                              │
│  2015       2016       2018       2021       2026            │
│  ●──────────●──────────●──────────●──────────●               │
│                                                              │
├───────────────┬──────────────────────────────────────────────┤
│ PROJECTS      │  2015                                        │
│ ● function    │  function-plot                               │
│ ○ greuler     │  ┌──────────────────────────────────────────┐ │
│ ○ PojoViz     │  │             project screenshot            │ │
│ ○ quickhull3d│  └──────────────────────────────────────────┘ │
│ ...           │  Description                                 │
│               │  Why I made it                               │
│               │  [Visit project] [GitHub]                    │
└───────────────┴──────────────────────────────────────────────┘
```

The page is a collection page rather than one Hugo page per project. Each project is a data record rendered by one section template. The “Why I made it” block is optional and should contain source-backed or author-supplied motivation only.

## Scope for the first version

### Include

- A new Hugo section at `/software/`.
- A curated data file containing project metadata.
- Chronological ordering by the first commit date in each project repository.
- A top timeline with clickable year markers.
- A desktop project navigation rail.
- A mobile horizontal project navigation strip.
- Project descriptions and manually written background paragraphs.
- Verified project-hosted videos, GIFs, or screenshots when available.
- Links to the live demo and source repository where available.
- Responsive behavior at the existing mobile breakpoints.
- Keyboard-accessible navigation and visible active states.

### Defer

- Automatic GitHub API synchronization.
- Video hosting or video transcoding.
- A CMS or editor interface.
- Individual project detail routes.
- Repository statistics such as stars, forks, or last commit time.
- Complex filtering by language or project type.

## Project inventory

Start with the projects currently listed on the homepage and the additional projects listed in the GitHub profile README:

- function-plot
- greuler
- PojoViz
- City Car Drive
- APE
- quickhull3d
- interval-arithmetic
- Subtitle Insights
- My blog
- My dotfiles
- Links
- kubernetes-playground
- anki-decks
- 10 Min Abs Timer
- RatTrack NYC
- epub-translation
- LLM Inference Simulator

All listed projects should appear in the same timeline, including personal tools, experiments, the blog, dotfiles, and Links. The first pass should verify each project's repository URL, demo URL, title, description, first commit date, and any documented motivation in its README or project website.

## Content model

Store the records in `site/data/software.yaml` so content and layout remain separate.

Suggested shape:

```yaml
- id: function-plot
  title: function-plot
  first_commit: 2015-03-29
  order: 1
  description: A versatile 2D function plotter.
  why: >-
    I wanted a little clone of Google's plotting utility that could render
    interactive line charts and scatterplots with little configuration.
  technologies:
    - JavaScript
    - visualization
    - mathematics
  demo: https://mauriciopoppe.github.io/function-plot/
  source: https://github.com/mauriciopoppe/function-plot
  image: https://example.com/project-preview.png
  # Local videos are served from site/static, for example /video/ape.mp4.
```

Required fields:

- `id`
- `title`
- `first_commit`
- `description`
- `source` or `demo`

Optional fields:

- `technologies`
- `why`
- `demo`
- `docs`
- `source`
- `image`
- `image_alt`
- `video`
- `video_poster`
- `related`
- `additional_images`
- `featured`
- `notes`

Use `order` when multiple projects share a year. Avoid relying on YAML insertion order for chronology.

## Hugo implementation

### Files to add

```text
site/content/software/_index.md
site/layouts/software/section.html
site/data/software.yaml
site/static/images/software/*.png
```

Add a dedicated stylesheet or scoped component styles only if the existing utility classes cannot express the layout cleanly. Prefer the existing Tailwind classes and theme variables.

### Section frontmatter

`site/content/software/_index.md` should define:

```yaml
---
title: Software
description: Software projects built to learn, explore, and solve practical problems.
---
```

The page should use the normal site shell and navigation. Add a `/software/` entry to the header only if the resulting navigation remains compact. The homepage Software heading should link to `/software/`.

### Section template responsibilities

`site/layouts/software/section.html` should:

1. Load `site.Data.software`.
2. Sort records by `first_commit` and `order`.
3. Build a list of distinct years.
4. Render the top year timeline.
5. Render the project navigation rail.
6. Render one project section per record.
7. Connect navigation items to project sections with stable IDs.
8. Add active-state behavior for the project rail and year markers.

The template should not contain project-specific descriptions or personal background text. When a project has a `demo` URL, its title is also a link to that home page and opens in a new tab. Projects without a demo keep a plain title and expose their source link below. The `why` field accepts Markdown for inline links. Optional `related` links provide context such as a course, award, paper, or person associated with a project.

Each project body uses a responsive two-column grid. The left column contains the verified project video, GIF, or screenshot, with a quiet placeholder when no media exists. The right column contains the description, optional source-backed “Why I made it” text, passive technology tags, and interactive demo, documentation, and GitHub pills. Below the desktop breakpoint, the columns stack into one column.

## Navigation behavior

### Desktop

- The top timeline is visible near the page introduction.
- Each year marker links to the first project in that year.
- The project rail remains sticky within the content column.
- The active project has the primary accent color and a stronger marker.
- Clicking a project scrolls to its content section.
- The URL may update with a hash such as `#function-plot`.

### Mobile

- Replace the two-column rail with a horizontal scrollable project strip.
- Keep the project title and year visible without requiring a hover state.
- Avoid a horizontally overflowing page. Only the navigation strip may scroll horizontally.
- Year markers may collapse into a compact list or remain as a small horizontally scrollable timeline.
- Project content becomes a single column.

### Interaction implementation

Use native anchor links first. Add a small ES module only for enhancements:

- `IntersectionObserver` updates the active project.
- `aria-current="true"` identifies the active project.
- Focused navigation items remain visible in the horizontal strip.
- Hash navigation works on initial page load.
- The page remains usable if JavaScript fails.

Suggested script:

```text
site/static/js/software/software-nav.js
```

Do not add a large client-side framework for this page.

## Visual design

Match the current homepage and existing diagram system:

- Use `var(--grey-darker)` for the page canvas or media frame where appropriate.
- Use `var(--grey-dark)` for project cards and navigation surfaces.
- Use `rgb(var(--primary))` for active markers, links, and selected states.
- Use `var(--grey-light)` for supporting text.
- Use `var(--grey-lighter)` for project titles and primary labels.
- Use the existing border and shadow tokens instead of new hardcoded colors.
- Keep the project rail visually quiet when inactive.
- Make the selected project obvious through color, marker weight, and a subtle background tint.

The timeline should be a real HTML navigation structure, not only a decorative SVG. If an SVG is used for the connecting line, keep it supplementary and ensure all labels and links remain accessible HTML.

Technology pills are informational and always passive. Demo, documentation, and GitHub pills are interactive because they navigate to an external resource. Interactive pills use the UX system’s ring border, resting elevation, pointer cursor, hover tint, visible keyboard focus, and active press state. Technology pills remain borderless and inert.

## Media workflow

For the first version, prefer media already published by the project. Inspect each project demo and repository for an existing video, GIF, or screenshot before creating anything new.

Store them under:

```text
site/static/images/software/
```

Recommended naming:

```text
function-plot.png
ape.webp
greuler.png
pojoviz.png
city-car-drive.png
interval-arithmetic.png
subtitle-insights.png
llm-inference-simulator.png
```

Each local image needs useful alt text. If a project has no verified media, render the project without a media block rather than inventing a screenshot. Remote videos should include a poster when the project provides one.

Design the media container so an image can later be replaced by:

```html
<video autoplay muted loop playsinline poster="...">
  <source src="..." type="video/mp4">
</video>
```

The initial implementation can use verified remote project media. Video should remain muted, controllable, and lazy enough not to make the archive expensive to load.

## Homepage changes

Keep the homepage compact. Change the current `Software` heading into a link to `/software/`, and add a small “View all software” link after the existing list.

The existing homepage list can remain as a compact, hand-maintained preview. The full timeline is the canonical project archive. Do not expand the homepage data refactor as part of this work.

## Implementation phases

### Phase 1: Data and content

- Confirm the complete project inventory against the GitHub profile.
- Verify repository and demo links.
- Record first commit dates and explicit ordering.
- Copy or carefully summarize documented motivations from each README or project website. Leave `why` empty when the source only describes functionality.
- Mark projects without available media.

### Phase 2: Static page

- Add the Hugo section and data file.
- Render the chronological project list.
- Add the year timeline and project rail.
- Add verified project media and accessible link labels.
- Link the homepage to `/software/`.

### Phase 3: Navigation enhancement

- Add stable hash links.
- Add `IntersectionObserver` active states.
- Add keyboard focus behavior.
- Add mobile horizontal navigation.

### Phase 4: Visual and responsive QA

- Check light and dark themes.
- Check 375px, 390px, and 1280px viewports.
- Run the Hugo build.
- Run the existing test suite.
- Run the article/page preflight overflow checks or an equivalent page-level overflow check.
- Confirm media does not cause layout shift or exceed its container.

### Later: Media upgrades

Audit the remaining projects for existing media and add the highest-value verified assets. Keep remote videos muted, controllable, and paired with a static poster where available.

## Acceptance criteria

- `/software/` renders through the normal Hugo site shell.
- All initial projects have a title, description, first commit date, and at least one valid external link.
- Projects appear in chronological order with deterministic ordering for ties.
- Year markers navigate to the correct part of the page.
- Project rail items navigate to the correct project.
- The active project is visually and semantically identifiable.
- The mobile layout has no page-level horizontal overflow.
- Navigation works with JavaScript disabled.
- Images have meaningful alt text, videos have controls and posters where available, and media does not stretch beyond its container.
- The page works in both configured themes.
- The homepage points users to the full software archive.
- The page can accept a future video field without a structural rewrite.

## Open content decisions

The following decisions are settled:

- Include all listed projects in one timeline, including personal tools and experiments.
- Use the first commit date for chronology.
- Do not add project status labels. The page does not need to represent archived or inactive states.
- Use verified project-hosted video, GIF, or screenshot media when available.
