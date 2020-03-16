---
title: "First Person camera"
date: 2016-04-29 22:10:40
categories: ["camera", "euler angles"]
---

A first person camera captures objects from the viewpoint of a player's character, the camera has the following charateristics:

- orbit: the character can look to the left, right, up & down, however if we imagine the head of the character it can't be tilted
- translation: the charater can move in 4 directions, forward backward, to the left and to the right, note that the vector that represents the direction the character is looking at doesn't change (the orbit is not affected by translation)
  - our camera will always move in the same direction the camera is looking at, this is usually done differently on first person shooters where the character may move in a different direction than the direction the camera is looking at

Both characteristics can be implemented by creating a space for the camera and defining the direction in this space, that way translation doesn't modify the direction the camera is looking at and for orbit we would rotate the basis vectors of the space

Assuming that the world space axes are as follows

<figure>
  <div class="figure-images">
    <img src="/images/xyz.jpg" alt="">
  </div>
  <figcaption>Chosen world space \(+x\) (right), \(+y\) (up) and \(+z\) (backward), note that the choice is just personal preference</figcaption>
</figure>


Let $\mathbf{M}\_{upright \leftarrow camera}$ be the rotation matrix that transform points from *camera space* to *upright space*, also let the "look at" vector be defined as $\mathbf{p}\_{camera} = \begin{bmatrix} 0 & 0 & -1 \end{bmatrix}^T$ in *camera space*. To define the rotation matrix $\mathbf{M}\_{upright \leftarrow camera}$ let's first identify the euler angles involved in the rotation, taking the image above as a reference we can identify the following actions:

- the character looks to the left or right - rotation relative to the *upright space* $y$-axis
- the character looks up or down - rotation relative to the *upright space* $x$-axis

Note that the sequence of [intrinsic rotations](../../../transformation-matrices/rotation/euler-angles#intrinsic-rotations) $y-x'$ or $x-y$ if expressed as a sequence of *extrinsic rotations*) represents the rotation of the camera, the sequence of extrinsic rotations can be represented as a multiplication of the following rotation matrices

<div>
$$
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
$$
</div>

The angles $\alpha$ and $\beta$ are computed as follows:

- let $\Delta{\alpha}$ and $\Delta{\beta}$ represent the change in the rotation around the $\mathbf{Y}$ and $\mathbf{X}$ axis respectively, the values of $\alpha$ and $\beta$ are computed based on the previous state

<div>
$$
\beta := \beta + \Delta{\beta} \\
\alpha := \alpha + \Delta{\alpha}
$$
</div>

<span></span>

- if the character looks up then $\Delta{\beta}$ is positive
- if the character looks to the right then $\Delta{\alpha}$ is negative

## Mouse coordinates delta to extrinsic rotations delta

Next we need to define what happens when we move the mouse, we can configure a window manager like [GLFW](http://www.glfw.org/) to call a callback method whenever we move the mouse with the coordinates of the mouse as an argument (e.g. as $x_{new}$ and $y_{new}$), **Note: the coordinates of the mouse are expressed relative to the top left corner of the window whose $+x$-axis points right and $+y$-axis points down**, if we keep the old coordinates of the mouse (as $x_{old}$ and $y_{old}$) we can obtain how much the mouse moved with respect to the old position with the following calculation

<div>
$$
\begin{align*}
\Delta x &= x_{new} - x_{old} \\
\Delta y &= -(y_{new} - y_{old})
\end{align*}
$$
</div>

Note that $y_{new} - y_{old}$ will be positive if we move the mouse down which is unintuitive, therefore we can multiply this result by $-1$ so that moving the mouse downward sets a negative value in $\Delta y$

The next step is to update the values of $\alpha$ (yaw) and $\beta$ (pitch) using $\Delta x$ and $\Delta y$, note that when we move the mouse to the right we're moving clockwise with respect to the $+y$ axis and when we move the mouse upward we're moving counterclockwise with respect to the $+x$-axis therefore

<div>
$$
\alpha := \alpha - \Delta x \\
\beta := \beta + \Delta y
$$
</div>

Note that the we also need to value of $\beta$ to be inside the range $-\deg{90} \leq \beta \leq \deg{90}$ to avoid looking backwards

Finally to compute the value of $\mathbf{p}\_{world}$ we need to transform $\mathbf{p}\_{object}$ with $\mathbf{M}\_{world \leftarrow object}$, note that the value of $\mathbf{p}\_{object} = \begin{bmatrix} 0 & 0 & -1 \end{bmatrix}^T$ is always the same, therefore the value of $\mathbf{p}\_{world}$ is

<div>
$$
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
$$
</div>

{{< snippet file="static/code/opengl/fps.cpp" lang="cpp" />}}

