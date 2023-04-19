---
title: "Integer Factorization"
description: |
  Integer factorization is the process of decomposing a *composite* number into a product of
  smaller integers, if these integers are restricted to be prime numbers then the process is
  called **prime factorization**.

  <br />
  This article covers factorization using trial division and fermat factorization through
  Pollard's Rho algorithm and using the sieve of eratosthenes.
image: /images/math-generic.jpeg
tags: ["math", "number theory", "integer factorization", "divisibility", "prime factorization", "erathosthenes sieve", "prime numbers"]
libraries: ["math"]
date: 2015-06-14 15:08:08
---

The fundamental theorem of arithmetic states that ever positive integer can be written uniquely as a product of primes

example:

<div>$$
65340 = 2^2 \cdot 3^3 \cdot 5 \cdot 11^2
$$</div>

## Trial division

Trial division is the simplest algorithm for factoring an integer, we assume that $s$ and $t$ are factors of a number $n$ such that $n = st$ and $s \leq t$ (note that $s$ and $t$ do not need to be prime numbers), when a divisor $s$ is found then $n / s$ is also a factor

```cpp
vector<int> trial_division(int n) {
  for (int i = 2; i * i <= n; i += 1) {
    if (n % i == 0) {
      // `n` is a composite number
      return vector<int> {i, n / i};
    }
  }
  // n is a prime number
  return vector<int> {n};
}
```

## Fermat factorization

Fermat's observation was to write an integer as the difference of squares

<div>$$
\begin{align}
n &= x^2 - y^2 \label{fermat} \\
&= (x + y)(x - y)
\end{align}
$$</div>

Assuming that $s$ and $t$ are **odd** factors of $n$ such that $n = st$ and $s \leq t$ we can find $x$ and $y$ such that

<div>$$
\begin{align*}
s &= x - y \\
t &= x + y
\end{align*}
$$</div>

Adding both equations

<div>$$
s + t = 2x \\
x = \frac{s + t}{2}
$$</div>

Also

<div>$$
y = \frac{t - s}{2}
$$</div>

Since we assumed that $s$ and $t$ are odd numbers, their difference is an even number which is divisible by $2$ therefore $x$ and $y$ are integers, since $s > 1$ and $t \geq s$ we find that $x \geq 1$ and $y \geq 0$

From \eqref{fermat} we also know that $x = \sqrt{n + y^2}$ and hence $x \geq \sqrt{n}$, also $x = \tfrac{s + t}{2}$ and we know that the upper bound of $s$ happens when $s$ is as close as $t$ as possible, given that $s \leq t$, $x \leq \tfrac{t + t}{2} \leq n$

Implementation notes: since $s$ and $t$ are odd numbers, their product $n$ is also an odd number, therefore the implementation below works with odd values of $n$

```cpp
/**
 * Factorization of an odd number `n` based on Fermat's
 * factorization algorithm
 *
 * @param  {int} n
 * @return {vector<int>} a vector with two odd integers if `n` is not a
 * prime number, a single integer if `n` is a prime number
 */
vector<int> fermat_factorization(int n) {
  for (int x = (int) ceil(sqrt(n)); x <= n; x += 1) {
    int ySquared = x * x - n;
    // check if `y` is the square of some number
    int y = (int) sqrt(ySquared);
    if (y * y == ySquared) {
      int s = x - y;
      int t = x + y;
      // `s` must be > 1
      if (s != 1 && t != n) {
        return vector<int> {s, t};
      }
    }
  }
  // n is a prime number
  return vector<int> {n};
}
```

### Pollard's Rho factorization

Pollard's Rho factorization is a probabilistic factorization algorithm based on the assumption that a number $n$ is a composite number and the following facts:

- since $n$ is a **composite number** there must be a factor $d$
- let $a$, $b$ two positive integers, if $a \equiv b \pmod{d}$ then the difference $a - b$ is a multiple of $d$, since $n$ is also a multiple of $d$ some multiple of $d$ is a divisor of $n$ and $a - b$, particularly $gcd(a - b, n)$ is a divisor of $n$, let $gcd(a - b, n) > 1$ then we have found two factors of $n$ ($gcd(a - b, n), \tfrac{n}{gcd(a - b, n)}$)

Now the problem is reduced to find $a$ and $b$ such that $gcd(a - b, n) > 1$, we can use the following algorithm which picks random numbers in the range $[1, n - 1]$

```text
let `n` be the number to be factorized
let `x` be an array of integers

x[0] = random integer in the range [1, n - 1]
while we haven't two numbers such that `gcd(x_i, x_j, n) > 1`
  x[i] = random integer in the range [1, n - 1]
  for all `j < i` and `j >= 0`
    if `gcd(x[i] - x[j], n) > 1`
      return x[i], x[j]
```

[This page](http://www.cs.colorado.edu/~srirams/classes/doku.php/pollard_rho_tutorial) has a good explanation on how this algorithm will find $a$ and $b$ with a probability $~50\%$ after $\sqrt{n}$ iterations, the algorithm above is not very helpful though since at the $k$ iteration we have to do $k - 1$ pairwise checks

Here's another algorithm to pick random numbers, let $x$ be an integer in the range $[1, n - 1]$, a function that will generate a number in the range $[1, n - 1]$ based on a previous number is

<div>$$
f(x) = x^2 + c \pmod{n}
$$</div>

Because there are only $n - 1$ possible values our generator will eventually fall into a cycle, for example let $n = 55, c = 2, x = 2$

<div>$$
\begin{align*}
x_0 &= 2 \\
x_1 &= (2^2 + 2) \pmod{55} = 6 \\
x_2 &= (6^2 + 2) \pmod{55} = 38 \\
x_3 &= (38^2 + 2) \pmod{55} = 16 \\
x_4 &= (16^2 + 2) \pmod{55} = 38 \text{ which is equal to $x_2$ }
\end{align*}
$$</div>

Pollard detected the cycle using [Floyd's cycle-finding algorithm](https://www.wikiwand.com/en/Cycle_detection#/Tortoise_and_hare) which is based on two pointers which move through a sequence at different speeds, one moves a unit and the other moves two units each time, if there's a cycle eventually the two pointers will encounter at some element belonging to the cycle, if we've analyzed all the elements of the sequence and saw not a single contiguous pair fullfills $gcd(x_i - x_{i + 1}, n) > 1$ we need to choose other values for $x_0, a$ and rerun the algorithm

{{< snippet file="static/code/math/factorization/pollardRhoFactorization.cpp" lang="cpp" />}}

### Eratosthenes Sieve factorization of a range

We can also compute the factorization of a number by modifying the sieve of Erathostenes, remember that each state of the sieve hold a boolean telling if the number is prime or not, this time each state of the sieve will hold a pair of numbers

- the lowest prime that is a divisor of any index `i`
- the maximum power of the lowest prime computed above (optional)

Let's represent $n$ as $p_1^{a_1} \cdot p_2^{a_2} \ldots p_n^{a_n}$, since we're hold for each position the lowest prime and its the maximum power, the state stored at the position $n$ of the sieve will be $p_1^{a_1}$, if we divide $n$ by this number we will move to the state $p_2^{a_2} \ldots p_n^{a_n}$, this recursive process is run until the current state reached in the sieve is $1$

{{< snippet file="static/code/math/factorization/eratosthenesSieveFactorization.cpp" lang="cpp" />}}
