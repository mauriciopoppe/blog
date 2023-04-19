---
title: "Minimum Spanning Tree"
date: 2015-06-24 18:31:59
description: |
  This article covers minimum spanning tree (MST), MSTs have important applications, MST can be used to minimize the cost of
  building a communication network, or it can be used to identify important features or patterns in
  a dataset.

  <br />

  I implement the Prim and Kruskal algorithms to find the minimum spanning tree in a graph
  with different implementations for sparse and dense graphs,
  also with the theory covered I also implement an algorithm to find the number of
  nimal spanning trees in a graph.
image: /images/minimum-spanning-tree.png
tags: ["minimum spanning tree", "prim", "kruskal", "graph theory", "disjoint set", "union find"]
libraries: ["greuler", "math"]
---

If a connected graph $G$ of order $n$ has no cycles then of course $G$ is a tree, let's suppose that $G$ contains cycles, let $e_1$ be an edge lying on a cycle of $G$ we know that since $e_1$ is part of cycle it's not a bridge which means that $G - e_1$ is connected, if $G - e_1$ contains cycles then let $e_2$ be an edge lying on a cycle of $G - e_1$, $e_2$ is not a bridge and therefore $G - e_1 - e_2$ is still connected. Eventually we arrive to the set $X = {e_1, e_2, \ldots, e_k}$ of edges such that $G - X$ doesn't contain cycles (i.e. it's a tree) which has the same vertex set of $G$ ($V(G) = V(G - X)$).

Let $T = G - X$ be a tree with the same vertex set of $G$

- $T$ is a spanning subgraph of $G$, since $T$ is also a tree it's called a **spanning tree** of $G$

<div id="figure-spanning-tree"></div>

## Minimum spanning tree

The purpose of finding the minimum spanning tree (MST) is to identify the subset of edges of a given connected, undirected graph that form a tree, connecting all the vertices and having the minimum possible total edge weight.

Let $G$ be a *connected weighted graph* where the weight of an edge $e \in E(G)$ is denoted by $w(e)$, for each subgraph $H$ of $G$ the weight of the subgraph $W$ is the sum of the weights of its edges

<div>$$
w(H) = \sum_{e \in E(H)} w(e)
$$</div>

We are looking for a spanning tree of $G$ whose weight is minimum among all spanning trees of $G$, such a spanning tree is called **minimum spanning tree** (shortened as MST)

<div id="figure-minimum-spanning-tree"></div>

<div>$$
\begin{align*}
G &= (V, E) \\
V &= \{0, 1, 2, 3, 4\} \\
E &= \{\{0, 1\}, \{0, 2\}, \{0, 3\}, \{0, 4\}, \{1, 2\}, \{1, 3\}, \{1, 4\}, \{2, 3\}, \{3, 4\}\} \\
w(e) &= \{1, 4, 4, 5, 3, 7, 5, 6, 2\}
\end{align*}
$$</div>

- the MST is unique if the weights of all the edges are different
- the maximum spanning tree is the tree whose weight is maximum among all spanning trees, it can be computed using the algorithm below by using the edges with the maximum weight instead of the ones with the minimum weight

### Kruskal's algorithm

For a connected weighted graph $G$ a spanning tree is constructed as follows

- for the first edge $e_1$ we select any edge of $G$ of minimum weight
- for the second edge $e_2$ we select any remaining edge of $G$ of minimum weight
- for the third edge $e_3$ we select any remaining edge of $G$ of minimum weight *that does not produce a cycle with the previously selected edges*
- we continue in this manner until a spanning tree is produced

Let's apply it to the weighted graph above, sorting the edges in nondecreasing order we have:

<div>$$
w(e) = {1, 2, 3, 4, 4, 5, 5, 6, 7}
$$</div>

Some properties of the edges

- The edge with the minimum cost is $e_1 = v_0v_1$ with $w(e_1) = 1$, $e_1$ is part of the MST
- The edge with the minimum cost is now $e_9 = v_3v_4$ with $w(e_9) = 2$, $e_2$ is part of the MST
- The next edge is $e_5 = v_1v_2$ with $w(e_5) = 3$, since it does not form a cycle with the previously selected edges it's part of the MST
- The next edge is $e_2 = v_0v_2$ with $w(e_2) = 4$, this one forms a cycle with the following path $v_0,v_1,v_2$ so it's not part of the MST
- The next edge is $e_3 = v_0v_3$ with $w(e_3) = 4$, since it does not form a cucle with the previously selected edges it's part of the MST
- No need to do more iterations since the set is already a spanning tree

{{< snippet file="static/code/graphs/minimum_spanning_tree/kruskal.cpp" lang="cpp" />}}

### Prim's algorithm

For a connected weighted graph $G$ a spanning tree is constructed as follows

- for an arbitrary vertex $u$ and edge of minimum weight $e_1$ incident to $u$ is chosen as the first edge of the MST
- for subsequent edges $e_2, e_3, \ldots, e_{n - 1}$ we select an edge of minimum weight among those edges having **exactly one of its vertices incident with an edge already selected**

#### Prim in dense graphs

Let's say we're given the following problem

> given $n$ points in a plane find the skeleton of minimum weight that connects them all

This problem can be modeled as a graph of order $n$ where each vertex is connected to every other vertex by an edge of weight equal to the euclidean distance between the vertices therefore $m \approx n^2$

Implementation strategies:

- we need a data structure that keeps track of a single edge per vertex (space: $O(n)$ and is able to tell the one with the minimum weight (doing $O(n)$ queries), since $m \approx n^2$ we visit each vertex finding an edge with minimum cost (each query will take $O(n)$ for an overall $O(n^2)$ time complexity)
- after an arbitrary vertex $u$ has been chosen all the vertices incident to $u$ will update their minimum edge weight

{{< snippet file="static/code/graphs/minimum_spanning_tree/prim_dense_graph.cpp" lang="cpp" />}}

#### Prim in sparse graphs

Implementation strategies:

- we need a data structure that keeps track of a single edge per vertex (space: $O(n)$ and is able to tell the one with the minimum weight (doing $O(n)$ queries), since $m \approx n$ we analyze each edge finding the one with minimum weight $O(n)$ times, we can use a red-black tree (each operation takes $O(log\;n)$ for an overall $O(m\;log \;n)$ time complexity)
- after an arbitrary vertex $u$ has been chosen all the vertices incident to $u$ will update their minimum edge weight
- the red-black tree will hold $n - 1$ entries at max (one entry per vertex), each iteration a vertex will be removed from the red-black tree
- there will be exactly $n$ iterations if the graph is connected

{{< snippet file="static/code/graphs/minimum_spanning_tree/prim_sparse_graph.cpp" lang="cpp" />}}

## Number of spanning trees in a graph

Let $G$ be a graph with $V(G) = {v_1, v_2, \ldots, v_n}$, let $A = [a_{ij}]$ be the adjacency matrix of $G$ and let $C = [c_{ij}]$ be a $n \times n$ matrix where

<div>$$
c_{ij} = \begin{cases}
deg\;v_i & \text{if $i = j$} \\
-a_{ij} & \text{if $i \neq j$} \\
\end{cases}
$$</div>

Then the number of spanning trees of $G$ is the value of any cofactor of $C$

The matrix of cofactors a $n \times n$ matrix $C = [c_{ij}]$ where

<div>$$
c_{ij} = (-1)^{i + j} \cdot det(M_{ij})
$$</div>

$det(M_{ij})$ indicates the determinant of the $(n - 1) \times (n - 1)$ submatrix of $M$ obtained by removing the $i$-th row and the $j$-th column

{{< snippet file="static/code/graphs/minimum_spanning_tree/number_of_spanning_trees.cpp" lang="cpp" />}}

### Number of spanning trees in a complete graph $K_n$

Computing the number of spanning trees of a graph $G = K_n$ where $V(G) = {v_1, v_2, \ldots, v_n}$ is the same as computing the number of distinct trees with vertex set ${v_1, v_2, \ldots, v_n}$, the formula is called the **Caley Tree Formula**

> The number of spanning trees of order $n$ with a specific vertex set is $n^{n - 2}$

TODO:

- find the relationship between prim's mst and dijsktra's
- second minimum spanning tree, hint: MST + LCA http://codeforces.com/blog/entry/9570

<script src="/js/graph/trees/spanning-tree.js"></script>
