---
title: "Quaternions"
date: 2016-04-26 16:39:27
favorite: true
summary: |
  Quaternions represent 3D orientations on a 4D hypersphere without gimbal lock. Rotor construction, sandwich product proofs, Rodrigues equivalence, SLERP, composition, and the Three.js API, with an interactive flight simulator.
image: /images/flat-shading.svg
tags: ["quaternions", "3d", "computer graphics", "rotation"]
libraries: ["katex"]
math_terms: ["graphics"]
references:
  - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
  - "Vince, J. (2011). Quaternions for computer graphics. London: Springer."
  - "Shoemake, K. (1985). Animating rotation with quaternion curves. ACM SIGGRAPH Computer Graphics, 19(3), pp.245-254."
aliases:
  - /notes/computer-graphics/transformation-matrices/rotation/quaternions/
  - /notes/mathematics/numeral-systems/quaternions/
series: "computer-graphics-pipeline"
pipeline_stage: "transforms"
interactive: true
---

In two dimensions, complex numbers rotate vectors effortlessly through Euler's formula $e^{i\theta} = \cos\theta + i\sin\theta$. In three dimensions, rotation has historically been fraught with numerical and geometric pitfalls.

Euler angles (pitch, yaw, roll) suffer from **gimbal lock**, an irreversible loss of a rotational degree of freedom when two axes align. Standard $3 \times 3$ rotation matrices require 9 numbers to store 3 degrees of freedom. Over thousands of animation frames, matrix multiplications accumulate numerical precision drift that warps geometry unless restored by costly Gram-Schmidt orthonormalization.

In 1843, William Rowan Hamilton realized that rotating vectors in 3D space requires a 4D algebraic system called <span data-term="quaternion" class="math-term-trigger cursor-help">quaternions</span>.

A quaternion $q$ consists of a real scalar component $s$ and a 3D imaginary vector component $\mathbf{v}$:

$$
q = [s, \mathbf{v}] = s + v\_x \mathbf{i} + v\_y \mathbf{j} + v\_z \mathbf{k}
$$

The imaginary fundamental units satisfy Hamilton's defining relation:

$$
\mathbf{i}^2 = \mathbf{j}^2 = \mathbf{k}^2 = \mathbf{i}\mathbf{j}\mathbf{k} = -1
$$

<svg viewBox="0 0 800 240" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 12px; border: 1px solid var(--grey-dark); box-sizing: border-box; margin: 1.5rem 0;">
  <defs>
    <marker id="arrow-ham-cw" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,1 L7,4 L0,7 Z" fill="rgb(var(--primary))" />
    </marker>
  </defs>
  <!-- Left Card: Cyclic Graph -->
  <rect x="12" y="12" width="378" height="216" rx="8" fill="var(--grey-dark)" />
  <text x="201" y="36" fill="rgb(var(--primary))" font-size="12" font-weight="700" letter-spacing="0.06em" text-anchor="middle">NON-COMMUTATIVE CYCLIC GRAPH</text>
  <line x1="26" y1="46" x2="376" y2="46" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <!-- Node i -->
  <circle cx="201" cy="80" r="18" fill="rgba(var(--primary), 0.15)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="201" y="85" fill="rgb(var(--primary))" font-size="14" font-weight="700" text-anchor="middle">i</text>
  <!-- Node j -->
  <circle cx="275" cy="172" r="18" fill="rgba(var(--primary), 0.15)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="275" y="177" fill="rgb(var(--primary))" font-size="14" font-weight="700" text-anchor="middle">j</text>
  <!-- Node k -->
  <circle cx="127" cy="172" r="18" fill="rgba(var(--primary), 0.15)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <text x="127" y="177" fill="rgb(var(--primary))" font-size="14" font-weight="700" text-anchor="middle">k</text>
  <!-- Clockwise Positive Arrows -->
  <path d="M 216,90 Q 262,114 270,152" fill="none" stroke="rgb(var(--primary))" stroke-width="1.8" marker-end="url(#arrow-ham-cw)" />
  <text x="272" y="118" fill="rgb(var(--primary))" font-size="12" font-weight="700">+k</text>
  <path d="M 255,182 Q 201,208 147,182" fill="none" stroke="rgb(var(--primary))" stroke-width="1.8" marker-end="url(#arrow-ham-cw)" />
  <text x="201" y="214" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="middle">+i</text>
  <path d="M 132,152 Q 140,114 186,90" fill="none" stroke="rgb(var(--primary))" stroke-width="1.8" marker-end="url(#arrow-ham-cw)" />
  <text x="130" y="118" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="end">+j</text>
  <!-- Center Direction Notes -->
  <text x="201" y="128" fill="var(--grey-light)" font-size="11" text-anchor="middle">Clockwise = (+)</text>
  <text x="201" y="144" fill="#ffa726" font-size="11" text-anchor="middle">Counter-CW = (−)</text>
  <!-- Right Card: Multiplication Rules -->
  <rect x="402" y="12" width="386" height="216" rx="8" fill="var(--grey-dark)" />
  <text x="595" y="36" fill="var(--grey-lighter)" font-size="12" font-weight="700" letter-spacing="0.06em" text-anchor="middle">HAMILTON MULTIPLICATION RULES</text>
  <line x1="416" y1="46" x2="774" y2="46" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <text x="422" y="74" fill="var(--grey-light)" font-size="12">Fundamental Identity:</text>
  <text x="768" y="74" fill="rgb(var(--primary))" font-size="13" font-family="monospace" font-weight="700" text-anchor="end">i² = j² = k² = ijk = −1</text>
  <text x="422" y="108" fill="var(--grey-light)" font-size="12">Direct Order (CW):</text>
  <text x="768" y="108" fill="var(--grey-lighter)" font-size="12.5" font-family="monospace" text-anchor="end">ij = k, &nbsp; jk = i, &nbsp; ki = j</text>
  <text x="422" y="142" fill="var(--grey-light)" font-size="12">Reversed (CCW):</text>
  <text x="768" y="142" fill="#ffa726" font-size="12.5" font-family="monospace" text-anchor="end">ji = −k, &nbsp; kj = −i, &nbsp; ik = −j</text>
  <text x="422" y="176" fill="var(--grey-light)" font-size="12">Anti-Commutativity:</text>
  <text x="768" y="176" fill="var(--grey-lighter)" font-size="12" font-family="monospace" text-anchor="end">ab = −ba &nbsp; (pure orthogonal)</text>
  <text x="595" y="208" fill="var(--grey-light)" font-size="10.5" text-anchor="middle">Associative, distributive, non-commutative</text>
</svg>

### Conjugate, Norm, and Unit Quaternions

The conjugate of a quaternion $q = [s, \mathbf{v}]$ negates the imaginary vector component:

$$
q^\ast = [s, -\mathbf{v}]
$$

The Euclidean norm of a quaternion is $\lVert q \rVert = \sqrt{q q^\ast} = \sqrt{s^2 + \lVert \mathbf{v} \rVert^2}$. Every non-zero quaternion factors into its scalar magnitude $\lVert q \rVert$ and a unit direction $\hat{q}$:

$$
q = \lVert q \rVert \hat{q} \quad \text{where } \lVert \hat{q} \rVert = 1
$$

For a unit quaternion ($\lVert q \rVert = 1$), the algebraic inverse equals the conjugate: $q^{-1} = q^\ast$.

### Embedding 3D Vectors

To manipulate geometric points and vectors in 3D space, we embed a 3D vector $\mathbf{v}$ into quaternion space as a **pure quaternion** with a zero scalar component:

$$
p = [0, \mathbf{v}]
$$

## Deriving 3D Rotation: From One-Sided to Sandwich Product

In 2D, a rotor $e^{i\theta} = \cos\theta + i\sin\theta$ rotates points in the Cartesian plane through a single one-sided multiplication $z^\prime = e^{i\theta} z = (\cos\theta + i\sin\theta)(x + iy)$.

To rotate vectors in 3D, let us propose a unit quaternion rotor defined by a scalar $s$ and a unit rotation axis $\hat{\mathbf{n}}$:

$$
q = [s, \lambda \hat{\mathbf{n}}] \quad \text{where } \lVert \hat{\mathbf{n}} \rVert = 1 \text{ and } s^2 + \lambda^2 = 1
$$

Here:
- $s$ is the scalar component.
- $\hat{\mathbf{n}}$ is the unit directional vector defining the 3D rotation axis ($\lVert \hat{\mathbf{n}} \rVert = 1$).
- $\lambda$ is the scalar amplitude (weight) of the vector component.
- $s^2 + \lambda^2 = 1$ enforces the unit norm constraint $\lVert q \rVert^2 = s^2 + \lVert \lambda \hat{\mathbf{n}} \rVert^2 = s^2 + \lambda^2 = 1$. Because rotation scales lengths as $\lVert \mathbf{v}^\prime \rVert = \lVert q \rVert^2 \lVert \mathbf{v} \rVert$, setting $s^2 + \lambda^2 = 1$ guarantees a rigid rotation ($\lVert \mathbf{v}^\prime \rVert = \lVert \mathbf{v} \rVert$) without stretching or shrinking.

To test whether 3D vector rotation works with a single multiplication like complex numbers, we compute the one-sided product $q p$:

$$
\begin{aligned}
qp &= [s, \lambda \hat{\mathbf{n}}][0, \mathbf{v}] \\\\
&= [-\lambda (\hat{\mathbf{n}} \cdot \mathbf{v}), s \mathbf{v} + \lambda (\hat{\mathbf{n}} \times \mathbf{v})]
\end{aligned}
$$

This product splits into a scalar part $-\lambda (\hat{\mathbf{n}} \cdot \mathbf{v})$ and a 3D vector part $s \mathbf{v} + \lambda (\hat{\mathbf{n}} \times \mathbf{v})$. For an arbitrary 3D vector, the dot product $\hat{\mathbf{n}} \cdot \mathbf{v}$ is non-zero, causing vector information to leak into the real scalar dimension. Thus, a single one-sided multiplication fails to produce a pure 3D vector for general rotations.

### Perpendicular Vector Case

When the vector $\mathbf{v}$ is strictly perpendicular to the rotation axis $\hat{\mathbf{n}}$ ($\hat{\mathbf{n}} \cdot \mathbf{v} = 0$), the scalar dot product vanishes:

$$
qp = [0, s \mathbf{v} + \lambda (\hat{\mathbf{n}} \times \mathbf{v})]
$$

Because $\hat{\mathbf{n}} \perp \mathbf{v}$ and $\lVert \hat{\mathbf{n}} \rVert = 1$, the cross product vector $\hat{\mathbf{n}} \times \mathbf{v}$ has the exact same length as $\mathbf{v}$:

$$
\lVert \hat{\mathbf{n}} \times \mathbf{v} \rVert = \lVert \hat{\mathbf{n}} \rVert \lVert \mathbf{v} \rVert \sin(90^\circ) = \lVert \mathbf{v} \rVert
$$

The vectors $\mathbf{v}$ and $\hat{\mathbf{n}} \times \mathbf{v}$ form an orthonormal basis for the plane perpendicular to $\hat{\mathbf{n}}$. Setting $s = \cos\theta$ and $\lambda = \sin\theta$ evaluates the vector component to:

$$
\mathbf{v}^\prime = \cos\theta \mathbf{v} + \sin\theta (\hat{\mathbf{n}} \times \mathbf{v})
$$

Which is the exact equation for a 2D planar rotation by angle $\theta$.

The one-sided product $q p$ works **only under this strict perpendicular condition**:
1. The scalar part stays strictly zero because $\hat{\mathbf{n}} \cdot \mathbf{v} = 0$, preventing 4D scalar leakage.
2. The basis vectors $\mathbf{v}$ and $\hat{\mathbf{n}} \times \mathbf{v}$ have equal lengths and are orthogonal, constraining the rotation to a 2D circle around $\hat{\mathbf{n}}$.

### General Case & The Sandwich Product

When $\mathbf{v}$ is not perpendicular to $\hat{\mathbf{n}}$, the scalar term $-\lambda (\hat{\mathbf{n}} \cdot \mathbf{v})$ is non-zero. Vector information leaks into the scalar component, and the one-sided product $qp$ fails to produce a pure 3D vector.

Post-multiplying by the conjugate $q^\ast = [s, -\lambda \hat{\mathbf{n}}]$ cancels this scalar leakage and rotates the vector via its orthogonal decomposition $\mathbf{v} = \mathbf{v}\_{\parallel} + \mathbf{v}\_{\perp}$:

$$
p^\prime = q p q^\ast
$$

This is the **sandwich product**. It acts on the two vector components in two stages:

1. **Parallel Component $\mathbf{v}\_{\parallel} = (\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$**: Commutes directly with the rotor and remains invariant ($q \mathbf{v}\_{\parallel} q^\ast = \mathbf{v}\_{\parallel}$).
2. **Perpendicular Component $\mathbf{v}\_{\perp} = \mathbf{v} - \mathbf{v}\_{\parallel}$**: Pre-multiplication by $q$ rotates $\mathbf{v}\_{\perp}$ by an angle $+\phi$, and post-multiplication by $q^\ast$ rotates it by an additional $+\phi$, producing a total rotation of $2\phi$.

Because the sandwich product applies the rotor on both sides, the resulting rotation angle doubles ($2\phi$). To rotate an arbitrary vector $\mathbf{v}$ around unit axis $\hat{\mathbf{n}}$ by an angle $\theta$, we set $\phi = \frac{\theta}{2}$, producing the fundamental **unit rotation quaternion**:

$$
q = \left[\cos\left(\tfrac{\theta}{2}\right), \sin\left(\tfrac{\theta}{2}\right)\hat{\mathbf{n}}\right]
$$

### The Double Cover and Antipodal Rotors

Because the rotation quaternion uses half-angles ($\theta/2$), rotating a 3D vector by $360^\circ$ ($2\pi$) flips the sign of the quaternion:

| 3D Physical Rotation ($\theta$) | Half-Angle ($\theta/2$) | Unit Rotor $q(\theta) = [\cos(\theta/2), \sin(\theta/2)\hat{\mathbf{n}}]$ |
| :--- | :--- | :--- |
| **$0^\circ$** (Start) | $0^\circ$ | $[\cos(0), \sin(0)\hat{\mathbf{n}}] = [1, \mathbf{0}] = +1 = +q$ |
| **$360^\circ$** ($2\pi$) | **$180^\circ$** ($\pi$) | $[\cos(\pi), \sin(\pi)\hat{\mathbf{n}}] = [-1, \mathbf{0}] = -1 = -q$ |
| **$720^\circ$** ($4\pi$) | **$360^\circ$** ($2\pi$) | $[\cos(2\pi), \sin(2\pi)\hat{\mathbf{n}}] = [1, \mathbf{0}] = +1 = +q$ |

When rotating a vector with $-q$, the sandwich product cancels the negative sign:

$$
(-q) p (-q)^\ast = (-1)^2 (q p q^\ast) = q p q^\ast
$$

Both $+q$ and $-q$ evaluate to the exact same 3D spatial rotation $\mathbf{R}(+q) \equiv \mathbf{R}(-q)$. This 2-to-1 mapping makes unit quaternions a **double cover** of 3D rotations ($\mathrm{SU}(2) \to \mathrm{SO}(3)$).

<svg viewBox="0 0 800 240" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 12px; border: 1px solid var(--grey-dark); box-sizing: border-box; margin: 1.5rem 0;">
  <defs>
    <marker id="arrow-rotor-1" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,1 L7,4 L0,7 Z" fill="#fbbf24" />
    </marker>
    <marker id="arrow-rotor-2" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,1 L7,4 L0,7 Z" fill="#34d399" />
    </marker>
    <marker id="arrow-rotor-guide" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,1 L7,4 L0,7 Z" fill="rgba(255, 255, 255, 0.45)" />
    </marker>
  </defs>
  <!-- Left Card: Two-Stage Rotation in 2D Plane -->
  <rect x="12" y="12" width="378" height="216" rx="8" fill="var(--grey-dark)" />
  <foreignObject x="26" y="16" width="350" height="32">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: rgb(var(--primary)); font-size: 11.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: var(--family-sans);">
      TWO-STAGE SANDWICH: $+\tfrac{\theta}{2} + \tfrac{\theta}{2} = \theta$
    </div>
  </foreignObject>
  <line x1="26" y1="50" x2="376" y2="50" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <!-- Plane Circle -->
  <circle cx="201" cy="144" r="64" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.2" stroke-dasharray="3,3" />
  <circle cx="201" cy="144" r="3" fill="var(--grey-light)" />
  <!-- Initial Vector v_perp (angle 0) -->
  <line x1="201" y1="144" x2="265" y2="144" stroke="var(--grey-lighter)" stroke-width="2.2" marker-end="url(#arrow-rotor-1)" />
  <foreignObject x="270" y="130" width="60" height="30">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: var(--grey-lighter); font-size: 12px; font-family: var(--family-sans);">
      $\mathbf{v}_\perp$
    </div>
  </foreignObject>
  <!-- Intermediate Vector after pre-multiplication q v_perp (angle +theta/2 = 45 deg) -->
  <line x1="201" y1="144" x2="246" y2="99" stroke="#fbbf24" stroke-width="1.8" stroke-dasharray="4,3" marker-end="url(#arrow-rotor-1)" />
  <foreignObject x="250" y="74" width="130" height="32">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #fbbf24; font-size: 11.5px; font-weight: 600; font-family: var(--family-sans);">
      $q \mathbf{v}_\perp \; (+\theta/2)$
    </div>
  </foreignObject>
  <!-- Final Vector after post-multiplication (q v_perp) q* (angle +theta = 90 deg) -->
  <line x1="201" y1="144" x2="201" y2="80" stroke="#34d399" stroke-width="2.2" marker-end="url(#arrow-rotor-2)" />
  <foreignObject x="120" y="48" width="162" height="32">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #34d399; font-size: 12px; font-weight: 700; text-align: center; font-family: var(--family-sans);">
      $q \mathbf{v}_\perp q^\ast \; (+\theta)$
    </div>
  </foreignObject>
  <!-- Arc 1: 0 to theta/2 -->
  <path d="M 231,144 A 30 30 0 0 0 222,123" fill="none" stroke="#fbbf24" stroke-width="1.6" />
  <foreignObject x="234" y="114" width="48" height="32">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #fbbf24; font-size: 11px; font-weight: 700; font-family: var(--family-sans);">
      $\theta/2$
    </div>
  </foreignObject>
  <!-- Arc 2: theta/2 to theta -->
  <path d="M 222,123 A 30 30 0 0 0 201,114" fill="none" stroke="#34d399" stroke-width="1.6" />
  <foreignObject x="200" y="100" width="48" height="32">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #34d399; font-size: 11px; font-weight: 700; font-family: var(--family-sans);">
      $\theta/2$
    </div>
  </foreignObject>
  <!-- Right Card: Antipodal Identification & Double Cover -->
  <rect x="402" y="12" width="386" height="216" rx="8" fill="var(--grey-dark)" />
  <foreignObject x="416" y="16" width="358" height="32">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: var(--grey-lighter); font-size: 11.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; font-family: var(--family-sans);">
      DOUBLE COVER: $\mathrm{SU}(2) \to \mathrm{SO}(3)$
    </div>
  </foreignObject>
  <line x1="416" y1="50" x2="774" y2="50" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <!-- Circle of Rotors (Upper dashed half) -->
  <path d="M 541,126 A 54 54 0 0 1 649,126" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1.2" stroke-dasharray="3,3" />
  <circle cx="595" cy="126" r="3" fill="var(--grey-light)" />
  <!-- Antipodal Nodes +q and -q -->
  <circle cx="649" cy="126" r="12" fill="rgba(var(--primary), 0.2)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <foreignObject x="633" y="110" width="32" height="32">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: rgb(var(--primary)); font-size: 11px; font-weight: 700; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--family-sans); line-height: 1;">
      $+q$
    </div>
  </foreignObject>
  <circle cx="541" cy="126" r="12" fill="rgba(var(--primary), 0.2)" stroke="rgb(var(--primary))" stroke-width="1.5" />
  <foreignObject x="525" y="110" width="32" height="32">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: rgb(var(--primary)); font-size: 11px; font-weight: 700; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-family: var(--family-sans); line-height: 1;">
      $-q$
    </div>
  </foreignObject>
  <!-- Connecting Diameter -->
  <line x1="553" y1="126" x2="637" y2="126" stroke="rgba(var(--primary), 0.4)" stroke-width="1.2" stroke-dasharray="3,3" />
  <!-- Circular Semi-Arc Arrows converging to shared 3D matrix -->
  <path d="M 649,126 A 54 54 0 0 1 604,180" fill="none" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.3" marker-end="url(#arrow-rotor-guide)" />
  <path d="M 541,126 A 54 54 0 0 0 586,180" fill="none" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.3" marker-end="url(#arrow-rotor-guide)" />
  <!-- Shared Matrix Result Box -->
  <rect x="520" y="180" width="150" height="28" rx="4" fill="rgba(52, 211, 153, 0.12)" stroke="rgba(52, 211, 153, 0.3)" stroke-width="1" />
  <foreignObject x="520" y="182" width="150" height="26">
    <div xmlns="http://www.w3.org/1999/xhtml" style="color: #34d399; font-size: 12.5px; font-weight: 700; text-align: center; font-family: var(--family-sans);">
      $\mathbf{R}(+q) \equiv \mathbf{R}(-q)$
    </div>
  </foreignObject>
  <!-- Explanation note -->
  <text x="595" y="68" fill="var(--grey-light)" font-size="11" text-anchor="middle">360° rotor turn (q → −q) reverses sign</text>
  <text x="595" y="84" fill="var(--grey-lighter)" font-size="11" font-weight="600" text-anchor="middle">720° rotor turn returns to original +q</text>
</svg>

Expanding $p^\prime = q p q^\ast$ evaluates directly to [Rodrigues' rotation formula](/notes/computer-graphics/rotation/) $\mathbf{v}^\prime = \cos\theta \mathbf{v} + \sin\theta (\hat{\mathbf{n}} \times \mathbf{v}) + (1 - \cos\theta)(\mathbf{v} \cdot \hat{\mathbf{n}})\hat{\mathbf{n}}$.

The interactive 3D explorer below visualizes this orthogonal decomposition and sandwich product rotation in action:

<div id="quaternion-decomp-explorer"></div>

## Spherical Linear Interpolation (SLERP)

In keyframe animation, camera control, and physics engines, orientations must transition smoothly from an initial rotation $q\_1$ to a target rotation $q\_2$.

Linear interpolation of Euler angles $(\alpha(t), \beta(t), \gamma(t))$ produces variable angular velocity, axis wobble, and severe distortion near gimbal lock.

Because unit quaternions reside on the unit 3-sphere $S^3$, Ken Shoemake introduced **Spherical Linear Interpolation (SLERP)** to trace the shortest geodesic arc at constant angular velocity:

$$
\text{Slerp}(q\_1, q\_2, t) = \frac{\sin((1-t)\Omega)}{\sin\Omega} q\_1 + \frac{\sin(t\Omega)}{\sin\Omega} q\_2
$$

Where $\Omega$ represents the 4D angle between the two quaternions:

$$
\cos\Omega = q\_1 \cdot q\_2 = s\_1 s\_2 + x\_1 x\_2 + y\_1 y\_2 + z\_1 z\_2
$$

Because $q$ and $-q$ represent the exact same 3D orientation (antipodal symmetry on $S^3$), we check the sign of the dot product before interpolating. If $q\_1 \cdot q\_2 < 0$, we negate $q\_2$ to take the shorter rotational path:

$$
\cos\Omega = |q\_1 \cdot q\_2|
$$

<svg viewBox="0 0 800 240" width="100%" style="width: 100%; height: auto; overflow: hidden; font-family: var(--family-sans, system-ui, sans-serif); background: var(--grey-darker); border-radius: 12px; padding: 12px; border: 1px solid var(--grey-dark); box-sizing: border-box; margin: 1.5rem 0;">
  <defs>
    <marker id="arrow-slerp-arc" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
      <path d="M0,1 L7,4 L0,7 Z" fill="#34d399" />
    </marker>
  </defs>
  <!-- Left Card: Hypersphere S3 Arc vs Euclidean Chord -->
  <rect x="12" y="12" width="480" height="216" rx="8" fill="var(--grey-dark)" />
  <text x="252" y="36" fill="rgb(var(--primary))" font-size="12" font-weight="700" letter-spacing="0.06em" text-anchor="middle">SLERP ON S³ HYPERSPHERE GEODESIC</text>
  <line x1="26" y1="46" x2="478" y2="46" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <!-- Hypersphere Surface Arc (S3) -->
  <path d="M 110,204 A 125 125 0 0 1 394,204" fill="none" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1.5" />
  <text x="465" y="214" fill="var(--grey-light)" font-size="10.5" text-anchor="end">Surface S³ (‖q‖ = 1)</text>
  <!-- Origin O -->
  <circle cx="252" cy="204" r="3.5" fill="var(--grey-light)" />
  <text x="252" y="218" fill="var(--grey-light)" font-size="10" text-anchor="middle">Origin O</text>
  <!-- Radial lines to q1 and q2 -->
  <line x1="252" y1="204" x2="156" y2="124" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" stroke-dasharray="2 2" />
  <line x1="252" y1="204" x2="348" y2="124" stroke="rgba(255, 255, 255, 0.15)" stroke-width="1" stroke-dasharray="2 2" />
  <!-- Angle Omega Arc -->
  <path d="M 223,180 A 38 38 0 0 1 281,180" fill="none" stroke="#fbbf24" stroke-width="1.6" />
  <text x="252" y="160" fill="#fbbf24" font-size="11.5" font-weight="700" text-anchor="middle">Ω = arccos(q₁ · q₂)</text>
  <!-- q1 Keyframe Point -->
  <circle cx="156" cy="124" r="6" fill="rgb(var(--primary))" />
  <text x="144" y="128" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="end">q₁ (t = 0)</text>
  <!-- q2 Keyframe Point -->
  <circle cx="348" cy="124" r="6" fill="rgb(var(--primary))" />
  <text x="360" y="128" fill="rgb(var(--primary))" font-size="12" font-weight="700" text-anchor="start">q₂ (t = 1)</text>
  <!-- SLERP Geodesic Arc Path on S3 -->
  <path d="M 156,124 A 125 125 0 0 1 348,124" fill="none" stroke="#34d399" stroke-width="2.5" />
  <!-- SLERP Equidistant Tick Marks -->
  <circle cx="199" cy="91" r="4" fill="#34d399" />
  <text x="192" y="78" fill="#34d399" font-size="10.5" font-weight="600" text-anchor="end">t = 0.25</text>
  <circle cx="252" cy="79" r="4.5" fill="#34d399" />
  <text x="252" y="66" fill="#34d399" font-size="11" font-weight="700" text-anchor="middle">t = 0.50</text>
  <circle cx="305" cy="91" r="4" fill="#34d399" />
  <text x="312" y="78" fill="#34d399" font-size="10.5" font-weight="600" text-anchor="start">t = 0.75</text>
  <!-- Flat LERP Chord (cutting through interior) -->
  <line x1="156" y1="124" x2="348" y2="124" stroke="#ff7043" stroke-width="1.5" stroke-dasharray="4,4" />
  <circle cx="252" cy="124" r="4" fill="#ff7043" />
  <text x="252" y="140" fill="#ff7043" font-size="10.5" font-weight="600" text-anchor="middle">LERP Midpoint (‖q‖ &lt; 1)</text>
  <!-- Right Card: Comparison & Metric Telemetry -->
  <rect x="504" y="12" width="284" height="216" rx="8" fill="var(--grey-dark)" />
  <text x="646" y="36" fill="var(--grey-lighter)" font-size="12" font-weight="700" letter-spacing="0.06em" text-anchor="middle">TRAJECTORY COMPARISON</text>
  <line x1="518" y1="46" x2="774" y2="46" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <text x="524" y="74" fill="#34d399" font-size="11.5" font-weight="700">✔ SLERP (Geodesic Arc):</text>
  <text x="536" y="94" fill="var(--grey-light)" font-size="11">• Constant speed: dθ/dt = Ω</text>
  <text x="536" y="112" fill="var(--grey-light)" font-size="11">• Unit norm preserved (‖q‖ = 1)</text>
  <text x="536" y="130" fill="var(--grey-light)" font-size="11">• Minimal rotation torque</text>
  <line x1="518" y1="144" x2="774" y2="144" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />
  <text x="524" y="168" fill="#ff7043" font-size="11.5" font-weight="700">✖ LERP (Straight Chord):</text>
  <text x="536" y="188" fill="var(--grey-light)" font-size="11">• Speed: non-linear velocity warp</text>
</svg>

### Geodesic vs Multi-Axis Interpolation

The difference in 3D trajectory between SLERP and Euler angle LERP lies in their rotational geometry:

- **Quaternion SLERP**: Computes the relative rotation $\Delta q = q_2 q_1^\ast = [\cos(\Theta/2), \sin(\Theta/2)\hat{\mathbf{n}}]$. The entire 3D rigid body rotates around this constant invariant axis $\hat{\mathbf{n}}$ at constant angular speed $\Theta$. Because $\hat{\mathbf{n}}$ is fixed throughout interpolation, all points on the aircraft sweep circular arcs in flat planes parallel to the rotation disc.
- **Euler LERP**: Linearly blends $(\text{pitch}(t), \text{yaw}(t), \text{roll}(t))$ as three independent scalars and applies them sequentially ($R = R_x R_y R_z$). Because the three rotational frames compound hierarchically, the instantaneous axis of rotation constantly tilts and wobbles. There is no single invariant plane of rotation.

## Quaternions in Three.js

Every formula above maps to a method call in [Three.js](https://threejs.org/docs/#api/en/math/Quaternion). The flight simulator below uses these exact calls, so it doubles as a live reference for what parameters go where.

### Constructor Order

The article writes quaternions as $q = [w, x, y, z]$ with the scalar first. Three.js stores them in the opposite order, $q = (x, y, z, w)$, so the constructor takes four arguments with the scalar last:

```js
// math notation: q = [w, x, y, z]
// Three.js:      new THREE.Quaternion(x, y, z, w)
// 90° about +Y: half angle θ/2 = 45°, cos(45°) = sin(45°) = √2/2 ≈ 0.707
// q = [cos(θ/2), sin(θ/2)·n̂] = [0.707, 0, 0.707, 0] → (x, y, z, w) = (0, 0.707, 0, 0.707)
const q = new THREE.Quaternion(0, 0.707, 0, 0.707)
```

This ordering is the most common source of bugs. The simulator engine reorders when it hands quaternions to Three.js:

```js
// engine arrays are [w, x, y, z], Three.js wants (x, y, z, w)
const qThree = new THREE.Quaternion(qCurrent[1], qCurrent[2], qCurrent[3], qCurrent[0])
```

### From an Axis and Angle

The rotor $q = [\cos(\theta/2), \sin(\theta/2)\hat{\mathbf{n}}]$ becomes `setFromAxisAngle`. Pass the full rotation angle $\theta$ in radians, not the half angle. Three.js applies the half-angle internally:

```js
const axis = new THREE.Vector3(0, 1, 0) // unit length, matching ‖n̂‖ = 1
const q = new THREE.Quaternion().setFromAxisAngle(axis, Math.PI / 2)
```

### From Euler Angles

Three.js can also build a quaternion from pitch, yaw, and roll with an explicit rotation order:

```js
const euler = new THREE.Euler(pitch, yaw, roll, 'XYZ')
const q = new THREE.Quaternion().setFromEuler(euler)
```

This is convenient, but it is the path that hits gimbal lock, the failure the SLERP section above avoids.

### Spherical Interpolation

The SLERP formula maps directly to `slerp`. The shortest-path sign check from $\cos\Omega = |q\_1 \cdot q\_2|$ happens internally:

```js
const q = q1.clone().slerp(q2, t) // t in [0, 1]
```

The total angular distance between two orientations is `q1.angleTo(q2)`, which computes exactly $2\arccos(|q\_1 \cdot q\_2|)$:

```js
const angle = q1.angleTo(q2) // radians
```

### Applying to an Object

Assign the quaternion to the object's orientation and Three.js converts it into a rotation matrix for the renderer:

```js
mesh.quaternion.copy(q)
// or
mesh.applyQuaternion(q)
```

For long-running simulations, renormalize periodically to counter drift:

```js
q.normalize()
```

## Quaternion Composition

Combining rotations follows the same right-to-left order as matrix products. Applying $q\_1$ first and then $q\_2$ is $q\_2 q\_1$:

```js
const q = q2.clone().multiply(q1) // q1 first, then q2
```

This works because the sandwich products telescope. Substituting $p^\prime = q\_1 p q\_1^\ast$ into the second rotation:

$$
\begin{aligned}
p^{\prime\prime} &= q\_2 p^\prime q\_2^\ast \\\\
&= q\_2 (q\_1 p q\_1^\ast) q\_2^\ast \\\\
&= (q\_2 q\_1) p (q\_1^\ast q\_2^\ast) \\\\
&= (q\_2 q\_1) p (q\_2 q\_1)^\ast
\end{aligned}
$$

A sequence of rotations $q\_1, q\_2, \dots, q\_n$ combines into a single composite quaternion $q = q\_n \dots q\_2 q\_1$. Composing two quaternions requires 16 scalar multiplications, compared to 27 multiplications for $3 \times 3$ matrices.

## Putting It All Together: The Flight Simulator

The interactive flight simulator below lets you scrub or play both interpolation paths side by side, with the exact Three.js calls that produce the current orientation shown on the left.

<div id="quaternion-slerp-explorer"></div>

## Quaternions in the Rendering Pipeline

Quaternions are stored and interpolated in software, but the GPU rasterizes geometry through matrix multiplication. The conversion from the sandwich product $p^\prime = q p q^\ast$ to the equivalent $3 \times 3$ rotation matrix, for $q = [w, x, y, z]$ with unit norm ($\lVert q \rVert = 1$), is:

$$
\mathbf{R}(q) = \begin{bmatrix}
1 - 2(y^2 + z^2) & 2(xy - wz) & 2(xz + wy) \\\\
2(xy + wz) & 1 - 2(x^2 + z^2) & 2(yz - wx) \\\\
2(xz - wy) & 2(yz + wx) & 1 - 2(x^2 + y^2)
\end{bmatrix}
$$

Notice that negating the quaternion ($-q = [-w, -x, -y, -z]$) squares all terms and negates sign pairs identically, producing the exact same matrix $\mathbf{R}(-q) = \mathbf{R}(q)$. This reflects the 2-to-1 homomorphism $\text{SU}(2) \to \text{SO}(3)$.

## Key Takeaways

| Concept | Formula | Takeaway |
| :--- | :--- | :--- |
| **Rotor** | $q = [\cos(\theta/2), \sin(\theta/2)\hat{\mathbf{n}}]$ | A unit quaternion encodes a rotation of $\theta$ about the fixed axis $\hat{\mathbf{n}}$; the half angle keeps the rotor on the unit 3-sphere. |
| **Sandwich product** | $p^\prime = q p q^\ast$ | The two-sided product rotates a vector without leaking into the scalar dimension, unlike the one-sided product $q p$. |
| **Double cover** | $\mathbf{R}(-q) = \mathbf{R}(q)$ | $q$ and $-q$ represent the same orientation, so SLERP negates $q\_2$ when $q\_1 \cdot q\_2 < 0$ to take the shorter path. |
| **SLERP** | $\text{Slerp}(q\_1, q\_2, t) = \frac{\sin((1-t)\Omega)}{\sin\Omega} q\_1 + \frac{\sin(t\Omega)}{\sin\Omega} q\_2$ | Traces the shortest geodesic on $S^3$ at constant angular speed, avoiding the axis wobble and gimbal lock of Euler LERP. |
| **Composition** | $q = q\_2 q\_1$ | Applying $q\_1$ then $q\_2$ multiplies quaternions right to left, like matrices, in 16 multiplications versus 27 for $3 \times 3$ matrices. |
| **To the GPU** | $\mathbf{R}(q)$ | Quaternions are stored and interpolated in software, then converted once into a rotation matrix for vertex transformation on the GPU. |

<script type="module" src="/js/computer-graphics/quaternion-decomp-explorer.js"></script>
<script type="module" src="/js/computer-graphics/quaternion-slerp-explorer.js"></script>
