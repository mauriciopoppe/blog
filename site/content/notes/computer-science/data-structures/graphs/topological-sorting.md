---
title: "Topological sorting of a graph"
summary: |
  Topological sorting is a linear ordering of the vertices of a directed acyclic graph (DAG)
  such that for every directed edge (u, v), vertex u comes before vertex v in the ordering.
  In other words, it is a way to order the vertices of a DAG such that there are no directed cycles.

  <br />
  In this article, I implement the topological sorting algorithm and provide an example
  of how to use it to find the shortest path in a directed acyclic graph.
image: https://i.imgur.com/Q3MA6dZ.png
tags: ["graph theory", "topological sorting", "dag", "graph cycles"]
date: 2015-06-24 11:30:00
libraries: ["math"]
---

Let $G$ be a digraph. The **topological sorting** algorithm is a linear ordering of the vertices of $G$ such that for every directed edge $u \rightarrow v$, where $u,v \in V(G)$, $u$ comes before $v$ in the ordering. The ordering is possible only if the graph *has no directed cycles*.

- Since the graph has no directed cycles, at least one of the vertices has no incoming edges.

<div id="figure-topological-sorting"></div>

{{< snippet file="static/code/graphs/topological_sorting.cpp" lang="cpp" />}}

## Applications

### Shortest path in a Directed Acyclic Graph

{{< snippet file="static/code/graphs/shortest_path_dag.cpp" lang="cpp" />}}

<script type="module">
import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

fetch('/js/graph/data/topological-sorting.json')
  .then((response) => response.json())
  .then((data) => {
    const width = document.querySelector('article.content').clientWidth
    greuler({
      directed: true,
      target: '#figure-topological-sorting',
      data: data,
      width: width
    }).update({ iterations: [30, 30, 30] })
  })
</script>
