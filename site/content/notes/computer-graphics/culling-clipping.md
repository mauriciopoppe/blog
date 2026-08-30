---
title: "Culling & Clipping"
date: 2016-03-16 11:03:05
summary: |
  Before rasterization, primitives must be checked against the camera's view volume. Culling discards geometry that is not visible from the camera to save processing time, while clipping removes the parts of primitives that fall outside the view volume.
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
image: /images/ray-tracing!camera.jpg
tags: ["computer graphics", "culling", "clipping", "geometry", "3d"]
libraries: ["katex"]
math_terms: ["graphics"]
aliases:
  - /notes/computer-graphics/pipeline/culling-clipping/
series: "computer-graphics-pipeline"
pipeline_stage: "clipping"
---

Before rasterization, every primitive must be tested against the view volume. A naive rasterizer would draw everything the projection produced, including geometry that should never be visible. Two mechanisms prevent that: clipping removes the parts of primitives that fall outside the view volume, and culling discards whole primitives the camera cannot see.

## Why Clipping Is Needed

The problem shows up in the perspective divide. When the *perspective projection matrix* maps a point from camera space to <span data-term="ndc" class="math-term-trigger cursor-help">normalized device coordinates</span>, its $z$-coordinate becomes:

$$
z_{ndc} = \frac{Az_{cam} + B}{-z_{cam}}
$$

Where $n, f$ are the locations of the near and far planes along the negative $z$-axis in camera space, and $A, B$ are the constants that map those planes onto the NDC range:

$$
\begin{align*}
A &= -\frac{f + n}{f - n} \\\\
B &= \frac{-2fn}{f - n}
\end{align*}
$$

The mapping assumes $n, f \geq 0$ with $n \leq f$, since $A$ and $B$ were derived by sending $-n \mapsto -1$ and $-f \mapsto 1$. The plot below shows the result for $n = 1$ and $f = 10$:

<div id="z"></div>
<script type="module" src="/js/computer-graphics/culling-clipping.js"></script>

The curve climbs past $z_{ndc} = 1$ as $z_{cam}$ approaches zero. A point behind the camera has $z_{cam} > 0$, and the divide by $-z_{cam}$ flips its sign, sending the coordinate past the far plane of the view volume. In NDC, a point that is actually behind the camera looks like it lies in front of it. Rasterizing that point would draw geometry that should be hidden.

## Clipping

Clipping removes the parts of a primitive that lie outside the view volume, keeping only the portion that intersects it. The view volume is bounded by six planes, and each one is applied in turn. A basic implementation processes a triangle against every plane:

```plain
input: triangle, 6 planes of the view volume

for (each of the six planes) do
  if (the triangle is entirely outside the plane) then
    discard the triangle
  else if (the triangle passes through the plane) then
    clip the triangle
    if (the triangle is now a quadrilateral) then
      break the quadrilateral into two triangles
```

## Culling

Culling is a cheaper test that runs before clipping. Instead of trimming a primitive, it discards whole primitives that cannot produce visible fragments, saving the work of rasterizing them.

- **View volume culling**: Geometry outside the view volume can be culled as a whole, since none of it will produce fragments. The test is especially useful when triangles are grouped into an object with an associated bounding volume, so one check discards the entire object.
- **Backface culling**: Polygons that face away from the camera can be culled before the pipeline continues, since their back is never visible.

## Key Takeaways

| Concept | Formula | Takeaway |
| :--- | :--- | :--- |
| **Perspective divide problem** | $z\_{ndc} = \frac{Az\_{cam} + B}{-z\_{cam}}$ | Points behind the camera ($z\_{cam} > 0$) map past the far plane, appearing visible in NDC. |
| **Clipping** | Six view volume planes | Trims primitives to the portion inside the view volume before rasterization. |
| **View volume culling** | Bounding volume test | Discards entire objects outside the view volume with one check. |
| **Backface culling** | Facing test | Discards polygons whose back faces the camera. |
