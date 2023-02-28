---
title: "Introduction to surface shading"
date: 2016-06-03 13:46:07
description: |
  Surface shading is a process to color a surface, in computer graphic applications this is done to mimic how
  objects look in real life. This article covers the variables available in the rendering pipeline.
references:
  - https://thebookofshaders.com
tags: ["shading", "surface", "computer graphics"]
---

Shading is the process of altering the color of a surface, different *shading models* capture the process of light reflection on a surface, these models use the following variables in the computation

- $\mathbf{ray}$ (ray) - a ray emitted from a pixel, defined with an origin ($\mathbf{ray_{origin}}$) and a direction $\mathbf{ray_{direction}}$
- $\mathbf{p}$ (intersection point) - the intersection point of the surface and $\mathbf{ray}$
- $\mathbf{l}$ (light direction) - a unit vector pointing from the surface towards a light source, computed by normalizing the vector between the intersection point $\mathbf{p}$ and the light source position $\mathbf{l_s}$

<div>$$
\mathbf{l} = \frac{\mathbf{l_s - p}}{\norm{\mathbf{l_s - p}}}
$$</div>

<span></span>

- $\mathbf{v}$ (view direction) - a unit vector pointing from the surface towards the place the ray is emitted from, it's computed by normalizing the vector between the intersection point $\mathbf{p}$ and the ray origin $\mathbf{ray_{origin}}$

<div>$$
\mathbf{v} = \frac{\mathbf{ray_{origin} - p}}{\norm{\mathbf{ray_{origin} - p}}}
$$</div>

<span></span>

- $\mathbf{n}$ (surface normal) - a unit vector perpendicular to the surface at the point where the reflection is taking place
- other characteristics of the light source and the surface depending on the shading model

