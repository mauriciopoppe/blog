---
title: "Normals"
date: 2016-03-08 14:18:11
description: |
  A **normal vector** to a curve at a particular point is a vector perpendicular to the *tangent* vector of the curve at that point (also called a *gradient*).
image: /images/diffuse-shading!lambertian.jpg
tags: ["computer graphics", "geometry", "normal"]
libraries: ["math"]
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
  - "Online Graphics Transforms 2: Normals. (2016). [online] YouTube. Available at: https://www.youtube.com/watch?v=fK45BV7QJe0 [Accessed 8 Mar. 2016]."
---

A **normal vector** to a curve at a particular point is a vector perpendicular to the *tangent* vector of the curve at that point (also called a *gradient*). For an implicit 2D function in the form $f(x,y) = 0$ the 2D gradient is

<div>
<div>$$
\nabla f(x,y) = \left ( \frac{\partial f}{\partial x}, \frac{\partial f}{\partial y} \right )
$$</div>
</div>

For an implicit 3D function the **normal** is the vector perpendicular to the surface, the **surface normal** at a point $\mathbf{p}$ is given by the gradient of the implicit function

<div>$$
\mathbf{n} = \nabla f (\mathbf{p}) = \left ( \frac{\partial f(\mathbf{p})}{\partial x}, \frac{\partial f(\mathbf{p})}{\partial y}, \frac{\partial f(\mathbf{p})}{\partial z} \right  )
$$</div>

For a plane we know that the dot product of the normal $\mathbf{n}$ and any vector that lies in the plane is zero, therefore we can model a plane as the following implicit equation

<div>$$
(\mathbf{p} - \mathbf{a}) \cdot \mathbf{n} = 0
$$</div>

Where $\mathbf{p}$ and $\mathbf{a}$ are any two points lying on the plane, sometimes we want the equation of a plane through points $\mathbf{a, b, c}$, the normal can be found by taking the cross product of any two vectors on the plane

<div>$$
\mathbf{n} = (\mathbf{b} - \mathbf{a}) \times (\mathbf{c} - \mathbf{a})
$$</div>

## Transforming normal vectors

Normal vectors do not transform the way we would like when they're multiplied by a transformation matrix, if the points on a surface are transformed by the transformation matrix $\mathbf{M}$, a vector $\mathbf{t}$ tangent to the surface will still be tangent to the transformed surface, however a surface normal vector $\mathbf{n}$ may not be normal to the transformed surface

For example when a transformation matrix $\mathbf{M} = \mathbf{H_x}(s)$ that skews points toward the $x$ axis multiplies the normal vector $\mathbf{n}$, the resulting vector $\mathbf{Mn}$ is not normal to the surface, we would like to find a transformation matrix $\mathbf{N}$ so that $\mathbf{Nn}$ is indeed the surface normal

{{< figure src="/images/normals!transformation.jpg" title="transforming normal" >}}

To find the value of $\mathbf{N}$ we start from the fact that the normal $\mathbf{n}$ and the tangent $\mathbf{t}$ are perpendicular

<div>$$
\mathbf{ n \cdot t } = 0
$$</div>

Expressed as a matrix multiplication

<div>$$
\begin{equation} \label{perpendicular}
\mathbf{n}^T \mathbf{t} = 0
\end{equation}
$$</div>

After the transformation they're still perpendicular so

<div>$$
(\mathbf{Nn})^T \mathbf{Mt} = 0
$$</div>

Applying the transpose

<div>$$
\begin{equation} \label{post-transformation}
\mathbf{n}^T \mathbf{N}^T \mathbf{Mt} = 0
\end{equation}
$$</div>

Relating \eqref{post-transformation} with \eqref{perpendicular} we see that the only way that both equations hold true is that

<div>$$
\mathbf{N}^T \mathbf{M} = \mathbf{I}
$$</div>

The value of $\mathbf{N}$ is then

<div>$$
\begin{align*}
\mathbf{N}^T \mathbf{M} &= \mathbf{I} \\
\mathbf{N}^T \mathbf{MM}^{-1} &= \mathbf{IM}^{-1} \\
\mathbf{N}^T &= \mathbf{M}^{-1} \\
\mathbf{N} &= (\mathbf{M}^{-1})^T
\end{align*}
$$</div>

