---

title: "Modular Arithmetic"
date: 2015-06-04 16:29:18
categories: algorithms math
---

## Congruence relation

For a positive integer $n$ two integers $a$ and $b$ are said to be **congruent modulo** $n$ if the remainders of $a / n$ and $b / n$ are the same, that is written as

<div>
$$
\begin{equation}\label{congruent-modulo}
a \equiv b \pmod n
\end{equation}
$$
</div>

it can also be proven that $n \mid a - b$, let $a = xn + s$ and $b = yn + t$ where $x, y, s, t$ are integers, if the remainders of $a/n$ and $b/n$ are the same then $t = s$

<div>
$$
\begin{align*}
s &= a - xn \\
s &= b - yn
\end{align*}
$$
</div>

Which means that

<div>
$$
a - xn = b - yn
$$
</div>

Reordering the equation

<div>
$$
\begin{equation}\label{congruent-relation-proof}
a - b = n(x - y)
\end{equation}
$$
</div>

Since $x$ and $y$ are integers then $x - y$ is also an integer which means that $a - b$ is a multiple of $n$ thus $n \mid a - b$

### Properties

1. Reflexive: $a \equiv a \pmod n$ since $a - a = 0$ is a multiple of any $n$
2. Symetric: $a \equiv b \pmod n \Rightarrow b \equiv a \pmod n$ (the same as multiplying \eqref{congruent-relation-proof} by $-1$)
3. Transitive: if $a \equiv b \pmod n$ and $b \equiv c \pmod n$ then $a \equiv c \pmod n$

### Rules

Let $a, b, c, d$ are integers and $n$ is a positive integer such that

<div>
$$
\begin{align*}
a &\equiv b \pmod n \\
c &\equiv d \pmod n
\end{align*}
$$
</div>

The following rules apply

#### Addition/subtraction rule

<div>
$$
a \pm c \equiv b \pm d \pmod n
$$
</div>

*proof:* let $a - c = nk$ and $b - d = nl$, adding both equations $(a + b) - (c + d) = n(k + l)$ which is the same as $a + b \equiv c + d \pmod n$

#### Multiplication rule

<div>
$$
ac \equiv bd \pmod n
$$
</div>

*proof:* let

<div>
$$
a = nk + b \\
c = nl + d
$$
</div>

multiplying both equations

<div>
$$
\begin{align*}
ac &= (nk + b)(nl + d) \\
ac &= n^2kl + nk \cdot d + nl \cdot b + bd \\
ac - bd &= n(nkl + kd + bl) \\
\end{align*}
$$
</div>

#### Exponentiation rule

Since $a^k$ is just repeated multiplication then

<div>
$$
a^k \equiv b^k \pmod n
$$
</div>

Where $k$ is a positive integer

Implementation based on [Binary Exponentiation](./binary-exponentiation.markdown)

{{< snippet file="static/code/math/binaryExponentiationModuloM.cpp" lang="cpp" />}}

### Modular multiplicative inverse

#### Extended Euclidean Algorithm

The multiplicative inverse of a number $a$ is a number which multiplied by $a$ yields the multiplicative identity, for modular arithmetic the modular multiplicative inverse is also defined, the modular multiplicative inverse of a number $a$ modulo $m$ is an integer $x$ such that

<div>
$$
\begin{equation}\label{modular-multiplicative-inverse}
a \; x \equiv 1 \pmod m
\end{equation}
$$
</div>

Such a number exists only if *$a$ and $m$ are coprime*, e.g. $gcd(a, m) = 1$

The number $x$ can be found using the [Extended Euclidean Algorithm](./extended-euclidean-algorithm.html), by the definition of the congruence relation $m \mid ax - 1$

<div>
$$
ax - 1 = mq
$$
</div>

Rearranging

<div>
$$
ax - mq = 1
$$
</div>

This is the exact form of the equation that the Extended Euclidean Algorithm solves where $gcd(a, m) = 1$ is already predetermined instead of discovered using the algorithm

{{< snippet file="static/code/math/modularMultiplicativeInverse.cpp" lang="cpp" />}}

### Euler's Theorem

The modular multiplicative inverse can be also found using Euler's theorem, if $a$ is relatively prime to $n$ then

<div>
$$
a^{\phi(m)} \equiv 1 \pmod m
$$
</div>

Where $\phi(n)$ is [Euler's Phi Function](./eulers-phi.html)

In the special case where $m$ is a prime number

<div>
$$
a^{-1} \equiv a^{m - 2} \pmod m
$$
</div>

{{< snippet file="static/code/math/modularMultiplicativeInverseEuler.cpp" lang="cpp" />}}
