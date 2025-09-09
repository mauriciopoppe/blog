---
title: "Euler Angles"
date: 2016-02-05 13:00:00
summary: |
  Euler angles are a way to describe the orientation of a rigid body with three values. These values represent three angles:
  - *Yaw* - Rotation around the vertical axis
  - *Pitch* - Rotation around the side-to-side axis
  - *Roll* - Rotation around the front-to-back axis
image: https://upload.wikimedia.org/wikipedia/commons/8/85/Euler2a.gif?1461803605967
tags: ["geometry", "rotation", "computer graphics", "euler angles"]
libraries: ["math"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
 - "Images taken from https://www.wikiwand.com/en/Euler_angles#/Rotation_matrix, Author: Lionel Brits"
---

<!-- <style> -->
<!-- #conversions table img {
  max-width: 100px;
} -->
<!-- </style> -->
<!---->
Euler angles are three angles used to describe the orientation of a rigid body. They are typically denoted $\alpha, \beta, \gamma$. These angles represent a **sequence of three elemental rotations** about the axes of some coordinate system.

## Intrinsic and Extrinsic Rotations

### Intrinsic Rotations

A set of **intrinsic rotations** represents rotations relative to the *object space*, which changes after each rotation.

 If the axes of some coordinate system are $X,Y,Z$ (note that initially, the axes are aligned with the axes of a fixed coordinate system $x,y,z$), one of the most conventional sets of *intrinsic rotations* is $z-x'-z''$. It's computed as follows:

- Perform a rotation of $\alpha$ around the $z$-axis. The resulting set of axes is $x', y', z'$ (note that $z' = z$).
- Perform a rotation of $\beta$ around the $x'$-axis. The resulting set of axes is $x'', y'', z''$ (note that $x'' = x'$).
- Perform a rotation of $\gamma$ around the $z''$-axis. The resulting set of axes is $x''', y''', z'''$ (note that $z''' = z''$ and that the object space $z$-axis is used twice in the overall rotation).

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="https://upload.wikimedia.org/wikipedia/commons/8/85/Euler2a.gif?1461803605967" height="240" alt="">
  </div>
  <figcaption>
    <span></span>
    Intrinsic rotation \(z-x'-z''\). Note that the \(+z\)-axis points upward, the \(+x\)-axis points left, and the \(+y\)-axis points right (all shown in blue). The rotated system \(X,Y,Z\) is shown in red.</figcaption>
</figure>

A rotation matrix (used to pre-multiply column vectors) can be used to represent a sequence of *intrinsic rotations*. For example, the extrinsic rotations $x-y'-z''$ with angles $\alpha, \beta, \gamma$ are represented as a multiplication of the following rotation matrices:

<div>$$
\mathbf{R} = \mathbf{X}(\alpha)\mathbf{Y}(\beta)\mathbf{Z}(\gamma)
$$</div>

Where $\mathbf{X}(\alpha)$, $\mathbf{Y}(\beta)$, and $\mathbf{Z}(\gamma)$ are rotation matrices that represent a rotation around the $x$-axis by $\alpha$, around the $y$-axis by $\beta$, and around the $z$-axis by $\gamma$, respectively.

### Extrinsic Rotations

A set of **extrinsic rotations** represents rotations relative to a fixed coordinate system (typically the world coordinate system). For example, the set of *extrinsic rotations* $z-x-z$ works as follows:

- Perform a rotation of $\alpha$ around the $z$-axis. The resulting set of axes is $x', y', z'$ (note that $z' = z$).
- Perform a rotation of $\beta$ around the $x$-axis. The resulting set of axes is $x'', y'', z''$.
- Perform a rotation of $\gamma$ around the $z$-axis. The resulting set of axes is $x''', y''', z'''$.

A rotation matrix (used to pre-multiply column vectors) can be used to represent a sequence of *intrinsic rotations*. For example, the extrinsic rotations $x-y-z$ with angles $\alpha, \beta, \gamma$ are represented as a multiplication of the following rotation matrices:

<div>$$
\mathbf{R} = \mathbf{Z}(\gamma)\mathbf{Y}(\beta)\mathbf{X}(\alpha)
$$</div>

Where $\mathbf{X}(\alpha)$, $\mathbf{Y}(\beta)$, and $\mathbf{Z}(\gamma)$ are rotation matrices that represent a rotation around the $x$-axis by $\alpha$, around the $y$-axis by $\beta$, and around the $z$-axis by $\gamma$, respectively.

### Conversion Between Intrinsic and Extrinsic Rotations

Any intrinsic rotation is equivalent to an extrinsic rotation by the same angles but with an inverted order of rotations.

For example, the intrinsic rotations $x-y'-z''$ by the angles $\alpha,\beta,\gamma$ are equivalent to the extrinsic rotations $z-y-x$ by the angles $\gamma,\beta,\alpha$, both represented by:

<div>$$
\mathbf{R} = \mathbf{X}(\alpha)\mathbf{Y}(\beta)\mathbf{Z}(\gamma)
$$</div>

## Proper Euler Angles

A sequence of three elemental rotations is called **proper Euler angles** when the first and third rotation axes are the same.

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Eulerangles.svg/213px-Eulerangles.svg.png" alt="">
  </div>
  <figcaption>
    <p>
      Proper Euler angles representing rotations about \(z-x'-z''\) by the angles $\alpha, \beta, \gamma$. The rotated system \(X,Y,Z\) is shown in red.
    </p>
  </figcaption>
</figure>

There are six possibilities for choosing the rotation axes for proper Euler angles, which are *intrinsic rotations*. In a similar way, there are six other possibilities for choosing the rotation axes, which are *extrinsic rotations*.

| Intrinsic Rotations | Extrinsic Rotations |
| :--- | :--- |
| $x-y'-x''$ | $x-y-x$ |
| $x-z'-x''$ | $x-z-x$ |
| $y-x'-y''$ | $y-x-y$ |
| $y-z'-y''$ | $y-z-y$ |
| $z-x'-z''$ | $z-x-z$ |
| $z-y'-z''$ | $z-y-z$ |

## Tait-Bryan Angles

A sequence of three elemental rotations is called **Tait-Bryan angles** when the angles represent rotations about three distinct axes.

Just like proper Euler angles, there are six possible *intrinsic rotations* and six possible *extrinsic rotations*.

| Intrinsic Rotations | Extrinsic Rotations |
| :--- | :--- |
| $x-y'-z''$ | $z-y-x$ |
| $x-z'-y''$ | $y-z-x$ |
| $y-x'-z''$ | $z-x-y$ |
| $y-z'-x''$ | $x-z-y$ |
| $z-x'-y''$ | $y-x-z$ |
| $z-y'-x''$ | $x-y-z$ |

The set of *intrinsic rotations* $z-y'-x''$ is known as *yaw*, *pitch*, and *roll*. These angles are also known as *nautical angles* because they can describe the orientation of a ship or aircraft.

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Taitbrianzyx.svg/245px-Taitbrianzyx.svg.png" alt="">
  </div>
  <figcaption>Tait–Bryan angles representing the sequence \(z-y'-x''\)</figcaption>
</figure>

The rotation matrix for the sequence $z-y'-x''$ (or $x-y-z$), which is known as *yaw*, *pitch*, and *roll*, is given by:

<div>$$
\begin{align*}
\mathbf{R} = \mathbf{Z}(\alpha)\mathbf{Y}(\beta)\mathbf{X}(\gamma)
\end{align*}
$$</div>

## Extrinsic Rotations Expressed in Upright Space

An important thing to note is that the standard rotation matrices work in *upright space*. If the *object space* axes are not aligned with the *upright space* axes (different direction), then the sequence of extrinsic rotations must be done on the axes expressed in *upright space*.

For example, given that world space is:

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="/images/xyz.jpg" alt="">
  </div>
  <figcaption>Chosen world space: \(+x\) (right), \(+y\) (up), and \(+z\) (backward). Note that the choice is just personal preference.</figcaption>
</figure>

If there's an object whose *object space* axes are $+x$ (backward), $+y$ (right), and $+z$ (up), then a sequence of intrinsic rotations $z-y'-x''$ by the angles $\alpha, \beta, \gamma$ (equivalent to the extrinsic rotation $x-y-z$ by the angles $\gamma, \beta, \alpha$, which is also known as *yaw*, *pitch*, and *roll*) is equivalent to the multiplication of the following rotation matrices:

<div>$$
\mathbf{R} = \mathbf{R}(\mathbf{w}, \alpha)\mathbf{R}(\mathbf{v}, \beta)\mathbf{R}(\mathbf{u}, \gamma)
$$</div>

Where:

- $\mathbf{R}(\mathbf{s}, t)$ is the general rotation matrix used to rotate around the axis $\mathbf{s}$ by the angle $t$.
- $\mathbf{u, v, w}$ are the columns of the transformation matrix used to transform any point $\mathbf{p}$ expressed in *object space* to *upright space*.

<div>$$
\begin{align*}
\mathbf{p}_{upright} &= \mathbf{M}_{upright \leftarrow object} \mathbf{p}_{object} \\
&= \begin{bmatrix} \mathbf{u}_{3 \times 1} \mathbf{v}_{3 \times 1} \mathbf{w}_{3 \times 1}\end{bmatrix} \mathbf{p}_{object}
\end{align*}
$$</div>

The problem can be simplified when the frame is somewhat aligned with the *upright space* (the order might be different, and the axis directions might be reversed, but it's still aligned). The following diagram shows some of these simplifications:

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
        \begin{align*}
          y-x'-z'' \\
          z-x-y
        \end{align*}
        $$
        </td>
        <td>
        $$
        \begin{align*}
          \mathbf{Y}(\alpha) \\
          \mathbf{X}(\beta) \\
          \mathbf{Z}(\gamma)
        \end{align*}
        $$
        </td>
      </tr>
      <tr>
        <td><img class="lazy-load" data-src="/images/xyz-z-up.jpg" alt=""></td>
        <td>yaw, pitch, roll</td>
        <td>
        $$
        \begin{align*}
          z-y'-x'' \\
          x-y-z
        \end{align*}
        $$
        </td>
        <td>
        $$
        \begin{align*}
          \mathbf{Z}(\alpha) \equiv \mathbf{Y_{wld}}(\alpha) \\
          \mathbf{Y}(\beta) \equiv \mathbf{X_{wld}}(\beta) \\
          \mathbf{X}(\gamma) \equiv \mathbf{Z_{wld}}(\gamma)
        \end{align*}
        $$
        </td>
      </tr>
      <tr>
        <td><img class="lazy-load" data-src="/images/xyz-y-down.jpg" alt=""></td>
        <td>yaw, pitch, roll</td>
        <td>
        $$
        \begin{align*}
          y-x'-z'' \\
          z-x-y
        \end{align*}
        $$
        </td>
        <td>
        $$
        \begin{align*}
          \mathbf{Y}(\alpha) \equiv \mathbf{Y_{wld}}(-\alpha) \\
          \mathbf{X}(\beta) \equiv \mathbf{X_{wld}}(-\beta) \\
          \mathbf{Z}(\gamma) \equiv \mathbf{Z_{wld}}(\gamma)
        \end{align*}
        $$
        </td>
      </tr>
    </table>
  </div>
  <figcaption>Equivalence of common extrinsic rotations in world space</figcaption>
</figure>
