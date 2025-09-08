---
title: "Expectation maximization"
summary: |
  Expectation maximization is a method of finding maximum likelihood estimates of the parameters of a model.
  The method alternates between making an expectation (E) step based on the current estimate of
  the parameters and a maximization (M) step, which computes new parameters.
image: /images/covariance-matrix.jpeg
tags: ["machine learning", "expectation maximization", "k-means clustering", "gaussian distribution", "multivariate gaussian distribution"]
libraries: ["math"]
date: 2020-03-16 21:21:00
references:
  - Do, C. . (2008 10). The Multivariate Gaussian Distribution. Retrieved March 20, 2020, from http://cs229.stanford.edu/section/gaussians.pdf
---

## K-means clustering

Suppose we have a dataset {\textbf{x}\_1, \ldots, \textbf{x}\_n} consisting of $N$ observations of a random $D$-dimensional space. The goal
is to partition the dataset into some number $K$ of clusters. Formally, let { \pmb{\mu} \_1, \ldots, \pmb{\mu}\_k } be a set of $D$-dimensional vectors in which
$\pmb{\mu}\_k$ is associated with the $k^{th}$ cluster ($\pmb{\mu}\_k$ can be thought of as the centers of the clusters). The goal is to find
an assignment of data points so that the distance of each data point to its closest vector $\pmb{\mu}\_k$ is a minimum.

Let $r\_nk \in \{0, 1\}$, where $k = 1, \ldots, K$, describe the assignment of each data point to a cluster (1 if it's assigned to a cluster and
0 if not). We define a function called the *distortion measure*, given by:

<div>$$
\begin{equation} \label{distortion_measure}
J = \sum_{n=1}^{N} \sum_{k=1}^{K} r_{nk} \magnitude{\mathbf{x}_n - \pmb{\mu}_k}^2
\end{equation}
$$</div>

This represents the sum of the squares of the distances of each data point to its assigned vector $\pmb{\mu}\_k$. Our goal is to find values
for $r\_nk$ and the $\pmb{\mu}\_k$ so as to minimize $J$. The algorithm is as follows:

Algorithm:

- Pick initial values for the $\pmb{\mu}$.
- Minimize J with respect to $r\_nk$, keeping the $\pmb{\mu}\_k$ fixed (Expectation).
- Minimize J with respect to the $\pmb{\mu}\_k$, keeping $r\_nk$ fixed (Maximization).

## Multivariate gaussian distribution

For a random variable $X$ with a finite number of outcomes $x_1, x_2, \ldots, x_n$ occurring with probabilities $p_1, p_2, \ldots, p_n$, the expectation of $X$ is defined as:

<div>$$
E[X] = \sum_{i=1}^{N} x_i p_i
$$</div>

The covariance between two variables, $X$ and $Y$, is defined as the expected value (or mean) of the product of their deviations from their individual expected values:

<div>$$
cov(X,Y) = E[(X - E[X])(Y - E[Y])]
$$</div>

When working with multiple variables $X\_1, X\_2, \ldots, X\_n$, the covariance matrix, denoted as $\Sigma$, is the $n \times n$ matrix whose $(i, j)$-th entry is $cov(X\_i, X\_j)$.

The density function of a univariate gaussian distribution is given by:

<div>$$
p(x; \mu, \sigma) = \frac{1}{\sqrt{2\pi \sigma^2}}\exp\left(-\frac{1}{2\sigma^2}(x - \mu)^2\right)
$$</div>

- $(x - \mu)^2$ is always positive.
- The value $k(x, \mu) = -\frac{1}{2 \sigma^2}(x - \mu)^2$ is always negative. It's a parabola pointing downward.
- The $\exp(k(x, \mu))$ part makes sure that the quantity is always $\geq 0$.
- The normalization factor $\frac{1}{\sqrt{2\pi \sigma^2}}$ multiplies $\exp(k(x, \mu))$ so that this sum equals 1.

<div>$$
\underbrace{\frac{1}{\sqrt{2\pi \sigma^2}}}_\text{normalization factor} \int_{-\infty}^{\infty} \exp \left(-\frac{1}{2\sigma^2}(x - \mu)^2\right) = 1
$$</div>

A vector random variable $X = \[X\_1, \ldots, X_n\]^T$ is said to have a multivariate Gaussian distribution with mean $\mu \in \mathbf{R}^n$ and covariance matrix $\Sigma$
if its probability density function is given by:

<div>$$
p(x; \mu, \Sigma) = \frac{1}{(2 \pi) ^ {n/2} \norm{\Sigma}^{1/2} } \exp \left ( -\frac{1}{2} (x - \mu)^T \Sigma ^{-1} (x - \mu) \right )
$$</div>

Like in the univariate case, the argument of the exponential function is a downward-opening bowl. The coefficient in front
is a normalization factor used to ensure that:

<div>$$
\underbrace{\frac{1}{(2 \pi) ^ {n/2} \norm{\Sigma}^{1/2} }}_\text{normalization factor} \int_{-\infty}^{\infty} \int_{-\infty}^{\infty} \ldots \int_{-\infty}^{\infty}  \exp \left ( -\frac{1}{2} (x - \mu)^T \Sigma ^{-1} (x - \mu) \right ) dx_1 dx_2 \cdots dx_n = 1
$$</div>

## Gaussian mixture models and EM

https://www.youtube.com/watch?v=qMTuMa86NzU

