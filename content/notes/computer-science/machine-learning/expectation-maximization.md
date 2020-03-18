---
title: "Expectation maximization"
description: "Expectation maximization"
tags: []
date: 2020-03-16 21:21:00
---

## Multivariable gaussian distribution

http://cs229.stanford.edu/section/gaussians.pdf

For a random variable $X$ with a finite number of outcomes $x_1, x_2, \ldots, x_n$ ocurring with probabilities $p_1, p_2, \ldots, p_n$ the expectation is defined as:

<div>
$$
E[X] = \sum_{i=1}^{N} x_i p_i
$$
</div>

The covariance between two variables $X, Y$ the covariance is defined as the expected value (or mean) of the product of their deviations from their individual expected values

<div>
$$
cov(X,Y) = E[(X - E[X])(Y - E[Y])]
$$
</div>

When working with multiple variables $X\_1, X\_2, X\_n$ the covariance matrix denoted as $\sum$ is the $n \times n$ matrix whose $(i, j)$th entry is $cov(X\_i, X\_j)$

There's a nice explanation of the parts in the univariate gaussian

<div>
$$
\mathcal{N}(x; \mu, \sigma) = \frac{1}{\sqrt{2\pi \sigma^2}}\exp\left(-\frac{1}{2\sigma^2}(x - \mu)^2\right)
$$
</div>

- $(x - \mu)^2$ is always positive
- the value $k(x, \mu) = -\frac{1}{2 \sigma^2}(x - \mu)^2$ is a always negative, it's a parabola pointing downward
- the $exp^{k(x, \mu)}$ part makes sure that the quantity is always >= 0
- the normalization factor $\frac{1}{\sqrt{2\pi \sigma^2}}$ multiples $exp^{k(x, \mu)}$ so that this sum equals 1

<div>
$$
\frac{1}{\sqrt{2\pi \sigma^2}} \int_{-\infty}^{\infty} \exp\left(-\frac{1}{2\sigma^2}(x - \mu)^2\right) = 1
$$
</div>

**For the multivariate gaussian formula, if the covariance matrix is a diagonal then it's simplified to a product of univariate gaussians**

<div>
$$
\mathcal{N}(x; \mu, \sum) = \mathcal{N}(x_1; \mu_1, \sigma_1) \cdot \mathcal{N}(x_2; \mu_2, \sigma_2)
$$
</div>

## Gaussian mixture models and EM

https://www.youtube.com/watch?v=qMTuMa86NzU

