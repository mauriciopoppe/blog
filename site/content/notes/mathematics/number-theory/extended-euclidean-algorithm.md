---
title:  "Extended Euclidean Algorithm"
summary: |
  The Extended Euclidean Algorithm finds solutions to the equation $ax + by = gcd(a, b)$
  where $x, y$ are unknowns. This article covers a few applications of the Extended Euclidean Algorithm
  like finding the modular multiplicative inverse of a number and finding solutions for
  linear congruence equations.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "divisibility", "modulo", "linear congruence equations", "mudular multiplicative inverse", "extended euclidean algorithm", "euclidean algorithm", "diophantine equations"]
libraries: ["math"]
date:   2015-06-02 12:00:00
---

## Bezout's identity

For **non-zero integers** $a$ and $b$, let $d$ be the greatest common divisor $d = gcd(a, b)$. Then there exist integers $x$ and $y$ such that

<div>$$
\begin{equation} \label{bezout}
ax + by = d
\end{equation}
$$</div>

If $a$ and $b$ are relatively prime, then $gcd(a, b) = 1$ and by Bezout's Identity, there are integers $x$ and $y$ such that

<div>$$
ax + by = 1
$$</div>

**Example:** $3x + 8y = 1$, one solution is $x = 3$ and $y = -1$.

## Extended Euclidean Algorithm

See [divisibility](../divisibility/) for more details.

### Implementation

{{< snippet file="static/code/math/extendedEuclideanAlgorithm.cpp" lang="cpp" />}}

## Applications

### Diophantine equations

Equations with integer variables and coefficients are called *Diophantine equations*. The simplest non-trivial linear equation has the form

<div>$$
\begin{equation}\label{linear-diophantine-equation}
ax + by = c
\end{equation}
$$</div>

Where $a, b, c$ are given integers and $x, y$ are unknown integers

Using the *Extended Euclidean Algorithm* it's possible to find $x$ and $y$ given that $c$ is divisible by $gcd(a, b)$. Otherwise the equation has no solutions. This follows the fact that a linear combination of two numbers continues to be divided by their common divisor. Starting with \eqref{bezout}

<div>$$
ax_g + by_g = gcd(a, b)
$$</div>

Multiplying it by $\tfrac{c}{gcd(a, b)}$

<div>$$
\begin{equation}\label{diophantine-equation-gcd}
a \cdot x_g \cdot \Big( \frac{c}{gcd(a, b)} \Big) + b \cdot y_g \cdot \Big( \frac{c}{gcd(a, b)} \Big) = c
\end{equation}
$$</div>

then one of the solutions is given by

<div>$$
ax_0 + by_0 = c
$$</div>

where

<div>$$
\begin{cases}
x_0 = x_g \cdot \big( \frac{c}{gcd(a, b)} \big) \\
y_0 = y_g \cdot \big( \frac{c}{gcd(a, b)} \big)
\end{cases}
$$</div>

we can find all of the solutions by replacing $x_0$ by $x_0 + \tfrac{b}{gcd(a, b)}$ and $y_0$ by $y_0 - \tfrac{a}{gcd(a, b)}$

<div>$$
a \cdot \Big( x_0 + \tfrac{b}{gcd(a, b)} \Big) + b \cdot \Big( y_0 - \tfrac{a}{gcd(a, b)} \Big) = ax_0 + \tfrac{ab}{gcd(a, b)} + by_0 - \tfrac{ab}{gcd(a, b)} = ax_0 + by_0 = c
$$</div>

This process can be repeated for any number in the form

<div>$$
\begin{cases}
x = x_0 + k \cdot \big( \frac{b}{gcd(a, b)} \big) \\
y = y_0 - k \cdot \big( \frac{a}{gcd(a, b)} \big)
\end{cases}
$$</div>

Where $k \in \mathbb{Z}$

{{< snippet file="static/code/math/linearDiophantineSolver.cpp" lang="cpp" />}}

### Modular multiplicative inverse

See [Modular Arithmetic](../modular-arithmetic/) for more info.

### Linear congruence equations

A linear congruence is a congruence $\pmod p$ of the form

<div>$$
ax \equiv b \pmod m
$$</div>

By the definition of the congruence relation $m \mid ax - b$

<div>$$
ax - b = my
$$</div>

Reordering the equation

<div>$$
ax - my = b
$$</div>

This is a linear Diophantine equation discussed above. It's solvable only if $b$ is divisible by $gcd(a, m)$. Additionally, $gcd(a, m)$ tells us the number of distinct solutions in the ring of integers modulo $m$

---

https://brilliant.org/wiki/bezouts-identity/?subtopic=integers&chapter=greatest-common-divisor-lowest-common-divisor#proof
http://www.ugrad.cs.ubc.ca/~cs490/Spring05/notes/nt1.pdf
