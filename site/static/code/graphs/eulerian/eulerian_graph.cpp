// each edge is saved by id, helper to avoid the traversal
// of an edge many times
vector<bool> edge_used;
// the number of edges used in the adjacency list of the vertex `i`
vector<int> edge_pointer;
// the eulerian trail
vector<int> trail;
// the adjacency list representation of `g`, each element `g_{i,j}` is
// a tuple (to, id) which denotes an edge `(i, to)` with id `id`
vector<vector<pair<int, int> > > g;

void dfs(int v) {
  for (; edge_pointer[v] < g[v].size(); edge_pointer[v] += 1) {
    pair<int, int> &edge = g[v][edge_pointer[v]];
    if (edge_used[edge.second]) {
      // if the edge was already used analyze the next one
      continue;
    }
    // mark the edge
    edge_used[edge.second] = true;
    dfs(edge.first);
  }
  trail.push_back(v);
}

/**
 * Computes an euler trail if possible in an undirected graph `G`
 * whose `edges` are given as an input
 *
 * NOTE: The trail if it exists is saved on the global `trail`
 *
 * @param {int} n The order of the graph
 * @param {vector<pair<int, int> >} A collection of tuples
 * denoting the indexes of the vertices the edge `i` is incident to
 * @return {bool} True if the graph has an euler trail
 */
bool euler_trail_undirected(int n, vector<pair<int, int> > &edges) {
  int m = edges.size();
  g.assign(n, vector<pair<int, int> > ());
  edge_pointer.assign(n, 0);
  edge_used.assign(m, 0);
  vector<int> deg(n, 0);

  // build the adjacency list of the graph
  for (int i = 0; i < m; i += 1) {
    int u = edges[i].first;
    int v = edges[i].second;
    g[u].push_back({ v, i });
    g[v].push_back({ u, i });
    deg[u] += 1;
    deg[v] += 1;
  }

  // find an odd vertex
  int start = 0;
  int odd_degree_count = 0;
  for (int i = 0; i < n; i += 1) {
    if (deg[i] % 2 != 0) {
      ++odd_degree_count;
      start = i;
    }
  }

  if (odd_degree_count == 2 || odd_degree_count == 0) {
    dfs(start);
    return trail.size() == m + 1;
  }
  return false;
}


/**
 * Computes an euler trail if possible in an directed graph `G`
 * whose `edges` are given as an input
 *
 * NOTE: The trail if it exists is saved on the global `trail`
 *
 * @param {int} n The order of the graph
 * @param {vector<pair<int, int> >} A collection of tuples
 * denoting the indexes of the vertices the edge `i` is incident to
 * @return {bool} True if the graph has an euler trail
 */
bool euler_trail_directed(int n, vector<pair<int, int> > &edges) {
  int m = edges.size();
  g.assign(n, vector<pair<int, int> > ());
  edge_pointer.assign(n, 0);
  edge_used.assign(m, 0);
  vector<int> in_deg(n, 0), out_deg(n, 0);

  // build the adjacency list of the graph
  for (int i = 0; i < m; i += 1) {
    int u = edges[i].first;
    int v = edges[i].second;
    g[u].push_back({ v, i });
    out_deg[u] += 1;
    in_deg[v] += 1;
  }

  // find an odd vertex
  int start = 0;
  int odd_degree_count = 0;
  for (int i = 0; i < n; i += 1) {
    if (in_deg[i] - out_deg[i] != 0) {
      ++odd_degree_count;
      if (out_deg[i] > in_deg[i]) {
        start = i;
      }
    }
  }

  if (odd_degree_count == 2 || odd_degree_count == 0) {
    dfs(start);
    return trail.size() == m + 1;
  }
  return false;
}
