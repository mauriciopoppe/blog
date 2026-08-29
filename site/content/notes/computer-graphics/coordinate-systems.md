---
title: "Coordinate Systems"
date: 2015-10-15 12:00:00
summary: |
  The position and orientation of an object in real life can be described with
  direction and magnitude, e.g., the TV is 3 meters in front of me. While that description is good
  for me, it might be that for someone else in a room, the TV is 5 meters to the right of that
  person. Information about objects is given in the context of a reference frame.
  Usually, in Computer Graphics, objects need to be expressed with respect to the camera frame.
  This article covers why we need to have multiple reference frames and the math
  needed to express objects in a different reference frame.
image: /images/combining-transformations!coordinate-systems.jpg
tags: ["computer graphics", "transformation matrix", "coordinate systems", "object space", "upright space", "world space"]
libraries: ["katex"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
aliases:
  - /notes/computer-graphics/transformation-matrices/coordinate-systems/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

The camera's view transform applies the same machinery from the camera's point of view; see [The View Transform](/notes/computer-graphics/view-transform/).

## World space[^space], upright space, object space

> Why bother having multiple spaces?

Information is given only in the context of a particular reference frame.

- **World space**: A global reference frame.
  - The position of other coordinate spaces can be expressed in terms of this space.
  - This space cannot be expressed in terms of any larger/outer space.
  - Note that there's no "absolute" space; however, this space is the largest one we care about.
- **Object space**: The space associated with each object that belongs to the world space.
  - **Camera space**: The object space associated with the viewport used for rendering.
- **Upright space**: A special space associated with each object. It's halfway between world space and object space in the sense that *the axes of this space are **parallel** to the ones of the world space*, but the origin of this space is coincident with the origin of the object space.

> Why do we have an upright space?

Thanks to this space, the problem of transforming a point between object space and world space (and vice-versa) can be divided into two subproblems:

- Object space to upright space (a rotation)
- Upright space to world space (a change of location)

## Coordinates of a vector

A coordinate system consists of:

- An origin (displacement from another coordinate system's origin)
- A basis (a set of three vectors)

The numeric coordinates of a vector expressed with respect to some basis are the coefficients of the representation of the vector as a linear combination of the basis vectors.

$$
\mathbf{v} = v\_x \mathbf{i} + v\_y \mathbf{j} + v\_z \mathbf{k}
$$

In other words, the numeric coordinates are the quantities that multiply each basis vector, which are $v\_x$, $v\_y$, and $v\_z$.

When the basis vectors are $\mathbf{i} = [1, 0, 0]$, $\mathbf{j} = [0, 1, 0]$, and $\mathbf{k} = [0, 0, 1]$, then:

$$
\begin{align*}
\mathbf{v} &= v\_x \begin{bmatrix} 1 & 0 & 0 \end{bmatrix} + v\_y \begin{bmatrix} 0 & 1 & 0 \end{bmatrix} + v\_z \begin{bmatrix} 0 & 0 & 1 \end{bmatrix} \\\\
&= \begin{bmatrix} v\_x & v\_y & v\_z \end{bmatrix}
\end{align*}
$$

## Transformations between space coordinates

### From object space to upright space

Let $\mathbf{v}$ be some vector expressed/measured relative to a space (object space) whose basis vectors are $\mathbf{p}, \mathbf{q}, \mathbf{r}$ (which are themselves expressed/measured relative to a wrapper space). The vector $\mathbf{v}$ expressed relative to the wrapper space is:

$$
\begin{align*}
\mathbf{v}\_{\text{upright}} &= v\_x \mathbf{p} + v\_y \mathbf{q} + v\_z \mathbf{r} \\\\
&= v\_x \begin{bmatrix} p\_x & p\_y & p\_z \end{bmatrix} + v\_y \begin{bmatrix} q\_x & q\_y & q\_z \end{bmatrix} + v\_z \begin{bmatrix} r\_x & r\_y & r\_z \end{bmatrix} \\\\
&= \begin{bmatrix}
v\_x p\_x + v\_y q\_x + v\_z r\_x \\\\
v\_x p\_y + v\_y q\_y + v\_z r\_y \\\\
v\_x p\_z + v\_y q\_z + v\_z r\_z
\end{bmatrix}
\end{align*}
$$

Note that if $\mathbf{p}, \mathbf{q}, \mathbf{r}$ were not orthogonal, then $\mathbf{v}\_{\text{upright}}$ couldn't be *uniquely* determined.

The coordinates of $\mathbf{p}, \mathbf{q}, \mathbf{r}$ are always equal to $[1, 0, 0], [0, 1, 0]$, and $[0, 0, 1]$ respectively *when expressed using the coordinate system for which they are the basis*; relative to other wrapper coordinate systems, they will have arbitrary coordinates.

### From upright space to world space

Since the axes of the upright space are parallel to the axes of the world space, the only difference between these spaces is the translation of these axes with respect to the origin of the axes of the world space. Let $\mathbf{o}$ be the translation of the upright basis axes, then:

$$
\mathbf{v}\_{\text{world}} = \mathbf{o} + \mathbf{v}\_{\text{upright}}
$$

### From world space to upright space

We just have to translate the whole space so that the origin lies exactly on the origin of the upright space. If $\mathbf{o}$ is the origin of the upright space expressed in world space, then:

$$
\mathbf{v}\_{\text{upright}} = \mathbf{v}\_{\text{world}} - \mathbf{o}
$$

### From upright space to object space

What if $\mathbf{v}\_{\text{upright}}$ is known and we want to know $\mathbf{v}$? The dot product is the key, as it's used to measure distance in a particular direction. Since we know that the basis vectors $\mathbf{p}, \mathbf{q}, \mathbf{r}$ are expressed in terms of the upright space perspective, we just have to calculate the projection of $\mathbf{v}\_{\text{upright}}$ in the direction of each of $\mathbf{p}, \mathbf{q}, \mathbf{r}$.

$$
\begin{align*}
v\_x = \mathbf{v}\_{\text{upright}} \cdot \mathbf{p} \\\\
v\_y = \mathbf{v}\_{\text{upright}} \cdot \mathbf{q} \\\\
v\_z = \mathbf{v}\_{\text{upright}} \cdot \mathbf{r}
\end{align*}
$$

Using the expansion of $\mathbf{v}\_{\text{upright}}$ above, the dot product with $\mathbf{p}$ will isolate the $v\_x$ coordinate:

$$
\begin{align*}
\mathbf{v}\_{\text{upright}} \cdot \mathbf{p} &= v\_x (\mathbf{p} \cdot \mathbf{p}) + v\_y (\mathbf{q} \cdot \mathbf{p}) + v\_z (\mathbf{r} \cdot \mathbf{p}) \\\\
&= v\_x (1) + v\_y (0) + v\_z (0) \\\\
&= v\_x
\end{align*}
$$

**Note:** This only works when $\mathbf{p}, \mathbf{q}, \mathbf{r}$ are orthonormal. For the general case, we have to solve this using linear algebra.

[^space]: Words like "coordinate system", "coordinate frame", or "space" are used interchangeably.
