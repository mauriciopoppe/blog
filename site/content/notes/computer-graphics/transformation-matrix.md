---
title: "Transformation Matrix"
date: 2015-10-15 13:00:00
summary: |
  A linear transformation can be represented with a matrix that transforms vectors from one space to another. Transformation matrices allow arbitrary transformations to be displayed in the same format. Also, matrices can be multiplied to enable composition. Row vectors vs column vectors and quaternion-to-matrix mapping.
image: /images/scaling-rotation-translation.png
tags: ["computer graphics", "transformation matrix", "2d", "3d", "linear algebra", "geometry", "quaternions"]
libraries: ["katex"]
references:
  - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
aliases:
  - /notes/computer-graphics/transformation-matrices/transformation-matrix/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

Let standard basis vectors be $\mathbf{i} = [1, 0, 0], \; \mathbf{j} = [0, 1, 0], \; \mathbf{k} = [0, 0, 1]$. Multiplying each of these vectors by a matrix $\mathbf{M}$:

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

The first row of $\mathbf{M}$ contains the result of transforming $\mathbf{i}$, the second row contains the transformed $\mathbf{j}$, and the third row contains the transformed $\mathbf{k}$.

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

The product $\mathbf{vM}$ is a linear combination of the rows of $\mathbf{M}$. When row vectors represent basis vectors of a coordinate system measured in an outer coordinate system, $\mathbf{M}$ encodes a coordinate space transformation:

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

In modern computer graphics and OpenGL/DirectX shaders, **column vectors** are the standard convention. Applying the matrix transpose:

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

## Conversion from Quaternions to Transformation Matrices

While 3D scene graphs and physics engines interpolate orientations using 4D unit quaternions $q = [s, x\mathbf{i} + y\mathbf{j} + z\mathbf{k}]$ to avoid gimbal lock, GPU vertex pipelines require $4 \times 4$ matrices for hardware-accelerated vertex transformation.

Expanding the quaternion sandwich product $p^\prime = q p q^\*$ into matrix form produces the equivalent $3 \times 3$ rotation matrix:

$$
\mathbf{R}(q) = \begin{bmatrix}
1 - 2(y^2 + z^2) & 2(xy - sz) & 2(xz + sy) \\\\
2(xy + sz) & 1 - 2(x^2 + z^2) & 2(yz - sx) \\\\
2(xz - sy) & 2(yz + sx) & 1 - 2(x^2 + y^2)
\end{bmatrix}
$$

In 4D homogeneous coordinates:

$$
\mathbf{M}(q) = \begin{bmatrix}
1 - 2(y^2 + z^2) & 2(xy - sz) & 2(xz + sy) & 0 \\\\
2(xy + sz) & 1 - 2(x^2 + z^2) & 2(yz - sx) & 0 \\\\
2(xz - sy) & 2(yz + sx) & 1 - 2(x^2 + y^2) & 0 \\\\
0 & 0 & 0 & 1
\end{bmatrix}
$$

For algebraic proofs and spherical linear interpolation, see [Quaternions](/notes/computer-graphics/quaternions/).

