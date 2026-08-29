---
title: "Orthographic Projection"
date: 2016-02-05 23:15:00
summary: |
  Orthographic projection is a dimension-reducing operation: a point is projected onto an axis in 2D or a plane in 3D by zeroing the coordinate along the perpendicular direction, which keeps parallel lines parallel. This article derives the projection matrices for cardinal axes and planes, and then for an arbitrary axis or plane.
image: https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Axonometric_projection.svg/800px-Axonometric_projection.svg.png
tags: ["computer graphics", "orthographic projection"]
bibliography:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
libraries: ["katex"]
aliases:
  - /notes/computer-graphics/transformation-matrices/projections/orthographic/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

## Orthographic Projection

A projection is a *dimension-reducing* operation. If we apply a scale operation with $k = 0$, all the points are projected onto the perpendicular axis in 2D or the perpendicular plane in 3D of $\mathbf{n}$. This type of projection is called *orthographic projection*.

Projecting a point onto an axis or plane is the geometric primitive behind the rendering pipeline's orthographic projection. [The Projection Transform](/notes/computer-graphics/projection-transform/) derives the matrix that maps the whole view volume into the canonical cube.

### Projection on a Cardinal Axis/Plane

The simplest type of projection just discards a coordinate of the vectors transformed. E.g., in 2D, the vector $\mathbf{v} = \begin{bmatrix} v\_x & v\_y \end{bmatrix}^T$ projected onto the $x$-axis will discard its $y$-coordinate and make $\mathbf{v^\prime} = \begin{bmatrix} v\_x & 0 \end{bmatrix}^T$. The operation can be achieved by applying a scale transformation with $k = 0$.

$$
\mathbf{P\_x} = \mathbf{S} \left (\begin{bmatrix}
0 \\\\ 1
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
1 & 0 \\\\
0 & 0
\end{bmatrix}
$$

$$
\mathbf{P\_y} = \mathbf{S} \left (\begin{bmatrix}
1 \\\\ 0
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
0 & 0 \\\\
0 & 1
\end{bmatrix}
$$

When a 3D vector $v = [v\_x, v\_y, v\_z]$ is projected onto the $xy$-plane, then the $v\_z$ coordinate will be discarded by copying just $v\_x$ and $v\_y$, i.e., $v^\prime = [v\_x, v\_y, 0]$.

$$
\mathbf{P\_{xy}} = \mathbf{S} \left (\begin{bmatrix}
0 \\\\ 0 \\\\ 1
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
1 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 0
\end{bmatrix}
$$

$$
\mathbf{P\_{xz}} = \mathbf{S}\left (\begin{bmatrix}
0 \\\\ 1 \\\\ 0
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
1 & 0 & 0 \\\\
0 & 0 & 0 \\\\
0 & 0 & 1
\end{bmatrix}
$$

$$
\mathbf{P\_{yz}} = \mathbf{S} \left (\begin{bmatrix}
1 \\\\ 0 \\\\ 0
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
0 & 0 & 0 \\\\
0 & 1 & 0 \\\\
0 & 0 & 1
\end{bmatrix}
$$

### Projection onto an Arbitrary Axis/Plane

We can apply a zero-factor scale along the direction of the vector perpendicular to the axis/plane.

In 2D:

$$
\begin{align*}
\mathbf{P}(\mathbf{n}) = \mathbf{S}(\mathbf{n}, 0) &= \begin{bmatrix}
1 + (0 - 1){n\_x}^2 & (0 - 1)n\_xn\_y \\\\
(0 - 1)n\_xn\_y & 1 + (0 - 1){n\_y}^2
\end{bmatrix} \\\\
\\\\
&= \begin{bmatrix}
1 - {n\_x}^2 & -n\_xn\_y \\\\
-n\_xn\_y & 1 - {n\_y}^2
\end{bmatrix}
\end{align*}
$$

In 3D:

$$
\begin{align*}
\mathbf{P}(\mathbf{n}) = \mathbf{S}(\mathbf{n}, 0) &= \begin{bmatrix}
1 + (0 - 1){n\_x}^2 & (0 - 1)n\_yn\_x & (0 - 1)n\_zn\_x \\\\
(0 - 1)n\_xn\_y & 1 + (0 - 1){n\_y}^2 & (0 - 1)n\_zn\_y \\\\
(0 - 1)n\_xn\_z & (0 - 1)n\_yn\_z & 1 + (0 - 1){n\_z}^2
\end{bmatrix} \\\\
\\\\
&= \begin{bmatrix}
1 - {n\_x}^2 & -n\_yn\_x & -n\_zn\_x \\\\
-n\_xn\_y & 1 - {n\_y}^2 & -n\_zn\_y \\\\
-n\_xn\_z & -n\_yn\_z & 1 - {n\_z}^2 \\\\
\end{bmatrix}
\end{align*}
$$
