---
title: "Transformation matrix for projection of 3D objects into a 2D plane"
date: 2016-02-14 12:18:26
description: |
  In Computer Graphics 3D objects created in an abstract 3d world will eventually
  need to be displayed, to view these objects in a 2d plane like a screen
  objects will need to be projected from the 3D space to the 2D plane with
  a transformation matrix.

  <br />
  In this article I cover two types of transformations: Orthographic projection
  and Perspective projection and analyze the matrix behind the
  transformation matrices for both transformations.
image: /images/projection-matrix!perspective-all.png
tags: ["computer graphics", "transformation matrix", "orthographic projection", "perspective projection", "3d", "2d"]
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
  - "Ahn, S. (2016). OpenGL Projection Matrix. [online] Songho.ca. Available at: http://www.songho.ca/opengl/gl_projectionmatrix.html [Accessed 7 Mar. 2016]."
---

The *canonical view volume* is a cube with its extreme points at $[-1, -1, -1]$ and $[1, 1, 1]$, coordinates in this view volume are called *normalized device coordinates* (NDC), the objective of this step is to build a transformation matrix so that a region of space we want to render called the *view volume* is mapped to the *canonical view volume*

<div>$$
\mathbf{v}_{ndc} = \mathbf{M}_{proj} \mathbf{v}_{view}
$$</div>

Some points expressed in *view space* won't be part of the view volume and will be discarded after the transformation, this process is called [clipping](https://www.opengl.org/wiki/Vertex_Post-Processing#Clipping) (we only need to check if any coordinate of a point is outside the range $[-1, 1]$ to discard it)

Later it'll be seen that both transformations imply division and a neat trick is the use of projective geometry to avoid division, any point that has the form $(\alpha x, \alpha y, \alpha z, 1)$ can be represented as $(x, y, z, \tfrac{1}{\alpha})$ in homogeneous coordinates, so we can introduce an intermediate step which transforms the points to *clip coordinates* and then to *normalized device coordinates* by doing a division with the $w$-coordinate $\tfrac{1}{1/\alpha} = \alpha$

<div>$$
\begin{align*}
\mathbf{v}_{clip} = \mathbf{M}_{proj} \mathbf{v}_{view} \\
\mathbf{v}_{ndc} = \alpha \mathbf{v}_{clip}
\end{align*}
$$</div>

## Orthographic projection

An orthographic projection matrix is built with 6 parameters

- *left, right*: planes in the $x$-axis
- *bottom, top*: planes in the $y$-axis
- *near, far*: planes in the $z$-axis

These parameters bound the view volume which is an axis-aligned bounding box

{{< figure src="/images/projection-matrix!orthographic.png" title="Ortographic Projection" >}}

Since the mapping of the range $[l, r]$ to the range $[-1, 1]$ is linear we can use the equation of the line $y = mx + b$ and find the values of $m$ and $b$ however we can intuitively get a similar equation by creating a function $f(x)$ so that $f(0) = -1$ and $f(1) = 1$, we can create a nested function $g(x)$ so that $g(l) = 0$ and $g(r) = 1$ (note that $[l, r]$ is the input range) then $f(x)$ has the form

<div>$$
f(x) = -1 + 2 \; g(x)
$$</div>

If $x \in [a, b], g(x) \in [0, 1]$ then its value is

<div>$$
g(x) = \frac{x - l}{r - l}
$$</div>

Finally $f(x)$ has the form

<div>$$
\begin{align}
f(x) &= -1 + 2 \frac{x - l}{r - l} \nonumber \\
&= \frac{l - r}{r - l} + \frac{2}{r - l}x - \frac{2l}{r - l} \nonumber \\
&= \frac{2}{r - l}x + \frac{-l - r}{r - l} \nonumber \\
&= \frac{2}{r - l}x - \frac{r + l}{r - l} \label{linear-mapping}
\end{align}
$$</div>

Using \eqref{linear-mapping} to transform the $x$- and $y$-coordinates of a vector expressed in *view space* to *clip space*

<div>$$
x_{clip} = \frac{2}{r - l}x_{view} - \frac{r + l}{r - l}
$$</div>

<div>$$
y_{clip} = \frac{2}{t - b}y_{view} - \frac{t + b}{t - b}
$$</div>

The $z_c$ value will be different from the ones above since we're mapping $[-n, -f] \Rightarrow [-1, 1]$

<div>$$
\begin{align*}
z_{clip} &= \frac{2}{-f - (-n)}z_{view} - \frac{-f + (-n)}{-f - (-n)} \\
&= \frac{2}{-f + n}z_{view} - \frac{-f - n}{-f + n} \\
&= -\frac{2}{f - n}z_{view} + \frac{-f - n}{f - n} \\
&= -\frac{2}{f - n}z_{view} - \frac{f + n}{f - n}
\end{align*}
$$</div>

The $w$ is left untouched since the projection doesn't imply division, the **general orthographic projection matrix** is

<div>$$
\begin{equation} \label{orthographic-projection}
\mathbf{M}_{proj} = \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\tfrac{r + l}{r - l} \\
0 & \tfrac{2}{t - b} & 0 & -\tfrac{t + b}{t - b} \\
0 & 0 & -\tfrac{2}{f - n} & -\tfrac{f + n}{f - n} \\
0 & 0 & 0 & 1
\end{bmatrix}
\end{equation}
$$</div>

The transformation matrix from *view space* to *clip space* is

<div>$$
\begin{align*}
\mathbf{v}_{clip} &= \mathbf{M}_{proj} \mathbf{v}_{view} \\
\begin{bmatrix} x_{clip} \\ y_{clip} \\ z_{clip} \\ w_{clip} \end{bmatrix} &= \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\tfrac{r + l}{r - l} \\
0 & \tfrac{2}{t - b} & 0 & -\tfrac{t + b}{t - b} \\
0 & 0 & -\tfrac{2}{f - n} & -\tfrac{f + n}{f - n} \\
0 & 0 & 0 & 1
\end{bmatrix} \begin{bmatrix} x_{view} \\ y_{view} \\ z_{view} \\ w_{view} \end{bmatrix}
\end{align*}
$$</div>

Finally note that $w_{clip}$ will always have the value of $w_{view} = 1$, therefore the transformation to NDC will not modify the coordinates

<div>$$
\begin{bmatrix} x_{ndc} \\ y_{ndc} \\ z_{ndc} \end{bmatrix} = \begin{bmatrix}
x_{view}/1 \\
y_{view}/1 \\
z_{view}/1
\end{bmatrix}
$$</div>

### Building the matrix using combined transformations

A simpler way to think about this orthographic projection transformation is by splitting it in three steps

- translation of the bottom left near corner to the origin i.e. $[l, b, -n] \rightarrow [0, 0, 0]$
- scale it to be a 2-unit length cube
- translation of the bottom left corner from the origin i.e. $[0, 0, 0] \rightarrow [-1, -1, -1]$

<div>$$
\begin{align*}
\mathbf{M}_{proj} &= \begin{bmatrix}
1 & 0 & 0 & -1 \\
0 & 1 & 0 & -1 \\
0 & 0 & 1 & -1 \\
0 & 0 & 0 & 1 \\
\end{bmatrix} \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & 0 \\
0 & \tfrac{2}{t - b} & 0 & 0 \\
0 & 0 & -\tfrac{2}{f - n} & 0 \\
0 & 0 & 0 & 1
\end{bmatrix} \begin{bmatrix}
1 & 0 & 0 & -l \\
0 & 1 & 0 & -b \\
0 & 0 & 1 & n \\
0 & 0 & 0 & 1 \\
\end{bmatrix} \\
\
&= \begin{bmatrix}
1 & 0 & 0 & -1 \\
0 & 1 & 0 & -1 \\
0 & 0 & 1 & -1 \\
0 & 0 & 0 & 1 \\
\end{bmatrix} \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\frac{2l}{r - l} \\
0 & \tfrac{2}{t - b} & 0 & -\frac{2b}{t - b} \\
0 & 0 & -\tfrac{2}{f - n} & -\frac{2n}{f - n} \\
0 & 0 & 0 & 1
\end{bmatrix} \\
\
&= \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\frac{2l}{r - l} - 1 \\
0 & \tfrac{2}{t - b} & 0 & -\frac{2b}{t - b} - 1 \\
0 & 0 & -\tfrac{2}{f - n} & -\frac{2n}{f - n} - 1 \\
0 & 0 & 0 & 1
\end{bmatrix} \\
\
&= \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\tfrac{r + l}{r - l} \\
0 & \tfrac{2}{t - b} & 0 & -\tfrac{t + b}{t - b} \\
0 & 0 & -\tfrac{2}{f - n} & -\tfrac{f + n}{f - n} \\
0 & 0 & 0 & 1
\end{bmatrix}
\
\end{align*}
$$</div>

## Perspective projection

Projective geometry concepts are used in this type of projection, particularly the fact that objects away from the point of view appear smaller after projection, this type of projection mimics how we perceive objects in reality

A perspective projection matrix is built with 6 parameters, *left, right, bottom, top, near, far*

- *left, right*: $x$-axis bounds for the near plane
- *bottom, top*: $y$-axis bounds for the near plane
- *near, far*: planes in the $z$-axis, the interception point of the line passing through the origin parallel to the vector $[l,b,-n]$ and the plane *far* is the bottom left far extreme of the view volume, a similar logic is used to find all the extremes in the *far* plane of the view volume

These parameters define a truncated pyramid also called a [ frustum ](https://www.wikiwand.com/en/Frustum)

{{< figure src="/images/projection-matrix!perspective-all.png" title="Perspective projection" >}}

### General perspective projection matrix

The mapping of the range $[l,r]$ to the range $[-1,1]$ can be split into two steps

- Project all the points to the *near* plane, this way all the $x$- and $y$-coordinates will be inside the range $[l,r] \times [b,t]$
- Map all the values in the range $[l,r]$ and $[b,t]$ to the range $[-1, 1]$

<div class="columns">
    <div class="column">
        {{< figure src="/images/projection-matrix!top-view-frustum.png" title="Top view of the frustum">}}
    </div>
    <div class="column">
        {{< figure src="/images/projection-matrix!side-view-frustum.png" title="Side view of the frustum">}}
    </div>
</div>

Let $\mathbf{v}_{view}$ be a vector in *view space* which is going to be transformed to *clip space*, by similar triangles we see that the value of $x_p$ and $y_p$ (the coordinates projected to the *near* plane) is

<div>$$
\begin{align}
\label{projection-near}
\frac{x_p}{x_{view}} &= \frac{-n}{z_{view}} \quad \quad x_p = \frac{n \cdot x_{view}}{-z_{view}} \\
\frac{y_p}{y_{view}} &= \frac{-n}{z_{view}} \quad \quad y_p = \frac{n \cdot y_{view}}{-z_{view}}
\end{align}
$$</div>

Note that both quantities are inversely proportional to $-z_{view}$, what we can do is manipulate the coordinate so that it has a common denominator

<div>$$
\begin{bmatrix} \tfrac{n \cdot x_{view}}{-z_{view}} & \tfrac{n \cdot y_{view}}{-z_{view}} & n \tfrac{z_{view}}{-z_{view}} \end{bmatrix}^T = \frac{  \begin{bmatrix} n \cdot x_{view} & n \cdot y_{view} & n \cdot z_{view} \end{bmatrix}^T }{-z_{view}}
$$</div>

The point in homogeneous coordinates is

<div>$$
\begin{bmatrix} n \cdot x_{view} & n \cdot y_{view} & n \cdot z_{view}& \tfrac{1}{-z_{view}}  \end{bmatrix}^T
$$</div>

OpenGL will then project any 4D homogeneous coordinate to the 3D hyperplane $w=1$ by dividing each of the coordinates by $w$, note that this division operation isn't done by the application but by OpenGL itself on a further step on the rendering pipeline

We can take advantage of this process and use $-z_{view}$ as our $w$, with this in mind we can construct a transformation matrix so that transformed points have $w = -z_{view}$

<div>$$
\begin{align}
\begin{bmatrix} x_{clip} \\ y_{clip} \\ z_{clip} \\ w_{clip} \end{bmatrix} &= \begin{bmatrix}
. & . & . & . \\
. & . & . & . \\
. & . & . & . \\
0 & 0 & -1 & 0
\end{bmatrix} \begin{bmatrix} x_{view} \\ y_{view} \\ z_{view} \\ w_{view} \end{bmatrix} \label{pm1} \\
\therefore w_{clip} &= -z_{view}  \nonumber
\end{align}
$$</div>

Where $x_{clip}, y_{clip}, z_{clip}, w_{clip}$ are expressed in terms of the *clip space*, when each coordinate is divided by $w_{clip}$ we'll have NDC

<div>$$
\begin{bmatrix} x_{ndc} \\ y_{ndc} \\ z_{ndc} \end{bmatrix} = \begin{bmatrix} x_{clip}/w_{clip} \\ y_{clip}/w_{clip} \\ z_{clip}/w_{clip} \end{bmatrix}
$$</div>

Next $x_p$ and $y_p$ are mapped linearly to $[-1,1]$, we can use the function to perform linear mapping \eqref{linear-mapping}

<div>$$
\begin{align}
x_{ndc} = \frac{2}{r - l}x_p - \frac{r + l}{r - l} \nonumber \\
y_{ndc} = \frac{2}{t - b}y_p - \frac{t + b}{t - b} \label{ndc-near}
\end{align}
$$</div>

Next we substitute the values of $x_p$ \eqref{projection-near} in $x_{ndc}$ \eqref{ndc-near}

<div>$$
\begin{align*}
x_{ndc} &= \frac{2}{r - l}\frac{n \cdot x_{view}}{-z_{view}} - \frac{r + l}{r - l} \\
&= \frac{2n}{r - l} \frac{x_{view}}{-z_{view}} - \frac{r + l}{r - l} \frac{-z_{view}}{-z_{view}} \\
&= \left (  \frac{2n}{r - l} x_{view} + \frac{r + l}{r - l} z_{view} \right ) \big / -z_{view}
\end{align*}
$$</div>

Note that the second fraction is manipulated so that it's also divisible by $-z_{view}$, also note that the quantity in the parenthesis is in *clip space coordinates*: $x_{clip}$

<div>$$
x_{clip} = \frac{2n}{r - l} x_{view} + \frac{r + l}{r - l} z_{view}
$$</div>

Similarly the value of $y_{clip}$ is

<div>$$
y_{clip} = \frac{2n}{t - b} y_{view} + \frac{t + b}{t - b} z_{view}
$$</div>

Then the transformation matrix seen in \eqref{pm1} is now

<div>$$
\begin{equation} \label{pm2}
\begin{bmatrix} x_{clip} \\ y_{clip} \\ z_{clip} \\ w_{clip} \end{bmatrix} = \begin{bmatrix}
\tfrac{2n}{r - l} & 0 & \tfrac{r + l}{r - l} & 0 \\
0 & \tfrac{2n}{t - b} & \tfrac{t + b}{t - b} & 0 \\
. & . & . & . \\
0 & 0 & -1 & 0
\end{bmatrix} \begin{bmatrix} x_{view} \\ y_{view} \\ z_{view} \\ w_{view} \end{bmatrix}
\end{equation}
$$</div>

Next we need to find the value of $z_{clip}$, note that the projected value is always a constant because the $z_{clip}$ component depends on $z_{view}$ and is also divided by $-z_{view}$, we need **$z_{clip}$ to be unique for the clipping and depth test**, plus we should be able to unproject it (through an inverse transformation)

Since $z_{ndc}$ doesn't depend on $x_{view}$ or $y_{view}$ we can borrow the $w$-coordinate to find the relationship between $z_{ndc}$ and $z_{view}$, with that in mind we can make the third row of \eqref{pm2} equal to

<div>$$
\begin{equation} \label{pm3}
\begin{bmatrix} x_{clip} \\ y_{clip} \\ z_{clip} \\ w_{clip} \end{bmatrix} = \begin{bmatrix}
\tfrac{2n}{r - l} & 0 & \tfrac{r + l}{r - l} & 0 \\
0 & \tfrac{2n}{t - b} & \tfrac{t + b}{t - b} & 0 \\
0 & 0 & A & B \\
0 & 0 & -1 & 0
\end{bmatrix} \begin{bmatrix} x_{view} \\ y_{view} \\ z_{view} \\ w_{view} \end{bmatrix}
\end{equation}
$$</div>

Then $z_{ndc}$ has the form

<div>$$
z_{ndc} = \frac{z_{clip}}{w_{clip}} = \frac{Az_{view} + Bw_{view}}{-z_{view}}
$$</div>

Since $w_{view}=1$ in *view space*

<div>$$
z_{ndc} = \frac{Az_{view} + B}{-z_{view}}
$$</div>

Note that the value is not linear but it needs to be mapped to $[-n, -f] \mapsto [-1,1]$, substituting the desired output range $[-1, 1]$ as $z_{ndc}$ we have a system of equations

<div>$$
\begin{cases}
-1 &= \frac{-An + B}{n} \\
1 &= \frac{-Af + B}{f}
\end{cases} \rightarrow
\begin{cases}
-An + B &= -n \\
-Af + B &= f
\end{cases}
$$</div>

Subtracting the second equation from the first

<div>$$
\begin{align*}
-An + B + Af - B &= -n - f \\
A (f - n) &= -n - f \\
A = -\frac{f + n}{f - n}
\end{align*}
$$</div>

Solving for $B$ given $A$

<div>$$
\frac{f + n}{f - n}n + B = -n
$$</div>

<div>$$
\begin{align*}
B &= -n - \frac{f + n}{f - n}n \\
&= \frac{-fn + n^2 - fn - n^2}{f - n} \\
&= \frac{-2fn}{f - n} \\
\end{align*}
$$</div>

Substituting the values of $A$ and $B$ in \eqref{pm3} we have the **general perspective projection matrix**

<div>$$
\begin{equation} \label{pm4}
\mathbf{M}_{proj} = \begin{bmatrix}
\tfrac{2n}{r - l} & 0 & \tfrac{r + l}{r - l} & 0 \\
0 & \tfrac{2n}{t - b} & \tfrac{t + b}{t - b} & 0 \\
0 & 0 & -\tfrac{f + n}{f - n} & \tfrac{-2fn}{f - n} \\
0 & 0 & -1 & 0
\end{bmatrix}
\end{equation}
$$</div>

### Symmetric perspective projection matrix

If the viewing volume is symmetric i.e. $r = -l$ and $t = -b$ then some quantities can be simplified

<div>$$
r + l = 0, \quad r - l = 2r \\
t + b = 0, \quad t - b = 2t
$$</div>

Then \eqref{pm4} becomes

<div>$$
\begin{equation} \label{pm5}
\mathbf{M}_{proj} = \begin{bmatrix}
\tfrac{n}{r} & 0 & 0 & 0 \\
0 & \tfrac{n}{t} & 0 & 0 \\
0 & 0 & -\tfrac{f + n}{f - n} & \tfrac{-2fn}{f - n} \\
0 & 0 & -1 & 0
\end{bmatrix}
\end{equation}
$$</div>

### Symmetric perspective projection matrix from field of view/aspect

[ `gluPerspective` ](https://www.opengl.org/sdk/docs/man2/xhtml/gluPerspective.xml) receives instead of the $x$ and $y$ bounds two arguments

- *field of view* ($fov$) which specifies the field of view angle in the $y$ direction
- *aspect* ($aspect$) which is the aspect ratio that determines the field of view in the $x$ direction calculated as $\tfrac{x}{y}$, the value is commonly $\tfrac{screen \; width}{screen \; height}$

{{< figure src="/images/projection-matrix!fov.png" title="fov" >}}

We see that the value of $t$ (top) is

<div>$$
\begin{align}
\tan{ (fov/2) } &= \frac{t}{n} \\
 \label{fov-t}
t &= n \cdot \tan{ (fov/2) }
\end{align}
$$</div>

We can find the value of $r$ (right) with the aspect ratio

<div>$$
\begin{align}
aspect &= \frac{2r}{2t} = \frac{r}{t} \\
r &= aspect \cdot t \\
 \label{fov-r}
&= aspect \cdot n \cdot \tan{(fov/2)}
\end{align}
$$</div>

Substituting \eqref{fov-t} and \eqref{fov-r} in \eqref{pm5}

<div>$$
\begin{equation} \label{pm6}
\mathbf{M}_{proj} = \begin{bmatrix}
\tfrac{1}{aspect \cdot \tan{ (fov/2) } } & 0 & 0 & 0 \\
0 & \frac{1}{\tan{ (fov/2) }} & 0 & 0 \\
0 & 0 & -\tfrac{f + n}{f - n} & \tfrac{-2fn}{f - n} \\
0 & 0 & -1 & 0
\end{bmatrix}
\end{equation}
$$</div>

