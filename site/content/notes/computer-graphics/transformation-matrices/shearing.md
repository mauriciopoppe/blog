---
title: "Shearing Objects with a Transformation Matrix"
date: 2016-02-05 10:00:00
summary: |
  Shearing is a transformation that skews the coordinate space. The idea is to add a multiple of one coordinate to another.
image: /images/normals!transformation.jpg
tags: ["computer graphics", "transformation matrix", "shearing", "2d", "3d", "linear algebra"]
libraries: ["math"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
---

This article is part 3 in the series about transformation matrices:

- [Part 1: Coordinate systems and transformations between them](../coordinate-systems/)
- [Part 2: Scaling objects with a transformation matrix](../scale/)
- **[Part 3: Shearing objects with a transformation matrix](../shearing/) (this article)**
- [Part 4: Translating objects with a transformation matrix](../translation/)
- [Part 5: Combining Matrix Transformations](../combining-transformations/)

## 2D Shearing

In 2D, we can skew points towards the $x$-axis by making $x' = x + sy$. If $s > 0$, then points will skew towards the positive $x$-axis; if $s < 0$, points will move towards the negative $x$-axis.

The transformation matrix that skews points towards the $x$-axis is:

<div>$$
\begin{equation} \label{2d-shear-x}
\mathbf{H_x}(s) = \begin{bmatrix}
1 & s \\
0 & 1
\end{bmatrix}
\end{equation}
$$</div>

Towards the $y$-axis is:

<div>$$
\begin{equation} \label{2d-shear-y}
\mathbf{H_y}(s) = \begin{bmatrix}
1 & 0 \\
s & 1
\end{bmatrix}
\end{equation}
$$</div>

For example, a vector $\mathbf{v}$ multiplied by \eqref{2d-shear-x} results in:

<div>$$
\mathbf{v'} = \mathbf{H_x}(s)\mathbf{v} = \begin{bmatrix}
1 & s \\
0 & 1
\end{bmatrix} \begin{bmatrix} v_x \\ v_y \end{bmatrix} = \begin{bmatrix} v_x + sv_y \\ v_y \end{bmatrix}
$$</div>


## 3D Shearing

The notation $\mathbf{H_{xy}}$ indicates that the $x$ and $y$ coordinates are shifted by the other coordinate, $z$, i.e.:

<div>$$
\begin{align*}
x' &= x + sz \\
y' &= y + tz \\
z' &= z
\end{align*}
$$</div>

The shearing matrices in 3D are:

<div>$$
\begin{equation} \label{shear-xy}
\mathbf{H_{xy}}(s,t) = \begin{bmatrix}
1 & 0 & s \\
0 & 1 & t \\
0 & 0 & 1
\end{bmatrix}
\end{equation}
$$</div>

<div>$$
\begin{equation} \label{shear-xz}
\mathbf{H_{xz}}(s,t) = \begin{bmatrix}
1 & s & 0 \\
0 & 1 & 0 \\
0 & t & 1
\end{bmatrix}
\end{equation}
$$</div>

<div>$$
\begin{equation} \label{shear-yz}
\mathbf{H_{yz}}(s,t) = \begin{bmatrix}
1 & 0 & 0 \\
s & 1 & 0 \\
t & 0 & 1
\end{bmatrix}
\end{equation}
$$</div>

For example, a vector $\mathbf{v}$ multiplied by \eqref{shear-xy} results in:

<div>$$
\mathbf{v'} = \mathbf{H_{xy}}(s,t) \mathbf{v} = \begin{bmatrix}
1 & 0 & s \\
0 & 1 & t \\
0 & 0 & 1
\end{bmatrix} \begin{bmatrix} v_x \\ v_y \\ v_z \end{bmatrix}  = \begin{bmatrix} v_x + sv_z \\ v_y + tv_z \\ v_z \end{bmatrix}
$$</div>
