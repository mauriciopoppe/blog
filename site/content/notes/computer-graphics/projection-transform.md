---
title: "The Projection Transform"
date: 2016-02-14 12:18:26
summary: |
  Objects in a 3D scene reach the screen through projection. This article derives the orthographic and perspective projection matrices that map view-space points into the canonical view volume.
image: /images/projection-matrix!perspective-all.png
tags: ["computer graphics", "transformation matrix", "orthographic projection", "perspective projection", "3d", "2d"]
libraries: ["katex"]
math_terms: ["graphics"]
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
  - "Ahn, S. (2016). OpenGL Projection Matrix. [online] Songho.ca. Available at: http://www.songho.ca/opengl/gl_projectionmatrix.html [Accessed 7 Mar. 2016]."
aliases:
  - /notes/computer-graphics/viewing/projection-transform/
series: "computer-graphics-pipeline"
pipeline_stage: "projection"
---

The *canonical view volume* is a cube with corners at $[-1, -1, -1]$ and $[1, 1, 1]$. Coordinates in this cube are called *normalized device coordinates* (NDC). The projection step maps the region of the scene we want to render, the *view volume*, into this cube:

$$
\mathbf{v}\_{ndc} = \mathbf{M}\_{proj} \mathbf{v}\_{view}
$$

Points in *view space* that fall outside the view volume are discarded after the transformation. This process is called [clipping](https://www.opengl.org/wiki/Vertex_Post-Processing#Clipping): a point is discarded when any of its NDC coordinates lies outside $[-1, 1]$, which is why the canonical view volume matters.

The projection happens in two stages. The matrix maps *view space* to *clip space*, and a final division by the $w$-coordinate maps clip space to NDC:

$$
\mathbf{v}\_{clip} = \mathbf{M}\_{proj} \mathbf{v}\_{view}, \qquad \mathbf{v}\_{ndc} = \frac{\mathbf{v}\_{clip}}{w\_{clip}}
$$

For an orthographic projection the $w$-coordinate stays $1$ and the division is a no-op. For a perspective projection the division by $-z$ is what makes distant objects appear smaller, and the $w$-coordinate carries that division. The two cases are derived in the next sections.

## Orthographic Projection

An orthographic projection matrix is built with six parameters:

- *left, right*: planes in the $x$-axis
- *bottom, top*: planes in the $y$-axis
- *near, far*: planes in the $z$-axis

These parameters bound the view volume, which is an axis-aligned bounding box.

{{< figure src="/images/projection-matrix!orthographic.png" title="Orthographic Projection" >}}

The range $[l, r]$ maps linearly to $[-1, 1]$. Split the mapping in two: $g(x)$ normalizes the input range to $[0, 1]$, and $f(x)$ maps $[0, 1]$ to $[-1, 1]$:

$$
\begin{align*}
f(x) &= -1 + 2 \\; g(x) \\\\
g(x) &= \frac{x - l}{r - l}
\end{align*}
$$

Finally, $f(x)$ has the form:

$$
\begin{align*}
f(x) &= -1 + 2 \frac{x - l}{r - l} \\\\
&= \frac{l - r}{r - l} + \frac{2}{r - l}x - \frac{2l}{r - l} \\\\
&= \frac{2}{r - l}x + \frac{-l - r}{r - l} \\\\
&= \frac{2}{r - l}x - \frac{r + l}{r - l}
\end{align*}
$$

We can adapt the linear mapping to have a similar form for the y-coordinate using $t$ and $b$. These equations are transformations from *view space* to *clip space*:

$$
x\_{clip} = \frac{2}{r - l}x\_{view} - \frac{r + l}{r - l}
$$

$$
y\_{clip} = \frac{2}{t - b}y\_{view} - \frac{t + b}{t - b}
$$

The $z\_{clip}$ value will be different from the ones above since we're mapping $[-n, -f] \Rightarrow [-1, 1]$:

$$
\begin{align*}
z\_{clip} &= \frac{2}{-f - (-n)}z\_{view} - \frac{-f + (-n)}{-f - (-n)} \\\\
&= \frac{2}{-f + n}z\_{view} - \frac{-f - n}{-f + n} \\\\
&= -\frac{2}{f - n}z\_{view} + \frac{-f - n}{f - n} \\\\
&= -\frac{2}{f - n}z\_{view} - \frac{f + n}{f - n}
\end{align*}
$$

The $w$ is left untouched since the projection doesn't imply division. The **general orthographic projection matrix** is:

$$
\begin{equation*}
\mathbf{M}\_{proj} = \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\tfrac{r + l}{r - l} \\\\
0 & \tfrac{2}{t - b} & 0 & -\tfrac{t + b}{t - b} \\\\
0 & 0 & -\tfrac{2}{f - n} & -\tfrac{f + n}{f - n} \\\\
0 & 0 & 0 & 1
\end{bmatrix}
\end{equation*}
$$

Applied to a point in *view space*:

$$
\begin{align*}
\mathbf{v}\_{clip} &= \mathbf{M}\_{proj} \mathbf{v}\_{view} \\\\
\begin{bmatrix} x\_{clip} \\\\ y\_{clip} \\\\ z\_{clip} \\\\ w\_{clip} \end{bmatrix} &= \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\tfrac{r + l}{r - l} \\\\
0 & \tfrac{2}{t - b} & 0 & -\tfrac{t + b}{t - b} \\\\
0 & 0 & -\tfrac{2}{f - n} & -\tfrac{f + n}{f - n} \\\\
0 & 0 & 0 & 1
\end{bmatrix} \begin{bmatrix} x\_{view} \\\\ y\_{view} \\\\ z\_{view} \\\\ w\_{view} \end{bmatrix}
\end{align*}
$$

Since $w\_{clip} = w\_{view} = 1$, the division to NDC leaves the coordinates unchanged:

$$
\begin{bmatrix} x\_{ndc} \\\\ y\_{ndc} \\\\ z\_{ndc} \end{bmatrix} = \begin{bmatrix}
x\_{view}/1 \\\\
y\_{view}/1 \\\\
z\_{view}/1
\end{bmatrix}
$$

### Building the Matrix Using Combined Transformations

A simpler way to think about this orthographic projection transformation is by splitting it into three steps:

- Translation of the bottom-left-near corner to the origin, i.e., $[l, b, -n] \rightarrow [0, 0, 0]$.
- Scale it to be a 2-unit length cube.
- Translation of the bottom-left corner from the origin, i.e., $[0, 0, 0] \rightarrow [-1, -1, -1]$.

$$
\begin{align*}
\mathbf{M}\_{proj} &= \begin{bmatrix}
1 & 0 & 0 & -1 \\\\
0 & 1 & 0 & -1 \\\\
0 & 0 & 1 & -1 \\\\
0 & 0 & 0 & 1 \\\\
\end{bmatrix} \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & 0 \\\\
0 & \tfrac{2}{t - b} & 0 & 0 \\\\
0 & 0 & -\tfrac{2}{f - n} & 0 \\\\
0 & 0 & 0 & 1
\end{bmatrix} \begin{bmatrix}
1 & 0 & 0 & -l \\\\
0 & 1 & 0 & -b \\\\
0 & 0 & 1 & n \\\\
0 & 0 & 0 & 1 \\\\
\end{bmatrix} \\\\
&= \begin{bmatrix}
1 & 0 & 0 & -1 \\\\
0 & 1 & 0 & -1 \\\\
0 & 0 & 1 & -1 \\\\
0 & 0 & 0 & 1 \\\\
\end{bmatrix} \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\frac{2l}{r - l} \\\\
0 & \tfrac{2}{t - b} & 0 & -\frac{2b}{t - b} \\\\
0 & 0 & -\tfrac{2}{f - n} & -\frac{2n}{f - n} \\\\
0 & 0 & 0 & 1
\end{bmatrix} \\\\
&= \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\frac{2l}{r - l} - 1 \\\\
0 & \tfrac{2}{t - b} & 0 & -\frac{2b}{t - b} - 1 \\\\
0 & 0 & -\tfrac{2}{f - n} & -\frac{2n}{f - n} - 1 \\\\
0 & 0 & 0 & 1
\end{bmatrix} \\\\
&= \begin{bmatrix}
\tfrac{2}{r - l} & 0 & 0 & -\tfrac{r + l}{r - l} \\\\
0 & \tfrac{2}{t - b} & 0 & -\tfrac{t + b}{t - b} \\\\
0 & 0 & -\tfrac{2}{f - n} & -\tfrac{f + n}{f - n} \\\\
0 & 0 & 0 & 1
\end{bmatrix}
\end{align*}
$$

<div id="orthographic-projection-animation"></div>

## Perspective Projection

Perspective projection mimics how we perceive the world: objects farther from the point of view appear smaller. The effect comes from dividing by $-z$, and the division is carried by the $w$-coordinate. A point $(\alpha x, \alpha y, \alpha z, 1)$ in homogeneous coordinates represents $(x, y, z, \tfrac{1}{\alpha})$ after dividing by $w$, so the matrix can output $w = -z\_{view}$ and let the pipeline's division do the foreshortening.

A perspective projection matrix is built with six parameters: *left, right, bottom, top, near, far*.

- *left, right*: $x$-axis bounds for the near plane.
- *bottom, top*: $y$-axis bounds for the near plane.
- *near, far*: the $z$-positions of the near and far planes. The rays from the origin through the near-plane corners reach the far plane at the far corners of the view volume.

These parameters define a truncated pyramid, also called a [frustum](https://www.wikiwand.com/en/Frustum).

{{< figure src="/images/projection-matrix!perspective-all.png" title="Perspective Projection" >}}

### General Perspective Projection Matrix

The mapping of the range $[l,r]$ to the range $[-1,1]$ can be split into two steps:

- Project all the points to the *near* plane. This way, all the $x$- and $y$-coordinates will be inside the range $[l,r] \times [b,t]$.
- Map all the values in the range $[l,r]$ and $[b,t]$ to the range $[-1, 1]$.

<div class="tw-flex tw-flex-col tw-gap-4 md:tw-flex-row">
    <div class="md:tw-w-1/2">
        {{< figure src="/images/projection-matrix!top-view-frustum.png" title="Top view of the frustum">}}
    </div>
    <div class="md:tw-w-1/2">
        {{< figure src="/images/projection-matrix!side-view-frustum.png" title="Side view of the frustum">}}
    </div>
</div>

Let $\mathbf{v}\_{view}$ be a vector in *view space* which is going to be transformed to *clip space*. By similar triangles, we see that the value of $x\_p$ and $y\_p$ (the coordinates projected to the *near* plane) is:

$$
\begin{align*}
\frac{x\_p}{x\_{view}} &= \frac{-n}{z\_{view}} \quad \quad x\_p = \frac{n \cdot x\_{view}}{-z\_{view}} \\\\
\frac{y\_p}{y\_{view}} &= \frac{-n}{z\_{view}} \quad \quad y\_p = \frac{n \cdot y\_{view}}{-z\_{view}}
\end{align*}
$$

Note that both quantities are inversely proportional to $-z\_{view}$. What we can do is manipulate the coordinate so that it has a common denominator:

$$
\begin{bmatrix} \tfrac{n \cdot x\_{view}}{-z\_{view}} & \tfrac{n \cdot y\_{view}}{-z\_{view}} & n \tfrac{z\_{view}}{-z\_{view}} \end{bmatrix}^T = \frac{  \begin{bmatrix} n \cdot x\_{view} & n \cdot y\_{view} & n \cdot z\_{view} \end{bmatrix}^T }{-z\_{view}}
$$

The point in homogeneous coordinates is:

$$
\begin{bmatrix} n \cdot x\_{view} & n \cdot y\_{view} & n \cdot z\_{view}& \tfrac{1}{-z\_{view}}  \end{bmatrix}^T
$$

The pipeline then projects any homogeneous coordinate onto the $w = 1$ hyperplane by dividing each coordinate by $w$. This division, the perspective divide, is done later in the pipeline, not by the application.

We can take advantage of this process and use $-z\_{view}$ as our $w$. With this in mind, we can construct a transformation matrix so that transformed points have $w = -z\_{view}$:

$$
\begin{align*}
\begin{bmatrix} x\_{clip} \\\\ y\_{clip} \\\\ z\_{clip} \\\\ w\_{clip} \end{bmatrix} &= \begin{bmatrix}
. & . & . & . \\\\
. & . & . & . \\\\
. & . & . & . \\\\
0 & 0 & -1 & 0
\end{bmatrix} \begin{bmatrix} x\_{view} \\\\ y\_{view} \\\\ z\_{view} \\\\ w\_{view} \end{bmatrix} \\\\
\therefore w\_{clip} &= -z\_{view} 
\end{align*}
$$

Where $x\_{clip}, y\_{clip}, z\_{clip}, w\_{clip}$ are expressed in terms of the *clip space*. When each coordinate is divided by $w\_{clip}$, we'll have NDC:

$$
\begin{bmatrix} x\_{ndc} \\\\ y\_{ndc} \\\\ z\_{ndc} \end{bmatrix} = \begin{bmatrix} x\_{clip}/w\_{clip} \\\\ y\_{clip}/w\_{clip} \\\\ z\_{clip}/w\_{clip} \end{bmatrix}
$$

Next, $x\_p$ and $y\_p$ are mapped linearly to $[-1,1]$. We can reuse the linear mapping derived above:

$$
\begin{align*}
x\_{ndc} = \frac{2}{r - l}x\_p - \frac{r + l}{r - l} \\\\
y\_{ndc} = \frac{2}{t - b}y\_p - \frac{t + b}{t - b}
\end{align*}
$$

Next, we substitute $x\_p$ into $x\_{ndc}$:

$$
\begin{align*}
x\_{ndc} &= \frac{2}{r - l}\frac{n \cdot x\_{view}}{-z\_{view}} - \frac{r + l}{r - l} \\\\
&= \frac{2n}{r - l} \frac{x\_{view}}{-z\_{view}} - \frac{r + l}{r - l} \frac{-z\_{view}}{-z\_{view}} \\\\
&= \left (  \frac{2n}{r - l} x\_{view} + \frac{r + l}{r - l} z\_{view} \right ) \big / -z\_{view}
\end{align*}
$$

Note that the second fraction is manipulated so that it's also divisible by $-z\_{view}$. Also, note that the quantity in the parenthesis is in *clip space coordinates*: $x\_{clip}$.

$$
x\_{clip} = \frac{2n}{r - l} x\_{view} + \frac{r + l}{r - l} z\_{view}
$$

Similarly, the value of $y\_{clip}$ is:

$$
y\_{clip} = \frac{2n}{t - b} y\_{view} + \frac{t + b}{t - b} z\_{view}
$$

Combining the $w$ row with the $x_{clip}$ and $y_{clip}$ rows gives:

$$
\begin{equation*}
\begin{bmatrix} x\_{clip} \\\\ y\_{clip} \\\\ z\_{clip} \\\\ w\_{clip} \end{bmatrix} = \begin{bmatrix}
\tfrac{2n}{r - l} & 0 & \tfrac{r + l}{r - l} & 0 \\\\
0 & \tfrac{2n}{t - b} & \tfrac{t + b}{t - b} & 0 \\\\
. & . & . & . \\\\
0 & 0 & -1 & 0
\end{bmatrix} \begin{bmatrix} x\_{view} \\\\ y\_{view} \\\\ z\_{view} \\\\ w\_{view} \end{bmatrix}
\end{equation*}
$$

Next, we need to find the value of $z\_{clip}$. Note that the projected value is always a constant because the $z\_{clip}$ component depends on $z\_{view}$ and is also divided by $-z\_{view}$. We need **$z\_{clip}$ to be unique for the clipping and depth test**. Plus, we should be able to unproject it (through an inverse transformation).

Since $z\_{ndc}$ doesn't depend on $x\_{view}$ or $y\_{view}$, we can borrow the $w$-coordinate to find the relationship between $z\_{ndc}$ and $z\_{view}$. With that in mind, we can make the third row of the matrix equal to:

$$
\begin{equation*}
\begin{bmatrix} x\_{clip} \\\\ y\_{clip} \\\\ z\_{clip} \\\\ w\_{clip} \end{bmatrix} = \begin{bmatrix}
\tfrac{2n}{r - l} & 0 & \tfrac{r + l}{r - l} & 0 \\\\
0 & \tfrac{2n}{t - b} & \tfrac{t + b}{t - b} & 0 \\\\
0 & 0 & A & B \\\\
0 & 0 & -1 & 0
\end{bmatrix} \begin{bmatrix} x\_{view} \\\\ y\_{view} \\\\ z\_{view} \\\\ w\_{view} \end{bmatrix}
\end{equation*}
$$

Then $z\_{ndc}$ has the form:

$$
z\_{ndc} = \frac{z\_{clip}}{w\_{clip}} = \frac{Az\_{view} + Bw\_{view}}{-z\_{view}}
$$

Since $w\_{view}=1$ in *view space*:

$$
z\_{ndc} = \frac{Az\_{view} + B}{-z\_{view}}
$$

Note that the value is not linear, but it needs to be mapped to $[-n, -f] \mapsto [-1,1]$. Substituting the desired output range $[-1, 1]$ as $z\_{ndc}$, we have a system of equations:

$$
\begin{cases}
-1 &= \frac{-An + B}{n} \\\\
1 &= \frac{-Af + B}{f}
\end{cases} \rightarrow
\begin{cases}
-An + B &= -n \\\\
-Af + B &= f
\end{cases}
$$

Subtracting the second equation from the first:

$$
\begin{align*}
-An + B + Af - B &= -n - f \\\\
A (f - n) &= -n - f \\\\
A = -\frac{f + n}{f - n}
\end{align*}
$$

Solving for $B$ given $A$:

$$
\frac{f + n}{f - n}n + B = -n
$$

$$
\begin{align*}
B &= -n - \frac{f + n}{f - n}n \\\\
&= \frac{-fn + n^2 - fn - n^2}{f - n} \\\\
&= \frac{-2fn}{f - n} \\\\
\end{align*}
$$

Substituting the values of $A$ and $B$, we have the **general perspective projection matrix**:

$$
\begin{equation*}
\mathbf{M}\_{proj} = \begin{bmatrix}
\tfrac{2n}{r - l} & 0 & \tfrac{r + l}{r - l} & 0 \\\\
0 & \tfrac{2n}{t - b} & \tfrac{t + b}{t - b} & 0 \\\\
0 & 0 & -\tfrac{f + n}{f - n} & \tfrac{-2fn}{f - n} \\\\
0 & 0 & -1 & 0
\end{bmatrix}
\end{equation*}
$$

### Symmetric Perspective Projection Matrix

If the viewing volume is symmetric, i.e., $r = -l$ and $t = -b$, then some quantities can be simplified:

$$
\begin{aligned}
r + l = 0, \quad r - l = 2r \\\\
t + b = 0, \quad t - b = 2t
\end{aligned}
$$

Then the symmetric matrix becomes:

$$
\begin{equation*}
\mathbf{M}\_{proj} = \begin{bmatrix}
\tfrac{n}{r} & 0 & 0 & 0 \\\\
0 & \tfrac{n}{t} & 0 & 0 \\\\
0 & 0 & -\tfrac{f + n}{f - n} & \tfrac{-2fn}{f - n} \\\\
0 & 0 & -1 & 0
\end{bmatrix}
\end{equation*}
$$

### Symmetric Perspective Projection Matrix from Field of View/Aspect

[ `gluPerspective`](https://www.opengl.org/sdk/docs/man2/xhtml/gluPerspective.xml) receives, instead of the $x$ and $y$ bounds, two arguments:

- *field of view* ($fov$), which specifies the field of view angle in the $y$ direction.
- *aspect* ($aspect$), which is the aspect ratio that determines the field of view in the $x$ direction, calculated as $\tfrac{x}{y}$. The value is commonly $\tfrac{screen\ width}{screen\ height}$.

{{< figure src="/images/projection-matrix!fov.png" title="fov" class="md:tw-w-1/2 tw-mx-auto" >}}

We see that the value of $t$ (top) is:

$$
\begin{align*}
\tan{ (fov/2) } &= \frac{t}{n} \\\\
t &= n \cdot \tan{ (fov/2) }
\end{align*}
$$

We can find the value of $r$ (right) with the aspect ratio:

$$
\begin{align*}
aspect &= \frac{2r}{2t} = \frac{r}{t} \\\\
r &= aspect \cdot t \\\\
&= aspect \cdot n \cdot \tan{(fov/2)}
\end{align*}
$$

Substituting the expressions for $t$ and $r$ into the symmetric matrix:

$$
\begin{equation*}
\mathbf{M}\_{proj} = \begin{bmatrix}
\tfrac{1}{aspect \cdot \tan{ (fov/2) } } & 0 & 0 & 0 \\\\
0 & \frac{1}{\tan{ (fov/2) }} & 0 & 0 \\\\
0 & 0 & -\tfrac{f + n}{f - n} & \tfrac{-2fn}{f - n} \\\\
0 & 0 & -1 & 0
\end{bmatrix}
\end{equation*}
$$

<div id="perspective-projection-animation"></div>

<script type="module" src="/js/computer-graphics/projection.js"></script>
