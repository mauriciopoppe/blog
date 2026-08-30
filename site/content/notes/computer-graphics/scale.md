---
title: "Scaling"
date: 2015-10-20 13:30:00
summary: |
  We build different types of transformation matrices to scale objects along cardinal axes and arbitrary axes in 2D and 3D with matrix multiplication!
image: /images/scale!arbitrary-axis.png
tags: ["computer graphics", "transformation matrix", "2d", "3d", "linear algebra", "scaling"]
libraries: ["katex"]
math_terms: ["graphics"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
aliases:
  - /notes/computer-graphics/transformation-matrices/scale/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

## Scaling Along the Cardinal Axes

Intuitively, the basis vectors should be multiplied by a scalar. Also, they are independently affected by the scale factors.

In 2D, the basis vectors become:

$$
\mathbf{p}^\prime = k_x \mathbf{p} = k_x \begin{bmatrix} 1 \\\\ 0 \end{bmatrix} = \begin{bmatrix} k_x \\\\ 0 \end{bmatrix} \\\\
\mathbf{q}^\prime = k_y \mathbf{q} = k_y \begin{bmatrix} 0 \\\\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\\\ k_y \end{bmatrix}
$$

Constructing the 2D <span data-term="S" class="math-term-trigger cursor-help">scale matrix</span> $\mathbf{S}(k_x, k_y)$ from these basis vectors:

$$
\mathbf{S}(k_x, k_y) = \begin{bmatrix} k_x & 0 \\\\ 0 & k_y \end{bmatrix}
$$

Similarly, the 3D scale matrix is given by:

$$
\mathbf{S}(k_x, k_y, k_z) = \begin{bmatrix}
k_x & 0 & 0 \\\\
0 & k_y & 0 \\\\
0 & 0 & k_z
\end{bmatrix}
$$

## Scaling Along an Arbitrary Axis

Let $\hat{\mathbf{n}}$ be the unit vector parallel to the direction of scale and $k$ to be the scale factor. A vector transformed by this scale operation can be represented as:

$$
\mathbf{v}^\prime = \mathbf{S}(\hat{\mathbf{n}}, k) \mathbf{v}
$$

{{< figure src="/images/scale!arbitrary-axis.png" title="Scale Arbitrary Axis" >}}

Separate $\mathbf{v}$ into two vectors: a vector parallel to $\hat{\mathbf{v}}$ called $\mathbf{v_{\parallel}}$ and a vector perpendicular to $\hat{\mathbf{v}}$ called $\mathbf{v_{\perp}}$ such that:

$$
\mathbf{v} = \mathbf{v_{\parallel}} + \mathbf{v_{\perp}}
$$

Where:

$$
\begin{align*}
\mathbf{v_{\parallel}} &= (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} \\\\
\mathbf{v_{\perp}} &= \mathbf{v} - \mathbf{v_{\parallel}}
\end{align*}
$$

We can also represent $\mathbf{v}^\prime$ as a sum of two vectors parallel and perpendicular to $\hat{\mathbf{n}}$:

$$
\mathbf{v}^\prime = \mathbf{v_{\parallel}}^\prime + \mathbf{v_{\perp}}^\prime
$$

Note that any vector that lies in the 2D line or 3D plane perpendicular to $\hat{\mathbf{n}}$ will not be affected by the scale operation, so $\mathbf{v}^\prime = \mathbf{v_{\parallel}}^\prime + \mathbf{v_{\perp}}$.

Since $\mathbf{v_{\parallel}}$ is parallel to the direction of scale, then $\mathbf{v_{\parallel}}^\prime = k\mathbf{v_{\parallel}}$.

Reconstructing the solution from the observations above:

$$
\begin{align*}
\mathbf{v_{\parallel}} &= (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} \\\\
\mathbf{v_{\perp}}^\prime &= \mathbf{v_{\perp}} \\\\
&= \mathbf{v} - \mathbf{v_{\parallel}} \\\\
&= \mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} \\\\
\mathbf{v_{\parallel}}^\prime &= k\mathbf{v_{\parallel}} \\\\
&= k(\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}  \\\\
\mathbf{v}^\prime &= \mathbf{v_{\perp}}^\prime + \mathbf{v_{\parallel}}^\prime \\\\
&= \mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} + k(\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} \\\\
&= \mathbf{v} + (k - 1) (\mathbf{v} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}}
\end{align*}
$$

We can construct a general scale matrix by computing the vectors resulting after transforming the basis vectors $\mathbf{p}$, $\mathbf{q}$, and $\mathbf{r}$. For example, let's transform $\mathbf{p} = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix}^T$:

$$
\begin{align*}
\mathbf{p}^\prime &= \mathbf{p} + (k - 1) (\mathbf{p} \cdot \hat{\mathbf{n}}) \hat{\mathbf{n}} \\\\
&= \begin{bmatrix} 1 \\\\ 0 \\\\ 0 \end{bmatrix} + (k - 1) \left ( \begin{bmatrix} 1 \\\\ 0 \\\\ 0 \end{bmatrix} \begin{bmatrix} n_x \\\\ n_y \\\\ n_z \end{bmatrix}^T \right ) \begin{bmatrix} n_x \\\\ n_y \\\\ n_z \end{bmatrix} \\\\
&= \begin{bmatrix} 1 \\\\ 0 \\\\ 0 \end{bmatrix} + (k - 1) n_x \begin{bmatrix} n_x \\\\ n_y \\\\ n_z \end{bmatrix} \\\\
&= \begin{bmatrix}
1 + (k - 1) {n_x}^2 \\\\
(k - 1)n_xn_y \\\\
(k - 1)n_xn_z
\end{bmatrix}
\end{align*}
$$

Similarly, the values of $\mathbf{q}^\prime$ and $\mathbf{r}^\prime$ can be found, which make the general rotation matrix equal to:

$$
\begin{align*}
\mathbf{S}(\hat{\mathbf{n}}, k) &= \begin{bmatrix} \mathbf{p}^\prime & \mathbf{q}^\prime & \mathbf{r}^\prime \end{bmatrix} \\\\
& = \begin{bmatrix}
1 + (k - 1) {n_x}^2 & (k - 1)n_yn_x & (k - 1)n_zn_x \\\\
(k - 1)n_xn_y & 1 + (k - 1) {n_y}^2 & (k - 1)n_zn_y \\\\
(k - 1)n_xn_z & (k - 1)n_yn_z & 1 + (k - 1) {n_z}^2
\end{bmatrix}
\end{align*}
$$
