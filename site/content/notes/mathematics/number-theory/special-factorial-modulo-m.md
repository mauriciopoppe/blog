---
title: "Special factorial modulo p"
description: |
  Let $n!_{\\%p}$ be a special factorial where $n!$ is divided by the maximum exponent of $p$
  that divides $n!$. This article describes this problem and its solution with
  an implementation in C++.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "prime numbers", "modular arithmetic", "divisibility"]
date: 2015-06-09 14:00:03
---

Let $n!_{\\%p}$ be a special factorial where $n!$ is divided by the maximum exponent of $p$ that divides $n!$

<div>$$
n!_{\%p} = \frac{n!}{d_p(n!)}
$$</div>

Where $d_p(n!)$ is called [Legendre's Formula](http://www.wikiwand.com/en/Legendre%27s_formula) which is explained in detail in [this article](./prime-factors-factorial.html)

> Compute $n!_{\\%p} \pmod{p}$ given that $p$ is a prime number

First let's write this special factorial explicitely

<div>$$
\begin{equation} \label{explicit}
n!_{\%p} = \tfrac{1 \cdot 2 \cdot \ldots \cdot (p - 1) \cdot p \cdot (p + 1) \cdot \ldots \cdot (2p - 1) \cdot 2p \cdot (2p + 1) \cdot \ldots \cdot (kp - 1) \cdot kp \cdot (kp + 1) \cdot \ldots \cdot (n - 1) \cdot n}{p^{ \tfrac{n}{p} + \tfrac{n}{p^2} + ... }}
\end{equation}
$$</div>

The number $kp$ is a number that is divisible by $p$, we also see that $k$ might be a composite number that could be divisible by $p$ again

Now let's first divide the equation by $p^{ \tfrac{n}{p} }$ which is exactly the number of multiples of $p$

<div>$$
n!_{\%p} = \tfrac{1 \cdot 2 \cdot \ldots \cdot (p - 1) \cdot 1 \cdot (p + 1) \cdot \ldots \cdot (2p - 1) \cdot 2 \cdot (2p + 1) \cdot \ldots \cdot (kp - 1) \cdot k \cdot (kp + 1) \cdot \ldots \cdot (n - 1) \cdot n}{p^{ \tfrac{n}{p^2} + ... }}
$$</div>

If we apply the modulo operation to each term except the multiples of $p$ we have

<div>$$
n!_{\%p} = \tfrac{1 \cdot 2 \cdot \ldots \cdot (p - 1) \cdot 1 \cdot 1 \cdot 2 \cdot \ldots \cdot (p - 1) \cdot 2 \cdot 1 \cdot 2 \cdot \ldots \cdot (p - 1) \cdot p \cdot 1 \cdot 2 \cdot \ldots \cdot (p - 1) \cdot kp}{p^{ \tfrac{n}{p^2} + ... }} \cdot 1 \cdot 2 \cdot \ldots \cdot (n - 1) \cdot n
$$</div>

NOTE: we're not applying the modulo operator to each multiple of $p$ because they don't actually exist since there are no $p$ factors in the equation, they are reduced with posterior divisions by $p^{ \tfrac{n}{p^i} }$

NOTE: the number $kp$ described in \eqref{explicit} just denotes a multiple of $p$

We see that the expression $1 \cdot 2 \cdot \ldots \cdot (p - 1)$ is repeated many times in the equation above + a product of some additional terms which don't form an entire sequence, let $c = 1 \cdot 2 \cdot \ldots \cdot (p - 1)$ then

<div>$$
n!_{\%p} = \tfrac{1c \cdot 2c \cdot \ldots \cdot (p - 1)c \cdot pc \cdot (p + 1)c \cdot \ldots \cdot (kp - 1)c \cdot kpc}{p^{ \tfrac{n}{p^2} + ... }} \cdot 1 \cdot 2 \cdot \ldots \cdot (n - 1) \cdot n
$$</div>

Since each $c$ factor occurs in every contiguous sequence of length $p$ there are exactly $\left \lfloor \tfrac{n}{p} \right \rfloor$ $c$ factors, factoring $c$ we have

<div>$$
n!_{\%p} = c^{\left \lfloor \tfrac{n}{p} \right \rfloor} \cdot \tfrac{1 \cdot 2 \cdot \ldots \cdot (p - 1) \cdot p \cdot (p + 1) \cdot \ldots \cdot (2p - 1) \cdot 2p \cdot (2p + 1) \cdot \ldots \cdot (kp - 1) \cdot kp}{p^{ \tfrac{n}{p^2} + ... }} \cdot 1 \cdot 2 \cdot \ldots \cdot (n - 1) \cdot n
$$</div>

Note that the term multiplying $c^{\left \lfloor \tfrac{n}{p} \right \rfloor}$ is the same as \eqref{explicit}, we now have to divide it by $p^{ \tfrac{n}{p^2} }$ which is exactly the number of multiples of $p^2$ (NOTE: $kp$ is a multiple of $p$ but might/might not be a multiple of $p^2$)

This observation leads to a recursive implementation

Complexity: $O(p \, log_p{n})$

{{< snippet file="static/code/math/specialFactorialModuloP.cpp" lang="cpp" />}}

## Applications

### Finding the value of $nCr \% p$

We can quickly calculate the value of $nCr \% p$, we can compute the maximum exponents of $p$ in $n!$, $(n - r)!$ and $r!$, let those numbers be $p^a$, $p^b$ and $p^c$ then $nCr$ can be expressed as

<div>$$
nCr = \binom{p^a \cdot \ldots}{p^b \cdot p^c \ldots}
$$</div>

Which means that $nCr$ will be a multiple of $p$ when $a - b - c > 0$, if $a - b - c = 0$ then the number is equal to

<div>$$
nCr = \frac{n!_{\%p}}{(n - r)!_{\%p} \cdot r!_{\%p}}
$$</div>

NOTE: $a - b - c$ can never be less than zero, that would imply that $nCr$ is not an integer

The denominator can be found using the modular multiplicative inverse of $(n - r)!\_{\\%p}$ and $r!\_{\\%p}$

{{< snippet file="static/code/math/nCrModP.cpp" lang="cpp" />}}

### Problems to solve

- [Codechef - CB01](http://www.codechef.com/problems/CB01/)
