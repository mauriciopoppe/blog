---
title: "Transformation Matrix"
date: 2015-10-15 13:00:00
summary: |
  A transformation matrix encodes a linear transformation as a grid of numbers. The rows or columns record where the basis vectors land, so multiplying a vector by the matrix applies the transformation. Matrices compose through multiplication, which is why the rendering pipeline stores every step as one matrix.
image: /images/scaling-rotation-translation.png
tags: ["computer graphics", "transformation matrix", "2d", "3d", "linear algebra", "geometry", "quaternions"]
libraries: ["katex"]
math_terms: ["graphics"]
references:
  - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
aliases:
  - /notes/computer-graphics/transformation-matrices/transformation-matrix/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
favorite: true
---

A transformation moves geometry: translation shifts it, rotation spins it, scale resizes it. In the rendering pipeline, every vertex passes through a sequence of these transformations before it reaches the screen, and each one is stored as a matrix.

A matrix is a compact encoding of a linear transformation. The key observation is that a transformation is fully determined by what it does to the basis vectors, so the matrix only needs to record those images.

## The Matrix Encodes the Basis

Let the standard basis vectors be $\mathbf{i} = [1, 0, 0], \; \mathbf{j} = [0, 1, 0], \; \mathbf{k} = [0, 0, 1]$. Multiplying each of these vectors by a matrix $\mathbf{M}$:

$$
\begin{aligned}
\mathbf{iM} &= \begin{bmatrix}1 & 0 & 0\end{bmatrix}
\begin{bmatrix}
m\_{11} & m\_{12} & m\_{13} \\\\
m\_{21} & m\_{22} & m\_{23} \\\\
m\_{31} & m\_{32} & m\_{33}
\end{bmatrix} = \begin{bmatrix} m\_{11} & m\_{12} & m\_{13} \end{bmatrix} \\\\
\mathbf{jM} &= \begin{bmatrix}0 & 1 & 0\end{bmatrix}
\begin{bmatrix}
m\_{11} & m\_{12} & m\_{13} \\\\
m\_{21} & m\_{22} & m\_{23} \\\\
m\_{31} & m\_{32} & m\_{33}
\end{bmatrix} = \begin{bmatrix} m\_{21} & m\_{22} & m\_{23} \end{bmatrix} \\\\
\mathbf{kM} &= \begin{bmatrix}0 & 0 & 1\end{bmatrix}
\begin{bmatrix}
m\_{11} & m\_{12} & m\_{13} \\\\
m\_{21} & m\_{22} & m\_{23} \\\\
m\_{31} & m\_{32} & m\_{33}
\end{bmatrix} = \begin{bmatrix} m\_{31} & m\_{32} & m\_{33} \end{bmatrix}
\end{aligned}
$$

The first row of $\mathbf{M}$ contains the transformed $\mathbf{i}$, the second row contains the transformed $\mathbf{j}$, and the third row contains the transformed $\mathbf{k}$. To build a matrix for a transformation, apply the transformation to each basis vector and write the results as the rows.

## Transforming a Vector

Let $\mathbf{v}$ be a vector expressed in this coordinate space as a linear combination of basis vectors:

$$
\mathbf{v} = v\_x \mathbf{i} + v\_y \mathbf{j} + v\_z \mathbf{k}
$$

Multiplying $\mathbf{v}$ by matrix $\mathbf{M}$:

$$
\begin{aligned}
\mathbf{v}^\prime = \mathbf{vM} &= (v\_x \mathbf{i} + v\_y \mathbf{j} + v\_z \mathbf{k}) \mathbf{M} \\\\
&= v\_x (\mathbf{iM}) + v\_y (\mathbf{jM}) + v\_z (\mathbf{kM}) \\\\
&= v\_x \begin{bmatrix} m\_{11} & m\_{12} & m\_{13} \end{bmatrix} + v\_y \begin{bmatrix} m\_{21} & m\_{22} & m\_{23} \end{bmatrix} + v\_z \begin{bmatrix} m\_{31} & m\_{32} & m\_{33} \end{bmatrix}
\end{aligned}
$$

If rows of $\mathbf{M}$ are denoted by basis vectors $\mathbf{p}, \mathbf{q}, \mathbf{r}$:

$$
\mathbf{M} = \begin{bmatrix}
-\mathbf{p}- \\\\
-\mathbf{q}- \\\\
-\mathbf{r}-
\end{bmatrix}
$$

Then the matrix product expresses the transformed vector directly:

$$
\mathbf{v}^\prime = \mathbf{vM} = v\_x \mathbf{p} + v\_y \mathbf{q} + v\_z \mathbf{r}
$$

The product $\mathbf{vM}$ is a linear combination of the rows of $\mathbf{M}$. Because the rows are the transformed basis vectors, multiplying by $\mathbf{M}$ replaces each basis vector with its image and rebuilds $\mathbf{v}$ from those images. That is the entire mechanism of a transformation matrix in one sentence.

When the row vectors are the basis vectors of a coordinate system measured in an outer coordinate system, $\mathbf{M}$ encodes a coordinate space transformation:

$$
\mathbf{v}^\prime = \mathbf{vM} = \begin{bmatrix}v\_x & v\_y & v\_z\end{bmatrix}
\begin{bmatrix}
-\mathbf{p}- \\\\
-\mathbf{q}- \\\\
-\mathbf{r}-
\end{bmatrix} = v\_x \mathbf{p} + v\_y \mathbf{q} + v\_z \mathbf{r}
$$

To denote a matrix transforming frame $a$ to frame $b$ represented in frame $c$:

$$
^c \mathbf{M}\_{a \to b}
$$

When frame $c$ equals frame $b$, the leading superscript is omitted:

$$
\mathbf{M}\_{a \to b}
$$

For example, the matrix transforming from object space to upright space is:

$$
\mathbf{M}\_{\text{object} \to \text{upright}}
$$

Transforming vector $\mathbf{v}\_{\text{object}}$ into upright space:

$$
\mathbf{v}\_{\text{upright}} = \mathbf{v}\_{\text{object}} \mathbf{M}\_{\text{object} \to \text{upright}}
$$

## Row Versus Column Vectors

In row-vector conventions, transformations post-multiply vectors:

$$
\mathbf{v}^\prime = \mathbf{vM}
$$

Where $\mathbf{M}$ encodes basis vectors in its rows.

Applying transformations $\mathbf{A}$, $\mathbf{B}$, and $\mathbf{C}$ in order:

$$
\mathbf{v}^\prime = \mathbf{vABC}
$$

In modern computer graphics and OpenGL/DirectX shaders, **column vectors** are the standard convention, and Three.js follows it. Applying the matrix transpose:

$$
\begin{aligned}
\mathbf{v}^\prime &= \mathbf{vABC} \\\\
(\mathbf{v}^\prime)^T &= (\mathbf{vABC})^T \\\\
\mathbf{v}^\prime\_{\text{col}} &= \mathbf{C}^T \mathbf{B}^T \mathbf{A}^T \mathbf{v}\_{\text{col}}
\end{aligned}
$$

Column-vector matrices $\mathbf{A}^T, \mathbf{B}^T, \mathbf{C}^T$ store transformed basis vectors in their **columns**:

$$
\mathbf{M} = \begin{bmatrix}
\mathbf{p} & \mathbf{q} & \mathbf{r}
\end{bmatrix} \quad \text{where } \mathbf{p} = \begin{bmatrix} p\_x \\\\ p\_y \\\\ p\_z \end{bmatrix}, \; \mathbf{q} = \begin{bmatrix} q\_x \\\\ q\_y \\\\ q\_z \end{bmatrix}, \; \mathbf{r} = \begin{bmatrix} r\_x \\\\ r\_y \\\\ r\_z \end{bmatrix}
$$

In column notation, the subscript arrow points from right to left, matching matrix multiplication order:

$$
\mathbf{v}\_{\text{upright}} = \mathbf{M}\_{\text{upright} \leftarrow \text{object}} \mathbf{v}\_{\text{object}}
$$

## Composition: Why Matrices Win

Multiplying two matrices produces a third matrix that applies both transformations in sequence. A chain of transformations therefore collapses into a single matrix, and one matrix multiply per vertex replaces a long sequence of steps. This is why the pipeline stores every stage as a matrix, and why a scene graph keeps a single <span data-term="M_model" class="math-term-trigger cursor-help">model matrix</span> per object instead of a list of operations.

Order matters: applying a rotation then a translation is not the same as applying the translation first. [Combining Matrix Transformations](/notes/computer-graphics/combining-transformations/) works through the order rules and the resulting composed matrices.

## What Comes Next

The rest of this stage builds each transformation matrix from the basis-vector recipe above:

- [Scale](/notes/computer-graphics/scale/) and [Shearing](/notes/computer-graphics/shearing/) stretch and skew the basis.
- [Translation](/notes/computer-graphics/translation/) shifts the origin and needs homogeneous coordinates.
- [Rotation](/notes/computer-graphics/rotation/) spins the basis, with [Euler Angles](/notes/computer-graphics/euler-angles/) and [Quaternions](/notes/computer-graphics/quaternions/) as alternative orientation representations.
- [Coordinate Systems](/notes/computer-graphics/coordinate-systems/) defines the spaces these transformations move between.
- [Combining Matrix Transformations](/notes/computer-graphics/combining-transformations/) composes everything into the model matrix $\mathbf{M}\_{\text{model}}$ used by the pipeline.
