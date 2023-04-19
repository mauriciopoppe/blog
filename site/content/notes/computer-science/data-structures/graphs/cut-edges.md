---
title: "Cut-edges (bridges) in Graph Theory"
date: 2015-06-24 14:51:12
description: |
  An edge $e = uv$ of a connected graph $G$ is called a bridge if $G - e$ is disconnected (it increases the number of components).

  <br />
  In this article I implement an algorthm to find the bridges of an undirected graph using DFS.
  Next I describe an algorithm to find strong bridges in directed graphs.
tags: ["graph theory", "cut edges", "bridges", "depth first search"]
image: /images/cut-edges-bridges.png
libraries: ["greuler", "math"]
---

## Undirected graph

In the following undirected graph $G$ the edges $v_2v_3$ and $v_3v_4$ are bridges

<div id="figure-bridges"></div>

- An edge $e$ of an undirected graph $G$ is a bridge if and only if $e$ lies on **no cycle** of $G$
- Every edge of an undirected tree is a bridge

Let $G$ be an undirected graph, by analyzing the properties of the dfs tree we can determine if an edge is a bridge given the following facts:

- let $u$ and $v$ be two vertices of the dfs such that $u$ is an antecesor of $v$, also $u$ and $v$ are not adjacent
  - if there's a *back edge* $vu$ then none of the edges in the $u-v$ path are bridges, if we remove one of them the graph is still connected because of this edge
  - otherwise the edge is a bridge

### Implementation notes

- to check if a succesor of a vertex $u$ has a back edge to a predecessor of $u$ an additional state is stored in each vertex which is the discovery time of the lowest back edge of a successor of $u$ (by lowest back edge we mean the back edge to a vertex with the lowest discovery time) denoted as $u_{back}$, initially this state is set to the discovery time of the vertex $v$ i.e. $u_{back} = u_{in}$, this state is propagated when the backtracking is performed
- let $uv$ be a back edge, when this edge is analyzed the $v_{back}$ state needs to be updated to be the minimum between the existing $v_{back}$ and the discovery time of $u$, i.e. $v_{back} = min(v_{back}, u_{in})$
- let $v$ be an adjacent successor of $u$ in the dfs tree, when we've finished analyzing the branch of the tree because of the $uv$ edge we have to check if the $v_{back}$ state contains a back edge to some predecessor of $u$ ($v_{back}$ is propagated) i.e. $u_{in} > v_{back}$, if so then $uv$ is not a bridge

{{< snippet file="static/code/graphs/cut_edges.cpp" lang="cpp" />}}

## Directed graph (strong bridges)

Let $G$ be a directed graph, an edge $uv \in E(G)$ is a **strong bridge** if its removal increases the number of stronly connected components of $G$

The following is a connected graph $G$, every edge but $v_2v_0$ is a strong bridge because removing it from $G$ increases the number of strongly connected components, removing $v_2v_0$ doesn't increase the number of strongly connected components so it's not a bridge

<div id="figure-bridges-directed"></div>

A trivial algorithm to find the strong bridges of a digraph $G$ of order $n$ and size $m$ is as follows:

- Compute the number of strongly connected componentes of $G$ denoted as $k(G)$
- For each edge $e \in E(G)$
 - remove $e$ from $G$
 - compute the number of strongly connected components of $G$ denoted as $k(G - e)$
 - if $k(G) < k(G - e)$ then $e$ is a bridge

The time complexity of the algorithm above is clearly $O(m(n + m))$

Let $uv$ be an edge of a digraph $G$, we say that $uv$ is **redundant** if there's an alternative path from vertex $u$ to vertex $v$ avoiding $uv$, otherwise we say that $uv$ is not redundant, computing the strong bridges is equivalent to compute the non-redundant edges of a graph

http://www.sofsem.cz/sofsem12/files/presentations/Thursday/GiuseppeItaliano.pdf

{{< script >}}
document.addEventListener('DOMContentLoaded', function () {
  function getJson(file, callback) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err))
  }

  getJson('/js/graph/data/bridges.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-bridges',
      data: data
    }).update()
  });
  getJson('/js/graph/data/bridges-directed.json', function (err, data) {
    if (err) { throw err }
    greuler({
      directed: true,
      target: '#figure-bridges-directed',
      data: data
    }).update()
  });
}, false)
{{< /script >}}
