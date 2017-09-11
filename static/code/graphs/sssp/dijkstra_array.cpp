/**
 * An implementation of Dijkstra's algorithm which computes
 * the shortest path from a source vertex `s` to all the other vertices
 * in a graph `G` of order `n` and size `m`
 *
 * Time complexity: O(n^2 + m)
 * Space complexity: O(n)
 *
 * @param {vector<vector<pair<int, int> > >} g The adjacency list representation
 *  of `G`, each entry `g_{ij}` holds the end `v` of the edge `iv` and the weight
 *  `weight` of the edge i.e. (v, weight)
 * @param {int} s The source vertex
 * @return {vector<int>} The shortest path from `s` to all the other vertices
 */
vector<int> dijkstra(vector<vector<pair<int, int> > > &g, int s) {
  int n = g.size();
  int INF = 1e9;

  vector<bool> visited(n);
  // the vertex predecessor of `i` in the `s-i` path
  vector<int> parent(n, -1);
  // holds the estimated distance
  vector<int> d(n, INF);

  // the estimated distance from the source vertex is zero
  d[s] = 0;

  for (int i = 0; i < n; i += 1) {
    // the vertex with the minimum estimated distance
    int v = -1;
    for (int j = 0; j < n; j += 1) {
      // find the vertices which haven't been visited yet
      // among them find a vertex with the minimum estimated distance
      if (!visited[j] && (v == -1 || d[j] < d[v])) {
        v = j;
      }
    }

    if (d[v] == INF) {
      // the vertex selected is not reachable from `s`
      break;
    }

    visited[v] = true;

    // update the estimated distance from `v`
    // to all the other adjacent vertices
    for (int j = 0; j < g[v].size(); j += 1) {
      pair<int, int> &edge = g[v][j];
      int next = edge.first;
      int weight = edge.second;
      int new_distance = d[v] + weight;

      if (new_distance < d[next]) {
        d[next] = new_distance;
        parent[next] = v;
      }
    }
  }

  return d;
}
