---
title: "Scale"
date: 2015-10-20 13:30:00
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
---

## Scaling along the cardinal axes

Intuitively the basis vectors should be multiplied by an scalar, also they are independently affected by the scale factors

In 2D the basis vectors become

<div>
$$
\mathbf{p'} = k_x \mathbf{p} = k_x \begin{bmatrix} 1 \\ 0 \end{bmatrix} = \begin{bmatrix} k_x \\ 0 \end{bmatrix} \\
\mathbf{q'} = k_y \mathbf{q} = k_y \begin{bmatrix} 0 \\ 1 \end{bmatrix} = \begin{bmatrix} 0 \\ k_y \end{bmatrix}
$$
</div>

Constructing the 2D scale matrix $\mathbf{S}(k_x, k_y)$ from these basis vectors

<div>
$$
\mathbf{S}(k_x, k_y) = \begin{bmatrix} k_x & 0 \\ 0 & k_y \end{bmatrix}
$$
</div>

Similarly the 3D scale matrix is given by

<div>
$$
\mathbf{S}(k_x, k_y, k_z) = \begin{bmatrix}
k_x & 0 & 0 \\
0 & k_y & 0 \\
0 & 0 & k_z
\end{bmatrix}
$$
</div>

## Scaling along an arbitrary axis

Let $\unit{n}$ be the unit vector parallel to the direction of scale and $k$ to be the scale factor, a vector transformed by this scale operations can be represented as

<div>
$$
\mathbf{v'} = \mathbf{S}(\unit{n}, k) \mathbf{v}
$$
</div>

{{< figure src="/images/scale!arbitrary-axis.png" title="scale arbitrary axis" >}}

Separate $\mathbf{v}$ in two vectors, a vector parallel to $\unit{v}$ called $\mathbf{v_{\parallel}}$ and a vector perpendicular to $\unit{v}$ called $\mathbf{v_{\perp}}$ such that

<div>
$$
\mathbf{v} = \mathbf{v_{\parallel}} + \mathbf{v_{\perp}}
$$
</div>

Where

<div>
$$
\begin{align*}
\mathbf{v_{\parallel}} &= (\mathbf{v} \cdot \unit{n}) \unit{n} \\
\mathbf{v_{\perp}} &= \mathbf{v} - \mathbf{v_{\parallel}}
\end{align*}
$$
</div>

We can also represent $\mathbf{v'}$ as a sum of two vectors parallel and perpendicular to $\unit{n}$

<div>
$$
\mathbf{v'} = \mathbf{v_{\parallel}'} + \mathbf{v_{\perp}'}
$$
</div>

Note that any vector that lies in the 2d line or 3d plane perpendicular to $\unit{n}$ will not be affected by the scale operation so $\mathbf{v'} = \mathbf{v_{\parallel}'} + \mathbf{v_{\perp}}$

Since $\mathbf{v_{\parallel}}$ is parallel to the direction of scale then $\mathbf{v_{\parallel}'} = k\mathbf{v_{\parallel}}$

Reconstructing the solution from the observations above

<div>
$$
\begin{align*}
\mathbf{v_{\parallel}} &= (\mathbf{v} \cdot \unit{n}) \unit{n} \\
\mathbf{v_{\perp}'} &= \mathbf{v_{\perp}} \\
&= \mathbf{v} - \mathbf{v_{\parallel}} \\
&= \mathbf{v} - (\mathbf{v} \cdot \unit{n}) \unit{n} \\
\mathbf{v_{\parallel}'} &= k\mathbf{v_{\parallel}} \\
&= k(\mathbf{v} \cdot \unit{n}) \unit{n}  \\
\mathbf{v'} &= \mathbf{v_{\perp}'} + \mathbf{v_{\parallel}'} \\
&= \mathbf{v} - (\mathbf{v} \cdot \unit{n}) \unit{n} + k(\mathbf{v} \cdot \unit{n}) \unit{n} \\
&= \mathbf{v} + (k - 1) (\mathbf{v} \cdot \unit{n}) \unit{n}
\end{align*}
$$
</div>

We can construct a general scale matrix by computing the vectors resulting after transforming the basis vectors $\mathbf{p}$, $\mathbf{q}$ and $\mathbf{r}$, for example let's transform $\mathbf{p} = \begin{bmatrix} 1 & 0 & 0 \end{bmatrix}^T$

<div>
$$
\begin{align*}
\mathbf{p'} &= \mathbf{p} + (k - 1) (\mathbf{p} \cdot \unit{n}) \unit{n} \\
&= \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} + (k - 1) \left ( \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} \begin{bmatrix} n_x \\ n_y \\ n_z \end{bmatrix}^T \right ) \begin{bmatrix} n_x \\ n_y \\ n_z \end{bmatrix} \\
&= \begin{bmatrix} 1 \\ 0 \\ 0 \end{bmatrix} + (k - 1) n_x \begin{bmatrix} n_x \\ n_y \\ n_z \end{bmatrix} \\
&= \begin{bmatrix}
1 + (k - 1) {n_x}^2 \\
(k - 1)n_xn_y \\
(k - 1)n_xn_z
\end{bmatrix}
\end{align*}
$$
</div>

Similarly the values of $\mathbf{q'}$ and $\mathbf{r'}$ can be found which make the general rotation matrix equal to

<div>
$$
\begin{align*}
\mathbf{S}(\unit{n}, k) &= \begin{bmatrix} \mathbf{p'} & \mathbf{q'} & \mathbf{r'} \end{bmatrix} \nonumber \\
& = \begin{bmatrix}
1 + (k - 1) {n_x}^2 & (k - 1)n_yn_x & (k - 1)n_zn_x \\
(k - 1)n_xn_y & 1 + (k - 1) {n_y}^2 & (k - 1)n_zn_y \\
(k - 1)n_xn_z & (k - 1)n_yn_z & 1 + (k - 1) {n_z}^2
\end{bmatrix}
\end{align*}
$$
</div>

