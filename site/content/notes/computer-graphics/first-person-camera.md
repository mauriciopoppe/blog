---
title: "First-Person Camera"
date: 2016-04-29 22:10:40
summary: |
  A first-person camera captures objects from the viewpoint of a player character. Orbiting with mouse pitch and yaw, coordinate space transformations, pitch clamping, and 6-DOF quaternion camera comparison.
image: /images/first-person-pov.jpeg
tags: ["camera", "first-person", "pov", "euler angles", "linear algebra", "quaternions"]
libraries: ["katex"]
aliases:
  - /notes/computer-graphics/viewing/camera/first-person-shot/
---

A first-person camera captures the virtual scene from the viewpoint of a character. The camera combines two behaviors:

- **Orbit**: The character looks left, right, up, and down without tilting the head (zero roll).
- **Translation**: The character moves forward, backward, left, and right along the current forward gaze direction.

Both behaviors are modeled by creating a camera coordinate space and updating its basis vectors under mouse movement.

Assuming standard world space axes:

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="/images/xyz.jpg" alt="" />
  </div>
  <figcaption>Chosen world space: $+x$ (right), $+y$ (up), and $+z$ (backward).</figcaption>
</figure>

Let $\mathbf{M}\_{\text{upright} \leftarrow \text{camera}}$ be the rotation matrix transforming vectors from camera space to upright space. Let the gaze direction vector be $\mathbf{p}\_{\text{camera}} = \begin{bmatrix} 0 & 0 & -1 \end{bmatrix}^T$.

Camera rotation combines two rotations:
- Looking left or right: rotation around the upright $y$-axis (yaw $\alpha$).
- Looking up or down: rotation around the upright $x$-axis (pitch $\beta$).

The intrinsic sequence $y-x^\prime$ (equivalent to extrinsic $x-y$) is represented by:

$$
\begin{aligned}
\mathbf{M}\_{\text{upright} \leftarrow \text{camera}} &= \mathbf{Y}(\alpha) \mathbf{X}(\beta) \\\\
&= \begin{bmatrix}
\cos\alpha & 0 & \sin\alpha \\\\
0 & 1 & 0 \\\\
-\sin\alpha & 0 & \cos\alpha
\end{bmatrix} \begin{bmatrix}
1 & 0 & 0 \\\\
0 & \cos\beta & -\sin\beta \\\\
0 & \sin\beta & \cos\beta
\end{bmatrix} \\\\
&= \begin{bmatrix}
\cos\alpha & \sin\alpha\sin\beta & \sin\alpha\cos\beta \\\\
0 & \cos\beta & -\sin\beta \\\\
-\sin\alpha & \cos\alpha\sin\beta & \cos\alpha\cos\beta
\end{bmatrix}
\end{aligned}
$$

The angles $\alpha$ and $\beta$ update from frame-to-frame deltas:

$$
\begin{aligned}
\beta &\leftarrow \beta + \Delta\beta \\\\
\alpha &\leftarrow \alpha + \Delta\alpha
\end{aligned}
$$

Where:
- Looking upward increases pitch ($\Delta\beta > 0$).
- Looking rightward decreases yaw ($\Delta\alpha < 0$).

## Mouse Coordinates Delta to Extrinsic Rotations Delta

Window managers like GLFW report mouse positions in screen coordinates where $+x$ points right and $+y$ points down.

Given current coordinates $(x\_{\text{new}}, y\_{\text{new}})$ and previous coordinates $(x\_{\text{old}}, y\_{\text{old}})$:

$$
\begin{aligned}
\Delta x &= x\_{\text{new}} - x\_{\text{old}} \\\\
\Delta y &= -(y\_{\text{new}} - y\_{\text{old}})
\end{aligned}
$$

Negating the $y$ delta ensures that moving the mouse upward produces a positive $\Delta y$.

Updating yaw $\alpha$ and pitch $\beta$:

$$
\begin{aligned}
\alpha &\leftarrow \alpha - \Delta x \\\\
\beta &\leftarrow \beta + \Delta y
\end{aligned}
$$

Pitch is clamped to $-90^\circ \leq \beta \leq 90^\circ$ to prevent the player camera from flipping upside down.

Transforming the camera gaze vector $\mathbf{p}\_{\text{camera}} = [0, 0, -1]^T$ into world coordinates yields the forward direction:

$$
\begin{aligned}
\mathbf{p}\_{\text{world}} &= \mathbf{M}\_{\text{world} \leftarrow \text{camera}} \mathbf{p}\_{\text{camera}} \\\\
&= \begin{bmatrix}
\cos\alpha & \sin\alpha\sin\beta & \sin\alpha\cos\beta \\\\
0 & \cos\beta & -\sin\beta \\\\
-\sin\alpha & \cos\alpha\sin\beta & \cos\alpha\cos\beta
\end{bmatrix} \begin{bmatrix} 0 \\\\ 0 \\\\ -1 \end{bmatrix} \\\\
&= \begin{bmatrix}
-\sin\alpha\cos\beta \\\\
\sin\beta \\\\
-\cos\alpha\cos\beta
\end{bmatrix}
\end{aligned}
$$

## FPS Pitch Clamping vs 6-DOF Quaternion Cameras

First-person shooter (FPS) cameras function reliably with separate yaw and pitch Euler angles specifically because pitch is clamped to $[-90^\circ, 90^\circ]$ and roll is locked to zero. This constraint prevents the camera from ever entering the gimbal lock singularity.

In contrast, **6-DOF (six degrees of freedom) free flight cameras** (spacecraft simulators, drone flight, and orbital tracking) allow unrestricted rotations across all three axes. Euler angle accumulation in 6-DOF cameras causes gimbal lock and axis flipping.

Free cameras therefore represent orientation using a unit quaternion $q$:

$$
q\_{t+\Delta t} = \Delta q \cdot q\_t
$$

Where mouse and roll inputs construct incremental rotors $\Delta q = [\cos\frac{\theta}{2}, \sin\frac{\theta}{2}\hat{\mathbf{n}}]$, preserving smooth, singularity-free orientation.

For quaternion rotor mathematics and interpolation, see [Quaternions](/notes/computer-graphics/quaternions/).

{{< snippet file="static/code/opengl/fps.cpp" lang="cpp" />}}

