---
title: "Triangle"
date: 2016-03-10 23:17:08
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
---

In an [affine space](/static/math/geometry/affine-geometry/affine-space.html) there's the concept of affine combination which states that any point in space can be represented as a affine combination in the form

<div>$$
a + \sum_{i \in I} \lambda_i \mathbf{aa_i} \quad \quad \text{if $\sum_{i \in I} \lambda_i = 1$}
$$</div>

We can add an additional restriction on the values of $\lambda_i$ to define a triangle built out of three points, if $\lambda_1 = \beta, \lambda_2 = \gamma$, $\beta + \gamma = 1$ and $\beta, \gamma \in [0,1]$ then a triangle is defined as the affine combination

<div>$$
a + \beta \mathbf{ab} + \gamma \mathbf{ac}
$$</div>

{{< figure src="/images/triangle!barycentric.jpg" title="barycentric coordinates" >}}

One geometric property of the scalar values is that they're the signed scaled distance from the lines that pass through the triangle sides, to compute the scalar values $\beta$ and $\gamma$ we can use the fact that when the implicit equation of the line that pass through a side is evaluated with points that don't lie on the line the result is equal to

{{< figure src="/images/triangle!beta.jpg" title="beta" >}}

<div>$$
f(x,y) = d_{(x,y)} \cdot \sqrt{A^2 + B^2}
$$</div>

Where $d_{(x,y)}$ is the distance from the point $(x,y)$ to the line, $A$ and $B$ are the coefficients of $x$ and $y$ of the general equation of the line that passes through $a$ and $c$

<div>$$
Ax + Bx + C = 0
$$</div>

To find the value of $\beta$ we can use the value of the implicit equation of the line to map the distance between any point to the line in the range $[f_{ac}(x_a, y_a), f_{ac}(x_b, y_b)] = [0, f_{ac}(x_b, y_b)]$, we can use a simple division to find the value of $\beta$

<div>$$
\beta = \frac{f_{ac}(x,y)}{f_{ac}(x_b, y_b)} = \frac{d_{(x,y)}}{d_{(x_b, y_b)}}
$$</div>

In a similar fashion the value of $\gamma$ is

<div>$$
\gamma = \frac{f_{ab}(x,y)}{f_{ab}(x_c, y_c)} = \frac{d_{(x,y)}}{d_{(x_c, y_c)}}
$$</div>

