---
title: "Surface Shading"
date: 2016-06-03 13:46:07
summary: |
  Surface shading colors a surface to mimic how objects look in real life. This article covers the variables shared by shading models, then the models themselves: flat, Lambertian diffuse, Blinn-Phong specular, and ambient.
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
  - /notes/computer-graphics/surface-shading/diffuse-shading/
  - /notes/computer-graphics/diffuse-shading/
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

Flat shading assigns one color per polygon. The rest of this article covers models that shade each point individually, starting with the Lambertian model for matte surfaces.

## Diffuse Shading

Many objects, for example wood and paper, have a surface that is not shiny. Such objects can be modeled with the Lambertian model, which obeys Lambert's cosine law:

> The luminous intensity of a surface is proportional to the cosine of the angle between the surface normal and the direction of the light.
>
> $$
> c \propto \cos\theta \quad \text{or} \quad c \propto \mathbf{n} \cdot \mathbf{l}
> $$

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="/images/diffuse-shading!lambertian.jpg" alt="">
  </div>
  <figcaption>Both $\mathbf{n}$ and $\mathbf{l}$ are unit vectors.</figcaption>
</figure>

The model does not depend on the distance between the light and the object. This is equivalent to saying the light is *distant relative to the object size*, which is often a directional light.

When light hits the surface, a portion is reflected, controlled by the diffuse reflectance $c\_r$, a color that varies with the surface. The surface color can be made darker or lighter by changing the color of the light source $c\_l$:

$$
c = c\_r \; c\_l \; \mathbf{n} \cdot \mathbf{l}
$$

$c\_r$ and $c\_l$ are RGB colors with components in $[0, 1]$, where the multiplication is element-wise. The product $\mathbf{n} \cdot \mathbf{l}$ can be negative, for example when the surface normal points away from the light. Clamping with the max function keeps the result valid:

$$
c = c\_r \; c\_l \; \text{max}(\mathbf{n} \cdot \mathbf{l}, 0)
$$

## Blinn-Phong Shading

Many surfaces show highlights (shininess) or *specular reflections* that appear to move as the viewpoint changes. The idea is to produce a reflection when $\mathbf{v}$ and $\mathbf{l}$ are positioned symmetrically across the surface normal.

{{< figure src="/images/ray-tracing!blinn-phong.jpg" title="Blinn-Phong" >}}

The half vector $\mathbf{h}$ is a unit vector through the bisector of the angle between $\mathbf{v}$ and $\mathbf{l}$:

$$
\mathbf{h} = \frac{\mathbf{v + l}}{\lVert \mathbf{v + l} \rVert}
$$

The specular component is bright when $\mathbf{h}$ is near $\mathbf{n}$ and dim when it is far, so it is proportional to the cosine of the angle between $\mathbf{n}$ and $\mathbf{h}$, i.e. $\mathbf{n \cdot h} = \cos\theta$. Raising the result to a power $p > 1$ makes it decrease faster:

$$
L = k\_d \cdot I \cdot \text{max}(0, \mathbf{n \cdot l}) + k\_s \cdot I \cdot \text{max}(0, \mathbf{n \cdot h})^p
$$

Where $k\_s$ is the specular coefficient and $I$ is the intensity of the light source.

## Ambient Shading

Surfaces that receive no illumination would be rendered completely black. To avoid this, a constant component is added to the shading model. The ambient color $c\_a$ depends on the object but not on its geometry:

$$
c = c\_r \cdot c\_a
$$
