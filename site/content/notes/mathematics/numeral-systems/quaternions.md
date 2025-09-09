---
title: "Quaternions"
summary: |
  Quaternions are a set of 4-dimensional vectors that are used to represent rotations in computer
  graphics. They were discovered by William Hamilton as an extension of 2D complex numbers
  to a 3D equivalent.

  <br />
  This article covers the definition of a quaternion, its notation, and operations.
image: /images/math-generic.jpeg
tags: ["math", "numeral systems", "complex numbers", "imaginary numbers", "quaternions"]
libraries: ["math"]
date: 2015-09-08 20:00:00
---

## Definition

The existence of complex numbers presented a question for mathematicians: if a complex number exists in a 2D complex plane, could there be a 3D equivalent?

<i>Sir William Rowan Hamilton</i>, among many other mathematicians of the 18th and 19th centuries, had been searching for the answer. Hamilton conjectured that a 3D complex number could be represented by the triple $a + bi + cj$, where $i$ and $j$ are imaginary quantities and square to $-1$. When he was developing the algebra for this triplet, the product of them raised a problem when expanded:

<div>$$
\begin{align*}
z_1 &= a_1 + b_1i + c_1j \\
z_2 &= a_2 + b_2i + c_2j \\
z_1z_2 &= (a_1 + b_1i + c_1j)(a_2 + b_2i + c_2j) \\
&= (a_1a_2 - b_1b_2 - c_1c_2) + (a_1b_2 + b_1a_2)i + (a_1c_2 + c_1a_2)j \\
& \quad + b_1c_2ij + c_1b_2ji
\end{align*}
$$</div>

The quantities $ij$ and $ji$ represented a problem for Hamilton. Even if $ij = -ji$, we are still left with $(b_1c_2 - c_1b_2)ij$.

On October 16th, 1843, while he was walking with his wife along the Royal Canal in Ireland, he saw the solution as a <i>quadruple</i> instead of a <i>triple</i>. Instead of using two imaginary terms, three imaginary terms provided the necessary quantities to resolve products like $ij$.

Hamilton defined a quaternion $q$ as:

<div>$$
\begin{align*}
q = s + ai + bj + ck, \quad s,a,b,c \in \mathbb{R} \\
i^2 = j^2 = k^2 = ijk = -1 \\
ij = k, \quad jk = i, \quad ki = j \\
ji = -k, \quad kj = -i, \quad ik = -j
\end{align*}
$$</div>

If a complex number $i$ is capable of rotating points on the plane by $90^\circ$, then perhaps a triple rotates points in space by $90^\circ$. In the end, the triplet was replaced by a quaternion.

## Notation

There are three ways of annotating a quaternion $q$:

<div>$$
\begin{align}
q &= s + xi + yj + zk \\
q &= s + \mathbf{v} \\
q &= [s, \mathbf{v}] \\
& \text{where } s,x,y,z \in \mathbb{R}, \mathbf{v} \in \mathbb{R}^3 \\
& \text{and } i^2 = j^2 = k^2 = ijk = -1 \nonumber
\end{align}
$$</div>

### Real Quaternion

A real quaternion has a zero vector term:

<div>$$
q = [s, \mathbf{0}]
$$</div>

### Pure Quaternion

A pure quaternion is a quaternion having a zero scalar term:

<div>$$
q = [0, \mathbf{v}]
$$</div>

### Quaternion Conjugate

Given:

<div>$$
q = [s, \mathbf{v}]
$$</div>

The quaternion conjugate is defined as:

<div>$$
q^* = [s, - \mathbf{v}]
$$</div>

### Quaternion Norm

The norm of a quaternion $q = [s, \mathbf{v}]$ is defined as the square root of the product of itself and its conjugate (the multiplication operation is defined later):

<div>$$
\begin{align*}
\norm{q} &= \sqrt{qq^*} \\
&= \sqrt{s^2 + x^2 + y^2 + z^2}
\end{align*}
$$</div>

Also note that:

<div>$$
\norm{q}^2 = qq^*
$$</div>

Norm facts:

- $\norm{qq^\*} = \norm{q}\norm{q^\*}$
- $\norm{q^\*} = \norm{q}$

### Unit Quaternion

A unit quaternion is a quaternion of norm one given by:

<div>$$
\begin{align}
q &= [s, \lambda \unit{n}] \quad s,\lambda \in \mathbb{R}, \unit{n} \in \mathbb{R}^3 \label{unit-norm-quaternion}\\
\left | \unit{n} \right | &= 1 \nonumber \\
s^2 + \lambda^2 &= 1 \nonumber
\end{align}
$$</div>

Note: dividing a non-zero quaternion by its norm produces a unit norm quaternion.

## Operations

### Quaternion Product

Given two quaternions:

<div>$$
\begin{align*}
q_a = [s_a, \mathbf{a}], \quad \quad \mathbf{a} = x_a i + y_a j + z_a k \\
q_b = [s_b, \mathbf{b}], \quad \quad \mathbf{b} = x_b i + y_b j + z_b k
\end{align*}
$$</div>

The product $q_aq_b$ is computed as follows:

<div>$$
\begin{align}
q_aq_b &= (s_a + x_a i + y_a j + z_a k)(s_b + x_b i + y_b j + z_b k) \nonumber \\
&= (s_as_b - x_ax_b - y_ay_b - z_az_b) \nonumber \\
& \quad + (s_ax_b + s_bx_a + y_az_b - y_bz_a)i \nonumber \\
& \quad + (s_ay_b + s_by_a + z_ax_b - z_bx_a)j \nonumber \\
& \quad + (s_az_b + s_bz_a + x_ay_b - x_by_a)k \label{quaternion-product}
\end{align}
$$</div>

Replacing the imaginaries by the ordered pairs (which are themselves <i>quaternion units</i>):

<div>$$
i = [0, \mathbf{i}], \quad j = [0, \mathbf{j}], \quad k = [0, \mathbf{k}], \quad 1 = [1, \mathbf{0}]
$$</div>

And substituting them in \eqref{quaternion-product}:

<div>$$
\begin{align*}
q_aq_b &= (s_as_b - x_ax_b - y_ay_b - z_az_b)[1, \mathbf{0}] \\
& \quad + (s_ax_b + s_bx_a + y_az_b - y_bz_a)[0, \mathbf{i}] \\
& \quad + (s_ay_b + s_by_a + z_ax_b - z_bx_a)[0, \mathbf{j}] \\
& \quad + (s_az_b + s_bz_a + x_ay_b - x_by_a)[0, \mathbf{k}]
\end{align*}
$$</div>

By doing some groupings:

<div>$$
\begin{align*}
q_aq_b &= [s_as_b - x_ax_b - y_ay_b - z_az_b, \\
& \quad s_a(x_b \mathbf{i} + y_b \mathbf{j} + z_b \mathbf{k}) + s_b(x_a \mathbf{i} + y_a \mathbf{j} + z_a \mathbf{k}) \\
& \quad + (y_az_b - y_bz_a) \mathbf{i} + (z_ax_b - z_bx_a) \mathbf{j} + (x_ay_b - x_by_a) \mathbf{k}] \\
&= [s_as_b - \mathbf{a} \cdot \mathbf{b}, s_a\mathbf{b} + s_b\mathbf{a} + \mathbf{a} \times \mathbf{b}]
\end{align*}
$$</div>

Now let's compute the product $q_bq_a$:

<div>$$
q_bq_a = [s_bs_a - \mathbf{b} \cdot \mathbf{a}, s_b\mathbf{a} + s_a\mathbf{b} + \mathbf{b} \times \mathbf{a}]
$$</div>

Note that the scalar quantity of both products is the same; however, the vector quantity varies (the cross product sign is changed). Therefore:

<div>$$
q_aq_b \neq q_bq_a
$$</div>

This is an important fact to note since for complex numbers the product commutes; however, for quaternions, it doesn't.

#### Product of a Scalar and a Quaternion

Let $k$ be a scalar represented as a quaternion as $q_k = [k, \mathbf{0}]$ and $q = [s, \mathbf{v}]$.

Their product is:

<div>$$
\begin{align*}
q_kq &= [k, \mathbf{0}][s, \mathbf{v}] \\
&= [ks, k\mathbf{v}]
\end{align*}
$$</div>

Note that this product is commutative.


#### Product of a Quaternion with Itself (Square of a Quaternion)

<div>$$
\begin{align*}
q &= [s, \mathbf{v}] \\
q^2 &= [s, \mathbf{v}] [s, \mathbf{v}] \\
&= [s^2 - \mathbf{v} \cdot \mathbf{v}, 2s\mathbf{v} + \mathbf{v} \times \mathbf{v}] \\
&= [s^2 - \|v\|^2, 2s\mathbf{v}] \\
&= [s^2 - (x^2 + y^2 + z^2), 2s(x\mathbf{i} + y\mathbf{j} + z\mathbf{k})]
\end{align*}
$$</div>

#### Product of a Quaternion and Its Conjugate

Let $q = [s, \mathbf{v}]$.

<div>$$
\begin{align*}
qq^* &= [s, \mathbf{v}][s, -\mathbf{v}] \\
&= [s^2 + \mathbf{v} \cdot \mathbf{v}, -s \mathbf{v} + s\mathbf{v} - \mathbf{v} \times \mathbf{v}] \\
&= [s^2 + \mathbf{v} \cdot \mathbf{v}, \mathbf{0}] \\
&= s^2 + x^2 + y^2 + z^2
\end{align*}
$$</div>

Note that this product commutes, i.e., $qq^* = q^*q$.

#### Product of Unit Quaternions

Given:

<div>$$
q_a = [s_a, \mathbf{a}] \\
q_b = [s_b, \mathbf{b}]
$$</div>

Where $\norm{q_a} = \norm{q_b} = 1$, the product is another unit-norm quaternion:

<div>$$
q_c = [s_c, \mathbf{c}]
$$</div>

Where $\norm{q_c} = 1$.

#### Product of Pure Quaternions

Let:

<div>$$
q_a = [0, \mathbf{a}] \\
q_b = [0, \mathbf{b}]
$$</div>

The product $q_aq_b$ is defined as:

<div>$$
\begin{align*}
q_aq_b &= [-\mathbf{a} \cdot \mathbf{b}, \mathbf{a} \times \mathbf{b}]
\end{align*}
$$</div>

Note that the resulting quaternion is no longer a *pure quaternion* as some information has propagated into the real part via the dot product.

#### Product of a Pure Quaternion with Itself (Square of a Pure Quaternion)

<div>$$
\begin{align*}
q &= [0, \mathbf{v}] \\
q^2 &= [0, \mathbf{v}] [0, \mathbf{v}] \\
&= [-\mathbf{v} \cdot \mathbf{v}, \mathbf{v} \times \mathbf{v}] \\
&= [-(x^2 + y^2 + z^2), \mathbf{0}] \\
&= -\norm{v}^2
\end{align*}
$$</div>

If $q$ is a unit norm pure quaternion, then:

<div>$$
q^2 = -1
$$</div>

#### Product of a Pure Quaternion with Its Conjugate

<div>$$
\begin{align*}
q^*q = qq^* &= [0, \mathbf{v}][0, -\mathbf{v}] \\
&= [\mathbf{v} \cdot \mathbf{v}, -\mathbf{v \times v}] \\
&= [\mathbf{v} \cdot \mathbf{v}, \mathbf{0}] \\
&= \norm{v}^2
\end{align*}
$$</div>

### Inverse of a Quaternion

By definition, the inverse $q^{-1}$ of $q$ is:

<div>$$
qq^{-1} = [1, \mathbf{0}]
$$</div>

To isolate $q^{-1}$, let's pre-multiply both sides by $q^**:

<div>$$
\begin{align*}
q^*qq^{-1} &= q^* \\
\norm{q}^2q^{-1} &= q^* \\
q^{-1} &= \frac{q^*}{\norm{q}^2}
\end{align*}
$$</div>

### Quaternion Units

Given the vector $\mathbf{v}$:

<div>$$
\mathbf{v} = v \hat{\mathbf{v}}, \quad \text{where } v = |\mathbf{v}|, \text{ and } |\hat{\mathbf{v}}| = 1
$$</div>

Combining this with the definition of a *pure quaternion*:

<div>$$
\begin{align*}
q &= [0, \mathbf{v}] \\
&= [0, v \hat{\mathbf{v}}] \\
&= v[0, \hat{\mathbf{v}}]
\end{align*}
$$</div>

It's convenient to identify the unit quaternion as $\hat{q}$ (where $v = 1$):

<div>$$
\hat{q} = [0, \hat{\mathbf{v}}]
$$</div>

Let's check if the quaternion unit $\mathbf{i}$ squares to the ordered pair $[-1, \mathbf{0}]$:

<div>$$
\begin{align*}
i^2 &= [0, \mathbf{i}][0, \mathbf{i}] \\
&= [0 \cdot 0 - \mathbf{i} \cdot \mathbf{i}, 0 \cdot \mathbf{i} + 0 \cdot \mathbf{i} - \mathbf{i} \times \mathbf{i}] \\
&= [-|\mathbf{i}|^2, \mathbf{0}] \quad \text{since } \mathbf{i} \times \mathbf{i} = 0 \\
& = [-1, \mathbf{0}]
\end{align*}
$$</div>


### Misc Operations


#### Taking the Scalar Part of a Quaternion

To isolate the scalar part of $q$, we could add $q^*$ to it:

<div>$$
2 S(q) = q + q^*
$$</div>
