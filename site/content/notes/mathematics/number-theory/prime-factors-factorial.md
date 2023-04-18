---
title: "Prime factors of a factorial"
description: |
  This article describes and implements a solution for the following problem,
  given two numbers $n$ and $k$ find the greatest power of $k$
image: /images/math-generic.jpeg
tags: ["math", "number theory", "prime numbers", "integer factorization"]
date: 2015-06-09 14:00:03
---

> Given two numbers $n$ and $k$ find the greatest power of $k$ that divides $n!$

Writing the factorial expression explicitely

<div>$$
n! = 1 \cdot 2 \cdot 3 \ldots (n - 1) \cdot n
$$</div>

We can see that every $k$-th member of the factorial is divisible by $k$ therefore one answer is $\left \lfloor \tfrac{n}{k} \right \rfloor$, however we can also see that every $k^2$-th term is also divisible by $k$ two times and it gives one more term to the answer, that is $\left \lfloor \tfrac{n}{k^2} \right \rfloor$, which means that every $k^i$-th term adds one factor to the answer, thus the answer is

<div>$$
\left \lfloor \frac{n}{k} \right \rfloor + \left \lfloor \frac{n}{k^2} \right \rfloor + \ldots + \left \lfloor \frac{n}{k^i} \right \rfloor + \ldots
$$</div>

The sum is actually finite and the maximum value of $i$ can be found using logarithms, let $k^i > n$, applying logarithms we have $i \cdot log(k) > log(n)$ which is equal to $i > \tfrac{log(n)}{log(k)}$ which is the same as $i > log_k n$

The sum discovered by [Adrien-Marie Legendre](http://www.wikiwand.com/en/Adrien-Marie_Legendre) is called [Legendre's Formula](http://www.wikiwand.com/en/Legendre%27s_formula), let $d_a(b)$ be the number of times $a$ divides $b$

<div>$$
d_k(n!) = \sum_{i=1}^{log_k{n}} \left \lfloor \frac{n}{k^i} \right \rfloor
$$</div>

{{< snippet file="static/code/math/primeFactorFactorial.cpp" lang="cpp" />}}
