---
title: "Building a First-Person Shooter Camera in C++"
date: 2016-04-29 22:10:40
summary: |
  A first-person camera captures objects from the viewpoint of a player's character. Some aspects have to be considered, like the characteristics of the camera (orbiting with the mouse and translation with keyboard keys), as well as how we could capture all these characteristics with math and linear algebra.

  <br />
  In this article, I analyze the math needed to design and implement a first-person shooter camera in C++.
image: /images/first-person-pov.jpeg
tags: ["camera", "first-person", "pov", "euler angles", "linear algebra"]
libraries: ["math"]
---

A first-person camera captures objects from the viewpoint of a player's character. The camera has the following characteristics:

- **Orbit**: The character can look left, right, up, and down; however, if we imagine the character's head, it can't be tilted.
- **Translation**: The character can move in four directions: forward, backward, left, and right. Note that the vector that represents the direction the character is looking at doesn't change (the orbit is not affected by translation).
  - Our camera will always move in the same direction the camera is looking. This is usually done differently in first-person shooters, where the character may move in a different direction than the camera is looking.

Both characteristics can be implemented by creating a space for the camera and defining the direction in this space. That way, translation doesn't modify the direction the camera is looking at, and for orbit, we would rotate the basis vectors of the space.

Assuming that the world space axes are as follows:

<figure>
  <div class="figure-images">
    <img class="lazy-load" data-src="/images/xyz.jpg" alt="" />
  </div>
  <figcaption>Chosen world space: \(+\mathbf{x}\) (right), \(+\mathbf{y}\) (up), and \(+\mathbf{z}\) (backward). Note that the choice is just personal preference.</figcaption>
</figure>


Let $\mathbf{M}_{upright \leftarrow camera}$ be the rotation matrix that transforms points from *camera space* to *upright space*. Also, let the "look at" vector be defined as $\mathbf{p}_{camera} = \begin{bmatrix} 0 & 0 & -1 \end{bmatrix}^T$ in *camera space*. To define the rotation matrix $\mathbf{M}_{upright \leftarrow camera}$, let's first identify the Euler angles involved in the rotation. Taking the image above as a reference, we can identify the following actions:

- The character looks left or right - rotation relative to the *upright space* $y$-axis.
- The character looks up or down - rotation relative to the *upright space* $x$-axis.

Note that the sequence of [intrinsic rotations](../../../transformation-matrices/rotation/euler-angles#intrinsic-rotations) ($y-x'$ or $x-y$ if expressed as a sequence of *extrinsic rotations*) represents the rotation of the camera. The sequence of extrinsic rotations can be represented as a multiplication of the following rotation matrices:

<div>$$
\begin{align*}
\mathbf{M}_{upright \leftarrow camera} &= \mathbf{Y}(\alpha) \mathbf{X}(\beta) \\
&= \begin{bmatrix}
\cos{\alpha} & 0 & \sin{\alpha} \\
0 & 1 & 0 \\
-\sin{\alpha} & 0 & \cos{\alpha}
\end{bmatrix} \begin{bmatrix}
1 & 0 & 0 \\
0 & \cos{\beta} & -\sin{\beta} \\
0 & \sin{\beta} & \cos{\beta}
\end{bmatrix}
\\
&= \begin{bmatrix}
\cos{\alpha} & \sin{\alpha}\sin{\beta} & \sin{\alpha}\cos{\beta} \\
0 & \cos{\beta} & -\sin{\beta} \\
-\sin{\alpha} & \cos{\alpha}\sin{\beta} & \cos{\alpha}\cos{\beta}
\end{bmatrix}
\end{align*}
$$</div>

The angles $\alpha$ and $\beta$ are computed as follows:

- Let $\Delta{\alpha}$ and $\Delta{\beta}$ represent the change in the rotation around the $\mathbf{Y}$ and $\mathbf{X}$ axes, respectively. The values of $\alpha$ and $\beta$ are computed based on the previous state:

<div>$$
\begin{align*}
\beta &:= \beta + \Delta{\beta} \\
\alpha &:= \alpha + \Delta{\alpha}
\end{align*}
$$</div>

<span></span>

- If the character looks up, then $\Delta{\beta}$ is positive.
- If the character looks to the right, then $\Delta{\alpha}$ is negative.

## Mouse Coordinates Delta to Extrinsic Rotations Delta

Next, we need to define what happens when we move the mouse. We can configure a window manager like [GLFW](http://www.glfw.org/) to call a callback method whenever we move the mouse with the coordinates of the mouse as an argument (e.g., as $x_{new}$ and $y_{new}$). **Note: The coordinates of the mouse are expressed relative to the top-left corner of the window, whose $+x$-axis points right and $+y$-axis points down.** If we keep the old coordinates of the mouse (as $x_{old}$ and $y_{old}$), we can obtain how much the mouse moved with respect to the old position with the following calculation:

<div>$$
\begin{align*}
\Delta x &= x_{new} - x_{old} \\
\Delta y &= -(y_{new} - y_{old})
\end{align*}
$$</div>

Note that $y_{new} - y_{old}$ will be positive if we move the mouse down, which is unintuitive. Therefore, we can multiply this result by $-1$ so that moving the mouse downward sets a negative value in $\Delta y$.

The next step is to update the values of $\alpha$ (yaw) and $\beta$ (pitch) using $\Delta x$ and $\Delta y$. Note that when we move the mouse to the right, we're moving clockwise with respect to the $+y$-axis, and when we move the mouse upward, we're moving counterclockwise with respect to the $+x$-axis. Therefore:

<div>$$
\begin{align*}
\alpha &:= \alpha - \Delta x \\
\beta &:= \beta + \Delta y
\end{align*}
$$</div>

Note that we also need the value of $\beta$ to be inside the range $-\deg{90} \leq \beta \leq \deg{90}$ to avoid looking backward.

Finally, to compute the value of $\mathbf{p}_{world}$, we need to transform $\mathbf{p}_{object}$ with $\mathbf{M}_{world \leftarrow object}$. Note that the value of $\mathbf{p}_{object} = \begin{bmatrix} 0 & 0 & -1 \end{bmatrix}^T$ is always the same. Therefore, the value of $\mathbf{p}_{world}$ is:

<div>$$
\begin{align*}
\mathbf{p}_{world} &= \mathbf{M}_{world \leftarrow object} \mathbf{p}_{object} \\
&= \begin{bmatrix}
\cos{\alpha} & \sin{\alpha}\sin{\beta} & \sin{\alpha}\cos{\beta} \\
0 & \cos{\beta} & -\sin{\beta} \\
-\sin{\alpha} & \cos{\alpha}\sin{\beta} & \cos{\alpha}\cos{\beta}
\end{bmatrix} \begin{bmatrix} 0 \\ 0 \\ -1 \end{bmatrix} \\
&= \begin{bmatrix}
-\sin{\alpha}\cos{\beta} \\
\sin{\beta} \\
-\cos{\alpha}\cos{\beta}
\end{bmatrix}
\end{align*}
$$</div>

{{< snippet file="static/code/opengl/fps.cpp" lang="cpp" />}}
