---
title: "Ray Tracing"
description: |
  Ray tracing is the process to identify the color of all the pixels in a 2d screen by emitting
  rays from all the pixels simulating how light travels in real life. This article covers the math for
  the ray generation from each pixel for both orthographic and perspective cameras.
image: /images/ray-tracing!perspective.jpg
tags: ["computer graphics", "ray tracing", "orthographic projection", "perspective projection"]
libraries: ["math"]
date: 2016-02-26 17:03:44
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
---

A ray tracer emits a ray from each pixel toward the scene to determine the color of the pixel, the process of computing the color can be split in three parts

1. *ray generation*, the origin and direction of each pixel ray is computed
2. *ray intersection*, the ray finds the closest object intersecting the viewing ray
3. *shading*, where the intersection point, surface normal and other information is used to determine the color of the pixel

A ray can be represented with a 3D parametric line from the eye $\mathbf{e}$ to a point $\mathbf{s}$ on the image plane as

<div>$$
\mathbf{p}(t) = \mathbf{e} + t(\mathbf{ s - e })
$$</div>

Note that

- $\mathbf{p}(0) = \mathbf{e}$
- $\mathbf{p}(1) = \mathbf{s}$
- if $0 < t_1 < t_2$ then $\mathbf{p}(t_1)$ is closer to $\mathbf{e}$ than $\mathbf{p}(t_2)$
- if $t < 0$ then $\mathbf{p}(t)$ is behind $\mathbf{e}$

## Camera coordinate system

All the rays start from the origin of an orthonormal coordinate frame known as the camera/eye coordinate system, in this frame the camera is looking at the negative $\mathbf{w}$ axis

{{< figure src="/images/ray-tracing!camera.jpg" title="camera" >}}

The coordinate system is built from

- the *viewpoint* $\mathbf{e}$ which is at the origin of the camera coordinate system
- the *view direction* which is $\mathbf{-w}$
- the *up vector* which is used to construct a basis that has $\mathbf{v}$ and $\mathbf{w}$ in the plane defined by the *view direction* and the *up vector*

## Ray generation

### Pixel coordinates

The image dimensions is defined with four numbers

- $l,  r$, the position of the left and right edges
- $t,  b$, the position of the top and bottom edges

Note that the coordinates are expressed in the camera coordinate frame defined in a plane parallel to the $w=0$ plane (the $w=0$ plane is defined by the point $\mathbf{e}$ and the vectors $\mathbf{u}$ and $\mathbf{v}$)

The image has to be fitted within a rectangle of $n_x \times n_y$ pixels, for example the pixel $(0,0)$ has the position $(l + 0.5 \tfrac{r - l}{n_x}, b + 0.5 \tfrac{t - b}{n_y})$ note that the half-pixel measurement times pixel-dimension is because of the way a pixel is defined (see [rendering](../rendering)), a pixel with coordinates $(x, y)$ will have the position

<div>$$
\begin{align*}
u = l + (x + 0.5) \frac{r - l}{n_x} \\
v = b + (y + 0.5) \frac{t - b}{n_y}
\end{align*}
$$</div>

### Orthographic view

For an orthographic view all the rays will have the direction $-\mathbf{w}$, there isn't a particular viewpoint however we can define all the rays to be emitted from the $w=0$ plane using the pixel's image-plane position as the ray's starting point

{{< figure src="/images/ray-tracing!orthographic.jpg" title="orthographic view" >}}

<div>$$
\begin{align*}
\mathbf{ray_{direction}} &= -\mathbf{w} \\
\mathbf{ray_{origin}} &= \mathbf{e} + u \mathbf{u} + v \mathbf{v}
\end{align*}
$$</div>

### Perspective view

For a perspective view all the rays will have the same origin $e$ but the image-plane is not located at $w=0$ but at some distance $d$ in the $-\mathbf{w}$ direction, this time each ray will have a varying direction based on the location of the pixel's image-plane position respect to $e$

{{< figure title="perspective view" src="/images/ray-tracing!perspective.jpg" >}}

<div>$$
\begin{align*}
\mathbf{ray_{direction}} &= -d \mathbf{w} + u \mathbf{u} + v \mathbf{v} \\
\mathbf{ray_{origin}} &= \mathbf{e}
\end{align*}
$$</div>

## Ray intersection

Once a ray in the form $\mathbf{e} + t\mathbf{d}$ is generated we find the first intersection with an object where $t > 0$, whenever there are many objects that intersect a ray the intersection point with the lowest $t$ is returned

The following pseudocode tests for "hits"

```plain
ray = e + td
t = infinity
for each `object` in the scene
  if `object` is hit by `ray` and `ray's t` < `t`
    hit object = `object`
    t = `ray's t`
return hit t < infinity
```

## Shading

Once the visible surface is known the next step is to compute the value of the pixel using a **shading model**, which can be made out of simple heuristics or elaborate numeric computations

A shading model is designed to *capture the process of light reflection on a surface*, the important variables in this process are

- $\mathbf{p}$ (intersection point) - the intersection point between a surface and a ray
- $\mathbf{l}$ (light direction) - a unit vector pointing from the surface towards a light source, computed by normalizing the vector between the intersection point $\mathbf{p}$ and the light source position $\mathbf{l_s}$

<div>$$
\mathbf{l} = \frac{\mathbf{l_s - p}}{\norm{\mathbf{l_s - p}}}
$$</div>

<span></span>

- $\mathbf{v}$ (view direction) - a unit vector pointing from the surface towards the place the ray is emitted from, it's computed by normalizing the vector between the intersection point $\mathbf{p}$ and the ray origin $\mathbf{ray_{origin}}$

<div>$$
\mathbf{v} = \frac{\mathbf{ray_{origin} - p}}{\norm{\mathbf{ray_{origin} - p}}} \quad \text{or} \quad \mathbf{v} = -\mathbf{d}
$$</div>

<span></span>

- $\mathbf{n}$ (surface normal) - a unit vector perpendicular to the surface at the point where the reflection is taking place
- other characteristics of the light source and the surface depending on the shading model

### Lambertian shading

One of the simplest shading models discovered by Lambert in the 18th century, the amount of energy from a light source that falls on a surface depends on the angle of the surface to the light

{{< figure title="lambert" src="/images/ray-tracing!lambert.jpg" >}}

- A surface facing directly the light receives maximum illumination
- A surface tangent to the light receives no illumination
- A surface facing away from the light receives no illumination

Thus the illumination is proportional to the cosine of the angle between $\mathbf{n}$ and $\mathbf{l}$ i.e. $\mathbf{n \cdot l} = \cos{\theta}$, the color of the pixel is then

<div>$$
L = k_d \cdot I \cdot max(0, \mathbf{n \cdot l})
$$</div>

Where

- $k_d$ is the diffuse coefficient, a characteristic of the surface
- $I$ is the intensity of the light source

Additional notes of this model

- The model is view independent
- The color of the surface appears to have a very matte, chalky appearance

### Blinn-Phong shading

Many surfaces show some degree of highlights (shininess) or *specular reflections* that appear to move as the viewpoint changes, the idea is to produce reflections when $\mathbf{v}$ and $\mathbf{l}$ are positioned symmetrically across the surface normal

{{< figure src="/images/ray-tracing!blinn-phong.jpg" title="blinn phong" >}}

- the half vector $\mathbf{h}$ is a unit vector that goes through the bisector of the angle between $\mathbf{v}$ and $\mathbf{l}$

<div>$$
\mathbf{h} = \frac{\mathbf{v + l}}{\norm{\mathbf{v + l}}}
$$</div>

Also

- if $\mathbf{h}$ is near $\mathbf{n}$ then the specular component should be bright, if it's far away it should be dim, therefore the illumination is proportional to the cosine of the angle between $\mathbf{n}$ and $\mathbf{h}$ i.e. $\mathbf{n \cdot h} = \cos {\theta}$
- the specular component decreases exponentially when $\mathbf{h}$ is far away from $\mathbf{n}$, therefore the result is taken to the $p$ power, $p > 1$ to make it decrease faster

The color of the pixel is then

<div>$$
L = k_d \cdot I \cdot max(0, \mathbf{n \cdot l}) + k_s \cdot I \cdot max(0, \mathbf{n \cdot h})^p
$$</div>

Where

- $k_s$ is the specular coefficient, a characteristic of the surface
- $I$ is the intensity of the light source
- $p$ is a variable that controls how fast the result decreases

Note that the color of the pixel is the overall contribution of both the lambertian shading model and the blinn-phong shading model

### Ambient shading

Surfaces that receive no illumination are rendered completely black, to avoid this a constant component is added to the shading model, the color depends entirely on the object hit with no dependence on the surface geometry

<div>$$
L = k_a \cdot I_a + k_d \cdot I \cdot max(0, \mathbf{n \cdot l}) + k_s \cdot I \cdot max(0, \mathbf{n \cdot h})^p
$$</div>

Where

- $k_a$ is the surface ambient coefficient
- $I_a$ is the ambient light intensity

