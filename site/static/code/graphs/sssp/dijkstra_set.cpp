/**
 * C++11
 *
 * An implementation of Dijkstra's algorithm which computes
 * the shortest path from a source vertex `s` to all the other vertices
 * in a graph `G` of order `V` and size `E`
 *
 * Time complexity: O((E+V) log V)
 * Space complexity: O(V)
 *
 * @param {vector<vector<pair<int, int>>>} g The adjacency list representation
 *  of `G`, each entry `g_{ij}` holds a pair which represents an edge
 * (vertex, weight) which tells that there's an edge from `i` to `vertex`
 * with weight `weight`
 * @param {int} s The source vertex
 * @return {vector<int>} The shortest path from `s` to all the other vertices
 */
int dijkstra(vector<vector<pair<int, int>>> &g, int source) {
  int V = g.size();
  int INF = 1e9;
  int total = 0;

  // the vertex predecessor of `i` in the `s-i` path
  vector<int> parent(V, -1);
  // holds the estimated distance
  vector<int> d(V, INF);

  // the estimated distance from the source vertex is zero
  d[s] = 0;

  // accumulated weight, next vertex (weight, v)
  set<pair<int, int>> q;
  q.insert({0, s});

  while (!q.empty()) {
    pair<int, int> edge = *(q.begin());
    int from = edge.second;
    q.erase(q.begin());

    for (int i = 0; i < g[v].size(); i += 1) {
      int to, weight;

      // note that in the graph the first element is the neighbor vertex
      // but in the set the first element is the edge weight
      tie(to, weight) = g[v][i];

      if (d[from] + weight < d[to]) {
        q.erase({ d[to], to });
        d[to] = d[from] + weight;
        parent[to] = v;
        q.insert({ d[to], to });
      }
    }
  }

  return d;
}
