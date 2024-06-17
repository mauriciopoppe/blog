---
title:  "Binary Exponentiation"
summary: |
  Given two numbers $a$ and $n$ finding $a^n$ involves doing $n$ multiplications of $a$,
  however, it's possible to do this in $log(n)$ operations by using binary exponentiation.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "binary exponentiation"]
libraries: ["math"]
date:   2015-06-01 12:00:00
categories: algorithms math
---

### Algorithm description

Finding $a^n$ involves doing $n$ multiplications of $a$, the same operation can be done in $O(log(n))$ multiplications

For any number $a$ raised to an **even** power:

<div>$$
a^n = (a^{n/2})^2 = a^{n/2} \cdot a^{n/2}
$$</div>

For any number $a$ rasied to an **odd** power:

<div>$$
a^n = a^{n - 1} \cdot a
$$</div>

### Implementation

Time complexity: $O(log(n))$

{{< snippet file="static/code/math/binaryExponentiation.cpp" lang="cpp" />}}
