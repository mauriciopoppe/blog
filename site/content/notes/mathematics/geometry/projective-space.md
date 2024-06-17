---
title: "Projective space"
date: 2016-03-04 10:00:00
summary: |
  In projective geometry unlike euclidean geometry, two parallel lines meet at a point. Desargues
  introduced the concept of a line at finity where a point at infinity can be defined. This article
  covers the need of a point at infinity in projective space, the line at infinity and the projective plane.
image: /images/projective-geometry!perspective.jpg
tags: ["math", "geometry", "projective geometry", "projective space"]
libraries: ["math"]
references:
  - "Birchfield, S. (1998). An Introduction to Projective Geometry [online] Robotics.stanford.edu. Available at: http://robotics.stanford.edu/~birch/projective/projective.pdf [Accessed 15 Mar. 2016]."
  - "MathHistory8: Projective geometry. (2011). [online] YouTube. Available at: https://www.youtube.com/watch?v=NYK0GBQVngs [Accessed 02 Mar. 2016]."
---

In Euclidean geometry two lines are said to be parallel if they lie in the same plane and never meet, moreover properties like this one don't change when an Euclidean transformation is applied (translation/rotation), however what we perceive in real life is different from what's described with Euclidean geometry.

This problem coincided with the one the renaissance artists had while trying to paint on a canvas, when they tried to paint tiles on a canvas they realized that the following rules applied:

> - parallel lines meet on the horizon
> - straight lines must be represented on the page by straight lines
> - the image of a conic is also a conic (for example a circle is drawn as an ellipse depending on the perspective)

{{< figure src="/images/projective-geometry!perspective.jpg" title="projection" >}}

The French mathematician [Girard Desargues](https://www.wikiwand.com/en/Girard_Desargues) researching more on this new type of geometry had the necessity to have a *point at infinity*, he introduced the concept of a *line at infinity* which helped defined the point infinity as follows

> for every family of parallel lines on some ordinary plane there's one point at infinity where they all meet which lies on the line at infinity

{{< figure src="/images/projective-geometry!projective-plane.png" title="projective plane" >}}

An ordinary plane + the line at infinity is called a **projective plane**

Projective geometry exists in any number of dimensions (just like Euclidean geometry), When we take a picture using a camera the imaging process makes a projection from $P^3$ to $P^2$, such a process is called *projective transformation*

Properties of projective transformations

- Preservation of type (points remain points and lines remain lines)
- Incidence (a point remains on a line after transformation)

In 1D there's the **projective line** which is an ordinary line + one point at infinity which can be reached by moving towards each end of the line

## Projective line

> spaces of 1-dimensional subspaces that exist in 2-dimensions i.e. *any line that passes through the origin in a 2-dimensional space*

Let $w$ be the vertical axis in this 2-dimensional space, the picture of a line at infinity is shown by looking at the line $w = 1$ and its relation with $w = 0$, almost all the lines that pass through the origin intercept $w = 1$ **except** the line $w = 0$, therefore we can see that the set of points that exists in the line $w = 1$ is the same as the set that contains all the interception points between all the possible 1-dimensional subspaces and $w = 1$, however the line $w = 0$ (which is also part of the 1-dimensional subspaces) doesn't meet $w = 1$, so the $w = 0$ *plays the role of infinity* with respect to $w = 1$

Any 1D point is represented in projective geometry as the pair $(x, w)$, we can see that such a pair can be projected to $w = 1$ by dividing both coordinates by $w$ so any 1D point projected to this plane is represented by the pair $(\tfrac{x}{w}, 1)$ unless $w = 0$ which is in the *line at infinity*, any point at infinity has then the form $(x, 0)$

{{< figure src="/images/projective-geometry!projective-line.png" title="projective line" >}}

## Projective plane

> spaces of 1-dimensional subspaces that exist in 3-dimensions i.e. *any line that passes through the origin in a 3-dimensional space*

A similar situation is seen on a 3-dimensional space, in this space any line that passes through the origin intercepts the *plane* $w = 1$ except the set of lines that lie in the plane $w = 0$, so $w = 0$ plays the role of infinity with respect to $w = 1$

Any 2D point is represented in this space as the triplet $(x, y, w)$, just like 1D we can project any point to the plane $w = 1$ by dividing the triplet by $w$ which has the form $(\tfrac{x}{w}, \tfrac{y}{w}, 1)$ unless $w = 0$ which means that any point at infinity has the form $(x, y, 0)$

{{< figure src="/images/projective-geometry!projective-plane-3d.png" title="projective plane" >}}

