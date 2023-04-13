---
title: "Hamiltonian Graphs"
description: "Hamiltonian graphs and hamiltonian cycles."
tags: ["graph theory", "hamiltonian graph", "hamiltonian cycle"]
date: 2015-07-07 19:30:51
libraries: ["greuler"]
---

A cycle that contains every vertex of a graph $G$ is called a **Hamiltonian cycle**, a Hamiltonian cycle is a spanning cycle of $G$, a **Hamiltonian graph** is a graph that contains a Hamiltonian cycle

A path in a graph that contains every vertex of $G$ is called a **Hamiltonian path** in $G$, if a graph contains a Hamiltonian cycle then it also contains a Hamiltonian path obviously removing any edge from a Hamiltonian cycle produces a Hamiltonian path

<div id="figure-hamiltonian-graph"></div>

<div>$$
C = {v_0, v_1, v_3, v_8, v_{12}, v_{13}, v_9, v_4, v_5, v_6, v_{10}, v_{14}, v_{11}, v_7, v_2, v_0}
$$</div>

- every complete graph $K_n$ is a Hamiltonian graph
- TODO

{{< script >}}
document.addEventListener('DOMContentLoaded', function () {
  function getJson(file, callback) {
    fetch(file)
      .then((response) => response.json())
      .then((data) => callback(null, data))
      .catch((err) => callback(err))
  }
  getJson('/js/graph/data/hamiltonian-graph.json', function (error, data) {
    var options = {
      target: '#figure-hamiltonian-graph',
      data: data
    };
    var instance = greuler(options).update();

    var path = [0, 1, 3, 8, 12, 13, 9, 4, 5, 6, 10, 14, 11, 7, 2, 0];
    var last = path.shift();
    function run() {
      var next = path.shift();
      var edge = options.data.edges.filter(function (e) {
        return (e.source.index === last && e.target.index === next) ||
          (e.source.index === next && e.target.index === last);
      })

      edge[0]['class'] = 'highlight';
      last = next;
      instance.update();

      if (path.length) {
        setTimeout(run, 1000);
      }
    }

    run();
  });
})
{{< /script >}}
