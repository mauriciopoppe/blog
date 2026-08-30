---
title: "Combining Matrix Transformations"
date: 2016-02-10 21:13:17
favorite: true
summary: |
  Taking multiple matrices, each encoding a single transformation, and combining them
  is how we transform vectors between different spaces. This article covers creating a
  transformation matrix that combines a rotation followed by a translation, a translation
  followed by a rotation, and why the order of the multiplication matters.
image: /images/scaling-rotation-translation.png
tags: ["computer graphics", "transformation matrix", "linear algebra"]
libraries: ["katex"]
math_terms: ["graphics"]
interactive: true
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
aliases:
  - /notes/computer-graphics/transformation-matrices/combining-transformations/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

Multiplying a vector by a matrix applies one transformation. Multiplying two matrices produces a third matrix that applies both transformations in sequence, so a chain of transformations collapses into a single matrix.

Rendering is one place where this matters. An object's vertices are expressed in several spaces before they reach the screen. The **model transform** $\mathbf{M}\_{\text{world} \leftarrow \text{object}}$ moves vertices from *object space* to *world space*, and the **view transform** $\mathbf{M}\_{\text{view} \leftarrow \text{world}}$ moves them from *world space* to *view space*:

$$
\begin{aligned}
\mathbf{v}\_{\text{world}} &= \mathbf{M}\_{\text{world} \leftarrow \text{object}} \mathbf{v}\_{\text{object}} \\\\
\mathbf{v}\_{\text{view}} &= \mathbf{M}\_{\text{view} \leftarrow \text{world}} \mathbf{v}\_{\text{world}} \\\\
&= \mathbf{M}\_{\text{view} \leftarrow \text{world}} \mathbf{M}\_{\text{world} \leftarrow \text{object}} \mathbf{v}\_{\text{object}}
\end{aligned}
$$

Because matrix multiplication composes transformations, the two hops combine into a single matrix, $\mathbf{M}\_{\text{view} \leftarrow \text{object}} = \mathbf{M}\_{\text{view} \leftarrow \text{world}} \mathbf{M}\_{\text{world} \leftarrow \text{object}}$, which transforms vertices directly from object space to view space:

$$
\begin{aligned}
\mathbf{v}\_{\text{view}} &= (\mathbf{M}\_{\text{view} \leftarrow \text{world}} \mathbf{M}\_{\text{world} \leftarrow \text{object}})\mathbf{v}\_{\text{object}} \\\\
&= \mathbf{M}\_{\text{view} \leftarrow \text{object}} \mathbf{v}\_{\text{object}}
\end{aligned}
$$

Order matters: <span data-term="TR" class="math-term-trigger cursor-help">rotation followed by translation</span> $\mathbf{T}\mathbf{R}$ and <span data-term="RT" class="math-term-trigger cursor-help">translation followed by rotation</span> $\mathbf{R}\mathbf{T}$ give different results, and the rest of this article shows why. The same composition powers the [view transform](/notes/computer-graphics/view-transform/), a change between coordinate systems, covered in its own article.

## Rotation Followed by Translation

Apply a rotation and then a translation to a vector $\mathbf{v}$:

$$
\mathbf{v}^\prime = \mathbf{T} \mathbf{R} \mathbf{v}
$$

Multiplying the two matrices gives:

$$
\mathbf{T} \mathbf{R} = \begin{bmatrix}
\mathbf{I}\_{3 \times 3} & \mathbf{T}\_{3 \times 1} \\\\
\mathbf{0}\_{1 \times 3} & 1
\end{bmatrix} \begin{bmatrix}
\mathbf{R}\_{3 \times 3} & \mathbf{0}\_{3 \times 1} \\\\
\mathbf{0}\_{1 \times 3} & 1
\end{bmatrix} = \begin{bmatrix}
\mathbf{R}\_{3 \times 3} & \mathbf{T}\_{3 \times 1} \\\\
\mathbf{0}\_{1 \times 3} & 1
\end{bmatrix}
$$

Applied to $\mathbf{v}$:

$$
\mathbf{v}^\prime = \mathbf{T} \mathbf{R} \mathbf{v} = \begin{bmatrix}
\mathbf{R}\_{3 \times 3} & \mathbf{T}\_{3 \times 1} \\\\
\mathbf{0}\_{1 \times 3} & 1
\end{bmatrix} \begin{bmatrix} \mathbf{v}\_{3 \times 1} \\\\ 1 \end{bmatrix} = \begin{bmatrix} \mathbf{R}\_{3 \times 3} \mathbf{v}\_{3 \times 1} + \mathbf{T}\_{3 \times 1} \\\\ 1 \end{bmatrix}
$$

In compact form:

$$
\mathbf{v}^\prime = \mathbf{T} \mathbf{R} \mathbf{v} = \mathbf{R} \mathbf{v} + \mathbf{T}\_{3 \times 1}
$$

## Translation Followed by Rotation

Apply a translation and then a rotation to the same vector $\mathbf{v}$:

$$
\mathbf{v}^\prime = \mathbf{R} \mathbf{T} \mathbf{v}
$$

Multiplying the two matrices in this order gives:

$$
\mathbf{R} \mathbf{T} = \begin{bmatrix}
\mathbf{R}\_{3 \times 3} & \mathbf{0}\_{3 \times 1} \\\\
\mathbf{0}\_{1 \times 3} & 1
\end{bmatrix} \begin{bmatrix}
\mathbf{I}\_{3 \times 3} & \mathbf{T}\_{3 \times 1} \\\\
\mathbf{0}\_{1 \times 3} & 1
\end{bmatrix} = \begin{bmatrix}
\mathbf{R}\_{3 \times 3} & \mathbf{R}\_{3 \times 3} \mathbf{T}\_{3 \times 1} \\\\
\mathbf{0}\_{1 \times 3} & 1
\end{bmatrix}
$$

Applied to $\mathbf{v}$:

$$
\mathbf{v}^\prime = \mathbf{R} \mathbf{T} \mathbf{v} = \begin{bmatrix}
\mathbf{R}\_{3 \times 3} & \mathbf{R}\_{3 \times 3} \mathbf{T}\_{3 \times 1} \\\\
\mathbf{0}\_{1 \times 3} & 1
\end{bmatrix} \begin{bmatrix} \mathbf{v}\_{3 \times 1} \\\\ 1 \end{bmatrix} = \begin{bmatrix} \mathbf{R}\_{3 \times 3} \mathbf{v}\_{3 \times 1} + \mathbf{R}\_{3 \times 3} \mathbf{T}\_{3 \times 1} \\\\ 1 \end{bmatrix}
$$

In compact form:

$$
\mathbf{v}^\prime = \mathbf{R} \mathbf{T} \mathbf{v} = \mathbf{R} \mathbf{v} + \mathbf{R}\mathbf{T}\_{3 \times 1}
$$

Note that both the vector $\mathbf{v}$ and the translation are transformed by $\mathbf{R}$.

## The Product of Two Transformations

The two products differ because of a general property of matrix multiplication. For two transformation matrices $\mathbf{M}$ and $\mathbf{N}$ applied to a vector in that order, the product is:

$$
\mathbf{NM} = \begin{bmatrix}
\mathbf{\hat{s}} &
\mathbf{\hat{t}} &
\mathbf{\hat{u}}
\end{bmatrix}
\begin{bmatrix}
\mathbf{\hat{p}} &
\mathbf{\hat{q}} &
\mathbf{\hat{r}}
\end{bmatrix}
= \begin{bmatrix}
p\_x \mathbf{s} + p\_y \mathbf{t} + p\_z \mathbf{u} \\\\
q\_x \mathbf{s} + q\_y \mathbf{t} + q\_z \mathbf{u} \\\\
r\_x \mathbf{s} + r\_y \mathbf{t} + r\_z \mathbf{u}
\end{bmatrix}^T
$$

The rows of the product are the result of transforming the basis vectors of $\mathbf{M}$ by the transformation matrix $\mathbf{N}$, so matrix-matrix multiplication encodes a basis transformation. In $\mathbf{T}\mathbf{R}$ the rotation acts on the vector and leaves the translation column as $\mathbf{T}$. In $\mathbf{R}\mathbf{T}$ the rotation acts on the translation as well, producing $\mathbf{R}\mathbf{T}$. In general, $\mathbf{T}\mathbf{R} \neq \mathbf{R}\mathbf{T}$.

## Interactive 3D Transformation Chain Simulator

<span data-term="TRS" class="math-term-trigger cursor-help">Matrix composition</span> operates identically to nested function application:

$$
(\mathbf{T} \circ \mathbf{R} \circ \mathbf{S})(\mathbf{v}) = \mathbf{T}(\mathbf{R}(\mathbf{S}(\mathbf{v}))) = \mathbf{T}\mathbf{R}\mathbf{S}\mathbf{v}
$$

Because matrix-vector multiplication is functional application, transformation chains evaluate from **right to left**: the innermost transformation $\mathbf{S}$ acts first on the vector $\mathbf{v}$, followed by $\mathbf{R}$, and finally $\mathbf{T}$. Toggling between **Standard TRS** (scaling and rotating in place at the origin, then translating) versus **Orbit RTS** (translating first, which swings the object around the origin during rotation) visualizes the non-commutativity derived above ($\mathbf{TR} \neq \mathbf{RT}$). Hovering over any matrix symbol reveals its exact 4x4 matrix formulation.

<div id="transformation-chain-simulator"></div>

## Key Takeaways

| Concept | Formula | Takeaway |
| :--- | :--- | :--- |
| **Composition** | $\mathbf{v}^\prime = \mathbf{N}\mathbf{M}\mathbf{v}$ | Matrices apply right to left, so a chain of transformations collapses into a single matrix. |
| **Order matters** | $\mathbf{T}\mathbf{R} \neq \mathbf{R}\mathbf{T}$ | Rotating after translating differs from translating after rotating. |
| **Rotation then translation** | $\mathbf{v}^\prime = \mathbf{R}\mathbf{v} + \mathbf{T}$ | The rotation applies first, then the translation, and the translation is never rotated. |
| **Translation then rotation** | $\mathbf{v}^\prime = \mathbf{R}\mathbf{v} + \mathbf{R}\mathbf{T}$ | The rotation applies last and rotates the translation along with the vector. |
| **Scene Graph TRS** | $\mathbf{M} = \mathbf{T}\mathbf{R}(q)\mathbf{S}$ | 3D engines store rotations as quaternions $q$ for smooth [SLERP](/notes/computer-graphics/quaternions/) blending before constructing $\mathbf{R}(q)$. |

<script type="module" src="/js/computer-graphics/combining-transformations-explorer.js"></script>
