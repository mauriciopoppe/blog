---
title: "Cut-edges (bridges) in Graph Theory"
date: 2015-06-24 14:51:12
summary: |
  An edge $e = uv$ of a connected graph $G$ is called a bridge if $G - e$ is disconnected (it increases the number of components).

  <br />
  In this article, I implement an algorithm to find the bridges of an undirected graph using DFS.
  Next, I describe an algorithm to find strong bridges in directed graphs.
tags: ["graph theory", "cut edges", "bridges", "depth first search"]
image: /images/cut-edges-bridges.png
libraries: ["greuler", "math"]
---

## Undirected graph

In the following undirected graph $G$, the edges $v_2v_3$ and $v_3v_4$ are bridges.

<div id="figure-bridges"></div>

- An edge $e$ of an undirected graph $G$ is a bridge if and only if $e$ lies on **no cycle** of $G$.
- Every edge of an undirected tree is a bridge.

Let $G$ be an undirected graph. By analyzing the properties of the DFS tree, we can determine if an edge is a bridge given the following facts:

- Let $u$ and $v$ be two vertices of the DFS tree such that $u$ is an ancestor of $v$. Also, $u$ and $v$ are not adjacent.
  - If there's a *back edge* $vu$, then none of the edges in the $u-v$ path are bridges. If we remove one of them, the graph is still connected because of this edge.
  - Otherwise, the edge is a bridge.

### Implementation notes

- To check if a successor of a vertex $u$ has a back edge to a predecessor of $u$, an additional state is stored in each vertex, which is the discovery time of the lowest back edge of a successor of $u$ (by lowest back edge, we mean the back edge to a vertex with the lowest discovery time), denoted as $u_{back}$. Initially, this state is set to the discovery time of the vertex $v$, i.e., $u_{back} = u_{in}$. This state is propagated when backtracking is performed.
- Let $uv$ be a back edge. When this edge is analyzed, the $v_{back}$ state needs to be updated to be the minimum of the existing $v_{back}$ and the discovery time of $u$, i.e., $v_{back} = min(v_{back}, u_{in})$.
- Let $v$ be an adjacent successor of $u$ in the DFS tree. When we've finished analyzing the branch of the tree because of the $uv$ edge, we have to check if the $v_{back}$ state contains a back edge to some predecessor of $u$ ($v_{back}$ is propagated), i.e., $u_{in} > v_{back}$. If so, then $uv$ is not a bridge.

{{< snippet file="static/code/graphs/cut_edges.cpp" lang="cpp" />}}

## Directed graph (strong bridges)

Let $G$ be a directed graph. An edge $uv \in E(G)$ is a **strong bridge** if its removal increases the number of strongly connected components of $G$.

The following is a connected graph $G$. Every edge but $v_2v_0$ is a strong bridge because removing it from $G$ increases the number of strongly connected components. Removing $v_2v_0$ doesn't increase the number of strongly connected components, so it's not a bridge.

<div id="figure-bridges-directed"></div>

A trivial algorithm to find the strong bridges of a digraph $G$ of order $n$ and size $m$ is as follows:

- Compute the number of strongly connected components of $G$, denoted as $k(G)$.
- For each edge $e \in E(G)$:
 - remove $e$ from $G$
 - compute the number of strongly connected components of $G$, denoted as $k(G - e)$
 - if $k(G) < k(G - e)$, then $e$ is a bridge.

The time complexity of the algorithm above is clearly $O(m(n + m))$.

Let $uv$ be an edge of a digraph $G$. We say that $uv$ is **redundant** if there's an alternative path from vertex $u$ to vertex $v$ avoiding $uv$. Otherwise, we say that $uv$ is not redundant. Computing the strong bridges is equivalent to computing the non-redundant edges of a graph.

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
