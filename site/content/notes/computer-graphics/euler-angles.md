---
title: "Euler Angles"
date: 2016-02-05 13:00:00
summary: |
  Euler angles describe the orientation of a rigid body with three numbers: yaw, pitch, and roll. This article covers how a sequence of three rotations encodes orientation, the intrinsic vs extrinsic distinction, coordinate frame conversions, and why gimbal lock pushes real systems toward quaternions.
image: https://upload.wikimedia.org/wikipedia/commons/8/85/Euler2a.gif?1461803605967
tags: ["geometry", "rotation", "computer graphics", "euler angles", "quaternions"]
libraries: ["katex"]
math_terms: ["graphics"]
references:
  - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
  - "Images taken from https://www.wikiwand.com/en/Euler_angles#/Rotation_matrix, Author: Lionel Brits"
aliases:
  - /notes/computer-graphics/transformation-matrices/rotation/euler-angles/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
---

Euler angles describe the orientation of a rigid body with three numbers: yaw, pitch, and roll. Each number is an angle, and the three angles applied in sequence rotate the body from a reference orientation to its current one.

This encoding is compact and intuitive, which is why cameras and vehicles use it. It comes with a complication: the answer depends on which axes the rotations happen around and in what order. Those two choices split the representation into intrinsic and extrinsic rotations, and at one specific orientation the sequence collapses entirely, a failure called gimbal lock.

## A Sequence of Three Rotations

A sequence of three elemental rotations is written with three angles, typically $\alpha, \beta, \gamma$, and the axes they rotate about. The order matters: rotating $90^\circ$ about $x$ then $90^\circ$ about $y$ is not the same as the reverse. The two orderings below, intrinsic and extrinsic, define where the axes live during the sequence.

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
\mathbf{R} = \mathbf{R}\_x(\alpha)\mathbf{R}\_y(\beta)\mathbf{R}\_z(\gamma)
$$

Where $\mathbf{R}\_x(\alpha)$, $\mathbf{R}\_y(\beta)$, and $\mathbf{R}\_z(\gamma)$ represent rotations around the canonical $x$, $y$, and $z$ axes.

### Extrinsic Rotations

A set of **extrinsic rotations** represents rotations relative to a fixed coordinate system (typically world space). For example, the extrinsic sequence $z-x-z$ operates as follows:

- Rotate by $\alpha$ around the fixed $z$-axis.
- Rotate by $\beta$ around the fixed $x$-axis.
- Rotate by $\gamma$ around the fixed $z$-axis.

The extrinsic sequence $x-y-z$ with angles $\alpha, \beta, \gamma$ corresponds to:

$$
\mathbf{R} = \mathbf{R}\_z(\gamma)\mathbf{R}\_y(\beta)\mathbf{R}\_x(\alpha)
$$

### Conversion Between Intrinsic and Extrinsic Rotations

Any intrinsic rotation sequence is equivalent to an extrinsic rotation sequence by the exact same angles with inverted order.

The intrinsic rotation sequence $x-y^\prime-z^{\prime\prime}$ by angles $\alpha,\beta,\gamma$ produces the identical transformation as the extrinsic sequence $z-y-x$ by angles $\gamma,\beta,\alpha$:

$$
\mathbf{R} = \mathbf{R}\_x(\alpha)\mathbf{R}\_y(\beta)\mathbf{R}\_z(\gamma)
$$

## Proper Euler Angles and Tait-Bryan Angles

The naming of a sequence depends on which axes it uses. When the first and third rotation axes are identical, the sequence is called **proper Euler angles**:

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Eulerangles.svg/330px-Eulerangles.svg.png" alt="">
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

When the three rotations occur about three distinct axes, the sequence is called **Tait-Bryan angles**:

| Intrinsic Rotations | Extrinsic Rotations |
| :--- | :--- |
| $x-y^\prime-z^{\prime\prime}$ | $z-y-x$ |
| $x-z^\prime-y^{\prime\prime}$ | $y-z-x$ |
| $y-x^\prime-z^{\prime\prime}$ | $z-x-y$ |
| $y-z^\prime-x^{\prime\prime}$ | $x-z-y$ |
| $z-x^\prime-y^{\prime\prime}$ | $y-x-z$ |
| $z-y^\prime-x^{\prime\prime}$ | $x-y-z$ |

The Tait-Bryan sequence $z-y^\prime-x^{\prime\prime}$ is widely known as **yaw, pitch, and roll** (or nautical angles), describing the attitude of aircraft and vehicles:

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Taitbrianzyx.svg/330px-Taitbrianzyx.svg.png" alt="">
  </div>
  <figcaption>Yaw, pitch, and roll as the Tait-Bryan sequence $z-y^\prime-x^{\prime\prime}$</figcaption>
</figure>

The combined rotation matrix for the intrinsic sequence $z-y^\prime-x^{\prime\prime}$ (or extrinsic $x-y-z$) is:

$$
\mathbf{R} = \mathbf{R}\_z(\alpha)\mathbf{R}\_y(\beta)\mathbf{R}\_x(\gamma)
$$

## Extrinsic Rotations in Upright Space

The rotation matrices built so far assume canonical axes. When an object space is oriented differently relative to world space, the same yaw, pitch, and roll sequence must be expressed against the object's own basis. The first-person camera is exactly this case: it builds its upright space from the camera's orientation.

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
          \mathbf{R}\_y(\alpha) \\\\
          \mathbf{R}\_x(\beta) \\\\
          \mathbf{R}\_z(\gamma)
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
          \mathbf{R}\_z(\alpha) \equiv \mathbf{R}\_{y,\text{wld}}(\alpha) \\\\
          \mathbf{R}\_y(\beta) \equiv \mathbf{R}\_{x,\text{wld}}(\beta) \\\\
          \mathbf{R}\_x(\gamma) \equiv \mathbf{R}\_{z,\text{wld}}(\gamma)
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
          \mathbf{R}\_y(\alpha) \equiv \mathbf{R}\_{y,\text{wld}}(-\alpha) \\\\
          \mathbf{R}\_x(\beta) \equiv \mathbf{R}\_{x,\text{wld}}(-\beta) \\\\
          \mathbf{R}\_z(\gamma) \equiv \mathbf{R}\_{z,\text{wld}}(\gamma)
        \end{aligned}
        $$
        </td>
      </tr>
    </table>
  </div>
  <figcaption>Equivalence of common extrinsic rotations in world space</figcaption>
</figure>

## Gimbal Lock

When using Euler angles, rotating pitch $\beta = \pm 90^\circ$ aligns the first and third rotation axes ($x$ and $z$). This alignment causes **gimbal lock**: one degree of rotational freedom is lost, and the remaining two axes produce the same motion. Animations interpolating through that orientation spin erratically.

The fix is to switch representations. A <span data-term="quaternion" class="math-term-trigger cursor-help">unit quaternion</span> composes the three axis rotors into a single object with no alignment singularity:

$$
q = q\_z(\gamma) q\_y(\beta) q\_x(\alpha)
$$

Where the individual axis rotors are half-angle rotors, e.g. $q\_x(\alpha) = \left[\cos\left(\tfrac{\alpha}{2}\right), \sin\left(\tfrac{\alpha}{2}\right)\mathbf{i}\right]$. The Hamilton product yields the composite quaternion $q = [s, x\mathbf{i} + y\mathbf{j} + z\mathbf{k}]$ that rotates by the combined Euler angles.

For the full derivation of rotor construction, the sandwich product $p^\prime = q p q^\ast$, and spherical linear interpolation (SLERP), see [Quaternions](/notes/computer-graphics/quaternions/).
