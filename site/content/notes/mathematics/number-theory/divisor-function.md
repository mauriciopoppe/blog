---
title: "Divisor Function"
description: |
  The divisor function returns the number of divisors of an integer. This article
  covers important relations of the divisor function and 
  prime numbers.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "divisor function", "prime numbers"]
date: 2015-06-13 14:29:59
---

The divisor function represented as $d(n)$ counts the number of divisors of an integer

example: $d(18)$

The numbers that divide $18$ are $1, 2, 3, 6, 9, 18$ then $d(18) = 6$

## Important observations

- if $p$ is a prime number then $d(p) = 2$, also $d(p^k) = k + 1$ because every power of $p$ is a divisor of $p^k$, e.g. $p^0, p^1, p^2, \ldots, p^k$
- if $n$ is a product of two distinct primes, say $n = pq$ then $d(pq) = d(p) \cdot d(q)$, also $d(p^iq^j) = d(p^i) \cdot d(q^j)$
- in general let $n = p_1^{a_1} \cdot p_2^{a_2} \cdot \ldots \cdot p_n^{a_n}$ then $d(n) = d(p_1^{a_1}) \cdot d(p_2^{a_2}) \cdot \ldots \cdot d(p_n^{a_n})$ where $p_i$ is a prime factor that divides $n$

example: $d(18)$

<div>$$
\begin{align*}
d(18) &= d(3^2 \cdot 2) \\
&= d(3^2) \cdot (2) \\
&= 3 \cdot 2 \\
&= 6
\end{align*}
$$</div>

{{< snippet file="static/code/math/divisorFunction/divisorFunction.cpp" lang="cpp" />}}

## Sum of divisors

The sum of divisors is another important quantity represented by $\sigma_k(n)$, it's the sum of the $k$-th powers of the divisors of $n$

<div>$$
\sigma_k(n) = \sum_{d|n} d^k
$$</div>

examples:

<div>$$
\begin{align*}
\sigma_0(18) &= 1^0 + 2^0 + 3^0 + 6^0 + 9^0 + 18^0 \\
&= 1 + 1 + 1 + 1 + 1 \\
&= 6
\end{align*}
$$</div>

So when $k = 0$ the sum of divisors ($\sigma_0{n}$) function is equal to $d(n)$, i.e. $\sigma_0(n)$ gives the number of divisors of $n$

another example:

<div>$$
\begin{align*}
\sigma_1(18) &= 1^1 + 2^1 + 3^1 + 6^1 + 9^1 + 18^1 \\
&= 1 + 2 + 3 + 6 + 9 + 18 \\
&= 39
\end{align*}
$$</div>

when $k = 1$ we actually get the function we expect (a function which sums the divisors)

### Important observations

- if $p$ is a prime number then $\sigma(p) = 1 + p$ since the only divisors of a prime number are $1$ and $p$
- if $p$ is a prime number then $\sigma(p^k) = 1 + p + p^2 + \ldots + p^k$ because every power of $p$ is a divisor of $p^k$, e.g. $p^0, p^1, p^2, \ldots, p^k$

Consider

<div>$$
\begin{equation}\label{sigma-p-k}
\sigma(p^k) = 1 + p + p^2 + \ldots + p^k
\end{equation}
$$</div>

multiplying the expression by $p$ we have

<div>$$
\begin{equation}\label{sigma-p-k-times-p}
p \cdot \sigma(p^k) = p + p^2 + p^3 + \ldots + p^{k + 1}
\end{equation}
$$</div>

subtracting \eqref{sigma-p-k} from \eqref{sigma-p-k-times-p}

<div>$$
p \cdot \sigma(p^k) - \sigma(p^k) = p^{k + 1} - 1
$$</div>

factoring $\sigma(p^k)$

<div>$$
\sigma(p^k) (p - 1) = p^{k + 1} - 1
$$</div>

hence

<div>$$
\sigma(p^k) = \frac{p^{k + 1} - 1}{p - 1}
$$</div>

- if $p$ is a product of two distinct primes say $n = pq$ then $\sigma(pq) = \sigma(p) \cdot \sigma(q)$, also $\sigma(p^iq^j) = \sigma(p^i) \cdot \sigma(q^j)$

- in general let $n = p_1^{a_1} \cdot p_2^{a_2} \cdot \ldots \cdot p_n^{a_n}$ then $\sigma(n) = \sigma(p_1^{a_1}) \cdot \sigma(p_2^{a_2}) \cdot \ldots \cdot \sigma(p_n^{a_n})$ where $p_i$ is a prime factor that divides $n$

example: $\sigma(18)$

<div>$$
\begin{align*}
\sigma(18) &= \sigma(3^2 \cdot 2) \\
&= \sigma(3^2) \cdot \sigma(2) \\
&= \frac{3^3 - 1}{3 - 1} \cdot \frac{2^2 - 1}{2 - 1} \\
&= 13 \cdot 3 \\
&= 39
\end{align*}
$$</div>

{{< snippet file="static/code/math/divisorFunction/sumOfDivisorFunction.cpp" lang="cpp" />}}
