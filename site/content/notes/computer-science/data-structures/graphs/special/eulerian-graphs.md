---
title: "Eulerian Graph and Eulerian Trails"
date: 2015-07-05 15:22:15
summary: |
  This article discusses Eulerian circuits and trails in graphs. An Eulerian circuit is a closed trail that contains every edge of a graph, and an Eulerian trail is an open trail that contains all the edges of a graph but doesn't end in the same start vertex.

  <br />

  This article also explains the Königsberg Bridge Problem and why it's impossible to find a trail in it. Finally, there are two implementations in C++ to find Eulerian trails in directed and undirected graphs.
image: /images/eulerian-graph.png
tags: ["graph theory", "eulerian graph", "eulerian trail"]
libraries: ["greuler", "math"]
---

A circuit $C$ in a graph $G$ is called an **Eulerian circuit** if $C$ contains every edge of $G$ (remember that a circuit is a closed trail, i.e., a walk in which no edge is traversed more than once and that begins and ends at the same vertex).

- Every edge of $G$ appears only once in the circuit.
- Only graphs with one component can contain such a circuit.

A connected graph $G$ that contains an Eulerian circuit $C$ is called an **Eulerian Graph**.

<div id="figure-eulerian-graph"></div>

<div>$$
C = (v_0,v_1,v_2,v_3,v_1,v_6,v_3,v_4,v_5,v_6,v_7,v_5,v_8,v_7,v_{10},v_8,v_9,v_{10},v_0)
$$</div>

An **Eulerian trail** is an open trail $T$ that contains all the edges of $G$ (but doesn't end in the same start vertex).

<div id="figure-eulerian-trail"></div>

<div>$$
T = (v_0,v_1,v_2,v_4,v_3,v_1,v_4,v_5)
$$</div>

## Königsberg Bridge Problem

The city of Königsberg, located in Prussia, was separated by a river into four land areas. To travel between these areas, seven bridges were built. Some citizens wondered whether it was possible to go for a walk in Königsberg and pass over each bridge exactly once.

<div id="figure-konigsberg-bridges"></div>

<div class="tw-text-center">
The land areas and the bridges built in the city of Königsberg modeled as a graph <span class="math">\(M\)</span>
</div>

<br />

In graph theory terms, the problem can be stated as follows:

> Does the multigraph $M$ of order $n = 4$ and size $m = 7$ contain an Eulerian circuit or an Eulerian trail?

Suppose that such a journey is possible. Then it must begin at some land area and end at some land area (possibly the same one). Certainly, each land area must appear in the trail. Note that at least two vertices of $M$ are neither the initial nor the terminal vertex of the trail. Let's say that we start at land $A$ and end at land $A$.

<div>$$
T = (A, L_1, L_2, L_3, L_4, L_5, L_6, A)
$$</div>

Each of the land areas, except for the first and the last, is entered and exited every time it appears in the trail. This implies that all such land areas must have an even degree for a trail to exist.

Going back to the Königsberg bridge problem, we can see that it's impossible to find a trail because all the vertices have an odd degree.

- The length of the Eulerian circuit/trail of a graph $G$ is equal to $m + 1$, where $m$ is the size of $G$.

For undirected graphs:

- A graph $G$ is an **Eulerian graph** if and only if every vertex of $G$ has an even degree.
- A graph $G$ contains an **Eulerian trail** if and only if exactly **two vertices** of $G$ have an odd degree. Also, each trail of $G$ begins at one of these vertices and ends at the other.

For directed graphs:

- A graph $G$ is an **Eulerian graph** if and only if every vertex of $G$ has the same incoming and outgoing degree and is strongly connected.
- A graph $G$ contains an **Eulerian trail** if and only if for each vertex, the difference between its incoming and outgoing degrees is 0, except for two vertices, one with a difference of $-1$ (start) and one with a difference of $+1$ (end). If these two vertices are connected by an edge, then the graph is strongly connected.

## Hierholzer's algorithm

Let $C$ be a cycle in an Eulerian graph. Removing $E(C)$ from $G$ will create a subgraph that has an Eulerian trail.

1. Identify a circuit $C$ in $G$ and mark the edges of $C$.
2. If $C$ contains all the edges of $G$, then stop.
3. Otherwise, let $v_i$ be a node on $C$ that is incident with an unmarked edge $e_i$.
4. Build a circuit $D$ starting at node $v_i$ and using edge $e_1$, and mark the edges of $D$.
5. Join the circuit $D$ to $C$ by inserting the edges of $D$ into $C$ at position $v_1$, and then move to step 2.

### Implementation notes

In the implementation, a source vertex $u$ is chosen to be arbitrary or to be one of the two odd-degree vertices. Then an edge $uv$ is marked as visited, and we move to vertex $v$. Next, an edge $vw$ is marked as visited. Eventually, we will get to a vertex $z$ that doesn't have any unvisited edges. This means that there's a circuit starting and ending at vertex $z$. Next, there might be a vertex $y$ in the circuit $z-z$ that has unvisited edges. If one is found, we know that there's another circuit $y-y$. Both circuits $z-z$ and $y-y$ might have nested circuits themselves. When the $y-y$ circuit doesn't have a vertex with unvisited edges, then the result is appended to the main circuit $z-z$, i.e., $u-v-\ldots-z-y-y-z$.

<!--

<style>
#stack, #trail {
  height: 40px;
}
#figure-find-eulerian-trail span {
  width: 50px;
  border: 1px solid #999;
  padding: 5px 10px;
}
</style>

<div id="figure-find-eulerian-trail">
  <div class="overlay" style="position: absolute"></div>
  <div id="stack">
    stack:
  </div>
  <div id="trail">
    trail:
  </div>
</div>
-->

{{< snippet file="static/code/graphs/eulerian/eulerian_graph.cpp" lang="cpp" />}}

<script src="/js/graph/eulerian-graphs.js"></script>
