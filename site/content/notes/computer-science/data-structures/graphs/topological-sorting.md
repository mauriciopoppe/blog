---
title: "Topological sorting of a graph"
description: |
  Topological sorting is a linear ordering of the vertices of a directed acyclic graph (DAG)
  such that for every directed edge (u, v), vertex u comes before vertex v in the ordering.
  In other words, it is a way to order the vertices of a DAG such that there are no directed cycles.

  <br />
  In this article I implement the topological sorting algorithm as well as an example
  of how to use it to find the shortest path in a directed acyclic graph.
image: https://i.imgur.com/Q3MA6dZ.png
tags: ["graph theory", "topological sorting", "dag", "graph cycles"]
date: 2015-06-24 11:30:00
libraries: ["greuler"]
---

Let $G$ be a digraph, the **topological sorting** algorithm is a linear ordering of the vertices of $G$ such that for every directed edge $u \rightarrow v$ where $u,v \in V(G)$, $u$ comes before $v$ in the ordering, the ordering is possible only if the graph *has no directed cycles*

- since the graph has no directed cycles, at least one of the vertices has no incoming edges

<div id="figure-topological-sorting"></div>

{{< snippet file="static/code/graphs/topological_sorting.cpp" lang="cpp" />}}

## Applications

### Shortest path in a Directed Acyclic Graph

{{< snippet file="static/code/graphs/shortest_path_dag.cpp" lang="cpp" />}}

{{< script >}}
document.addEventListener('DOMContentLoaded', function () {
  d3.json('/js/graph/data/topological-sorting.json', function (err, data) {
    var width = document.querySelector('article.content').clientWidth
    if (err) { throw err }
    greuler({
      directed: true,
      target: '#figure-topological-sorting',
      data: data,
      width: width
    }).update({ iterations: [30, 30, 30] })
  })
})
{{< /script >}}
