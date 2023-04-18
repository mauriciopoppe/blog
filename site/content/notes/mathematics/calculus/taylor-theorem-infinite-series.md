---
title: "Taylor's Theorem and Infinite Series"
description: |
  Taylor Series helps approximate the value of a definite integral for a function
  whose antiderivative is hard to find. This article explains the key ideas
  behind Taylor's Theorem and an example of approximating its value with
  a polynomial function.
image: http://www.sosmath.com/calculus/tayser/tayser01/img5.gif
tags: ["math", "calculus", "taylor series", "function"]
date: 2015-04-02 10:00:00
---

There are simple functions for which we cannot find antiderivatives in terms of the functions we know, some examples are

<div>$$
\frac{sin(x)}{x} \quad\quad e^{-x^2}
$$</div>

Another problem that arises in problems of the calculus is that of calculating the values of functions, for a given polynomial like $3x^2 + 7x + 1$ it's simple to calculate the value of the function for various values of $x$ but it's not so simple for a function like $sin(x)$, to calculate the value of the function at a some value of $x$ we would have to construct a right triangle containing the desired angle $x$ and then measure the side of the oposite side and the hypotenuse, however this process is not very accurate if $x$ is something like 30°50'47

The answer to the problems above is approximate unmanageable functions by manageable ones by also determining precisely what the error incurred is, if we are to approximate a given function $f(x)$ by $g(x)$ we should make $g(x)$ relatively simple so that we can calculate its values, now the simplest functions to work with are the *polynomials* and therefore we should approximate the function by polynomials

First let's look into the simpler problem of approximating a function around one value of $x$, let's say that we have the function $f(x)$ and we want to approximate its value near $x = 0$, let's consider the polynomial $g(x)$ as an approximation to $f(x)$

<div>$$
\begin{equation}\label{gx}
g(x) = c_0 + c_1x + c_2x^2 + \cdots + c_nx^n
\end{equation}
$$</div>

We can make $g(x)$ agree with $f(x)$ at $x = 0$ because by $g(0) = c_0$ we can take $c_0$ to be $f(0)$, if we expect that $g(x)$ is an appoximation of $f(x)$ at $x = 0$ we would also expect that the tangent line at $x = 0$ approximates the curve closely in the point of tangency, hence we should make the slope of $g(x)$ agree with the slope of $f(x)$ at $x = 0$, applying a differentiation process to $g(x)$

<div>$$
g'(x) = c_1 + 2c_2x + 3c_3x^2 + 4c_4x^3 + \cdots + nc_nx^{n-1}
$$</div>

At $x = 0$ $g'(0) = c_1$, if $g'(0)$ agrees with $f'(0)$ then

<div>$$
c_1 = f'(0)
$$</div>

We can apply the same idea by making $g'' (x)$ agree with $f'' (x)$ at $x = 0$, applying a differentiation process to $g'(x)$

<div>$$
g'' (x) = 2c_2 + 2 \cdot 3c_3x^1 + 3 \cdot 4c_4x^2 + \cdots + n(n - 1)c_nx^{n-2}
$$</div>

Then $g'' (0) = 2c_2$ and if $g'' (0)$ is the same as $f'' (0)$ then $f'' (0) = 2c_2$ or

<div>$$
c_2 = \frac{f'' (0)}{2}
$$</div>

To determine $c_3$ we would make the third derivatives of both functions agree at $x = 0$

<div>$$
g'''(x) = 2 \cdot 3c_3 + 2 \cdot 3 \cdot 4c_4x + \cdots + n(n - 1)(n - 2)c_nx^{n-3}
$$</div>

Then $g''' (0) = 2 \cdot 3c_3$ which is the same as $f''' (0)$ then

<div>$$
c_3 = \frac{f'''(0)}{2 \cdot 3}
$$</div>

we can see that the $n$-th derivate of $g(x)$ is $g^{(n)}(x) = n(n - 1)(n - 2)\ldots$ and if $g^{(n)}(0)$ is equal to $g^{(n)}(0)$

<div>$$
c_n = \frac{f^{(n)}(0)}{n(n-1)(n-2) \ldots 2 \cdot 1} = \frac{f^{(n)}(0)}{n!}
$$</div>

Because we used the condition that each pair of successive derivatives agree at $x = 0$ $g(x)$ takes the form

<div>$$
g(x) = f(0) + f'(0)x + \frac{f''(0)}{2!}x^2 + \cdots + \frac{f^{(n)}(0)}{n!}x^n
$$</div>

We could equally make the approximation near any other value of $x$ e.g. $x = a$, thus the proper form of $g(x)$ which generalizes on the form \eqref{gx}

<div>$$
g(x) = c_0 + c_1(x - a) + c_2(x - a)^2 + \cdots + c_n(x - a)^n
$$</div>

Then the final formula for approximating any function $f(x)$ by a polynomial $g(x)$ near $x = a$ is

<div>$$
\begin{equation}\label{taylor}
g(x) = f(a) + f'(a)(x - a) + \frac{f''(a)}{2!}(x - a)^2 + \cdots + \frac{f^{(n)}(a)}{n!}(x - a)^n
\end{equation}
$$</div>

## Taylor's theorem

\eqref{taylor} approximates the value of a function $f(x)$ at the point $a$ however we do not know how good the approximation is numerically, at $x = a, g(a) = f(a)$ which is exact, however for any $x$ near $a$ like $a + h, g(a + h) \approx f(a + h)$, the difference $f(a + h) - g(a + h)$ is the error in approximating $f(x)$ by the polynomial $g(x)$, the formula that approximates $f(x)$ considering also the error was first given by Brook Taylor

> For any function $f(x)$ which has $(n + 1)$ derivatives in the interval from $a$ to $x$

<div>$$
f(x) = f(a) + f'(a)(x - a) + f''(a)\frac{(x - a)^2}{2!} + \cdots + f^n(a) \frac{(x - a)^n}{n!} + f^{(n + 1)}(\mu) \frac{(x - a)^{n + 1}}{(n + 1)!}
$$</div>

Where $\mu$ is between $x$ and $a$

*Image taken from http://www.sosmath.com/calculus/tayser/tayser01/tayser01.html*
