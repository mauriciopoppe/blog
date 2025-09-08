---
title: "Strongly Connected Components in Graph Theory"
summary: |
  A strongly connected component of a directed graph is a subgraph in which there exists a path from every vertex to every other vertex in the subgraph.

  <br />
  In this article, I implement Tarjan's algorithm to find strongly connected components in a graph.
image: https://upload.wikimedia.org/wikipedia/commons/6/60/Tarjan%27s_Algorithm_Animation.gif?1435613160896
tags: ["graph theory", "tarjan's algorithm", "strongly connected components"]
libraries: ["math"]
date: 2015-06-25 15:00:00
---

A connected subgraph of $G$ that is not a proper subgraph of any other connected subgraph of $G$ is a **component** of $G$; i.e., there's a $u-v$ path in the mentioned subgraph.

Strongly connected components are useful in a variety of graph algorithms, including finding the shortest path between two vertices, detecting cycles in a graph, and determining the structure of a graph.
They can be computed efficiently using algorithms such as Tarjan's and Kosaraju's algorithms.

## Undirected graphs

The problem of finding components in an undirected graph requires a simple graph traversal starting from an arbitrary vertex, keeping track of the vertices that were already visited. It's also necessary to run the algorithm above for every vertex of $G$ (given that it was not visited).

- The number of components of an undirected graph $G$ is equal to the number of disconnected subgraphs.

{{< snippet file="static/code/graphs/components/components_undirected.cpp" lang="cpp" />}}

## Directed graphs

Given a directed graph $G$, two nodes $u, v \in V(G)$ are called **strongly connected** if $v$ is reachable from $u$ and $u$ is reachable from $v$.

A **strongly connected component** (SCC) of $G$ is a subgraph $C \subseteq V(G)$ such that:

- $C$ is not empty.
- For any $u,v \in V(G)$, $u$ and $v$ are strongly connected.
- For any $u \in V(G)$ and $v \in G - C$, $u$ and $v$ are not strongly connected.

### Tarjan's algorithm

The idea is to perform a DFS from an arbitrary vertex (conducting subsequent DFS from non-explored vertices). During the traversal, each vertex $v$ is assigned two numbers:

- The **time** it was explored, denoted as $v_{time}$.
- The smallest index of any node known to be reachable from $v$, denoted as $v_{low}$.

Let $u$ be a node that belongs to an SCC. If $u$ is the arbitrary vertex chosen, then the only known vertex that is reachable from $u$ is $u$ itself. Let $v$ be a vertex discovered during the exploration of $u$. If there's a $v \rightarrow u$ path, then it means that there's a cycle, and all the vertices in the path $u-v$ belong to the same connected component. Such a node $u$ is called the **root of the SCC**.

Let $u$ be a node that belongs to an SCC. If it's known that there's a $u-v$ cycle and also that $u$ can reach a vertex $t$ with a lower index than $u$, then $v$ and $t$ belong to the same component.

A stack is also needed to keep track of the nodes that were visited. The working of the stack follows the invariant: a node remains on the stack after exploration if and only if it has a path to some node earlier in the stack.

{{< figure src="https://upload.wikimedia.org/wikipedia/commons/6/60/Tarjan%27s_Algorithm_Animation.gif?1435613160896" >}}

{{< snippet file="static/code/graphs/components/strongly_connected_components_tarjan.cpp" lang="cpp" />}}
