---
title: "Transformation matrix"
date: 2015-10-15 13:00:00
description: |
  A linear transformation can be represented with a matrix which transforms vectors from
  one space to another. Transformation matrices allow arbitrary transformations
  to be displayed in the same format. Also matrices can be multiplied to enable
  [composition](../combining-transformations). This article covers how to think
  and reason about these matrices and the way we can represent them (row vectors vs column vectors).
image: /images/scaling-rotation-translation.png
tags: ["computer graphics", "transformation matrix", "2d", "3d", "linear algebra", "geometry"]
references:
  - "Dunn, F. and Parberry, I. (2002). 3D math primer for graphics and game development. Plano, Tex.: Wordware Pub."
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
---

Let's say that we're given the standard basis vectors $\mathbf{i} = [1, 0, 0], \; \mathbf{j} = [0, 1, 0], \; \mathbf{k} = [0, 0, 1]$ and we multiply each of these vectors by an *arbitrary* matrix $\mathbf{M}$

<div>$$
\begin{align*}
\
\mathbf{iM} &= \begin{bmatrix}1 & 0 & 0\end{bmatrix}
\begin{bmatrix}
m_{11} & m_{12} & m_{13} \\
m_{21} & m_{22} & m_{23} \\
m_{31} & m_{32} & m_{33} \\
\end{bmatrix} = \begin{bmatrix} m_{11} & m_{12} & m_{13} \end{bmatrix} \\
\
\\
\
\mathbf{jM} &= \begin{bmatrix}0 & 1 & 0\end{bmatrix}
\begin{bmatrix}
m_{11} & m_{12} & m_{13} \\
m_{21} & m_{22} & m_{23} \\
m_{31} & m_{32} & m_{33} \\
\end{bmatrix} = \begin{bmatrix} m_{21} & m_{22} & m_{23} \end{bmatrix} \\
\
\\
\
\mathbf{kM} &= \begin{bmatrix}0 & 0 & 1\end{bmatrix}
\begin{bmatrix}
m_{11} & m_{12} & m_{13} \\
m_{21} & m_{22} & m_{23} \\
m_{31} & m_{32} & m_{33} \\
\end{bmatrix} = \begin{bmatrix} m_{31} & m_{32} & m_{33} \end{bmatrix} \\
\
\end{align*}
$$</div>

The first row of $\mathbf{M}$ contains the result of *performing a transformation on the vector $\mathbf{i}$*, the second row is the result of transforming $\mathbf{j}$ and third row to $\mathbf{k}$

Let $\mathbf{v}$ be some vector expressed under this coordinate space which means that it can be represented as a linear combination of the basis

<div>$$
\mathbf{v} = v_x \mathbf{i} + v_y \mathbf{j} + v_z \mathbf{k}
$$</div>

If we multiply this vector by the matrix $\mathbf{M}$

<div>$$
\begin{align}
\mathbf{v'} = \mathbf{vM} &= (v_x \mathbf{i} + v_y \mathbf{j} + v_z \mathbf{k}) \mathbf{M}
\nonumber \\
&= v_x (\mathbf{iM}) + v_y (\mathbf{jM}) + v_z (\mathbf{kM}) \nonumber \\
&= v_x \begin{bmatrix} m_{11} & m_{12} & m_{13} \end{bmatrix} + v_y \begin{bmatrix} m_{21} & m_{22} & m_{23} \end{bmatrix} + v_z \begin{bmatrix} m_{31} & m_{32} & m_{33} \end{bmatrix} \label{vm} \\
\end{align}
$$</div>

If we let $\mathbf{M}$ have the form

<div>$$
\mathbf{M} = \begin{bmatrix}
-\mathbf{p}- \\
-\mathbf{q}- \\
-\mathbf{r}-
\end{bmatrix}
$$</div>

Then \eqref{vm} can be rewritten as

<div>$$
\mathbf{v'} = \mathbf{vM} = v_x \mathbf{p} + v_y \mathbf{q} + v_z \mathbf{r}
$$</div>

$\mathbf{vM}$ is a *linear combination* of the rows of $\mathbf{M}$, if we interpret these row vectors as the *basis vectors* of some coordinate system expressed/measured in terms of an **outer coordinate system** then we have successfully created a structure that encodes a space coordinate transformation (from *object space* to *upright space*) in the form of a matrix

<div>$$
\mathbf{v'} = \mathbf{vM} = \begin{bmatrix}v_x & v_y & v_z\end{bmatrix}
\begin{bmatrix}
-\textbf{p}- \\
-\textbf{q}- \\
-\textbf{r}-
\end{bmatrix} = v_x \mathbf{p} + v_y \mathbf{q} + v_z \mathbf{r}
$$</div>

Another way to see this is that $\mathbf{M}$ encodes in its rows a transformation made to the standard basis vectors $\mathbf{i}, \mathbf{j}, \mathbf{k}$

The following notation means the rotation matrix that transforms the frame $a$ to the frame $b$ and that is represented in the frame $c$

<div>$$
^{c} \mathbf{M}_{a \to b}
$$</div>

If the frame $c$ is equal to the frame $b$ then it can be omitted since it's assumed that the matrix is represented in terms of the frame $b$

<div>$$
\mathbf{M}_{a \rightarrow b}
$$</div>

For example the matrix that transform from *object space* to *upright space* is represented as

<div>$$
\mathbf{M}_{object \rightarrow upright}
$$</div>

Transforming the vector $\mathbf{v_{object}}$ expressed in *object space* to *upright space* is then

<div>$$
\mathbf{v}_{upright} = \mathbf{v}_{object} \mathbf{M}_{object \rightarrow upright}
$$</div>

## Row versus column vectors

A space coordinate transform operation has the form

<div>$$
\mathbf{v'} = \mathbf{vM}
$$</div>

Where $\mathbf{M}$ encodes in its **rows** a transformation made to the standard basis vectors and $\mathbf{v'}$ and $\mathbf{v}$ are **row vectors**

Let's say that we want to transform a **row vector** by the matrices $\mathbf{A}$, $\mathbf{B}$ and $\mathbf{C}$ in that order, the operation is represented as

<div>$$
\mathbf{v'} = \mathbf{vABC}
$$</div>

However it could be possible that $\mathbf{v}$ is instead a **column vector**, in that case also $\mathbf{v'}$ must be a column vector, for $\mathbf{v'}$ to have the correct result we must **pre-multiply $\mathbf{v}$ by the transpose of the transformation matrix** which is equivalent to transposing both sides of the equation

<div>$$
\begin{align*}
\mathbf{v'} &= \mathbf{vABC} \\
\mathbf{v'}^T &= (\mathbf{vABC})^T && \text{transposing both sides} \\
\mathbf{v'}^T &= \mathbf{C}^T \mathbf{B}^T \mathbf{A}^T \mathbf{v}^T && \text{because of the }\href{https://www.wikiwand.com/en/Transpose#/Properties}{\text{matrix transpose properties}}
\end{align*}
$$</div>

Note that

- the transformations matrices $\mathbf{A}^T$, $\mathbf{B}^T$ and $\mathbf{C}^T$ encode in their **columns** a transformation made to the standard basis vectors i.e. they have the form

<div>$$
\mathbf{M} = \begin{bmatrix}
\mathbf{p}_{3 \times 1} & \mathbf{q}_{3 \times 1} & \mathbf{r}_{3 \times 1} \end{bmatrix} \quad \text{where $\mathbf{p} = \begin{bmatrix} p_x \\ p_y \\ p_z \end{bmatrix}$, $\mathbf{q} = \begin{bmatrix} q_x \\ q_y \\ q_z \end{bmatrix}$ and $\mathbf{r} = \begin{bmatrix} r_x \\ r_y \\ r_z \end{bmatrix}$}
$$</div>

In Dunn & Parberry's book a column vector inside a matrix is written as

<div>$$
\mathbf{M} = \begin{bmatrix}
\cuv{\mathbf{p}} &
\cuv{\mathbf{q}} &
\cuv{\mathbf{r}}
\end{bmatrix}
$$</div>

Also note that in this notation the arrow that connects the frames involved in the transformation is reversed, for example the transformation matrix that transform from *object space* to *upright space* is

<div>$$
\mathbf{M}_{upright \leftarrow object}
$$</div>

In computer graphics [*column vectors* should be used](http://chrishecker.com/Column_vs_row_vectors) to represent points, differences between points and the likes

