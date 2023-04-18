---
title: "Discrete Logarithm"
description: |
  The discrete logarithms finds a solution for $x$ in the congruence $a^x \equiv b \pmod{n}$ where
  $a$, $b$ and $n$ are **integers**, $a$ and $n$ are coprime. I cover two algorithms to solve this
  problem: by trial multiplication and using baby step giant step.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "discrete logarithm"]
date: 2015-06-08 12:11:38
categories: algorithms number-theory
---

Let $a$, $b$ and $x$ be positive real numbers such that

<div>$$
a^x = b
$$</div>

And we want to find the value of $x$, applying logarithms

<div>$$
x \cdot log(a) = log(b)
$$</div>

Finally

<div>$$
x = \frac{log(b)}{log(a)}
$$</div>

The **discrete logarithm** problem is an analogue of this problem with the condition that all the numbers exist in the ring of integers modulo $n$

> Let $a$, $b$ and $n$ be **integers**, where $a$ and $n$ are coprime, find the value of $x$ in
>
<div>$$
a^x \equiv b \pmod{n}
$$</div>

## Trial multiplication

The brute force algorithm consists in computing all possible $a^i \pmod{n}$, where $i \geq 0 < n$ until one matches $b$

*Example:* given $n = 11$, $a = 2$, $b = 9$ find the value of $x$ in $a^x \equiv b \pmod{n}$

<div>$$
\begin{align*}
a^0 &\equiv 1 \pmod{11} \\
a^1 &\equiv 2 \pmod{11} \\
a^2 &\equiv 4 \pmod{11} \\
a^3 &\equiv 8 \pmod{11} \\
a^4 &\equiv 16 \equiv 5 \pmod{11} \\
a^5 &\equiv 32 \equiv 10 \pmod{11} \\
a^6 &\equiv 64 \equiv 9 \pmod{11}
\end{align*}
$$</div>

$x = 6$ is a solution to the problem

## Baby Step Giant Step

The idea of Shank's baby step giant step algorithm is based on rewriting $x$ in the congruence above as $x = im + j$ where $m = \sqrt{n}$, $0 \leq i < m$ and $0 \leq j < m$ so

<div>$$
a^{im + j} \equiv b \pmod{n}
$$</div>

multiplying both sides by $a^{-im}$ (note that this is possible because $a$ and $n$ are coprime)

<div>$$
a^j \equiv b(a^{-m})^i \pmod{n}
$$</div>

If we find $i$ and $j$ so that this holds then we have found an exponent $x$

Note: $a^{-m}$ can be computed using the modular multiplicative inverse of $a$, then computing the $m$-th power of the inverse $\pmod{n}$


{{< snippet file="static/code/math/babyStepGiantStep.cpp" lang="cpp" />}}

