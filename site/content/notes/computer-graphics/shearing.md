---
title: "Shearing"
date: 2016-02-05 10:00:00
summary: |
  Shearing is a transformation that skews the coordinate space. The idea is to add a multiple of one coordinate to another.
image: /images/normals!transformation.jpg
tags: ["computer graphics", "transformation matrix", "shearing", "2d", "3d", "linear algebra"]
libraries: ["katex"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
aliases:
  - /notes/computer-graphics/transformation-matrices/shearing/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

## 2D Shearing

In 2D, we can skew points towards the $x$-axis by making $x^\prime = x + sy$. If $s > 0$, then points will skew towards the positive $x$-axis; if $s < 0$, points will move towards the negative $x$-axis.

The transformation matrix that skews points towards the $x$-axis is:

$$
\mathbf{H_x}(s) = \begin{bmatrix}
1 & s \\\\
0 & 1
\end{bmatrix}
$$

Towards the $y$-axis is:

$$
\mathbf{H_y}(s) = \begin{bmatrix}
1 & 0 \\\\
s & 1
\end{bmatrix}
$$

For example, a vector $\mathbf{v}$ multiplied by the matrix above results in:

$$
\mathbf{v^\prime} = \mathbf{H_x}(s)\mathbf{v} = \begin{bmatrix}
1 & s \\\\
0 & 1
\end{bmatrix} \begin{bmatrix} v_x \\\\ v_y \end{bmatrix} = \begin{bmatrix} v_x + sv_y \\\\ v_y \end{bmatrix}
$$


## 3D Shearing

The notation $\mathbf{H_{xy}}$ indicates that the $x$ and $y$ coordinates are shifted by the other coordinate, $z$, i.e.:

$$
\begin{align*}
x^\prime &= x + sz \\\\
y^\prime &= y + tz \\\\
z^\prime &= z
\end{align*}
$$

The shearing matrices in 3D are:

$$
\mathbf{H_{xy}}(s,t) = \begin{bmatrix}
1 & 0 & s \\\\
0 & 1 & t \\\\
0 & 0 & 1
\end{bmatrix}
$$

$$
\mathbf{H_{xz}}(s,t) = \begin{bmatrix}
1 & s & 0 \\\\
0 & 1 & 0 \\\\
0 & t & 1
\end{bmatrix}
$$

$$
\mathbf{H_{yz}}(s,t) = \begin{bmatrix}
1 & 0 & 0 \\\\
s & 1 & 0 \\\\
t & 0 & 1
\end{bmatrix}
$$

For example, a vector $\mathbf{v}$ multiplied by $\mathbf{H_{xy}}(s,t)$ results in:

$$
\mathbf{v^\prime} = \mathbf{H_{xy}}(s,t) \mathbf{v} = \begin{bmatrix}
1 & 0 & s \\\\
0 & 1 & t \\\\
0 & 0 & 1
\end{bmatrix} \begin{bmatrix} v_x \\\\ v_y \\\\ v_z \end{bmatrix}  = \begin{bmatrix} v_x + sv_z \\\\ v_y + tv_z \\\\ v_z \end{bmatrix}
$$
