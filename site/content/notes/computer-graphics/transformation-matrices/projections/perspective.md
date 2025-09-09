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
libraries: ["math"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
---

As seen in [projective geometry](notes/mathematics/geometry/projective-space/), the perspective phenomenon is where an object appears to be smaller the further away it is from the point of view.

We can again use some concepts of projective geometry to understand perspective projection, particularly the fact that any object in our 3D world is represented in the 4D projective hyperplane by the homogeneous coordinate $(x, y, z, 1)$. Now, any finite point with $w
ot = 1$ can be projected to the 4D hyperplane $w = 1$ by dividing each coordinate by $w$, i.e., $(\tfrac{x}{w}, \tfrac{y}{w}, \tfrac{z}{w})$. A key observation in the values of $w$ is that *the higher the value of $w$, the smaller the object will be when it gets projected to the $w=1$ hyperplane*.

> Perspective is implemented in 3D by using a transformation matrix that changes the value of $w$ based on how far the object is (the $z$-coordinate).

Now, let's imagine that we want to project the points that exist in our world to the plane $z = d$.

{{< figure src="/images/perspective-projection!y.png" title="Perspective Projection Y" >}}

By similar images, we can see that the projected value of the $y$-coordinate is:

<div>$$
\frac{v_y'}{d} = \frac{v_y}{v_z} \Rightarrow v_y' = \frac{d v_y}{v_z}
$$</div>

The projected value of the $x$-coordinate can be computed in a similar way:

{{< figure src="/images/perspective-projection!x.png" title="Perspective Projection X" >}}

<div>$$
\frac{v_x'}{d} = \frac{v_x}{v_z} \Rightarrow v_x' = \frac{d v_x}{v_z}
$$</div>

The projected value of the $z$-coordinate is the same for all the points:

<div>$$
v_z' = d
$$</div>

Summarizing:

<div>$$
\mathbf{v'} = \begin{bmatrix} \tfrac{d v_x}{v_z} & \tfrac{d v_y}{v_z} & d \end{bmatrix}^T
$$</div>

Manipulating the last equation so that it has a common denominator:

<div>$$
\mathbf{v'} = \begin{bmatrix} \tfrac{d v_x}{v_z} & \tfrac{d v_y}{v_z} & d \tfrac{v_z}{v_z} \end{bmatrix}^T = \frac{  \begin{bmatrix} v_x & v_y & v_z \end{bmatrix}^T }{ \tfrac{v_z}{d} }
$$</div>

The point above expressed in 4D homogeneous coordinates is:

<div>$$
\mathbf{v'} = \begin{bmatrix} v_x & v_y & v_z & \tfrac{v_z}{d}  \end{bmatrix}^T
$$</div>

Finally, the transformation matrix that transforms $\mathbf{v}$ to $\mathbf{v'}$ is:

<div>$$
\mathbf{v'} = \begin{bmatrix}
1 & 0 & 0 & 0 \\
0 & 1 & 0 & 0 \\
0 & 0 & 1 & 0 \\
0 & 0 & \tfrac{1}{d} & 0
\end{bmatrix} \begin{bmatrix} v_x \\ v_y \\ v_z \\ 1 \end{bmatrix} = \begin{bmatrix} v_x \\ v_y \\ v_z \\ \frac{v_z}{d} \end{bmatrix}
$$</div>
