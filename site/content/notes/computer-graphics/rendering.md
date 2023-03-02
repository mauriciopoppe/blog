---
title: "Rendering"
description: |
  Rendering is a process that takes an input a set of objects and produces as its output an array of pixels (image) each of which stores information about the color of the image at a particular point in a grid (determined by the target width and height).
image: /images/rendering.jpeg
date: 2016-02-26 16:59:48
tags: ["computer graphics", "rendering"]
references:
  - "Shirley, P. and Ashikhmin, M. (2005). Fundamentals of computer graphics. Wellesley, Mass.: AK Peters."
  - https://github.com/ssloy/tinyrenderer/wiki/Lesson-1-Bresenham%E2%80%99s-Line-Drawing-Algorithm
---

An image can be abstracted as a function

<div>$$
I(x,y): R \rightarrow V
$$</div>

Where $R \in \mathbb{R}^2$ is a rectangular area and $V$ is a set with the possible pixel values, the following are examples of the set $V$

- $V = \mathbb{R}^+$ (non-negative reals) for grayscale images, each pixels represents only brightness and no color
- $V = (\mathbb{R}^+)^3$ (combinations of 3 sets of non-negative reals), which is a color image with red/green/blue values for each pixel

## Pixels

A pixel from a camera or scanner is a measurement of the average color of the image in the surrounding area near the pixel

If an image has $n_x$ columns and $n_y$ rows a common convention is to count rows and columns from the bottom left, the bottom left pixel is $(0,0)$ and the top-right is pixel $(n_x - 1, n_y - 1)$

Note that because of the definition gave to a pixel the coordinate $(0,0)$ is mapped to the center of the pixel $(0,0)$, therefore half-pixel will exist in both the $-\mathbf{x}$-axis and the $-\mathbf{y}$-axis

{{< figure src="/images/rendering!pixel-coordinates.jpg" title="pixel coordinates" class="is-responsive" >}}

So the domain of a $n_x \times n_y$ image is

<div>$$
R = [0.5, n_x - 0.5] \times [0.5, n_y - 0.5]
$$</div>

### Pixel values

The value of a pixel depends on the precision and range of value needed, for example *high dynamic range* (HDR) images store floating-point numbers allowing a wide range of values, *low dynamic range* (LDR) images are instead stored with integers, the following pixel-values are used in a variety of applications

- 1-bit grayscale per pixel - images where intermediate grays are not needed e.g. text
- 8-bit grayscale per pixel - images with intermediate grays, it can store a total of 256 gray values e.g. a grayscale photo
- 8-bit red, green and blue (RGB), 24-bits per pixel - full color images that allow near 16 million possible values, e.g. consumer photographs, web and email applications
- 12- to 14-bit RGB, 36-42 bits per pixel - raw camera images for professional photography
- 16-bit half precision RGB, 48 bits per pixel - HDR images used in real time rendering
- 32-bit floating-point RGB, 96 bits per pixel - HDR images for software rendering
