---
title: "Quaternions"
date: 2016-04-26 16:39:27
description: |
  Quaternions are an alternate way to describe orientation or rotations in 3d space
  using an ordered set of four numbers. They have the ability to uniquely describe
  any 3d rotation about an arbitrary axis and do not suffer from a problem using
  euler angles called gimbal lock.
image: /images/flat-shading.svg
tags: ["quaternions", "3d", "computer graphics", "rotation"]
libraries: ["math"]
---

## Quaternions as rotations

Let $p$ be a 3d point represented as a quaternion using its homogeneous coordinates, $p = [w, \mathbf{v}]$ and let $q$ be any non-zero quaternion then

> Theorem: The product $qpq^{-1}$ takes $p = [w, \mathbf{v}]$ to $p' = [w, \mathbf{v'}]$

Before proving this theorem let's make the following observation, we can express $q$ as a multiplication of a scalar quaternion $s$ and a unit quaternion $\mathbf{U}q$, $q = s\mathbf{U}q$, then $qpq^{-1}=s\mathbf{U}qp(s\mathbf{U}q)^{-1}=s\mathbf{U}qp\mathbf{U}q^{-1}s^{-1}$, because the scalar multiplication is commutative $\mathbf{U}qp\mathbf{U}q^{-1}ss^{-1}=\mathbf{U}qp\mathbf{U}q^{-1}$ so the product doesn't change irrespective of whether $q$ is a unit quaternion or not, finally notice that $\mathbf{U}q^{-1} = \mathbf{U}q^\*$ so we can write the action as $qpq^\*$ **note that from now on, $q$ is assumed to be a unit quaternion without loss of generality**

Next, let's prove that the scalar part $qpq^{*}$ is the same as the scalar of $p$ (we can use the formula to find the scalar component of a quaternion)

<div>$$
\begin{align*}
2S(qpq^*) &= qpq^* + (qpq^*)^* \\
&= qpq^* + qp^*q^* \\
&= q(p + p^*)q^* \\
&= q2S(p)q^* \\
&= 2qS(p)q^* \\
&= 2[s_q, \mathbf{v_q}][s_p, \mathbf{0}][s_q, -\mathbf{v_q}] \\
&= 2[s_ps_q, s_p\mathbf{v_q}][s_q, -\mathbf{v_q}] \\
&= 2[s_ps_q^2 - s_p (\mathbf{v_q} \cdot -\mathbf{v_q}), -s_ps_q\mathbf{v_q} + s_ps_q\mathbf{v_q} + s_p\mathbf{v_q \times v_q}] \\
&= 2[s_ps_q^2 + s_p\norm{v}^2, \mathbf{0}] \\
&= 2[s_ps_q^2 + s_p(1 - s_q^2), \mathbf{0}] \quad \text{because of the definition of a unit quaternion} \\
&= 2[s_p, \mathbf{0}] \\
&= 2S(p)
\end{align*}
$$</div>

Therefore the scalar part of $p$ remains constants in the operation i.e. if $p = [w, \mathbf{v}]$ then $p' = qpq^{*} = [w, \mathbf{v'}]$, and because multiplication preserves norms then $\norm{p} = \norm{p'}$ and also $\norm{v} = \norm{v'}$ $\blacksquare$

> Theorem: if $\norm{q} = 1$ then $q = [\cos{\theta}, \unit{v} \sin{\theta}]$ acts to rotate around unit axis $\unit{v}$ by $2 \theta$

Let

<div>$$
v_0 = [0, \mathbf{v_0}] \quad \norm{v_0} = \norm{\mathbf{v_0}} = 1 \\
v_1 = [0, \mathbf{v_1}] \quad \norm{v_1} = \norm{\mathbf{v_1}} = 1
$$</div>

Be two pure quaternions (which can be represented in 3d space), and an arbitrary quaternion $q$ which has the form

<div>$$
\begin{align}
q &= v_1v_0^* \label{q} \\
&= [0, \mathbf{v_1}][0, -\mathbf{v_0}] \nonumber \\
&= [\mathbf{v_0 \cdot v_1}, \mathbf{v_0 \times v_1}] \label{q3d}
\end{align}
$$</div>

Let $\theta$ be the angle between $\mathbf{v_0}$ and $\mathbf{v_1}$ then $\mathbf{v_0 \cdot v_1} = \cos{\theta}$, also let $\mathbf{v_0 \times v_1} = \sin{\theta} \unit{v}$, then \eqref{q} becomes

<div>$$
\begin{equation} \label{q2}
q = [\cos{\theta}, \sin{\theta} \unit{v}]
\end{equation}
$$</div>

Let's prove first that the product $v\_2 = qv\_0q^{*}$ lies in the same plane as $\mathbf{v_0}$ and $\mathbf{v_1}$, we do so by proving first that the product $v\_2v\_1^\*$ has the same components (dot and cross products) as $v\_1v\_0^\*$

<div>$$
\begin{align*}
v_2v_1^* &= (qv_0q^*) v_1^* \\
&= (q v_0 (v_1v_0^*)^*) v_1^* \\
&= (q v_0 v_0 v_1^*) v_1^* \\
&= q (v_0v_0)(v_1^*v_1^*) \\
&= q (-1)(-1) \quad \text{since they're unit quaternions they square to $-1$} \\
&= v_1v_0^*
\end{align*}
$$</div>

<img class="lazy-load" data-src="https://i.imgur.com/wVzPl0R.png" alt="" style="display: block; margin: 0 auto; width: 300px">

Then if $v_2v_1^* = v_1v_0^*$ that means that $v_2=qv_0q^*$ lies in the same plane as $v_0$ and $v_1$, also $v_2$ forms an angle of $\theta$ with $v_1$, furthermore $\mathbf{v_1} \times \mathbf{v_2} = \unit{v} \sin{\theta}$, finally if the angle between $v_0$ and $v_1$ is $\theta$ then the angle between $v_0$ and $v_2$ is $2\theta$ which confirms what's seen on the image above

Furthermore the same can be said of $q$ acting on $v_1$, let $v_3 = qv_1q^{*}$ then

<div>$$
\begin{align*}
v_3v_2^* &= (qv_1q^*)(qv_0q^*)^* \\
&= (q(qv_0)q^*)(qv_0q^*)^* \quad \text{by finding $v_1$ from \eqref{q}} \\
&= q (qv_0q^*)(qv_0q^*)^* \\
&= q \\
&= v_1v_0^*
\end{align*}
$$</div>

Now any vector $p$ can be represented in terms of the base $v_0$, $v_1$ and $\unit{v}$ e.g. $p = s_1\mathbf{v_0} + s_1\mathbf{v_1} + s_2\unit{v}$, we've seen what $q$ does to $v_0$ and $v_1$ so let's see what it does to $\unit{v}$

Before computing $q\unit{v}q^{*}$ see that

<div>$$
\begin{align*}
q\unit{v} &= [\cos{\theta}, \sin{\theta} \unit{v}][0, \unit{v}] \\
&= [\ldots, \ldots - \sin{\theta} (\unit{v} \times \unit{v})] \\
&= [\ldots, \ldots - \mathbf{0}]
\end{align*}
$$</div>

So $q\unit{v}$ is a commutative operation because the cross product is the only term that makes the quaternion operation non-commutable and in $q\unit{v}$ that therm is zero therefore $q\unit{v}q^ \* = \unit{v}qq^ \* = \unit{v}$ which means that $q$ does not modify $\unit{v}$

Thus the action of $q$ on any vector $p$ is a rotation around $\unit{v}$ by $2\theta$ $\blacksquare$

## Quaternion rotation facts

Let $q_1$ be a quaternion which rotates the pure quaternion $p_1$ to $p_2$ and also let $q_2$ be a quaternion which rotates the vector $p_2$ to $p_3$ then $p_3$ will have the form

<div>$$
\begin{align*}
p_3 &= q_2p_2q_2^* \\
&= q_2(q_1p_1q_1^*)q_2^* \\
&= (q_2q_1)p_1(q_1^*q_2^*) \\
&= (q_2q_1)p_1(q_2q_1)^*
\end{align*}
$$</div>

Therefore the combination of rotation $q_1$ followed by $q_2$ is given by $q = q_2q_1$

> When the rotations $q_1, q_2, \ldots, q_n$ are applied to the pure quaternion $p$ the result is equal to $qpq^*$ where $q = q_n q_{n-1} \ldots q_2 q_1$
