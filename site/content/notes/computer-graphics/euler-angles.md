---
title: "Euler Angles"
date: 2016-02-05 13:00:00
summary: |
  Euler angles describe the orientation of a rigid body with three elemental rotations: yaw, pitch, and roll. Intrinsic vs extrinsic rotations, coordinate frame conversions, gimbal lock, and quaternion rotor mapping.
image: https://upload.wikimedia.org/wikipedia/commons/8/85/Euler2a.gif?1461803605967
tags: ["geometry", "rotation", "computer graphics", "euler angles", "quaternions"]
libraries: ["katex"]
references:
  - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
  - "Images taken from https://www.wikiwand.com/en/Euler_angles#/Rotation_matrix, Author: Lionel Brits"
aliases:
  - /notes/computer-graphics/transformation-matrices/rotation/euler-angles/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

Euler angles describe the orientation of a rigid body using three angles, typically denoted $\alpha, \beta, \gamma$. These angles represent a **sequence of three elemental rotations** about the axes of a coordinate system.

## Intrinsic and Extrinsic Rotations

### Intrinsic Rotations

A set of **intrinsic rotations** represents rotations relative to the *object space*, which changes orientation after each rotation.

If the axes of the coordinate system are $X,Y,Z$ (initially aligned with a fixed system $x,y,z$), the classic $z-x^\prime-z^{\prime\prime}$ sequence operates as follows:

- Rotate by $\alpha$ around the $z$-axis. The resulting axes are $x^\prime, y^\prime, z^\prime$ (where $z^\prime = z$).
- Rotate by $\beta$ around the new $x^\prime$-axis. The resulting axes are $x^{\prime\prime}, y^{\prime\prime}, z^{\prime\prime}$ (where $x^{\prime\prime} = x^\prime$).
- Rotate by $\gamma$ around the new $z^{\prime\prime}$-axis. The resulting axes are $x^{\prime\prime\prime}, y^{\prime\prime\prime}, z^{\prime\prime\prime}$ (where $z^{\prime\prime\prime} = z^{\prime\prime}$).

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="https://upload.wikimedia.org/wikipedia/commons/8/85/Euler2a.gif?1461803605967" height="240" alt="">
  </div>
  <figcaption>Intrinsic rotation $z-x^\prime-z^{\prime\prime}$. The $+z$-axis points upward, $+x$ points left, and $+y$ points right (all shown in blue). The rotated system $X,Y,Z$ is shown in red.</figcaption>
</figure>

A sequence of intrinsic rotations is evaluated by pre-multiplying matrices in right-to-left order. For example, the intrinsic sequence $x-y^\prime-z^{\prime\prime}$ with angles $\alpha, \beta, \gamma$ corresponds to:

$$
\mathbf{R} = \mathbf{X}(\alpha)\mathbf{Y}(\beta)\mathbf{Z}(\gamma)
$$

Where $\mathbf{X}(\alpha)$, $\mathbf{Y}(\beta)$, and $\mathbf{Z}(\gamma)$ represent rotations around the canonical $x$, $y$, and $z$ axes.

### Extrinsic Rotations

A set of **extrinsic rotations** represents rotations relative to a fixed coordinate system (typically world space). For example, the extrinsic sequence $z-x-z$ operates as follows:

- Rotate by $\alpha$ around the fixed $z$-axis.
- Rotate by $\beta$ around the fixed $x$-axis.
- Rotate by $\gamma$ around the fixed $z$-axis.

The extrinsic sequence $x-y-z$ with angles $\alpha, \beta, \gamma$ corresponds to:

$$
\mathbf{R} = \mathbf{Z}(\gamma)\mathbf{Y}(\beta)\mathbf{X}(\alpha)
$$

### Conversion Between Intrinsic and Extrinsic Rotations

Any intrinsic rotation sequence is equivalent to an extrinsic rotation sequence by the exact same angles with inverted order.

The intrinsic rotation sequence $x-y^\prime-z^{\prime\prime}$ by angles $\alpha,\beta,\gamma$ produces the identical transformation as the extrinsic sequence $z-y-x$ by angles $\gamma,\beta,\alpha$:

$$
\mathbf{R} = \mathbf{X}(\alpha)\mathbf{Y}(\beta)\mathbf{Z}(\gamma)
$$

## Proper Euler Angles

A sequence of three elemental rotations is called **proper Euler angles** when the first and third rotation axes are identical.

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Eulerangles.svg/213px-Eulerangles.svg.png" alt="">
  </div>
  <figcaption>Proper Euler angles representing rotations about $z-x^\prime-z^{\prime\prime}$ by angles $\alpha, \beta, \gamma$. The rotated system $X,Y,Z$ is shown in red.</figcaption>
</figure>

There are six valid combinations for proper Euler angles:

| Intrinsic Rotations | Extrinsic Rotations |
| :--- | :--- |
| $x-y^\prime-x^{\prime\prime}$ | $x-y-x$ |
| $x-z^\prime-x^{\prime\prime}$ | $x-z-x$ |
| $y-x^\prime-y^{\prime\prime}$ | $y-x-y$ |
| $y-z^\prime-y^{\prime\prime}$ | $y-z-y$ |
| $z-x^\prime-z^{\prime\prime}$ | $z-x-z$ |
| $z-y^\prime-z^{\prime\prime}$ | $z-y-z$ |

## Tait-Bryan Angles

A sequence of three elemental rotations is called **Tait-Bryan angles** when rotations occur about three distinct axes.

| Intrinsic Rotations | Extrinsic Rotations |
| :--- | :--- |
| $x-y^\prime-z^{\prime\prime}$ | $z-y-x$ |
| $x-z^\prime-y^{\prime\prime}$ | $y-z-x$ |
| $y-x^\prime-z^{\prime\prime}$ | $z-x-y$ |
| $y-z^\prime-x^{\prime\prime}$ | $x-z-y$ |
| $z-x^\prime-y^{\prime\prime}$ | $y-x-z$ |
| $z-y^\prime-x^{\prime\prime}$ | $x-y-z$ |

The intrinsic sequence $z-y^\prime-x^{\prime\prime}$ is widely known as **yaw, pitch, and roll** (or nautical angles), describing the attitude of aircraft and vehicles:

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Taitbrianzyx.svg/245px-Taitbrianzyx.svg.png" alt="">
  </div>
  <figcaption>Tait–Bryan angles representing the sequence $z-y^\prime-x^{\prime\prime}$</figcaption>
</figure>

The combined rotation matrix for the intrinsic sequence $z-y^\prime-x^{\prime\prime}$ (or extrinsic $x-y-z$) is:

$$
\mathbf{R} = \mathbf{Z}(\alpha)\mathbf{Y}(\beta)\mathbf{X}(\gamma)
$$

## Extrinsic Rotations Expressed in Upright Space

Rotation matrices assume standard canonical axes. When object space axes are oriented differently relative to world space, extrinsic rotations must be projected onto the upright basis.

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="/images/xyz.jpg" alt="">
  </div>
  <figcaption>Chosen world space: $+x$ (right), $+y$ (up), and $+z$ (backward).</figcaption>
</figure>

If an object space has axes $+x$ (backward), $+y$ (right), and $+z$ (up), the intrinsic sequence $z-y^\prime-x^{\prime\prime}$ by angles $\alpha, \beta, \gamma$ expands to:

$$
\mathbf{R} = \mathbf{R}(\mathbf{w}, \alpha)\mathbf{R}(\mathbf{v}, \beta)\mathbf{R}(\mathbf{u}, \gamma)
$$

Where $\mathbf{u}, \mathbf{v}, \mathbf{w}$ form the orthonormal basis columns of $\mathbf{M}\_{\text{upright} \leftarrow \text{object}}$:

$$
\mathbf{M}\_{\text{upright} \leftarrow \text{object}} = \begin{bmatrix} \mathbf{u} & \mathbf{v} & \mathbf{w} \end{bmatrix}
$$

<figure id="conversions">
  <div class="figure-table" style="overflow: auto">
    <table>
      <tr>
        <th>To/from</th>
        <th>Description</th>
        <th>Intrinsic/Extrinsic <br/> rotations</th>
        <th>Equivalence in world space</th>
      </tr>
      <tr>
        <td><img class="lazy-load" data-src="/images/xyz.jpg" alt=""></td>
        <td>yaw, pitch, roll</td>
        <td>
        $$
        \begin{aligned}
          y-x^\prime-z^{\prime\prime} \\\\
          z-x-y
        \end{aligned}
        $$
        </td>
        <td>
        $$
        \begin{aligned}
          \mathbf{Y}(\alpha) \\\\
          \mathbf{X}(\beta) \\\\
          \mathbf{Z}(\gamma)
        \end{aligned}
        $$
        </td>
      </tr>
      <tr>
        <td><img class="lazy-load" data-src="/images/xyz-z-up.jpg" alt=""></td>
        <td>yaw, pitch, roll</td>
        <td>
        $$
        \begin{aligned}
          z-y^\prime-x^{\prime\prime} \\\\
          x-y-z
        \end{aligned}
        $$
        </td>
        <td>
        $$
        \begin{aligned}
          \mathbf{Z}(\alpha) \equiv \mathbf{Y}\_{\text{wld}}(\alpha) \\\\
          \mathbf{Y}(\beta) \equiv \mathbf{X}\_{\text{wld}}(\beta) \\\\
          \mathbf{X}(\gamma) \equiv \mathbf{Z}\_{\text{wld}}(\gamma)
        \end{aligned}
        $$
        </td>
      </tr>
      <tr>
        <td><img class="lazy-load" data-src="/images/xyz-y-down.jpg" alt=""></td>
        <td>yaw, pitch, roll</td>
        <td>
        $$
        \begin{aligned}
          y-x^\prime-z^{\prime\prime} \\\\
          z-x-y
        \end{aligned}
        $$
        </td>
        <td>
        $$
        \begin{aligned}
          \mathbf{Y}(\alpha) \equiv \mathbf{Y}\_{\text{wld}}(-\alpha) \\\\
          \mathbf{X}(\beta) \equiv \mathbf{X}\_{\text{wld}}(-\beta) \\\\
          \mathbf{Z}(\gamma) \equiv \mathbf{Z}\_{\text{wld}}(\gamma)
        \end{aligned}
        $$
        </td>
      </tr>
    </table>
  </div>
  <figcaption>Equivalence of common extrinsic rotations in world space</figcaption>
</figure>

## Gimbal Lock & Conversion to Quaternions

When using Euler angles, rotating pitch $\beta = \pm 90^\circ$ aligns the first and third rotation axes ($x$ and $z$). This alignment causes **gimbal lock**, losing one degree of rotational freedom and causing erratic spinning during animation.

To eliminate gimbal lock and permit uniform spherical interpolation, Euler angles are converted into a 4D **unit quaternion rotor**:

$$
q = q\_z(\gamma) q\_y(\beta) q\_x(\alpha)
$$

Where the individual axis rotors are:

$$
q\_x(\alpha) = \left[\cos\left(\tfrac{\alpha}{2}\right), \sin\left(\tfrac{\alpha}{2}\right)\mathbf{i}\right], \quad
q\_y(\beta) = \left[\cos\left(\tfrac{\beta}{2}\right), \sin\left(\tfrac{\beta}{2}\right)\mathbf{j}\right], \quad
q\_z(\gamma) = \left[\cos\left(\tfrac{\gamma}{2}\right), \sin\left(\tfrac{\gamma}{2}\right)\mathbf{k}\right]
$$

Evaluating the Hamilton product yields the composite quaternion $q = [s, x\mathbf{i} + y\mathbf{j} + z\mathbf{k}]$:

$$
\begin{aligned}
s &= \cos\left(\tfrac{\alpha}{2}\right)\cos\left(\tfrac{\beta}{2}\right)\cos\left(\tfrac{\gamma}{2}\right) + \sin\left(\tfrac{\alpha}{2}\right)\sin\left(\tfrac{\beta}{2}\right)\sin\left(\tfrac{\gamma}{2}\right) \\\\
x &= \sin\left(\tfrac{\alpha}{2}\right)\cos\left(\tfrac{\beta}{2}\right)\cos\left(\tfrac{\gamma}{2}\right) - \cos\left(\tfrac{\alpha}{2}\right)\sin\left(\tfrac{\beta}{2}\right)\sin\left(\tfrac{\gamma}{2}\right) \\\\
y &= \cos\left(\tfrac{\alpha}{2}\right)\sin\left(\tfrac{\beta}{2}\right)\cos\left(\tfrac{\gamma}{2}\right) + \sin\left(\tfrac{\alpha}{2}\right)\cos\left(\tfrac{\beta}{2}\right)\sin\left(\tfrac{\gamma}{2}\right) \\\\
z &= \cos\left(\tfrac{\alpha}{2}\right)\cos\left(\tfrac{\beta}{2}\right)\sin\left(\tfrac{\gamma}{2}\right) - \sin\left(\tfrac{\alpha}{2}\right)\sin\left(\tfrac{\beta}{2}\right)\cos\left(\tfrac{\gamma}{2}\right)
\end{aligned}
$$

For full algebraic proofs of rotor construction, sandwich product transformation $p^\prime = q p q^\*$, and spherical linear interpolation (SLERP), see [Quaternions](/notes/computer-graphics/quaternions/).
