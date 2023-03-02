---
title: "Flat shading"
date: 2016-06-09 12:39:53
description: |
  Flat shading is the simplest shading model, we cover the advantages/disadvantages and a simple implementation in GLSL.
image: /images/flat-shading.svg
references:
  - "Illumination-based Shading. Retrieved 9 June 2016, from http://www.di.ubi.pt/~agomes/cg/teoricas/07e-shading.pdf"
  - "TU Wien Rendering #4, from https://www.youtube.com/watch?v=Gm7szS1hQxs"
tags: ["shading", "surface", "computer graphics"]
---

Flat shading is the simplest shading model which calculates the illumination at a single point for each polygon (or polygon vertices in OpenGL) which means that it **the color is the same for all points of each polygon**

Advantages

- Fast, a single computation per polygon (or one per polygon vertex in OpenGL)

Disadvantages

- Inaccurate
- Discontinuities at polygon boundaries

## Implementation

GLSL has the keyword `flat` to skip interpolation

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

