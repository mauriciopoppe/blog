---
title: "Chinese Remainder Theorem"
description: |
  The chinese remainder theorem (CRT) is a theorem that deals with finding a
  solution to a system of congruences.

  <br />
  This article covers the defition of the CRT and an example implementation in C++.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "chinese remainder theorem", "congruences"]
libraries: ["math"]
date: 2015-06-05 12:00:00
categories: algorithms math
---

Let $p_1, p_2, \ldots, p_n$ be distinct numbers relatively prime, for any integers $a_1, a_2, \ldots, a_n$ there's an integer $x$ such that

<div>$$
\begin{align*}
x &\equiv a_1 \pmod{p_1} \\
x &\equiv a_2 \pmod{p_2} \\
 & \; \vdots \\
x &\equiv a_n \pmod{p_n} \\
\end{align*}
$$</div>

All the solutions of this system are congruent modulo $p_1p_2 \ldots p_n$

[nrich's article on the chinese remainder](http://nrich.maths.org/5466) illustrates the system of equations with a coordinate system in $n$-dimensions, basically a number can represent a point in the coordinate system defined by the equation system and the point itself is a sum of unit vectors scaled by some amount

Example: Represent the number $17$ in the coordinate system defined by the integers that belong to the set of integers $\mathbb{Z}/5$, $\mathbb{Z}/7$ and $\mathbb{Z}/11$ ($\mathbb{Z}/n$ has $n$ elements which are all the number in the range $0, 1, \ldots, n - 1$)

The statement above is equivalent to

<div>$$
\begin{align*}
17 &\equiv x \equiv 2 \pmod{5} \\
17 &\equiv x \equiv 3 \pmod{7} \\
17 &\equiv x \equiv 6 \pmod{11}
\end{align*}
$$</div>

We can see that $17$ is represented by the point $(2, 3, 6)$

What we want to do is the opposite, that is find the number whose representation in the coordinate system defined by the integers that belong to the set of integers $\mathbb{Z}/p_1, \mathbb{Z}/p_2, \ldots, \mathbb{Z}/p_n$ results in the point $(a_1, a_2 \ldots, a_n)$

What we can do is express these conditions as a sum of scaled unit vectors that belong to each of axis of the coordinate systems, this means that a point $(a_1, a_2 \ldots, a_n)$ can be represented as

<div>$$
a_1(1, 0, 0, \ldots, 0) + a_2(0, 1, 0, 0, \ldots, 0) + \ldots + a_n(0, 0, \ldots, 0, 1) = (a_1, a_2, \ldots, a_n)
$$</div>

If we represent each point as $x_i$

<div>$$
\begin{equation}\label{chinese-remainder-as-points}
a_1x_1 + a_2x_2 + \ldots + a_nx_n = (a_1, a_2, \ldots, a_n)
\end{equation}
$$</div>

Let's take the first term of the sum, $x_1$ is a number which must fulfill the following equivalences for each axis of the coordinate system

<div>$$
\begin{align*}
x_1 &\equiv 1 \pmod{p_1} \\
x_1 &\equiv 0 \pmod{p_2} \\
 & \vdots \\
x_1 &\equiv 0 \pmod{p_n} \\
\end{align*}
$$</div>

From the system of equations above we can see that $x_1 \mid p_2p_3 \ldots p_n$ which means that $x_1$ is some multiple of the multiplication i.e. $x_1' = p_2p_3 \ldots p_n \cdot x_1$

<div>$$
p_2p_3 \ldots p_n \cdot x_1 \equiv 1 \pmod{p_1}
$$</div>

Given the fact that $p_2p_3 \ldots p_n$ is relatively prime to $p_1$ the product has a modular multiplicative inverse which can be found using the extended euclidean algorithm, in fact we have to solve $n$ of this equations each having the form

<div>$$
\frac{p_1p_2 \ldots p_n}{p_i} \cdot x_i \equiv 1 \pmod{p_i}
$$</div>

Finally we have to plug these values into the equation \eqref{chinese-remainder-as-points}

{{< snippet file="static/code/math/chineseRemainder.cpp" lang="cpp" />}}
