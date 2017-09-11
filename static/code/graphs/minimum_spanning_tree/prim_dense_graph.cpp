/**
 * An implementation of Prim's algorithm which computes
 * the minimum spanning tree of a dense graph `G`
 *
 * Time complexity: O(n^2)
 * Space complexity: O(n)
 *
 * @param {vector<vector<int> >} g The adjacency matrix of `G`, each entry `a_{ij}`
 * holds the weight of the edge connecting vertex `i` and vertex `j`, if this number
 * is <= 0 then `i` and `j` are not adjacent
 * @return {int} The weight of the MST
 */
int prim(vector<vector<int> > &g) {
  int n = g.size();
  int INF = 1e9;
  int total = 0;

  vector<bool> visited(n, false);
  // holds the weight of the edge of minimum weight incident
  // to the vertex `i`
  vector<int> min_weight_edge(n, INF);
  // (optional) holds the index of a vertex adjacent to the
  // vertex `i` in the MST, note that the size of the MST is
  // n - 1 so the first vertex won't store the mentioned index
  vector<int> neighbor_selected(n, -1);

  // pick the first node as the "arbitrary" node
  min_weight_edge[0] = 0;

  for (int i = 0; i < n; i += 1) {
    int v = -1;
    for (int j = 0; j < n; j += 1) {
      // find the vertices which haven't been visited yet
      // among them find a vertex with the minimum edge weight
      if (!visited[j] && (v == -1 ||
          min_weight_edge[j] < min_weight_edge[v])) {
        v = j;
      }
    }

    visited[v] = true;
    total += min_weight_edge[v];

    // update the minimum edge weight of all the vertices
    // adjacent to `v`
    for (int to = 0; to < n; to += 1) {
      if (g[v][to] > 0 &&
          g[v][to] < min_weight_edge[to]) {
        min_weight_edge[to] = g[v][to];
        // update the candidate neighbor of the vertex `to` to
        // be `v` since it's connected with an edge
        // of minimum weight among all the adjacent vertices to `to`
        neighbor_selected[to] = v;
      }
    }
  }

  return total;
}
