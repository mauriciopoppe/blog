---
title: "Rotation"
date: 2015-12-15 13:00:00
summary: |
  Rotation transforms in 2D and 3D space, cardinal axis rotation matrices, arbitrary axis rotation with Rodrigues' formula, and quaternion rotor foundations.
image: /images/flat-shading.svg
libraries: ["katex"]
math_terms: ["graphics"]
tags: ["rotation", "quaternions", "2d", "3d", "computer graphics"]
references:
  - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
  - "Vince, J. (2011). Quaternions for computer graphics. London: Springer."
aliases:
  - /notes/computer-graphics/transformation-matrices/rotation/introduction/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
interactive: true
---

<span data-term="R" class="math-term-trigger cursor-help">Rotation</span> transforms orient geometry in 2D and 3D space about an origin or axis without altering size or shape.

## 2D Rotation

A 2D rotation depends on a single parameter, the angle $\theta$. Rotating the standard Cartesian basis vectors $\mathbf{i} = [1, 0]^T$ and $\mathbf{j} = [0, 1]^T$ counterclockwise by $\theta$ yields transformed basis vectors $\mathbf{p}$ and $\mathbf{q}$:

$$
\begin{aligned}
\mathbf{p} &= \cos\theta \mathbf{i} + \sin\theta \mathbf{j} = \begin{bmatrix} \cos\theta \\\\ \sin\theta \end{bmatrix} \\\\
\mathbf{q} &= -\sin\theta \mathbf{i} + \cos\theta \mathbf{j} = \begin{bmatrix} -\sin\theta \\\\ \cos\theta \end{bmatrix}
\end{aligned}
$$

<div id="two-dimensions"></div>

Placing $\mathbf{p}$ and $\mathbf{q}$ into matrix columns forms the 2D rotation matrix:

$$
\mathbf{R}(\theta) = \begin{bmatrix}
\mathbf{p} & \mathbf{q}
\end{bmatrix} = \begin{bmatrix}
\cos\theta & -\sin\theta \\\\
\sin\theta & \cos\theta
\end{bmatrix}
$$

Applying $\mathbf{R}(\theta)$ to an arbitrary vector $\mathbf{v} = [v\_x, v\_y]^T$ expresses the transformed vector $\mathbf{v}^\prime$ as a linear combination of the rotated basis:

$$
\mathbf{v}^\prime = \mathbf{R}(\theta)\mathbf{v} = \begin{bmatrix}
\cos\theta & -\sin\theta \\\\
\sin\theta & \cos\theta
\end{bmatrix} \begin{bmatrix}
v\_x \\\\
v\_y
\end{bmatrix} = \begin{bmatrix}
v\_x \cos\theta - v\_y \sin\theta \\\\
v\_x \sin\theta + v\_y \cos\theta
\end{bmatrix}
$$

See also [complex numbers](/notes/mathematics/numeral-systems/complex-numbers).

## 3D Rotation

### Cardinal Axes

Rotating around the primary coordinate axes in a right-handed system produces elementary $3 \times 3$ rotation matrices:

$$
\mathbf{R}\_x(\alpha) = \begin{bmatrix}
1 & 0 & 0 \\\\
0 & \cos\alpha & -\sin\alpha \\\\
0 & \sin\alpha & \cos\alpha
\end{bmatrix}
$$

$$
\mathbf{R}\_y(\beta) = \begin{bmatrix}
\cos\beta & 0 & \sin\beta \\\\
0 & 1 & 0 \\\\
-\sin\beta & 0 & \cos\beta
\end{bmatrix}
$$

$$
\mathbf{R}\_z(\gamma) = \begin{bmatrix}
\cos\gamma & -\sin\gamma & 0 \\\\
\sin\gamma & \cos\gamma & 0 \\\\
0 & 0 & 1
\end{bmatrix}
$$

### Arbitrary Axis (Rodrigues' Rotation Formula)

Given an arbitrary unit axis $\hat{\mathbf{n}}$ ($\lVert \hat{\mathbf{n}} \rVert = 1$) and a rotation angle $\theta$, we seek a transformation $\mathbf{v}^\prime = \mathbf{R}(\hat{\mathbf{n}}, \theta)\mathbf{v}$.

Decompose the target vector $\mathbf{v}$ into parallel and perpendicular components relative to $\hat{\mathbf{n}}$:

$$
\begin{aligned}
\mathbf{v}\_{\parallel} &= (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}} \\\\
\mathbf{v}\_{\perp} &= \mathbf{v} - \mathbf{v}\_{\parallel} = \mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}
\end{aligned}
$$

Under rotation about $\hat{\mathbf{n}}$, the parallel component remains unchanged ($\mathbf{v}^\prime\_{\parallel} = \mathbf{v}\_{\parallel}$). The perpendicular component $\mathbf{v}\_{\perp}$ rotates entirely within the plane orthogonal to $\hat{\mathbf{n}}$.

Construct an in-plane perpendicular basis vector $\mathbf{w}$ using the cross product:

$$
\mathbf{w} = \hat{\mathbf{n}} \times \mathbf{v}\_{\perp} = \hat{\mathbf{n}} \times (\mathbf{v} - \mathbf{v}\_{\parallel}) = \hat{\mathbf{n}} \times \mathbf{v}
$$

Because $\hat{\mathbf{n}} \perp \mathbf{v}\_{\perp}$ and $\lVert \hat{\mathbf{n}} \rVert = 1$, the length $\lVert \mathbf{w} \rVert = \lVert \hat{\mathbf{n}} \rVert \lVert \mathbf{v}\_{\perp} \rVert \sin(90^\circ) = \lVert \mathbf{v}\_{\perp} \rVert$.

The orthogonal vectors $\mathbf{v}\_{\perp}$ and $\mathbf{w}$ span the 2D rotation plane. Rotating $\mathbf{v}\_{\perp}$ by $\theta$ gives:

$$
\mathbf{v}^\prime\_{\perp} = \cos\theta \mathbf{v}\_{\perp} + \sin\theta \mathbf{w} = \cos\theta (\mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}) + \sin\theta (\hat{\mathbf{n}} \times \mathbf{v})
$$

Recombining parallel and perpendicular components gives **Rodrigues' rotation formula**:

$$
\begin{aligned}
\mathbf{v}^\prime &= \mathbf{v}^\prime\_{\parallel} + \mathbf{v}^\prime\_{\perp} \\\\
&= (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}} + \cos\theta (\mathbf{v} - (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}) + \sin\theta (\hat{\mathbf{n}} \times \mathbf{v}) \\\\
&= \cos\theta \mathbf{v} + \sin\theta (\hat{\mathbf{n}} \times \mathbf{v}) + (1 - \cos\theta)(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}
\end{aligned}
$$

Evaluating Rodrigues' formula on each standard basis vector $\mathbf{e}\_1 = [1, 0, 0]^T$, $\mathbf{e}\_2 = [0, 1, 0]^T$, and $\mathbf{e}\_3 = [0, 0, 1]^T$ produces the column vectors of the full $3 \times 3$ matrix:

$$
\mathbf{R}(\hat{\mathbf{n}}, \theta) = \begin{bmatrix}
n\_x^2(1 - \cos\theta) + \cos\theta & n\_y n\_x(1 - \cos\theta) - n\_z \sin\theta & n\_z n\_x(1 - \cos\theta) + n\_y \sin\theta \\\\
n\_x n\_y(1 - \cos\theta) + n\_z \sin\theta & n\_y^2(1 - \cos\theta) + \cos\theta & n\_z n\_y(1 - \cos\theta) - n\_x \sin\theta \\\\
n\_x n\_z(1 - \cos\theta) - n\_y \sin\theta & n\_y n\_z(1 - \cos\theta) + n\_x \sin\theta & n\_z^2(1 - \cos\theta) + \cos\theta
\end{bmatrix}
$$

### Connection to Quaternions

Composing multiple 3D rotations using Euler angles or full $3 \times 3$ matrices often introduces gimbal lock and matrix orthogonalization drift.

Quaternions represent rotations compactly using a 4D unit rotor $q = [\cos\frac{\theta}{2}, \sin\frac{\theta}{2}\hat{\mathbf{n}}]$. The quaternion sandwich product $p^\prime = q p q^\ast$ algebraically produces the exact same vector transformation as Rodrigues' formula without trigonometric evaluations per vertex:

$$
\mathbf{v}^\prime = \cos\theta \mathbf{v} + \sin\theta (\hat{\mathbf{n}} \times \mathbf{v}) + (1 - \cos\theta)(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}
$$

For full algebraic proofs of rotor construction, sandwich product invariance, rotation composition, and spherical linear interpolation, see [Quaternions](/notes/computer-graphics/quaternions/).

<script type="module" src="/js/computer-graphics/rotation.js"></script>
