# Plan: Flatten notes/computer-graphics

## Goal

Move every article under `notes/computer-graphics` from nested directories into flat files directly under the section, keep permanent redirects from the old URLs, and update every reference that points at the old paths.

The move changes the URL of each article, because Hugo derives URLs from file paths. Old URLs must keep working via redirects, and the site navigation must keep highlighting the correct pipeline stage.

## Move table

Two articles are already flat (`ray-tracing.md`, `rendering.md`) and stay put. The remaining 20 move:

| Current path | New flat path |
| :--- | :--- |
| `pipeline/culling-clipping.md` | `culling-clipping.md` |
| `surface-shading/diffuse-shading.md` | `diffuse-shading.md` |
| `surface-shading/flat-shading.md` | `flat-shading.md` |
| `surface-shading/introduction.md` | `surface-shading.md` |
| `transformation-matrices/combining-transformations.md` | `combining-transformations.md` |
| `transformation-matrices/coordinate-systems.md` | `coordinate-systems.md` |
| `transformation-matrices/normals.md` | `normals.md` |
| `transformation-matrices/projections/orthographic.md` | `orthographic-projection.md` |
| `transformation-matrices/projections/perspective.md` | `perspective-projection.md` |
| `transformation-matrices/rotation/euler-angles.md` | `euler-angles.md` |
| `transformation-matrices/rotation/introduction.md` | `rotation.md` |
| `transformation-matrices/rotation/quaternions.md` | `quaternions.md` |
| `transformation-matrices/scale.md` | `scale.md` |
| `transformation-matrices/shearing.md` | `shearing.md` |
| `transformation-matrices/transformation-matrix.md` | `transformation-matrix.md` |
| `transformation-matrices/translation.md` | `translation.md` |
| `viewing/camera/first-person-shot.md` | `first-person-camera.md` |
| `viewing/projection-transform.md` | `projection-transform.md` |
| `viewing/view-transform.md` | `view-transform.md` |
| `viewing/viewport-transform.md` | `screen-space.md` |

### Naming decisions

- The two `introduction.md` files collide when flattened. Each takes the name of its section: `surface-shading.md` and `rotation.md`. This reads as the section intro and avoids the collision.
- The projection matrix articles become `orthographic-projection.md` and `perspective-projection.md`, keeping them distinct from the pipeline article `projection-transform.md`.
- `first-person-shot.md` becomes `first-person-camera.md`. The old name described a specific shot rather than the subject, which is building the camera itself.
- `viewport-transform.md` becomes `screen-space.md`. "View transform" and "viewport transform" were too similar, and the article's target space, screen coordinates, is clearer. "The View Transform" keeps its name because it is standard terminology, and "screen space" removes the ambiguity with it.

### Title improvements

The refactor is a good time to tighten titles that are wordy or inconsistent:

| File | Current title | New title |
| :--- | :--- | :--- |
| `coordinate-systems.md` | "Coordinate systems and transformations between them" | "Coordinate Systems" |
| `scale.md` | "Scaling Objects with a Transformation Matrix" | "Scaling" |
| `shearing.md` | "Shearing Objects with a Transformation Matrix" | "Shearing" |
| `translation.md` | "Translating Objects with a Transformation Matrix" | "Translation" |
| `surface-shading.md` | "Introduction to Surface Shading" | "Surface Shading" |
| `rotation.md` | "Introduction to Rotation for Computer Graphics" | "Rotation" |
| `first-person-camera.md` | "Building a First-Person Shot Camera in C++" | "First-Person Camera" |
| `screen-space.md` | "Transformation Matrix to Transform Objects from NDC Coordinates to Screen Coordinates (Viewport Transform)" | "Screen Space" |

The remaining titles already match the flat slugs and stay unchanged.

## Redirects

Use Hugo's native `aliases` frontmatter. Each moved file gets its old URL as an alias, and Hugo generates an HTML redirect page at the old path with a canonical link to the new URL:

```yaml
aliases:
  - /notes/computer-graphics/pipeline/culling-clipping/
```

This is the Hugo-native mechanism, so no Netlify redirects file is involved. The alias is added in the same commit as the file move.

## Reference updates

These break with the new paths and need updating in the same change:

1. **`site/layouts/_partials/graphics-pipeline-nav.html`**: ten hardcoded absolute links point at the old URLs, including `viewport-transform` which becomes `screen-space`. The stage-highlight checks use `in $currentUrl "transformation-matrices"` which no longer matches after flattening. Fix: give each pipeline article a `pipeline_stage` frontmatter value (only `projection-transform.md` has one today) and prefer it in the check, with the URL substring checks updated to the new slugs as the fallback.
2. **`site/layouts/_partials/single-content.html`**: the pipeline-nav inclusion guard checks `in .RelPermalink "/notes/computer-graphics/transformation-matrices/"`. Replace with a check based on `pipeline_stage` or the new slugs.
3. **`site/layouts/index.html`**: one hardcoded link to `notes/computer-graphics/viewing/projection-transform/` updates to the flat path.
4. **Internal relative links in the articles**: all moved articles become siblings, so `../slug/` links keep working, but deeper relative links need rewriting. The known one is `first-person-camera.md` linking to `../../../transformation-matrices/rotation/euler-angles#intrinsic-rotations`, which becomes `../euler-angles/#intrinsic-rotations`. A full `grep -rn '\.\./'` sweep of the moved files is part of the change.
5. **`site/layouts/_partials/sitemap-tree.auto.html`**: auto-generated, regenerate with `bun run generate:sitemap` after the moves.

## Verification

- `hugo` builds cleanly.
- Old URLs serve redirect pages: `grep` the built output for the alias paths and confirm they contain a canonical link to the new URL.
- The pipeline nav still appears on the five stage articles and highlights the correct stage.
- `bun test` passes.

## Execution order

1. `git mv` each article to its flat path.
2. Add `aliases` (and `pipeline_stage` where missing) to frontmatter.
3. Update the layouts and the internal relative links.
4. Regenerate the sitemap tree.
5. Build and verify.
6. Commit in two commits: the file moves with aliases and content link updates, then the layout and sitemap updates.
