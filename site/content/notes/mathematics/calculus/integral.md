---
title:  "Integral"
date:   2015-04-02 10:00:00
categories: math calculus
libraries: ["function-plot"]
---

<style>
.line-1 {
  opacity: 0.4!important;
}
</style>

We're asked to find the derivative of the following function with respect to $x$:

<div>$$
\begin{equation}\label{definition-function}
y = 3x^2
\end{equation}
$$</div>

Performing the differentiation process

<div>$$
\begin{align*}
y' &= \lim_{\Delta{x} \to 0} \frac{f(x + \Delta{x}) - f(x)}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} \frac{3(x + \Delta{x}) ^ 2 - 3x^2}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} \frac{3x^2 + 6x\Delta{x} - \Delta{x}^2 - 3x^2}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} 6x - \Delta{x} \\
&= 6x
\end{align*}
$$</div>

Let's say that we're given the same problem in a reversed version, we're asked to find the *original function* of the following derivate function

<div>$$
\begin{equation}\label{definition-function-derivate}
y' = 6x
\end{equation}
$$</div>

Why? because "when we formulate physical problems mathematically the given physical information usually leads to derived functions, and the primary objective in solving the physical problems is to find the original functions" [^1]

We know that the original function corresponding to \eqref{definition-function-derivate} is \eqref{definition-function} but is there an algorithm to find the derivative for the case above? A possible algorithm for the differentiation of the **function above** might be:

```
for each term in the function
  - mutiply the coefficient with the exponent of the independent variable
  - reduce the exponent of the independent variable by one
```

Reversing the algorithm above means that we're actually trying to find the *original function*, a reversed version of the algorithm above might be:

```
for each term in the function
  - increment the exponent of the independent variable by one
  - divide the coefficient with the exponent of the independent variable
```

If we apply it to \eqref{definition-function-derivate} we get the *original function*:

<div>$$
6x \to 6x^2 \to 6/2x^2 \\
3x^2
$$</div>

However we have overlooked one point, it's also true that \eqref{definition-function-derivate} is the derived function of $y = 3x^2 + C$ where $C$ is some constant, this means that a constant term that was in the original function doesn't show up in the derived function, in the view of this possibility we must say that

<div>$$
y = 3x^2 + C
$$</div>

The process of going from the derived function to the original function is called *antidifferentiation* or *integration*, the original function is called the *primitive function* or the *indefinite integral* of the given function (which is shortened to *integral*)

Before proving the correctness of the previous algorithm let's try it on similar functions, the formula for instantaneous acceleration (the instantaneous rate of change of speed with respect to time) is

<div>$$
v' = 32
$$</div>

Here the independent variable is actually $x^0$, applying the 2-step algorithm to find the original function

<div>$$
32t^0 \to 32t \to 32/1\;t \\
32t
$$</div>

Same as above, since the original function might have had a constant

<div>$$
v = 32t + C
$$</div>

## Straight line motion in one direction

Galileo obtained a basic physical principle, if one neglects air resistance **all** objects near the earth's surface fall to earth with the same acceleration which is constant (a downward acceleration), the constant value is equal to:

<div>$$
32 \text{ feet/s }
$$</div>

> find how long it takes for an object dropped from 400 feet above the earth's surface to reach the surface.

The instantaneous acceleration as seen above is

<div>$$
a = v' = 32
$$</div>

Applying the 2-step algorithm

<div>$$
v = 32t + C
$$</div>

If the object is dropped it leaves with zero speed (when $t=0$, $v=0$), substituting these values in the formula above to find the value of $C$

<div>$$
0 = 32 * 0 + C \\
C = 0
$$</div>

Therefore the correct formula for speed is

<div>$$
\begin{equation}\label{speed-example}
v = s' = 32t
\end{equation}
$$</div>

Applying a new process of *antidifferentiation* to \eqref{speed-example}

<div>$$
s = 16t^2 + C
$$</div>

If we agree to measure distance from the point the object is dropped then the initial distance when $t = 0$ is also zero, $C$ will also have a value of zero, hence the correct formula for distance is

<div>$$
s = 16t^2
$$</div>

To answer the original equation we must find out the value of $t$ given that $s=400$:

<div>$$
t = \pm\sqrt{\frac{s}{16}} = \pm\sqrt{\frac{400}{16}} = \pm\sqrt{25} = \pm 5
$$</div>

For the physical problem only the positive solution is valid, with the same knowledge we can also tackle problems where the object is thrown instead of dropped

> find how long it takes for an object thrown downward from with a velocity of 100 ft/s from a height of 1000 feet to reach the earth's surface

Starting with the formula of instantaneous acceleration:

<div>$$
a = 32
$$</div>

Applying the 2-step algorithm

<div>$$
v = 32t + C
$$</div>

The object is thrown downwards instead of dropped which means that when $t=0,\;v=100$

<div>$$
100 = 32 * 0 + C \\
C = 100
$$</div>

Hence the correct formula for speed is

<div>$$
v = 32t + 100
$$</div>

Applying a new process of *antidifferentiation*

<div>$$
s = 16t^2 + 100t + C
$$</div>

If we agree to measure the distance from the point where the object is thrown then $C = 0$

<div>$$
s = 16t^2 + 100t
$$</div>

---

It's convenient to measure distance from the earth's surface and not from any arbitrary distance like the examples above, however this means that the upward direction is positive, then the acceleration of the gravity must be negative i.e. $-32\;ft/sec^2$ so that the distance traveled by reason of this acceleration is recorded as downward

<div>$$
v' = -32\;ft/sec^2
$$</div>

Then by *antifidifferentiation*

<div>$$
\begin{equation}\label{speed-raw}
v = -32t + C
\end{equation}
$$</div>

if an object is thrown upward it must have an initial velocity upward, let's say that an object located in the earth's surface is thrown upward with an initial velocity equal to $128\;ft/s$, substituting these values in \eqref{speed-raw} (when $t = 0,\; v = 128$):

<div>$$
128 = -32 * 0 + C \\
C = 128
$$</div>

so that

<div>$$
\begin{equation}\label{velocity-1}
v = -32t + 128
\end{equation}
$$</div>

Applying a new process of *antidifferentiation* to find the distance traveled upward at any time $t$

<div>$$
s = -16t^2 + 128t + C
$$</div>

Because we have agreed to measure distance from the surface the value of $C$ is zero because when $t = 0$ the object is still on the ground

<div>$$
\begin{equation}\label{distance-1}
s = -16t^2 + 128t
\end{equation}
$$</div>

One question of interest is the *maximum height* attained by an object whose motion is represented by \eqref{distance-1}, this problem could be answered if we knew at what $t$ the object attains maximum height, however we can use \eqref{velocity-1} to obtain the time since we know that the instant the object attains maximum height the velocity will be zero (the object will rise until it's velocity is zero and then fall), substituting zero as the speed in \eqref{velocity-1}

<div>$$
0 = -32t + 128 \\
t = \frac{128}{32} = 4
$$</div>

Now that we know the time at which the object attains the *maximum height* let's replace it on \eqref{distance-1}

<div>$$
\begin{align*}
s &= -16(4)^2 + 128 * 4 \\
  &= -256 + 512 \\
  &= 256 \text{ feet }
\end{align*}
$$</div>

We can generalize the solutions above for objects thrown in any planet, we can represent the acceleration with the symbol $g$, so the acceleration due to this gravity felt from the ground is

<div>$$
\begin{equation}\label{acceleration}
a = -g
\end{equation}
$$</div>

By *antidifferentiation*

<div>$$
v = -gt + C
$$</div>

Since it's a generalization we don't know the initial velocity (the value of $C$ is some constant), let's represent the initial velocity of the object with the symbol $v_0$, hence the formula for the velocity is

<div>$$
\begin{equation}\label{speed}
v = v_0 - gt
\end{equation}
$$</div>

Applying a new process of *antidifferentiation* to find the distance of the object from the ground

<div>$$
s = v_0t - \frac{gt^2}{2} + C
$$</div>

For this case we also don't know the initial distance from the ground the object is when $t = 0$, let's represent the initial distance from the ground with the symbol $s_0$

<div>$$
\begin{equation}\label{distance}
s = s_0 + v_0t - \frac{gt^2}{2}
\end{equation}
$$</div>

// TODO: introduce the integral symbol

## Definite Integral

### Area as the limit of the sum

Let's say we want to compute the area of the graph below $f(x)$ and the $x$-axis bounded by the vertical lines $x = a = 1$ and $x = b = 2$

<div>$$
f(x) = x^2
$$</div>

<div id="area-a-b"></div>

An approximation to the area can be found by taking the maximum y-value in $(a, b)$ called $m_1$ and multiplying it $(b - a)$ which will be expressed as $\Delta(x)$, then the first approximation is $m_1\Delta{x}$

<div>$$
S_1 = m_1\Delta{x}
$$</div>

<div id="area-first-approximation"></div>

We can obtain a better approximation if we divide the interval $(a, b)$ into two equal parts each denoted by $\Delta{x}$ multiplied by the maximum y-value in each part and then form the sum

<div>$$
S_2 = m_1\Delta{x} + m_2\Delta{x}
$$</div>

<div id="area-second-approximation"></div>

Dividing the interval $(a, b)$ into $n$ equal parts each denoted as $\Delta{x}$ and choosing $n$ maximum y-values for each part we form the sum:

<div>$$
S_n = m_1\Delta{x} + m_2\Delta{x} + \ldots + m_n\Delta{x}
$$</div>

<div>
  <div id="sum-area"></div>
  <input class="center" style="width: 300px; margin: 0 auto; display: block" type="range" id="sum-area-slider" value="30" min="2" max="100">
</div>

The quantity $n$ can increase without a limit, to each $n$ there's a corresponding sum, now the quantity

<div>$$
\lim_{n \to \infty} S_n
$$</div>

Seems to give the exact area of the under the curve bounded by $a$ and $b$ therefore

<div>$$
\lim_{n \to \infty} S_n = A
$$</div>

There is another notation for this limit which keeps the bounds that determine the area, if $y = f(x)$ then we write for the limit:

<div>$$
\int_{a}^{b} f(x) dx
$$</div>

The elongated S denotes integration, the symbols $a$ and $b$ are the left and right ends of the domain whose area is being calculated and $f(x)dx$ is a reminder that we took rectangles of height $y_i$ and width $\Delta{x_i}$.

### Evaluation of definite integrals

Another way to find the area is as follows, previously we found an approximation of the area as ($\Delta{x} * max(f(x))$ for all $x \in [a, b]$), similary we can take the lower bound instead ($\Delta{x} * min(f(x))$ for all $x \in [a, b]$) let's assume that somehow we have found the area below the curve bounded by $[a, x_0]$, moving $x_0$ to the right will generate an increment in the area, this change in the area can be expressed as

<div>$$
\Delta{A} = \bar{y} * \Delta{x}
$$</div>

<div>$$
\frac{\Delta{A}}{\Delta{x}} = \bar{y}
$$</div>

The value of $\bar{y}$ is some value between $f(x_0)$ and $f(x_0 + \Delta{x})$, to obtain the instantaneous rate of change in the area with respect to $x$ we must find the limit of $\Delta{A}/\Delta{x}$ as $\Delta{x}$ approaches zero, also as $\Delta{x}$ approaches zero the value of $\bar{y}$ also approaches $f(x_0)$ therefore

<div>$$
\frac{\Delta{A}}{\Delta{x}} = y_0 = f(x_0)
$$</div>

Because this is true for any value of $x$ in the interval $[a, b]$

<div>$$
\frac{\Delta{A}}{\Delta{x}} = y = f(x)
$$</div>

To find the value of $A(x)$ we apply antidifferentiation

<div>$$
A = \int f(x) \; dx
$$</div>

As an example let's apply the above to the function $f(x) = x^2$

<div>$$
\begin{equation}\label{integral-eval}
A = \int x^2 \; dx = \frac{x^3}{3} + C
\end{equation}
$$</div>

When $x = a = 1$ we know that the area is zero then

<div>$$
\begin{align*}
0 &= \frac{1^3}{3} + C \\
C &= -\frac{1}{3}
\end{align*}
$$</div>

Then

<div>$$
A = \frac{x^3}{3} - \frac{1}{3}
$$</div>

is the function which expresses the area from $a$ to any position $x$, to find the area bounded by $[a, b]$ we substitute $x = b = 2$ and get

<div>$$
A = \frac{2^3}{3} - \frac{1}{3} = \frac{7}{3}
$$</div>

We can obtain the same result if we take the expression \eqref{integral-eval} substituting 2 for $x$, 1 for $x$ and then subtracting the second result from the first

<div>$$
\frac{2^3}{3} + C - (\frac{1}{3} + C) = \frac{7}{3}
$$</div>

The constant of the integration is eliminated in the process, this process is actually called the *fundamental theorem of the calculus*

<div>$$
\int_{a}^{b} f(x)\;dx = F(b) - F(a)
$$</div>

Where $F(x)$ is the antiderivative of $f(x)$

### Additional properties of the definite integral

<div>$$
\int_{a}^{b} f(x)\;dx = -\int_{b}^{a} f(x)\;dx
$$</div>

<div>$$
\int_{a}^{b} f(x)\;dx = \int_{a}^{x_0} f(x)\;dx + \int_{x_0}^{b} f(x)\;dx
$$</div>

<div>$$
\int_{a}^{b} u\;dx \pm \int_{a}^{b} v\;dx = \int_{a}^{b} (u \pm v)\;dx
$$</div>

<div>$$
\frac{d}{dx} \int_{a}^{x} u\;du = f(x)
$$</div>

### Numerical methods for evaluating definite integrals

#### Trapezoid rule

Let's imagine that we have a curve which it's impossible to find the antiderivative thus the area below the curve, instead of calculating it we can approximate it's value by using trapezoids instead of rectangles as we've done before, we also know that approximating the area below the curve using the $min(f(x))$ value found in the interval $[a, b]$ multiplied by $b - a$ denoted as $\Delta{x}$ gives a lower bound of the area below the curve

<div>$$
\underline{S_n} = y_0 \Delta{x} + y_1 \Delta{x} + \ldots y_{n-1} \Delta{x}
$$</div>

Another appoximation was using the $max(f(x))$ value found in the interval $[a, b]$ multiplied by $b - a$ denoted as $\Delta{x}$ which gives the upper bound of the area below the curve

<div>$$
\overline{S_n} = y_1 \Delta{x} + y_2 \Delta{x} + \ldots y_{n} \Delta{x}
$$</div>

Calculating the average of these sums will definitely give an approximate result

<div>$$
S_n = \tfrac{1}{2} (y_0 + y_1) \Delta{x} + \tfrac{1}{2} (y_1 + y_2) \Delta{x} + \ldots +
\tfrac{1}{2} (y_{n-1} + y_n) \Delta{x}
$$</div>

Each of these terms is the [area of a trapezoid](https://www.wikiwand.com/en/Trapezoid#/Area) of height $\Delta{x}$ and bases $y_i$, $y_{i + 1}$

<div id="numerical-trapezoid"></div>

Rewriting the equation above

<div>$$
\int_{a}^b f(x)\;dx \approx \Delta{x} * (\tfrac{1}{2}y_0 + y_1 + y_2 + \ldots + y_{n-1} + \tfrac{1}{2} y_n)
$$</div>

#### [Simpson's rule][simpson]

Simpson rule approximates the value of a definite integral by using quadratic polynomials of the form

<div>$$
\begin{equation}\label{quadratic}
y = ax^2 + bx + c
\end{equation}
$$</div>

which pass through three points belonging to the curve which are $(-h, y_0)$, $(0, y_1)$, $(h, y_2)$

<div id="numerical-simpson"></div>

The area below the curve bounded by $[-h, h]$ is

<div>$$
\begin{align*}
A &= \int_{-h}^{h} (ax^2 + bx + c) \; dx \\
  &= \frac{ax^3}{3} + \frac{bx^2}{2} + cx \; \Big|_{-h}^h \\
  &= \frac{2ah^3}{3} + 2ch \\
  &= \frac{h}{3} (2ah^2 + 6c)
\end{align*}
$$</div>

Since the points $(-h, y_0)$, $(0, y_1)$ and $(h, y_2)$ are on the curve, they satisfy \eqref{quadratic}

<div>$$
\begin{align*}
y_0 &= ah^2 - bh + c \\
y_1 &= c \\
y_2 &= ah^2 + bh + c
\end{align*}
$$</div>

The quantity

<div>$$
y_0 + 4y_1 + y_2 = (ah^2 - bh + c) + 4c + (ah^2 + bh + c) = 2ah^2 + 6c
$$</div>

is equal to a part of the area under the quadratic polynomial found above, therefore

<div>$$
A = \frac{h}{3} (y_0 + 4y_1 + y_2)
$$</div>

To find the area bounded by $[a, b]$ we have to take an even number $n$ of subintervals of equal length

<div>$$
h = \frac{b - a}{n}
$$</div>

$n$ subintervals are defined with $n + 1$ points which are:

<div>$$
x_0 = a, \quad x_1 = a + h, \quad x_2 = a + 2 * h + \ldots + x_n = a + nh = b
$$</div>

We can estimate the value of the integral by adding the areas computed for each unique contiguous pair of subintervals

<div>$$
\begin{align*}
\int_{a}^{b} f(x) \; dx &\approx \tfrac{h}{3} (y_0 + 4y_1 + y_2) + \tfrac{h}{3} (y_2 + 4y_3 + y_4) + \cdots +\tfrac{h}{3} (y_{n-2} + 4y_{n-1} + y_n) \\
  &\approx \tfrac{h}{3} (y_0 + 4y_1 + 2y_2 + 4y_3 + 2y_4 + \ldots + 4y_{n-1} + y_n) \\
\end{align*}
$$</div>

---

<script src="/js/calculus/integral.js"></script>

### Physical applications of the definite integral

#### The calculation of work

When a force applied to an object causes a displacement it's said that **work** was done upon the object, this quantity expressed with the symbol $W$ is the product

<div>$$
W = Fs
$$</div>

As an example let's calculate the work done by the force of gravity, choosing the direction from the center of the earth upward as the positive direction we can use Newton's law for gravitation, this law states that any two objects attract each other and this force is given quantitatively by

<div>$$
F = \frac{GmM}{r^2}
$$</div>

$G$ is a constant, $m$ and $M$ are the masses of the two objects and $r$ is the distance between the objects (idealized as point particles)

Since this force of gravity actually pulls objects towards the center of the earth and we chose the direction from the center of the earth upward as positive this quantity must be negative

<div>$$
\begin{equation}\label{gravity}
F = -\frac{GmM}{r^2}
\end{equation}
$$</div>

To calculate the work done by gravity we cannot multiply the force of gravity by the displacement because the force actually varies from point to point along the path, suppose the object is at some distance $r$ from the center of the earth and gravity pulls the object downward a small distance $\Delta{r}$ then we work done by gravity is

<div>$$
\Delta{W} = F\Delta{r}
$$</div>

By division

<div>$$
\frac{\Delta{W}}{\Delta{r}} = F
$$</div>

We now determine the limit of $\tfrac{\Delta{W}}{\Delta{r}}$ as $\Delta{r}$ approaches 0 which is the rate of change of work with respect to the displacement over the path

<div>$$
\frac{dW}{dr} = \lim{\Delta{r} \to 0} \frac{\Delta{w}}{\Delta{r}} = F
$$</div>

Replacing \eqref{gravity}

<div>$$
\frac{dW}{dr} = -\frac{GmM}{r^2}
$$</div>

To find $W$ we apply an antidifferentiation process

<div>$$
W = \int{-\frac{GmM}{r^2}} = \frac{GmM}{r} + C
$$</div>

Assuming that initially when the object was at $r = r_1$ there was no force being applied to it therefore $W = 0$ and $C = -GmM/r_1$ and

<div>$$
W = \frac{GmM}{r} - \frac{GmM}{r_1}
$$</div>

[^1]: Excerpt From: Morris Kline. “Calculus: An Intuitive and Physical Approach(Second Edition).”
[simpson]: http://pages.pacificcoast.net/~cazelais/187/simpson.pdf
