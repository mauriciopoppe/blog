---
title: "Introduction to Calculus"
description: |
  This article gives an introduction to calculus starting with the concept of a function
  and how calculus helps us solve problems related to determining tangents to curves (expressed
  as functions), finding the minim/maxima like determinining the maximum range of a projectile,
  and to find the length of curves areas and volumes.
image: https://wordsmithofbengal.files.wordpress.com/2021/08/calculus_score-sheet.png
date: 2015-03-31 15:35:06
tags: ["math", "calculus", "function"]
libraries: ["function-plot"]
---

### why?

Calculus was created to solve some problems that other branches of math were not adequate to treat:

- determination of tangents to various curves (e.g. to determine the course of a light ray after it strikes the surface of a lens)
- finding the minima/maxima (e.g. determination of the maximum range of a projectile, maximum/minimum distance of a planet that is moving about the sun)
- length of curves, areas and volumes of figures bounded by curves

To solve these problems the following concepts are needed:

- limit (fundamental to formulate the derivative and the integral)
- derivative
- integral

### The concept of a function

A function is the relation between variables (whose value can be expressed numerically), the most effective mathematical representation of a function is through a *formula* like the one below:

<div>$$
s = 16 t^2
$$</div>

The above formula says that when $t=2$ then $s=16 \cdot 2^2 = 64$ and is represented as $s_2$, for each value of $t$ there's a corresponding value of $s$, in the above form $t$ is the *independent* variable and $s$ is the *dependent* variable. If we solve the equation above for $t$ we have:

<div>$$
t = \pm \sqrt{\frac{s}{16}}
$$</div>

Now $s$ is the *independent* variable and $t$ is the dependent variable

The notation $f(x)$ can also represent functions without an extensive verbiage, e.g. $f(x) = x^2 - 9$, this notation also has the advantage of telling us which is the *independent* variable, if we want to calculate the value of the function the notation we can use something like $f(3)$ which is the value of $f(x)$ when $x = 3$.

A formula can also be represented as a curve (this method of interpreting formulas geometrically is known as *analytic geometry*), let's represent the following function below using a curve:

<div>$$
y = x^2
$$</div>

<div id="formula-as-a-curve"></div>


The function above is simple in that to each value of $x$ there's a corresponding value of $y$, whoever the concept of a function does not require this, for example the function:

<div>$$
y = \frac{1}{x}
$$</div>

does not have a valid value when $x = 0$, this means that the function exists for each value of $x$ other than $0$.

<div id="for-other-than-0"></div>

The concept of a function then doesn't require that there's a $y$ for every $x$ but it does require a $y$-value for each value $x$ in some collection/set of $x$ values, the collection of $x$ values for which a $y$ value exist is called *domain* and the collection of the corresponding $y$ values is called *range*.

<script src="/js/calculus/intro.js"></script>

*Image taken from https://wordsmithofbengal.wordpress.com/2021/08/02/dr-philos-the-creative-fantasy-of-differential-and-integral-calculus/*

