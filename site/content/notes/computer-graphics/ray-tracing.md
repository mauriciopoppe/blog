---
title: "Ray Tracing"
summary: |
  Ray tracing is the process of identifying the color of all the pixels on a 2D screen by emitting rays from all the pixels, simulating how light travels in real life. This article covers the math for ray generation from each pixel for both orthographic and perspective cameras.
image: /images/ray-tracing!perspective.jpg
tags: ["computer graphics", "ray tracing", "orthographic projection", "perspective projection"]
libraries: ["katex"]
date: 2016-02-26 17:03:44
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
---

A ray tracer emits a ray from each pixel toward the scene to determine the color of the pixel. The process of computing the color can be split into three parts:

1.  **Ray generation**: The origin and direction of each pixel ray are computed.
2.  **Ray intersection**: The ray finds the closest object intersecting the viewing ray.
3.  **Shading**: The intersection point, surface normal, and other information are used to determine the color of the pixel.

A ray can be represented with a 3D parametric line from the eye $\mathbf{e}$ to a point $\mathbf{s}$ on the image plane as:

$$
\mathbf{p}(t) = \mathbf{e} + t(\mathbf{ s - e })
$$

Note that:

- $\mathbf{p}(0) = \mathbf{e}$
- $\mathbf{p}(1) = \mathbf{s}$
- If $0 < t_1 < t_2$, then $\mathbf{p}(t_1)$ is closer to $\mathbf{e}$ than $\mathbf{p}(t_2)$.
- If $t < 0$, then $\mathbf{p}(t)$ is behind $\mathbf{e}$.

## Camera Coordinate System

All the rays start from the origin of an orthonormal coordinate frame known as the camera/eye coordinate system. In this frame, the camera is looking at the negative $\mathbf{w}$ axis.

{{< figure src="/images/ray-tracing!camera.jpg" title="Camera" >}}

The coordinate system is built from:

- The *viewpoint* $\mathbf{e}$, which is at the origin of the camera coordinate system.
- The *view direction*, which is $\mathbf{-w}$.
- The *up vector*, which is used to construct a basis that has $\mathbf{v}$ and $\mathbf{w}$ in the plane defined by the *view direction* and the *up vector*.

## Ray Generation

### Pixel Coordinates

The image dimensions are defined with four numbers:

- $l,  r$: the position of the left and right edges.
- $t,  b$: the position of the top and bottom edges.

Note that the coordinates are expressed in the camera coordinate frame defined in a plane parallel to the $w=0$ plane (the $w=0$ plane is defined by the point $\mathbf{e}$ and the vectors $\mathbf{u}$ and $\mathbf{v}$).

The image has to be fitted within a rectangle of $n_x \times n_y$ pixels. For example, the pixel $(0,0)$ has the position $(l + 0.5 \tfrac{r - l}{n_x}, b + 0.5 \tfrac{t - b}{n_y})$. Note that the half-pixel measurement times pixel-dimension is because of the way a pixel is defined (see [rendering](../rendering)). A pixel with coordinates $(x, y)$ will have the position:

$$
\begin{align*}
u = l + (x + 0.5) \frac{r - l}{n_x} \\
v = b + (y + 0.5) \frac{t - b}{n_y}
\end{align*}
$$

### Orthographic View

For an orthographic view, all the rays will have the direction $-\mathbf{w}$. There isn't a particular viewpoint; however, we can define all the rays to be emitted from the $w=0$ plane using the pixel's image-plane position as the ray's starting point.

{{< figure src="/images/ray-tracing!orthographic.jpg" title="Orthographic View" >}}

$$
\begin{align*}
\mathbf{ray_{direction}} &= -\mathbf{w} \\
\mathbf{ray_{origin}} &= \mathbf{e} + u \mathbf{u} + v \mathbf{v}
\end{align*}
$$

### Perspective View

For a perspective view, all the rays will have the same origin $e$, but the image-plane is not located at $w=0$ but at some distance $d$ in the $-\mathbf{w}$ direction. This time, each ray will have a varying direction based on the location of the pixel's image-plane position with respect to $e$.

{{< figure title="Perspective View" src="/images/ray-tracing!perspective.jpg" >}}

$$
\begin{align*}
\mathbf{ray_{direction}} &= -d \mathbf{w} + u \mathbf{u} + v \mathbf{v} \\
\mathbf{ray_{origin}} &= \mathbf{e}
\end{align*}
$$

## Ray Intersection

Once a ray in the form $\mathbf{e} + t\mathbf{d}$ is generated, we find the first intersection with an object where $t > 0$. Whenever there are many objects that intersect a ray, the intersection point with the lowest $t$ is returned.

The following pseudocode tests for "hits":

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

Once the visible surface is known, the next step is to compute the color of the pixel using a shading model. The variables involved (the intersection point $\mathbf{p}$, light direction $\mathbf{l}$, view direction $\mathbf{v}$, and surface normal $\mathbf{n}$) and the models built from them, from flat and Lambertian through Blinn-Phong and ambient, are covered in [Surface Shading](/notes/computer-graphics/surface-shading/).
