---
title:  "Euclidean Algorithm"
description: |
  The euclidean algorithm finds the greatest common divisor of two numbers. In this article
  I implement the algorithm from scratch in C++.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "divisibility", "modulo", "euclidean algorithm", "greatest common divisor", "gcd"]
date:   2015-06-01 12:00:00
categories: algorithms math
---

Euclid's algorithm for finding the **Greatest Common Divisor** of two or more integers is based on the following observations:

1. if $x = y$ then

<div>$$
gcd(x, y) = gcd(x, x) = x
$$</div>

2. if $x > y$ then

<div>$$
gcd(x, y) = gcd(x - y, y)
$$</div>

*proof:* suppose that $d$ is a divisor of $x$ and $y$ then $x$ and $y$ can be expressed as

<div>$$
\begin{align*}
x &= q_1d \\
y &= q_2d
\end{align*}
$$</div>

But then

<div>$$
x - y = q_1d - q_2d = d(q_1 - q_2)
$$</div>

Therefore $d$ is a divisor of $x - y$

```cpp
int gcd(int x, int y) {
  while (x != y) {
    if (x > y) {
      x -= y;
    } else {
      y -= x;
    }
  }
  return x;
}
```

Using the remainder operator instead of multiple subtraction operations is an improvement in performance however eventually one of $x$ or $y$ will become zero

<div>$$
gcd(x, 0) = gcd(0, x) = x
$$</div>

```cpp
int gcd(int x, int y) {
  while (x != 0 && y != 0) {
    if (x > y) {
      x %= y;
    } else {
      y %= x;
    }
  }
  return max(x, y);
}
```

By ensuring that $x \geq y$ we can get rid of the `if` statement inside the `while` loop

```cpp
int gcd(int x, int y) {
  if (x < y) {
    swap(x, y);
  }
  while (y != 0) {
    int remainder = x % y;
    x = y;
    y = remainder;
  }
  // at this point `gcd(x, y) = gcd(x, 0) = x`
  return x;
}
```

However if $x < y$ the first iteration of the loop will actually swap the operands, e.g. when $x = 3, y = 5$, $remainder = 3 % 5 = 3$, $x_{new} = 5$, $y_{new} = 3$ therefore it's not necessary to make the initial swap

```cpp
int gcd(int x, int y) {
  while (y != 0) {
    int remainder = x % y;
    x = y;
    y = remainder;
  }
  // at this point `gcd(x, y) = gcd(x, 0) = x`
  return x;
}
```

*Example:* finding the GCD of $102$ and $38$

<div>$$
\begin{align*}
102 &= 2 \cdot 38 + 26 \\
38 &= 1 \cdot 26 + 12 \\
26 &= 2 \cdot 12 + 2 \\
12 &= 6 \cdot 2 + 0
\end{align*}
$$</div>

The last non-zero remainder is $2$ thus the GCD is 2

### Implementation

Recursive version

{{< snippet file="static/code/math/euclidsAlgorithm.cpp" lang="cpp" />}}

[explanation](http://people.cis.ksu.edu/~schmidt/301s12/Exercises/euclid_alg.html)
