---
title: "Orthographic projection"
date: 2016-02-05 23:15:00
bibliography:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
---

## Orthographic projection

A projection is a *dimension-reducing* operation, if we apply a scale operation with $k = 0$ all the points are projected onto the perpendicular axis in 2d or the perpendicular plane in 3d of $\unit{n}$, this type of projection is called *orthographic projection*

### Projection on a cardinal axis/plane

The simplest type of projection just discards a coordinate of the vectors transformed, e.g. in 2d the vector $\mathbf{v} = \begin{bmatrix} v_x & v_y \end{bmatrix}^T$ projected onto the $x$ axis will discard its $y$ coordinate and make $\mathbf{v'} = \begin{bmatrix} v_x & 0 \end{bmatrix}^T$, the operation can be achieved by applying a scale transformation with $k = 0$

<div>$$
\mathbf{P_x} = \mathbf{S} \left (\begin{bmatrix}
0 \\ 1
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
1 & 0 \\
0 & 0
\end{bmatrix}
$$</div>

<div>$$
\mathbf{P_y} = \mathbf{S} \left (\begin{bmatrix}
1 \\ 0
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
0 & 0 \\
0 & 1
\end{bmatrix}
$$</div>

When a 3d vector $v = [v_x, v_y, v_z]$ is projected onto the $xy$ plane then the $v_z$ coordinate will be discarded by copying just $v_x$ and $v_y$ i.e. $v' = [v_x, v_y, 0]$

<div>$$
\mathbf{P_{xy}} = \mathbf{S} \left (\begin{bmatrix}
0 \\ 0 \\ 1
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 0
\end{bmatrix}
$$</div>

<div>$$
\mathbf{P_{xz}} = \mathbf{S}\left (\begin{bmatrix}
0 \\ 1 \\ 0
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
1 & 0 & 0 \\
0 & 0 & 0 \\
0 & 0 & 1
\end{bmatrix}
$$</div>

<div>$$
\mathbf{P_{yz}} = \mathbf{S} \left (\begin{bmatrix}
1 \\ 0 \\ 0
\end{bmatrix}, 0 \right ) = \begin{bmatrix}
0 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix}
$$</div>

### Projection onto an arbitrary axis/plane

We can apply a zero factor scale along the direction of the vector perpendicular to the axis/plane

In 2d

<div>$$
\begin{align*}
\mathbf{P(\unit{n})} = \mathbf{S}(\unit{n}, 0) &= \begin{bmatrix}
1 + (0 - 1){n_x}^2 & (0 - 1)n_xn_y \\
(0 - 1)n_xn_y & 1 + (0 - 1{n_y}^2
\end{bmatrix} \\
\\
&= \begin{bmatrix}
1 - {n_x}^2 & -n_xn_y \\
-n_xn_y & 1 - {n_y}^2
\end{bmatrix}
\end{align*}
$$</div>

In 3d

<div>$$
\begin{align*}
\mathbf{P(\unit{n})} = \mathbf{S}(\unit{n}, 0) &= \begin{bmatrix}
1 + (0 - 1){n_x}^2 & (0 - 1)n_yn_x & (0 - 1)n_zn_x \\
(0 - 1)n_xn_y & 1 + (0 - 1{n_y}^2 & (0 - 1)n_zn_y \\
(0 - 1)n_xn_z & (0 - 1)n_yn_z & 1 + (0 - 1){n_z}^2
\end{bmatrix} \\
\\
&= \begin{bmatrix}
1 - {n_x}^2 & -n_yn_x & -n_zn_x \\
-n_xn_y & 1 - {n_y}^2 & -n_zn_y \\
-n_xn_z & -n_yn_z & 1 - {n_z}^2 \\
\end{bmatrix}
\end{align*}
$$</div>
