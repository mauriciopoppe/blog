---
title: "Eigenvalues and eigenvectors"
summary: |
  An eigenvalue represents how an object scales (or stretches/compresses) a particular direction (or eigenvector) when acted upon by the object. This article covers how to find these values in a square matrix, as well as their applicability in computer graphics.
image: https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Eigenvalue_equation.svg/250px-Eigenvalue_equation.svg.png
tags: ["math", "linear algebra", "eigenvalue", "eigenvector", "computer graphics"]
libraries: ["math"]
date: 2016-03-07 12:50:15
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
  - "Proof of formula for determining eigenvalues. (2016). [online] Khan Academy. Available at: https://www.khanacademy.org/math/linear-algebra/alternate-bases/eigen-everything/v/linear-algebra-proof-of-formula-for-determining-eigenvalues [Accessed 7 Mar. 2016]."
---

Given a square matrix $\mathbf{M}$:

- An *eigenvector* $\mathbf{v}$ is a non-zero vector whose direction doesn't change when multiplied by $\mathbf{M}$. Note that if $\mathbf{M}$ has an eigenvector, then there are an infinite number of eigenvectors (vectors parallel to $\mathbf{v}$).
- An *eigenvalue* $\lambda$ is the scale factor associated with an *eigenvector* $\mathbf{v}$ of $\mathbf{M}$ after multiplication by $\mathbf{M}$.

<div>$$
\begin{equation} \label{eigenvector}
\mathbf{Mv} = \lambda \mathbf{v}
\end{equation}
$$</div>

Assuming that $\mathbf{M}$ has at least one eigenvector $\mathbf{v}$, we can perform standard matrix multiplications to find it. First, let's manipulate the right side of \eqref{eigenvector} so that it also features a matrix multiplication.

<div>$$
\mathbf{Mv} = \lambda \mathbf{Iv}
$$</div>

Where $\mathbf{I}$ is the identity matrix, next we can rewrite the last equation as

<div>$$
\mathbf{Mv} - \lambda \mathbf{Iv} = \mathbf{0}
$$</div>

Because matrix multiplication is distributive

<div>$$
\begin{equation} \label{eigenvector-0}
(\mathbf{M} - \lambda \mathbf{I})\mathbf{v} = \mathbf{0}
\end{equation}
$$</div>

The quantity $\mathbf{M} - \lambda \mathbf{I}$ must not be invertible. If it had an inverse, we could premultiply both sides by $(\mathbf{M} - \lambda \mathbf{I})^{-1}$, which would yield

<div>$$
\begin{align*}
(\mathbf{M} - \lambda \mathbf{I})^{-1}(\mathbf{M} - \lambda \mathbf{I})\mathbf{v} &= (\mathbf{M} - \lambda \mathbf{I})^{-1} \; \mathbf{0} \\
\mathbf{v} &= \mathbf{0}
\end{align*}
$$</div>

The vector $\mathbf{v = 0}$ fulfills \eqref{eigenvector}. However, we'll try to find a vector $\mathbf{v} \not = \mathbf{0}$. If such a condition is added, then the matrix $\mathbf{M} - \lambda \mathbf{I}$ must not have an inverse, which also means that its determinant is 0.

<div>$$
\left | \mathbf{M} - \lambda \mathbf{I} \right | = 0
$$</div>

If $\mathbf{M}$ is a $2 \times 2$ matrix, then

<div>$$
\begin{align*} \label{lambda}
\left | \mathbf{M} - \lambda \mathbf{I} \right | &= \begin{vmatrix}
m_{11} - \lambda & m_{12} \\
m_{21} & m_{22} - \lambda
\end{vmatrix} \\
& = \lambda^2 - (m_{11}+m_{22})\lambda + (m_{11}m_{22} - m_{12}m_{21}) \\
& = 0
\end{align*}
$$</div>

From \eqref{lambda}, we can find two values for $\lambda$, which may be unique or imaginary. A similar manipulation for an $n \times n$ matrix will yield an $n$th degree polynomial. For $n \leq 4$, we can compute the solutions by analytical methods; for $n > 4$, only numeric methods are used.

The associated eigenvector can be found by solving \eqref{eigenvector-0}

<div>$$
\begin{bmatrix}
m_{11} - \lambda & m_{12} \\
m_{21} & m_{22} - \lambda
\end{bmatrix} \begin{bmatrix}
x \\ y
\end{bmatrix} = \begin{bmatrix} 0 \\ 0
\end{bmatrix}
$$</div>

### Applications

List of applications

- If $\mathbf{M}$ is a transformation matrix, then $\mathbf{v}$ is a vector that **isn't affected by the rotation part of $\mathbf{M}$**. Therefore, $\mathbf{v}$ is the rotation axis of $\mathbf{M}$.
