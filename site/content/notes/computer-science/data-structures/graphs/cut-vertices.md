---
title: "Cut-vertices (articulation points) in Graph Theory"
summary: |

  A vertex $v$ in a connected graph $G$ is called a **cut-vertex** if $G - v$ results in a disconnected graph. Note that $G - v$ is an induced subgraph of $G$ (meaning that $G - v$ contains all the vertices of $G$ except $v$ and a set of edges $G - E_v$, where $E_v$ consists of all the edges incident to $v$).

  <br />
  In this article, I implement an algorithm to find the articulation points in an undirected graph.
  I also explain biconnected components in an undirected graph and concepts such as
  edge connectivity and vertex connectivity.
tags: ["graph theory", "cut vertices", "articulation points", "biconnected components", "edge connectivity", "vertex connectivity", "depth first search"]
image: /images/articulation-points.png
date: 2015-06-24 15:00:00
libraries: ["greuler", "math"]
---

All the facts/properties below are considered for an undirected, connected graph $G$.

- If $v$ is a vertex incident with a bridge in a graph $G$, then $v$ is a cut-vertex if $deg(v) \geq 2$ (if $deg(v) = 1$, then $v$ is an end-vertex of $G$, so $G - v$ is still connected).
- Given that the order of $G$ is $\geq 3$, if it contains a bridge, then it also contains a cut-vertex.
- If $v$ is a cut-vertex of $G$, and $u$ and $w$ are vertices in different components formed by $G - v$, then $v$ is part of every $u-w$ path in $G$.
- Let $u \in V(G)$. If $v$ is a vertex that is farthest from $u$, then $v$ is not a cut-vertex.

<div id="figure-cut-vertex"></div>

<div>$$
\text{$v_0, v_2$ are cut vertices}
$$</div>

Let $G$ be an undirected graph. By analyzing the properties of the DFS tree, we can determine if a vertex is an articulation point given the following facts:

- A leaf vertex is not a cut-vertex.
- Let $u$ and $v$ be two vertices of the DFS tree such that $u$ is an ancestor of $v$.
  - If $u$ and $v$ are not adjacent and there's a *back edge* $vw$ to some vertex $w$ such that $w$ is a predecessor of $u$, then none of the vertices in the $u-v$ path are cut-vertices.
  - If $u$ and $v$ are not adjacent and there's a *back edge* from $v$ to some vertex **in the $u-v$ path**, then $u$ is a cut-vertex.
- Let $u$ be the root node of the DFS tree. It's a cut-vertex if, during the exploration of its successor vertices, it's found that it has more than one child, i.e., the root has more than one branch in the DFS tree.

{{< snippet file="static/code/graphs/cut_vertices.cpp" lang="cpp" />}}

### Biconnected components in an undirected graph

A biconnected graph is a nonseparable graph, meaning that if any vertex is removed, the graph is still connected, and therefore it doesn't have cut-vertices.

Key observations:

- Two different biconnected components can't have a common edge (but they might share a common vertex).
- A common vertex linking multiple biconnected components must be a cut-vertex of $G$.

Let $uv$ be an edge of an undirected graph $G$. We can keep a stack telling the order of the edges analyzed, so we push it to the stack. If $u$ is a cut-vertex, then all the edges from the top of the stack up to $uv$ are the edges of one biconnected component.

{{< snippet file="static/code/graphs/biconnected_components.cpp" lang="cpp" />}}

## Connectivity

Let $G$ be a non-complete graph without cut-vertices. Let $U$ be a set of vertices of $G$ such that $G - U$ is disconnected. $U$ is called a **vertex-cut set**

The graph below doesn't have a cut-vertex, but it has many vertex-cut sets: $U_1 = {v_1, v_2}$, $U_2 = {v_2, v_4}$, $U_3 = {v_1, v_2, v_3}$, $U_4 = {v_1, v_2, v_4}$, $U_5 = {v_0, v_2, v_4}$.

<div id="figure-cut-vertex-2"></div>

- The set with minimum cardinality is called a **minimum vertex-cut set**.
- A connected graph $G$ contains a **cut-vertex set** only if $G$ is not complete.

For a graph $G$ that is not complete, the **vertex-connectivity**, denoted as $\kappa(G)$, is the cardinality of the minimum vertex-cut set of $G$. For the graph above, $\kappa(G) = 2$.

- If $G$ is a graph of order $n$ and size $m \geq n - 1$, then $\kappa(G) = \left \lfloor \tfrac{2m}{n} \right \rfloor$.

There are other measures of how connected a graph is. Let $X$ be a set of edges of $G$ such that $G - X$ is disconnected or a trivial graph. $X$ is called an **edge-cut set**. The **edge-connectivity**, denoted as $\lambda(G)$, is the cardinality of the minimum edge-cut of $G$.

- For a complete graph $G$ of order $n$, $\lambda(G) = n - 1$.

{{< script >}}
document.addEventListener('DOMContentLoaded', function () {
  function getJson(file, callback) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err))
  }
  getJson('/js/graph/data/cut-vertex.json', function (err, data) {
    if (err) { throw err }
    var options = {
      target: '#figure-cut-vertex',
      data: data
    };
    greuler(options).update();
  });
  getJson('/js/graph/data/cut-vertex-2.json', function (err, data) {
    if (err) { throw err }
    greuler({
      target: '#figure-cut-vertex-2',
      data: data
    }).update();
  });
})
{{< /script >}}
