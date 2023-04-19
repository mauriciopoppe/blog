---
title: "Transformation matrix to transform 3D objects from World Space to View Space (View transform)"
description: |
  One matrix transformation in the 3D to a 2D transformation pipeline is the view transform
  where objects are transformed from world space to view space.
  a transformation matrix.

  <br />
  In this article I cover the math behind the generation of this transformation matrix.
image: /images/camera-transformation!camera-space.jpg
tags: ["computer graphics", "transformation matrix", "view transform", "3d", "2d"]
libraries: ["math"]
date: 2016-02-13 11:59:56
references:
  - "Schaback, J. (2016). Camera Transformation and View Matrix. [online] Schabby.de. Available at: http://schabby.de/view-matrix/ [Accessed 7 Mar. 2016]."
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
---

The objective of this step is to find a transformation matrix to transform points expressed in *world space* to *view space*, a camera can be imagined to exist from a known point of view that captures some objects of the space

<div>$$
\mathbf{v}_{view} = \mathbf{M}_{view} \mathbf{v}_{wld}
$$</div>

The construction of the transformation matrix to transform points from *world space* to *view space* needs 3 parameters:

- $\mathbf{camera}$ a point expressed in world space defining the location of the point of view, note that the $\mathbf{camera}$ is at the origin of the *view space*
- $\mathbf{at}$ the direction where the camera is aiming at
- $\mathbf{up}$ denotes the upward orientation of the camera (typically coincides with the positive $y$-axis)

{{< figure src="/images/camera-transformation!camera-space.jpg" title="view transform" >}}

<!--
In OpenGL we can use the GLU function `gluLookAt()` to position the camera

```cpp
void gluLookAt(GLdouble xCam, GLdouble yCam, GLdouble zCam,
               GLdouble xAt, GLdouble yAt, GLdouble zAt,
               GLdouble xUp, GLdouble yUp, GLdouble zUp)
```

The default value is

```cpp
gluLookAt(0.0, 0.0, 0.0,
          0.0, 0.0, -100.0,
          0.0, 1.0, 0.0)
```
-->

Note that the camera is looking at the negative $z$-axis of the *view space*, this is a convention rather than a rule since the *projection matrix* will be constructed in a way so that points in the $-z$-axis in *view space* are transformed to the range $[-1,1]$

## Derivation of the view transform matrix

The process of transforming the vertices in the *world space* to *view space* is given by

- Creation of a coordinate frame for the *view space*
- Application of the appropriate translation for the camera location (world space -> upright space)
- Transformation of the points in world space to camera space (upright space -> object space)

### Creation of a coordinate frame for the view space

Given $\mathbf{camera}$, $\mathbf{at}$ and $\mathbf{up}$ the steps to compute the coordinate frame are whose basis vectors are $\mathbf{u}$, $\mathbf{v}$ and $\mathbf{w}$ (note that since these are basis vectors they need to be unit vectors)

- compute $\mathbf{w}$ trivially by normalizing the vector $\mathbf{camera - at}$

<div>$$
\mathbf{w} = \frac{\mathbf{camera - at}}{\norm{\mathbf{camera - at}}}
$$</div>

<span></span>

- next $\mathbf{u}$ can be computed with the cross product of $\mathbf{w}$ and $\mathbf{up}$, again the resulting vector must be normalized

<div>$$
\mathbf{u} = \frac{\mathbf{w} \times \mathbf{up}}{\norm{ \mathbf{w} \times \mathbf{up} }}
$$</div>

<span></span>

- finally $\mathbf{v}$ can be computed as

<div>$$
\mathbf{v} = \mathbf{w} \times \mathbf{u}
$$</div>

### Camera translation

The transformation matrix that moves all the points from *world space* to *view's upright space* is

<div>$$
\mathbf{T} = \begin{bmatrix}
1 & 0 & 0 & -camera_x \\
0 & 1 & 0 & -camera_y \\
0 & 0 & 1 & -camera_z \\
0 & 0 & 0 & 1
\end{bmatrix}
$$</div>

### Transformation of the points from world space to view space

Given that the camera transformation basis vectors (encoded in a matrix) are

<div>$$
\mathbf{M}_{wld \leftarrow view} = \begin{bmatrix}
\mathbf{u}_{3 \times 1} &
\mathbf{v}_{3 \times 1} &
\mathbf{w}_{3 \times 1}
\end{bmatrix}
$$</div>

Expressed in a 4x4 matrix

<div>$$
\mathbf{M}_{wld \leftarrow view} = \begin{bmatrix}
x_u & x_v & x_w & 0 \\
y_u & y_v & y_w & 0 \\
z_u & z_v & z_w & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$</div>

Works as a transformation matrix to transform points from *view space* to *world space*, therefore the matrix that does the opposite operation (transformation from *world space* to *view space*) is the inverse of this matrix (the transpose is equivalent since the matrix is orthonormal)

<div>$$
\mathbf{M}_{view \leftarrow wld} = \mathbf{M^{-1}}_{wld \leftarrow view}  = \mathbf{M}^T_{wld \leftarrow view} = \begin{bmatrix}
x_u & y_u & z_u & 0 \\
x_v & y_v & z_v & 0 \\
x_w & y_w & z_w & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$</div>

### The view matrix

We can combine the translation and the rotation matrix in a single matrix called the *view matrix* which has the form

<div>$$
\begin{align*}
\mathbf{M}_{view} &= \mathbf{M}_{view \leftarrow wld} \mathbf{T}  \\
&= \begin{bmatrix}
x_u & y_u & z_u & 0 \\
x_v & y_v & z_v & 0 \\
x_w & y_w & z_w & 0 \\
0 & 0 & 0 & 1
\end{bmatrix} \begin{bmatrix}
1 & 0 & 0 & -camera_x \\
0 & 1 & 0 & -camera_y \\
0 & 0 & 1 & -camera_z \\
0 & 0 & 0 & 1
\end{bmatrix} \\
&= \begin{bmatrix}
x_u & y_u & z_u & -\mathbf{camera \cdot u} \\
x_v & y_v & z_v & -\mathbf{camera \cdot v} \\
x_w & y_w & z_w & -\mathbf{camera \cdot w} \\
0 & 0 & 0 & 1
\end{bmatrix}
\end{align*}
$$</div>

