---
title: "Transformation matrix to transform objects from NDC coordinates to screen coordinates (viewport transform)"
description: |
  One matrix transformation in the 3D to a 2D transformation pipeline is the viewport transform
  where objects are transformed from normalized device coordinates (NDC) to screen coordinates (SC).

  <br />
  In short it's the transformation of numbers in the range [-1, 1] to numbers corresponding to pixels
  on the screen, which is a linear mapping computed with linear interpolation.

  <br />
  In this article I cover the math behind the generation of the viewport transformation matrix.
image: /images/rendering!pixel-coordinates.jpg
tags: ["computer graphics", "transformation matrix", "viewport transform", "3d", "2d"]
date: 2016-03-08 22:20:58
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
---

The objective of this step is to find a transformation matrix to transform points expressed in *normalized device coordinates* to *screen coordinates*

<div>$$
\mathbf{v}_{screen} = \mathbf{M}_{vp} \mathbf{v}_{ndc}
$$</div>

The  *canonical view volume* needs to be mapped to the screen that has $n_x \times n_y$ pixels in a way so that points with $x = -1, x = 1$ are mapped to the left and right sides of the screen respectively and $y = -1, y = 1$ are mapped to the bottom and top sides of the screen respectively, the $z$ coordinate isn't visible in a 2D image so it can be discarded for the mapping

Since the mapping is linear we can use the [linear interpolation method](https://www.wikiwand.com/en/Linear_interpolation)

<div>$$
f(x) = out_{lo} + (out_{hi} - out_{lo}) \frac{x - in_{lo}}{ in_{hi} - in_{lo} }
$$</div>

Given

- $out_{lo} = -0.5$
- $out_{hi} = n_x - 0.5$
- $in_{lo} = -1$
- $in_{hi} = 1$

The value of $x_{screen}$ is

<div>$$
\begin{align*}
x_{screen} &= -0.5 + n_x \frac{x_{ndc} + 1}{2} \\
&= -\frac{1}{2} + \frac{n_x}{2}x_{ndc} + \frac{n_x}{2} \\
&= \frac{n_x}{2}x_{ndc} + \frac{n_x - 1}{2}
\end{align*}
$$</div>

The value of $y_{screen}$ is found in a similar way

<div>$$
y_{screen} = \frac{n_y}{2}y_{ndc} + \frac{n_y - 1}{2}
$$</div>

Finally the transformation matrix that converts points from NDC to screen coordinates is

<div>$$
\mathbf{M}_{vp} = \begin{bmatrix}
\frac{n_x}{2} & 0 & 0 & \frac{n_x - 1}{2} \\
0 & \frac{n_y}{2} & 0 &\frac{n_y - 1}{2} \\
0 & 0 & 1 & 0 \\
0 & 0 & 0 & 1
\end{bmatrix}
$$</div>

Note that the $z$-coordinate doesn't need to be modified since it doesn't affect the projection in the image, the $z$-coordinate is still used to check the order in which objects should be drawn

