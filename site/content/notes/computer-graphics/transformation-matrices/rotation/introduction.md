---
title: "Introduction to rotation for computer graphics"
date: 2015-12-15 13:00:00
description: |
  The basics of rotation in 2d and 3d for computer graphics with a focus on 3d rotation about
  cardinal axes and 3d rotation with quaternions.

  <br />

  For quaternions, please also look at [https://eater.net/quaternions](https://eater.net/quaternions) amazing animations!
image: /images/flat-shading.svg
libraries: ["function-plot"]
tags: ["rotation", "quaternions", "2d", "3d", "computer graphics"]
references:
 - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
 - "Vince, J. (2011). Quaternions for computer graphics. London: Springer."
 - "Shoemake, K. (2016). Quaternions [online] Cs.ucr.edu. Available at: http://www.cs.ucr.edu/~vbz/resources/quatut.pdf [Accessed 7 Mar. 2016]."
---

## 2d rotation

A 2d rotation has only one parameter $\theta$, when the basis vectors $\unit{i} = [1, 0]$ and $\unit{j} = [0, 1]$ are rotated by an angle $\theta$

<div>$$
\mbold{p} = \cos{\theta} \unit{i} + \sin{\theta} \unit{j} \\
\mbold{q} = -\sin{\theta} \unit{i} + \cos{\theta} \unit{j}
$$</div>

<div id="two-dimensions"></div>

Which builds the rotation matrix

<div>$$
\mbold{R}(\theta) = \begin{bmatrix}
\textbf{p} \\
\textbf{q}
\end{bmatrix} = \begin{bmatrix}
\cos{\theta} & \sin{\theta} \\
-\sin{\theta} & \cos{\theta}
\end{bmatrix}
$$</div>

When a vector $\mbold{v}$ is transformed by this matrix we know that the vector will be a *linear combination of the basis*  which are $\mbold{p}$ and $\mbold{q}$

<div>$$
\begin{align*}
\mbold{v'} = \mbold{vR}(\theta) &= v_x \mbold{p} + v_y \mbold{q} \\
&= v_x \begin{bmatrix}\cos{\theta} & \sin{\theta}\end{bmatrix} + v_y \begin{bmatrix}-\sin{\theta} & \cos{\theta}\end{bmatrix} \\
&= \begin{bmatrix}
v_x \cos{\theta} - v_y \sin{\theta} \\
v_x \sin{\theta} + v_y \cos{\theta}
\end{bmatrix}^T
\end{align*}
$$</div>

Using a matrix to encode this operation

<div>$$
\begin{align*}
\mbold{v'} = \mbold{vR}(\theta) &= \begin{bmatrix}v_x & v_y\end{bmatrix} \begin{bmatrix}
\cos{\theta} & \sin{\theta} \\
-\sin{\theta} & \cos{\theta}
\end{bmatrix} \\
&= \begin{bmatrix}
v_x \cos{\theta} - v_y \sin{\theta} \\
v_x \sin{\theta} + v_y \cos{\theta}
\end{bmatrix}^T
\end{align*}
$$</div>

See also [complex numbers](../../math/numeral-systems/complex-numbers.html)

## 3d rotation

### About cardinal axes

<div>$$
\mathbf{R_x}(\alpha) = \begin{bmatrix}
1 & 0 & 0 \\
0 & \cos{\alpha} & -\sin{\alpha} \\
0 & \sin{\alpha} & \cos{\alpha}
\end{bmatrix}
$$</div>

<div>$$
\mathbf{R_y}(\beta) = \begin{bmatrix}
\cos{\beta} & 0 & \sin{\beta} \\
0 & 1 & 0 \\
-\sin{\beta} & 0 & \cos{\beta}
\end{bmatrix}
$$</div>

<div>$$
\mathbf{R_z}(\gamma) = \begin{bmatrix}
\cos{\gamma} & -\sin{\gamma} & 0 \\
\sin{\gamma} & \cos{\gamma} & 0 \\
0 & 0 & 1
\end{bmatrix}
$$</div>


See also

- [3d rotation on wikipedia.org](http://www.wikiwand.com/en/Rotation_matrix#/In_three_dimensions)
- [3d rotation - siggraph.org](https://www.siggraph.org/education/materials/HyperGraph/modeling/mod_tran/3drota.htm)

### About an arbitrary axis

Given an axis $\unit{n}$ and an amount of rotation around it $\theta$ our goal is to find a rotation matrix that rotates about $\unit{n}$ by th angle $\theta$

<div>$$
\mathbf{v'} = \mathbf{R}(\unit{n}, \theta)\mathbf{v}
$$</div>

The basic idea is to solve this problem in a plane perpendicular to $\unit{n}$ which becomes a 2d problem

Separate $\mbold{v}$ in two vectors, a vector parallel to $\unit{v}$ called $\mbold{v_{\parallel}}$ and a vector perpendicular to $\unit{v}$ called $\mbold{v_{\perp}}$ such that $\mbold{v_{\parallel}} + \mbold{v_{\perp}} = \mbold{v}$

<div>$$
\begin{align*}
\mbold{v_{\parallel}} &= (\mbold{v} \cdot \unit{n}) \unit{n} \\
\mbold{v_{\perp}} &= \mbold{v} - \mbold{v_{\parallel}}
\end{align*}
$$</div>

After the rotation it's obvious that the $\mbold{v_{\parallel}}$ component will be the same and only the vector $\mbold{v_{\perp}}$ will be rotated

A plane can be defined with two vectors that lie on it, since we have $\mbold{v_{\perp}}$ and we also know the normal of the plane (which is $\unit{n}$) any vector perpendicular to both vectors will also lie in the plane, we can use the cross product to find this vector

<div>$$
\mbold{w} = \unit{n} \times \mbold{v_{\perp}}
$$</div>

The length of $\mbold{w}$ is

<div>$$
\begin{align*}
\left \| \mbold{w} \right \| &= \left \| \unit{n} \right \| \left \| \mbold{v_{\perp}}\right \| \sin{\deg{90}} \\
&= \left \| \mbold{v_{\perp}}\right \|
\end{align*}
$$</div>

Which means that $\mbold{w}$ has the same length as $\mbold{v_{\perp}}$, note that even though they have the same length they don't neccesarily have unit length

$\mbold{w}$ and $\mbold{v_{\perp}}$ form now a 2d coordinate space where the $x$-axis is $\mbold{v_{\perp}}$ and the $y$-axis is $\mbold{v_{\perp}}$

Let $\mbold{v_{\perp}'}$ be a vector that is the result of rotating $\mbold{v_{\perp}}$ by an angle $\theta$, we can find the projection of it onto the $x$-axis and the $y$-axis as follows

<div>$$
\begin{align*}
\mbold{v_{\perp,x}'} &= (\magnitude{ \mbold{v_{\perp}} } \cos{\theta}) \unit{v_{\perp}} = \cos{\theta} \mbold{v_{\perp}}\\
\mbold{v_{\perp,y}'} &= (\magnitude{ \mbold{v_{\perp}} } \sin{\theta}) \unit{w} = \sin{\theta} \mbold{w}
\end{align*}
$$</div>

- Expressing $\mbold{v_{\perp}'}$ as a linear combination of the basis

<div>$$
\mbold{v_{\perp}'} = \cos{\theta} \mbold{v_{\perp}} + \sin{\theta} \mbold{w}
$$</div>

Reconstructing the solution from the observations above

<div>$$
\begin{align*}
\mbold{v_{\parallel}} &= (\mbold{v} \cdot \unit{n}) \unit{n} \\
\mbold{v_{\perp}} &= \mbold{v} - \mbold{v_{\parallel}} \\
&= \mbold{v} - (\mbold{v} \cdot \unit{n}) \unit{n} \\
\mbold{w} &= \unit{n} \times \mbold{v_{\perp}} \\
&= \unit{n} \times (\mbold{v} - \mbold{v_{\parallel}}) \\
&= \unit{n} \times \mbold{v} - \unit{n} \times \mbold{v_{\parallel}} \\
&= \unit{n} \times \mbold{v}
\end{align*}
$$</div>

Finally

<div>$$
\begin{align}
\mbold{v'} &= \mbold{v_{\perp}'} + \mbold{v_{\parallel}'} \nonumber \\
&= \cos{\theta} \mbold{v_{\perp}} + \sin{\theta} \mbold{w} + (\mbold{v} \cdot \unit{n}) \unit{n} \nonumber \\
&= \cos{\theta} (\mbold{v - (\mbold{v} \cdot \unit{n}) \unit{n}}) + \sin{\theta} (\unit{n} \times \mbold{v}) + (\mbold{v} \cdot \unit{n}) \unit{n} \nonumber \\
&= \cos{\theta} \mbold{v} - \cost (\mathbf{v} \cdot \unit{n}) \unit{n} + \sin{\theta} (\unit{n} \times \mbold{v}) + (\mbold{v} \cdot \unit{n}) \unit{n} \nonumber \\
&= \cos{\theta} \mbold{v} + \sin{\theta} (\unit{n} \times \mbold{v}) + (1 - \cost)(\mathbf{v} \cdot \unit{n}) \unit{n} \label{3d-rotation}
\end{align}
$$</div>

Now we can compute what the basis vectors are after the transformation above (by using each of the basis vectors as $\mbold{v}$ on \eqref{3d-rotation}) to construct a rotation matrix

<div>$$
\begin{align*}
\mbold{p} &= \begin{bmatrix}1 \\ 0 \\ 0\end{bmatrix} \quad \quad \quad \quad \mbold{p'} = \begin{bmatrix}
n_x^2(1 - \cost) + \cost \\
n_xn_y(1 - \cost) + n_z \sint \\
n_xn_z(1 - \cost) - n_z \sint
\end{bmatrix}\\
\\
\mbold{q} &= \begin{bmatrix}0 \\ 1 \\ 0\end{bmatrix} \quad \quad \quad \quad \mbold{q'} = \begin{bmatrix}
n_yn_x(1 - \cost) - n_z \sint \\
n_y^2(1 - \cost) + \cost \\
n_yn_z(1 - \cost) + n_x \sint
\end{bmatrix}\\
\\
\mbold{r} &= \begin{bmatrix}0 \\ 0 \\ 1\end{bmatrix} \quad \quad \quad \quad \mbold{r'} = \begin{bmatrix}
n_zn_x(1 - \cost) + n_y \sint \\
n_zn_y(1 - \cost) - n_x \sint \\
n_z^2(1 - \cost) + \cost
\end{bmatrix}\\
\end{align*}
$$</div>

Constructing the matrix from these vectors

<div>$$
\mathbf{R}(\unit{n}, \theta) =
\begin{bmatrix}
\mbold{p'} & \mbold{q'} & \mbold{r'}
\end{bmatrix}
$$</div>

### 3d rotations using quaternions

See [complex numbers](/static/math/numeral-systems/complex-numbers.html) and [quaternions](/static/math/numeral-systems/quaternions.html)

A complex rotor is a unit norm complex number which rotates another complex number by the angle $\theta$ and has the form

<div>$$
e^{i\theta} = \cost + i \sint
$$</div>

Hamilton had hoped that a unit-norm quaternion $q$ could be used to rotate a vector which is stored as a pure quaternion $p$, the unit norm quaternion is given by

<div>$$
\begin{align}
q &= [s, \lambda \unit{n}] \quad s,\lambda \in \mathbb{R}, \unit{n} \in \mathbb{R}^3 \label{unit-norm-quaternion}\\
\left | \unit{n} \right | &= 1 \nonumber \\
s^2 + \lambda^2 &= 1 \nonumber
\end{align}
$$</div>

<div>$$
p = [0, \mbold{v}] \quad \mbold{v} \in \mathbb{R}^3
$$</div>

Let's compute the product $p' = qp$

<div>$$
\begin{align}
p' &= qp \nonumber \\
&= [s, \lambda \unit{n}][0, \mathbf{v}] \nonumber \\
&= [-\lambda \unit{n} \cdot \mathbf{v}, s \mathbf{v} + \lambda \unit{n} \times \mathbf{v}] \label{p-prime}
\end{align}
$$</div>

#### Special case

What if $\unit{n}$ is _perpendicular_ to $\mathbf{v}$?  Then the scalar quantity of \eqref{p-prime} is zero and we are left with the pure quaternion

<div>$$
\begin{equation} \label{p-prime-perpendicular}
p' = [0, s \mathbf{v} + \lambda \unit{n} \times \mathbf{v}] \quad\quad \text{given that $\unit{n}$ is perpendicular to $\mathbf{n}$}
\end{equation}
$$</div>

Let's analyze the vector part of $\eqref{p-prime-perpendicular}$ (which is now a 3d entity because it's a pure quaternion), since $\unit{n}$ is perpendicular to $\mathbf{v}$ then the vector $\unit{n} \times \mathbf{v}$ will have a norm equal to $\magnitude{ \unit{n} \times \mathbf{v} } = \magnitude{ \unit{n} } \magnitude { \mathbf{v} } \sin{\deg{90}}$ and also since $\unit{n}$ is a unit vector then $\magnitude{\unit{n} \times \mathbf{v}} = \magnitude{\mathbf{v}}$ which means that we have two orthogonal vectors with the same length

To rotate the vector $\mathbf{v}$ about $\unit{n}$ let's transform $\mathbf{v}$ to the 2d space whose basis vectors are $\mathbf{v}$ and $\unit{n} \times \mathbf{v}$ and perform the rotation there which is trivially $[\cost, \sint]$, therefore all we have to do in \eqref{p-prime-perpendicular} is make the scalar quantities multiplying each vector equal the projection of the rotated vector over the basis

<div>$$
p' = [0, \cost \mathbf{v} + \sint \unit{n} \times \mathbf{v}]
$$</div>

Which makes the quaternion $\mathbf{q}$ have the form

<div>$$
\begin{align}
q &= [\cost, \sint \unit{n}] \label{perp-rotor}
\end{align}
$$</div>

And it acts as a rotor **only when $\unit{n}$ is perpendicular to $\mathbf{v}$**

Important notes/facts about orthogonal quaternions

- If $q$ is a rotor about the unit vector $\unit{n}$ by an angle $\theta$ whose vector term is perpendicular to the pure quaternion $p$
  - $qp$ and $pq^{-1}$ rotate $p$ by an angle $\theta$ about $\unit{n}$
  - $pq$ and $q^{-1}p$ rotate $p$ by an angle $-\theta$ about $\unit{n}$
  - Each of these products leave $p'$ unscaled (because $q$ is a unit norm quaternion)

#### General case

Let's use \eqref{unit-norm-quaternion} as the starting point, note that this time its vector part it's not necessarily perpendicular to the pure quaternion $p$, the product $qp$ yields

<div>$$
\begin{align*}
qp &= [s, \lambda \unit{n}][0, \mathbf{v}] \\
&= [-\lambda \unit{n} \cdot \mathbf{v}, s \mathbf{v} + \lambda \unit{n} \times \mathbf{v}]
\end{align*}
$$</div>

Note that the term $-\lambda \unit{n} \cdot \mathbf{v}$ does not vanish since for the general case $\unit{n}$ and $\mathbf{v}$ are no longer perpendicular, what's more important is that the product $qp$ is no longer a pure quaternion, multiplying a vector by a non-orthogonal quaternion has converted some of the vector information into the quaternion's scalar component

What happens if we post-multiply $qp$ by $q^{-1}$, could it reverse the operation?  (Note that since $q$ is a norm quaternion $q^{-1} = q^*$)

<div>$$
qpq^{-1} = [-\lambda \unit{n} \cdot \mathbf{v}, s \mathbf{v} + \lambda \unit{n} \times \mathbf{v}][s, -\lambda \unit{n}]
$$</div>

Let's first check if doing this multiplication makes the scalar component vanish

<div>$$
\begin{align*}
qpq^{-1} &= [-\lambda s \unit{n} \cdot \mathbf{v} - (s \mathbf{v} + \lambda \unit{n} \times \mathbf{v}) \cdot (-\lambda \unit{n}), \ldots] \\
&= [-\lambda s \unit{n} \cdot \mathbf{v} + (s \mathbf{v}) \cdot (\lambda \unit{n}) + (\lambda \unit{n} \times \mathbf{v}) \cdot (\lambda \unit{n}), \ldots] \\
&= [-\lambda s \unit{n} \cdot \mathbf{v} + (s \mathbf{v}) \cdot (\lambda \unit{n}) + 0, \ldots] \quad \text {since $\unit{n}$ is perpendicular to $\unit{n} \times \mathbf{v}$ }\\
&= [-\lambda s \unit{n} \cdot \mathbf{v} + \lambda s \mathbf{v} \cdot \unit{n}), \ldots] \\
&= [0, \ldots]
\end{align*}
$$</div>

Indeed it magically made the scalar component vanish! Now let's look at the vector component of $qpq^{-1}$

<div>$$
\begin{align*}
qpq^{-1} &= [0, s (s \mathbf{v} + \lambda \unit{n} \times \mathbf{v}) + (-\lambda \unit{n} \cdot \mathbf{v})(-\lambda \unit{n}) + (s \mathbf{v} + \lambda \unit{n} \times \mathbf{v}) \times (-\lambda \unit{n})] \\
&= [0, s^2 \mathbf{v} + s \lambda (\unit{n} \times \mathbf{v}) + \lambda^2 (\unit{n} \cdot \mathbf{v})\unit{n} - s \lambda (\mathbf{v} \times \unit{n}) - \lambda^2 (\unit{n} \times \mathbf{v} \times \unit{n})]
\end{align*}
$$</div>

Let's [expand the cross product](https://www.wikiwand.com/en/Triple_product#/section_Vector_triple_product)

<div>$$
(\unit{n} \times \mathbf{v}) \times \unit{n} = (\unit{n} \cdot \unit{n}) \mathbf{v} - (\mathbf{v} \cdot \unit{n}) \unit{n} = \mathbf{v} - (\mathbf{v} \cdot \unit{n}) \unit{n}
$$</div>

Therefore

<div>$$
\begin{align*}
qpq^{-1} &= [0, s^2 \mathbf{v} + s \lambda (\unit{n} \times \mathbf{v}) + \lambda^2 (\unit{n} \cdot \mathbf{v})\unit{n} - s \lambda (\mathbf{v} \times \unit{n}) - \lambda^2 (\mathbf{v} - (\mathbf{v} \cdot \unit{n}) \unit{n})] \\
&= [0, s^2 \mathbf{v} + s \lambda (\unit{n} \times \mathbf{v}) + \lambda^2 (\unit{n} \cdot \mathbf{v})\unit{n} - s \lambda (\mathbf{v} \times \unit{n}) - \lambda^2 \mathbf{v} + \lambda^2 (\mathbf{v} \cdot \unit{n}) \unit{n})] \\
&= [0, s^2 \mathbf{v} + 2 s \lambda (\unit{n} \times \mathbf{v}) + \lambda^2 (\unit{n} \cdot \mathbf{v})\unit{n} - \lambda^2 \mathbf{v} + \lambda^2 (\mathbf{v} \cdot \unit{n}) \unit{n})] \\
&= [0, (s^2 - \lambda^2) \mathbf{v} + 2 s \lambda (\unit{n} \times \mathbf{v}) + 2 \lambda^2 (\mathbf{v} \cdot \unit{n}) \unit{n}] \\
\end{align*}
$$</div>

Let's make $s = \cost$ and $\lambda = \sint$ just like in \eqref{perp-rotor} (it worked as a rotor when it was orthogonal to $p$, it might work with the general case too)

<div>$$
qpq^{-1} = [0, (\cos^2{\theta} - \sin^2{\theta}) \mathbf{v} + 2 \cost \sint (\unit{n} \times \mathbf{v}) + 2 \sin^2{\theta} (\mathbf{v} \cdot \unit{n}) \unit{n}]
$$</div>

Which involves double-angle terms, replacing these terms with [double angle-identities](http://mathworld.wolfram.com/Double-AngleFormulas.html)

<div>$$
qpq^{-1} = [0, \cos{2\theta} \mathbf{v} + \sin{2\theta} (\unit{n} \times \mathbf{v}) + (1 - \cos{2\theta}) (\mathbf{v} \cdot \unit{n}) \unit{n}]
$$</div>

The product created a pure quaternion equal to $\mathbf{v}$ rotated by an angle $2\theta$, if we want to rotate $\mathbf{v}$ by an angle $\theta$ we must build a half angle $\theta$ quaternion $q$ (note above that $q$ was equal to \eqref{perp-rotor})

<div>$$
\begin{equation} \label{rotor}
q = [\cos{\frac{1}{2}\theta}, \sin{\frac{1}{2}\theta}\unit{n}]
\end{equation}
$$</div>

Using \eqref{rotor} the product is

<div>$$
qpq^{-1} = [0, \cos{\theta} \mathbf{v} + \sin{\theta} (\unit{n} \times \mathbf{v}) + (1 - \cos{\theta}) (\mathbf{v} \cdot \unit{n}) \unit{n}]
$$</div>

Note that the vector part of $qpq^{-1}$ is identical to \eqref{3d-rotation}

#### Quaternion difference and dot product

Let $a$ and $b'$ be two *unit norm* quaternions (rotors that have the same form as \eqref{rotor}), the quaternion to rotate from $a$ to $b$ is given by $da = b$ and is known as *quaternion difference*, finding the value of $d$ given that we know $a$ and $b$

<div>$$
\begin{align*}
da &= b \\
d(aa^*) &= ba^* \quad \quad \text{since $a$ is a unit norm quaternion its inverse is equal to its conjugate} \\
d &= ba^*
\end{align*}
$$</div>

Expanding the product

<div>$$
\begin{align*}
d &= [s_b, \mathbf{b}][s_a, -\mathbf{a}] \\
&= [s_bs_a + \mathbf{b} \cdot \mathbf{a}, -s_b\mathbf{a} + s_a\mathbf{b} - \mathbf{b} \times \mathbf{a}]
\end{align*}
$$</div>

Note that the scalar part of this quaternion is equal to the *inner product* (a generalization of the dot product to abstract vector spaces) between two quaternions

<div>$$
d = [\left \langle a, b \right \rangle, -s_b\mathbf{a} + s_a\mathbf{b} - \mathbf{b} \times \mathbf{a}]
$$</div>

Remembering that a rotor is given by \eqref{rotor} we can relate the *inner product* between **rotor quaternions** with the scalar quantity of \eqref{rotor} and interpret it geometrically just like the dot product between two vectors in 3d/2d space but this time noticing that the dot product gives the cosine of half the angle between the quaternions

<div>$$
a \cdot b = \cos{\frac{\theta}{2}}
$$</div>

This means that the angle between $a$ and $b$ is equal to

<div>$$
\theta = 2 \arccos{(a \cdot b)}
$$</div>

Or using the [half angle formulas](http://tutorial.math.lamar.edu/pdf/Trig_Cheat_Sheet.pdf)

<div>$$
\begin{align*}
\cos^2{\frac{\theta}{2}} &= \frac{1}{2}(1 + \cos{\theta}) \\
(a \cdot b)^2 &= \frac{1}{2}(1 + \cos{\theta}) \\
\cost &= 2 (a \cdot b)^2 - 1 \\
\theta &= \arccos(2(a \cdot b)^2 - 1)
\end{align*}
$$</div>

The second formula works for all the cases as noted [here](http://math.stackexchange.com/questions/90081/quaternion-distance) (the first one doesn't work when $a \cdot b < 0$)

{{< script >}}
document.addEventListener('DOMContentLoaded', function () {
  function unitCircle() {
    return {
      x: 'cos(t)',
      y: 'sin(t)',
      color: 'lightgrey',
      fnType: 'parametric',
      graphType: 'polyline'
    }
  }

  functionPlot({
    target: '#two-dimensions',
    grid: true,
    xAxis: { domain: [-6, 6] },
    data: [
      { vector: [1, 0], color: '#FFCCCB', fnType: 'vector', graphType: 'polyline' },
      { vector: [0, 1], color: '#add8e6', fnType: 'vector', graphType: 'polyline' },
      { vector: [0.86602540378, 0.5], color: 'red', fnType: 'vector', graphType: 'polyline'},
      { vector: [-0.5, 0.86602540378], color: 'blue', fnType: 'vector', graphType: 'polyline' },
      unitCircle()
    ]
  })
})
{{< /script >}}

