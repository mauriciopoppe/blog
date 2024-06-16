---
title: Translating objects with a Transformation Matrix
date: 2016-02-05 18:00:00
description: |
  We build different types of transformation matrices to translate objects along cardinal axes,
  arbitrary axes in 2d and 3d with matrix multiplication!
image: /images/affine-space!translation.jpg
tags: ["computer graphics", "transformation matrix", "2d", "3d", "linear algebra", "translation"]
libraries: ["math"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
---

This article is part 4 in the series about transformation matrices:

- [Part 1: Coordinate systems and transformations between them](../coordinate-systems/)
- [Part 2: Scaling objects with a transformation matrix](../scale/)
- [Part 3: Shearing objects with a transformation matrix](../shearing/)
- **[Part 4: Translating objects with a transformation matrix](../translation/) (this article)**
- [Part 5: Combining Matrix Transformations](../combining-transformations/)

## 2D translation

A translation is an affine transformation which is a linear transformation followed by some displacement

<div>$$
\mathbf{v'} = \mathbf{Mv} + \mathbf{b}
$$</div>

Even though we can't express 2D translation using a 2x2 matrix, we can express such a transformation as a shearing transformation in 3D [projective geometry](/notes/mathematics/geometry/projective-space), to do so we have to imagine that the 2D Euclidean world exists as the plane $w = 1$ in a 3D space, under this geometry any point has the form $\begin{bmatrix} x & y & 1 \end{bmatrix}$

In Euclidean geometry a vector expressed as a linear combination of the standard basis has the form

<div>$$
\mathbf{v} = v_x \unit{i} + v_y \unit{j} = \begin{bmatrix} v_x & v_y\end{bmatrix}^T
$$</div>

In Projective geometry a vector which exists in the plane $w = 1$ has the form

<div>$$
\mathbf{v} = v_x \unit{i} + v_y \unit{j} + 1 \unit{w} = \begin{bmatrix} v_x & v_y & 1 \end{bmatrix}^T
$$</div>

This basis can be represented using the following transformation matrix

<div>$$
\mathbf{M} = \begin{bmatrix}
1 & 0 & 0 \\
0 & 1 & 0 \\
0 & 0 & 1
\end{bmatrix} = \begin{bmatrix} \mathbf{\cuv{i}} & \mathbf{\cuv{j}} & \mathbf{\cuv{w}} \end{bmatrix}
$$</div>

The translation transform then can be seen in Projective geometry as a simple *shearing* of the space by the coordinate $w$, using the shearing transform $\mathbf{H_{xy}}(\Delta{x}, \Delta{y})$ to transform a point $v$

<div>$$
\mathbf{v'} = \mathbf{H_{xy}}(\Delta{x},\Delta{y}) \mathbf{v} = \begin{bmatrix}
1 & 0 & \Delta{x} \\
0 & 1 & \Delta{y} \\
0 & 0 & 1
\end{bmatrix} \begin{bmatrix} v_x \\ v_y \\ 1 \end{bmatrix} = \begin{bmatrix} v_x + \Delta{x} \\ v_y + \Delta{y} \\ 1 \end{bmatrix}
$$</div>

{{< video "https://upload.wikimedia.org/wikipedia/commons/transcoded/3/34/Affine_transformations.ogv/Affine_transformations.ogv.480p.ogv" >}}

Now that we're using perspective geometry to represent entities, let's imagine a point $p = \begin{bmatrix} x & y & 0 \end{bmatrix}$ (a point that lies in the plane $w = 0$), whenever this point is transformed by a transformation matrix we can notice that the translation components of the matrix are cancelled because of $w = 0$, we can take advantage of this fact and represent vectors with this notation.

Let $v_{\infty}$ be a point located in the plane $w = 0$, applying the shearing operation $\mathbf{H_{xy}}(s, t)$ results in

<div>$$
\mathbf{v_{\infty}'} = H_{xy}(\Delta{x},\Delta{y}) \mathbf{v_{\infty}} = \begin{bmatrix}
1 & 0 & \Delta{x} \\
0 & 1 & \Delta{y} \\
0 & 0 & 1
\end{bmatrix} \begin{bmatrix} v_x \\ v_y \\ 0 \end{bmatrix} = \begin{bmatrix} v_x \\ v_y \\ 0 \end{bmatrix}
$$</div>

It's important to note that this matrix multiplication is still a *linear transformation* and that this trick of translating 2D points is actually a shearing of the 3D projective plane

## 3D translation

Similarly to 2D a 3D translation can be represented as a shearing of the 4D projective hyperplane which has the form

<div>$$
\mathbf{T} = \mathbf{H_{xyz}}(\Delta{x},\Delta{y},\Delta{z}) = \begin{bmatrix}
1 & 0 & 0 & \Delta{x} \\
0 & 1 & 0 & \Delta{y} \\
0 & 0 & 1 & \Delta{z} \\
0 & 0 & 0 & 1
\end{bmatrix}
$$</div>

When a 4D vector existing on the hyperplane $w = 1$ is transformed with this matrix the result is

<div>$$
\mathbf{v'} = \mathbf{H_{xyz}}(\Delta{x},\Delta{y},\Delta{z})\mathbf{v} = \begin{bmatrix}
1 & 0 & 0 & \Delta{x} \\
0 & 1 & 0 & \Delta{y} \\
0 & 0 & 1 & \Delta{z} \\
0 & 0 & 0 & 1
\end{bmatrix} \begin{bmatrix} v_x \\ v_y \\ v_z \\ 1 \end{bmatrix}  = \begin{bmatrix} v_x + \Delta{x} \\ v_y + \Delta{y} \\ v_z + \Delta{z} \\ 1 \end{bmatrix}
$$</div>

The general 3D translation matrix is then denoted as

<div>$$
\begin{equation} \label{general-translation-matrix}
\mathbf{T} = \begin{bmatrix}
1 & 0 & 0 & T_x \\
0 & 1 & 0 & T_y \\
0 & 0 & 1 & T_z \\
0 & 0 & 0 & 1
\end{bmatrix} = \begin{bmatrix}
I_{3 \times 3} & T_{3 \times 1} \\
0_{1 \times 3} & 1
\end{bmatrix}
\end{equation}
$$</div>

