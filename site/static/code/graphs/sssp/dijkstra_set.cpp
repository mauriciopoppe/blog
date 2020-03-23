/**
 * C++11
 *
 * An implementation of Dijkstra's algorithm which computes
 * the shortest path from a source vertex `s` to all the other vertices
 * in a graph `G` of order `n` and size `m`
 *
 * Time complexity: O(m log n)
 * Space complexity: O(n)
 *
 * @param {vector<vector<pair<int, int> > >} g The adjacency list representation
 *  of `G`, each entry `g_{ij}` holds a pair which represents an edge
 * (vertex, weight) which tells that there's an edge from `i` to `vertex`
 * with weight `weight`
 * @param {int} s The source vertex
 * @return {vector<int>} The shortest path from `s` to all the other vertices
 */
int dijkstra(vector<vector<pair<int, int> > > &g, int source) {
  int n = g.size();
  int INF = 1e9;
  int total = 0;

  // the vertex predecessor of `i` in the `s-i` path
  vector<int> parent(n, -1);
  // holds the estimated distance
  vector<int> d(n, INF);

  // the estimated distance from the source vertex is zero
  d[s] = 0;

  // accumulated weight, next vertex (weight, v)
  set<pair<int, int> > q;
  q.insert({0, s});

  while (!q.empty()) {
    pair<int, int> edge = *(q.begin());
    int v = edge.second;
    q.erase(q.begin());

    for (int i = 0; i < g[v].size(); i += 1) {
      pair<int, int> next = g[v][i];

      // note that in the graph the first element is the neighbor vertex
      // but in the set the first element is the edge weight
      int to = next.first;
      int weight = next.second;
      int new_distance = d[to] + weight;

      if (new_distance < d[to]) {
        q.erase({ d[to], to });
        d[to] = new_distance;
        parent[to] = v;
        q.insert({ d[to], to });
      }
    }
  }

  return d;
}
