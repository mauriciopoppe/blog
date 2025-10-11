---
title: "Primality Test"
summary: |
  A prime number is a natural number greater than $1$ which has no positive divisors other
  than $1$ and itself.

  <br />
  This article covers different algorithms for checking if a number is prime or not, including
  a naive test, the Eratosthenes Sieve, the Euler Primality Test, and the Miller-Rabin Primality Test.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "prime numbers", "erathostenes sieve", "fermat primality test", "euler primality test", "miller-rabin primality test"]
libraries: ["math"]
date: 2015-06-11 13:16:59
---

> A prime number is a natural number greater than $1$ which has no positive divisors other than $1$ and itself

## Naive test

Let $n$ be the number we want to check for primality. If we find a natural number greater than $1$ that is a divisor of $n$, then $n$ is not prime.

- if a number $n$ is divisible by $k$ then $k \leq \sqrt{n}$.

Complexity: $O(\sqrt{n})$

```cpp
bool is_prime(int n) {
  if (n == 2) {
    // 2 is a prime number
    return true;
  }
  if (n == 1 || (n % 2 == 0)) {
    // 1 or any multiple of 2 is not a prime number
    return false;
  }
  for (int i = 3; i * i <= n; i += 2) {
    // check for any odd number < sqrt(n) if they are multiples of `n`
    if (n % i == 0) {
      return false;
    }
  }
  return true;
}
```

## Eratosthenes Sieve

If we have to make constant queries to check for numbers that are prime, less than some number $n$, we can preprocess them using the [Eratosthenes Sieve](../erathostenes-sieve/) and answer each query in $O(1)$

## Fermat primality test

### Fermat's little theorem

> If $a$ is an integer and $p$ is a prime number where $0 < a < p$, then
> $$
a^p \equiv a \pmod{p}
$$
>
> or alternatively
>
> $$
a^{p-1} \equiv 1 \pmod{p}
$$

Proofs of this theorem can be found [here](http://artofproblemsolving.com/wiki/index.php/Fermat's_Little_Theorem)

Some examples

<div>$$
3^{5 - 1} \equiv 81 \equiv 1 \pmod{5} \\
3^{11 - 1} \equiv 59049 \equiv 1 \pmod{11}
$$</div>

The converse of this theorem is **not always** true

> If $$ a^{n - 1} \equiv 1 \pmod{n} $$ for some value of $0 &lt; a &lt; n$, then $n$ is prime

an example:

<div>$$
5^{561 - 1} \equiv 1 \pmod{561} \text{ but $561 = 3 \cdot 11 \cdot 17$ }
$$</div>

but:

<div>$$
3^{561 - 1} \equiv 375 \pmod{561}
$$</div>

we can't use the theorem directly to test if a number is prime, since there's a chance that the input is one of these special numbers (called, [Carmichael numbers](https://www.wikiwand.com/en/Carmichael_number)) and the algorithm will give false positives; e.g., $a = 5, p = 561$

What we can do is run the algorithm multiple times, increasing the probability of finding a number $a$ such that $a^{p - 1}
ot\equiv 1 \pmod{p}$, thus proving that $p$ is composite.

{{< snippet file="static/code/math/fermatPrimalityTest.cpp" lang="cpp" />}}

No matter how many iterations we use in the algorithm above, there's a chance that for each $a_1, a_2, \ldots, a_i$ Fermat's little theorem holds true, even though the input is composite. Therefore, this test is not used in practice

## Euler primality test

Euler Primality Test is an improvement over the Fermat Primality Test because it adds another equality condition that a prime number must fulfill. Assuming that $p$ is a prime number and $a$ is an integer, where $0 < a < p$, then

> If $a$ is an integer and $p$ is a prime number where $0 < a < p$ and $p > 2$, then $ a^{	frac{p - 1}{2}}
equiv
\pm 1
\pmod{p} $

The motivation for this definition comes from the fact that any prime $> 2$ is an odd number. Then the prime number can be expressed as $2q + 1$ where $q$ is an integer; thus,

<div>$$
a^{(2q + 1) - 1} \equiv 1 \pmod{p}
$$</div>

which means that

<div>$$
a^{2q} - 1 \equiv 0 \pmod{p}
$$</div>

this can be factored as

<div>$$
(a^q - 1)(a^q + 1) \equiv 0 \pmod{p}
$$</div>

therefore $a^q$ is congruent to two possible values $1$ and $-1$. Going back to the definition of $q$ ($2q + 1 = p$), we can find the value of $q$ as $q = \\tfrac{(p - 1)}{2}$

Expressing Euler's Primality Test formally:

If $a^{(n - 1) / 2}
ot\equiv \pm 1 \pmod n$, where $gcd(a, n) = 1$, then $n$ must be a composite number for one of the following reasons:

- if $a^{n - 1} \not\equiv 1 \pmod{n}$ then $n$ must be composite by Fermat's Little Theorem
- if $a^{n - 1} \equiv 1 \pmod{n}$ then $n$ must be composite because $a^{(n - 1) / 2}$, which is a square root of $a^{n - 1} \pmod{n}$, must fulfill the following equivalence $a^{(n - 1) / 2} \equiv \pm 1 \pmod n$, which is a contradiction to the statement above

This test also has some false positives e.g.

<div>$$
3^{(341 - 1)/2} \equiv 1 \pmod{341} \text{ but $341 = 11 * 31$ }
$$</div>

## Miller-Rabin primality test

The Miller-Rabin Primality Test is quite similar to Euler's Primality Test, but instead of looking at the square root of $a^{n - 1}$ it looks at the sequence of square roots/powers of two, derived from $a^{n - 1}$$

Let $2^s$ be the largest power of $2$ that divides $n - 1$. Then $n - 1 = 2^s \cdot q$ for some **odd** integer $q$. The sequence of powers of two that divide $n - 1$ is

<div>$$
2^0, 2^1, \ldots, 2^i \quad \text{where $0 \leq i \leq s$}
$$</div>

We know from Euler's Primality Test that if $a^{n - 1} \equiv 1 \pmod{n}$ then $a^{(n - 1) / 2} \equiv \pm 1 \pmod{n}$. Let's say that $a^{(n - 1) / 2} \equiv 1 \pmod{n}$; then, also because of Euler's Primality Test, $a^{(n - 1) / 2^2} \equiv \pm 1 \pmod{n}$. What this says is that as long as we can take the square root of some $a^{(n - 1) / 2^i} \equiv 1 \pmod{n}$, the result must be $\pm 1$; otherwise, it's a composite number by Euler's Primality Test.

The base case occurs when we cannot take the square root of some $a^{\tfrac{n - 1}{2^i}} \pmod{n}$, i.e., when $\tfrac{n - 1}{2^i}$ is no longer divisible by $2$, which is exactly the number $q$. For this base case, we're sure of something: if $a^qar{\equiv} \pm 1 \pmod{n}$ then it means that it's the square root of $a^{2q} \equiv 1 \pmod{n}$ (obviously, $2q \leq n - 1$ because $n - 1$ is even and must be divisible by at least $2$).

If $a^q
ot\\equiv \\pm 1 \\pmod{n}$, we have to analyze $a^2q \\pmod{n}$ and there are three possible outcomes:

- $a^2q \equiv 1 \pmod{n}$, which by Euler's Primality Test implies that $a^q \equiv \pm 1 \pmod{n}$, which contradicts the statement above; therefore, $n$ is composite
- $a^2q \equiv -1 \pmod{n}$, which by Euler's Primality Test implies that it's the square root of some $a^{2^iq}$ (where $0 < i < s-1$), and which will eventually become $a^{n - 1} \equiv 1 \pmod{n}$ by successive squaring; therefore, we can say that $n$ is a probable prime
- $a^2q \not\equiv \pm 1 \pmod{n}$, which is the same as the statement above (therefore, we have to keep analyzing the next element in the sequence).

{{< snippet file="static/code/math/millerRabinPrimalityTest.cpp" lang="cpp" />}}
