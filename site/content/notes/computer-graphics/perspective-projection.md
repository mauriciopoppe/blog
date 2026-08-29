---
title: "Perspective Projection"
summary: |
  Perspective projection is a fundamental projection technique that transforms objects in a higher dimension to a lower dimension. This transformation is usually used for objects in a 3D world to be rendered into a screen (a 2D surface). In the transformation, these objects give the realistic impression of depth.
  <br />
  <br />
  This article covers the math behind it and how to generate the transformation matrix to achieve the transformation.
image: /images/perspective-projection-real-life.jpeg
tags: ["computer graphics", "perspective projection"]
date: 2016-02-06 18:00:00
libraries: ["katex"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
aliases:
  - /notes/computer-graphics/transformation-matrices/projections/perspective/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

As seen in [projective geometry](/notes/mathematics/geometry/projective-space/), the perspective phenomenon is where an object appears to be smaller the further away it is from the point of view.

The rendering pipeline's perspective matrix, which maps the view frustum into the canonical cube, is derived in [The Projection Transform](/notes/computer-graphics/projection-transform/).

We can again use some concepts of projective geometry to understand perspective projection, particularly the fact that any object in our 3D world is represented in the 4D projective hyperplane by the homogeneous coordinate $(x, y, z, 1)$. Now, any finite point with $w \neq 1$ can be projected to the 4D hyperplane $w = 1$ by dividing each coordinate by $w$, i.e., $(\tfrac{x}{w}, \tfrac{y}{w}, \tfrac{z}{w})$. A key observation in the values of $w$ is that *the higher the value of $w$, the smaller the object will be when it gets projected to the $w=1$ hyperplane*.

> Perspective is implemented in 3D by using a transformation matrix that changes the value of $w$ based on how far the object is (the $z$-coordinate).

Now, let's imagine that we want to project the points that exist in our world to the plane $z = d$.

{{< figure src="/images/perspective-projection!y.png" title="Perspective Projection Y" >}}

By similar images, we can see that the projected value of the $y$-coordinate is:

$$
\frac{v\_y^\prime}{d} = \frac{v\_y}{v\_z} \Rightarrow v\_y^\prime = \frac{d v\_y}{v\_z}
$$

The projected value of the $x$-coordinate can be computed in a similar way:

{{< figure src="/images/perspective-projection!x.png" title="Perspective Projection X" >}}

$$
\frac{v\_x^\prime}{d} = \frac{v\_x}{v\_z} \Rightarrow v\_x^\prime = \frac{d v\_x}{v\_z}
$$

The projected value of the $z$-coordinate is the same for all the points:

$$
v\_z^\prime = d
$$

Summarizing:

$$
\mathbf{v^\prime} = \begin{bmatrix} \tfrac{d v\_x}{v\_z} & \tfrac{d v\_y}{v\_z} & d \end{bmatrix}^T
$$

Manipulating the last equation so that it has a common denominator:

$$
\mathbf{v^\prime} = \begin{bmatrix} \tfrac{d v\_x}{v\_z} & \tfrac{d v\_y}{v\_z} & d \tfrac{v\_z}{v\_z} \end{bmatrix}^T = \frac{  \begin{bmatrix} v\_x & v\_y & v\_z \end{bmatrix}^T }{ \tfrac{v\_z}{d} }
$$

The point above expressed in 4D homogeneous coordinates is:

$$
\mathbf{v^\prime} = \begin{bmatrix} v\_x & v\_y & v\_z & \tfrac{v\_z}{d}  \end{bmatrix}^T
$$

Finally, the transformation matrix that transforms $\mathbf{v}$ to $\mathbf{v^\prime}$ is:

$$
\mathbf{v^\prime} = \begin{bmatrix}
1 & 0 & 0 & 0 \\\\
0 & 1 & 0 & 0 \\\\
0 & 0 & 1 & 0 \\\\
0 & 0 & \tfrac{1}{d} & 0
\end{bmatrix} \begin{bmatrix} v\_x \\\\ v\_y \\\\ v\_z \\\\ 1 \end{bmatrix} = \begin{bmatrix} v\_x \\\\ v\_y \\\\ v\_z \\\\ \frac{v\_z}{d} \end{bmatrix}
$$
