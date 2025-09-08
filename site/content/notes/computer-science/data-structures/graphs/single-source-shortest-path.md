---
title: "Single Source Shortest Path (SSSP) in a graph"
summary: |
  Given a weighted graph $G$ with $V$ vertices and $E$ edges, where all the weights are non-negative, and a source vertex $s$, the single-source shortest path problem consists of finding the distance from $s$ to all other vertices.

  <br />
  In this article, I describe the problem in a weighted and unweighted graph, as well as
  implementations using BFS for unweighted graphs and Dijkstra's algorithm for weighted graphs
  using an array and a priority queue.
image: https://upload.wikimedia.org/wikipedia/commons/5/57/Dijkstra_Animation.gif
tags: ["graph theory", "single source shortest path", "weighted graph", "unweighted graph", "dijkstra", "bfs", "set", "priority queue"]
libraries: ["math"]
date: 2015-07-03 13:21:32
---

## Unweighted graph

We call a shortest path from vertex $u$ to vertex $v$ a path of length $k$, where the path consists of vertices $p = (x_1, x_2, \ldots, x_k)$ such that $x_1 = u$, $x_k = v$, and $k$ is minimum.

In an unweighted graph, a breadth-first search guarantees that when we analyze a vertex $v$, it will actually hold the shortest path to it. More searching will never find a path to $v$ with fewer edges.

- Let $d(v)$ be the shortest distance from a vertex $v$ to $s$. Initially, $d(v) = \infty$ for $v \not= s$ and $d(s) = 0$.
- Whenever a vertex $v$ where $d(v) = \infty$ is reached by some other vertex $u$ whose $d(u)$ was already computed, then $d(v) = d(u) + 1$.

{{< snippet file="static/code/graphs/sssp/bfs.cpp" lang="cpp" />}}

## Weighted graph

### Dijkstra's algorithm

Dijkstra described an algorithm to solve the SSSP. There are some additional states that need to be stored per vertex:

- Let $d(v)$ be an estimate of the shortest distance from a vertex $v$ to $s$. Initially, $d(v) = \infty$ for $v \not= s$ and $d(s) = 0$.
- Let $visited(v)$ be the visited state of a given vertex. Initially, $visited(v) = false$.

The algorithm consists of a series of iterations. In each iteration, let $u$ be the vertex with the minimum distance to $s$ that hasn't been visited yet. A process called **relaxation** is then performed with $u$.

- The visited state is set to true, i.e., $visited(u) = true$.
- Let $uv$ be an edge to an unvisited node $v$ with weight $w(uv)$. We might improve the best estimate of the shortest path between $s$ and $v$ by including $uv$ in the path, so:

<div>$$
 d(v) = min(d(v), d(u) + w(uv))
$$</div>

After $n$ iterations, all the vertices will be marked, and the $d(v)$ state will hold the shortest path from $s$ to all other vertices.

We need a data structure that quickly supports the following three operations:

- Remove a vertex with the minimum distance that hasn't been discovered yet (up to once for each vertex in the graph).
- Add a new vertex (up to once for each vertex in the graph).
- Update the estimated distance of an existing vertex (once for each edge in the graph).

#### Implementation with an array

An array supports the operations above in $O(V)$, $O(1)$, and $O(1)$, respectively, leading to an overall time complexity of $O(V^2 + E)$, which is optimal for dense graphs (when $E \approx V^2$).

{{< snippet file="static/code/graphs/sssp/dijkstra_array.cpp" lang="cpp" />}}

#### Implementation with a BST

A balanced search tree supports the operations above in $O(\log V)$, $O(\log V)$, and $O(\log V)$, respectively, leading to an overall $O((E + V) \log V)$ time complexity, which is optimal for sparse graphs (when $E \approx V$).

{{< snippet file="static/code/graphs/sssp/dijkstra_set.cpp" lang="cpp" />}}

#### Applications

- Find the shortest path between two vertices $u$ and $v$.
- Find the shortest path from all vertices to a given vertex $v$ by reversing the direction of each edge in the graph.
- Find the shortest path for every pair of vertices $u$ and $v$ by running the algorithm once per vertex.
