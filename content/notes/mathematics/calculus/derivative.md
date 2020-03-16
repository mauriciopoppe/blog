---
title: "Derivative"
date: 2015-04-02 10:00:00
categories: [math, calculus]
libraries: [d3, function-plot]
---

## Physical interpretation of the derivative

> The primary concept of the calculus deals with the rate of change of one variable with respect to another

### Instantaneous speed

Let's imagine a person who travels 90km in 3 hours, his *average speed* (rate of change of distance with respect to time) is 30km/h, of course he doesn't need to travel at that fixed speed, he may slow down/speed up at different times during the time he traveled, for *many* purposes it suffices to know the average speed.

However in many daily happenings the average speed is not a significant quantity, if a person traveling in an automobile strikes a tree the quantity that matters is the speed at the *instant of collision* (this quantity might determine if he survives or not)

|concept|description|
|----|----|
|interval|happens over a *period* of time|
|instant|happens so fast that no time elapses|

Calculating the *average speed* is simple, by definition it's the rate of change of distance with respect to time

<div>
$$
\text{average speed} = \frac{\text{distance traveled}}{\text{interval of time}}
$$
</div>

The same computation process can't be applied to get the *instantaneous speed* at some point in time since *instantaneous* means that the event happened in an infinitesimal or very short space of time, then distance and the time might be both zero hence using the *average speed* definition won't help because $\frac{0}{0}$ is meaningless, we know that this is a physical reality but if we can't calculate it it's impossible to work with it mathematically.

We can't compute it with the knowledge we have right now but we can surely approximate it, let's say that there's a ball dropped near the surface of the earth and we want to know its instantaneous speed after 4 seconds, to calculate the instantaneous speed at any point in time we need to know the distance it travels after some period of time, this relation could be expressed as a formula which relates distance and time traveled, the formula that relates the distance (in feet) with the time elapsed is

<div>
$$
f(t) = s = 16t^2
$$
</div>

We can calculate the distance the ball traveled after 4 seconds by replacing $t$ with 4

<div>
$$
\begin{align*}
s_4 &= 16 * 4^2 \\
&= 256 \text{ feet}
\end{align*}
$$
</div>

Let's also compute the distance the ball traveled after 5 seconds

<div>
$$
\begin{align*}
s_5 &= 16 * 5^2 \\
&= 400 \text{ feet}
\end{align*}
$$
</div>

The *average speed* for this interval of time is then

<div>
$$
\text{average speed for the interval of time [4, 5]} = \frac{s_5 - s_4}{1} = \frac{400 - 256}{1} = 144 \;\text{feet/s}
$$
</div>

So the *average speed* during the fifth second is $144\;\text{feet/s}$, this quantity is no more than an approximation of the *instantaneous speed*, but we may improve the approximation by calculating the average speed in the interval of time from 4 to 4.1 seconds which is

<div>
$$
\text{average speed for the interval of time [4, 4.1]} = \frac{268.96 - 256}{0.1} = 129.6\;\text{feet/s}
$$
</div>

Let's register more computations of the above process with smaller and smaller intervals of time in a table

|time elapsed after 4 seconds|1|0.1|0.01|0.001|0.0001|
|---|---|---|---|---|---|
|average speed (in feet/s)|144|129.6|128.16|128.016|128.0016|

Of course no matter how small the interval is the result is not the instant speed at the instant $t=4$ however we now see that the average speed for the intervals seem to be approaching to the fixed number **128 feet/s**

### Method of increments

Let's redo the process described above over an *arbitrary* interval of time, to do so let's introduce a quantity $h$ which represents an interval of time beginning at $t=4$ which extends before or after $t=4$ ($h$ is called an *increment* in $t$ because it's some interval of time)

The formula for the example above is

<div>
$$
\begin{equation}
\label{balldrop}
s = 16t^2
\end{equation}
$$
</div>

When calculated once by the end of the fourth second is

<div>
$$
\begin{equation}
\label{balldrop1}
s_4 = 16 * 4^2 = 256
\end{equation}
$$
</div>

When substituted with the interval $[4, 4 + h]$ is

<div>
$$
\begin{align}
s_4 + k &= 16 (4 + h) ^2 \notag \\
  &= 256 + 128h + 16h^2 \label{balldrop2}
\end{align}
$$
</div>

Where $k$ is the additional distance the object falls $h$ seconds after the initial $4$ seconds, to obtain $k$ we have to subtract $\eqref{balldrop1}$ from $\eqref{balldrop2}$, the result is

<div>
$$
k = 128h + 16h^2
$$
</div>

The average speed in this interval of time is then $\frac{k}{h}$, dividing both sides by $h$

<div>
$$
\frac{k}{h} = 128 + 16h
$$
</div>

To compute the instantaneous speed the interval $h$ must become smaller and smaller until it reaches 0, if $h$ approaches 0 then $16h$ also approaches 0, we can conclude that the instantaneous speed when $t=4$ approaches **128 feet/s**

#### Generalization

Let's generalize the process above for $\eqref{balldrop}$ for any value of $t$, to do so let's apply the method of increments when $t$ is substituted with the interval $t + h$

<div>
$$
\begin{align*}
s + k &= 16(t + h)^2 \\
&= 16t^2 + 32th + h^2
\end{align*}
$$
</div>

Subtracting $\eqref{balldrop}$ from the equation above

<div>
$$
\begin{align*}
k &= 32th + h^2
\end{align*}
$$
</div>

Dividing both sides by $h$

<div>
$$
\begin{equation}
\label{balldrop-derivative}
\frac{k}{h} = 32t + h
\end{equation}
$$
</div>

Just like stated above to compute the instantaneous speed the interval $h$ must become smaller and smaller until it reaches 0, if $h$ approaches 0 then the instantaneous speed approaches $32t$ which is a function that will tell us the *instantaneous speed* of the falling object at any time $t$!

It has been customarily since the days of Euler use $\Delta{t}$ (*delta* t) for the increment of $t$, $\Delta{t}$ means a "change in the value of $t$". Thus $\Delta{t}$ has the same meaning as $h$, likewise $\Delta{s}$ has the same meaning as $k$, we can rewrite $\eqref{balldrop-derivative}$ as

<div>
$$
\begin{equation}
\label{balldrop3}
\frac{\Delta{s}}{\Delta{t}} = 32t + 16\Delta{t}
\end{equation}
$$
</div>

It's desirable to have some short notation for the statement that we have evaluated the *limit* of as the values of $\Delta{t}$ approach 0 which can be expressed as

<div>
$$
\lim_{\Delta{t} \to 0} \frac{\Delta{s}}{\Delta{t}}
$$
</div>

Where *lim* is an abbreviation for limit, replacing $\eqref{balldrop3}$ with this new notation

<div>
$$
\begin{equation}
\label{balldrop-limit}
\lim_{\Delta{t} \to 0} \frac{\Delta{s}}{\Delta{t}} = 32t
\end{equation}
$$
</div>

To some mathematicians this notation is somewhat lengthy, hence mathematicians replaced it with different variations

<div>
$$
\lim_{\Delta{t} \to 0} \frac{\Delta{s}}{\Delta{t}} = \frac{ds}{dt} = s' = f'(t)
$$
</div>

The rate of change is not always related with time or distances, a generalization of the formulas above is needed, instead of the symbols $s$ and $t$ let's use $x$ and $y$ without specifying what $x$ and $y$ mean physically

Let's calculate the instantaneous rate of change of $y$ with respect to $x$ (the word *instantaneous* does not really apply because $x$ doesn't represent time), using the *method of increments* on a function which depends on $x$

<div>
$$
\begin{align}
y &= f(x) \label{x-a} \\
y + \Delta{y} &= f(x + \Delta{x}) \label{x-b}
\end{align}
$$
</div>

Subtracting $\eqref{x-a}$ from $\eqref{x-b}$

<div>
$$
\Delta{y} = f(x + \Delta{x}) - f(x)
$$
</div>

Dividing both sides by $\Delta{x}$

<div>
$$
\frac{\Delta{y}}{\Delta{x}} = \frac{f(x + \Delta{x}) - f(x)}{\Delta{x}}
$$
</div>

The instantaneous rate of change of $y$ with respect to $x$ is reached when $\Delta{x}$ approaches 0

<div>
$$
\begin{equation} \label{limit}
\lim_{\Delta{x} \to 0} \frac{f(x + \Delta{x}) - f(x)}{\Delta{x}}
\end{equation}
$$
</div>

We can also use the variations for the notation of the rate of change

<div>
$$
\lim_{\Delta{t} \to 0} \frac{\Delta{y}}{\Delta{x}} = \frac{dy}{dx} = y' = f'(x)
$$
</div>

What we did with the process above was to *find the instantaneous rate of change of $y$ with respect to $x$*, we call this rate the **derivative** of $y$ with respect to $x$, the process of applying the method of increments to obtain the derivative is called **differentiation**

## Geometric interpretation of the derivative

Let's graph the following formula

<div>
$$
\begin{equation}\label{yx2}
y = x^2
\end{equation}
$$
</div>

<div id="geometric-representation"></div>

A point belonging to this geometrical representation of $y$ has the form $(x_1, f(x_1))$, e.g. when $x = 1, y = 1$ and when $x = 2, y = 4$

<div id="geometric-representation-two-points"></div>

Let's say that $(x_1, f(x_1))$ is a fixed point on the curve (for the sake of this example the point will be $x_1 = 1, y_1 = 1$), any other point that belongs to the curve can make a line with the fixed point

<div id="geometric-representation-secant"></div>

The slope is a quantity that describes the direction and steepness of a line and is calculated by finding the ratio of the *vertical change* to the *horizontal change* between any **distinct** two points on the line, the previous statement expressed as a formula is

<div>
$$
m = \frac{y_2 - y_1}{x_2 - x_1} = \frac{\Delta{y}}{\Delta{x}}
$$
</div>

What if the movable point get closer and closer to the fixed point such that $\Delta{x}$ reaches 0? That's exactly the definition of the derivative which means that the derivative of a function will tell us the *slope* of the [*tangent* line][tangent-line] to the function (represented geometrically as a curve) at any derivable point!

Let's find the instantaneous rate of change of this function evaluated at $x=1$, using $\eqref{limit}$

<div>
$$
\begin{align*}
m_1 = f'(1) &= \lim_{\Delta{x} \to 0} \frac{f(1 + \Delta{x}) - f(1)}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} \frac{(1 + \Delta{x}) ^ 2 - 1^2}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} \frac{1^2 + 2\Delta{x} - \Delta{x}^2 - 1^2}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} 2 - \Delta{x} \\
&= 2
\end{align*}
$$
</div>

This fixed number is the value of the *slope* of the line tangent to the derivative function when it's evaluated with $1$, let's find out the *Point–slope* form of the *tangent* line whose *slope* is $m$

<div>
$$
\begin{equation}\label{line-equation}
y - y_1 = m(x - x_1)
\end{equation}
$$
</div>

Substituting $y_1=1$, $m=2$ and $x_1=1$ computed above

<div>
$$
\begin{align*}
y &= 2(x - 1) + 1 \\
  &= 2x - 2 + 1 \\
  &= 2x - 1
\end{align*}
$$
</div>

If we graph this line next to the geometric representation of $y = x^2$ we see that's actually touching the curve at the point $(1, 1)$

<div id="slope-static-x-1"></div>

Before finding the equation of the slope for any value of $x$ let's imagine the graph produced by the slope function, if we take a look at the graph produced by $\eqref{yx2}$ we can see that for any point that belongs to the curve whose $x$ coordinate is negative the slope will be negative and for any point that belongs to the curve whose $x$ coordinate is positive the slope will be positive, expressed mathematically

<div>
$$
sgn(m) = \begin{cases}
-1 & if x < 0, \\
0 & if x = 0, \\
1 & if x > 0.
\end{cases}
$$
</div>

Now that we have an idea of the values of the *slope* let's find the value of $m$ for any value of $x$ that is the derivative of $y$ with respect to $x$, using $\eqref{limit}$

<div>
$$
\begin{align*}
f'(x) &= \lim_{\Delta{x} \to 0} \frac{f(x + \Delta{x}) - f(x)}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} \frac{(x + \Delta{x}) ^ 2 - x^2}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} \frac{x^2 + 2x\Delta{x} - \Delta{x}^2 - x^2}{\Delta{x}} \\
&= \lim_{\Delta{x} \to 0} 2x - \Delta{x} \\
&= 2x
\end{align*}
$$
</div>

<div id="slope-graph"></div>

By looking at the line we confirm our expectation of the values, any point which belongs to the line whose $x$ coordinate is negative has it's $y$ coordinate (the value of the *slope*) negative as well, and any $x$ coordinate belonging to the line whose $x$ coordinate is positive has it's $y$ coordinate positive as well.

There are infinite tangent lines to the curve that represents $\eqref{yx2}$, in the following graph the equation of the line is computed dynamically based on the position of the mouse pointer (computed doing substitutions on $\eqref{line-equation}$)

<div id="slope-dynamic"></div>

### Second Derivative

Going back to the falling object formula ($s$ is the distance the object moved after $t$ seconds have elapsed)

<div>
$$
s = 16t^2
$$
</div>

The instantaneous rate of change of the distance with respect to time is

<div>
$$
\begin{equation}
\label{balldrop-first-derivative}
s' = 32t
\end{equation}
$$
</div>

$s'$ represents speed and is customarily to use $v$ (the first letter of velocity) instead of $s'$

<div>
$$
\begin{equation}
\label{balldrop-velocity}
v = 32t
\end{equation}
$$
</div>

Now $v$ is a function of $t$ and we can ask for the rate of change of the $v$ with respect to $t$, this is called *instantaneous acceleration*, *acceleration* is a change of speed that takes place during an interval of time, if there weren't acceleration in a moving object the moving object will be moving the rest of his life with a constant speed, if the speed is given as a function of time then we can calculate the *instantaneous* rate of change of the velocity with respect to time

<div>
$$
\begin{equation}
\label{balldrop-second-derivative}
v' = 32
\end{equation}
$$
</div>

The *instantaneous acceleration* obtained above is the derived function of the *isntantaneous speed* which is the derived function of the *distance function*, then we can relate the *instantaneous acceleration* and the *distance function* with the following notation

<div>
$$
s'' \quad or \quad \frac{d^2s}{dt^2}
$$
</div>

The function above is called the *second derived function* of $\eqref{balldrop}$, this notation applied to the generalized version using the variables $x$ and $y$ is

<div>
$$
\frac{d^2y}{dx^2} \quad or \quad y'' \quad or \quad f''(x)
$$
</div>

### The chain rule

Physical problems lead to more complicated algebraic functions, for example $y = \sqrt{x^2 + 1}$ which arises when one wants to work with the upper half of the parabola $y^2 = x^2 + 1$, we can express this function as a combination of two functions:

<div>
$$
y = \sqrt{u}\;, \quad u = x^2 + 1
$$
</div>

If $y$ is a function of $u$ and $u$ is a function of $x$ then:

<div>
$$
\frac{dy}{dx} = \frac{dy}{du} \cdot \frac{du}{dx}
$$
</div>

Expressed in the function notation

<div>
$$
y = f(u) \quad \text{and} \quad u = g(x)
$$
</div>

Then

<div>
$$
\begin{equation}\label{chain-rule}
\frac{dy}{dx} = f'(u) \cdot g'(x)
\end{equation}
$$
</div>

Returning to the original problem, let's find the derivative of $y = \sqrt{x^2 + 1}$ with respect to $x$ using the *chain rule*

Let $f(u) = u^{1/2}$ and $g(x) = x^2 + 1$

<div>
$$
\frac{dy}{dx} = f'(u) \cdot g'(x) = \frac{u^{-1/2}}{2} \cdot 2x = \frac{x}{\sqrt{x^2 + 1}}
$$
</div>

#### Differentiation of implicit functions

Going back to the definition of a function, it's a relation between two variables such that given a value of one in some domain there's a unique value determined for the second variable however functions often occur in forms where giving the independent variable some value will not result in a unique value, for example the equation of a circle of radius equal to 5 is:

<div>
$$
\begin{equation}\label{implicit}
x^2 + y^2 = 25
\end{equation}
$$
</div>

Here $y$is not expressed in terms of $x$, solving for $x$ we have two equations:

<div>
$$
\begin{equation}\label{explicit}
y = \sqrt{25 - x^2} \quad y = -\sqrt{25 - x^2}
\end{equation}
$$
</div>

$\eqref{implicit}$ represents the circle *implicitly* and $\eqref{explicit}$ represents the equation *explicitly*

We know that $y$ in $\eqref{implicit}$ represents some function of $x$, if we recognize that the left side of $\eqref{implicit}$ is only a set of terms in $x$ then we can differentiate it, the problem is to find the derivative of $y^2$ which should remind us of the chain rule ($y$ plays the role of $u$ in the chain rule)

<div>
$$
\frac{d(y^2)}{dx} = 2y \frac{dy}{dx}
$$
</div>

Applying a differentiation process to $\eqref{implicit}$

<div>
$$
2x + 2y \frac{dy}{dx} = 0
$$
</div>

Solving for $\frac{dy}{dx}$

<div>
$$
\frac{dy}{dx} = -\frac{x}{y}
$$
</div>

### Theorems on differentiation

Read "Calculus: An Intuitive and Physical Approach"

## Applications of the Derivative

* Determination of the velocity and acceleration of a particle given its distance as a function of time
* Concentrate light, sound and radio waves in a particular direction (see the [reflective property of the parabola](http://www.wikiwand.com/en/Parabola#/section_Proof_of_the_reflective_property))
* Finding the maximum/minimum value of a function, i.e. find the largest/smallest value of $f(x)$ when $a \leq x \leq b$, a well described solution to this problem can be found [here](https://www.whitman.edu/mathematics/calculus/calculus_06_Applications_of_the_Derivative.pdf)
* Approximation of the roots of a polynomial with Newton's method, described [here](https://www.whitman.edu/mathematics/calculus/calculus_06_Applications_of_the_Derivative.pdf)

### Maxima/minima

Let's say that we throw an object into the air and we want to know the maximum height it acquires, as it rises it's velocity decreases and when it reaches the highest point its velocity is zero, we also know that the velocity is the instantaneous rate of change of height with respect to time hence the derivative is involved in this process and therefore we expect it to be involved in other maxima/minima problems

More generally if $y$ is a function of $x$ it seems that to find the maximum value of $y$ we must find $y'$ and set it to 0

Let's graph a function and study its peaks

<div>
$$
y = \frac{x^3}{3} - 2x^2 + 3x + 2
$$
</div>

<div id="maxima-minima-f"></div>

We can see that the function has a maximum value of $3$ near $x = 1$ and a minimum value of $2$ near $x = 3$, if we analyze the slope of the function near those points we will see that on the left of $x = 1$ the slope is positive and on the right of $x = 1$ the slope is negative, since we know that the derivative represents the slope of a function we can also expect that the derivative of this function near $x = 1$ will go from a positive value to a negative value intersecting the x-axis, if we analyze the slope near $x = 3$ will will see the same behavior with the slope but it's going from a negative value to a positive one

Graphing the derivative function confirms our expectations

<div>
$$
y' = x^2 - 4x + 3
$$
</div>

<div id="maxima-minima-f-derivative"></div>

Now the problem reduces to finding the points where $y' = 0$ in the derivative function, finding them will tell us exactly the maximum/minimum value of $y$, finding the values of $x$ when $y' = 0$

<div>
$$
\begin{align*}
0 &= x^2 - 4x + 3 \\
0 &= (x - 1)(x - 3)
\end{align*}
$$
</div>

And we see that:

<div>
$$
y' = 0 \quad when \quad x = 1 \quad and \quad x = 3
$$
</div>

The process didn't actually find the maximum/minimum values since for $x > 3$ the function increases indefinitely, same goes when $x < 1$ but in this case the function decreases indefinitely, these values are called the *relative maxima/minima* because **near** $x = 3$ or $x = 1$ these points are the minimum/maximum that can be found

#### Applications of maxima/minima

- refraction of light, we can build a function of time which relates the velocity/distance the light travels in different mediums, finding the derivative and making it equal to $0$ will find the relative minimum time needed to go from one point in the medium $a$ to a point in a medium $b$
- finding the sides of the rectangle with the maximum perimeter

### Newton-Raphson method

The slope of the tangent line of a function $f(x)$ at any derivable point is given by $m = f'(x)$, let $x_1$ be a derivable point then the slope of the tangent line at $x_1$ is $m_1 = f'(x_1)$, the *Point–slope* form of the *tangent* line whose *slope* is $f'(x_1)$ is

<div>
$$
y - y_1 = m_1(x - x_1) \\
y - f(x_1) = f'(x_1) \cdot (x - x_1)
$$
</div>

Newton find out that if we find the intercept of this tangent line with the $x$-axis at some initial guess $x_1$, the value found approaches one of the roots of $f(x)$, i.e. when $f(x) = 0$ (obviously given that it has roots)

if $y = f(x) = 0$ then the equation of the line is

<div>
$$
0 - f(x_1) = f'(x_1) \cdot (x - x_1)
$$
</div>

Solving for $x$

<div>
$$
\begin{equation}\label{newton-raphson}
x = x_1 - \frac{f(x_1)}{f'(x_1)}
\end{equation}
$$
</div>

$x$ in the last equation is the abscissa of the next approximation of one of the roots of $x$, if we run the algorithm above a few times with an acceptable initial guess then we'll obtain a better approximation of one of the roots of $f(x)$

<div id="newton-raphson"></div>
<button id="run-newton-raphson" class="button is-primary">Newton-Raphson</button>

#### Finding the square root of a number

Let's say that we want to find the square root of a number $n$, this is equivalent to finding the solution to

<div>
$$
x^2 = n
$$
</div>

The function to use is then

<div>
$$
f(x) = x^2 - n
$$
</div>

whose derivative is

<div>
$$
f'(x) = 2x
$$
</div>

Substituting in $\eqref{newton-raphson}$

<div>
$$
\begin{align*}
x &= x_1 - \frac{x_1^2 - n}{2x_1} \\
&= x_1 - \frac{x_1}{2} + \frac{n}{2x_1} \\
&= \frac{x_1}{2} + \frac{n}{2x_1} \\
&= \frac{1}{2} \cdot \big ( x_1 + \frac{n}{x_1} \big )
\end{align*}
$$
</div>

```cpp
double square_root(double n) {
  // initial guess
  double EPS = 1e-15;
  double x0 = 1;
  while (true) {
    double xi = (x0 + n / x0) / 2.0;
    if (abs(x0 - xi) < EPS) {
      break;
    }
    x0 = xi;
  }
  return x0;
}
```

<script src="/js/calculus/derivative.js"></script>

[tangent-line]: https://www.wikiwand.com/en/Tangent
