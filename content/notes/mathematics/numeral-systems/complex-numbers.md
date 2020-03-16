---
title: "Complex numbers"
date: 2015-09-08 13:30:00
libraries: [d3, function-plot]
---

## Imaginary numbers

- Invented to solve problems where an equation has no real roots e.g. $x^2 + 16 = 0$, the idea of declaring the existence of a quantity $i$ such that $i^2 = -1$ allows us to express the solution as

<div>
$$
x = \sqrt{-16} = \sqrt{16i^2} = \pm4i
$$
</div>

The set represented by $\mathbb{I}$ defines an imaginary number as

<div>
$$
i^2 = -1
$$
</div>

### Powers of i

If $i^2 = -1$ then $i^4 = i^2i^2 = -1 * -1 = 1$

Therefore we have the sequence

<div>
$$
\begin{array}{ccccc}
\hline
i & i^2 & i^3 & i^4 & i^5 & \ldots \\
\hline
i & -1 & -i & 1 & i & \ldots \\
\hline
\end{array}
$$
</div>

## Complex numbers

A complex number is just the sum of a real and an imaginary number

<div>
$$
z = a + bi  \quad a,b \in \mathbb{R}, \quad i^2 = -1
$$
</div>

### Operations on complex numbers

Given two complex numbers

<div>
$$
z_1 = a_1 + b_1i \\
z_2 = a_2 + b_2i
$$
</div>

#### Addition and subtraction

<div>
$$
z_1 \pm z_2 = a_1 \pm a_2 + (b_1 \pm b_2)i
$$
</div>

#### Product

<div>
$$
\begin{align*}
z_1z_2 &= a_1a_2 + a_1b_2i + a_2b_1i + b_1b_2i^2 \quad \text{given that $i^2 = -1$} \\
&= (a_1a_2 - b_1b_2) + (a_1b_2 + b_1a_2)i
\end{align*}
$$
</div>

<hr>

Given the complex number

<div>
$$
z = a + bi
$$
</div>

#### Norm (modulus or absolute value)

<div>
$$
|z| = \sqrt{a^2 + b^2}
$$
</div>

#### Complex conjugate

The product of two complex numbers where the only difference between them is the **sign** of the imaginary part is

<div>
$$
(a + bi)(a - bi) = a^2 - abi + abi - b^2i^2 = a^2 + b^2
$$
</div>

This quantity $a - bi$ is called the *complex conjugate* of $z$ (denoted as $z^*$), it implies that

<div>
$$
zz^* = |z|^2
$$
</div>

#### Inverse

<div>
$$
z^{-1} = \frac{1}{z}
$$
</div>

Multiplying the numerator and denominator with the conjugate of $z$ (so that we have a real part on the denominator)

<div>
$$
z^{-1} = \frac{1}{z} \frac{z^*}{z^*} = \frac{z^*}{zz^*} = \frac{z^*}{|z|^2}
$$
</div>

#### Square root of $i$

We're trying to find a complex number $z$ such that

<div>
$$
\sqrt{i} = z \\
i = z^2
$$
</div>

Assuming that $z$ is the complex number $z = a + bi$

<div>
$$
\begin{align}
i &= (a + bi)^2 \nonumber \\
&= (a + bi)(a + bi) \nonumber \\
&= a^2 - b^2 + 2abi \label{square-imaginary}
\end{align}
$$
</div>

Therefore

<div>
$$
(a^2 - b^2) + (2ab)i = 0 + 1i
$$
</div>

Equaling real and imaginary parts

<div>
$$
\begin{align*}
a^2 - b^2 &= 0 \\
2ab = 1
\end{align*}
$$
</div>

Therefore $a = \pm b$, replacing $a = -b$ in the second equation we obtain $-2b^2 = 1$ which is not satisfied by any real number $b$ therefore the case $a = -b$ is impossible, replacing $a = b$ in the second equation we obtain $2a^2 = 1$ so

<div>
$$
2a^2 = 1 \\
a^2 = \frac{1}{2} \\
a = b = \pm \sqrt{\frac{1}{2}} = \pm \frac{1}{\sqrt{2}}
$$
</div>

Finally the value of $\sqrt{i}$ is

<div>
$$
\sqrt{i} = (a + bi) = \pm{\frac{1}{\sqrt{2}}} (1 + i)
$$
</div>

The value of $\sqrt{-i}$ is found in the same way (by replacing $b = -a$ in the equation $-2ab = 1$ found from multiplying \eqref{square-imaginary} by $-1$)

<div>
$$
\sqrt{-i} = (a + bi) = \pm{\frac{1}{\sqrt{2}}} (1 - i)
$$
</div>

### Matrix representation of a complex number

The matrix $C$ for a complex number is the sum of two other matrices representing the real $R$ and imaginary $I$ parts:

<div>
$$
C = R + I
$$
</div>

which can be written as

<div>
$$
C = a \hat{R} + b \hat{I} \quad\quad a, b \in \mathbb{R}
$$
</div>

Where $R = 1$ and $I = i$

The matrix representation of $R = 1$ in 2d is the identity matrix

<div>
$$
\begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix}
$$
</div>

To find the matrix representation of $i$ we have to analyze the definition of $i$ which is *a quantity* which squares to $-1$, given that we already know the value of $1$ in matrix form

<div>
$$
\begin{align*}
i^2 &= -1 * \begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix} \\
&= \begin{bmatrix}
-1 & 0 \\
0 & -1
\end{bmatrix}
\end{align*}
$$
</div>

Squaring the following matrix gives the matrix above, then the value of $i$ expressed in matrix form is

<div>
$$
I = \begin{bmatrix}
0 & -1 \\
1 & 0
\end{bmatrix}
$$
</div>

Finally the value of $C$ is

<div>
$$
C = a \begin{bmatrix}
1 & 0 \\
0 & 1
\end{bmatrix} + b \begin{bmatrix}
0 & -1 \\
1 & 0
\end{bmatrix} =
\begin{bmatrix}
a & -b \\
b & a
\end{bmatrix}
$$
</div>

### The complex plane

The powers of $i$ give rise to the sequence $(1, i, -1, -i, 1, \ldots)$ which is quite similar to the pattern
$(x, y, -x, -y, x, \ldots)$, the resemblance is no coincidence as complex number belong to a 2-dimensional plane, this complex plane allows us to visualize complex numbers using the horizontal axis for the real part and the vertical axis for the imaginary part

<div id="complex-plane"></div>
<div class="center">$1, i, -1, -i$</div>

We can see that the positions of $i^0 = 1, i^1 = i, i^2 = -1, i^3 = -i, \ldots$ suggest that the multiplication of a complex number by $i$ is equivalent to rotating through 90 degrees

e.g.

<div>
$$
\begin{align*}
z_1 &= 2 + i \\
z_2 &= (2 + i)(i) = -1 + 2i \\
z_3 &= (-1 + 2i)(i) = -2 - i \\
z_4 &= (-2 - i)(i) = 1 - 2i \\
z_5 &= (1 - 2i)(i) = 2 + i = z_1
\end{align*}
$$
</div>

<div id="complex-2-i"></div>

> A complex number is rotated $\pm 90^{\circ}$ by multiplying it by $\pm i$

Let's graph the roots of $\sqrt{i} = \pm \frac{1}{\sqrt{2}} (1 + i)$

<div id="complex-square-root"></div>

We can see that $\tfrac{1}{\sqrt{2}} (1 + i)$ is exactly at $45^{\circ}$ and $- \tfrac{1}{\sqrt{2}} (1 + i)$ is exactly at $225^{\circ}$

Let's multiply the complex number $2 + i$ by $\sqrt{i}$ (it should rotate it by $45^{\circ}$)

<div>
$$
\begin{align*}
z_1 &= 2 + i \\
z_2 &= (2 + i)(\sqrti + \sqrti i) = \sqrti + 3 \sqrti i
\end{align*}
$$
</div>

<div id="complex-45"></div>

Multiplying $z_2$ by $\sqrt{i}$ again should be equal to multiplying $z_1$ by $i$ (because $z_2$ is already rotated by $45^{\circ}$)

<div>
$$
\begin{align*}
z_2 &= \sqrti + 3 \sqrti i \\
z_3 &= (\sqrti + 3 \sqrti i)(\sqrti + \sqrti i) \\
&= (\frac{1}{2} - \frac{3}{2}) + (\frac{1}{2} + \frac{3}{2})i \\
&= -1 + 2i
\end{align*}
$$
</div>

Which is exactly what we find if we multiply $z_i$ by $i$, these observations suggest that we can build a complex number which can rotate another complex number by any angle

> A complex number is rotated $45^{\circ}$ by multiplying it by $\sqrti + \sqrti i$

> A complex number is rotated $225^{\circ}$ by multiplying it by $-\sqrti + \sqrti i$

### Polar representation

Instead of using coordinates in the complex plane we can represent a polar number with the length of the vector from the origin to the complex coordinate and the angle between the complex vector and the positive real axis

<div>
$$
r = |z| = \sqrt{a^2 + b^2} \\
\theta = arctan(\frac{b}{a})
$$
</div>

The horizontal component of $z$ is then $r * cos(\theta)$ and the vectical component is $r * sin(\theta)$, expressing the complex number using these quantities

<div>
$$
\begin{align*}
z &= a + bi \\
&= r * \cos \theta + ri\; \sin \theta \\
&= r \; (\cos \theta + i \sin \theta)
\end{align*}
$$
</div>

Euler provided the identity

<div>
$$
\begin{equation}\label{rotor}
e^{i\theta} = \cos \theta + i \sin \theta
\end{equation}
$$
</div>

Which allows us to represent any complex number as

<div>
$$
z = r\,e^{i\theta}
$$
</div>

Given two polar numbers

<div>
$$
z = r\,e^{i\theta} \\
w = s\,e^{i\phi} \\
$$
</div>

Their product is

<div>
$$
zw = rs\, e^{i(\theta + \phi)} = rs [ \cos (\theta + \phi) + i \sin (\theta + \phi)]
$$
</div>

Which effectively rotated the complex number $z$ by $\phi$ angles! However the quantity $zw$ was scaled $s$ units, to avoid scalling we can normalize $w$ (i.e. making $r = 1$ which is equal to \eqref{rotor})

> A *rotor* is a complex number that rotates another complex number by an angle $\theta$ (through multiplication) and has the form
>
<div>
$$
e^{i\theta} = \cos \theta + i \sin \theta
$$
</div>

Rotating a complex number $x + yi$ by an angle $\theta$

<div>
$$
\begin{align*}
x' + y'i &= (x + yi)(\cos \theta + i \sin \theta) \\
&= (x \cos \theta - y \sin \theta) + (x \sin \theta + y \cos \theta)i
\end{align*}
$$
</div>

Which in matrix form is

<div>
$$
\begin{bmatrix}
x' & -y' \\
y' & x'
\end{bmatrix} = \begin{bmatrix}
x & -y \\
y & x
\end{bmatrix} \begin{bmatrix}
\cos \theta & -\sin \theta \\
\sin \theta & \cos \theta
\end{bmatrix}
$$
</div>

Note that because of the way the complex product is defined, the multiplication between two complex numbers commutes

<div>
$$
\begin{align*}
x' + y'i &= (\cos \theta + i \sin \theta)(x + yi)\\
&= (x \cos \theta - y \sin \theta) + (x \sin \theta + y \cos \theta)i
\end{align*}
$$
</div>

<script src="/js/math/numeral-systems/complex-numbers.js"></script>
