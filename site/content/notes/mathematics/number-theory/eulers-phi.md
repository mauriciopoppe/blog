---
title:  "Euler's phi function"
summary: |
  *Euler's phi function* represented as $\phi(n)$ gives, for a number $n$, the number of coprimes in the range $[1..n]$; in other words, the quantity of numbers in the range $[1..n]$ whose greatest common divisor with $n$ is the unity. In this article, I try to explain how it works and implement it in C++.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "divisibility", "euler's phi function", "prime numbers", "greatest common divisor", "gcd"]
libraries: ["math"]
date:   2015-06-01 00:00:00
---

### Examples

<div>$$
\begin{align*}
\phi(1) &= 1 \quad (1) \\
\phi(2) &= 1 \quad (1) \\
\phi(3) &= 2 \quad (1, 2) \\
\phi(4) &= 2 \quad (1, 3) \\
\phi(5) &= 4 \quad (1, 2, 3, 4) \\
\phi(6) &= 2 \quad (1, 5)
\end{align*}
$$</div>

### Properties

The following three properties will allow us to calculate it for any number:

- if $p$ is a prime, then $\phi(p) = p - 1$

**Proof:** Obviously, since $p$ is a prime, the only divisors that it has are $1$ and $p$, but $gcd(1, p) = 1$ so $1$ falls under the definition of the Euler function; therefore, the only divisor valid for the Euler function for the case above is $p$.

- if $p$ is a prime and $k \geq 1$ a positive integer, then $\phi(p^k) = p^k - p^{k-1}$.

**Proof:** Since the multiples of $p$ that are less than or equal to $p^k$ are $p, 2p, 3p, ..., p^{k-1}p \leq p^k$, we can see that in total there are $p^{k-1}$ numbers; therefore, the other $p^k - p^{k-1}$ are relatively coprime to $p^k$.

**Example:**

$\phi(2^4)$

Multiples of $2$ less than $2^4$ are $1 \cdot 2, 2 \cdot 2, 3 \cdot 2, 4 \cdot 2, 5 \cdot 2, 6 \cdot 2, 7 \cdot 2, 8 \cdot 2$, which are in total $2^3$ elements. Therefore, the other $2^4 - 2^3$ are relatively prime to $2^4$.

- if $a$ and $b$ are relatively prime, then $\phi(ab) = \phi(a)\phi(b)$

### Computation

Given a number $n$, let's decompose it into prime factors (factorization):

<div>$$
n = p_1^{a_1} \cdot p_2^{a_2} \cdot ... \cdot p_k^{a_k}
$$</div>

Applying the Euler function we get:

<div>$$
\begin{align*}
\phi(n) &= \phi(p_1^{a_1}) \cdot \phi(p_2^{a_2}) \cdot ... \cdot \phi(p_k^{a_k}) \\
&= (p_1^{a_1} - p_1^{a_1 - 1}) \cdot (p_2^{a_2} - p_2^{a_2 - 1}) \cdot ... \cdot (p_k^{a_k} - p_k^{a_k - 1}) \\
&= (p_1^{a_1} - \frac{p_1^{a_1}}{p_1}) \cdot (p_2^{a_2} - \frac{p_2^{a_2}}{p_2}) \cdot ... \cdot (p_k^{a_k} - \frac{p_k^{a_k}}{p_k}) \\
&= p_1^{a_1} (1 - \frac{1}{p_1}) \cdot p_2^{a_2} (1 - \frac{1}{p_2}) \cdot ... \cdot p_k^{a_k} (1 - \frac{1}{p_k}) \\
&= p_1^{a_1} \cdot p_2^{a_2} \cdot ... \cdot p_k^{a_k} \cdot (1 - \frac{1}{p_1}) \cdot (1 - \frac{1}{p_2}) \cdot ... \cdot (1 - \frac{1}{p_k}) \\
&= n \cdot (1 - \frac{1}{p_1}) \cdot (1 - \frac{1}{p_2}) \cdot ... \cdot (1 - \frac{1}{p_k}) \\
&= n \prod_{p|n}(1 - \frac{1}{p})
\end{align*}
$$</div>

### Implementation

Time complexity: $O(\sqrt{n})$
Space: $O(1)$

{{< snippet file="static/code/math/eulerphi.cpp" lang="cpp" />}}

### Problems
[10179 - Irreducable Basic Fractions](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1120)
[10299 - Relatives](http://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1240)
[11327 - Enumerating Rational Numbers](https://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2302)

