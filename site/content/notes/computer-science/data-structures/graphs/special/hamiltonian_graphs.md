---
title: "Hamiltonian Graphs"
description: "Hamiltonian graphs and hamiltonian cycles."
tags: ["graph theory", "hamiltonian graph", "hamiltonian cycle"]
date: 2015-07-07 19:30:51
libraries: ["greuler", "math"]
---

A cycle that contains every vertex of a graph $G$ is called a **Hamiltonian cycle**, a Hamiltonian cycle is a spanning cycle of $G$, a **Hamiltonian graph** is a graph that contains a Hamiltonian cycle

A path in a graph that contains every vertex of $G$ is called a **Hamiltonian path** in $G$, if a graph contains a Hamiltonian cycle then it also contains a Hamiltonian path obviously removing any edge from a Hamiltonian cycle produces a Hamiltonian path

<div id="figure-hamiltonian-graph"></div>

<div>$$
C = {v_0, v_1, v_3, v_8, v_{12}, v_{13}, v_9, v_4, v_5, v_6, v_{10}, v_{14}, v_{11}, v_7, v_2, v_0}
$$</div>

- every complete graph $K_n$ is a Hamiltonian graph
- TODO

<script src="/js/graph/hamiltonian-graph.js"></script>
