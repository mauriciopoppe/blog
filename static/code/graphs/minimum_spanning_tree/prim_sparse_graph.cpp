/**
 * C++11
 *
 * An implementation of Prim's algorithm which computes
 * the minimum spanning tree of a sparse graph `G` of order `n` and size `m`
 *
 * Time complexity: O(m log n)
 * Space complexity: O(n)
 *
 * @param {vector<vector<pair<int, int> > >} g The adjacency list representation
 * of a graph `G`, each entry `g_{ij}` holds a pair which represents an edge
 * (vertex, weight) which tells that there's an edge from `i` to `vertex`
 * with weight `weight`
 * @return {int} The weight of the MST or a negative number if the graph
 * wasn't connected
 */
int prim(vector<vector<pair<int, int> > > &g) {
  int n = g.size();
  int total = 0;

  vector<bool> visited(n, false);
  // holds the weight of the edge of minimum weight incident
  // to the vertex `i`
  vector<int> min_cost(n, INF);
  // (optional) holds the index of a vertex adjacent to the
  // vertex `i` in the MST, note that the size of the MST is
  // n - 1 so the first vertex won't store the mentioned index
  vector<int> neighbor(n, -1);

  // the first node is the "arbitrary" node for the sake of the implementation
  min_cost[0] = 0;

  // (min weight, vertex)
  set<pair<int, int> > q;
  q.insert({0, 0});

  while (!q.empty()) {
    int v = q.begin()->second;

    // the vertex `v` belongs to the MST and is adjacent
    // to the vertex `neighbor[v]` with and edge
    // of weight `weight`
    total += q.begin()->first;

    q.erase(q.begin());

    visited[v] = true;

    for (int i = 0; i < g[v].size(); i += 1) {
      pair<int, int> &next = g[v][i];

      // note that in the graph the first element is the neighbor vertex
      // but in the set the first element is the edge weight
      int to = next.first;
      int weight = next.second;

      if (!visited[to] && weight < min_cost[to]) {
        q.erase({ min_cost[to], to });
        min_cost[to] = weight;
        neighbor[to] = v;
        q.insert({ min_cost[to], to });
      }
    }
  }
  // check that every vertex has a min cost edge associated
  for (int i = 0; i < n; i += 1) {
    if (min_cost[i] == INF) {
      return -1;
    }
  }
  return total;
}
