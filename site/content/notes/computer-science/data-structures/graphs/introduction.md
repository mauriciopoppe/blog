---
title: "Introduction"
date: 2015-06-22 17:03:41
libraries: ["greuler"]
---

A graph is a pair $G = (V, E)$, it consists of a finite set $V$ of objects called the *vertices* (or nodes or points) and a set $E$ of 2-elements subsets of $V$ called *edges*, another way to denote the vertex set/edges of a graph $G$ is using $V(G)$ (the vertex set of $G$) and $E(G)$ (the edge set of $G$)

<div id="figure-introduction"></div>

<div>$$
\begin{align*}
G &= (V, E) \\
V &= \{1, 2, 3, 4, 5, 6, 7\} \\
E &= \{ \{1, 5\}, \{5, 7\}, \{2, 3\}, \{2, 4\}, \{3, 4\} \}
\end{align*}
$$</div>

Properties

- the **order** of a graph is the number of vertices (written as $\mid G \mid$)
- the **size** of a graph is the number of edges (written as $\Vert G \Vert$)
- an edge ${u, v}$ is usually written as $uv$ (or $vu$), if $uv$ is an edge of $G$ then $u$ and $v$ are said to be **adjacent** in $G$
- a vertex $v$ is **incident** with an edge *e* if $v \in e$
- the set of neighbors of a vertex $v$ is denoted by $N(v)$
- the **degree of a vertex** $v$ is the number of edges incident to $v$ (loops are counted twice)

Let $G = (V, E)$ and $G' = (V', E')$ be two graphs, we set $G \cup G' = (V \cup V', E \cup E')$ and $G \cap G' = (V \cap V', E \cap E')$

- if $G \cup G = \varnothing$ then $G$ and $G'$ are **disjoint**
- if $V' \subseteq V$ and $E' \subseteq E$ then $G'$ is a **subgraph** of $G$ written as $G' \subseteq G$
- if $G'$ is a subgraph of $G$ and either $V' \subset V$ or $E' \subset E$ then $G'$ is a **proper subgraph** of $G$
- if $G'$ is a subgraph of $G$ and $V' = V$ then $G'$ is an **spanning subgraph** of $G$
- if $V' \subseteq V$ and all the edges $e = uv \in E$ so that $u \in V'$ and $v \in V'$ and also $e \in E'$ then $G'$ is an **induced graph** of $G$

## Movement

A **walk** in a graph is a sequence of movements beginning at $u$ moving to a neighbor of $u$ and then to a neighbor of that vertex and so on until we stop at a vertex $v$

<div>$$
W = (u = v_0, v_1, \ldots, v = v_k)
$$</div>

where $k \geq 0$, note that there are no restrictions on the vertices visited so a vertex can be visited more than once also there are no restrictions on the edges traversed so an edge can be traversed more than once, every two consecutive vertices in $W$ are distinct since they are adjacent, if $u = v$ then we said that the walk is *closed* otherwise it's *open*

- a **trail** is a walk in which no edge is traversed more than once
- a **path** is a walk in which no vertex is visited more than once (note that every path is also a trail)
- a **circuit** is a *closed trail* of length 3 or more (it begins and ends at the same vertex but repeat no edges)
- a **cycle** is a circuit that repeat no vertex (think of it as a *closed path*), a $k$-cycle is a cycle of length $k$ (e.g. a $3$-cycle is a triangle)

Properties related with path lengths

- the **distance** between two vertices $u$ and $v$ is the smallest length of any $u - v$ path in $G$ denoted by $d(u, v)$
- the **diameter** is the greatest distance between any two vertices of a connected graph

Some additional properties related with connectivity in a graph

- if a graph $G$ contains a $u-v$ path then $u$ and $v$ are said to be **connected**
- a graph $G$ is **connected** if every two vertices of $G$ are connected
- a connected subgraph of $G$ that is not a proper subgraph of any other connected subgraph of $G$ is a **component** of $G$
- the number of components of a graph is denoted by $k(G)$, then a graph is connected if $k(G) = 1$

## Common classes of graphs

### Complete graph

A graph $G$ is **complete** if every two distinct vertices of $G$ are adjacent

<div id="figure-complete-graph"></div>

- a complete graph of order $n$ is denoted by $K_n$, for complete graphs $K_n$ has the maximum possible size for a graph of $n$ vertices
- the number of pairs of vertices in $K_n$ is $\binom{n}{2} = \tfrac{n(n - 1)}{2}$

### Sparse graph

A graph $G$ of order $n$ and size $m$ is a **sparse graph** if $m$ is close to the minimal number of edges i.e. when $m \approx n$, in this case **adjacency lists** are prefered since they require constant space for every edge, a tree is a good example of a sparse graph

### Dense graph

A graph $G$ of order $n$ and size $m$ is a **dense graph** if $m$ is close to the maximal number of edges i.e. when $m \approx n^2$, in this case an **adjacency matrix** is prefered, a complete graph is a dense graph

### Complement graph

The **complement** $\bar{G}$ of a graph $G$ is a graph whose vertex is the set $V(G)$ and such that for each pair $u, v$ of distinct vertices, $uv \in E(\bar{G})$ and $uv \not\in E(G)$, that means that the complement of a complete graph is a graph of order $n$ and size $0$

<div id="figure-complement-graph"></div>

- if $G$ is diconnected, $\bar{G}$ is connected

### Bipartite graph

A graph $G$ is bipartite when the set $V(G)$ can be partitioned into two subsets $U$ and $W$ called **partite sets** such that every edge of $G$ joins a vertex of $U$ and a vertex of $W$

<div id="figure-bipartite-graph"></div>

- a nontrivial graph $G$ is bipartite if it doesn't contain *odd length cycles*
- a **complete bipartite graph** is a bipartite graph where each vertex of $U$ is adjacent to every vertex of $W$, it's denoted as $K_{\mid U \mid, \mid W \mid}$
- a **star** is a complete bipartite graph where $K_{1, \mid W \mid}$ or $K_{\mid U \mid, 1}$

### $k$-partite graph

A graph $G$ is $k$-partite when the set $V(G)$ can be partitioned into $k$ subsets $V_1, V_2, \ldots, V_k$ such that every edge of $G$ joins a vertex of $U$ and a vertex of $W$

### Biconnected graph

A biconnected graph $G$ is a connected and "nonseparable" graph meaning that if any vertex (and its incident edges) is removed the graph will remain connected, therefore a biconnected graph doesn't have cut-vertices

<div id="figure-biconnected-graph"></div>

### Multigraphs

A multigraph $M$ is a graph where every two vertices of $M$ are joined by a finite number of edges, when two or more edges join the same pair of distinct vertices those edges are called **parallel edges**

<div id="figure-multigraph"></div>

### Pseudographs

A pseudograph $P$ is a graph where an edge is allowed to join a vertex with itself, such an edge is called a **loop**

<div id="figure-pseudograph"></div>

### Weighted graph

Let $G$ be a multigraph, let's replace all the parallel edges joining a particular pair of vertices by a single edge which is assigned a positive integer representing the number of parallel edges, this new representation is refered as a **weighted graph**

<div id="figure-weighted-graph"></div>

### Digraphs

A **directed graph** $D$ is a finite nonempty set $V$ of vertices and a set $E$ of ordered pairs of distinct vertices, the elements of the set $E$ are called **directed edges** or arcs, arcs are represented with arrows instead of plain line segments

<div id="figure-directed-graph"></div>

- if $uv$ is a directed edge then $u$ is **adjacent to** $v$ and $v$ is **adjacent from** $u$

## Degrees

The **degree** of a vertex $v$ is the number of edges incident with $v$ denoted by $deg \; v$ (with loops counted twice)

- the minimum degree of a graph $G$ is the minimum degree among all the vertices of $G$ denoted as $\delta(G)$
- the maximum degree of a graph $G$ is the maximum degree among all the vertices of $G$ denoted as $\Delta(G)$
- a vertex of degree $0$ is called an **isolated vertex**
- a vertex of degree $1$ is called an **end vertex** (or **leaf**)
- a vertex of even degree is called an **even vertex**
- a vertex of odd degree is called an **odd vertex**
- two vertices of $G$ that have the same degree are called **regular vertices**
- if a graph $G$ has the same degree $r$ for all its vertices it's called an **r-regular graph**

In a graph $G$ of $n$ vertices the following equality relation holds

<div>$$
0 \leq \delta(G) \leq deg\; v \leq \Delta(G) \leq n - 1
$$</div>

**First theorem of graph theory**

> if $G$ is a graph of size $m$ then
>
<div>$$
\sum_{v \in V(G)} deg \; v = 2m
$$</div>

When summing the degrees of $G$ each edge is counted twice

### Degrees in a bipartite graph

Suppose that $G$ is a bipartite graph with two partite sets $U$ and $W$, then

<div>$$
\sum_{u \in V(U)}deg \; u = \sum_{w \in V(W)} deg \; w = m
$$</div>

**Corollary: every graph has an even number of odd vertices**

*Proof:* Let $G$ be a graph of size $m$, dividing $V(G)$ into two subsets $V_{even}$ which consists of even vertices and $V_{odd}$ which consists of odd vertices then by the first theorem of graph theory

<div>$$
\sum_{v \in V_{even}(G)} deg \; v + \sum_{v \in V_{odd}(G)} deg \; v = 2m
$$</div>

the number $\sum_{v \in V_{even}(G)} deg \; v$ is even since it's a sum of even numbers thus $\sum_{v \in V_{odd}(G)} deg \; v$ is also even and it can be even only if the number of odd vertices is even (a sum of two odd numbers gives an even number)

### Degree sequences

A deIf the degrees of a graph $G$ are listed in a sequence $s$ then $s$ is called a *sequence degree*, e.g.

<div>$$
s: 4, 3, 2, 2, 2, 1, 1, 1, 0
$$</div>

<div id="figure-degree-sequence"></div>

Suppose we're given a finite sequence $s$ of nonnegative integers, a well known problem is if we can build a graph out of this sequence, to solve this problem let's talk about some facts

- the degree of any vertice can never be greater than $n - 1$ where $n$ is the order of the graph
- a graph has an even number of odd vertices

There's a theorem called Havel-Hakimi which solves the problem above in polynomial time

> A non-increasing sequence $s: d_1, d_2, \ldots, d_n$ where $d_1 \geq 1$ can form a graph only if the sequence
>
<div>$$
s_1: d_2 - 1, d_3 - 1, \ldots, d_{d_1 + 1} - 1, d_{d_1 + 2}, \ldots, d_n
$$</div>
forms a graph

According to this theorem we can create a new sequence based on the one above that is also a graph, we can apply the theorem recursively to test if the original sequence forms a graph

<div>$$
\begin{align*}
s_1 &: 4, 3, 2, 2, 2, 1, 1, 1, 0 \\
s_2 &: 2, 1, 1, 1, 1, 1, 1, 0 \quad \text{removing $d_1 = 4$ and subtracting $1$ from the following $4$ elements} \\
s_3 &: 1, 1, 1, 1, 0 \quad \text{removing $d_1 = 2$ and subtracting $1$ from the following $2$ elements} \\
s_4 &: 1, 1, 0 \quad \text{removing $d_1 = 1$ and subtracting $1$ from the following element} \\
s_5 &: 0 \quad \text{removing $d_1 = 1$ and subtracting $1$ from the following element}
\end{align*}
$$</div>

{{< snippet file="static/code/graphs/graph_from_degree_sequence.cpp" lang="cpp" />}}

## Graphs and matrices

A graph can also be described using a matrix, the **adjacency matrix** of a graph $G$ of order $n$ and size $m$ is a $n \times n$ matrix $A = [a_{ij}]$ $where

<div>$$
a_{ij} =
\begin{cases}
1 & \text{if $v_iv_j \in G$} \\
0 & \text{otherwise}
\end{cases}
$$</div>

The **incidence matrix** of a graph $G$ of order $n$ and size $m$ is a $n \times m$ matrix $B = [b_{ij}]$ where

<div>$$
b_{ij} =
\begin{cases}
1 & \text{if $v_i$ is incident with $e_j$} \\
0 & \text{otherwise}
\end{cases}
$$</div>

<div id="figure-adjacency-incidence-matrix"></div>

<div>$$
G = (V, E) \\
V = \{0, 1, 2, 3, 4\} \\
E = \{\{0, 1\}, \{0, 2\}, \{0, 3\}, \{1, 3\}, \{2, 3\}, \{3, 4\}\} \\
$$</div>

<div>$$
A = \begin{bmatrix}
0 & 1 & 1 & 1 & 0 \\
1 & 0 & 0 & 1 & 0 \\
1 & 0 & 0 & 1 & 0 \\
1 & 1 & 1 & 0 & 1 \\
0 & 0 & 0 & 1 & 0
\end{bmatrix} \quad
B = \begin{bmatrix}
1 & 1 & 1 & 0 & 0 & 0 \\
1 & 0 & 0 & 1 & 0 & 0 \\
0 & 1 & 0 & 0 & 1 & 0 \\
0 & 0 & 1 & 1 & 1 & 1 \\
0 & 0 & 0 & 0 & 0 & 1
\end{bmatrix}
$$</div>

### Useful observations

Let $A^k$ be the adjacency matrix of a graph $G$ raised to the $k$-th power, the entry $a_{ij}^{(k)}$ is the number of distinct $v_i - v_j$ walks of length $k$ in $G$

*Proof:* assume for a positive integer $k$ that the number of $v_i - v_j$ walks of length $k$ is given by $a_{ij}^{(k)}$ in the matrix $A^k$, then $A^{k + 1} = A^k \times A$, now a cell $a_{ij}^{(k + 1)}$ is the dot product of row $i$ of $A^k$ and column $j$ of $A$

<div>$$
a_{ij}^{(k + 1)} = \sum_{t=1}^n a_{it}^{(k)} \cdot a_{tj}
$$</div>

The first element of this sum is the number of walks of length $k$ from $v_i$ to $v_1$ (stored in $a_{i1}^{(k)}$) times the number of walks of length $1$ from $v_1$ to $v_j$ (stored in $a_{1j}$), the second element follows the same formula but using $v_2$ as the vertex used to "join" the walks of length $k$ and $1$

<script src="/js/graph/introduction.js"></script>
