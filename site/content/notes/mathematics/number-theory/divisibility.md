---
title: Divisibility
summary: |
  Let $a,b \in \mathbb{Z}$. We say that $a$ _**divides**_ $b$, written $a \given b$, if there's an integer $n$ such that $b = na$. If $a$ divides $b$, then $b$ is _**divisible**_ by $a$, and $a$ is a
  _**divisor or factor**_ of $b$. Also, $b$ is called a _**multiple**_ of $a$.

  <br />
  This article covers the greatest common divisor and how to find it using the Euclidean Algorithm,
  the Extended Euclidean Algorithm to find solutions to the equation $ax + by = gcd(a, b)$ where $x, y$ are unknowns.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "divisibility", "modulo", "euclidean algorithm", "extended euclidean algorithm"]
libraries: ["math"]
date: 2017-05-21 23:18:42
references:
  - http://www.cs.cmu.edu/~adamchik/21-127/lectures/divisibility_1_print.pdf
  - https://math.berkeley.edu/~sagrawal/su14_math55/notes_gcd.pdf
---

> Let $a,b \in \mathbb{Z}$. We say that $a$ _**divides**_ $b$, written $a \given b$, if there's an integer $n$ such that
> $b = na

If $a$ divides $b$, then $b$ is _**divisible**_ by $a$, and $a$ is a _**divisor or factor**_ of $b$. Also, $b$ is called a _**multiple**_ of $a$.

Additional properties of the relation $|$:

1. if $a \given b$ and $b \given c$ then $a \given c$.
2. if $a \given b$ and $c \given d$ then $ac \given bd$.
3. if $d \given a$ and $d \given b$ then $d \given a + b$.
4. if $d \given a$ and $d \given b$ then $d \given ax + by$ for any integers $x, y$.

**Proof.**

1. if $b=ma$ and $c=nb$, then $c=(nm)a.
2. if $b=ma$ and $d=nc$, then $bd=(nm)ac.
3. if $a=md$ and $b=nd$, then $a + b=(m + n)d.
4. if $a=md$, $b=nd$, then $ax=(mx)d$ and $by=(ny)d$; therefore, $ax + by = (mx + ny)d$.

## Division algorithm

> Let $a, b \in \mathbb{Z}$ with $b > 0$, then there exists $q, r \in \mathbb{Z}$ such that
> $a = bq + r, \quad \text{where $0 \le r \lt b$}

**Proof.** If $bq$ is the largest multiple of $b$ that does not exceed $a$, then $r = a - bq$ is positive, and since $b(q + 1) > a$, then $r \lt b$

Also, if $r = 0$, then $a = bq$, which implies that $q \given a$.

## Greatest common divisor

Let $a, b \in \mathbb{N}$, the greatest common divisor of $a$ and $b$, written as $gcd(a,b)$ or $(a,b)$, is the element $d$ in $\mathbb{N}$ such that $d \given a$, and $d \given b$, and every common divisor of $a$ and $b$ also divides $d$.

> Let $a$ and $b$ be two numbers in $\mathbb{N}$, the value of $(a,b)$ is a *linear combination* of $a$ and $b$ i.e. there exists $s,t$ in $\mathbb{Z}$ such that
> $sa + tb = (a, b)$

**Proof.**

Let $d$ be the least positive integer that is a *linear combination* of $a$ and $b$

<div>$$
d = sa + tb
$$</div>

First, let's show that $d \given a$. By the division algorithm, we know that

<div>$$
a = dq + r, \quad \text{where $0 \le r \lt d$}
$$</div>

It follows that

<div>$$
\begin{align*}
r &= a - dq \\
&= a - (sa + tb)q \\
&= a - saq - tbq \\
&= (1 - sq)a + (-tq)b \\
\end{align*}
$$</div>

We can see that $r$ is a linear combination of $a$ and $b$. Since $0 \le r \lt d$ and considering that we defined $d$ as the *least positive* linear combination of $a$ and $b$, it follows that $r = 0$ (if $0 \lt r \lt d$ then $r$ would be the least possible linear combination, which is a contradiction); therefore, $d \given a$.

In a similar fashion, $d \given b$; therefore, by the divisibility property #4

<div>$$
d \given sa + tb
$$</div>

The next thing to prove is that $d$ is the *greatest common divisor* of $a$ and
$b$. To prove this lets show that if $d'$ is any other common divisor of $a$ and
$b$ then $d' \le d$.

If $d' \given a$ and $d' \given b$ then by the divisibility property #4 it divides any other *linear combination* of $a$ and $b$, since $d = sa + bt$ is one linear combination of $a$ and $b$ it follows that $d' \given d$ so either $d' \lt d$ or $d' = d$, finally we can conclude that

<div>$$
d = (a,b)
$$</div>

### Euclidean Algorithm

A very efficient method to compute the *greatest common denominator*

> Suppose $a, b$ be integers with $a \ge b \gt 0$
>
> 1. Apply the division algorithm $a = bq + r, 0 \le r \lt b$
> 2. Rename $b$ as $a$ and $r$ as $b$ and repeat 1 until $r = 0$
> The last nonzero remainder is the *greatest common divisor* of $a$ and $b$

The euclidean algorithm depends on the following lemma

> Let $a, b$ be integers with $a \ge b \gt 0$. Let $r$ be the remainder of dividing $a$ by $b$ then
> $$
(a,b) = (b, r)
$$

*Proof.* Let $q$ be the quotient of dividing $a$ by $b$ so that $a = bq + r$. If $d = (a,b)$ then it must divide any other *linear combination* of $a$ and $b$ like $r = a - bq$, therefore $d \given r$. Finally we can conclude that $d = (b,r)$.

*Proof of the theorem* If we keep on repeating the division algorithm we have:

<div>$$
\begin{align*}
a &= bq_1 + r_1,  \quad (a,b) = (b, r_1) \\
b &= r_1q_2 + r_2,  \quad (b, r_1) = (r_1, r_2) \\
r_1 &= r_2q_3 + r_3,  \quad (r_1, r_2) = (r_2, r_3) \\
r_2 &= r_3q_4 + r_4,  \quad (r_2, r_3) = (r_3, r_4) \\
& \; \vdots \\
r_{n-3} &= r_{n-2}q_{n-1} + r_{n-1}, \quad (r_{n-3}, r_{n-2}) = (r_{n-2}, r_{n-1}) \\
r_{n-2} &= r_{n-1}q_n + r_n, \quad (r_{n-2}, r_{n-1}) = (r_{n-1}, r_n) \\
r_{n-1} &= r_n q_{n+1}, \quad \quad (r_{n-1}, r_n) = r_n
\end{align*}
$$</div>

Therefore:

<div>$$
(a,b) = (b,r_1) = (r_1,r_2) = (r_2, r_3) = (r_3, r_4) = \ldots = (r_{n-3}, r_{n-2}) = (r_{n-2}, r_{n-1}) = (r_{n-1}, r_n) = r_n
$$</div>

### Extended Euclidean Algorithm

One of the applications of the *euclidean algorithm* is the calculation of the integers $x,y$ satisfying $d = (a,b) = ax + by$

First note that if $b=0$ then $(a,b) = (a,0) = a$, now assume that there are integers $x'$ and $y'$ so that

<div>$$
(a,b) = (b,r) = bx' + ry'
$$</div>

Since

<div>$$
\begin{align*}
r &= a - bq \\
&= a - b \left \lfloor \frac{a}{b} \right \rfloor
\end{align*}
$$</div>

Then

<div>$$
\begin{align*}
(a,b) &= bx' + \Big( a - \left \lfloor \frac{a}{b} \right \rfloor b \Big) y' \\
&= bx' + ay' - \left \lfloor \frac{a}{b} \right \rfloor by' \\
&= a(y') + b \Big(x' - \left \lfloor \frac{a}{b} \right \rfloor y'\Big)
\end{align*}
$$</div>

Comparing it to $(a,b) = ax + by$ we obtain the required coefficients $x$ and $y$ based on the following recursive equations

<div>$$
\begin{align*}
x &=
\begin{cases}
1, & \text{when $r = 0$} \\
y', & \text{otherwise}
\end{cases} \\
y &=
\begin{cases}
0, & \text{when $r = 0$} \\
x' - \left \lfloor \frac{a}{b} \right \rfloor y', & \text{otherwise}
\end{cases}
\end{align*}
$$</div>

{{< repl id="I0vB" >}}
