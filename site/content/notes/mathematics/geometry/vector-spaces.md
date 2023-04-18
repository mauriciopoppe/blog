---
title: "Vector spaces"
description: |
  A vector space is a set whose elements are called "vectors" (denoted as $\v{v}$ or $\mathbf{v}$) which have two operations defined on them: addition of vectors and multiplication of an scalar by a vector.

  <br />
  This article covers some examples of vector spaces, basis of vectores spaces and linear maps.
image: /images/xyz-z-up.jpg
tags: ["vector spaces", "geometry", "computer graphics"]
date: 2016-03-14 17:07:51
references:
  - "Nearing, J. (2016). Vector spaces. [online] Physics.miami.edu. Available at: http://www.physics.miami.edu/~nearing/mathmethods/vector_spaces.pdf [Accessed 15 Mar. 2016]."
  - "Bærentzen, J. A., Gravesen, J., Anton François, & Aanæs, H. (2012). Guide to computational geometry processing: foundations, algorithms, and methods. London: Springer."
---

A vector space is a set whose elements are called "vectors" (denoted as $\v{v}$ or $\mathbf{v}$) which have two operations defined on them: addition of vectors and multiplication of an scalar by a vector

Formally a vector space $V$ is a set with two operations $+$ and $*$ that satisfy the following properties

- if $\mathbf{u},\mathbf{v} \in V$ then $\mathbf{u + v} \in V$
  - $\mathbf{u + v} = \mathbf{v + u}$
  - $\mathbf{u + (v + w)} = \mathbf{(u + v) + w}$
  - There is an special element called the zero vector $\mathbf{0} \in V$ such that $\mathbf{u + 0} = \mathbf{0 + u} = \mathbf{u}$
  - For every $\mathbf{u} \in V$ there's an inverse element $-\mathbf{u}$ such that $\mathbf{u + (-u)} = \mathbf{0}$
- if $\mathbf{u} \in V$ and $\alpha \in \mathbb{R}$ then $\alpha\mathbf{u} \in V$
  - $(\alpha + \beta) \mathbf{u} = \alpha \mathbf{u} + \beta \mathbf{u}$
  - $\alpha (\beta \mathbf{u}) = (\alpha\beta) \mathbf{u}$
  - $1 \cdot \mathbf{u} = \mathbf{u}$

Notable examples of vectors spaces

- Segments on the plane and space, addition uses the parallelogram law and multiplication by a scalar scales the segment
- The set of $n \times n$ matrices with addition defined by element
- The set of all polynomials
- The space consisting of the zero vector alone $\\{\mathbf{0}\\}$

## Vector subspaces

A subset $U \subseteq V$ of a vectors space $V$ is a subspace if

- For all $\mathbf{u,v} \in U$, $\mathbf{u+v} \in U$
- For all $\alpha \in \mathbb{R}$ and $\mathbf{u} \in U$, $\alpha \mathbf{u} \in U$

## Linear dependence

A set of vectors is linearly dependent if one element from the set can be written as a linear combination of the other elements in the set, if this cannot be done then the set is linearly independent which is also known as a **basis** for some vector space, the **dimension** is the number of elements in the basis, if $\mathbf{b_1, b_2, \ldots, b_n}$ is a basis then any linear combination of the basis will have the form

<div>$$
\mathbf{v} = a_1 \mathbf{b_1} + a_2 \mathbf{b_2} + \ldots + a_n \mathbf{b_n}
$$</div>

The numbers $a_1, a_2, \ldots, a_n$ are called the **components** of $\mathbf{v}$ in the specified basis, note that the basis doesn't need to be orthogonal nor have unit vectors

The set of vectors $[1,0,0], [0,1,0], [0,0,1]$ is an example of a basis of dimension 3

## Linear maps

A map between vectors spaces is linear if it preserves addition and multiplication with scalars as defined above, formally a map $L: U \rightarrow V$ is linear if

- For all $\mathbf{u,v} \in U$, $L(\mathbf{u,v}) = L(\mathbf{u}) + L(\mathbf{v})$
- For all $\alpha \in \mathbb{R}$ and $\mathbf{u} \in U$, $L(\alpha \mathbf{u}) = \alpha L(\mathbf{u})$

## Additional operations

### Norm

The norm of a vector is denoted by $\norm{\mathbf{v}}$ and satisfies

- $\norm{\mathbf{v}} \geq 0$, $\norm{\mathbf{v}} = 0$ only if $\mathbf{v} = \mathbf{0}$
- $\norm{\alpha \mathbf{v}} = \alpha \norm{\mathbf{v}}$
- $\norm{\mathbf{v_1} + \mathbf{v_2}} \leq \norm{\mathbf{v_1}} + \norm{\mathbf{v_2}}$ (triangle sides)

### Scalar product

The scalar product of two vectors is a function $f: V \times V \rightarrow \mathbb{R}$, the function is commonly denoted as $\left \langle \mathbf{v_1}, \mathbf{v_2} \right \rangle$ and satisfies

- $\left \langle \mathbf{w, (u + v)} \right \rangle = \left \langle \mathbf{w,u} \right \rangle + \left \langle \mathbf{w,v} \right \rangle$
- $\left \langle \mathbf{w},\alpha \mathbf{v} \right \rangle = \alpha \left \langle \mathbf{w,v} \right \rangle$
- $\left \langle \mathbf{v,v} \right \rangle \geq 0$

