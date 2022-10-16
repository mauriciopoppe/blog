---
title: "Single Source Shortest Path (SSSP)"
date: 2015-07-03 13:21:32
---

Given a weighted graph $G$ with $V$ vertices and $E$ edges where all the weights are non-negative and given a source vertex $s$, the single source shortest path problem consists in finding the distance from $s$ to all the other vertices.

## Unweighted graph

We call a shortest path from vertex $u$ to vertex $v$ a path of length $k$ where the path consists of vertices $p = (x_1, x_2, \ldots, x_k)$ such that $x_1 = u, x_k = v$ and $k$ is minimum

In an unweighted graph, breadth first search guarantees that when we analyze a vertex $v$ it will actually hold the shortest path to it, more searching will never find a path $uv$ to $v$ with fewer edges

- let $d(v)$ be the shortest distance from a vertex $v$ to $s$, initially $d(v) = \infty, v \not= s$ and $d(s) = 0$
- whenever a vertex $v$ where $d(v) = \infty$ is reached by some other vertex $u$ whose $d(u)$ was already computed then $d(v) = d(u) + 1$

{{< snippet file="static/code/graphs/sssp/bfs.cpp" lang="cpp" />}}

## Weighted graph

### Dijkstra's algorithm

Dijkstra described an algorithm to solve the SSSP, there are some additional states that need to be stored per vertex:

- let $d(v)$ be an estimate of the shortest distance from a vertex $v$ to $s$, initially $d(v) = \infty, v \not= s$ and $d(s) = 0$
- let $visited(v)$ be the visited state of a given vertex, initially $visited(v) = false$

The algorithm consists in a series of iterations, on each iteration let $u$ be the vertex with the minimum distance to $s$ that wasn't visited yet, a process called **relaxation** is the performed with $u$

- the visited state is set to true, i.e. $visited(v) = true$
- let $uv$ be an edge to an unvisited node $v$ with weight $w(uv)$, we might improve the best estimate of the shortest path between $u$ and $v$ by including $uv$ in the path so

<div>$$
d(v) = min(d(v), d(u) + w(uv))
$$</div>

After $n$ iterations all the vertices will be marked and $d(v)$ state will hold the shortest path from $s$ to all the other vertices

We need a data structure that supports the following 3 operations quickly:

- remove a vertex with the minimum distance that wasn't discovered yet (up to once for each vertex in the graph)
- add a new vertex (up to once for each vertex in the graph)
- update the estimated distance of an existing vertex (once for each edge in the graph)

#### Implementation with an array

An array supports the operations above in $O(V)$, $O(1)$, and $O(1)$ respectively leading to an overall $O(V^2 + E)$ which is optimal for dense graphs (when $E \approx V^2$)

{{< snippet file="static/code/graphs/sssp/dijkstra_array.cpp" lang="cpp" />}}

#### Implementation with a BST

A balanced searth tree supports the operations above in $O(\log V)$, $O(\log V)$, and $O(\log V)$ respectively leading to an overal $O((E + V) \log V)$ time complexity optimal for sparse graphs (when $E \approx V$)

{{< snippet file="static/code/graphs/sssp/dijkstra_set.cpp" lang="cpp" />}}

#### Applications

- Find the shortest path between two vertices $u$ and $v$
- Find the shortest path from all the vertices to a given vertex $v$ by reversing the direction of each edge in the graph
- Find the shortest path for every pair of vertices $u$ and $v$ by running the algorithm once per vertex
