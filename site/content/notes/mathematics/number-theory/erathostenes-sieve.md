---
title:  "Erathostenes Sieve"
description: |
  The erathostenes sieve is an algorithm to find prime numbers up to a positive number $n$
  using $O(n)$ space.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "prime numbers", "erathostenes sieve"]
date:   2015-06-01 12:00:00
categories: algorithms math
---

### Definition

An algorithm to find prime numbers up to a number $n$

### Algorithm description

Using a boolean vector of size $n$ iteratively mark all the multiples of nonvisited positions as not primes

### Implementation

Time complexity: $O(tn)$, $t$ is the number of primes between $1$ and $t$

{{< snippet file="static/code/math/sieve.cpp" lang="cpp" />}}
