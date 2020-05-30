---

title:  "Extended Euclidean Algorithm"
date:   2015-06-02 12:00:00
categories: algorithms math
---

## Bezout's identity

For **non-zero integers** $a$ and $b$, let $d$ be the greatest common divisor $d = gcd(a, b)$. Then there exists integers $x$ and $y$ such that

<div>$$
\begin{equation} \label{bezout}
ax + by = d
\end{equation}
$$</div>

If $a$ and $b$ are relatively prime then $gcd(a, b) = 1$ and by Bezout's Identity there are integers $x$ and $y$ such that

<div>$$
ax + by = 1
$$</div>

*Example:* $3x + 8y = 1$, one solution is $x = 3$ and $y = -1$

## Extended Euclidean Algorithm

By reversing the steps of the [Euclidean algorithm](./euclidean-algorithm.html) it's possible to find these integers $x$ and $y$, by repeated applications of the euclidean division algorithm we have

<div>$$
\begin{align*}
a &= b q_1 + r_1 \\
b &= r_1 q_2 + r_2 \\
& \; \vdots \\
r_{n-3} &= r_{n - 2} q_{n - 1} + r_{n - 1} \\
r_{n-2} &= r_{n - 1} q_{n} + r_{n} \\
r_{n-1} &= r_n q_{n + 1}
\end{align*}
$$</div>

Where $r_n = gcd(a, b)$, rewriting $r_n$ in terms of the previous $r_i$

<div>$$
r_n = r_{n - 2} - r_{n - 1} q_n
$$</div>

Substituting for $r_{n - 1}$ from the previous equation

<div>$$
\begin{align*}
r_n &= r_{n - 2} - (r_{n - 3} - r_{n - 2} q_{n - 1}) q_n \\
r_n &= r_{n - 2} (1 + q_n q_{n - 1}) - r_{n - 3} q_n \\
r_n &= r_{n - 2}m + r_{n - 3}n \\
\end{align*}
$$</div>

<!--
Substituting for $r_{n - 2}$
<div>$$
\begin{align*}
r_n &= (r_{n - 4} - r_{n - 3} q_{n - 2})m + r_{n - 3}n \\
r_n &= r_{n - 3}(n - q_{n - 2}m) + r_{n - 4}m
\end{align*}
$$</div>
 -->

Where $m = 1 + q_n q_{n - 1}$ and $n = -q_n$, this process is repeated until $r_n = ax + by$ where $x$ and $y$ are integers

Since $ax + by = gcd(a, b)$ it's also true that

<div>$$
\begin{equation}\label{iteration}
bx_1 + (a \% b)y_1 = gcd(a, b)
\end{equation}
$$</div>

Where $(x_1, y_1)$ are solutions to the new tuple $(b, a \% b)$, converting the value of $a \% b$

<div>$$
a \% b = a - \left \lfloor \frac{a}{b} \right \rfloor \cdot b
$$</div>

Substituting this value in \eqref{iteration}

<div>$$
\begin{align*}
b \cdot x_1 + \Big(a - \left \lfloor \frac{a}{b} \right \rfloor \cdot b \Big) \cdot y_1 &= gcd(a, b) \\
b \cdot x_1 + a \cdot y_1 - \left \lfloor \frac{a}{b} \right \rfloor \cdot b \cdot y_1 &= gcd(a, b) \\
a \cdot y_1 + b \Big( x_1 - \left \lfloor \frac{a}{b} \right \rfloor \cdot y_1 \Big) &= gcd(a, b)
\end{align*}
$$</div>

Comparing to the original expression \eqref{bezout} we obtain the required coefficients $x$ and $y$ based on subsequent values found

<div>$$
x = \begin{cases}
1, & \text{when $a \mod b = 0$} \\
y_1, & \text{otherwise}
\end{cases}
$$</div>

<div>$$
y = \begin{cases}
0, & \text{when $a \mod b = 0$} \\
x_1 - \left \lfloor \frac{a}{b} \right \rfloor \cdot y_1, & \text{otherwise}
\end{cases}
$$</div>

### Implementation

{{< snippet file="static/code/math/extendedEuclideanAlgorithm.cpp" lang="cpp" />}}

## Applications

### Diophantine equations

Equations with integer variables and coefficients are called *Diophantine equations*, the simplest non-trivial linear equation has the form

<div>$$
\begin{equation}\label{linear-diophantine-equation}
ax + by = c
\end{equation}
$$</div>

Where $a, b, c$ are given integers and $x, y$ are unknown integers

Using the *extended Euclidean algorithm* it's possible to find $x$ and $y$ given that $c$ is divisible by $gcd(a, b)$ otherwise the equation has no solutions, this follows the fact that a linear combination of two numbers continue to be divided by their common divisor, starting with \eqref{bezout}

<div>$$
ax_g + by_g = gcd(a, b)
$$</div>

multiplying it by $\tfrac{c}{gcd(a, b)}$

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

we can find all of the solutions replacing $x_0$ by $x_0 + \tfrac{b}{gcd(a, b)}$ and $y_0$ by $y_0 - \tfrac{a}{gcd(a, b)}$

<div>$$
a \cdot \Big( x_0 + \tfrac{b}{gcd(a, b)} \Big) + b \cdot \Big( y_0 - \tfrac{a}{gcd(a, b)} \Big) = ax_0 + \tfrac{ab}{gcd(a, b)} + by_0 - \tfrac{ab}{gcd(a, b)} = ax_0 + by_0 = c
$$</div>

This process could be repeated for any number in the form

<div>$$
\begin{cases}
x = x_0 + k \cdot \big( \frac{b}{gcd(a, b)} \big) \\
y = y_0 - k \cdot \big( \frac{a}{gcd(a, b)} \big)
\end{cases}
$$</div>

Where $k \in \mathbb{Z}$

{{< snippet file="static/code/math/linearDiophantineSolver.cpp" lang="cpp" />}}

### Modular multiplicative inverse

Discussed [here](./modular-arithmetic.html#modular-multiplicative-inverse)

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

Which is a linear diophantine equation discussed above, it's solvable only if $b$ is divisible by $gcd(a, m)$, additionally $gcd(a, m)$ tells us the number of distinct solutions in the ring of integers modulo $m$

---

https://brilliant.org/wiki/bezouts-identity/?subtopic=integers&chapter=greatest-common-divisor-lowest-common-divisor#proof
http://www.ugrad.cs.ubc.ca/~cs490/Spring05/notes/nt1.pdf
