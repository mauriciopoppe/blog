---
title: "Geometric tests"
date: 2016-03-09 22:52:35
references:
  - "Intersection between two segments. [online] Stackoverflow.com. Available at: http://stackoverflow.com/a/565282/3341726 [Accessed 10 Mar. 2016]."
  - "Palacios, R. (2012). Geometria Computacional. (presentation given at the UCB for the ICPC 2012)"
  - "Lee, J. (2008). Similar triangles [online] Math.washington.edu. Available at: https://www.math.washington.edu/~lee/Courses/444-5-2008/supplement3.pdf [Accessed 10 Mar. 2016]."
---

## Line-line intersection

Given two lines in 3D defined as rays

<div>$$
r_1(t_1) = \mathbf{p_1} + t_1 \mathbf{d_1} \\
r_2(t_2) = \mathbf{p_2} + t_2 \mathbf{d_2}
$$</div>

Where $t_1, t_2 \in \mathbb{R}$, the two lines intersect if

<div>$$
\mathbf{p_1} + t_1 \mathbf{d_1} = \mathbf{p_2} + t_2 \mathbf{d_2}
$$</div>

We can apply the cross multiplication operation on both sides with $\mathbf{d_2}$ and work from there to find the value of $t_1$

<!--
<div>$$
\begin{align*}
(\mathbf{p_1}  + t_1 \mathbf{d_1}) \times \mathbf{d_2} &= (\mathbf{p_2} + t_2 \mathbf{d_2}) \times \mathbf{d_2} \\
\mathbf{p_1} \times \mathbf{d_2} + t_1 (\mathbf{d_1} \times \mathbf{d_2}) &= \mathbf{p_2} \times \mathbf{d_2} + t_2 (\mathbf{d_2} \times \mathbf{d_2}) \\
\mathbf{p_1} \times \mathbf{d_2} + t_1 (\mathbf{d_1} \times \mathbf{d_2}) &= \mathbf{p_2} \times \mathbf{d_2}
\end{align*}
$$</div>

Finding the value of $t_1$

<div>$$
\begin{align*}
t_1 (\mathbf{d_1} \times \mathbf{d_2}) &= \mathbf{p_2} \times \mathbf{d_2} - \mathbf{p_1} \times \mathbf{d_2} \\
t_1 &= \frac{\mathbf{p_2} \times \mathbf{d_2} - \mathbf{p_1} \times \mathbf{d_2} }{ \mathbf{d_1} \times \mathbf{d_2} } \\
\end{align*}
$$</div>
-->

<div>
<div>$$
t_1 = \frac{\norm{(\mathbf{p_2} - \mathbf{p_1}) \times \mathbf{d_2} }}{ \norm{\mathbf{d_1} \times \mathbf{d_2}} }
$$</div>
</div>

Similarly we can find the value of $t_2$ by crossing with $\mathbf{d_1}$ and work from there to find the value of $t_2$

<!--
<div>$$
\begin{align*}
(\mathbf{p_1}  + t_1 \mathbf{d_1}) \times \mathbf{d_1} &= (\mathbf{p_2} + t_2 \mathbf{d_2}) \times \mathbf{d_1} \\

\mathbf{p_1} \times \mathbf{d_1} + t_1 (\mathbf{d_1} \times \mathbf{d_1}) &= \mathbf{p_2} \times \mathbf{d_1} + t_2 (\mathbf{d_2} \times \mathbf{d_1}) \\

\mathbf{p_1} \times \mathbf{d_1} &= \mathbf{p_2} \times \mathbf{d_1} + t_2 (\mathbf{d_2} \times \mathbf{d_1}) \\

t_2 (\mathbf{d_2} \times \mathbf{d_1}) &= \mathbf{p_1} \times \mathbf{d_1} - \mathbf{p_2} \times \mathbf{d_1} \\

t_2 &= \frac{ \mathbf{p_1} \times \mathbf{d_1} - \mathbf{p_2} \times \mathbf{d_1} }{ \mathbf{d_2} \times \mathbf{d_1} } \\

t_2 &= \frac{ (\mathbf{p_1} - \mathbf{p_2}) \times \mathbf{d_1} }{ \mathbf{d_2} \times \mathbf{d_1} } \\
\end{align*}
$$</div>
-->

<div>$$
t_2 = \frac{\norm{ (\mathbf{p_2} - \mathbf{p_1}) \times \mathbf{d_1}} }{ \norm{\mathbf{d_1} \times \mathbf{d_2}} }
$$</div>

The proof can be found [ here ](http://stackoverflow.com/a/565282/3341726)

---

We can actually solve this problem graphically by using [triangle similarity](https://www.mathsisfun.com/geometry/triangles-similar-finding.html), imagine the following situation

{{< figure src="/images/geometric-tests!line-line.jpg" title="line line intersection" >}}

The intersection point $\mathbf{p}$ is equal to

<div>$$
\begin{equation} \label{line-line-intersection-point}
\begin{split}
\mathbf{p} &= \mathbf{a} + \norm{\mathbf{p - a}} \unit{ \mathbf{b - a} } \\
&= \mathbf{a} + \norm{\mathbf{p - a}} \frac{ \mathbf{b - a}  }{ \norm{\mathbf{b - a}} }
\end{split}
\end{equation}
$$</div>

By triangle similarity we see that

<div>$$
\frac{ \norm{\mathbf{p - a}} }{ \norm{\mathbf{b - a}} } = \frac{ \norm{\mathbf{n -a}} }{ \norm{\mathbf{m - a}} }
$$</div>

Multiplying the left side with an identity

<div>$$
\begin{equation} \label{line-line-triangle-similarity}
\frac{ \norm{\mathbf{p - a}} }{ \norm{\mathbf{b - a}} } = \frac{ \norm{\mathbf{n -a}} }{ \norm{\mathbf{m - a}} } \frac{ \norm{\mathbf{d - c}} }{ \norm{\mathbf{d - c}} }
\end{equation}
$$</div>

We see that the quantity $\norm{ \mathbf{ n - a } } \norm{\mathbf{d - c}}$ is equal to the equation of the area of a parallelogram, we can skew the parallelogram (in the graphic towards the $x$-axis) so that the left side becomes $\mathbf{c - a}$ and the bottom side $\mathbf{d - c}$ (which is not affected by the skew), note that the area can also be expressed with the cross product of the vectors $\mathbf{c - a}$ and $\mathbf{d - c}$ therefore

<div>$$
\begin{equation} \label{numerator-area}
\norm{\mathbf{n - a}} \norm{\mathbf{d - c}} = \norm{(\mathbf{c - a}) \times (\mathbf{d - c})}
\end{equation}
$$</div>

A similar equation can be derived for the parallelogram with sides $\mathbf{m - a}$ and $\mathbf{d - c}$, only this time the skewed side will become $\mathbf{b - a}$

<div>$$
\begin{equation} \label{denominator-area}
\norm{\mathbf{m - a}} \norm{\mathbf{d - c}} = \norm{(\mathbf{b - a}) \times (\mathbf{d - c})}
\end{equation}
$$</div>

Replacing \eqref{numerator-area}, \eqref{denominator-area} in \eqref{line-line-triangle-similarity} and \eqref{line-line-intersection-point} we see that the intersection point is equal to

<div>$$
\mathbf{p} = \mathbf{a} + (\mathbf{b - a}) \frac{ \norm{(\mathbf{c - a}) \times (\mathbf{d - c})} }{ \norm{(\mathbf{b - a}) \times (\mathbf{d - c})} }
$$</div>

