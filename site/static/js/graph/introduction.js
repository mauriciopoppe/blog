import greuler from 'https://cdn.jsdelivr.net/npm/greuler@1.0.0/+esm'

function loadGraph(url, options, updateOpts) {
  fetch(url)
    .then((r) => r.json())
    .then((data) => {
      greuler(Object.assign({ data }, options)).update(updateOpts)
    })
}

loadGraph('/js/graph/data/introduction.json', { target: '#figure-introduction' })
loadGraph('/js/graph/data/complete-graph.json', { target: '#figure-complete-graph' }, { iterations: [30, 30, 30] })
loadGraph('/js/graph/data/complement-graph.json', { target: '#figure-complement-graph' })
loadGraph('/js/graph/data/bipartite-graph.json', { target: '#figure-bipartite-graph' })
loadGraph('/js/graph/data/biconnected-graph.json', { target: '#figure-biconnected-graph' })
loadGraph('/js/graph/data/pseudograph.json', { target: '#figure-pseudograph' })
loadGraph('/js/graph/data/multigraph.json', { target: '#figure-multigraph' })
loadGraph('/js/graph/data/weighted-graph.json', { target: '#figure-weighted-graph' })
loadGraph('/js/graph/data/directed-graph.json', { directed: true, target: '#figure-directed-graph' })
loadGraph('/js/graph/data/degree-sequence.json', { target: '#figure-degree-sequence' }, { iterations: [10, 10, 10] })
loadGraph('/js/graph/data/adjacency-incidence-matrix.json', { target: '#figure-adjacency-incidence-matrix' })
