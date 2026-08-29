---
title: "Surface Shading"
date: 2016-06-03 13:46:07
summary: |
  Surface shading is a process to color a surface. In computer graphic applications, this is done to mimic how objects look in real life. This article covers the variables used by shading models and the flat shading model.
image: /images/ray-tracing!blinn-phong.jpg
references:
  - https://thebookofshaders.com
  - "Illumination-based Shading. Retrieved 9 June 2016, from http://www.di.ubi.pt/~agomes/cg/teoricas/07e-shading.pdf"
  - "TU Wien Rendering #4, from https://www.youtube.com/watch?v=Gm7szS1hQxs"
tags: ["shading", "surface", "computer graphics"]
libraries: ["katex"]
aliases:
  - /notes/computer-graphics/surface-shading/introduction/
  - /notes/computer-graphics/surface-shading/flat-shading/
  - /notes/computer-graphics/flat-shading/
---

Shading is the process of altering the color of a surface. Different *shading models* capture the process of light reflection on a surface. These models use the following variables in the computation:

- $\mathbf{ray}$ (ray) - a ray emitted from a pixel, defined with an origin ($\mathbf{ray}\_{\text{origin}}$) and a direction ($\mathbf{ray}\_{\text{direction}}$).
- $\mathbf{p}$ (intersection point) - the intersection point of the surface and $\mathbf{ray}$.
- $\mathbf{l}$ (light direction) - a unit vector pointing from the surface towards a light source, computed by normalizing the vector between the intersection point $\mathbf{p}$ and the light source position $\mathbf{l}\_{s}$.

$$
\mathbf{l} = \frac{\mathbf{l}\_{s} - \mathbf{p}}{\lVert \mathbf{l}\_{s} - \mathbf{p} \rVert}
$$

- $\mathbf{v}$ (view direction) - a unit vector pointing from the surface towards the place the ray is emitted from. It's computed by normalizing the vector between the intersection point $\mathbf{p}$ and the ray origin $\mathbf{ray}\_{\text{origin}}$.

$$
\mathbf{v} = \frac{\mathbf{ray}\_{\text{origin}} - \mathbf{p}}{\lVert \mathbf{ray}\_{\text{origin}} - \mathbf{p} \rVert}
$$

- $\mathbf{n}$ (surface normal) - a unit vector perpendicular to the surface at the point where the reflection is taking place.
- Other characteristics of the light source and the surface, depending on the shading model.

## Flat Shading

Flat shading is the simplest shading model, which calculates the illumination at a single point for each polygon (or polygon vertices in OpenGL). This means that **the color is the same for all points of each polygon**.

**Advantages**

- Fast: a single computation per polygon (or one per polygon vertex in OpenGL).

**Disadvantages**

- Inaccurate.
- Discontinuities at polygon boundaries.

### Implementation

GLSL has the keyword `flat` to skip interpolation.

```glsl
// vertex shader
flat out vec4 polygon_color;
void main() {
  // ...
  polygon_color = vec4(ambient + diffuse + specular, 1.0);
}

// fragment shader
flat in vec4 polygon_color;
out vec4 color;
void main () {
  color = polygon_color;
}
```

Flat shading assigns one color per polygon. [Diffuse Shading](/notes/computer-graphics/diffuse-shading/) covers the Lambertian model, which shades each point from the angle between the surface normal and the light direction, producing a smooth gradient across the polygon.
