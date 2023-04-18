---
title: "Quaternions"
description: |
  Quaternions are a set of 4-dimensional vectors that are used to represent rotations in computer
  graphics, they were discovered by William Hamilton as an extension of 2d complex numbers
  to a 3d equivalent.

  <br />
  This article covers the definition of a quaternion, its notation and operations.
image: /images/math-generic.jpeg
tags: ["math", "numeral systems", "complex numbers", "imaginary numbers", "quaternions"]
date: 2015-09-08 20:00:00
---

## Definition

The existence of complex number presented a question for mathematicians, if a complex number exists in a 2D complex plane, could there be a 3D equivalent?

<i>Sir William Rowan Hamilton</i> among many other mathematicians of the 18th and 19th century had been searching for the answer, Hamilton conjectured that a 3D complex number could be represented by the triple $a + bi + cj$ where $i$ and $j$ are imaginary quantities and square to $-1$, when he was developing the algebra for this triplet the product of them raised a problem when expanded

<div>$$
\begin{align*}
z_1 &= a_1 + b_1i + c_1j \\
z_2 &= a_2 + b_2i + c_2j \\
z_1z_2 &= (a_1 + b_1i + c_1j)(a_2 + b_2i + c_2j) \\
&= (a_1b_1 - b_1b_2 - c_1c_2) + (a_1b_2 + b_1a_2)i + (a_1c_2 + c_1a_2)j \\
& \quad + b_1c_2ij + c_1b_2ji
\end{align*}
$$</div>

The quantities $ij$ and $ji$ represented a problem for Hamilton, even if $ij = -ji$ we are still left with $(b_1c_2 - c_1b_2)ij$

On October 16th, 1843, while he was walking with his wife along the Royal Canal in Ireland he saw the solution as a <i>quadruple</i> instead of a <i>triple</i>, instead of using two imaginary terms, three imaginary terms provided the necessary quantities to resolve products like $ij$

Hamilton defined a quaternion $q$ as

<div>$$
\begin{align*}
q = s + ai + bj + ck \quad s,a,b,c \in \mathbb{R} \\
i^2 = j^2 = k^2 = ijk = -1 \\
ij = k \quad jk = i \quad ki = j \\
ji = -k \quad kj = -1 \quad ik = -j
\end{align*}
$$</div>

If a complex number $i$ is capable of rotating points on the plane by $\deg{90}$ then perhaps a triple rotates points in space by $\deg{90}$, in the end the triplet was replaced by a quaternion

## Notation

There are three ways of annotating a quaternion $q$

<div>$$
\begin{align}
q &= s + xi + yj + zk \\
q &= s + \mbold{v} \\
q &= [s, \mbold{v}] \\
& \text{where $s,x,y,z \in \mathbb{R}$, $\mbold{v} \in \mathbb{R}^3$} \nonumber \\
& \text{and $i^2 = j^2 = k^2 = ijk = -1$} \nonumber
\end{align}
$$</div>

### Real quaternion

A real quaternion has a zero vector term

<div>$$
q = [s, \mbold{0}]
$$</div>

### Pure quaternion

A pure quaternion is a quaternion having a zero scalar term

<div>$$
q = [0, \mbold{v}]
$$</div>

### Quaternion conjugate

Given

<div>$$
q = [s, \mbold{v}]
$$</div>

The quaternion conjugate is defined as

<div>$$
q^* = [s, - \mbold{v}]
$$</div>

### Quaternion norm

The norm of a quaternion $q = [s, \mbold{v}]$ is defined as the square root of the product of itself and its conjugate (the multiplication operation is defined later)

<div>$$
\begin{align*}
\norm{q} &= \sqrt{qq^*} \\
&= \sqrt{s^2 + x^2 + y^2 + z^2}
\end{align*}
$$</div>

Also note that

<div>$$
\norm{q}^2 = qq^*
$$</div>

Norm facts

- $\norm{qq^\*} = \norm{q}\norm{q^\*}$
- $\norm{q^\*} = \norm{q}$

### Unit quaternion

A unit quaternion is a quaternion of norm one given by

<div>$$
\begin{align}
q &= [s, \lambda \unit{n}] \quad s,\lambda \in \mathbb{R}, \unit{n} \in \mathbb{R}^3 \label{unit-norm-quaternion}\\
\left | \unit{n} \right | &= 1 \nonumber \\
s^2 + \lambda^2 &= 1 \nonumber
\end{align}
$$</div>

Note: dividing a non-zero quaternion by its norm produces a unit norm quaternion

## Operations

### Quaternion Product

Given two quaternions

<div>$$
\begin{align*}
q_a = [s_a, \mbold{a}] \quad \quad \mbold{a} = x_a i + y_a j + z_a k \\
q_b = [s_b, \mbold{b}] \quad \quad \mbold{b} = x_b i + y_b j + z_b k
\end{align*}
$$</div>

The product $q_aq_b$ is computed as follows

<div>$$
\begin{align}
q_aq_b &= (s_a + x_a i + y_a j + z_a k)(s_b + x_b i + y_b j + z_b k) \nonumber \\
&= (s_as_b - x_ax_b - y_ay_b - z_az_b) \nonumber \\
& \quad + (s_ax_b + s_bx_a + y_az_b - y_bz_a)i \nonumber \\
& \quad + (s_ay_b + s_by_a + z_ax_b - z_bx_a)j \nonumber \\
& \quad + (s_az_b + s_bz_a + x_ay_b - x_by_a)k \label{quaternion-product}
\end{align}
$$</div>

Replacing the imaginaries by the ordered pairs (which are themselves <i>quaternion units</i>)

<div>$$
i = [0, \mbold{i}] \quad j = [0, \mbold{j}] \quad k = [0, \mbold{k}] \quad 1 = [1, \mbold{0}]
$$</div>

And substituting them in \eqref{quaternion-product}

<div>$$
\begin{align*}
q_aq_b &= (s_as_b - x_ax_b - y_ay_b - z_az_b)[1, \mbold{0}] \\
& \quad + (s_ax_b + s_bx_a + y_az_b - y_bz_a)[0, \mbold{i}] \\
& \quad + (s_ay_b + s_by_a + z_ax_b - z_bx_a)[0, \mbold{j}] \\
& \quad + (s_az_b + s_bz_a + x_ay_b - x_by_a)[0, \mbold{k}]
\end{align*}
$$</div>

By doing some aggrupations

<div>$$
\begin{align*}
q_aq_b &= [s_as_b - x_ax_b - y_ay_b - z_az_b, \\
& \quad s_a(x_b \mbold{i} + y_b \mbold{j} + z_b \mbold{k}) + s_b(x_a \mbold{i} + y_a \mbold{j} + z_a \mbold{k}) \\
& \quad + (y_az_b - y_bz_a) \mbold{i} + (z_ax_b - z_bx_a) \mbold{j} + (x_ay_b - x_by_a) \mbold{k}] \\
&= [s_as_b - \mbold{a} \cdot \mbold{b}, s_a\mbold{b} + s_b\mbold{a} + \mbold{a} \times \mbold{b}]
\end{align*}
$$</div>

Now let's compute the product $q_bq_a$

<div>$$
q_bq_a = [s_bs_a - \mbold{b} \cdot \mbold{a}, s_b\mbold{a} + s_a\mbold{b} + \mbold{b} \times \mbold{a}]
$$</div>

Note that the scalar quantity of both products is the same however the vector quantity varies (the cross product sign is changed) therefore

<div>$$
q_aq_b \not = q_bq_a
$$</div>

This is an important fact to note since for complex number the product commutes however for quaternions it doesn't

#### Product of a scalar and a quaternion

Let $k$ be a scalar represented as a quaternion as $q_k = [k, \mathbf{0}]$ and $q = [s, \mathbf{v}]$

Their product is

<div>$$
\begin{align*}
q_kq &= [k, \mathbf{0}][s, \mathbf{v}] \\
&= [ks, k\mathbf{v}]
\end{align*}
$$</div>

Note that this product is commutative


#### Product of a quaternion with itself (square of a quaternion)

<div>$$
\begin{align*}
q &= [s, \mbold{v}] \\
q^2 &= [s, \mbold{v}] [s, \mbold{v}] \\
&= [s^2 - \mbold{v} \cdot \mbold{v}, 2s\mbold{v} + \mbold{v} \times \mbold{v}] \\
&= [s^2 - \norm{v}^2, 2s\mbold{v}] \\
&= [s^2 - (x^2 + y^2 + z^2), 2s(x\mbold{i} + y\mbold{j} + z\mbold{k})]
\end{align*}
$$</div>

#### Product of a quaternion and its conjugate

Let $q = [s, \mathbf{v}]$

<div>$$
\begin{align*}
qq^* &= [s, \mathbf{v}][s, -\mathbf{v}] \\
&= [s^2 + \mathbf{v} \cdot \mathbf{v}, -s \mathbf{v} + s\mathbf{v} - \mathbf{v} \times \mathbf{v}] \\
&= [s^2 + \mathbf{v} \cdot \mathbf{v}, \mathbf{0}] \\
&= s^2 + x^2 + y^2 + z^2
\end{align*}
$$</div>

Note that this product commutes i.e. $qq^\* = q^\*q$

#### Product of unit quaternions

Given

<div>$$
q_a = [s_a, \mbold{a}] \\
q_b = [s_b, \mbold{b}]
$$</div>

Where $\norm{q_a} = \norm{q_b} = 1$, the product is another unit-norm quaternion

<div>$$
q_c = [s_c, \mbold{c}]
$$</div>

Where $\norm{q_c} = 1$

#### Product of pure quaternions

Let

<div>$$
q_a = [0, \mbold{a}] \\
q_b = [0, \mbold{b}]
$$</div>

The product $q_aq_b$ is defined as

<div>$$
\begin{align*}
q_aq_b &= [-\mbold{a} \cdot \mbold{b}, \mbold{a} \times \mbold{b}]
\end{align*}
$$</div>

Note that the resulting quaternion is no longer a *pure quaternion* as some information has propagated into the real part via the dot product

#### Product of a pure quaternion with itself (square of a pure quaternion)

<div>$$
\begin{align*}
q &= [0, \mbold{v}] \\
q^2 &= [0, \mbold{v}] [0, \mbold{v}] \\
&= [-\mbold{v} \cdot \mbold{v}, \mbold{v} \times \mbold{v}] \\
&= [-(x^2 + y^2 + z^2), \mbold{0}] \\
&= -\norm{v}^2
\end{align*}
$$</div>

If $q$ is a unit norm pure quaternion then

<div>$$
q^2 = -1
$$</div>

#### Product of a pure quaternion with its conjugate

<div>$$
\begin{align*}
q^*q = qq^* &= [0, \mathbf{v}][0, -\mathbf{v}] \\
&= [\mathbf{v} \cdot \mathbf{v}, -\mbold{v \times v}] \\
&= [\mathbf{v} \cdot \mathbf{v}, \mbold{0}] \\
&= \norm{v}^2
\end{align*}
$$</div>

### Inverse of a quaternion

By definition, the inverse $q^{-1}$ of $q$ is

<div>$$
qq^{-1} = [1, \mbold{0}]
$$</div>

To isolate $q^{-1}$ let's pre multiply both sides by $q^*$

<div>$$
\begin{align*}
q^*qq^{-1} &= q^* \\
\norm{q}^2q^{-1} &= q^* \\
q^{-1} &= \frac{q^*}{\norm{q}^2}
\end{align*}
$$</div>

### Quaternion units

Given the vector $\mbold{v}$

<div>$$
\mbold{v} = v \hat{\mbold{v}} \quad \text{where $v = |\mbold{v}|$, and $|\hat{\mbold{v}}| = 1$}
$$</div>

Combining this with the definition of a *pure quaternion*

<div>$$
\begin{align*}
q &= [0, \mbold{v}] \\
&= [0, v \hat{\mbold{v}}] \\
&= v[0, \hat{\mbold{v}}]
\end{align*}
$$</div>

It's convenient to identify the unit quaternion as $\hat{q}$ (where $v = 1$)

<div>$$
\hat{q} = [0, \hat{\mbold{v}}]
$$</div>

Let's check if the quaternion unit $\mbold{i}$ squares to the ordered pair $[-1, \mbold{0}]$

<div>$$
\begin{align*}
i^2 &= [0, \mbold{i}][0, \mbold{i}] \\
&= [0 \cdot 0 - \mbold{i} \cdot \mbold{i}, 0 \cdot \mbold{i} + 0 \cdot \mbold{i} - \mbold{i} \times \mbold{i}] \\
&= [-|\mbold{i}|^2, \mbold{0}] \quad \text{$\mbold{i} \times \mbold{i} = 0$} \\
& = [-1, \mbold{0}]
\end{align*}
$$</div>


### Misc operations


#### Taking the scalar part of a quaternion

To isolate the scalar part of $q$ we could add $q^*$ to it

<div>$$
2 S(q) = q + q^*
$$</div>

