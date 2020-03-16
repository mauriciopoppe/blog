---
title: "Components"
date: 2015-06-25 15:00:00
---

A connected subgraph of $G$ that is not a proper subgraph of any other connected subgraph of $G$ is a **component** of $G$, i.e. there's a $u-v$ path in the mentioned subgraph

## Undirected graphs

The problem of finding components in an undirected graph requires a simple graph traversal starting from an arbitrary vertex keeping track of the vertices that were already visited, it's also needed to run the algorithm above for every vertex of $G$ (given that it was not visited)

- the number of components of an undirected graph $G$ is equal to the number of disconnected subgraphs

{{< snippet file="static/code/graphs/components/components_undirected.cpp" lang="cpp" />}}

## Directed graphs

Given a directed graph $G$ two nodes $u, v \in V(G)$ are called **strongly connected** if $v$ is reachable from $u$ and $u$ is reachable from $v$

A **strongly connected component** (SCC) of $G$ is a subgraph $C \subseteq V(G)$ such that

- $C$ is not empty
- for any $u,v \in V(G)$, $u$ and $v$ are strongly connected
- for any $u \in V(G)$ and $v \in G - C$, $u$ and $v$ are not strongly connected

### Tarjan's algorithm

The idea is to perform a DFS from an arbitrary vertex (conducting subsequent DFS from non-explored vertices), during the traversal each vertex $v$ is assigned with two numbers:

- the **time** it was explored denoted as $v_{time}$
- the smallest index of any node known to be reachable from $v$ denoted as $v_{low}$

Let $u$ be a node that belongs to a SCC, if $v$ is the arbitrary vertex chosen then the only known vertex that is reachable from $u$ is $u$, let $v$ be a vertex discovered during the exploration of $u$, if there's a $v \rightarrow u$ path then it means that there's a cycle and all the vertices in the path $u-v$ belong to the same connected component, such a node $u$ is called the **root of the SCC**

Let $u$ be a node that belongs to a SCC, if it's known that there's a $u-v$ cycle and also that $u$ can reach a vertex $t$ with lower index than $u$ then $v$ and $t$ belong to the same component

A stack is also needed to keep track of the nodes that were visited, the working of the stack follows the invariant: a node remains on the stack after exploration if and only if it has a path to some node earlier in the stack

<img src="https://upload.wikimedia.org/wikipedia/commons/6/60/Tarjan%27s_Algorithm_Animation.gif?1435613160896" class="center" style="display: block" alt="">

{{< snippet file="static/code/graphs/components/strongly_connected_components_tarjan.cpp" lang="cpp" />}}
