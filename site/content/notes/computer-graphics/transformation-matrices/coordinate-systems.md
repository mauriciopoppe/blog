---
title: "Coordinate systems and transformations between them"
date: 2015-10-15 12:00:00
description: |
  The position and orientation of an object in real life can be described with
  direction and magnitude e.g. the TV is 3 meters in front of me. While that description is good
  for me it might be that for someone else in a room the TV is 5 meters to the right of that
  person. Information about objects are given in the context of a reference frame.
  Usually in Computer Graphics objects need to be expressed with respect to the camera frame,
  this article covers why we need to have multiple reference frames as well as the math
  needed to express objects in a different reference frame.
image: /images/combining-transformations!coordinate-systems.jpg
tags: ["computer graphics", "transformation matrix", "coordinate systems", "object space", "upright space", "world space"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
---

## World space[^space], upright space, object space

> why bother having multiple spaces?

Information is given only in the context of a particular reference frame

- **world space**: global reference frame
  - the position of other coordinates spaces can be expressed in terms of this space
  - this space cannot be expressed in terms of any larger/outer space
  - note that there's no "absolute" space however this space is the largest one we care about
- **object space**: space associated with each object that belongs to the world space
  - **camera space**: object space associated with the viewport used for rendering
- **upright space**: special space associated with each object, it's halfway between world space and object space in the sense that *the axes of this space are **parallel** to the ones of the world space* but the origin of this space is coincident with the origin of the object space

> Why do we have an upright space?

 Thanks to this space the problem of transforming a point between object space -> world space (and viceversa) can be divided in two subproblems

- object space -> upright space (a rotation)
- upright space -> world space (a change of location)

## Coordinates of a vector

A coordinate system consists of

- an origin (displacement from another coordinate system origin)
- a basis (a set of three vectors)

The numeric coordinates of a vector expressed with respect to some basis are the coefficients of the representation of the vector as a linear combination of the basis

<div>$$
\mathbf{v} = v_x \mathbf{i} + v_y \mathbf{j} + v_z \mathbf{k}
$$</div>

In other words the numeric coordinates are the quantities that multiply each basis vector which are $v_x$, $v_y$ and $v_z$

When the basis vectors are $\mathbf{i} = [1, 0, 0]$, $\mathbf{j} = [0, 1, 0]$ and $\mathbf{k} = [0, 0, 1]$ then

<div>$$
\begin{align*}
\mathbf{v} &= v_x \begin{bmatrix} 1 & 0 & 0 \end{bmatrix} + v_y \begin{bmatrix} 0 & 1 & 0 \end{bmatrix} + v_z \begin{bmatrix} 0 & 0 & 1 \end{bmatrix} \\
&= \begin{bmatrix} v_x & v_y & v_z \end{bmatrix}
\end{align*}
$$</div>

## Transformations between space coordinates

### From object space to upright space

Let $\mathbf{v}$ be some vector expressed/measured relative to a space (object space) whose basis vectors are $\mathbf{p}, \mathbf{q}, \mathbf{r}$ (which are themselves expressed/measured relative to a wrapper space), the vector $\mathbf{v}$ expressed relative to the wrapper space is

<div>$$
\begin{align}
\mathbf{v}_{upright} &= v_x \mathbf{p} + v_y \mathbf{q} + v_z \mathbf{r} \label{object-upright} \\
&= v_x \begin{bmatrix} p_x & p_y & p_z \end{bmatrix} + v_y \begin{bmatrix} q_x & q_y & q_z \end{bmatrix} + v_z \begin{bmatrix} r_x & r_y & r_z \end{bmatrix} \nonumber \\
&= \begin{bmatrix}
v_x p_x + v_y q_x + v_z r_x &
v_x p_y + v_y q_y + v_z r_y &
v_x p_z + v_y q_z + v_z r_z
\end{bmatrix}  \nonumber
\end{align}
$$</div>

Note that if $\mathbf{p}, \mathbf{q}, \mathbf{r}$ were not orthogonal then $\mathbf{v}_{upright}$ couldn't be *uniquely* determined

The coordinates of $\mathbf{p}, \mathbf{q}, \mathbf{r}$ are always equal to $[1, 0, 0], [0, 1, 0]$ and $[0, 0, 1]$ respectively *when expressed using the coordinate system for which they are the basis*, relative to other wrapper coordinate systems they will have arbitrary coordinates

### From upright space to world space

Since the axes of the upright space are parallel to the axes of the world space the only difference between these spaces is the translation of these axes with respect to the origin of the axes of the world space, let $\mathbf{o}$ be the translation of the upright basis axes then

<div>$$
\mathbf{v}_{world} = \mathbf{o} + \mathbf{v}_{upright}
$$</div>

### From world space to upright space

We just have to translate the whole space so that the origin lies exactly on the origin of the upright space, if $\mathbf{o}$ is the origin of the upright space expressed in world space then

<div>$$
\mathbf{v}_{upright} = \mathbf{v}_{world} - \mathbf{o}
$$</div>

### From upright space to object space

What if $\mathbf{v}\_{upright}$ is known and we want to know $\mathbf{v}$? The dot product is the key as it's used to measure distance in a particular direction, since we know that the basis vectors $\mathbf{p}, \mathbf{q}, \mathbf{r}$ are expressed in terms of the upright space perspective we just have to calculate the projection of $\mathbf{v}\_{upright}$ in the direction of each $\mathbf{p}, \mathbf{q}, \mathbf{r}$

<div>$$
\begin{align*}
v_x = \mathbf{v}_{upright} \cdot \mathbf{p} \\
v_y = \mathbf{v}_{upright} \cdot \mathbf{q} \\
v_z = \mathbf{v}_{upright} \cdot \mathbf{r}
\end{align*}
$$</div>

If we use \eqref{object-upright} this works because the dot product with $\mathbf{p}$ will isolate the $v_x$ coordinate

<div>$$
\begin{align*}
\mathbf{v}_{upright} \cdot \mathbf{p} &= v_x (\mathbf{p} \cdot \mathbf{p}) + v_y (\mathbf{q} \cdot \mathbf{p}) + v_z (\mathbf{r} \cdot \mathbf{p}) \\
&= v_x (1) + v_y (0) + v_z (0) \\
&= v_x
\end{align*}
$$</div>

**Note:** this only works when $\mathbf{p}, \mathbf{q}, \mathbf{r}$ are orthonormal, for the general case we have to solve this using linear algebra

[^space]: words like "coordinate system", "coordinate frame" or "space" are used interchangeably

